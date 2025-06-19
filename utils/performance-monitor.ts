// Performance monitoring utilities for Speed Insights integration

export interface PerformanceMetrics {
  fid: number | null // First Input Delay
  lcp: number | null // Largest Contentful Paint
  cls: number | null // Cumulative Layout Shift
  fcp: number | null // First Contentful Paint
  ttfb: number | null // Time to First Byte
}

export interface InteractionMetrics {
  interactionType: string
  startTime: number
  duration: number
  target: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fid: null,
    lcp: null,
    cls: null,
    fcp: null,
    ttfb: null,
  }

  private interactions: InteractionMetrics[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.initializePerformanceObservers()
    }
  }

  private initializePerformanceObservers() {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          this.metrics.lcp = lastEntry.startTime
          this.reportMetric("lcp", lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        console.warn("LCP observer not supported")
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime
            this.reportMetric("fid", entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ["first-input"] })
      } catch (e) {
        console.warn("FID observer not supported")
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              this.metrics.cls = clsValue
              this.reportMetric("cls", clsValue)
            }
          })
        })
        clsObserver.observe({ entryTypes: ["layout-shift"] })
      } catch (e) {
        console.warn("CLS observer not supported")
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.name === "first-contentful-paint") {
              this.metrics.fcp = entry.startTime
              this.reportMetric("fcp", entry.startTime)
            }
          })
        })
        fcpObserver.observe({ entryTypes: ["paint"] })
      } catch (e) {
        console.warn("FCP observer not supported")
      }

      // Navigation Timing for TTFB
      this.measureTTFB()
    }
  }

  private measureTTFB() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0]
        this.metrics.ttfb = entry.responseStart - entry.requestStart
        this.reportMetric("ttfb", this.metrics.ttfb)
      }
    }
  }

  private reportMetric(metricName: string, value: number) {
    // Report to Vercel Analytics
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "performance_metric", {
        metric_name: metricName,
        metric_value: value,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent,
        connection_type: this.getConnectionType(),
        device_type: this.getDeviceType(),
      })
    }

    // Log for debugging
    console.log(`Performance Metric - ${metricName}: ${value}ms`)
  }

  // Track user interactions
  trackInteraction(interactionType: string, target: string, startTime: number) {
    const duration = performance.now() - startTime
    const interaction: InteractionMetrics = {
      interactionType,
      startTime,
      duration,
      target,
    }

    this.interactions.push(interaction)

    // Report interaction timing
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "interaction_timing", {
        interaction_type: interactionType,
        interaction_duration: duration,
        interaction_target: target,
        page_url: window.location.pathname,
      })
    }

    // Clean up old interactions (keep last 100)
    if (this.interactions.length > 100) {
      this.interactions = this.interactions.slice(-100)
    }
  }

  // Get current performance metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Get interaction flow data
  getInteractionFlow(): InteractionMetrics[] {
    return [...this.interactions]
  }

  // Analyze performance bottlenecks
  analyzeBottlenecks(): {
    slowInteractions: InteractionMetrics[]
    performanceGrade: string
    recommendations: string[]
  } {
    const slowInteractions = this.interactions.filter((i) => i.duration > 100)
    const recommendations: string[] = []

    // Analyze metrics and provide recommendations
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push("Optimize Largest Contentful Paint - consider image optimization and lazy loading")
    }

    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push("Reduce First Input Delay - minimize JavaScript execution time")
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push("Improve Cumulative Layout Shift - ensure proper sizing for dynamic content")
    }

    const performanceGrade = this.calculatePerformanceGrade()

    return {
      slowInteractions,
      performanceGrade,
      recommendations,
    }
  }

  private calculatePerformanceGrade(): string {
    let score = 100

    if (this.metrics.lcp) {
      if (this.metrics.lcp > 4000) score -= 30
      else if (this.metrics.lcp > 2500) score -= 15
    }

    if (this.metrics.fid) {
      if (this.metrics.fid > 300) score -= 30
      else if (this.metrics.fid > 100) score -= 15
    }

    if (this.metrics.cls) {
      if (this.metrics.cls > 0.25) score -= 30
      else if (this.metrics.cls > 0.1) score -= 15
    }

    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  private getConnectionType(): string {
    if ("connection" in navigator) {
      return (navigator as any).connection.effectiveType || "unknown"
    }
    return "unknown"
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return "tablet"
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent))
      return "mobile"
    return "desktop"
  }

  // Track page load performance
  trackPageLoad(pageName: string) {
    if ("performance" in window) {
      const loadTime = performance.now()

      // Report page load time
      if (typeof window !== "undefined" && (window as any).va) {
        ;(window as any).va("track", "page_load", {
          page_name: pageName,
          load_time: loadTime,
          performance_grade: this.calculatePerformanceGrade(),
          connection_type: this.getConnectionType(),
          device_type: this.getDeviceType(),
        })
      }
    }
  }

  // Track resource loading
  trackResourceLoading() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]

      resources.forEach((resource) => {
        if (resource.duration > 1000) {
          // Track slow resources
          if (typeof window !== "undefined" && (window as any).va) {
            ;(window as any).va("track", "slow_resource", {
              resource_name: resource.name,
              resource_duration: resource.duration,
              resource_type: this.getResourceType(resource.name),
              page_url: window.location.pathname,
            })
          }
        }
      })
    }
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return "image"
    if (url.match(/\.(js)$/i)) return "script"
    if (url.match(/\.(css)$/i)) return "stylesheet"
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return "font"
    return "other"
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for easy tracking
export const trackInteraction = (type: string, target: string) => {
  const startTime = performance.now()
  return () => performanceMonitor.trackInteraction(type, target, startTime)
}

export const trackPageLoad = (pageName: string) => {
  performanceMonitor.trackPageLoad(pageName)
}

export const getPerformanceReport = () => {
  return {
    metrics: performanceMonitor.getMetrics(),
    interactions: performanceMonitor.getInteractionFlow(),
    analysis: performanceMonitor.analyzeBottlenecks(),
  }
}

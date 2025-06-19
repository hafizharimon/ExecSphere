// Performance Tracker Component for monitoring page performance

"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { performanceMonitor, trackPageLoad } from "@/utils/performance-monitor"

export function PerformanceTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page load performance
    trackPageLoad(pathname)

    // Track resource loading after page load
    const handleLoad = () => {
      performanceMonitor.trackResourceLoading()
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [pathname])

  // Track user interactions
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const targetDescription = target.tagName + (target.className ? `.${target.className}` : "")
      performanceMonitor.trackInteraction("click", targetDescription, performance.now())
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      performanceMonitor.trackInteraction("keydown", event.key, performance.now())
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return null // This component doesn't render anything
}

"use client"

// Custom React hook for analytics tracking

import { useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { vercelAnalytics } from "@/services/vercel-analytics-service"
import { usePathname } from "next/navigation"

export function useAnalytics() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Initialize analytics with user context
  useEffect(() => {
    if (user) {
      vercelAnalytics.initialize({
        userId: user.id,
        userRole: user.role,
        userCompany: user.company,
        isVerified: user.isVerified,
      })
    }
  }, [user])

  // Track page views
  useEffect(() => {
    const startTime = Date.now()

    vercelAnalytics.trackPageView(pathname)

    // Track page load performance
    const handleLoad = () => {
      const loadTime = Date.now() - startTime
      vercelAnalytics.trackPerformance({
        pageType: pathname,
        loadTime,
      })
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [pathname])

  // Track navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      vercelAnalytics.endSession()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  // Tracking functions
  const trackProfileView = useCallback(
    (profileId: string) => {
      vercelAnalytics.trackProfileView({
        profileId,
        viewerRole: user?.role,
        viewerCompany: user?.company,
      })
    },
    [user],
  )

  const trackWallActivity = useCallback(
    (activityType: "like" | "comment" | "share" | "post_create", postId?: string, postType?: string) => {
      vercelAnalytics.trackWallActivity({
        activityType,
        postId,
        postType,
        userRole: user?.role,
      })
    },
    [user],
  )

  const trackEventParticipation = useCallback(
    (eventId: string, eventType: string, participationType: "register" | "attend" | "engage" | "complete") => {
      vercelAnalytics.trackEventParticipation({
        eventId,
        eventType,
        participationType,
        userRole: user?.role,
      })
    },
    [user],
  )

  const trackMentorshipRequest = useCallback(
    (requestId: string, mentorId: string, requestType: "create" | "accept" | "reject" | "complete") => {
      vercelAnalytics.trackMentorshipRequest({
        requestId,
        mentorId,
        requestType,
      })
    },
    [],
  )

  const trackSearch = useCallback(
    (searchType: "mentor" | "event" | "company" | "user", searchQuery: string, resultsCount: number) => {
      vercelAnalytics.trackSearch({
        searchType,
        searchQuery,
        resultsCount,
      })
    },
    [],
  )

  const trackConversion = useCallback(
    (conversionType: "registration" | "mentor_signup" | "event_registration" | "premium_upgrade", value?: number) => {
      vercelAnalytics.trackConversion(conversionType, value)
    },
    [],
  )

  const trackError = useCallback((errorType: string, errorMessage: string, errorContext?: string) => {
    vercelAnalytics.trackError(errorType, errorMessage, errorContext)
  }, [])

  return {
    trackProfileView,
    trackWallActivity,
    trackEventParticipation,
    trackMentorshipRequest,
    trackSearch,
    trackConversion,
    trackError,
    vercelAnalytics,
  }
}

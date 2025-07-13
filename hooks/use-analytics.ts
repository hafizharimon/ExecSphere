"use client"

// Custom hook for analytics tracking

import { useCallback } from "react"
import { vercelAnalytics } from "@/services/vercel-analytics-service"

export function useAnalytics() {
  const trackProfileView = useCallback((profileId: string, viewerRole?: string) => {
    vercelAnalytics.trackProfileView({ profileId, viewerRole })
  }, [])

  const trackWallActivity = useCallback(
    (activityType: "like" | "comment" | "share" | "post_create", postId?: string, postType?: string) => {
      vercelAnalytics.trackWallActivity({ activityType, postId, postType })
    },
    [],
  )

  const trackEventParticipation = useCallback(
    (eventId: string, eventType: string, participationType: "register" | "attend" | "engage" | "complete") => {
      vercelAnalytics.trackEventParticipation({
        eventId,
        eventType,
        participationType,
      })
    },
    [],
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
  }
}

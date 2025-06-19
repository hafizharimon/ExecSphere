// Analytics Provider Component for global analytics context

"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useAnalytics } from "@/hooks/use-analytics"

interface AnalyticsContextType {
  trackProfileView: (profileId: string) => void
  trackWallActivity: (
    activityType: "like" | "comment" | "share" | "post_create",
    postId?: string,
    postType?: string,
  ) => void
  trackEventParticipation: (
    eventId: string,
    eventType: string,
    participationType: "register" | "attend" | "engage" | "complete",
  ) => void
  trackMentorshipRequest: (
    requestId: string,
    mentorId: string,
    requestType: "create" | "accept" | "reject" | "complete",
  ) => void
  trackSearch: (searchType: "mentor" | "event" | "company" | "user", searchQuery: string, resultsCount: number) => void
  trackConversion: (
    conversionType: "registration" | "mentor_signup" | "event_registration" | "premium_upgrade",
    value?: number,
  ) => void
  trackError: (errorType: string, errorMessage: string, errorContext?: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics()

  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalyticsContext must be used within an AnalyticsProvider")
  }
  return context
}

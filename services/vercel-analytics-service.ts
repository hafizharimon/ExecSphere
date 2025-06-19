// Vercel Analytics Service for tracking custom events and user interactions

import { track } from "@vercel/analytics"

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
}

export interface ProfileViewEvent {
  profileId: string
  viewerRole?: string
  viewerCompany?: string
  viewDuration?: number
}

export interface WallActivityEvent {
  activityType: "like" | "comment" | "share" | "post_create"
  postId?: string
  postType?: string
  userRole?: string
  engagementScore?: number
}

export interface EventParticipationEvent {
  eventId: string
  eventType: string
  participationType: "register" | "attend" | "engage" | "complete"
  userRole?: string
  eventCategory?: string
}

export interface MentorshipRequestEvent {
  requestId: string
  mentorId: string
  requestType: "create" | "accept" | "reject" | "complete"
  serviceCategory?: string
  requestValue?: number
  responseTime?: number
}

export interface NavigationEvent {
  fromPage: string
  toPage: string
  userRole?: string
  sessionDuration?: number
}

export interface SearchEvent {
  searchType: "mentor" | "event" | "company" | "user"
  searchQuery: string
  resultsCount: number
  filterUsed?: string[]
}

export interface PerformanceEvent {
  pageType: string
  loadTime: number
  interactionDelay?: number
  errorCount?: number
}

class VercelAnalyticsService {
  private sessionStartTime: number = Date.now()
  private currentPage = ""
  private userContext: {
    userId?: string
    userRole?: string
    userCompany?: string
    isVerified?: boolean
  } = {}

  // Initialize analytics with user context
  initialize(userContext: {
    userId?: string
    userRole?: string
    userCompany?: string
    isVerified?: boolean
  }) {
    this.userContext = userContext
    this.sessionStartTime = Date.now()

    // Track session start
    this.trackEvent("session_start", {
      user_role: userContext.userRole || "anonymous",
      user_company: userContext.userCompany || "unknown",
      is_verified: userContext.isVerified || false,
      timestamp: new Date().toISOString(),
    })
  }

  // Generic event tracking
  trackEvent(eventName: string, properties?: Record<string, string | number | boolean>) {
    const enrichedProperties = {
      ...properties,
      user_id: this.userContext.userId,
      user_role: this.userContext.userRole,
      user_company: this.userContext.userCompany,
      session_duration: Date.now() - this.sessionStartTime,
      current_page: this.currentPage,
      timestamp: new Date().toISOString(),
    }

    // Remove undefined values
    Object.keys(enrichedProperties).forEach((key) => {
      if (enrichedProperties[key] === undefined) {
        delete enrichedProperties[key]
      }
    })

    track(eventName, enrichedProperties)
  }

  // Profile Views Tracking
  trackProfileView(event: ProfileViewEvent) {
    this.trackEvent("profile_view", {
      profile_id: event.profileId,
      viewer_role: event.viewerRole || this.userContext.userRole,
      viewer_company: event.viewerCompany || this.userContext.userCompany,
      view_duration: event.viewDuration || 0,
      profile_type: "executive",
    })
  }

  trackProfileEdit(profileId: string, fieldsEdited: string[]) {
    this.trackEvent("profile_edit", {
      profile_id: profileId,
      fields_edited: fieldsEdited.join(","),
      edit_count: fieldsEdited.length,
    })
  }

  trackLinkedInSync(profileId: string, experienceCount: number, success: boolean) {
    this.trackEvent("linkedin_sync", {
      profile_id: profileId,
      experience_count: experienceCount,
      sync_success: success,
      sync_type: "experience_import",
    })
  }

  // Wall Activity Tracking
  trackWallActivity(event: WallActivityEvent) {
    this.trackEvent("wall_activity", {
      activity_type: event.activityType,
      post_id: event.postId || "unknown",
      post_type: event.postType || "general",
      user_role: event.userRole || this.userContext.userRole,
      engagement_score: event.engagementScore || 1,
    })
  }

  trackPostCreation(postId: string, postType: string, targetAudience: string[], aiEnabled: boolean) {
    this.trackEvent("post_create", {
      post_id: postId,
      post_type: postType,
      target_audience: targetAudience.join(","),
      ai_enabled: aiEnabled,
      audience_count: targetAudience.length,
    })
  }

  trackPostEngagement(postId: string, engagementType: "view" | "like" | "comment" | "share", value = 1) {
    this.trackEvent("post_engagement", {
      post_id: postId,
      engagement_type: engagementType,
      engagement_value: value,
      post_visibility: "public",
    })
  }

  // Event Participation Tracking
  trackEventParticipation(event: EventParticipationEvent) {
    this.trackEvent("event_participation", {
      event_id: event.eventId,
      event_type: event.eventType,
      participation_type: event.participationType,
      user_role: event.userRole || this.userContext.userRole,
      event_category: event.eventCategory || "general",
    })
  }

  trackEventRegistration(eventId: string, eventType: string, registrationFee?: number) {
    this.trackEvent("event_registration", {
      event_id: eventId,
      event_type: eventType,
      registration_fee: registrationFee || 0,
      registration_method: "platform",
    })
  }

  trackEventAttendance(eventId: string, attendanceDuration: number, engagementLevel: "low" | "medium" | "high") {
    this.trackEvent("event_attendance", {
      event_id: eventId,
      attendance_duration: attendanceDuration,
      engagement_level: engagementLevel,
      completion_rate: attendanceDuration > 0 ? 100 : 0,
    })
  }

  // Mentorship Request Tracking
  trackMentorshipRequest(event: MentorshipRequestEvent) {
    this.trackEvent("mentorship_request", {
      request_id: event.requestId,
      mentor_id: event.mentorId,
      request_type: event.requestType,
      service_category: event.serviceCategory || "general",
      request_value: event.requestValue || 0,
      response_time: event.responseTime || 0,
    })
  }

  trackMentorshipMatching(companyId: string, matchedMentors: number, matchingScore: number) {
    this.trackEvent("mentorship_matching", {
      company_id: companyId,
      matched_mentors: matchedMentors,
      matching_score: matchingScore,
      matching_algorithm: "tag_based",
    })
  }

  trackMentorshipSession(sessionId: string, duration: number, rating?: number) {
    this.trackEvent("mentorship_session", {
      session_id: sessionId,
      session_duration: duration,
      session_rating: rating || 0,
      session_type: "virtual",
    })
  }

  // Navigation and User Flow Tracking
  trackNavigation(event: NavigationEvent) {
    this.trackEvent("navigation", {
      from_page: event.fromPage,
      to_page: event.toPage,
      user_role: event.userRole || this.userContext.userRole,
      session_duration: event.sessionDuration || Date.now() - this.sessionStartTime,
    })

    this.currentPage = event.toPage
  }

  trackPageView(pageName: string, pageCategory?: string) {
    this.trackEvent("page_view", {
      page_name: pageName,
      page_category: pageCategory || "general",
      referrer: typeof window !== "undefined" ? document.referrer : "unknown",
    })

    this.currentPage = pageName
  }

  // Search and Discovery Tracking
  trackSearch(event: SearchEvent) {
    this.trackEvent("search", {
      search_type: event.searchType,
      search_query: event.searchQuery,
      results_count: event.resultsCount,
      filters_used: event.filterUsed?.join(",") || "none",
      search_success: event.resultsCount > 0,
    })
  }

  trackFilterUsage(filterType: string, filterValues: string[], resultCount: number) {
    this.trackEvent("filter_usage", {
      filter_type: filterType,
      filter_values: filterValues.join(","),
      result_count: resultCount,
      filter_effectiveness: resultCount > 0 ? "effective" : "ineffective",
    })
  }

  // Performance and Error Tracking
  trackPerformance(event: PerformanceEvent) {
    this.trackEvent("performance", {
      page_type: event.pageType,
      load_time: event.loadTime,
      interaction_delay: event.interactionDelay || 0,
      error_count: event.errorCount || 0,
      performance_grade: this.getPerformanceGrade(event.loadTime),
    })
  }

  trackError(errorType: string, errorMessage: string, errorContext?: string) {
    this.trackEvent("error", {
      error_type: errorType,
      error_message: errorMessage,
      error_context: errorContext || "unknown",
      error_timestamp: new Date().toISOString(),
    })
  }

  // Business Metrics Tracking
  trackConversion(
    conversionType: "registration" | "mentor_signup" | "event_registration" | "premium_upgrade",
    value?: number,
  ) {
    this.trackEvent("conversion", {
      conversion_type: conversionType,
      conversion_value: value || 0,
      conversion_funnel: this.getCurrentFunnelStage(),
      user_segment: this.getUserSegment(),
    })
  }

  trackRevenue(revenueType: "mentorship" | "event" | "premium" | "advertising", amount: number, currency = "INR") {
    this.trackEvent("revenue", {
      revenue_type: revenueType,
      revenue_amount: amount,
      revenue_currency: currency,
      revenue_source: "platform",
    })
  }

  // Badge and Achievement Tracking
  trackBadgeEarned(badgeId: string, badgeName: string, pointsEarned: number) {
    this.trackEvent("badge_earned", {
      badge_id: badgeId,
      badge_name: badgeName,
      points_earned: pointsEarned,
      total_badges: this.getTotalBadges(),
    })
  }

  trackAchievement(achievementType: string, achievementValue: number) {
    this.trackEvent("achievement", {
      achievement_type: achievementType,
      achievement_value: achievementValue,
      achievement_date: new Date().toISOString(),
    })
  }

  // Admin and Moderation Tracking
  trackAdminAction(actionType: string, targetId: string, actionResult: "approved" | "rejected" | "pending") {
    this.trackEvent("admin_action", {
      action_type: actionType,
      target_id: targetId,
      action_result: actionResult,
      admin_id: this.userContext.userId || "system",
    })
  }

  trackContentModeration(contentId: string, moderationType: "auto" | "manual", moderationResult: string) {
    this.trackEvent("content_moderation", {
      content_id: contentId,
      moderation_type: moderationType,
      moderation_result: moderationResult,
      moderation_timestamp: new Date().toISOString(),
    })
  }

  // Utility Methods
  private getPerformanceGrade(loadTime: number): string {
    if (loadTime < 1000) return "excellent"
    if (loadTime < 2000) return "good"
    if (loadTime < 3000) return "fair"
    return "poor"
  }

  private getCurrentFunnelStage(): string {
    // Determine current funnel stage based on current page
    if (this.currentPage.includes("register")) return "registration"
    if (this.currentPage.includes("profile")) return "profile_setup"
    if (this.currentPage.includes("mentor")) return "mentorship"
    if (this.currentPage.includes("event")) return "events"
    return "discovery"
  }

  private getUserSegment(): string {
    const role = this.userContext.userRole
    const isVerified = this.userContext.isVerified

    if (role === "ceo" && isVerified) return "verified_ceo"
    if (role === "cto" && isVerified) return "verified_cto"
    if (role && isVerified) return `verified_${role}`
    if (role) return `unverified_${role}`
    return "anonymous"
  }

  private getTotalBadges(): number {
    // This would typically fetch from user profile
    return 0
  }

  // Session Management
  updateSessionContext(updates: Partial<typeof this.userContext>) {
    this.userContext = { ...this.userContext, ...updates }
  }

  endSession() {
    const sessionDuration = Date.now() - this.sessionStartTime
    this.trackEvent("session_end", {
      session_duration: sessionDuration,
      pages_visited: this.currentPage ? 1 : 0,
      session_quality: sessionDuration > 300000 ? "high" : sessionDuration > 60000 ? "medium" : "low",
    })
  }
}

// Create singleton instance
export const vercelAnalytics = new VercelAnalyticsService()

// Convenience functions for common tracking scenarios
export const trackProfileView = (profileId: string, viewerRole?: string) => {
  vercelAnalytics.trackProfileView({ profileId, viewerRole })
}

export const trackWallLike = (postId: string, postType?: string) => {
  vercelAnalytics.trackWallActivity({ activityType: "like", postId, postType })
}

export const trackEventRegistration = (eventId: string, eventType: string) => {
  vercelAnalytics.trackEventParticipation({
    eventId,
    eventType,
    participationType: "register",
  })
}

export const trackMentorshipCreate = (requestId: string, mentorId: string) => {
  vercelAnalytics.trackMentorshipRequest({
    requestId,
    mentorId,
    requestType: "create",
  })
}

export const trackPageLoad = (pageName: string, loadTime: number) => {
  vercelAnalytics.trackPageView(pageName)
  vercelAnalytics.trackPerformance({ pageType: pageName, loadTime })
}

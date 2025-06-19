// Profile Service for managing C-level profiles with LinkedIn integration and badges

export interface CXOProfile {
  id?: string
  userId: string
  headline?: string
  country?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  linkedinUrl?: string
  twitterUrl?: string
  githubUrl?: string
  currentPosition?: ExecutiveExperience
  totalExperienceYears?: number
  badges?: ProfileBadge[]
  analytics?: ProfileAnalytics
  ratings?: UserRating[]
  averageRating?: number
  totalRatings?: number
  badgePoints?: number
  profileCompleteness?: number
  lastLinkedInSync?: string
  isPublic?: boolean
  showContactInfo?: boolean
}

export interface ExecutiveExperience {
  id?: string
  userId: string
  companyName: string
  positionTitle: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
  location?: string
  companyLinkedInId?: string
  linkedInExperienceId?: string
  isLinkedInImported: boolean
  isPublic: boolean
  isExecutiveRole: boolean
}

export interface ProfileBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  pointsValue: number
  earnedAt: string
  evidence?: any
  isVisible: boolean
}

export interface ProfileAnalytics {
  userId: string
  totalProfileViews: number
  totalNetworkViews: number
  totalEventViews: number
  totalWallPostViews: number
  totalWallPostLikes: number
  totalWallPostComments: number
  totalConnections: number
  totalEventsAttended: number
  totalForumPosts: number
  dailyStats: DailyProfileStats[]
  engagementRate: number
  networkGrowthRate: number
}

export interface DailyProfileStats {
  date: string
  profileViews: number
  networkViews: number
  eventViews: number
  wallPostViews: number
  wallPostLikes: number
  wallPostComments: number
  connectionsGained: number
}

export interface UserRating {
  id: string
  ratedUserId: string
  raterUserId: string
  raterName?: string
  rating: number
  category: string
  comment?: string
  isAnonymous: boolean
  createdAt: string
}

export interface LinkedInExperienceData {
  id: string
  title: string
  companyName: string
  companyId?: string
  startDate: { month: number; year: number }
  endDate?: { month: number; year: number }
  isCurrent: boolean
  description?: string
  location?: string
}

class ProfileService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  async getCXOProfile(userId: string): Promise<{ success: boolean; data?: CXOProfile; error?: string }> {
    try {
      // Track profile view
      await this.trackProfileView(userId)

      const profile = await this.fetchCXOProfile(userId)

      if (profile.success && profile.data) {
        // Calculate profile completeness
        profile.data.profileCompleteness = this.calculateProfileCompleteness(profile.data)

        // Get user badges
        const badges = await this.getUserBadges(userId)
        profile.data.badges = badges.data || []

        // Get analytics
        const analytics = await this.getProfileAnalytics(userId)
        profile.data.analytics = analytics.data

        // Get ratings
        const ratings = await this.getUserRatings(userId)
        profile.data.ratings = ratings.data || []
        profile.data.averageRating = this.calculateAverageRating(ratings.data || [])
        profile.data.totalRatings = ratings.data?.length || 0
      }

      return profile
    } catch (error) {
      console.error("Get CXO profile error:", error)
      return {
        success: false,
        error: "Failed to fetch profile",
      }
    }
  }

  async updateCXOProfile(
    userId: string,
    updates: Partial<CXOProfile>,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Validate editable fields only
      const editableFields = [
        "headline",
        "country",
        "contactEmail",
        "contactPhone",
        "website",
        "linkedinUrl",
        "twitterUrl",
        "githubUrl",
        "isPublic",
        "showContactInfo",
      ]
      const filteredUpdates = Object.keys(updates)
        .filter((key) => editableFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key]
          return obj
        }, {} as any)

      const result = await this.updateProfileData(userId, filteredUpdates)

      if (result.success) {
        // Recalculate badges if relevant data changed
        await this.recalculateBadges(userId)
      }

      return result
    } catch (error) {
      console.error("Update CXO profile error:", error)
      return {
        success: false,
        error: "Failed to update profile",
      }
    }
  }

  async importLinkedInExperience(
    userId: string,
    accessToken: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Fetch LinkedIn experience data
      const linkedInData = await this.fetchLinkedInExperience(accessToken)

      if (!linkedInData.success) {
        return linkedInData
      }

      // Process and save experience data
      const experiences = linkedInData.data.map((exp: LinkedInExperienceData) => ({
        userId,
        companyName: exp.companyName,
        positionTitle: exp.title,
        startDate: `${exp.startDate.year}-${exp.startDate.month.toString().padStart(2, "0")}-01`,
        endDate: exp.endDate ? `${exp.endDate.year}-${exp.endDate.month.toString().padStart(2, "0")}-01` : null,
        isCurrent: exp.isCurrent,
        description: exp.description,
        location: exp.location,
        companyLinkedInId: exp.companyId,
        linkedInExperienceId: exp.id,
        isLinkedInImported: true,
        isPublic: true,
        isExecutiveRole: this.isExecutiveRole(exp.title),
      }))

      // Save experiences
      const result = await this.saveExperiences(userId, experiences)

      if (result.success) {
        // Update last sync time
        await this.updateLinkedInSyncTime(userId)

        // Recalculate badges based on new experience
        await this.recalculateBadges(userId)
      }

      return result
    } catch (error) {
      console.error("LinkedIn import error:", error)
      return {
        success: false,
        error: "Failed to import LinkedIn experience",
      }
    }
  }

  async addCustomExperience(
    userId: string,
    experience: Partial<ExecutiveExperience>,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const newExperience = {
        ...experience,
        userId,
        isLinkedInImported: false,
        isPublic: true,
        isExecutiveRole: this.isExecutiveRole(experience.positionTitle || ""),
      }

      const result = await this.saveExperience(newExperience)

      if (result.success) {
        await this.recalculateBadges(userId)
      }

      return result
    } catch (error) {
      console.error("Add custom experience error:", error)
      return {
        success: false,
        error: "Failed to add experience",
      }
    }
  }

  async updateExperience(
    experienceId: string,
    updates: Partial<ExecutiveExperience>,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = await this.updateExperienceData(experienceId, updates)

      if (result.success) {
        // Get user ID from experience and recalculate badges
        const experience = await this.getExperience(experienceId)
        if (experience.success && experience.data) {
          await this.recalculateBadges(experience.data.userId)
        }
      }

      return result
    } catch (error) {
      console.error("Update experience error:", error)
      return {
        success: false,
        error: "Failed to update experience",
      }
    }
  }

  async getUserBadges(userId: string): Promise<{ success: boolean; data?: ProfileBadge[]; error?: string }> {
    try {
      const badges = await this.fetchUserBadges(userId)
      return badges
    } catch (error) {
      console.error("Get user badges error:", error)
      return {
        success: false,
        error: "Failed to fetch badges",
      }
    }
  }

  async recalculateBadges(userId: string): Promise<void> {
    try {
      // Get user data for badge calculation
      const profile = await this.fetchCXOProfile(userId)
      const experiences = await this.getUserExperiences(userId)
      const analytics = await this.getProfileAnalytics(userId)
      const ratings = await this.getUserRatings(userId)

      if (!profile.success || !experiences.success) return

      // Calculate badges based on criteria
      const availableBadges = await this.getAvailableBadges()
      const earnedBadges: string[] = []

      for (const badge of availableBadges.data || []) {
        const earned = await this.checkBadgeCriteria(
          badge,
          profile.data,
          experiences.data,
          analytics.data,
          ratings.data,
        )

        if (earned) {
          earnedBadges.push(badge.id)
          await this.awardBadge(userId, badge.id, earned.evidence)
        }
      }

      // Update user's total badge points
      await this.updateBadgePoints(userId)
    } catch (error) {
      console.error("Recalculate badges error:", error)
    }
  }

  async getProfileAnalytics(
    userId: string,
    days = 30,
  ): Promise<{ success: boolean; data?: ProfileAnalytics; error?: string }> {
    try {
      const analytics = await this.fetchProfileAnalytics(userId, days)
      return {
        success: true,
        data: analytics,
      }
    } catch (error) {
      console.error("Get profile analytics error:", error)
      return {
        success: false,
        error: "Failed to fetch analytics",
      }
    }
  }

  async trackProfileView(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0]
      await this.incrementAnalyticMetric(userId, today, "profile_views", 1)
    } catch (error) {
      console.error("Track profile view error:", error)
    }
  }

  async trackNetworkView(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0]
      await this.incrementAnalyticMetric(userId, today, "network_views", 1)
    } catch (error) {
      console.error("Track network view error:", error)
    }
  }

  async trackEventView(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0]
      await this.incrementAnalyticMetric(userId, today, "event_views", 1)
    } catch (error) {
      console.error("Track event view error:", error)
    }
  }

  async trackWallPostImpact(userId: string, type: "view" | "like" | "comment" | "share"): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0]
      const metricName = `wall_post_${type}s`
      await this.incrementAnalyticMetric(userId, today, metricName, 1)
    } catch (error) {
      console.error("Track wall post impact error:", error)
    }
  }

  async rateUser(
    ratedUserId: string,
    raterUserId: string,
    rating: number,
    category: string,
    comment?: string,
    isAnonymous = false,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const ratingData = {
        ratedUserId,
        raterUserId,
        rating,
        category,
        comment,
        isAnonymous,
      }

      const result = await this.saveUserRating(ratingData)

      if (result.success) {
        // Recalculate badges for rated user
        await this.recalculateBadges(ratedUserId)
      }

      return result
    } catch (error) {
      console.error("Rate user error:", error)
      return {
        success: false,
        error: "Failed to submit rating",
      }
    }
  }

  // Private helper methods
  private calculateProfileCompleteness(profile: CXOProfile): number {
    const fields = ["headline", "country", "contactEmail", "website", "linkedinUrl", "currentPosition"]

    let completedFields = 0
    fields.forEach((field) => {
      if (profile[field as keyof CXOProfile]) completedFields++
    })

    return Math.round((completedFields / fields.length) * 100)
  }

  private calculateAverageRating(ratings: UserRating[]): number {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
    return Math.round((sum / ratings.length) * 10) / 10
  }

  private isExecutiveRole(title: string): boolean {
    const executiveTitles = [
      "CEO",
      "CTO",
      "CFO",
      "COO",
      "CMO",
      "CHRO",
      "CPO",
      "CIO",
      "CSO",
      "CDO",
      "CRO",
      "Chief Executive Officer",
      "Chief Technology Officer",
      "Chief Financial Officer",
      "Chief Operating Officer",
      "Chief Marketing Officer",
      "Chief Human Resources Officer",
      "Chief Product Officer",
      "Chief Information Officer",
      "Chief Strategy Officer",
      "Chief Data Officer",
      "Chief Revenue Officer",
      "Managing Director",
      "MD",
      "Executive Director",
      "President",
      "Vice President",
      "VP",
    ]

    return executiveTitles.some((execTitle) => title.toLowerCase().includes(execTitle.toLowerCase()))
  }

  private async checkBadgeCriteria(
    badge: any,
    profile: any,
    experiences: any[],
    analytics: any,
    ratings: any[],
  ): Promise<{ earned: boolean; evidence?: any } | null> {
    const criteria = badge.criteria

    switch (badge.category) {
      case "experience":
        return this.checkExperienceBadge(criteria, experiences)
      case "community":
        return this.checkCommunityBadge(criteria, analytics, profile)
      case "leadership":
        return this.checkLeadershipBadge(criteria, ratings, analytics)
      default:
        return null
    }
  }

  private checkExperienceBadge(criteria: any, experiences: any[]): { earned: boolean; evidence?: any } | null {
    const executiveExperiences = experiences.filter((exp) => exp.isExecutiveRole)

    if (executiveExperiences.length === 0) return { earned: false }

    // Calculate total years in executive positions
    let totalYears = 0
    executiveExperiences.forEach((exp) => {
      const startDate = new Date(exp.startDate)
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date()
      const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      totalYears += years
    })

    const meetsMinYears = criteria.min_years_in_position ? totalYears >= criteria.min_years_in_position : true
    const meetsMaxYears = criteria.max_years_in_position ? totalYears <= criteria.max_years_in_position : true

    return {
      earned: meetsMinYears && meetsMaxYears,
      evidence: { totalYears, executiveExperiences: executiveExperiences.length },
    }
  }

  private checkCommunityBadge(criteria: any, analytics: any, profile: any): { earned: boolean; evidence?: any } | null {
    const evidence: any = {}
    let earned = true

    if (criteria.min_forum_posts && analytics.totalForumPosts < criteria.min_forum_posts) {
      earned = false
    } else {
      evidence.forumPosts = analytics.totalForumPosts
    }

    if (criteria.min_events_attended && analytics.totalEventsAttended < criteria.min_events_attended) {
      earned = false
    } else {
      evidence.eventsAttended = analytics.totalEventsAttended
    }

    if (criteria.min_connections && analytics.totalConnections < criteria.min_connections) {
      earned = false
    } else {
      evidence.connections = analytics.totalConnections
    }

    return { earned, evidence }
  }

  private checkLeadershipBadge(
    criteria: any,
    ratings: any[],
    analytics: any,
  ): { earned: boolean; evidence?: any } | null {
    const evidence: any = {}
    let earned = true

    if (criteria.min_average_rating) {
      const avgRating = this.calculateAverageRating(ratings)
      if (avgRating < criteria.min_average_rating) {
        earned = false
      } else {
        evidence.averageRating = avgRating
      }
    }

    if (criteria.min_total_ratings && ratings.length < criteria.min_total_ratings) {
      earned = false
    } else {
      evidence.totalRatings = ratings.length
    }

    return { earned, evidence }
  }

  // Mock API methods (in real app, these would make actual API calls)
  private async fetchCXOProfile(userId: string): Promise<{ success: boolean; data?: CXOProfile; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock profile data
    const mockProfile: CXOProfile = {
      id: userId,
      userId,
      headline: "Strategic Technology Leader & Digital Transformation Expert",
      country: "India",
      contactEmail: "rajesh@techcorp.com",
      website: "https://rajeshkumar.tech",
      linkedinUrl: "https://linkedin.com/in/rajesh-kumar",
      twitterUrl: "https://twitter.com/rajeshkumar",
      currentPosition: {
        id: "exp-1",
        userId,
        companyName: "TechCorp Solutions",
        positionTitle: "Chief Executive Officer",
        startDate: "2022-01-01",
        isCurrent: true,
        isLinkedInImported: true,
        isPublic: true,
        isExecutiveRole: true,
      },
      totalExperienceYears: 15,
      badgePoints: 425,
      lastLinkedInSync: "2024-01-15T10:30:00Z",
      isPublic: true,
      showContactInfo: true,
    }

    return {
      success: true,
      data: mockProfile,
    }
  }

  private async updateProfileData(
    userId: string,
    updates: any,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { userId, ...updates, updatedAt: new Date().toISOString() },
    }
  }

  private async fetchLinkedInExperience(
    accessToken: string,
  ): Promise<{ success: boolean; data?: LinkedInExperienceData[]; error?: string }> {
    // Mock LinkedIn API response
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockExperience: LinkedInExperienceData[] = [
      {
        id: "linkedin-exp-1",
        title: "Chief Executive Officer",
        companyName: "TechCorp Solutions",
        companyId: "techcorp-solutions",
        startDate: { month: 1, year: 2022 },
        isCurrent: true,
        description: "Leading digital transformation initiatives and strategic growth",
        location: "Bangalore, India",
      },
      {
        id: "linkedin-exp-2",
        title: "Chief Technology Officer",
        companyName: "InnovateTech",
        startDate: { month: 6, year: 2020 },
        endDate: { month: 12, year: 2021 },
        isCurrent: false,
        description: "Led technology strategy and product development",
        location: "Mumbai, India",
      },
    ]

    return {
      success: true,
      data: mockExperience,
    }
  }

  private async saveExperiences(
    userId: string,
    experiences: any[],
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: experiences,
    }
  }

  private async saveExperience(experience: any): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { ...experience, id: this.generateId() },
    }
  }

  private async updateExperienceData(
    experienceId: string,
    updates: any,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { id: experienceId, ...updates },
    }
  }

  private async getExperience(experienceId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return {
      success: true,
      data: { id: experienceId, userId: "user-123" },
    }
  }

  private async getUserExperiences(userId: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    return {
      success: true,
      data: [],
    }
  }

  private async fetchUserBadges(userId: string): Promise<{ success: boolean; data?: ProfileBadge[]; error?: string }> {
    // Mock badges data
    const mockBadges: ProfileBadge[] = [
      {
        id: "badge-1",
        name: "Executive Veteran",
        description: "Served as C-level executive for 5+ years",
        icon: "crown",
        color: "#FFD700",
        category: "experience",
        pointsValue: 100,
        earnedAt: "2024-01-15T10:30:00Z",
        isVisible: true,
      },
      {
        id: "badge-2",
        name: "Community Champion",
        description: "High platform engagement and contributions",
        icon: "users",
        color: "#10B981",
        category: "community",
        pointsValue: 75,
        earnedAt: "2024-01-10T15:20:00Z",
        isVisible: true,
      },
    ]

    return {
      success: true,
      data: mockBadges,
    }
  }

  private async fetchProfileAnalytics(userId: string, days: number): Promise<ProfileAnalytics> {
    // Mock analytics data
    return {
      userId,
      totalProfileViews: 1247,
      totalNetworkViews: 892,
      totalEventViews: 456,
      totalWallPostViews: 2134,
      totalWallPostLikes: 234,
      totalWallPostComments: 89,
      totalConnections: 156,
      totalEventsAttended: 12,
      totalForumPosts: 23,
      dailyStats: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        profileViews: Math.floor(Math.random() * 50) + 10,
        networkViews: Math.floor(Math.random() * 30) + 5,
        eventViews: Math.floor(Math.random() * 20) + 2,
        wallPostViews: Math.floor(Math.random() * 100) + 20,
        wallPostLikes: Math.floor(Math.random() * 20) + 2,
        wallPostComments: Math.floor(Math.random() * 10) + 1,
        connectionsGained: Math.floor(Math.random() * 5),
      })),
      engagementRate: 7.8,
      networkGrowthRate: 12.5,
    }
  }

  private async getUserRatings(userId: string): Promise<{ success: boolean; data?: UserRating[]; error?: string }> {
    // Mock ratings data
    const mockRatings: UserRating[] = [
      {
        id: "rating-1",
        ratedUserId: userId,
        raterUserId: "rater-1",
        raterName: "Sarah Chen",
        rating: 5,
        category: "leadership",
        comment: "Exceptional strategic vision and team leadership",
        isAnonymous: false,
        createdAt: "2024-01-10T10:30:00Z",
      },
      {
        id: "rating-2",
        ratedUserId: userId,
        raterUserId: "rater-2",
        rating: 4,
        category: "expertise",
        comment: "Deep technical knowledge and industry insights",
        isAnonymous: true,
        createdAt: "2024-01-08T14:20:00Z",
      },
    ]

    return {
      success: true,
      data: mockRatings,
    }
  }

  private async getAvailableBadges(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    // Mock available badges
    return {
      success: true,
      data: [
        {
          id: "badge-1",
          name: "Executive Veteran",
          category: "experience",
          criteria: { min_years_in_position: 5 },
        },
        {
          id: "badge-2",
          name: "Community Champion",
          category: "community",
          criteria: { min_forum_posts: 20, min_events_attended: 5 },
        },
      ],
    }
  }

  private async awardBadge(userId: string, badgeId: string, evidence: any): Promise<void> {
    console.log(`Badge ${badgeId} awarded to user ${userId}`, evidence)
  }

  private async updateBadgePoints(userId: string): Promise<void> {
    console.log(`Badge points updated for user ${userId}`)
  }

  private async updateLinkedInSyncTime(userId: string): Promise<void> {
    console.log(`LinkedIn sync time updated for user ${userId}`)
  }

  private async incrementAnalyticMetric(userId: string, date: string, metric: string, value: number): Promise<void> {
    console.log(`Analytics updated: ${userId} - ${date} - ${metric} - ${value}`)
  }

  private async saveUserRating(ratingData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { ...ratingData, id: this.generateId() },
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const profileService = new ProfileService()

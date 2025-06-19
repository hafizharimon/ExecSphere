// Mentor Service for managing mentor profiles and mentorship operations

export interface MentorProfile {
  id?: string
  userId: string
  title: string
  bio?: string
  expertiseSummary?: string
  yearsExperience?: number
  hourlyRate?: number
  currency?: string
  availabilityStatus?: "available" | "busy" | "unavailable"
  maxMentees?: number
  currentMenteesCount?: number
  totalMenteesCount?: number
  successRate?: number
  impactScore?: number
  rating?: number
  totalReviews?: number
  profileImageUrl?: string
  coverImageUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  isVerified?: boolean
  isFeatured?: boolean
  isActive?: boolean
  serviceTags?: MentorServiceTag[]
  articles?: MentorArticle[]
  achievements?: MentorAchievement[]
  partnerships?: MentorPartnership[]
  availability?: MentorAvailability[]
  analytics?: MentorAnalytics
}

export interface MentorServiceTag {
  id: string
  name: string
  category: string
  description?: string
  color?: string
  icon?: string
  proficiencyLevel?: number
  yearsExperience?: number
}

export interface MentorArticle {
  id?: string
  mentorId: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImageUrl?: string
  status: "draft" | "published" | "archived"
  viewCount?: number
  likeCount?: number
  commentCount?: number
  readingTime?: number
  tags?: string[]
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface MentorshipRequest {
  id?: string
  companyId: string
  mentorId: string
  requestedBy: string
  requestType: "consultation" | "ongoing_mentorship" | "project_based"
  serviceTags: string[]
  projectDescription: string
  expectedDuration?: string
  budgetRange?: string
  urgencyLevel?: "low" | "medium" | "high" | "urgent"
  preferredCommunication?: string
  status?: "pending" | "accepted" | "rejected" | "in_progress" | "completed" | "cancelled"
  mentorResponse?: string
  adminNotes?: string
  matchedScore?: number
  createdAt?: string
  updatedAt?: string
  respondedAt?: string
  startedAt?: string
  completedAt?: string
}

export interface MentorAchievement {
  id?: string
  mentorId: string
  achievementType: "milestone" | "award" | "certification" | "success_story"
  title: string
  description?: string
  achievementDate?: string
  verificationStatus?: "pending" | "verified" | "rejected"
  verificationDocumentUrl?: string
  impactScoreContribution?: number
  isFeatured?: boolean
}

export interface MentorPartnership {
  id?: string
  mentorId: string
  companyId: string
  partnershipType: "advisor" | "consultant" | "board_member" | "investor"
  startDate: string
  endDate?: string
  isCurrent?: boolean
  isPublic?: boolean
  roleDescription?: string
  achievements?: string[]
}

export interface MentorAvailability {
  id?: string
  mentorId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  timezone: string
  isActive?: boolean
}

export interface MentorAnalytics {
  mentorId: string
  totalProfileViews: number
  totalArticleViews: number
  totalServiceRequests: number
  totalSessionsCompleted: number
  totalRevenueGenerated: number
  totalNewMentees: number
  impactScoreChange: number
  dailyStats: DailyAnalytics[]
  topServiceTags: { tag: string; requests: number }[]
  successMetrics: {
    completionRate: number
    averageRating: number
    responseTime: number
    clientRetention: number
  }
}

export interface DailyAnalytics {
  date: string
  profileViews: number
  articleViews: number
  serviceRequests: number
  sessionsCompleted: number
  revenueGenerated: number
}

export interface MentorFilters {
  serviceTags?: string[]
  minRating?: number
  maxHourlyRate?: number
  availabilityStatus?: string
  yearsExperience?: number
  impactScore?: number
  location?: string
  language?: string
  industry?: string
}

class MentorService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  async createMentorProfile(profileData: MentorProfile): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Calculate initial impact score
      const impactScore = this.calculateImpactScore(profileData)

      const profile = {
        ...profileData,
        impactScore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = await this.saveMentorProfile(profile)

      if (result.success) {
        // Initialize analytics
        await this.initializeMentorAnalytics(result.data.id)

        // Create default availability
        await this.createDefaultAvailability(result.data.id)
      }

      return result
    } catch (error) {
      console.error("Mentor profile creation error:", error)
      return {
        success: false,
        error: "Failed to create mentor profile",
      }
    }
  }

  async updateMentorProfile(
    mentorId: string,
    updates: Partial<MentorProfile>,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Check permissions
      const hasPermission = await this.checkMentorPermission(mentorId)
      if (!hasPermission) {
        return {
          success: false,
          error: "You do not have permission to update this profile",
        }
      }

      const updatedProfile = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // Recalculate impact score if relevant data changed
      if (updates.achievements || updates.totalMenteesCount || updates.successRate) {
        updatedProfile.impactScore = await this.recalculateImpactScore(mentorId, updates)
      }

      const result = await this.updateMentorProfileData(mentorId, updatedProfile)
      return result
    } catch (error) {
      console.error("Mentor profile update error:", error)
      return {
        success: false,
        error: "Failed to update mentor profile",
      }
    }
  }

  async getMentorProfile(mentorId: string): Promise<{ success: boolean; data?: MentorProfile; error?: string }> {
    try {
      // Track profile view
      await this.trackMentorAnalytics(mentorId, "profile_view")

      const result = await this.fetchMentorProfile(mentorId)
      return result
    } catch (error) {
      console.error("Get mentor profile error:", error)
      return {
        success: false,
        error: "Failed to fetch mentor profile",
      }
    }
  }

  async getMentorBoard(
    filters?: MentorFilters,
    page = 1,
    limit = 12,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = await this.fetchMentorBoard(filters, page, limit)
      return result
    } catch (error) {
      console.error("Get mentor board error:", error)
      return {
        success: false,
        error: "Failed to fetch mentor board",
      }
    }
  }

  async findMatchingMentors(
    companyTags: string[],
    companyId: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const matchingMentors = await this.calculateMentorMatches(companyTags, companyId)
      return {
        success: true,
        data: matchingMentors,
      }
    } catch (error) {
      console.error("Mentor matching error:", error)
      return {
        success: false,
        error: "Failed to find matching mentors",
      }
    }
  }

  async createMentorshipRequest(
    requestData: MentorshipRequest,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Calculate matching score
      const matchingScore = await this.calculateMatchingScore(requestData.mentorId, requestData.serviceTags)

      const request = {
        ...requestData,
        matchedScore: matchingScore,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await this.saveMentorshipRequest(request)

      if (result.success) {
        // Notify mentor
        await this.notifyMentorOfRequest(requestData.mentorId, result.data.id)

        // Track analytics
        await this.trackMentorAnalytics(requestData.mentorId, "service_request")
      }

      return result
    } catch (error) {
      console.error("Mentorship request error:", error)
      return {
        success: false,
        error: "Failed to create mentorship request",
      }
    }
  }

  async respondToMentorshipRequest(
    requestId: string,
    response: "accept" | "reject",
    mentorResponse?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const updateData = {
        status: response === "accept" ? "accepted" : "rejected",
        mentorResponse,
        respondedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (response === "accept") {
        updateData.startedAt = new Date().toISOString()
      }

      const result = await this.updateMentorshipRequest(requestId, updateData)

      if (result.success) {
        // Notify company
        await this.notifyCompanyOfResponse(requestId, response)

        // If accepted, create initial session
        if (response === "accept") {
          await this.createInitialMentorshipSession(requestId)
        }
      }

      return result
    } catch (error) {
      console.error("Mentorship response error:", error)
      return {
        success: false,
        error: "Failed to respond to mentorship request",
      }
    }
  }

  async createMentorArticle(articleData: MentorArticle): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const article = {
        ...articleData,
        slug: this.generateSlug(articleData.title),
        readingTime: this.calculateReadingTime(articleData.content),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await this.saveMentorArticle(article)

      if (result.success && article.status === "published") {
        // Track analytics
        await this.trackMentorAnalytics(articleData.mentorId, "article_published")

        // Update impact score
        await this.updateImpactScoreForArticle(articleData.mentorId)
      }

      return result
    } catch (error) {
      console.error("Article creation error:", error)
      return {
        success: false,
        error: "Failed to create article",
      }
    }
  }

  async getMentorAnalytics(
    mentorId: string,
    days = 30,
  ): Promise<{ success: boolean; data?: MentorAnalytics; error?: string }> {
    try {
      const analytics = await this.fetchMentorAnalytics(mentorId, days)
      return {
        success: true,
        data: analytics,
      }
    } catch (error) {
      console.error("Analytics fetch error:", error)
      return {
        success: false,
        error: "Failed to fetch analytics",
      }
    }
  }

  async getServiceTags(): Promise<{ success: boolean; data?: MentorServiceTag[]; error?: string }> {
    try {
      const tags = await this.fetchServiceTags()
      return {
        success: true,
        data: tags,
      }
    } catch (error) {
      console.error("Service tags fetch error:", error)
      return {
        success: false,
        error: "Failed to fetch service tags",
      }
    }
  }

  // Private helper methods
  private calculateImpactScore(profile: MentorProfile): number {
    let score = 0

    // Base score from experience
    score += (profile.yearsExperience || 0) * 2

    // Score from mentees
    score += (profile.totalMenteesCount || 0) * 5

    // Score from success rate
    score += (profile.successRate || 0) * 10

    // Score from rating
    score += (profile.rating || 0) * 20

    return Math.round(score * 100) / 100
  }

  private async recalculateImpactScore(mentorId: string, updates: Partial<MentorProfile>): Promise<number> {
    // In real implementation, fetch current profile and recalculate
    return this.calculateImpactScore(updates as MentorProfile)
  }

  private async calculateMentorMatches(companyTags: string[], companyId: string): Promise<any[]> {
    // Mock implementation - in real app, this would query database
    const mockMentors = [
      {
        id: "1",
        name: "Sarah Chen",
        title: "Strategic Growth Advisor",
        rating: 4.9,
        impactScore: 850,
        hourlyRate: 5000,
        matchingTags: ["Business Strategy", "Digital Transformation"],
        matchScore: 95,
        profileImageUrl: "/placeholder-user.jpg",
        totalMentees: 45,
        successRate: 92,
      },
      {
        id: "2",
        name: "Michael Rodriguez",
        title: "Fundraising & Finance Expert",
        rating: 4.8,
        impactScore: 720,
        hourlyRate: 4500,
        matchingTags: ["Fundraising", "Financial Planning"],
        matchScore: 88,
        profileImageUrl: "/placeholder-user.jpg",
        totalMentees: 32,
        successRate: 89,
      },
    ]

    return mockMentors
  }

  private async calculateMatchingScore(mentorId: string, serviceTags: string[]): Promise<number> {
    // Mock calculation - in real app, this would analyze mentor's tags vs requested tags
    return Math.floor(Math.random() * 30) + 70 // 70-100 range
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  private async trackMentorAnalytics(mentorId: string, eventType: string): Promise<void> {
    console.log(`Analytics tracked: ${mentorId} - ${eventType}`)
  }

  private async checkMentorPermission(mentorId: string): Promise<boolean> {
    // In real implementation, check if current user owns this mentor profile
    return true
  }

  // Mock API methods (in real app, these would make actual API calls)
  private async saveMentorProfile(profile: MentorProfile): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { ...profile, id: this.generateId() },
    }
  }

  private async updateMentorProfileData(
    mentorId: string,
    updates: any,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { id: mentorId, ...updates },
    }
  }

  private async fetchMentorProfile(
    mentorId: string,
  ): Promise<{ success: boolean; data?: MentorProfile; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock mentor profile
    const mockProfile: MentorProfile = {
      id: mentorId,
      userId: "user-123",
      title: "Strategic Growth Advisor & Former CTO",
      bio: "Experienced technology executive with 15+ years of experience scaling startups to unicorn status. Former CTO at TechCorp, led digital transformation initiatives across multiple industries.",
      expertiseSummary:
        "Specializing in strategic planning, digital transformation, team leadership, and technology scaling.",
      yearsExperience: 15,
      hourlyRate: 5000,
      currency: "INR",
      availabilityStatus: "available",
      maxMentees: 10,
      currentMenteesCount: 7,
      totalMenteesCount: 45,
      successRate: 92.5,
      impactScore: 850.75,
      rating: 4.9,
      totalReviews: 47,
      profileImageUrl: "/placeholder-user.jpg",
      linkedinUrl: "https://linkedin.com/in/sarah-chen",
      isVerified: true,
      isFeatured: true,
      isActive: true,
      serviceTags: [
        {
          id: "1",
          name: "Business Strategy",
          category: "strategy",
          color: "#3B82F6",
          icon: "target",
          proficiencyLevel: 9,
          yearsExperience: 15,
        },
        {
          id: "2",
          name: "Digital Transformation",
          category: "strategy",
          color: "#8B5CF6",
          icon: "zap",
          proficiencyLevel: 10,
          yearsExperience: 12,
        },
        {
          id: "3",
          name: "Leadership Development",
          category: "leadership",
          color: "#10B981",
          icon: "users",
          proficiencyLevel: 9,
          yearsExperience: 15,
        },
      ],
    }

    return {
      success: true,
      data: mockProfile,
    }
  }

  private async fetchMentorBoard(
    filters?: MentorFilters,
    page = 1,
    limit = 12,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock mentor board data
    const mockMentors = Array.from({ length: limit }, (_, i) => ({
      id: `mentor-${i + 1}`,
      name: `Mentor ${i + 1}`,
      title: "Strategic Advisor",
      rating: 4.5 + Math.random() * 0.5,
      impactScore: 500 + Math.random() * 400,
      hourlyRate: 3000 + Math.random() * 3000,
      profileImageUrl: "/placeholder-user.jpg",
      serviceTags: ["Business Strategy", "Leadership"],
      totalMentees: Math.floor(Math.random() * 50) + 10,
      availabilityStatus: "available",
    }))

    return {
      success: true,
      data: {
        mentors: mockMentors,
        totalCount: 150,
        currentPage: page,
        totalPages: Math.ceil(150 / limit),
      },
    }
  }

  private async saveMentorshipRequest(
    request: MentorshipRequest,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { ...request, id: this.generateId() },
    }
  }

  private async updateMentorshipRequest(
    requestId: string,
    updates: any,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { id: requestId, ...updates },
    }
  }

  private async saveMentorArticle(article: MentorArticle): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { ...article, id: this.generateId() },
    }
  }

  private async fetchMentorAnalytics(mentorId: string, days: number): Promise<MentorAnalytics> {
    // Mock analytics data
    return {
      mentorId,
      totalProfileViews: 1247,
      totalArticleViews: 892,
      totalServiceRequests: 45,
      totalSessionsCompleted: 38,
      totalRevenueGenerated: 190000,
      totalNewMentees: 7,
      impactScoreChange: 25.5,
      dailyStats: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        profileViews: Math.floor(Math.random() * 50) + 10,
        articleViews: Math.floor(Math.random() * 30) + 5,
        serviceRequests: Math.floor(Math.random() * 5),
        sessionsCompleted: Math.floor(Math.random() * 3),
        revenueGenerated: Math.floor(Math.random() * 10000),
      })),
      topServiceTags: [
        { tag: "Business Strategy", requests: 15 },
        { tag: "Digital Transformation", requests: 12 },
        { tag: "Leadership Development", requests: 8 },
      ],
      successMetrics: {
        completionRate: 92.5,
        averageRating: 4.9,
        responseTime: 2.5,
        clientRetention: 85.2,
      },
    }
  }

  private async fetchServiceTags(): Promise<MentorServiceTag[]> {
    // Mock service tags
    return [
      { id: "1", name: "Business Strategy", category: "strategy", color: "#3B82F6", icon: "target" },
      { id: "2", name: "Digital Transformation", category: "strategy", color: "#8B5CF6", icon: "zap" },
      { id: "3", name: "Leadership Development", category: "leadership", color: "#10B981", icon: "users" },
      { id: "4", name: "Fundraising", category: "finance", color: "#EF4444", icon: "trending-up" },
      { id: "5", name: "Marketing Strategy", category: "marketing", color: "#EC4899", icon: "megaphone" },
      { id: "6", name: "Sales Optimization", category: "sales", color: "#84CC16", icon: "trending-up" },
    ]
  }

  private async initializeMentorAnalytics(mentorId: string): Promise<void> {
    console.log(`Analytics initialized for mentor: ${mentorId}`)
  }

  private async createDefaultAvailability(mentorId: string): Promise<void> {
    console.log(`Default availability created for mentor: ${mentorId}`)
  }

  private async notifyMentorOfRequest(mentorId: string, requestId: string): Promise<void> {
    console.log(`Mentor ${mentorId} notified of request ${requestId}`)
  }

  private async notifyCompanyOfResponse(requestId: string, response: string): Promise<void> {
    console.log(`Company notified of ${response} for request ${requestId}`)
  }

  private async createInitialMentorshipSession(requestId: string): Promise<void> {
    console.log(`Initial session created for request ${requestId}`)
  }

  private async updateImpactScoreForArticle(mentorId: string): Promise<void> {
    console.log(`Impact score updated for mentor ${mentorId} - article published`)
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const mentorService = new MentorService()

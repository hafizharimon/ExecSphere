// Smart Connections Service with AI-powered recommendation engine

export interface SmartConnection {
  id: string
  userId: string
  recommendedUserId: string
  recommendedUser: {
    id: string
    name: string
    role: string
    organization: string
    industry: string
    profileImageUrl?: string
    isOnline?: boolean
    lastSeen?: string
  }
  connectionScore: number
  recommendationReasons: RecommendationReason[]
  status: "suggested" | "connected" | "declined" | "blocked"
  createdAt: string
  lastInteractionAt?: string
}

export interface RecommendationReason {
  factor: string
  score: number
  description: string
  evidence?: any
}

export interface ConnectionFilters {
  industry?: string
  role?: string
  minScore?: number
  status?: string
  hasSharedMentor?: boolean
  sameCompanySize?: boolean
}

export interface ConnectionInteraction {
  id: string
  userId: string
  targetUserId: string
  interactionType: string
  interactionData?: any
  createdAt: string
}

class SmartConnectionsService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  async getSmartConnections(
    userId: string,
    filters?: ConnectionFilters,
    limit = 20,
  ): Promise<{ success: boolean; data?: SmartConnection[]; error?: string }> {
    try {
      // First, refresh recommendations if needed
      await this.refreshRecommendations(userId)

      const connections = await this.fetchSmartConnections(userId, filters, limit)
      return connections
    } catch (error) {
      console.error("Get smart connections error:", error)
      return {
        success: false,
        error: "Failed to fetch smart connections",
      }
    }
  }

  async refreshRecommendations(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user profile and preferences
      const userProfile = await this.getUserProfile(userId)
      if (!userProfile.success) {
        return userProfile
      }

      // Get all potential connections (exclude existing connections and self)
      const potentialConnections = await this.getPotentialConnections(userId)
      if (!potentialConnections.success) {
        return potentialConnections
      }

      // Calculate connection scores for each potential connection
      const scoredConnections = await Promise.all(
        potentialConnections.data.map(async (candidate: any) => {
          const score = await this.calculateConnectionScore(userProfile.data, candidate)
          return {
            userId,
            recommendedUserId: candidate.id,
            connectionScore: score.totalScore,
            recommendationReasons: score.reasons,
            status: "suggested",
          }
        }),
      )

      // Filter out low-score connections (below threshold)
      const qualifiedConnections = scoredConnections.filter((conn) => conn.connectionScore >= 0.3)

      // Sort by score and take top recommendations
      qualifiedConnections.sort((a, b) => b.connectionScore - a.connectionScore)

      // Save or update recommendations
      const result = await this.saveRecommendations(qualifiedConnections.slice(0, 50))
      return result
    } catch (error) {
      console.error("Refresh recommendations error:", error)
      return {
        success: false,
        error: "Failed to refresh recommendations",
      }
    }
  }

  async calculateConnectionScore(
    userProfile: any,
    candidateProfile: any,
  ): Promise<{ totalScore: number; reasons: RecommendationReason[] }> {
    const reasons: RecommendationReason[] = []
    let totalScore = 0

    // Get connection factors and their weights
    const factors = await this.getConnectionFactors()

    // Same role factor
    if (this.isSameRole(userProfile.role, candidateProfile.role)) {
      const factor = factors.find((f) => f.factor_name === "same_role")
      const score = factor?.weight || 0.25
      totalScore += score
      reasons.push({
        factor: "same_role",
        score,
        description: `Both are ${userProfile.role}s`,
        evidence: { userRole: userProfile.role, candidateRole: candidateProfile.role },
      })
    }

    // Same industry factor
    if (userProfile.industry === candidateProfile.industry) {
      const factor = factors.find((f) => f.factor_name === "same_industry")
      const score = factor?.weight || 0.2
      totalScore += score
      reasons.push({
        factor: "same_industry",
        score,
        description: `Both work in ${userProfile.industry}`,
        evidence: { industry: userProfile.industry },
      })
    }

    // Shared mentor factor
    const sharedMentors = await this.getSharedMentors(userProfile.id, candidateProfile.id)
    if (sharedMentors.length > 0) {
      const factor = factors.find((f) => f.factor_name === "shared_mentor")
      const score = (factor?.weight || 0.3) * Math.min(sharedMentors.length / 2, 1)
      totalScore += score
      reasons.push({
        factor: "shared_mentor",
        score,
        description: `Share ${sharedMentors.length} mentor(s)`,
        evidence: { sharedMentors },
      })
    }

    // Company size similarity
    const companySizeSimilarity = this.calculateCompanySizeSimilarity(
      userProfile.companySize,
      candidateProfile.companySize,
    )
    if (companySizeSimilarity > 0.5) {
      const factor = factors.find((f) => f.factor_name === "company_size_similarity")
      const score = (factor?.weight || 0.15) * companySizeSimilarity
      totalScore += score
      reasons.push({
        factor: "company_size_similarity",
        score,
        description: "Similar company sizes",
        evidence: { userSize: userProfile.companySize, candidateSize: candidateProfile.companySize },
      })
    }

    // Geographic proximity
    if (userProfile.country === candidateProfile.country) {
      const factor = factors.find((f) => f.factor_name === "geographic_proximity")
      const score = factor?.weight || 0.1
      totalScore += score
      reasons.push({
        factor: "geographic_proximity",
        score,
        description: `Both based in ${userProfile.country}`,
        evidence: { country: userProfile.country },
      })
    }

    // Experience level similarity
    const experienceSimilarity = this.calculateExperienceSimilarity(
      userProfile.yearsExperience,
      candidateProfile.yearsExperience,
    )
    if (experienceSimilarity > 0.6) {
      const factor = factors.find((f) => f.factor_name === "experience_level")
      const score = (factor?.weight || 0.15) * experienceSimilarity
      totalScore += score
      reasons.push({
        factor: "experience_level",
        score,
        description: "Similar experience levels",
        evidence: { userExp: userProfile.yearsExperience, candidateExp: candidateProfile.yearsExperience },
      })
    }

    // Mutual connections
    const mutualConnections = await this.getMutualConnections(userProfile.id, candidateProfile.id)
    if (mutualConnections.length > 0) {
      const factor = factors.find((f) => f.factor_name === "mutual_connections")
      const score = (factor?.weight || 0.25) * Math.min(mutualConnections.length / 5, 1)
      totalScore += score
      reasons.push({
        factor: "mutual_connections",
        score,
        description: `${mutualConnections.length} mutual connections`,
        evidence: { mutualConnections },
      })
    }

    // Event attendance overlap
    const sharedEvents = await this.getSharedEvents(userProfile.id, candidateProfile.id)
    if (sharedEvents.length > 0) {
      const factor = factors.find((f) => f.factor_name === "event_attendance")
      const score = (factor?.weight || 0.1) * Math.min(sharedEvents.length / 3, 1)
      totalScore += score
      reasons.push({
        factor: "event_attendance",
        score,
        description: `Attended ${sharedEvents.length} same events`,
        evidence: { sharedEvents },
      })
    }

    // Forum activity overlap
    const sharedForumActivity = await this.getSharedForumActivity(userProfile.id, candidateProfile.id)
    if (sharedForumActivity.overlap > 0.3) {
      const factor = factors.find((f) => f.factor_name === "forum_activity")
      const score = (factor?.weight || 0.05) * sharedForumActivity.overlap
      totalScore += score
      reasons.push({
        factor: "forum_activity",
        score,
        description: "Active in similar forum topics",
        evidence: sharedForumActivity,
      })
    }

    return {
      totalScore: Math.min(totalScore, 1.0), // Cap at 1.0
      reasons: reasons.sort((a, b) => b.score - a.score),
    }
  }

  async connectWithUser(
    userId: string,
    targetUserId: string,
    message?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Update connection status
      const updateResult = await this.updateConnectionStatus(userId, targetUserId, "connected")
      if (!updateResult.success) {
        return updateResult
      }

      // Create bidirectional connection
      await this.createBidirectionalConnection(userId, targetUserId)

      // Log interaction
      await this.logConnectionInteraction(userId, targetUserId, "connection_request", { message })

      // Send notification to target user
      await this.sendConnectionNotification(targetUserId, userId, message)

      return {
        success: true,
        data: { connectionId: updateResult.data.id },
      }
    } catch (error) {
      console.error("Connect with user error:", error)
      return {
        success: false,
        error: "Failed to connect with user",
      }
    }
  }

  async declineConnection(userId: string, targetUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.updateConnectionStatus(userId, targetUserId, "declined")
      if (result.success) {
        await this.logConnectionInteraction(userId, targetUserId, "connection_declined")
      }
      return result
    } catch (error) {
      console.error("Decline connection error:", error)
      return {
        success: false,
        error: "Failed to decline connection",
      }
    }
  }

  async getConnectionInteractions(
    userId: string,
    limit = 50,
  ): Promise<{ success: boolean; data?: ConnectionInteraction[]; error?: string }> {
    try {
      const interactions = await this.fetchConnectionInteractions(userId, limit)
      return interactions
    } catch (error) {
      console.error("Get connection interactions error:", error)
      return {
        success: false,
        error: "Failed to fetch interactions",
      }
    }
  }

  async trackInteraction(userId: string, targetUserId: string, interactionType: string, data?: any): Promise<void> {
    try {
      await this.logConnectionInteraction(userId, targetUserId, interactionType, data)

      // Update last interaction time for the connection
      await this.updateLastInteraction(userId, targetUserId)
    } catch (error) {
      console.error("Track interaction error:", error)
    }
  }

  // Private helper methods
  private isSameRole(role1: string, role2: string): boolean {
    // Normalize roles for comparison
    const normalizeRole = (role: string) => {
      return role
        .toLowerCase()
        .replace(/chief|officer/g, "")
        .replace(/\s+/g, "")
        .trim()
    }

    return normalizeRole(role1) === normalizeRole(role2)
  }

  private calculateCompanySizeSimilarity(size1: string, size2: string): number {
    const sizeRanges = {
      "1-10": 1,
      "11-50": 2,
      "51-200": 3,
      "201-500": 4,
      "501-1000": 5,
      "1000+": 6,
    }

    const range1 = sizeRanges[size1 as keyof typeof sizeRanges] || 0
    const range2 = sizeRanges[size2 as keyof typeof sizeRanges] || 0

    if (range1 === 0 || range2 === 0) return 0

    const difference = Math.abs(range1 - range2)
    return Math.max(0, 1 - difference / 5)
  }

  private calculateExperienceSimilarity(exp1: number, exp2: number): number {
    if (!exp1 || !exp2) return 0

    const difference = Math.abs(exp1 - exp2)
    const maxExp = Math.max(exp1, exp2)

    return Math.max(0, 1 - difference / maxExp)
  }

  // Mock API methods (in real app, these would make actual API calls)
  private async getUserProfile(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    // Mock user profile
    return {
      success: true,
      data: {
        id: userId,
        name: "John Doe",
        role: "CEO",
        organization: "TechCorp",
        industry: "Technology",
        country: "India",
        yearsExperience: 15,
        companySize: "51-200",
      },
    }
  }

  private async getPotentialConnections(userId: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    // Mock potential connections
    return {
      success: true,
      data: [
        {
          id: "user-2",
          name: "Jane Smith",
          role: "CTO",
          organization: "InnovateTech",
          industry: "Technology",
          country: "India",
          yearsExperience: 12,
          companySize: "51-200",
        },
        {
          id: "user-3",
          name: "Mike Johnson",
          role: "CEO",
          organization: "StartupCorp",
          industry: "Technology",
          country: "India",
          yearsExperience: 18,
          companySize: "11-50",
        },
      ],
    }
  }

  private async getConnectionFactors(): Promise<any[]> {
    // Mock connection factors
    return [
      { factor_name: "same_role", weight: 0.25 },
      { factor_name: "same_industry", weight: 0.2 },
      { factor_name: "shared_mentor", weight: 0.3 },
      { factor_name: "company_size_similarity", weight: 0.15 },
      { factor_name: "geographic_proximity", weight: 0.1 },
      { factor_name: "experience_level", weight: 0.15 },
      { factor_name: "mutual_connections", weight: 0.25 },
      { factor_name: "event_attendance", weight: 0.1 },
      { factor_name: "forum_activity", weight: 0.05 },
    ]
  }

  private async getSharedMentors(userId1: string, userId2: string): Promise<any[]> {
    // Mock shared mentors
    return [{ id: "mentor-1", name: "Sarah Chen", role: "Strategic Advisor" }]
  }

  private async getMutualConnections(userId1: string, userId2: string): Promise<any[]> {
    // Mock mutual connections
    return [
      { id: "user-4", name: "Alice Brown" },
      { id: "user-5", name: "Bob Wilson" },
    ]
  }

  private async getSharedEvents(userId1: string, userId2: string): Promise<any[]> {
    // Mock shared events
    return [{ id: "event-1", title: "Tech Leadership Summit 2024" }]
  }

  private async getSharedForumActivity(userId1: string, userId2: string): Promise<any> {
    // Mock shared forum activity
    return {
      overlap: 0.4,
      sharedTopics: ["Digital Transformation", "Leadership"],
    }
  }

  private async fetchSmartConnections(
    userId: string,
    filters?: ConnectionFilters,
    limit = 20,
  ): Promise<{ success: boolean; data?: SmartConnection[]; error?: string }> {
    // Mock smart connections
    const mockConnections: SmartConnection[] = [
      {
        id: "conn-1",
        userId,
        recommendedUserId: "user-2",
        recommendedUser: {
          id: "user-2",
          name: "Jane Smith",
          role: "CTO",
          organization: "InnovateTech",
          industry: "Technology",
          profileImageUrl: "/placeholder-user.jpg",
          isOnline: true,
        },
        connectionScore: 0.85,
        recommendationReasons: [
          {
            factor: "shared_mentor",
            score: 0.3,
            description: "Share 1 mentor(s)",
            evidence: { sharedMentors: [{ name: "Sarah Chen" }] },
          },
          {
            factor: "same_industry",
            score: 0.2,
            description: "Both work in Technology",
            evidence: { industry: "Technology" },
          },
        ],
        status: "suggested",
        createdAt: "2024-01-15T10:30:00Z",
      },
    ]

    return {
      success: true,
      data: mockConnections,
    }
  }

  private async saveRecommendations(recommendations: any[]): Promise<{ success: boolean; error?: string }> {
    // Mock save recommendations
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  }

  private async updateConnectionStatus(
    userId: string,
    targetUserId: string,
    status: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: "conn-1", status },
    }
  }

  private async createBidirectionalConnection(userId: string, targetUserId: string): Promise<void> {
    console.log(`Creating bidirectional connection: ${userId} <-> ${targetUserId}`)
  }

  private async logConnectionInteraction(
    userId: string,
    targetUserId: string,
    type: string,
    data?: any,
  ): Promise<void> {
    console.log(`Interaction logged: ${userId} -> ${targetUserId} (${type})`, data)
  }

  private async sendConnectionNotification(targetUserId: string, fromUserId: string, message?: string): Promise<void> {
    console.log(`Notification sent to ${targetUserId} from ${fromUserId}`, message)
  }

  private async fetchConnectionInteractions(
    userId: string,
    limit: number,
  ): Promise<{ success: boolean; data?: ConnectionInteraction[]; error?: string }> {
    return {
      success: true,
      data: [],
    }
  }

  private async updateLastInteraction(userId: string, targetUserId: string): Promise<void> {
    console.log(`Last interaction updated: ${userId} -> ${targetUserId}`)
  }
}

export const smartConnectionsService = new SmartConnectionsService()

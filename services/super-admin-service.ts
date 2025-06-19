// Enhanced Super Admin Service with comprehensive functionality

export interface GlobalSetting {
  id: number
  settingKey: string
  settingValue: string
  settingType: "string" | "number" | "boolean" | "json"
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  updatedBy?: string
}

export interface UserVerificationRequest {
  id: string
  userId: string
  requestType: "registration" | "profile_update" | "mentor_application"
  status: "pending" | "approved" | "rejected" | "requires_info"
  submittedData: any
  linkedinData?: any
  eligibilityAnalysis?: any
  adminNotes?: string
  processedBy?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    email: string
    role: string
    organization: string
    industry: string
  }
}

export interface CompanyVerificationRequest {
  id: string
  companyId: string
  requestType: "creation" | "update" | "legal_verification"
  status: "pending" | "approved" | "rejected" | "requires_info"
  submittedData: any
  mcaVerification?: any
  udyamVerification?: any
  linkedinVerification?: any
  adminNotes?: string
  processedBy?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
  company?: {
    name: string
    legalName: string
    industry: string
    cinNumber?: string
    udyamNumber?: string
  }
}

export interface FeeRequest {
  id: string
  userId: string
  requestType: "mentor_rate_increase" | "premium_badge" | "subscription"
  currentAmount: number
  requestedAmount: number
  maxAllowedAmount: number
  justification: string
  status: "pending" | "approved" | "rejected"
  adminResponse?: string
  processedBy?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    role: string
    organization: string
  }
}

export interface BillingTransaction {
  id: string
  userId?: string
  companyId?: string
  transactionType: "registration_fee" | "mentor_payment" | "subscription" | "refund"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentGateway?: string
  gatewayTransactionId?: string
  gatewayResponse?: any
  description?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CustomRole {
  id: string
  roleName: string
  roleDescription?: string
  maxHourlyRate?: number
  permissions: string[]
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
  userCount?: number
}

export interface ServiceProvider {
  id: string
  providerName: string
  providerType: "payment" | "verification" | "communication" | "analytics"
  apiEndpoint?: string
  configuration: any
  status: "active" | "inactive" | "maintenance"
  lastHealthCheck?: string
  healthStatus?: "healthy" | "degraded" | "down"
  createdAt: string
  updatedAt: string
}

export interface PlatformConfiguration {
  id: string
  configCategory: "security" | "features" | "limits" | "notifications"
  configKey: string
  configValue: any
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface DatabaseMetric {
  id: string
  metricName: string
  metricValue: number
  metricUnit: string
  recordedAt: string
  additionalData?: any
}

export interface MentorEligibilityAnalysis {
  id: string
  userId: string
  analysisData: any
  eligibilityScore: number
  meetsOneYearRule: boolean
  executiveExperienceYears: number
  recommendation: "approved" | "rejected" | "requires_review"
  analyzedAt: string
  analyzedBy: string
}

class SuperAdminService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  // Global Settings Management
  async getGlobalSettings(): Promise<{ success: boolean; data?: GlobalSetting[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/global-settings`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get global settings error:", error)
      return { success: false, error: "Failed to fetch global settings" }
    }
  }

  async updateGlobalSetting(
    settingKey: string,
    settingValue: string,
    settingType = "string",
  ): Promise<{ success: boolean; data?: GlobalSetting; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/global-settings/${settingKey}`, {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settingValue, settingType }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Update global setting error:", error)
      return { success: false, error: "Failed to update global setting" }
    }
  }

  // User Verification Management
  async getUserVerificationRequests(
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      })

      const response = await fetch(`${this.baseUrl}/super-admin/user-verifications?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get user verification requests error:", error)
      return { success: false, error: "Failed to fetch user verification requests" }
    }
  }

  async analyzeUserEligibility(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Fetch LinkedIn data
      const linkedinData = await this.fetchLinkedInData(userId)

      // Analyze eligibility
      const eligibilityAnalysis = this.performEligibilityAnalysis(linkedinData)

      // Store analysis
      const response = await fetch(`${this.baseUrl}/super-admin/analyze-eligibility`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          linkedinData,
          eligibilityAnalysis,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Analyze user eligibility error:", error)
      return { success: false, error: "Failed to analyze user eligibility" }
    }
  }

  async approveUserVerification(
    requestId: string,
    adminNotes?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/user-verifications/${requestId}/approve`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminNotes }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Approve user verification error:", error)
      return { success: false, error: "Failed to approve user verification" }
    }
  }

  async rejectUserVerification(
    requestId: string,
    adminNotes: string,
    processRefund = true,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/user-verifications/${requestId}/reject`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminNotes, processRefund }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Reject user verification error:", error)
      return { success: false, error: "Failed to reject user verification" }
    }
  }

  // Company Verification Management
  async getCompanyVerificationRequests(
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      })

      const response = await fetch(`${this.baseUrl}/super-admin/company-verifications?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get company verification requests error:", error)
      return { success: false, error: "Failed to fetch company verification requests" }
    }
  }

  async verifyCompanyLegalStatus(companyId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/verify-company-legal/${companyId}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Verify company legal status error:", error)
      return { success: false, error: "Failed to verify company legal status" }
    }
  }

  // Fee Request Management
  async getFeeRequests(
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<{ success: boolean; data?: FeeRequest[]; error?: string }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      })

      const response = await fetch(`${this.baseUrl}/super-admin/fee-requests?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data: data.requests }
    } catch (error) {
      console.error("Get fee requests error:", error)
      return { success: false, error: "Failed to fetch fee requests" }
    }
  }

  async approveFeeRequest(
    requestId: string,
    adminResponse?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/fee-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminResponse }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Approve fee request error:", error)
      return { success: false, error: "Failed to approve fee request" }
    }
  }

  async rejectFeeRequest(
    requestId: string,
    adminResponse: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/fee-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminResponse }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Reject fee request error:", error)
      return { success: false, error: "Failed to reject fee request" }
    }
  }

  // Billing Management
  async getBillingTransactions(
    page = 1,
    limit = 20,
    filters?: any,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })

      const response = await fetch(`${this.baseUrl}/super-admin/billing-transactions?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get billing transactions error:", error)
      return { success: false, error: "Failed to fetch billing transactions" }
    }
  }

  async getBillingOverview(
    startDate?: string,
    endDate?: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)

      const response = await fetch(`${this.baseUrl}/super-admin/billing-overview?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get billing overview error:", error)
      return { success: false, error: "Failed to fetch billing overview" }
    }
  }

  // Role Management
  async getCustomRoles(): Promise<{ success: boolean; data?: CustomRole[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/custom-roles`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get custom roles error:", error)
      return { success: false, error: "Failed to fetch custom roles" }
    }
  }

  async createCustomRole(roleData: {
    roleName: string
    roleDescription?: string
    maxHourlyRate?: number
    permissions: string[]
  }): Promise<{ success: boolean; data?: CustomRole; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/custom-roles`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Create custom role error:", error)
      return { success: false, error: "Failed to create custom role" }
    }
  }

  // Service Provider Management
  async getServiceProviders(): Promise<{ success: boolean; data?: ServiceProvider[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/service-providers`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get service providers error:", error)
      return { success: false, error: "Failed to fetch service providers" }
    }
  }

  async updateServiceProvider(
    providerId: string,
    updates: Partial<ServiceProvider>,
  ): Promise<{ success: boolean; data?: ServiceProvider; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/service-providers/${providerId}`, {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Update service provider error:", error)
      return { success: false, error: "Failed to update service provider" }
    }
  }

  // Platform Configuration Management
  async getPlatformConfigurations(): Promise<{ success: boolean; data?: PlatformConfiguration[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/platform-configurations`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get platform configurations error:", error)
      return { success: false, error: "Failed to fetch platform configurations" }
    }
  }

  async updatePlatformConfiguration(
    configId: string,
    configValue: any,
  ): Promise<{ success: boolean; data?: PlatformConfiguration; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/platform-configurations/${configId}`, {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configValue }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Update platform configuration error:", error)
      return { success: false, error: "Failed to update platform configuration" }
    }
  }

  // Database Management
  async getDatabaseMetrics(): Promise<{ success: boolean; data?: DatabaseMetric[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/database-metrics`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get database metrics error:", error)
      return { success: false, error: "Failed to fetch database metrics" }
    }
  }

  async runDatabaseMaintenance(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/database-maintenance`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Run database maintenance error:", error)
      return { success: false, error: "Failed to run database maintenance" }
    }
  }

  // LinkedIn Integration
  private async fetchLinkedInData(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/linkedin/profile/${userId}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Fetch LinkedIn data error:", error)
      return null
    }
  }

  // Mentor Eligibility Analysis (1-year rule)
  private performEligibilityAnalysis(linkedinData: any): MentorEligibilityAnalysis {
    if (!linkedinData || !linkedinData.experience) {
      return {
        id: "",
        userId: "",
        analysisData: { error: "No LinkedIn data available" },
        eligibilityScore: 0,
        meetsOneYearRule: false,
        executiveExperienceYears: 0,
        recommendation: "rejected",
        analyzedAt: new Date().toISOString(),
        analyzedBy: "system",
      }
    }

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
      "Chief Security Officer",
      "Chief Data Officer",
      "Chief Revenue Officer",
      "Managing Director",
      "Executive Director",
      "President",
      "Vice President",
      "VP",
      "SVP",
      "Senior Vice President",
    ]

    let totalExecutiveYears = 0
    let currentExecutiveRole = null
    const executiveExperiences = []

    for (const experience of linkedinData.experience) {
      const isExecutive = executiveTitles.some((title) => experience.title.toLowerCase().includes(title.toLowerCase()))

      if (isExecutive) {
        const startDate = new Date(experience.startDate?.year || 2020, (experience.startDate?.month || 1) - 1)
        const endDate = experience.endDate
          ? new Date(experience.endDate.year, experience.endDate.month - 1)
          : new Date()

        const yearsInRole = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        totalExecutiveYears += yearsInRole

        executiveExperiences.push({
          ...experience,
          yearsInRole: Math.round(yearsInRole * 10) / 10,
          isExecutive: true,
        })

        if (!experience.endDate) {
          currentExecutiveRole = experience
        }
      }
    }

    const meetsOneYearRule = totalExecutiveYears >= 1
    const hasCurrentExecutiveRole = !!currentExecutiveRole
    const eligibilityScore = Math.min(100, totalExecutiveYears * 20 + (hasCurrentExecutiveRole ? 20 : 0))

    let recommendation: "approved" | "rejected" | "requires_review" = "rejected"
    if (meetsOneYearRule && hasCurrentExecutiveRole && eligibilityScore >= 60) {
      recommendation = "approved"
    } else if (meetsOneYearRule || eligibilityScore >= 40) {
      recommendation = "requires_review"
    }

    return {
      id: "",
      userId: "",
      analysisData: {
        executiveExperiences,
        currentExecutiveRole,
        totalPositions: linkedinData.experience.length,
        executivePositions: executiveExperiences.length,
        hasCurrentExecutiveRole,
        analysis: {
          strengths: meetsOneYearRule ? ["Meets 1-year executive experience requirement"] : [],
          concerns: !meetsOneYearRule ? ["Does not meet 1-year executive experience requirement"] : [],
          recommendations:
            recommendation === "requires_review" ? ["Manual review recommended due to borderline eligibility"] : [],
        },
      },
      eligibilityScore: Math.round(eligibilityScore * 10) / 10,
      meetsOneYearRule,
      executiveExperienceYears: Math.round(totalExecutiveYears * 10) / 10,
      recommendation,
      analyzedAt: new Date().toISOString(),
      analyzedBy: "system",
    }
  }

  // MCA/Udyam API Integration
  async verifyMCAStatus(cinNumber: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/mca/verify`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cinNumber }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("MCA verification error:", error)
      return { status: "error", message: "Failed to verify MCA status" }
    }
  }

  async verifyUdyamStatus(udyamNumber: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/udyam/verify`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ udyamNumber }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Udyam verification error:", error)
      return { status: "error", message: "Failed to verify Udyam status" }
    }
  }

  // Utility methods
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("authToken")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  // Platform Metrics
  async getPlatformMetrics(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/super-admin/platform-metrics`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Get platform metrics error:", error)
      return { success: false, error: "Failed to fetch platform metrics" }
    }
  }
}

export const superAdminService = new SuperAdminService()

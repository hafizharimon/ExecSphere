// LinkedIn Integration Service for C-level experience validation

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  emailAddress: string
  headline: string
  industry: string
  location: string
  profilePicture?: string
  publicProfileUrl: string
}

export interface LinkedInExperience {
  id: string
  title: string
  companyName: string
  companyId?: string
  companyUrl?: string
  startDate: {
    month: number
    year: number
  }
  endDate?: {
    month: number
    year: number
  }
  isCurrent: boolean
  description?: string
  location?: string
}

export interface LinkedInCompany {
  id: string
  name: string
  industry: string
  size: string
  website?: string
  linkedinUrl: string
}

export interface CXOExperienceAnalysis {
  totalDays: number
  totalYears: number
  hasMinimumExperience: boolean
  cxoRoles: LinkedInExperience[]
  currentCXORole?: LinkedInExperience
  eligibleForMentorship: boolean
}

class LinkedInIntegrationService {
  private clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  private redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI
  private baseUrl = "https://api.linkedin.com/v2"

  // C-level titles for experience validation
  private cxoTitles = [
    "Chief Executive Officer",
    "CEO",
    "Chief Technology Officer",
    "CTO",
    "Chief Financial Officer",
    "CFO",
    "Chief Operating Officer",
    "COO",
    "Chief Marketing Officer",
    "CMO",
    "Chief Human Resources Officer",
    "CHRO",
    "Chief Product Officer",
    "CPO",
    "Chief Information Officer",
    "CIO",
    "Chief Strategy Officer",
    "CSO",
    "Chief Data Officer",
    "CDO",
    "Chief Revenue Officer",
    "CRO",
    "Managing Director",
    "MD",
    "Executive Director",
    "President",
    "Vice President",
    "VP",
  ]

  async getAuthorizationUrl(): Promise<string> {
    const scope = "r_liteprofile r_emailaddress r_fullprofile"
    const state = this.generateRandomState()

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId || "",
      redirect_uri: this.redirectUri || "",
      state,
      scope,
    })

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<string | null> {
    try {
      const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: this.redirectUri || "",
          client_id: this.clientId || "",
          client_secret: this.clientSecret || "",
        }),
      })

      const data = await response.json()
      return data.access_token || null
    } catch (error) {
      console.error("LinkedIn token exchange error:", error)
      return null
    }
  }

  async getProfile(accessToken: string): Promise<LinkedInProfile | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/people/~:(id,firstName,lastName,emailAddress,headline,industry,location,pictureUrl,publicProfileUrl)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch LinkedIn profile")
      }

      const data = await response.json()

      return {
        id: data.id,
        firstName: data.firstName?.localized?.en_US || "",
        lastName: data.lastName?.localized?.en_US || "",
        emailAddress: data.emailAddress,
        headline: data.headline?.localized?.en_US || "",
        industry: data.industry?.localized?.en_US || "",
        location: data.location?.name || "",
        profilePicture: data.pictureUrl,
        publicProfileUrl: data.publicProfileUrl,
      }
    } catch (error) {
      console.error("LinkedIn profile fetch error:", error)
      return null
    }
  }

  async getExperience(accessToken: string): Promise<LinkedInExperience[]> {
    try {
      // Note: LinkedIn API v2 has limited access to experience data
      // This would require LinkedIn Partner Program access in production

      // For demo purposes, we'll return mock data
      return this.getMockExperienceData()
    } catch (error) {
      console.error("LinkedIn experience fetch error:", error)
      return []
    }
  }

  private getMockExperienceData(): LinkedInExperience[] {
    return [
      {
        id: "1",
        title: "Chief Executive Officer",
        companyName: "TechCorp Solutions",
        startDate: { month: 1, year: 2022 },
        isCurrent: true,
        description: "Leading digital transformation initiatives and strategic growth",
        location: "Bangalore, India",
      },
      {
        id: "2",
        title: "Chief Technology Officer",
        companyName: "InnovateTech",
        startDate: { month: 6, year: 2020 },
        endDate: { month: 12, year: 2021 },
        isCurrent: false,
        description: "Led technology strategy and product development",
        location: "Mumbai, India",
      },
      {
        id: "3",
        title: "Vice President Engineering",
        companyName: "StartupCorp",
        startDate: { month: 3, year: 2018 },
        endDate: { month: 5, year: 2020 },
        isCurrent: false,
        description: "Built and scaled engineering teams",
        location: "Pune, India",
      },
    ]
  }

  analyzeCXOExperience(experiences: LinkedInExperience[]): CXOExperienceAnalysis {
    const cxoRoles = experiences.filter((exp) => this.isCXORole(exp.title))

    let totalDays = 0
    let currentCXORole: LinkedInExperience | undefined

    cxoRoles.forEach((role) => {
      const startDate = new Date(role.startDate.year, role.startDate.month - 1)
      const endDate = role.endDate ? new Date(role.endDate.year, role.endDate.month - 1) : new Date()

      if (role.isCurrent) {
        currentCXORole = role
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      totalDays += diffDays
    })

    const totalYears = totalDays / 365
    const hasMinimumExperience = totalDays >= 365 // 1 year minimum
    const eligibleForMentorship = hasMinimumExperience

    return {
      totalDays,
      totalYears: Math.round(totalYears * 10) / 10, // Round to 1 decimal
      hasMinimumExperience,
      cxoRoles,
      currentCXORole,
      eligibleForMentorship,
    }
  }

  private isCXORole(title: string): boolean {
    return this.cxoTitles.some((cxoTitle) => title.toLowerCase().includes(cxoTitle.toLowerCase()))
  }

  async validateCompanyPage(companyUrl: string, accessToken: string): Promise<boolean> {
    try {
      // Extract company ID from LinkedIn URL
      const companyId = this.extractCompanyIdFromUrl(companyUrl)
      if (!companyId) return false

      // Check if user has admin access to the company page
      const response = await fetch(
        `${this.baseUrl}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(id,name)))`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) return false

      const data = await response.json()
      const adminCompanies = data.elements || []

      return adminCompanies.some((company: any) => company.organizationalTarget?.id === companyId)
    } catch (error) {
      console.error("Company page validation error:", error)
      return false
    }
  }

  private extractCompanyIdFromUrl(url: string): string | null {
    const match = url.match(/\/company\/([^/?]+)/)
    return match ? match[1] : null
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Store state for OAuth validation
  storeOAuthState(state: string): void {
    sessionStorage.setItem("linkedin_oauth_state", state)
  }

  validateOAuthState(state: string): boolean {
    const storedState = sessionStorage.getItem("linkedin_oauth_state")
    sessionStorage.removeItem("linkedin_oauth_state")
    return storedState === state
  }
}

export const linkedInIntegrationService = new LinkedInIntegrationService()

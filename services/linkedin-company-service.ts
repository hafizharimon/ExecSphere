// LinkedIn Company Service for company page integration

export interface LinkedInCompanyData {
  id: string
  name: string
  description?: string
  industry?: string
  website?: string
  logo?: string
  coverImage?: string
  employeeCount?: string
  foundedYear?: number
  headquarters?: {
    city: string
    country: string
    geographicArea: string
    line1: string
    line2?: string
    postalCode: string
  }
  specialties?: string[]
  companyType?: string
  companySize?: string
  followers?: number
}

export interface LinkedInCompanyResult {
  success: boolean
  data?: LinkedInCompanyData
  error?: string
  requiresAuth?: boolean
}

class LinkedInCompanyService {
  private clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  private baseUrl = "https://api.linkedin.com/v2"

  async fetchCompanyData(companyUrl: string): Promise<LinkedInCompanyResult> {
    try {
      // Extract company identifier from URL
      const companyId = this.extractCompanyId(companyUrl)
      if (!companyId) {
        return {
          success: false,
          error: "Invalid LinkedIn company URL",
        }
      }

      // Simulate LinkedIn API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock company data for demo
      const mockCompanies: Record<string, LinkedInCompanyData> = {
        "techcorp-solutions": {
          id: "techcorp-solutions",
          name: "TechCorp Solutions",
          description:
            "Leading technology solutions provider specializing in digital transformation and enterprise software development.",
          industry: "Technology",
          website: "https://techcorp.com",
          logo: "/placeholder-logo.png",
          coverImage: "/placeholder.jpg",
          employeeCount: "51-200",
          foundedYear: 2020,
          headquarters: {
            city: "Bangalore",
            country: "India",
            geographicArea: "Karnataka",
            line1: "123 Tech Park",
            postalCode: "560001",
          },
          specialties: ["Software Development", "Digital Transformation", "Cloud Solutions"],
          companyType: "Private Company",
          companySize: "51-200 employees",
          followers: 1247,
        },
        "demo-corporation": {
          id: "demo-corporation",
          name: "Demo Corporation",
          description: "Innovative solutions for modern businesses.",
          industry: "Technology",
          website: "https://democorp.com",
          logo: "/placeholder-logo.png",
          employeeCount: "11-50",
          foundedYear: 2019,
          headquarters: {
            city: "Mumbai",
            country: "India",
            geographicArea: "Maharashtra",
            line1: "456 Business Center",
            postalCode: "400001",
          },
          specialties: ["Innovation", "Business Solutions"],
          companyType: "Private Company",
          companySize: "11-50 employees",
          followers: 892,
        },
      }

      const companyData = mockCompanies[companyId]

      if (companyData) {
        return {
          success: true,
          data: companyData,
        }
      } else {
        return {
          success: false,
          error: "Company not found or access denied",
        }
      }
    } catch (error) {
      console.error("LinkedIn company fetch error:", error)
      return {
        success: false,
        error: "Failed to fetch company data from LinkedIn",
      }
    }
  }

  async verifyCompanyAdmin(companyUrl: string, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const companyId = this.extractCompanyId(companyUrl)
      if (!companyId) {
        return {
          success: false,
          error: "Invalid company URL",
        }
      }

      // Simulate admin verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, assume user is admin
      return { success: true }
    } catch (error) {
      console.error("Admin verification error:", error)
      return {
        success: false,
        error: "Failed to verify admin access",
      }
    }
  }

  async getCompanyUpdates(companyId: string, accessToken: string): Promise<any[]> {
    try {
      // Mock company updates
      return [
        {
          id: "update1",
          text: "Excited to announce our new product launch!",
          createdTime: new Date(Date.now() - 86400000).toISOString(),
          likes: 45,
          comments: 12,
          shares: 8,
        },
        {
          id: "update2",
          text: "Join us at the upcoming tech conference.",
          createdTime: new Date(Date.now() - 172800000).toISOString(),
          likes: 32,
          comments: 6,
          shares: 15,
        },
      ]
    } catch (error) {
      console.error("Company updates error:", error)
      return []
    }
  }

  async getCompanyEmployees(companyId: string, accessToken: string): Promise<any[]> {
    try {
      // Mock employee data
      return [
        {
          id: "emp1",
          firstName: "Rajesh",
          lastName: "Kumar",
          headline: "CEO at TechCorp Solutions",
          profilePicture: "/placeholder-user.jpg",
        },
        {
          id: "emp2",
          firstName: "Priya",
          lastName: "Sharma",
          headline: "CTO at TechCorp Solutions",
          profilePicture: "/placeholder-user.jpg",
        },
      ]
    } catch (error) {
      console.error("Company employees error:", error)
      return []
    }
  }

  private extractCompanyId(url: string): string | null {
    try {
      // Extract company identifier from LinkedIn URL
      const match = url.match(/\/company\/([^/?]+)/)
      return match ? match[1] : null
    } catch (error) {
      return null
    }
  }

  async getAuthorizationUrl(companyUrl: string): Promise<string> {
    const scope = "r_organization_social w_organization_social"
    const state = this.generateRandomState()

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId || "",
      redirect_uri: `${window.location.origin}/auth/linkedin/callback`,
      state,
      scope,
    })

    // Store company URL in session for later use
    sessionStorage.setItem("linkedin_company_url", companyUrl)
    sessionStorage.setItem("linkedin_oauth_state", state)

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  validateCompanyUrl(url: string): boolean {
    const linkedinCompanyRegex = /^https:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9\-_]+\/?$/
    return linkedinCompanyRegex.test(url)
  }
}

export const linkedinCompanyService = new LinkedInCompanyService()

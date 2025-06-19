// Enhanced MCA API Integration Service with PostgreSQL integration
import { mcaApiService } from "./mca-api"

export interface EnhancedMcaVerificationResult {
  success: boolean
  data?: McaCompanyData
  error?: string
  verificationStatus: "verified" | "not_found" | "error"
  badges: string[]
  directorVerified: boolean
  userIsDirector: boolean
}

export interface McaCompanyData {
  cin: string
  companyName: string
  companyStatus: string
  companyCategory: string
  dateOfIncorporation: string
  authorizedCapital: number
  paidUpCapital: number
  registeredAddress: string
  directors: McaDirector[]
  lastUpdated: string
}

export interface McaDirector {
  din: string
  name: string
  designation: string
  appointmentDate: string
  status: "Active" | "Resigned" | "Disqualified"
}

class EnhancedMcaApiService {
  private baseUrl = process.env.NEXT_PUBLIC_MCA_API_URL || "https://api.mca.gov.in"
  private apiKey = process.env.MCA_API_KEY

  async verifyCompanyWithUser(
    cin: string,
    companyName: string,
    userName: string,
  ): Promise<EnhancedMcaVerificationResult> {
    try {
      // First, try to get cached data from PostgreSQL
      const cachedData = await this.getCachedMcaData(cin)

      let mcaData: McaCompanyData

      if (cachedData && this.isCacheValid(cachedData.lastUpdated)) {
        mcaData = cachedData
      } else {
        // Fetch fresh data from MCA API
        const mcaResult = await mcaApiService.verifyCompany(cin, companyName)

        if (!mcaResult.success || !mcaResult.data) {
          return {
            success: false,
            error: mcaResult.error || "Company verification failed",
            verificationStatus: mcaResult.verificationStatus,
            badges: [],
            directorVerified: false,
            userIsDirector: false,
          }
        }

        mcaData = mcaResult.data

        // Cache the data in PostgreSQL
        await this.cacheMcaData(mcaData)
      }

      // Verify if user is a director
      const userIsDirector = this.verifyUserAsDirector(mcaData.directors, userName)
      const directorInfo = mcaData.directors.find(
        (d) => d.name.toLowerCase().includes(userName.toLowerCase()) && d.status === "Active",
      )

      // Generate badges based on verification status
      const badges = this.generateBadges(mcaData, userIsDirector, directorInfo)

      // Log verification attempt
      await this.logVerificationAttempt(cin, userName, {
        success: true,
        userIsDirector,
        badges,
      })

      return {
        success: true,
        data: mcaData,
        verificationStatus: "verified",
        badges,
        directorVerified: true,
        userIsDirector,
      }
    } catch (error) {
      console.error("Enhanced MCA verification error:", error)

      // Log failed verification attempt
      await this.logVerificationAttempt(cin, userName, {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      return {
        success: false,
        error: "Failed to verify company details",
        verificationStatus: "error",
        badges: [],
        directorVerified: false,
        userIsDirector: false,
      }
    }
  }

  private async getCachedMcaData(cin: string): Promise<McaCompanyData | null> {
    try {
      // In a real implementation, this would query PostgreSQL
      // For now, we'll simulate with localStorage
      const cached = localStorage.getItem(`mca_cache_${cin}`)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error("Error getting cached MCA data:", error)
      return null
    }
  }

  private async cacheMcaData(data: McaCompanyData): Promise<void> {
    try {
      // In a real implementation, this would insert/update PostgreSQL
      // For now, we'll simulate with localStorage
      localStorage.setItem(
        `mca_cache_${data.cin}`,
        JSON.stringify({
          ...data,
          lastUpdated: new Date().toISOString(),
        }),
      )
    } catch (error) {
      console.error("Error caching MCA data:", error)
    }
  }

  private isCacheValid(lastUpdated: string): boolean {
    const cacheAge = Date.now() - new Date(lastUpdated).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    return cacheAge < maxAge
  }

  private verifyUserAsDirector(directors: McaDirector[], userName: string): boolean {
    return directors.some(
      (director) => director.name.toLowerCase().includes(userName.toLowerCase()) && director.status === "Active",
    )
  }

  private generateBadges(mcaData: McaCompanyData, userIsDirector: boolean, directorInfo?: McaDirector): string[] {
    const badges: string[] = []

    // Always add MCA Verified if company is found and active
    if (mcaData.companyStatus === "Active") {
      badges.push("MCA Verified")
    }

    // Add C-Level badge if user is verified as director
    if (userIsDirector && directorInfo) {
      const isCLevel = this.isCLevelDesignation(directorInfo.designation)
      if (isCLevel) {
        badges.push("MCA Approved C-Level")
      } else {
        badges.push("MCA Verified Director")
      }
    }

    return badges
  }

  private isCLevelDesignation(designation: string): boolean {
    const cLevelTitles = [
      "Chief Executive Officer",
      "CEO",
      "Managing Director",
      "MD",
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
    ]

    return cLevelTitles.some((title) => designation.toLowerCase().includes(title.toLowerCase()))
  }

  private async logVerificationAttempt(cin: string, userName: string, result: any): Promise<void> {
    try {
      // In a real implementation, this would insert into verification_logs table
      console.log("MCA Verification Log:", {
        cin,
        userName,
        result,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error logging verification attempt:", error)
    }
  }

  async getCompanyFinancials(cin: string): Promise<any> {
    try {
      // Mock financial data - in production, this would fetch from MCA API
      return {
        revenue: 50000000,
        profit: 8000000,
        assets: 25000000,
        liabilities: 12000000,
        year: "2023-24",
        growthRate: 15.5,
        profitMargin: 16.0,
      }
    } catch (error) {
      console.error("Financial data error:", error)
      return null
    }
  }

  async validateCIN(cin: string): Promise<boolean> {
    // Validate CIN format: LNNNNNAAMMMMMCCCCCCC
    const cinRegex = /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/
    return cinRegex.test(cin)
  }

  async searchCompaniesByName(companyName: string): Promise<any[]> {
    try {
      // Mock search results - in production, this would search MCA database
      const mockResults = [
        {
          cin: "U72900KA2020PTC134567",
          name: "TechCorp Solutions Private Limited",
          status: "Active",
          state: "Karnataka",
        },
        {
          cin: "U65999MH2019PTC325678",
          name: "Demo Corporation Private Limited",
          status: "Active",
          state: "Maharashtra",
        },
      ]

      return mockResults.filter((company) => company.name.toLowerCase().includes(companyName.toLowerCase()))
    } catch (error) {
      console.error("Company search error:", error)
      return []
    }
  }
}

export const enhancedMcaApiService = new EnhancedMcaApiService()

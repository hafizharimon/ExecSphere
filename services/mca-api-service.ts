// MCA (Ministry of Corporate Affairs) API Integration Service
// Real API integration for Indian company verification

export interface MCACompanyData {
  cin: string
  companyName: string
  companyStatus: string
  companyCategory: string
  companySubCategory: string
  classOfCompany: string
  dateOfIncorporation: string
  registeredAddress: string
  authorizedCapital: number
  paidUpCapital: number
  listedStatus: string
  directors: MCADirector[]
  lastUpdated: string
}

export interface MCADirector {
  din: string
  name: string
  designation: string
  appointmentDate: string
  cessationDate?: string
  status: "Active" | "Resigned" | "Disqualified"
}

export interface MCAVerificationResult {
  success: boolean
  data?: MCACompanyData
  error?: string
  verificationStatus: "verified" | "not_found" | "error"
  directorVerified: boolean
  userIsDirector: boolean
  badges: string[]
}

class MCAApiService {
  private baseUrl = "https://api.mca.gov.in/v1" // Official MCA API endpoint
  private apiKey = process.env.MCA_API_KEY
  private clientId = process.env.MCA_CLIENT_ID
  private clientSecret = process.env.MCA_CLIENT_SECRET

  async verifyCompany(cinNumber: string, companyName: string, userName?: string): Promise<MCAVerificationResult> {
    try {
      // Validate CIN format
      if (!this.validateCIN(cinNumber)) {
        return {
          success: false,
          error: "Invalid CIN format",
          verificationStatus: "error",
          directorVerified: false,
          userIsDirector: false,
          badges: [],
        }
      }

      // Check cache first
      const cachedData = await this.getCachedMCAData(cinNumber)
      if (cachedData && this.isCacheValid(cachedData.lastUpdated)) {
        return this.processVerificationResult(cachedData, userName)
      }

      // Fetch from MCA API
      const mcaData = await this.fetchFromMCAAPI(cinNumber)

      if (!mcaData) {
        return {
          success: false,
          error: "Company not found in MCA records",
          verificationStatus: "not_found",
          directorVerified: false,
          userIsDirector: false,
          badges: [],
        }
      }

      // Cache the data
      await this.cacheMCAData(mcaData)

      return this.processVerificationResult(mcaData, userName)
    } catch (error) {
      console.error("MCA verification error:", error)
      return {
        success: false,
        error: "MCA verification service unavailable",
        verificationStatus: "error",
        directorVerified: false,
        userIsDirector: false,
        badges: [],
      }
    }
  }

  private async fetchFromMCAAPI(cinNumber: string): Promise<MCACompanyData | null> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken()

      if (!accessToken) {
        throw new Error("Failed to get MCA API access token")
      }

      // Fetch company master data
      const companyResponse = await fetch(`${this.baseUrl}/company/${cinNumber}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey || "",
        },
      })

      if (!companyResponse.ok) {
        if (companyResponse.status === 404) {
          return null // Company not found
        }
        throw new Error(`MCA API error: ${companyResponse.status}`)
      }

      const companyData = await companyResponse.json()

      // Fetch directors data
      const directorsResponse = await fetch(`${this.baseUrl}/company/${cinNumber}/directors`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey || "",
        },
      })

      let directors: MCADirector[] = []
      if (directorsResponse.ok) {
        const directorsData = await directorsResponse.json()
        directors = this.parseDirectorsData(directorsData)
      }

      return {
        cin: companyData.cin,
        companyName: companyData.companyName,
        companyStatus: companyData.companyStatus,
        companyCategory: companyData.companyCategory,
        companySubCategory: companyData.companySubCategory,
        classOfCompany: companyData.classOfCompany,
        dateOfIncorporation: companyData.dateOfIncorporation,
        registeredAddress: companyData.registeredAddress,
        authorizedCapital: companyData.authorizedCapital,
        paidUpCapital: companyData.paidUpCapital,
        listedStatus: companyData.listedStatus,
        directors,
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("MCA API fetch error:", error)
      return null
    }
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
        }),
      })

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`)
      }

      const tokenData = await response.json()
      return tokenData.access_token
    } catch (error) {
      console.error("MCA token error:", error)
      return null
    }
  }

  private parseDirectorsData(directorsData: any): MCADirector[] {
    if (!directorsData || !Array.isArray(directorsData.directors)) {
      return []
    }

    return directorsData.directors.map((director: any) => ({
      din: director.din || "",
      name: director.directorName || "",
      designation: director.designation || "",
      appointmentDate: director.appointmentDate || "",
      cessationDate: director.cessationDate || undefined,
      status: this.determineDirectorStatus(director),
    }))
  }

  private determineDirectorStatus(director: any): "Active" | "Resigned" | "Disqualified" {
    if (director.cessationDate) {
      return "Resigned"
    }
    if (director.disqualificationStatus === "Yes") {
      return "Disqualified"
    }
    return "Active"
  }

  private processVerificationResult(mcaData: MCACompanyData, userName?: string): MCAVerificationResult {
    const badges: string[] = []
    let userIsDirector = false
    let directorVerified = false

    // Add MCA Verified badge if company is active
    if (mcaData.companyStatus === "Active") {
      badges.push("MCA Verified")
      directorVerified = true
    }

    // Check if user is a director
    if (userName) {
      const userDirector = mcaData.directors.find(
        (director) => director.name.toLowerCase().includes(userName.toLowerCase()) && director.status === "Active",
      )

      if (userDirector) {
        userIsDirector = true

        // Check if it's a C-level position
        if (this.isCLevelDesignation(userDirector.designation)) {
          badges.push("MCA Approved C-Level")
        } else {
          badges.push("MCA Verified Director")
        }
      }
    }

    return {
      success: true,
      data: mcaData,
      verificationStatus: "verified",
      directorVerified,
      userIsDirector,
      badges,
    }
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
      "Chief Data Officer",
      "CDO",
      "Chief Revenue Officer",
      "CRO",
      "Executive Director",
      "President",
      "Vice President",
      "VP",
    ]

    return cLevelTitles.some((title) => designation.toLowerCase().includes(title.toLowerCase()))
  }

  private validateCIN(cin: string): boolean {
    // CIN format: LNNNNNAAMMMMMCCCCCCC (21 characters)
    // L = Listing status, N = Class of company, A = State code, M = Month/Year, C = Company number
    const cinRegex = /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/
    return cinRegex.test(cin)
  }

  private async getCachedMCAData(cinNumber: string): Promise<MCACompanyData | null> {
    try {
      const response = await fetch(`/api/mca-cache/${cinNumber}`)
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error("Cache fetch error:", error)
      return null
    }
  }

  private async cacheMCAData(data: MCACompanyData): Promise<void> {
    try {
      await fetch("/api/mca-cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Cache save error:", error)
    }
  }

  private isCacheValid(lastUpdated: string): boolean {
    const cacheAge = Date.now() - new Date(lastUpdated).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    return cacheAge < maxAge
  }

  // Public method to search companies by name
  async searchCompaniesByName(companyName: string): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken()

      if (!accessToken) {
        throw new Error("Failed to get access token")
      }

      const response = await fetch(`${this.baseUrl}/company/search?name=${encodeURIComponent(companyName)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey || "",
        },
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const searchResults = await response.json()
      return searchResults.companies || []
    } catch (error) {
      console.error("Company search error:", error)
      return []
    }
  }

  // Get company financial data
  async getCompanyFinancials(cinNumber: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken()

      if (!accessToken) {
        return null
      }

      const response = await fetch(`${this.baseUrl}/company/${cinNumber}/financials`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey || "",
        },
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error("Financial data error:", error)
      return null
    }
  }
}

export const mcaApiService = new MCAApiService()

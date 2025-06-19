// Udyam Registration API Service for MSME verification

export interface UdyamData {
  udyamNumber: string
  enterpriseName: string
  enterpriseType: string
  majorActivity: string
  nic2DigitCode: string
  nic4DigitCode: string
  nic5DigitCode: string
  dateOfIncorporation: string
  dateOfCommencement: string
  dateOfUdyamRegistration: string
  socialCategory: string
  gender: string
  physicallyHandicapped: string
  location: {
    state: string
    district: string
    block: string
    village: string
    pincode: string
  }
  plantMachinery: {
    investment: number
    currency: string
  }
  turnover: {
    amount: number
    currency: string
    year: string
  }
  employment: {
    male: number
    female: number
    others: number
    total: number
  }
  bankDetails: {
    accountNumber: string
    ifscCode: string
    bankName: string
    branchName: string
  }
  promoterDetails: {
    name: string
    gender: string
    socialCategory: string
    aadhaarNumber: string
    panNumber: string
  }[]
}

export interface UdyamVerificationResult {
  success: boolean
  data?: UdyamData
  error?: string
  verificationStatus: "verified" | "not_found" | "error"
  badges: string[]
}

class UdyamApiService {
  private baseUrl = "https://udyamregistration.gov.in/api/v1"
  private apiKey = process.env.UDYAM_API_KEY
  private clientId = process.env.UDYAM_CLIENT_ID

  async verifyUdyam(udyamNumber: string): Promise<UdyamVerificationResult> {
    try {
      // Validate Udyam number format
      if (!this.validateUdyamNumber(udyamNumber)) {
        return {
          success: false,
          error: "Invalid Udyam registration number format",
          verificationStatus: "error",
          badges: [],
        }
      }

      // Check cache first
      const cachedData = await this.getCachedUdyamData(udyamNumber)
      if (cachedData && this.isCacheValid(cachedData.lastUpdated)) {
        return this.processVerificationResult(cachedData)
      }

      // Fetch from Udyam API
      const udyamData = await this.fetchFromUdyamAPI(udyamNumber)

      if (!udyamData) {
        return {
          success: false,
          error: "Enterprise not found in Udyam records",
          verificationStatus: "not_found",
          badges: [],
        }
      }

      // Cache the data
      await this.cacheUdyamData(udyamData)

      return this.processVerificationResult(udyamData)
    } catch (error) {
      console.error("Udyam verification error:", error)
      return {
        success: false,
        error: "Udyam verification service unavailable",
        verificationStatus: "error",
        badges: [],
      }
    }
  }

  private async fetchFromUdyamAPI(udyamNumber: string): Promise<UdyamData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/${udyamNumber}`, {
        headers: {
          "X-API-Key": this.apiKey || "",
          "Client-ID": this.clientId || "",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null // Enterprise not found
        }
        throw new Error(`Udyam API error: ${response.status}`)
      }

      const data = await response.json()
      return this.parseUdyamData(data)
    } catch (error) {
      console.error("Udyam API fetch error:", error)
      return null
    }
  }

  private parseUdyamData(apiData: any): UdyamData {
    return {
      udyamNumber: apiData.udyamRegistrationNumber,
      enterpriseName: apiData.enterpriseName,
      enterpriseType: apiData.enterpriseType,
      majorActivity: apiData.majorActivity,
      nic2DigitCode: apiData.nic2DigitCode,
      nic4DigitCode: apiData.nic4DigitCode,
      nic5DigitCode: apiData.nic5DigitCode,
      dateOfIncorporation: apiData.dateOfIncorporation,
      dateOfCommencement: apiData.dateOfCommencement,
      dateOfUdyamRegistration: apiData.dateOfUdyamRegistration,
      socialCategory: apiData.socialCategory,
      gender: apiData.gender,
      physicallyHandicapped: apiData.physicallyHandicapped,
      location: {
        state: apiData.location?.state || "",
        district: apiData.location?.district || "",
        block: apiData.location?.block || "",
        village: apiData.location?.village || "",
        pincode: apiData.location?.pincode || "",
      },
      plantMachinery: {
        investment: apiData.plantMachinery?.investment || 0,
        currency: "INR",
      },
      turnover: {
        amount: apiData.turnover?.amount || 0,
        currency: "INR",
        year: apiData.turnover?.year || new Date().getFullYear().toString(),
      },
      employment: {
        male: apiData.employment?.male || 0,
        female: apiData.employment?.female || 0,
        others: apiData.employment?.others || 0,
        total: apiData.employment?.total || 0,
      },
      bankDetails: {
        accountNumber: apiData.bankDetails?.accountNumber || "",
        ifscCode: apiData.bankDetails?.ifscCode || "",
        bankName: apiData.bankDetails?.bankName || "",
        branchName: apiData.bankDetails?.branchName || "",
      },
      promoterDetails: apiData.promoterDetails || [],
    }
  }

  private processVerificationResult(udyamData: UdyamData): UdyamVerificationResult {
    const badges: string[] = []

    // Add Udyam verified badge
    badges.push("Udyam Verified")

    // Add MSME category badge based on investment and turnover
    const msmeCategory = this.determineMSMECategory(udyamData)
    if (msmeCategory) {
      badges.push(`MSME ${msmeCategory}`)
    }

    // Add sector-specific badge
    if (udyamData.majorActivity) {
      badges.push(`${udyamData.majorActivity} Sector`)
    }

    return {
      success: true,
      data: udyamData,
      verificationStatus: "verified",
      badges,
    }
  }

  private determineMSMECategory(udyamData: UdyamData): string {
    const investment = udyamData.plantMachinery.investment
    const turnover = udyamData.turnover.amount

    // Manufacturing enterprises
    if (udyamData.enterpriseType.toLowerCase().includes("manufacturing")) {
      if (investment <= 2500000 && turnover <= 5000000) {
        // 25 lakh investment, 5 crore turnover
        return "Micro Manufacturing"
      } else if (investment <= 100000000 && turnover <= 500000000) {
        // 10 crore investment, 50 crore turnover
        return "Small Manufacturing"
      } else if (investment <= 500000000 && turnover <= 2500000000) {
        // 50 crore investment, 250 crore turnover
        return "Medium Manufacturing"
      }
    }

    // Service enterprises
    if (investment <= 1000000 && turnover <= 5000000) {
      // 10 lakh investment, 5 crore turnover
      return "Micro Service"
    } else if (investment <= 20000000 && turnover <= 500000000) {
      // 2 crore investment, 50 crore turnover
      return "Small Service"
    } else if (investment <= 100000000 && turnover <= 2500000000) {
      // 10 crore investment, 250 crore turnover
      return "Medium Service"
    }

    return "MSME"
  }

  private validateUdyamNumber(udyamNumber: string): boolean {
    // Udyam number format: UDYAM-XX-XX-XXXXXXX
    // XX = State code, XX = District code, XXXXXXX = Sequential number
    const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/
    return udyamRegex.test(udyamNumber)
  }

  private async getCachedUdyamData(udyamNumber: string): Promise<any> {
    try {
      const response = await fetch(`/api/udyam-cache/${udyamNumber}`)
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error("Udyam cache fetch error:", error)
      return null
    }
  }

  private async cacheUdyamData(data: UdyamData): Promise<void> {
    try {
      await fetch("/api/udyam-cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          lastUpdated: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Udyam cache save error:", error)
    }
  }

  private isCacheValid(lastUpdated: string): boolean {
    const cacheAge = Date.now() - new Date(lastUpdated).getTime()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    return cacheAge < maxAge
  }

  // Search enterprises by name
  async searchEnterprisesByName(enterpriseName: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/search?name=${encodeURIComponent(enterpriseName)}`, {
        headers: {
          "X-API-Key": this.apiKey || "",
          "Client-ID": this.clientId || "",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const searchResults = await response.json()
      return searchResults.enterprises || []
    } catch (error) {
      console.error("Enterprise search error:", error)
      return []
    }
  }
}

export const udyamApiService = new UdyamApiService()

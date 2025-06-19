// MCA Verification Service for legal entity verification

export interface McaVerificationData {
  cin: string
  companyName: string
  companyStatus: string
  companyCategory: string
  dateOfIncorporation: string
  registeredAddress: string
  authorizedCapital: number
  paidUpCapital: number
  directors: McaDirector[]
}

export interface McaDirector {
  din: string
  name: string
  designation: string
  appointmentDate: string
  status: "Active" | "Resigned" | "Disqualified"
}

export interface McaVerificationResult {
  success: boolean
  data?: McaVerificationData
  error?: string
  otpRequired?: boolean
  sessionId?: string
}

class McaVerificationService {
  private baseUrl = process.env.NEXT_PUBLIC_MCA_API_URL || "https://api.mca.gov.in"
  private apiKey = process.env.MCA_API_KEY

  async verifyCompany(cin: string, companyName: string): Promise<McaVerificationResult> {
    try {
      // Validate CIN format
      if (!this.validateCIN(cin)) {
        return {
          success: false,
          error: "Invalid CIN format",
        }
      }

      // Simulate MCA API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock successful verification for demo CINs
      const mockCompanies: Record<string, McaVerificationData> = {
        U72900KA2020PTC134567: {
          cin: "U72900KA2020PTC134567",
          companyName: "TechCorp Solutions Private Limited",
          companyStatus: "Active",
          companyCategory: "Company limited by shares",
          dateOfIncorporation: "2020-01-15",
          registeredAddress: "Bangalore, Karnataka, India",
          authorizedCapital: 10000000,
          paidUpCapital: 5000000,
          directors: [
            {
              din: "08123456",
              name: "Rajesh Kumar",
              designation: "Managing Director",
              appointmentDate: "2020-01-15",
              status: "Active",
            },
            {
              din: "08234567",
              name: "Priya Sharma",
              designation: "Director",
              appointmentDate: "2020-01-15",
              status: "Active",
            },
          ],
        },
      }

      const companyData = mockCompanies[cin]

      if (companyData && companyData.companyName.toLowerCase().includes(companyName.toLowerCase())) {
        return {
          success: true,
          data: companyData,
        }
      } else {
        return {
          success: false,
          error: "Company not found or name mismatch",
        }
      }
    } catch (error) {
      console.error("MCA verification error:", error)
      return {
        success: false,
        error: "MCA verification service unavailable",
      }
    }
  }

  async sendOTP(cin: string, mobile: string): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        sessionId: `mca_session_${Date.now()}`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to send OTP",
      }
    }
  }

  async verifyOTP(sessionId: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Accept any 6-digit OTP for demo
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        return { success: true }
      } else {
        return {
          success: false,
          error: "Invalid OTP",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "OTP verification failed",
      }
    }
  }

  private validateCIN(cin: string): boolean {
    // CIN format: LNNNNNAAMMMMMCCCCCCC
    const cinRegex = /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/
    return cinRegex.test(cin)
  }

  async getCompanyFinancials(cin: string): Promise<any> {
    try {
      // Mock financial data
      return {
        revenue: 50000000,
        profit: 8000000,
        assets: 25000000,
        liabilities: 12000000,
        year: "2023-24",
      }
    } catch (error) {
      console.error("Financial data error:", error)
      return null
    }
  }
}

export const mcaVerificationService = new McaVerificationService()

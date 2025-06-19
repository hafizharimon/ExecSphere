// Udyam Verification Service for MSME registration verification

export interface UdyamVerificationData {
  udyamNumber: string
  enterpriseName: string
  enterpriseType: string
  majorActivity: string
  dateOfIncorporation: string
  dateOfCommencementOfBusiness: string
  address: string
  state: string
  district: string
  pincode: string
  mobile: string
  email: string
  investment: number
  turnover: number
  employmentMale: number
  employmentFemale: number
  employmentOthers: number
  status: string
}

export interface UdyamVerificationResult {
  success: boolean
  data?: UdyamVerificationData
  error?: string
  otpRequired?: boolean
  sessionId?: string
}

class UdyamVerificationService {
  private baseUrl = process.env.NEXT_PUBLIC_UDYAM_API_URL || "https://udyamregistration.gov.in/api"
  private apiKey = process.env.UDYAM_API_KEY

  async verifyUdyam(udyamNumber: string): Promise<UdyamVerificationResult> {
    try {
      // Validate Udyam number format
      if (!this.validateUdyamNumber(udyamNumber)) {
        return {
          success: false,
          error: "Invalid Udyam registration number format",
        }
      }

      // Simulate Udyam API call
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Mock successful verification for demo Udyam numbers
      const mockEnterprises: Record<string, UdyamVerificationData> = {
        "UDYAM-KA-03-0123456": {
          udyamNumber: "UDYAM-KA-03-0123456",
          enterpriseName: "TechCorp Solutions",
          enterpriseType: "Manufacturing",
          majorActivity: "Software Development",
          dateOfIncorporation: "2020-01-15",
          dateOfCommencementOfBusiness: "2020-02-01",
          address: "123 Tech Park, Bangalore",
          state: "Karnataka",
          district: "Bangalore Urban",
          pincode: "560001",
          mobile: "9876543210",
          email: "info@techcorp.com",
          investment: 2500000,
          turnover: 15000000,
          employmentMale: 25,
          employmentFemale: 15,
          employmentOthers: 0,
          status: "Active",
        },
        "UDYAM-MH-02-0234567": {
          udyamNumber: "UDYAM-MH-02-0234567",
          enterpriseName: "Demo MSME Corp",
          enterpriseType: "Service",
          majorActivity: "IT Services",
          dateOfIncorporation: "2019-03-20",
          dateOfCommencementOfBusiness: "2019-04-01",
          address: "456 Business Center, Mumbai",
          state: "Maharashtra",
          district: "Mumbai",
          pincode: "400001",
          mobile: "9876543211",
          email: "info@demomsme.com",
          investment: 1500000,
          turnover: 8000000,
          employmentMale: 15,
          employmentFemale: 10,
          employmentOthers: 0,
          status: "Active",
        },
      }

      const enterpriseData = mockEnterprises[udyamNumber]

      if (enterpriseData) {
        return {
          success: true,
          data: enterpriseData,
        }
      } else {
        return {
          success: false,
          error: "Udyam registration not found",
        }
      }
    } catch (error) {
      console.error("Udyam verification error:", error)
      return {
        success: false,
        error: "Udyam verification service unavailable",
      }
    }
  }

  async sendOTP(
    udyamNumber: string,
    mobile: string,
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        sessionId: `udyam_session_${Date.now()}`,
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

  private validateUdyamNumber(udyamNumber: string): boolean {
    // Udyam format: UDYAM-SS-NN-NNNNNNN
    const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/
    return udyamRegex.test(udyamNumber)
  }

  async getEnterpriseDetails(udyamNumber: string): Promise<any> {
    try {
      const result = await this.verifyUdyam(udyamNumber)
      return result.data
    } catch (error) {
      console.error("Enterprise details error:", error)
      return null
    }
  }

  getMSMECategory(investment: number, turnover: number): string {
    // Manufacturing enterprises
    if (investment <= 1000000 && turnover <= 5000000) {
      return "Micro"
    } else if (investment <= 10000000 && turnover <= 50000000) {
      return "Small"
    } else if (investment <= 50000000 && turnover <= 250000000) {
      return "Medium"
    }

    return "Large"
  }
}

export const udyamVerificationService = new UdyamVerificationService()

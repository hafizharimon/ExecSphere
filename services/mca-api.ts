// MCA (Ministry of Corporate Affairs) API Integration Service
// Note: This is a mock implementation. In production, you would integrate with actual MCA APIs

export interface McaCompanyData {
  cin: string
  companyName: string
  companyStatus: string
  companyCategory: string
  companySubCategory: string
  classOfCompany: string
  dateOfIncorporation: string
  registeredOfficeAddress: string
  authorizedCapital: number
  paidUpCapital: number
  directors: McaDirector[]
  lastAnnualReturnDate?: string
  lastBalanceSheetDate?: string
}

export interface McaDirector {
  din: string
  name: string
  designation: string
  appointmentDate: string
  surrenderDate?: string
  status: "Active" | "Resigned" | "Disqualified"
}

export interface McaVerificationResult {
  success: boolean
  data?: McaCompanyData
  error?: string
  verificationStatus: "verified" | "not_found" | "error"
}

class McaApiService {
  private baseUrl = process.env.NEXT_PUBLIC_MCA_API_URL || "https://api.mca.gov.in"
  private apiKey = process.env.MCA_API_KEY

  async verifyCompany(cin: string, companyName: string): Promise<McaVerificationResult> {
    try {
      // In production, this would make actual API calls to MCA
      // For demo purposes, we'll simulate the response

      if (!cin || !companyName) {
        return {
          success: false,
          error: "CIN and company name are required",
          verificationStatus: "error",
        }
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful verification for demo CINs
      const mockCompanies: Record<string, McaCompanyData> = {
        U72900KA2020PTC134567: {
          cin: "U72900KA2020PTC134567",
          companyName: "TechCorp Solutions Private Limited",
          companyStatus: "Active",
          companyCategory: "Company limited by shares",
          companySubCategory: "Non-government company",
          classOfCompany: "Private",
          dateOfIncorporation: "2020-01-15",
          registeredOfficeAddress: "Bangalore, Karnataka, India",
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
            {
              din: "08345678",
              name: "Amit Patel",
              designation: "Director",
              appointmentDate: "2020-06-10",
              status: "Active",
            },
          ],
          lastAnnualReturnDate: "2023-12-31",
          lastBalanceSheetDate: "2023-03-31",
        },
        U65999MH2019PTC325678: {
          cin: "U65999MH2019PTC325678",
          companyName: "Demo Corporation Private Limited",
          companyStatus: "Active",
          companyCategory: "Company limited by shares",
          companySubCategory: "Non-government company",
          classOfCompany: "Private",
          dateOfIncorporation: "2019-03-20",
          registeredOfficeAddress: "Mumbai, Maharashtra, India",
          authorizedCapital: 5000000,
          paidUpCapital: 2500000,
          directors: [
            {
              din: "08456789",
              name: "Demo Executive",
              designation: "Managing Director",
              appointmentDate: "2019-03-20",
              status: "Active",
            },
            {
              din: "08567890",
              name: "Jane Smith",
              designation: "Director",
              appointmentDate: "2019-03-20",
              status: "Active",
            },
          ],
          lastAnnualReturnDate: "2023-12-31",
          lastBalanceSheetDate: "2023-03-31",
        },
        U99999MH1917PTC000478: {
          cin: "U99999MH1917PTC000478",
          companyName: "Tata Sons Private Limited",
          companyStatus: "Active",
          companyCategory: "Company limited by shares",
          companySubCategory: "Non-government company",
          classOfCompany: "Private",
          dateOfIncorporation: "1917-11-08",
          registeredOfficeAddress: "Bombay House, 24 Homi Mody Street, Mumbai, Maharashtra, India",
          authorizedCapital: 35000000000,
          paidUpCapital: 27500000000,
          directors: [
            {
              din: "00121863",
              name: "N. Chandrasekaran",
              designation: "Chairman",
              appointmentDate: "2017-02-21",
              status: "Active",
            },
            {
              din: "00024713",
              name: "Noel Tata",
              designation: "Director",
              appointmentDate: "2010-06-10",
              status: "Active",
            },
            {
              din: "00121454",
              name: "Bhaskar Bhat",
              designation: "Director",
              appointmentDate: "2017-04-01",
              status: "Active",
            },
            {
              din: "00010812",
              name: "Harish Manwani",
              designation: "Independent Director",
              appointmentDate: "2018-05-01",
              status: "Active",
            },
            {
              din: "00548091",
              name: "Ajay Piramal",
              designation: "Independent Director",
              appointmentDate: "2016-08-25",
              status: "Active",
            },
          ],
          lastAnnualReturnDate: "2023-09-30",
          lastBalanceSheetDate: "2023-03-31",
        },
      }

      const companyData = mockCompanies[cin]

      if (companyData && companyData.companyName.toLowerCase().includes(companyName.toLowerCase())) {
        return {
          success: true,
          data: companyData,
          verificationStatus: "verified",
        }
      } else {
        return {
          success: false,
          error: "Company not found or name mismatch",
          verificationStatus: "not_found",
        }
      }
    } catch (error) {
      console.error("MCA API Error:", error)
      return {
        success: false,
        error: "Failed to verify company details",
        verificationStatus: "error",
      }
    }
  }

  async verifyDirector(din: string, name: string, cin: string): Promise<boolean> {
    try {
      const companyResult = await this.verifyCompany(cin, "")

      if (companyResult.success && companyResult.data) {
        const director = companyResult.data.directors.find(
          (d) => d.din === din || d.name.toLowerCase().includes(name.toLowerCase()),
        )

        return director?.status === "Active" || false
      }

      return false
    } catch (error) {
      console.error("Director verification error:", error)
      return false
    }
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

export const mcaApiService = new McaApiService()

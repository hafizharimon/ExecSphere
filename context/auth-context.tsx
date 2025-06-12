"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: string
  organization: string
  industry: string
  isVerified: boolean
  mcaVerified?: boolean
  directorVerified?: boolean
  userType: "super-admin" | "admin" | "cxo" | "mentor" | "pending"
  profilePicture?: string
  linkedinProfile?: string
  companyLinkedInPage?: string
  legalEntityName?: string
  cinNumber?: string
  registrationDate?: string
  lastLogin?: string
  privileges?: string[]
  premiumStatus?: "free" | "premium"
  autoGrade?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, otp: string) => Promise<boolean>
  logout: () => void
  register: (data: any) => Promise<{ success: boolean; paymentUrl?: string }>
  sendOTP: (target: string, type: "email" | "sms" | "aadhaar") => Promise<boolean>
  verifyPayment: (paymentId: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for different user types
const mockUsers: Record<string, User> = {
  "test@demo.com": {
    id: "super-admin-1",
    name: "Super Admin",
    email: "test@demo.com",
    role: "Super Admin",
    organization: "ExecSphere Platform",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    directorVerified: true,
    userType: "super-admin",
    registrationDate: "2024-01-01",
    lastLogin: new Date().toISOString(),
    privileges: ["all"],
    premiumStatus: "premium",
    autoGrade: "A+",
  },
  "admin@demo.com": {
    id: "admin-1",
    name: "Platform Admin",
    email: "admin@demo.com",
    role: "Administrator",
    organization: "ExecSphere Platform",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    directorVerified: true,
    userType: "admin",
    registrationDate: "2024-01-01",
    lastLogin: new Date().toISOString(),
    privileges: ["moderation", "user-management"],
    premiumStatus: "premium",
    autoGrade: "A+",
  },
  "cxo@demo.com": {
    id: "cxo-1",
    name: "Rajesh Kumar",
    email: "cxo@demo.com",
    role: "CEO",
    organization: "TechCorp Solutions",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    directorVerified: true,
    userType: "cxo",
    linkedinProfile: "https://linkedin.com/in/rajesh-kumar",
    companyLinkedInPage: "https://linkedin.com/company/techcorp-solutions",
    legalEntityName: "TechCorp Solutions Private Limited",
    cinNumber: "U72900KA2020PTC134567",
    registrationDate: "2024-01-15",
    lastLogin: new Date().toISOString(),
    privileges: ["networking", "mentorship", "events", "analytics"],
    premiumStatus: "premium",
    autoGrade: "A+",
  },
  "mentor@demo.com": {
    id: "mentor-1",
    name: "Sarah Chen",
    email: "mentor@demo.com",
    role: "CTO",
    organization: "InnovateTech",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    directorVerified: true,
    userType: "mentor",
    linkedinProfile: "https://linkedin.com/in/sarah-chen",
    companyLinkedInPage: "https://linkedin.com/company/innovatetech",
    legalEntityName: "InnovateTech Solutions Private Limited",
    cinNumber: "U72900MH2019PTC234567",
    registrationDate: "2024-01-10",
    lastLogin: new Date().toISOString(),
    privileges: ["networking", "mentorship", "events"],
    premiumStatus: "premium",
    autoGrade: "A",
  },
  "pending@demo.com": {
    id: "pending-1",
    name: "David Wilson",
    email: "pending@demo.com",
    role: "CMO",
    organization: "Marketing Pro",
    industry: "Marketing",
    isVerified: false,
    mcaVerified: false,
    directorVerified: false,
    userType: "pending",
    linkedinProfile: "https://linkedin.com/in/david-wilson",
    registrationDate: "2024-01-20",
    privileges: [],
    premiumStatus: "free",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("execsphere-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("execsphere-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validate OTP format (demo: AZ47E5)
      const otpPattern = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]$/
      if (!otpPattern.test(otp)) {
        return false
      }

      // Check if user exists in mock data
      const userData = mockUsers[email.toLowerCase()]
      if (!userData) {
        return false
      }

      // Update last login
      const updatedUser = {
        ...userData,
        lastLogin: new Date().toISOString(),
      }

      setUser(updatedUser)
      localStorage.setItem("execsphere-user", JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("execsphere-user")
  }

  const register = async (data: any): Promise<{ success: boolean; paymentUrl?: string }> => {
    try {
      // Simulate registration process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful registration
      return {
        success: true,
        paymentUrl: "https://payment.demo.com/pay/12345",
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false }
    }
  }

  const sendOTP = async (target: string, type: "email" | "sms" | "aadhaar"): Promise<boolean> => {
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(`Sending ${type} OTP to ${target}`)
      return true
    } catch (error) {
      console.error("Send OTP error:", error)
      return false
    }
  }

  const verifyPayment = async (paymentId: string): Promise<boolean> => {
    try {
      // Simulate payment verification
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("Payment verification error:", error)
      return false
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    sendOTP,
    verifyPayment,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

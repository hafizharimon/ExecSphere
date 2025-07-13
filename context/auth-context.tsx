"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { vercelAnalytics } from "@/services/vercel-analytics-service"

interface User {
  id: string
  name: string
  email: string
  role: "super_admin" | "admin" | "cxo" | "mentor" | "pending"
  avatar?: string
  company?: string
  title?: string
  isVerified: boolean
  badges: string[]
  registrationStatus: "pending" | "approved" | "rejected"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>
  loginWithOTP: (email: string, otp: string) => Promise<{ success: boolean; user?: User; error?: string }>
  loginWithLinkedIn: () => Promise<{ success: boolean; user?: User; error?: string }>
  register: (data: any) => Promise<{ success: boolean; paymentUrl?: string; error?: string }>
  sendOTP: (target: string, type: "email" | "sms" | "aadhaar") => Promise<boolean>
  verifyPayment: (paymentId: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for different roles
const demoUsers: Record<string, User> = {
  "admin@execsphere.com": {
    id: "admin-1",
    name: "Admin User",
    email: "admin@execsphere.com",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    company: "ExecSphere",
    title: "Platform Administrator",
    isVerified: true,
    badges: ["Admin", "Verified"],
    registrationStatus: "approved",
  },
  "superadmin@execsphere.com": {
    id: "superadmin-1",
    name: "Super Admin",
    email: "superadmin@execsphere.com",
    role: "super_admin",
    avatar: "/placeholder-user.jpg",
    company: "ExecSphere",
    title: "Super Administrator",
    isVerified: true,
    badges: ["Super Admin", "Verified", "Founder"],
    registrationStatus: "approved",
  },
  "ceo@techcorp.com": {
    id: "ceo-1",
    name: "Rajesh Kumar",
    email: "ceo@techcorp.com",
    role: "cxo",
    avatar: "/placeholder-user.jpg",
    company: "TechCorp Solutions",
    title: "Chief Executive Officer",
    isVerified: true,
    badges: ["CEO", "MCA Verified", "LinkedIn Verified"],
    registrationStatus: "approved",
  },
  "mentor@consulting.com": {
    id: "mentor-1",
    name: "Dr. Priya Sharma",
    email: "mentor@consulting.com",
    role: "mentor",
    avatar: "/placeholder-user.jpg",
    company: "Strategic Consulting",
    title: "Senior Business Consultant",
    isVerified: true,
    badges: ["Mentor", "Expert", "Top Rated"],
    registrationStatus: "approved",
  },
  "pending@newcompany.com": {
    id: "pending-1",
    name: "Amit Patel",
    email: "pending@newcompany.com",
    role: "pending",
    avatar: "/placeholder-user.jpg",
    company: "New Startup Inc",
    title: "Founder & CEO",
    isVerified: false,
    badges: [],
    registrationStatus: "pending",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("execsphere_user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)

      // Initialize analytics with user context
      vercelAnalytics.initialize({
        userId: userData.id,
        userRole: userData.role,
        userCompany: userData.company,
        isVerified: userData.isVerified,
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password?: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = demoUsers[email.toLowerCase()]
      if (userData) {
        setUser(userData)
        localStorage.setItem("execsphere_user", JSON.stringify(userData))

        // Track login
        vercelAnalytics.initialize({
          userId: userData.id,
          userRole: userData.role,
          userCompany: userData.company,
          isVerified: userData.isVerified,
        })

        vercelAnalytics.trackEvent("login_success", {
          login_method: "email_password",
          user_role: userData.role,
          user_verified: userData.isVerified,
        })

        return { success: true, user: userData }
      } else {
        vercelAnalytics.trackError("login_failed", "Invalid credentials", "email_password")
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      vercelAnalytics.trackError("login_error", error?.toString() || "Unknown error", "email_password")
      return { success: false, error: "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithOTP = async (email: string, otp: string) => {
    setIsLoading(true)
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Accept any 6-digit OTP for demo
      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        const userData = demoUsers[email.toLowerCase()]
        if (userData) {
          setUser(userData)
          localStorage.setItem("execsphere_user", JSON.stringify(userData))

          vercelAnalytics.initialize({
            userId: userData.id,
            userRole: userData.role,
            userCompany: userData.company,
            isVerified: userData.isVerified,
          })

          vercelAnalytics.trackEvent("login_success", {
            login_method: "otp",
            user_role: userData.role,
          })

          return { success: true, user: userData }
        }
      }

      vercelAnalytics.trackError("otp_login_failed", "Invalid OTP", "otp_verification")
      return { success: false, error: "Invalid OTP" }
    } catch (error) {
      vercelAnalytics.trackError("otp_login_error", error?.toString() || "Unknown error")
      return { success: false, error: "OTP verification failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithLinkedIn = async () => {
    setIsLoading(true)
    try {
      // Simulate LinkedIn OAuth
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Return demo CEO user for LinkedIn login
      const userData = demoUsers["ceo@techcorp.com"]
      setUser(userData)
      localStorage.setItem("execsphere_user", JSON.stringify(userData))

      vercelAnalytics.initialize({
        userId: userData.id,
        userRole: userData.role,
        userCompany: userData.company,
        isVerified: userData.isVerified,
      })

      vercelAnalytics.trackEvent("login_success", {
        login_method: "linkedin",
        user_role: userData.role,
      })

      return { success: true, user: userData }
    } catch (error) {
      vercelAnalytics.trackError("linkedin_login_error", error?.toString() || "Unknown error")
      return { success: false, error: "LinkedIn login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate registration process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      vercelAnalytics.trackConversion("registration")
      vercelAnalytics.trackEvent("registration_submitted", {
        company_category: data.companyCategory,
        verification_types: Object.keys(data.verificationStatus || {}).filter((key) => data.verificationStatus[key]),
      })

      return {
        success: true,
        paymentUrl: "/payment/registration-fee",
      }
    } catch (error) {
      vercelAnalytics.trackError("registration_error", error?.toString() || "Unknown error")
      return { success: false, error: "Registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const sendOTP = async (target: string, type: "email" | "sms" | "aadhaar") => {
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000))

      vercelAnalytics.trackEvent("otp_sent", {
        otp_type: type,
        target_type: type,
      })

      return true
    } catch (error) {
      vercelAnalytics.trackError("otp_send_failed", error?.toString() || "Unknown error", type)
      return false
    }
  }

  const verifyPayment = async (paymentId: string) => {
    try {
      // Simulate payment verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      vercelAnalytics.trackRevenue("premium", 1000, "INR")
      vercelAnalytics.trackEvent("payment_verified", {
        payment_id: paymentId,
        amount: 1000,
        currency: "INR",
      })

      return { success: true }
    } catch (error) {
      vercelAnalytics.trackError("payment_verification_failed", error?.toString() || "Unknown error")
      return { success: false, error: "Payment verification failed" }
    }
  }

  const logout = () => {
    vercelAnalytics.trackEvent("logout", {
      user_role: user?.role,
      session_duration: Date.now() - (Date.now() - 3600000), // Mock session duration
    })

    vercelAnalytics.endSession()

    setUser(null)
    localStorage.removeItem("execsphere_user")
  }

  const value = {
    user,
    login,
    loginWithOTP,
    loginWithLinkedIn,
    register,
    sendOTP,
    verifyPayment,
    logout,
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

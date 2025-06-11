"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "cxo" | "mentor" | "admin" | "super_admin"
  organization: string
  industry: string
  isVerified: boolean
  isApproved: boolean
  avatar?: string
  title?: string
  linkedinProfile?: string
  privileges: string[]
  registrationStatus: "pending_payment" | "pending_verification" | "approved" | "rejected"
  paymentStatus: "pending" | "completed" | "failed"
}

interface AuthContextType {
  user: User | null
  login: (email: string, otp: string) => Promise<boolean>
  logout: () => void
  register: (userData: any) => Promise<{ success: boolean; paymentUrl?: string }>
  sendOTP: (email: string, type: "email" | "sms" | "aadhaar") => Promise<boolean>
  verifyPayment: (paymentId: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("cxo_token")
    const userData = localStorage.getItem("cxo_user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("cxo_token")
        localStorage.removeItem("cxo_user")
      }
    }
    setIsLoading(false)
  }, [])

  const sendOTP = async (email: string, type: "email" | "sms" | "aadhaar"): Promise<boolean> => {
    try {
      // For demo purposes, always return true
      // In production, this would send actual OTP via different channels
      console.log(`Sending ${type} OTP to ${email}`)
      return true
    } catch (error) {
      console.error("Send OTP error:", error)
      return false
    }
  }

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Demo login logic with enhanced OTP format (3 letters + 3 numbers)
      if (email === "test@demo.com" && otp === "AZ47E5") {
        const demoUser: User = {
          id: "demo-user-1",
          email: "test@demo.com",
          name: "Demo User",
          role: "super_admin",
          organization: "Demo Corp",
          industry: "Technology",
          isVerified: true,
          isApproved: true,
          avatar: "/placeholder-user.jpg",
          title: "Chief Executive Officer",
          linkedinProfile: "https://linkedin.com/in/demo-user",
          privileges: ["networking", "mentorship", "events", "forums", "analytics"],
          registrationStatus: "approved",
          paymentStatus: "completed",
        }

        localStorage.setItem("cxo_token", "demo-token")
        localStorage.setItem("cxo_user", JSON.stringify(demoUser))
        setUser(demoUser)
        return true
      }

      // Additional demo users with different statuses
      const demoUsers: Record<string, User> = {
        "pending@demo.com": {
          id: "demo-pending-1",
          email: "pending@demo.com",
          name: "Pending User",
          role: "cxo",
          organization: "Pending Corp",
          industry: "Technology",
          isVerified: false,
          isApproved: false,
          title: "Chief Technology Officer",
          privileges: ["networking", "mentorship"],
          registrationStatus: "pending_verification",
          paymentStatus: "completed",
        },
        "cxo@demo.com": {
          id: "demo-cxo-1",
          email: "cxo@demo.com",
          name: "John Smith",
          role: "cxo",
          organization: "Tech Innovations",
          industry: "Technology",
          isVerified: true,
          isApproved: true,
          title: "Chief Executive Officer",
          privileges: ["networking", "mentorship", "events"],
          registrationStatus: "approved",
          paymentStatus: "completed",
        },
        "mentor@demo.com": {
          id: "demo-mentor-1",
          email: "mentor@demo.com",
          name: "Sarah Johnson",
          role: "mentor",
          organization: "Leadership Consulting",
          industry: "Consulting",
          isVerified: true,
          isApproved: true,
          title: "Senior Executive Coach",
          privileges: ["mentorship", "networking", "events"],
          registrationStatus: "approved",
          paymentStatus: "completed",
        },
      }

      if (demoUsers[email] && otp === "AZ47E5") {
        localStorage.setItem("cxo_token", "demo-token")
        localStorage.setItem("cxo_user", JSON.stringify(demoUsers[email]))
        setUser(demoUsers[email])
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("cxo_token")
    localStorage.removeItem("cxo_user")
    setUser(null)
  }

  const register = async (userData: any): Promise<{ success: boolean; paymentUrl?: string }> => {
    try {
      // Demo registration - simulate payment gateway integration
      console.log("Registering user:", userData)

      // Simulate payment gateway URL
      const paymentUrl = `https://demo-payment-gateway.com/pay?amount=1000&user=${userData.email}`

      return { success: true, paymentUrl }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false }
    }
  }

  const verifyPayment = async (paymentId: string): Promise<boolean> => {
    try {
      // Demo payment verification
      console.log("Verifying payment:", paymentId)
      return true
    } catch (error) {
      console.error("Payment verification error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, sendOTP, verifyPayment, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

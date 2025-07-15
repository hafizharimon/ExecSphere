"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  userType: "super-admin" | "admin" | "cxo" | "mentor" | "pending"
  organization: string
  industry?: string
  isVerified: boolean
  mcaVerified?: boolean
  premiumStatus?: "basic" | "premium"
  profilePicture?: string
  registrationDate?: string
  legalEntityName?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, otp: string) => Promise<boolean>
  sendOTP: (email: string, type: "email") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for different roles
const demoUsers: Record<string, User> = {
  "test@demo.com": {
    id: "super-admin-1",
    name: "Super Admin",
    email: "test@demo.com",
    role: "Super Administrator",
    userType: "super-admin",
    organization: "ExecSphere Platform",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    premiumStatus: "premium",
    profilePicture: "/placeholder-user.jpg",
    registrationDate: "2024-01-01",
    legalEntityName: "ExecSphere Technologies Pvt Ltd",
  },
  "admin@demo.com": {
    id: "admin-1",
    name: "Platform Admin",
    email: "admin@demo.com",
    role: "Platform Administrator",
    userType: "admin",
    organization: "ExecSphere Platform",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    premiumStatus: "premium",
    profilePicture: "/placeholder-user.jpg",
    registrationDate: "2024-01-01",
  },
  "cxo@demo.com": {
    id: "cxo-1",
    name: "Rajesh Kumar",
    email: "cxo@demo.com",
    role: "CEO",
    userType: "cxo",
    organization: "TechCorp Solutions",
    industry: "Technology",
    isVerified: true,
    mcaVerified: true,
    premiumStatus: "premium",
    profilePicture: "/placeholder-user.jpg",
    registrationDate: "2024-01-15",
    legalEntityName: "TechCorp Solutions Pvt Ltd",
  },
  "mentor@demo.com": {
    id: "mentor-1",
    name: "Dr. Priya Sharma",
    email: "mentor@demo.com",
    role: "CTO",
    userType: "mentor",
    organization: "Strategic Consulting",
    industry: "Consulting",
    isVerified: true,
    mcaVerified: true,
    premiumStatus: "premium",
    profilePicture: "/placeholder-user.jpg",
    registrationDate: "2024-01-10",
  },
  "pending@demo.com": {
    id: "pending-1",
    name: "Amit Patel",
    email: "pending@demo.com",
    role: "Founder",
    userType: "pending",
    organization: "New Startup Inc",
    industry: "Technology",
    isVerified: false,
    mcaVerified: false,
    premiumStatus: "basic",
    profilePicture: "/placeholder-user.jpg",
    registrationDate: "2024-01-20",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("execsphere_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("execsphere_user")
      }
    }
    setIsLoading(false)
  }, [])

  const sendOTP = async (email: string, type: "email") => {
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      return false
    }
  }

  const login = async (email: string, otp: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if OTP is valid (demo accepts AZ47E5)
      if (otp.toUpperCase() !== "AZ47E5") {
        return false
      }

      const userData = demoUsers[email.toLowerCase()]
      if (userData) {
        setUser(userData)
        localStorage.setItem("execsphere_user", JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("execsphere_user")
  }

  const value = {
    user,
    login,
    sendOTP,
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

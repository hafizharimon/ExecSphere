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
  avatar?: string
  title?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, otp: string) => Promise<boolean>
  logout: () => void
  register: (userData: any) => Promise<boolean>
  sendOTP: (email: string) => Promise<boolean>
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

  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      // For demo purposes, always return true
      // In production, this would send an actual OTP
      console.log(`Sending OTP to ${email}`)
      return true
    } catch (error) {
      console.error("Send OTP error:", error)
      return false
    }
  }

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Demo login logic
      if (email === "test@demo.com" && otp === "123456") {
        const demoUser: User = {
          id: "demo-user-1",
          email: "test@demo.com",
          name: "Demo User",
          role: "super_admin", // Default to super_admin for demo
          organization: "Demo Corp",
          industry: "Technology",
          isVerified: true,
          avatar: "/placeholder-user.jpg",
          title: "Chief Executive Officer",
        }

        localStorage.setItem("cxo_token", "demo-token")
        localStorage.setItem("cxo_user", JSON.stringify(demoUser))
        setUser(demoUser)
        return true
      }

      // You can add more demo users here for different roles
      const demoUsers: Record<string, User> = {
        "cxo@demo.com": {
          id: "demo-cxo-1",
          email: "cxo@demo.com",
          name: "John Smith",
          role: "cxo",
          organization: "Tech Innovations",
          industry: "Technology",
          isVerified: true,
          title: "Chief Executive Officer",
        },
        "mentor@demo.com": {
          id: "demo-mentor-1",
          email: "mentor@demo.com",
          name: "Sarah Johnson",
          role: "mentor",
          organization: "Leadership Consulting",
          industry: "Consulting",
          isVerified: true,
          title: "Senior Executive Coach",
        },
        "admin@demo.com": {
          id: "demo-admin-1",
          email: "admin@demo.com",
          name: "Mike Wilson",
          role: "admin",
          organization: "CXO Network",
          industry: "Technology",
          isVerified: true,
          title: "Platform Administrator",
        },
      }

      if (demoUsers[email] && otp === "123456") {
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

  const register = async (userData: any): Promise<boolean> => {
    try {
      // Demo registration - always succeeds
      console.log("Registering user:", userData)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, sendOTP, isLoading }}>
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

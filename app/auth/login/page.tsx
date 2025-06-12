"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, Lock, Linkedin, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "linkedin">("email")
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  })
  const [showOTP, setShowOTP] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const { login, sendOTP } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your company email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await sendOTP(formData.email, "email")
      if (success) {
        setOtpSent(true)
        toast({
          title: "OTP Sent",
          description: "Check your email for the verification code",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.otp) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await login(formData.email, formData.otp)
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or OTP",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkedInLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate LinkedIn OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo, use a predefined LinkedIn user
      const success = await login("cxo@demo.com", "AZ47E5")
      if (success) {
        toast({
          title: "LinkedIn Login Successful",
          description: "Welcome back!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "LinkedIn Login Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-800">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="container max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your executive account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-8">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              loginMethod === "email" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Email & OTP
          </button>
          <button
            onClick={() => setLoginMethod("linkedin")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              loginMethod === "linkedin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Linkedin className="h-4 w-4 inline mr-2" />
            LinkedIn
          </button>
        </div>

        {loginMethod === "email" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Company Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 rounded-xl border-slate-200 h-12"
                  required
                />
              </div>
            </div>

            {!otpSent ? (
              <Button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading || !formData.email}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-slate-700">
                    Enter OTP
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="otp"
                      type={showOTP ? "text" : "password"}
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => setFormData((prev) => ({ ...prev, otp: e.target.value.toUpperCase() }))}
                      className="pl-10 pr-10 rounded-xl border-slate-200 h-12 text-center font-mono"
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOTP(!showOTP)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showOTP ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Demo OTP format: AZ47E5 (2 letters + 2 numbers + 1 letter + 1 number)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.otp}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full text-blue-600 hover:text-blue-700 rounded-xl"
                >
                  Resend OTP
                </Button>
              </>
            )}
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 text-center">Sign in securely with your LinkedIn account</p>
            </div>

            <Button
              onClick={handleLinkedInLogin}
              disabled={isLoading}
              className="w-full bg-[#0077B5] hover:bg-[#006699] text-white rounded-xl h-12 flex items-center justify-center space-x-2"
            >
              <Linkedin className="h-5 w-5" />
              <span>{isLoading ? "Connecting..." : "Continue with LinkedIn"}</span>
            </Button>
          </div>
        )}

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h4 className="font-medium text-amber-800 mb-2">Demo Credentials</h4>
          <div className="space-y-1 text-sm text-amber-700">
            <p>
              <strong>Super Admin:</strong> test@demo.com
            </p>
            <p>
              <strong>CXO:</strong> cxo@demo.com
            </p>
            <p>
              <strong>Mentor:</strong> mentor@demo.com
            </p>
            <p>
              <strong>Pending User:</strong> pending@demo.com
            </p>
            <p>
              <strong>OTP:</strong> AZ47E5
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

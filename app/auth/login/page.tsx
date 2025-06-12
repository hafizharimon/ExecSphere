"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, Lock, Linkedin, Github, Twitter } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("test@demo.com")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, sendOTP } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await sendOTP(email, "email")
      if (success) {
        setIsOtpSent(true)
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code.",
        })
      } else {
        toast({
          title: "Failed to send OTP",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, otp)
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or OTP. Please check your credentials.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateOTP = (value: string) => {
    const otpPattern = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]$/
    return otpPattern.test(value)
  }

  const formatOTP = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase()
    return cleaned.slice(0, 6)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-slate-600">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-primary-500"
              >
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
            <p className="text-slate-500 mt-2">
              {!isOtpSent ? "Login to your account" : "Enter the verification code sent to your email"}
            </p>
          </div>

          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="nexlink-input pl-10"
                  required
                />
              </div>

              <Button type="submit" className="nexlink-btn w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">Or sign in with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="rounded-full border-slate-200">
                  <Linkedin className="h-5 w-5 text-[#0077B5]" />
                </Button>
                <Button variant="outline" className="rounded-full border-slate-200">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-full border-slate-200">
                  <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary-600 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
                <p className="text-xs text-blue-700 mt-1">Email: test@demo.com</p>
                <p className="text-xs text-blue-700">OTP Format: AZ47E5</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter OTP (e.g., AZ47E5)"
                  value={otp}
                  onChange={(e) => setOtp(formatOTP(e.target.value))}
                  className="nexlink-input pl-10 text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Format: 2 letters + 2 numbers + 1 letter + 1 number</p>
                {otp && (
                  <span className={`text-xs font-medium ${validateOTP(otp) ? "text-green-600" : "text-red-600"}`}>
                    {validateOTP(otp) ? "Valid" : "Invalid"}
                  </span>
                )}
              </div>

              <Button type="submit" className="nexlink-btn w-full" disabled={isLoading || !validateOTP(otp)}>
                {isLoading ? "Verifying..." : "Sign In"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-sm text-primary-600 font-medium"
                >
                  Change email address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

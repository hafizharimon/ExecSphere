"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Building2, Mail, Shield, AlertCircle, ArrowRight, Sparkles } from "lucide-react"

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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="ml-4 text-3xl font-bold text-white">NexLink Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/80">
            {!isOtpSent ? "Enter your email to receive a verification code" : "Enter the OTP sent to your email"}
          </p>
        </div>

        <Card className="rounded-3xl card-shadow border-0 bg-white/95 backdrop-blur-sm">
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP}>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sign In
                </CardTitle>
                <CardDescription>Access your executive network</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 px-8">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rounded-xl border-slate-200 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Demo credentials info */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
                      <div className="text-xs text-blue-600 space-y-1">
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
                  </div>
                </div>

                {/* Account status warning */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Account Status Required</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Login access is only available for Super Admin approved accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-8 pb-8">
                <Button
                  type="submit"
                  className="w-full rounded-2xl gradient-bg border-0 shadow-lg text-lg py-6"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Verify Code
                </CardTitle>
                <CardDescription>Enter the verification code sent to your email</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 px-8">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="AZ47E5"
                      value={otp}
                      onChange={(e) => setOtp(formatOTP(e.target.value))}
                      className="pl-10 text-center text-xl tracking-widest font-mono rounded-xl border-slate-200"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Format: 2 letters + 2 numbers + 1 letter + 1 number</span>
                    {otp && (
                      <Badge variant={validateOTP(otp) ? "default" : "destructive"} className="rounded-full">
                        {validateOTP(otp) ? "Valid" : "Invalid"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsOtpSent(false)}
                    className="text-sm text-blue-600"
                  >
                    Change email address
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
                <Button
                  type="submit"
                  className="w-full rounded-2xl gradient-bg border-0 shadow-lg text-lg py-6"
                  disabled={isLoading || !validateOTP(otp)}
                  size="lg"
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-sm text-center text-slate-600">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                    Request invitation
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

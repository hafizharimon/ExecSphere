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
import { Building2, Mail, Shield, AlertCircle } from "lucide-react"

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
    // Format: 2 letters + 2 numbers + 1 letter + 1 number (e.g., AZ47E5)
    const otpPattern = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]$/
    return otpPattern.test(value)
  }

  const formatOTP = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase()

    // Limit to 6 characters
    return cleaned.slice(0, 6)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">CXO Network</span>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            {!isOtpSent ? "Enter your email to receive a verification code" : "Enter the OTP sent to your email"}
          </CardDescription>
        </CardHeader>

        {!isOtpSent ? (
          <form onSubmit={handleSendOTP}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Demo credentials info */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
                <div className="text-xs text-blue-600 mt-1 space-y-1">
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

              {/* Account status warning */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="AZ47E5"
                    value={otp}
                    onChange={(e) => setOtp(formatOTP(e.target.value))}
                    className="pl-10 text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Format: 2 letters + 2 numbers + 1 letter + 1 number</span>
                  {otp && (
                    <Badge variant={validateOTP(otp) ? "default" : "destructive"}>
                      {validateOTP(otp) ? "Valid" : "Invalid"}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-center">
                <Button type="button" variant="link" onClick={() => setIsOtpSent(false)} className="text-sm">
                  Change email address
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading || !validateOTP(otp)}>
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Request invitation
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}

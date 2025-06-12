"use client"

import { useAuth } from "@/context/auth-context"
import { CXODashboard } from "@/components/dashboards/cxo-dashboard"
import { MentorDashboard } from "@/components/dashboards/mentor-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { SuperAdminDashboard } from "@/components/dashboards/super-admin-dashboard"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Handle pending verification status
  if (user.userType === "pending" || !user.isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">Application Under Review</CardTitle>
                <CardDescription>Your registration is being reviewed by our Super Admin team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Application submitted successfully</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Payment processed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">LinkedIn profile verified</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">MCA verification completed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Admin review in progress</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">What happens next?</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Our team will review your application within 24-48 hours. You'll receive an email notification
                        once your account is approved and activated.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Application submitted on {new Date(user.registrationDate || "").toLocaleDateString()}
                  </p>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Verification
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user type
  switch (user.userType) {
    case "super-admin":
      return <SuperAdminDashboard user={user} />
    case "admin":
      return <AdminDashboard user={user} />
    case "mentor":
      return <MentorDashboard user={user} />
    case "cxo":
    default:
      return <CXODashboard user={user} />
  }
}

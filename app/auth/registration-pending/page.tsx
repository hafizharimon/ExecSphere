"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Clock, CheckCircle, Mail, Phone } from "lucide-react"

export default function RegistrationPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">CXO Network</span>
          </div>

          <div className="space-y-2">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted</CardTitle>
            <CardDescription>Your registration is under review by our Super Admin team</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Pending Review
            </Badge>

            <div className="text-left space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Payment completed (₹1,000)</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Email verification completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">SMS verification completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Aadhaar verification completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">Super Admin review pending</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our team will verify your executive credentials</li>
              <li>• Review typically takes 24-48 hours</li>
              <li>• You'll receive an email notification upon approval</li>
              <li>• Login access will be granted after approval</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">You will receive notifications at:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>test@demo.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+91 9876543210</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/login">Try Login (After Approval)</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Need help? Contact us at support@cxonetwork.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

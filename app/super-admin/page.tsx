"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { superAdminService, type PlatformMetrics } from "@/services/super-admin-service"
import {
  Crown,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  Zap,
  Globe,
  CheckCircle,
  Clock,
  Building,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function SuperAdminPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadPlatformMetrics()
    }
  }, [user])

  const loadPlatformMetrics = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getPlatformMetrics()
      if (result.success) {
        setMetrics(result.data || null)
      }
    } catch (error) {
      console.error("Load platform metrics error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.userType !== "super-admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform oversight and business intelligence</p>
          </div>
          <Badge variant="default" className="bg-purple-500 w-fit">
            <Crown className="h-3 w-3 mr-1" />
            Super Administrator
          </Badge>
        </div>

        {/* Platform Metrics */}
        {metrics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{metrics.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{metrics.growthRate}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registration Fees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{metrics.registrationFees.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">New registrations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeUsers}</div>
                <p className="text-xs text-muted-foreground">of {metrics.totalUsers} total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.engagementRate}%</div>
                <p className="text-xs text-muted-foreground">Platform engagement</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Review and approve user registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Registrations</span>
                <Badge variant="destructive">{metrics?.pendingApprovals || 0}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button asChild className="flex-1">
                  <Link href="/super-admin/verifications">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Review Applications
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Verification
              </CardTitle>
              <CardDescription>Verify company legal status via MCA/Udyam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Verifications</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex space-x-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/super-admin/companies">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Companies
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mentor Applications
              </CardTitle>
              <CardDescription>Review mentor eligibility and fee requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fee Requests</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex space-x-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/super-admin/fee-requests">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Review Requests
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Super Admin Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Super Admin Tools</CardTitle>
            <CardDescription>Platform-wide management and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/global">
                  <Globe className="h-6 w-6" />
                  <span>Global Settings</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/verifications">
                  <CheckCircle className="h-6 w-6" />
                  <span>User Verifications</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/fee-requests">
                  <DollarSign className="h-6 w-6" />
                  <span>Fee Requests</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/billing">
                  <BarChart3 className="h-6 w-6" />
                  <span>Billing & Revenue</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/roles">
                  <Shield className="h-6 w-6" />
                  <span>Role Management</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/providers">
                  <Zap className="h-6 w-6" />
                  <span>Service Providers</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/platform">
                  <Settings className="h-6 w-6" />
                  <span>Platform Config</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/database">
                  <Database className="h-6 w-6" />
                  <span>Database</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

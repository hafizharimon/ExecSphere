"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Crown,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Megaphone,
  Shield,
  Database,
  Zap,
  Globe,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
  organization: string
}

interface SuperAdminDashboardProps {
  user: User
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  const revenueData = {
    monthly: 125000,
    growth: 15.2,
    subscriptions: 1247,
    churnRate: 2.1,
  }

  const platformMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    monthlyGrowth: 12.5,
    engagement: 78,
  }

  const serviceProviders = [
    {
      id: "1",
      name: "Executive Coaching Pro",
      category: "Coaching",
      status: "active",
      revenue: 15000,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Leadership Masterclass",
      category: "Training",
      status: "pending",
      revenue: 8500,
      rating: 4.6,
    },
  ]

  const announcements = [
    {
      id: "1",
      title: "Platform Maintenance Scheduled",
      type: "maintenance",
      active: true,
      created: "2 days ago",
    },
    {
      id: "2",
      title: "New Feature: AI Matchmaking",
      type: "feature",
      active: false,
      created: "1 week ago",
    },
  ]

  return (
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

      {/* Revenue & Business Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.monthly.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{revenueData.growth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.subscriptions}</div>
            <p className="text-xs text-muted-foreground">{revenueData.churnRate}% churn rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{platformMetrics.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">User growth this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.engagement}%</div>
            <p className="text-xs text-muted-foreground">Daily active users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Service Provider Management */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Service Providers
            </CardTitle>
            <CardDescription>Manage platform service providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceProviders.map((provider) => (
              <div key={provider.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">{provider.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={provider.status === "active" ? "default" : "secondary"}>{provider.status}</Badge>
                      <span className="text-xs">★ {provider.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${provider.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">monthly</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Review
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/super-admin/providers">View All Providers</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Analytics
            </CardTitle>
            <CardDescription>Real-time platform metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Users</span>
                <span className="font-medium">{platformMetrics.totalUsers}</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Users</span>
                <span className="font-medium">{platformMetrics.activeUsers}</span>
              </div>
              <Progress value={platformMetrics.engagement} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Growth</span>
                <span className="font-medium">+{platformMetrics.monthlyGrowth}%</span>
              </div>
              <Progress value={platformMetrics.monthlyGrowth * 5} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">98.9%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">1.2s</p>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </div>
            </div>
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/super-admin/analytics">Detailed Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription>Platform-wide announcements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={announcement.type === "maintenance" ? "destructive" : "default"}>
                        {announcement.type}
                      </Badge>
                      <Badge variant={announcement.active ? "default" : "secondary"}>
                        {announcement.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{announcement.created}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant={announcement.active ? "destructive" : "default"} className="flex-1">
                    {announcement.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/super-admin/announcements">Manage All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Super Admin Tools */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Super Admin Tools</CardTitle>
            <CardDescription>Platform-wide management and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/billing">
                  <DollarSign className="h-6 w-6" />
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
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/global">
                  <Globe className="h-6 w-6" />
                  <span>Global Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Shield, CheckCircle, XCircle, BarChart3, Settings, Flag } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
  organization: string
}

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const pendingVerifications = [
    {
      id: "1",
      name: "David Chen",
      email: "david.chen@techcorp.com",
      role: "CTO",
      organization: "TechCorp Solutions",
      appliedDate: "2 days ago",
    },
    {
      id: "2",
      name: "Emily Rodriguez",
      email: "emily@healthplus.com",
      role: "CEO",
      organization: "HealthPlus Inc",
      appliedDate: "1 day ago",
    },
  ]

  const flaggedContent = [
    {
      id: "1",
      type: "Forum Post",
      title: "Inappropriate content in Leadership forum",
      reporter: "Sarah Miller",
      date: "3 hours ago",
      severity: "high",
    },
    {
      id: "2",
      type: "Message",
      title: "Spam message reported",
      reporter: "John Doe",
      date: "1 day ago",
      severity: "medium",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      action: "User approved",
      details: "Sarah Johnson verified as CTO",
      time: "2 hours ago",
    },
    {
      id: "2",
      action: "Event created",
      details: "AI Strategy Summit scheduled",
      time: "4 hours ago",
    },
    {
      id: "3",
      action: "Content moderated",
      details: "Inappropriate post removed",
      time: "6 hours ago",
    },
  ]

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform management and moderation</p>
        </div>
        <Badge variant="default" className="bg-red-500 w-fit">
          <Shield className="h-3 w-3 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Verifications */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pending Verifications
            </CardTitle>
            <CardDescription>Review new user applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingVerifications.map((user) => (
              <div key={user.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.role} at {user.organization}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{user.appliedDate}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/admin/verifications">View All Pending</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Flagged Content */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Content Moderation
            </CardTitle>
            <CardDescription>Review flagged content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flaggedContent.map((content) => (
              <div key={content.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{content.type}</Badge>
                      <Badge variant={content.severity === "high" ? "destructive" : "secondary"}>
                        {content.severity}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mt-1">{content.title}</p>
                    <p className="text-xs text-muted-foreground">Reported by {content.reporter}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{content.date}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                    <Button size="sm" variant="destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/admin/moderation">View All Reports</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Platform activity log</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/admin/activity">View Full Log</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Admin Tools */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>Platform management and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/admin/users">
                  <Users className="h-6 w-6" />
                  <span>User Management</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/admin/events">
                  <Calendar className="h-6 w-6" />
                  <span>Event Management</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/admin/analytics">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-6 w-6" />
                  <span>Platform Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Globe, Award, Download, Calendar, Star, ArrowUpRight } from "lucide-react"

interface CompanyAnalyticsProps {
  companyId: string
  companyName: string
}

export function CompanyAnalytics({ companyId, companyName }: CompanyAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("month")

  // Mock analytics data
  const performanceMetrics = [
    { name: "Leadership Experience", value: 95 },
    { name: "Network Quality", value: 92 },
    { name: "Platform Engagement", value: 88 },
    { name: "Verification Status", value: 100 },
    { name: "Industry Reputation", value: 98 },
  ]

  const networkMetrics = {
    totalConnections: 15432,
    growth: 23,
    newConnections: 1245,
    connectionRate: 87,
    topConnectedRoles: [
      { role: "CEO", count: 342 },
      { role: "CTO", count: 289 },
      { role: "CFO", count: 256 },
      { role: "CMO", count: 187 },
      { role: "COO", count: 165 },
    ],
  }

  const eventMetrics = {
    totalEvents: 24,
    attendees: 1876,
    avgRating: 4.8,
    upcomingEvents: 3,
    pastEvents: 21,
    topEvents: [
      { name: "Digital Transformation Summit", attendees: 450, rating: 4.9 },
      { name: "AI in Business Conference", attendees: 380, rating: 4.7 },
      { name: "Leadership Masterclass", attendees: 120, rating: 4.8 },
    ],
  }

  const profileMetrics = {
    totalViews: 24789,
    growth: 15,
    uniqueVisitors: 12567,
    avgTimeSpent: "3m 45s",
    topViewers: [
      { role: "CEO", percentage: 35 },
      { role: "CTO", percentage: 25 },
      { role: "CFO", percentage: 15 },
      { role: "Other C-Level", percentage: 25 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">{companyName} Analytics</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{profileMetrics.totalViews.toLocaleString()}</p>
                  <Badge className="ml-2 bg-green-500 text-white">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {profileMetrics.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{profileMetrics.uniqueVisitors.toLocaleString()} unique</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Reach</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{networkMetrics.totalConnections.toLocaleString()}</p>
                  <Badge className="ml-2 bg-green-500 text-white">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {networkMetrics.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {networkMetrics.newConnections.toLocaleString()} new this {timeRange}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Events</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{eventMetrics.totalEvents}</p>
                  <Badge className="ml-2 bg-blue-500 text-white">
                    <Calendar className="h-3 w-3 mr-1" />
                    {eventMetrics.upcomingEvents} upcoming
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {eventMetrics.attendees.toLocaleString()} total attendees
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Grade</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">A+</p>
                  <div className="ml-2 flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <p className="text-xs text-green-600 font-medium">Top 1% of companies</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="profile">Profile Views</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Company Performance
              </CardTitle>
              <CardDescription>Overall performance metrics and auto-grading factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{metric.name}</span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Network Analytics
              </CardTitle>
              <CardDescription>Connection growth and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Connection Rate</p>
                    <p className="text-2xl font-bold">{networkMetrics.connectionRate}%</p>
                    <p className="text-xs text-green-600">Above industry average</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">New Connections</p>
                    <p className="text-2xl font-bold">{networkMetrics.newConnections}</p>
                    <p className="text-xs text-muted-foreground">This {timeRange}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="text-2xl font-bold">{networkMetrics.growth}%</p>
                    <p className="text-xs text-green-600">Trending upward</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Top Connected Roles</h4>
                  <div className="space-y-3">
                    {networkMetrics.topConnectedRoles.map((role, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {role.role}
                          </Badge>
                          <span className="text-sm">{role.count} connections</span>
                        </div>
                        <Progress value={(role.count / networkMetrics.topConnectedRoles[0].count) * 100} className="w-24 h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Analytics
              </CardTitle>
              <CardDescription>Event participation and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{eventMetrics.totalEvents}</p>
                    <p className="text-xs text-muted-foreground">
                      {eventMetrics.pastEvents} past, {eventMetrics.upcomingEvents} upcoming
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Attendees</p>
                    <p className="text-2xl font-bold">{eventMetrics.attendees.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Across all events</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">{eventMetrics.avgRating}</p>
                      <div className="ml-2 flex">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500"\

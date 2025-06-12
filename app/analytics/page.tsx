"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, Eye, MessageSquare, Calendar, TrendingUp, Download, Share2, Award } from "lucide-react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("30d")
  const [isExporting, setIsExporting] = useState(false)

  const analyticsData = {
    overview: {
      profileViews: 2847,
      profileViewsGrowth: 23.5,
      networkConnections: 1247,
      networkGrowth: 15.2,
      postEngagement: 89.3,
      engagementGrowth: 8.7,
      eventAttendance: 12,
      attendanceGrowth: 33.3,
    },
    networkAnalytics: {
      totalConnections: 1247,
      newConnections: 89,
      connectionsByRole: [
        { role: "CEO", count: 234, percentage: 18.8 },
        { role: "CTO", count: 198, percentage: 15.9 },
        { role: "CFO", count: 167, percentage: 13.4 },
        { role: "CMO", count: 145, percentage: 11.6 },
        { role: "COO", count: 123, percentage: 9.9 },
        { role: "Others", count: 380, percentage: 30.4 },
      ],
      connectionsByIndustry: [
        { industry: "Technology", count: 387, percentage: 31.0 },
        { industry: "Finance", count: 298, percentage: 23.9 },
        { industry: "Healthcare", count: 186, percentage: 14.9 },
        { industry: "Manufacturing", count: 156, percentage: 12.5 },
        { industry: "Others", count: 220, percentage: 17.7 },
      ],
      topConnections: [
        { name: "Sarah Chen", role: "CTO", company: "TechCorp", mutualConnections: 45 },
        { name: "Michael Rodriguez", role: "CEO", company: "Global Finance", mutualConnections: 38 },
        { name: "Jennifer Kim", role: "CFO", company: "HealthTech", mutualConnections: 32 },
      ],
    },
    eventAnalytics: {
      eventsAttended: 12,
      eventsHosted: 3,
      totalEventHours: 48,
      averageRating: 4.8,
      eventsByType: [
        { type: "Webinar", count: 6, hours: 18 },
        { type: "Roundtable", count: 4, hours: 16 },
        { type: "Summit", count: 2, hours: 14 },
      ],
      upcomingEvents: [
        { name: "AI Strategy Summit", date: "2024-02-15", type: "Summit", registered: true },
        { name: "CFO Roundtable", date: "2024-02-20", type: "Roundtable", registered: false },
        { name: "Digital Transformation", date: "2024-02-25", type: "Webinar", registered: true },
      ],
    },
    publicWallAnalytics: {
      postsCreated: 23,
      totalViews: 15847,
      totalLikes: 892,
      totalComments: 234,
      averageEngagement: 7.2,
      topPosts: [
        {
          title: "Digital Transformation in 2024",
          views: 2847,
          likes: 156,
          comments: 43,
          date: "2024-01-15",
        },
        {
          title: "Leadership in Remote Teams",
          views: 2134,
          likes: 98,
          comments: 32,
          date: "2024-01-10",
        },
        {
          title: "ESG Reporting Best Practices",
          views: 1876,
          likes: 87,
          comments: 28,
          date: "2024-01-08",
        },
      ],
      engagementByTopic: [
        { topic: "Leadership", engagement: 8.9 },
        { topic: "Technology", engagement: 8.2 },
        { topic: "Strategy", engagement: 7.8 },
        { topic: "Finance", engagement: 7.1 },
        { topic: "Operations", engagement: 6.5 },
      ],
    },
    profileAnalytics: {
      profileCompleteness: 95,
      profileStrength: "Excellent",
      searchAppearances: 1247,
      profileActions: {
        messagesSent: 89,
        connectionsRequested: 45,
        profileShares: 23,
        endorsements: 156,
      },
      skillEndorsements: [
        { skill: "Strategic Leadership", count: 45 },
        { skill: "Digital Transformation", count: 38 },
        { skill: "Team Management", count: 32 },
        { skill: "Innovation", count: 28 },
        { skill: "Business Strategy", count: 25 },
      ],
    },
  }

  const handleExportData = async (format: "pdf" | "excel" | "csv") => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would generate and download the file
      const fileName = `analytics-report-${timeRange}.${format}`
      console.log(`Exporting ${fileName}`)

      // Create a mock download
      const element = document.createElement("a")
      const file = new Blob([JSON.stringify(analyticsData, null, 2)], { type: "application/json" })
      element.href = URL.createObjectURL(file)
      element.download = fileName
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } finally {
      setIsExporting(false)
    }
  }

  if (!user) {
    return <div>Please log in to view analytics.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your executive network performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExportData("pdf")} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.profileViews.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium">
                    +{analyticsData.overview.profileViewsGrowth}% from last period
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Network Size</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.networkConnections.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium">+{analyticsData.overview.networkGrowth}% growth</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Post Engagement</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.postEngagement}%</p>
                  <p className="text-xs text-green-600 font-medium">
                    +{analyticsData.overview.engagementGrowth}% improvement
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Events Attended</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.eventAttendance}</p>
                  <p className="text-xs text-green-600 font-medium">
                    +{analyticsData.overview.attendanceGrowth}% increase
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="network" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="posts">Public Wall</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Network Composition by Role</CardTitle>
                  <CardDescription>Distribution of connections by executive roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.networkAnalytics.connectionsByRole.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-16 text-sm font-medium">{item.role}</div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.count} connections</span>
                              <span>{item.percentage}%</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Distribution</CardTitle>
                  <CardDescription>Your network across different industries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.networkAnalytics.connectionsByIndustry.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-20 text-sm font-medium">{item.industry}</div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.count}</span>
                              <span>{item.percentage}%</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Connections</CardTitle>
                <CardDescription>Your most influential network connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.networkAnalytics.topConnections.map((connection, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{connection.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {connection.role} at {connection.company}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{connection.mutualConnections}</p>
                        <p className="text-xs text-muted-foreground">mutual connections</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Participation</CardTitle>
                  <CardDescription>Your event engagement statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{analyticsData.eventAnalytics.eventsAttended}</p>
                      <p className="text-sm text-muted-foreground">Events Attended</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{analyticsData.eventAnalytics.eventsHosted}</p>
                      <p className="text-sm text-muted-foreground">Events Hosted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {analyticsData.eventAnalytics.totalEventHours}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Hours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{analyticsData.eventAnalytics.averageRating}</p>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events by Type</CardTitle>
                  <CardDescription>Breakdown of event participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.eventAnalytics.eventsByType.map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{event.type}</p>
                          <p className="text-sm text-muted-foreground">{event.hours} hours total</p>
                        </div>
                        <Badge variant="secondary">{event.count} events</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you're registered for or might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.eventAnalytics.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.type}</Badge>
                        <Badge variant={event.registered ? "default" : "secondary"}>
                          {event.registered ? "Registered" : "Available"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Post Performance</CardTitle>
                  <CardDescription>Your public wall engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {analyticsData.publicWallAnalytics.postsCreated}
                      </p>
                      <p className="text-sm text-muted-foreground">Posts Created</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {analyticsData.publicWallAnalytics.totalViews.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {analyticsData.publicWallAnalytics.totalLikes}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {analyticsData.publicWallAnalytics.averageEngagement}%
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement by Topic</CardTitle>
                  <CardDescription>Which topics generate the most engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.publicWallAnalytics.engagementByTopic.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-20 text-sm font-medium">{topic.topic}</div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{topic.engagement}% engagement</span>
                            </div>
                            <Progress value={topic.engagement * 10} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your most successful content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.publicWallAnalytics.topPosts.map((post, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{post.title}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.date}</span>
                        <div className="flex items-center space-x-4">
                          <span>{post.views} views</span>
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Strength</CardTitle>
                  <CardDescription>Your profile completeness and optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {analyticsData.profileAnalytics.profileCompleteness}%
                      </div>
                      <Badge className="bg-green-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        {analyticsData.profileAnalytics.profileStrength}
                      </Badge>
                    </div>
                    <Progress value={analyticsData.profileAnalytics.profileCompleteness} className="h-3" />
                    <p className="text-sm text-muted-foreground text-center">
                      Your profile appears in {analyticsData.profileAnalytics.searchAppearances} searches
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Actions</CardTitle>
                  <CardDescription>How others interact with your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Messages Received</span>
                      <span className="font-medium">{analyticsData.profileAnalytics.profileActions.messagesSent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Connection Requests</span>
                      <span className="font-medium">
                        {analyticsData.profileAnalytics.profileActions.connectionsRequested}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profile Shares</span>
                      <span className="font-medium">{analyticsData.profileAnalytics.profileActions.profileShares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Skill Endorsements</span>
                      <span className="font-medium">{analyticsData.profileAnalytics.profileActions.endorsements}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Skills & Endorsements</CardTitle>
                <CardDescription>Skills most recognized by your network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.profileAnalytics.skillEndorsements.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-32 text-sm font-medium">{skill.skill}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill.count} endorsements</span>
                          </div>
                          <Progress value={(skill.count / 50) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Executive Summary Report
                </CardTitle>
                <CardDescription>Comprehensive overview of your platform performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Key Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Top 5%
                        </Badge>
                        <span className="text-sm">Network growth rate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-500">
                          <Eye className="h-3 w-3 mr-1" />
                          High Visibility
                        </Badge>
                        <span className="text-sm">Profile views above average</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-500">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Thought Leader
                        </Badge>
                        <span className="text-sm">High engagement content</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Expand Network:</strong> Connect with more CMOs to diversify your network
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Content Strategy:</strong> Your leadership posts perform 40% better
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-800">
                          <strong>Event Participation:</strong> Consider hosting a webinar on digital transformation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg">Export Options</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData("pdf")}
                        disabled={isExporting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF Report
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData("excel")}
                        disabled={isExporting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Excel Data
                      </Button>
                      <Button variant="outline" size="sm" disabled={isExporting}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Report
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate detailed reports for board presentations, performance reviews, or strategic planning
                    sessions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

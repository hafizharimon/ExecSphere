"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Users, Clock, DollarSign, Star, Calendar, Target, Award } from "lucide-react"

export default function MentorAnalyticsPage() {
  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
  ]

  const sessionData = [
    { month: "Jan", sessions: 12, earnings: 15000, rating: 4.8 },
    { month: "Feb", sessions: 18, earnings: 22500, rating: 4.9 },
    { month: "Mar", sessions: 15, earnings: 18750, rating: 4.7 },
    { month: "Apr", sessions: 22, earnings: 27500, rating: 4.9 },
    { month: "May", sessions: 20, earnings: 25000, rating: 4.8 },
    { month: "Jun", sessions: 25, earnings: 31250, rating: 5.0 },
  ]

  const menteeProgress = [
    {
      name: "Alex Thompson",
      company: "StartupCo",
      progress: 85,
      sessions: 8,
      improvement: "+15%",
      status: "excellent",
    },
    {
      name: "Maria Garcia",
      company: "TechFirm",
      progress: 72,
      sessions: 6,
      improvement: "+12%",
      status: "good",
    },
    {
      name: "John Smith",
      company: "InnovateCorp",
      progress: 68,
      sessions: 4,
      improvement: "+8%",
      status: "good",
    },
    {
      name: "Sarah Wilson",
      company: "GrowthCorp",
      progress: 91,
      sessions: 10,
      improvement: "+18%",
      status: "excellent",
    },
  ]

  const topicsData = [
    { topic: "Leadership", sessions: 45, percentage: 35 },
    { topic: "Strategy", sessions: 32, percentage: 25 },
    { topic: "Operations", sessions: 25, percentage: 20 },
    { topic: "Finance", sessions: 15, percentage: 12 },
    { topic: "Technology", sessions: 10, percentage: 8 },
  ]

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your mentoring performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,58,750</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.1</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="mentees">Mentees</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Session Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Session Trends
                </CardTitle>
                <CardDescription>Monthly session count and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 text-sm font-medium">{data.month}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{data.sessions} sessions</span>
                            <span>₹{data.earnings.toLocaleString()}</span>
                          </div>
                          <Progress value={(data.sessions / 25) * 100} className="h-2" />
                        </div>
                      </div>
                      <Badge variant="outline">⭐ {data.rating}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Session Completion Rate</span>
                    <span className="text-sm text-muted-foreground">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-muted-foreground">2.3 hours</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mentee Satisfaction</span>
                    <span className="text-sm text-muted-foreground">4.9/5</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Repeat Sessions</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Sessions completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Mentored</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Total this year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Goal achievement</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Track your monthly metrics and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">25</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">₹31,250</div>
                      <div className="text-xs text-muted-foreground">Earnings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">5.0</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                <CardDescription>Year-over-year growth comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions Growth</span>
                    <Badge variant="default" className="bg-green-500">
                      +45%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Growth</span>
                    <Badge variant="default" className="bg-green-500">
                      +62%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mentee Retention</span>
                    <Badge variant="default" className="bg-blue-500">
                      89%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rating Improvement</span>
                    <Badge variant="default" className="bg-purple-500">
                      +0.3
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentee Progress Tracking</CardTitle>
              <CardDescription>Monitor your mentees' development and success</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menteeProgress.map((mentee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{mentee.name}</p>
                          <p className="text-sm text-muted-foreground">{mentee.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={mentee.status === "excellent" ? "default" : "secondary"}
                            className={mentee.status === "excellent" ? "bg-green-500" : ""}
                          >
                            {mentee.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{mentee.progress}%</span>
                        </div>
                        <Progress value={mentee.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{mentee.sessions} sessions completed</span>
                          <span className="text-green-600">{mentee.improvement} improvement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Topics</CardTitle>
              <CardDescription>Most discussed topics in your sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topicsData.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-20 text-sm font-medium">{topic.topic}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{topic.sessions} sessions</span>
                          <span>{topic.percentage}%</span>
                        </div>
                        <Progress value={topic.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Topic Expertise</CardTitle>
              <CardDescription>Your areas of specialization and demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">High Demand</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Leadership</Badge>
                    <Badge variant="default">Strategy</Badge>
                    <Badge variant="default">Operations</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Emerging Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">AI Strategy</Badge>
                    <Badge variant="outline">Remote Leadership</Badge>
                    <Badge variant="outline">ESG</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

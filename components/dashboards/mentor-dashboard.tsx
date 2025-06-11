"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Clock, Award, BookOpen, Video, MessageSquare, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
  organization: string
}

interface MentorDashboardProps {
  user: User
}

export function MentorDashboard({ user }: MentorDashboardProps) {
  const activeMentees = [
    {
      id: "1",
      name: "Alex Thompson",
      title: "VP Operations at StartupCo",
      progress: 75,
      nextSession: "Tomorrow, 3:00 PM",
      totalSessions: 8,
    },
    {
      id: "2",
      name: "Maria Garcia",
      title: "Director at TechFirm",
      progress: 45,
      nextSession: "Friday, 2:00 PM",
      totalSessions: 4,
    },
  ]

  const pendingRequests = [
    {
      id: "1",
      name: "John Smith",
      title: "COO at GrowthCorp",
      message: "Looking for guidance on scaling operations...",
      requestDate: "2 days ago",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      title: "CTO at InnovateNow",
      message: "Need advice on technical leadership...",
      requestDate: "1 day ago",
    },
  ]

  const upcomingSessions = [
    {
      id: "1",
      mentee: "Alex Thompson",
      time: "Tomorrow, 3:00 PM",
      duration: "60 min",
      type: "Strategy Review",
    },
    {
      id: "2",
      mentee: "Maria Garcia",
      time: "Friday, 2:00 PM",
      duration: "45 min",
      type: "Career Planning",
    },
  ]

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-blue-500">
            <Award className="h-3 w-3 mr-1" />
            Verified Mentor
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.9 Rating
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Mentees */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Mentees
            </CardTitle>
            <CardDescription>Track mentee progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeMentees.map((mentee) => (
              <div key={mentee.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {mentee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mentee.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{mentee.title}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Next: {mentee.nextSession}</span>
                  <Badge variant="outline">{mentee.totalSessions} sessions</Badge>
                </div>
                <Button size="sm" className="w-full">
                  <Video className="h-3 w-3 mr-1" />
                  Schedule Session
                </Button>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/mentor-dashboard/mentees">View All Mentees</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Requests
            </CardTitle>
            <CardDescription>New mentorship requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {request.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{request.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{request.title}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{request.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{request.requestDate}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/mentor-dashboard/requests">View All Requests</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{session.mentee}</p>
                    <p className="text-xs text-muted-foreground">{session.type}</p>
                  </div>
                  <Badge variant="secondary">{session.duration}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{session.time}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Video className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/sessions">View All Sessions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Mentor Tools</CardTitle>
            <CardDescription>Access your mentoring resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/qa-vault">
                  <BookOpen className="h-6 w-6" />
                  <span>Q&A Vault</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/sessions/schedule">
                  <Calendar className="h-6 w-6" />
                  <span>Schedule Session</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/mentor-dashboard/analytics">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/mentor-dashboard/resources">
                  <Award className="h-6 w-6" />
                  <span>Resources</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Calendar, TrendingUp, Award, BookOpen, Network, Video, UserPlus } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
  organization: string
  industry: string
}

interface CXODashboardProps {
  user: User
}

export function CXODashboard({ user }: CXODashboardProps) {
  const suggestedConnections = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "CTO at InnovateTech",
      industry: "Technology",
      mutualConnections: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "CFO at Global Finance",
      industry: "Finance",
      mutualConnections: 3,
      avatar: "/placeholder-user.jpg",
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "AI Strategy Summit",
      date: "Tomorrow, 2:00 PM",
      type: "Webinar",
      attendees: 45,
    },
    {
      id: "2",
      title: "Leadership Roundtable",
      date: "Friday, 10:00 AM",
      type: "Discussion",
      attendees: 12,
    },
  ]

  const recentMessages = [
    {
      id: "1",
      sender: "Alice Johnson",
      preview: "Thanks for the insights on digital transformation...",
      time: "2h ago",
      unread: true,
    },
    {
      id: "2",
      sender: "David Kim",
      preview: "Let's schedule a call to discuss the partnership...",
      time: "1d ago",
      unread: false,
    },
  ]

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">
            {user.role.toUpperCase()} at {user.organization}
          </p>
        </div>
        <Badge variant="default" className="w-fit">
          Verified Executive
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 new today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Smart Connections */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Smart Connections
            </CardTitle>
            <CardDescription>Executives you should connect with</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedConnections.map((connection) => (
              <div key={connection.id} className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={connection.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {connection.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{connection.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{connection.title}</p>
                  <p className="text-xs text-muted-foreground">{connection.mutualConnections} mutual connections</p>
                </div>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/network">View All Suggestions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>Latest conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.sender
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{message.sender}</p>
                    {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{message.preview}</p>
                  <p className="text-xs text-muted-foreground">{message.time}</p>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/messages">View All Messages</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Don't miss these exclusive events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.title}</p>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{event.date}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{event.attendees} attending</p>
                  <Button size="sm">
                    <Video className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/mentorship">
                  <Award className="h-6 w-6" />
                  <span>Find Mentor</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/forums">
                  <BookOpen className="h-6 w-6" />
                  <span>Browse Forums</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/events/create">
                  <Calendar className="h-6 w-6" />
                  <span>Create Event</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/profile">
                  <Users className="h-6 w-6" />
                  <span>Update Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

"use client"

import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Calendar, TrendingUp, Award, Bell } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-muted-foreground">
              {user.role} at {user.organization}
            </p>
          </div>
          <Badge variant={user.isVerified ? "default" : "secondary"}>
            {user.isVerified ? "Verified" : "Pending Verification"}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Connections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 new today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next: Tomorrow 2PM</p>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Smart Matchmaking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Smart Matches
              </CardTitle>
              <CardDescription>New executive connections tailored for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Miller</p>
                  <p className="text-xs text-muted-foreground">CTO at InnovateTech</p>
                </div>
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">James Davis</p>
                  <p className="text-xs text-muted-foreground">CFO at Global Finance</p>
                </div>
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              </div>
              <Button className="w-full" variant="ghost" asChild>
                <Link href="/matches">View All Matches</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </CardTitle>
              <CardDescription>Latest conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alice Lee</p>
                  <p className="text-xs text-muted-foreground">Thanks for the insights on...</p>
                </div>
                <div className="text-xs text-muted-foreground">2h</div>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Michael Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Let's schedule a call to...</p>
                </div>
                <div className="text-xs text-muted-foreground">1d</div>
              </div>
              <Button className="w-full" variant="ghost" asChild>
                <Link href="/messages">View All Messages</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss these exclusive events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">AI in Business Strategy</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM EST</p>
                <Badge variant="secondary">Webinar</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Global Economic Outlook</p>
                <p className="text-xs text-muted-foreground">Friday, 10:00 AM GMT</p>
                <Badge variant="secondary">Roundtable</Badge>
              </div>
              <Button className="w-full" variant="ghost" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mentorship */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mentorship
              </CardTitle>
              <CardDescription>Grow your network through mentorship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Active mentorship connections</p>
              </div>
              <div className="space-y-2">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/mentorship">Manage Mentorship</Link>
                </Button>
                <Button className="w-full" variant="ghost" asChild>
                  <Link href="/mentorship/request">Find a Mentor</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Stay updated with your network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">New connection request from David Chen</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">Event reminder: AI Strategy Webinar</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Button className="w-full" variant="ghost">
                View All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/profile">Update Profile</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/events/create">Create Event</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/forums">Browse Forums</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

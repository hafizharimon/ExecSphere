"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  Network,
  Video,
  UserPlus,
  Sparkles,
} from "lucide-react"
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
      matchScore: 95,
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "CFO at Global Finance",
      industry: "Finance",
      mutualConnections: 3,
      avatar: "/placeholder-user.jpg",
      matchScore: 87,
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "AI Strategy Summit",
      date: "Tomorrow, 2:00 PM",
      type: "Webinar",
      attendees: 45,
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: "2",
      title: "Leadership Roundtable",
      date: "Friday, 10:00 AM",
      type: "Discussion",
      attendees: 12,
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  const recentMessages = [
    {
      id: "1",
      sender: "Alice Johnson",
      preview: "Thanks for the insights on digital transformation...",
      time: "2h ago",
      unread: true,
      avatar: "AJ",
    },
    {
      id: "2",
      sender: "David Kim",
      preview: "Let's schedule a call to discuss the partnership...",
      time: "1d ago",
      unread: false,
      avatar: "DK",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hi, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-slate-600 text-lg mt-1">Explore your executive network</p>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-4 ring-white shadow-lg">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge className="bg-green-500 text-white rounded-full px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Verified Executive
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search executives, events, or topics..."
                className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <Button size="sm" className="absolute right-2 top-2 rounded-xl gradient-bg border-0">
                <Network className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Network</p>
                  <p className="text-3xl font-bold text-slate-800">127</p>
                  <p className="text-xs text-green-600 font-medium">+12 this month</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Messages</p>
                  <p className="text-3xl font-bold text-slate-800">8</p>
                  <p className="text-xs text-blue-600 font-medium">3 new today</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Events</p>
                  <p className="text-3xl font-bold text-slate-800">3</p>
                  <p className="text-xs text-orange-600 font-medium">This week</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Profile Views</p>
                  <p className="text-3xl font-bold text-slate-800">24</p>
                  <p className="text-xs text-purple-600 font-medium">+8% from last week</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Connections */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Smart Connections</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="rounded-full border-slate-300">
                Most Viewed
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-slate-600">
                Nearby
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-slate-600">
                Latest
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestedConnections.map((connection) => (
              <Card
                key={connection.id}
                className="group rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                      {connection.matchScore}% match
                    </Badge>
                  </div>
                  <div className="absolute -bottom-6 left-6">
                    <Avatar className="h-12 w-12 ring-4 ring-white">
                      <AvatarImage src={connection.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-white text-slate-800 font-semibold">
                        {connection.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <CardContent className="pt-8 pb-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-800 mb-1">{connection.name}</h3>
                    <p className="text-sm text-slate-600">{connection.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs rounded-full">
                        {connection.industry}
                      </Badge>
                      <span className="text-xs text-slate-500">{connection.mutualConnections} mutual connections</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-2xl gradient-bg border-0 shadow-lg group-hover:shadow-xl transition-all">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Messages */}
          <Card className="rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Recent Messages</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                      {message.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-slate-800">{message.sender}</p>
                      {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-slate-600 truncate">{message.preview}</p>
                    <p className="text-xs text-slate-500 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full rounded-xl" asChild>
                <Link href="/messages">View All Messages</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-800">{event.title}</h4>
                    <Badge variant="secondary" className="rounded-full">
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{event.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{event.attendees} attending</span>
                    <Button size="sm" className="rounded-xl gradient-bg border-0">
                      <Video className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full rounded-xl" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                className="h-24 flex-col space-y-3 rounded-2xl border-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/mentorship">
                  <Award className="h-8 w-8" />
                  <span className="font-medium">Find Mentor</span>
                </Link>
              </Button>
              <Button
                className="h-24 flex-col space-y-3 rounded-2xl border-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/forums">
                  <BookOpen className="h-8 w-8" />
                  <span className="font-medium">Browse Forums</span>
                </Link>
              </Button>
              <Button
                className="h-24 flex-col space-y-3 rounded-2xl border-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/events/create">
                  <Calendar className="h-8 w-8" />
                  <span className="font-medium">Create Event</span>
                </Link>
              </Button>
              <Button
                className="h-24 flex-col space-y-3 rounded-2xl border-0 bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/profile">
                  <Users className="h-8 w-8" />
                  <span className="font-medium">Update Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

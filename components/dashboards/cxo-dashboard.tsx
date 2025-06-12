"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import {
  Bell,
  Search,
  Users,
  Calendar,
  MessageSquare,
  Star,
  Filter,
  MoreHorizontal,
  User,
  Building,
  MapPin,
  Clock,
  ChevronRight,
  Target,
  BookOpen,
} from "lucide-react"

export function CXODashboard() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Most Viewed")

  const quickStats = [
    {
      title: "Network Size",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Connections",
      value: "89",
      change: "+5%",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Events Attended",
      value: "23",
      change: "+8%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Mentorship Score",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const tabs = ["Most Viewed", "Nearby", "Latest"]

  const connections = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "CTO at InnovateTech",
      company: "InnovateTech Solutions",
      location: "San Francisco, CA",
      rating: 4.9,
      image: "/placeholder.svg?height=60&width=60",
      tags: ["Technology", "AI", "Leadership"],
      lastActive: "2 hours ago",
      mutualConnections: 12,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "CFO at Global Finance",
      company: "Global Finance Corp",
      location: "New York, NY",
      rating: 4.8,
      image: "/placeholder.svg?height=60&width=60",
      tags: ["Finance", "Strategy", "M&A"],
      lastActive: "1 day ago",
      mutualConnections: 8,
    },
    {
      id: 3,
      name: "Jennifer Kim",
      title: "CEO at HealthTech",
      company: "HealthTech Solutions",
      location: "Boston, MA",
      rating: 4.9,
      image: "/placeholder.svg?height=60&width=60",
      tags: ["Healthcare", "Innovation", "Growth"],
      lastActive: "3 hours ago",
      mutualConnections: 15,
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Global Leadership Summit 2024",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      type: "Summit",
      attendees: 250,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: 2,
      title: "Tech Innovation Roundtable",
      date: "Dec 18, 2024",
      time: "2:00 PM",
      type: "Roundtable",
      attendees: 45,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: 3,
      title: "Finance Leaders Webinar",
      date: "Dec 20, 2024",
      time: "11:00 AM",
      type: "Webinar",
      attendees: 180,
      image: "/placeholder.svg?height=80&width=120",
    },
  ]

  const quickActions = [
    {
      title: "Find Mentors",
      description: "Connect with industry experts",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      href: "/mentorship",
    },
    {
      title: "Join Forums",
      description: "Engage in discussions",
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500",
      href: "/forums",
    },
    {
      title: "Book Sessions",
      description: "Schedule 1:1 meetings",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      href: "/sessions",
    },
    {
      title: "Learning Hub",
      description: "Access exclusive content",
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
      href: "/learning",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                NexLink Hub
              </h1>
              <p className="text-xs text-slate-500">Hi, {user?.name?.split(" ")[0]} 👋</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CurrencySelector />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => logout()}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Search executives, companies, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nexlink-input pl-10 pr-12"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <Card key={index} className="nexlink-card border-0 card-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="nexlink-card border-0 card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                    <p className="text-xs text-slate-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Connections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Popular Connections</h2>
            <Link href="/network" className="text-sm text-primary-600 font-medium">
              View all
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-4 p-1 bg-slate-100 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`nexlink-tab ${activeTab === tab ? "nexlink-tab-active" : "nexlink-tab-inactive"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Connection Cards */}
          <div className="space-y-3">
            {connections.map((connection) => (
              <Card key={connection.id} className="nexlink-card border-0 card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={connection.image || "/placeholder.svg"}
                        alt={connection.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 truncate">{connection.name}</h3>
                          <p className="text-sm text-slate-600 truncate">{connection.title}</p>
                          <div className="flex items-center mt-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{connection.location}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{connection.lastActive}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{connection.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1">
                          {connection.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-500">{connection.mutualConnections} mutual</span>
                          <Button size="sm" className="rounded-full text-xs px-3">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
            <Link href="/events" className="text-sm text-primary-600 font-medium">
              View all
            </Link>
          </div>

          <div className="nexlink-horizontal-scroll">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="nexlink-card border-0 card-shadow min-w-[280px]">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-24 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white/90 text-slate-800 text-xs">{event.type}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/90">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-slate-600 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                      <Button size="sm" className="rounded-full text-xs px-3">
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="nexlink-card border-0 card-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary-600">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">Sarah Chen</span> accepted your connection request
                </p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  You're registered for <span className="font-medium">Global Leadership Summit</span>
                </p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  New message in <span className="font-medium">Tech Innovation</span> forum
                </p>
                <p className="text-xs text-slate-500">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

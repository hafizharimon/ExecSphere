"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, UserPlus, MessageSquare, Calendar, MapPin, Building, Star } from "lucide-react"

export default function NetworkPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const connections = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "CTO",
      organization: "InnovateTech",
      industry: "Technology",
      location: "San Francisco, CA",
      mutualConnections: 12,
      rating: 4.9,
      isConnected: true,
      lastInteraction: "2 days ago",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "CFO",
      organization: "Global Finance",
      industry: "Finance",
      location: "New York, NY",
      mutualConnections: 8,
      rating: 4.7,
      isConnected: true,
      lastInteraction: "1 week ago",
    },
  ]

  const suggestions = [
    {
      id: "3",
      name: "Jennifer Kim",
      title: "CEO",
      organization: "HealthTech Solutions",
      industry: "Healthcare",
      location: "Boston, MA",
      mutualConnections: 15,
      rating: 4.8,
      matchScore: 95,
      reason: "Similar industry focus and mutual connections",
    },
    {
      id: "4",
      name: "David Wilson",
      title: "COO",
      organization: "Manufacturing Corp",
      industry: "Manufacturing",
      location: "Chicago, IL",
      mutualConnections: 6,
      rating: 4.6,
      matchScore: 87,
      reason: "Complementary operational expertise",
    },
    {
      id: "5",
      name: "Lisa Wang",
      title: "CMO",
      organization: "Digital Marketing Pro",
      industry: "Marketing",
      location: "Los Angeles, CA",
      mutualConnections: 9,
      rating: 4.9,
      matchScore: 82,
      reason: "Strategic marketing alignment",
    },
  ]

  const pendingRequests = [
    {
      id: "6",
      name: "Alex Thompson",
      title: "CTO",
      organization: "StartupX",
      industry: "Technology",
      message: "I'd love to connect and discuss digital transformation strategies.",
      requestDate: "2 days ago",
      type: "incoming",
    },
    {
      id: "7",
      name: "Maria Garcia",
      title: "CEO",
      organization: "GrowthCorp",
      industry: "Consulting",
      message: "Looking forward to connecting with fellow executives.",
      requestDate: "1 day ago",
      type: "outgoing",
    },
  ]

  const filteredSuggestions = suggestions.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = industryFilter === "all" || person.industry.toLowerCase() === industryFilter.toLowerCase()
    const matchesRole = roleFilter === "all" || person.title.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesIndustry && matchesRole
  })

  if (!user) {
    return <div>Please log in to access your network.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Executive Network</h1>
            <p className="text-muted-foreground">Connect with fellow executives and expand your professional network</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {connections.length + 125} connections
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search executives by name or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="cfo">CFO</SelectItem>
                    <SelectItem value="coo">COO</SelectItem>
                    <SelectItem value="cmo">CMO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">Smart Matches</TabsTrigger>
            <TabsTrigger value="connections">My Network</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuggestions.map((person) => (
                <Card key={person.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{person.name}</CardTitle>
                        <CardDescription className="truncate">
                          {person.title} at {person.organization}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-500">
                          {person.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3" />
                        <span className="truncate">{person.industry}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{person.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{person.mutualConnections} mutual</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{person.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded">{person.reason}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {connection.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium">{connection.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {connection.title} at {connection.organization}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline">{connection.industry}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {connection.mutualConnections} mutual connections
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last interaction: {connection.lastInteraction}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {request.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium">{request.name}</h3>
                        <Badge variant={request.type === "incoming" ? "default" : "secondary"}>
                          {request.type === "incoming" ? "Incoming" : "Sent"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {request.title} at {request.organization}
                      </p>
                      <p className="text-sm bg-muted p-2 rounded mb-2">"{request.message}"</p>
                      <p className="text-xs text-muted-foreground">{request.requestDate}</p>
                    </div>
                    {request.type === "incoming" && (
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">Accept</Button>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

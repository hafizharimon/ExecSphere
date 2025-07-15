"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, UserPlus, MapPin, Building, Star } from "lucide-react"

interface Connection {
  id: string
  name: string
  title: string
  company: string
  industry: string
  location: string
  matchScore: number
  mutualConnections: number
  avatar?: string
  verified: boolean
  premium: boolean
}

interface SmartConnectionsPanelProps {
  className?: string
}

export function SmartConnectionsPanel({ className }: SmartConnectionsPanelProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for smart connections
  const mockConnections: Connection[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      title: "CEO",
      company: "TechCorp Solutions",
      industry: "Technology",
      location: "Mumbai",
      matchScore: 95,
      mutualConnections: 12,
      avatar: "/placeholder-user.jpg",
      verified: true,
      premium: true,
    },
    {
      id: "2",
      name: "Priya Sharma",
      title: "CTO",
      company: "InnovateTech",
      industry: "Technology",
      location: "Bangalore",
      matchScore: 88,
      mutualConnections: 8,
      avatar: "/placeholder-user.jpg",
      verified: true,
      premium: true,
    },
    {
      id: "3",
      name: "Amit Patel",
      title: "CFO",
      company: "FinanceFirst",
      industry: "Finance",
      location: "Delhi",
      matchScore: 82,
      mutualConnections: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      premium: false,
    },
    {
      id: "4",
      name: "Sunita Reddy",
      title: "CMO",
      company: "BrandBuilders",
      industry: "Marketing",
      location: "Hyderabad",
      matchScore: 79,
      mutualConnections: 3,
      avatar: "/placeholder-user.jpg",
      verified: true,
      premium: true,
    },
    {
      id: "5",
      name: "Vikram Singh",
      title: "COO",
      company: "OperationsExcel",
      industry: "Operations",
      location: "Chennai",
      matchScore: 75,
      mutualConnections: 7,
      avatar: "/placeholder-user.jpg",
      verified: false,
      premium: false,
    },
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setConnections(mockConnections)
      setFilteredConnections(mockConnections)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = connections

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (connection) =>
          connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          connection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          connection.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter((connection) => connection.industry === industryFilter)
    }

    // Apply location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((connection) => connection.location === locationFilter)
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore)

    setFilteredConnections(filtered)
  }, [connections, searchQuery, industryFilter, locationFilter])

  const handleConnect = (connectionId: string) => {
    console.log("Connecting to:", connectionId)
    // Implement connection logic
  }

  const industries = ["Technology", "Finance", "Marketing", "Operations", "Healthcare", "Manufacturing"]
  const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"]

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Smart Connections
          </CardTitle>
          <CardDescription>Loading personalized connections...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Smart Connections
        </CardTitle>
        <CardDescription>AI-powered executive connections based on your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredConnections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No connections found matching your criteria</p>
            </div>
          ) : (
            filteredConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                    <AvatarFallback>
                      {connection.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {connection.verified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{connection.name}</h4>
                    {connection.premium && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-1">
                    {connection.title} at {connection.company}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {connection.industry}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {connection.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-medium text-green-600">{connection.matchScore}% match</span>
                      <span className="text-muted-foreground">{connection.mutualConnections} mutual connections</span>
                    </div>

                    <Button size="sm" onClick={() => handleConnect(connection.id)} className="ml-2">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredConnections.length > 0 && (
          <div className="text-center pt-4 border-t">
            <Button variant="outline" className="w-full bg-transparent">
              View All Connections
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

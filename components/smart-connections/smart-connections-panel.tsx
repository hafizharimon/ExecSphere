"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Sparkles, RefreshCw, MessageCircle, UserPlus, Building2, MapPin, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartConnection {
  id: string
  recommendedUserId: string
  connectionScore: number
  status: "pending" | "connected" | "declined"
  matchingFactors: string[]
  recommendedUser: {
    id: string
    name: string
    role: string
    organization: string
    industry: string
    location: string
    avatar?: string
  }
}

interface SmartConnectionsPanelProps {
  onStartChat?: (userId: string) => void
  className?: string
}

// Mock data for smart connections
const mockConnections: SmartConnection[] = [
  {
    id: "1",
    recommendedUserId: "user1",
    connectionScore: 0.85,
    status: "pending",
    matchingFactors: ["Technology", "Leadership", "Startup Experience"],
    recommendedUser: {
      id: "user1",
      name: "Rajesh Kumar",
      role: "Chief Technology Officer",
      organization: "TechCorp India",
      industry: "Technology",
      location: "Mumbai",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    recommendedUserId: "user2",
    connectionScore: 0.78,
    status: "pending",
    matchingFactors: ["Marketing", "E-commerce", "Digital Strategy"],
    recommendedUser: {
      id: "user2",
      name: "Priya Sharma",
      role: "Chief Marketing Officer",
      organization: "E-commerce Solutions",
      industry: "E-commerce",
      location: "Bangalore",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    recommendedUserId: "user3",
    connectionScore: 0.72,
    status: "connected",
    matchingFactors: ["Finance", "Investment", "Strategic Planning"],
    recommendedUser: {
      id: "user3",
      name: "Amit Patel",
      role: "Chief Financial Officer",
      organization: "FinanceFirst Ltd",
      industry: "Finance",
      location: "Delhi",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export function SmartConnectionsPanel({ onStartChat, className }: SmartConnectionsPanelProps) {
  const { user } = useAuth()
  const [connections, setConnections] = useState<SmartConnection[]>([])
  const [filteredConnections, setFilteredConnections] = useState<SmartConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [minScore, setMinScore] = useState<number>(0)

  useEffect(() => {
    if (user) {
      loadConnections()
    }
  }, [user])

  useEffect(() => {
    filterConnections()
  }, [connections, searchTerm, selectedIndustry, selectedRole, minScore])

  const loadConnections = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setConnections(mockConnections)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to load connections:", error)
      setIsLoading(false)
    }
  }

  const refreshRecommendations = async () => {
    if (!user) return

    try {
      setIsRefreshing(true)
      // Simulate refresh
      setTimeout(() => {
        setConnections([...mockConnections])
        setIsRefreshing(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to refresh recommendations:", error)
      setIsRefreshing(false)
    }
  }

  const filterConnections = () => {
    let filtered = connections

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (conn) =>
          conn.recommendedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conn.recommendedUser.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conn.recommendedUser.role.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((conn) => conn.recommendedUser.industry === selectedIndustry)
    }

    // Role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((conn) => conn.recommendedUser.role === selectedRole)
    }

    // Score filter
    filtered = filtered.filter((conn) => conn.connectionScore >= minScore)

    setFilteredConnections(filtered)
  }

  const handleConnect = async (connection: SmartConnection) => {
    try {
      // Update connection status locally
      setConnections((prev) =>
        prev.map((conn) => (conn.id === connection.id ? { ...conn, status: "connected" as const } : conn)),
      )
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const handleStartChat = (connection: SmartConnection) => {
    onStartChat?.(connection.recommendedUserId)
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-blue-600"
    if (score >= 0.4) return "text-yellow-600"
    return "text-gray-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return "Excellent Match"
    if (score >= 0.6) return "Good Match"
    if (score >= 0.4) return "Fair Match"
    return "Basic Match"
  }

  const industries = Array.from(new Set(connections.map((conn) => conn.recommendedUser.industry)))
  const roles = Array.from(new Set(connections.map((conn) => conn.recommendedUser.role)))

  if (!user) {
    return null
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Smart Connections
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshRecommendations} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No connections found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or refresh recommendations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={connection.recommendedUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {connection.recommendedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{connection.recommendedUser.name}</h3>
                      <Badge variant="secondary" className={cn("text-xs", getScoreColor(connection.connectionScore))}>
                        {Math.round(connection.connectionScore * 100)}%
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">{connection.recommendedUser.role}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{connection.recommendedUser.organization}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{connection.recommendedUser.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{getScoreLabel(connection.connectionScore)}</span>
                    </div>

                    <div className="flex gap-2">
                      {connection.status === "pending" ? (
                        <Button size="sm" onClick={() => handleConnect(connection)} className="flex-1">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartChat(connection)}
                          className="flex-1"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {connection.matchingFactors && connection.matchingFactors.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Common interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {connection.matchingFactors.slice(0, 3).map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

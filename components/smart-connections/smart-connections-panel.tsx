"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { smartConnectionsService, type SmartConnection } from "@/services/smart-connections-service"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartConnectionsPanelProps {
  onStartChat?: (userId: string) => void
  className?: string
}

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
      const result = await smartConnectionsService.getSmartConnections(user.id)
      
      if (result.success && result.data) {
        setConnections(result.data)
      }
    } catch (error) {
      console.error("Failed to load connections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshRecommendations = async () => {
    if (!user) return

    try {
      setIsRefreshing(true)
      await smartConnectionsService.refreshRecommendations(user.id)
      await loadConnections()
    } catch (error) {
      console.error("Failed to refresh recommendations:", error)
    } finally {
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
          conn.recommendedUser.role.toLowerCase().includes(searchTerm.toLowerCase())
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
      const result = await smartConnectionsService.connectWithUser(
        user!.id,
        connection.recommendedUserId,
        `Hi ${connection.recommendedUser.name}, I'd like to connect with you based on our shared interests and background.`
      )

      if (result.success) {
        // Update connection status locally
        setConnections(prev =>
          prev.map(conn =>
            conn.id === connection.id
              ? { ...conn, status: 'connected' }
              : conn
          )
        )

        // Track interaction
        await smartConnectionsService.trackInteraction(
          user!.id,
          connection.recommendedUserId,
          'connection_request'
        )
      }
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const handleStartChat = (connection: SmartConnection) => {
    onStartChat?.(connection.recommendedUserId)
    
    // Track interaction
    smartConnectionsService.trackInteraction(
      user!.id,
      connection.recommendedUserId,
      'chat_initiated'
    )
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

  const industries = Array.from(new Set(connections.map(conn => conn.recommendedUser.industry)))
  const roles = Array.from(new Set(connections.map(conn => conn.recommendedUser.role)))

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
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={isRefreshing}
          >
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
                  <SelectItem key={role} value={role}>\

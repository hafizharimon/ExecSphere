"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type ServiceProvider } from "@/services/super-admin-service"
import {
  ArrowLeft,
  Zap,
  Plus,
  Settings,
  CreditCard,
  Shield,
  MessageSquare,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

const PROVIDER_TYPES = [
  { value: "payment", label: "Payment Gateway", icon: CreditCard },
  { value: "verification", label: "Verification Service", icon: Shield },
  { value: "communication", label: "Communication Service", icon: MessageSquare },
  { value: "analytics", label: "Analytics Service", icon: BarChart3 },
]

export default function ProvidersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [newProvider, setNewProvider] = useState({
    providerName: "",
    providerType: "",
    apiEndpoint: "",
    configuration: "{}",
  })

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadServiceProviders()
    }
  }, [user])

  const loadServiceProviders = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getServiceProviders()
      if (result.success && result.data) {
        setProviders(result.data)
      }
    } catch (error) {
      console.error("Load service providers error:", error)
      toast({
        title: "Error",
        description: "Failed to load service providers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProvider = async () => {
    if (!newProvider.providerName.trim() || !newProvider.providerType) {
      toast({
        title: "Error",
        description: "Provider name and type are required",
        variant: "destructive",
      })
      return
    }

    try {
      let configuration = {}
      try {
        configuration = JSON.parse(newProvider.configuration)
      } catch (e) {
        toast({
          title: "Error",
          description: "Invalid JSON configuration",
          variant: "destructive",
        })
        return
      }

      // Mock create provider (in real app, this would call the API)
      const mockProvider: ServiceProvider = {
        id: Math.random().toString(36).substring(2),
        providerName: newProvider.providerName,
        providerType: newProvider.providerType as any,
        apiEndpoint: newProvider.apiEndpoint,
        configuration,
        status: "active",
        healthStatus: "healthy",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setProviders((prev) => [...prev, mockProvider])

      toast({
        title: "Provider created",
        description: `${newProvider.providerName} has been added successfully.`,
      })

      setIsCreateDialogOpen(false)
      setNewProvider({
        providerName: "",
        providerType: "",
        apiEndpoint: "",
        configuration: "{}",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service provider",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProviderStatus = async (providerId: string, newStatus: string) => {
    try {
      const result = await superAdminService.updateServiceProvider(providerId, { status: newStatus as any })
      if (result.success) {
        setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, status: newStatus as any } : p)))
        toast({
          title: "Status updated",
          description: `Provider status has been updated to ${newStatus}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive",
      })
    }
  }

  const runHealthCheck = async (providerId: string) => {
    try {
      // Mock health check
      const healthStatus = Math.random() > 0.2 ? "healthy" : "degraded"

      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? {
                ...p,
                healthStatus: healthStatus as any,
                lastHealthCheck: new Date().toISOString(),
              }
            : p,
        ),
      )

      toast({
        title: "Health check completed",
        description: `Provider is ${healthStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run health check",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, className: "bg-green-500", icon: CheckCircle },
      inactive: { variant: "secondary" as const, className: "bg-gray-500", icon: XCircle },
      maintenance: { variant: "destructive" as const, className: "bg-yellow-500", icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getHealthBadge = (healthStatus?: string) => {
    if (!healthStatus) return null

    const healthConfig = {
      healthy: { variant: "default" as const, className: "bg-green-500" },
      degraded: { variant: "destructive" as const, className: "bg-yellow-500" },
      down: { variant: "destructive" as const, className: "bg-red-500" },
    }

    const config = healthConfig[healthStatus as keyof typeof healthConfig] || healthConfig.down

    return (
      <Badge variant={config.variant} className={config.className}>
        {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
      </Badge>
    )
  }

  const getProviderTypeIcon = (type: string) => {
    const typeConfig = PROVIDER_TYPES.find((t) => t.value === type)
    const Icon = typeConfig?.icon || Zap
    return <Icon className="h-4 w-4" />
  }

  // Mock default providers
  const getDefaultProviders = (): ServiceProvider[] => [
    {
      id: "razorpay",
      providerName: "Razorpay",
      providerType: "payment",
      apiEndpoint: "https://api.razorpay.com/v1",
      configuration: { currency: "INR", webhook_secret: "***" },
      status: "active",
      healthStatus: "healthy",
      lastHealthCheck: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "linkedin",
      providerName: "LinkedIn API",
      providerType: "verification",
      apiEndpoint: "https://api.linkedin.com/v2",
      configuration: { client_id: "***", client_secret: "***" },
      status: "active",
      healthStatus: "healthy",
      lastHealthCheck: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "mca",
      providerName: "MCA Verification",
      providerType: "verification",
      apiEndpoint: "https://api.mca.gov.in/v1",
      configuration: { api_key: "***" },
      status: "active",
      healthStatus: "degraded",
      lastHealthCheck: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "sendgrid",
      providerName: "SendGrid",
      providerType: "communication",
      apiEndpoint: "https://api.sendgrid.com/v3",
      configuration: { api_key: "***", from_email: "noreply@cxonetwork.com" },
      status: "active",
      healthStatus: "healthy",
      lastHealthCheck: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
  ]

  if (!user || user.userType !== "super-admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    )
  }

  const allProviders = [...getDefaultProviders(), ...providers]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/super-admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Service Providers
              </h1>
              <p className="text-muted-foreground">Manage third-party service integrations</p>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Service Provider</DialogTitle>
                <DialogDescription>Integrate a new third-party service provider with the platform.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="providerName">Provider Name *</Label>
                    <Input
                      id="providerName"
                      placeholder="e.g., Stripe, Twilio"
                      value={newProvider.providerName}
                      onChange={(e) => setNewProvider((prev) => ({ ...prev, providerName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="providerType">Provider Type *</Label>
                    <Select
                      value={newProvider.providerType}
                      onValueChange={(value) => setNewProvider((prev) => ({ ...prev, providerType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input
                    id="apiEndpoint"
                    placeholder="https://api.example.com/v1"
                    value={newProvider.apiEndpoint}
                    onChange={(e) => setNewProvider((prev) => ({ ...prev, apiEndpoint: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="configuration">Configuration (JSON)</Label>
                  <Textarea
                    id="configuration"
                    placeholder='{"api_key": "your_key", "webhook_url": "https://..."}'
                    value={newProvider.configuration}
                    onChange={(e) => setNewProvider((prev) => ({ ...prev, configuration: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProvider}
                  disabled={!newProvider.providerName.trim() || !newProvider.providerType}
                >
                  Add Provider
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading service providers...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getProviderTypeIcon(provider.providerType)}
                      {provider.providerName}
                    </div>
                    {getStatusBadge(provider.status)}
                  </CardTitle>
                  <CardDescription>
                    {PROVIDER_TYPES.find((t) => t.value === provider.providerType)?.label || provider.providerType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Status:</span>
                      {getHealthBadge(provider.healthStatus)}
                    </div>

                    {provider.lastHealthCheck && (
                      <div className="flex justify-between text-sm">
                        <span>Last Check:</span>
                        <span className="text-muted-foreground">
                          {new Date(provider.lastHealthCheck).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {provider.apiEndpoint && (
                      <div className="text-sm">
                        <span className="font-medium">Endpoint:</span>
                        <p className="text-muted-foreground truncate">{provider.apiEndpoint}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => runHealthCheck(provider.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Health Check
                    </Button>

                    <Select
                      value={provider.status}
                      onValueChange={(value) => handleUpdateProviderStatus(provider.id, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

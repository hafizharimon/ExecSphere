"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type PlatformConfiguration } from "@/services/super-admin-service"
import { ArrowLeft, Settings, Save, Shield, Zap, Bell, Users, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PlatformPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [configurations, setConfigurations] = useState<PlatformConfiguration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editedConfigs, setEditedConfigs] = useState<Record<string, any>>({})

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadPlatformConfigurations()
    }
  }, [user])

  const loadPlatformConfigurations = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getPlatformConfigurations()
      if (result.success && result.data) {
        setConfigurations(result.data)
      }
    } catch (error) {
      console.error("Load platform configurations error:", error)
      toast({
        title: "Error",
        description: "Failed to load platform configurations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigChange = (configId: string, value: any) => {
    setEditedConfigs((prev) => ({
      ...prev,
      [configId]: value,
    }))
  }

  const saveConfigurations = async () => {
    setIsSaving(true)
    try {
      const promises = Object.entries(editedConfigs).map(([configId, value]) =>
        superAdminService.updatePlatformConfiguration(configId, value),
      )

      const results = await Promise.all(promises)
      const failedUpdates = results.filter((result) => !result.success)

      if (failedUpdates.length === 0) {
        toast({
          title: "Configurations saved",
          description: "All platform configurations have been updated successfully.",
        })
        setEditedConfigs({})
        await loadPlatformConfigurations()
      } else {
        toast({
          title: "Partial success",
          description: `${results.length - failedUpdates.length} configurations saved, ${failedUpdates.length} failed.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configurations",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderConfigInput = (config: PlatformConfiguration) => {
    const currentValue = editedConfigs[config.id] ?? config.configValue
    const hasChanges = editedConfigs[config.id] !== undefined

    if (
      typeof config.configValue === "boolean" ||
      (typeof config.configValue === "object" && "enabled" in config.configValue)
    ) {
      const isEnabled = typeof config.configValue === "boolean" ? currentValue : currentValue?.enabled
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              const newValue = typeof config.configValue === "boolean" ? checked : { ...currentValue, enabled: checked }
              handleConfigChange(config.id, newValue)
            }}
          />
          <Label>{isEnabled ? "Enabled" : "Disabled"}</Label>
          {hasChanges && <span className="text-xs text-orange-500">*</span>}
        </div>
      )
    }

    if (typeof config.configValue === "object") {
      return (
        <div className="space-y-1">
          <Textarea
            value={typeof currentValue === "string" ? currentValue : JSON.stringify(currentValue, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleConfigChange(config.id, parsed)
              } catch {
                handleConfigChange(config.id, e.target.value)
              }
            }}
            rows={4}
            className={hasChanges ? "border-orange-500" : ""}
          />
          {hasChanges && <span className="text-xs text-orange-500">Unsaved changes</span>}
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <Input
          value={currentValue?.toString() || ""}
          onChange={(e) => handleConfigChange(config.id, e.target.value)}
          className={hasChanges ? "border-orange-500" : ""}
        />
        {hasChanges && <span className="text-xs text-orange-500">Unsaved changes</span>}
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return <Shield className="h-5 w-5" />
      case "features":
        return <Zap className="h-5 w-5" />
      case "limits":
        return <Users className="h-5 w-5" />
      case "notifications":
        return <Bell className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "security":
        return "Security policies and authentication settings"
      case "features":
        return "Platform feature toggles and functionality controls"
      case "limits":
        return "User limits and rate limiting configurations"
      case "notifications":
        return "Notification preferences and delivery settings"
      default:
        return "General platform configurations"
    }
  }

  // Mock default configurations if none loaded
  const getDefaultConfigurations = (): PlatformConfiguration[] => [
    {
      id: "security-session",
      configCategory: "security",
      configKey: "session_timeout",
      configValue: { hours: 24 },
      isActive: true,
      description: "User session timeout duration",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "security-login",
      configCategory: "security",
      configKey: "max_login_attempts",
      configValue: { attempts: 5, lockout_minutes: 30 },
      isActive: true,
      description: "Maximum login attempts before account lockout",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "features-chat",
      configCategory: "features",
      configKey: "chat_enabled",
      configValue: { enabled: true },
      isActive: true,
      description: "Enable/disable chat functionality",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "features-mentorship",
      configCategory: "features",
      configKey: "mentorship_enabled",
      configValue: { enabled: true },
      isActive: true,
      description: "Enable/disable mentorship features",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "limits-connections",
      configCategory: "limits",
      configKey: "daily_connection_requests",
      configValue: { limit: 10 },
      isActive: true,
      description: "Daily limit for connection requests per user",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "limits-sessions",
      configCategory: "limits",
      configKey: "monthly_mentor_sessions",
      configValue: { limit: 50 },
      isActive: true,
      description: "Monthly limit for mentor sessions per user",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "notifications-email",
      configCategory: "notifications",
      configKey: "email_notifications",
      configValue: { enabled: true, types: ["approval", "rejection", "payment"] },
      isActive: true,
      description: "Email notification settings and types",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "notifications-push",
      configCategory: "notifications",
      configKey: "push_notifications",
      configValue: { enabled: true },
      isActive: true,
      description: "Push notification settings",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
  ]

  const allConfigurations = configurations.length > 0 ? configurations : getDefaultConfigurations()

  const groupedConfigurations = allConfigurations.reduce(
    (groups, config) => {
      const category = config.configCategory
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(config)
      return groups
    },
    {} as Record<string, PlatformConfiguration[]>,
  )

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
                <Settings className="h-6 w-6" />
                Platform Configuration
              </h1>
              <p className="text-muted-foreground">Manage platform-wide settings and feature toggles</p>
            </div>
          </div>

          {Object.keys(editedConfigs).length > 0 && (
            <Button onClick={saveConfigurations} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : `Save Changes (${Object.keys(editedConfigs).length})`}
            </Button>
          )}
        </div>

        {/* Platform Status Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operational</div>
              <p className="text-xs text-muted-foreground">All systems running normally</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Features</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8/10</div>
              <p className="text-xs text-muted-foreground">Features enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Level</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">High</div>
              <p className="text-xs text-muted-foreground">All security measures active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Changes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(editedConfigs).length}</div>
              <p className="text-xs text-muted-foreground">Unsaved configurations</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading platform configurations...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedConfigurations).map(([category, categoryConfigs]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category.charAt(0).toUpperCase() + category.slice(1)} Configuration
                  </CardTitle>
                  <CardDescription>{getCategoryDescription(category)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categoryConfigs.map((config) => (
                    <div key={config.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={config.id} className="text-sm font-medium">
                          {config.configKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Badge variant={config.isActive ? "default" : "secondary"}>
                            {config.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {editedConfigs[config.id] !== undefined && (
                            <Badge variant="outline" className="text-orange-600">
                              Modified
                            </Badge>
                          )}
                        </div>
                      </div>

                      {config.description && <p className="text-xs text-muted-foreground">{config.description}</p>}

                      {renderConfigInput(config)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

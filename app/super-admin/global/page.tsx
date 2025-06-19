"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type GlobalSetting } from "@/services/super-admin-service"
import {
  ArrowLeft,
  Settings,
  Save,
  RefreshCw,
  Globe,
  DollarSign,
  Shield,
  Clock,
  Users,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function GlobalSettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState<GlobalSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingSettings, setEditingSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadGlobalSettings()
    }
  }, [user])

  const loadGlobalSettings = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getGlobalSettings()
      if (result.success && result.data) {
        setSettings(result.data)

        // Initialize editing state
        const editingState: Record<string, any> = {}
        result.data.forEach((setting) => {
          editingState[setting.settingKey] = setting.settingValue
        })
        setEditingSettings(editingState)
      }
    } catch (error) {
      console.error("Load global settings error:", error)
      toast({
        title: "Error",
        description: "Failed to load global settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSetting = async (settingKey: string, settingType: string) => {
    setIsSaving(true)
    try {
      const newValue = editingSettings[settingKey]
      const result = await superAdminService.updateGlobalSetting(settingKey, newValue, settingType)

      if (result.success) {
        // Update local state
        setSettings((prev) =>
          prev.map((setting) =>
            setting.settingKey === settingKey
              ? { ...setting, settingValue: newValue, updatedAt: new Date().toISOString() }
              : setting,
          ),
        )

        toast({
          title: "Setting Updated",
          description: `${settingKey} has been updated successfully`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update setting",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (settingKey: string, value: any) => {
    setEditingSettings((prev) => ({
      ...prev,
      [settingKey]: value,
    }))
  }

  const renderSettingInput = (setting: GlobalSetting) => {
    const currentValue = editingSettings[setting.settingKey] || setting.settingValue
    const hasChanged = currentValue !== setting.settingValue

    switch (setting.settingType) {
      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">{setting.settingKey.replace(/_/g, " ").toUpperCase()}</Label>
              {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={currentValue === "true"}
                onCheckedChange={(checked) => handleInputChange(setting.settingKey, checked.toString())}
              />
              {hasChanged && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateSetting(setting.settingKey, setting.settingType)}
                  disabled={isSaving}
                >
                  <Save className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )

      case "number":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{setting.settingKey.replace(/_/g, " ").toUpperCase()}</Label>
            {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
            <div className="flex space-x-2">
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => handleInputChange(setting.settingKey, e.target.value)}
                className="flex-1"
              />
              {hasChanged && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateSetting(setting.settingKey, setting.settingType)}
                  disabled={isSaving}
                >
                  <Save className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )

      case "string":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{setting.settingKey.replace(/_/g, " ").toUpperCase()}</Label>
            {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
            <div className="flex space-x-2">
              <Input
                value={currentValue}
                onChange={(e) => handleInputChange(setting.settingKey, e.target.value)}
                className="flex-1"
              />
              {hasChanged && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateSetting(setting.settingKey, setting.settingType)}
                  disabled={isSaving}
                >
                  <Save className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )

      case "json":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{setting.settingKey.replace(/_/g, " ").toUpperCase()}</Label>
            {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
            <div className="space-y-2">
              <Textarea
                value={typeof currentValue === "string" ? currentValue : JSON.stringify(currentValue, null, 2)}
                onChange={(e) => handleInputChange(setting.settingKey, e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
              {hasChanged && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateSetting(setting.settingKey, setting.settingType)}
                  disabled={isSaving}
                  className="w-full"
                >
                  <Save className="h-3 w-3 mr-2" />
                  Update JSON Setting
                </Button>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getSettingIcon = (settingKey: string) => {
    if (settingKey.includes("fee") || settingKey.includes("rate") || settingKey.includes("amount")) {
      return <DollarSign className="h-4 w-4" />
    }
    if (settingKey.includes("security") || settingKey.includes("auth")) {
      return <Shield className="h-4 w-4" />
    }
    if (settingKey.includes("time") || settingKey.includes("timeout")) {
      return <Clock className="h-4 w-4" />
    }
    if (settingKey.includes("user") || settingKey.includes("limit")) {
      return <Users className="h-4 w-4" />
    }
    if (settingKey.includes("api") || settingKey.includes("linkedin")) {
      return <Zap className="h-4 w-4" />
    }
    if (settingKey.includes("maintenance") || settingKey.includes("mode")) {
      return <AlertTriangle className="h-4 w-4" />
    }
    return <Settings className="h-4 w-4" />
  }

  const getSettingCategory = (settingKey: string) => {
    if (settingKey.includes("fee") || settingKey.includes("rate") || settingKey.includes("amount")) {
      return "Financial"
    }
    if (settingKey.includes("security") || settingKey.includes("auth")) {
      return "Security"
    }
    if (settingKey.includes("api") || settingKey.includes("linkedin")) {
      return "Integrations"
    }
    if (settingKey.includes("user") || settingKey.includes("limit")) {
      return "User Management"
    }
    if (settingKey.includes("maintenance") || settingKey.includes("mode")) {
      return "System"
    }
    return "General"
  }

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

  // Group settings by category
  const settingsByCategory = settings.reduce(
    (acc, setting) => {
      const category = getSettingCategory(setting.settingKey)
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(setting)
      return acc
    },
    {} as Record<string, GlobalSetting[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/super-admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Globe className="h-8 w-8 text-blue-500" />
                Global Settings
              </h1>
              <p className="text-muted-foreground">Manage platform-wide configurations and settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={loadGlobalSettings} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading global settings...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(settingsByCategory).map(([category, categorySettings]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getSettingIcon(categorySettings[0]?.settingKey)}
                    {category} Settings
                  </CardTitle>
                  <CardDescription>Configure {category.toLowerCase()} related platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categorySettings.map((setting) => (
                    <div key={setting.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getSettingIcon(setting.settingKey)}
                          <span className="font-medium">{setting.settingKey}</span>
                          {setting.isPublic && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {setting.settingType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {new Date(setting.updatedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {renderSettingInput(setting)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>Current platform status and health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">API Services</p>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">External Integrations</p>
                      <p className="text-sm text-muted-foreground">LinkedIn, MCA, Udyam active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/super-admin/verifications">
                      <Users className="h-6 w-6 mb-2" />
                      <span>User Verifications</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/super-admin/billing">
                      <DollarSign className="h-6 w-6 mb-2" />
                      <span>Billing Overview</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/super-admin/database">
                      <Database className="h-6 w-6 mb-2" />
                      <span>Database Health</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" asChild>
                    <Link href="/super-admin/providers">
                      <Zap className="h-6 w-6 mb-2" />
                      <span>Service Providers</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

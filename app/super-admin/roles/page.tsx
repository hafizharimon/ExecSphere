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
import { Checkbox } from "@/components/ui/checkbox"
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
import { superAdminService, type CustomRole } from "@/services/super-admin-service"
import { ArrowLeft, Shield, Plus, Settings, Crown } from "lucide-react"
import Link from "next/link"

const AVAILABLE_PERMISSIONS = [
  { id: "networking", label: "Networking", description: "Access to networking features" },
  { id: "mentorship", label: "Mentorship", description: "Provide mentorship services" },
  { id: "events", label: "Events", description: "Create and manage events" },
  { id: "advisory", label: "Advisory", description: "Provide advisory services" },
  { id: "content_creation", label: "Content Creation", description: "Create and publish content" },
  { id: "company_management", label: "Company Management", description: "Manage company pages" },
  { id: "analytics", label: "Analytics", description: "Access to analytics dashboard" },
  { id: "premium_features", label: "Premium Features", description: "Access to premium platform features" },
]

export default function RolesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [roles, setRoles] = useState<CustomRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState({
    roleName: "",
    roleDescription: "",
    maxHourlyRate: "",
    permissions: [] as string[],
  })

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadCustomRoles()
    }
  }, [user])

  const loadCustomRoles = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getCustomRoles()
      if (result.success && result.data) {
        setRoles(result.data)
      }
    } catch (error) {
      console.error("Load custom roles error:", error)
      toast({
        title: "Error",
        description: "Failed to load custom roles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRole = async () => {
    if (!newRole.roleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await superAdminService.createCustomRole({
        roleName: newRole.roleName,
        roleDescription: newRole.roleDescription,
        maxHourlyRate: newRole.maxHourlyRate ? Number.parseFloat(newRole.maxHourlyRate) : undefined,
        permissions: newRole.permissions,
      })

      if (result.success) {
        toast({
          title: "Role created",
          description: `${newRole.roleName} role has been created successfully.`,
        })
        setIsCreateDialogOpen(false)
        setNewRole({
          roleName: "",
          roleDescription: "",
          maxHourlyRate: "",
          permissions: [],
        })
        await loadCustomRoles()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      })
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permissionId] : prev.permissions.filter((p) => p !== permissionId),
    }))
  }

  const getDefaultRoles = () => [
    {
      id: "ceo",
      roleName: "CEO",
      roleDescription: "Chief Executive Officer",
      maxHourlyRate: 10000,
      permissions: [
        "networking",
        "mentorship",
        "events",
        "advisory",
        "content_creation",
        "company_management",
        "analytics",
        "premium_features",
      ],
      isActive: true,
      userCount: 45,
      isDefault: true,
    },
    {
      id: "cto",
      roleName: "CTO",
      roleDescription: "Chief Technology Officer",
      maxHourlyRate: 8000,
      permissions: ["networking", "mentorship", "events", "advisory", "content_creation", "analytics"],
      isActive: true,
      userCount: 32,
      isDefault: true,
    },
    {
      id: "cfo",
      roleName: "CFO",
      roleDescription: "Chief Financial Officer",
      maxHourlyRate: 8000,
      permissions: ["networking", "mentorship", "events", "advisory", "analytics"],
      isActive: true,
      userCount: 28,
      isDefault: true,
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

  const allRoles = [...getDefaultRoles(), ...roles]

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
                <Shield className="h-6 w-6" />
                Role Management
              </h1>
              <p className="text-muted-foreground">Manage user roles and permissions</p>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Executive Role</DialogTitle>
                <DialogDescription>
                  Add a new C-level position to the platform with specific permissions and rate limits.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input
                      id="roleName"
                      placeholder="e.g., CPO, CISO, CDO"
                      value={newRole.roleName}
                      onChange={(e) => setNewRole((prev) => ({ ...prev, roleName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxHourlyRate">Max Hourly Rate (₹)</Label>
                    <Input
                      id="maxHourlyRate"
                      type="number"
                      placeholder="e.g., 6000"
                      value={newRole.maxHourlyRate}
                      onChange={(e) => setNewRole((prev) => ({ ...prev, maxHourlyRate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    placeholder="e.g., Chief Product Officer"
                    value={newRole.roleDescription}
                    onChange={(e) => setNewRole((prev) => ({ ...prev, roleDescription: e.target.value }))}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {AVAILABLE_PERMISSIONS.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.id}
                          checked={newRole.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <div className="space-y-1">
                          <Label htmlFor={permission.id} className="text-sm font-medium">
                            {permission.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole} disabled={!newRole.roleName.trim()}>
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading roles...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Default Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Default Executive Roles
                </CardTitle>
                <CardDescription>
                  Standard C-level positions with predefined permissions and rate limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getDefaultRoles().map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{role.roleName}</h3>
                          <p className="text-sm text-muted-foreground">{role.roleDescription}</p>
                        </div>
                        <Badge variant="secondary">Default</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Max Rate:</span>
                          <span className="font-medium">₹{role.maxHourlyRate?.toLocaleString()}/hr</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Users:</span>
                          <span className="font-medium">{role.userCount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {AVAILABLE_PERMISSIONS.find((p) => p.id === permission)?.label || permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Custom Roles
                </CardTitle>
                <CardDescription>Custom executive positions created for specific organizational needs</CardDescription>
              </CardHeader>
              <CardContent>
                {roles.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No custom roles created</h3>
                    <p className="text-muted-foreground mb-4">
                      Create custom executive roles to match your organization's specific needs.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Custom Role
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                      <div key={role.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{role.roleName}</h3>
                            <p className="text-sm text-muted-foreground">{role.roleDescription}</p>
                          </div>
                          <Badge variant={role.isActive ? "default" : "secondary"}>
                            {role.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {role.maxHourlyRate && (
                            <div className="flex justify-between text-sm">
                              <span>Max Rate:</span>
                              <span className="font-medium">₹{role.maxHourlyRate.toLocaleString()}/hr</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Users:</span>
                            <span className="font-medium">{role.userCount || 0}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {AVAILABLE_PERMISSIONS.find((p) => p.id === permission)?.label || permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button variant={role.isActive ? "destructive" : "default"} size="sm" className="flex-1">
                            {role.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

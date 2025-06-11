"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Crown,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Megaphone,
  Shield,
  Database,
  Zap,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  UserPlus,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
  organization: string
}

interface SuperAdminDashboardProps {
  user: User
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [announcementText, setAnnouncementText] = useState("")
  const [announcementType, setAnnouncementType] = useState("info")

  const revenueData = {
    monthly: 125000,
    growth: 15.2,
    subscriptions: 1247,
    churnRate: 2.1,
    registrationFees: 45000, // New registrations * 1000
  }

  const platformMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    monthlyGrowth: 12.5,
    engagement: 78,
    pendingVerifications: 15,
  }

  const pendingVerifications = [
    {
      id: "1",
      name: "David Chen",
      email: "david.chen@techcorp.com",
      role: "CTO",
      organization: "TechCorp Solutions",
      industry: "Technology",
      yearsExperience: 12,
      linkedinProfile: "https://linkedin.com/in/david-chen",
      privileges: ["networking", "mentorship", "events"],
      paymentStatus: "completed",
      appliedDate: "2 days ago",
      registrationFee: 1000,
    },
    {
      id: "2",
      name: "Emily Rodriguez",
      email: "emily@healthplus.com",
      role: "CEO",
      organization: "HealthPlus Inc",
      industry: "Healthcare",
      yearsExperience: 18,
      linkedinProfile: "https://linkedin.com/in/emily-rodriguez",
      privileges: ["networking", "mentorship", "events", "advisory"],
      paymentStatus: "completed",
      appliedDate: "1 day ago",
      registrationFee: 1000,
    },
  ]

  const mentorFeeRequests = [
    {
      id: "1",
      mentorName: "Sarah Johnson",
      currentRole: "CTO",
      requestedFee: 12000,
      maxAllowed: 8000,
      reason: "15+ years experience in Fortune 500 companies, specialized in AI/ML transformations",
      requestDate: "1 day ago",
    },
    {
      id: "2",
      mentorName: "Michael Brown",
      currentRole: "CEO",
      requestedFee: 15000,
      maxAllowed: 10000,
      reason: "Successfully scaled 3 startups to IPO, extensive M&A experience",
      requestDate: "3 days ago",
    },
  ]

  const customRoles = [
    { id: "1", name: "CPO", description: "Chief Product Officer", maxFee: 6000, userCount: 23 },
    { id: "2", name: "CISO", description: "Chief Information Security Officer", maxFee: 7000, userCount: 12 },
    { id: "3", name: "CDO", description: "Chief Data Officer", maxFee: 6500, userCount: 8 },
  ]

  const serviceProviders = [
    {
      id: "1",
      name: "Executive Coaching Pro",
      category: "Coaching",
      status: "active",
      revenue: 15000,
      rating: 4.8,
      userCount: 45,
    },
    {
      id: "2",
      name: "Leadership Masterclass",
      category: "Training",
      status: "pending",
      revenue: 8500,
      rating: 4.6,
      userCount: 23,
    },
  ]

  const announcements = [
    {
      id: "1",
      title: "Platform Maintenance Scheduled",
      type: "maintenance",
      active: true,
      created: "2 days ago",
      content: "Scheduled maintenance on Sunday 2-4 AM IST",
    },
    {
      id: "2",
      title: "New Feature: AI Matchmaking",
      type: "feature",
      active: false,
      created: "1 week ago",
      content: "Enhanced AI-powered connection suggestions now available",
    },
  ]

  const handleApproveUser = (userId: string) => {
    console.log("Approving user:", userId)
    // Remove from pending list
  }

  const handleRejectUser = (userId: string) => {
    console.log("Rejecting user:", userId)
    // Remove from pending list and process refund
  }

  const handleApproveFeeRequest = (requestId: string) => {
    console.log("Approving fee request:", requestId)
  }

  const handleRejectFeeRequest = (requestId: string) => {
    console.log("Rejecting fee request:", requestId)
  }

  const handleCreateRole = () => {
    console.log("Creating new role:", { name: newRoleName, description: newRoleDescription })
    setNewRoleName("")
    setNewRoleDescription("")
  }

  const handleCreateAnnouncement = () => {
    console.log("Creating announcement:", { text: announcementText, type: announcementType })
    setAnnouncementText("")
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform oversight and business intelligence</p>
        </div>
        <Badge variant="default" className="bg-purple-500 w-fit">
          <Crown className="h-3 w-3 mr-1" />
          Super Administrator
        </Badge>
      </div>

      {/* Revenue & Business Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueData.monthly.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{revenueData.growth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registration Fees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueData.registrationFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">45 new registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{platformMetrics.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">User growth this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.engagement}%</div>
            <p className="text-xs text-muted-foreground">Daily active users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending User Verifications */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Verifications
            </CardTitle>
            <CardDescription>Review and approve new registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingVerifications.map((user) => (
              <div key={user.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.role} at {user.organization}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{user.industry}</Badge>
                      <Badge variant="default" className="bg-green-500">
                        ₹{user.registrationFee}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Experience:</strong> {user.yearsExperience} years
                  </p>
                  <p>
                    <strong>Privileges:</strong> {user.privileges.join(", ")}
                  </p>
                  <p>
                    <strong>Applied:</strong> {user.appliedDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1">
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>User Verification - {user.name}</DialogTitle>
                        <DialogDescription>Review user credentials and decide on approval</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <p className="text-sm">{user.name}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="text-sm">{user.email}</p>
                          </div>
                          <div>
                            <Label>Role</Label>
                            <p className="text-sm">{user.role}</p>
                          </div>
                          <div>
                            <Label>Organization</Label>
                            <p className="text-sm">{user.organization}</p>
                          </div>
                          <div>
                            <Label>Industry</Label>
                            <p className="text-sm">{user.industry}</p>
                          </div>
                          <div>
                            <Label>Experience</Label>
                            <p className="text-sm">{user.yearsExperience} years</p>
                          </div>
                        </div>
                        <div>
                          <Label>LinkedIn Profile</Label>
                          <p className="text-sm text-blue-600">{user.linkedinProfile}</p>
                        </div>
                        <div>
                          <Label>Selected Privileges</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {user.privileges.map((privilege) => (
                              <Badge key={privilege} variant="secondary">
                                {privilege}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm">Payment verified: ₹{user.registrationFee}</span>
                        </div>
                      </div>
                      <DialogFooter className="space-x-2">
                        <Button variant="destructive" onClick={() => handleRejectUser(user.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject & Refund
                        </Button>
                        <Button onClick={() => handleApproveUser(user.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve User
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/super-admin/verifications">View All Pending</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mentor Fee Requests */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fee Requests
            </CardTitle>
            <CardDescription>Mentor fee increase requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentorFeeRequests.map((request) => (
              <div key={request.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{request.mentorName}</p>
                    <p className="text-xs text-muted-foreground">{request.currentRole}</p>
                  </div>
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Exceeds Limit
                  </Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Requested:</span>
                    <span className="font-medium">₹{request.requestedFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Allowed:</span>
                    <span>₹{request.maxAllowed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excess:</span>
                    <span className="text-red-600">+₹{request.requestedFee - request.maxAllowed}</span>
                  </div>
                </div>
                <div className="p-2 bg-muted rounded text-xs">
                  <p>
                    <strong>Justification:</strong>
                  </p>
                  <p>{request.reason}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleRejectFeeRequest(request.id)}>
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleApproveFeeRequest(request.id)}>
                    Approve
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/super-admin/fee-requests">View All Requests</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Role Management */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Management
            </CardTitle>
            <CardDescription>Create and manage executive roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Executive Role</DialogTitle>
                  <DialogDescription>Add a new C-level position to the platform</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      placeholder="e.g., CPO, CISO, CDO"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      placeholder="e.g., Chief Product Officer"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateRole} disabled={!newRoleName || !newRoleDescription}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {customRoles.map((role) => (
                <div key={role.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">₹{role.maxFee} max</p>
                    <p className="text-xs text-muted-foreground">{role.userCount} users</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Platform Announcements
            </CardTitle>
            <CardDescription>Manage platform-wide announcements and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Megaphone className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Platform Announcement</DialogTitle>
                  <DialogDescription>Send a message to all platform users</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcementType">Type</Label>
                    <Select value={announcementType} onValueChange={setAnnouncementType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="feature">New Feature</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcementText">Message</Label>
                    <Textarea
                      id="announcementText"
                      placeholder="Enter your announcement message..."
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateAnnouncement} disabled={!announcementText.trim()}>
                    Send Announcement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{announcement.content}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={announcement.type === "maintenance" ? "destructive" : "default"}>
                          {announcement.type}
                        </Badge>
                        <Badge variant={announcement.active ? "default" : "secondary"}>
                          {announcement.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{announcement.created}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant={announcement.active ? "destructive" : "default"} className="flex-1">
                      {announcement.active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Super Admin Tools */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Super Admin Tools</CardTitle>
            <CardDescription>Platform-wide management and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/billing">
                  <DollarSign className="h-6 w-6" />
                  <span>Billing & Revenue</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/roles">
                  <Shield className="h-6 w-6" />
                  <span>Role Management</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/providers">
                  <Zap className="h-6 w-6" />
                  <span>Service Providers</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/platform">
                  <Settings className="h-6 w-6" />
                  <span>Platform Config</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/database">
                  <Database className="h-6 w-6" />
                  <span>Database</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/super-admin/global">
                  <Globe className="h-6 w-6" />
                  <span>Global Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

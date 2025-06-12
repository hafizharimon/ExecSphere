"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Users,
  Crown,
  TrendingUp,
  Award,
  Search,
  Verified,
  Star,
  CreditCard,
  Shield,
  BarChart3,
  UserPlus,
} from "lucide-react"

export default function CompanyDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const companyData = {
    name: "TechCorp Solutions",
    legalName: "TechCorp Solutions Private Limited",
    cin: "U72900KA2020PTC134567",
    industry: "Technology",
    employees: 1247,
    cLevelCount: 8,
    verificationStatus: "MCA Verified",
    premiumStatus: "Premium",
    autoGrade: "A+",
    founded: "2020",
    headquarters: "Bangalore, India",
  }

  const cLevelEmployees = [
    {
      id: 1,
      name: "Rajesh Kumar",
      title: "Chief Executive Officer",
      email: "rajesh@techcorp.com",
      joinDate: "2020-01-15",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 1247,
      networkSize: 892,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      name: "Priya Sharma",
      title: "Chief Technology Officer",
      email: "priya@techcorp.com",
      joinDate: "2020-03-20",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 934,
      networkSize: 567,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      name: "Amit Patel",
      title: "Chief Financial Officer",
      email: "amit@techcorp.com",
      joinDate: "2020-06-10",
      status: "Active",
      verified: true,
      mcaVerified: false,
      profileViews: 678,
      networkSize: 423,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      title: "Chief Marketing Officer",
      email: "sneha@techcorp.com",
      joinDate: "2021-02-15",
      status: "Pending Verification",
      verified: false,
      mcaVerified: false,
      profileViews: 234,
      networkSize: 156,
      avatar: "/placeholder-user.jpg",
    },
  ]

  const companyMetrics = [
    {
      title: "Total Employees",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "C-Level Executives",
      value: "8",
      change: "+2",
      icon: Crown,
      color: "text-purple-600",
    },
    {
      title: "Network Reach",
      value: "15,432",
      change: "+23%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Company Grade",
      value: "A+",
      change: "Excellent",
      icon: Award,
      color: "text-orange-600",
    },
  ]

  const filteredEmployees = cLevelEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterRole === "all" ||
      (filterRole === "verified" && employee.verified) ||
      (filterRole === "pending" && !employee.verified)
    return matchesSearch && matchesFilter
  })

  const handleUpgradeToPremium = () => {
    // Handle premium upgrade
    console.log("Upgrading to premium...")
  }

  const handleAddEmployee = () => {
    // Handle adding new employee
    console.log("Adding new employee...")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        {/* Company Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl lg:text-3xl font-bold">{companyData.name}</h1>
                  {companyData.verificationStatus === "MCA Verified" && (
                    <Badge className="bg-green-500 text-white">
                      <Verified className="h-3 w-3 mr-1" />
                      MCA Verified
                    </Badge>
                  )}
                  {companyData.premiumStatus === "Premium" && (
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{companyData.legalName}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>CIN: {companyData.cin}</span>
                  <span>•</span>
                  <span>{companyData.industry}</span>
                  <span>•</span>
                  <span>Founded {companyData.founded}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleUpgradeToPremium}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button onClick={handleAddEmployee}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {companyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-xs ${metric.color} font-medium`}>{metric.change}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center`}
                  >
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="employees">C-Level Employees</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="verified">Verified Only</SelectItem>
                      <SelectItem value="pending">Pending Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Employee List */}
            <div className="grid gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{employee.name}</h3>
                            {employee.verified && (
                              <Badge variant="secondary">
                                <Verified className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {employee.mcaVerified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                MCA Approved C-Level
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{employee.title}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="text-sm">
                            <p className="font-medium">{employee.profileViews}</p>
                            <p className="text-muted-foreground">Profile Views</p>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{employee.networkSize}</p>
                            <p className="text-muted-foreground">Network Size</p>
                          </div>
                        </div>
                        <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Company Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Network Growth</span>
                      <span className="font-medium">+23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employee Engagement</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Platform Activity</span>
                      <span className="font-medium">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auto Grade Score</span>
                      <span className="font-medium text-green-600">A+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auto Grade Breakdown</CardTitle>
                  <CardDescription>Based on C-level experience and company performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership Experience</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Network Quality</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Platform Engagement</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-17 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Verification Status</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-full h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>Manage your company profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={companyData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={companyData.industry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input id="headquarters" value={companyData.headquarters} />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-yellow-800">Premium Plan</h3>
                      <p className="text-sm text-yellow-700">Enhanced features and verified badges</p>
                    </div>
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Premium Features</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center space-x-3">
                      <Verified className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Verified Company Badge</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Priority Support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Advanced Analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Unlimited Employee Profiles</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Next billing date</p>
                      <p className="text-sm text-muted-foreground">January 15, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹5,000/month</p>
                      <p className="text-sm text-muted-foreground">Auto-renewal</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

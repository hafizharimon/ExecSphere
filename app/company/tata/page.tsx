"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Crown,
  TrendingUp,
  Award,
  Search,
  Verified,
  Star,
  BarChart3,
  UserPlus,
  Globe,
  MapPin,
  Calendar,
  Briefcase,
  ChevronRight,
  Download,
} from "lucide-react"

export default function TataCompanyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const companyData = {
    name: "Tata Group",
    legalName: "Tata Sons Private Limited",
    cin: "U99999MH1917PTC000478",
    industry: "Conglomerate",
    employees: 935000,
    cLevelCount: 24,
    verificationStatus: "MCA Verified",
    premiumStatus: "Premium",
    autoGrade: "A+",
    founded: "1868",
    headquarters: "Mumbai, India",
    website: "https://www.tata.com",
    description:
      "Tata Group is an Indian multinational conglomerate headquartered in Mumbai. Founded in 1868, the group operates in more than 100 countries across six continents, with operations in numerous sectors including steel, automobiles, information technology, and more.",
    revenue: "$128 billion",
    subsidiaries: ["Tata Steel", "Tata Motors", "Tata Consultancy Services", "Tata Power", "Tata Chemicals"],
  }

  const cLevelEmployees = [
    {
      id: 1,
      name: "N. Chandrasekaran",
      title: "Chairman",
      company: "Tata Sons",
      email: "chairman@tata.com",
      joinDate: "2017-02-21",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 24789,
      networkSize: 5672,
      avatar: "/placeholder-user.jpg",
      experience: [
        {
          role: "CEO & Managing Director",
          company: "Tata Consultancy Services",
          duration: "2009-2017",
        },
        {
          role: "COO",
          company: "Tata Consultancy Services",
          duration: "2007-2009",
        },
      ],
    },
    {
      id: 2,
      name: "Noel Tata",
      title: "Chairman",
      company: "Trent & Voltas",
      email: "noel@tata.com",
      joinDate: "2010-06-10",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 18456,
      networkSize: 4321,
      avatar: "/placeholder-user.jpg",
      experience: [
        {
          role: "Managing Director",
          company: "Tata International",
          duration: "2010-2021",
        },
      ],
    },
    {
      id: 3,
      name: "Rajesh Gopinathan",
      title: "CEO & Managing Director",
      company: "Tata Consultancy Services",
      email: "rajesh@tcs.com",
      joinDate: "2017-02-21",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 15678,
      networkSize: 3892,
      avatar: "/placeholder-user.jpg",
      experience: [
        {
          role: "CFO",
          company: "Tata Consultancy Services",
          duration: "2013-2017",
        },
      ],
    },
    {
      id: 4,
      name: "T V Narendran",
      title: "CEO & Managing Director",
      company: "Tata Steel",
      email: "tvn@tatasteel.com",
      joinDate: "2013-09-01",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 12567,
      networkSize: 2987,
      avatar: "/placeholder-user.jpg",
      experience: [
        {
          role: "Vice President",
          company: "Tata Steel",
          duration: "2010-2013",
        },
      ],
    },
    {
      id: 5,
      name: "Guenter Butschek",
      title: "CEO & Managing Director",
      company: "Tata Motors",
      email: "guenter@tatamotors.com",
      joinDate: "2016-02-15",
      status: "Active",
      verified: true,
      mcaVerified: true,
      profileViews: 10234,
      networkSize: 2456,
      avatar: "/placeholder-user.jpg",
      experience: [
        {
          role: "COO",
          company: "Airbus",
          duration: "2012-2016",
        },
      ],
    },
  ]

  const companyMetrics = [
    {
      title: "Total Employees",
      value: "935,000+",
      change: "+5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "C-Level Executives",
      value: "24",
      change: "+3",
      icon: Crown,
      color: "text-purple-600",
    },
    {
      title: "Global Presence",
      value: "100+",
      change: "Countries",
      icon: Globe,
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

  const performanceMetrics = [
    { name: "Leadership Experience", value: 95 },
    { name: "Network Quality", value: 92 },
    { name: "Platform Engagement", value: 88 },
    { name: "Verification Status", value: 100 },
    { name: "Industry Reputation", value: 98 },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "Post",
      title: "Tata Group's Sustainability Initiatives",
      user: "N. Chandrasekaran",
      date: "2 days ago",
      engagement: "High",
    },
    {
      id: 2,
      type: "Event",
      title: "Digital Transformation Summit",
      user: "Rajesh Gopinathan",
      date: "1 week ago",
      engagement: "Medium",
    },
    {
      id: 3,
      type: "Question",
      title: "Future of Electric Vehicles in India",
      user: "Guenter Butschek",
      date: "2 weeks ago",
      engagement: "High",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        {/* Company Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">TATA</span>
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
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{companyData.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Headquarters</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="font-medium">{companyData.headquarters}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="font-medium">{companyData.founded}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <div className="flex items-center mt-1">
                    <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="font-medium">{companyData.industry}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="font-medium">{companyData.revenue}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center`}
                  >
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="executives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="executives">C-Level Executives</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="subsidiaries">Subsidiaries</TabsTrigger>
          </TabsList>

          <TabsContent value="executives" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search executives..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Executive List */}
            <div className="grid gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                                <Verified className="h-3 w-3 mr-1" />
                                MCA Approved C-Level
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {employee.title} at {employee.company}
                          </p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <p className="font-medium">{employee.profileViews.toLocaleString()}</p>
                            <p className="text-muted-foreground">Profile Views</p>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{employee.networkSize.toLocaleString()}</p>
                            <p className="text-muted-foreground">Network Size</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>

                    {/* Experience Section */}
                    {employee.experience && employee.experience.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Previous Experience</p>
                        <div className="space-y-2">
                          {employee.experience.map((exp, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <Briefcase className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span className="font-medium">{exp.role}</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span>{exp.company}</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{exp.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                  <div className="space-y-6">
                    {performanceMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{metric.name}</span>
                          <span className="font-medium">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auto Grade Breakdown</CardTitle>
                  <CardDescription>Based on C-level experience and company performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-green-600">A+</p>
                          <p className="text-xs text-green-600">Excellent</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership Quality</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Industry Reputation</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Financial Performance</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Analytics Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest posts, events, and discussions from Tata executives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{activity.type}</Badge>
                            <span className="text-sm text-muted-foreground">{activity.date}</span>
                          </div>
                          <h3 className="font-medium mt-2">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Posted by {activity.user}</p>
                        </div>
                        <Badge
                          className={
                            activity.engagement === "High"
                              ? "bg-green-500"
                              : activity.engagement === "Medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }
                        >
                          {activity.engagement} Engagement
                        </Badge>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subsidiaries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Major Subsidiaries</CardTitle>
                <CardDescription>Key companies in the Tata Group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Tata Consultancy Services",
                      logo: "TCS",
                      industry: "Information Technology",
                      employees: "592,000+",
                      founded: "1968",
                      verified: true,
                    },
                    {
                      name: "Tata Motors",
                      logo: "TM",
                      industry: "Automotive",
                      employees: "75,000+",
                      founded: "1945",
                      verified: true,
                    },
                    {
                      name: "Tata Steel",
                      logo: "TS",
                      industry: "Steel Manufacturing",
                      employees: "80,000+",
                      founded: "1907",
                      verified: true,
                    },
                    {
                      name: "Tata Power",
                      logo: "TP",
                      industry: "Energy",
                      employees: "21,000+",
                      founded: "1915",
                      verified: true,
                    },
                    {
                      name: "Tata Chemicals",
                      logo: "TC",
                      industry: "Chemicals",
                      employees: "7,000+",
                      founded: "1939",
                      verified: true,
                    },
                    {
                      name: "Tata Consumer Products",
                      logo: "TCP",
                      industry: "Consumer Goods",
                      employees: "8,000+",
                      founded: "1962",
                      verified: true,
                    },
                  ].map((company, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{company.logo}</span>
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{company.name}</h3>
                          {company.verified && (
                            <Badge variant="secondary" className="h-6">
                              <Verified className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">Industry: {company.industry}</p>
                          <p className="text-muted-foreground">Employees: {company.employees}</p>
                          <p className="text-muted-foreground">Founded: {company.founded}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

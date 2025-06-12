"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Building2, Search, Verified, Crown, Users, Globe, Award, ChevronRight, Filter } from "lucide-react"
import Link from "next/link"

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")

  const companies = [
    {
      id: "tata",
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
      logo: "TATA",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "techcorp",
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
      logo: "TC",
      color: "from-purple-600 to-indigo-600",
    },
    {
      id: "demo",
      name: "Demo Corporation",
      legalName: "Demo Corporation Private Limited",
      cin: "U65999MH2019PTC325678",
      industry: "Finance",
      employees: 450,
      cLevelCount: 5,
      verificationStatus: "MCA Verified",
      premiumStatus: "Standard",
      autoGrade: "A",
      founded: "2019",
      headquarters: "Mumbai, India",
      logo: "DC",
      color: "from-green-600 to-emerald-600",
    },
    {
      id: "innovate",
      name: "InnovateNow",
      legalName: "InnovateNow Technologies Private Limited",
      cin: "U72200DL2021PTC123456",
      industry: "Technology",
      employees: 120,
      cLevelCount: 4,
      verificationStatus: "Pending",
      premiumStatus: "Standard",
      autoGrade: "B+",
      founded: "2021",
      headquarters: "Delhi, India",
      logo: "IN",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "healthplus",
      name: "HealthPlus",
      legalName: "HealthPlus India Private Limited",
      cin: "U85100MH2018PTC456789",
      industry: "Healthcare",
      employees: 780,
      cLevelCount: 6,
      verificationStatus: "MCA Verified",
      premiumStatus: "Premium",
      autoGrade: "A",
      founded: "2018",
      headquarters: "Mumbai, India",
      logo: "HP",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "finserve",
      name: "FinServe",
      legalName: "FinServe Financial Services Limited",
      cin: "L65990MH2010PLC123456",
      industry: "Finance",
      employees: 2300,
      cLevelCount: 12,
      verificationStatus: "MCA Verified",
      premiumStatus: "Premium",
      autoGrade: "A+",
      founded: "2010",
      headquarters: "Mumbai, India",
      logo: "FS",
      color: "from-blue-500 to-purple-500",
    },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && company.verificationStatus === "MCA Verified") ||
      (verificationFilter === "pending" && company.verificationStatus === "Pending")
    return matchesSearch && matchesIndustry && matchesVerification
  })

  const industries = [...new Set(companies.map((company) => company.industry))]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="text-muted-foreground">Explore verified companies and their executives</p>
          </div>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            Register Your Company
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>{industryFilter === "all" ? "All Industries" : industryFilter}</span>
                    </div>
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
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <Verified className="h-4 w-4 mr-2" />
                      <span>
                        {verificationFilter === "all"
                          ? "All Status"
                          : verificationFilter === "verified"
                            ? "Verified Only"
                            : "Pending Only"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <div className={`h-32 bg-gradient-to-r ${company.color} flex items-center justify-center`}>
                <span className="text-white text-3xl font-bold">{company.logo}</span>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{company.name}</h3>
                  <div className="flex space-x-1">
                    {company.verificationStatus === "MCA Verified" && (
                      <Badge className="bg-green-500 text-white">
                        <Verified className="h-3 w-3 mr-1" />
                        MCA
                      </Badge>
                    )}
                    {company.premiumStatus === "Premium" && (
                      <Badge className="bg-yellow-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{company.legalName}</p>

                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.employees.toLocaleString()}+ employees</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.cLevelCount} C-level</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{company.headquarters}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Grade: {company.autoGrade}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant="outline">{company.industry}</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/company/${company.id}`}>
                      View Profile
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

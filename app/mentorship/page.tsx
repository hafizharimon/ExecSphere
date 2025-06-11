"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, MessageSquare } from "lucide-react"

const mentors = [
  {
    id: 1,
    name: "Sarah Miller",
    role: "CTO",
    organization: "InnovateTech",
    industry: "Technology",
    experience: 15,
    expertise: ["Digital Transformation", "Team Leadership", "Product Strategy"],
    rating: 4.9,
    sessions: 45,
    isConnected: false,
  },
  {
    id: 2,
    name: "James Davis",
    role: "CFO",
    organization: "Global Finance",
    industry: "Finance",
    experience: 20,
    expertise: ["Financial Strategy", "Risk Management", "M&A"],
    rating: 4.8,
    sessions: 67,
    isConnected: true,
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "CEO",
    organization: "HealthTech Solutions",
    industry: "Healthcare",
    experience: 18,
    expertise: ["Healthcare Innovation", "Scaling Startups", "Regulatory Affairs"],
    rating: 4.9,
    sessions: 32,
    isConnected: false,
  },
]

const mentorshipRequests = [
  {
    id: 1,
    requester: "Alice Lee",
    role: "COO",
    organization: "StartupX",
    message: "I'm looking for guidance on scaling operations for a fast-growing tech startup.",
    status: "pending",
    date: "2024-06-15",
  },
  {
    id: 2,
    requester: "David Chen",
    role: "CTO",
    organization: "FinanceApp",
    message: "Would love to learn about your experience with digital transformation in traditional industries.",
    status: "pending",
    date: "2024-06-14",
  },
]

const activeMentorships = [
  {
    id: 1,
    name: "Michael Rodriguez",
    role: "CEO",
    organization: "TechStart",
    lastSession: "2024-06-10",
    nextSession: "2024-06-20",
    type: "mentee",
  },
  {
    id: 2,
    name: "Lisa Wang",
    role: "CMO",
    organization: "GrowthCorp",
    lastSession: "2024-06-12",
    nextSession: "2024-06-22",
    type: "mentor",
  },
]

export default function MentorshipPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterIndustry, setFilterIndustry] = useState("all")
  const [filterExpertise, setFilterExpertise] = useState("all")

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = filterIndustry === "all" || mentor.industry.toLowerCase() === filterIndustry.toLowerCase()
    const matchesExpertise =
      filterExpertise === "all" ||
      mentor.expertise.some((exp) => exp.toLowerCase().includes(filterExpertise.toLowerCase()))

    return matchesSearch && matchesIndustry && matchesExpertise
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mentorship Network</h1>
            <p className="text-muted-foreground">Connect with experienced executives for guidance and growth</p>
          </div>
          <Button>Become a Mentor</Button>
        </div>

        <Tabs defaultValue="find-mentors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="find-mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="my-mentorships">My Mentorships</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="find-mentors" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search mentors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterExpertise} onValueChange={setFilterExpertise}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expertise</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                      <SelectItem value="transformation">Transformation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Mentors Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <CardDescription>
                          {mentor.role} at {mentor.organization}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Experience</span>
                      <span>{mentor.experience} years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span>
                        ⭐ {mentor.rating} ({mentor.sessions} sessions)
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Expertise</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {mentor.isConnected ? (
                        <Button variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      ) : (
                        <Button className="flex-1">Request Mentorship</Button>
                      )}
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-mentorships" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {activeMentorships.map((mentorship) => (
                <Card key={mentorship.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {mentorship.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{mentorship.name}</CardTitle>
                        <CardDescription>
                          {mentorship.role} at {mentorship.organization}
                        </CardDescription>
                        <Badge variant={mentorship.type === "mentor" ? "default" : "secondary"}>
                          {mentorship.type === "mentor" ? "Your Mentor" : "Your Mentee"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Session</span>
                      <span>{new Date(mentorship.lastSession).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Session</span>
                      <span>{new Date(mentorship.nextSession).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="space-y-4">
              {mentorshipRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.requester}</CardTitle>
                        <CardDescription>
                          {request.role} at {request.organization}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{request.message}</p>
                    <div className="flex gap-2">
                      <Button size="sm">Accept</Button>
                      <Button variant="outline" size="sm">
                        Decline
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled mentorship sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Session with Michael Rodriguez</p>
                      <p className="text-sm text-muted-foreground">June 20, 2024 at 2:00 PM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button size="sm">Join Call</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Session with Lisa Wang</p>
                      <p className="text-sm text-muted-foreground">June 22, 2024 at 10:00 AM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button size="sm">Join Call</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

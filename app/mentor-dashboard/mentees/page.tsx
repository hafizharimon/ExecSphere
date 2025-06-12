"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Star,
  Clock,
  Target,
  Award,
  Mail,
  Phone,
  Video,
} from "lucide-react"

export default function MenteesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [feedbackText, setFeedbackText] = useState("")
  const [selectedMentee, setSelectedMentee] = useState<string | null>(null)

  const mentees = [
    {
      id: "1",
      name: "Alex Thompson",
      role: "VP Operations",
      company: "StartupCo",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "alex@startupco.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2024-01-01",
      status: "active",
      progress: 85,
      totalSessions: 12,
      completedSessions: 10,
      upcomingSession: "2024-01-20 15:00",
      totalPaid: 12000,
      currentGoals: ["Improve team leadership", "Scale operations", "Build processes"],
      achievements: ["Promoted to VP level", "Increased team productivity by 30%", "Implemented new processes"],
      rating: 4.9,
      lastSession: "2024-01-15",
      notes: "Making excellent progress on leadership skills. Very engaged and implements feedback well.",
      industry: "Technology",
      experience: "8 years",
      sessionHistory: [
        { date: "2024-01-15", topic: "Leadership Communication", duration: 60, rating: 5 },
        { date: "2024-01-08", topic: "Team Management", duration: 60, rating: 5 },
        { date: "2024-01-01", topic: "Strategic Planning", duration: 90, rating: 4 },
      ],
    },
    {
      id: "2",
      name: "Maria Garcia",
      role: "Director of Product",
      company: "TechFirm",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "maria@techfirm.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2023-12-15",
      status: "active",
      progress: 72,
      totalSessions: 8,
      completedSessions: 6,
      upcomingSession: "2024-01-22 10:30",
      totalPaid: 9600,
      currentGoals: ["Executive presence", "Strategic thinking", "Career transition"],
      achievements: [
        "Led successful product launch",
        "Improved stakeholder communication",
        "Developed strategic roadmap",
      ],
      rating: 4.8,
      lastSession: "2024-01-12",
      notes: "Strong analytical skills. Working on developing executive presence and communication.",
      industry: "SaaS",
      experience: "6 years",
      sessionHistory: [
        { date: "2024-01-12", topic: "Executive Presence", duration: 60, rating: 5 },
        { date: "2024-01-05", topic: "Strategic Communication", duration: 60, rating: 4 },
        { date: "2023-12-29", topic: "Product Strategy", duration: 90, rating: 5 },
      ],
    },
    {
      id: "3",
      name: "John Smith",
      role: "Senior Manager",
      company: "InnovateCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "john@innovatecorp.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2023-11-20",
      status: "paused",
      progress: 45,
      totalSessions: 6,
      completedSessions: 4,
      upcomingSession: null,
      totalPaid: 4800,
      currentGoals: ["Technical leadership", "People management", "Strategic planning"],
      achievements: ["Transitioned to management role", "Built technical team", "Improved code quality"],
      rating: 4.6,
      lastSession: "2023-12-20",
      notes: "Taking a break due to work commitments. Plans to resume in February.",
      industry: "Consulting",
      experience: "5 years",
      sessionHistory: [
        { date: "2023-12-20", topic: "Team Building", duration: 60, rating: 4 },
        { date: "2023-12-13", topic: "Technical Leadership", duration: 60, rating: 5 },
        { date: "2023-12-06", topic: "Management Transition", duration: 90, rating: 4 },
      ],
    },
    {
      id: "4",
      name: "Sarah Wilson",
      role: "COO",
      company: "GrowthCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "sarah@growthcorp.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-10-10",
      status: "active",
      progress: 92,
      totalSessions: 15,
      completedSessions: 14,
      upcomingSession: "2024-01-25 14:00",
      totalPaid: 18000,
      currentGoals: ["Board readiness", "IPO preparation", "Global expansion"],
      achievements: ["Prepared company for Series C", "Expanded to 3 new markets", "Built scalable operations"],
      rating: 4.9,
      lastSession: "2024-01-18",
      notes: "Exceptional mentee. Ready for board-level discussions. Considering IPO readiness program.",
      industry: "FinTech",
      experience: "12 years",
      sessionHistory: [
        { date: "2024-01-18", topic: "Board Preparation", duration: 90, rating: 5 },
        { date: "2024-01-11", topic: "IPO Readiness", duration: 60, rating: 5 },
        { date: "2024-01-04", topic: "Global Strategy", duration: 90, rating: 5 },
      ],
    },
    {
      id: "5",
      name: "David Chen",
      role: "VP Engineering",
      company: "ScaleTech",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "david@scaletech.com",
      phone: "+1 (555) 567-8901",
      joinDate: "2024-01-05",
      status: "active",
      progress: 25,
      totalSessions: 3,
      completedSessions: 2,
      upcomingSession: "2024-01-24 16:00",
      totalPaid: 3600,
      currentGoals: ["Engineering leadership", "Technical strategy", "Team scaling"],
      achievements: ["Hired 10 engineers", "Improved system reliability", "Launched new architecture"],
      rating: 4.7,
      lastSession: "2024-01-17",
      notes: "New mentee with strong technical background. Eager to learn leadership skills.",
      industry: "Technology",
      experience: "7 years",
      sessionHistory: [
        { date: "2024-01-17", topic: "Engineering Leadership", duration: 60, rating: 5 },
        { date: "2024-01-10", topic: "Technical Strategy", duration: 60, rating: 4 },
      ],
    },
  ]

  const filteredMentees = mentees.filter((mentee) => {
    const matchesSearch =
      mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === "all" || mentee.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const sortedMentees = [...filteredMentees].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "progress":
        return b.progress - a.progress
      case "recent":
        return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime()
      case "earnings":
        return b.totalPaid - a.totalPaid
      default:
        return 0
    }
  })

  const totalEarnings = mentees.reduce((sum, mentee) => sum + mentee.totalPaid, 0)
  const activeMentees = mentees.filter((m) => m.status === "active").length
  const avgRating = mentees.reduce((sum, mentee) => sum + mentee.rating, 0) / mentees.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Mentees</p>
                <p className="text-2xl font-bold">{mentees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeMentees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent Activity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="earnings">Earnings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mentees List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedMentees.map((mentee) => (
          <Card key={mentee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentee.avatar || "/placeholder.svg"} alt={mentee.name} />
                    <AvatarFallback>
                      {mentee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{mentee.name}</CardTitle>
                    <CardDescription>
                      {mentee.role} at {mentee.company}
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={mentee.status === "active" ? "default" : "secondary"}>{mentee.status}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{mentee.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentee.avatar || "/placeholder.svg"} alt={mentee.name} />
                          <AvatarFallback>
                            {mentee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{mentee.name}</div>
                          <DialogDescription>
                            {mentee.role} at {mentee.company}
                          </DialogDescription>
                        </div>
                      </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="goals">Goals</TabsTrigger>
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Contact Information</Label>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{mentee.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{mentee.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Professional Details</Label>
                            <div className="space-y-1 text-sm">
                              <div>Industry: {mentee.industry}</div>
                              <div>Experience: {mentee.experience}</div>
                              <div>Join Date: {new Date(mentee.joinDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Progress Overview</Label>
                          <Progress value={mentee.progress} className="w-full" />
                          <div className="text-sm text-muted-foreground">
                            {mentee.progress}% complete • {mentee.completedSessions}/{mentee.totalSessions} sessions
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Mentor Notes</Label>
                          <div className="p-3 bg-muted rounded-md text-sm">{mentee.notes}</div>
                        </div>
                      </TabsContent>

                      <TabsContent value="sessions" className="space-y-4">
                        <div className="space-y-3">
                          {mentee.sessionHistory.map((session, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Video className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="font-medium">{session.topic}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(session.date).toLocaleDateString()} • {session.duration} min
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{session.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {mentee.upcomingSession && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Next Session</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(mentee.upcomingSession).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="goals" className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <Label>Current Goals</Label>
                            <div className="space-y-2 mt-2">
                              {mentee.currentGoals.map((goal, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Target className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm">{goal}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>Achievements</Label>
                            <div className="space-y-2 mt-2">
                              {mentee.achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Award className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="feedback" className="space-y-4">
                        <div className="space-y-3">
                          <Label>Add Session Feedback</Label>
                          <Textarea
                            placeholder="Enter feedback for the latest session..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={4}
                          />
                          <Button>Save Feedback</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{mentee.progress}%</span>
                </div>
                <Progress value={mentee.progress} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Sessions</div>
                  <div className="font-medium">
                    {mentee.completedSessions}/{mentee.totalSessions}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Earnings</div>
                  <div className="font-medium">${mentee.totalPaid.toLocaleString()}</div>
                </div>
              </div>

              {mentee.upcomingSession && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span>Next: {new Date(mentee.upcomingSession).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedMentees.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">No mentees found matching your criteria.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Search,
  Calendar,
  MessageSquare,
  Video,
  Star,
  Target,
  Award,
  BookOpen,
  DollarSign,
  Filter,
} from "lucide-react"

export default function MenteesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [feedbackText, setFeedbackText] = useState("")

  const mentees = [
    {
      id: "1",
      name: "Alex Thompson",
      role: "VP Operations",
      company: "StartupCo",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "alex@startupco.com",
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
    },
    {
      id: "2",
      name: "Maria Garcia",
      role: "Director of Product",
      company: "TechFirm",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "maria@techfirm.com",
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
    },
    {
      id: "3",
      name: "John Smith",
      role: "Senior Manager",
      company: "InnovateCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "john@innovatecorp.com",
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
    },
    {
      id: "4",
      name: "Sarah Wilson",
      role: "COO",
      company: "GrowthCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "sarah@growthcorp.com",
      joinDate: "2023-10-15",
      status: "completed",
      progress: 100,
      totalSessions: 15,
      completedSessions: 15,
      upcomingSession: null,
      totalPaid: 18000,
      currentGoals: ["Operations scaling", "Team leadership", "Process optimization"],
      achievements: [
        "Scaled operations by 200%",
        "Reduced operational costs by 25%",
        "Implemented new management structure",
      ],
      rating: 5.0,
      lastSession: "2024-01-10",
      notes: "Completed full mentorship program with excellent results. Available for ad-hoc sessions.",
      industry: "E-commerce",
      experience: "12 years",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "paused":
        return "Paused"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const filteredMentees = mentees.filter((mentee) => {
    const matchesSearch =
      mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || mentee.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const sortedMentees = [...filteredMentees].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime()
      case "progress":
        return b.progress - a.progress
      case "sessions":
        return b.totalSessions - a.totalSessions
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Mentees</h1>
          <p className="text-muted-foreground">Manage and track your mentee relationships</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            {mentees.length} Mentees
          </Badge>
          <Badge variant="outline">
            <Star className="h-3 w-3 mr-1" />
            4.8 Avg Rating
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentees.filter((m) => m.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently mentoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mentees.reduce((total, mentee) => total + mentee.totalSessions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (mentees.reduce((total, mentee) => total + mentee.completedSessions, 0) /
                  mentees.reduce((total, mentee) => total + mentee.totalSessions, 0)) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Sessions completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{mentees.reduce((total, mentee) => total + mentee.totalPaid, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From mentees</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentees by name, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Mentees</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {sortedMentees.map((mentee) => (
            <Card key={mentee.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
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
                        <Badge className={getStatusColor(mentee.status)}>{getStatusLabel(mentee.status)}</Badge>
                        <Badge variant="outline">{mentee.industry}</Badge>
                        <Badge variant="secondary">{mentee.experience}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{mentee.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Since {new Date(mentee.joinDate).toLocaleDateString()}
                    </p>
                    {mentee.upcomingSession && (
                      <p className="text-sm font-medium mt-1">
                        Next: {new Date(mentee.upcomingSession).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {mentee.completedSessions} of {mentee.totalSessions} sessions completed
                    </span>
                    <span>₹{mentee.totalPaid.toLocaleString()} total</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Current Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentee.currentGoals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentee.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{mentee.notes}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    {mentee.upcomingSession && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join Session
                      </Button>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Add Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Session Notes</DialogTitle>
                        <DialogDescription>Record notes and feedback for {mentee.name}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="feedback">Session Notes</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Enter your notes about the session, progress, and next steps..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={5}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Notes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {sortedMentees
            .filter((mentee) => mentee.status === "active")
            .map((mentee) => (
              <Card key={mentee.id}>
                {/* Same content as above, filtered for active mentees */}
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
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
                          <Badge className={getStatusColor(mentee.status)}>{getStatusLabel(mentee.status)}</Badge>
                          <Badge variant="outline">{mentee.industry}</Badge>
                          <Badge variant="secondary">{mentee.experience}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 justify-end">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{mentee.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Since {new Date(mentee.joinDate).toLocaleDateString()}
                      </p>
                      {mentee.upcomingSession && (
                        <p className="text-sm font-medium mt-1">
                          Next: {new Date(mentee.upcomingSession).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{mentee.progress}%</span>
                    </div>
                    <Progress value={mentee.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {mentee.completedSessions} of {mentee.totalSessions} sessions completed
                      </span>
                      <span>₹{mentee.totalPaid.toLocaleString()} total</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Current Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentee.currentGoals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentee.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground">{mentee.notes}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      {mentee.upcomingSession && (
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join Session
                        </Button>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Add Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="paused" className="space-y-6">
          {sortedMentees
            .filter((mentee) => mentee.status === "paused")
            .map((mentee) => (
              <Card key={mentee.id}>
                {/* Same content as above, filtered for paused mentees */}
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
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
                          <Badge className={getStatusColor(mentee.status)}>{getStatusLabel(mentee.status)}</Badge>
                          <Badge variant="outline">{mentee.industry}</Badge>
                          <Badge variant="secondary">{mentee.experience}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 justify-end">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{mentee.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Since {new Date(mentee.joinDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Last session: {new Date(mentee.lastSession).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{mentee.progress}%</span>
                    </div>
                    <Progress value={mentee.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {mentee.completedSessions} of {mentee.totalSessions} sessions completed
                      </span>
                      <span>₹{mentee.totalPaid.toLocaleString()} total</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Current Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentee.currentGoals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentee.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground">{mentee.notes}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Add Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {sortedMentees
            .filter((mentee) => mentee.status === "completed")
            .map((mentee) => (
              <Card key={mentee.id}>
                {/* Same content as above, filtered for completed mentees */}
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
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
                          <Badge className={getStatusColor(mentee.status)}>{getStatusLabel(mentee.status)}</Badge>
                          <Badge variant="outline">{mentee.industry}</Badge>
                          <Badge variant="secondary">{mentee.experience}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 justify-end">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{mentee.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Since {new Date(mentee.joinDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completed: {new Date(mentee.lastSession).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{mentee.progress}%</span>
                    </div>
                    <Progress value={mentee.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {mentee.completedSessions} of {mentee.totalSessions} sessions completed
                      </span>
                      <span>₹{mentee.totalPaid.toLocaleString()} total</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Achieved Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentee.currentGoals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentee.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Final Notes</h4>
                    <p className="text-sm text-muted-foreground">{mentee.notes}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Follow-up
                      </Button>
                    </div>
                    <Button size="sm" variant="outline">
                      <Award className="h-4 w-4 mr-1" />
                      View Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

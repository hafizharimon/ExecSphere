"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function SessionSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [newSessionTitle, setNewSessionTitle] = useState("")
  const [newSessionDescription, setNewSessionDescription] = useState("")
  const [newSessionDuration, setNewSessionDuration] = useState("60")
  const [newSessionType, setNewSessionType] = useState("mentorship")

  const upcomingSessions = [
    {
      id: "1",
      title: "Strategic Leadership Discussion",
      mentee: {
        name: "Alex Thompson",
        role: "VP Operations",
        company: "StartupCo",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2024-01-15",
      time: "14:00",
      duration: 60,
      type: "mentorship",
      status: "confirmed",
      fee: 1000,
      meetingLink: "https://meet.example.com/abc123",
    },
    {
      id: "2",
      title: "Career Development Planning",
      mentee: {
        name: "Maria Garcia",
        role: "Director",
        company: "TechFirm",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2024-01-16",
      time: "10:30",
      duration: 45,
      type: "career-coaching",
      status: "pending",
      fee: 800,
      meetingLink: null,
    },
    {
      id: "3",
      title: "Technical Architecture Review",
      mentee: {
        name: "John Smith",
        role: "CTO",
        company: "InnovateCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2024-01-17",
      time: "16:00",
      duration: 90,
      type: "technical-review",
      status: "confirmed",
      fee: 1500,
      meetingLink: "https://meet.example.com/xyz789",
    },
  ]

  const pastSessions = [
    {
      id: "4",
      title: "Operations Scaling Strategy",
      mentee: {
        name: "Sarah Wilson",
        role: "COO",
        company: "GrowthCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2024-01-10",
      time: "15:00",
      duration: 60,
      type: "strategy",
      status: "completed",
      fee: 1000,
      rating: 5,
      feedback: "Excellent insights on scaling operations. Very practical advice.",
    },
    {
      id: "5",
      title: "Financial Planning Session",
      mentee: {
        name: "David Park",
        role: "CFO",
        company: "FinanceCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2024-01-08",
      time: "11:00",
      duration: 45,
      type: "finance",
      status: "completed",
      fee: 800,
      rating: 4,
      feedback: "Great session on financial modeling and forecasting.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mentorship":
        return "Mentorship"
      case "career-coaching":
        return "Career Coaching"
      case "technical-review":
        return "Technical Review"
      case "strategy":
        return "Strategy"
      case "finance":
        return "Finance"
      default:
        return type
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Session Schedule</h1>
          <p className="text-muted-foreground">Manage your mentoring sessions and calendar</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>Create a new mentoring session with your mentee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Session title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={newSessionType} onValueChange={setNewSessionType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mentorship">Mentorship</SelectItem>
                    <SelectItem value="career-coaching">Career Coaching</SelectItem>
                    <SelectItem value="technical-review">Technical Review</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Select value={newSessionDuration} onValueChange={setNewSessionDuration}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newSessionDescription}
                  onChange={(e) => setNewSessionDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Session description and agenda"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Schedule Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Sessions scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,500</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {session.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(session.type)}</Badge>
                      <Badge variant="secondary">₹{session.fee}</Badge>
                    </div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>
                      {new Date(session.date).toLocaleDateString()} at {session.time} • {session.duration} minutes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.mentee.avatar || "/placeholder.svg"} alt={session.mentee.name} />
                      <AvatarFallback>
                        {session.mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{session.mentee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.mentee.role} at {session.mentee.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    {session.status === "confirmed" && session.meetingLink && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join Meeting
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(session.status)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(session.type)}</Badge>
                      <Badge variant="secondary">₹{session.fee}</Badge>
                      {session.rating && <Badge variant="outline">⭐ {session.rating}/5</Badge>}
                    </div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>
                      {new Date(session.date).toLocaleDateString()} at {session.time} • {session.duration} minutes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.mentee.avatar || "/placeholder.svg"} alt={session.mentee.name} />
                      <AvatarFallback>
                        {session.mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{session.mentee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.mentee.role} at {session.mentee.company}
                      </p>
                      {session.feedback && (
                        <p className="text-sm text-muted-foreground mt-2 italic">"{session.feedback}"</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>Connect your calendar to automatically sync sessions and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Connect Google Calendar</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Connect Outlook Calendar</span>
                </Button>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pro Tip:</strong> Connect your calendar to automatically block time for sessions and receive
                  reminders for upcoming meetings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

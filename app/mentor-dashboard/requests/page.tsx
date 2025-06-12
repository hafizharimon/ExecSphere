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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  AlertCircle,
  Filter,
} from "lucide-react"

export default function MentorRequestsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [responseMessage, setResponseMessage] = useState("")

  const mentorshipRequests = [
    {
      id: "1",
      mentee: {
        name: "Alex Thompson",
        role: "VP Operations",
        company: "StartupCo",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "alex@startupco.com",
        phone: "+91 98765 43210",
        experience: "8 years",
        industry: "Technology",
      },
      requestDate: "2024-01-15",
      status: "pending",
      priority: "high",
      sessionType: "Strategic Leadership",
      proposedFee: 1500,
      duration: "60 minutes",
      preferredTime: "Weekday evenings",
      message:
        "I'm looking for guidance on scaling operations and building high-performing teams. I've been leading a team of 25+ people and need strategic advice on organizational structure and leadership development.",
      goals: ["Improve team leadership skills", "Develop scaling strategies", "Build organizational structure"],
      urgency: "Within 2 weeks",
    },
    {
      id: "2",
      mentee: {
        name: "Maria Garcia",
        role: "Director of Product",
        company: "TechFirm",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "maria@techfirm.com",
        phone: "+91 87654 32109",
        experience: "6 years",
        industry: "SaaS",
      },
      requestDate: "2024-01-14",
      status: "pending",
      priority: "medium",
      sessionType: "Career Development",
      proposedFee: 1200,
      duration: "45 minutes",
      preferredTime: "Weekend mornings",
      message:
        "I'm at a crossroads in my career and considering a transition to a C-level role. I need guidance on executive presence, strategic thinking, and navigating corporate politics.",
      goals: ["Develop executive presence", "Strategic thinking skills", "Career transition planning"],
      urgency: "Flexible timing",
    },
    {
      id: "3",
      mentee: {
        name: "John Smith",
        role: "Senior Manager",
        company: "InnovateCorp",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "john@innovatecorp.com",
        phone: "+91 76543 21098",
        experience: "5 years",
        industry: "Consulting",
      },
      requestDate: "2024-01-12",
      status: "pending",
      priority: "low",
      sessionType: "Technical Leadership",
      proposedFee: 1000,
      duration: "90 minutes",
      preferredTime: "Weekday afternoons",
      message:
        "I'm transitioning from a technical role to a leadership position. I need help understanding how to balance technical excellence with people management and strategic thinking.",
      goals: ["Technical to leadership transition", "People management skills", "Strategic planning"],
      urgency: "Next month",
    },
  ]

  const acceptedRequests = [
    {
      id: "4",
      mentee: {
        name: "Sarah Wilson",
        role: "COO",
        company: "GrowthCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      acceptedDate: "2024-01-10",
      status: "accepted",
      sessionType: "Operations Strategy",
      fee: 1500,
      nextSession: "2024-01-18 15:00",
    },
  ]

  const rejectedRequests = [
    {
      id: "5",
      mentee: {
        name: "David Park",
        role: "Manager",
        company: "StartupXYZ",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rejectedDate: "2024-01-08",
      status: "rejected",
      reason: "Schedule conflict",
      sessionType: "General Mentoring",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredRequests = mentorshipRequests.filter((request) => {
    if (selectedFilter === "all") return true
    return request.priority === selectedFilter
  })

  const handleAcceptRequest = (requestId: string) => {
    console.log("Accepting request:", requestId)
    // Handle accept logic
  }

  const handleRejectRequest = (requestId: string, reason: string) => {
    console.log("Rejecting request:", requestId, "Reason:", reason)
    // Handle reject logic
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Mentorship Requests</h1>
          <p className="text-muted-foreground">Manage incoming mentorship requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorshipRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">New requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({mentorshipRequests.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.mentee.avatar || "/placeholder.svg"} alt={request.mentee.name} />
                      <AvatarFallback>
                        {request.mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{request.mentee.name}</CardTitle>
                      <CardDescription>
                        {request.mentee.role} at {request.mentee.company}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                        </Badge>
                        <Badge variant="outline">{request.sessionType}</Badge>
                        <Badge variant="secondary">₹{request.proposedFee}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    {getStatusIcon(request.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {request.mentee.experience} experience in {request.mentee.industry}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {request.duration} • {request.preferredTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Urgency: {request.urgency}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{request.mentee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{request.mentee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{request.mentee.company}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Request Message:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{request.message}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <User className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Decline Request</DialogTitle>
                          <DialogDescription>
                            Please provide a reason for declining this mentorship request.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reason">Reason for declining</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="schedule">Schedule conflict</SelectItem>
                                <SelectItem value="expertise">Outside my expertise</SelectItem>
                                <SelectItem value="capacity">At full capacity</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Additional message (optional)</Label>
                            <Textarea
                              id="message"
                              placeholder="Provide additional context or suggestions..."
                              value={responseMessage}
                              onChange={(e) => setResponseMessage(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleRejectRequest(request.id, responseMessage)} variant="outline">
                            Decline Request
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.mentee.avatar || "/placeholder.svg"} alt={request.mentee.name} />
                      <AvatarFallback>
                        {request.mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{request.mentee.name}</CardTitle>
                      <CardDescription>
                        {request.mentee.role} at {request.mentee.company}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                        <Badge variant="outline">{request.sessionType}</Badge>
                        <Badge variant="secondary">₹{request.fee}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Accepted: {new Date(request.acceptedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium">Next: {new Date(request.nextSession).toLocaleString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.mentee.avatar || "/placeholder.svg"} alt={request.mentee.name} />
                      <AvatarFallback>
                        {request.mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{request.mentee.name}</CardTitle>
                      <CardDescription>
                        {request.mentee.role} at {request.mentee.company}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                        <Badge variant="outline">{request.sessionType}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Rejected: {new Date(request.rejectedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Reason: {request.reason}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

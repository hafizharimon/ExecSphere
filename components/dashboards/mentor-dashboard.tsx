"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Video,
  MessageSquare,
  TrendingUp,
  Star,
  DollarSign,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
  organization: string
}

interface MentorDashboardProps {
  user: User
}

export function MentorDashboard({ user }: MentorDashboardProps) {
  const [mentorshipFee, setMentorshipFee] = useState("5000")
  const [feeExceedsLimit, setFeeExceedsLimit] = useState(false)
  const [permissionRequest, setPermissionRequest] = useState("")

  // Super Admin defined maximum fees by position
  const maxFeesByPosition = {
    CEO: 10000,
    CTO: 8000,
    CFO: 8000,
    COO: 7000,
    CMO: 6000,
    CHRO: 6000,
    CPO: 6000,
    Other: 5000,
  }

  const currentMaxFee = maxFeesByPosition[user.role as keyof typeof maxFeesByPosition] || 5000

  const activeMentees = [
    {
      id: "1",
      name: "Alex Thompson",
      title: "VP Operations at StartupCo",
      progress: 75,
      nextSession: "Tomorrow, 3:00 PM",
      totalSessions: 8,
      paidAmount: 4000,
    },
    {
      id: "2",
      name: "Maria Garcia",
      title: "Director at TechFirm",
      progress: 45,
      nextSession: "Friday, 2:00 PM",
      totalSessions: 4,
      paidAmount: 2000,
    },
  ]

  const pendingRequests = [
    {
      id: "1",
      name: "John Smith",
      title: "COO at GrowthCorp",
      message: "Looking for guidance on scaling operations...",
      requestDate: "2 days ago",
      proposedFee: 5000,
    },
    {
      id: "2",
      name: "Sarah Wilson",
      title: "CTO at InnovateNow",
      message: "Need advice on technical leadership...",
      requestDate: "1 day ago",
      proposedFee: 6000,
    },
  ]

  const upcomingSessions = [
    {
      id: "1",
      mentee: "Alex Thompson",
      time: "Tomorrow, 3:00 PM",
      duration: "60 min",
      type: "Strategy Review",
      fee: 1000,
    },
    {
      id: "2",
      mentee: "Maria Garcia",
      time: "Friday, 2:00 PM",
      duration: "45 min",
      type: "Career Planning",
      fee: 800,
    },
  ]

  const handleFeeChange = (value: string) => {
    setMentorshipFee(value)
    setFeeExceedsLimit(Number.parseInt(value) > currentMaxFee)
  }

  const handleSubmitFeeRequest = () => {
    // Submit permission request to Super Admin
    console.log("Submitting fee permission request:", {
      requestedFee: mentorshipFee,
      reason: permissionRequest,
      currentMaxFee,
    })

    // Reset form
    setPermissionRequest("")
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-blue-500">
            <Award className="h-3 w-3 mr-1" />
            Verified Mentor
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.9 Rating
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">18 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Management Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Mentorship Fee Management
          </CardTitle>
          <CardDescription>Set your mentorship fees and manage pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentFee">Current Fee (per session)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-sm text-muted-foreground">₹</span>
                <Input
                  id="currentFee"
                  type="number"
                  value={mentorshipFee}
                  onChange={(e) => handleFeeChange(e.target.value)}
                  className="pl-8"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Maximum Allowed</Label>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">₹{currentMaxFee.toLocaleString()}</span>
                <Badge variant="outline">For {user.role}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div>
                {feeExceedsLimit ? (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Exceeds Limit
                  </Badge>
                ) : (
                  <Badge variant="default">Within Limit</Badge>
                )}
              </div>
            </div>
          </div>

          {feeExceedsLimit && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 font-medium">Fee Exceeds Maximum Limit</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your requested fee of ₹{mentorshipFee} exceeds the maximum allowed fee of ₹{currentMaxFee} for{" "}
                    {user.role} position. You can apply for permission to set a higher fee.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="mt-2">
                        Apply for Permission
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Higher Fee Permission</DialogTitle>
                        <DialogDescription>
                          Submit a request to the Super Admin to set a fee higher than ₹{currentMaxFee}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Requested Fee</Label>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-medium">₹{mentorshipFee}</span>
                            <Badge variant="outline">
                              +₹{Number.parseInt(mentorshipFee) - currentMaxFee} above limit
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Justification</Label>
                          <Textarea
                            id="reason"
                            placeholder="Please explain why you need to set a higher fee..."
                            value={permissionRequest}
                            onChange={(e) => setPermissionRequest(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSubmitFeeRequest} disabled={!permissionRequest.trim()}>
                          Submit Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Mentees */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Mentees
            </CardTitle>
            <CardDescription>Track mentee progress and earnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeMentees.map((mentee) => (
              <div key={mentee.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {mentee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mentee.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{mentee.title}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Next: {mentee.nextSession}</span>
                  <Badge variant="outline">₹{mentee.paidAmount}</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="secondary">{mentee.totalSessions} sessions</Badge>
                  <span className="text-green-600 font-medium">Paid</span>
                </div>
                <Button size="sm" className="w-full">
                  <Video className="h-3 w-3 mr-1" />
                  Schedule Session
                </Button>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/mentor-dashboard/mentees">View All Mentees</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Requests
            </CardTitle>
            <CardDescription>New mentorship requests with proposed fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {request.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{request.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{request.title}</p>
                  </div>
                  <Badge variant="outline">₹{request.proposedFee}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{request.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{request.requestDate}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/mentor-dashboard/requests">View All Requests</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{session.mentee}</p>
                    <p className="text-xs text-muted-foreground">{session.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{session.duration}</Badge>
                    <p className="text-xs text-green-600 font-medium mt-1">₹{session.fee}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{session.time}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Video className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/sessions">View All Sessions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Mentor Tools</CardTitle>
            <CardDescription>Access your mentoring resources and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/qa-vault">
                  <BookOpen className="h-6 w-6" />
                  <span>Q&A Vault</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/sessions/schedule">
                  <Calendar className="h-6 w-6" />
                  <span>Schedule Session</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/mentor-dashboard/analytics">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/mentor-dashboard/earnings">
                  <DollarSign className="h-6 w-6" />
                  <span>Earnings Report</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
                <Link href="/mentor-dashboard/resources">
                  <Award className="h-6 w-6" />
                  <span>Resources</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Clock, DollarSign, AlertCircle } from "lucide-react"
import Link from "next/link"
import { mentorService, type MentorshipRequest, type MentorProfile } from "@/services/mentor-service"

export default function MentorshipRequestPage() {
  const params = useParams()
  const router = useRouter()
  const mentorId = params.mentorId as string
  const [mentor, setMentor] = useState<MentorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [requestData, setRequestData] = useState<Partial<MentorshipRequest>>({
    requestType: "consultation",
    serviceTags: [],
    projectDescription: "",
    expectedDuration: "1-3 months",
    budgetRange: "50000-100000",
    urgencyLevel: "medium",
    preferredCommunication: "video_call",
  })

  useEffect(() => {
    if (mentorId) {
      loadMentorProfile()
    }
  }, [mentorId])

  const loadMentorProfile = async () => {
    try {
      const result = await mentorService.getMentorProfile(mentorId)
      if (result.success) {
        setMentor(result.data || null)
      }
    } catch (error) {
      console.error("Error loading mentor profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof MentorshipRequest, value: any) => {
    setRequestData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTagToggle = (tagId: string) => {
    const currentTags = requestData.serviceTags || []
    const newTags = currentTags.includes(tagId) ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId]

    handleInputChange("serviceTags", newTags)
  }

  const handleSubmit = async () => {
    if (!mentor || !requestData.projectDescription || !requestData.serviceTags?.length) {
      return
    }

    setSubmitting(true)
    try {
      const request: MentorshipRequest = {
        ...requestData,
        mentorId,
        companyId: "current-company-id", // This would come from auth context
        requestedBy: "current-user-id", // This would come from auth context
      } as MentorshipRequest

      const result = await mentorService.createMentorshipRequest(request)

      if (result.success) {
        router.push(`/mentor-board/requests/${result.data.id}?status=submitted`)
      } else {
        console.error("Failed to create mentorship request:", result.error)
      }
    } catch (error) {
      console.error("Error creating mentorship request:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const calculateEstimatedCost = () => {
    if (!mentor?.hourlyRate || !requestData.expectedDuration) return 0

    const durationHours = {
      "1-3 months": 20,
      "3-6 months": 40,
      "6-12 months": 80,
      ongoing: 100,
    }

    const hours = durationHours[requestData.expectedDuration as keyof typeof durationHours] || 20
    return mentor.hourlyRate * hours
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="animate-pulse max-w-2xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/3 mb-6" />
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-32 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <Card className="text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mentor not found</h3>
              <p className="text-muted-foreground mb-4">
                The mentor you're trying to contact doesn't exist or is no longer available.
              </p>
              <Button asChild>
                <Link href="/mentor-board">Back to Mentor Board</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Request Mentorship</h1>
            <p className="text-muted-foreground">Submit a mentorship request to connect with this mentor</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href={`/mentor-board/${mentorId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Request Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Type */}
            <Card>
              <CardHeader>
                <CardTitle>Type of Mentorship</CardTitle>
                <CardDescription>What kind of mentorship are you looking for?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={requestData.requestType}
                  onValueChange={(value) => handleInputChange("requestType", value)}
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="consultation" id="consultation" className="hidden" />
                    <Label htmlFor="consultation" className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm font-medium">Consultation</span>
                    </Label>
                    <RadioGroupItem value="coaching" id="coaching" className="hidden" />
                    <Label htmlFor="coaching" className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm font-medium">Coaching</span>
                    </Label>
                    <RadioGroupItem value="mentoring" id="mentoring" className="hidden" />
                    <Label htmlFor="mentoring" className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm font-medium">Mentoring</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Service Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Service Tags</CardTitle>
                <CardDescription>Select the tags that best describe your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor?.serviceTags?.map((tag) => (
                    <Badge key={tag.id} onClick={() => handleTagToggle(tag.id)} className="cursor-pointer">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
                <CardDescription>Provide a detailed description of your project</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={requestData.projectDescription}
                  onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                  placeholder="Tell us about your project..."
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Expected Duration */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Duration</CardTitle>
                <CardDescription>How long do you anticipate the mentorship to last?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={requestData.expectedDuration}
                  onValueChange={(value) => handleInputChange("expectedDuration", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Budget Range */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Range</CardTitle>
                <CardDescription>What is your budget range for this mentorship?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={requestData.budgetRange}
                  onValueChange={(value) => handleInputChange("budgetRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100000-200000">$100,000 - $200,000</SelectItem>
                    <SelectItem value="200000-300000">$200,000 - $300,000</SelectItem>
                    <SelectItem value="300000+">$300,000+</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Urgency Level */}
            <Card>
              <CardHeader>
                <CardTitle>Urgency Level</CardTitle>
                <CardDescription>How urgent is your mentorship request?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={requestData.urgencyLevel}
                  onValueChange={(value) => handleInputChange("urgencyLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Preferred Communication */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Communication</CardTitle>
                <CardDescription>How would you prefer to communicate with your mentor?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={requestData.preferredCommunication}
                  onValueChange={(value) => handleInputChange("preferredCommunication", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video_call">Video Call</SelectItem>
                    <SelectItem value="phone_call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>

          {/* Mentor Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={mentor.avatarUrl || "/placeholder.svg"} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    <p className="text-muted-foreground">{mentor.title}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Hourly Rate: ${mentor.hourlyRate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Estimated Cost: ${calculateEstimatedCost()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

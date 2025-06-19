"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Target,
  Zap,
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Megaphone,
  Package,
  Settings,
  Shield,
  Globe,
  GitMerge,
  AlertTriangle,
  Lightbulb,
  X,
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { mentorService, type MentorProfile, type MentorServiceTag } from "@/services/mentor-service"

const iconMap = {
  target: Target,
  zap: Zap,
  users: Users,
  "users-2": UserPlus,
  "trending-up": TrendingUp,
  "dollar-sign": DollarSign,
  megaphone: Megaphone,
  package: Package,
  settings: Settings,
  "user-plus": UserPlus,
  shield: Shield,
  globe: Globe,
  "git-merge": GitMerge,
  "alert-triangle": AlertTriangle,
  lightbulb: Lightbulb,
}

export default function MentorSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [serviceTags, setServiceTags] = useState<MentorServiceTag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagProficiency, setTagProficiency] = useState<Record<string, number>>({})
  const [tagExperience, setTagExperience] = useState<Record<string, number>>({})

  const [profileData, setProfileData] = useState<Partial<MentorProfile>>({
    title: "",
    bio: "",
    expertiseSummary: "",
    yearsExperience: 0,
    hourlyRate: 5000,
    currency: "INR",
    maxMentees: 10,
    availabilityStatus: "available",
    linkedinUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    isActive: true,
  })

  const totalSteps = 4

  useEffect(() => {
    loadServiceTags()
  }, [])

  const loadServiceTags = async () => {
    try {
      const result = await mentorService.getServiceTags()
      if (result.success) {
        setServiceTags(result.data || [])
      }
    } catch (error) {
      console.error("Error loading service tags:", error)
    }
  }

  const handleInputChange = (field: keyof MentorProfile, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]

    setSelectedTags(newSelectedTags)

    // Initialize proficiency and experience for new tags
    if (!selectedTags.includes(tagId)) {
      setTagProficiency((prev) => ({ ...prev, [tagId]: 7 }))
      setTagExperience((prev) => ({ ...prev, [tagId]: 5 }))
    }
  }

  const handleProficiencyChange = (tagId: string, value: number) => {
    setTagProficiency((prev) => ({ ...prev, [tagId]: value }))
  }

  const handleExperienceChange = (tagId: string, value: number) => {
    setTagExperience((prev) => ({ ...prev, [tagId]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Prepare service tags with proficiency and experience
      const mentorServiceTags = selectedTags.map((tagId) => {
        const tag = serviceTags.find((t) => t.id === tagId)
        return {
          ...tag!,
          proficiencyLevel: tagProficiency[tagId] || 7,
          yearsExperience: tagExperience[tagId] || 5,
        }
      })

      const mentorProfile: MentorProfile = {
        ...profileData,
        userId: "current-user-id", // This would come from auth context
        serviceTags: mentorServiceTags,
      } as MentorProfile

      const result = await mentorService.createMentorProfile(mentorProfile)

      if (result.success) {
        router.push(`/mentor-board/${result.data.id}?setup=complete`)
      } else {
        console.error("Failed to create mentor profile:", result.error)
      }
    } catch (error) {
      console.error("Error creating mentor profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTagIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Target
    return IconComponent
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return profileData.title && profileData.bio && profileData.expertiseSummary
      case 2:
        return selectedTags.length > 0
      case 3:
        return profileData.hourlyRate && profileData.maxMentees
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Become a Mentor</h1>
            <p className="text-muted-foreground">Share your expertise and help other executives grow</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/mentor-board">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Board
            </Link>
          </Button>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Setup Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="mb-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Basic Info</span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Expertise</span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Pricing</span>
              <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                  <p className="text-muted-foreground">Tell us about yourself and your professional background</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Former CTO & Strategic Growth Advisor"
                      value={profileData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={profileData.yearsExperience}
                      onChange={(e) => handleInputChange("yearsExperience", Number.parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxMentees">Max Mentees</Label>
                    <Select
                      value={profileData.maxMentees?.toString()}
                      onValueChange={(value) => handleInputChange("maxMentees", Number.parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select max mentees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 mentees</SelectItem>
                        <SelectItem value="10">10 mentees</SelectItem>
                        <SelectItem value="15">15 mentees</SelectItem>
                        <SelectItem value="20">20 mentees</SelectItem>
                        <SelectItem value="25">25+ mentees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="expertiseSummary">Expertise Summary *</Label>
                    <Input
                      id="expertiseSummary"
                      placeholder="e.g., Specializing in strategic planning, digital transformation, and team leadership"
                      value={profileData.expertiseSummary}
                      onChange={(e) => handleInputChange("expertiseSummary", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Share your professional journey, key achievements, and what drives your passion for mentoring..."
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{profileData.bio?.length || 0}/1000 characters</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={profileData.linkedinUrl}
                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitterUrl">Twitter Profile</Label>
                      <Input
                        id="twitterUrl"
                        placeholder="https://twitter.com/yourhandle"
                        value={profileData.twitterUrl}
                        onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="websiteUrl">Personal Website</Label>
                      <Input
                        id="websiteUrl"
                        placeholder="https://yourwebsite.com"
                        value={profileData.websiteUrl}
                        onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Expertise & Service Tags */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Areas of Expertise</h2>
                  <p className="text-muted-foreground">
                    Select the areas where you can provide mentorship and guidance
                  </p>
                </div>

                <div className="space-y-6">
                  {Object.entries(
                    serviceTags.reduce(
                      (acc, tag) => {
                        if (!acc[tag.category]) acc[tag.category] = []
                        acc[tag.category].push(tag)
                        return acc
                      },
                      {} as Record<string, MentorServiceTag[]>,
                    ),
                  ).map(([category, tags]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 capitalize">{category.replace("_", " ")}</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {tags.map((tag) => {
                          const IconComponent = getTagIcon(tag.icon || "target")
                          const isSelected = selectedTags.includes(tag.id)

                          return (
                            <div
                              key={tag.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => handleTagToggle(tag.id)}
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <div
                                  className="p-2 rounded-lg"
                                  style={{
                                    backgroundColor: `${tag.color}20`,
                                    color: tag.color,
                                  }}
                                >
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{tag.name}</h4>
                                  <p className="text-sm text-muted-foreground">{tag.description}</p>
                                </div>
                                {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                              </div>

                              {isSelected && (
                                <div className="space-y-3 mt-4 pt-3 border-t">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <Label className="text-sm">Proficiency Level</Label>
                                      <span className="text-sm font-medium">{tagProficiency[tag.id] || 7}/10</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={tagProficiency[tag.id] || 7}
                                      onChange={(e) => handleProficiencyChange(tag.id, Number.parseInt(e.target.value))}
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <Label className="text-sm">Years of Experience</Label>
                                      <span className="text-sm font-medium">{tagExperience[tag.id] || 5} years</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="1"
                                      max="30"
                                      value={tagExperience[tag.id] || 5}
                                      onChange={(e) => handleExperienceChange(tag.id, Number.parseInt(e.target.value))}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Expertise Areas ({selectedTags.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tagId) => {
                        const tag = serviceTags.find((t) => t.id === tagId)
                        if (!tag) return null

                        return (
                          <Badge key={tagId} variant="default" style={{ backgroundColor: tag.color }}>
                            {tag.name}
                            <button
                              onClick={() => handleTagToggle(tagId)}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pricing & Availability */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Pricing & Availability</h2>
                  <p className="text-muted-foreground">Set your rates and availability preferences</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="1000"
                      max="50000"
                      step="500"
                      value={profileData.hourlyRate}
                      onChange={(e) => handleInputChange("hourlyRate", Number.parseInt(e.target.value) || 5000)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recommended range: ₹3,000 - ₹15,000 per hour</p>
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={profileData.currency}
                      onValueChange={(value) => handleInputChange("currency", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="availabilityStatus">Current Availability</Label>
                    <Select
                      value={profileData.availabilityStatus}
                      onValueChange={(value) => handleInputChange("availabilityStatus", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Limited Availability</SelectItem>
                        <SelectItem value="unavailable">Currently Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxMentees">Maximum Mentees</Label>
                    <Input
                      id="maxMentees"
                      type="number"
                      min="1"
                      max="50"
                      value={profileData.maxMentees}
                      onChange={(e) => handleInputChange("maxMentees", Number.parseInt(e.target.value) || 10)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Strategy Consultation</span>
                      <span className="text-sm font-medium">₹5,000 - ₹12,000/hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership Coaching</span>
                      <span className="text-sm font-medium">₹4,000 - ₹10,000/hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Advisory</span>
                      <span className="text-sm font-medium">₹6,000 - ₹15,000/hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">General Mentoring</span>
                      <span className="text-sm font-medium">₹3,000 - ₹8,000/hour</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
                  <p className="text-muted-foreground">Review your information before submitting</p>
                </div>

                <div className="space-y-6">
                  {/* Basic Info Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="font-medium">{profileData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{profileData.yearsExperience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Mentees:</span>
                        <span className="font-medium">{profileData.maxMentees}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bio:</span>
                        <p className="text-sm mt-1">{profileData.bio}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expertise Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expertise Areas ({selectedTags.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        {selectedTags.map((tagId) => {
                          const tag = serviceTags.find((t) => t.id === tagId)
                          if (!tag) return null

                          const IconComponent = getTagIcon(tag.icon || "target")

                          return (
                            <div key={tagId} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="p-2 rounded-lg"
                                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{tag.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {tagExperience[tagId]} years • Level {tagProficiency[tagId]}/10
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pricing Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing & Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hourly Rate:</span>
                        <span className="font-medium">₹{profileData.hourlyRate?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Availability:</span>
                        <Badge variant={profileData.availabilityStatus === "available" ? "default" : "secondary"}>
                          {profileData.availabilityStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Terms */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Switch id="terms" />
                        <div className="space-y-1">
                          <Label htmlFor="terms" className="text-sm font-medium">
                            I agree to the Terms of Service and Privacy Policy
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            By creating a mentor profile, you agree to our platform guidelines and commit to providing
                            quality mentorship services.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading || !isStepValid(currentStep)}>
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

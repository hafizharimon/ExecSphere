"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { useToast } from "@/hooks/use-toast"
import { profileService, type CXOProfile, type ExecutiveExperience } from "@/services/profile-service"
import { linkedInIntegrationService } from "@/services/linkedin-integration"
import {
  Edit3,
  MapPin,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Calendar,
  Building,
  Award,
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  Star,
  Crown,
  Zap,
  Target,
  Plus,
  Shield,
  CheckCircle,
} from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<CXOProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [showExperienceDialog, setShowExperienceDialog] = useState(false)
  const [editingExperience, setEditingExperience] = useState<ExecutiveExperience | null>(null)
  const [formData, setFormData] = useState({
    headline: "",
    country: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    linkedinUrl: "",
    twitterUrl: "",
    githubUrl: "",
    isPublic: true,
    showContactInfo: true,
  })
  const [experienceForm, setExperienceForm] = useState({
    companyName: "",
    positionTitle: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    location: "",
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await profileService.getCXOProfile(user.id)
      if (result.success && result.data) {
        setProfile(result.data)
        setFormData({
          headline: result.data.headline || "",
          country: result.data.country || "",
          contactEmail: result.data.contactEmail || "",
          contactPhone: result.data.contactPhone || "",
          website: result.data.website || "",
          linkedinUrl: result.data.linkedinUrl || "",
          twitterUrl: result.data.twitterUrl || "",
          githubUrl: result.data.githubUrl || "",
          isPublic: result.data.isPublic ?? true,
          showContactInfo: result.data.showContactInfo ?? true,
        })
      }
    } catch (error) {
      console.error("Load profile error:", error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      const result = await profileService.updateCXOProfile(user.id, formData)
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
        setIsEditing(false)
        await loadProfile()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleLinkedInImport = async () => {
    if (!user) return

    setIsImporting(true)
    try {
      // In a real implementation, this would redirect to LinkedIn OAuth
      const authUrl = await linkedInIntegrationService.getAuthorizationUrl()

      // For demo purposes, we'll simulate the import
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const result = await profileService.importLinkedInExperience(user.id, "mock-access-token")
      if (result.success) {
        toast({
          title: "LinkedIn import successful",
          description: "Your LinkedIn experience has been imported and badges updated.",
        })
        await loadProfile()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import LinkedIn experience",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleAddExperience = async () => {
    if (!user) return

    try {
      const result = await profileService.addCustomExperience(user.id, experienceForm)
      if (result.success) {
        toast({
          title: "Experience added",
          description: "Your experience has been added successfully.",
        })
        setShowExperienceDialog(false)
        setExperienceForm({
          companyName: "",
          positionTitle: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
          location: "",
        })
        await loadProfile()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add experience",
        variant: "destructive",
      })
    }
  }

  const getBadgeIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      crown: Crown,
      users: Users,
      star: Star,
      zap: Zap,
      target: Target,
      award: Award,
      shield: Shield,
    }
    return icons[iconName] || Award
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center">
            <p>Profile not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    {user.isVerified && <CheckCircle className="h-6 w-6 text-blue-500" />}
                  </div>
                  <p className="text-muted-foreground text-center lg:text-left">
                    {profile.currentPosition?.positionTitle} at {profile.currentPosition?.companyName}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{profile.headline}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {profile.country && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {profile.country}
                          </div>
                        )}
                        {profile.totalExperienceYears && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {profile.totalExperienceYears} years experience
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "default" : "outline"}
                      className="mt-4 lg:mt-0"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {profile.contactEmail && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{profile.contactEmail}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                    {profile.linkedinUrl && (
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {profile.twitterUrl && (
                      <div className="flex items-center">
                        <Twitter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profile.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Twitter Profile
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Profile Completeness */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completeness</span>
                      <span className="text-sm text-muted-foreground">{profile.profileCompleteness}%</span>
                    </div>
                    <Progress value={profile.profileCompleteness} className="h-2" />
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {profile.badges?.map((badge) => {
                      const IconComponent = getBadgeIcon(badge.icon)
                      return (
                        <Badge
                          key={badge.id}
                          variant="secondary"
                          className="flex items-center space-x-1"
                          style={{ backgroundColor: badge.color + "20", color: badge.color }}
                        >
                          <IconComponent className="h-3 w-3" />
                          <span>{badge.name}</span>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Current Position */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Position</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.currentPosition ? (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{profile.currentPosition.positionTitle}</h3>
                          <p className="text-muted-foreground">{profile.currentPosition.companyName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(profile.currentPosition.startDate)} - Present
                          </p>
                          {profile.currentPosition.location && (
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {profile.currentPosition.location}
                            </p>
                          )}
                        </div>
                      </div>
                      {profile.currentPosition.description && (
                        <p className="text-sm">{profile.currentPosition.description}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No current position information available.</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Profile Views</span>
                    </div>
                    <span className="font-semibold">{profile.analytics?.totalProfileViews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Network Views</span>
                    </div>
                    <span className="font-semibold">{profile.analytics?.totalNetworkViews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Post Engagement</span>
                    </div>
                    <span className="font-semibold">{profile.analytics?.totalWallPostLikes || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Badge Points</span>
                    </div>
                    <span className="font-semibold">{profile.badgePoints || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Professional Experience</CardTitle>
                    <CardDescription>Import from LinkedIn or add custom experience entries</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleLinkedInImport} disabled={isImporting} variant="outline">
                      <Linkedin className="h-4 w-4 mr-2" />
                      {isImporting ? "Importing..." : "Import from LinkedIn"}
                    </Button>
                    <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add Professional Experience</DialogTitle>
                          <DialogDescription>Add a new position to your professional experience</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="positionTitle">Position Title</Label>
                              <Input
                                id="positionTitle"
                                value={experienceForm.positionTitle}
                                onChange={(e) =>
                                  setExperienceForm((prev) => ({ ...prev, positionTitle: e.target.value }))
                                }
                                placeholder="e.g., Chief Executive Officer"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="companyName">Company Name</Label>
                              <Input
                                id="companyName"
                                value={experienceForm.companyName}
                                onChange={(e) =>
                                  setExperienceForm((prev) => ({ ...prev, companyName: e.target.value }))
                                }
                                placeholder="e.g., TechCorp Solutions"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input
                                id="startDate"
                                type="date"
                                value={experienceForm.startDate}
                                onChange={(e) => setExperienceForm((prev) => ({ ...prev, startDate: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate">End Date</Label>
                              <Input
                                id="endDate"
                                type="date"
                                value={experienceForm.endDate}
                                onChange={(e) => setExperienceForm((prev) => ({ ...prev, endDate: e.target.value }))}
                                disabled={experienceForm.isCurrent}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isCurrent"
                              checked={experienceForm.isCurrent}
                              onChange={(e) =>
                                setExperienceForm((prev) => ({
                                  ...prev,
                                  isCurrent: e.target.checked,
                                  endDate: e.target.checked ? "" : prev.endDate,
                                }))
                              }
                            />
                            <Label htmlFor="isCurrent">This is my current position</Label>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={experienceForm.location}
                              onChange={(e) => setExperienceForm((prev) => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g., Bangalore, India"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={experienceForm.description}
                              onChange={(e) => setExperienceForm((prev) => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe your role and achievements..."
                              rows={4}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowExperienceDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddExperience}>Add Experience</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profile.currentPosition ? (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{profile.currentPosition.positionTitle}</h3>
                          {profile.currentPosition.isExecutiveRole && (
                            <Badge variant="default" className="bg-purple-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Executive
                            </Badge>
                          )}
                          {profile.currentPosition.isLinkedInImported && (
                            <Badge variant="outline">
                              <Linkedin className="h-3 w-3 mr-1" />
                              LinkedIn
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{profile.currentPosition.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(profile.currentPosition.startDate)} - Present
                        </p>
                        {profile.currentPosition.location && (
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {profile.currentPosition.location}
                          </p>
                        )}
                        {profile.currentPosition.description && (
                          <p className="text-sm mt-2">{profile.currentPosition.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No experience entries found</p>
                    <Button onClick={() => setShowExperienceDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Experience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Achievement Badges</CardTitle>
                    <CardDescription>
                      Badges earned based on your experience, engagement, and leadership
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{profile.badgePoints || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profile.badges && profile.badges.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {profile.badges.map((badge) => {
                      const IconComponent = getBadgeIcon(badge.icon)
                      return (
                        <div
                          key={badge.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          style={{ borderColor: badge.color + "40" }}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: badge.color + "20" }}
                            >
                              <IconComponent className="h-6 w-6" style={{ color: badge.color }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{badge.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {badge.pointsValue} points
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(badge.earnedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground">
                      Complete your profile and engage with the platform to earn badges
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                      <p className="text-2xl font-bold">{profile.analytics?.totalProfileViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Network Views</p>
                      <p className="text-2xl font-bold">{profile.analytics?.totalNetworkViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Event Views</p>
                      <p className="text-2xl font-bold">{profile.analytics?.totalEventViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Post Impact</p>
                      <p className="text-2xl font-bold">{profile.analytics?.totalWallPostLikes || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>Your platform activity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wall Post Views</span>
                      <span className="font-semibold">{profile.analytics?.totalWallPostViews || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wall Post Likes</span>
                      <span className="font-semibold">{profile.analytics?.totalWallPostLikes || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wall Post Comments</span>
                      <span className="font-semibold">{profile.analytics?.totalWallPostComments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network Connections</span>
                      <span className="font-semibold">{profile.analytics?.totalConnections || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Events Attended</span>
                      <span className="font-semibold">{profile.analytics?.totalEventsAttended || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Forum Posts</span>
                      <span className="font-semibold">{profile.analytics?.totalForumPosts || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="font-semibold">{profile.analytics?.engagementRate || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network Growth</span>
                      <span className="font-semibold">+{profile.analytics?.networkGrowthRate || 0}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile Information</CardTitle>
                  <CardDescription>Update your editable profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        value={formData.headline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, headline: e.target.value }))}
                        placeholder="e.g., Strategic Technology Leader"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="your.email@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                      <Input
                        id="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter URL</Label>
                      <Input
                        id="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, twitterUrl: e.target.value }))}
                        placeholder="https://twitter.com/yourhandle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input
                        id="githubUrl"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
                      />
                      <Label htmlFor="isPublic">Make profile publicly visible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showContactInfo"
                        checked={formData.showContactInfo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, showContactInfo: e.target.checked }))}
                      />
                      <Label htmlFor="showContactInfo">Show contact information to other executives</Label>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your profile visibility and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.isPublic ? "Your profile is publicly visible" : "Your profile is private"}
                      </p>
                    </div>
                    <Badge variant={profile.isPublic ? "default" : "secondary"}>
                      {profile.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Contact Information</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.showContactInfo
                          ? "Contact info is visible to other executives"
                          : "Contact info is hidden"}
                      </p>
                    </div>
                    <Badge variant={profile.showContactInfo ? "default" : "secondary"}>
                      {profile.showContactInfo ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">LinkedIn Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Last synced:{" "}
                        {profile.lastLinkedInSync ? new Date(profile.lastLinkedInSync).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLinkedInImport} disabled={isImporting}>
                      <Linkedin className="h-4 w-4 mr-2" />
                      {isImporting ? "Syncing..." : "Sync Now"}
                    </Button>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

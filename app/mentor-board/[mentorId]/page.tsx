"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  MessageSquare,
  BookOpen,
  Target,
  Zap,
  Megaphone,
  Settings,
  UserPlus,
  Shield,
  Globe,
  GitMerge,
  AlertTriangle,
  Lightbulb,
  Package,
  ExternalLink,
  Calendar,
  CheckCircle,
  Building,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Linkedin,
  Twitter,
  Globe2,
} from "lucide-react"
import Link from "next/link"
import { mentorService, type MentorProfile } from "@/services/mentor-service"

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

export default function MentorProfilePage() {
  const params = useParams()
  const mentorId = params.mentorId as string
  const [mentor, setMentor] = useState<MentorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (mentorId) {
      loadMentorProfile()
      loadMentorAnalytics()
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

  const loadMentorAnalytics = async () => {
    try {
      const result = await mentorService.getMentorAnalytics(mentorId)
      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error("Error loading mentor analytics:", error)
    }
  }

  const getTagIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Target
    return IconComponent
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6" />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-24 h-24 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-4 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                      <div className="h-4 bg-muted rounded w-4/5" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-8 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mentor not found</h3>
              <p className="text-muted-foreground mb-4">
                The mentor profile you're looking for doesn't exist or has been removed.
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
      <main className="container mx-auto py-6 px-4">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/mentor-board">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentor Board
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                  <Avatar className="h-24 w-24 mx-auto md:mx-0">
                    <AvatarImage src={mentor.profileImageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {mentor.title
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{mentor.title}</h1>
                      {mentor.isVerified && (
                        <Badge variant="default" className="bg-blue-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {mentor.isFeatured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{mentor.expertiseSummary}</p>
                    <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{mentor.rating}</span>
                        <span className="text-muted-foreground ml-1">({mentor.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-muted-foreground mr-1" />
                        <span>{mentor.totalMenteesCount} mentees</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-muted-foreground mr-1" />
                        <span>{mentor.yearsExperience}+ years</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                  {mentor.linkedinUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {mentor.twitterUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={mentor.twitterUrl} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {mentor.websiteUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={mentor.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Globe2 className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <h3 className="font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="expertise" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="expertise">Expertise</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="mentees">Mentees</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Expertise Tab */}
              <TabsContent value="expertise" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Areas</CardTitle>
                    <CardDescription>Areas of expertise and proficiency levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentor.serviceTags?.map((tag) => {
                        const IconComponent = getTagIcon(tag.icon || "target")
                        return (
                          <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                              >
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium">{tag.name}</h4>
                                <p className="text-sm text-muted-foreground">{tag.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {tag.yearsExperience} years experience
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">Proficiency</span>
                                <Badge variant="outline">{tag.proficiencyLevel}/10</Badge>
                              </div>
                              <Progress value={(tag.proficiencyLevel || 0) * 10} className="w-24" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentor.achievements?.map((achievement) => (
                        <div key={achievement.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                          <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>{achievement.achievementDate}</span>
                              {achievement.verificationStatus === "verified" && (
                                <Badge variant="default" className="bg-green-500 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-muted-foreground text-center py-8">No achievements listed yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Articles Tab */}
              <TabsContent value="articles" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Published Articles</CardTitle>
                    <CardDescription>Insights and expertise shared by this mentor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentor.articles
                        ?.filter((article) => article.status === "published")
                        .map((article) => (
                          <div key={article.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start space-x-4">
                              {article.featuredImageUrl && (
                                <img
                                  src={article.featuredImageUrl || "/placeholder.svg"}
                                  alt={article.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">{article.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {article.viewCount} views
                                  </div>
                                  <div className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {article.likeCount} likes
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {article.readingTime} min read
                                  </div>
                                  <span>{new Date(article.publishedAt || "").toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {article.tags?.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/mentor-board/articles/${article.slug}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )) || <p className="text-muted-foreground text-center py-8">No articles published yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mentees Tab */}
              <TabsContent value="mentees" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Mentees & Partners</CardTitle>
                    <CardDescription>Companies and individuals currently being mentored</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentor.partnerships
                        ?.filter((p) => p.isCurrent && p.isPublic)
                        .map((partnership) => (
                          <div key={partnership.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Building className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-1">
                              <h4 className="font-medium">Company Partnership</h4>
                              <p className="text-sm text-muted-foreground">{partnership.roleDescription}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {partnership.partnershipType}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Since {new Date(partnership.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )) || (
                        <p className="text-muted-foreground text-center py-8">
                          Current mentorship information is private.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                    <CardDescription>Feedback from previous mentees and clients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock reviews - in real app, these would come from the database */}
                      {[
                        {
                          id: "1",
                          rating: 5,
                          reviewText:
                            "Exceptional mentor with deep strategic insights. Helped us navigate our digital transformation successfully.",
                          reviewerName: "Anonymous",
                          isAnonymous: true,
                          createdAt: "2024-01-15",
                          serviceTags: ["Business Strategy", "Digital Transformation"],
                        },
                        {
                          id: "2",
                          rating: 5,
                          reviewText:
                            "Outstanding guidance on fundraising strategy. Clear, actionable advice that led to successful Series A.",
                          reviewerName: "Tech Startup CEO",
                          isAnonymous: false,
                          createdAt: "2024-01-10",
                          serviceTags: ["Fundraising"],
                        },
                      ].map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{review.reviewText}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {review.serviceTags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">- {review.reviewerName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Services Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Request Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">₹{mentor.hourlyRate?.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">per hour</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Availability</span>
                    <Badge
                      variant={mentor.availabilityStatus === "available" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {mentor.availabilityStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Response Time</span>
                    <span className="text-muted-foreground">~2 hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="text-green-600 font-medium">{mentor.successRate}%</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href={`/mentor-board/${mentorId}/request`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">Response within 24 hours guaranteed</div>
              </CardContent>
            </Card>

            {/* Impact Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Impact Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600">{mentor.impactScore}</div>
                  <div className="text-sm text-muted-foreground">Overall Impact Score</div>
                </div>

                {analytics && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Mentees Helped</span>
                      <span className="font-medium">{mentor.totalMenteesCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium text-green-600">{mentor.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sessions Completed</span>
                      <span className="font-medium">{analytics.totalSessionsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Client Retention</span>
                      <span className="font-medium">{analytics.successMetrics?.clientRetention}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Profile Views</span>
                  </div>
                  <span className="font-medium">{analytics?.totalProfileViews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Articles Published</span>
                  </div>
                  <span className="font-medium">
                    {mentor.articles?.filter((a) => a.status === "published").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Service Requests</span>
                  </div>
                  <span className="font-medium">{analytics?.totalServiceRequests || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Revenue Generated</span>
                  </div>
                  <span className="font-medium">₹{analytics?.totalRevenueGenerated?.toLocaleString() || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Share Profile */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

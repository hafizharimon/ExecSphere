"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Download,
  Video,
  FileText,
  Search,
  Star,
  Users,
  Award,
  Lightbulb,
  Target,
  TrendingUp,
  MessageSquare,
} from "lucide-react"

export default function MentorResourcesPage() {
  const resourceCategories = [
    {
      title: "Mentoring Guides",
      description: "Comprehensive guides for effective mentoring",
      icon: BookOpen,
      count: 12,
      resources: [
        {
          title: "The Complete Mentoring Handbook",
          type: "PDF Guide",
          description: "A comprehensive guide covering all aspects of effective mentoring",
          downloadCount: 1250,
          rating: 4.9,
          size: "2.5 MB",
          featured: true,
        },
        {
          title: "Setting SMART Goals with Mentees",
          type: "Template",
          description: "Framework and templates for goal-setting sessions",
          downloadCount: 890,
          rating: 4.8,
          size: "1.2 MB",
          featured: false,
        },
        {
          title: "Difficult Conversations Guide",
          type: "PDF Guide",
          description: "Navigate challenging discussions with confidence",
          downloadCount: 756,
          rating: 4.7,
          size: "1.8 MB",
          featured: true,
        },
      ],
    },
    {
      title: "Session Templates",
      description: "Ready-to-use templates for different session types",
      icon: FileText,
      count: 8,
      resources: [
        {
          title: "First Session Checklist",
          type: "Checklist",
          description: "Ensure a great first impression with new mentees",
          downloadCount: 2100,
          rating: 4.9,
          size: "0.5 MB",
          featured: true,
        },
        {
          title: "Career Development Session Plan",
          type: "Template",
          description: "Structured approach to career planning discussions",
          downloadCount: 1450,
          rating: 4.8,
          size: "0.8 MB",
          featured: false,
        },
        {
          title: "Leadership Assessment Framework",
          type: "Assessment",
          description: "Evaluate and develop leadership capabilities",
          downloadCount: 980,
          rating: 4.6,
          size: "1.1 MB",
          featured: false,
        },
      ],
    },
    {
      title: "Video Training",
      description: "Expert-led training videos and webinars",
      icon: Video,
      count: 15,
      resources: [
        {
          title: "Advanced Mentoring Techniques",
          type: "Video Course",
          description: "Master advanced mentoring skills and methodologies",
          downloadCount: 3200,
          rating: 4.9,
          size: "45 min",
          featured: true,
        },
        {
          title: "Building Trust in Virtual Sessions",
          type: "Webinar",
          description: "Create meaningful connections in remote mentoring",
          downloadCount: 1800,
          rating: 4.7,
          size: "30 min",
          featured: false,
        },
        {
          title: "Handling Mentor Burnout",
          type: "Workshop",
          description: "Maintain your well-being while helping others",
          downloadCount: 1200,
          rating: 4.8,
          size: "25 min",
          featured: true,
        },
      ],
    },
  ]

  const quickTools = [
    {
      title: "Session Prep Checklist",
      description: "Quick checklist for session preparation",
      icon: Target,
      action: "Use Template",
    },
    {
      title: "Goal Tracking Sheet",
      description: "Track mentee progress and achievements",
      icon: TrendingUp,
      action: "Download",
    },
    {
      title: "Feedback Form Template",
      description: "Collect structured feedback from mentees",
      icon: MessageSquare,
      action: "Get Template",
    },
    {
      title: "Session Notes Template",
      description: "Standardized format for session documentation",
      icon: FileText,
      action: "Download",
    },
  ]

  const bestPractices = [
    {
      title: "Active Listening Techniques",
      description: "Master the art of truly hearing your mentees",
      tips: [
        "Give full attention without distractions",
        "Ask clarifying questions",
        "Reflect back what you hear",
        "Avoid immediate solutions",
      ],
    },
    {
      title: "Effective Question Framework",
      description: "Guide mentees to their own insights",
      tips: [
        "Use open-ended questions",
        "Ask 'What if...' scenarios",
        "Explore underlying assumptions",
        "Challenge thinking patterns",
      ],
    },
    {
      title: "Building Accountability",
      description: "Help mentees follow through on commitments",
      tips: [
        "Set clear, measurable goals",
        "Regular check-ins on progress",
        "Celebrate small wins",
        "Address obstacles together",
      ],
    },
  ]

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Mentor Resources</h1>
          <p className="text-muted-foreground">Tools, guides, and materials to enhance your mentoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <BookOpen className="h-3 w-3 mr-1" />
            35+ Resources
          </Badge>
          <Badge variant="outline">
            <Award className="h-3 w-3 mr-1" />
            Expert Curated
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources, templates, guides..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Tools */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Tools
          </CardTitle>
          <CardDescription>Frequently used templates and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickTools.map((tool, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <tool.icon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">{tool.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  {tool.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all-resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-resources">All Resources</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="all-resources" className="space-y-6">
          {resourceCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                  <Badge variant="secondary">{category.count}</Badge>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className={`p-4 border rounded-lg ${resource.featured ? "ring-2 ring-blue-200" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {resource.featured && (
                            <Badge variant="default" className="bg-blue-500 mb-2">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <h3 className="font-medium mb-1">{resource.title}</h3>
                          <Badge variant="outline" className="text-xs mb-2">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {resource.downloadCount}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {resource.rating}
                          </span>
                        </div>
                        <span>{resource.size}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mentoring Guides</CardTitle>
              <CardDescription>Comprehensive guides for effective mentoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resourceCategories[0].resources.map((resource, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${resource.featured ? "ring-2 ring-blue-200" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {resource.featured && (
                          <Badge variant="default" className="bg-blue-500 mb-2">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <h3 className="font-medium mb-1">{resource.title}</h3>
                        <Badge variant="outline" className="text-xs mb-2">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {resource.downloadCount}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {resource.rating}
                        </span>
                      </div>
                      <span>{resource.size}</span>
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Templates</CardTitle>
              <CardDescription>Ready-to-use templates for different session types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resourceCategories[1].resources.map((resource, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${resource.featured ? "ring-2 ring-blue-200" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {resource.featured && (
                          <Badge variant="default" className="bg-blue-500 mb-2">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <h3 className="font-medium mb-1">{resource.title}</h3>
                        <Badge variant="outline" className="text-xs mb-2">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {resource.downloadCount}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {resource.rating}
                        </span>
                      </div>
                      <span>{resource.size}</span>
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          {bestPractices.map((practice, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{practice.title}</CardTitle>
                <CardDescription>{practice.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {practice.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>External resources and recommended reading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2">Recommended Books</h4>
                <ul className="space-y-1 text-sm">
                  <li>• "The Mentor's Guide" by Lois J. Zachary</li>
                  <li>• "Coaching for Performance" by John Whitmore</li>
                  <li>• "The Coaching Habit" by Michael Bungay Stanier</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium mb-2">Online Communities</h4>
                <ul className="space-y-1 text-sm">
                  <li>• International Mentoring Association</li>
                  <li>• Mentor Network Community</li>
                  <li>• Executive Coaching Institute</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

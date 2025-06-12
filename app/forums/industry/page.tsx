"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Users,
  Clock,
  Search,
  Plus,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  Bot,
  Building,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function IndustryForumPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const industries = [
    { id: "all", name: "All Industries", count: 298 },
    { id: "technology", name: "Technology", count: 89 },
    { id: "finance", name: "Finance & Banking", count: 67 },
    { id: "healthcare", name: "Healthcare", count: 45 },
    { id: "manufacturing", name: "Manufacturing", count: 34 },
    { id: "retail", name: "Retail & E-commerce", count: 28 },
    { id: "energy", name: "Energy & Utilities", count: 21 },
    { id: "consulting", name: "Consulting", count: 14 },
  ]

  const industryPosts = [
    {
      id: "1",
      title: "Fintech Disruption in Traditional Banking",
      content:
        "How are traditional banks adapting to fintech disruption? What strategies have proven most effective in your experience?",
      author: "Rajesh Gupta",
      authorRole: "CEO",
      authorCompany: "National Bank",
      industry: "finance",
      replies: 34,
      views: 287,
      likes: 56,
      lastReply: "1 hour ago",
      hasAiResponse: true,
      aiModel: "OpenAI GPT-4",
      tags: ["fintech", "banking", "disruption"],
      createdAt: "2024-01-15T08:30:00Z",
    },
    {
      id: "2",
      title: "AI Implementation in Healthcare Operations",
      content:
        "Sharing our journey of implementing AI in hospital operations. What challenges and successes have you experienced?",
      author: "Dr. Priya Sharma",
      authorRole: "CMO",
      authorCompany: "HealthCare Plus",
      industry: "healthcare",
      replies: 28,
      views: 198,
      likes: 42,
      lastReply: "2 hours ago",
      hasAiResponse: true,
      aiModel: "Google Gemini",
      tags: ["ai", "healthcare", "operations"],
      createdAt: "2024-01-14T16:20:00Z",
    },
    {
      id: "3",
      title: "Sustainable Manufacturing Practices",
      content:
        "Looking for insights on implementing sustainable manufacturing practices while maintaining profitability.",
      author: "Michael Chen",
      authorRole: "COO",
      authorCompany: "GreenTech Manufacturing",
      industry: "manufacturing",
      replies: 19,
      views: 145,
      likes: 31,
      lastReply: "3 hours ago",
      hasAiResponse: false,
      tags: ["sustainability", "manufacturing", "green-tech"],
      createdAt: "2024-01-14T11:45:00Z",
    },
    {
      id: "4",
      title: "E-commerce Personalization Strategies",
      content: "What personalization strategies are driving the highest ROI in your e-commerce operations?",
      author: "Sarah Johnson",
      authorRole: "CMO",
      authorCompany: "RetailMax",
      industry: "retail",
      replies: 25,
      views: 176,
      likes: 38,
      lastReply: "4 hours ago",
      hasAiResponse: true,
      aiModel: "Meta Llama",
      tags: ["e-commerce", "personalization", "roi"],
      createdAt: "2024-01-13T14:30:00Z",
    },
  ]

  const industryInsights = [
    {
      industry: "Technology",
      trend: "AI Integration",
      growth: "+45%",
      description: "Rapid adoption of AI across all tech sectors",
    },
    {
      industry: "Finance",
      trend: "Digital Banking",
      growth: "+32%",
      description: "Shift towards digital-first banking solutions",
    },
    {
      industry: "Healthcare",
      trend: "Telemedicine",
      growth: "+28%",
      description: "Continued growth in remote healthcare delivery",
    },
    {
      industry: "Manufacturing",
      trend: "Industry 4.0",
      growth: "+23%",
      description: "Smart manufacturing and IoT adoption",
    },
  ]

  const filteredPosts = industryPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || post.industry === selectedIndustry
    return matchesSearch && matchesIndustry
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "popular":
        return b.likes - a.likes
      case "replies":
        return b.replies - a.replies
      case "views":
        return b.views - a.views
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/forums" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Forums
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Industry Insights</h1>
            <p className="text-muted-foreground">Share industry-specific knowledge and trends</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>298 posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>245 members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last activity: 1 hour ago</span>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href="/forums/create">
              <Plus className="h-4 w-4 mr-2" />
              Share Insight
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="trends">Industry Trends</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search industry discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          {industry.name} ({industry.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="replies">Most Replies</SelectItem>
                      <SelectItem value="views">Most Views</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link
                            href={`/forums/post/${post.id}`}
                            className="text-lg font-medium hover:text-primary truncate"
                          >
                            {post.title}
                          </Link>
                          <Badge variant="outline" className="capitalize">
                            {post.industry}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.content}</p>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                          <span>by {post.author}</span>
                          <Badge variant="outline">{post.authorRole}</Badge>
                          <span>at {post.authorCompany}</span>
                          {post.hasAiResponse && (
                            <Badge className="bg-purple-100 text-purple-700">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Response by {post.aiModel}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.replies} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Last reply {post.lastReply}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/forums/post/${post.id}`}>View Discussion</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Industry Trends
                </CardTitle>
                <CardDescription>Current trends and growth patterns across industries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {industryInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{insight.industry}</h3>
                        <Badge className="bg-green-500 text-white">{insight.growth}</Badge>
                      </div>
                      <p className="text-sm font-medium text-blue-600 mb-1">{insight.trend}</p>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  AI-Powered Industry Insights
                </CardTitle>
                <CardDescription>Machine learning analysis of industry discussions and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Technology Sector</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">Most discussed: AI implementation strategies</p>
                    <p className="text-xs text-blue-600">89% of discussions focus on AI integration</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Finance Sector</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-2">Most discussed: Digital transformation and fintech</p>
                    <p className="text-xs text-green-600">76% of discussions involve regulatory compliance</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium text-purple-900">Healthcare Sector</h4>
                    </div>
                    <p className="text-sm text-purple-700 mb-2">
                      Most discussed: Telemedicine and patient data security
                    </p>
                    <p className="text-xs text-purple-600">82% of discussions mention AI-driven diagnostics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

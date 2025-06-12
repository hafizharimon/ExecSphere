"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Users,
  Clock,
  Search,
  Plus,
  Pin,
  Lock,
  Eye,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  Bot,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function GeneralForumPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const forumPosts = [
    {
      id: "1",
      title: "Digital Transformation Strategies for 2024",
      content:
        "What are the key digital transformation strategies that have worked for your organizations this year? I'm particularly interested in...",
      author: "Sarah Chen",
      authorRole: "CTO",
      authorCompany: "TechCorp",
      replies: 23,
      views: 156,
      likes: 45,
      lastReply: "2 hours ago",
      isPinned: true,
      isLocked: false,
      hasAiResponse: true,
      aiModel: "OpenAI GPT-4",
      tags: ["digital-transformation", "strategy", "technology"],
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Managing Remote Teams Effectively",
      content:
        "As we continue to navigate the hybrid work environment, I'd love to hear about successful strategies for managing remote teams...",
      author: "Michael Rodriguez",
      authorRole: "CEO",
      authorCompany: "Global Solutions",
      replies: 45,
      views: 289,
      likes: 67,
      lastReply: "1 hour ago",
      isPinned: false,
      isLocked: false,
      hasAiResponse: true,
      aiModel: "Google Gemini",
      tags: ["remote-work", "leadership", "management"],
      createdAt: "2024-01-14T15:45:00Z",
    },
    {
      id: "3",
      title: "ESG Reporting Best Practices",
      content:
        "Looking for insights on ESG reporting frameworks and best practices. What tools and methodologies have you found most effective?",
      author: "Jennifer Kim",
      authorRole: "CFO",
      authorCompany: "Sustainable Corp",
      replies: 18,
      views: 134,
      likes: 32,
      lastReply: "3 hours ago",
      isPinned: false,
      isLocked: false,
      hasAiResponse: false,
      tags: ["esg", "reporting", "sustainability"],
      createdAt: "2024-01-14T09:20:00Z",
    },
    {
      id: "4",
      title: "Customer Experience Innovation Trends",
      content:
        "What customer experience innovations are you seeing in your industries? Particularly interested in AI-driven personalization...",
      author: "David Wilson",
      authorRole: "CMO",
      authorCompany: "Innovation Labs",
      replies: 31,
      views: 201,
      likes: 54,
      lastReply: "4 hours ago",
      isPinned: false,
      isLocked: false,
      hasAiResponse: true,
      aiModel: "X Grok",
      tags: ["customer-experience", "innovation", "ai"],
      createdAt: "2024-01-13T14:10:00Z",
    },
  ]

  const filteredPosts = forumPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
            <h1 className="text-2xl lg:text-3xl font-bold">General Discussion</h1>
            <p className="text-muted-foreground">Open discussions for all executives</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>445 posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>312 members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last activity: 30 minutes ago</span>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href="/forums/create">
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
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
                      {post.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                      {post.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                      <Link
                        href={`/forums/post/${post.id}`}
                        className="text-lg font-medium hover:text-primary truncate"
                      >
                        {post.title}
                      </Link>
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

        {/* AI Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>Trending topics and suggested discussions based on your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2">Trending: Digital Transformation</h4>
                <p className="text-sm text-blue-700">High engagement on technology strategy discussions</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <h4 className="font-medium text-green-900 mb-2">Suggested: ESG Reporting</h4>
                <p className="text-sm text-green-700">Based on your CFO role and recent activity</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <h4 className="font-medium text-purple-900 mb-2">AI Recommendation</h4>
                <p className="text-sm text-purple-700">Consider starting a discussion on AI governance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

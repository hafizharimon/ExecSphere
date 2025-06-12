"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bot,
  Sparkles,
  Users,
  TrendingUp,
  Eye,
  Filter,
} from "lucide-react"

export default function PublicWallPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const [newPost, setNewPost] = useState({
    content: "",
    postType: "general", // general, question, comment-only
    targetAudience: "all",
    responseLimit: "unlimited",
    aiFirstResponse: true,
    selectedAiModel: "openai",
  })

  const publicPosts = [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        role: "CTO",
        company: "TechCorp Solutions",
        avatar: "/placeholder-user.jpg",
        verified: true,
        mcaVerified: true,
      },
      content:
        "What are your thoughts on implementing AI governance frameworks in large organizations? We're seeing increased regulatory scrutiny and need to balance innovation with compliance. #AIGovernance #Leadership",
      postType: "question",
      targetAudience: ["cto", "ceo"],
      timestamp: "2024-01-15T10:30:00Z",
      likes: 156,
      comments: 43,
      shares: 12,
      views: 2847,
      hasAiResponse: true,
      aiModel: "OpenAI GPT-4",
      aiResponse: {
        content:
          "Excellent question, Sarah! AI governance frameworks should focus on three key pillars: 1) Ethical AI principles with clear guidelines, 2) Risk assessment protocols for AI deployments, and 3) Continuous monitoring systems. The key is starting with pilot programs in low-risk areas while building organizational AI literacy.",
        likes: 89,
        timestamp: "2024-01-15T10:35:00Z",
      },
      tags: ["ai-governance", "leadership", "compliance"],
      responses: [
        {
          id: "r1",
          author: "Michael Rodriguez",
          role: "CEO",
          content:
            "We've implemented a three-tier governance model that's worked well. Happy to share our framework offline.",
          timestamp: "2024-01-15T11:00:00Z",
          likes: 23,
        },
        {
          id: "r2",
          author: "Jennifer Kim",
          role: "Chief Legal Officer",
          content:
            "The regulatory landscape is evolving rapidly. We're seeing new requirements from EU AI Act and similar frameworks globally.",
          timestamp: "2024-01-15T11:15:00Z",
          likes: 18,
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Rajesh Kumar",
        role: "CEO",
        company: "Innovation Labs",
        avatar: "/placeholder-user.jpg",
        verified: true,
        mcaVerified: true,
      },
      content:
        "Sharing insights from our recent board meeting: The future of work is not just remote vs. office - it's about creating hybrid experiences that maximize both collaboration and individual productivity. Key learnings: 1) Invest in digital collaboration tools, 2) Redesign office spaces for collaboration, 3) Focus on outcomes, not hours. What's working for your organizations?",
      postType: "general",
      targetAudience: ["all"],
      timestamp: "2024-01-14T15:45:00Z",
      likes: 234,
      comments: 67,
      shares: 28,
      views: 4521,
      hasAiResponse: true,
      aiModel: "Google Gemini",
      aiResponse: {
        content:
          "Your insights align perfectly with recent workplace research! The hybrid model's success depends on intentional design. Consider implementing 'collaboration days' where teams synchronize their office presence, and 'focus days' for deep work from preferred locations. The key is creating predictable patterns that support both spontaneous collaboration and planned productivity.",
        likes: 145,
        timestamp: "2024-01-14T15:50:00Z",
      },
      tags: ["future-of-work", "leadership", "productivity"],
      responses: [
        {
          id: "r3",
          author: "Priya Sharma",
          role: "CHRO",
          content:
            "We've seen 40% improvement in employee satisfaction with our hybrid model. The key is clear communication and trust.",
          timestamp: "2024-01-14T16:00:00Z",
          likes: 45,
        },
      ],
    },
    {
      id: "3",
      author: {
        name: "David Wilson",
        role: "CMO",
        company: "Global Marketing Inc",
        avatar: "/placeholder-user.jpg",
        verified: true,
        mcaVerified: false,
      },
      content:
        "Customer experience is becoming the ultimate differentiator. In our latest campaign, we achieved 300% ROI by focusing on personalization at scale. The secret? Combining human empathy with AI-driven insights. #CustomerExperience #Marketing",
      postType: "general",
      targetAudience: ["cmo", "ceo"],
      timestamp: "2024-01-13T14:20:00Z",
      likes: 189,
      comments: 34,
      shares: 15,
      views: 3245,
      hasAiResponse: false,
      tags: ["customer-experience", "marketing", "roi"],
      responses: [
        {
          id: "r4",
          author: "Lisa Wang",
          role: "CMO",
          content: "Would love to learn more about your personalization strategy. The ROI numbers are impressive!",
          timestamp: "2024-01-13T14:30:00Z",
          likes: 12,
        },
      ],
    },
  ]

  const trendingTopics = [
    { topic: "AI Governance", posts: 45, growth: "+23%" },
    { topic: "Future of Work", posts: 38, growth: "+18%" },
    { topic: "Digital Transformation", posts: 52, growth: "+15%" },
    { topic: "ESG Reporting", posts: 29, growth: "+12%" },
    { topic: "Customer Experience", posts: 34, growth: "+8%" },
  ]

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Simulate AI analysis and post creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Post Created Successfully",
        description: "Your post has been published and AI analysis is complete",
      })

      // Reset form
      setNewPost({
        content: "",
        postType: "general",
        targetAudience: "all",
        responseLimit: "unlimited",
        aiFirstResponse: true,
        selectedAiModel: "openai",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleLike = (postId: string, isAiResponse = false) => {
    toast({
      title: "Liked!",
      description: isAiResponse ? "You liked the AI response" : "You liked this post",
    })
  }

  const handleShare = (postId: string) => {
    toast({
      title: "Shared!",
      description: "Post shared to your network",
    })
  }

  const filteredPosts = publicPosts.filter((post) => {
    if (filterBy === "all") return true
    if (filterBy === "questions") return post.postType === "question"
    if (filterBy === "ai-responses") return post.hasAiResponse
    if (filterBy === "my-audience") return post.targetAudience.includes(user?.role?.toLowerCase() || "")
    return true
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case "popular":
        return b.likes - a.likes
      case "engagement":
        return b.comments + b.likes - (a.comments + a.likes)
      default:
        return 0
    }
  })

  if (!user) {
    return <div>Please log in to access the public wall.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Executive Public Wall</h1>
              <p className="text-muted-foreground">Share insights, ask questions, and engage with fellow executives</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>Share your insights with the executive community</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="What insights would you like to share?"
                      value={newPost.content}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Post Type</Label>
                      <Select
                        value={newPost.postType}
                        onValueChange={(value) => setNewPost((prev) => ({ ...prev, postType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Discussion</SelectItem>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="comment-only">Comments Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Select
                        value={newPost.targetAudience}
                        onValueChange={(value) => setNewPost((prev) => ({ ...prev, targetAudience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Executives</SelectItem>
                          <SelectItem value="ceo">CEOs</SelectItem>
                          <SelectItem value="cto">CTOs</SelectItem>
                          <SelectItem value="cfo">CFOs</SelectItem>
                          <SelectItem value="cmo">CMOs</SelectItem>
                          <SelectItem value="legal">Legal Experts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {newPost.postType === "question" && (
                    <div className="space-y-2">
                      <Label>Response Limit</Label>
                      <Select
                        value={newPost.responseLimit}
                        onValueChange={(value) => setNewPost((prev) => ({ ...prev, responseLimit: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                          <SelectItem value="1">1 response</SelectItem>
                          <SelectItem value="5">5 responses</SelectItem>
                          <SelectItem value="10">10 responses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="aiResponse"
                        checked={newPost.aiFirstResponse}
                        onChange={(e) => setNewPost((prev) => ({ ...prev, aiFirstResponse: e.target.checked }))}
                      />
                      <Label htmlFor="aiResponse">Enable AI first response</Label>
                    </div>

                    {newPost.aiFirstResponse && (
                      <div className="space-y-2">
                        <Label>AI Model</Label>
                        <Select
                          value={newPost.selectedAiModel}
                          onValueChange={(value) => setNewPost((prev) => ({ ...prev, selectedAiModel: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                            <SelectItem value="gemini">Google Gemini</SelectItem>
                            <SelectItem value="grok">X Grok</SelectItem>
                            <SelectItem value="meta">Meta Llama</SelectItem>
                            <SelectItem value="deepseek">DeepSeek</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreatePost} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter posts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="questions">Questions Only</SelectItem>
                        <SelectItem value="ai-responses">With AI Responses</SelectItem>
                        <SelectItem value="my-audience">For My Role</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="engagement">Most Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Posts */}
              <div className="space-y-6">
                {sortedPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      {/* Post Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{post.author.name}</h3>
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            {post.author.mcaVerified && (
                              <Badge className="bg-green-500 text-white text-xs">MCA Verified</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.author.role} at {post.author.company}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.timestamp).toLocaleDateString()} •{" "}
                            {post.targetAudience.includes("all") ? "All Executives" : post.targetAudience.join(", ")}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-sm leading-relaxed">{post.content}</p>
                        {post.tags && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </span>
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                        <Badge variant={post.postType === "question" ? "default" : "secondary"}>
                          {post.postType === "question" ? "Question" : "Discussion"}
                        </Badge>
                      </div>

                      {/* AI Response */}
                      {post.hasAiResponse && post.aiResponse && (
                        <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                          <div className="flex items-center space-x-2 mb-2">
                            <Bot className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-purple-800">AI Response by {post.aiModel}</span>
                            <Badge className="bg-purple-500 text-white text-xs">First Response</Badge>
                          </div>
                          <p className="text-sm text-purple-900 mb-3">{post.aiResponse.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-purple-700">
                            <button
                              onClick={() => handleLike(post.id, true)}
                              className="flex items-center space-x-1 hover:text-purple-900"
                            >
                              <Heart className="h-3 w-3" />
                              <span>{post.aiResponse.likes}</span>
                            </button>
                            <span>{new Date(post.aiResponse.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Responses */}
                      {post.responses && post.responses.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.responses.map((response) => (
                            <div key={response.id} className="pl-4 border-l-2 border-gray-100">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{response.author}</span>
                                <Badge variant="outline" className="text-xs">
                                  {response.role}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{response.content}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <button className="flex items-center space-x-1 hover:text-foreground">
                                  <Heart className="h-3 w-3" />
                                  <span>{response.likes}</span>
                                </button>
                                <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                          >
                            <Heart className="h-4 w-4" />
                            <span>Like</span>
                          </button>
                          <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span>Comment</span>
                          </button>
                          <button
                            onClick={() => handleShare(post.id)}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{topic.topic}</p>
                          <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          {topic.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">Suggested Topic</p>
                      <p className="text-xs text-blue-700">
                        Consider posting about "Remote Team Leadership" - high engagement expected
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Optimal Timing</p>
                      <p className="text-xs text-green-700">Best engagement times: 10-11 AM and 3-4 PM IST</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800 font-medium">Content Tip</p>
                      <p className="text-xs text-purple-700">Posts with questions get 40% more engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Posts Created</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Views</span>
                      <span className="font-medium">15.8K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="font-medium">7.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">AI Responses</span>
                      <span className="font-medium">18</span>
                    </div>
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

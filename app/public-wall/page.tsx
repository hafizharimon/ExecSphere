"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { PostCreationModal } from "@/components/post-creation-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { postService, type Post } from "@/services/post-service"
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
  RefreshCw,
  Loader2,
} from "lucide-react"
import { useAnalyticsContext } from "@/components/analytics-provider"

export default function PublicWallPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const { trackWallActivity, trackProfileView } = useAnalyticsContext()

  const trendingTopics = [
    { topic: "AI Governance", posts: 45, growth: "+23%" },
    { topic: "Future of Work", posts: 38, growth: "+18%" },
    { topic: "Digital Transformation", posts: 52, growth: "+15%" },
    { topic: "ESG Reporting", posts: 29, growth: "+12%" },
    { topic: "Customer Experience", posts: 34, growth: "+8%" },
  ]

  useEffect(() => {
    loadPosts()
  }, [filterBy, sortBy, user])

  const loadPosts = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const filters = {
        audience: filterBy === "my-audience" ? [user.role?.toLowerCase() || ""] : undefined,
        postType: filterBy === "questions" ? "question" : undefined,
        limit: 20,
        offset: 0,
      }

      const fetchedPosts = await postService.getPosts(filters)

      // Sort posts
      const sortedPosts = [...fetchedPosts].sort((a, b) => {
        switch (sortBy) {
          case "recent":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case "popular":
            return b.likes - a.likes
          case "engagement":
            return b.comments + b.likes - (a.comments + a.likes)
          default:
            return 0
        }
      })

      setPosts(sortedPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostCreated = () => {
    trackWallActivity("post_create")
    loadPosts()
    toast({
      title: "Post Created",
      description: "Your post has been published successfully!",
    })
  }

  const handleLike = async (postId: string, isAiResponse = false) => {
    try {
      await postService.likePost(postId)

      // Track wall activity
      trackWallActivity("like", postId, isAiResponse ? "ai_response" : "user_post")

      toast({
        title: "Liked!",
        description: isAiResponse ? "You liked the AI response" : "You liked this post",
      })
      loadPosts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (postId: string) => {
    try {
      await postService.sharePost(postId)
      toast({
        title: "Shared!",
        description: "Post shared to your network",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      })
    }
  }

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
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={loadPosts} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading posts...</span>
                  </div>
                ) : posts.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <p className="text-muted-foreground">No posts found. Be the first to share something!</p>
                      <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
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
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {post.postType === "question"
                                  ? "Question"
                                  : post.postType === "share"
                                    ? "Share"
                                    : "Discussion"}
                              </Badge>
                              {post.priority === "high" && (
                                <>
                                  <span>•</span>
                                  <Badge variant="destructive" className="text-xs">
                                    High Priority
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Post Title */}
                        {post.title && <h2 className="text-lg font-semibold mb-3">{post.title}</h2>}

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-sm leading-relaxed">{post.content}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Audience & Response Limit Info */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {post.targetAudience.includes("all")
                                  ? "All Executives"
                                  : post.targetAudience.join(", ").toUpperCase()}
                              </span>
                            </span>
                            {post.postType === "question" && (
                              <span>
                                Responses: {post.currentResponseCount}
                                {typeof post.responseLimit === "number" ? `/${post.responseLimit}` : ""}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.aiFirstResponse && (
                              <Badge className="bg-purple-500 text-white text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                AI Enhanced
                              </Badge>
                            )}
                            <Badge variant={post.visibility === "public" ? "default" : "secondary"} className="text-xs">
                              {post.visibility}
                            </Badge>
                          </div>
                        </div>

                        {/* AI Response */}
                        {post.aiResponse && (
                          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Bot className="h-5 w-5 text-purple-600" />
                              <span className="font-medium text-purple-800">
                                AI Response by {post.aiResponse.model}
                              </span>
                              <Badge className="bg-purple-500 text-white text-xs">First Response</Badge>
                              {post.aiResponse.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(post.aiResponse.confidence * 100)}% confidence
                                </Badge>
                              )}
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

                        {/* Human Responses */}
                        {post.responses && post.responses.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {post.responses.map((response) => (
                              <div key={response.id} className="pl-4 border-l-2 border-gray-100">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">{response.author.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {response.author.role}
                                  </Badge>
                                  {response.author.verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{response.content}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <button className="flex items-center space-x-1 hover:text-foreground">
                                    <Heart className="h-3 w-3" />
                                    <span>{response.likes}</span>
                                  </button>
                                  <span>{new Date(response.createdAt).toLocaleTimeString()}</span>
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
                              <span>Like ({post.likes})</span>
                            </button>
                            <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                              <MessageCircle className="h-4 w-4" />
                              <span>Comment ({post.comments})</span>
                            </button>
                            <button
                              onClick={() => handleShare(post.id)}
                              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                            >
                              <Share2 className="h-4 w-4" />
                              <span>Share ({post.shares})</span>
                            </button>
                          </div>
                          {post.postType === "question" &&
                            typeof post.responseLimit === "number" &&
                            post.currentResponseCount >= post.responseLimit && (
                              <Badge variant="secondary" className="text-xs">
                                Response limit reached
                              </Badge>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
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

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}

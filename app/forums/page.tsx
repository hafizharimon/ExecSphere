"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Clock, Search, Plus, Pin, Lock, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

export default function ForumsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const forumCategories = [
    {
      id: "ceo",
      name: "CEO Forum",
      description: "Strategic leadership and vision discussions",
      restriction: "CEO",
      posts: 156,
      members: 89,
      lastActivity: "2 hours ago",
      color: "bg-blue-500",
    },
    {
      id: "cto",
      name: "CTO Forum",
      description: "Technology strategy and innovation",
      restriction: "CTO",
      posts: 234,
      members: 67,
      lastActivity: "1 hour ago",
      color: "bg-green-500",
    },
    {
      id: "cfo",
      name: "CFO Forum",
      description: "Financial strategy and risk management",
      restriction: "CFO",
      posts: 189,
      members: 54,
      lastActivity: "3 hours ago",
      color: "bg-purple-500",
    },
    {
      id: "general",
      name: "General Discussion",
      description: "Open discussions for all executives",
      restriction: null,
      posts: 445,
      members: 312,
      lastActivity: "30 minutes ago",
      color: "bg-gray-500",
    },
    {
      id: "industry",
      name: "Industry Insights",
      description: "Share industry-specific knowledge and trends",
      restriction: null,
      posts: 298,
      members: 245,
      lastActivity: "1 hour ago",
      color: "bg-orange-500",
    },
  ]

  const recentPosts = [
    {
      id: "1",
      title: "Digital Transformation Strategies for 2024",
      author: "Sarah Chen",
      authorRole: "CTO",
      category: "CTO Forum",
      replies: 23,
      views: 156,
      lastReply: "2 hours ago",
      isPinned: true,
      isLocked: false,
    },
    {
      id: "2",
      title: "Managing Remote Teams Effectively",
      author: "Michael Rodriguez",
      authorRole: "CEO",
      category: "General Discussion",
      replies: 45,
      views: 289,
      lastReply: "1 hour ago",
      isPinned: false,
      isLocked: false,
    },
    {
      id: "3",
      title: "AI Investment ROI Analysis",
      author: "Jennifer Kim",
      authorRole: "CFO",
      category: "CFO Forum",
      replies: 18,
      views: 134,
      lastReply: "3 hours ago",
      isPinned: false,
      isLocked: false,
    },
    {
      id: "4",
      title: "Healthcare Industry Outlook 2024",
      author: "David Wilson",
      authorRole: "CEO",
      category: "Industry Insights",
      replies: 31,
      views: 201,
      lastReply: "4 hours ago",
      isPinned: false,
      isLocked: false,
    },
  ]

  const trendingTopics = [
    { tag: "AI Strategy", posts: 45 },
    { tag: "Remote Work", posts: 38 },
    { tag: "ESG", posts: 29 },
    { tag: "Digital Transformation", posts: 52 },
    { tag: "Leadership", posts: 67 },
  ]

  const canAccessCategory = (restriction: string | null) => {
    if (!restriction) return true
    return user?.role.toUpperCase() === restriction || user?.role === "admin" || user?.role === "super_admin"
  }

  const filteredCategories = forumCategories.filter(
    (category) =>
      canAccessCategory(category.restriction) &&
      (selectedCategory === "all" || category.id === selectedCategory) &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPosts = recentPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return <div>Please log in to access forums.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Executive Forums</h1>
            <p className="text-muted-foreground">Connect and discuss with fellow executives</p>
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
                    placeholder="Search forums and discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {forumCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent Posts</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      {category.restriction && <Badge variant="secondary">{category.restriction} Only</Badge>}
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{category.posts} posts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{category.members} members</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Last activity: {category.lastActivity}</span>
                      <Button size="sm" asChild>
                        <Link href={`/forums/${category.id}`}>View Forum</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
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
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>by {post.author}</span>
                        <Badge variant="outline">{post.authorRole}</Badge>
                        <span>in {post.category}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
                <CardDescription>Most discussed topics this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.tag} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{topic.tag}</p>
                          <p className="text-sm text-muted-foreground">{topic.posts} posts</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Explore
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

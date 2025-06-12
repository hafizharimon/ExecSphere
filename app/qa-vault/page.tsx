"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, BookOpen, ThumbsUp, MessageSquare, Clock, Star, TrendingUp, Users, Award } from "lucide-react"

export default function QAVaultPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "leadership", label: "Leadership" },
    { value: "strategy", label: "Strategy" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
    { value: "technology", label: "Technology" },
    { value: "hr", label: "Human Resources" },
    { value: "marketing", label: "Marketing" },
  ]

  const qaItems = [
    {
      id: "1",
      question: "How do you handle difficult board meetings as a CEO?",
      answer:
        "Preparation is key. I always come with clear data, anticipate questions, and maintain transparency about challenges while presenting actionable solutions.",
      author: {
        name: "Sarah Johnson",
        role: "CEO",
        company: "TechCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "leadership",
      tags: ["board-management", "communication", "leadership"],
      likes: 24,
      comments: 8,
      createdAt: "2 days ago",
      featured: true,
    },
    {
      id: "2",
      question: "What's the best approach to digital transformation in traditional industries?",
      answer:
        "Start small with pilot programs, focus on employee training, and ensure you have executive buy-in. Change management is more important than the technology itself.",
      author: {
        name: "Michael Chen",
        role: "CTO",
        company: "InnovateCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "technology",
      tags: ["digital-transformation", "change-management", "strategy"],
      likes: 18,
      comments: 12,
      createdAt: "1 week ago",
      featured: false,
    },
    {
      id: "3",
      question: "How do you maintain company culture during rapid scaling?",
      answer:
        "Document your values early, hire culture ambassadors, and create systems that reinforce your culture at every touchpoint. Regular culture surveys help track progress.",
      author: {
        name: "Emily Rodriguez",
        role: "CHRO",
        company: "GrowthTech",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "hr",
      tags: ["culture", "scaling", "hr-strategy"],
      likes: 31,
      comments: 15,
      createdAt: "3 days ago",
      featured: true,
    },
    {
      id: "4",
      question: "What metrics should CFOs focus on in early-stage companies?",
      answer:
        "Cash runway, burn rate, customer acquisition cost, and lifetime value. Also track unit economics and ensure you have 18+ months of runway at all times.",
      author: {
        name: "David Park",
        role: "CFO",
        company: "StartupFinance",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "finance",
      tags: ["metrics", "startup-finance", "kpis"],
      likes: 22,
      comments: 6,
      createdAt: "5 days ago",
      featured: false,
    },
  ]

  const filteredItems = qaItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "comments":
        return b.comments - a.comments
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Q&A Vault</h1>
          <p className="text-muted-foreground">Discover insights from executive experiences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <BookOpen className="h-3 w-3 mr-1" />
            {qaItems.length} Q&As
          </Badge>
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Expert Answers
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Q&As</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expert Contributors</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Active mentors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Leadership</div>
            <p className="text-xs text-muted-foreground">Category</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">User satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions, answers, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
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
                <SelectItem value="comments">Most Discussed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Q&A Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Q&As</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className={`${item.featured ? "ring-2 ring-blue-200" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {item.featured && (
                        <Badge variant="default" className="bg-blue-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{item.question}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{item.answer}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                        <AvatarFallback>
                          {item.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.author.role} at {item.author.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          {sortedItems
            .filter((item) => item.featured)
            .map((item) => (
              <Card key={item.id} className="ring-2 ring-blue-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="default" className="bg-blue-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">{item.question}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{item.answer}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                          <AvatarFallback>
                            {item.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.author.role} at {item.author.company}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{item.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {sortedItems.slice(0, 3).map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <Badge variant="secondary">New</Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{item.question}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{item.answer}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                        <AvatarFallback>
                          {item.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.author.role} at {item.author.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Clock, MessageSquare, Users, Star, DollarSign, BookOpen } from "lucide-react"

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const sessionCategories = [
    { value: "all", label: "All Categories" },
    { value: "leadership", label: "Leadership" },
    { value: "strategy", label: "Strategy" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
    { value: "technology", label: "Technology" },
    { value: "hr", label: "Human Resources" },
    { value: "marketing", label: "Marketing" },
  ]

  const durationOptions = [
    { value: "all", label: "Any Duration" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
    { value: "90", label: "90 minutes" },
    { value: "120", label: "120 minutes" },
  ]

  const sessions = [
    {
      id: "1",
      title: "Strategic Leadership Masterclass",
      mentor: {
        name: "Dr. Rajiv Sharma",
        role: "Former CEO",
        company: "TechGiant India",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "leadership",
      duration: 60,
      price: 2500,
      rating: 4.9,
      reviews: 124,
      attendees: 450,
      description:
        "Learn proven leadership strategies from a former Fortune 500 CEO. This session covers decision-making frameworks, team building, and crisis management techniques.",
      tags: ["executive-leadership", "decision-making", "team-building"],
      upcoming: "2024-01-20 15:00",
      featured: true,
    },
    {
      id: "2",
      title: "Financial Planning for Executives",
      mentor: {
        name: "Priya Mehta",
        role: "CFO",
        company: "InvestCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "finance",
      duration: 90,
      price: 3000,
      rating: 4.8,
      reviews: 98,
      attendees: 320,
      description:
        "Master the financial aspects of executive decision-making. Learn about capital allocation, financial risk management, and communicating financial strategy to stakeholders.",
      tags: ["financial-strategy", "risk-management", "executive-finance"],
      upcoming: "2024-01-22 10:30",
      featured: false,
    },
    {
      id: "3",
      title: "Digital Transformation Strategy",
      mentor: {
        name: "Vikram Singh",
        role: "CTO",
        company: "InnovateTech",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "technology",
      duration: 60,
      price: 2000,
      rating: 4.7,
      reviews: 86,
      attendees: 280,
      description:
        "Navigate the complexities of digital transformation. Learn how to lead technological change, overcome resistance, and build a digital-first culture.",
      tags: ["digital-transformation", "change-management", "technology-strategy"],
      upcoming: "2024-01-25 14:00",
      featured: true,
    },
    {
      id: "4",
      title: "Operational Excellence Workshop",
      mentor: {
        name: "Ananya Patel",
        role: "COO",
        company: "EfficiencyCorp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "operations",
      duration: 120,
      price: 3500,
      rating: 4.9,
      reviews: 112,
      attendees: 390,
      description:
        "Transform your operations with proven methodologies. This workshop covers process optimization, supply chain management, and operational risk mitigation.",
      tags: ["process-optimization", "supply-chain", "operational-efficiency"],
      upcoming: "2024-01-28 11:00",
      featured: false,
    },
    {
      id: "5",
      title: "Building High-Performance Teams",
      mentor: {
        name: "Sanjay Gupta",
        role: "CHRO",
        company: "TalentFirst",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "hr",
      duration: 45,
      price: 1800,
      rating: 4.8,
      reviews: 76,
      attendees: 240,
      description:
        "Learn strategies for recruiting, developing, and retaining top talent. This session covers team dynamics, performance management, and building a positive culture.",
      tags: ["talent-management", "team-building", "culture"],
      upcoming: "2024-01-30 16:00",
      featured: false,
    },
  ]

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || session.category === selectedCategory
    const matchesDuration = selectedDuration === "all" || session.duration.toString() === selectedDuration
    return matchesSearch && matchesCategory && matchesDuration
  })

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.attendees - a.attendees
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Executive Sessions</h1>
          <p className="text-muted-foreground">Discover and book mentoring sessions with top executives</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Calendar className="h-3 w-3 mr-1" />
            {sessions.length} Available
          </Badge>
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Expert-Led
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125+</div>
            <p className="text-xs text-muted-foreground">Available sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expert Mentors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45+</div>
            <p className="text-xs text-muted-foreground">Industry leaders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">From 2,500+ reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">Satisfaction rate</p>
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
                placeholder="Search sessions, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {sessionCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSessions.map((session) => (
              <Card key={session.id} className={`overflow-hidden ${session.featured ? "ring-2 ring-blue-200" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      {session.featured && (
                        <Badge variant="default" className="bg-blue-500 mb-2">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration} minutes
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-base">
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {session.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.mentor.avatar || "/placeholder.svg"} alt={session.mentor.name} />
                      <AvatarFallback>
                        {session.mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{session.mentor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.mentor.role} at {session.mentor.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {session.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{session.rating}</span>
                      <span className="text-muted-foreground">({session.reviews})</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{session.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {session.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{session.attendees}+ attended</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(session.upcoming).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button className="w-full">Book Session</Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSessions
              .filter((session) => session.featured)
              .map((session) => (
                <Card key={session.id} className="overflow-hidden ring-2 ring-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="default" className="bg-blue-500 mb-2">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.duration} minutes
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        {session.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.mentor.avatar || "/placeholder.svg"} alt={session.mentor.name} />
                        <AvatarFallback>
                          {session.mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{session.mentor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.mentor.role} at {session.mentor.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {session.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{session.rating}</span>
                        <span className="text-muted-foreground">({session.reviews})</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{session.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {session.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{session.attendees}+ attended</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(session.upcoming).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="w-full">Book Session</Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSessions.slice(0, 3).map((session) => (
              <Card key={session.id} className={`overflow-hidden ${session.featured ? "ring-2 ring-blue-200" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        Upcoming
                      </Badge>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration} minutes
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-base">
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {session.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.mentor.avatar || "/placeholder.svg"} alt={session.mentor.name} />
                      <AvatarFallback>
                        {session.mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{session.mentor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.mentor.role} at {session.mentor.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {session.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{session.rating}</span>
                      <span className="text-muted-foreground">({session.reviews})</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{session.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {session.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{session.attendees}+ attended</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(session.upcoming).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button className="w-full">Book Session</Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSessions
              .filter((_, index) => index % 2 === 0)
              .map((session) => (
                <Card key={session.id} className={`overflow-hidden ${session.featured ? "ring-2 ring-blue-200" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="bg-purple-500 text-white mb-2">
                          <Star className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.duration} minutes
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        {session.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.mentor.avatar || "/placeholder.svg"} alt={session.mentor.name} />
                        <AvatarFallback>
                          {session.mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{session.mentor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.mentor.role} at {session.mentor.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {session.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{session.rating}</span>
                        <span className="text-muted-foreground">({session.reviews})</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{session.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {session.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{session.attendees}+ attended</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(session.upcoming).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="w-full">Book Session</Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

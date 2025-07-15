"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MentorCard } from "@/components/mentor-card"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar } from "@/components/filter-sidebar"
import { Navigation } from "@/components/navigation"
import { Grid, List, Users, Star, TrendingUp, Filter } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  industry: string
  location: string
  experience: number
  rating: number
  reviewCount: number
  hourlyRate: number
  availability: string
  specialties: string[]
  avatar?: string
  verified: boolean
  responseTime: string
  sessionsCompleted: number
}

interface FilterOptions {
  industries: string[]
  locations: string[]
  experience: [number, number]
  rating: number
  availability: string[]
  priceRange: [number, number]
  specialties: string[]
}

export default function MentorBoardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState<FilterOptions>({
    industries: [],
    locations: [],
    experience: [0, 30],
    rating: 0,
    availability: [],
    priceRange: [0, 10000],
    specialties: [],
  })

  // Mock mentor data with realistic Indian executives
  const mockMentors: Mentor[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      title: "CEO",
      company: "TechCorp Solutions",
      industry: "Technology",
      location: "Mumbai",
      experience: 15,
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 5000,
      availability: "Available",
      specialties: ["Leadership", "Strategy", "Digital Transformation"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 2 hours",
      sessionsCompleted: 245,
    },
    {
      id: "2",
      name: "Dr. Priya Sharma",
      title: "CTO",
      company: "InnovateTech",
      industry: "Technology",
      location: "Bangalore",
      experience: 12,
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 4500,
      availability: "Available",
      specialties: ["Technology", "Innovation", "Product Management"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 1 hour",
      sessionsCompleted: 178,
    },
    {
      id: "3",
      name: "Amit Patel",
      title: "CFO",
      company: "FinanceFirst",
      industry: "Finance",
      location: "Delhi",
      experience: 18,
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 4000,
      availability: "Busy",
      specialties: ["Finance", "Strategy", "Business Development"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 4 hours",
      sessionsCompleted: 312,
    },
    {
      id: "4",
      name: "Sunita Reddy",
      title: "CMO",
      company: "BrandBuilders",
      industry: "Marketing",
      location: "Hyderabad",
      experience: 10,
      rating: 4.6,
      reviewCount: 73,
      hourlyRate: 3500,
      availability: "Available Soon",
      specialties: ["Marketing", "Brand Strategy", "Digital Marketing"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 3 hours",
      sessionsCompleted: 134,
    },
    {
      id: "5",
      name: "Vikram Singh",
      title: "COO",
      company: "OperationsExcel",
      industry: "Operations",
      location: "Chennai",
      experience: 14,
      rating: 4.5,
      reviewCount: 92,
      hourlyRate: 3800,
      availability: "By Appointment",
      specialties: ["Operations", "Process Improvement", "Change Management"],
      avatar: "/placeholder-user.jpg",
      verified: false,
      responseTime: "Within 6 hours",
      sessionsCompleted: 198,
    },
    {
      id: "6",
      name: "Meera Joshi",
      title: "CHRO",
      company: "PeopleFirst",
      industry: "HR",
      location: "Pune",
      experience: 11,
      rating: 4.8,
      reviewCount: 64,
      hourlyRate: 3200,
      availability: "Available",
      specialties: ["HR", "Leadership Development", "Organizational Culture"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 2 hours",
      sessionsCompleted: 156,
    },
    {
      id: "7",
      name: "Arjun Kapoor",
      title: "CPO",
      company: "ProductInnovate",
      industry: "Technology",
      location: "Gurgaon",
      experience: 9,
      rating: 4.4,
      reviewCount: 45,
      hourlyRate: 4200,
      availability: "Available",
      specialties: ["Product Management", "Innovation", "User Experience"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 1 hour",
      sessionsCompleted: 87,
    },
    {
      id: "8",
      name: "Kavya Nair",
      title: "CTO",
      company: "CloudTech",
      industry: "Technology",
      location: "Kochi",
      experience: 13,
      rating: 4.9,
      reviewCount: 118,
      hourlyRate: 4800,
      availability: "Available Soon",
      specialties: ["Cloud Computing", "Architecture", "Team Leadership"],
      avatar: "/placeholder-user.jpg",
      verified: true,
      responseTime: "Within 3 hours",
      sessionsCompleted: 203,
    },
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMentors(mockMentors)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter and sort mentors
  const filteredAndSortedMentors = useMemo(() => {
    let filtered = mentors

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply filters
    if (filters.industries.length > 0) {
      filtered = filtered.filter((mentor) => filters.industries.includes(mentor.industry))
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((mentor) => filters.locations.includes(mentor.location))
    }

    if (filters.availability.length > 0) {
      filtered = filtered.filter((mentor) => filters.availability.includes(mentor.availability))
    }

    if (filters.specialties.length > 0) {
      filtered = filtered.filter((mentor) => mentor.specialties.some((s) => filters.specialties.includes(s)))
    }

    // Apply experience filter
    filtered = filtered.filter(
      (mentor) => mentor.experience >= filters.experience[0] && mentor.experience <= filters.experience[1],
    )

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((mentor) => mentor.rating >= filters.rating)
    }

    // Apply price range filter
    filtered = filtered.filter(
      (mentor) => mentor.hourlyRate >= filters.priceRange[0] && mentor.hourlyRate <= filters.priceRange[1],
    )

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "experience":
          return b.experience - a.experience
        case "price-low":
          return a.hourlyRate - b.hourlyRate
        case "price-high":
          return b.hourlyRate - a.hourlyRate
        case "sessions":
          return b.sessionsCompleted - a.sessionsCompleted
        default:
          return 0
      }
    })

    return filtered
  }, [mentors, searchQuery, filters, sortBy])

  const handleBookSession = (mentorId: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    router.push(`/mentor-board/${mentorId}/request`)
  }

  const handleViewProfile = (mentorId: string) => {
    router.push(`/mentor-board/${mentorId}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mentor Board</h1>
          <p className="text-muted-foreground">
            Connect with experienced C-level executives for personalized mentorship
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{mentors.length}</p>
                  <p className="text-sm text-muted-foreground">Total Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">1.2K+</p>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500">
                  {mentors.filter((m) => m.availability === "Available").length} Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search mentors by name, title, company, or specialty..."
                  onSearch={handleSearch}
                />
              </div>

              <div className="flex gap-2">
                <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="sessions">Most Sessions</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedMentors.length} of {mentors.length} mentors
              </p>
            </div>

            {/* Mentors Grid/List */}
            {filteredAndSortedMentors.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No mentors found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setFilters({
                        industries: [],
                        locations: [],
                        experience: [0, 30],
                        rating: 0,
                        availability: [],
                        priceRange: [0, 10000],
                        specialties: [],
                      })
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
                {filteredAndSortedMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onBookSession={handleBookSession}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

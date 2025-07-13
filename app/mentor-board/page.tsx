"use client"

import { useState, useEffect, useMemo } from "react"
import { MentorCard, type Mentor } from "@/components/mentor-card"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar, type FilterOptions } from "@/components/filter-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for Indian executives
const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Rajesh Sharma",
    title: "Chief Executive Officer",
    company: "TechMahindra",
    avatar: "/placeholder-user.jpg",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 5000,
    currency: "₹",
    location: "Mumbai",
    expertise: ["Leadership", "Strategy", "Digital Transformation", "Technology"],
    experience: 15,
    isOnline: true,
    isVerified: true,
    responseTime: "< 2 hours",
    languages: ["English", "Hindi"],
    sessionCount: 234,
    bio: "Former CEO of multiple Fortune 500 companies with expertise in digital transformation and strategic leadership.",
  },
  {
    id: "2",
    name: "Priya Nair",
    title: "Chief Marketing Officer",
    company: "Flipkart",
    avatar: "/placeholder-user.jpg",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 4500,
    currency: "₹",
    location: "Bangalore",
    expertise: ["Marketing", "Brand Strategy", "Digital Marketing", "E-commerce"],
    experience: 12,
    isOnline: false,
    isVerified: true,
    responseTime: "< 4 hours",
    languages: ["English", "Tamil"],
    sessionCount: 156,
    bio: "Marketing leader with 12+ years of experience in building global brands and driving customer acquisition.",
  },
  {
    id: "3",
    name: "Amit Patel",
    title: "Chief Financial Officer",
    company: "Reliance Industries",
    avatar: "/placeholder-user.jpg",
    rating: 4.7,
    reviewCount: 203,
    hourlyRate: 6000,
    currency: "₹",
    location: "Mumbai",
    expertise: ["Finance", "Investment", "Risk Management", "Corporate Strategy"],
    experience: 18,
    isOnline: true,
    isVerified: true,
    responseTime: "< 1 hour",
    languages: ["English", "Hindi", "Gujarati"],
    sessionCount: 312,
    bio: "Senior finance executive with extensive experience in corporate finance, M&A, and strategic planning.",
  },
  {
    id: "4",
    name: "Sunita Reddy",
    title: "Chief Technology Officer",
    company: "Infosys",
    avatar: "/placeholder-user.jpg",
    rating: 4.9,
    reviewCount: 145,
    hourlyRate: 5500,
    currency: "₹",
    location: "Hyderabad",
    expertise: ["Technology", "AI/ML", "Cloud Computing", "Innovation"],
    experience: 14,
    isOnline: true,
    isVerified: true,
    responseTime: "< 3 hours",
    languages: ["English", "Telugu"],
    sessionCount: 198,
    bio: "Technology leader driving digital innovation and AI transformation across enterprise solutions.",
  },
  {
    id: "5",
    name: "Vikram Singh",
    title: "Chief Operations Officer",
    company: "Tata Consultancy Services",
    avatar: "/placeholder-user.jpg",
    rating: 4.6,
    reviewCount: 167,
    hourlyRate: 4800,
    currency: "₹",
    location: "Delhi",
    expertise: ["Operations", "Process Optimization", "Supply Chain", "Quality Management"],
    experience: 16,
    isOnline: false,
    isVerified: true,
    responseTime: "< 6 hours",
    languages: ["English", "Hindi"],
    sessionCount: 278,
    bio: "Operations expert with proven track record in scaling global operations and process excellence.",
  },
  {
    id: "6",
    name: "Kavitha Krishnan",
    title: "Chief Human Resources Officer",
    company: "Wipro",
    avatar: "/placeholder-user.jpg",
    rating: 4.8,
    reviewCount: 134,
    hourlyRate: 4200,
    currency: "₹",
    location: "Chennai",
    expertise: ["HR Strategy", "Talent Management", "Organizational Development", "Leadership"],
    experience: 13,
    isOnline: true,
    isVerified: true,
    responseTime: "< 2 hours",
    languages: ["English", "Tamil"],
    sessionCount: 189,
    bio: "HR leader specializing in talent strategy, culture transformation, and leadership development.",
  },
]

export default function MentorBoardPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    expertise: [],
    experience: [0, 30],
    hourlyRate: [0, 10000],
    location: [],
    languages: [],
    rating: 0,
    availability: [],
    verified: false,
  })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMentors(mockMentors)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter and search mentors
  const filteredMentors = useMemo(() => {
    let filtered = mentors

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(query) ||
          mentor.title.toLowerCase().includes(query) ||
          mentor.company.toLowerCase().includes(query) ||
          mentor.expertise.some((skill) => skill.toLowerCase().includes(query)),
      )
    }

    // Apply filters
    if (filters.expertise.length > 0) {
      filtered = filtered.filter((mentor) => filters.expertise.some((skill) => mentor.expertise.includes(skill)))
    }

    if (filters.location.length > 0) {
      filtered = filtered.filter((mentor) => filters.location.includes(mentor.location))
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter((mentor) => filters.languages.some((lang) => mentor.languages.includes(lang)))
    }

    if (filters.verified) {
      filtered = filtered.filter((mentor) => mentor.isVerified)
    }

    // Experience range
    filtered = filtered.filter(
      (mentor) => mentor.experience >= filters.experience[0] && mentor.experience <= filters.experience[1],
    )

    // Hourly rate range
    filtered = filtered.filter(
      (mentor) => mentor.hourlyRate >= filters.hourlyRate[0] && mentor.hourlyRate <= filters.hourlyRate[1],
    )

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((mentor) => mentor.rating >= filters.rating)
    }

    // Sort mentors
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case "price-high":
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
      case "experience":
        filtered.sort((a, b) => b.experience - a.experience)
        break
      case "sessions":
        filtered.sort((a, b) => b.sessionCount - a.sessionCount)
        break
      default:
        break
    }

    return filtered
  }, [mentors, searchQuery, filters, sortBy])

  const handleViewProfile = (mentorId: string) => {
    console.log("View profile:", mentorId)
    // Navigate to mentor profile page
  }

  const handleBookSession = (mentorId: string) => {
    console.log("Book session:", mentorId)
    // Navigate to booking page
  }

  const handleMessage = (mentorId: string) => {
    console.log("Message mentor:", mentorId)
    // Open messaging interface
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="flex gap-6">
          <div className="w-80">
            <Skeleton className="h-96 w-full" />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Mentor</h1>
        <p className="text-muted-foreground">Connect with experienced executives and industry leaders</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search mentors by name, company, or expertise..."
              onSearch={setSearchQuery}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="sessions">Most Sessions</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        )}

        {/* Mentors Grid/List */}
        <div className="flex-1">
          {filteredMentors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search criteria or filters to find more mentors.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4")}
            >
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onViewProfile={handleViewProfile}
                  onBookSession={handleBookSession}
                  onMessage={handleMessage}
                  className={viewMode === "list" ? "max-w-none" : ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

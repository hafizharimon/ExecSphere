"use client"

import { useState, useEffect } from "react"
import { MentorCard } from "@/components/mentor-card"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar } from "@/components/filter-sidebar"
import { useSearchParams, useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsContext } from "@/components/analytics-provider"

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  avatar?: string
  rating: number
  reviewCount: number
  hourlyRate: number
  location: string
  expertise: string[]
  experience: number
  totalMentees: number
  responseTime: string
  isVerified: boolean
  isOnline: boolean
  description: string
}

interface FilterOptions {
  expertise: string[]
  experience: [number, number]
  hourlyRate: [number, number]
  rating: number
  location: string[]
  availability: string[]
  verified: boolean
}

const MENTORS: Mentor[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    title: "Chief Technology Officer",
    company: "TechCorp India",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 5000,
    location: "Mumbai",
    expertise: ["Digital Transformation", "Technology", "Strategy & Leadership"],
    experience: 15,
    totalMentees: 45,
    responseTime: "Within 2 hours",
    isVerified: true,
    isOnline: true,
    description: "Experienced CTO with expertise in digital transformation and technology strategy.",
  },
  {
    id: "2",
    name: "Priya Sharma",
    title: "Chief Marketing Officer",
    company: "BrandForce Solutions",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 4500,
    location: "Delhi",
    expertise: ["Marketing & Sales", "Digital Transformation", "Strategy & Leadership"],
    experience: 12,
    totalMentees: 38,
    responseTime: "Within 4 hours",
    isVerified: true,
    isOnline: false,
    description: "CMO specializing in brand strategy and digital marketing transformation.",
  },
  {
    id: "3",
    name: "Amit Patel",
    title: "Chief Financial Officer",
    company: "FinanceFirst Ltd",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 6000,
    location: "Bangalore",
    expertise: ["Finance & Investment", "Strategy & Leadership", "Operations"],
    experience: 18,
    totalMentees: 62,
    responseTime: "Within 6 hours",
    isVerified: true,
    isOnline: true,
    description: "CFO with extensive experience in financial strategy and investment planning.",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    title: "Chief Product Officer",
    company: "InnovateTech",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.6,
    reviewCount: 94,
    hourlyRate: 4800,
    location: "Hyderabad",
    expertise: ["Product Management", "Technology", "Strategy & Leadership"],
    experience: 10,
    totalMentees: 29,
    responseTime: "Within 3 hours",
    isVerified: true,
    isOnline: true,
    description: "CPO focused on product strategy and innovation in tech startups.",
  },
  {
    id: "5",
    name: "Vikram Singh",
    title: "Chief Executive Officer",
    company: "GrowthVentures",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 8000,
    location: "Mumbai",
    expertise: ["Strategy & Leadership", "Entrepreneurship", "Business Development"],
    experience: 20,
    totalMentees: 87,
    responseTime: "Within 1 hour",
    isVerified: true,
    isOnline: false,
    description: "Serial entrepreneur and CEO with expertise in scaling businesses.",
  },
  {
    id: "6",
    name: "Kavya Nair",
    title: "Chief Human Resources Officer",
    company: "PeopleFirst Corp",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.5,
    reviewCount: 78,
    hourlyRate: 3500,
    location: "Chennai",
    expertise: ["Human Resources", "Strategy & Leadership", "Operations"],
    experience: 14,
    totalMentees: 41,
    responseTime: "Within 5 hours",
    isVerified: true,
    isOnline: true,
    description: "CHRO specializing in organizational development and talent strategy.",
  },
]

const defaultFilters: FilterOptions = {
  expertise: [],
  experience: [0, 30],
  hourlyRate: [500, 10000],
  rating: 0,
  location: [],
  availability: [],
  verified: false,
}

const MentorBoard = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "")
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()

  const { trackSearch, trackProfileView } = useAnalyticsContext()

  useEffect(() => {
    if (searchTerm || filters.expertise.length > 0 || filters.rating > 0) {
      trackSearch("mentor", searchTerm, mentors.length)
    }
  }, [searchTerm, filters, mentors.length, trackSearch])

  useEffect(() => {
    // Simulate fetching mentors from an API
    setTimeout(() => {
      setMentors(MENTORS)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm)
    } else {
      params.delete("search")
    }

    router.push(`/mentor-board?${params.toString()}`)
  }, [debouncedSearchTerm, router])

  const filteredMentors = mentors.filter((mentor) => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTermLower) ||
      mentor.title.toLowerCase().includes(searchTermLower) ||
      mentor.company.toLowerCase().includes(searchTermLower) ||
      mentor.expertise.some((exp) => exp.toLowerCase().includes(searchTermLower))

    const matchesExpertise =
      filters.expertise.length === 0 || filters.expertise.some((exp) => mentor.expertise.includes(exp))

    const matchesExperience = mentor.experience >= filters.experience[0] && mentor.experience <= filters.experience[1]

    const matchesHourlyRate = mentor.hourlyRate >= filters.hourlyRate[0] && mentor.hourlyRate <= filters.hourlyRate[1]

    const matchesRating = mentor.rating >= filters.rating

    const matchesLocation = filters.location.length === 0 || filters.location.includes(mentor.location)

    const matchesVerified = !filters.verified || mentor.isVerified

    return (
      matchesSearch &&
      matchesExpertise &&
      matchesExperience &&
      matchesHourlyRate &&
      matchesRating &&
      matchesLocation &&
      matchesVerified
    )
  })

  const handleMentorClick = (mentorId: string) => {
    trackProfileView(mentorId)
    // Navigate to mentor profile
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Mentor</h1>
        <p className="text-muted-foreground">
          Connect with experienced executives and industry leaders to accelerate your career growth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <SearchBar
            placeholder="Search mentors by name, title, company, or expertise..."
            onSearch={setSearchTerm}
            className="w-full"
          />

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filteredMentors.length} mentors found`}
            </p>
          </div>

          {/* Mentors Grid */}
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters to find more mentors.
                  </p>
                  <button onClick={handleClearFilters} className="text-primary hover:underline">
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorBoard

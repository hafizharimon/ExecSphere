"use client"

import { useState, useEffect } from "react"
import { MentorCard } from "@/components/mentor-card"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar } from "@/components/filter-sidebar"
import { useSearchParams, useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsContext } from "@/components/analytics-provider"

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  tags: string[]
  rating: number
  image: string
  description: string
}

const MENTORS: Mentor[] = [
  {
    id: "1",
    name: "John Doe",
    title: "Software Engineer",
    company: "Google",
    tags: ["React", "JavaScript", "Frontend"],
    rating: 4.5,
    image: "/placeholder-avatar.jpg",
    description: "Experienced software engineer with a passion for building web applications.",
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "Data Scientist",
    company: "Microsoft",
    tags: ["Python", "Machine Learning", "Data Analysis"],
    rating: 4.8,
    image: "/placeholder-avatar.jpg",
    description: "Data scientist specializing in machine learning and data analysis.",
  },
  {
    id: "3",
    name: "Peter Jones",
    title: "Product Manager",
    company: "Amazon",
    tags: ["Product Management", "Agile", "Strategy"],
    rating: 4.2,
    image: "/placeholder-avatar.jpg",
    description: "Product manager with a focus on agile development and product strategy.",
  },
  {
    id: "4",
    name: "Alice Brown",
    title: "UX Designer",
    company: "Facebook",
    tags: ["UX Design", "UI Design", "User Research"],
    rating: 4.7,
    image: "/placeholder-avatar.jpg",
    description: "UX designer passionate about creating user-centered designs.",
  },
  {
    id: "5",
    name: "Bob Williams",
    title: "DevOps Engineer",
    company: "Netflix",
    tags: ["DevOps", "Cloud Computing", "Automation"],
    rating: 4.9,
    image: "/placeholder-avatar.jpg",
    description: "DevOps engineer specializing in cloud computing and automation.",
  },
]

const MentorBoard = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "")
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.getAll("tags") || [])
  const [filters, setFilters] = useState<{ minRating: number }>({
    minRating: Number(searchParams.get("minRating")) || 0,
  })
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()

  const { trackSearch, trackProfileView } = useAnalyticsContext()

  useEffect(() => {
    if (searchTerm || selectedTags.length > 0 || filters.minRating > 0) {
      trackSearch("mentor", searchTerm, mentors.length)
    }
  }, [searchTerm, selectedTags, filters, mentors.length, trackSearch])

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

    if (selectedTags.length > 0) {
      selectedTags.forEach((tag) => params.append("tags", tag))
    } else {
      params.delete("tags")
    }

    if (filters.minRating > 0) {
      params.set("minRating", String(filters.minRating))
    } else {
      params.delete("minRating")
    }

    router.push(`/mentor-board?${params.toString()}`)
  }, [debouncedSearchTerm, selectedTags, filters, router])

  const filteredMentors = mentors.filter((mentor) => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTermLower) ||
      mentor.title.toLowerCase().includes(searchTermLower) ||
      mentor.company.toLowerCase().includes(searchTermLower)

    const matchesTags = selectedTags.every((tag) => mentor.tags.includes(tag))

    const matchesRating = mentor.rating >= filters.minRating

    return matchesSearch && matchesTags && matchesRating
  })

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleMentorClick = (mentorId: string) => {
    trackProfileView(mentorId)
    // Navigate to mentor profile
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Find a Mentor</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-1">
          <FilterSidebar onFilterChange={setFilters} />
        </div>
        <div className="md:col-span-3">
          <SearchBar onSearch={setSearchTerm} />
          <div className="mt-5">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} onClick={() => handleMentorClick(mentor.id)} />
                ))}
              </div>
            ) : (
              <p>No mentors found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorBoard

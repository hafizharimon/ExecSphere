"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, MapPin, Users, Search } from "lucide-react"
import Link from "next/link"
import { useAnalyticsContext } from "@/components/analytics-provider"

const events = [
  {
    id: 1,
    title: "Future of AI in Business Strategy",
    description:
      "An exclusive webinar exploring how artificial intelligence is reshaping executive decision-making and strategic planning.",
    date: "2024-06-20",
    time: "14:00",
    location: "Online Webinar",
    type: "Webinar",
    attendees: 45,
    maxAttendees: 100,
    industry: "Technology",
    isRegistered: false,
  },
  {
    id: 2,
    title: "Global Economic Outlook Roundtable",
    description: "A closed-door discussion on 2024 economic forecasts and their implications for business leaders.",
    date: "2024-07-05",
    time: "10:00",
    location: "London, UK (Hybrid)",
    type: "Roundtable",
    attendees: 18,
    maxAttendees: 25,
    industry: "Finance",
    isRegistered: true,
  },
  {
    id: 3,
    title: "Sustainable Leadership Summit",
    description: "Exploring sustainable business practices and ESG strategies for modern executives.",
    date: "2024-07-15",
    time: "09:00",
    location: "New York, NY",
    type: "Summit",
    attendees: 67,
    maxAttendees: 150,
    industry: "All",
    isRegistered: false,
  },
  {
    id: 4,
    title: "Digital Transformation Masterclass",
    description: "Learn from successful digital transformation case studies and best practices.",
    date: "2024-08-02",
    time: "16:00",
    location: "Online Workshop",
    type: "Workshop",
    attendees: 32,
    maxAttendees: 50,
    industry: "Technology",
    isRegistered: false,
  },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterIndustry, setFilterIndustry] = useState("all")

  const { trackEventParticipation } = useAnalyticsContext()

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || event.type.toLowerCase() === filterType.toLowerCase()
    const matchesIndustry = filterIndustry === "all" || event.industry.toLowerCase() === filterIndustry.toLowerCase()

    return matchesSearch && matchesType && matchesIndustry
  })

  const handleEventRegistration = (eventId: string, eventType: string) => {
    trackEventParticipation(eventId, eventType, "register")
    // Handle actual registration logic here
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Exclusive Events</h1>
            <p className="text-muted-foreground">Connect with fellow executives at premium events</p>
          </div>
          <Button asChild>
            <Link href="/events/create">Create Event</Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="roundtable">Roundtable</SelectItem>
                  <SelectItem value="summit">Summit</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary">{event.type}</Badge>
                  {event.isRegistered && <Badge>Registered</Badge>}
                </div>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-3">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {event.isRegistered ? (
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={() => handleEventRegistration(event.id.toString(), event.type)}>
                    Register
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}

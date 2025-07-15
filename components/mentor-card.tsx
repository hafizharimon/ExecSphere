"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, DollarSign, Users, Award } from "lucide-react"

interface MentorCardProps {
  mentor: {
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
  onBookSession?: (mentorId: string) => void
  onViewProfile?: (mentorId: string) => void
}

export function MentorCard({ mentor, onBookSession, onViewProfile }: MentorCardProps) {
  const handleBookSession = () => {
    onBookSession?.(mentor.id)
  }

  const handleViewProfile = () => {
    onViewProfile?.(mentor.id)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
              <AvatarFallback className="text-lg">
                {mentor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {mentor.verified && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg truncate">{mentor.name}</CardTitle>
              {mentor.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>

            <CardDescription className="text-sm mb-2">
              {mentor.title} at {mentor.company}
            </CardDescription>

            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(mentor.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{mentor.rating}</span>
              <span className="text-sm text-muted-foreground">({mentor.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.experience}+ years</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>₹{mentor.hourlyRate}/hour</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.sessionsCompleted} sessions</span>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <p className="text-sm font-medium mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {mentor.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Availability:</span>
          <Badge variant={mentor.availability === "Available" ? "default" : "secondary"}>{mentor.availability}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Response time:</span>
          <span className="font-medium">{mentor.responseTime}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handleViewProfile} className="flex-1 bg-transparent">
            View Profile
          </Button>
          <Button onClick={handleBookSession} className="flex-1">
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

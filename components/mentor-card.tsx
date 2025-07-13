"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

interface MentorCardProps {
  mentor: {
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
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
              <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
            </Avatar>
            {mentor.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
              {mentor.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
            <p className="text-sm text-muted-foreground truncate">{mentor.company}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{mentor.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">({mentor.reviewCount} reviews)</span>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{mentor.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.responseTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.totalMentees} mentees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">₹{mentor.hourlyRate}/hr</span>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Expertise:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertise.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link href={`/mentor-board/${mentor.id}`}>View Profile</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/mentor-board/${mentor.id}/request`}>Book Session</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

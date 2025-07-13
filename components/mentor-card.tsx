"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Video, MessageCircle, Verified } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Mentor {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  rating: number
  reviewCount: number
  hourlyRate: number
  currency: string
  location: string
  expertise: string[]
  experience: number
  isOnline: boolean
  isVerified: boolean
  responseTime: string
  languages: string[]
  sessionCount: number
  bio: string
}

interface MentorCardProps {
  mentor: Mentor
  onViewProfile?: (mentorId: string) => void
  onBookSession?: (mentorId: string) => void
  onMessage?: (mentorId: string) => void
  className?: string
}

export function MentorCard({ mentor, onViewProfile, onBookSession, onMessage, className }: MentorCardProps) {
  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200 cursor-pointer", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
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
            {mentor.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                {mentor.name}
              </h3>
              {mentor.isVerified && <Verified className="h-4 w-4 text-blue-500 flex-shrink-0" />}
            </div>

            <p className="text-sm text-muted-foreground mb-1 truncate">{mentor.title}</p>

            <p className="text-sm font-medium text-gray-700 truncate">{mentor.company}</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {mentor.currency}
              {mentor.hourlyRate}
            </div>
            <div className="text-xs text-muted-foreground">per hour</div>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{mentor.rating}</span>
            <span className="text-muted-foreground">({mentor.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{mentor.location}</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{mentor.responseTime}</span>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
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

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mentor.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-semibold">{mentor.experience}</div>
            <div className="text-xs text-muted-foreground">Years Exp.</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{mentor.sessionCount}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onViewProfile?.(mentor.id)}
          >
            View Profile
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onBookSession?.(mentor.id)}>
            <Video className="h-3 w-3 mr-1" />
            Book Session
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMessage?.(mentor.id)}>
            <MessageCircle className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

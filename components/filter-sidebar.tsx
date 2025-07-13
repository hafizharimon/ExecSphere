"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOptions {
  expertise: string[]
  experience: [number, number]
  hourlyRate: [number, number]
  location: string[]
  languages: string[]
  rating: number
  availability: string[]
  verified: boolean
}

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  className?: string
  availableOptions?: {
    expertise: string[]
    locations: string[]
    languages: string[]
    availability: string[]
  }
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  className,
  availableOptions = {
    expertise: [
      "Leadership",
      "Strategy",
      "Marketing",
      "Sales",
      "Finance",
      "Operations",
      "Technology",
      "HR",
      "Product Management",
      "Business Development",
      "Consulting",
      "Entrepreneurship",
    ],
    locations: [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Kolkata",
      "Ahmedabad",
      "Jaipur",
      "Remote",
    ],
    languages: ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Gujarati", "Bengali"],
    availability: ["Morning", "Afternoon", "Evening", "Weekend"],
  },
}: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleExpertiseChange = (expertise: string, checked: boolean) => {
    const newExpertise = checked ? [...filters.expertise, expertise] : filters.expertise.filter((e) => e !== expertise)

    onFiltersChange({ ...filters, expertise: newExpertise })
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocation = checked ? [...filters.location, location] : filters.location.filter((l) => l !== location)

    onFiltersChange({ ...filters, location: newLocation })
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked ? [...filters.languages, language] : filters.languages.filter((l) => l !== language)

    onFiltersChange({ ...filters, languages: newLanguages })
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, availability]
      : filters.availability.filter((a) => a !== availability)

    onFiltersChange({ ...filters, availability: newAvailability })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      expertise: [],
      experience: [0, 30],
      hourlyRate: [0, 10000],
      location: [],
      languages: [],
      rating: 0,
      availability: [],
      verified: false,
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.expertise.length > 0) count++
    if (filters.location.length > 0) count++
    if (filters.languages.length > 0) count++
    if (filters.availability.length > 0) count++
    if (filters.experience[0] > 0 || filters.experience[1] < 30) count++
    if (filters.hourlyRate[0] > 0 || filters.hourlyRate[1] < 10000) count++
    if (filters.rating > 0) count++
    if (filters.verified) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
              <X className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-45")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-6">
          {/* Expertise */}
          <div>
            <h3 className="font-medium mb-3">Expertise</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableOptions.expertise.map((expertise) => (
                <div key={expertise} className="flex items-center space-x-2">
                  <Checkbox
                    id={`expertise-${expertise}`}
                    checked={filters.expertise.includes(expertise)}
                    onCheckedChange={(checked) => handleExpertiseChange(expertise, checked as boolean)}
                  />
                  <label
                    htmlFor={`expertise-${expertise}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {expertise}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Experience Range */}
          <div>
            <h3 className="font-medium mb-3">
              Experience: {filters.experience[0]} - {filters.experience[1]} years
            </h3>
            <Slider
              value={filters.experience}
              onValueChange={(value) => onFiltersChange({ ...filters, experience: value as [number, number] })}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Hourly Rate Range */}
          <div>
            <h3 className="font-medium mb-3">
              Hourly Rate: ₹{filters.hourlyRate[0]} - ₹{filters.hourlyRate[1]}
            </h3>
            <Slider
              value={filters.hourlyRate}
              onValueChange={(value) => onFiltersChange({ ...filters, hourlyRate: value as [number, number] })}
              max={10000}
              min={0}
              step={500}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h3 className="font-medium mb-3">Location</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableOptions.locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.location.includes(location)}
                    onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                  />
                  <label
                    htmlFor={`location-${location}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Languages */}
          <div>
            <h3 className="font-medium mb-3">Languages</h3>
            <div className="space-y-2">
              {availableOptions.languages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={filters.languages.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                  />
                  <label
                    htmlFor={`language-${language}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Minimum Rating */}
          <div>
            <h3 className="font-medium mb-3">Minimum Rating: {filters.rating} stars</h3>
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => onFiltersChange({ ...filters, rating: value[0] })}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Availability */}
          <div>
            <h3 className="font-medium mb-3">Availability</h3>
            <div className="space-y-2">
              {availableOptions.availability.map((availability) => (
                <div key={availability} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${availability}`}
                    checked={filters.availability.includes(availability)}
                    onCheckedChange={(checked) => handleAvailabilityChange(availability, checked as boolean)}
                  />
                  <label
                    htmlFor={`availability-${availability}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {availability}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Verified Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={filters.verified}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, verified: checked as boolean })}
            />
            <label
              htmlFor="verified"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Verified mentors only
            </label>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

interface FilterOptions {
  industries: string[]
  locations: string[]
  experience: [number, number]
  rating: number
  availability: string[]
  priceRange: [number, number]
  specialties: string[]
}

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  className?: string
}

export function FilterSidebar({ filters, onFiltersChange, className = "" }: FilterSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Manufacturing",
    "Consulting",
    "Marketing",
    "Operations",
    "HR",
    "Legal",
  ]

  const locationOptions = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Gurgaon",
    "Noida",
  ]

  const availabilityOptions = ["Available", "Busy", "Available Soon", "By Appointment"]

  const specialtyOptions = [
    "Leadership",
    "Strategy",
    "Digital Transformation",
    "Operations",
    "Finance",
    "Marketing",
    "HR",
    "Technology",
    "Innovation",
    "Change Management",
    "Business Development",
    "Product Management",
  ]

  const handleIndustryChange = (industry: string, checked: boolean) => {
    const newIndustries = checked ? [...filters.industries, industry] : filters.industries.filter((i) => i !== industry)

    onFiltersChange({ ...filters, industries: newIndustries })
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked ? [...filters.locations, location] : filters.locations.filter((l) => l !== location)

    onFiltersChange({ ...filters, locations: newLocations })
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, availability]
      : filters.availability.filter((a) => a !== availability)

    onFiltersChange({ ...filters, availability: newAvailability })
  }

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const newSpecialties = checked
      ? [...filters.specialties, specialty]
      : filters.specialties.filter((s) => s !== specialty)

    onFiltersChange({ ...filters, specialties: newSpecialties })
  }

  const handleExperienceChange = (value: number[]) => {
    onFiltersChange({ ...filters, experience: [value[0], value[1]] })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleRatingChange = (rating: string) => {
    onFiltersChange({ ...filters, rating: Number.parseFloat(rating) })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      industries: [],
      locations: [],
      experience: [0, 30],
      rating: 0,
      availability: [],
      priceRange: [0, 10000],
      specialties: [],
    })
  }

  const getActiveFilterCount = () => {
    return (
      filters.industries.length +
      filters.locations.length +
      filters.availability.length +
      filters.specialties.length +
      (filters.rating > 0 ? 1 : 0) +
      (filters.experience[0] > 0 || filters.experience[1] < 30 ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Industry Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Industry</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {industryOptions.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filters.industries.includes(industry)}
                    onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                  />
                  <Label htmlFor={`industry-${industry}`} className="text-sm font-normal cursor-pointer">
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Location</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {locationOptions.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm font-normal cursor-pointer">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Experience: {filters.experience[0]} - {filters.experience[1]} years
            </Label>
            <Slider
              value={filters.experience}
              onValueChange={handleExperienceChange}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
            <Select value={filters.rating.toString()} onValueChange={handleRatingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/hour
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={10000}
              min={0}
              step={500}
              className="w-full"
            />
          </div>

          {/* Availability Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Availability</Label>
            <div className="space-y-2">
              {availabilityOptions.map((availability) => (
                <div key={availability} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${availability}`}
                    checked={filters.availability.includes(availability)}
                    onCheckedChange={(checked) => handleAvailabilityChange(availability, checked as boolean)}
                  />
                  <Label htmlFor={`availability-${availability}`} className="text-sm font-normal cursor-pointer">
                    {availability}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Specialties</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {specialtyOptions.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`specialty-${specialty}`}
                    checked={filters.specialties.includes(specialty)}
                    onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                  />
                  <Label htmlFor={`specialty-${specialty}`} className="text-sm font-normal cursor-pointer">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

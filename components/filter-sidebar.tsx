"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Filter } from "lucide-react"

interface FilterOptions {
  expertise: string[]
  experience: [number, number]
  hourlyRate: [number, number]
  rating: number
  location: string[]
  availability: string[]
  verified: boolean
}

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  className?: string
}

const expertiseOptions = [
  "Strategy & Leadership",
  "Digital Transformation",
  "Operations",
  "Finance & Investment",
  "Marketing & Sales",
  "Technology",
  "Human Resources",
  "Product Management",
  "Business Development",
  "Entrepreneurship",
]

const locationOptions = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Remote",
]

const availabilityOptions = ["Immediate", "Within 24 hours", "Within 3 days", "Within a week", "Flexible"]

export function FilterSidebar({ filters, onFiltersChange, onClearFilters, className = "" }: FilterSidebarProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleExpertise = (expertise: string) => {
    const current = filters.expertise
    const updated = current.includes(expertise) ? current.filter((e) => e !== expertise) : [...current, expertise]
    updateFilter("expertise", updated)
  }

  const toggleLocation = (location: string) => {
    const current = filters.location
    const updated = current.includes(location) ? current.filter((l) => l !== location) : [...current, location]
    updateFilter("location", updated)
  }

  const toggleAvailability = (availability: string) => {
    const current = filters.availability
    const updated = current.includes(availability)
      ? current.filter((a) => a !== availability)
      : [...current, availability]
    updateFilter("availability", updated)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.expertise.length > 0) count++
    if (filters.location.length > 0) count++
    if (filters.availability.length > 0) count++
    if (filters.verified) count++
    if (filters.rating > 0) count++
    return count
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
            Clear All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Expertise Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Expertise</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {expertiseOptions.map((expertise) => (
              <div key={expertise} className="flex items-center space-x-2">
                <Checkbox
                  id={`expertise-${expertise}`}
                  checked={filters.expertise.includes(expertise)}
                  onCheckedChange={() => toggleExpertise(expertise)}
                />
                <Label htmlFor={`expertise-${expertise}`} className="text-sm cursor-pointer">
                  {expertise}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Experience Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Experience: {filters.experience[0]} - {filters.experience[1]} years
          </Label>
          <Slider
            value={filters.experience}
            onValueChange={(value) => updateFilter("experience", value as [number, number])}
            max={30}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Hourly Rate Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Hourly Rate: ₹{filters.hourlyRate[0]} - ₹{filters.hourlyRate[1]}
          </Label>
          <Slider
            value={filters.hourlyRate}
            onValueChange={(value) => updateFilter("hourlyRate", value as [number, number])}
            max={10000}
            min={500}
            step={500}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Minimum Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Minimum Rating: {filters.rating} stars</Label>
          <Slider
            value={[filters.rating]}
            onValueChange={(value) => updateFilter("rating", value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {locationOptions.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.location.includes(location)}
                  onCheckedChange={() => toggleLocation(location)}
                />
                <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Availability</Label>
          <div className="space-y-2">
            {availabilityOptions.map((availability) => (
              <div key={availability} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${availability}`}
                  checked={filters.availability.includes(availability)}
                  onCheckedChange={() => toggleAvailability(availability)}
                />
                <Label htmlFor={`availability-${availability}`} className="text-sm cursor-pointer">
                  {availability}
                </Label>
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
            onCheckedChange={(checked) => updateFilter("verified", checked)}
          />
          <Label htmlFor="verified" className="text-sm cursor-pointer">
            Verified mentors only
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}

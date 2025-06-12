"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")
  
  const industries = [
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "consulting", label: "Consulting" },
    { value: "media", label: "Media & Entertainment" },
  ]

  const experienceLevels = [
    { value: "0-3", label: "0-3 years" },
    { value: "4-7", label: "4-7 years" },
    { value: "8-12", label: "8-12 years" },
    { value: "13-20", label: "13-20 years" },
    { value: "20+", label: "20+ years" },
  ]

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
    { value: "bn", label: "Bengali" },
    { value: "mr", label: "Marathi" },
    { value: "gu", label: "Gujarati" },
    { value: "kn", label: "Kannada" },
  ]

  const timezones = [
    { value: "IST", label: "Indian Standard Time (IST)" },
    { value: "GMT", label: "Greenwich Mean Time (GMT)" },
    { value: "EST", label: "Eastern Standard Time (EST)" },
    { value: "PST", label: "Pacific Standard Time (PST)" },
    { value: "JST", label: "Japan Standard Time (JST)" },
    { value: "AEST", label: "Australian Eastern Standard Time (AEST)" },
  ]

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>\

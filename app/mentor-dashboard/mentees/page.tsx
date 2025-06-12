"use client"

import { useState } from "react"

export default function MenteesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [feedbackText, setFeedbackText] = useState("")

  const mentees = [
    {
      id: "1",
      name: "Alex Thompson",
      role: "VP Operations",
      company: "StartupCo",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "alex@startupco.com",
      joinDate: "2024-01-01",
      status: "active",
      progress: 85,
      totalSessions: 12,
      completedSessions: 10,
      upcomingSession: "2024-01-20 15:00",
      totalPaid: 12000,
      currentGoals: [
        "Improve team leadership",
        "Scale operations",
        "Build processes",
      ],
      achievements: [
        "Promoted to VP level",
        "Increased team productivity by 30%",
        "Implemented new processes",
      ],
      rating: 4.9,
      lastSession: "2024-01-15",
      notes: "Making excellent progress on leadership skills. Very engaged and implements feedback well.",
      industry: "Technology",
      experience: "8 years",
    },
    {
      id: "2",
      name: "Maria Garcia",
      role: "Director of Product",
      company: "TechFirm",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "maria@techfirm.com",
      joinDate: "2023-12-15",
      status: "active",
      progress: 72,
      totalSessions: 8,
      completedSessions: 6,
      upcomingSession: "2024-01-22 10:30",
      totalPaid: 9600,
      currentGoals: [
        "Executive presence",
        "Strategic thinking",
        "Career transition",
      ],
      achievements: [
        "Led successful product launch",
        "Improved stakeholder communication",
        "Developed strategic roadmap",
      ],
      rating: 4.8,
      lastSession: "2024-01-12",
      notes: "Strong analytical skills. Working on developing executive presence and communication.",
      industry: "SaaS",
      experience: "6 years",
    },
    {
      id: "3",
      name: "John Smith",
      role: "Senior Manager",
      company: "InnovateCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "john@innovatecorp.com",
      joinDate: "2023-11-20",
      status: "paused",
      progress: 45,
      totalSessions: 6,
      completedSessions: 4,
      upcomingSession: null,
      totalPaid: 4800,
      currentGoals: [
        "Technical leadership",
        "People management",
        "Strategic planning",
      ],
      achievements: [
        "Transitioned to management role",
        "Built technical team",
        "Improved code quality",
      ],
      rating: 4.6,
      lastSession: "2023-12-20",
      notes: "Taking a break due to work commitments. Plans to resume in February.",
      industry: "Consulting",
      experience: "5 years",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      role: "COO",
      company: "GrowthCorp",
      avatar: "/placeholder.svg?height=40&width=40",\
      email: "

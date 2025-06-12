"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  LogOut,
  Settings,
  User,
  Menu,
  Home,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  Award,
  BarChart3,
  Shield,
  Crown,
  Bell,
} from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "from-purple-500 to-pink-500"
      case "admin":
        return "from-red-500 to-orange-500"
      case "mentor":
        return "from-blue-500 to-cyan-500"
      case "cxo":
        return "from-green-500 to-emerald-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="h-3 w-3" />
      case "admin":
        return <Shield className="h-3 w-3" />
      case "mentor":
        return <Award className="h-3 w-3" />
      case "cxo":
        return <User className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/forums", label: "Forums", icon: MessageSquare },
      { href: "/events", label: "Events", icon: Calendar },
      { href: "/network", label: "Network", icon: Users },
    ]

    const roleSpecificItems = {
      cxo: [
        { href: "/mentorship", label: "Mentorship", icon: BookOpen },
        { href: "/messages", label: "Messages", icon: MessageSquare },
      ],
      mentor: [
        { href: "/mentor-dashboard", label: "Mentor Hub", icon: Award },
        { href: "/sessions", label: "Sessions", icon: Calendar },
        { href: "/qa-vault", label: "Q&A Vault", icon: BookOpen },
      ],
      admin: [
        { href: "/admin", label: "Admin Panel", icon: Shield },
        { href: "/moderation", label: "Moderation", icon: Settings },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
      ],
      super_admin: [
        { href: "/super-admin", label: "Super Admin", icon: Crown },
        { href: "/billing", label: "Billing", icon: BarChart3 },
        { href: "/platform-settings", label: "Platform", icon: Settings },
      ],
    }

    return [...baseItems, ...(roleSpecificItems[user.role] || [])]
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-white/20">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexLink Hub
            </span>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] rounded-r-3xl">
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span>NexLink Hub</span>
              </SheetTitle>
              <SheetDescription>Navigate your executive network</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-3 mt-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-blue-600 p-3 rounded-2xl hover:bg-blue-50"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-blue-600 text-slate-700 hover:bg-blue-50 px-3 py-2 rounded-xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="rounded-xl relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-2xl">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-2xl border-0 shadow-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-slate-600">{user.email}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge
                      className={`bg-gradient-to-r ${getRoleColor(user.role)} text-white text-xs rounded-full px-2 py-1`}
                    >
                      <span className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role.replace("_", " ")}</span>
                      </span>
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl mx-2 my-1">
                <Link href="/profile" className="flex items-center">
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl mx-2 my-1">
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              {user.role === "super_admin" && (
                <DropdownMenuItem asChild className="rounded-xl mx-2 my-1">
                  <Link href="/super-admin" className="flex items-center">
                    <Crown className="mr-3 h-4 w-4" />
                    <span>Super Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="rounded-xl mx-2 my-1 text-red-600 focus:text-red-600">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

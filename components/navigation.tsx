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
} from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-500"
      case "admin":
        return "bg-red-500"
      case "mentor":
        return "bg-blue-500"
      case "cxo":
        return "bg-green-500"
      default:
        return "bg-gray-500"
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CXO Network</span>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2">
                <Building2 className="h-6 w-6" />
                <span>CXO Network</span>
              </SheetTitle>
              <SheetDescription>Navigate your executive network</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-3 mt-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                >
                  <item.icon className="h-4 w-4" />
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
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Badge variant="secondary" className={`${getRoleColor(user.role)} text-white text-xs`}>
                      <span className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role.replace("_", " ")}</span>
                      </span>
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              {user.role === "super_admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/super-admin">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Super Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

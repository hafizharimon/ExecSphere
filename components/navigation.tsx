"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Menu,
  Home,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  Shield,
  Award,
  Building2,
  Globe,
  Sparkles,
  BookOpen,
  Target,
  DollarSign,
  UserCheck,
  MessageCircle,
} from "lucide-react"

export function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Navigation items based on user type
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/network", label: "Network", icon: Users },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/events", label: "Events", icon: Calendar },
    ]

    switch (user.userType) {
      case "super-admin":
        return [
          ...baseItems,
          { href: "/admin", label: "Admin Panel", icon: Shield },
          { href: "/analytics", label: "Platform Analytics", icon: BarChart3 },
          { href: "/company-dashboard", label: "Companies", icon: Building2 },
        ]

      case "admin":
        return [
          ...baseItems,
          { href: "/admin", label: "Admin Panel", icon: Shield },
          { href: "/analytics", label: "Analytics", icon: BarChart3 },
        ]

      case "mentor":
        return [
          ...baseItems,
          { href: "/mentorship", label: "Mentorship", icon: Award },
          { href: "/mentor-dashboard", label: "Mentor Hub", icon: Target },
          { href: "/mentor-dashboard/earnings", label: "Earnings", icon: DollarSign },
          { href: "/qa-vault", label: "Q&A Vault", icon: BookOpen },
          { href: "/analytics", label: "Analytics", icon: BarChart3 },
        ]

      case "cxo":
      default:
        return [
          ...baseItems,
          { href: "/forums", label: "Forums", icon: MessageCircle },
          { href: "/mentorship", label: "Mentorship", icon: Award },
          { href: "/public-wall", label: "Public Wall", icon: Globe },
          { href: "/analytics", label: "Analytics", icon: BarChart3 },
          ...(user.organization && user.legalEntityName
            ? [{ href: "/company-dashboard", label: "Company", icon: Building2 }]
            : []),
        ]
    }
  }

  const navigationItems = getNavigationItems()

  const getUserBadges = () => {
    const badges = []

    if (user?.userType === "super-admin") {
      badges.push(
        <Badge key="super-admin" className="bg-purple-500 text-white">
          <Crown className="h-3 w-3 mr-1" />
          Super Admin
        </Badge>,
      )
    } else if (user?.userType === "admin") {
      badges.push(
        <Badge key="admin" className="bg-red-500 text-white">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>,
      )
    } else if (user?.userType === "mentor") {
      badges.push(
        <Badge key="mentor" className="bg-blue-500 text-white">
          <Award className="h-3 w-3 mr-1" />
          Mentor
        </Badge>,
      )
    }

    if (user?.isVerified) {
      badges.push(
        <Badge key="verified" className="bg-green-500 text-white">
          <UserCheck className="h-3 w-3 mr-1" />
          Verified
        </Badge>,
      )
    }

    if (user?.mcaVerified) {
      badges.push(
        <Badge key="mca" className="bg-indigo-500 text-white">
          <Shield className="h-3 w-3 mr-1" />
          MCA Verified
        </Badge>,
      )
    }

    if (user?.premiumStatus === "premium") {
      badges.push(
        <Badge key="premium" className="bg-yellow-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          Premium
        </Badge>,
      )
    }

    return badges
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ExecSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.role} at {user.organization}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <div className="flex flex-wrap gap-1 mt-2">{getUserBadges()}</div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/analytics" className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.userType === "super-admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      <div className="flex items-center space-x-3 pb-4 border-b">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.role} at {user.organization}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">{getUserBadges()}</div>
                        </div>
                      </div>

                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      <div className="pt-4 border-t space-y-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Settings className="h-5 w-5" />
                          <span>Profile Settings</span>
                        </Link>
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            handleLogout()
                          }}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

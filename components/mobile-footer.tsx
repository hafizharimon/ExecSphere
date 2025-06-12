"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, Calendar, MessageSquare, User } from "lucide-react"

export function MobileFooter() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Network",
      href: "/network",
      icon: Users,
    },
    {
      label: "Events",
      href: "/events",
      icon: Calendar,
    },
    {
      label: "Forums",
      href: "/forums",
      icon: MessageSquare,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="nexlink-footer">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nexlink-footer-icon ${isActive ? "nexlink-footer-icon-active" : "nexlink-footer-icon-inactive"}`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

"use client"

import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { CXODashboard } from "@/components/dashboards/cxo-dashboard"
import { MentorDashboard } from "@/components/dashboards/mentor-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { SuperAdminDashboard } from "@/components/dashboards/super-admin-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return <div>Please log in to access the dashboard.</div>
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "cxo":
        return <CXODashboard user={user} />
      case "mentor":
        return <MentorDashboard user={user} />
      case "admin":
        return <AdminDashboard user={user} />
      case "super_admin":
        return <SuperAdminDashboard user={user} />
      default:
        return <CXODashboard user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {renderDashboard()}
    </div>
  )
}

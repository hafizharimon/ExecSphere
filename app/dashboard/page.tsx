"use client"

import { useAuth } from "@/context/auth-context"
import { CXODashboard } from "@/components/dashboards/cxo-dashboard"
import { MentorDashboard } from "@/components/dashboards/mentor-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { MobileFooter } from "@/components/mobile-footer"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800">Loading...</h2>
          <p className="text-slate-600">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "CXO":
        return <CXODashboard />
      case "Mentor":
        return <MentorDashboard />
      case "Admin":
        return <AdminDashboard />
      default:
        return <CXODashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {renderDashboard()}
      <MobileFooter />
    </div>
  )
}

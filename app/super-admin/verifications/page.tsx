"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type UserRegistrationData } from "@/services/super-admin-service"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerificationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<UserRegistrationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserRegistrationData | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadPendingRegistrations()
    }
  }, [user])

  const loadPendingRegistrations = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getPendingUserRegistrations()
      if (result.success && result.data) {
        setRegistrations(result.data.registrations || [])
      }
    } catch (error) {
      console.error("Load pending registrations error:", error)
      toast({
        title: "Error",
        description: "Failed to load pending registrations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    setIsProcessing(true)
    try {
      const result = await superAdminService.approveUserRegistration(userId, adminNotes)
      if (result.success) {
        toast({
          title: "User approved",
          description: "User registration has been approved successfully.",
        })
        setSelectedUser(null)
        setAdminNotes("")
        await loadPendingRegistrations()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user registration",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectUser = async (userId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await superAdminService.rejectUserRegistration(userId, rejectionReason, true)
      if (result.success) {
        toast({
          title: "User rejected",
          description: "User registration has been rejected and refund processed.",
        })
        setSelectedUser(null)
        setRejectionReason("")
        await loadPendingRegistrations()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user registration",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const analyzeEligibility = async (userId: string) => {
    try {
      const result = await superAdminService.analyzeUserEligibility(userId)
      if (result.success) {
        // Update the registration data with analysis results
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg.id === userId ? { ...reg, eligibilityAnalysis: result.data.eligibilityAnalysis } : reg,
          ),
        )
      }
    } catch (error) {
      console.error("Analyze eligibility error:", error)
    }
  }

  if (!user || user.userType !== "super-admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/super-admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">User Verifications</h1>
            <p className="text-muted-foreground">Review and approve user registrations</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading pending registrations...</p>
            </div>
          </div>
        ) : registrations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Registrations Approved</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {registrations.map((registration) => (
              <Card key={registration.id}>
                <CardHeader>
                  <CardTitle>{registration.name}</CardTitle>
                  <CardDescription>{registration.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{registration.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Company: {registration.company}</p>
                      <p className="text-sm text-muted-foreground">Location: {registration.location}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="default" onClick={() => setSelectedUser(registration)}>
                      Analyze Eligibility
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Review the details of {selectedUser.name} and decide on their registration.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value={selectedUser.name} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" value={selectedUser.email} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input id="company" value={selectedUser.company} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" value={selectedUser.location} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adminNotes" className="text-right">
                    Admin Notes
                  </Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rejectionReason" className="text-right">
                    Rejection Reason
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleApproveUser(selectedUser.id)} disabled={isProcessing}>
                  Approve
                </Button>
                <Button onClick={() => handleRejectUser(selectedUser.id)} disabled={isProcessing}>
                  Reject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}

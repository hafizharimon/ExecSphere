"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type FeeRequest } from "@/services/super-admin-service"
import {
  ArrowLeft,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  User,
  Building,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function FeeRequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [feeRequests, setFeeRequests] = useState<FeeRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<FeeRequest | null>(null)
  const [adminResponse, setAdminResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusFilter, setStatusFilter] = useState("pending")

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadFeeRequests()
    }
  }, [user, statusFilter])

  const loadFeeRequests = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getFeeRequests(1, 20, statusFilter)
      if (result.success && result.data) {
        setFeeRequests(result.data)
      }
    } catch (error) {
      console.error("Load fee requests error:", error)
      toast({
        title: "Error",
        description: "Failed to load fee requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    setIsProcessing(true)
    try {
      const result = await superAdminService.approveFeeRequest(requestId, adminResponse)
      if (result.success) {
        toast({
          title: "Request Approved",
          description: "Fee request has been approved successfully",
        })
        setSelectedRequest(null)
        setAdminResponse("")
        await loadFeeRequests()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve fee request",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    if (!adminResponse.trim()) {
      toast({
        title: "Response Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await superAdminService.rejectFeeRequest(requestId, adminResponse)
      if (result.success) {
        toast({
          title: "Request Rejected",
          description: "Fee request has been rejected",
        })
        setSelectedRequest(null)
        setAdminResponse("")
        await loadFeeRequests()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject fee request",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "mentor_rate_increase":
        return (
          <Badge variant="outline" className="text-blue-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            Rate Increase
          </Badge>
        )
      case "premium_badge":
        return (
          <Badge variant="outline" className="text-purple-600">
            <User className="h-3 w-3 mr-1" />
            Premium Badge
          </Badge>
        )
      case "subscription":
        return (
          <Badge variant="outline" className="text-green-600">
            <Building className="h-3 w-3 mr-1" />
            Subscription
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const calculateIncreasePercentage = (current: number, requested: number) => {
    return Math.round(((requested - current) / current) * 100)
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
      <main className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/super-admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                Fee Requests
              </h1>
              <p className="text-muted-foreground">Review and manage fee increase requests</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={loadFeeRequests} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label>Status:</Label>
              </div>
              <div className="flex space-x-2">
                {["pending", "approved", "rejected"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading fee requests...</p>
            </div>
          </div>
        ) : feeRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Fee Requests</h3>
              <p className="text-muted-foreground">No {statusFilter} fee requests found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {feeRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder-user.jpg`} />
                        <AvatarFallback>
                          {request.user?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{request.user?.name}</h3>
                          {getRequestTypeBadge(request.requestType)}
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>
                            {request.user?.role} at {request.user?.organization}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Fee Details */}
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Current Rate</p>
                              <p className="font-medium">₹{request.currentAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Requested Rate</p>
                              <p className="font-medium text-blue-600">₹{request.requestedAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Increase</p>
                              <p className="font-medium text-green-600">
                                +{calculateIncreasePercentage(request.currentAmount, request.requestedAmount)}%
                              </p>
                            </div>
                          </div>

                          {request.requestedAmount > request.maxAllowedAmount && (
                            <div className="flex items-center space-x-2 text-amber-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm">
                                Exceeds maximum allowed rate of ₹{request.maxAllowedAmount.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Justification */}
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Justification:</p>
                          <p className="text-sm text-muted-foreground bg-muted/30 rounded p-2">
                            {request.justification}
                          </p>
                        </div>

                        {/* Admin Response (if any) */}
                        {request.adminResponse && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Admin Response:</p>
                            <p className="text-sm text-muted-foreground bg-blue-50 rounded p-2">
                              {request.adminResponse}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Review
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Review Fee Request</DialogTitle>
                <DialogDescription>Review and respond to {selectedRequest.user?.name}'s fee request</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Request Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Request Summary</h4>
                    {getRequestTypeBadge(selectedRequest.requestType)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Rate</p>
                      <p className="font-medium text-lg">₹{selectedRequest.currentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Requested Rate</p>
                      <p className="font-medium text-lg text-blue-600">
                        ₹{selectedRequest.requestedAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Increase Percentage:</span>
                    <span className="font-medium text-green-600">
                      +{calculateIncreasePercentage(selectedRequest.currentAmount, selectedRequest.requestedAmount)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Max Allowed Rate:</span>
                    <span className="font-medium">₹{selectedRequest.maxAllowedAmount.toLocaleString()}</span>
                  </div>

                  {selectedRequest.requestedAmount > selectedRequest.maxAllowedAmount && (
                    <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 rounded p-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">This request exceeds the maximum allowed rate</span>
                    </div>
                  )}
                </div>

                {/* Justification */}
                <div className="space-y-2">
                  <Label className="font-medium">Justification</Label>
                  <div className="bg-muted/30 rounded p-3 text-sm">{selectedRequest.justification}</div>
                </div>

                {/* Admin Response */}
                <div className="space-y-2">
                  <Label htmlFor="adminResponse">Admin Response</Label>
                  <Textarea
                    id="adminResponse"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Provide your response or feedback..."
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter className="space-x-2">
                <Button variant="outline" onClick={() => setSelectedRequest(null)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectRequest(selectedRequest.id)}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApproveRequest(selectedRequest.id)}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}

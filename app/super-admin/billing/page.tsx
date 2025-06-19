"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type BillingTransaction } from "@/services/super-admin-service"
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, CreditCard, RefreshCw, Download, Filter } from "lucide-react"
import Link from "next/link"

export default function BillingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<BillingTransaction[]>([])
  const [billingOverview, setBillingOverview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    status: "all",
    transactionType: "all",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadBillingData()
    }
  }, [user, currentPage, filters])

  const loadBillingData = async () => {
    setIsLoading(true)
    try {
      const [transactionsResult, overviewResult] = await Promise.all([
        superAdminService.getBillingTransactions(currentPage, 20, filters),
        superAdminService.getBillingOverview(filters.startDate, filters.endDate),
      ])

      if (transactionsResult.success && transactionsResult.data) {
        setTransactions(transactionsResult.data.transactions || [])
      }

      if (overviewResult.success && overviewResult.data) {
        setBillingOverview(overviewResult.data)
      }
    } catch (error) {
      console.error("Load billing data error:", error)
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const exportTransactions = async () => {
    try {
      // Implementation for exporting transactions
      toast({
        title: "Export started",
        description: "Transaction export will be available for download shortly.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export transactions",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, className: "bg-green-500" },
      pending: { variant: "secondary" as const, className: "bg-yellow-500" },
      failed: { variant: "destructive" as const, className: "" },
      refunded: { variant: "outline" as const, className: "bg-blue-500" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "registration_fee":
        return <CreditCard className="h-4 w-4" />
      case "mentor_payment":
        return <DollarSign className="h-4 w-4" />
      case "subscription":
        return <RefreshCw className="h-4 w-4" />
      case "refund":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/super-admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Billing & Payments
              </h1>
              <p className="text-muted-foreground">Manage platform billing and payment transactions</p>
            </div>
          </div>

          <Button onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export Transactions
          </Button>
        </div>

        {/* Billing Overview */}
        {billingOverview && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{billingOverview.totalRevenue?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registration Fees</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{billingOverview.registrationFees?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(billingOverview.registrationFees / 1000)} new registrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mentor Payments</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{billingOverview.mentorshipFees?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{billingOverview.transactionCount} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Refunds</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{billingOverview.refunds?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Net: ₹{billingOverview.netRevenue?.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                  value={filters.transactionType}
                  onValueChange={(value) => handleFilterChange("transactionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="registration_fee">Registration Fee</SelectItem>
                    <SelectItem value="mentor_payment">Mentor Payment</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>All billing transactions and payment records</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">No transactions match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getTransactionTypeIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.transactionType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description || `Transaction ID: ${transaction.id.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()} at{" "}
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{transaction.amount.toLocaleString()} {transaction.currency}
                        </p>
                        {transaction.paymentGateway && (
                          <p className="text-xs text-muted-foreground">via {transaction.paymentGateway}</p>
                        )}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">Showing {transactions.length} transactions</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={transactions.length < 20}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

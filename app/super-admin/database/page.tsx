"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { superAdminService, type DatabaseMetric } from "@/services/super-admin-service"
import {
  ArrowLeft,
  Database,
  RefreshCw,
  HardDrive,
  Activity,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function DatabasePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [metrics, setMetrics] = useState<DatabaseMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRunningMaintenance, setIsRunningMaintenance] = useState(false)

  useEffect(() => {
    if (user?.userType === "super-admin") {
      loadDatabaseMetrics()
    }
  }, [user])

  const loadDatabaseMetrics = async () => {
    setIsLoading(true)
    try {
      const result = await superAdminService.getDatabaseMetrics()
      if (result.success && result.data) {
        setMetrics(result.data)
      }
    } catch (error) {
      console.error("Load database metrics error:", error)
      toast({
        title: "Error",
        description: "Failed to load database metrics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const runDatabaseMaintenance = async () => {
    setIsRunningMaintenance(true)
    try {
      const result = await superAdminService.runDatabaseMaintenance()
      if (result.success) {
        toast({
          title: "Maintenance completed",
          description: "Database maintenance tasks have been completed successfully.",
        })
        await loadDatabaseMetrics()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run database maintenance",
        variant: "destructive",
      })
    } finally {
      setIsRunningMaintenance(false)
    }
  }

  // Mock database metrics if none loaded
  const getMockMetrics = () => ({
    storage: {
      totalSize: 2.4, // GB
      usedSize: 1.8, // GB
      freeSize: 0.6, // GB
      usagePercentage: 75,
    },
    performance: {
      avgQueryTime: 45, // ms
      slowQueries: 12,
      connectionsActive: 23,
      connectionsMax: 100,
      cacheHitRatio: 94.5, // %
    },
    tables: {
      users: { rows: 1247, size: 45.2 }, // MB
      companies: { rows: 234, size: 12.8 },
      posts: { rows: 5678, size: 123.4 },
      messages: { rows: 12456, size: 67.9 },
      analytics: { rows: 45678, size: 234.5 },
      sessions: { rows: 892, size: 23.1 },
    },
    health: {
      status: "healthy",
      uptime: "15 days, 4 hours",
      lastBackup: "2 hours ago",
      replicationLag: 0.2, // seconds
    },
  })

  const mockData = getMockMetrics()

  const getHealthBadge = (status: string) => {
    const statusConfig = {
      healthy: { variant: "default" as const, className: "bg-green-500", icon: CheckCircle },
      warning: { variant: "destructive" as const, className: "bg-yellow-500", icon: AlertTriangle },
      critical: { variant: "destructive" as const, className: "bg-red-500", icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.warning
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
                <Database className="h-6 w-6" />
                Database Management
              </h1>
              <p className="text-muted-foreground">Monitor database performance and manage maintenance</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={loadDatabaseMetrics} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={runDatabaseMaintenance} disabled={isRunningMaintenance}>
              <Zap className="h-4 w-4 mr-2" />
              {isRunningMaintenance ? "Running..." : "Run Maintenance"}
            </Button>
          </div>
        </div>

        {/* Database Health Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Status</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">{getHealthBadge(mockData.health.status)}</div>
              <p className="text-xs text-muted-foreground mt-1">Uptime: {mockData.health.uptime}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.storage.usagePercentage}%</div>
              <Progress value={mockData.storage.usagePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {mockData.storage.usedSize}GB / {mockData.storage.totalSize}GB used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.performance.avgQueryTime}ms</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Cache hit: {mockData.performance.cacheHitRatio}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.performance.connectionsActive}/{mockData.performance.connectionsMax}
              </div>
              <Progress
                value={(mockData.performance.connectionsActive / mockData.performance.connectionsMax) * 100}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">{mockData.performance.slowQueries} slow queries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Table Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Table Statistics
              </CardTitle>
              <CardDescription>Database table sizes and row counts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockData.tables).map(([tableName, stats]) => (
                  <div key={tableName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{tableName}</p>
                      <p className="text-sm text-muted-foreground">{stats.rows.toLocaleString()} rows</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{stats.size} MB</p>
                      <p className="text-xs text-muted-foreground">
                        {((stats.size / mockData.storage.usedSize / 1024) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance & Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Maintenance & Backup
              </CardTitle>
              <CardDescription>Database maintenance status and backup information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Last Backup</p>
                    <p className="text-sm text-muted-foreground">{mockData.health.lastBackup}</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Success
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Replication Lag</p>
                    <p className="text-sm text-muted-foreground">{mockData.health.replicationLag}s behind master</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    Healthy
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Index Optimization</p>
                    <p className="text-sm text-muted-foreground">Last run: 3 days ago</p>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={runDatabaseMaintenance} disabled={isRunningMaintenance} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  {isRunningMaintenance ? "Running Maintenance..." : "Run Full Maintenance"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reindex
                  </Button>
                  <Button variant="outline" size="sm">
                    <HardDrive className="h-3 w-3 mr-1" />
                    Vacuum
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Metrics */}
        {isLoading ? (
          <Card className="mt-6">
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading database metrics...</p>
              </div>
            </CardContent>
          </Card>
        ) : metrics.length > 0 ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Metrics</CardTitle>
              <CardDescription>Historical database performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.slice(0, 10).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{metric.metricName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(metric.recordedAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {metric.metricValue} {metric.metricUnit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  )
}

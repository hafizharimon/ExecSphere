import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Verified, Shield, AlertCircle, Clock } from "lucide-react"

type VerificationStatus = "verified" | "pending" | "rejected" | "not_found" | "director_verified"

interface McaVerificationBadgeProps {
  status: VerificationStatus
  showTooltip?: boolean
  className?: string
}

export function McaVerificationBadge({ status, showTooltip = true, className = "" }: McaVerificationBadgeProps) {
  const getBadgeContent = () => {
    switch (status) {
      case "verified":
        return {
          icon: <Verified className="h-3 w-3 mr-1" />,
          text: "MCA Verified",
          color: "bg-green-500 text-white",
          tooltip: "Company details verified with Ministry of Corporate Affairs",
        }
      case "director_verified":
        return {
          icon: <Shield className="h-3 w-3 mr-1" />,
          text: "MCA Approved C-Level",
          color: "bg-blue-500 text-white",
          tooltip: "C-Level position verified with MCA director records",
        }
      case "pending":
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          text: "MCA Pending",
          color: "bg-yellow-500 text-white",
          tooltip: "Verification with MCA in progress",
        }
      case "rejected":
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          text: "Verification Failed",
          color: "bg-red-500 text-white",
          tooltip: "MCA verification failed. Please check company details",
        }
      case "not_found":
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          text: "Not Found",
          color: "bg-gray-500 text-white",
          tooltip: "Company not found in MCA records",
        }
      default:
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          text: "Unverified",
          color: "bg-gray-500 text-white",
          tooltip: "Company not verified with MCA",
        }
    }
  }

  const { icon, text, color, tooltip } = getBadgeContent()

  const badge = (
    <Badge className={`${color} ${className}`}>
      {icon}
      {text}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

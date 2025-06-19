"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Building2, Shield, Linkedin, CheckCircle, AlertCircle, Loader2, Mail, Crown, Award } from "lucide-react"
import { companyService } from "@/services/company-service"
import { mcaVerificationService } from "@/services/mca-verification-service"
import { udyamVerificationService } from "@/services/udyam-verification-service"
import { linkedinCompanyService } from "@/services/linkedin-company-service"

interface CompanySetupData {
  // Basic Information
  companyName: string
  legalName: string
  companyCategory: string
  description: string
  industry: string
  foundedYear: number | null
  employeeCountRange: string

  // Legal Verification
  cinNumber: string
  udyamNumber: string
  gstin: string
  panNumber: string

  // Contact Information
  headquartersAddress: string
  websiteUrl: string
  contactEmail: string
  contactPhone: string
  supportEmail: string

  // LinkedIn Integration
  linkedinCompanyUrl: string

  // Social Media
  twitterUrl: string
  facebookUrl: string
  instagramUrl: string

  // Media
  logoUrl: string
  coverImageUrl: string
  galleryImages: string[]
}

const companyCategories = [
  { value: "pvt_ltd", label: "Private Limited Company" },
  { value: "startup", label: "Startup" },
  { value: "mnc", label: "Multinational Corporation" },
  { value: "msme", label: "MSME (Micro, Small & Medium Enterprise)" },
  { value: "public_company", label: "Public Limited Company" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "llp", label: "Limited Liability Partnership" },
  { value: "ngo", label: "Non-Governmental Organization" },
  { value: "government", label: "Government Organization" },
]

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Automotive",
  "Energy",
  "Telecommunications",
  "Media",
  "Transportation",
  "Agriculture",
  "Construction",
  "Hospitality",
  "Other",
]

const employeeRanges = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"]

export default function CompanySetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [linkedinLoading, setLinkedinLoading] = useState(false)

  const [formData, setFormData] = useState<CompanySetupData>({
    companyName: "",
    legalName: "",
    companyCategory: "",
    description: "",
    industry: "",
    foundedYear: null,
    employeeCountRange: "",
    cinNumber: "",
    udyamNumber: "",
    gstin: "",
    panNumber: "",
    headquartersAddress: "",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    supportEmail: "",
    linkedinCompanyUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    logoUrl: "",
    coverImageUrl: "",
    galleryImages: [],
  })

  const [verificationStatus, setVerificationStatus] = useState({
    mca: { status: "pending", data: null, error: null },
    udyam: { status: "pending", data: null, error: null },
    linkedin: { status: "pending", data: null, error: null },
  })

  const [badges, setBadges] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof CompanySetupData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.companyName) newErrors.companyName = "Company name is required"
        if (!formData.companyCategory) newErrors.companyCategory = "Company category is required"
        if (!formData.industry) newErrors.industry = "Industry is required"
        break
      case 2:
        if (formData.companyCategory === "pvt_ltd" || formData.companyCategory === "public_company") {
          if (!formData.cinNumber) newErrors.cinNumber = "CIN number is required for this company type"
        }
        if (formData.companyCategory === "msme" && !formData.udyamNumber) {
          newErrors.udyamNumber = "Udyam number is required for MSME"
        }
        break
      case 3:
        if (!formData.linkedinCompanyUrl) {
          newErrors.linkedinCompanyUrl = "LinkedIn company page is required"
        }
        break
      case 4:
        if (!formData.contactEmail) newErrors.contactEmail = "Contact email is required"
        if (!formData.headquartersAddress) newErrors.headquartersAddress = "Headquarters address is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleMcaVerification = async () => {
    if (!formData.cinNumber || !formData.companyName) {
      setErrors({ cinNumber: "CIN number and company name are required" })
      return
    }

    setVerificationLoading(true)
    try {
      const result = await mcaVerificationService.verifyCompany(formData.cinNumber, formData.companyName)

      if (result.success && result.data) {
        setVerificationStatus((prev) => ({
          ...prev,
          mca: { status: "verified", data: result.data, error: null },
        }))

        // Auto-fill data from MCA
        setFormData((prev) => ({
          ...prev,
          legalName: result.data.companyName,
          headquartersAddress: result.data.registeredAddress,
        }))

        // Add MCA badge
        setBadges((prev) => [
          ...prev.filter((b) => b.type !== "mca_verified"),
          {
            type: "mca_verified",
            name: "MCA Verified",
            description: "Verified by Ministry of Corporate Affairs",
            icon: Shield,
            color: "bg-green-500",
          },
        ])
      } else {
        setVerificationStatus((prev) => ({
          ...prev,
          mca: { status: "failed", data: null, error: result.error },
        }))
      }
    } catch (error) {
      setVerificationStatus((prev) => ({
        ...prev,
        mca: { status: "failed", data: null, error: "Verification failed" },
      }))
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleUdyamVerification = async () => {
    if (!formData.udyamNumber) {
      setErrors({ udyamNumber: "Udyam number is required" })
      return
    }

    setVerificationLoading(true)
    try {
      const result = await udyamVerificationService.verifyUdyam(formData.udyamNumber)

      if (result.success && result.data) {
        setVerificationStatus((prev) => ({
          ...prev,
          udyam: { status: "verified", data: result.data, error: null },
        }))

        // Add Udyam badge
        setBadges((prev) => [
          ...prev.filter((b) => b.type !== "udyam_verified"),
          {
            type: "udyam_verified",
            name: "Udyam Verified",
            description: "Verified MSME Registration",
            icon: Award,
            color: "bg-blue-500",
          },
        ])
      } else {
        setVerificationStatus((prev) => ({
          ...prev,
          udyam: { status: "failed", data: null, error: result.error },
        }))
      }
    } catch (error) {
      setVerificationStatus((prev) => ({
        ...prev,
        udyam: { status: "failed", data: null, error: "Verification failed" },
      }))
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleLinkedInIntegration = async () => {
    if (!formData.linkedinCompanyUrl) {
      setErrors({ linkedinCompanyUrl: "LinkedIn company URL is required" })
      return
    }

    setLinkedinLoading(true)
    try {
      const result = await linkedinCompanyService.fetchCompanyData(formData.linkedinCompanyUrl)

      if (result.success && result.data) {
        setVerificationStatus((prev) => ({
          ...prev,
          linkedin: { status: "verified", data: result.data, error: null },
        }))

        // Auto-fill data from LinkedIn
        setFormData((prev) => ({
          ...prev,
          companyName: result.data.name || prev.companyName,
          description: result.data.description || prev.description,
          industry: result.data.industry || prev.industry,
          websiteUrl: result.data.website || prev.websiteUrl,
          logoUrl: result.data.logo || prev.logoUrl,
          employeeCountRange: result.data.employeeCount || prev.employeeCountRange,
        }))

        // Add LinkedIn badge
        setBadges((prev) => [
          ...prev.filter((b) => b.type !== "linkedin_verified"),
          {
            type: "linkedin_verified",
            name: "LinkedIn Verified",
            description: "Verified LinkedIn Company Page",
            icon: Linkedin,
            color: "bg-blue-600",
          },
        ])
      } else {
        setVerificationStatus((prev) => ({
          ...prev,
          linkedin: { status: "failed", data: null, error: result.error },
        }))
      }
    } catch (error) {
      setVerificationStatus((prev) => ({
        ...prev,
        linkedin: { status: "failed", data: null, error: "LinkedIn integration failed" },
      }))
    } finally {
      setLinkedinLoading(false)
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      const companyData = {
        ...formData,
        verificationStatus,
        badges,
      }

      const result = await companyService.createCompanyPage(companyData)

      if (result.success) {
        router.push(`/company/${result.data.slug}/dashboard`)
      } else {
        setErrors({ submit: result.error || "Failed to create company page" })
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    // Check if legal verification is required and completed
    const requiresMCA = formData.companyCategory === "pvt_ltd" || formData.companyCategory === "public_company"
    const requiresUdyam = formData.companyCategory === "msme"

    if (requiresMCA && verificationStatus.mca.status !== "verified") return false
    if (requiresUdyam && verificationStatus.udyam.status !== "verified") return false
    if (verificationStatus.linkedin.status !== "verified") return false

    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Company Page Setup
          </h1>
          <p className="text-slate-600">Create your verified company presence on the CXO Network</p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Badges Display */}
        {badges.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Company Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} className={`${badge.color} text-white`}>
                    <badge.icon className="h-3 w-3 mr-1" />
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Basic Company Information</h2>
                  <p className="text-slate-600">Tell us about your company</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyCategory">Company Category *</Label>
                    <Select
                      value={formData.companyCategory}
                      onValueChange={(value) => handleInputChange("companyCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company category" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.companyCategory && <p className="text-sm text-red-500">{errors.companyCategory}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.foundedYear || ""}
                      onChange={(e) => handleInputChange("foundedYear", Number.parseInt(e.target.value) || null)}
                      placeholder="e.g., 2020"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="employeeCountRange">Employee Count Range</Label>
                    <Select
                      value={formData.employeeCountRange}
                      onValueChange={(value) => handleInputChange("employeeCountRange", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee count range" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range} employees
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your company, its mission, and what makes it unique..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Legal Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Legal Verification</h2>
                  <p className="text-slate-600">Verify your company's legal status</p>
                </div>

                {/* MCA Verification */}
                {(formData.companyCategory === "pvt_ltd" || formData.companyCategory === "public_company") && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        MCA Verification
                      </CardTitle>
                      <CardDescription>Verify your company through Ministry of Corporate Affairs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cinNumber">CIN Number *</Label>
                          <Input
                            id="cinNumber"
                            value={formData.cinNumber}
                            onChange={(e) => handleInputChange("cinNumber", e.target.value.toUpperCase())}
                            placeholder="U72900KA2020PTC134567"
                            maxLength={21}
                          />
                          {errors.cinNumber && <p className="text-sm text-red-500">{errors.cinNumber}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="legalName">Legal Company Name</Label>
                          <Input
                            id="legalName"
                            value={formData.legalName}
                            onChange={(e) => handleInputChange("legalName", e.target.value)}
                            placeholder="As per MCA records"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleMcaVerification}
                        disabled={verificationLoading || !formData.cinNumber}
                        className="w-full"
                      >
                        {verificationLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying with MCA...
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Verify with MCA
                          </>
                        )}
                      </Button>

                      {verificationStatus.mca.status === "verified" && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Company successfully verified with MCA. Legal name and address have been auto-filled.
                          </AlertDescription>
                        </Alert>
                      )}

                      {verificationStatus.mca.status === "failed" && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{verificationStatus.mca.error}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Udyam Verification */}
                {formData.companyCategory === "msme" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Udyam Verification
                      </CardTitle>
                      <CardDescription>Verify your MSME registration through Udyam portal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="udyamNumber">Udyam Registration Number *</Label>
                        <Input
                          id="udyamNumber"
                          value={formData.udyamNumber}
                          onChange={(e) => handleInputChange("udyamNumber", e.target.value.toUpperCase())}
                          placeholder="UDYAM-KA-03-0123456"
                          maxLength={19}
                        />
                        {errors.udyamNumber && <p className="text-sm text-red-500">{errors.udyamNumber}</p>}
                      </div>

                      <Button
                        onClick={handleUdyamVerification}
                        disabled={verificationLoading || !formData.udyamNumber}
                        className="w-full"
                      >
                        {verificationLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying with Udyam...
                          </>
                        ) : (
                          <>
                            <Award className="h-4 w-4 mr-2" />
                            Verify with Udyam
                          </>
                        )}
                      </Button>

                      {verificationStatus.udyam.status === "verified" && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            MSME registration successfully verified with Udyam portal.
                          </AlertDescription>
                        </Alert>
                      )}

                      {verificationStatus.udyam.status === "failed" && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{verificationStatus.udyam.error}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Additional Legal Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange("gstin", e.target.value.toUpperCase())}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                      placeholder="AAAAA0000A"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: LinkedIn Integration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Linkedin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">LinkedIn Company Page</h2>
                  <p className="text-slate-600">Connect your LinkedIn company page to auto-fill information</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      LinkedIn Integration
                    </CardTitle>
                    <CardDescription>
                      Link your LinkedIn company page to automatically import company information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinCompanyUrl">LinkedIn Company Page URL *</Label>
                      <Input
                        id="linkedinCompanyUrl"
                        value={formData.linkedinCompanyUrl}
                        onChange={(e) => handleInputChange("linkedinCompanyUrl", e.target.value)}
                        placeholder="https://www.linkedin.com/company/your-company"
                      />
                      {errors.linkedinCompanyUrl && <p className="text-sm text-red-500">{errors.linkedinCompanyUrl}</p>}
                    </div>

                    <Button
                      onClick={handleLinkedInIntegration}
                      disabled={linkedinLoading || !formData.linkedinCompanyUrl}
                      className="w-full"
                    >
                      {linkedinLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting to LinkedIn...
                        </>
                      ) : (
                        <>
                          <Linkedin className="h-4 w-4 mr-2" />
                          Connect LinkedIn Page
                        </>
                      )}
                    </Button>

                    {verificationStatus.linkedin.status === "verified" && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          LinkedIn company page successfully connected. Company information has been auto-filled.
                        </AlertDescription>
                      </Alert>
                    )}

                    {verificationStatus.linkedin.status === "failed" && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{verificationStatus.linkedin.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must be an admin of the LinkedIn company page to complete this integration. The system will
                    verify your admin access during the connection process.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Mail className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <p className="text-slate-600">Provide contact details for your company</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      placeholder="contact@yourcompany.com"
                    />
                    {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                      placeholder="support@yourcompany.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquartersAddress">Headquarters Address *</Label>
                  <Textarea
                    id="headquartersAddress"
                    value={formData.headquartersAddress}
                    onChange={(e) => handleInputChange("headquartersAddress", e.target.value)}
                    placeholder="Enter your company's headquarters address"
                    rows={3}
                  />
                  {errors.headquartersAddress && <p className="text-sm text-red-500">{errors.headquartersAddress}</p>}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Social Media (Optional)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter URL</Label>
                      <Input
                        id="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                        placeholder="https://twitter.com/yourcompany"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebookUrl">Facebook URL</Label>
                      <Input
                        id="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                        placeholder="https://facebook.com/yourcompany"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl">Instagram URL</Label>
                      <Input
                        id="instagramUrl"
                        value={formData.instagramUrl}
                        onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                        placeholder="https://instagram.com/yourcompany"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Review & Submit</h2>
                  <p className="text-slate-600">Review your company information before submitting</p>
                </div>

                {/* Verification Status Check */}
                {!canProceed() && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please complete all required verifications before proceeding:
                      <ul className="list-disc list-inside mt-2">
                        {(formData.companyCategory === "pvt_ltd" || formData.companyCategory === "public_company") &&
                          verificationStatus.mca.status !== "verified" && <li>MCA verification is required</li>}
                        {formData.companyCategory === "msme" && verificationStatus.udyam.status !== "verified" && (
                          <li>Udyam verification is required</li>
                        )}
                        {verificationStatus.linkedin.status !== "verified" && (
                          <li>LinkedIn company page connection is required</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Company Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Company Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Company Name</Label>
                        <p className="font-medium">{formData.companyName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Category</Label>
                        <p className="font-medium">
                          {companyCategories.find((c) => c.value === formData.companyCategory)?.label}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Industry</Label>
                        <p className="font-medium">{formData.industry}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Founded</Label>
                        <p className="font-medium">{formData.foundedYear || "Not specified"}</p>
                      </div>
                    </div>

                    {formData.description && (
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Description</Label>
                        <p className="text-sm text-slate-700">{formData.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Verification Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(formData.companyCategory === "pvt_ltd" || formData.companyCategory === "public_company") && (
                        <div className="flex items-center justify-between">
                          <span>MCA Verification</span>
                          <Badge variant={verificationStatus.mca.status === "verified" ? "default" : "secondary"}>
                            {verificationStatus.mca.status === "verified" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                      )}

                      {formData.companyCategory === "msme" && (
                        <div className="flex items-center justify-between">
                          <span>Udyam Verification</span>
                          <Badge variant={verificationStatus.udyam.status === "verified" ? "default" : "secondary"}>
                            {verificationStatus.udyam.status === "verified" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span>LinkedIn Integration</span>
                        <Badge variant={verificationStatus.linkedin.status === "verified" ? "default" : "secondary"}>
                          {verificationStatus.linkedin.status === "verified" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {errors.submit && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading || !canProceed()}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Company Page...
                    </>
                  ) : (
                    "Create Company Page"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

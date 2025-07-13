"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  ArrowRight,
  Linkedin,
  Mail,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  MapPin,
  Verified,
  Smartphone,
  Globe,
} from "lucide-react"
import { mcaApiService } from "@/services/mca-api-service"
import { udyamApiService } from "@/services/udyam-api-service"
import { vercelAnalytics } from "@/services/vercel-analytics-service"

// Mobile-first responsive registration form for Indian C-level executives
export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // LinkedIn Data (Auto-populated)
    linkedinProfile: "",
    name: "",
    email: "",
    organization: "",
    title: "",

    // Indian Mobile Number (10 digits only)
    phone: "",

    // Company Information
    legalEntityName: "",
    cinNumber: "",
    udyamNumber: "",
    companyCategory: "",
    companyLinkedInPage: "",

    // Additional Info
    industry: "",
    yearsExperience: "",
    location: "",
    companyEmail: "",
    aadhaarNumber: "",

    // Verification
    emailOTP: "",
    smsOTP: "",
    aadhaarOTP: "",

    // Payment
    paymentMethod: "",

    // Terms
    acceptedTerms: false,
    acceptedPrivacy: false,
  })

  const [verificationStatus, setVerificationStatus] = useState({
    linkedin: false,
    mca: false,
    udyam: false,
    email: false,
    sms: false,
    aadhaar: false,
    payment: false,
  })

  const [mcaData, setMcaData] = useState<any>(null)
  const [udyamData, setUdyamData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { register, sendOTP } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Track page load
  useEffect(() => {
    vercelAnalytics.trackPageView("registration", "auth")
    vercelAnalytics.trackConversion("registration")
  }, [])

  const handleLinkedInConnect = async () => {
    setIsLoading(true)
    try {
      // Track LinkedIn connection attempt
      vercelAnalytics.trackEvent("linkedin_connect_attempt", {
        step: currentStep,
        user_type: "new_registration",
      })

      // Simulate LinkedIn OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock LinkedIn data with Indian context
      const linkedinData = {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@techcorp.in",
        organization: "TechCorp Solutions Pvt Ltd",
        title: "Chief Executive Officer",
        industry: "Information Technology",
        location: "Bangalore, Karnataka, India",
        experience: [
          {
            title: "Chief Executive Officer",
            company: "TechCorp Solutions Pvt Ltd",
            startDate: "2022-01-01",
            endDate: null,
            isCurrent: true,
            duration: "2+ years",
          },
          {
            title: "Chief Technology Officer",
            company: "InnovateTech India",
            startDate: "2020-01-01",
            endDate: "2021-12-31",
            isCurrent: false,
            duration: "2 years",
          },
        ],
      }

      // Auto-populate form fields
      setFormData((prev) => ({
        ...prev,
        linkedinProfile: "https://linkedin.com/in/rajesh-kumar-ceo",
        name: linkedinData.name,
        email: linkedinData.email,
        organization: linkedinData.organization,
        title: linkedinData.title,
        industry: linkedinData.industry,
        location: linkedinData.location,
        companyLinkedInPage: "https://linkedin.com/company/techcorp-solutions",
      }))

      setVerificationStatus((prev) => ({ ...prev, linkedin: true }))

      // Track successful LinkedIn connection
      vercelAnalytics.trackEvent("linkedin_connect_success", {
        profile_data_imported: true,
        experience_count: linkedinData.experience.length,
      })

      toast({
        title: "LinkedIn Connected",
        description: "Profile data imported successfully",
      })
    } catch (error) {
      vercelAnalytics.trackError("linkedin_connection_failed", error?.toString() || "Unknown error")
      toast({
        title: "LinkedIn Connection Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMCAVerification = async () => {
    if (!formData.cinNumber || !formData.legalEntityName) {
      toast({
        title: "Missing Information",
        description: "Please enter CIN number and legal entity name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      vercelAnalytics.trackEvent("mca_verification_attempt", {
        cin_number: formData.cinNumber,
        company_name: formData.legalEntityName,
      })

      const result = await mcaApiService.verifyCompany(formData.cinNumber, formData.legalEntityName, formData.name)

      if (result.success && result.data) {
        setMcaData(result.data)
        setVerificationStatus((prev) => ({ ...prev, mca: true }))

        vercelAnalytics.trackEvent("mca_verification_success", {
          company_status: result.data.companyStatus,
          director_verified: result.userIsDirector,
        })

        toast({
          title: "MCA Verification Successful",
          description: `Company verified. ${result.userIsDirector ? "You are verified as a director." : ""}`,
        })
      } else {
        vercelAnalytics.trackError("mca_verification_failed", result.error || "Unknown error")
        toast({
          title: "MCA Verification Failed",
          description: result.error || "Unable to verify company details",
          variant: "destructive",
        })
      }
    } catch (error) {
      vercelAnalytics.trackError("mca_verification_error", error?.toString() || "Service error")
      toast({
        title: "MCA Verification Error",
        description: "Service temporarily unavailable",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUdyamVerification = async () => {
    if (!formData.udyamNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter Udyam registration number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      vercelAnalytics.trackEvent("udyam_verification_attempt", {
        udyam_number: formData.udyamNumber,
      })

      const result = await udyamApiService.verifyUdyam(formData.udyamNumber)

      if (result.success && result.data) {
        setUdyamData(result.data)
        setVerificationStatus((prev) => ({ ...prev, udyam: true }))

        vercelAnalytics.trackEvent("udyam_verification_success", {
          enterprise_type: result.data.enterpriseType,
          msme_category: result.badges.join(","),
        })

        toast({
          title: "Udyam Verification Successful",
          description: "MSME registration verified successfully",
        })
      } else {
        vercelAnalytics.trackError("udyam_verification_failed", result.error || "Unknown error")
        toast({
          title: "Udyam Verification Failed",
          description: result.error || "Unable to verify Udyam registration",
          variant: "destructive",
        })
      }
    } catch (error) {
      vercelAnalytics.trackError("udyam_verification_error", error?.toString() || "Service error")
      toast({
        title: "Udyam Verification Error",
        description: "Service temporarily unavailable",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async (type: "email" | "sms" | "aadhaar") => {
    setIsLoading(true)
    try {
      const target = type === "email" ? formData.companyEmail : type === "sms" ? formData.phone : formData.aadhaarNumber

      vercelAnalytics.trackEvent("otp_send_attempt", {
        otp_type: type,
        target_masked: target.slice(0, 3) + "***" + target.slice(-3),
      })

      const success = await sendOTP(target, type)
      if (success) {
        vercelAnalytics.trackEvent("otp_send_success", { otp_type: type })
        toast({
          title: `${type.toUpperCase()} OTP Sent`,
          description: `Verification code sent to your ${type}`,
        })
      }
    } catch (error) {
      vercelAnalytics.trackError("otp_send_failed", error?.toString() || "Unknown error", type)
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = (type: "email" | "sms" | "aadhaar") => {
    const otpValue = type === "email" ? formData.emailOTP : type === "sms" ? formData.smsOTP : formData.aadhaarOTP

    // Simple OTP validation (6 digits)
    if (otpValue.length === 6 && /^\d{6}$/.test(otpValue)) {
      setVerificationStatus((prev) => ({ ...prev, [type]: true }))

      vercelAnalytics.trackEvent("otp_verification_success", {
        otp_type: type,
        verification_method: "platform",
      })

      toast({
        title: `${type.toUpperCase()} Verified`,
        description: "Verification successful",
      })
    } else {
      vercelAnalytics.trackError("otp_verification_failed", "Invalid OTP format", type)
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
    }
  }

  const handlePhoneChange = (value: string) => {
    // Only allow 10 digits for Indian mobile numbers
    const cleaned = value.replace(/\D/g, "").slice(0, 10)
    setFormData((prev) => ({ ...prev, phone: cleaned }))
  }

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      vercelAnalytics.trackEvent("payment_attempt", {
        amount: 1000,
        currency: "INR",
        payment_type: "registration_fee",
      })

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setVerificationStatus((prev) => ({ ...prev, payment: true }))

      vercelAnalytics.trackRevenue("premium", 1000, "INR")
      vercelAnalytics.trackConversion("registration", 1000)

      toast({
        title: "Payment Successful",
        description: "Registration fee of ₹1,000 paid successfully",
      })
      setCurrentStep(8)
    } catch (error) {
      vercelAnalytics.trackError("payment_failed", error?.toString() || "Payment error")
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      toast({
        title: "Terms Required",
        description: "Please accept terms and privacy policy",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await register({
        ...formData,
        mcaData,
        udyamData,
        verificationStatus,
      })

      if (result.success) {
        vercelAnalytics.trackConversion("registration")
        vercelAnalytics.trackEvent("registration_complete", {
          user_role: formData.title,
          company_category: formData.companyCategory,
          verification_types: Object.keys(verificationStatus).filter(
            (key) => verificationStatus[key as keyof typeof verificationStatus],
          ),
        })

        toast({
          title: "Registration Submitted",
          description: "Your application is under review by Super Admin",
        })
        router.push("/auth/registration-pending")
      }
    } catch (error) {
      vercelAnalytics.trackError("registration_failed", error?.toString() || "Registration error")
      toast({
        title: "Registration Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return verificationStatus.linkedin && formData.name && formData.email
      case 2:
        return formData.legalEntityName && formData.companyLinkedInPage
      case 3:
        return formData.companyCategory === "msme" ? verificationStatus.udyam : verificationStatus.mca
      case 4:
        return formData.companyEmail && formData.phone.length === 10 && formData.aadhaarNumber
      case 5:
        return verificationStatus.email && verificationStatus.sms && verificationStatus.aadhaar
      case 6:
        return true // Skip privilege selection for now
      case 7:
        return verificationStatus.payment
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "LinkedIn Integration"
      case 2:
        return "Company Information"
      case 3:
        return "Legal Verification"
      case 4:
        return "Contact Information"
      case 5:
        return "Identity Verification"
      case 6:
        return "Platform Access"
      case 7:
        return "Payment"
      case 8:
        return "Terms & Conditions"
      default:
        return "Registration"
    }
  }

  const handleNext = () => {
    if (canProceedToNext()) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      vercelAnalytics.trackEvent("registration_step_complete", {
        step: currentStep,
        next_step: nextStep,
        step_name: getStepTitle(),
      })
    }
  }

  const handlePrevious = () => {
    const prevStep = currentStep - 1
    setCurrentStep(prevStep)
    vercelAnalytics.trackNavigation({
      fromPage: `registration_step_${currentStep}`,
      toPage: `registration_step_${prevStep}`,
    })
  }

  // Mobile-optimized layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-blue-600">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Join CXO Network</h1>
              <p className="text-xs text-gray-500">Step {currentStep} of 8</p>
            </div>
            <div className="w-16"></div> {/* Spacer */}
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-4">
            <Progress value={(currentStep / 8) * 100} className="h-2" />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Connect your LinkedIn profile to get started"}
                {currentStep === 2 && "Enter your company's legal information"}
                {currentStep === 3 && "Verify your company's legal status"}
                {currentStep === 4 && "Provide your contact information"}
                {currentStep === 5 && "Verify your identity with OTP"}
                {currentStep === 6 && "Choose your platform access level"}
                {currentStep === 7 && "Complete payment to proceed"}
                {currentStep === 8 && "Review and accept terms"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: LinkedIn Integration */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      LinkedIn profile is mandatory for registration on this platform.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleLinkedInConnect}
                    disabled={isLoading}
                    className="w-full bg-[#0077B5] hover:bg-[#006699] text-white py-4 rounded-xl"
                  >
                    <Linkedin className="h-5 w-5 mr-2" />
                    {isLoading ? "Connecting..." : "Connect with LinkedIn"}
                  </Button>

                  {verificationStatus.linkedin && (
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">LinkedIn Connected</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => updateFormData("name", e.target.value)}
                            className="mt-1 rounded-xl"
                            readOnly
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">LinkedIn Email</Label>
                          <Input
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            className="mt-1 rounded-xl"
                            readOnly
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Organization</Label>
                          <Input
                            value={formData.organization}
                            onChange={(e) => updateFormData("organization", e.target.value)}
                            className="mt-1 rounded-xl"
                            readOnly
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Executive Title</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => updateFormData("title", e.target.value)}
                            className="mt-1 rounded-xl"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Company Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Legal Entity Name *</Label>
                    <Input
                      placeholder="Enter exact legal entity name"
                      value={formData.legalEntityName}
                      onChange={(e) => updateFormData("legalEntityName", e.target.value)}
                      className="mt-1 rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must match exactly with MCA/Udyam records</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Company Category *</Label>
                    <Select
                      value={formData.companyCategory}
                      onValueChange={(value) => updateFormData("companyCategory", value)}
                    >
                      <SelectTrigger className="mt-1 rounded-xl">
                        <SelectValue placeholder="Select company category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_limited">Private Limited Company</SelectItem>
                        <SelectItem value="public_company">Public Limited Company</SelectItem>
                        <SelectItem value="msme">MSME (Micro, Small & Medium Enterprise)</SelectItem>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="mnc">Multinational Corporation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.companyCategory === "private_limited" ||
                    formData.companyCategory === "public_company") && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">CIN Number *</Label>
                      <Input
                        placeholder="U12345AB2020PTC123456"
                        value={formData.cinNumber}
                        onChange={(e) => updateFormData("cinNumber", e.target.value.toUpperCase())}
                        className="mt-1 rounded-xl"
                        maxLength={21}
                      />
                      <p className="text-xs text-gray-500 mt-1">Corporate Identity Number from MCA</p>
                    </div>
                  )}

                  {formData.companyCategory === "msme" && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Udyam Number *</Label>
                      <Input
                        placeholder="UDYAM-KA-03-0123456"
                        value={formData.udyamNumber}
                        onChange={(e) => updateFormData("udyamNumber", e.target.value.toUpperCase())}
                        className="mt-1 rounded-xl"
                        maxLength={19}
                      />
                      <p className="text-xs text-gray-500 mt-1">Udyam Registration Number for MSME</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Company LinkedIn Page *</Label>
                    <Input
                      placeholder="https://linkedin.com/company/your-company"
                      value={formData.companyLinkedInPage}
                      onChange={(e) => updateFormData("companyLinkedInPage", e.target.value)}
                      className="mt-1 rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">You must have admin privileges on this page</p>
                  </div>
                </div>
              )}

              {/* Step 3: Legal Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {formData.companyCategory === "msme" ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Shield className="h-5 w-5" />
                          Udyam Verification
                        </CardTitle>
                        <CardDescription>Verify your MSME registration</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Enterprise:</span> {formData.legalEntityName}
                            </p>
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Udyam:</span> {formData.udyamNumber}
                            </p>
                          </div>

                          {!verificationStatus.udyam ? (
                            <Button
                              onClick={handleUdyamVerification}
                              disabled={isLoading}
                              className="w-full rounded-xl"
                            >
                              {isLoading ? "Verifying..." : "Verify with Udyam"}
                            </Button>
                          ) : (
                            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center">
                                <Verified className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-green-700 font-medium">Udyam Verified</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Shield className="h-5 w-5" />
                          MCA Verification
                        </CardTitle>
                        <CardDescription>Verify with Ministry of Corporate Affairs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Company:</span> {formData.legalEntityName}
                            </p>
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">CIN:</span> {formData.cinNumber}
                            </p>
                          </div>

                          {!verificationStatus.mca ? (
                            <Button onClick={handleMCAVerification} disabled={isLoading} className="w-full rounded-xl">
                              {isLoading ? "Verifying..." : "Verify with MCA"}
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center">
                                  <Verified className="h-5 w-5 text-green-500 mr-2" />
                                  <span className="text-green-700 font-medium">MCA Verified</span>
                                </div>
                              </div>

                              {mcaData && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Company Status: {mcaData.companyStatus}</p>
                                  <p className="text-sm text-gray-600">Registration: {mcaData.dateOfIncorporation}</p>
                                  {mcaData.directors && mcaData.directors.length > 0 && (
                                    <div>
                                      <p className="text-sm font-medium">Directors Found:</p>
                                      {mcaData.directors.slice(0, 2).map((director: any, index: number) => (
                                        <div key={index} className="text-xs text-gray-600 ml-2">
                                          • {director.name} - {director.designation}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 4: Contact Information */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Company Email *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@company.com"
                        value={formData.companyEmail}
                        onChange={(e) => updateFormData("companyEmail", e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Official company email address</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mobile Number *</Label>
                    <div className="relative mt-1">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <div className="absolute left-10 top-3 text-sm text-gray-500">+91</div>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="pl-16 rounded-xl"
                        maxLength={10}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      10-digit Indian mobile number • {formData.phone.length}/10
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Location</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Aadhaar Number *</Label>
                    <div className="relative mt-1">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="1234 5678 9012"
                        value={formData.aadhaarNumber}
                        onChange={(e) => updateFormData("aadhaarNumber", e.target.value)}
                        className="pl-10 rounded-xl"
                        maxLength={14}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Required for identity verification</p>
                  </div>
                </div>
              )}

              {/* Step 5: OTP Verification */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  {/* Email OTP */}
                  <div className="p-4 bg-white rounded-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">Email Verification</Label>
                      {verificationStatus.email ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleSendOTP("email")} className="rounded-full">
                          Send OTP
                        </Button>
                      )}
                    </div>

                    {!verificationStatus.email && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter 6-digit OTP"
                          value={formData.emailOTP}
                          onChange={(e) => updateFormData("emailOTP", e.target.value)}
                          maxLength={6}
                          className="text-center font-mono rounded-xl"
                        />
                        <Button
                          onClick={() => handleVerifyOTP("email")}
                          disabled={!formData.emailOTP}
                          className="rounded-xl"
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* SMS OTP */}
                  <div className="p-4 bg-white rounded-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">SMS Verification</Label>
                      {verificationStatus.sms ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleSendOTP("sms")} className="rounded-full">
                          Send OTP
                        </Button>
                      )}
                    </div>

                    {!verificationStatus.sms && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter 6-digit OTP"
                          value={formData.smsOTP}
                          onChange={(e) => updateFormData("smsOTP", e.target.value)}
                          maxLength={6}
                          className="text-center font-mono rounded-xl"
                        />
                        <Button
                          onClick={() => handleVerifyOTP("sms")}
                          disabled={!formData.smsOTP}
                          className="rounded-xl"
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Aadhaar OTP */}
                  <div className="p-4 bg-white rounded-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">Aadhaar Verification</Label>
                      {verificationStatus.aadhaar ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleSendOTP("aadhaar")} className="rounded-full">
                          Send OTP
                        </Button>
                      )}
                    </div>

                    {!verificationStatus.aadhaar && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter 6-digit OTP"
                          value={formData.aadhaarOTP}
                          onChange={(e) => updateFormData("aadhaarOTP", e.target.value)}
                          maxLength={6}
                          className="text-center font-mono rounded-xl"
                        />
                        <Button
                          onClick={() => handleVerifyOTP("aadhaar")}
                          disabled={!formData.aadhaarOTP}
                          className="rounded-xl"
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Platform Access */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Welcome to ExecSphere</h3>
                    <p className="text-sm text-gray-600">You're joining India's premier executive network</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <h4 className="font-medium text-blue-800">✓ Executive Networking</h4>
                      <p className="text-xs text-blue-700">Connect with verified C-level executives</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl">
                      <h4 className="font-medium text-green-800">✓ Smart Connections</h4>
                      <p className="text-xs text-green-700">AI-powered professional matching</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <h4 className="font-medium text-purple-800">✓ Mentorship Access</h4>
                      <p className="text-xs text-purple-700">Learn from industry leaders</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Payment */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                    <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">₹1,000</h3>
                    <p className="text-sm text-gray-600">One-time Registration Fee</p>
                  </div>

                  {!verificationStatus.payment ? (
                    <Button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl"
                    >
                      {isLoading ? "Processing Payment..." : "Pay ₹1,000 Now"}
                    </Button>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="font-medium text-green-800">Payment Successful</p>
                        <p className="text-sm text-green-600">Transaction ID: TXN{Date.now()}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      Secure payment via Razorpay
                    </p>
                    <p className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      Refundable if application rejected
                    </p>
                    <p className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      GST included
                    </p>
                  </div>
                </div>
              )}

              {/* Step 8: Terms & Conditions */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Almost Done!</h3>
                    <p className="text-sm text-gray-600">Please review and accept our terms</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptedTerms}
                        onCheckedChange={(checked) => updateFormData("acceptedTerms", checked)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I accept the{" "}
                        <Link href="/terms" className="text-blue-600 font-medium">
                          Terms of Service
                        </Link>{" "}
                        and understand that my application will be reviewed by our team.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border">
                      <Checkbox
                        id="privacy"
                        checked={formData.acceptedPrivacy}
                        onCheckedChange={(checked) => updateFormData("acceptedPrivacy", checked)}
                      />
                      <Label htmlFor="privacy" className="text-sm leading-relaxed">
                        I accept the{" "}
                        <Link href="/privacy" className="text-blue-600 font-medium">
                          Privacy Policy
                        </Link>{" "}
                        and consent to data processing for platform services.
                      </Label>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Your registration will be reviewed within 24-48 hours. You'll receive login access after approval.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Navigation */}
          <div className="flex justify-between items-center">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} className="rounded-full bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            <div className="flex-1"></div>

            {currentStep < 8 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.acceptedTerms || !formData.acceptedPrivacy || isLoading}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-slate-600">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link>
      </div>

      <div className="container max-w-2xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Join ExecSphere</h1>
          <p className="text-slate-500 mt-2">India's Premier Executive Platform</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step < currentStep
                  ? "bg-blue-500 text-white"
                  : step === currentStep
                    ? "bg-blue-100 text-blue-600 ring-2 ring-blue-200"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">{getStepTitle()}</h2>
          <p className="text-sm text-slate-500">Step {currentStep} of 8</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">{getStepTitle()}</h2>
          <p className="text-sm text-slate-500">Step {currentStep} of 8</p>
        </div>

        {/* Desktop content would be similar to mobile but with different styling */}
        <Card>
          <CardContent className="pt-6">
            {/* Same step content as mobile but with desktop styling */}
            {/* ... (implement all steps similar to mobile version) ... */}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious} className="rounded-full border-slate-200 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          <div className="ml-auto">
            {currentStep < 8 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.acceptedTerms || !formData.acceptedPrivacy || isLoading}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

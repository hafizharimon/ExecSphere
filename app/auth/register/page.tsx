"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  Linkedin,
  Mail,
  Phone,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // LinkedIn Data
    linkedinProfile: "",
    name: "",
    email: "",
    organization: "",
    title: "",

    // Additional Info
    industry: "",
    yearsExperience: "",
    region: "",
    companyEmail: "",
    phone: "",
    aadhaarNumber: "",

    // Verification
    emailOTP: "",
    smsOTP: "",
    aadhaarOTP: "",

    // Privileges
    selectedPrivileges: [] as string[],

    // Payment
    paymentMethod: "",

    // Terms
    acceptedTerms: false,
    acceptedPrivacy: false,
  })

  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    sms: false,
    aadhaar: false,
    payment: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const { register, sendOTP, verifyPayment } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const availablePrivileges = [
    {
      id: "networking",
      label: "Executive Networking",
      description: "Connect with C-level executives",
      icon: "👥",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "mentorship",
      label: "Mentorship Program",
      description: "Access to mentors and mentees",
      icon: "🎯",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "events",
      label: "Exclusive Events",
      description: "Webinars, summits, and roundtables",
      icon: "📅",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "forums",
      label: "Discussion Forums",
      description: "Role-specific discussion groups",
      icon: "💬",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "analytics",
      label: "Industry Analytics",
      description: "Market insights and reports",
      icon: "📊",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "advisory",
      label: "Advisory Services",
      description: "Strategic consulting opportunities",
      icon: "🎓",
      gradient: "from-teal-500 to-blue-500",
    },
  ]

  const handleLinkedInConnect = () => {
    toast({
      title: "LinkedIn Connected",
      description: "Profile data imported successfully",
    })

    setFormData((prev) => ({
      ...prev,
      linkedinProfile: "https://linkedin.com/in/demo-user",
      name: "Demo Executive",
      organization: "Demo Corporation",
      title: "Chief Executive Officer",
      industry: "Technology",
      yearsExperience: "15",
    }))
  }

  const handleSendOTP = async (type: "email" | "sms" | "aadhaar") => {
    setIsLoading(true)
    try {
      const target = type === "email" ? formData.companyEmail : type === "sms" ? formData.phone : formData.aadhaarNumber

      const success = await sendOTP(target, type)
      if (success) {
        toast({
          title: `${type.toUpperCase()} OTP Sent`,
          description: `Verification code sent to your ${type}`,
        })
      }
    } catch (error) {
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
    const otpPattern = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]$/

    if (otpPattern.test(otpValue)) {
      setVerificationStatus((prev) => ({ ...prev, [type]: true }))
      toast({
        title: `${type.toUpperCase()} Verified`,
        description: "Verification successful",
      })
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter OTP in format: AZ47E5",
        variant: "destructive",
      })
    }
  }

  const handlePrivilegeToggle = (privilegeId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPrivileges: prev.selectedPrivileges.includes(privilegeId)
        ? prev.selectedPrivileges.filter((id) => id !== privilegeId)
        : [...prev.selectedPrivileges, privilegeId],
    }))
  }

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const result = await register(formData)
      if (result.success && result.paymentUrl) {
        toast({
          title: "Redirecting to Payment",
          description: "You will be redirected to complete payment of ₹1,000",
        })

        setTimeout(() => {
          setVerificationStatus((prev) => ({ ...prev, payment: true }))
          toast({
            title: "Payment Successful",
            description: "Registration fee paid successfully",
          })
          setCurrentStep(5)
        }, 2000)
      }
    } catch (error) {
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

    toast({
      title: "Registration Submitted",
      description: "Your application is under review by Super Admin",
    })

    router.push("/auth/registration-pending")
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.linkedinProfile && formData.name && formData.email
      case 2:
        return formData.companyEmail && formData.phone && formData.aadhaarNumber
      case 3:
        return verificationStatus.email && verificationStatus.sms && verificationStatus.aadhaar
      case 4:
        return formData.selectedPrivileges.length > 0
      case 5:
        return verificationStatus.payment
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-white">NexLink Hub</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-3 mb-6">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  step <= currentStep ? "bg-white shadow-lg" : step === currentStep + 1 ? "bg-white/50" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <p className="text-white/80 text-sm">Step {currentStep} of 6</p>
        </div>

        <Card className="rounded-3xl card-shadow border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Executive Registration
            </CardTitle>
            <CardDescription className="text-base">Join the exclusive network of C-level executives</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8">
            {/* Step 1: LinkedIn Integration */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3">Connect with LinkedIn</h3>
                  <p className="text-slate-600 mb-6">Import your professional profile from LinkedIn</p>
                  <Button
                    onClick={handleLinkedInConnect}
                    className="w-full rounded-2xl gradient-bg border-0 shadow-lg text-lg py-6"
                    size="lg"
                  >
                    <Linkedin className="h-5 w-5 mr-3" />
                    Connect LinkedIn Profile
                  </Button>
                </div>

                {formData.linkedinProfile && (
                  <div className="space-y-6 mt-8">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">LinkedIn Connected</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className="rounded-xl border-slate-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          LinkedIn Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className="rounded-xl border-slate-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization" className="text-sm font-medium">
                          Organization
                        </Label>
                        <Input
                          id="organization"
                          value={formData.organization}
                          onChange={(e) => updateFormData("organization", e.target.value)}
                          className="rounded-xl border-slate-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Executive Title
                        </Label>
                        <Select value={formData.title} onValueChange={(value) => updateFormData("title", value)}>
                          <SelectTrigger className="rounded-xl border-slate-200">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CEO">CEO</SelectItem>
                            <SelectItem value="CTO">CTO</SelectItem>
                            <SelectItem value="CFO">CFO</SelectItem>
                            <SelectItem value="COO">COO</SelectItem>
                            <SelectItem value="CMO">CMO</SelectItem>
                            <SelectItem value="CHRO">CHRO</SelectItem>
                            <SelectItem value="CPO">CPO</SelectItem>
                            <SelectItem value="Other">Other C-Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Contact & Verification Details</h3>
                  <p className="text-slate-600">Provide your contact information for verification</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail" className="text-sm font-medium">
                      Company Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="companyEmail"
                        type="email"
                        placeholder="your@company.com"
                        value={formData.companyEmail}
                        onChange={(e) => updateFormData("companyEmail", e.target.value)}
                        className="pl-10 rounded-xl border-slate-200"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500">Must be your official company email address</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="pl-10 rounded-xl border-slate-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar" className="text-sm font-medium">
                      Aadhaar Number *
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="aadhaar"
                        type="text"
                        placeholder="1234 5678 9012"
                        value={formData.aadhaarNumber}
                        onChange={(e) => updateFormData("aadhaarNumber", e.target.value)}
                        className="pl-10 rounded-xl border-slate-200"
                        maxLength={14}
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500">Required for enhanced security verification</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium">
                        Industry
                      </Label>
                      <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                        <SelectTrigger className="rounded-xl border-slate-200">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Energy">Energy</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-sm font-medium">
                        Region
                      </Label>
                      <Input
                        id="region"
                        placeholder="e.g., Mumbai, Delhi, Bangalore"
                        value={formData.region}
                        onChange={(e) => updateFormData("region", e.target.value)}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: OTP Verification */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Multi-Factor Verification</h3>
                  <p className="text-slate-600">Verify your identity through multiple channels</p>
                </div>

                {/* Email OTP */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Email Verification</Label>
                    {verificationStatus.email ? (
                      <Badge className="bg-green-500 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleSendOTP("email")} className="rounded-full">
                        Send OTP
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter OTP (e.g., AZ47E5)"
                      value={formData.emailOTP}
                      onChange={(e) => updateFormData("emailOTP", e.target.value.toUpperCase())}
                      maxLength={6}
                      disabled={verificationStatus.email}
                      className="rounded-xl border-slate-200 text-center font-mono text-lg tracking-wider"
                    />
                    <Button
                      onClick={() => handleVerifyOTP("email")}
                      disabled={verificationStatus.email || !formData.emailOTP}
                      className="rounded-xl"
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {/* SMS OTP */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">SMS Verification</Label>
                    {verificationStatus.sms ? (
                      <Badge className="bg-green-500 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleSendOTP("sms")} className="rounded-full">
                        Send OTP
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter OTP (e.g., AZ47E5)"
                      value={formData.smsOTP}
                      onChange={(e) => updateFormData("smsOTP", e.target.value.toUpperCase())}
                      maxLength={6}
                      disabled={verificationStatus.sms}
                      className="rounded-xl border-slate-200 text-center font-mono text-lg tracking-wider"
                    />
                    <Button
                      onClick={() => handleVerifyOTP("sms")}
                      disabled={verificationStatus.sms || !formData.smsOTP}
                      className="rounded-xl"
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {/* Aadhaar OTP */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Aadhaar Verification</Label>
                    {verificationStatus.aadhaar ? (
                      <Badge className="bg-green-500 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleSendOTP("aadhaar")} className="rounded-full">
                        Send OTP
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter OTP (e.g., AZ47E5)"
                      value={formData.aadhaarOTP}
                      onChange={(e) => updateFormData("aadhaarOTP", e.target.value.toUpperCase())}
                      maxLength={6}
                      disabled={verificationStatus.aadhaar}
                      className="rounded-xl border-slate-200 text-center font-mono text-lg tracking-wider"
                    />
                    <Button
                      onClick={() => handleVerifyOTP("aadhaar")}
                      disabled={verificationStatus.aadhaar || !formData.aadhaarOTP}
                      className="rounded-xl"
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-sm text-blue-800">
                    <strong>Demo OTP Format:</strong> Use format like AZ47E5 (2 letters + 2 numbers + 1 letter + 1
                    number)
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Privilege Selection */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Select Your Privileges</h3>
                  <p className="text-slate-600">Choose the platform features you'd like access to</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePrivileges.map((privilege) => (
                    <div
                      key={privilege.id}
                      className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                        formData.selectedPrivileges.includes(privilege.id)
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => handlePrivilegeToggle(privilege.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={privilege.id}
                          checked={formData.selectedPrivileges.includes(privilege.id)}
                          onChange={() => handlePrivilegeToggle(privilege.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl">{privilege.icon}</span>
                            <Label htmlFor={privilege.id} className="font-medium cursor-pointer">
                              {privilege.label}
                            </Label>
                          </div>
                          <p className="text-sm text-slate-600">{privilege.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.selectedPrivileges.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="text-sm text-green-800 font-medium">
                      Selected {formData.selectedPrivileges.length} privilege(s)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Registration Fee</h3>
                  <p className="text-slate-600">Secure your membership with a one-time registration fee</p>
                </div>

                <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-3xl font-bold mb-2">₹1,000</h4>
                  <p className="text-slate-600 mb-6">One-time Registration Fee</p>

                  {!verificationStatus.payment ? (
                    <Button
                      onClick={handlePayment}
                      disabled={isLoading}
                      size="lg"
                      className="rounded-2xl gradient-bg border-0 shadow-lg px-8 py-3"
                    >
                      {isLoading ? "Processing..." : "Pay Now"}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Badge className="bg-green-500 text-white px-4 py-2 rounded-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Payment Successful
                      </Badge>
                      <p className="text-sm text-green-600 font-medium">Transaction ID: TXN123456789</p>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Secure payment processing</p>
                  <p>• Refundable if application is rejected</p>
                  <p>• All major payment methods accepted</p>
                </div>
              </div>
            )}

            {/* Step 6: Terms and Submission */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
                  <p className="text-slate-600">Review and accept our terms to complete registration</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-2xl">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptedTerms}
                      onCheckedChange={(checked) => updateFormData("acceptedTerms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                      I accept the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                        Terms of Service
                      </Link>{" "}
                      and understand that my application will be reviewed by the Super Admin.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-slate-200 rounded-2xl">
                    <Checkbox
                      id="privacy"
                      checked={formData.acceptedPrivacy}
                      onCheckedChange={(checked) => updateFormData("acceptedPrivacy", checked)}
                    />
                    <Label htmlFor="privacy" className="text-sm cursor-pointer leading-relaxed">
                      I accept the{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>{" "}
                      and consent to data processing.
                    </Label>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Important Notice</p>
                      <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                        Your registration will be reviewed by our Super Admin team. You will receive login access only
                        after approval. This process typically takes 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between px-8 pb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="rounded-2xl border-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 6 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNext()}
                className="rounded-2xl gradient-bg border-0 shadow-lg"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.acceptedTerms || !formData.acceptedPrivacy}
                className="rounded-2xl gradient-bg border-0 shadow-lg"
              >
                Submit Application
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

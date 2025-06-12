"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Linkedin,
  Mail,
  Phone,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Briefcase,
  MapPin,
  Lock,
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
    },
    {
      id: "mentorship",
      label: "Mentorship Program",
      description: "Access to mentors and mentees",
      icon: "🎯",
    },
    {
      id: "events",
      label: "Exclusive Events",
      description: "Webinars, summits, and roundtables",
      icon: "📅",
    },
    {
      id: "forums",
      label: "Discussion Forums",
      description: "Role-specific discussion groups",
      icon: "💬",
    },
    {
      id: "analytics",
      label: "Industry Analytics",
      description: "Market insights and reports",
      icon: "📊",
    },
    {
      id: "advisory",
      label: "Advisory Services",
      description: "Strategic consulting opportunities",
      icon: "🎓",
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "LinkedIn Integration"
      case 2:
        return "Contact Information"
      case 3:
        return "Verification"
      case 4:
        return "Select Privileges"
      case 5:
        return "Payment"
      case 6:
        return "Terms & Conditions"
      default:
        return "Registration"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-slate-600">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link>
      </div>
      
      <div className="container max-w-md mx-auto px-6 pb-16">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-1">Join the executive network</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div 
              key={step} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step < currentStep 
                  ? 'bg-primary text-white' 
                  : step === currentStep 
                    ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-200' 
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">{getStepTitle()}</h2>
          <p className="text-sm text-slate-500">Step {currentStep} of 6</p>
        </div>
        
        <div className="space-y-6">
          {/* Step 1: LinkedIn Integration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Button 
                onClick={handleLinkedInConnect} 
                className="w-full flex items-center justify-center space-x-2 bg-[#0077B5] hover:bg-[#006699] text-white rounded-full py-3 px-4"
              >
                <Linkedin className="h-5 w-5" />
                <span>Connect with LinkedIn</span>
              </Button>
              
              {formData.linkedinProfile && (
                <div className="space-y-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 text-sm font-medium">LinkedIn Connected</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className="nexlink-input pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">LinkedIn Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className="nexlink-input pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-sm font-medium text-slate-700">Organization</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          id="organization"
                          value={formData.organization}
                          onChange={(e) => updateFormData("organization", e.target.value)}
                          className="nexlink-input pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-slate-700">Executive Title</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-slate-400" />
                        </div>
                        <Select value={formData.title} onValueChange={(value) => updateFormData("title", value)}>
                          <SelectTrigger className="nexlink-input pl-10">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
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
                </div>
              )}
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyEmail" className="text-sm font-medium text-slate-700">Company Email *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="your@company.com"
                    value={formData.companyEmail}
                    onChange={(e) => updateFormData("companyEmail", e.target.value)}
                    className="nexlink-input pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Must be your official company email address</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Mobile Number *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="nexlink-input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="text-sm font-medium text-slate-700">Aadhaar Number *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="1234 5678 9012"
                    value={formData.aadhaarNumber}
                    onChange={(e) => updateFormData("aadhaarNumber", e.target.value)}
                    className="nexlink-input pl-10"
                    maxLength={14}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Required for enhanced security verification</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-slate-700">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <SelectTrigger className="nexlink-input">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
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
                  <Label htmlFor="region" className="text-sm font-medium text-slate-700">Region</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      id="region"
                      placeholder="e.g., Mumbai"
                      value={formData.region}
                      onChange={(e) => updateFormData("region", e.target.value)}
                      className="nexlink-input pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Email OTP */}
              <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-slate-800">Email Verification</Label>
                  {verificationStatus.email ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleSendOTP("email")}
                      className="rounded-full text-xs px-3"
                    >
                      Send OTP
                    </Button>
                  )}
                </div>
                
                {!verificationStatus.email && (
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <Input
                        placeholder="Enter OTP"
                        value={formData.emailOTP}
                        onChange={(e) => updateFormData("emailOTP", e.target.value.toUpperCase())}
                        maxLength={6}
                        className="nexlink-input pl-10 text-center font-mono"
                      />
                    </div>
                    <Button
                      onClick={() => handleVerifyOTP("email")}
                      disabled={!formData.emailOTP}
                      className="rounded-full"
                    >
                      Verify
                    </Button>
                  </div>
                )}
              </div>

              {/* SMS OTP */}
              <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-slate-800">SMS Verification</Label>
                  {verificationStatus.sms ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleSendOTP("sms")}
                      className="rounded-full text-xs px-3"
                    >
                      Send OTP
                    </Button>
                  )}
                </div>
                
                {!verificationStatus.sms && (
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <Input
                        placeholder="Enter OTP"
                        value={formData.smsOTP}
                        onChange={(e) => updateFormData("smsOTP", e.target.value.toUpperCase())}
                        maxLength={6}
                        className="nexlink-input pl-10 text-center font-mono"
                      />
                    </div>
                    <Button
                      onClick={() => handleVerifyOTP("sms")}
                      disabled={!formData.smsOTP}
                      className="rounded-full"
                    >
                      Verify
                    </Button>
                  </div>
                )}
              </div>

              {/* Aadhaar OTP */}
              <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-slate-800">Aadhaar Verification</Label>
                  {verificationStatus.aadhaar ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleSendOTP("aadhaar")}
                      className="rounded-full text-xs px-3"
                    >
                      Send OTP
                    </Button>
                  )}
                </div>
                
                {!verificationStatus.aadhaar && (
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <Input
                        placeholder="Enter OTP"
                        value={formData.aadhaarOTP}
                        onChange={(e) => updateFormData("aadhaarOTP", e.target.value.toUpperCase())}
                        maxLength={6}
                        className="nexlink-input pl-10 text-center font-mono"
                      />
                    </div>
                    <Button
                      onClick={() => handleVerifyOTP("aadhaar")}
                      disabled={!formData.aadhaarOTP}
                      className="rounded-full"
                    >
                      Verify
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Demo OTP Format:</span> Use format like AZ47E5 (2 letters + 2 numbers + 1 letter + 1 number)
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Privilege Selection */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-2">Choose the platform features you'd like access to</p>
              
              <div className="space-y-3">
                {availablePrivileges.map((privilege) => (
                  <div
                    key={privilege.id}
                    className={`p-4 rounded-xl border ${
                      formData.selectedPrivileges.includes(privilege.id)
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-slate-200'
                    }`}
                    onClick={() => handlePrivilegeToggle(privilege.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center">
                        <Checkbox
                          id={privilege.id}
                          checked={formData.selectedPrivileges.includes(privilege.id)}
                          onCheckedChange={() => handlePrivilegeToggle(privilege.id)}
                          className="rounded-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{privilege.icon}</span>
                          <Label
                            htmlFor={privilege.id}
                            className="text-base font-medium cursor-pointer"
                          >
                            {privilege.label}
                          </Label>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{privilege.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.selectedPrivileges.length > 0 && (
                <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 text-sm">
                    Selected {formData.selectedPrivileges.length} privilege(s)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border-2 border-slate-200 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">₹1,000</h3>
                <p className="text-slate-600 mb-6">One-time Registration Fee</p>

                {!verificationStatus.payment ? (
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="nexlink-btn w-full"
                  >
                    {isLoading ? "Processing..." : "Pay Now"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Payment Successful
                    </div>
                    <p className="text-sm text-green-600">Transaction ID: TXN123456789</p>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Secure payment processing
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Refundable if application is rejected
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  All major payment methods accepted
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Terms and Submission */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptedTerms}
                      onCheckedChange={(checked) => updateFormData("acceptedTerms", checked)}
                    />
                  </div>
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I accept the{" "}
                    <Link href="/terms" className="text-primary-600 font-medium">
                      Terms of Service
                    </Link>{" "}
                    and understand that my application will be reviewed by the Super Admin.
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="privacy"
                      checked={formData.acceptedPrivacy}
                      onCheckedChange={(checked) => updateFormData("acceptedPrivacy", checked)}
                    />
                  </div>
                  <Label htmlFor="privacy" className="text-sm cursor-pointer">
                    I accept the{" "}
                    <Link href="/privacy" className="text-primary-600 font-medium">
                      Privacy Policy
                    </Link>{" "}
                    and consent to data processing.
                  </Label>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Important Notice</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Your registration will be reviewed by our Super Admin team. You will receive login access only
                      after approval. This process typically takes 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          \

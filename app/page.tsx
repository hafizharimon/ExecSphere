import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  MessageSquare,
  Calendar,
  Shield,
  Award,
  Globe,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "Smart Connections",
      description: "AI-powered networking with C-level executives across industries",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Secure Messaging",
      description: "Encrypted conversations and role-specific discussion forums",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Private webinars, summits, and networking opportunities",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Verified Network",
      description: "Invite-only platform with rigorous executive verification",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Award,
      title: "Mentorship Hub",
      description: "Connect with seasoned executives or share your expertise",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with leaders across continents and industries",
      gradient: "from-teal-500 to-blue-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, InnovateTech",
      content: "NexLink Hub has revolutionized my professional networking. The quality of connections is unmatched.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "CFO, Global Finance",
      content: "The mentorship opportunities have been invaluable for both learning and guiding other executives.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Jennifer Kim",
      role: "CEO, HealthTech Solutions",
      content: "Finally, a platform designed specifically for C-level professionals with authentic connections.",
      rating: 5,
      avatar: "JK",
    },
  ]

  const stats = [
    { number: "1,200+", label: "Verified Executives", icon: Users },
    { number: "50+", label: "Industries", icon: Building2 },
    { number: "25+", label: "Countries", icon: Globe },
    { number: "98%", label: "Satisfaction", icon: Star },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center glass-effect border-b border-white/20">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            NexLink Hub
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="rounded-full gradient-bg border-0 shadow-lg hover:shadow-xl transition-all">
              Join Network
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                Trusted by 1,200+ C-Level Executives
              </Badge>

              <div className="space-y-6 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Connect. Collaborate.
                  </span>
                  <br />
                  <span className="text-slate-800">Elevate.</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
                  An exclusive networking platform for C-level executives to connect with peers across industries. Join
                  the most influential business leaders worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link href="/auth/register" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full rounded-2xl gradient-bg border-0 shadow-xl hover:shadow-2xl transition-all text-lg py-6"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-2xl border-2 border-blue-200 hover:border-blue-300 text-lg py-6"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Demo Login Info */}
              <Card className="mt-8 p-4 bg-blue-50/80 backdrop-blur-sm border-blue-200 max-w-md rounded-2xl">
                <div className="text-center">
                  <p className="text-sm text-blue-800 font-medium mb-2">Try the Demo:</p>
                  <div className="text-xs text-blue-600 space-y-1">
                    <p>
                      <strong>Email:</strong> test@demo.com
                    </p>
                    <p>
                      <strong>OTP:</strong> AZ47E5
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-white/50 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center p-6 rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{stat.number}</div>
                  <p className="text-slate-600">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Exclusive Features
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tailored tools and experiences designed specifically for C-level professionals
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group p-6 rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base text-slate-600">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Trusted by Industry Leaders</h2>
              <p className="text-lg text-slate-600">See what executives are saying about NexLink Hub</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 rounded-2xl card-shadow border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic text-slate-700 mb-6">
                      "{testimonial.content}"
                    </CardDescription>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                        <span className="text-white font-medium">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 gradient-bg text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Ready to Join the Elite Network?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-blue-100">
                  Request an invitation to connect with the world's most influential business leaders. Membership is by
                  invitation only.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link href="/auth/register" className="flex-1">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full rounded-2xl text-lg py-6 bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Request Invitation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login" className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl text-lg py-6 border-white/30 text-white hover:bg-white/10"
                  >
                    Already a Member?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white/80 backdrop-blur-sm">
        <p className="text-xs text-slate-600">© 2024 NexLink Hub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-600 hover:text-blue-600">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-600 hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-600 hover:text-blue-600">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}

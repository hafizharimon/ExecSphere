import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MessageSquare, Calendar, Shield, Award, Globe, Star, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "Smart Matchmaking",
      description: "AI-powered connections with executives in complementary industries and roles",
    },
    {
      icon: MessageSquare,
      title: "Secure Messaging",
      description: "Encrypted 1:1 conversations and role-specific discussion forums",
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Private webinars, roundtables, and networking events for verified executives",
    },
    {
      icon: Shield,
      title: "Verified Network",
      description: "Invite-only platform with rigorous verification of executive roles and organizations",
    },
    {
      icon: Award,
      title: "Mentorship Program",
      description: "Connect with seasoned executives for guidance or share your expertise with rising leaders",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with C-level executives across industries and continents",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, InnovateTech",
      content:
        "CXO Network has transformed how I connect with fellow executives. The quality of conversations and insights is unmatched.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "CFO, Global Finance",
      content:
        "The mentorship opportunities alone have been invaluable. I've both learned from and guided other executives in meaningful ways.",
      rating: 5,
    },
    {
      name: "Jennifer Kim",
      role: "CEO, HealthTech Solutions",
      content:
        "Finally, a platform designed specifically for C-level professionals. The verification process ensures authentic, high-quality connections.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "1,200+", label: "Verified Executives" },
    { number: "50+", label: "Industries Represented" },
    { number: "25+", label: "Countries" },
    { number: "98%", label: "Satisfaction Rate" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center justify-center">
          <Building2 className="h-6 w-6" />
          <span className="ml-2 font-bold">CXO Network</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="sm">
              Join Network
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge variant="secondary" className="mb-4">
                <Star className="h-3 w-3 mr-1" />
                Trusted by 1,200+ C-Level Executives
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Connect. Collaborate. Consult.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  An exclusive networking platform for C-level executives to connect with peers across industries. Join
                  the most influential business leaders worldwide.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Request Invitation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Demo Login Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
                <p className="text-sm text-blue-800 font-medium mb-2">Try the Demo:</p>
                <p className="text-xs text-blue-600">
                  Email: test@demo.com
                  <br />
                  OTP: 123456
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Exclusive Features for Executives
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Tailored tools and experiences designed specifically for C-level professionals
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Industry Leaders</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">See what executives are saying about CXO Network</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                    <div className="mt-4">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Join the exclusive network in three simple steps</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Apply for Invitation</h3>
                <p className="text-muted-foreground">
                  Submit your executive credentials for verification. We carefully review each application.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Get Verified</h3>
                <p className="text-muted-foreground">
                  Our team verifies your role and organization to ensure network quality and authenticity.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Start Connecting</h3>
                <p className="text-muted-foreground">
                  Access exclusive forums, events, and connect with verified C-level executives worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Join the Elite Network?</h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Request an invitation to connect with the world's most influential business leaders. Membership is by
                  invitation only.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Request Invitation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Already a Member?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 CXO Network. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}

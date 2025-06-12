"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MessageSquare, HelpCircle, MessageCircle, Brain, Sparkles, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function CreateForumPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    postType: "discussion", // discussion, question, comment-only
    targetAudience: "all", // all, ceo, cto, cfo, cmo, etc.
    responseLimit: "unlimited", // unlimited, 1, 5, 10, 20
    allowReplies: true,
    aiFirstResponse: true,
    tags: [] as string[],
    isPrivate: false,
  })

  const categories = [
    { id: "general", name: "General Discussion", description: "Open discussions for all executives" },
    { id: "industry", name: "Industry Insights", description: "Industry-specific knowledge and trends" },
    { id: "ceo", name: "CEO Forum", description: "Strategic leadership discussions", restriction: "CEO" },
    { id: "cto", name: "CTO Forum", description: "Technology strategy and innovation", restriction: "CTO" },
    { id: "cfo", name: "CFO Forum", description: "Financial strategy and risk management", restriction: "CFO" },
    { id: "cmo", name: "CMO Forum", description: "Marketing and brand strategy", restriction: "CMO" },
  ]

  const postTypes = [
    {
      id: "discussion",
      name: "Discussion",
      description: "Start a general discussion topic",
      icon: MessageSquare,
    },
    {
      id: "question",
      name: "Question",
      description: "Ask a question and get answers",
      icon: HelpCircle,
    },
    {
      id: "comment-only",
      name: "Comments Only",
      description: "Allow comments but no threaded replies",
      icon: MessageCircle,
    },
  ]

  const targetAudiences = [
    { id: "all", name: "All Executives", description: "Visible to everyone" },
    { id: "ceo", name: "CEOs Only", description: "Strategic leadership level" },
    { id: "cto", name: "CTOs Only", description: "Technology leadership level" },
    { id: "cfo", name: "CFOs Only", description: "Financial leadership level" },
    { id: "cmo", name: "CMOs Only", description: "Marketing leadership level" },
    { id: "legal", name: "Legal Experts", description: "Legal and compliance topics" },
    { id: "hr", name: "HR Leaders", description: "Human resources topics" },
  ]

  const aiModels = [
    { id: "openai", name: "OpenAI GPT-4", description: "Advanced reasoning and analysis" },
    { id: "gemini", name: "Google Gemini", description: "Multimodal AI capabilities" },
    { id: "grok", name: "X Grok", description: "Real-time insights and wit" },
    { id: "meta", name: "Meta Llama", description: "Open-source language model" },
    { id: "deepseek", name: "DeepSeek", description: "Specialized reasoning model" },
  ]

  const [selectedAiModel, setSelectedAiModel] = useState("openai")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate AI content analysis and routing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock AI analysis result
      const aiAnalysis = {
        detectedTopics: ["leadership", "strategy", "technology"],
        suggestedAudience: formData.targetAudience === "all" ? "ceo" : formData.targetAudience,
        contentType: formData.postType,
        complexity: "executive-level",
      }

      toast({
        title: "Post Created Successfully",
        description: `AI has analyzed your content and routed it to ${aiAnalysis.suggestedAudience.toUpperCase()} audience`,
      })

      router.push("/forums")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/forums" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Forums
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your insights, ask questions, or start discussions with fellow executives
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Post Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Post Type</CardTitle>
                <CardDescription>Choose the type of post you want to create</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {postTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.postType === type.id
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => updateFormData("postType", type.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <type.icon className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a clear, descriptive title"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            {category.restriction && (
                              <Badge variant="secondary" className="ml-2">
                                {category.restriction} Only
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here..."
                    value={formData.content}
                    onChange={(e) => updateFormData("content", e.target.value)}
                    rows={8}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Targeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Content Routing
                </CardTitle>
                <CardDescription>Our AI will analyze your content and suggest the best audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => updateFormData("targetAudience", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map((audience) => (
                        <SelectItem key={audience.id} value={audience.id}>
                          <div>
                            <div className="font-medium">{audience.name}</div>
                            <div className="text-sm text-muted-foreground">{audience.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aiFirstResponse"
                    checked={formData.aiFirstResponse}
                    onCheckedChange={(checked) => updateFormData("aiFirstResponse", checked)}
                  />
                  <Label htmlFor="aiFirstResponse" className="text-sm">
                    Enable AI first response (AI will provide the initial response to your post)
                  </Label>
                </div>

                {formData.aiFirstResponse && (
                  <div className="space-y-2">
                    <Label>AI Model Selection</Label>
                    <Select value={selectedAiModel} onValueChange={setSelectedAiModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-sm text-muted-foreground">{model.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Settings */}
            {formData.postType === "question" && (
              <Card>
                <CardHeader>
                  <CardTitle>Response Settings</CardTitle>
                  <CardDescription>Configure how responses are handled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Response Limit</Label>
                    <Select
                      value={formData.responseLimit}
                      onValueChange={(value) => updateFormData("responseLimit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited">Unlimited responses</SelectItem>
                        <SelectItem value="1">1 response only</SelectItem>
                        <SelectItem value="5">Maximum 5 responses</SelectItem>
                        <SelectItem value="10">Maximum 10 responses</SelectItem>
                        <SelectItem value="20">Maximum 20 responses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowReplies"
                      checked={formData.allowReplies}
                      onCheckedChange={(checked) => updateFormData("allowReplies", checked)}
                    />
                    <Label htmlFor="allowReplies" className="text-sm">
                      Allow threaded replies to responses
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {formData.isPrivate ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => updateFormData("isPrivate", checked)}
                  />
                  <Label htmlFor="isPrivate" className="text-sm">
                    Make this post private (only visible to selected audience)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* AI Preview */}
            {formData.title && formData.content && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Content Analysis Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="space-y-2">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Detected Topics:</span> Leadership, Strategy, Technology
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Suggested Audience:</span> {formData.targetAudience.toUpperCase()}{" "}
                        Level
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Content Complexity:</span> Executive Level
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Estimated Engagement:</span> High
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Post..." : "Create Post"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

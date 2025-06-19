"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { aiContentRouter, type ContentAnalysis } from "@/services/ai-content-router"
import { postService } from "@/services/post-service"
import { Bot, Sparkles, Hash, Target, Zap, CheckCircle, Loader2, X } from "lucide-react"

interface PostCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
}

interface PostFormData {
  title: string
  content: string
  postType: "share" | "question" | "comment-only"
  targetAudience: string[]
  responseLimit: number | "unlimited"
  aiFirstResponse: boolean
  selectedAiModel: "openai" | "gemini" | "meta" | "grok" | "deepseek"
  tags: string[]
  customTags: string
  visibility: "public" | "role-specific" | "company-only"
  priority: "low" | "medium" | "high"
  scheduledAt?: Date
}

const POST_TYPES = [
  {
    value: "share",
    label: "Just Share",
    description: "Share insights, updates, or thoughts with the community",
    icon: "📢",
  },
  {
    value: "question",
    label: "Ask Question",
    description: "Ask for advice, opinions, or specific information",
    icon: "❓",
  },
  {
    value: "comment-only",
    label: "Comment Only, No Replies",
    description: "Allow comments but disable reply threads",
    icon: "💬",
  },
]

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Executives", description: "Visible to all verified executives" },
  { value: "ceo", label: "CEOs", description: "Chief Executive Officers" },
  { value: "cto", label: "CTOs", description: "Chief Technology Officers" },
  { value: "cfo", label: "CFOs", description: "Chief Financial Officers" },
  { value: "cmo", label: "CMOs", description: "Chief Marketing Officers" },
  { value: "coo", label: "COOs", description: "Chief Operating Officers" },
  { value: "chro", label: "CHROs", description: "Chief Human Resources Officers" },
  { value: "legal", label: "Legal Heads", description: "Chief Legal Officers & Legal Heads" },
  { value: "strategy", label: "Strategy Heads", description: "Chief Strategy Officers" },
]

const AI_MODELS = [
  {
    value: "openai",
    label: "OpenAI GPT-4",
    description: "Best for strategic analysis and detailed responses",
    icon: "🤖",
  },
  {
    value: "gemini",
    label: "Google Gemini",
    description: "Excellent for multimodal analysis and research",
    icon: "✨",
  },
  {
    value: "grok",
    label: "X Grok",
    description: "Real-time insights with current market context",
    icon: "⚡",
  },
  {
    value: "meta",
    label: "Meta Llama",
    description: "Open-source approach with community insights",
    icon: "🦙",
  },
  {
    value: "deepseek",
    label: "DeepSeek",
    description: "Reasoning-first approach for complex problems",
    icon: "🧠",
  },
]

export function PostCreationModal({ isOpen, onClose, onPostCreated }: PostCreationModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    postType: "share",
    targetAudience: ["all"],
    responseLimit: "unlimited",
    aiFirstResponse: true,
    selectedAiModel: "openai",
    tags: [],
    customTags: "",
    visibility: "public",
    priority: "medium",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-analyze content when title or content changes
  useEffect(() => {
    const analyzeContent = async () => {
      if (formData.title.trim() || formData.content.trim()) {
        setIsAnalyzing(true)
        try {
          const analysis = await aiContentRouter.analyzeContent(formData.title, formData.content)
          setContentAnalysis(analysis)

          // Auto-suggest audience based on analysis
          if (analysis.targetAudience.length > 0 && !formData.targetAudience.includes("all")) {
            setFormData((prev) => ({
              ...prev,
              targetAudience: analysis.targetAudience,
              tags: [...new Set([...prev.tags, ...analysis.suggestedTags])],
            }))
          }
        } catch (error) {
          console.error("Content analysis failed:", error)
        } finally {
          setIsAnalyzing(false)
        }
      }
    }

    const debounceTimer = setTimeout(analyzeContent, 1000)
    return () => clearTimeout(debounceTimer)
  }, [formData.title, formData.content])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }

    if (formData.postType === "question" && !formData.title.trim()) {
      newErrors.title = "Title is required for questions"
    }

    if (formData.targetAudience.length === 0) {
      newErrors.targetAudience = "Please select at least one audience"
    }

    if (formData.postType === "question" && typeof formData.responseLimit === "number" && formData.responseLimit < 1) {
      newErrors.responseLimit = "Response limit must be at least 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreatePost = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Combine suggested and custom tags
      const allTags = [
        ...formData.tags,
        ...formData.customTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ]

      const postData = {
        ...formData,
        tags: [...new Set(allTags)],
        authorId: user?.id,
        contentAnalysis,
      }

      const result = await postService.createPost(postData)

      if (result.success) {
        toast({
          title: "Post Created Successfully",
          description: formData.aiFirstResponse
            ? "Your post has been published and AI response is being generated"
            : "Your post has been published successfully",
        })

        onPostCreated()
        onClose()
        resetForm()
      } else {
        throw new Error(result.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Post creation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      postType: "share",
      targetAudience: ["all"],
      responseLimit: "unlimited",
      aiFirstResponse: true,
      selectedAiModel: "openai",
      tags: [],
      customTags: "",
      visibility: "public",
      priority: "medium",
    })
    setContentAnalysis(null)
    setErrors({})
    setStep(1)
  }

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const toggleAudience = (audience: string) => {
    setFormData((prev) => {
      const newAudience = prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter((a) => a !== audience)
        : [...prev.targetAudience.filter((a) => a !== "all"), audience]

      return {
        ...prev,
        targetAudience: newAudience.length === 0 ? ["all"] : newAudience,
      }
    })
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Create New Post
          </DialogTitle>
          <DialogDescription>Share your insights with the executive community</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && <div className="w-8 h-0.5 bg-muted mx-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Content & Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Post Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {POST_TYPES.map((type) => (
                      <div
                        key={type.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.postType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setFormData((prev) => ({ ...prev, postType: type.value as any }))}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.postType === "question" && (
                  <div className="space-y-2">
                    <Label htmlFor="title">Question Title *</Label>
                    <Input
                      id="title"
                      placeholder="What would you like to ask?"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder={
                      formData.postType === "question"
                        ? "Provide more details about your question..."
                        : formData.postType === "share"
                          ? "What insights would you like to share?"
                          : "Share your thoughts for discussion..."
                    }
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className={errors.content ? "border-destructive" : ""}
                  />
                  {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formData.content.length} characters</span>
                    {isAnalyzing && (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing content...
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Analysis Preview */}
                {contentAnalysis && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">AI Content Analysis</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">Complexity:</span>
                        <Badge variant="outline" className="ml-1">
                          {contentAnalysis.complexity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Sentiment:</span>
                        <Badge variant="outline" className="ml-1">
                          {contentAnalysis.sentiment}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Urgency:</span>
                        <Badge variant="outline" className="ml-1">
                          {contentAnalysis.urgency}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Engagement:</span>
                        <Badge variant="outline" className="ml-1">
                          {contentAnalysis.estimatedEngagement}
                        </Badge>
                      </div>
                    </div>
                    {contentAnalysis.topics.length > 0 && (
                      <div className="mt-3">
                        <span className="text-blue-700 font-medium text-sm">Detected Topics:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contentAnalysis.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!formData.content.trim()}>
                  Next: Audience & Settings
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Audience & Response Settings */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target Audience *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {AUDIENCE_OPTIONS.map((audience) => (
                      <div
                        key={audience.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.targetAudience.includes(audience.value)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleAudience(audience.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{audience.label}</span>
                          {formData.targetAudience.includes(audience.value) && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{audience.description}</p>
                      </div>
                    ))}
                  </div>
                  {errors.targetAudience && <p className="text-sm text-destructive">{errors.targetAudience}</p>}
                </div>

                {formData.postType === "question" && (
                  <div className="space-y-2">
                    <Label>Response Limit</Label>
                    <Select
                      value={formData.responseLimit.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          responseLimit: value === "unlimited" ? "unlimited" : Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited">Unlimited Responses</SelectItem>
                        <SelectItem value="1">1 Response Only</SelectItem>
                        <SelectItem value="3">3 Responses</SelectItem>
                        <SelectItem value="5">5 Responses</SelectItem>
                        <SelectItem value="10">10 Responses</SelectItem>
                        <SelectItem value="20">20 Responses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, visibility: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - All verified executives</SelectItem>
                      <SelectItem value="role-specific">Role Specific - Selected audiences only</SelectItem>
                      <SelectItem value="company-only">Company Only - Your organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Regular discussion</SelectItem>
                      <SelectItem value="medium">Medium - Important topic</SelectItem>
                      <SelectItem value="high">High - Urgent or critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Next: AI & Tags</Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Settings & Tags */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aiResponse"
                    checked={formData.aiFirstResponse}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, aiFirstResponse: checked as boolean }))
                    }
                  />
                  <Label htmlFor="aiResponse" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Enable AI First Response
                  </Label>
                </div>

                {formData.aiFirstResponse && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                    <div>
                      <Label>Select AI Model</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {AI_MODELS.map((model) => (
                          <div
                            key={model.value}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              formData.selectedAiModel === model.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setFormData((prev) => ({ ...prev, selectedAiModel: model.value as any }))}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span>{model.icon}</span>
                              <span className="font-medium text-sm">{model.label}</span>
                              {formData.selectedAiModel === model.value && (
                                <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{model.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Tags
                  </Label>
                  {contentAnalysis && contentAnalysis.suggestedTags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Suggested tags (click to add):</p>
                      <div className="flex flex-wrap gap-2">
                        {contentAnalysis.suggestedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={formData.tags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => (formData.tags.includes(tag) ? removeTag(tag) : addTag(tag))}
                          >
                            {tag}
                            {formData.tags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <Input
                      placeholder="Add custom tags (comma-separated)"
                      value={formData.customTags}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customTags: e.target.value }))}
                    />
                  </div>
                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Selected tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleCreatePost} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

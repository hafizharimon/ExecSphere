"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Search, Send, Phone, Video, MoreVertical, Plus, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const conversations = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "CTO at InnovateTech",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Thanks for the insights on AI implementation. Very helpful!",
      timestamp: "2 hours ago",
      unreadCount: 2,
      isOnline: true,
      type: "direct",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "CFO at Global Finance",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Let's schedule a call to discuss the partnership opportunity.",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
      type: "direct",
    },
    {
      id: "3",
      name: "CEO Leadership Circle",
      title: "12 members",
      avatar: "/placeholder-group.jpg",
      lastMessage: "Jennifer: The quarterly results look promising...",
      timestamp: "3 hours ago",
      unreadCount: 5,
      isOnline: true,
      type: "group",
    },
    {
      id: "4",
      name: "Tech Innovation Group",
      title: "8 members",
      avatar: "/placeholder-group.jpg",
      lastMessage: "David: Has anyone tried the new AI tools for...",
      timestamp: "1 day ago",
      unreadCount: 1,
      isOnline: true,
      type: "group",
    },
  ]

  const messages = [
    {
      id: "1",
      senderId: "sarah-chen",
      senderName: "Sarah Chen",
      content:
        "Hi! I saw your presentation on digital transformation strategies. Really insightful approach to change management.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      senderId: user?.id || "",
      senderName: user?.name || "",
      content:
        "Thank you! I'm glad you found it useful. Change management is definitely one of the biggest challenges we face.",
      timestamp: "10:35 AM",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "sarah-chen",
      senderName: "Sarah Chen",
      content:
        "Absolutely. We're going through a similar transformation at InnovateTech. Would love to hear more about your experience with stakeholder buy-in.",
      timestamp: "10:37 AM",
      isOwn: false,
    },
    {
      id: "4",
      senderId: user?.id || "",
      senderName: user?.name || "",
      content:
        "I'd be happy to share our approach. We found that early engagement and clear communication of benefits were key. Maybe we could schedule a call?",
      timestamp: "10:40 AM",
      isOwn: true,
    },
    {
      id: "5",
      senderId: "sarah-chen",
      senderName: "Sarah Chen",
      content: "That would be fantastic! I'm free next Tuesday afternoon if that works for you.",
      timestamp: "2 hours ago",
      isOwn: false,
    },
  ]

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  if (!user) {
    return <div>Please log in to access messages.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
          {/* Conversations List */}
          <Card className="w-full lg:w-1/3 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4 pt-0">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedConversation === conversation.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.type === "group" ? (
                            <Users className="h-6 w-6" />
                          ) : (
                            conversation.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && conversation.type === "direct" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conversation.title}</p>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="bg-blue-500 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConv.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedConv.type === "group" ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            selectedConv.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConv.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConv.type === "direct"
                            ? selectedConv.isOnline
                              ? "Online"
                              : "Last seen 2 hours ago"
                            : selectedConv.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedConv.type === "direct" && (
                        <>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3",
                            message.isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          {!message.isOwn && selectedConv.type === "group" && (
                            <p className="text-xs font-medium mb-1">{message.senderName}</p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end mt-1">
                            <span
                              className={cn(
                                "text-xs",
                                message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
                              )}
                            >
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

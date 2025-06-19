// Real-time Chat Service with WebSocket support

export interface ChatConversation {
  id: string
  conversationType: "direct" | "group" | "company_mentorship"
  title?: string
  description?: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
}

export interface ChatParticipant {
  id: string
  userId: string
  user: {
    id: string
    name: string
    role: string
    organization: string
    profileImageUrl?: string
    isOnline?: boolean
    lastSeen?: string
  }
  role: "admin" | "moderator" | "member"
  joinedAt: string
  lastReadAt: string
  isMuted: boolean
  isPinned: boolean
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  sender: {
    id: string
    name: string
    profileImageUrl?: string
  }
  messageType: "text" | "image" | "file" | "system"
  content: string
  metadata?: {
    fileName?: string
    fileSize?: number
    fileUrl?: string
    mentions?: string[]
    attachments?: any[]
  }
  replyToMessageId?: string
  replyToMessage?: ChatMessage
  reactions: MessageReaction[]
  isEdited: boolean
  isDeleted: boolean
  sentAt: string
  editedAt?: string
  deletedAt?: string
}

export interface MessageReaction {
  id: string
  messageId: string
  userId: string
  user: {
    name: string
    profileImageUrl?: string
  }
  reactionType: "like" | "love" | "laugh" | "angry" | "sad"
  createdAt: string
}

export interface ChatSession {
  id: string
  userId: string
  sessionToken: string
  socketId?: string
  isActive: boolean
  lastActivityAt: string
  expiresAt: string
}

export interface CompanyMentorshipGroup {
  id: string
  companyId: string
  mentorId: string
  mentor: {
    id: string
    name: string
    role: string
    profileImageUrl?: string
  }
  groupName: string
  description?: string
  members: CompanyMentorshipMember[]
  conversationId?: string
  isActive: boolean
  createdAt: string
}

export interface CompanyMentorshipMember {
  id: string
  groupId: string
  userId: string
  user: {
    id: string
    name: string
    role: string
    profileImageUrl?: string
  }
  role: "mentor" | "admin" | "member"
  joinedAt: string
  isActive: boolean
}

class ChatService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  private socket: WebSocket | null = null
  private sessionToken: string | null = null
  private messageHandlers: Map<string, (message: any) => void> = new Map()

  // WebSocket Connection Management
  async initializeChat(userId: string): Promise<{ success: boolean; sessionToken?: string; error?: string }> {
    try {
      // Create or get existing chat session
      const session = await this.createChatSession(userId)
      if (!session.success) {
        return session
      }

      this.sessionToken = session.data.sessionToken

      // Initialize WebSocket connection
      await this.connectWebSocket(session.data.sessionToken)

      return {
        success: true,
        sessionToken: session.data.sessionToken,
      }
    } catch (error) {
      console.error("Initialize chat error:", error)
      return {
        success: false,
        error: "Failed to initialize chat",
      }
    }
  }

  private async connectWebSocket(sessionToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"}/chat?token=${sessionToken}`

      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log("WebSocket connected")
        resolve()
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleWebSocketMessage(data)
        } catch (error) {
          console.error("WebSocket message parse error:", error)
        }
      }

      this.socket.onclose = () => {
        console.log("WebSocket disconnected")
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (this.sessionToken) {
            this.connectWebSocket(this.sessionToken)
          }
        }, 3000)
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        reject(error)
      }
    })
  }

  private handleWebSocketMessage(data: any): void {
    const { type, payload } = data

    switch (type) {
      case "new_message":
        this.messageHandlers.get("new_message")?.(payload)
        break
      case "message_updated":
        this.messageHandlers.get("message_updated")?.(payload)
        break
      case "user_typing":
        this.messageHandlers.get("user_typing")?.(payload)
        break
      case "user_online":
        this.messageHandlers.get("user_online")?.(payload)
        break
      case "user_offline":
        this.messageHandlers.get("user_offline")?.(payload)
        break
      default:
        console.log("Unknown WebSocket message type:", type)
    }
  }

  onMessage(type: string, handler: (message: any) => void): void {
    this.messageHandlers.set(type, handler)
  }

  offMessage(type: string): void {
    this.messageHandlers.delete(type)
  }

  // Conversation Management
  async getConversations(userId: string): Promise<{ success: boolean; data?: ChatConversation[]; error?: string }> {
    try {
      const conversations = await this.fetchUserConversations(userId)
      return conversations
    } catch (error) {
      console.error("Get conversations error:", error)
      return {
        success: false,
        error: "Failed to fetch conversations",
      }
    }
  }

  async createDirectConversation(
    userId: string,
    targetUserId: string,
  ): Promise<{ success: boolean; data?: ChatConversation; error?: string }> {
    try {
      // Check if conversation already exists
      const existing = await this.findDirectConversation(userId, targetUserId)
      if (existing.success && existing.data) {
        return existing
      }

      // Create new conversation
      const conversation = await this.createConversation({
        conversationType: "direct",
        createdBy: userId,
        participants: [userId, targetUserId],
      })

      return conversation
    } catch (error) {
      console.error("Create direct conversation error:", error)
      return {
        success: false,
        error: "Failed to create conversation",
      }
    }
  }

  async createCompanyMentorshipConversation(
    companyId: string,
    mentorId: string,
    memberIds: string[],
    groupName: string,
  ): Promise<{ success: boolean; data?: ChatConversation; error?: string }> {
    try {
      // Create mentorship group first
      const group = await this.createMentorshipGroup({
        companyId,
        mentorId,
        groupName,
        memberIds,
      })

      if (!group.success) {
        return group
      }

      // Create conversation for the group
      const conversation = await this.createConversation({
        conversationType: "company_mentorship",
        title: groupName,
        createdBy: mentorId,
        companyId,
        mentorId,
        participants: [mentorId, ...memberIds],
      })

      if (conversation.success) {
        // Link conversation to mentorship group
        await this.linkConversationToGroup(group.data.id, conversation.data.id)
      }

      return conversation
    } catch (error) {
      console.error("Create company mentorship conversation error:", error)
      return {
        success: false,
        error: "Failed to create mentorship conversation",
      }
    }
  }

  // Message Management
  async getMessages(
    conversationId: string,
    limit = 50,
    before?: string,
  ): Promise<{ success: boolean; data?: ChatMessage[]; error?: string }> {
    try {
      const messages = await this.fetchMessages(conversationId, limit, before)
      return messages
    } catch (error) {
      console.error("Get messages error:", error)
      return {
        success: false,
        error: "Failed to fetch messages",
      }
    }
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: "text" | "image" | "file" = "text",
    metadata?: any,
    replyToMessageId?: string,
  ): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
    try {
      const message = {
        conversationId,
        senderId,
        messageType,
        content,
        metadata,
        replyToMessageId,
      }

      // Save message to database
      const result = await this.saveMessage(message)

      if (result.success && this.socket && this.socket.readyState === WebSocket.OPEN) {
        // Send via WebSocket for real-time delivery
        this.socket.send(
          JSON.stringify({
            type: "send_message",
            payload: result.data,
          }),
        )
      }

      return result
    } catch (error) {
      console.error("Send message error:", error)
      return {
        success: false,
        error: "Failed to send message",
      }
    }
  }

  async editMessage(
    messageId: string,
    newContent: string,
  ): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
    try {
      const result = await this.updateMessage(messageId, {
        content: newContent,
        isEdited: true,
        editedAt: new Date().toISOString(),
      })

      if (result.success && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "message_updated",
            payload: result.data,
          }),
        )
      }

      return result
    } catch (error) {
      console.error("Edit message error:", error)
      return {
        success: false,
        error: "Failed to edit message",
      }
    }
  }

  async deleteMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.updateMessage(messageId, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        content: "This message was deleted",
      })

      if (result.success && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "message_updated",
            payload: result.data,
          }),
        )
      }

      return { success: result.success }
    } catch (error) {
      console.error("Delete message error:", error)
      return {
        success: false,
        error: "Failed to delete message",
      }
    }
  }

  async addReaction(
    messageId: string,
    userId: string,
    reactionType: "like" | "love" | "laugh" | "angry" | "sad",
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.saveReaction({
        messageId,
        userId,
        reactionType,
      })

      if (result.success && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "reaction_added",
            payload: result.data,
          }),
        )
      }

      return result
    } catch (error) {
      console.error("Add reaction error:", error)
      return {
        success: false,
        error: "Failed to add reaction",
      }
    }
  }

  async markAsRead(conversationId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.updateLastReadTime(conversationId, userId)
      return result
    } catch (error) {
      console.error("Mark as read error:", error)
      return {
        success: false,
        error: "Failed to mark as read",
      }
    }
  }

  // Company Mentorship Management
  async getCompanyMentorshipGroups(
    companyId: string,
  ): Promise<{ success: boolean; data?: CompanyMentorshipGroup[]; error?: string }> {
    try {
      const groups = await this.fetchCompanyMentorshipGroups(companyId)
      return groups
    } catch (error) {
      console.error("Get company mentorship groups error:", error)
      return {
        success: false,
        error: "Failed to fetch mentorship groups",
      }
    }
  }

  async addMemberToMentorshipGroup(
    groupId: string,
    userId: string,
    role: "mentor" | "admin" | "member" = "member",
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.addGroupMember(groupId, userId, role)

      if (result.success) {
        // Add to conversation as well
        const group = await this.getMentorshipGroup(groupId)
        if (group.success && group.data.conversationId) {
          await this.addConversationParticipant(group.data.conversationId, userId)
        }
      }

      return result
    } catch (error) {
      console.error("Add member to mentorship group error:", error)
      return {
        success: false,
        error: "Failed to add member to group",
      }
    }
  }

  // Typing Indicators
  sendTypingIndicator(conversationId: string, userId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "typing_start",
          payload: { conversationId, userId },
        }),
      )
    }
  }

  stopTypingIndicator(conversationId: string, userId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "typing_stop",
          payload: { conversationId, userId },
        }),
      )
    }
  }

  // Cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.sessionToken = null
    this.messageHandlers.clear()
  }

  // Mock API methods (in real app, these would make actual API calls)
  private async createChatSession(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        sessionToken: `session_${userId}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }
  }

  private async fetchUserConversations(
    userId: string,
  ): Promise<{ success: boolean; data?: ChatConversation[]; error?: string }> {
    // Mock conversations
    const mockConversations: ChatConversation[] = [
      {
        id: "conv-1",
        conversationType: "direct",
        participants: [
          {
            id: "part-1",
            userId: "user-2",
            user: {
              id: "user-2",
              name: "Jane Smith",
              role: "CTO",
              organization: "InnovateTech",
              profileImageUrl: "/placeholder-user.jpg",
              isOnline: true,
            },
            role: "member",
            joinedAt: "2024-01-15T10:30:00Z",
            lastReadAt: "2024-01-15T15:20:00Z",
            isMuted: false,
            isPinned: false,
          },
        ],
        lastMessage: {
          id: "msg-1",
          conversationId: "conv-1",
          senderId: "user-2",
          sender: {
            id: "user-2",
            name: "Jane Smith",
            profileImageUrl: "/placeholder-user.jpg",
          },
          messageType: "text",
          content: "Thanks for the insights on digital transformation!",
          reactions: [],
          isEdited: false,
          isDeleted: false,
          sentAt: "2024-01-15T15:30:00Z",
        },
        unreadCount: 2,
        isPinned: false,
        isMuted: false,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T15:30:00Z",
        lastMessageAt: "2024-01-15T15:30:00Z",
      },
    ]

    return {
      success: true,
      data: mockConversations,
    }
  }

  private async findDirectConversation(
    userId: string,
    targetUserId: string,
  ): Promise<{ success: boolean; data?: ChatConversation; error?: string }> {
    // Mock - check if conversation exists
    return {
      success: false,
      error: "Conversation not found",
    }
  }

  private async createConversation(data: any): Promise<{ success: boolean; data?: ChatConversation; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      data: {
        id: `conv-${Date.now()}`,
        ...data,
        participants: [],
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ChatConversation,
    }
  }

  private async createMentorshipGroup(data: any): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      data: {
        id: `group-${Date.now()}`,
        ...data,
      },
    }
  }

  private async linkConversationToGroup(groupId: string, conversationId: string): Promise<void> {
    console.log(`Linking conversation ${conversationId} to group ${groupId}`)
  }

  private async fetchMessages(
    conversationId: string,
    limit: number,
    before?: string,
  ): Promise<{ success: boolean; data?: ChatMessage[]; error?: string }> {
    // Mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: "msg-1",
        conversationId,
        senderId: "user-2",
        sender: {
          id: "user-2",
          name: "Jane Smith",
          profileImageUrl: "/placeholder-user.jpg",
        },
        messageType: "text",
        content: "Hi! I saw your presentation on digital transformation. Really insightful!",
        reactions: [],
        isEdited: false,
        isDeleted: false,
        sentAt: "2024-01-15T14:30:00Z",
      },
      {
        id: "msg-2",
        conversationId,
        senderId: "user-1",
        sender: {
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "/placeholder-user.jpg",
        },
        messageType: "text",
        content: "Thank you! I'm glad you found it useful. Change management is definitely challenging.",
        reactions: [
          {
            id: "reaction-1",
            messageId: "msg-2",
            userId: "user-2",
            user: {
              name: "Jane Smith",
              profileImageUrl: "/placeholder-user.jpg",
            },
            reactionType: "like",
            createdAt: "2024-01-15T14:35:00Z",
          },
        ],
        isEdited: false,
        isDeleted: false,
        sentAt: "2024-01-15T14:32:00Z",
      },
    ]

    return {
      success: true,
      data: mockMessages,
    }
  }

  private async saveMessage(message: any): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        id: `msg-${Date.now()}`,
        ...message,
        reactions: [],
        isEdited: false,
        isDeleted: false,
        sentAt: new Date().toISOString(),
      } as ChatMessage,
    }
  }

  private async updateMessage(
    messageId: string,
    updates: any,
  ): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        id: messageId,
        ...updates,
      } as ChatMessage,
    }
  }

  private async saveReaction(reaction: any): Promise<{ success: boolean; data?: any; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        id: `reaction-${Date.now()}`,
        ...reaction,
        createdAt: new Date().toISOString(),
      },
    }
  }

  private async updateLastReadTime(
    conversationId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true }
  }

  private async fetchCompanyMentorshipGroups(
    companyId: string,
  ): Promise<{ success: boolean; data?: CompanyMentorshipGroup[]; error?: string }> {
    // Mock mentorship groups
    return {
      success: true,
      data: [],
    }
  }

  private async addGroupMember(
    groupId: string,
    userId: string,
    role: string,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true }
  }

  private async getMentorshipGroup(groupId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return {
      success: true,
      data: {
        id: groupId,
        conversationId: "conv-123",
      },
    }
  }

  private async addConversationParticipant(conversationId: string, userId: string): Promise<void> {
    console.log(`Adding participant ${userId} to conversation ${conversationId}`)
  }
}

export const chatService = new ChatService()

"use client"

import type React from "react"
import { X } from "lucide-react" // Added X icon import

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react" // Removed X icon as dialog handles close
import { useChat } from "@/components/chat-provider" // Import useChat

interface Message {
  id: number
  text: string
  sender: "me" | "friend"
  timestamp: Date
}

interface Friend {
  id: number
  name: string
  avatar: string
  status: "online" | "offline"
}

interface ChatRoomProps {
  friend: Friend
  // onClose prop is no longer needed as Dialog handles closing
}

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hey! How are you doing?",
    sender: "friend",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 2,
    text: "I'm doing great! Just working on some projects. How about you?",
    sender: "me",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: 3,
    text: "Same here! Working on a new chat application",
    sender: "friend",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: 4,
    text: "That sounds interesting! What technologies are you using?",
    sender: "me",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
]

export function ChatRoom({ friend }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { closeChat } = useChat() // Get closeChat from context

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setIsTyping(true)
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "me",
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate typing indicator and response
      setTimeout(() => {
        setIsTyping(false)
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {friend.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                friend.status === "online" ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold">{friend.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{friend.status}</p>
          </div>
        </div>
        {/* Close button is now handled by the Dialog component itself */}
        {/* For demonstration, I'll add a close button here, but in a real shadcn Dialog, it's often built-in */}
        <Button variant="ghost" size="icon" onClick={closeChat}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface Friend {
  id: number
  name: string
  avatar: string
  status: "online" | "offline"
  lastMessage: string
  unreadCount: number
}

interface ChatContextType {
  selectedFriend: Friend | null
  setSelectedFriend: (friend: Friend | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isChatOpen: boolean
  openChat: (friend: Friend) => void
  closeChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedFriend, setSelectedFriendState] = useState<Friend | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = useCallback((friend: Friend) => {
    setSelectedFriendState(friend)
    setIsChatOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setSelectedFriendState(null)
    setIsChatOpen(false)
  }, [])

  const setSelectedFriend = useCallback(
    (friend: Friend | null) => {
      if (friend) {
        openChat(friend)
      } else {
        closeChat()
      }
    },
    [openChat, closeChat],
  )

  return (
    <ChatContext.Provider
      value={{
        selectedFriend,
        setSelectedFriend,
        searchQuery,
        setSearchQuery,
        isChatOpen,
        openChat,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

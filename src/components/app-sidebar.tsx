"use client"

import { MessageCircle, User, UserPlus, Clock } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@/components/chat-provider"
import Link from "next/link"

const mockFriends = [
  {
    id: 1,
    name: "Sarah Connor",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online" as const,
    lastMessage: "Hey, how are you?",
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "offline" as const,
    lastMessage: "See you tomorrow!",
    unreadCount: 0,
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online" as const,
    lastMessage: "Thanks for the help",
    unreadCount: 1,
  },
  {
    id: 4,
    name: "David Brown",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "offline" as const,
    lastMessage: "Good night!",
    unreadCount: 0,
  },
]

const navigation = [
  {
    title: "Friend Requests",
    url: "/requests",
    icon: UserPlus,
  },
  {
    title: "Pending Requests",
    url: "/pending-requests",
    icon: Clock,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const { selectedFriend, openChat, searchQuery } = useChat()

  // Filter friends based on search query
  const filteredFriends = mockFriends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFriendClick = (friend: (typeof mockFriends)[0]) => {
    openChat(friend) // Use openChat from context
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6" />
          <span className="font-semibold text-lg">Chat App</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Friends ({filteredFriends.length})
            {searchQuery && <span className="text-xs text-muted-foreground ml-1">- searching "{searchQuery}"</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredFriends.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchQuery ? "No friends found" : "No friends yet"}
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <SidebarMenuItem key={friend.id}>
                    <SidebarMenuButton
                      className="h-auto p-3"
                      isActive={selectedFriend?.id === friend.id}
                      onClick={() => handleFriendClick(friend)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{friend.name}</p>
                            {friend.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                              >
                                {friend.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{friend.lastMessage}</p>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

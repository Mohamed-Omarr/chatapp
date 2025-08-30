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
import Link from "next/link"
import ShowFriendList from "./features/ShowFriendList"
import { useUser } from "@/hooks/UserContext"

const navigation = [
  
  {
    title: "Friend Requests",
    url: "/home/requests",
    icon: UserPlus,
  },
  {
    title: "Pending Requests",
    url: "/home/pending-requests",
    icon: Clock,
  },
  {
    title: "Profile",
    url: "/home/profile",
    icon: User,
  },

]

export function AppSidebar() {
const userId = useUser();
if (!userId.user) throw new Error("user not authed")
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

        <ShowFriendList
        currentUserId={userId.user?.id}
        />

      </SidebarContent>
    </Sidebar>
  )
}

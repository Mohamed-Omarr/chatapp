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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { MessageCircle, User, UserPlus, Clock } from "lucide-react";
import ShowFriendList from "./features/friend/ShowFriendList";

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
];

export default async function AppSidebar() {
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

        {/* ✅ ShowFriendList is already hybrid (SSR fetch + client UI) */}
        <ShowFriendList />
      </SidebarContent>
    </Sidebar>
  );
}

"use client";

import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useTransition } from "react";
import { logout } from "../../actions/auth";
import SearchQuery from "./features/search/SearchQuery";

const mockNotifications = [
  {
    id: 1,
    message: "Sarah Connor sent you a message",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    message: "Mike Johnson accepted your friend request",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    message: "Emma Wilson is now online",
    time: "3 hours ago",
    read: true,
  },
];

export function Header() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isPending, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Left: Sidebar */}
        <SidebarTrigger />

        {/* Middle: Search */}
        <div className="flex-1 max-w-md mx-4 relative">
          <SearchQuery />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h3 className="font-semibold mb-2">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No notifications
                  </p>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-3 cursor-pointer ${
                          !notification.read ? "bg-muted/50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout (far right) */}
          <Button
            onClick={() =>
              startTransition(async () => {
                try {
                  await logout();
                } finally {
                  localStorage.removeItem("AccessToken");
                }
              })
            }
            disabled={isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/UserContext";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RealtimeChat } from "../chat/realtime-chat";

type Friend = {
  id: string;
  username: string;
  avatar_url?: string;
};

export default function FriendListClient({ friends }: { friends: Friend[] }) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [open, setOpen] = useState(false);

  const {user} = useUser();


  if (!user) {
    return " Failed to get user "
  }

  function getRoomName(currentUserName: string, friendName: string) {
    return [currentUserName, friendName].sort().join("-");
  }

  const roomName =
    selectedFriend && user.id
      ? getRoomName(user.username, selectedFriend.username)
      : null;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <SidebarGroup className="w-64 border-r">
        <SidebarGroupLabel>Friends ({friends.length})</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {friends.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No friends yet
              </div>
            ) : (
              friends.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setSelectedFriend(item);
                    setOpen(true);
                  }}
                >
                  <Avatar>
                    {item.avatar_url ? (
                      <AvatarImage src={item.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        {item.username[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{item.username}</span>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Chat Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full h-[600px] p-0 flex flex-col">
          <DialogHeader className="border-b px-4 py-2">
            <DialogTitle>{selectedFriend?.username ?? "Chat"}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedFriend && roomName && (
              <RealtimeChat
                roomName={roomName}
                username={user.username}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

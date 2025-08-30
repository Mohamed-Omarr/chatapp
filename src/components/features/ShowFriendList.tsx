"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFriendList } from "../../../actions/features/showFriends/friendList";
import { RealtimeChat } from "../realtime-chat";
import { useUser } from "@/hooks/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Flat friend type because server already returns normalized profiles
type Friend = {
  id: string;
  username: string;
  avatar_url: string | null;
};

function ShowFriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [open, setOpen] = useState(false);

  const currentUser = useUser();
  const currentUserId = currentUser.user?.id ?? null;

  const fetchFriends = async () => {
    const data = await getFriendList();
    setFriends(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (!currentUserId) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading user...
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar with friends */}
      <SidebarGroup className="w-64 border-r">
        <SidebarGroupLabel>Friends ({friends.length})</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : friends.length === 0 ? (
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

      {/* Chat Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full h-[600px] p-0 flex flex-col">
          <DialogHeader className="border-b px-4 py-2">
            <DialogTitle>
              {selectedFriend?.username ?? "Chat"}
            </DialogTitle>
          </DialogHeader>

          {/* Chat container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedFriend && (
              <RealtimeChat
                currentUserId={currentUserId}
                friendId={selectedFriend.id}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShowFriendList;

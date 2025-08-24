"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { useChat } from "@/components/chat-provider";
import { ChatRoom } from "@/components/chat-room";
import { Dialog } from "@/components/ui/dialog";

function AppContent({ children }: { children: React.ReactNode }) {
  // This component will wrap the main content and handle the chat dialog
  const { selectedFriend, isChatOpen, closeChat } = useChat();
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>

      {/* Chat Dialog - rendered globally */}
      
      {selectedFriend && (
        <Dialog open={isChatOpen} onOpenChange={(open) => !open && closeChat()}>
          {/* DialogContent is not directly imported, but assumed to be part of shadcn/ui/dialog */}
          {/* For simplicity, we'll render ChatRoom directly, assuming Dialog handles its own content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative z-50 w-full max-w-2xl h-[90vh] bg-background rounded-lg shadow-lg flex flex-col">
              <ChatRoom friend={selectedFriend} />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default AppContent;

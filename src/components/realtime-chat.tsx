"use client";

import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/components/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseHooks/supabaseClient";
import { getMessages } from "../../actions/realtime/getMessages";
import { sendMessage } from "../../actions/realtime/sendMessage";

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  createdAt: string;
  sender?: { username: string };
}

interface RealtimeChatProps {
  currentUserId: string;
  friendId: string;
}

export const RealtimeChat = ({
  currentUserId,
  friendId,
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages(friendId);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();
  }, [friendId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabaseClient
      .channel(`chat-${currentUserId}-${friendId}`) // unique channel name
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;

          // only keep messages between these two users
          if (
            (newMessage.sender_id === currentUserId &&
              newMessage.receiver_id === friendId) ||
            (newMessage.sender_id === friendId &&
              newMessage.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe((status) => {
        console.log("🔌 Channel status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [currentUserId, friendId]);

  // Send message with optimistic update
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      const tempId = crypto.randomUUID();
      const optimisticMessage: ChatMessage = {
        id: tempId,
        sender_id: currentUserId,
        receiver_id: friendId,
        content: newMessage,
        createdAt: new Date().toISOString(),
        sender: { username: "You" },
      };

      // Show message immediately
      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");

      try {
        await sendMessage(friendId, optimisticMessage.content);
      } catch (err) {
        console.error("Failed to send message:", err);
        // Remove optimistic message if failed
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [newMessage, isConnected, friendId, currentUserId]
  );

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showHeader =
                !prevMessage || prevMessage.sender_id !== message.sender_id;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.sender_id === currentUserId}
                    showHeader={showHeader}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex w-full gap-2 border-t border-border p-4"
      >
        <Input
          className={cn(
            "rounded-full bg-background text-sm transition-all duration-300",
            isConnected && newMessage.trim() ? "w-[calc(100%-36px)]" : "w-full"
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={!isConnected}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
};

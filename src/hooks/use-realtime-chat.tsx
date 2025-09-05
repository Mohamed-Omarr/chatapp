"use client";
import { supabaseClient } from "@/lib/supabaseHooks/supabaseClient";
import { useCallback, useEffect, useState } from "react";
import { sendMessages } from "../../actions/realtime/sendMessage";
import { getMessages } from "../../actions/realtime/getMessages";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: {
    username: string;
  };
  created_at: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = supabaseClient;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const loadInitialMessages = async () => {
    const messages = await getMessages(roomName);
    setMessages(messages);
  };

  useEffect(() => {
    if (roomName) loadInitialMessages();
  }, [roomName]);

  useEffect(() => {
    if (!roomName) return;
    const newChannel = supabase.channel(roomName);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        setMessages((current) => [...current, payload.payload as ChatMessage]);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomName, username, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return;

      const saveIntoDB = await sendMessages(roomName, content);

      if (!saveIntoDB.success) {
        console.error("Failed to save message:", saveIntoDB.error);
        // optionally show toast/error to user here
        return;
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender_id: {
          username: username,
        },
        created_at: new Date().toISOString(),
      };

      // Update local state immediately for the sender
      setMessages((current) => [...current, message]);

      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
    },
    [channel, isConnected, username]
  );

  return { messages, sendMessage, isConnected };
}

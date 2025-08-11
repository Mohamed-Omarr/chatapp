import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/components/chat-provider";
import AppContent from "@/components/AppContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "A modern chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChatProvider>
          <SidebarProvider defaultOpen={true}>
            <AppContent>{children}</AppContent>
          </SidebarProvider>
        </ChatProvider>
      </body>
    </html>
  );
}

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppContent from "@/components/AppContent";
import { UserProvider } from "@/hooks/UserContext";
import { getUserInfo } from "../../../actions/getUserInfo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "A modern chat application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userData =  await getUserInfo() || null;


  return (
    <html lang="en">
      <body className={inter.className}>
          <SidebarProvider defaultOpen={true}>
            <UserProvider serverProfile={userData}>
              <AppContent>{children}</AppContent>
            </UserProvider>
          </SidebarProvider>
      </body>
    </html>
  );
}

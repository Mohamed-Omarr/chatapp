"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

function AppContent({ children }: { children: React.ReactNode }) {
  // This component will wrap the main content and handle the chat dialog
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AppContent;

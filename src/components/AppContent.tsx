import React from "react";
import { Header } from "@/components/header";
import AppSidebar from "./app-sidebar";

function AppContent({ children }: { children: React.ReactNode }) {
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

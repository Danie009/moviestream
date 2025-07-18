"use client" // Added "use client" directive

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import "./dashboard.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["admin", "moderator"]}>
      <div className="flex h-screen overflow-hidden bg-background">
        <SidebarProvider>
          <DashboardSidebar />
          <div className="flex flex-col flex-1 h-screen overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  )
}

import type React from "react"
import DashboardNavWrapper from "./components/dashboard-nav-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-[#f5f0ff]">
      <DashboardNavWrapper />
      <main className="flex-1 py-6">{children}</main>
    </div>
  )
}

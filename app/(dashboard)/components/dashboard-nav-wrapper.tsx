"use client";

import DashboardNav from "./dashboard-nav";
import { UserNav } from "./user-nav";

export default function DashboardNavWrapper() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <DashboardNav />
        </div>
        <UserNav />
      </div>
    </header>
  );
}

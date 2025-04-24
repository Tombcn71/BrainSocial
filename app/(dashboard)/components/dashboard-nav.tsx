"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrainCircuitIcon } from "lucide-react";
import { dict } from "@/lib/dictionary";

export default function DashboardNav() {
  const pathname = usePathname();

  // Update the routes array to ensure it's always defined
  const routes = [
    {
      href: "/dashboard",
      label: dict.common.dashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/projects",
      label: "Projecten",
      active:
        pathname === "/dashboard/projects" ||
        pathname.startsWith("/dashboard/projects/"),
    },
    {
      href: "/dashboard/content",
      label: dict.dashboard.createContent,
      active: pathname === "/dashboard/content",
    },
    {
      href: "/dashboard/content/overview",
      label: "Content overzicht",
      active:
        pathname === "/dashboard/content/overview" ||
        pathname.startsWith("/dashboard/content/overview/"),
    },
    {
      href: "/dashboard/calendar",
      label: dict.common.calendar,
      active: pathname === "/dashboard/calendar",
    },
    {
      href: "/dashboard/accounts",
      label: "Accounts",
      active:
        pathname === "/dashboard/accounts" ||
        pathname.startsWith("/dashboard/accounts/"),
    },
    {
      href: "/dashboard/reports",
      label: "Rapportages",
      active: pathname === "/dashboard/reports",
    },
  ];

  return (
    <>
      <Link href="/dashboard" className="flex items-center gap-2 md:mr-6">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8A4FFF] to-[#FF4F8A] flex items-center justify-center">
          <BrainCircuitIcon className="h-5 w-5 text-white" />
        </div>
        <span className="hidden font-bold md:inline-block text-[#8A4FFF]">
          SocialAI
        </span>
      </Link>
      <nav className="flex items-center gap-4 md:gap-6">
        {routes && routes.length > 0 ? (
          routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#8A4FFF] relative group",
                route.active ? "text-[#8A4FFF]" : "text-muted-foreground"
              )}>
              {route.active && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#8A4FFF] rounded-full"></span>
              )}
              <span className="group-hover:bg-[#8A4FFF]/10 px-3 py-1.5 rounded-full transition-colors">
                {route.label}
              </span>
            </Link>
          ))
        ) : (
          <p>Loading navigation...</p>
        )}
      </nav>
    </>
  );
}

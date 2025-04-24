"use client";

import { useSearchParams } from "next/navigation";
import CalendarView from "./calendar-view";

export default function CalendarViewWrapper() {
  // Gebruik useSearchParams in deze client component
  const searchParams = useSearchParams();

  // Haal de parameters op en geef ze door aan CalendarView
  const contentId = searchParams?.get("contentId");
  const projectId = searchParams?.get("projectId");
  const campaignId = searchParams?.get("campaignId");

  return (
    <CalendarView
      initialContentId={contentId || undefined}
      initialProjectId={projectId || undefined}
      initialCampaignId={campaignId || undefined}
    />
  );
}

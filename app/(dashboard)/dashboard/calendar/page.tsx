import { Suspense } from "react";
import { dict } from "@/lib/dictionary";
import CalendarViewWrapper from "./calendar-view-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.common.calendar}
        </h1>
        <p className="text-muted-foreground mt-2">
          Plan en organiseer je social media content.
        </p>
      </div>

      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarViewWrapper />
      </Suspense>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-60" />
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}

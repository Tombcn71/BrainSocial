"use client";

import { Button } from "@/components/ui/button";
import { FilterIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ContentFilterWrapper({
  projectId,
  campaignId,
  project,
  campaign,
}: {
  projectId?: string;
  campaignId?: string;
  project?: any;
  campaign?: any;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content overzicht</h1>
        <p className="text-muted-foreground mt-2">
          {project && typeof project === "object" && "name" in project
            ? `Content voor project: ${project.name}`
            : "Al je content"}
          {campaign && typeof campaign === "object" && "name" in campaign
            ? ` / Campagne: ${campaign.name}`
            : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <Link href="/dashboard/content/overview/filter">
          <Button variant="outline">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filteren
          </Button>
        </Link>
        <Link href="/dashboard/content">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Content maken
          </Button>
        </Link>
      </div>
    </div>
  );
}

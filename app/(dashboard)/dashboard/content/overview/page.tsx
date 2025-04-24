import { getUserContent } from "@/app/actions/content";
import { getProjects } from "@/app/actions/projects";
import { getCampaigns } from "@/app/actions/campaigns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, FilterIcon } from "lucide-react";
import Link from "next/link";
import ContentOverview from "./content-overview";

// In Next.js 15.2.4, we need to use a different approach for searchParams
export default async function ContentOverviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Safely extract the parameters without using Object methods on searchParams
  const projectId = searchParams.projectId as string | undefined;
  const campaignId = searchParams.campaignId as string | undefined;

  const { success: contentSuccess, content = [] } = await getUserContent(
    100,
    projectId,
    campaignId
  );
  const { success: projectsSuccess, projects = [] } = await getProjects();

  let campaigns: any[] = [];
  if (projectId) {
    const { success: campaignsSuccess, campaigns: campaignsData } =
      await getCampaigns(projectId);
    if (campaignsSuccess && campaignsData) {
      // Zorg ervoor dat we altijd een array hebben, ongeacht wat getCampaigns teruggeeft
      campaigns = Array.isArray(campaignsData) ? campaignsData : [];
    }
  }

  // Get project and campaign names for display
  const projectArray = Array.isArray(projects) ? projects : [];
  const campaignsArray = Array.isArray(campaigns) ? campaigns : [];

  const project = projectId
    ? projectArray.find((p: any) => p.id === projectId)
    : null;
  const campaign = campaignId
    ? campaignsArray.find((c: any) => c.id === campaignId)
    : null;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Content overzicht
          </h1>
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

      {!contentSuccess ? (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Er is een fout opgetreden bij het ophalen van content.
        </div>
      ) : content.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Geen content gevonden</CardTitle>
            <CardDescription>
              {project && typeof project === "object" && "name" in project
                ? `Er is nog geen content voor ${project.name}${
                    campaign &&
                    typeof campaign === "object" &&
                    "name" in campaign
                      ? ` / ${campaign.name}`
                      : ""
                  }.`
                : "Je hebt nog geen content aangemaakt."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Link href="/dashboard/content">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Content maken
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ContentOverview content={Array.isArray(content) ? content : []} />
      )}
    </div>
  );
}

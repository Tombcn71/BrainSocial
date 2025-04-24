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
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import ContentOverview from "./content-overview";
import { Suspense } from "react";
import ContentFilterWrapper from "./content-filter-wrapper";

// In Next.js App Router, searchParams is passed as a prop to the page component
export default async function ContentOverviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Safely extract the parameters
  const projectId =
    typeof searchParams.projectId === "string"
      ? searchParams.projectId
      : undefined;
  const campaignId =
    typeof searchParams.campaignId === "string"
      ? searchParams.campaignId
      : undefined;

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
      <Suspense
        fallback={
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Content overzicht
              </h1>
              <div className="h-6 w-48 bg-muted rounded animate-pulse mt-2"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        }>
        <ContentFilterWrapper
          projectId={projectId}
          campaignId={campaignId}
          project={project}
          campaign={campaign}
        />
      </Suspense>

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

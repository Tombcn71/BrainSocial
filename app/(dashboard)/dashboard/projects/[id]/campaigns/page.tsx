import { getProject } from "@/app/actions/projects";
import { getCampaigns } from "@/app/actions/campaigns";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FolderIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CampaignsList from "./campaigns-list";

export default async function ProjectCampaignsPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    success: projectSuccess,
    project,
    error: projectError,
  } = await getProject(params.id);
  const {
    success: campaignsSuccess,
    campaigns,
    error: campaignsError,
  } = await getCampaigns(params.id);

  if (!projectSuccess || !project) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/dashboard/projects/${params.id}`}
              className="text-muted-foreground hover:text-foreground">
              <FolderIcon className="h-4 w-4 inline mr-1" />
              {project.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Campagnes</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Campagnes</h1>
          <p className="text-muted-foreground mt-2">
            Beheer de campagnes voor {project.name}
          </p>
        </div>
        <Link href={`/dashboard/projects/${params.id}/campaigns/new`}>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nieuwe campagne
          </Button>
        </Link>
      </div>

      {!campaignsSuccess ? (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {campaignsError ||
            "Er is een fout opgetreden bij het ophalen van campagnes."}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Geen campagnes gevonden</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Dit project heeft nog geen campagnes. Maak een nieuwe campagne aan
            om te beginnen.
          </p>
          <Link href={`/dashboard/projects/${params.id}/campaigns/new`}>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nieuwe campagne
            </Button>
          </Link>
        </div>
      ) : (
        <CampaignsList projectId={params.id} campaigns={campaigns} />
      )}
    </div>
  );
}

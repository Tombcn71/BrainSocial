import { getProject } from "@/app/actions/projects";
import { getCampaigns } from "@/app/actions/campaigns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, FolderIcon, PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({
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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FolderIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            {project.client_name && (
              <p className="text-muted-foreground">
                Klant: {project.client_name}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/projects/${params.id}/edit`}>
            <Button variant="outline">
              <PencilIcon className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
          </Link>
          <Link href={`/dashboard/projects/${params.id}/campaigns/new`}>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nieuwe campagne
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projectdetails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Beschrijving</h3>
                <p className="text-muted-foreground">
                  {project.description || "Geen beschrijving"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Status</h3>
                  <div className="inline-block text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {project.status === "active"
                      ? "Actief"
                      : project.status === "completed"
                      ? "Afgerond"
                      : "Gearchiveerd"}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Aangemaakt op</h3>
                  <p className="text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString("nl-NL")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Campagnes</h2>
              <Link href={`/dashboard/projects/${params.id}/campaigns`}>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Alle campagnes
                </Button>
              </Link>
            </div>

            {!campaignsSuccess ? (
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                {campaignsError ||
                  "Er is een fout opgetreden bij het ophalen van campagnes."}
              </div>
            ) : campaigns.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Geen campagnes gevonden
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Dit project heeft nog geen campagnes. Maak een nieuwe
                    campagne aan om te beginnen.
                  </p>
                  <Link href={`/dashboard/projects/${params.id}/campaigns/new`}>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nieuwe campagne
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.slice(0, 4).map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription>
                        {campaign.start_date && campaign.end_date
                          ? `${new Date(campaign.start_date).toLocaleDateString(
                              "nl-NL"
                            )} - ${new Date(
                              campaign.end_date
                            ).toLocaleDateString("nl-NL")}`
                          : campaign.start_date
                          ? `Vanaf ${new Date(
                              campaign.start_date
                            ).toLocaleDateString("nl-NL")}`
                          : "Geen datum ingesteld"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {campaign.status === "draft"
                            ? "Concept"
                            : campaign.status === "active"
                            ? "Actief"
                            : campaign.status === "completed"
                            ? "Afgerond"
                            : campaign.status}
                        </div>
                        {campaign.platforms &&
                          campaign.platforms.length > 0 && (
                            <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {campaign.platforms.join(", ")}
                            </div>
                          )}
                      </div>
                      <Link
                        href={`/dashboard/projects/${params.id}/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Details bekijken
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Statistieken</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Aantal campagnes
                </h3>
                <p className="text-2xl font-bold">
                  {campaignsSuccess ? campaigns.length : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Actieve campagnes
                </h3>
                <p className="text-2xl font-bold">
                  {campaignsSuccess
                    ? campaigns.filter((c) => c.status === "active").length
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Geplande posts
                </h3>
                <p className="text-2xl font-bold">-</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Snelle acties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/dashboard/projects/${params.id}/campaigns/new`}>
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nieuwe campagne
                  </Button>
                </Link>
                <Link href={`/dashboard/content?projectId=${params.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Content maken
                  </Button>
                </Link>
                <Link href={`/dashboard/calendar?projectId=${params.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Kalender bekijken
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

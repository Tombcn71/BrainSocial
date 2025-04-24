import { getProject } from "@/app/actions/projects";
import {
  getCampaign,
  getCampaignContent,
  getCampaignScheduledPosts,
} from "@/app/actions/campaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FolderIcon, PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContentList from "./content-list";

interface ContentItem {
  id: string;
  title?: string;
  content: string;
  platform: string;
  content_type: string;
  published?: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  campaign_id?: string;
  user_id: string;
}

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string; campaignId: string };
}) {
  const { success: projectSuccess, project } = await getProject(params.id);
  const { success: campaignSuccess, campaign } = await getCampaign(
    params.campaignId
  );
  const { success: contentSuccess, content = [] } = await getCampaignContent(
    params.campaignId
  );
  const { success: scheduledPostsSuccess, scheduledPosts = [] } =
    await getCampaignScheduledPosts(params.campaignId);

  if (!projectSuccess || !project || !campaignSuccess || !campaign) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/dashboard/projects/${params.id}`}
                className="text-muted-foreground hover:text-foreground">
                <FolderIcon className="h-4 w-4 inline mr-1" />
                {project.name}
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link
                href={`/dashboard/projects/${params.id}/campaigns`}
                className="text-muted-foreground hover:text-foreground">
                Campagnes
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="text-muted-foreground mt-1">
                {campaign.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/projects/${params.id}/campaigns/${params.campaignId}/edit`}>
            <Button variant="outline">
              <PencilIcon className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
          </Link>
          <Link
            href={`/dashboard/content?projectId=${params.id}&campaignId=${params.campaignId}`}>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Content maken
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campagne details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Status</h3>
                  <div className="inline-block text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {campaign.status === "draft"
                      ? "Concept"
                      : campaign.status === "active"
                      ? "Actief"
                      : campaign.status === "completed"
                      ? "Afgerond"
                      : "Gepauzeerd"}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Periode</h3>
                  <p className="text-muted-foreground">
                    {campaign.start_date && campaign.end_date
                      ? `${new Date(campaign.start_date).toLocaleDateString(
                          "nl-NL"
                        )} - ${new Date(campaign.end_date).toLocaleDateString(
                          "nl-NL"
                        )}`
                      : campaign.start_date
                      ? `Vanaf ${new Date(
                          campaign.start_date
                        ).toLocaleDateString("nl-NL")}`
                      : "Geen datum ingesteld"}
                  </p>
                </div>
              </div>
              {campaign.platforms && campaign.platforms.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.platforms.map((platform: string) => (
                      <div
                        key={platform}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {platform}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Content</h2>
              <Link
                href={`/dashboard/content?projectId=${params.id}&campaignId=${params.campaignId}`}>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Content maken
                </Button>
              </Link>
            </div>

            {!contentSuccess ? (
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                Er is een fout opgetreden bij het ophalen van content.
              </div>
            ) : content.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Geen content gevonden
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Deze campagne heeft nog geen content. Maak nieuwe content
                    aan om te beginnen.
                  </p>
                  <Link
                    href={`/dashboard/content?projectId=${params.id}&campaignId=${params.campaignId}`}>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Content maken
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <ContentList
                content={Array.isArray(content) ? content : []}
                projectId={params.id}
                campaignId={params.campaignId}
              />
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
                  Aantal content items
                </h3>
                <p className="text-2xl font-bold">{content.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Geplande posts
                </h3>
                <p className="text-2xl font-bold">{scheduledPosts.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Gepubliceerde posts
                </h3>
                <p className="text-2xl font-bold">
                  {
                    scheduledPosts.filter(
                      (post: any) => post.status === "published"
                    ).length
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Snelle acties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/dashboard/content?projectId=${params.id}&campaignId=${params.campaignId}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Content maken
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/calendar?projectId=${params.id}&campaignId=${params.campaignId}`}>
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

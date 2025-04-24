"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCampaigns } from "@/app/actions/campaigns";
import { getContentStats } from "@/app/actions/content";
import {
  Loader2,
  BarChart3Icon,
  PieChartIcon,
  CalendarIcon,
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from "lucide-react";

export default function ReportsView({
  initialProjects,
}: {
  initialProjects: any[];
}) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (selectedProjectId) {
      loadCampaigns(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadStats();
  }, [selectedProjectId, selectedCampaignId]);

  const loadCampaigns = async (projectId: string) => {
    if (!projectId) {
      setCampaigns([]);
      setSelectedCampaignId("");
      return;
    }

    setIsLoadingCampaigns(true);
    try {
      const result = await getCampaigns(projectId);
      if (result.success) {
        setCampaigns(result.campaigns);
        setSelectedCampaignId("");
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const result = await getContentStats(
        selectedProjectId,
        selectedCampaignId
      );
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setSelectedCampaignId("");
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4" />;
      case "twitter":
        return <TwitterIcon className="h-4 w-4" />;
      case "instagram":
        return <InstagramIcon className="h-4 w-4" />;
      case "facebook":
        return <FacebookIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Selecteer een project of campagne om de rapportages te filteren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle projecten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle projecten</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign">Campagne</Label>
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
                disabled={!selectedProjectId || isLoadingCampaigns}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedProjectId
                        ? "Alle campagnes"
                        : "Selecteer eerst een project"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle campagnes</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="content-types">Content types</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {isLoadingStats ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Totale content
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.content.total_content || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aantal content items{" "}
                    {selectedCampaignId
                      ? "in deze campagne"
                      : selectedProjectId
                      ? "in dit project"
                      : ""}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Campagnes
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <PieChartIcon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.content.campaigns_count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aantal campagnes {selectedProjectId ? "in dit project" : ""}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Geplande posts
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.content.scheduled_posts_count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aantal geplande posts{" "}
                    {selectedCampaignId
                      ? "in deze campagne"
                      : selectedProjectId
                      ? "in dit project"
                      : ""}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gepubliceerde posts
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.content.published_posts_count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aantal gepubliceerde posts{" "}
                    {selectedCampaignId
                      ? "in deze campagne"
                      : selectedProjectId
                      ? "in dit project"
                      : ""}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Geen statistieken beschikbaar
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="platforms">
          {isLoadingStats ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stats && stats.platforms && stats.platforms.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Content per platform</CardTitle>
                <CardDescription>
                  Verdeling van content over verschillende social media
                  platforms
                  {selectedCampaignId
                    ? " in deze campagne"
                    : selectedProjectId
                    ? " in dit project"
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Platform bars */}
                  <div className="space-y-4">
                    {stats.platforms.map((platform: any) => {
                      const percentage = Math.round(
                        (platform.count / stats.content.total_content) * 100
                      );
                      return (
                        <div key={platform.platform} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getPlatformIcon(platform.platform)}
                              <span className="ml-2 capitalize">
                                {platform.platform}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {platform.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2"
                              style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Geen platform statistieken beschikbaar
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content-types">
          {isLoadingStats ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stats && stats.contentTypes && stats.contentTypes.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Content per type</CardTitle>
                <CardDescription>
                  Verdeling van content over verschillende content types
                  {selectedCampaignId
                    ? " in deze campagne"
                    : selectedProjectId
                    ? " in dit project"
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Content type bars */}
                  <div className="space-y-4">
                    {stats.contentTypes.map((contentType: any) => {
                      const percentage = Math.round(
                        (contentType.count / stats.content.total_content) * 100
                      );
                      return (
                        <div
                          key={contentType.content_type}
                          className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="capitalize">
                              {contentType.content_type}
                            </span>
                            <span className="text-sm font-medium">
                              {contentType.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2"
                              style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Geen content type statistieken beschikbaar
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

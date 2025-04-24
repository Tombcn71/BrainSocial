"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { getProjects } from "@/app/actions/projects";
import { getCampaigns } from "@/app/actions/campaigns";

export default function ContentFilterPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadCampaigns(selectedProjectId);
    } else {
      setCampaigns([]);
      setSelectedCampaignId("");
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const result = await getProjects();
      if (result.success) {
        setProjects(result.projects);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadCampaigns = async (projectId: string) => {
    if (!projectId) return;

    setIsLoadingCampaigns(true);
    try {
      const result = await getCampaigns(projectId);
      if (result.success) {
        setCampaigns(result.campaigns);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (selectedProjectId) params.set("projectId", selectedProjectId);
    if (selectedCampaignId) params.set("campaignId", selectedCampaignId);

    router.push(`/dashboard/content/overview?${params.toString()}`);
  };

  const handleClearFilter = () => {
    setSelectedProjectId("");
    setSelectedCampaignId("");
  };

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Content filteren</CardTitle>
            <CardDescription>
              Filter content op project en campagne
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                disabled={isLoadingProjects}>
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
                disabled={isLoadingCampaigns || !selectedProjectId}>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClearFilter}>
              Wissen
            </Button>
            <Button onClick={handleApplyFilter}>Toepassen</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

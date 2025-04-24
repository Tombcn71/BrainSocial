"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { dict } from "@/lib/dictionary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/app/actions/projects";
import { getCampaigns } from "@/app/actions/campaigns";
import { generateContent, saveContent } from "@/app/actions/content";
import { Checkbox } from "@/components/ui/checkbox";

export default function ContentCreationForm() {
  const [platform, setPlatform] = useState("linkedin");
  const [contentType, setContentType] = useState("post");
  const [tone, setTone] = useState("informative");
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [publishNow, setPublishNow] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Load projects and pre-select from URL params
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const result = await getProjects();
        if (result.success) {
          setProjects(result.projects);

          // Check if projectId is in URL
          const urlProjectId = searchParams.get("projectId");
          if (
            urlProjectId &&
            result.projects.some((p: any) => p.id === urlProjectId)
          ) {
            setProjectId(urlProjectId);
            loadCampaigns(urlProjectId);
          }
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, [searchParams]);

  // Load campaigns when project changes
  const loadCampaigns = async (pid: string) => {
    if (!pid) {
      setCampaigns([]);
      setCampaignId("");
      return;
    }

    setIsLoadingCampaigns(true);
    try {
      const result = await getCampaigns(pid);
      if (result.success) {
        // Ensure we always set an array, even if result.campaigns is undefined
        const campaignsArray = Array.isArray(result.campaigns)
          ? result.campaigns
          : [];
        setCampaigns(campaignsArray);

        // Check if campaignId is in URL
        const urlCampaignId = searchParams.get("campaignId");
        if (
          urlCampaignId &&
          campaignsArray.some((c: any) => c.id === urlCampaignId)
        ) {
          setCampaignId(urlCampaignId);
        } else {
          setCampaignId("");
        }
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  // Handle project change
  const handleProjectChange = (value: string) => {
    setProjectId(value);
    loadCampaigns(value);
  };

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Onderwerp is verplicht",
        description: "Vul een onderwerp in om content te genereren.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateContent(platform, contentType, tone, topic);

      if (result.success && result.content) {
        setContent(result.content);
        toast({
          title: "Content gegenereerd",
          description: "Je content is succesvol gegenereerd.",
        });
      } else {
        toast({
          title: "Fout bij genereren",
          description:
            "Er is een fout opgetreden bij het genereren van je content.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij genereren",
        description:
          "Er is een fout opgetreden bij het genereren van je content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) {
      toast({
        title: "Content is verplicht",
        description: "Genereer eerst content voordat je het opslaat.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert image to base64 if available
      let imageUrl = null;
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const result = await saveContent({
        title,
        content,
        platform,
        contentType,
        projectId,
        campaignId: campaignId || undefined,
        imageUrl,
        published: publishNow,
      });

      if (result.success) {
        toast({
          title: publishNow ? "Content gepubliceerd" : "Content opgeslagen",
          description: publishNow
            ? "Je content is succesvol gepubliceerd."
            : "Je content is succesvol opgeslagen.",
        });

        // Redirect to content overview
        router.push("/dashboard/content/overview");
        router.refresh();
      } else {
        toast({
          title: "Fout bij opslaan",
          description:
            "Er is een fout opgetreden bij het opslaan van je content.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description:
          "Er is een fout opgetreden bij het opslaan van je content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column - Form fields */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="project">Project (optioneel)</Label>
          <Select
            value={projectId}
            onValueChange={handleProjectChange}
            disabled={isLoadingProjects}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Geen project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign">Campagne (optioneel)</Label>
          <Select
            value={campaignId}
            onValueChange={setCampaignId}
            disabled={isLoadingCampaigns || !projectId}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  projectId
                    ? "Selecteer campagne"
                    : "Selecteer eerst een project"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Geen campagne</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">{dict.contentCreation.platform}</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentType">
            {dict.contentCreation.contentType}
          </Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="tweet">Tweet</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="reel">Reel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">{dict.contentCreation.tone}</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer toon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informative">Informatief</SelectItem>
              <SelectItem value="professional">Professioneel</SelectItem>
              <SelectItem value="creative">Creatief</SelectItem>
              <SelectItem value="humorous">Humoristisch</SelectItem>
              <SelectItem value="inspirational">Inspirerend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">{dict.contentCreation.topic}</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Onderwerp van de content"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Titel (optioneel)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel van de content"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Afbeelding (optioneel)</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="w-full"
              disabled={isLoading}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Afbeelding toevoegen
            </Button>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
            {imagePreview && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                disabled={isLoading}>
                Verwijderen
              </Button>
            )}
          </div>
          {imagePreview && (
            <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="publish-now"
            checked={publishNow}
            onCheckedChange={(checked) => setPublishNow(checked as boolean)}
          />
          <Label htmlFor="publish-now" className="cursor-pointer">
            Direct publiceren
          </Label>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {dict.contentCreation.generate}...
            </>
          ) : (
            dict.contentCreation.generate
          )}
        </Button>
      </div>

      {/* Right column - Generated content */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Gegenereerde Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hier verschijnt je gegenereerde content"
            className="min-h-[300px]"
            disabled={isLoading}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleGenerate()}
              disabled={isLoading || !topic}>
              {dict.contentCreation.regenerate}
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !content}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {publishNow ? "Publiceren..." : "Opslaan..."}
                </>
              ) : publishNow ? (
                "Publiceren"
              ) : (
                "Opslaan"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

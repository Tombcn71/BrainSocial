"use client";

import type React from "react";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import { Checkbox } from "@/components/ui/checkbox";

const platforms = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "twitter", name: "Twitter" },
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
];

export default function CampaignForm({
  projectId,
  campaign,
}: {
  projectId: string;
  campaign?: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    campaign?.platforms || []
  );
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!campaign;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add platforms to form data
      formData.set("platforms", selectedPlatforms.join(","));

      // Add project ID to form data
      formData.set("projectId", projectId);

      let result;

      if (isEditing) {
        result = await updateCampaign(campaign.id, formData);
      } else {
        result = await createCampaign(formData);
      }

      if (result.success) {
        toast({
          title: isEditing ? "Campagne bijgewerkt" : "Campagne aangemaakt",
          description: isEditing
            ? "De campagne is succesvol bijgewerkt."
            : "De campagne is succesvol aangemaakt.",
        });

        if (isEditing) {
          router.push(
            `/dashboard/projects/${projectId}/campaigns/${campaign.id}`
          );
        } else {
          router.push(
            `/dashboard/projects/${projectId}/campaigns/${result.campaignId}`
          );
        }
      } else {
        toast({
          title: "Fout",
          description: result.error || "Er is een fout opgetreden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Campagnenaam *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={campaign?.name || ""}
          placeholder="Voer een naam in voor de campagne"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={campaign?.description || ""}
          placeholder="Voer een beschrijving in voor de campagne"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Startdatum</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={
              campaign?.start_date ? campaign.start_date.split("T")[0] : ""
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Einddatum</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={
              campaign?.end_date ? campaign.end_date.split("T")[0] : ""
            }
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Platforms</Label>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center space-x-2">
              <Checkbox
                id={`platform-${platform.id}`}
                checked={selectedPlatforms.includes(platform.id)}
                onCheckedChange={() => togglePlatform(platform.id)}
              />
              <Label
                htmlFor={`platform-${platform.id}`}
                className="cursor-pointer">
                {platform.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={campaign?.status || "draft"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Concept</SelectItem>
              <SelectItem value="active">Actief</SelectItem>
              <SelectItem value="completed">Afgerond</SelectItem>
              <SelectItem value="paused">Gepauzeerd</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Bijwerken..." : "Aanmaken..."}
            </>
          ) : isEditing ? (
            "Campagne bijwerken"
          ) : (
            "Campagne aanmaken"
          )}
        </Button>
      </div>
    </form>
  );
}

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
import { createProject, updateProject } from "@/app/actions/projects";

export default function ProjectForm({ project }: { project?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!project;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      let result;

      if (isEditing) {
        result = await updateProject(project.id, formData);
      } else {
        result = await createProject(formData);
      }

      if (result.success) {
        toast({
          title: isEditing ? "Project bijgewerkt" : "Project aangemaakt",
          description: isEditing
            ? "Het project is succesvol bijgewerkt."
            : "Het project is succesvol aangemaakt.",
        });

        if (isEditing) {
          router.push(`/dashboard/projects/${project.id}`);
        } else {
          router.push(`/dashboard/projects/${result.projectId}`);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Projectnaam *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name || ""}
          placeholder="Voer een naam in voor het project"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">Klantnaam</Label>
        <Input
          id="clientName"
          name="clientName"
          defaultValue={project?.client_name || ""}
          placeholder="Voer de naam van de klant in"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description || ""}
          placeholder="Voer een beschrijving in voor het project"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={project?.status || "active"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actief</SelectItem>
              <SelectItem value="completed">Afgerond</SelectItem>
              <SelectItem value="archived">Gearchiveerd</SelectItem>
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
            "Project bijwerken"
          ) : (
            "Project aanmaken"
          )}
        </Button>
      </div>
    </form>
  );
}

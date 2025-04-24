import { getProjects } from "@/app/actions/projects";
import ProjectsList from "./projects-list";
import { PlusIcon, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectsPage() {
  let projectsData = { success: false, projects: [], error: null };

  try {
    projectsData = await getProjects();
  } catch (error) {
    console.error("Error in ProjectsPage:", error);
    projectsData = {
      success: false,
      projects: [],
      error: "Er is een fout opgetreden bij het ophalen van projecten.",
    };
  }

  const { success, projects, error } = projectsData;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projecten</h1>
          <p className="text-muted-foreground mt-2">
            Beheer je klantprojecten en campagnes
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nieuw project
          </Button>
        </Link>
      </div>

      {!success ? (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error || "Er is een fout opgetreden bij het ophalen van projecten."}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FolderIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Geen projecten gevonden</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Je hebt nog geen projecten aangemaakt. Maak je eerste project aan om
            te beginnen.
          </p>
          <Link href="/dashboard/projects/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nieuw project
            </Button>
          </Link>
        </div>
      ) : (
        <ProjectsList projects={projects} />
      )}
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteProject } from "@/app/actions/projects";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectsList({ projects = [] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteProject(projectToDelete.id);

      if (result.success) {
        toast({
          title: "Project verwijderd",
          description: "Het project is succesvol verwijderd.",
        });
        router.refresh();
      } else {
        toast({
          title: "Fout bij verwijderen",
          description:
            result.error ||
            "Er is een fout opgetreden bij het verwijderen van het project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van het project.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const confirmDelete = (project: any) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  if (!Array.isArray(projects)) {
    console.error("Projects is not an array:", projects);
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        Er is een fout opgetreden bij het weergeven van projecten.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FolderIcon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <DropdownMenuItem>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Bewerken
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => confirmDelete(project)}
                      className="text-destructive">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Verwijderen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {project.client_name && (
                <CardDescription>Klant: {project.client_name}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || "Geen beschrijving"}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {project.status === "active" ? "Actief" : project.status}
                </div>
                <div className="text-xs text-muted-foreground">
                  Aangemaakt op{" "}
                  {new Date(project.created_at).toLocaleDateString("nl-NL")}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex gap-2 w-full">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="flex-1">
                  <Button variant="outline" className="w-full">
                    Details
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/projects/${project.id}/campaigns`}
                  className="flex-1">
                  <Button className="w-full">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Campagnes
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Weet je zeker dat je dit project wilt verwijderen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Alle campagnes,
              content en geplande posts die bij dit project horen worden ook
              verwijderd.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

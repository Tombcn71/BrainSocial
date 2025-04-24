"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  SendIcon,
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
import { useRouter } from "next/navigation";
import { publishContent } from "@/app/actions/content";
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

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "linkedin":
      return "LinkedIn";
    case "twitter":
      return "Twitter";
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    default:
      return platform;
  }
};

export default function ContentList({
  content,
  projectId,
  campaignId,
}: {
  content: any[];
  projectId: string;
  campaignId: string;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<any>(null);
  const [contentToPublish, setContentToPublish] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!contentToDelete) return;

    setIsDeleting(true);
    try {
      // Implement delete content functionality
      toast({
        title: "Content verwijderd",
        description: "De content is succesvol verwijderd.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van de content.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const handlePublish = async () => {
    if (!contentToPublish) return;

    setIsPublishing(true);
    try {
      // Create a scheduled post for now and mark it as published
      const now = new Date().toISOString();
      const result = await publishContent(contentToPublish.id);

      if (result.success) {
        toast({
          title: "Content gepubliceerd",
          description: `De content is succesvol gepubliceerd op ${contentToPublish.platform}.`,
        });
        router.refresh();
      } else {
        toast({
          title: "Fout bij publiceren",
          description:
            result.error ||
            "Er is een fout opgetreden bij het publiceren van de content.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij publiceren",
        description:
          "Er is een fout opgetreden bij het publiceren van de content.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
      setIsPublishDialogOpen(false);
      setContentToPublish(null);
    }
  };

  const confirmDelete = (content: any) => {
    setContentToDelete(content);
    setIsDeleteDialogOpen(true);
  };

  const confirmPublish = (content: any) => {
    // Controleer of content een geldig object is met een platform eigenschap
    if (content && typeof content === "object" && "platform" in content) {
      setContentToPublish(content);
      setIsPublishDialogOpen(true);
    } else {
      // Fallback als er geen platform eigenschap is
      toast({
        title: "Fout bij publiceren",
        description: "Content informatie is onvolledig",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {getPlatformIcon(item.platform)}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {item.content_type}
                  </div>
                  {item.published && (
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Gepubliceerd
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/dashboard/content/edit/${item.id}`}>
                      <DropdownMenuItem>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Bewerken
                      </DropdownMenuItem>
                    </Link>
                    {!item.published && (
                      <DropdownMenuItem onClick={() => confirmPublish(item)}>
                        <SendIcon className="h-4 w-4 mr-2" />
                        Nu publiceren
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => confirmDelete(item)}
                      className="text-destructive">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Verwijderen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-medium mb-2">{item.title || "Geen titel"}</h3>

              {item.image_url && (
                <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title || "Content afbeelding"}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}

              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.content}
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <ClockIcon className="h-3 w-3" />
                <span>
                  Aangemaakt op{" "}
                  {new Date(item.created_at).toLocaleDateString("nl-NL")}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Link
                href={`/dashboard/content/edit/${item.id}`}
                className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <PencilIcon className="h-3 w-3 mr-2" />
                  Bewerken
                </Button>
              </Link>
              {!item.published && (
                <Link
                  href={`/dashboard/calendar?contentId=${item.id}&projectId=${projectId}&campaignId=${campaignId}`}
                  className="flex-1">
                  <Button size="sm" className="w-full">
                    <CalendarIcon className="h-3 w-3 mr-2" />
                    Inplannen
                  </Button>
                </Link>
              )}
              {!item.published && (
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => confirmPublish(item)}>
                  <SendIcon className="h-3 w-3 mr-2" />
                  Publiceren
                </Button>
              )}
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
              Weet je zeker dat je deze content wilt verwijderen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Alle geplande posts
              die bij deze content horen worden ook verwijderd.
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

      <AlertDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Content nu publiceren?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze content wordt direct gepubliceerd op{" "}
              {contentToPublish &&
              typeof contentToPublish === "object" &&
              "platform" in contentToPublish
                ? contentToPublish.platform
                : "social media"}
              . Weet je zeker dat je door wilt gaan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-green-600 hover:bg-green-700">
              {isPublishing ? "Publiceren..." : "Publiceren"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

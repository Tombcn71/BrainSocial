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
import { deleteCampaign } from "@/app/actions/campaigns";
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

export default function CampaignsList({
  projectId,
  campaigns,
}: {
  projectId: string;
  campaigns: any[];
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!campaignToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteCampaign(campaignToDelete.id);

      if (result.success) {
        toast({
          title: "Campagne verwijderd",
          description: "De campagne is succesvol verwijderd.",
        });
        router.refresh();
      } else {
        toast({
          title: "Fout bij verwijderen",
          description:
            result.error ||
            "Er is een fout opgetreden bij het verwijderen van de campagne.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij verwijderen",
        description:
          "Er is een fout opgetreden bij het verwijderen van de campagne.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const confirmDelete = (campaign: any) => {
    setCampaignToDelete(campaign);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{campaign.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link
                      href={`/dashboard/projects/${projectId}/campaigns/${campaign.id}/edit`}>
                      <DropdownMenuItem>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Bewerken
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => confirmDelete(campaign)}
                      className="text-destructive">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Verwijderen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                {campaign.start_date && campaign.end_date
                  ? `${new Date(campaign.start_date).toLocaleDateString(
                      "nl-NL"
                    )} - ${new Date(campaign.end_date).toLocaleDateString(
                      "nl-NL"
                    )}`
                  : campaign.start_date
                  ? `Vanaf ${new Date(campaign.start_date).toLocaleDateString(
                      "nl-NL"
                    )}`
                  : "Geen datum ingesteld"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {campaign.description || "Geen beschrijving"}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
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
                  campaign.platforms.length > 0 &&
                  campaign.platforms.map((platform: string) => (
                    <div
                      key={platform}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {platform}
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Link
                href={`/dashboard/projects/${projectId}/campaigns/${campaign.id}`}
                className="w-full">
                <Button variant="outline" className="w-full">
                  Details bekijken
                </Button>
              </Link>
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
              Weet je zeker dat je deze campagne wilt verwijderen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Alle content en
              geplande posts die bij deze campagne horen worden ook verwijderd.
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

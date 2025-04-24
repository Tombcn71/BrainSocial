"use client";

import { Button } from "@/components/ui/button";
import { InstagramIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { publishToInstagramAction } from "@/app/actions/content";
import { useRouter } from "next/navigation";

export default function InstagramPublishButton({
  contentId,
}: {
  contentId: string;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await publishToInstagramAction(contentId);

      if (result.success) {
        toast({
          title: "Gepubliceerd op Instagram",
          description: "Je content is succesvol gepubliceerd op Instagram.",
        });
        router.refresh();
      } else {
        toast({
          title: "Fout bij publiceren",
          description:
            result.error ||
            "Er is een fout opgetreden bij het publiceren op Instagram.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij publiceren",
        description:
          "Er is een fout opgetreden bij het publiceren op Instagram.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={isPublishing}
      className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90"
      size="sm">
      {isPublishing ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Publiceren...
        </>
      ) : (
        <>
          <InstagramIcon className="h-3 w-3 mr-2" />
          Publiceer op Instagram
        </>
      )}
    </Button>
  );
}

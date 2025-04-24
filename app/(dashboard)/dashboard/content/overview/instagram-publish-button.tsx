"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { publishToInstagram } from "@/app/actions/instagram-publish";
import { Instagram, Loader2 } from "lucide-react";

export default function InstagramPublishButton({
  contentId,
  hasImage = false,
}: {
  contentId: string;
  hasImage: boolean;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handlePublish = async () => {
    if (!hasImage) {
      toast({
        title: "Image Required",
        description:
          "Instagram requires an image for publishing. Please add an image to your content.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const result = await publishToInstagram(contentId);

      if (result.success) {
        toast({
          title: "Published to Instagram",
          description:
            "Your content has been successfully published to Instagram.",
        });
        router.refresh();
      } else {
        toast({
          title: "Publishing Failed",
          description: result.error || "Failed to publish to Instagram.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error publishing to Instagram:", error);
      toast({
        title: "Publishing Failed",
        description:
          "An unexpected error occurred while publishing to Instagram.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button
      size="sm"
      className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90"
      onClick={handlePublish}
      disabled={isPublishing || !hasImage}>
      {isPublishing ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <Instagram className="mr-2 h-3 w-3" />
          Post to Instagram
        </>
      )}
    </Button>
  );
}

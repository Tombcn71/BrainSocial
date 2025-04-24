"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { publishToSocialMedia } from "@/app/actions/social-accounts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  SendIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
} from "lucide-react";

interface PublishDialogProps {
  contentId: string;
  platform: string;
  hasImage: boolean;
}

export default function PublishDialog({
  contentId,
  platform,
  hasImage,
}: PublishDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      // Call the server action to publish content
      const result = await publishToSocialMedia(contentId, platform);

      if (!result.success) {
        setError(result.error || `Failed to publish to ${platform}`);
        toast({
          title: "Fout bij publiceren",
          description:
            result.error ||
            `Er is een fout opgetreden bij het publiceren naar ${platform}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Content gepubliceerd",
          description: `Je content is succesvol gepubliceerd op ${platform}.`,
        });
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error publishing content:", error);
      setError("Er is een onverwachte fout opgetreden");
      toast({
        title: "Fout bij publiceren",
        description:
          "Er is een onverwachte fout opgetreden bij het publiceren.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Only show Instagram as an option if the content has an image
  const showInstagram = platform === "instagram" && hasImage;

  // If platform is not supported or Instagram without image, show a disabled button
  if (
    platform !== "facebook" &&
    platform !== "twitter" &&
    platform !== "linkedin" &&
    !showInstagram
  ) {
    return (
      <Button size="sm" disabled className="flex-1">
        <SendIcon className="h-3 w-3 mr-2" />
        Publiceren
      </Button>
    );
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case "facebook":
        return <FacebookIcon className="h-4 w-4 text-[#1877F2]" />;
      case "twitter":
        return <TwitterIcon className="h-4 w-4 text-[#1DA1F2]" />;
      case "instagram":
        return <InstagramIcon className="h-4 w-4 text-[#E4405F]" />;
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4 text-[#0077B5]" />;
      default:
        return <SendIcon className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
          <SendIcon className="h-3 w-3 mr-2" />
          Publiceren
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Content publiceren naar {platform}</DialogTitle>
          <DialogDescription>
            Je content wordt direct gepubliceerd op {platform}.
            {platform === "instagram" && !hasImage && (
              <p className="text-amber-600 mt-2">
                Let op: Voor Instagram is een afbeelding verplicht.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-2 mb-3 p-2 rounded border">
            {getPlatformIcon()}
            <div>
              <p className="font-medium capitalize">{platform}</p>
              <p className="text-sm text-gray-500">
                Je content wordt direct gepubliceerd
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
              <p className="font-bold">Fout bij publiceren</p>
              <p>{error}</p>
              {error.includes("permission") && (
                <p className="mt-2 text-sm">
                  Controleer of je app de juiste permissies heeft:
                  pages_read_engagement en pages_manage_posts. Je moet mogelijk
                  je Facebook-account opnieuw verbinden met de juiste
                  permissies.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPublishing}>
            Annuleren
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || (platform === "instagram" && !hasImage)}>
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bezig met publiceren...
              </>
            ) : (
              "Publiceren"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

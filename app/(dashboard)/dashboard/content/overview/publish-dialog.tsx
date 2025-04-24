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
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [selectedPlatform, setSelectedPlatform] = useState(platform);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      // Call the server action to publish content
      const result = await publishToSocialMedia(contentId, selectedPlatform);

      if (!result.success) {
        setError(result.error || `Failed to publish to ${selectedPlatform}`);
        toast({
          title: "Fout bij publiceren",
          description:
            result.error ||
            `Er is een fout opgetreden bij het publiceren naar ${selectedPlatform}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Content gepubliceerd",
          description: `Je content is succesvol gepubliceerd op ${selectedPlatform}.`,
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
    switch (selectedPlatform) {
      case "facebook":
        return <FacebookIcon className="h-4 w-4 text-[#1877F2]" />;
      case "facebook_page":
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
          <DialogTitle>Content publiceren</DialogTitle>
          <DialogDescription>
            Selecteer het platform waarop je de content wilt publiceren.
            {selectedPlatform === "instagram" && !hasImage && (
              <p className="text-amber-600 mt-2">
                Let op: Voor Instagram is een afbeelding verplicht.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedPlatform}
            onValueChange={setSelectedPlatform}>
            <div className="flex items-center space-x-2 mb-3 p-2 rounded border hover:bg-gray-50">
              <RadioGroupItem value="facebook" id="facebook" />
              <Label
                htmlFor="facebook"
                className="flex items-center space-x-2 cursor-pointer w-full">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-sm text-gray-500">Persoonlijk profiel</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 mb-3 p-2 rounded border hover:bg-gray-50">
              <RadioGroupItem value="facebook_page" id="facebook_page" />
              <Label
                htmlFor="facebook_page"
                className="flex items-center space-x-2 cursor-pointer w-full">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Facebook Pagina</p>
                  <p className="text-sm text-gray-500">Bedrijfspagina</p>
                </div>
              </Label>
            </div>

            {hasImage && (
              <div className="flex items-center space-x-2 mb-3 p-2 rounded border hover:bg-gray-50">
                <RadioGroupItem value="instagram" id="instagram" />
                <Label
                  htmlFor="instagram"
                  className="flex items-center space-x-2 cursor-pointer w-full">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-gray-500">Business account</p>
                  </div>
                </Label>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-3 p-2 rounded border hover:bg-gray-50">
              <RadioGroupItem value="twitter" id="twitter" />
              <Label
                htmlFor="twitter"
                className="flex items-center space-x-2 cursor-pointer w-full">
                <Twitter className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">Twitter</p>
                  <p className="text-sm text-gray-500">Persoonlijk account</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 mb-3 p-2 rounded border hover:bg-gray-50">
              <RadioGroupItem value="linkedin" id="linkedin" />
              <Label
                htmlFor="linkedin"
                className="flex items-center space-x-2 cursor-pointer w-full">
                <Linkedin className="h-5 w-5 text-blue-700" />
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-sm text-gray-500">Persoonlijk profiel</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

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
            disabled={
              isPublishing || (selectedPlatform === "instagram" && !hasImage)
            }>
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

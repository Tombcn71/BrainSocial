"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Facebook,
  Instagram,
  Loader2,
  Twitter,
  Linkedin,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function PublishButton({
  contentId,
  hasImage = false,
}: {
  contentId: string;
  hasImage?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handlePublish = async () => {
    if (!selectedPlatform) return;

    setIsPublishing(true);
    setError(null);

    try {
      // Call the server action to publish content
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId,
          platform: selectedPlatform,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Content gepubliceerd",
          description: `Je content is succesvol gepubliceerd op ${selectedPlatform}.`,
        });
        setIsOpen(false);
        router.refresh();
      } else {
        setError(
          result.error ||
            `Er is een fout opgetreden bij het publiceren naar ${selectedPlatform}.`
        );
        toast({
          title: "Fout bij publiceren",
          description:
            result.error ||
            `Er is een fout opgetreden bij het publiceren naar ${selectedPlatform}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
          Publiceren
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publiceer naar social media</DialogTitle>
          <DialogDescription>
            Kies een platform om je content naar te publiceren.
            {!hasImage && (
              <p className="text-amber-600 mt-2">
                Let op: Voor Instagram is een afbeelding verplicht.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedPlatform || ""}
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Fout bij publiceren</p>
                <p>{error}</p>
                {error.includes("permission") && (
                  <p className="mt-2 text-sm">
                    Controleer of je app de juiste permissies heeft:
                    pages_read_engagement en pages_manage_posts. Je moet
                    mogelijk je Facebook-account opnieuw verbinden met de juiste
                    permissies.
                  </p>
                )}
              </div>
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
              isPublishing ||
              !selectedPlatform ||
              (selectedPlatform === "instagram" && !hasImage)
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

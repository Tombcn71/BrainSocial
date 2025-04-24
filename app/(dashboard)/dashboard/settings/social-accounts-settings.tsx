"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  PlusIcon,
  Loader2,
  TrashIcon,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SocialAccountsSettings() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const { toast } = useToast();

  // Mock social accounts data
  const [socialAccounts, setSocialAccounts] = useState([
    {
      id: "1",
      platform: "linkedin",
      accountName: "Jansen",
      connected: true,
    },
    {
      id: "2",
      platform: "twitter",
      accountName: "@janjansen",
      connected: true,
    },
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="h-5 w-5" />;
      case "twitter":
        return <TwitterIcon className="h-5 w-5" />;
      case "instagram":
        return <InstagramIcon className="h-5 w-5" />;
      case "facebook":
        return <FacebookIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPlatformName = (platform: string) => {
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

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // This would be replaced with actual OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add mock account
      const newAccount = {
        id: Date.now().toString(),
        platform: selectedPlatform,
        accountName:
          selectedPlatform === "instagram" ? "@janjansen" : "Jan Jansen",
        connected: true,
      };

      setSocialAccounts([...socialAccounts, newAccount]);

      toast({
        title: "Account verbonden",
        description: `Je ${getPlatformName(
          selectedPlatform
        )} account is succesvol verbonden.`,
      });

      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Fout bij verbinden",
        description:
          "Er is een fout opgetreden bij het verbinden van je account. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = (id: string) => {
    setSocialAccounts(socialAccounts.filter((account) => account.id !== id));

    toast({
      title: "Account ontkoppeld",
      description: "Je social media account is succesvol ontkoppeld.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social media accounts</CardTitle>
        <CardDescription>
          Verbind je social media accounts om direct te kunnen publiceren.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border divide-y">
          {socialAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {getPlatformIcon(account.platform)}
                <div>
                  <p className="font-medium">
                    {getPlatformName(account.platform)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {account.accountName}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDisconnect(account.id)}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Ontkoppelen
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Account toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Social media account verbinden</DialogTitle>
              <DialogDescription>
                Verbind een social media account om direct te kunnen publiceren.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={selectedPlatform}
                onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer platform" />
                </SelectTrigger>
                <SelectContent>
                  {!socialAccounts.some(
                    (account) => account.platform === "linkedin"
                  ) && <SelectItem value="linkedin">LinkedIn</SelectItem>}
                  {!socialAccounts.some(
                    (account) => account.platform === "twitter"
                  ) && <SelectItem value="twitter">Twitter</SelectItem>}
                  {!socialAccounts.some(
                    (account) => account.platform === "instagram"
                  ) && <SelectItem value="instagram">Instagram</SelectItem>}
                  {!socialAccounts.some(
                    (account) => account.platform === "facebook"
                  ) && <SelectItem value="facebook">Facebook</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verbinden...
                  </>
                ) : (
                  "Verbinden"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

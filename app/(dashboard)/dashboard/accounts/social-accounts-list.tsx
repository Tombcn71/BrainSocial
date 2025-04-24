"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  TrashIcon,
  TwitterIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  disconnectSocialAccount,
  refreshSocialAccountToken,
} from "@/app/actions/social-accounts";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Voeg een interface toe voor het SocialAccount type bovenaan het bestand, na de imports
interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_id: string;
  access_token: string;
  token_expiry?: string;
  profile_image_url?: string;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "linkedin":
      return <LinkedinIcon className="h-5 w-5 text-[#0077B5]" />;
    case "twitter":
      return <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />;
    case "instagram":
      return <InstagramIcon className="h-5 w-5 text-[#E4405F]" />;
    case "facebook":
      return <FacebookIcon className="h-5 w-5 text-[#1877F2]" />;
    case "facebook_page":
      return <FacebookIcon className="h-5 w-5 text-[#1877F2]" />;
    default:
      return null;
  }
};

// Helper function to get platform color
const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "linkedin":
      return "bg-[#0077B5]/10 text-[#0077B5]";
    case "twitter":
      return "bg-[#1DA1F2]/10 text-[#1DA1F2]";
    case "instagram":
      return "bg-[#E4405F]/10 text-[#E4405F]";
    case "facebook":
      return "bg-[#1877F2]/10 text-[#1877F2]";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Wijzig de accounts parameter type
export default function SocialAccountsList({
  accounts = [],
}: {
  accounts: SocialAccount[];
}) {
  // Wijzig het type van accountToDelete
  const [accountToDelete, setAccountToDelete] = useState<SocialAccount | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDisconnect = async () => {
    if (!accountToDelete) return;

    setIsDeleting(true);
    try {
      const result = await disconnectSocialAccount(accountToDelete.id);

      if (result.success) {
        toast({
          title: "Account ontkoppeld",
          description: `Je ${accountToDelete.platform} account is succesvol ontkoppeld.`,
        });
        router.refresh();
      } else {
        toast({
          title: "Fout bij ontkoppelen",
          description:
            result.error ||
            "Er is een fout opgetreden bij het ontkoppelen van het account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij ontkoppelen",
        description:
          "Er is een fout opgetreden bij het ontkoppelen van het account.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  // Wijzig het type in de handleRefreshToken functie
  const handleRefreshToken = async (account: SocialAccount) => {
    setIsRefreshing(account.id);
    try {
      const result = await refreshSocialAccountToken(account.id);

      if (result.success) {
        toast({
          title: "Token vernieuwd",
          description: `Je ${account.platform} token is succesvol vernieuwd.`,
        });
        router.refresh();
      } else {
        toast({
          title: "Fout bij vernieuwen",
          description:
            result.error ||
            "Er is een fout opgetreden bij het vernieuwen van het token.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij vernieuwen",
        description:
          "Er is een fout opgetreden bij het vernieuwen van het token.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(null);
    }
  };

  // Wijzig het type in de confirmDisconnect functie
  const confirmDisconnect = (account: SocialAccount) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geen accounts gekoppeld</CardTitle>
          <CardDescription>
            Je hebt nog geen social media accounts gekoppeld. Klik op 'Account
            koppelen' om te beginnen.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${getPlatformColor(
                      account.platform
                    )}`}>
                    {getPlatformIcon(account.platform)}
                  </div>
                  <CardTitle className="text-lg">
                    {account.platform === "facebook_page"
                      ? "Facebook Pagina"
                      : account.platform.charAt(0).toUpperCase() +
                        account.platform.slice(1)}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRefreshToken(account)}>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Token vernieuwen
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => confirmDisconnect(account)}
                      className="text-destructive">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Ontkoppelen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={account.profile_image_url || ""}
                    alt={account.account_name}
                  />
                  <AvatarFallback className="capitalize">
                    {account.account_name
                      ? account.account_name[0]
                      : account.platform[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{account.account_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Gekoppeld op{" "}
                    {new Date(account.created_at).toLocaleDateString("nl-NL")}
                  </p>
                </div>
              </div>

              {account &&
                typeof account === "object" &&
                "token_expiry" in account &&
                account.token_expiry && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Token verloopt op: </span>
                    <span>
                      {new Date(account.token_expiry).toLocaleDateString(
                        "nl-NL"
                      )}
                    </span>
                  </div>
                )}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleRefreshToken(account)}
                disabled={isRefreshing === account.id}>
                {isRefreshing === account.id ? (
                  <>
                    <RefreshCwIcon className="h-3 w-3 mr-2 animate-spin" />
                    Token vernieuwen...
                  </>
                ) : (
                  <>
                    <RefreshCwIcon className="h-3 w-3 mr-2" />
                    Token vernieuwen
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Weet je zeker dat je dit account wilt ontkoppelen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Als je dit account ontkoppelt, kun je er geen content meer naar
              publiceren. Je kunt het account later opnieuw koppelen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? "Ontkoppelen..." : "Ontkoppelen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

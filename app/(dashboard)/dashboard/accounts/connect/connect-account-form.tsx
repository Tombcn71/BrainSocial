"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { connectSocialAccount } from "@/app/actions/social-accounts";

export default function ConnectAccountForm() {
  const [platform, setPlatform] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform || !accountName || !accessToken) {
      toast({
        title: "Vul alle velden in",
        description: "Alle velden zijn verplicht om een account te koppelen.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // In een echte applicatie zou je hier OAuth gebruiken
      // Voor deze demo simuleren we het koppelen van een account
      const result = await connectSocialAccount({
        platform,
        accountName,
        accessToken,
      });

      if (result.success) {
        toast({
          title: "Account gekoppeld",
          description: `Je ${platform} account is succesvol gekoppeld.`,
        });
        router.push("/dashboard/accounts");
        router.refresh();
      } else {
        toast({
          title: "Fout bij koppelen",
          description:
            result.error ||
            "Er is een fout opgetreden bij het koppelen van het account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij koppelen",
        description:
          "Er is een fout opgetreden bij het koppelen van het account.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="h-5 w-5 text-[#0077B5]" />;
      case "twitter":
        return <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />;
      case "instagram":
        return <InstagramIcon className="h-5 w-5 text-[#E4405F]" />;
      case "facebook":
        return <FacebookIcon className="h-5 w-5 text-[#1877F2]" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleConnect} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Selecteer platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">
              <div className="flex items-center gap-2">
                <LinkedinIcon className="h-4 w-4 text-[#0077B5]" />
                <span>LinkedIn</span>
              </div>
            </SelectItem>
            <SelectItem value="twitter">
              <div className="flex items-center gap-2">
                <TwitterIcon className="h-4 w-4 text-[#1DA1F2]" />
                <span>Twitter</span>
              </div>
            </SelectItem>
            <SelectItem value="instagram">
              <div className="flex items-center gap-2">
                <InstagramIcon className="h-4 w-4 text-[#E4405F]" />
                <span>Instagram</span>
              </div>
            </SelectItem>
            <SelectItem value="facebook">
              <div className="flex items-center gap-2">
                <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
                <span>Facebook</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountName">Account naam</Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder={
            platform === "twitter"
              ? "@gebruikersnaam"
              : platform === "instagram"
              ? "gebruikersnaam"
              : "Account naam"
          }
          disabled={isConnecting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessToken">Access Token</Label>
        <Input
          id="accessToken"
          type="password"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Voer je access token in"
          disabled={isConnecting}
          required
        />
        <p className="text-xs text-muted-foreground">
          In een echte applicatie zou je OAuth gebruiken om veilig toegang te
          krijgen tot je account. Voor deze demo kun je een willekeurige string
          invoeren.
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isConnecting}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Account koppelen...
            </>
          ) : (
            <>
              {getPlatformIcon()}
              <span className="ml-2">Account koppelen</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

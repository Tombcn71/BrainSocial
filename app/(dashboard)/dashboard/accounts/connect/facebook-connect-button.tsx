"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function FacebookConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Als de authenticatie check klaar is en de gebruiker niet is ingelogd
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Niet ingelogd",
        description:
          "Je moet ingelogd zijn om social media accounts te koppelen",
        variant: "destructive",
      });
      router.push("/login?callbackUrl=/dashboard/accounts/connect");
    }
  }, [isAuthenticated, authLoading, router, toast]);

  const handleConnect = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Niet ingelogd",
        description:
          "Je moet ingelogd zijn om social media accounts te koppelen",
        variant: "destructive",
      });
      router.push("/login?callbackUrl=/dashboard/accounts/connect");
      return;
    }

    setIsLoading(true);
    try {
      // Generate a state parameter for security
      const state = Math.random().toString(36).substring(2);

      // Store the state in localStorage to verify when the user returns
      localStorage.setItem("facebook_oauth_state", state);

      // Define the permissions we need
      const scopes = [
        "public_profile",
        "email",
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_posts",
        "instagram_basic",
        "instagram_content_publish",
      ];

      // Get the app ID from environment variables
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI ||
          "http://localhost:3000/api/auth/facebook/callback"
      );

      // Build the OAuth URL
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(
        ","
      )}&auth_type=rerequest`;

      // Redirect to Facebook for authentication
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error connecting to Facebook:", error);
      setIsLoading(false);

      toast({
        title: "Fout bij verbinden",
        description: "Er is een fout opgetreden bij het verbinden met Facebook",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <Button
        disabled
        className="w-full bg-[#1877F2] hover:bg-[#0E65D9] text-white">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Laden...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading || !isAuthenticated}
      className="w-full bg-[#1877F2] hover:bg-[#0E65D9] text-white">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Facebook className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Verbinden..." : "Verbind met Facebook"}
    </Button>
  );
}

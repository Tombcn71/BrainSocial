"use client";

import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function FacebookConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setIsLoading(true);

      // Genereer een state parameter om CSRF aanvallen te voorkomen
      const state = uuidv4();

      // Sla de state op in een cookie
      document.cookie = `facebook_oauth_state=${state}; path=/; max-age=3600; SameSite=Lax`;

      // Bouw de OAuth URL
      const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI ||
          "http://localhost:3000/api/auth/facebook/callback"
      );

      // Definieer de permissies die we nodig hebben
      // Zorg ervoor dat we alle benodigde permissies aanvragen
      const scope = encodeURIComponent(
        [
          "public_profile",
          "email",
          "pages_show_list",
          "pages_read_engagement",
          "pages_manage_posts",
          "pages_manage_metadata",
          "instagram_basic",
          "instagram_content_publish",
          // "publish_to_groups" removed - this permission was causing the error
        ].join(",")
      );

      // Bouw de volledige OAuth URL
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

      // Redirect naar de OAuth URL
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error connecting to Facebook:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="w-full bg-[#1877F2] hover:bg-[#0E65D9] text-white">
      <Facebook className="mr-2 h-4 w-4" />
      {isLoading ? "Verbinden..." : "Verbind met Facebook"}
    </Button>
  );
}

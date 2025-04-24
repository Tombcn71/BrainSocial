"use client";

import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FacebookConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Facebook connection process...");

      // Bouw de OAuth URL
      const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI ||
          "http://localhost:3000/api/auth/facebook/callback"
      );

      console.log(
        "Using redirect URI:",
        process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI
      );

      // Definieer de permissies die we nodig hebben
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
        ].join(",")
      );

      // Bouw de volledige OAuth URL - zonder state parameter
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

      console.log("Redirecting to Facebook OAuth URL...");

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

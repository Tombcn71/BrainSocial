"use client";

import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useState } from "react";

export default function FacebookConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
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
      )}`;

      // Redirect to Facebook for authentication
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
      {isLoading ? "Connecting..." : "Connect with Facebook"}
    </Button>
  );
}

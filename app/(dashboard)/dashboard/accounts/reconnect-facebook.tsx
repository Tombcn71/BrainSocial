"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook } from "lucide-react";

export default function ReconnectFacebook() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleReconnect = async () => {
    setIsConnecting(true);
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
          "https://www.brainsocial.nl/api/auth/facebook/callback"
      );

      // Build the OAuth URL
      const oauthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(
        ","
      )}`;

      // Redirect to Facebook for authentication
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error reconnecting to Facebook:", error);
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconnect Facebook with Required Permissions</CardTitle>
        <CardDescription>
          To publish content to Facebook, you need to reconnect your account
          with the required permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Your Facebook account needs the following permissions:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>pages_read_engagement</li>
          <li>pages_manage_posts</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          These permissions allow the app to post content to your Facebook
          profile and pages.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleReconnect}
          disabled={isConnecting}
          className="w-full bg-[#1877F2] hover:bg-[#0E65D9] text-white">
          <Facebook className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Reconnect Facebook"}
        </Button>
      </CardFooter>
    </Card>
  );
}

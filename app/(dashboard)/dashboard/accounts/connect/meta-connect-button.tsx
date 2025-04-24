"use client";

import { Button } from "@/components/ui/button";
import { FacebookIcon } from "lucide-react";

export function MetaConnectButton() {
  const scopes = [
    "public_profile",
    "email",
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "instagram_basic",
    "instagram_content_publish",
  ];

  const handleConnect = () => {
    window.location.href = `/api/auth/meta?scope=${scopes.join(",")}`;
  };

  return (
    <Button
      onClick={handleConnect}
      className="w-full flex items-center gap-2"
      variant="outline">
      <FacebookIcon className="h-4 w-4 text-blue-600" />
      Verbind Facebook & Instagram
    </Button>
  );
}

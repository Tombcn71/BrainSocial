"use client";

import { Button } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export default function MetaConnectButton() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Redirect naar de Meta OAuth route
    window.location.href = "/api/auth/meta";
  };

  return (
    <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verbinden met Meta...
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mr-2">
            <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
            <InstagramIcon className="h-4 w-4 text-[#E4405F]" />
          </div>
          <span>Verbind Facebook & Instagram</span>
        </>
      )}
    </Button>
  );
}

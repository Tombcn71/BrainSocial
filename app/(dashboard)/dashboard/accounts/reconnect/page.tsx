import ReconnectFacebook from "../reconnect-facebook";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReconnectPage() {
  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Reconnect Social Accounts</h1>
          <p className="text-muted-foreground">
            Reconnect your social media accounts with the required permissions
            to enable publishing.
          </p>
        </div>

        <ReconnectFacebook />

        <div className="mt-6 text-center">
          <Link href="/dashboard/accounts">
            <Button variant="outline">Back to Accounts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

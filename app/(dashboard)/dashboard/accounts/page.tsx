export const dynamic = "force-dynamic";

import { getSocialAccounts } from "@/app/actions/social-accounts";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import SocialAccountsList from "./social-accounts-list";

export default async function SocialAccountsPage() {
  const { success, accounts, error } = await getSocialAccounts();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Social Media Accounts
          </h1>
          <p className="text-muted-foreground mt-2">
            Beheer je gekoppelde social media accounts
          </p>
        </div>
        <Link href="/dashboard/accounts/connect">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Account koppelen
          </Button>
        </Link>
      </div>

      {!success ? (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error ||
            "Er is een fout opgetreden bij het ophalen van je accounts."}
        </div>
      ) : (
        <SocialAccountsList accounts={accounts} />
      )}
    </div>
  );
}

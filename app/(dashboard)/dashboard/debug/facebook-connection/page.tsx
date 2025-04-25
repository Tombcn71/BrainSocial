"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertTriangle, CheckCircle, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function FacebookDebugPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);
  const [permissionsData, setPermissionsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  const fetchDebugInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch Facebook account data
      const accountResponse = await fetch("/api/debug/facebook-account");
      const accountResult = await accountResponse.json();

      if (accountResponse.ok) {
        setAccountData(accountResult);

        // If we have an account, check permissions
        if (accountResult.account) {
          const permissionsResponse = await fetch(
            `/api/debug/facebook-permissions?accessToken=${accountResult.account.access_token}`
          );
          const permissionsResult = await permissionsResponse.json();
          setPermissionsData(permissionsResult);
        }
      } else {
        setError(
          accountResult.error || "Failed to fetch Facebook account data"
        );
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconnect = () => {
    window.location.href = "/api/auth/facebook";
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Facebook Connection Debug</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-700">Error</h3>
                <p className="text-red-600">{error}</p>
                <Button onClick={handleReconnect} className="mt-4">
                  Reconnect Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Facebook Account</CardTitle>
              <CardDescription>
                {!accountData?.account
                  ? "No Facebook account found"
                  : "Facebook account details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!accountData?.account ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    You don't have a Facebook account connected.
                  </p>
                  <Button onClick={handleReconnect}>
                    Connect Facebook Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {accountData.account.account_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {accountData.account.account_id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Platform:</span>{" "}
                      {accountData.account.platform}
                    </div>
                    <div>
                      <span className="font-medium">Page ID:</span>{" "}
                      {accountData.account.page_id || "Not set"}
                    </div>
                    <div>
                      <span className="font-medium">Token Expiry:</span>{" "}
                      {accountData.account.token_expiry
                        ? new Date(
                            accountData.account.token_expiry
                          ).toLocaleString()
                        : "No expiry set"}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {accountData.account.token_expiry &&
                      new Date(accountData.account.token_expiry) <
                        new Date() ? (
                        <span className="text-red-500">Expired</span>
                      ) : (
                        <span className="text-green-500">Valid</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button onClick={handleReconnect} variant="outline">
                      Reconnect Facebook Account
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {permissionsData && (
            <Card>
              <CardHeader>
                <CardTitle>Facebook Permissions</CardTitle>
                <CardDescription>
                  {permissionsData.success
                    ? "All required permissions are granted"
                    : "Missing required permissions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {permissionsData.success ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>All required permissions are granted</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center text-red-500 mb-4">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span>Missing required permissions</span>
                    </div>
                    {permissionsData.missingPermissions && (
                      <div>
                        <p className="font-medium mb-2">Missing permissions:</p>
                        <ul className="list-disc pl-5">
                          {permissionsData.missingPermissions.map(
                            (perm: string) => (
                              <li key={perm}>{perm}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="mt-4">
                      <Button onClick={handleReconnect}>
                        Reconnect with Required Permissions
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="mt-6 text-center">
        <Link href="/dashboard/accounts">
          <Button variant="outline">Back to Accounts</Button>
        </Link>
      </div>
    </div>
  );
}

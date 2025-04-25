"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Facebook, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FacebookPagesDebugPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First get all Facebook accounts
      const accountsResponse = await fetch("/api/debug/facebook-accounts");
      const accountsData = await accountsResponse.json();

      if (!accountsResponse.ok) {
        throw new Error(
          accountsData.error || "Failed to fetch Facebook accounts"
        );
      }

      setAccounts(accountsData.accounts || []);

      // Then get all Facebook pages
      const pagesResponse = await fetch("/api/debug/facebook-pages");
      const pagesData = await pagesResponse.json();

      if (!pagesResponse.ok) {
        throw new Error(pagesData.error || "Failed to fetch Facebook pages");
      }

      setPages(pagesData.pages || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconnect = () => {
    window.location.href = "/api/auth/facebook";
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Facebook Pages Debug</h1>
        <Button onClick={fetchData} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Refresh Data
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-700">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Facebook Accounts</CardTitle>
              <CardDescription>
                {accounts.length === 0
                  ? "No Facebook accounts found"
                  : `Found ${accounts.length} Facebook account(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    You don't have any Facebook accounts connected.
                  </p>
                  <Button onClick={handleReconnect}>
                    Connect Facebook Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="border p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                        <h3 className="font-medium">{account.account_name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Account ID:
                          </span>{" "}
                          {account.account_id}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Page ID:
                          </span>{" "}
                          {account.page_id || (
                            <span className="text-red-500">
                              None (Personal Account)
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Token Expiry:
                          </span>{" "}
                          {account.token_expiry
                            ? new Date(account.token_expiry).toLocaleString()
                            : "No expiry set"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>{" "}
                          {account.token_expiry &&
                          new Date(account.token_expiry) < new Date() ? (
                            <span className="text-red-500">Expired</span>
                          ) : (
                            <span className="text-green-500">Valid</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facebook Pages</CardTitle>
              <CardDescription>
                {pages.length === 0
                  ? "No Facebook pages found"
                  : `Found ${pages.length} Facebook page(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pages.length === 0 ? (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    No Facebook Pages found. You need to have a Facebook Page to
                    publish content.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have a Facebook Page but it's not showing up here,
                    try reconnecting your Facebook account with the required
                    permissions.
                  </p>
                  <Button onClick={handleReconnect}>
                    Reconnect Facebook Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="border p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                        <h3 className="font-medium">{page.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Page ID:
                          </span>{" "}
                          {page.id}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Access Token:
                          </span>{" "}
                          <span className="font-mono text-xs">
                            {page.access_token
                              ? page.access_token.substring(0, 15) + "..."
                              : "None"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Category:
                          </span>{" "}
                          {page.category || "N/A"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Connected:
                          </span>{" "}
                          {page.connected ? (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" /> No
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Need to create a Facebook Page? Visit{" "}
                  <a
                    href="https://www.facebook.com/pages/create"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    facebook.com/pages/create
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

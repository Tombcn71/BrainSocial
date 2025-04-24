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
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";

export default function InstagramDebugPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [debugData, setDebugData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDebugInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/debug-instagram`);
      const data = await response.json();

      if (response.ok && data.success) {
        setDebugData(data);
      } else {
        setError(data.error || "Failed to fetch Instagram information");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Instagram Debug Tool</h1>
          <p className="text-muted-foreground">
            This tool helps diagnose issues with your Instagram Business account
            connection.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
              {error.includes("No Instagram account connected") && (
                <div className="mt-4">
                  <Link href="/dashboard/accounts/connect">
                    <Button>Connect Instagram Account</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : debugData ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Instagram Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Account Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {debugData.account.accountName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Facebook Page ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {debugData.account.pageId || "Not set"}
                    </dd>
                  </div>
                  {debugData.account.tokenExpiry && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Token Expiry
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(
                          debugData.account.tokenExpiry
                        ).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Instagram Business Account Check</CardTitle>
              </CardHeader>
              <CardContent>
                {debugData.instagramCheck.success ? (
                  <div>
                    <div className="flex items-center mb-4 text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">
                        Instagram Business Account is properly connected
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Instagram Account ID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {debugData.instagramCheck.instagramAccountId}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>
                      {debugData.instagramCheck.error ||
                        "Instagram Business Account is not properly connected"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {debugData.instagramAccountInfo && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Instagram Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    {debugData.instagramAccountInfo.profile_picture_url ? (
                      <img
                        src={
                          debugData.instagramAccountInfo.profile_picture_url ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        className="h-12 w-12 rounded-full mr-4"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {debugData.instagramAccountInfo.name ||
                          debugData.instagramAccountInfo.username}
                      </p>
                      {debugData.instagramAccountInfo.username && (
                        <p className="text-sm text-gray-500">
                          @{debugData.instagramAccountInfo.username}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {debugData.publishingTest && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Instagram Publishing Test</CardTitle>
                </CardHeader>
                <CardContent>
                  {debugData.publishingTest.success ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>{debugData.publishingTest.message}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-red-500 mb-4">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <span>
                          {debugData.publishingTest.error ||
                            "Failed to test Instagram publishing"}
                        </span>
                      </div>
                      {debugData.publishingTest.stage && (
                        <p className="text-sm text-gray-500">
                          Failed at stage: {debugData.publishingTest.stage}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {debugData.pagesWithInstagram &&
              debugData.pagesWithInstagram.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Available Instagram Business Accounts</CardTitle>
                    <CardDescription>
                      These Facebook Pages have Instagram Business accounts
                      connected to them
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {debugData.pagesWithInstagram.map((page: any) => (
                        <li key={page.pageId} className="py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Facebook className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{page.pageName}</p>
                              <p className="text-xs text-gray-500">
                                Page ID: {page.pageId}
                              </p>
                              <p className="text-xs text-gray-500">
                                Instagram ID: {page.instagramAccountId}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

            {debugData.allPages && debugData.allPages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Facebook Pages</CardTitle>
                  <CardDescription>
                    You have access to these Facebook Pages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {debugData.allPages.map((page: any) => (
                      <li key={page.id} className="py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Facebook className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{page.name}</p>
                            <p className="text-xs text-gray-500">
                              Page ID: {page.id}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}

        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={fetchDebugInfo} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
          <Link href="/dashboard/accounts">
            <Button variant="outline">Back to Accounts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

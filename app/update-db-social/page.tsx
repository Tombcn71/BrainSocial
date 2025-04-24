"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdateDbSocialPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const updateDatabase = async () => {
    setStatus("loading");
    setMessage("Database wordt bijgewerkt...");

    try {
      const response = await fetch("/api/db-update-social");
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Er is een fout opgetreden");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Er is een fout opgetreden bij het bijwerken van de database");
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Database Update - Social Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Klik op de knop om de tabellen voor social media accounts aan te
            maken.
          </p>

          {status !== "idle" && (
            <div
              className={`p-3 rounded ${
                status === "loading"
                  ? "bg-blue-100 text-blue-800"
                  : status === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
              {message}
            </div>
          )}

          <Button
            onClick={updateDatabase}
            disabled={status === "loading"}
            className="w-full">
            {status === "loading" ? "Bezig met updaten..." : "Database Updaten"}
          </Button>

          {status === "success" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/dashboard/accounts")}>
              Ga naar Accounts
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

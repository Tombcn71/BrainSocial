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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function DbUpdatePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/db-update", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Database bijgewerkt",
          description: "De database is succesvol bijgewerkt.",
        });
        setIsUpdated(true);
        setResult(data.message || "Database bijgewerkt");
      } else {
        toast({
          title: "Fout bij bijwerken",
          description:
            data.error ||
            "Er is een fout opgetreden bij het bijwerken van de database.",
          variant: "destructive",
        });
        setResult(data.error || "Fout bij bijwerken");
      }
    } catch (error) {
      toast({
        title: "Fout bij bijwerken",
        description:
          "Er is een fout opgetreden bij het bijwerken van de database.",
        variant: "destructive",
      });
      setResult(
        "Fout bij bijwerken: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Database Bijwerken</CardTitle>
          <CardDescription>
            Voeg de oauth_id kolom toe aan de users tabel om Google OAuth te
            ondersteunen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deze actie zal de database structuur bijwerken om Google OAuth te
            ondersteunen. Dit is nodig om in te loggen met Google.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || isUpdated}
            className="w-full">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Database bijwerken...
              </>
            ) : isUpdated ? (
              "Database bijgewerkt"
            ) : (
              "Database bijwerken"
            )}
          </Button>
          {result && (
            <div className="w-full">
              <p className="text-sm font-medium">Resultaat:</p>
              <pre className="mt-2 w-full rounded-md bg-muted p-4 overflow-auto text-xs">
                {result}
              </pre>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

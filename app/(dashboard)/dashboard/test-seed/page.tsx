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
import { seedTestProject } from "@/app/actions/seed-projects";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function TestSeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedTestProject();

      if (result.success) {
        toast({
          title: "Test data aangemaakt",
          description:
            "Het test project, campagne, content en geplande post zijn succesvol aangemaakt.",
        });
        setIsSeeded(true);
        setProjectId(result.projectId);
        setCampaignId(result.campaignId);
      } else {
        toast({
          title: "Fout bij aanmaken test data",
          description:
            result.error ||
            "Er is een fout opgetreden bij het aanmaken van test data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij aanmaken test data",
        description:
          "Er is een fout opgetreden bij het aanmaken van test data.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Data Aanmaken</CardTitle>
          <CardDescription>
            Maak een test project, campagne, content en geplande post aan om de
            functionaliteit te testen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            De volgende test data wordt aangemaakt:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Test Marketing Project</li>
            <li>Zomer Campagne</li>
            <li>Zomer Aanbieding content</li>
            <li>Geplande post voor morgen</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button
            onClick={handleSeed}
            disabled={isSeeding || isSeeded}
            className="w-full">
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test data aanmaken...
              </>
            ) : isSeeded ? (
              "Test data aangemaakt"
            ) : (
              "Test data aanmaken"
            )}
          </Button>
          {isSeeded && (
            <div className="w-full space-y-4">
              <div className="bg-muted p-3 rounded text-sm">
                <p className="font-medium">Project en campagne aangemaakt:</p>
                <p className="mt-1">Project ID: {projectId}</p>
                <p>Campagne ID: {campaignId}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/dashboard/projects">
                  <Button variant="outline" className="w-full">
                    Ga naar Projecten
                  </Button>
                </Link>
                <Link href="/dashboard/calendar">
                  <Button variant="outline" className="w-full">
                    Ga naar Kalender
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

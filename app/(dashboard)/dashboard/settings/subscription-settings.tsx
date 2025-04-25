"use client";

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
import { CheckIcon, XIcon } from "lucide-react";

export default function SubscriptionSettings() {
  const { toast } = useToast();

  // Mock subscription data
  const subscription = {
    plan: "starter",
    status: "active",
    renewalDate: "2023-05-15",
    features: {
      aiGenerations: 5,
      contentCalendar: true,
      socialChannels: 1,
      analytics: false,
      prioritySupport: false,
    },
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade gestart",
      description: "Je wordt doorgestuurd naar de betaalpagina.",
    });
  };

  const handleCancel = () => {
    toast({
      title: "Abonnement opgezegd",
      description: "Je abonnement is opgezegd en loopt af op de einddatum.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            Beheer je abonnement en facturering.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {subscription.plan.charAt(0).toUpperCase() +
                    subscription.plan.slice(1)}{" "}
                  Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.status === "active" ? "Actief" : "Inactief"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Volgende factuurdatum</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(subscription.renewalDate).toLocaleDateString(
                    "nl-NL"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Inbegrepen in je abonnement</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>
                  {subscription.features.aiGenerations} AI generaties per dag
                </span>
              </li>
              {subscription.features.contentCalendar && (
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Basis content kalender</span>
                </li>
              )}
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>
                  {subscription.features.socialChannels} social media kanalen
                </span>
              </li>
              {subscription.features.analytics ? (
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Analytics dashboard</span>
                </li>
              ) : (
                <li className="flex items-start">
                  <XIcon className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <span className="text-muted-foreground">
                    Analytics dashboard
                  </span>
                </li>
              )}
              {subscription.features.prioritySupport ? (
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Prioriteit ondersteuning</span>
                </li>
              ) : (
                <li className="flex items-start">
                  <XIcon className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <span className="text-muted-foreground">
                    Prioriteit ondersteuning
                  </span>
                </li>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          {subscription.plan !== "plus" && (
            <Button onClick={handleUpgrade}>Upgrade naar Plus</Button>
          )}
          <Button variant="outline" onClick={handleCancel}>
            Abonnement opzeggen
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Factuurgeschiedenis</CardTitle>
          <CardDescription>Bekijk en download je facturen.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 p-4 font-medium border-b">
              <div>Datum</div>
              <div>Bedrag</div>
              <div>Status</div>
              <div className="text-right">Download</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-4 p-4">
                <div>15 Apr 2023</div>
                <div>€19,99</div>
                <div>Betaald</div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    PDF
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 p-4">
                <div>15 Mar 2023</div>
                <div>€19,99</div>
                <div>Betaald</div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    PDF
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 p-4">
                <div>15 Feb 2023</div>
                <div>€19,99</div>
                <div>Betaald</div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

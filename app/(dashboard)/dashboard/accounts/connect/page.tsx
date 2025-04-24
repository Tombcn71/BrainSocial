import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FacebookConnectButton from "./facebook-connect-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Gebruik de correcte manier om searchParams te gebruiken in Next.js 13+
export default function ConnectAccountPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  // In Next.js 13+ hoef je searchParams niet te awaiten in een Server Component
  const error = searchParams?.error;
  const success = searchParams?.success;

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Account Koppelen</CardTitle>
            <CardDescription>
              Koppel je social media accounts om direct content te kunnen
              publiceren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Fout bij het koppelen</AlertTitle>
                <AlertDescription>
                  {error === "oauth_denied"
                    ? "Je hebt de toestemming geweigerd. Probeer het opnieuw."
                    : error === "missing_params"
                    ? "Er ontbreken parameters in de OAuth callback."
                    : error === "invalid_state"
                    ? "Ongeldige state parameter. Probeer het opnieuw."
                    : error === "token_exchange"
                    ? "Fout bij het uitwisselen van de code voor een token."
                    : error === "user_data"
                    ? "Fout bij het ophalen van gebruikersgegevens."
                    : "Er is een onbekende fout opgetreden. Probeer het opnieuw."}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">
                  Account gekoppeld
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Je social media accounts zijn succesvol gekoppeld.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InfoIcon
                      className="h-5 w-5 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Facebook & Instagram Integratie
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Door te verbinden met Facebook krijg je toegang tot
                        zowel Facebook als Instagram Business accounts. Zorg
                        ervoor dat:
                      </p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Je bent ingelogd op Facebook</li>
                        <li>
                          Je Instagram account is gekoppeld aan een Facebook
                          pagina
                        </li>
                        <li>
                          Je Instagram account is ingesteld als Business account
                        </li>
                        <li>Je bent beheerder van de Facebook pagina</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <FacebookConnectButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { BrainCircuitIcon } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-bg-1 flex items-center justify-center">
              <BrainCircuitIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-purple">
              BrainSocial.nl
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">Privacybeleid</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Inleiding</h2>
          <p>
            Welkom bij BrainSocial. We zetten ons in om uw privacy te beschermen
            en te respecteren. Dit privacybeleid legt uit hoe wij persoonlijke
            gegevens verzamelen, gebruiken, delen en beschermen wanneer u onze
            website en diensten gebruikt.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. Gegevensverzameling
          </h2>
          <p>Wij verzamelen de volgende soorten informatie:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Accountgegevens: naam, e-mailadres, wachtwoord en
              profielinformatie.
            </li>
            <li>
              Gebruiksgegevens: informatie over hoe u onze diensten gebruikt.
            </li>
            <li>
              Apparaatgegevens: IP-adres, browsertype, besturingssysteem en
              apparaatinformatie.
            </li>
            <li>
              Social media gegevens: wanneer u uw social media accounts koppelt,
              hebben we toegang tot bepaalde informatie van deze accounts.
            </li>
            <li>
              Content: de content die u creëert en publiceert via onze diensten.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Gebruik van gegevens
          </h2>
          <p>Wij gebruiken uw gegevens voor de volgende doeleinden:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Om onze diensten te leveren en te onderhouden.</li>
            <li>Om uw account te beheren en klantenservice te bieden.</li>
            <li>Om u te informeren over wijzigingen in onze diensten.</li>
            <li>
              Om de gebruikerservaring te verbeteren en onze diensten te
              optimaliseren.
            </li>
            <li>Om fraude te detecteren en te voorkomen.</li>
            <li>Om te voldoen aan wettelijke verplichtingen.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Delen van gegevens
          </h2>
          <p>Wij delen uw gegevens alleen in de volgende omstandigheden:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Met uw toestemming, bijvoorbeeld wanneer u content publiceert op
              social media platforms.
            </li>
            <li>
              Met dienstverleners die ons helpen bij het leveren van onze
              diensten.
            </li>
            <li>Wanneer wettelijk vereist of om onze rechten te beschermen.</li>
            <li>Bij een bedrijfsoverdracht, fusie of overname.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            5. Gegevensbeveiliging
          </h2>
          <p>
            We nemen passende technische en organisatorische maatregelen om uw
            gegevens te beschermen tegen ongeautoriseerde toegang, verlies of
            diefstal. Echter, geen enkele methode van elektronische opslag of
            verzending is 100% veilig.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Uw rechten</h2>
          <p>
            Onder de AVG (Algemene Verordening Gegevensbescherming) heeft u de
            volgende rechten:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Recht op inzage: u kunt een kopie opvragen van uw persoonlijke
              gegevens.
            </li>
            <li>
              Recht op rectificatie: u kunt onjuiste gegevens laten corrigeren.
            </li>
            <li>
              Recht op vergetelheid: u kunt vragen om verwijdering van uw
              gegevens.
            </li>
            <li>
              Recht op beperking van verwerking: u kunt vragen om beperking van
              het gebruik van uw gegevens.
            </li>
            <li>
              Recht op gegevensoverdraagbaarheid: u kunt vragen om uw gegevens
              in een gestructureerd formaat te ontvangen.
            </li>
            <li>
              Recht van bezwaar: u kunt bezwaar maken tegen de verwerking van uw
              gegevens.
            </li>
          </ul>
          <p>
            Om een van deze rechten uit te oefenen, kunt u contact met ons
            opnemen via onze{" "}
            <Link href="/contact" className="text-brand-purple hover:underline">
              contactpagina
            </Link>{" "}
            of via{" "}
            <Link
              href="/data-deletion"
              className="text-brand-purple hover:underline">
              gegevensverwijdering
            </Link>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
          <p>
            We gebruiken cookies en vergelijkbare technologieën om uw voorkeuren
            te onthouden, statistieken te verzamelen en uw ervaring te
            verbeteren. U kunt uw browserinstellingen aanpassen om cookies te
            weigeren, maar dit kan de functionaliteit van onze diensten
            beïnvloeden.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            8. Wijzigingen in dit beleid
          </h2>
          <p>
            We kunnen dit privacybeleid van tijd tot tijd bijwerken. We zullen u
            op de hoogte stellen van belangrijke wijzigingen door een melding op
            onze website te plaatsen of u een e-mail te sturen.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact</h2>
          <p>
            Als u vragen heeft over dit privacybeleid of hoe wij met uw gegevens
            omgaan, neem dan contact met ons op via onze{" "}
            <Link href="/contact" className="text-brand-purple hover:underline">
              contactpagina
            </Link>
            .
          </p>
        </div>
      </main>
      <footer className="border-t py-8 bg-white">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} BrainSocial. Alle rechten voorbehouden.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy-policy" className="hover:text-brand-purple">
              Privacybeleid
            </Link>
            <Link href="/terms" className="hover:text-brand-purple">
              Algemene Voorwaarden
            </Link>
            <Link href="/data-deletion" className="hover:text-brand-purple">
              Gegevensverwijdering
            </Link>
            <Link href="/contact" className="hover:text-brand-purple">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

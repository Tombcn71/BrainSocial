import Link from "next/link";
import { BrainCircuitIcon } from "lucide-react";

export default function DataDeletionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-bg-1 flex items-center justify-center">
              <BrainCircuitIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-purple">
              BrainSocial
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">Gegevensverwijdering</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Bij BrainSocial respecteren we uw recht op privacy en
            gegevensbescherming. Hieronder vindt u informatie over hoe u uw
            gegevens kunt laten verwijderen.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Uw recht op verwijdering
          </h2>
          <p>
            Onder de Algemene Verordening Gegevensbescherming (AVG) heeft u het
            recht om te verzoeken dat uw persoonlijke gegevens worden
            verwijderd. Dit wordt ook wel het 'recht op vergetelheid' genoemd.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Hoe u een verzoek tot gegevensverwijdering kunt indienen
          </h2>
          <p>
            U kunt een verzoek tot verwijdering van uw gegevens indienen op de
            volgende manieren:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">
              <strong>Via e-mail:</strong> Stuur een e-mail naar{" "}
              <a
                href="mailto:privacy@brainsocial.nl"
                className="text-brand-purple hover:underline">
                privacy@brainsocial.nl
              </a>{" "}
              met als onderwerp "Verzoek tot gegevensverwijdering". Vermeld in
              uw e-mail uw volledige naam en het e-mailadres dat aan uw account
              is gekoppeld.
            </li>
            <li className="mb-2">
              <strong>Via het contactformulier:</strong> Vul ons{" "}
              <Link
                href="/contact"
                className="text-brand-purple hover:underline">
                contactformulier
              </Link>{" "}
              in en selecteer "Gegevensverwijdering" als onderwerp.
            </li>
            <li className="mb-2">
              <strong>Per post:</strong> Stuur een brief naar ons kantooradres
              met uw verzoek tot gegevensverwijdering. Zorg ervoor dat u uw
              volledige naam, e-mailadres en gebruikersnaam vermeldt.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Wat gebeurt er na uw verzoek
          </h2>
          <p>
            Na ontvangst van uw verzoek zullen we de volgende stappen
            ondernemen:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">
              We bevestigen de ontvangst van uw verzoek binnen 5 werkdagen.
            </li>
            <li className="mb-2">
              We verifiëren uw identiteit om ervoor te zorgen dat we de juiste
              persoon zijn gegevens verwijderen.
            </li>
            <li className="mb-2">
              We verwerken uw verzoek en verwijderen uw gegevens uit onze
              systemen binnen 30 dagen na verificatie.
            </li>
            <li className="mb-2">
              We sturen u een bevestiging wanneer het verwijderingsproces is
              voltooid.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Beperkingen</h2>
          <p>
            In sommige gevallen kunnen we mogelijk niet alle gegevens
            verwijderen vanwege wettelijke verplichtingen of legitieme
            bedrijfsbelangen. In dergelijke gevallen zullen we u informeren over
            welke gegevens we moeten bewaren en waarom.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
          <p>
            Als u vragen heeft over het proces van gegevensverwijdering of als u
            hulp nodig heeft bij het indienen van een verzoek, neem dan contact
            met ons op via:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              E-mail:{" "}
              <a
                href="mailto:privacy@brainsocial.nl"
                className="text-brand-purple hover:underline">
                privacy@brainsocial.nl
              </a>
            </li>
            <li>Telefoon: +31 (0)20 123 4567</li>
            <li>
              Adres: BrainSocial B.V., Voorbeeldstraat 123, 1234 AB Amsterdam
            </li>
          </ul>
          <p>
            U kunt ook ons{" "}
            <Link href="/contact" className="text-brand-purple hover:underline">
              contactformulier
            </Link>{" "}
            gebruiken om contact met ons op te nemen.
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

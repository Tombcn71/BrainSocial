import Link from "next/link";
import { BrainCircuitIcon } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Algemene Voorwaarden</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. Acceptatie van voorwaarden
          </h2>
          <p>
            Door toegang te krijgen tot of gebruik te maken van de diensten van
            BrainSocial, gaat u akkoord met deze Algemene Voorwaarden. Als u
            niet akkoord gaat met deze voorwaarden, gebruik onze diensten dan
            niet.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. Beschrijving van diensten
          </h2>
          <p>
            BrainSocial biedt een platform voor het genereren, plannen en
            publiceren van social media content met behulp van AI-technologie.
            Onze diensten omvatten, maar zijn niet beperkt tot, content creatie,
            content planning en publicatie naar verschillende social media
            platforms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Gebruikersaccounts
          </h2>
          <p>
            Om gebruik te maken van onze diensten, moet u een account aanmaken.
            U bent verantwoordelijk voor het handhaven van de vertrouwelijkheid
            van uw accountgegevens en voor alle activiteiten die onder uw
            account plaatsvinden. U stemt ermee in om ons onmiddellijk op de
            hoogte te stellen van ongeautoriseerd gebruik van uw account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Gebruiksvoorwaarden
          </h2>
          <p>Bij het gebruik van onze diensten stemt u ermee in:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Geen content te creëren of te publiceren die illegaal, beledigend,
              bedreigend, lasterlijk, obsceen of anderszins ongepast is.
            </li>
            <li>
              Geen inbreuk te maken op intellectuele eigendomsrechten van
              derden.
            </li>
            <li>
              Geen schadelijke code, zoals virussen of malware, te verspreiden.
            </li>
            <li>
              Onze diensten niet te gebruiken voor spam of ongeautoriseerde
              reclame.
            </li>
            <li>
              Zich te houden aan alle toepasselijke wetten en regelgeving.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            5. Intellectueel eigendom
          </h2>
          <p>
            Alle content die via onze diensten wordt gegenereerd, blijft uw
            eigendom. Echter, door onze diensten te gebruiken, verleent u ons
            een wereldwijde, niet-exclusieve, royalty-vrije licentie om uw
            content te gebruiken, te kopiëren, te wijzigen en te distribueren
            voor het leveren en verbeteren van onze diensten.
          </p>
          <p>
            BrainSocial en zijn logo's, merknamen en andere intellectuele
            eigendomsrechten blijven eigendom van BrainSocial.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            6. Betalingen en abonnementen
          </h2>
          <p>
            Sommige van onze diensten vereisen betaling. Betalingsvoorwaarden
            worden duidelijk vermeld bij het aanmelden voor deze diensten.
            Abonnementen worden automatisch verlengd tenzij u ze opzegt.
            Restitutiebeleid wordt per geval bepaald.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Beëindiging</h2>
          <p>
            We behouden ons het recht voor om uw toegang tot onze diensten te
            beëindigen of op te schorten als u deze voorwaarden schendt. U kunt
            uw account op elk moment opzeggen door contact met ons op te nemen.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            8. Aansprakelijkheidsbeperking
          </h2>
          <p>
            Onze diensten worden geleverd "zoals ze zijn" zonder enige garantie.
            We zijn niet aansprakelijk voor indirecte, incidentele, speciale of
            gevolgschade die voortvloeit uit uw gebruik van onze diensten.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            9. Wijzigingen in de voorwaarden
          </h2>
          <p>
            We kunnen deze voorwaarden van tijd tot tijd wijzigen. We zullen u
            op de hoogte stellen van belangrijke wijzigingen door een melding op
            onze website te plaatsen of u een e-mail te sturen.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            10. Toepasselijk recht
          </h2>
          <p>
            Deze voorwaarden worden beheerst door de Nederlandse wetgeving.
            Eventuele geschillen zullen worden voorgelegd aan de bevoegde
            rechtbank in Nederland.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact</h2>
          <p>
            Als u vragen heeft over deze voorwaarden, neem dan contact met ons
            op via onze{" "}
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

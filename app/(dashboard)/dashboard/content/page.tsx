import ContentCreationForm from "./content-creation-form"
import { SparklesIcon } from "lucide-react"
import { dict } from "@/lib/dictionary"

export default function ContentCreationPage() {
  return (
    <div className="container">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="h-5 w-5 text-brand-purple" />
          <h1 className="text-3xl font-bold tracking-tight text-brand-purple">{dict.contentCreation.title}</h1>
        </div>
        <p className="text-muted-foreground">Gebruik AI om content te genereren voor je social media kanalen.</p>
      </div>

      <ContentCreationForm />
    </div>
  )
}

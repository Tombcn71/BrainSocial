import { Suspense } from "react";
import ContentCreationForm from "./content-creation-form";
import { SparklesIcon } from "lucide-react";
import { dict } from "@/lib/dictionary";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentCreationPage() {
  return (
    <div className="container">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="h-5 w-5 text-brand-purple" />
          <h1 className="text-3xl font-bold tracking-tight text-brand-purple">
            {dict.contentCreation.title}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Gebruik AI om content te genereren voor je social media kanalen.
        </p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <ContentCreationForm />
      </Suspense>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
}

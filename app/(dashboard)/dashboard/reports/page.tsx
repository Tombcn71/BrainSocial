import { getProjects } from "@/app/actions/projects";
import ReportsView from "./reports-view";

export default async function ReportsPage() {
  const { success, projects } = await getProjects();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Rapportages</h1>
        <p className="text-muted-foreground mt-2">
          Bekijk statistieken en resultaten van je content
        </p>
      </div>

      <ReportsView initialProjects={success ? projects : []} />
    </div>
  );
}

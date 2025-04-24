import { getProject } from "@/app/actions/projects";
import ProjectForm from "../../project-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { success, project, error } = await getProject(params.id);

  if (!success || !project) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Project bewerken</CardTitle>
            <CardDescription>Bewerk de details van je project</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectForm project={project} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

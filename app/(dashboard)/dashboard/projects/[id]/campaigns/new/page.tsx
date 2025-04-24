import { getProject } from "@/app/actions/projects";
import CampaignForm from "../campaign-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function NewCampaignPage({
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
            <CardTitle>Nieuwe campagne</CardTitle>
            <CardDescription>
              Maak een nieuwe campagne aan voor {project.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignForm projectId={params.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

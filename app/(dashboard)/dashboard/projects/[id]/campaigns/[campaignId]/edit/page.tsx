import { getProject } from "@/app/actions/projects";
import { getCampaign } from "@/app/actions/campaigns";
import CampaignForm from "../../campaign-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditCampaignPage({
  params,
}: {
  params: { id: string; campaignId: string };
}) {
  const { success: projectSuccess, project } = await getProject(params.id);
  const { success: campaignSuccess, campaign } = await getCampaign(
    params.campaignId
  );

  if (!projectSuccess || !project || !campaignSuccess || !campaign) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Campagne bewerken</CardTitle>
            <CardDescription>Bewerk de details van je campagne</CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignForm projectId={params.id} campaign={campaign} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

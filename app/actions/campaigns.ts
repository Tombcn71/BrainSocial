"use server";

import sql, { safeArray } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getCampaigns(projectId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Verify the project belongs to the user
    const projectCheck = await sql`
      SELECT id FROM projects WHERE id = ${projectId} AND user_id = ${user.id}
    `;

    if (safeArray(projectCheck).length === 0) {
      return { success: false, error: "Project not found" };
    }

    const campaigns = await sql`
      SELECT * FROM campaigns 
      WHERE project_id = ${projectId} AND user_id = ${user.id}
      ORDER BY start_date DESC NULLS LAST
    `;

    return { success: true, campaigns: safeArray(campaigns) };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getCampaign(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const campaigns = await sql`
      SELECT c.*, p.name as project_name 
      FROM campaigns c
      JOIN projects p ON c.project_id = p.id
      WHERE c.id = ${id} AND c.user_id = ${user.id}
    `;

    const campaignsArray = safeArray(campaigns);
    if (campaignsArray.length === 0) {
      return { success: false, error: "Campaign not found" };
    }

    return { success: true, campaign: campaignsArray[0] };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { success: false, error: "Failed to fetch campaign" };
  }
}

export async function createCampaign(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const status = (formData.get("status") as string) || "draft";
  const platformsStr = formData.get("platforms") as string;
  const platforms = platformsStr ? platformsStr.split(",") : [];

  if (!projectId || !name) {
    return {
      success: false,
      error: "Project ID and campaign name are required",
    };
  }

  // Verify the project belongs to the user
  const projectCheck = await sql`
    SELECT id FROM projects WHERE id = ${projectId} AND user_id = ${user.id}
  `;

  if (safeArray(projectCheck).length === 0) {
    return { success: false, error: "Project not found" };
  }

  try {
    const id = uuidv4();

    await sql`
      INSERT INTO campaigns (
        id, project_id, user_id, name, description, 
        start_date, end_date, status, platforms
      )
      VALUES (
        ${id}, ${projectId}, ${user.id}, ${name}, ${description}, 
        ${startDate || null}, ${endDate || null}, ${status}, ${platforms}
      )
    `;

    // Revalidate paths
    revalidatePath(`/dashboard/projects/${projectId}/campaigns`);
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true, campaignId: id };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: "Failed to create campaign" };
  }
}

export async function updateCampaign(id: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const status = formData.get("status") as string;
  const platformsStr = formData.get("platforms") as string;
  const platforms = platformsStr ? platformsStr.split(",") : [];

  if (!name) {
    return { success: false, error: "Campaign name is required" };
  }

  try {
    // Get the campaign to check ownership and get project_id
    const campaignCheck = await sql`
      SELECT project_id FROM campaigns WHERE id = ${id} AND user_id = ${user.id}
    `;

    const campaignCheckArray = safeArray(campaignCheck);
    if (campaignCheckArray.length === 0) {
      return { success: false, error: "Campaign not found" };
    }

    const projectId = campaignCheckArray[0].project_id;

    await sql`
      UPDATE campaigns
      SET name = ${name}, 
          description = ${description}, 
          start_date = ${startDate || null}, 
          end_date = ${endDate || null}, 
          status = ${status},
          platforms = ${platforms},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    // Revalidate paths
    revalidatePath(`/dashboard/projects/${projectId}/campaigns/${id}`);
    revalidatePath(`/dashboard/projects/${projectId}/campaigns`);
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return { success: false, error: "Failed to update campaign" };
  }
}

export async function deleteCampaign(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Get the campaign to check ownership and get project_id
    const campaignCheck = await sql`
      SELECT project_id FROM campaigns WHERE id = ${id} AND user_id = ${user.id}
    `;

    const campaignCheckArray = safeArray(campaignCheck);
    if (campaignCheckArray.length === 0) {
      return { success: false, error: "Campaign not found" };
    }

    const projectId = campaignCheckArray[0].project_id;

    await sql`
      DELETE FROM campaigns
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    // Revalidate paths
    revalidatePath(`/dashboard/projects/${projectId}/campaigns`);
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { success: false, error: "Failed to delete campaign" };
  }
}

// Wijzig de getCampaignContent functie om altijd een array terug te geven
export async function getCampaignContent(campaignId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result = await sql`
      SELECT * FROM content
      WHERE campaign_id = ${campaignId} AND user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    // Zorg ervoor dat we altijd een array teruggeven
    const contentArray = safeArray(result);

    return { success: true, content: contentArray };
  } catch (error) {
    console.error("Error fetching campaign content:", error);
    return { success: false, error: "Failed to fetch campaign content" };
  }
}

// Wijzig de getCampaignScheduledPosts functie om altijd een array terug te geven
export async function getCampaignScheduledPosts(campaignId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result = await sql`
      SELECT sp.*, c.title, c.content, c.platform, c.content_type
      FROM scheduled_posts sp
      JOIN content c ON sp.content_id = c.id
      WHERE sp.campaign_id = ${campaignId} AND sp.user_id = ${user.id}
      ORDER BY sp.scheduled_for ASC
    `;

    // Zorg ervoor dat we altijd een array teruggeven
    const postsArray = safeArray(result);

    return { success: true, scheduledPosts: postsArray };
  } catch (error) {
    console.error("Error fetching campaign scheduled posts:", error);
    return {
      success: false,
      error: "Failed to fetch campaign scheduled posts",
    };
  }
}

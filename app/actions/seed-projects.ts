"use server";

import sql from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function seedTestProject() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Create a test project
    const projectId = uuidv4();
    await sql`
      INSERT INTO projects (id, user_id, name, description, client_name, status)
      VALUES (
        ${projectId}, 
        ${user.id}, 
        'Test Marketing Project', 
        'Dit is een test project om de functionaliteit te testen.', 
        'Test Klant BV', 
        'active'
      )
    `;

    // Create a test campaign
    const campaignId = uuidv4();
    await sql`
      INSERT INTO campaigns (
        id, project_id, user_id, name, description, 
        start_date, end_date, status, platforms
      )
      VALUES (
        ${campaignId}, 
        ${projectId}, 
        ${user.id}, 
        'Zomer Campagne', 
        'Zomercampagne voor nieuwe producten', 
        ${new Date().toISOString()}, 
        ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}, 
        'active', 
        ARRAY['linkedin', 'twitter', 'instagram']
      )
    `;

    // Create test content
    const contentId = uuidv4();
    await sql`
      INSERT INTO content (
        id, user_id, title, content, platform, content_type, campaign_id
      )
      VALUES (
        ${contentId},
        ${user.id},
        'Zomer Aanbieding',
        'Profiteer nu van onze geweldige zomeraanbieding! 20% korting op alle producten. #zomer #aanbieding',
        'twitter',
        'tweet',
        ${campaignId}
      )
    `;

    // Schedule the content
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await sql`
      INSERT INTO scheduled_posts (
        id, user_id, content_id, scheduled_for, status, campaign_id
      )
      VALUES (
        ${uuidv4()},
        ${user.id},
        ${contentId},
        ${tomorrow.toISOString()},
        'scheduled',
        ${campaignId}
      )
    `;

    // Revalidate paths
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/calendar");

    return {
      success: true,
      message:
        "Test project, campaign, content, and scheduled post created successfully",
      projectId,
      campaignId,
    };
  } catch (error) {
    console.error("Error seeding test project:", error);
    return { success: false, error: "Failed to seed test project" };
  }
}

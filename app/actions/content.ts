"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getModelForContentType } from "@/lib/ai-config";
import sql, { safeArray } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { publishToSocialMedia } from "./social-accounts";
import { publishToInstagram } from "./social-accounts";

export interface ContentItem {
  id: string;
  title?: string;
  content: string;
  platform: string;
  content_type: string;
  published?: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  campaign_id?: string;
  user_id: string;
}

export async function generateContent(
  platform: string,
  contentType: string,
  tone: string,
  topic: string,
  lang = "nl"
) {
  // Check if API key is available
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables"
    );
  }

  // Create a detailed prompt for the AI
  const prompt = `
    Genereer een ${contentType} voor ${platform} over het onderwerp "${topic}".
    De toon moet ${tone} zijn.
    Schrijf het in het ${lang === "nl" ? "Nederlands" : "Engels"}.
    Houd rekening met de beste praktijken voor ${platform}.
    
    Voor LinkedIn: Houd het professioneel en informatief.
    Voor Twitter: Kort en bondig, gebruik hashtags.
    Voor Instagram: Visueel beschrijvend, gebruik emojis en hashtags.
    Voor Facebook: Conversationeel en betrokken.
    
    Maak de content boeiend en zorg dat het de aandacht trekt.
  `;

  // Get the appropriate model based on content type and tone
  const { model, temperature } = getModelForContentType(contentType, tone);

  try {
    // Use the AI SDK to generate text with Gemini
    const { text } = await generateText({
      model: google(model),
      prompt,
      temperature,
      maxTokens: 800, // Limit response length
    });

    return { success: true, content: text };
  } catch (error) {
    console.error("Error generating content:", error);
    return { success: false, error: "Failed to generate content" };
  }
}

// Bijgewerkte saveContent functie om afbeeldingen en direct publiceren te ondersteunen
export async function saveContent({
  title,
  content,
  platform,
  contentType,
  projectId,
  campaignId,
  imageUrl,
  published = false,
}: {
  title: string;
  content: string;
  platform: string;
  contentType: string;
  projectId?: string;
  campaignId?: string;
  imageUrl?: string | null;
  published?: boolean;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validate campaign belongs to project if both are provided
  if (projectId && campaignId) {
    const campaignCheck = await sql`
      SELECT id FROM campaigns 
      WHERE id = ${campaignId} AND project_id = ${projectId} AND user_id = ${user.id}
    `;

    if (safeArray(campaignCheck).length === 0) {
      return {
        success: false,
        error: "Campaign does not belong to the selected project",
      };
    }
  }

  try {
    const contentId = uuidv4();

    await sql`
      INSERT INTO content (id, user_id, title, content, platform, content_type, campaign_id, image_url, published) 
      VALUES (${contentId}, ${
      user.id
    }, ${title}, ${content}, ${platform}, ${contentType}, ${
      campaignId || null
    }, ${imageUrl || null}, ${published})
    `;

    // If published is true, publish to social media
    if (published) {
      await publishToSocialMedia(contentId, platform);
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard/content/overview");

    if (campaignId) {
      revalidatePath(
        `/dashboard/projects/${projectId}/campaigns/${campaignId}`
      );
    }

    return { success: true, contentId };
  } catch (error) {
    console.error("Error saving content:", error);
    return { success: false, error: "Failed to save content" };
  }
}

// Wijzig de getUserContent functie om altijd een array terug te geven
export async function getUserContent(
  limit = 10,
  projectId?: string,
  campaignId?: string
) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    let query = sql`
      SELECT c.*, p.name as project_name, cam.name as campaign_name
      FROM content c
      LEFT JOIN campaigns cam ON c.campaign_id = cam.id
      LEFT JOIN projects p ON cam.project_id = p.id
      WHERE c.user_id = ${user.id}
    `;

    if (projectId) {
      query = sql`
        ${query} AND cam.project_id = ${projectId}
      `;
    }

    if (campaignId) {
      query = sql`
        ${query} AND c.campaign_id = ${campaignId}
      `;
    }

    query = sql`
      ${query} ORDER BY c.created_at DESC LIMIT ${limit}
    `;

    const result = await query;

    // Zorg ervoor dat we altijd een array teruggeven
    const contentArray = safeArray(result);

    return { success: true, content: contentArray };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { success: false, error: "Failed to fetch content" };
  }
}

export async function scheduleContent(
  contentId: string,
  scheduledFor: string,
  campaignId?: string
) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Verify the content belongs to the user
    const contentCheck = await sql`
      SELECT id, campaign_id FROM content WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    const contentCheckArray = safeArray(contentCheck);
    if (contentCheckArray.length === 0) {
      return { success: false, error: "Content not found" };
    }

    // Use the campaign_id from the content if not explicitly provided
    const effectiveCampaignId = campaignId || contentCheckArray[0].campaign_id;

    const scheduledPostId = uuidv4();

    await sql`
      INSERT INTO scheduled_posts (id, user_id, content_id, scheduled_for, status, campaign_id) 
      VALUES (${scheduledPostId}, ${
      user.id
    }, ${contentId}, ${scheduledFor}, 'scheduled', ${
      effectiveCampaignId || null
    })
    `;

    // Revalidate calendar path
    revalidatePath("/dashboard/calendar");

    if (effectiveCampaignId) {
      // Get the project_id for this campaign
      const campaignInfo = await sql`
        SELECT project_id FROM campaigns WHERE id = ${effectiveCampaignId}
      `;

      const campaignInfoArray = safeArray(campaignInfo);
      if (campaignInfoArray.length > 0) {
        revalidatePath(
          `/dashboard/projects/${campaignInfoArray[0].project_id}/campaigns/${effectiveCampaignId}`
        );
      }
    }

    return { success: true, scheduledPostId };
  } catch (error) {
    console.error("Error scheduling content:", error);
    return { success: false, error: "Failed to schedule content" };
  }
}

export async function getScheduledPosts(
  limit = 10,
  projectId?: string,
  campaignId?: string
) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    let query = sql`
      SELECT sp.*, c.title, c.content, c.platform, c.content_type, c.image_url,
             p.name as project_name, cam.name as campaign_name
      FROM scheduled_posts sp
      JOIN content c ON sp.content_id = c.id
      LEFT JOIN campaigns cam ON sp.campaign_id = cam.id
      LEFT JOIN projects p ON cam.project_id = p.id
      WHERE sp.user_id = ${user.id}
    `;

    if (projectId) {
      query = sql`
        ${query} AND cam.project_id = ${projectId}
      `;
    }

    if (campaignId) {
      query = sql`
        ${query} AND sp.campaign_id = ${campaignId}
      `;
    }

    query = sql`
      ${query} ORDER BY sp.scheduled_for ASC LIMIT ${limit}
    `;

    const result = await query;
    const scheduledPosts = safeArray(result);

    return { success: true, scheduledPosts };
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return { success: false, error: "Failed to fetch scheduled posts" };
  }
}

export async function publishContent(contentId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Get the content to determine the platform
    const contentResult = await sql`
      SELECT * FROM content WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    const contentArray = safeArray(contentResult);
    if (contentArray.length === 0) {
      return { success: false, error: "Content not found" };
    }

    const content = contentArray[0];

    // Publish to social media
    const publishResult = await publishToSocialMedia(
      contentId,
      content.platform
    );

    if (!publishResult.success) {
      return publishResult;
    }

    // Update the content record
    await sql`
      UPDATE content
      SET published = true
      WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    // Revalidate paths
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard/content/overview");

    return { success: true };
  } catch (error) {
    console.error("Error publishing content:", error);
    return { success: false, error: "Failed to publish content" };
  }
}

export async function getContentStats(projectId?: string, campaignId?: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    let whereClause = sql`WHERE c.user_id = ${user.id}`;

    if (campaignId) {
      whereClause = sql`${whereClause} AND c.campaign_id = ${campaignId}`;
    } else if (projectId) {
      whereClause = sql`${whereClause} AND cam.project_id = ${projectId}`;
    }

    const contentStats = await sql`
      SELECT 
        COUNT(*) as total_content,
        COUNT(DISTINCT c.campaign_id) as campaigns_count,
        COUNT(DISTINCT sp.id) as scheduled_posts_count,
        SUM(CASE WHEN c.published = true THEN 1 ELSE 0 END) as published_posts_count,
        COUNT(DISTINCT c.platform) as platforms_count
      FROM content c
      LEFT JOIN campaigns cam ON c.campaign_id = cam.id
      LEFT JOIN scheduled_posts sp ON c.id = sp.content_id
      ${whereClause}
    `;

    const platformStats = await sql`
      SELECT 
        c.platform,
        COUNT(*) as count
      FROM content c
      LEFT JOIN campaigns cam ON c.campaign_id = cam.id
      ${whereClause}
      GROUP BY c.platform
      ORDER BY count DESC
    `;

    const contentTypeStats = await sql`
      SELECT 
        c.content_type,
        COUNT(*) as count
      FROM content c
      LEFT JOIN campaigns cam ON c.campaign_id = cam.id
      ${whereClause}
      GROUP BY c.content_type
      ORDER BY count DESC
    `;

    return {
      success: true,
      stats: {
        content: safeArray(contentStats)[0] || {},
        platforms: safeArray(platformStats),
        contentTypes: safeArray(contentTypeStats),
      },
    };
  } catch (error) {
    console.error("Error fetching content stats:", error);
    return { success: false, error: "Failed to fetch content stats" };
  }
}

export async function publishToInstagramAction(contentId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Haal de content op
    const contentResult = await sql`
      SELECT * FROM content WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    const contentArray = safeArray(contentResult);
    if (contentArray.length === 0) {
      return { success: false, error: "Content not found" };
    }

    const content = contentArray[0];

    // Controleer of er een afbeelding is (Instagram vereist een afbeelding)
    if (!content.image_url) {
      return {
        success: false,
        error: "Instagram requires an image for publishing",
      };
    }

    // Haal het Instagram account op
    const accountResult = await sql`
      SELECT * FROM social_accounts 
      WHERE user_id = ${user.id} AND platform = 'instagram'
      LIMIT 1
    `;

    const accountArray = safeArray(accountResult);
    if (accountArray.length === 0) {
      return { success: false, error: "No Instagram account connected" };
    }

    // Publiceer naar Instagram
    const publishResult = await publishToInstagram(
      contentId,
      accountArray[0].id
    );

    return publishResult;
  } catch (error) {
    console.error("Error publishing to Instagram:", error);
    return { success: false, error: "Failed to publish to Instagram" };
  }
}

"use server";

import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

type PublishContentParams = {
  contentId: string;
  platformId: string;
  platform: "facebook" | "facebook_page" | "instagram";
};

export async function publishContent({
  contentId,
  platformId,
  platform,
}: PublishContentParams) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: "Niet geautoriseerd" };
    }

    // Haal de content op
    const contentResult = await sql`
      SELECT * FROM content WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    // Controleer of er resultaten zijn op een veilige manier
    const contentArray = Array.isArray(contentResult) ? contentResult : [];
    if (contentArray.length === 0 || !contentArray[0]) {
      return { success: false, error: "Content niet gevonden" };
    }

    const content = contentArray[0];

    // Haal het social media account op
    const accountResult = await sql`
      SELECT * FROM social_accounts 
      WHERE user_id = ${user.id} 
      AND platform = ${platform}
      AND account_id = ${platformId}
    `;

    // Controleer of er resultaten zijn op een veilige manier
    const accountArray = Array.isArray(accountResult) ? accountResult : [];
    if (accountArray.length === 0 || !accountArray[0]) {
      return { success: false, error: "Social media account niet gevonden" };
    }

    const account = accountArray[0];

    // Publiceer de content naar het juiste platform
    let publishResult;

    if (platform === "facebook" || platform === "facebook_page") {
      publishResult = await publishToFacebook({
        content,
        accessToken: account.access_token,
        pageId: platform === "facebook_page" ? account.account_id : undefined,
      });
    } else if (platform === "instagram") {
      publishResult = await publishToInstagram({
        content,
        accessToken: account.access_token,
        pageId: account.page_id,
        instagramAccountId: account.account_id,
      });
    } else {
      return { success: false, error: "Ongeldig platform" };
    }

    if (!publishResult.success) {
      return publishResult;
    }

    // Update de content status in de database
    await sql`
      UPDATE content 
      SET published = true, 
          updated_at = NOW() 
      WHERE id = ${contentId}
    `;

    // Sla de gepubliceerde post op
    await sql`
      INSERT INTO published_posts (
        content_id, 
        platform, 
        platform_post_id, 
        user_id,
        published_at
      ) VALUES (
        ${contentId}, 
        ${platform}, 
        ${publishResult.postId}, 
        ${user.id},
        NOW()
      )
    `;

    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/accounts");

    return { success: true, postId: publishResult.postId };
  } catch (error) {
    console.error("Error publishing content:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het publiceren van de content",
    };
  }
}

// Functie om content naar Facebook te publiceren
async function publishToFacebook({
  content,
  accessToken,
  pageId,
}: {
  content: any;
  accessToken: string;
  pageId?: string;
}) {
  try {
    const endpoint = pageId
      ? `https://graph.facebook.com/v18.0/${pageId}/feed`
      : `https://graph.facebook.com/v18.0/me/feed`;

    const body: Record<string, string> = {
      message: content.content,
    };

    // Voeg een afbeelding toe als die beschikbaar is
    if (content.image_url) {
      body.link = content.image_url;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Facebook API error:", errorData);
      return {
        success: false,
        error: `Facebook API fout: ${
          errorData.error?.message || "Onbekende fout"
        }`,
      };
    }

    const data = await response.json();
    return { success: true, postId: data.id };
  } catch (error) {
    console.error("Error publishing to Facebook:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het publiceren naar Facebook",
    };
  }
}

// Functie om content naar Instagram te publiceren
async function publishToInstagram({
  content,
  accessToken,
  pageId,
  instagramAccountId,
}: {
  content: any;
  accessToken: string;
  pageId: string;
  instagramAccountId: string;
}) {
  try {
    // Voor Instagram is een afbeelding verplicht
    if (!content.image_url) {
      return {
        success: false,
        error: "Een afbeelding is verplicht voor Instagram posts",
      };
    }

    // Stap 1: Maak een container voor de media
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: content.image_url,
          caption: content.content,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      console.error("Instagram container API error:", errorData);
      return {
        success: false,
        error: `Instagram API fout: ${
          errorData.error?.message || "Onbekende fout"
        }`,
      };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Stap 2: Publiceer de container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      console.error("Instagram publish API error:", errorData);
      return {
        success: false,
        error: `Instagram API fout: ${
          errorData.error?.message || "Onbekende fout"
        }`,
      };
    }

    const publishData = await publishResponse.json();
    return { success: true, postId: publishData.id };
  } catch (error) {
    console.error("Error publishing to Instagram:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het publiceren naar Instagram",
    };
  }
}

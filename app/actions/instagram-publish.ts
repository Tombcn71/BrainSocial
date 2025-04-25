"use server";

import { getCurrentUser } from "@/lib/session";
import sql, { safeArray } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function publishToInstagram(contentId: string) {
  console.log(`Starting publishToInstagram for contentId: ${contentId}`);

  const user = await getCurrentUser();

  if (!user) {
    console.log("No authenticated user found");
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Get the content
    console.log("Fetching content from database");
    const contentResult = await sql`
      SELECT * FROM content WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    const contentItems = safeArray(contentResult);
    console.log(`Found ${contentItems.length} content items`);

    if (contentItems.length === 0) {
      return { success: false, error: "Content not found" };
    }

    const content = contentItems[0];
    console.log("Content details:", {
      title: content.title,
      hasImage: !!content.image_url,
    });

    // Check if there's an image (required for Instagram)
    if (!content.image_url) {
      return {
        success: false,
        error: "Instagram requires an image for publishing",
      };
    }

    // Get the Instagram account
    console.log("Fetching Instagram account");
    const accountResult = await sql`
      SELECT * FROM social_accounts 
      WHERE user_id = ${user.id} AND platform = 'instagram'
      LIMIT 1
    `;

    const accounts = safeArray(accountResult);
    console.log(`Found ${accounts.length} Instagram accounts`);

    if (accounts.length === 0) {
      return { success: false, error: "No Instagram account connected" };
    }

    const account = accounts[0];
    console.log("Account details:", {
      id: account.id,
      platform: account.platform,
      hasPageId: !!account.page_id,
      hasTokenExpiry: !!account.token_expiry,
    });

    // Check if we have a page ID (required for Instagram Business API)
    if (!account.page_id) {
      return {
        success: false,
        error: "Missing Facebook Page ID for Instagram publishing",
      };
    }

    // Check if the token is expired
    if (account.token_expiry && new Date(account.token_expiry) < new Date()) {
      console.log("Token expired:", account.token_expiry);
      return {
        success: false,
        error: "Access token expired. Please refresh your token.",
      };
    }

    // Step 1: Create a media container
    console.log("Creating Instagram media container");
    console.log("Using image URL:", content.image_url);

    const containerResponse = await fetch(
      `https://graph.facebook.com/v22.0/${account.page_id}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: content.image_url,
          caption: content.content,
          access_token: account.access_token,
        }),
      }
    );

    // Check for errors in container creation
    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      console.error("Error creating Instagram media container:", errorData);

      // Provide a more detailed error message
      let errorMessage = "Failed to create Instagram media container";

      if (errorData.error) {
        errorMessage = `Instagram API error: ${
          errorData.error.message || "Unknown error"
        }`;

        // Special handling for common errors
        if (errorData.error.code === 190) {
          errorMessage =
            "Invalid or expired access token. Please reconnect your Instagram account.";
        } else if (errorData.error.code === 10) {
          errorMessage =
            "Permission error. Make sure your app has instagram_content_publish permission.";
        } else if (errorData.error.code === 100) {
          errorMessage =
            "Invalid parameter. The image URL might be invalid or inaccessible.";
        }
      }

      return { success: false, error: errorMessage };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;
    console.log("Media container created with ID:", containerId);

    // Step 2: Publish the media container
    console.log("Publishing Instagram media container");
    const publishResponse = await fetch(
      `https://graph.facebook.com/v22.0/${account.page_id}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: account.access_token,
        }),
      }
    );

    // Check for errors in publishing
    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      console.error("Error publishing to Instagram:", errorData);

      // Provide a more detailed error message
      let errorMessage = "Failed to publish to Instagram";

      if (errorData.error) {
        errorMessage = `Instagram API error: ${
          errorData.error.message || "Unknown error"
        }`;

        // Special handling for common errors
        if (errorData.error.code === 190) {
          errorMessage =
            "Invalid or expired access token. Please reconnect your Instagram account.";
        } else if (errorData.error.code === 10) {
          errorMessage =
            "Permission error. Make sure your app has instagram_content_publish permission.";
        } else if (errorData.error.code === 9007) {
          errorMessage =
            "Media container not ready. Please try again in a few moments.";
        }
      }

      return { success: false, error: errorMessage };
    }

    const publishData = await publishResponse.json();
    const externalPostId = publishData.id;
    console.log("Successfully published to Instagram with ID:", externalPostId);

    // Construct the Instagram post URL
    // Note: This is an approximation as Instagram doesn't provide direct URLs via API
    const externalPostUrl = `https://www.instagram.com/p/${externalPostId}`;

    // Mark the content as published
    await sql`
      UPDATE content
      SET published = true
      WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    // Create a record of the published post
    const publishedPostId = uuidv4();
    await sql`
      INSERT INTO published_posts (
        id, user_id, content_id, platform, account_id, published_at, external_post_id, external_post_url
      )
      VALUES (
        ${publishedPostId}, ${user.id}, ${contentId}, 'instagram', ${account.id}, CURRENT_TIMESTAMP, ${externalPostId}, ${externalPostUrl}
      )
    `;

    // Revalidate paths
    revalidatePath("/dashboard/content/overview");
    revalidatePath("/dashboard/accounts/published");

    return {
      success: true,
      publishedPostId,
      externalPostId,
      externalPostUrl,
    };
  } catch (error) {
    console.error("Error publishing to Instagram:", error);
    return {
      success: false,
      error:
        "An unexpected error occurred while publishing to Instagram. Check server logs for details.",
    };
  }
}

"use server";

import { getCurrentUser } from "@/lib/session";
import sql, { safeArray } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { checkFacebookPermissions } from "@/lib/facebook-utils";

export async function publishToFacebook(contentId: string) {
  console.log(`Starting publishToFacebook for contentId: ${contentId}`);

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

    // Get the Facebook account
    console.log("Fetching Facebook account");
    const accountResult = await sql`
      SELECT * FROM social_accounts 
      WHERE user_id = ${user.id} AND platform = 'facebook'
      LIMIT 1
    `;

    const accounts = safeArray(accountResult);
    console.log(`Found ${accounts.length} Facebook accounts`);

    if (accounts.length === 0) {
      return { success: false, error: "No Facebook account connected" };
    }

    const account = accounts[0];
    console.log("Account details:", {
      id: account.id,
      platform: account.platform,
      hasPageId: !!account.page_id,
      hasTokenExpiry: !!account.token_expiry,
    });

    // Check if the token is expired
    if (account.token_expiry && new Date(account.token_expiry) < new Date()) {
      console.log("Token expired:", account.token_expiry);
      return {
        success: false,
        error: "Access token expired. Please refresh your token.",
      };
    }

    // Check if we have the required permissions
    const permissionsCheck = await checkFacebookPermissions(
      account.access_token
    );

    if (!permissionsCheck.success) {
      console.error(
        "Facebook permissions check failed:",
        permissionsCheck.error
      );
      return {
        success: false,
        error: `Facebook permissions error: ${permissionsCheck.error}. Please reconnect your Facebook account with the required permissions.`,
      };
    }

    console.log("Facebook permissions check passed");

    // Determine the endpoint (user feed or page feed)
    let endpoint;
    if (account.page_id) {
      // Use Page feed if available
      endpoint = `https://graph.facebook.com/v22.0/${account.page_id}/feed`;
      console.log("Using Page feed endpoint with page_id:", account.page_id);
    } else {
      // For personal timeline, use me/feed
      endpoint = `https://graph.facebook.com/v22.0/me/feed`;
      console.log("Using personal feed endpoint with me/feed");
    }

    console.log("Using endpoint:", endpoint);

    // Prepare the request body
    const requestBody: Record<string, string> = {
      message: content.content,
      access_token: account.access_token,
    };

    // Add image URL if provided
    if (content.image_url) {
      requestBody.link = content.image_url;
    }

    // Make the request to Facebook API
    console.log("Publishing to Facebook...");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Facebook API response status:", response.status);

    const responseData = await response.json();
    console.log("Facebook API response data:", responseData);

    if (!response.ok) {
      console.error("Facebook API error:", responseData);

      // Provide more detailed error information
      const errorMessage =
        responseData.error?.message || "Unknown Facebook API error";
      const errorCode = responseData.error?.code || "unknown";
      const errorType = responseData.error?.type || "unknown";

      return {
        success: false,
        error: `Facebook API error: ${errorMessage} (Code: ${errorCode}, Type: ${errorType})`,
        details: responseData.error,
      };
    }

    // Mark the content as published
    await sql`
      UPDATE content
      SET published = true
      WHERE id = ${contentId} AND user_id = ${user.id}
    `;

    // Create a record of the published post
    const publishedPostId = uuidv4();
    const externalPostId = responseData.id;
    const externalPostUrl = `https://facebook.com/${externalPostId}`;

    await sql`
      INSERT INTO published_posts (
        id, user_id, content_id, platform, account_id, published_at, external_post_id, external_post_url
      )
      VALUES (
        ${publishedPostId}, ${user.id}, ${contentId}, 'facebook', ${account.id}, CURRENT_TIMESTAMP, ${externalPostId}, ${externalPostUrl}
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
    console.error("Error publishing to Facebook:", error);
    return {
      success: false,
      error:
        "An unexpected error occurred while publishing to Facebook. Check server logs for details.",
    };
  }
}

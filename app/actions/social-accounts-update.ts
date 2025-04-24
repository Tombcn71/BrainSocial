// This is a partial update to the social-accounts.ts file
// Only showing the updated publishToFacebook function

// Import the helper
import { checkFacebookPermissions } from "@/lib/facebook-helpers";

interface PublishResult {
  success: boolean;
  postId?: string;
  error?: string;
}

// Updated publishToFacebook function
async function publishToFacebook({
  content,
  accessToken,
  pageId,
}: {
  content: any;
  accessToken: string;
  pageId?: string;
}): Promise<PublishResult> {
  try {
    // First, check if we have the required permissions
    const permissionsCheck = await checkFacebookPermissions(accessToken);

    if (!permissionsCheck.success) {
      return {
        success: false,
        error: `Facebook permissions error: ${permissionsCheck.error}. Please reconnect your Facebook account with the required permissions.`,
      };
    }

    // If we have the permissions, proceed with publishing
    const endpoint = pageId
      ? `https://graph.facebook.com/v18.0/${pageId}/feed`
      : `https://graph.facebook.com/v18.0/me/feed`;

    // Prepare the body
    const body: Record<string, string> = {
      message: content.content,
    };

    // Add an image if available
    if (content.image_url) {
      body.link = content.image_url;
    }

    // Log the request for debugging
    console.log(`Publishing to Facebook endpoint: ${endpoint}`);
    console.log(`With message: ${content.content.substring(0, 50)}...`);

    // Make the request
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

    // Check the response
    const data = await response.json();

    if (!response.ok) {
      console.error("Facebook API error:", data);
      return {
        success: false,
        error: `Facebook API error: ${data.error?.message || "Unknown error"}. 
        Please check if your app has the required permissions: pages_read_engagement and pages_manage_posts.`,
      };
    }

    return { success: true, postId: data.id };
  } catch (error) {
    console.error("Error publishing to Facebook:", error);
    return {
      success: false,
      error:
        "An error occurred while publishing to Facebook. Check the console for more details.",
    };
  }
}

/**
 * Helper functions for Facebook API integration
 */

// Function to check Facebook token details
export async function checkTokenDetails(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch token details" };
    }

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    const isValid = data.data.is_valid;
    const expiresAt = new Date(data.data.expires_at * 1000).toLocaleString(); // Convert seconds to milliseconds
    const scopes = data.data.scopes;

    return { success: true, isValid, expiresAt, scopes, details: data.data };
  } catch (error) {
    console.error("Error checking Facebook token details:", error);
    return { success: false, error: "Failed to check token details" };
  }
}

// Function to get user pages
export async function getUserPages(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch Facebook Pages" };
    }

    const data = await response.json();
    const pages = data.data || [];

    return { success: true, pages };
  } catch (error) {
    console.error("Error fetching Facebook Pages:", error);
    return { success: false, error: "Failed to fetch Facebook Pages" };
  }
}

// Function to check if a Facebook access token has the required permissions
export async function checkFacebookPermissions(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/permissions?access_token=${accessToken}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch permissions" };
    }

    const data = await response.json();

    // Check if we have the required permissions
    const requiredPermissions = ["pages_read_engagement", "pages_manage_posts"];

    const missingPermissions = requiredPermissions.filter((permission) => {
      return !data.data.some(
        (p: any) => p.permission === permission && p.status === "granted"
      );
    });

    if (missingPermissions.length > 0) {
      return {
        success: false,
        error: `Missing permissions: ${missingPermissions.join(", ")}`,
        missingPermissions,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking Facebook permissions:", error);
    return { success: false, error: "Failed to check permissions" };
  }
}

/**
 * Helper functions for Facebook API integration
 */

// Function to check the validity and details of a Facebook access token
export async function checkTokenDetails(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch token details" };
    }

    const data = await response.json();

    if (!data.data) {
      return { success: false, error: "Invalid token format" };
    }

    return {
      success: true,
      isValid: data.data.is_valid,
      expiresAt: new Date(data.data.expires_at * 1000).toLocaleString(),
      scopes: data.data.scopes,
      details: data.data,
    };
  } catch (error) {
    console.error("Error checking token details:", error);
    return { success: false, error: "Failed to check token details" };
  }
}

// Function to get the Facebook Pages that a user manages
export async function getUserPages(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch Facebook Pages" };
    }

    const data = await response.json();

    if (!data.data) {
      return { success: false, error: "No pages data received from Facebook" };
    }

    return { success: true, pages: data.data };
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
      console.error(
        "Error fetching Facebook permissions:",
        response.statusText
      );
      return { success: false };
    }

    const data = await response.json();
    if (!data.data) {
      console.error("No permissions data received from Facebook");
      return { success: false };
    }

    const requiredPermissions = ["pages_read_engagement", "pages_manage_posts"];
    const grantedPermissions = data.data
      .filter((perm: any) => perm.status === "granted")
      .map((perm: any) => perm.permission);
    const missingPermissions = requiredPermissions.filter(
      (perm) => !grantedPermissions.includes(perm)
    );

    if (missingPermissions.length > 0) {
      console.warn("Missing Facebook permissions:", missingPermissions);
      return { success: false, missingPermissions };
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking Facebook permissions:", error);
    return { success: false };
  }
}

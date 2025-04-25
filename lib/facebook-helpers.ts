/**
 * Helper functions for Facebook API integration
 */

// Function to check if a Facebook access token is valid and get its details
export async function checkTokenDetails(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch token details from Facebook",
      };
    }

    const data = await response.json();

    if (!data.data || !data.data.is_valid) {
      return { success: false, error: "Invalid access token", isValid: false };
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

// Function to get Facebook pages
export async function getUserPages(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch Facebook pages" };
    }

    const data = await response.json();
    return { success: true, pages: data.data || [] };
  } catch (error) {
    console.error("Error fetching Facebook pages:", error);
    return { success: false, error: "Failed to fetch Facebook pages" };
  }
}

// Function to check if a Facebook access token has the required permissions
export async function checkFacebookPermissions(
  accessToken: string
): Promise<
  | { success: true; permissions: string[] }
  | { success: false; error: string; missingPermissions?: string[] }
> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/permissions?access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching Facebook permissions:", errorData);
      return {
        success: false,
        error: `Failed to fetch permissions from Facebook: ${
          errorData.error?.message || "Unknown error"
        }`,
      };
    }

    const data = await response.json();

    if (!data.data) {
      return { success: false, error: "Invalid response from Facebook" };
    }

    // Check for required permissions
    const requiredPermissions = ["pages_read_engagement", "pages_manage_posts"];
    const grantedPermissions = data.data
      .filter((perm: any) => perm.status === "granted")
      .map((perm: any) => perm.permission);

    const missingPermissions = requiredPermissions.filter(
      (perm) => !grantedPermissions.includes(perm)
    );

    if (missingPermissions.length > 0) {
      return {
        success: false,
        error: `Missing required permissions: ${missingPermissions.join(", ")}`,
        missingPermissions,
      };
    }

    return { success: true, permissions: grantedPermissions };
  } catch (error) {
    console.error("Error checking Facebook permissions:", error);
    return { success: false, error: "Failed to check Facebook permissions" };
  }
}

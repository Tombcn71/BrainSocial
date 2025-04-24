/**
 * Utility functions for Facebook API integration
 */

// Function to check if a Facebook access token has the required permissions
export async function checkFacebookPermissions(accessToken: string) {
  try {
    console.log(
      "Checking Facebook permissions for token:",
      accessToken.substring(0, 10) + "..."
    );

    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/permissions?access_token=${accessToken}`
    );

    if (!response.ok) {
      console.error("Failed to fetch permissions, status:", response.status);
      return { success: false, error: "Failed to fetch permissions" };
    }

    const data = await response.json();
    console.log("Permissions response:", data);

    // Check if we have the required permissions - REMOVED publish_to_groups
    const requiredPermissions = ["pages_read_engagement", "pages_manage_posts"];

    const grantedPermissions = data.data
      .filter((p: any) => p.status === "granted")
      .map((p: any) => p.permission);

    console.log("Granted permissions:", grantedPermissions);

    const missingPermissions = requiredPermissions.filter(
      (permission) => !grantedPermissions.includes(permission)
    );

    if (missingPermissions.length > 0) {
      console.error("Missing permissions:", missingPermissions);
      return {
        success: false,
        error: `Missing permissions: ${missingPermissions.join(", ")}`,
        missingPermissions,
        grantedPermissions,
      };
    }

    return { success: true, permissions: grantedPermissions };
  } catch (error) {
    console.error("Error checking Facebook permissions:", error);
    return { success: false, error: "Failed to check permissions" };
  }
}

// Function to get Facebook user profile
export async function getFacebookUserProfile(accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch user profile" };
    }

    const data = await response.json();
    return { success: true, profile: data };
  } catch (error) {
    console.error("Error fetching Facebook user profile:", error);
    return { success: false, error: "Failed to fetch user profile" };
  }
}

// Function to get long-lived token
export async function getLongLivedToken(
  accessToken: string,
  appId: string,
  appSecret: string
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${accessToken}`
    );

    if (!response.ok) {
      return { success: false, error: "Failed to get long-lived token" };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    console.error("Error getting long-lived token:", error);
    return { success: false, error: "Failed to get long-lived token" };
  }
}

/**
 * Helper functions for Facebook API integration
 */

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
    const requiredPermissions = [
      "pages_read_engagement",
      "pages_manage_posts",
      "publish_to_groups",
    ];

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

// Function to get a URL for requesting additional permissions
export function getFacebookPermissionUrl(
  appId: string,
  redirectUri: string,
  missingPermissions: string[]
) {
  const state = Math.random().toString(36).substring(2);

  // Store state in localStorage or cookies to verify when the user returns

  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${missingPermissions.join(",")}`;
}

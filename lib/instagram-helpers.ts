/**
 * Helper functions for Instagram API integration via Facebook Graph API
 */

// Function to check if an Instagram Business account is properly connected
export async function checkInstagramBusinessAccount(
  accessToken: string,
  pageId: string
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch Instagram Business account",
      };
    }

    const data = await response.json();

    if (!data.instagram_business_account) {
      return {
        success: false,
        error: "No Instagram Business account connected to this Facebook Page",
      };
    }

    return {
      success: true,
      instagramAccountId: data.instagram_business_account.id,
      instagramAccount: data.instagram_business_account,
    };
  } catch (error) {
    console.error("Error checking Instagram Business account:", error);
    return {
      success: false,
      error: "Failed to check Instagram Business account",
    };
  }
}

// Function to get Instagram account info
export async function getInstagramAccountInfo(
  accessToken: string,
  instagramAccountId: string
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${instagramAccountId}?fields=username,profile_picture_url,name&access_token=${accessToken}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch Instagram account info",
      };
    }

    const data = await response.json();
    return { success: true, account: data };
  } catch (error) {
    console.error("Error fetching Instagram account info:", error);
    return { success: false, error: "Failed to fetch Instagram account info" };
  }
}

// Function to test Instagram publishing capability
export async function testInstagramPublishing(
  accessToken: string,
  pageId: string,
  instagramAccountId: string
) {
  try {
    // Step 1: Create a test container with a sample image
    // Using a placeholder image URL - in production, use a real image URL
    const testImageUrl =
      "https://via.placeholder.com/500x500.png?text=Test+Image";
    const testCaption = "This is a test post from our app. #test";

    const containerResponse = await fetch(
      `https://graph.facebook.com/v22.0/${instagramAccountId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: testImageUrl,
          caption: testCaption,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      return {
        success: false,
        error: `Failed to create media container: ${JSON.stringify(errorData)}`,
        stage: "container_creation",
      };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // We won't actually publish the test post to avoid unwanted posts
    // But we'll return success if we got this far
    return {
      success: true,
      message:
        "Successfully created media container. Instagram publishing should work.",
      containerId,
    };
  } catch (error) {
    console.error("Error testing Instagram publishing:", error);
    return { success: false, error: "Failed to test Instagram publishing" };
  }
}

// Function to get all Facebook Pages that have Instagram Business accounts
export async function getPagesWithInstagramAccounts(accessToken: string) {
  try {
    // First get all pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`
    );

    if (!pagesResponse.ok) {
      return { success: false, error: "Failed to fetch Facebook Pages" };
    }

    const pagesData = await pagesResponse.json();
    const pages = pagesData.data || [];

    // For each page, check if it has an Instagram Business account
    const pagesWithInstagram = [];

    for (const page of pages) {
      const instagramCheck = await checkInstagramBusinessAccount(
        page.access_token,
        page.id
      );

      if (instagramCheck.success) {
        pagesWithInstagram.push({
          pageId: page.id,
          pageName: page.name,
          pageAccessToken: page.access_token,
          instagramAccountId: instagramCheck.instagramAccountId,
          instagramAccount: instagramCheck.instagramAccount,
        });
      }
    }

    return {
      success: true,
      pages: pagesWithInstagram,
      allPages: pages,
    };
  } catch (error) {
    console.error("Error fetching pages with Instagram accounts:", error);
    return {
      success: false,
      error: "Failed to fetch pages with Instagram accounts",
    };
  }
}

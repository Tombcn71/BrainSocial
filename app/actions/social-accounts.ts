"use server";

import { getCurrentUser } from "@/lib/session";
import sql, { safeArray } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

// Voeg deze interface toe bovenaan het bestand, na de imports
interface SocialAccountRecord {
  id: string;
  user_id: string;
  platform: string;
  account_id: string;
  account_name: string;
  access_token: string;
  refresh_token?: string;
  token_expiry?: string;
  profile_image_url?: string;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

// Definieer een type voor de resultaten van de publish functies
type PublishResult =
  | { success: true; postId: string }
  | { success: false; error: string };

// Update the connectSocialAccount function to include profileImageUrl in the type definition
export async function connectSocialAccount({
  platform,
  accountId,
  accountName,
  accessToken,
  refreshToken,
  tokenExpiry,
  pageId,
  profileImageUrl,
}: {
  platform: string;
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: string;
  pageId?: string;
  profileImageUrl?: string;
}) {
  console.log("connectSocialAccount called with:", {
    platform,
    accountId,
    accountName,
    pageId,
    profileImageUrl,
  });

  // Try to get the user from getCurrentUser which checks both NextAuth and auth cookie
  const user = await getCurrentUser();

  if (!user || !user.id) {
    console.error("No authenticated user found");
    return { success: false, error: "Not authenticated" };
  }

  const userId = user.id;
  console.log("User ID from session or cookie:", userId);

  try {
    // Check if account already exists
    const existingAccountResult = await sql`
     SELECT id FROM social_accounts 
     WHERE user_id = ${userId} AND platform = ${platform} AND account_id = ${accountId}
   `;

    // Veilig omgaan met het resultaat
    const existingAccounts = safeArray(existingAccountResult);
    const existingAccount =
      existingAccounts.length > 0 ? existingAccounts[0] : null;

    const id = existingAccount ? existingAccount.id : uuidv4();

    // If it's Facebook, check for required permissions
    if (platform === "facebook" || platform === "facebook_page") {
      const hasRequiredPermissions = await checkFacebookPermissions(
        accessToken
      );

      if (!hasRequiredPermissions.success) {
        return {
          success: false,
          error: `Missing required Facebook permissions: ${hasRequiredPermissions.missingPermissions?.join(
            ", "
          )}. Please reconnect with the proper permissions.`,
        };
      }
    }

    if (existingAccount) {
      console.log("Updating existing account:", id);
      // Update existing account
      await sql`
       UPDATE social_accounts 
       SET account_name = ${accountName}, 
           access_token = ${accessToken}, 
           refresh_token = ${refreshToken}, 
           token_expiry = ${tokenExpiry},
           page_id = ${pageId},
           profile_image_url = ${profileImageUrl},
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ${id}
     `;

      revalidatePath("/dashboard/accounts");
      return { success: true, accountId: id };
    }

    // Create new account
    const newId = uuidv4();
    console.log("Creating new account:", newId);

    await sql`
     INSERT INTO social_accounts 
     (id, user_id, platform, account_id, account_name, access_token, refresh_token, token_expiry, page_id, profile_image_url) 
     VALUES (${newId}, ${userId}, ${platform}, ${accountId}, ${accountName}, ${accessToken}, ${refreshToken}, ${tokenExpiry}, ${pageId}, ${profileImageUrl})
   `;

    revalidatePath("/dashboard/accounts");
    return { success: true, accountId: newId };
  } catch (error) {
    console.error("Connect social account error:", error);
    return { success: false, error: "Failed to connect social account" };
  }
}

export async function getSocialAccounts() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated", accounts: [] };
  }

  try {
    const accountsResult = await sql`
   SELECT * FROM social_accounts 
   WHERE user_id = ${user.id}
   ORDER BY created_at DESC
 `;

    // Zorg ervoor dat we altijd een array teruggeven
    const accounts = safeArray(accountsResult);

    console.log(`Retrieved ${accounts.length} social accounts`);

    return { success: true, accounts };
  } catch (error) {
    console.error("Error getting social accounts:", error);
    return {
      success: false,
      error: "Failed to fetch social accounts",
      accounts: [],
    };
  }
}

export async function disconnectSocialAccount(accountId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await sql`
   DELETE FROM social_accounts 
   WHERE id = ${accountId} AND user_id = ${user.id}
 `;

    revalidatePath("/dashboard/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error disconnecting social account:", error);
    return { success: false, error: "Failed to disconnect social account" };
  }
}

// Wijzig de refreshSocialAccountToken functie om het juiste type te gebruiken
export async function refreshSocialAccountToken(accountId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Haal het account op
    const accountsResult = await sql`
   SELECT * FROM social_accounts
   WHERE id = ${accountId} AND user_id = ${user.id}
 `;

    // Veilig omgaan met het resultaat
    const accounts = safeArray(accountsResult);

    if (accounts.length === 0) {
      return { success: false, error: "Account not found" };
    }

    // Cast het account naar het juiste type
    const account = accounts[0] as SocialAccountRecord;

    // Voor Facebook/Instagram moeten we de refresh token gebruiken om een nieuwe access token te krijgen
    if (account.platform === "facebook" || account.platform === "instagram") {
      if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
        return { success: false, error: "Missing Facebook API credentials" };
      }

      // Gebruik de long-lived token om een nieuwe token te krijgen
      const response = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${account.access_token}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error refreshing Facebook token:", errorData);
        return { success: false, error: "Failed to refresh token" };
      }

      const tokenData = await response.json();
      const newAccessToken = tokenData.access_token;
      const expiresIn = tokenData.expires_in || 60 * 60 * 24 * 60; // Default to 60 days if not provided

      // Bereken de nieuwe vervaldatum
      const newTokenExpiry = new Date();
      newTokenExpiry.setSeconds(newTokenExpiry.getSeconds() + expiresIn);

      // Update het account met de nieuwe token
      await sql`
     UPDATE social_accounts
     SET 
       access_token = ${newAccessToken},
       token_expiry = ${newTokenExpiry.toISOString()},
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ${accountId}
   `;

      revalidatePath("/dashboard/accounts");
      return { success: true };
    }

    // Voor andere platforms zou je hier specifieke refresh logica implementeren

    return {
      success: false,
      error: "Token refresh not implemented for this platform",
    };
  } catch (error) {
    console.error("Error refreshing social account token:", error);
    return { success: false, error: "Failed to refresh social account token" };
  }
}

// Pas de functie aan om het type te gebruiken
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
    if (!response.ok) {
      const data = await response.json();
      console.error("Facebook API error:", data);
      return {
        success: false,
        error: `Facebook API error: ${data.error?.message || "Unknown error"}. 
    Please check if your app has the required permissions: pages_read_engagement and pages_manage_posts.`,
      };
    }

    const data = await response.json();
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

// Wijzig ook de publishToSocialMedia functie om het juiste type te gebruiken
export async function publishToSocialMedia(
  contentId: string,
  platform: string
): Promise<{
  success: boolean;
  error?: string;
  publishedPostId?: string;
  externalPostUrl?: string;
}> {
  console.log(
    `Starting publishToSocialMedia for contentId: ${contentId}, platform: ${platform}`
  );

  const user = await getCurrentUser();

  if (!user) {
    console.log("No authenticated user found");
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Haal de content op
    console.log("Fetching content from database");
    const contentResult = await sql`
  SELECT * FROM content WHERE id = ${contentId} AND user_id = ${user.id}
`;

    // Veilig omgaan met het resultaat
    const contentItems = safeArray(contentResult);
    console.log(`Found ${contentItems.length} content items`);

    if (contentItems.length === 0) {
      return { success: false, error: "Content not found" };
    }

    const content = contentItems[0];
    console.log("Content details:", {
      title: content.title,
      platform: content.platform,
      hasImage: !!content.image_url,
    });

    // BELANGRIJKE WIJZIGING: Zoek naar Facebook accounts met een page_id
    let accountQuery;
    if (platform === "instagram") {
      console.log("Fetching Instagram account with page_id");
      accountQuery = sql`
    SELECT * FROM social_accounts 
    WHERE user_id = ${user.id} 
    AND platform = ${platform}
    AND page_id IS NOT NULL
    LIMIT 1
  `;
    } else if (platform === "facebook" || platform === "facebook_page") {
      console.log("Fetching Facebook page account");
      // Explicitly look for facebook_page accounts first
      accountQuery = sql`
    SELECT * FROM social_accounts 
    WHERE user_id = ${user.id} 
    AND platform = 'facebook_page'
    LIMIT 1
  `;
    } else {
      console.log(`Fetching social account for platform: ${platform}`);
      accountQuery = sql`
    SELECT * FROM social_accounts 
    WHERE user_id = ${user.id} 
    AND platform = ${platform}
    LIMIT 1
  `;
    }

    // Voer de query uit
    const accountResult = await accountQuery;

    // Veilig omgaan met het resultaat
    const accounts = safeArray(accountResult);
    console.log(`Found ${accounts.length} accounts for platform ${platform}`);

    // If no facebook_page account was found and we're trying to publish to Facebook,
    // try to find a regular facebook account with a page_id
    if (
      accounts.length === 0 &&
      (platform === "facebook" || platform === "facebook_page")
    ) {
      console.log(
        "No facebook_page account found, trying to find a facebook account with page_id"
      );
      const fallbackQuery = await sql`
     SELECT * FROM social_accounts 
     WHERE user_id = ${user.id} 
     AND platform = 'facebook'
     AND page_id IS NOT NULL
     LIMIT 1
   `;
      const fallbackAccounts = safeArray(fallbackQuery);
      if (fallbackAccounts.length > 0) {
        console.log("Found a facebook account with page_id");
        accounts.push(fallbackAccounts[0]);
      }
    }

    if (accounts.length === 0) {
      if (platform === "facebook" || platform === "facebook_page") {
        return {
          success: false,
          error:
            "Je moet een Facebook Pagina verbinden om te kunnen publiceren. Persoonlijke profielen worden niet ondersteund.",
        };
      }
      return { success: false, error: `No ${platform} account connected` };
    }

    // Cast het account naar het juiste type
    const account = accounts[0] as SocialAccountRecord;
    console.log("Account details:", {
      id: account.id,
      platform: account.platform,
      hasPageId: !!account.page_id,
      hasTokenExpiry: !!account.token_expiry,
    });

    // Controleer of de token nog geldig is
    if (account.token_expiry && new Date(account.token_expiry) < new Date()) {
      console.log("Token expired:", account.token_expiry);
      return {
        success: false,
        error: "Access token expired. Please refresh your token.",
      };
    }

    // NIEUWE CONTROLE: Controleer of er een page_id is voor Facebook
    if (
      (platform === "facebook" || platform === "facebook_page") &&
      !account.page_id
    ) {
      return {
        success: false,
        error:
          "Je moet een Facebook Pagina verbinden om te kunnen publiceren. Persoonlijke profielen worden niet ondersteund.",
      };
    }

    let externalPostId: string | undefined = undefined;
    let externalPostUrl: string | undefined = undefined;

    // Publiceer de content naar het juiste platform
    if (platform === "facebook" || platform === "facebook_page") {
      console.log(
        `Publishing to ${platform} using account platform: ${account.platform}`
      );

      // Publiceer naar Facebook
      const facebookResult = await publishToFacebook({
        content: content,
        accessToken: account.access_token,
        pageId: account.page_id, // Always use the page_id for Facebook
      });

      console.log("Facebook publish result:", facebookResult);

      if (!facebookResult.success) {
        return { success: false, error: facebookResult.error };
      }

      externalPostId = facebookResult.postId;
      externalPostUrl = `https://facebook.com/${externalPostId}`;
    } else if (platform === "instagram") {
      if (!account.page_id) {
        return {
          success: false,
          error: "Missing Instagram Business account information",
        };
      }

      // Voor Instagram hebben we eerst een container nodig
      let mediaContainerId = null;

      if (content.image_url) {
        // Stap 1: Maak een media container voor de afbeelding
        const containerResponse = await fetch(
          `https://graph.facebook.com/v18.0/${
            account.page_id
          }/media?image_url=${encodeURIComponent(
            content.image_url
          )}&caption=${encodeURIComponent(content.content)}&access_token=${
            account.access_token
          }`,
          {
            method: "POST",
          }
        );

        if (!containerResponse.ok) {
          const errorData = await containerResponse.json();
          console.error("Error creating Instagram media container:", errorData);
          return {
            success: false,
            error: "Failed to create Instagram media container",
          };
        }

        const containerData = await containerResponse.json();
        mediaContainerId = containerData.id;
      } else {
        // Instagram vereist een afbeelding
        return {
          success: false,
          error: "Instagram requires an image for publishing",
        };
      }

      // Stap 2: Publiceer de media container
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${account.page_id}/media_publish?creation_id=${mediaContainerId}&access_token=${account.access_token}`,
        {
          method: "POST",
        }
      );

      if (!publishResponse.ok) {
        const errorData = await publishResponse.json();
        console.error("Error publishing to Instagram:", errorData);
        return { success: false, error: "Failed to publish to Instagram" };
      }

      const publishData = await publishResponse.json();
      externalPostId = publishData.id;
      externalPostUrl = `https://instagram.com/p/${publishData.id}`;
    } else {
      return {
        success: false,
        error: `Publishing to ${platform} is not supported yet.`,
      };
    }

    // Markeer de content als gepubliceerd
    await sql`
  UPDATE content
  SET published = true
  WHERE id = ${contentId} AND user_id = ${user.id}
`;

    // Maak een record van de gepubliceerde post
    const publishedPostId = uuidv4();
    await sql`
  INSERT INTO published_posts (
    id, user_id, content_id, platform, account_id, published_at, external_post_id, externalPost_url
  )
  VALUES (
    ${publishedPostId}, ${user.id}, ${contentId}, ${platform}, ${account.id}, CURRENT_TIMESTAMP, ${externalPostId}, ${externalPostUrl}
  )
`;

    revalidatePath("/dashboard/content/overview");

    return { success: true, publishedPostId, externalPostUrl };
  } catch (error) {
    console.error("Error publishing to social media:", error);
    return { success: false, error: "Failed to publish to social media" };
  }
}

export async function getPublishedPosts(limit = 50) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated", posts: [] };
  }

  try {
    const postsResult = await sql`
   SELECT pp.*, c.content, c.title, c.image_url, sa.account_name
   FROM published_posts pp
   JOIN content c ON pp.content_id = c.id
   JOIN social_accounts sa ON pp.account_id = sa.id
   WHERE pp.user_id = ${user.id}
   ORDER BY pp.published_at DESC
   LIMIT ${limit}
 `;

    // Zorg ervoor dat we altijd een array teruggeven
    const posts = safeArray(postsResult);

    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return {
      success: false,
      error: "Failed to fetch published posts",
      posts: [],
    };
  }
}

// Wijzig ook de publishToInstagram functie om het juiste type te gebruiken
export async function publishToInstagram(contentId: string, accountId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Haal de content op
    const contentResult = await sql`
   SELECT * FROM content WHERE id = ${contentId} AND user_id = ${user.id}
 `;

    // Veilig omgaan met het resultaat
    const contentItems = safeArray(contentResult);

    if (contentItems.length === 0) {
      return { success: false, error: "Content not found" };
    }

    const content = contentItems[0];

    // Controleer of er een afbeelding is (Instagram vereist een afbeelding)
    if (!content.image_url) {
      return {
        success: false,
        error: "Instagram requires an image for publishing",
      };
    }

    // Haal het social account op
    const accountResult = await sql`
   SELECT * FROM social_accounts 
   WHERE id = ${accountId} AND user_id = ${user.id} AND platform = 'instagram'
 `;

    // Veilig omgaan met het resultaat
    const accounts = safeArray(accountResult);

    if (accounts.length === 0) {
      return { success: false, error: "Instagram account not found" };
    }

    // Cast het account naar het juiste type
    const account = accounts[0] as SocialAccountRecord;

    // Controleer of de token nog geldig is
    if (account.token_expiry && new Date(account.token_expiry) < new Date()) {
      return {
        success: false,
        error: "Access token expired. Please refresh your token.",
      };
    }

    // Voor Instagram hebben we eerst een container nodig
    // Stap 1: Maak een media container voor de afbeelding
    const containerResponse = await fetch(
      `${process.env.META_GRAPH_API || "https://graph.facebook.com/v18.0"}/${
        account.page_id
      }/media?image_url=${encodeURIComponent(
        content.image_url
      )}&caption=${encodeURIComponent(content.content)}&access_token=${
        account.access_token
      }`,
      {
        method: "POST",
      }
    );

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      console.error("Error creating Instagram media container:", errorData);
      return {
        success: false,
        error: "Failed to create Instagram media container",
      };
    }

    const containerData = await containerResponse.json();
    const mediaContainerId = containerData.id;

    // Stap 2: Publiceer de media container
    const publishResponse = await fetch(
      `${process.env.META_GRAPH_API || "https://graph.facebook.com/v18.0"}/${
        account.page_id
      }/media_publish?creation_id=${mediaContainerId}&access_token=${
        account.access_token
      }`,
      {
        method: "POST",
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      console.error("Error publishing to Instagram:", errorData);
      return { success: false, error: "Failed to publish to Instagram" };
    }

    const publishData = await publishResponse.json();
    const externalPostId = publishData.id;
    const externalPostUrl = `https://instagram.com/p/${publishData.id}`;

    // Markeer de content als gepubliceerd
    await sql`
   UPDATE content
   SET published = true
   WHERE id = ${contentId} AND user_id = ${user.id}
 `;

    // Maak een record van de gepubliceerde post
    const publishedPostId = uuidv4();
    await sql`
   INSERT INTO published_posts (
     id, user_id, content_id, platform, account_id, published_at, external_post_id, external_post_url
   )
   VALUES (
     ${publishedPostId}, ${user.id}, ${contentId}, 'instagram', ${accountId}, CURRENT_TIMESTAMP, ${externalPostId}, ${externalPostUrl}
   )
 `;

    revalidatePath("/dashboard/content/overview");

    return { success: true, publishedPostId, externalPostUrl };
  } catch (error) {
    console.error("Error publishing to Instagram:", error);
    return { success: false, error: "Failed to publish to Instagram" };
  }
}

async function checkFacebookPermissions(
  accessToken: string
): Promise<{ success: boolean; missingPermissions?: string[] }> {
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

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { connectSocialAccount } from "@/app/actions/social-accounts";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log("Facebook callback route called");

  // Probeer eerst de gebruiker op te halen via getCurrentUser
  let user = await getCurrentUser();

  // Als dat niet lukt, probeer de auth cookie direct te lezen
  if (!user) {
    const authCookie = (await cookies()).get("auth")?.value;
    if (authCookie) {
      user = { id: authCookie };
      console.log("Using auth cookie directly:", authCookie);
    } else {
      console.log("No authenticated user found, redirecting to login");
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/dashboard/accounts", request.url)
      );
    }
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  console.log("Received params:", {
    code: code?.substring(0, 10) + "...",
    error,
  });

  // Controleer op fouten van Facebook
  if (error) {
    console.error("Facebook OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=oauth_denied", request.url)
    );
  }

  // Controleer of we een code hebben ontvangen
  if (!code) {
    console.error("Missing code parameter");
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=missing_params", request.url)
    );
  }

  try {
    // Haal de client ID, client secret en redirect URI op uit de omgevingsvariabelen
    const clientId = process.env.FACEBOOK_APP_ID;
    const clientSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing Facebook API credentials");
      return NextResponse.redirect(
        new URL("/dashboard/accounts/connect?error=missing_config", request.url)
      );
    }

    console.log("Exchanging code for token...");

    // Wissel de code in voor een access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`,
      { method: "GET" }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Error exchanging code for token:", errorData);
      return NextResponse.redirect(
        new URL("/dashboard/accounts/connect?error=token_exchange", request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log("Successfully obtained access token");

    // Haal gebruikersgegevens op van Facebook
    console.log("Fetching user data...");
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`,
      { method: "GET" }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Error fetching user data:", errorData);
      return NextResponse.redirect(
        new URL("/dashboard/accounts/connect?error=user_data", request.url)
      );
    }

    const userData = await userResponse.json();
    console.log("User data retrieved:", {
      id: userData.id,
      name: userData.name,
    });

    // Sla het Facebook account op
    console.log("Storing Facebook user account...");
    const connectResult = await connectSocialAccount({
      platform: "facebook",
      accountName: userData.name + " (Persoonlijk)",
      accountId: userData.id,
      accessToken,
      profileImageUrl: userData.picture?.data?.url, // Store profile image URL
      // Facebook tokens verlopen na 60 dagen
      tokenExpiry: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000
      ).toISOString(),
      pageId: userData.id,
    });

    if (!connectResult.success) {
      console.error("Error connecting Facebook account:", connectResult.error);
    }

    // Haal Facebook pagina's op
    console.log("Fetching Facebook pages...");
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`,
      { method: "GET" }
    );

    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      console.log(`Found ${pagesData.data?.length || 0} Facebook pages`);

      // Loop door alle pagina's
      if (
        pagesData.data &&
        Array.isArray(pagesData.data) &&
        pagesData.data.length > 0
      ) {
        for (const page of pagesData.data) {
          console.log(`Processing page: ${page.name} (${page.id})`);

          // Sla de Facebook pagina op als "facebook_page" platform
          const pageConnectResult = await connectSocialAccount({
            platform: "facebook_page", // Changed from "facebook" to "facebook_page" to distinguish from personal account
            accountName: page.name,
            accountId: page.id,
            accessToken: page.access_token, // Gebruik de page access token
            tokenExpiry: null, // Page tokens do not expire
            pageId: page.id, // Sla de page_id op voor het publiceren
            profileImageUrl: userData.picture?.data?.url,
          });

          if (!pageConnectResult.success) {
            console.error(
              `Error connecting Facebook page ${page.name}:`,
              pageConnectResult.error
            );
          }

          console.log(
            `Facebook page ${page.name} stored successfully as facebook_page`
          );

          // Haal Instagram Business account op voor deze pagina
          console.log(
            `Checking for Instagram account linked to page ${page.name}...`
          );
          const instagramResponse = await fetch(
            `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account{id,name,username,profile_picture_url}&access_token=${page.access_token}`
          );

          if (instagramResponse.ok) {
            const instagramData = await instagramResponse.json();

            if (instagramData.instagram_business_account) {
              const instagramAccount = instagramData.instagram_business_account;
              console.log(
                `Found Instagram account: ${
                  instagramAccount.username || "Unknown"
                }`
              );

              // Sla het Instagram Business account op
              const instagramConnectResult = await connectSocialAccount({
                platform: "instagram",
                accountName:
                  instagramAccount.username || `Instagram via ${page.name}`,
                accountId: instagramAccount.id,
                accessToken: page.access_token, // Gebruik de page access token voor Instagram API
                tokenExpiry: null, // Page tokens do not expire
                profileImageUrl: instagramAccount.profile_picture_url,
                pageId: page.id, // Sla de Facebook Page ID op voor het publiceren van content
              });

              console.log("Instagram account stored successfully");
            } else {
              console.log(`No Instagram account found for page ${page.name}`);
            }
          } else {
            console.log(
              `Error fetching Instagram account for page ${page.name}`
            );
          }
        }
      } else {
        console.log("No Facebook pages found or pages data is not an array");
      }
    } else {
      console.error(
        "Error fetching Facebook pages:",
        await pagesResponse.text()
      );
    }

    console.log("Facebook connection process completed successfully");

    // Redirect naar de accounts pagina
    return NextResponse.redirect(
      new URL("/dashboard/accounts?success=facebook_connected", request.url)
    );
  } catch (error) {
    console.error("Error in Facebook OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=server_error", request.url)
    );
  }
}

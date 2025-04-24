import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import { connectSocialAccount } from "@/app/actions/social-accounts";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Controleer op fouten van Facebook
  if (error) {
    console.error("Facebook OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=oauth_denied", request.url)
    );
  }

  // Controleer of we een code en state hebben ontvangen
  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=missing_params", request.url)
    );
  }

  // Verifieer de state parameter om CSRF aanvallen te voorkomen
  const cookieStore = await cookies();
  const savedState = cookieStore.get("facebook_oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=invalid_state", request.url)
    );
  }

  try {
    // Haal de client ID, client secret en redirect URI op uit de omgevingsvariabelen
    const clientId = process.env.FACEBOOK_APP_ID;
    const clientSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(
        new URL("/dashboard/accounts/connect?error=missing_config", request.url)
      );
    }

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

    // Haal gebruikersgegevens op van Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Error fetching user data:", errorData);
      return NextResponse.redirect(
        new URL("/dashboard/accounts/connect?error=user_data", request.url)
      );
    }

    const userData = await userResponse.json();

    // Sla het Facebook account op
    await connectSocialAccount({
      platform: "facebook",
      accountName: userData.name,
      accountId: userData.id,
      accessToken,
      // Facebook tokens verlopen na 60 dagen
      tokenExpiry: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });

    // Haal Facebook pagina's op
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );

    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();

      // Loop door alle pagina's
      if (pagesData.data && Array.isArray(pagesData.data)) {
        for (const page of pagesData.data) {
          // Sla de Facebook pagina op
          await connectSocialAccount({
            platform: "facebook_page",
            accountName: page.name,
            accountId: page.id,
            accessToken: page.access_token, // Gebruik de page access token
            tokenExpiry: new Date(
              Date.now() + 60 * 24 * 60 * 60 * 1000
            ).toISOString(),
          });

          // Haal Instagram Business account op voor deze pagina
          const instagramResponse = await fetch(
            `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account{id,name,username,profile_picture_url}&access_token=${page.access_token}`
          );

          if (instagramResponse.ok) {
            const instagramData = await instagramResponse.json();

            if (instagramData.instagram_business_account) {
              const instagramAccount = instagramData.instagram_business_account;

              // Sla het Instagram Business account op
              await connectSocialAccount({
                platform: "instagram",
                accountName:
                  instagramAccount.username || `Instagram via ${page.name}`,
                accountId: instagramAccount.id,
                accessToken: page.access_token, // Gebruik de page access token voor Instagram API
                tokenExpiry: new Date(
                  Date.now() + 60 * 24 * 60 * 60 * 1000
                ).toISOString(),
                profileImageUrl: instagramAccount.profile_picture_url,
                pageId: page.id, // Sla de Facebook Page ID op voor het publiceren van content
              });
            }
          }
        }
      }
    }

    // Redirect naar de accounts pagina
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?success=true", request.url)
    );
  } catch (error) {
    console.error("Error in Facebook OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=server_error", request.url)
    );
  }
}

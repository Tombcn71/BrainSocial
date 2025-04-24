import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { cookies } from "next/headers";
import { connectSocialAccount } from "@/app/actions/social-accounts";

// Meta OAuth configuratie
const META_CLIENT_ID = process.env.META_CLIENT_ID;
const META_CLIENT_SECRET = process.env.META_CLIENT_SECRET;
const META_REDIRECT_URI =
  process.env.META_REDIRECT_URI ||
  "http://localhost:3000/api/auth/meta/callback";

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
      new URL("/dashboard/accounts?error=oauth_denied", request.url)
    );
  }

  // Controleer of we een code en state hebben ontvangen
  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard/accounts?error=missing_params", request.url)
    );
  }

  // Verifieer de state parameter om CSRF aanvallen te voorkomen
  const savedState = (await cookies()).get("meta_oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/dashboard/accounts?error=invalid_state", request.url)
    );
  }

  try {
    // Wissel de code in voor een access token
    const tokenResponse = await fetch(
      "https://graph.facebook.com/v18.0/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: META_CLIENT_ID!,
          client_secret: META_CLIENT_SECRET!,
          redirect_uri: META_REDIRECT_URI,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Error exchanging code for token:", errorData);
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=token_exchange", request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in; // Seconds until token expires

    // Bereken de vervaldatum
    const tokenExpiry = new Date();
    tokenExpiry.setSeconds(tokenExpiry.getSeconds() + expiresIn);

    // Haal gebruikersgegevens op van Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error("Error fetching user data:", userData);
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=user_data", request.url)
      );
    }

    // Sla het Facebook account op
    await connectSocialAccount({
      platform: "facebook",
      accountName: userData.name,
      accountId: userData.id,
      accessToken,
      tokenExpiry: tokenExpiry.toISOString(),
      profileImageUrl: userData.picture?.data?.url,
    });

    // Haal Instagram accounts op die verbonden zijn met dit Facebook account
    const instagramAccountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{id,name,username,profile_picture_url}&access_token=${accessToken}`
    );

    if (instagramAccountsResponse.ok) {
      const instagramData = await instagramAccountsResponse.json();

      // Verwerk Instagram accounts als ze beschikbaar zijn
      if (instagramData.data && instagramData.data.length > 0) {
        for (const page of instagramData.data) {
          if (page.instagram_business_account) {
            const igAccount = page.instagram_business_account;

            // Sla het Instagram account op
            await connectSocialAccount({
              platform: "instagram",
              accountName: igAccount.username || igAccount.name,
              accountId: igAccount.id,
              accessToken, // Gebruik dezelfde token als Facebook
              tokenExpiry: tokenExpiry.toISOString(),
              profileImageUrl: igAccount.profile_picture_url,
              pageId: page.id, // Sla de Facebook Page ID op voor het publiceren van content
            });
          }
        }
      }
    }

    // Redirect naar de accounts pagina
    return NextResponse.redirect(
      new URL("/dashboard/accounts?success=true", request.url)
    );
  } catch (error) {
    console.error("Error in Meta OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts?error=server_error", request.url)
    );
  }
}

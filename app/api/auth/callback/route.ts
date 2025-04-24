import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { cookies } from "next/headers";
import { connectSocialAccount } from "@/app/actions/social-accounts";

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
  const savedState = cookieStore.get("meta_oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=invalid_state", request.url)
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
          client_id: process.env.META_CLIENT_ID || "",
          client_secret: process.env.META_CLIENT_SECRET || "",
          redirect_uri: process.env.META_REDIRECT_URI || "",
          code,
        }),
      }
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
        new URL("/dashboard/accounts/connect?error=user_data", request.url)
      );
    }

    // Haal Facebook pagina's op
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesResponse.json();

    if (pagesResponse.ok && pagesData.data && pagesData.data.length > 0) {
      // Sla elke Facebook pagina op als een apart social account
      for (const page of pagesData.data) {
        await connectSocialAccount({
          platform: "facebook",
          accountName: page.name,
          accountId: page.id,
          accessToken: page.access_token, // Gebruik de page-specific token
          tokenExpiry: tokenExpiry.toISOString(),
          profileImageUrl: `https://graph.facebook.com/${page.id}/picture?type=large`,
          pageId: page.id,
        });
      }

      // Haal Instagram Business accounts op die gekoppeld zijn aan deze Facebook pagina's
      for (const page of pagesData.data) {
        const igAccountsResponse = await fetch(
          `https://graph.facebook.com/v18.0/${page.id}/instagram_accounts?access_token=${page.access_token}`
        );
        const igAccountsData = await igAccountsResponse.json();

        if (
          igAccountsResponse.ok &&
          igAccountsData.data &&
          igAccountsData.data.length > 0
        ) {
          for (const igAccount of igAccountsData.data) {
            await connectSocialAccount({
              platform: "instagram",
              accountName: igAccount.username,
              accountId: igAccount.id,
              accessToken: page.access_token, // Gebruik de Facebook page token voor Instagram API
              tokenExpiry: tokenExpiry.toISOString(),
              profileImageUrl: `https://graph.facebook.com/${igAccount.id}/picture?type=large`,
              pageId: page.id, // Sla de gekoppelde Facebook page ID op
            });
          }
        }
      }
    } else {
      // Als er geen pagina's zijn, sla het persoonlijke account op
      await connectSocialAccount({
        platform: "facebook",
        accountName: userData.name,
        accountId: userData.id,
        accessToken,
        tokenExpiry: tokenExpiry.toISOString(),
        profileImageUrl: userData.picture?.data?.url,
      });
    }

    // Redirect naar de accounts pagina
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?success=true", request.url)
    );
  } catch (error) {
    console.error("Error in Meta OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard/accounts/connect?error=server_error", request.url)
    );
  }
}

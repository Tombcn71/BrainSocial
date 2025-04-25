import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Als er een error is, redirect naar de connect pagina met een error
  if (error) {
    return redirect("/dashboard/accounts/connect?error=meta_auth_error");
  }

  // Als er geen code is, redirect naar de connect pagina met een error
  if (!code) {
    return redirect("/dashboard/accounts/connect?error=no_code");
  }

  try {
    // Haal een access token op met de code
    const clientId = process.env.META_CLIENT_ID;
    const clientSecret = process.env.META_CLIENT_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    const tokenResponse = await fetch(
      `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`,
      { method: "GET" }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Meta token error:", tokenData);
      return redirect("/dashboard/accounts/connect?error=token_error");
    }

    const accessToken = tokenData.access_token;

    // Haal gebruikersgegevens op
    const userResponse = await fetch(
      `https://graph.facebook.com/v22.0/me?fields=id,name,email,picture&access_token=${accessToken}`,
      { method: "GET" }
    );

    const userData = await userResponse.json();

    // Haal Facebook pagina's op
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`,
      {
        method: "GET",
      }
    );

    const pagesData = await pagesResponse.json();

    // Sla de Facebook account op in de database
    await sql`
      INSERT INTO social_accounts (
        provider,
        provider_account_id,
        provider_account_name,
        access_token,
        token_type,
        user_id,
        pages,
        profile_image_url
      ) VALUES (
        'facebook',
        ${userData.id},
        ${userData.name},
        ${accessToken},
        'bearer',
        '1', -- Vervang dit met de echte user_id
        ${JSON.stringify(pagesData.data || [])},
        ${userData.picture?.data?.url}
      )
      ON CONFLICT (provider, provider_account_id) 
      DO UPDATE SET
        access_token = ${accessToken},
        provider_account_name = ${userData.name},
        pages = ${JSON.stringify(pagesData.data || [])},
        profile_image_url = ${userData.picture?.data?.url}
    `;

    // Redirect naar de connect pagina met een success message
    return redirect("/dashboard/accounts/connect?success=meta_connected");
  } catch (error) {
    console.error("Meta callback error:", error);
    return redirect("/dashboard/accounts/connect?error=callback_error");
  }
}

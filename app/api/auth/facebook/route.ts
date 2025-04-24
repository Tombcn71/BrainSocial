import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  // Haal de client ID en redirect URI op uit de omgevingsvariabelen
  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing Facebook configuration" },
      { status: 500 }
    );
  }

  // Genereer een state parameter om CSRF aanvallen te voorkomen
  const state = uuidv4();

  // Sla de state op in een cookie
  (
    await // Sla de state op in een cookie
    cookies()
  ).set("facebook_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minuten
    path: "/",
  });

  // Definieer de permissies die we nodig hebben
  const scopes = [
    "public_profile",
    "email",
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "instagram_basic",
    "instagram_content_publish",
  ];

  // Bouw de Facebook OAuth URL
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(
    ","
  )}`;

  // Redirect naar de Facebook OAuth pagina
  return NextResponse.redirect(facebookAuthUrl);
}

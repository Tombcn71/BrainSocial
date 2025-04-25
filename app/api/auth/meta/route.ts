import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const clientId = process.env.META_CLIENT_ID;
  const redirectUri = process.env.META_REDIRECT_URI;

  // Genereer een willekeurige state voor beveiliging
  const state = Math.random().toString(36).substring(2);

  // Definieer de permissies die je nodig hebt
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
  const metaAuthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(
    ","
  )}`;

  // Redirect naar Facebook voor authenticatie
  return redirect(metaAuthUrl);
}

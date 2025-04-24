// Meta API configuratie
export const META_CONFIG = {
  // App gegevens
  CLIENT_ID: process.env.META_CLIENT_ID || "1904784919926229", // Je Instagram app ID
  CLIENT_SECRET: process.env.META_CLIENT_SECRET || "", // Vul hier je app secret in
  REDIRECT_URI:
    process.env.META_REDIRECT_URI ||
    "http://localhost:3000/api/auth/meta/callback",

  // API endpoints
  AUTH_URL: "https://www.facebook.com/v18.0/dialog/oauth",
  TOKEN_URL: "https://graph.facebook.com/v18.0/oauth/access_token",
  GRAPH_API: "https://graph.facebook.com/v18.0",

  // Permissies
  SCOPES: [
    "public_profile",
    "email",
    "instagram_basic",
    "instagram_content_publish",
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
  ],
};

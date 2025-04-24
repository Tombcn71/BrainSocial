// Facebook API configuratie
export const FACEBOOK_CONFIG = {
  clientId: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  redirectUri:
    process.env.FACEBOOK_REDIRECT_URI ||
    "http://localhost:3000/api/auth/facebook/callback",
  graphApiVersion: "v18.0",
  scopes: [
    "public_profile",
    "email",
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "instagram_basic",
    "instagram_content_publish",
  ],
};

// Controleer of de configuratie geldig is
export function isValidFacebookConfig() {
  return (
    FACEBOOK_CONFIG.clientId &&
    FACEBOOK_CONFIG.clientSecret &&
    FACEBOOK_CONFIG.redirectUri
  );
}

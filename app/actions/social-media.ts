"use server";

import sql from "@/lib/db";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function connectSocialAccount(
  platform: string,
  accountId: string,
  accountName: string,
  accessToken: string,
  refreshToken?: string,
  tokenExpiry?: string
) {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Check if account already exists
    const existingAccount = await sql`
      SELECT id FROM social_accounts 
      WHERE user_id = ${userId} AND platform = ${platform} AND account_id = ${accountId}
    `;

    if (existingAccount.length > 0) {
      // Update existing account
      await sql`
        UPDATE social_accounts 
        SET account_name = ${accountName}, 
            access_token = ${accessToken}, 
            refresh_token = ${refreshToken}, 
            token_expiry = ${tokenExpiry}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND platform = ${platform} AND account_id = ${accountId}
      `;

      return { success: true, accountId: existingAccount[0].id };
    }

    // Create new account
    const id = uuidv4();

    await sql`
      INSERT INTO social_accounts 
      (id, user_id, platform, account_id, account_name, access_token, refresh_token, token_expiry) 
      VALUES (${id}, ${userId}, ${platform}, ${accountId}, ${accountName}, ${accessToken}, ${refreshToken}, ${tokenExpiry})
    `;

    return { success: true, accountId: id };
  } catch (error) {
    console.error("Connect social account error:", error);
    return { success: false, error: "Failed to connect social account" };
  }
}

export async function disconnectSocialAccount(accountId: string) {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await sql`DELETE FROM social_accounts WHERE id = ${accountId} AND user_id = ${userId}`;

    return { success: true };
  } catch (error) {
    console.error("Disconnect social account error:", error);
    return { success: false, error: "Failed to disconnect social account" };
  }
}

export async function getSocialAccounts() {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result = await sql`
      SELECT id, platform, account_name 
      FROM social_accounts 
      WHERE user_id = ${userId}
    `;

    return { success: true, accounts: result };
  } catch (error) {
    console.error("Get social accounts error:", error);
    return { success: false, error: "Failed to get social accounts" };
  }
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import sql, { safeArray } from "@/lib/db";
import {
  checkInstagramBusinessAccount,
  getInstagramAccountInfo,
  testInstagramPublishing,
  getPagesWithInstagramAccounts,
} from "@/lib/instagram-helpers";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the Instagram account
    const accountResult = await sql`
      SELECT * FROM social_accounts 
      WHERE user_id = ${user.id} AND platform = 'instagram'
      LIMIT 1
    `;

    const accounts = safeArray(accountResult);

    if (accounts.length === 0) {
      return NextResponse.json(
        { success: false, error: "No Instagram account connected" },
        { status: 404 }
      );
    }

    const account = accounts[0];
    const accessToken = account.access_token;
    const pageId = account.page_id;

    if (!pageId) {
      return NextResponse.json(
        {
          success: false,
          error: "No Facebook Page ID associated with this Instagram account",
        },
        { status: 400 }
      );
    }

    // Check if the Instagram Business account is properly connected
    const instagramCheck = await checkInstagramBusinessAccount(
      accessToken,
      pageId
    );

    // If we have an Instagram account ID, get more info about it
    let instagramAccountInfo = null;
    if (instagramCheck.success && instagramCheck.instagramAccountId) {
      const infoResult = await getInstagramAccountInfo(
        accessToken,
        instagramCheck.instagramAccountId
      );
      if (infoResult.success) {
        instagramAccountInfo = infoResult.account;
      }
    }

    // Test Instagram publishing capability
    let publishingTest = null;
    if (instagramCheck.success && instagramCheck.instagramAccountId) {
      publishingTest = await testInstagramPublishing(
        accessToken,
        pageId,
        instagramCheck.instagramAccountId
      );
    }

    // Get all Facebook Pages with Instagram Business accounts
    const pagesWithInstagram = await getPagesWithInstagramAccounts(accessToken);

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        platform: account.platform,
        accountName: account.account_name,
        pageId: account.page_id,
        tokenExpiry: account.token_expiry,
      },
      instagramCheck,
      instagramAccountInfo,
      publishingTest,
      pagesWithInstagram: pagesWithInstagram.success
        ? pagesWithInstagram.pages
        : [],
      allPages: pagesWithInstagram.success ? pagesWithInstagram.allPages : [],
    });
  } catch (error) {
    console.error("Error in debug Instagram API:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

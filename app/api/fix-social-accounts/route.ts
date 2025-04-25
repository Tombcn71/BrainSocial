import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import sql, { safeArray } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get all social accounts
    const accountsResult = await sql`
     SELECT * FROM social_accounts 
     WHERE user_id = ${user.id}
   `;

    const accounts = safeArray(accountsResult);
    console.log(`Found ${accounts.length} social accounts`);

    // Check for Facebook accounts without page_id
    const facebookAccounts = accounts.filter(
      (acc) =>
        (acc.platform === "facebook" || acc.platform === "facebook_page") &&
        !acc.page_id
    );
    const instagramAccounts = accounts.filter(
      (acc) => acc.platform === "instagram" && !acc.page_id
    );

    let updatedAccounts = 0;

    // For each Facebook account without page_id, try to fetch pages
    for (const account of facebookAccounts) {
      try {
        console.log(
          `Trying to fetch pages for account ${account.id} (${account.account_name})`
        );
        const pagesResponse = await fetch(
          `https://graph.facebook.com/v18.0/me/accounts?access_token=${account.access_token}`
        );

        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();

          if (
            pagesData.data &&
            Array.isArray(pagesData.data) &&
            pagesData.data.length > 0
          ) {
            const page = pagesData.data[0];
            console.log(
              `Found page for account ${account.id}: ${page.name} (${page.id})`
            );

            // Update the account with the page_id
            await sql`
             UPDATE social_accounts
             SET page_id = ${page.id}, access_token = ${page.access_token}
             WHERE id = ${account.id}
           `;
            updatedAccounts++;
          } else {
            console.log(`No pages found for account ${account.id}`);

            // If this is a personal account, set the page_id to the account_id as fallback
            await sql`
             UPDATE social_accounts
             SET page_id = ${account.account_id}
             WHERE id = ${account.id}
           `;
            updatedAccounts++;
          }
        } else {
          console.log(`Failed to fetch pages for account ${account.id}`);
          const errorData = await pagesResponse.json();
          console.error("Error:", errorData);

          // Set page_id to account_id as fallback
          await sql`
           UPDATE social_accounts
           SET page_id = ${account.account_id}
           WHERE id = ${account.id}
         `;
          updatedAccounts++;
        }
      } catch (error) {
        console.error(`Error fetching pages for account ${account.id}:`, error);

        // Set page_id to account_id as fallback
        await sql`
         UPDATE social_accounts
         SET page_id = ${account.account_id}
         WHERE id = ${account.id}
       `;
        updatedAccounts++;
      }
    }

    // For each Instagram account without page_id, try to find a Facebook account with page_id
    for (const account of instagramAccounts) {
      // Find a Facebook account with page_id
      const facebookWithPageId = accounts.find(
        (acc) =>
          (acc.platform === "facebook" || acc.platform === "facebook_page") &&
          acc.page_id
      );

      if (facebookWithPageId) {
        console.log(
          `Updating Instagram account ${account.id} with page_id from Facebook account`
        );

        // Update the Instagram account with the page_id from the Facebook account
        await sql`
         UPDATE social_accounts
         SET page_id = ${facebookWithPageId.page_id}
         WHERE id = ${account.id}
       `;
        updatedAccounts++;
      } else {
        console.log(
          `No Facebook account with page_id found for Instagram account ${account.id}`
        );

        // Set page_id to account_id as fallback
        await sql`
         UPDATE social_accounts
         SET page_id = ${account.account_id}
         WHERE id = ${account.id}
       `;
        updatedAccounts++;
      }
    }

    // If no accounts were updated but there are accounts, update all accounts with account_id as page_id
    if (updatedAccounts === 0 && accounts.length > 0) {
      console.log(
        "No accounts updated, setting page_id = account_id for all accounts"
      );

      for (const account of accounts) {
        await sql`
         UPDATE social_accounts
         SET page_id = ${account.account_id}
         WHERE id = ${account.id} AND page_id IS NULL
       `;
        updatedAccounts++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedAccounts} accounts with page_id`,
      facebookAccountsWithoutPageId: facebookAccounts.length,
      instagramAccountsWithoutPageId: instagramAccounts.length,
      totalAccounts: accounts.length,
    });
  } catch (error) {
    console.error("Error fixing social accounts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fix social accounts" },
      { status: 500 }
    );
  }
}

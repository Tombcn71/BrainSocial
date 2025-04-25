import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import sql, { safeArray } from "@/lib/db";

export async function POST() {
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
     WHERE user_id = ${user.id} AND page_id IS NULL
   `;

    const accounts = safeArray(accountsResult);
    console.log(`Found ${accounts.length} social accounts without page_id`);

    let updatedAccounts = 0;

    // Update all accounts to set page_id = account_id
    for (const account of accounts) {
      await sql`
       UPDATE social_accounts
       SET page_id = ${account.account_id}
       WHERE id = ${account.id}
     `;
      updatedAccounts++;
    }

    return NextResponse.json({
      success: true,
      message: `Manually updated ${updatedAccounts} accounts with page_id = account_id`,
      updatedAccounts,
      totalAccounts: accounts.length,
    });
  } catch (error) {
    console.error("Error manually fixing social accounts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fix social accounts" },
      { status: 500 }
    );
  }
}

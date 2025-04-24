import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // Create social_accounts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS social_accounts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        account_id VARCHAR(255) NOT NULL,
        account_name VARCHAR(255) NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        token_expiry TIMESTAMP WITH TIME ZONE,
        profile_image_url TEXT,
        page_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, platform, account_id)
      )
    `;

    // Create published_posts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS published_posts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
        published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        external_post_id TEXT,
        external_post_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_published_posts_user_id ON published_posts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_published_posts_content_id ON published_posts(content_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_published_posts_account_id ON published_posts(account_id)`;

    return NextResponse.json({
      success: true,
      message:
        "Database updated successfully. Added social_accounts and published_posts tables.",
    });
  } catch (error) {
    console.error("Error updating database:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update database: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

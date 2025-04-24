import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // Add image_url column to content table if it doesn't exist
    await sql`
      DO $
      BEGIN
          IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'content' AND column_name = 'image_url'
          ) THEN
              ALTER TABLE content ADD COLUMN image_url TEXT;
          END IF;
      END $;
    `;

    return NextResponse.json({
      success: true,
      message:
        "Database updated successfully. Added image_url column to content table.",
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

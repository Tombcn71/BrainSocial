import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { publishToSocialMedia } from "@/app/actions/social-accounts";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { contentId, platform } = await request.json();

    if (!contentId || !platform) {
      return NextResponse.json(
        { success: false, error: "Content ID and platform are required" },
        { status: 400 }
      );
    }

    // Call the server action to publish content
    const result = await publishToSocialMedia(contentId, platform);

    if (!result.success) {
      console.error(`Error publishing to ${platform}:`, result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error || `Failed to publish to ${platform}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publishedPostId: result.publishedPostId,
      externalPostUrl: result.externalPostUrl,
    });
  } catch (error) {
    console.error("Error in publish API route:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

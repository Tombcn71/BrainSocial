import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { connectSocialAccount } from "@/app/actions/social-accounts";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pageId, pageName, accessToken, profileImageUrl } = body;

    if (!pageId || !pageName || !accessToken) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect the Facebook Page
    const result = await connectSocialAccount({
      platform: "facebook",
      accountName: `${pageName} (Page)`,
      accountId: pageId,
      accessToken,
      tokenExpiry: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000
      ).toISOString(), // 60 days
      pageId: pageId, // Important: Set the page_id field
      profileImageUrl, // Add the profile image URL
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to connect Facebook page" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully connected Facebook Page: ${pageName}`,
    });
  } catch (error) {
    console.error("Error connecting Facebook page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect Facebook page" },
      { status: 500 }
    );
  }
}

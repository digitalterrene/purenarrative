//app/api/bookmarks/check/route.ts
import { NextResponse } from "next/server";
import { getBookmarkCollection } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const postId = searchParams.get("postId");

    if (!userId || !postId) {
      return NextResponse.json(
        { success: false, error: "User ID and Post ID are required" },
        { status: 400 }
      );
    }

    const bookmarksCollection = await getBookmarkCollection();
    const isBookmarked = await bookmarksCollection.findOne({
      userId,
      postId,
    });

    return NextResponse.json({
      success: true,
      isBookmarked: !!isBookmarked,
    });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check bookmark" },
      { status: 500 }
    );
  }
}

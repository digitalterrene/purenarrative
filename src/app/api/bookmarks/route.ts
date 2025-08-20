//app/api/bookmarks/route.ts
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { getBookmarkCollection } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const bookmarksCollection = await getBookmarkCollection();
    const bookmarks = await bookmarksCollection.find({ userId }).toArray();

    return NextResponse.json({ success: true, data: bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const bookmarksCollection = await getBookmarkCollection();
    const existingBookmark = await bookmarksCollection.findOne({
      userId,
      postId,
    });

    if (existingBookmark) {
      await bookmarksCollection.deleteOne({ _id: existingBookmark._id });
      return NextResponse.json({
        success: true,
        message: "Bookmark removed",
        bookmarks: await bookmarksCollection.find({ userId }).toArray(),
      });
    } else {
      const newBookmark = {
        userId,
        postId,
        createdAt: new Date(),
      };
      await bookmarksCollection.insertOne(newBookmark);
      return NextResponse.json({
        success: true,
        message: "Bookmark added",
        bookmarks: await bookmarksCollection.find({ userId }).toArray(),
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}

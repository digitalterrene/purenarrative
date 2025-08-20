//app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { getPostCollection } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const postsCollection = await getPostCollection();
    const post = await postsCollection.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await postsCollection.updateOne(
      { _id: post._id },
      { $inc: { viewCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const postsCollection = await getPostCollection();
    const post = await postsCollection.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (post.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    const updatedPost = {
      ...post,
      ...updateData,
      updatedAt: new Date(),
    };

    if (updateData.content) {
      updatedPost.readingTime = calculateReadingTime(updateData.content);
    }

    await postsCollection.updateOne({ _id: post._id }, { $set: updatedPost });

    return NextResponse.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const postsCollection = await getPostCollection();
    const post = await postsCollection.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (post.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await postsCollection.deleteOne({ _id: post._id });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

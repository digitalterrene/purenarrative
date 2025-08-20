//app/api/comments/route.ts
import { NextResponse } from "next/server";
import { getCommentCollection, getPostCollection } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const authorId = searchParams.get("authorId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    const commentsCollection = await getCommentCollection();
    let query: any = {};

    if (postId) query.postId = postId;
    if (authorId) query.authorId = authorId;

    const comments = await commentsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await commentsCollection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: comments,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
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

    const commentsCollection = await getCommentCollection();
    const postsCollection = await getPostCollection();
    const commentData = await request.json();

    // Validate required fields
    if (!commentData.postId || !commentData.content) {
      return NextResponse.json(
        { success: false, error: "Post ID and content are required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await postsCollection.findOne({
      _id: new ObjectId(commentData.postId),
    });
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const newComment = {
      ...commentData,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
    };

    const result = await commentsCollection.insertOne(newComment);
    const insertedComment = await commentsCollection.findOne({
      _id: new ObjectId(result.insertedId),
    });

    return NextResponse.json({
      success: true,
      data: insertedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

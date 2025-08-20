//app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getPostCollection } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const authorId = searchParams.get("authorId");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    const postsCollection = await getPostCollection();
    let query: any = {};

    if (status) query.status = status;
    if (authorId) query.authorId = authorId;
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (featured) query.featured = featured === "true";
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await postsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await postsCollection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: posts,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
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

    const postsCollection = await getPostCollection();
    const postData = await request.json();

    // Validate required fields
    if (!postData.title || !postData.content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newPost = {
      ...postData,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      readingTime: calculateReadingTime(postData.content),
    };

    const result = await postsCollection.insertOne(newPost);
    const insertedPost = await postsCollection.findOne({
      _id: result.insertedId,
    });

    return NextResponse.json({
      success: true,
      data: insertedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}

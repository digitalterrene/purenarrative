// app/api/users/[id]/posts/route.ts
import { NextResponse } from "next/server";
import { getPostCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postsCollection = await getPostCollection();
    const posts = await postsCollection
      .find({
        authorId: params.id,
        status: "published",
      })
      .toArray();

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}

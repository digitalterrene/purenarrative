//app/api/categories/[slug]/route.ts
import { NextResponse } from "next/server";
import { getCategoryCollection, getPostCollection } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const categoriesCollection = await getCategoryCollection();
    const category = await categoriesCollection.findOne({ slug: params.slug });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Get posts in this category
    const postsCollection = await getPostCollection();
    const posts = await postsCollection
      .find({ categories: category.slug, status: "published" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        posts,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

//app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getCategoryCollection } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const categoriesCollection = await getCategoryCollection();
    const categories = await categoriesCollection
      .find()
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
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

    const categoriesCollection = await getCategoryCollection();
    const categoryData = await request.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await categoriesCollection.findOne({
      name: categoryData.name,
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await categoriesCollection.insertOne(newCategory);
    const insertedCategory = await categoriesCollection.findOne({
      _id: result.insertedId,
    });

    return NextResponse.json({
      success: true,
      data: insertedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}

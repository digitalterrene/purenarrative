//app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getUserCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const usersCollection = await getUserCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Don't return sensitive information
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

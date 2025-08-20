//app/api/users/route.ts
import { NextResponse } from "next/server";
import { getUserCollection } from "@/lib/db";

export async function GET() {
  try {
    const usersCollection = await getUserCollection();
    const users = await usersCollection.find().toArray();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

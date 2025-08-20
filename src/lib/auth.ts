//lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken(
  request?: Request
): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      if (request) {
        const authHeader = request.headers.get("Authorization");
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
          };
          return decoded.userId;
        }
      }
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

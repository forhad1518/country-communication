import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/config/connectDB";
import User from "@/models/auth/users";

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper: Check user status from database
async function isUserActive(email: string): Promise<boolean> {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select("isActive");
    return user?.isActive === true;
  } catch (error) {
    console.error("Middleware: Error checking user status:", error);
    return false;
  }
}

export default async function proxy(
  request: NextRequest,
): Promise<NextResponse> {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // PUBLIC ROUTES
  const publicPaths = ["/login"];

  if (publicPaths.includes(pathname)) {
    // Already logged in - check if token is valid and user is active
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
          email: string;
          role: string;
        };

        // Check if user is still active
        const active = await isUserActive(decoded.email);
        if (!active) {
          // User deactivated - clear token and redirect to login
          const response = NextResponse.redirect(
            new URL("/login", request.url),
          );
          response.cookies.delete("token");
          return response;
        }

        return NextResponse.redirect(new URL("/admin", request.url));
      } catch (err) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // PROTECTED ROUTES (admin/*)
  if (!token) {
    // Clear any stale cookies and redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: string;
      userId: string;
    };

    // ===== CHECK USER ACTIVE STATUS =====
    const active = await isUserActive(decoded.email);

    if (!active) {
      // User is deactivated - clear token and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");

      // Add query param for better UX
      response.headers.set("x-redirect-reason", "account_deactivated");

      return response;
    }

    // ===== ROLE-BASED ACCESS CONTROL (OPTIONAL) =====
    // Check if user has permission for specific routes
    if (pathname.startsWith("/admin/users") && decoded.role !== "admin") {
      // Only admin can access user management
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Token valid and user active - allow access
    return NextResponse.next();
  } catch (err) {
    // Token invalid or expired - clear and redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

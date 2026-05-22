import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // PUBLIC ROUTES
  const publicPaths = ["/login"];

  if (publicPaths.includes(pathname)) {
    // already logged in
    if (token) {
      try {
        jwt.verify(token, JWT_SECRET);

        return NextResponse.redirect(new URL("/admin", request.url));
      } catch (err) {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  // NO TOKEN
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

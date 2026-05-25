import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/config/connectDB";
import User from "@/models/auth/users";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: string;
      userId: string;
    };

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

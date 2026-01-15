/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET: Fetch all users
 */
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Register or Sync User Data (Upsert)
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { telegramId, ...otherData } = body;
    if (!telegramId) {
      return NextResponse.json(
        { success: false, message: "telegramId is required" },
        { status: 400 }
      );
    }
    const user = await User.findOneAndUpdate(
      { telegramId },
      {
        $set: {
          ...otherData,
          lastActive: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    ).lean();
    const isNewUser = user.createdAt === user.updatedAt;
    return NextResponse.json(
      {
        success: true,
        data: user,
        message: isNewUser ? "User created." : "User synced.",
      },
      { status: isNewUser ? 201 : 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

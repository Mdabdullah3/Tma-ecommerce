/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET: Fetch single user details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
  try {
    await dbConnect();

    // Await the params before using them
    const { id } = await params;

    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update user dynamically
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
  try {
    await dbConnect();

    // Await the params before using them
    const { id } = await params;
    const body = await req.json();

    // Prevent accidental modification of the Telegram ID if passed
    const { telegramId, ...updates } = body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Agent records updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

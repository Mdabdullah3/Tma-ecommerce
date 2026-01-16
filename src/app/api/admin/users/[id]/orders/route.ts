/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { CORS_HEADERS } from "@/lib/cors";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await User.findOne({
      $or: [{ _id: id }, { telegramId: id }],
    }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }
    const recentOrders = await Order.find({ user: user.telegramId || user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    return NextResponse.json(
      {
        success: true,
        data: {
          profile: user,
          recentOrders: recentOrders,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { CORS_HEADERS } from "@/lib/cors";

/**
 * POST: Create a new order
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newOrder = await Order.create(body);
    console.log("order", newOrder);

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

/**
 * GET: Load all orders (Admin View)
 */
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, data: orders },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

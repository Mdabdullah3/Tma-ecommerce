/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb"; // Adjust path to your DB config
import Order from "@/models/Order"; // Adjust path to your models
import User from "@/models/User"; // Adjust path to your models

export async function GET() {
  try {
    await dbConnect();

    const salesData = await Order.aggregate([
      { $match: { status: { $in: ["COMPLETED", "DEMO_COMPLETED"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    // 2. Count Total Users
    const totalUsers = await User.countDocuments();

    // 3. (Optional) Get count of pending orders for more metrics
    const pendingOrders = await Order.countDocuments({ status: "PENDING" });

    const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue.toFixed(2),
        totalUsers: totalUsers,
        pendingOrders: pendingOrders,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

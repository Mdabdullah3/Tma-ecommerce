/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { CORS_HEADERS } from "@/lib/cors";

type Context = { params: Promise<{ id: string }> };

/**
 * OPTIONS: Handle Preflight for PUT/DELETE
 */
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET: Fetch a single product by its custom ID (e.g., nft001)
 */
export async function GET(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findOne({ id: id }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: product },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * PUT: Update product details
 */
export async function PUT(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedProduct, message: "Product updated." },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

/**
 * DELETE: Remove product from database
 */
export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedProduct = await Product.findOneAndDelete({ id: id });

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully." },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

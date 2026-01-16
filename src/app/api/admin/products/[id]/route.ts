/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { CORS_HEADERS } from "@/lib/cors";
import mongoose from "mongoose";
type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;

    // 1. Validate the ID format to prevent Mongoose casting errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "INVALID_MONGODB_ID_FORMAT" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 2. Search using findById (which targets the _id field)
    const product = await Product.findById(id).lean();
    console.log(product, "product");
    if (!product) {
      return NextResponse.json(
        { success: false, message: "ASSET_NOT_FOUND_IN_DB" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Return the product. Note: MongoDB returns '_id', not 'id'
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
 * PUT: Update product details by _id
 */
export async function PUT(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "INVALID_ID" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json(
      { success: true, data: updatedProduct },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE: Remove product by _id
 */
export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "INVALID_ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "PRODUCT_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "PRODUCT_DELETED" },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

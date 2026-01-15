import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { CORS_HEADERS } from "@/lib/cors";
export async function GET() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return NextResponse.json(products, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const newProduct = await Product.create(body);
  return NextResponse.json(newProduct, {
    status: 201,
    headers: CORS_HEADERS,
  });
}

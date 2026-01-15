import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: string; // Internal custom ID (e.g., nft001)
  name: string;
  image: string;
  category: string;
  priceTon: number;
  status: "listed" | "sold" | "unlisted";
  views: number;
  mintDate: string;
}

const ProductSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, uppercase: true },
    priceTon: { type: Number, required: true },
    status: {
      type: String,
      enum: ["listed", "sold", "unlisted"],
      default: "listed",
    },
    views: { type: Number, default: 0 },
    mintDate: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

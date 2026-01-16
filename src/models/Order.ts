import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  user: {
    type: String, 
    required: true,
    index: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: String,
      priceTon: Number,
      image: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  transactionHash: { type: String }, // For TON blockchain tracking
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);
export default Order;

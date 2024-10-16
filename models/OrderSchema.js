import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserOfJSM", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  placedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;

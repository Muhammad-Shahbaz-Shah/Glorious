import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One user = One cart document
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: [String],
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// PRE-SAVE HOOK: Automatically calculate total bill and ensure unique products
cartSchema.pre("save", function (next) {
  // 1. Ensure unique products inside the array
  const productIds = this.items.map((item) => item.product.toString());
  const isDuplicate = productIds.length !== new Set(productIds).size;

  if (isDuplicate) {
    return next(new Error("Duplicate products are not allowed in the cart."));
  }

  // 2. Update Total Bill
  this.bill = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;

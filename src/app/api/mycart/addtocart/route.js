// In your API route
import Cart from "@/Models/cartModel";
import Product from "@/Models/productModel"; // Added import for Product model
import { NextResponse } from "next/server";
export async function POST(req) {
  const { userId, productId, quantity, price, name } = await req.json();

  let cart = await Cart.findOne({ user: userId });
  // Need to import Product to check stock
  const product = await Product.findById(productId);

  if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  try {
    const qty = parseInt(quantity) || 1; 

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (p) => p.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Product exists: Check if adding quantity exceeds stock
        const currentQty = cart.items[itemIndex].quantity || 0;
        if (currentQty + qty > product.stock) {
             return NextResponse.json({ message: `Insufficient stock. Only ${product.stock} available.` }, { status: 400 });
        }
        cart.items[itemIndex].quantity = currentQty + qty;
      } else {
        // New Product: Check if quantity exceeds stock
        if (qty > product.stock) {
            return NextResponse.json({ message: `Insufficient stock. Only ${product.stock} available.` }, { status: 400 });
        }
        cart.items.push({ product: productId, name, price, quantity: qty });
      }
      await cart.save();
    } else {
      // No cart exists, create new one
      // Check if initial quantity exceeds stock
      if (qty > product.stock) {
        return NextResponse.json({ message: `Insufficient stock. Only ${product.stock} available.` }, { status: 400 });
      }
      await Cart.create({
        user: userId,
        items: [{ product: productId, name, price, quantity }],
      });
    }

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

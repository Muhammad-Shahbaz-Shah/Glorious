import Order from "@/Models/orderModel";
import User from "@/Models/userModel";
import Product from "@/Models/productModel";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req) {
const url = new URL(req.url);
const id = url.pathname.split("/").pop();
     
    try {
        await connectDB();
        const order = await Order.findById(id)
        .populate("user", "name email")
        .populate({
            path: "orderItems.product",
            model: Product,
            select: "name image",
        })
        .sort({ createdAt: -1 });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Order fetched successfully",
            success: true,
            order,
        });
    } catch (error) {
        
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    
    try {
        const body = await req.json();
        await connectDB();
        
        const order = await Order.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Order updated successfully",
            success: true,
            order,
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
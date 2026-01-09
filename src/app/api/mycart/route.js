import { connectDB } from "@/lib/db";
import Cart from "@/Models/cartModel";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Product from "@/Models/productModel";


export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (!session) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        
        await connectDB();
        const cart = await Cart.findOne({user: session.user.id}).populate("items.product")
        return NextResponse.json({data:cart}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
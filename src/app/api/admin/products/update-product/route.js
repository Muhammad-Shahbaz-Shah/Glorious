import { connectDB } from "@/lib/db"
import { deleteFile } from "@/lib/supaBaseActions"
import Product from "@/Models/productModel"
import { NextResponse } from "next/server"

export async function POST(req) {
    const body = await req.json()
    try {
        await connectDB()
        if (body.image) {
            const buffer = await Product.findById(body._id)
            if (buffer && buffer.image && buffer.image.length > 0) {
                await deleteFile(buffer.image)
            }
        }
        const product = await Product.findByIdAndUpdate(body._id, body, { new: true })

        return NextResponse.json({
            message: "Product updated successfully",
            product,
        })

        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
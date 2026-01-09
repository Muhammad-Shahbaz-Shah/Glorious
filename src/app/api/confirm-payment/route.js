import { transporter } from "@/lib/emailconfig";
import { storeFile } from "@/lib/supaBaseActions";
import Order from "@/Models/orderModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, screenshot } = await req.json();
    console.log(screenshot)
    if (!orderId || !screenshot) {
      return NextResponse.json(
        { message: "Missing Order ID or Screenshot" },
        { status: 400 }
      );
    }

    // ! 1. Update Order Status and uploading screenshot url

    // Decode base64 image
    const matches = screenshot.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ message: "Invalid image format" }, { status: 400 });
    }
    const type = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    
    // Generate a unique filename using orderId and timestamp (handled in storeFile) or just logical name
    const ext = type.split('/')[1] || 'png';
    const fileName = `payment_${orderId}.${ext}`;

    const url = await storeFile({
        name: fileName,
        body: buffer,
        type: type
    });

    const order = await Order.findByIdAndUpdate(
      orderId,
     {$set: {
        "paymentInfo.status": "verification pending",
        "paymentInfo.screenshot": url,
      }},
      { new: true }
    );
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // ** 2. Send Email with Attachment
    const mailOptions = {
      from: process.env.EMAIL_USER, // Or a fixed sender address
      to: "thegloriousbrand1@gmail.com",
      subject: `Payment Verification - Order #${order._id
        .toString()
        .slice(-6)
        .toUpperCase()}`,
      html: `
        <h2>Payment Verification Request</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
        <p><strong>Customer:</strong> ${order.shippingInfo.address}, ${
        order.shippingInfo.city
      }</p>
        <p>Please check the attached screenshot and verify the payment.</p>
      `,
      attachments: [
        {
          filename: `payment_screenshot_${order._id}.png`,
          content: screenshot.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Payment submitted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

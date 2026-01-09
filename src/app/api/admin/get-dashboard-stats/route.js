import { connectDB } from "@/lib/db";
import Category from "@/Models/categoryModel";
import Order from "@/Models/orderModel";
import Product from "@/Models/productModel";
import User from "@/Models/userModel";

import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDB();

    // 1. Total Users
    const totalUsers = await User.countDocuments();

    // 2. Total Orders (Including Delivered, excluding Cancelled)
    const totalOrders = await Order.countDocuments({
      orderStatus: { $ne: "Cancelled" },
    });

    const catBasedDistribution = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // 3. Total Revenue (From all non-cancelled orders)
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          orderStatus: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const chartData = salesData.map((item) => ({
      date: item._id,
      sales: item.sales,
      orders: item.orders,
    }));

    // 4. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      chartData,
      catBasedDistribution,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      chartData: [],
    });
  }
}

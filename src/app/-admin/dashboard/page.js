"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { Mail, ShoppingCart, Users, DollarSign, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
};
export default function DashboardPage() {
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    chartData: [],
    recentOrders: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [activeChart, setActiveChart] = React.useState("sales");

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetch("/api/admin/get-dashboard-stats");
        const result = await data.json();
        setStats(result);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total = React.useMemo(
    () => ({
      sales: stats.chartData.reduce((acc, curr) => acc + curr.sales, 0),
      orders: stats.chartData.reduce((acc, curr) => acc + curr.orders, 0),
    }),
    [stats.chartData]
  );
  console.log(stats);
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Loading dashboard data…</span>
        </div>
      </div>
    );
  }

  const GREEN_PALETTE = [
    "#064E3B", // emerald-900
    "#065F46",
    "#047857",
    "#059669",
    "#10B981",
    "#34D399",
    "#6EE7B7",
    "#A7F3D0",
    "#D1FAE5",

    "#14532D",
    "#166534",
    "#15803D",
    "#16A34A",
    "#22C55E",
    "#4ADE80",
    "#86EFAC",
    "#BBF7D0",
    "#DCFCE7",

    "#052E16",
    "#022C22",
  ];

  if (
    (!session.user && !isPending) ||
    session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    redirect("/");
  } else if (!session.user.emailVerified) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-semibold text-foreground">
            Email verification required
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You can’t access this page until you verify your email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Card className="h-full">
          <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
              <CardTitle className={" text-lg"}>Sales Over Time</CardTitle>
              <CardDescription>
                Showing total sales and orders for the last 30 days
              </CardDescription>
            </div>
            <div className="flex">
              {["sales", "orders"].map((key) => {
                const chart = key;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-muted-foreground text-xs">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg leading-none font-bold sm:text-3xl">
                      {total[key].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={stats.chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Line
                  dataKey={activeChart}
                  type="monotone"
                  stroke={`var(--color-${activeChart})`}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Orders by product category</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pb-0">
          <ChartContainer config={{}} className="mx-auto h-[320px] w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={stats.catBasedDistribution?.map((item, index) => ({
                  ...item,
                  fill: GREEN_PALETTE[index % GREEN_PALETTE.length],
                }))}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="55%"
                paddingAngle={2}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="text-muted-foreground leading-none text-center">
            Responsive distribution across categories
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 transactions across your store.</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/-admin/orders")}
          >
            View All Orders
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentOrders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No recent orders found.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentOrders?.map((order) => (
                  <TableRow 
                    key={order._id} 
                    className="cursor-pointer"
                    onClick={() => router.push(`/-admin/orders/${order._id}`)}
                  >
                    <TableCell className="font-mono text-[10px] md:text-sm">
                      {order._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.user?.name || "Guest"}</span>
                        <span className="text-xs text-muted-foreground">{order.user?.email || "No email"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          order.orderStatus === "Delivered" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" :
                          order.orderStatus === "Cancelled" ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" :
                          order.orderStatus === "Shipped" ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" :
                          "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                        } border-none`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {order.createdAt ? format(new Date(order.createdAt), "MMM d") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${order.totalPrice?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

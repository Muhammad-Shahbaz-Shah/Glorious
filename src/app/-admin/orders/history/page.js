"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Search, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch ONLY Delivered orders
      const res = await fetch("/api/admin/orders?status=delivered");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!id || !newStatus) return;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Order updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(term) ||
      order.user?.name?.toLowerCase().includes(term) ||
      order.user?.email?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Spinner className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1 flex justify-between items-center w-full">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View completed (delivered) orders.
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/-admin/orders")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Active Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-muted-foreground" size={18} />
            <Input
              placeholder="Search by Order ID, Customer Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className={"px-2"}>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={"px-2"}>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      className={"relative"}
                      onClick={() => router.push(`/-admin/orders/${order._id}`)}
                      key={order._id}
                    >
                      <TableCell className="cursor-pointer font-medium text-xs">
                        {order._id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {order.paymentInfo.status ===
                          "verification pending" ? (
                            <span className="bg-destructive w-2 h-2 text-destructive-foreground  p-1 rounded-full text-sm absolute top-1 left-1"></span>
                          ) : order.paymentInfo.status === "pending" ? (
                            <span className="bg-orange-300 w-2 h-2 text-sm absolute top-1 left-1"></span>
                          ) : (
                            <span className="bg-primary rounded-full w-2 h-2 text-sm absolute top-1 left-1"></span>
                          )}
                          <span className="font-medium">
                            {order.user?.name || "Guest"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.user?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.createdAt
                          ? format(new Date(order.createdAt), "PP")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Select
                          disabled={updatingId === order._id}
                          value={order.orderStatus}
                          onValueChange={(val) =>
                            handleStatusUpdate(order._id, val)
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.totalPrice?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

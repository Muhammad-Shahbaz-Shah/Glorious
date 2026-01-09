"use client";
import OrderCard from "@/components/subComponents/OrderCard";
import SignInRequired from "@/components/subComponents/SignInRequired";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import {
  Package
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const OrdersPage = ({}) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const fetchOrders = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoadingOrders(true);
    try {
      const response = await fetch("/api/orders?userId=" + session.user.id);
      const { data } = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isPending && session) {
      fetchOrders();
    }
  }, [session, isPending, fetchOrders]);


  if (isPending||loadingOrders) {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
        <Spinner className="h-10 w-10 text-primary animate-spin" />

        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Fetching your data…
        </p>
      </div>
    );
  }
  if (!session) {
    return (
     <SignInRequired purpose="orders"/>
    );
  }



  return (
    <div className="min-h-screen bg-background text-foreground p-6 ">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl  font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground">
            Detailed overview of your purchases.
          </p>
        </header>

        <div className="space-y-10">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Package className="h-7 w-7 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium">No orders found</p>

              <p className="max-w-xs text-xs text-muted-foreground">
                Looks like you haven’t placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

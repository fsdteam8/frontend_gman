"use client";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Product {
  _id: string;
  title: string;
  price: number;
  thumbnail: {
    url: string;
  };
}

interface OrderProduct {
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface ApiOrder {
  _id: string;
  products: OrderProduct[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  code: string;
  date: string;
  customer: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiOrder[];
}

interface TransformedOrder {
  id: string;
  customer: string;
  product: string;
  orderId: string;
  totalPrice: number;
  date: string;
  status: string;
  image: string;
  products: OrderProduct[];
}

export default function OrdersList() {
  const session = useSession();
  const token = session?.data?.accessToken;
  const queryClient = useQueryClient();

  const fetchOrders = async (): Promise<TransformedOrder[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch orders");

    const result: ApiResponse = await response.json();

    return result.data.map((order) => ({
      id: order._id,

      customer: order.customer,
      product:
        order.products.length > 1
          ? `${order.products[0].product.title} (+${
              order.products.length - 1
            } more)`
          : order.products[0]?.product.title || "No products",
      orderId: order.code,
      totalPrice: order.totalPrice,
      date: new Date(order.date).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: order.status,
      image: order.products[0]?.product.thumbnail.url || "/placeholder.svg",
      products: order.products,
    }));
  };

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!token,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      alert("Failed to update order status.");
    },
  });

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Please sign in to view your orders.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2 text-muted-foreground">
              Loading orders...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Failed to load orders. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Order</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-xl font-semibold mt-4">Sales History</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={order.image || "/placeholder.svg"}
                    alt={order.product}
                    width={48}
                    height={48}
                    className="rounded-md object-cover h-[60px] w-[100px]"
                  />
                  <div>
                    <div className="font-medium">{order.product}</div>
                    {order.products.length > 1 && (
                      <div className="text-sm text-muted-foreground">
                        {order.products.length} items
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono">{order.orderId}</TableCell>
              <TableCell className="font-semibold">
                ${order.totalPrice}
              </TableCell>
              <TableCell className="text-sm">{order.date}</TableCell>
              <TableCell>
                <select
                  className={`border text-white rounded px-2 py-1 text-sm ${
                    order.status === "shipping"
                      ? "bg-[#013602]"
                      : order.status === "processing"
                      ? "bg-[#707070]"
                      : order.status === "completed"
                      ? "bg-[#027C05]"
                      : "bg-gray-200"
                  }`}
                  value={order.status}
                  onChange={(e) => {
                    updateStatusMutation.mutate({
                      id: order.id,
                      status: e.target.value,
                    });
                  }}
                >
                  <option value="processing">Processing</option>
                  <option value="shipping">Shipping</option>
                  <option value="completed">Completed</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

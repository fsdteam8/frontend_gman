"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PacificPagination from "@/components/ui/PacificPagination";

interface Product {
  _id: string;
  title: string;
  price: number;
  quantity: string;
  code: string;
  createdAt: string;
  thumbnail: {
    url: string;
  };
}

export function ActiveProductsList() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();
  const session = useSession();
  const token = session.data?.accessToken;

  // Fetch products with pagination
  const { data, isLoading } = useQuery({
    queryKey: ["activeProducts", page],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/active-products?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const result = await response.json();
      return result;
    },
    enabled: !!session?.data?.accessToken,
  });

  // Assuming API returns something like:
  // { data: Product[], total: number, totalPage: number }



  const products: Product[] = data?.data || [];

  const totalPages = data?.totalPage || 1;
  const totalItems = data?.total || 0;

    console.log(products)

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeProducts"] });
      setDeleteId(null);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex gap-3">
                    <Image
                      src={product.thumbnail.url || "/placeholder.svg"}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="rounded-md object-cover h-[60px] w-[100px]"
                    />
                    {product.title}
                  </div>
                </TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setDeleteId(product._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 10 && (
          <div className="flex justify-between items-center mt-4 px-4 py-2">
            <div className="text-sm text-muted-foreground">
              Showing {products.length} of {totalItems} products
            </div>
            <PacificPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="cursor-pointer"
            >
              No
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

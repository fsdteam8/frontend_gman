"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Minus, Plus, X, ShoppingBag,  } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface CartItem {
  _id: string
  product: {
    _id: string
    title: string
    price: number
    thumbnail: {
      url: string
    }
    farm?: string
  }
  quantity: number
  price: number
}

interface CartData {
  _id: string
  items: CartItem[]
  total: number
}

interface CartResponse {
  success: boolean
  message: string
  data: CartData
}

// API functions


export function ShoppingCart() {
  const queryClient = useQueryClient()
  const session = useSession()
  const token = session?.data?.accessToken
  

  const fetchCart = async (): Promise<CartResponse> => {
    

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch cart")
  }
  return response.json()
}

const removeFromCart = async (itemId: string): Promise<void> => {
 
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to remove item from cart")
  }
}

const updateCartItem = async ({ productId, quantity }: { productId: string; quantity: number }): Promise<void> => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!response.ok) {
    throw new Error("Failed to update cart item")
  }
}

  // Fetch cart data
  const {
    data: cartResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  })

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Item removed from cart successfully")
     
    },
    onError: () => {
        toast.error("Failed to remove item from cart")
  
    },
  })

  // Update quantity mutation
  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Quantity updated successfully")
     
    },
    onError: () => {
        toast.error("Failed to update quantity")
  
    },
  })

  const handleRemoveItem = (itemId: string) => {
    removeMutation.mutate(itemId)
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateMutation.mutate({ productId, quantity: newQuantity })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading cart. Please try again.</p>
      </div>
    )
  }

  const cart = cartResponse?.data
  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some products to get started!</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {/* Desktop Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 p-6 bg-gray-50 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-1"></div>
                </div>

                {items.map((item) => (
                  <div key={item._id} className="p-6">
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={item.product.thumbnail.url || "/placeholder.svg"}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#272727] truncate">{item.product.title}</h3>
                          {item.product.farm && (
                            <p className="text-sm text-gray-500 mt-1">{item.product.farm}</p>
                          )}
                          <p className="text-lg font-medium text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product._id)}
                          disabled={removeMutation.isPending}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            disabled={updateMutation.isPending || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            disabled={updateMutation.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                     
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center space-x-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={item.product.thumbnail.url || "/placeholder.svg"}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-900 truncate">{item.product.title}</h3>
                          {item.product.farm && (
                            <p className="text-sm text-gray-500 mt-1">Farm ID: {item.product.farm}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={updateMutation.isPending || item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={updateMutation.isPending}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-base font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product._id)}
                          disabled={removeMutation.isPending}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cart?.total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>${cart?.total.toFixed(2)}</span>
              </div>
                <Link href="/checkout" >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Continue Shopping</Button>
                </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

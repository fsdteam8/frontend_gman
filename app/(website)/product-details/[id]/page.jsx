
// "use client"

// import { useState } from "react"
// import { useParams } from "next/navigation"
// import Image from "next/image"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import FutureProduct from "./Future_product"
// import { ChevronLeft, ChevronRight, Star, MapPin, Truck, Shield, Minus, Plus } from "lucide-react"
// import { toast } from "sonner"
// import { useSession } from "next-auth/react"

// async function fetchProduct(id) {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/product/${id}`)
//   if (!response.ok) {
//     throw new Error("Failed to fetch product")
//   }
//   return response.json()
// }

// async function postReview({ review, rating, product, token }) {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/write-review`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify({ review, rating, product }),
//   })
//   if (!response.ok) {
//     throw new Error("Failed to post review")
//   }
//   return response.json()
// }

// async function addToCart({ productId, quantity, token }) {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//     body: JSON.stringify({ productId, quantity }),
//   })
//   if (!response.ok) {
//     throw new Error("Failed to add to cart")
//   }
//   return response.json()
// }

// export default function Page() {
//   const { id } = useParams()
//   const queryClient = useQueryClient()
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [quantity, setQuantity] = useState(1)
//   const [activeTab, setActiveTab] = useState("description")
//   const [showReviewModal, setShowReviewModal] = useState(false)
//   const [reviewRating, setReviewRating] = useState(0)
//   const [reviewDescription, setReviewDescription] = useState("")
//   const { data: session } = useSession()
//   const token = session?.accessToken

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["product", id],
//     queryFn: () => fetchProduct(id),
//     enabled: !!id,
//   })

//   const reviewMutation = useMutation({
//     mutationFn: postReview,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["product", id] })
//       setShowReviewModal(false)
//       setReviewRating(0)
//       setReviewDescription("")
//       toast.success("Review posted successfully")
//     },
//     onError: (error) => {
//       console.error("Error posting review:", error.message)
//       toast.error("Failed to post review")
//     },
//   })

//   const cartMutation = useMutation({
//     mutationFn: addToCart,
//     onSuccess: () => {
//       toast.success("Product added to cart successfully")
//     },
//     onError: (error) => {
//       console.error("Error adding to cart:", error.message)
//       toast.error("Failed to add product to cart")
//     },
//   })

//   const product = data?.data
//   const images = product?.media?.map((item) => item.url) || []

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length)
//   }

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
//   }

//   const updateQuantity = (change) => {
//     setQuantity(Math.max(1, quantity + change))
//   }

//   const handleSaveReview = () => {
//     reviewMutation.mutate({
//       review: reviewDescription,
//       rating: reviewRating,
//       product: id,
//       token,
//     })
//   }

//   const handleAddToCart = () => {
//     cartMutation.mutate({
//       productId: id,
//       quantity,
//       token,
//     })
//   }

//   if (isLoading) return <div>Loading...</div>
//   if (error) return <div>Error: {error.message}</div>
//   if (!product) return <div>No product data available</div>

//   return (
//     <div className="mt-[64px]">
//       <div className="container mx-auto px-4 py-6 lg:py-8 shadow-2xl mb-[100px]">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-8">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             <div className="relative aspect-square h-[353px] w-full rounded-lg overflow-hidden">
//               <Image
//                 src={images[currentImageIndex] || "/placeholder.svg"}
//                 alt={product.title}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
//                 onClick={prevImage}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
//                 onClick={nextImage}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Thumbnails */}
//             <div className="grid grid-cols-4 gap-2">
//               {images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentImageIndex(index)}
//                   className={`rounded-lg overflow-hidden border-2 transition-colors ${
//                     currentImageIndex === index ? "border-green-500" : "border-gray-200"
//                   }`}
//                 >
//                   <Image
//                     src={image || "/placeholder.svg"}
//                     alt={`Thumbnail ${index + 1}`}
//                     width={1000}
//                     height={1000}
//                     className="object-cover w-full h-[116px]"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-[#272727] mb-4">
//                 {product.title}
//               </h1>
//               <p className="text-base text-[#323232] font-normal underline mb-2">{product.farm.name}</p>

//               <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <div className="flex items-center gap-1 text-sm text-[#707070]">
//                   <MapPin className="h-4 w-4" />
//                   <span>{product.farm.location.street} • 2.5 kilometers away</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-[#FFD700] text-[#FACC15]" />
//                   <span className="text-sm font-medium">{product.review.length > 0 ? product.review[0]?.rating : "No reviews"}</span>
//                   <span className="text-sm text-[#707070]">({product.review.length})</span>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <div className="text-xl font-semibold text-[#111827] mt-6 mb-1">${product.price} per box</div>
//                 <Badge variant="secondary" className="bg-green-100 text-green-800">
//                   {product.status === "active" ? "In stock" : "Out of stock"}
//                 </Badge>
//               </div>
//             </div>

//             {/* Quantity and Purchase */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-x-7">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">QTY</label>
//                   <div className="flex items-center border-[1px] border-[#595959] rounded-md">
//                     <Button variant="ghost" size="sm" onClick={() => updateQuantity(-1)} className="h-10 w-10 p-0">
//                       <Minus className="h-4 w-4" />
//                     </Button>
//                     <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
//                     <Button variant="ghost" size="sm" onClick={() => updateQuantity(1)} className="h-10 w-10 p-0">
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="">
//                   <div className="text-base text-[#707070] font-medium mb-1">Total</div>
//                   <div className="text-xl text-[#111827] font-normal">${(product.price * quantity).toFixed(2)}</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//                 <Button className="bg-[#039B06] w-[377px] h-[44px] hover:bg-[#039B06]/80 text-white rounded-[4px] ">
//                   Purchase
//                 </Button>
//                 <Button 
//                   className="h-[44px] w-[175px] rounded-[4px] bg-transparent border border-[#00000033] text-[#039B06] hover:bg-transparent"
//                   onClick={handleAddToCart}
//                   disabled={cartMutation.isPending}
//                 >
//                   {cartMutation.isPending ? "Adding..." : "Add to Cart"}
//                 </Button>
//               </div>
//             </div>

//             {/* Features */}
//             <div className="space-y-3 pt-4 border-t">
//               <div className="flex items-center gap-2 text-sm text-[#595959] font-normal">
//                 <Truck className="h-4 w-4" />
//                 <span>Free shipping on orders over $50</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-[#595959] font-normal">
//                 <Shield className="h-4 w-4" />
//                 <span>Satisfaction guaranteed or your money back</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Custom Tab Implementation */}
//         <Card className="shadow-none border-none">
//           <CardContent className="p-0">
//             <div className="w-full">
//               {/* Custom Tab Headers */}
//               <div className="flex border-b">
//                 <button
//                   onClick={() => setActiveTab("description")}
//                   className={`px-6 py-3 text-base font-medium ${
//                     activeTab === "description" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
//                   }`}
//                 >
//                   Description
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("details")}
//                   className={`px-6 py-3 text-base font-medium ${
//                     activeTab === "details" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
//                   }`}
//                 >
//                   Product Details
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("reviews")}
//                   className={`px-6 py-3 text-base font-medium ${
//                     activeTab === "reviews" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
//                   }`}
//                 >
//                   Reviews
//                 </button>
//               </div>

//               {/* Tab Content */}
//               {activeTab === "description" && (
//                 <div className="p-6">
//                   <p className="text-gray-700 leading-relaxed">
//                     {product.description}
//                   </p>
//                 </div>
//               )}

//               {activeTab === "details" && (
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div>
//                       <h3 className="font-semibold text-gray-900 mb-4">Product Specifications</h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Origin:</span>
//                           <span className="font-medium">{product.farm.location.street}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Organic Certified:</span>
//                           <span className="font-medium">{product.farm.isOrganic ? "Yes" : "No"}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Quantity:</span>
//                           <span className="font-medium">{product.quantity} units</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Delivery Date:</span>
//                           <span className="font-medium">
//                             {new Date(product.createdAt).toLocaleDateString("en-US", {
//                               month: "2-digit",
//                               day: "2-digit",
//                               year: "numeric",
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="font-semibold text-gray-900 mb-4">Farm Practices</h3>
//                       <p className="text-gray-700">Sustainable farming, No synthetic pesticides, Drip irrigation</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "reviews" && (
//                 <div className="p-6 border-b">
//                   <div className="space-y-6">
//                     <div className="">
//                       <Dialog className="!bg-black" open={showReviewModal} onOpenChange={setShowReviewModal}>
//                         <DialogTrigger asChild>
//                           <Button
//                             size="sm"
//                             className="bg-[#039B06] h-[44px] rounded-[4px] text-white hover:bg-[#039B06]/80 mt-[30px]"
//                           >
//                             Write a Review
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-md">
//                           <DialogHeader>
//                             <DialogTitle>Write Your Review</DialogTitle>
//                           </DialogHeader>
//                           <div className="space-y-6">
//                             {/* Star Rating */}
//                             <div>
//                               <Label className="text-sm font-medium text-gray-700 mb-3">Rate Us</Label>
//                               <div className="flex gap-1 mt-2">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                   <button
//                                     key={star}
//                                     onClick={() => setReviewRating(star)}
//                                     className="focus:outline-none"
//                                   >
//                                     <Star
//                                       className={`h-6 w-6 transition-colors ${
//                                         star <= reviewRating ? "fill-[#FACC15] text-[#FACC15]" : "text-gray-300"
//                                       }`}
//                                     />
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                               <Label htmlFor="review-description" className="text-sm font-medium text-gray-700 mb-3">
//                                 Description
//                               </Label>
//                               <Textarea
//                                 id="review-description"
//                                 value={reviewDescription}
//                                 onChange={(e) => setReviewDescription(e.target.value)}
//                                 placeholder="Write your review here..."
//                                 rows={4}
//                                 className="mt-2 resize-none"
//                               />
//                             </div>

//                             {/* Save Button */}
//                             <Button
//                               onClick={handleSaveReview}
//                               className="w-full bg-[#039B06] hover:bg-[#039B06]/80 text-white h-[44px] rounded-[4px]"
//                               disabled={reviewMutation.isPending}
//                             >
//                               {reviewMutation.isPending ? "Submitting..." : "Save"}
//                             </Button>
//                           </div>
//                         </DialogContent>
//                       </Dialog>
//                     </div>

//                     <div className="">
//                       {product.review.length === 0 ? (
//                         <p className="text-gray-700">No reviews yet. Be the first to write a review!</p>
//                       ) : (
//                         product.review.map((review, index) => (
//                           <div key={index} className="mb-6">
//                             <div className="flex items-center gap-4">
//                               <Avatar className="h-[50px] w-[50px]">
//                                 <AvatarImage src="/placeholder.svg?height=50&width=50" />
//                                 <AvatarFallback>US</AvatarFallback>
//                               </Avatar>
//                               <div className="flex-1">
//                                 <div className="gap-2 mb-2">
//                                   <span className="font-medium text-[18px] text-[#595959]">User {review.user?.slice(-4) || "Anon"}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                   {[...Array(5)].map((_, i) => (
//                                     <Star
//                                       key={i}
//                                       className={`h-4 w-4 ${
//                                         i < Math.round(review.rating)
//                                           ? "fill-[#FACC15] text-[#FACC15]"
//                                           : "text-gray-300"
//                                       }`}
//                                     />
//                                   ))}
//                                   <span className="text-sm text-gray-500 ml-3">
//                                     {new Date(product.updatedAt).toLocaleDateString("en-US", {
//                                       month: "short",
//                                       day: "numeric",
//                                       year: "numeric",
//                                     })}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <p className="text-[#272727] text-base font-normal leading-[150%] mt-6">
//                               {review.text}
//                             </p>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <FutureProduct />
//     </div>
//   )
// }


// // "use client"

// // import { useState } from "react"
// // import { useParams, useRouter } from "next/navigation"
// // import Image from "next/image"
// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Label } from "@/components/ui/label"
// // import FutureProduct from "./Future_product"
// // import { ChevronLeft, ChevronRight, Star, MapPin, Truck, Shield, Minus, Plus } from "lucide-react"
// // import { toast } from "sonner"
// // import { useSession } from "next-auth/react"

// // async function fetchProduct(id) {
// //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/product/${id}`)
// //   if (!response.ok) {
// //     throw new Error("Failed to fetch product")
// //   }
// //   return response.json()
// // }

// // async function postReview({ review, rating, product, token }) {
// //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/write-review`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${token}`,
// //     },
// //     body: JSON.stringify({ review, rating, product }),
// //   })
// //   if (!response.ok) {
// //     throw new Error("Failed to post review")
// //   }
// //   return response.json()
// // }

// // async function addToCart({ productId, quantity, token }) {
// //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${token}`,
// //     },
// //     body: JSON.stringify({ productId, quantity }),
// //   })
// //   if (!response.ok) {
// //     throw new Error("Failed to add to cart")
// //   }
// //   return response.json()
// // }

// // export default function Page() {
// //   const { id } = useParams()
// //   const router = useRouter()
// //   const queryClient = useQueryClient()
// //   const [currentImageIndex, setCurrentImageIndex] = useState(0)
// //   const [quantity, setQuantity] = useState(1)
// //   const [activeTab, setActiveTab] = useState("description")
// //   const [showReviewModal, setShowReviewModal] = useState(false)
// //   const [reviewRating, setReviewRating] = useState(0)
// //   const [reviewDescription, setReviewDescription] = useState("")
// //   const { data: session } = useSession()
// //   const token = session?.accessToken

// //   const { data, isLoading, error } = useQuery({
// //     queryKey: ["product", id],
// //     queryFn: () => fetchProduct(id),
// //     enabled: !!id,
// //   })

// //   const reviewMutation = useMutation({
// //     mutationFn: postReview,
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["product", id] })
// //       setShowReviewModal(false)
// //       setReviewRating(0)
// //       setReviewDescription("")
// //       toast.success("Review posted successfully")
// //     },
// //     onError: (error) => {
// //       console.error("Error posting review:", error.message)
// //       toast.error("Failed to post review")
// //     },
// //   })

// //   const cartMutation = useMutation({
// //     mutationFn: addToCart,
// //     onSuccess: () => {
// //       toast.success("Product added to cart successfully")
// //     },
// //     onError: (error) => {
// //       console.error("Error adding to cart:", error.message)
// //       toast.error("Failed to add product to cart")
// //     },
// //   })

// //   const product = data?.data
// //   const images = product?.media?.map((item) => item.url) || []

// //   const nextImage = () => {
// //     setCurrentImageIndex((prev) => (prev + 1) % images.length)
// //   }

// //   const prevImage = () => {
// //     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
// //   }

// //   const updateQuantity = (change) => {
// //     setQuantity(Math.max(1, quantity + change))
// //   }

// //   const handleSaveReview = () => {
// //     reviewMutation.mutate({
// //       review: reviewDescription,
// //       rating: reviewRating,
// //       product: id,
// //       token,
// //     })
// //   }

// //   const handleAddToCart = () => {
// //     cartMutation.mutate({
// //       productId: id,
// //       quantity,
// //       token,
// //     })
// //   }

// //   if (isLoading) return <div>Loading...</div>
// //   if (error) return <div>Error: {error.message}</div>
// //   if (!product) return <div>No product data available</div>

// //   return (
// //     <div className="mt-[64px]">
// //       <div className="container mx-auto px-4 py-6 lg:py-8 shadow-2xl mb-[100px]">
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-8">
// //           {/* Image Gallery */}
// //           <div className="space-y-4">
// //             <div className="relative aspect-square h-[353px] w-full rounded-lg overflow-hidden">
// //               <Image
// //                 src={images[currentImageIndex] || "/placeholder.svg"}
// //                 alt={product.title}
// //                 fill
// //                 className="object-cover"
// //                 priority
// //               />
// //               <Button
// //                 variant="outline"
// //                 size="icon"
// //                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
// //                 onClick={prevImage}
// //               >
// //                 <ChevronLeft className="h-4 w-4" />
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 size="icon"
// //                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
// //                 onClick={nextImage}
// //               >
// //                 <ChevronRight className="h-4 w-4" />
// //               </Button>
// //             </div>

// //             {/* Thumbnails */}
// //             <div className="grid grid-cols-4 gap-2">
// //               {images.map((image, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => setCurrentImageIndex(index)}
// //                   className={`rounded-lg overflow-hidden border-2 transition-colors ${
// //                     currentImageIndex === index ? "border-green-500" : "border-gray-200"
// //                   }`}
// //                 >
// //                   <Image
// //                     src={image || "/placeholder.svg"}
// //                     alt={`Thumbnail ${index + 1}`}
// //                     width={1000}
// //                     height={1000}
// //                     className="object-cover w-full h-[116px]"
// //                   />
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Product Details */}
// //           <div className="space-y-6">
// //             <div>
// //               <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-[#272727] mb-4">{product.title}</h1>
// //               <p className="text-base text-[#323232] font-normal underline mb-2">{product.farm.name}</p>

// //               <div className="flex flex-wrap items-center gap-4 mb-4">
// //                 <div className="flex items-center gap-1 text-sm text-[#707070]">
// //                   <MapPin className="h-4 w-4" />
// //                   <span>{product.farm.location.street} • 2.5 kilometers away</span>
// //                 </div>
// //                 <div className="flex items-center gap-1">
// //                   <Star className="h-4 w-4 fill-[#FFD700] text-[#FACC15]" />
// //                   <span className="text-sm font-medium">
// //                     {product.review.length > 0 ? product.review[0]?.rating : "No reviews"}
// //                   </span>
// //                   <span className="text-sm text-[#707070]">({product.review.length})</span>
// //                 </div>
// //               </div>

// //               <div className="mb-6">
// //                 <div className="text-xl font-semibold text-[#111827] mt-6 mb-1">${product.price} per box</div>
// //                 <Badge variant="secondary" className="bg-green-100 text-green-800">
// //                   {product.status === "active" ? "In stock" : "Out of stock"}
// //                 </Badge>
// //               </div>
// //             </div>

// //             {/* Quantity and Purchase */}
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-x-7">
// //                 <div>
// //                   <label className="text-sm font-medium text-gray-700 mb-2 block">QTY</label>
// //                   <div className="flex items-center border-[1px] border-[#595959] rounded-md">
// //                     <Button variant="ghost" size="sm" onClick={() => updateQuantity(-1)} className="h-10 w-10 p-0">
// //                       <Minus className="h-4 w-4" />
// //                     </Button>
// //                     <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
// //                     <Button variant="ghost" size="sm" onClick={() => updateQuantity(1)} className="h-10 w-10 p-0">
// //                       <Plus className="h-4 w-4" />
// //                     </Button>
// //                   </div>
// //                 </div>
// //                 <div className="">
// //                   <div className="text-base text-[#707070] font-medium mb-1">Total</div>
// //                   <div className="text-xl text-[#111827] font-normal">${(product.price * quantity).toFixed(2)}</div>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
// //                 <Button
// //                   className="bg-[#039B06] w-[377px] h-[44px] hover:bg-[#039B06]/80 text-white rounded-[4px]"
// //                   onClick={() => router.push(`/checkout?productId=${id}`)}
// //                 >
// //                   Purchase
// //                 </Button>
// //                 <Button
// //                   className="h-[44px] w-[175px] rounded-[4px] bg-transparent border border-[#00000033] text-[#039B06] hover:bg-transparent"
// //                   onClick={handleAddToCart}
// //                   disabled={cartMutation.isPending}
// //                 >
// //                   {cartMutation.isPending ? "Adding..." : "Add to Cart"}
// //                 </Button>
// //               </div>
// //             </div>

// //             {/* Features */}
// //             <div className="space-y-3 pt-4 border-t">
// //               <div className="flex items-center gap-2 text-sm text-[#595959] font-normal">
// //                 <Truck className="h-4 w-4" />
// //                 <span>Free shipping on orders over $50</span>
// //               </div>
// //               <div className="flex items-center gap-2 text-sm text-[#595959] font-normal">
// //                 <Shield className="h-4 w-4" />
// //                 <span>Satisfaction guaranteed or your money back</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Custom Tab Implementation */}
// //         <Card className="shadow-none border-none">
// //           <CardContent className="p-0">
// //             <div className="w-full">
// //               {/* Custom Tab Headers */}
// //               <div className="flex border-b">
// //                 <button
// //                   onClick={() => setActiveTab("description")}
// //                   className={`px-6 py-3 text-base font-medium ${
// //                     activeTab === "description" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
// //                   }`}
// //                 >
// //                   Description
// //                 </button>
// //                 <button
// //                   onClick={() => setActiveTab("details")}
// //                   className={`px-6 py-3 text-base font-medium ${
// //                     activeTab === "details" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
// //                   }`}
// //                 >
// //                   Product Details
// //                 </button>
// //                 <button
// //                   onClick={() => setActiveTab("reviews")}
// //                   className={`px-6 py-3 text-base font-medium ${
// //                     activeTab === "reviews" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
// //                   }`}
// //                 >
// //                   Reviews
// //                 </button>
// //               </div>

// //               {/* Tab Content */}
// //               {activeTab === "description" && (
// //                 <div className="p-6">
// //                   <p className="text-gray-700 leading-relaxed">{product.description}</p>
// //                 </div>
// //               )}

// //               {activeTab === "details" && (
// //                 <div className="p-6">
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //                     <div>
// //                       <h3 className="font-semibold text-gray-900 mb-4">Product Specifications</h3>
// //                       <div className="space-y-3">
// //                         <div className="flex justify-between">
// //                           <span className="text-gray-600">Origin:</span>
// //                           <span className="font-medium">{product.farm.location.street}</span>
// //                         </div>
// //                         <div className="flex justify-between">
// //                           <span className="text-gray-600">Organic Certified:</span>
// //                           <span className="font-medium">{product.farm.isOrganic ? "Yes" : "No"}</span>
// //                         </div>
// //                         <div className="flex justify-between">
// //                           <span className="text-gray-600">Quantity:</span>
// //                           <span className="font-medium">{product.quantity} units</span>
// //                         </div>
// //                         <div className="flex justify-between">
// //                           <span className="text-gray-600">Delivery Date:</span>
// //                           <span className="font-medium">
// //                             {new Date(product.createdAt).toLocaleDateString("en-US", {
// //                               month: "2-digit",
// //                               day: "2-digit",
// //                               year: "numeric",
// //                             })}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div>
// //                       <h3 className="font-semibold text-gray-900 mb-4">Farm Practices</h3>
// //                       <p className="text-gray-700">Sustainable farming, No synthetic pesticides, Drip irrigation</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {activeTab === "reviews" && (
// //                 <div className="p-6 border-b">
// //                   <div className="space-y-6">
// //                     <div className="">
// //                       <Dialog className="!bg-black" open={showReviewModal} onOpenChange={setShowReviewModal}>
// //                         <DialogTrigger asChild>
// //                           <Button
// //                             size="sm"
// //                             className="bg-[#039B06] h-[44px] rounded-[4px] text-white hover:bg-[#039B06]/80 mt-[30px]"
// //                           >
// //                             Write a Review
// //                           </Button>
// //                         </DialogTrigger>
// //                         <DialogContent className="sm:max-w-md">
// //                           <DialogHeader>
// //                             <DialogTitle>Write Your Review</DialogTitle>
// //                           </DialogHeader>
// //                           <div className="space-y-6">
// //                             {/* Star Rating */}
// //                             <div>
// //                               <Label className="text-sm font-medium text-gray-700 mb-3">Rate Us</Label>
// //                               <div className="flex gap-1 mt-2">
// //                                 {[1, 2, 3, 4, 5].map((star) => (
// //                                   <button
// //                                     key={star}
// //                                     onClick={() => setReviewRating(star)}
// //                                     className="focus:outline-none"
// //                                   >
// //                                     <Star
// //                                       className={`h-6 w-6 transition-colors ${
// //                                         star <= reviewRating ? "fill-[#FACC15] text-[#FACC15]" : "text-gray-300"
// //                                       }`}
// //                                     />
// //                                   </button>
// //                                 ))}
// //                               </div>
// //                             </div>

// //                             {/* Description */}
// //                             <div>
// //                               <Label htmlFor="review-description" className="text-sm font-medium text-gray-700 mb-3">
// //                                 Description
// //                               </Label>
// //                               <Textarea
// //                                 id="review-description"
// //                                 value={reviewDescription}
// //                                 onChange={(e) => setReviewDescription(e.target.value)}
// //                                 placeholder="Write your review here..."
// //                                 rows={4}
// //                                 className="mt-2 resize-none"
// //                               />
// //                             </div>

// //                             {/* Save Button */}
// //                             <Button
// //                               onClick={handleSaveReview}
// //                               className="w-full bg-[#039B06] hover:bg-[#039B06]/80 text-white h-[44px] rounded-[4px]"
// //                               disabled={reviewMutation.isPending}
// //                             >
// //                               {reviewMutation.isPending ? "Submitting..." : "Save"}
// //                             </Button>
// //                           </div>
// //                         </DialogContent>
// //                       </Dialog>
// //                     </div>

// //                     <div className="">
// //                       {product.review.length === 0 ? (
// //                         <p className="text-gray-700">No reviews yet. Be the first to write a review!</p>
// //                       ) : (
// //                         product.review.map((review, index) => (
// //                           <div key={index} className="mb-6">
// //                             <div className="flex items-center gap-4">
// //                               <Avatar className="h-[50px] w-[50px]">
// //                                 <AvatarImage src="/placeholder.svg?height=50&width=50" />
// //                                 <AvatarFallback>US</AvatarFallback>
// //                               </Avatar>
// //                               <div className="flex-1">
// //                                 <div className="gap-2 mb-2">
// //                                   <span className="font-medium text-[18px] text-[#595959]">
// //                                     User {review.user?.slice(-4) || "Anon"}
// //                                   </span>
// //                                 </div>
// //                                 <div className="flex items-center gap-1">
// //                                   {[...Array(5)].map((_, i) => (
// //                                     <Star
// //                                       key={i}
// //                                       className={`h-4 w-4 ${
// //                                         i < Math.round(review.rating)
// //                                           ? "fill-[#FACC15] text-[#FACC15]"
// //                                           : "text-gray-300"
// //                                       }`}
// //                                     />
// //                                   ))}
// //                                   <span className="text-sm text-gray-500 ml-3">
// //                                     {new Date(product.updatedAt).toLocaleDateString("en-US", {
// //                                       month: "short",
// //                                       day: "numeric",
// //                                       year: "numeric",
// //                                     })}
// //                                   </span>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                             <p className="text-[#272727] text-base font-normal leading-[150%] mt-6">{review.text}</p>
// //                           </div>
// //                         ))
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <FutureProduct />
// //     </div>
// //   )
// // }


"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import FutureProduct from "./Future_product"
import { ChevronLeft, ChevronRight, Star, MapPin, Truck, Shield, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

async function fetchProduct(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/product/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }
  return response.json()
}

async function postReview({ review, rating, product, token }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/write-review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ review, rating, product }),
  })
  if (!response.ok) {
    throw new Error("Failed to post review")
  }
  return response.json()
}

async function addToCart({ productId, quantity, token }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!response.ok) {
    throw new Error("Failed to add to cart")
  }
  return response.json()
}

export default function Page() {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewDescription, setReviewDescription] = useState("")
  const { data: session } = useSession()
  const token = session?.accessToken

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })

  const reviewMutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] })
      setShowReviewModal(false)
      setReviewRating(0)
      setReviewDescription("")
      toast.success("Review posted successfully")
    },
    onError: (error) => {
      console.error("Error posting review:", error.message)
      toast.error("Failed to post review")
    },
  })

  const cartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Product added to cart successfully")
    },
    onError: (error) => {
      console.error("Error adding to cart:", error.message)
      toast.error("Failed to add product to cart")
    },
  })

  const product = data?.data
  const images = product?.media?.map((item) => item.url) || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const updateQuantity = (change) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleSaveReview = () => {
    reviewMutation.mutate({
      review: reviewDescription,
      rating: reviewRating,
      product: id,
      token,
    })
  }

  const handleAddToCart = () => {
    cartMutation.mutate({
      productId: id,
      quantity,
      token,
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!product) return <div>No product data available</div>

  return (
    <div className="mt-[64px]">
      <div className="container mx-auto px-4 py-6 lg:py-8 shadow-2xl mb-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square h-[353px] w-full rounded-lg overflow-hidden">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-[116px]"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-[#272727] mb-4">
                {product.title}
              </h1>
              <p className="text-base text-[#323232] font-normal underline mb-2">{product.farm.name}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-[#707070]">
                  <MapPin className="h-4 w-4" />
                  <span>{product.farm.location.street} • 2.5 kilometers away</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FFD700] text-[#FACC15]" />
                  <span className="text-sm font-medium">{product.review.length > 0 ? product.review[0]?.rating : "No reviews"}</span>
                  <span className="text-sm text-[#707070]">({product.review.length})</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xl font-semibold text-[#111827] mt-6 mb-1">${product.price} per box</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {product.status === "active" ? "In stock" : "Out of stock"}
                </Badge>
              </div>
            </div>

            {/* Quantity and Purchase */}
            <div className="space-y-4">
              <div className="flex items-center gap-x-7">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">QTY</label>
                  <div className="flex items-center border-[1px] border-[#595959] rounded-md">
                    <Button variant="ghost" size="sm" onClick={() => updateQuantity(-1)} className="h-10 w-10 p-0">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => updateQuantity(1)} className="h-10 w-10 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="">
                  <div className="text-base text-[#707070] font-medium mb-1">Total</div>
                  <div className="text-xl text-[#111827] font-normal">${(product.price * quantity).toFixed(2)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <Button
                  className="bg-[#039B06] w-[377px] h-[44px] hover:bg-[#039B06]/80 text-white rounded-[4px]"
                  onClick={() => router.push(`/checkout?productId=${id}&quantity=${quantity}`)}
                >
                  Purchase
                </Button>
                <Button 
                  className="h-[44px] w-[175px] rounded-[4px] bg-transparent border border-[#00000033] text-[#039B06] hover:bg-transparent"
                  onClick={handleAddToCart}
                  disabled={cartMutation.isPending}
                >
                  {cartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-[#595959] font-normal">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#595959] font-normal">
                <Shield className="h-4 w-4" />
                <span>Satisfaction guaranteed or your money back</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Tab Implementation */}
        <Card className="shadow-none border-none">
          <CardContent className="p-0">
            <div className="w-full">
              {/* Custom Tab Headers */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-3 text-base font-medium ${
                    activeTab === "description" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-6 py-3 text-base font-medium ${
                    activeTab === "details" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3 text-base font-medium ${
                    activeTab === "reviews" ? "text-[#039B06] border-b-2 border-[#039B06]" : "text-gray-600"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "description" && (
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Product Specifications</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Origin:</span>
                          <span className="font-medium">{product.farm.location.street}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organic Certified:</span>
                          <span className="font-medium">{product.farm.isOrganic ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{product.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Date:</span>
                          <span className="font-medium">
                            {new Date(product.createdAt).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Farm Practices</h3>
                      <p className="text-gray-700">Sustainable farming, No synthetic pesticides, Drip irrigation</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="p-6 border-b">
                  <div className="space-y-6">
                    <div className="">
                      <Dialog className="!bg-black" open={showReviewModal} onOpenChange={setShowReviewModal}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-[#039B06] h-[44px] rounded-[4px] text-white hover:bg-[#039B06]/80 mt-[30px]"
                          >
                            Write a Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Write Your Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Star Rating */}
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-3">Rate Us</Label>
                              <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-6 w-6 transition-colors ${
                                        star <= reviewRating ? "fill-[#FACC15] text-[#FACC15]" : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <Label htmlFor="review-description" className="text-sm font-medium text-gray-700 mb-3">
                                Description
                              </Label>
                              <Textarea
                                id="review-description"
                                value={reviewDescription}
                                onChange={(e) => setReviewDescription(e.target.value)}
                                placeholder="Write your review here..."
                                rows={4}
                                className="mt-2 resize-none"
                              />
                            </div>

                            {/* Save Button */}
                            <Button
                              onClick={handleSaveReview}
                              className="w-full bg-[#039B06] hover:bg-[#039B06]/80 text-white h-[44px] rounded-[4px]"
                              disabled={reviewMutation.isPending}
                            >
                              {reviewMutation.isPending ? "Submitting..." : "Save"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="">
                      {product.review.length === 0 ? (
                        <p className="text-gray-700">No reviews yet. Be the first to write a review!</p>
                      ) : (
                        product.review.map((review, index) => (
                          <div key={index} className="mb-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-[50px] w-[50px]">
                                <AvatarImage src="/placeholder.svg?height=50&width=50" />
                                <AvatarFallback>US</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="gap-2 mb-2">
                                  <span className="font-medium text-[18px] text-[#595959]">User {review.user?.slice(-4) || "Anon"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.round(review.rating)
                                          ? "fill-[#FACC15] text-[#FACC15]"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-500 ml-3">
                                    {new Date(product.updatedAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-[#272727] text-base font-normal leading-[150%] mt-6">
                              {review.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <FutureProduct />
    </div>
  )
}
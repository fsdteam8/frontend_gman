// "use client";

// import Image from "next/image";
// import { Heart, MapPin, Star, MessageCircle, Clock6 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import PageHeader from "@/components/sheard/PageHeader";
// import { useState } from "react";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";

// interface Product {
//   _id: string;
//   title: string;
//   thumbnail?: { url: string };
//   price: number;
//   quantity: string;
//   review: { rating: number; user: string; text: string; _id: string }[];
//   status: string;
// }

// interface Farm {
//   _id: string;
//   name: string;
//   isOrganic: boolean;
//   description: string;
//   images?: { url: string; public_id: string; _id: string }[];
//   location: {
//     city: string;
//     state: string;
//   };
//   rating: number;
// }

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// // interface StartChatButtonProps {
// //   farmId: string;
// //   farmName?: string;
// // }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: {
//     farm: Farm;
//     product: Product[];
//   };
// }

// export default function FarmPage() {
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const params = useParams();
//   const farmId = params.id as string;
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const token = session?.accessToken;

//   console.log(token, "token");

//   const toggleFavorite = (productId: string) => {
//     setFavorites((prev) =>
//       prev.includes(productId)
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const { data, isLoading, error } = useQuery<ApiResponse>({
//     queryKey: ["farm", farmId],
//     queryFn: async () => {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/farm/${farmId}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch farm data");
//       }
//       return response.json();
//     },
//   });

//   const handleStartChat = async () => {
//     if (!token) {
//       toast.error("Please login to start a chat");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${BASE_URL}/chat/create-chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           farmId,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Redirect to the chat page with the chat ID
//         router.push(`/messages/${data.data._id}`);
//         toast.success("Chat created successfully");
//       } else {
//         throw new Error(data.message || "Failed to create chat");
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       toast("Failed to start chat. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 ">
//         <div className="animate-pulse">
//           {/* Skeleton for Page Header */}
//           <div className="h-48 sm:h-64 bg-gray-200 rounded-lg mb-8"></div>
//           {/* Skeleton for Farm Header */}
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
//             <div className="flex items-start gap-4 flex-1">
//               <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[80px] lg:h-[80px] rounded-full bg-gray-200"></div>
//               <div className="flex-1 space-y-3">
//                 <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//               </div>
//             </div>
//           </div>
//           {/* Skeleton for Products */}
//           <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 gap-y-10">
//             {Array(6)
//               .fill(0)
//               .map((_, index) => (
//                 <div key={index} className="space-y-3">
//                   <div className="aspect-square bg-gray-200 rounded-lg"></div>
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !data?.success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Error loading farm data
//       </div>
//     );
//   }

//   const farm = data.data.farm;
//   const products = data.data.product;

//   // Calculate average rating for the farm based on product reviews
//   const averageRating =
//     products.length > 0
//       ? products.reduce((acc, product) => {
//           const productAvg =
//             product.review.length > 0
//               ? product.review.reduce((sum, review) => sum + review.rating, 0) /
//                 product.review.length
//               : 0;
//           return acc + productAvg;
//         }, 0) / products.length
//       : 0;

//   const totalReviews = products.reduce(
//     (acc, product) => acc + product.review.length,
//     0
//   );

//   return (
//     <div className="min-h-screen">
//       {/* Page Header */}
//       <PageHeader
//         imge={
//           farm.images && farm.images.length > 0
//             ? farm.images[0].url
//             : "/asset/framheader.jpg"
//         }
//         titile={farm.name}
//         subtitle={farm.description}
//       />

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-[100px]">
//         {/* Farm Header */}
//         <div className="mb-8 sm:mb-10 lg:mb-12">
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//             {/* Profile Image and Basic Info */}
            
//             <div className="flex items-start gap-4 flex-1">
//               <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[80px] lg:h-[80px] rounded-full overflow-hidden flex-shrink-0">
//                 <Image
//                   src={
//                     farm.images && farm.images.length > 0
//                       ? farm.images[0].url
//                       : "/asset/profile1.png"
//                   }
//                   alt={`${farm.name} profile`}
//                   width={80}
//                   height={80}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h1 className="text-lg sm:text-xl lg:text-[18px] font-semibold text-[#272727] mb-2">
//                   {farm.name}
//                 </h1>
//                 {farm.isOrganic && (
//                   <div className="flex items-center gap-2 mb-2">
//                     <Clock6 className="w-3 h-3 sm:w-4 sm:h-4 text-[#039B06] flex-shrink-0" />
//                     <span className="text-xs sm:text-sm text-[#039B06] font-normal">
//                       This farm produces organic products
//                     </span>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-1 text-gray-600">
//                   <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#039B06] flex-shrink-0" />
//                   <span className="text-sm sm:text-base font-normal text-[#595959]">
//                     {farm.location.city}, {farm.location.state}
//                   </span>
//                 </div>
//               </div>
//             </div> 
//             <div className="w-[800px] border border-red-400 h-full ">
//               map here 
//             </div>
//           </div>

//           {/* Description and Rating */}
//           <div className="mt-4 sm:mt-6">
//             <p className="text-base sm:text-lg lg:text-base text-[#4B5563] font-normal mb-3 sm:mb-4">
//               {farm.description}
//             </p>
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1">
//                   <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
//                   <span className="font-semibold text-[#000000]">
//                     {averageRating.toFixed(1)}
//                   </span>
//                   <span className="text-sm text-[#272727]">
//                     ({totalReviews})
//                   </span>
//                 </div>
//               </div>
//               <Button
//                 onClick={handleStartChat}
//                 disabled={loading}
//                 className="bg-[#039B06] hover:bg-[#039B06]/80 text-white rounded-[4px] w-full sm:w-auto cursor-pointer text-sm sm:text-base px-4 py-2"
//               >
//                 <MessageCircle className="w-4 h-4 mr-2" />
//                 {loading ? "Starting Message..." : "Message Farmer"}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Products Section */}
//         <div className="pb-8 sm:pb-12 lg:pb-16">
//           <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-[#272727] mb-6 sm:mb-8 lg:mb-10">
//             Farms Products
//           </h2>

//           {products.length === 0 ? (
//             <div className="text-center text-lg text-[#4B5563] font-medium">
//               No products in this farm
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 gap-y-10">
//               {products.map((product) => (
//                 <Link
//                   key={product._id}
//                   href={`/product-details/${product._id}`}
//                 >
//                   <div className="group cursor-pointer relative overflow-hidden">
//                     <div className="relative">
//                       <div className="aspect-square overflow-hidden rounded-lg">
//                         <Image
//                           src={product.thumbnail?.url || "/placeholder.svg"}
//                           alt={product.title}
//                           width={200}
//                           height={200}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           toggleFavorite(product._id);
//                         }}
//                         className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-colors ${
//                           favorites.includes(product._id)
//                             ? "bg-black border-2 border-white"
//                             : "bg-white/80 hover:bg-white"
//                         }`}
//                       >
//                         <Heart
//                           className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
//                             favorites.includes(product._id)
//                               ? "text-white fill-white"
//                               : "text-gray-600 hover:text-red-500"
//                           }`}
//                         />
//                       </button>
//                       {product.status !== "active" && (
//                         <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">
//                           Out of Stock
//                         </Badge>
//                       )}
//                     </div>

//                     <div className="pt-3 sm:pt-4">
//                       <h3 className="font-semibold text-sm sm:text-base text-[#111827] mb-2 sm:mb-3 line-clamp-2">
//                         {product.title}
//                       </h3>
//                       <p className="text-xs sm:text-sm font-normal text-[#4B5563] mb-1">
//                         2.5 kilometers away
//                       </p>
//                       <p className="text-xs sm:text-sm font-normal text-[#4B5563] mb-2 sm:mb-3">
//                         Available all year
//                       </p>

//                       <div className="flex items-center justify-between">
//                         <span className="font-semibold text-xs sm:text-sm text-[#111827]">
//                           ${product.price} per {product.quantity}
//                         </span>
//                         <div className="flex items-center gap-1">
//                           <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#FACC15] text-[#FACC15]" />
//                           <span className="text-xs sm:text-sm font-medium text-gray-900">
//                             {(
//                               product.review.reduce(
//                                 (acc, r) => acc + r.rating,
//                                 0
//                               ) / product.review.length || 0
//                             ).toFixed(1)}
//                           </span>
//                           <span className="text-xs sm:text-sm text-gray-600">
//                             ({product.review.length})
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import Image from "next/image"
import { Heart, MapPin, Star, MessageCircle, Clock6 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/sheard/PageHeader"
import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Product {
  _id: string
  title: string
  thumbnail?: { url: string }
  price: number
  quantity: string
  review: { rating: number; user: string; text: string; _id: string }[]
  status: string
}

interface Farm {
  _id: string
  name: string
  isOrganic: boolean
  description: string
  images?: { url: string; public_id: string; _id: string }[]
  location: {
    city: string
    state: string
    street: string
  }
  rating: number
  latitude?: number
  longitude?: number
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`

// interface StartChatButtonProps {
//   farmId: string;
//   farmName?: string;
// }

interface ApiResponse {
  success: boolean
  message: string
  data: {
    farm: Farm
    product: Product[]
  }
}

export default function FarmPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const params = useParams()
  const farmId = params.id as string
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const token = session?.accessToken

  console.log(token, "token")

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["farm", farmId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/farm/${farmId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch farm data")
      }
      return response.json()
    },
  })

  const handleStartChat = async () => {
    if (!token) {
      toast.error("Please login to start a chat")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/chat/create-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          farmId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to the chat page with the chat ID
        router.push(`/messages/${data.data._id}`);
        toast.success("Chat is opening...");
      } else {
        throw new Error(data.message || "Failed to create chat")
      }
    } catch (error) {
      console.error("Error creating chat:", error)
      toast("Failed to start chat. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 ">
        <div className="animate-pulse">
          {/* Skeleton for Page Header */}
          <div className="h-48 sm:h-64 bg-gray-200 rounded-lg mb-8"></div>
          {/* Skeleton for Farm Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[80px] lg:h-[80px] rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          {/* Skeleton for Products */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 gap-y-10">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return <div className="min-h-screen flex items-center justify-center">Error loading farm data</div>
  }

  const farm = data.data.farm
  const products = data.data.product

  // Calculate average rating for the farm based on product reviews
  const averageRating =
    products.length > 0
      ? products.reduce((acc, product) => {
          const productAvg =
            product.review.length > 0
              ? product.review.reduce((sum, review) => sum + review.rating, 0) / product.review.length
              : 0
          return acc + productAvg
        }, 0) / products.length
      : 0

  const totalReviews = products.reduce((acc, product) => acc + product.review.length, 0)

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageHeader
        imge={farm.images && farm.images.length > 0 ? farm.images[0].url : "/asset/framheader.jpg"}
        titile={farm.name}
        subtitle={farm.description}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-[100px]">
        {/* Farm Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className=" flex-col sm:flex-row gap-4 sm:gap-6 border border-red-700">
            {/* Profile Image and Basic Info */}

            <div className="flex items-start gap-4 flex-1 ">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[80px] lg:h-[80px] rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={farm.images && farm.images.length > 0 ? farm.images[0].url : "/asset/profile1.png"}
                  alt={`${farm.name} profile`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-[18px] font-semibold text-[#272727] mb-2">{farm.name}</h1>
                {farm.isOrganic && (
                  <div className="flex items-center gap-2 mb-2">
                    <Clock6 className="w-3 h-3 sm:w-4 sm:h-4 text-[#039B06] flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-[#039B06] font-normal">
                      This farm produces organic products
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#039B06] flex-shrink-0" />
                  <span className="text-sm sm:text-base font-normal text-[#595959]">
                    {farm.location.city}, {farm.location.state}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="w-full sm:w-[800px] border border-gray-200 rounded-lg overflow-hidden h-[200px] sm:h-[250px] lg:h-[300px]">
              {farm.latitude && farm.longitude ? (
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${farm.latitude},${farm.longitude}`}
                  aria-label={`Map of ${farm.name} at ${farm.location.street}, ${farm.location.city}, ${farm.location.state}`}
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">Location map not available.</div>
              )}
            </div> */}

              {/* Description and Rating */}
          <div className="mt-4 sm:mt-6">
            <p className="text-base sm:text-lg lg:text-base text-[#4B5563] font-normal mb-3 sm:mb-4">
              {farm.description}
            </p>
            <div className=" flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                  <span className="font-semibold text-[#000000]">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-[#272727]">({totalReviews})</span>
                </div>
              </div>
              <Button
                onClick={handleStartChat}
                disabled={loading}
                className="bg-[#039B06] mt-1 hover:bg-[#039B06]/80 text-white rounded-[4px] w-full sm:w-auto cursor-pointer text-sm sm:text-base px-4 py-2"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {loading ? "Starting Message..." : "Message Farmer"}
              </Button>
            </div>
          </div>
          </div>

        
        </div>

        {/* Products Section */}
        <div className="pb-8 sm:pb-12 lg:pb-16">
          <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-[#272727] mb-6 sm:mb-8 lg:mb-10">
            Farms Products
          </h2>

          {products.length === 0 ? (
            <div className="text-center text-lg text-[#4B5563] font-medium">No products in this farm</div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 gap-y-10">
              {products.map((product) => (
                <Link key={product._id} href={`/product-details/${product._id}`}>
                  <div className="group cursor-pointer relative overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={product.thumbnail?.url || "/placeholder.svg"}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(product._id)
                        }}
                        className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-colors ${
                          favorites.includes(product._id)
                            ? "bg-black border-2 border-white"
                            : "bg-white/80 hover:bg-white"
                        }`}
                      >
                        <Heart
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                            favorites.includes(product._id)
                              ? "text-white fill-white"
                              : "text-gray-600 hover:text-red-500"
                          }`}
                        />
                      </button>
                      {product.status !== "active" && (
                        <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <div className="pt-3 sm:pt-4">
                      <h3 className="font-semibold text-sm sm:text-base text-[#111827] mb-2 sm:mb-3 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-normal text-[#4B5563] mb-1">2.5 kilometers away</p>
                      <p className="text-xs sm:text-sm font-normal text-[#4B5563] mb-2 sm:mb-3">Available all year</p>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs sm:text-sm text-[#111827]">
                          ${product.price} per {product.quantity}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#FACC15] text-[#FACC15]" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {(
                              product.review.reduce((acc, r) => acc + r.rating, 0) / product.review.length || 0
                            ).toFixed(1)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">({product.review.length})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

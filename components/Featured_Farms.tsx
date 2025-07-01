// // "use client"

// // import { useState } from "react"
// // import { useQuery } from "@tanstack/react-query"
// // import { useSession } from "next-auth/react" // Import useSession from next-auth
// // import FarmsCard from "./sheard/FramsCarda"
// // import { Button } from "@/components/ui/button"
// // import { ChevronLeft, ChevronRight } from "lucide-react"
// // import Add_Banner from "./Add_Banner"

// // // Interface definitions remain unchanged
// // interface Location {
// //   street: string
// //   city: string
// //   state: string
// //   zipCode: string
// // }

// // interface Image {
// //   public_id: string
// //   url: string
// //   _id: string
// // }

// // interface Seller {
// //   avatar: {
// //     public_id: string
// //     url: string
// //   }
// //   _id: string
// // }

// // interface Farm {
// //   _id: string
// //   status: "approved" | "pending" | "rejected"
// //   name: string
// //   description: string
// //   isOrganic?: boolean
// //   images: Image[]
// //   seller: Seller | null
// //   code: string
// //   location?: Location
// //   rating?: number
// //   profileImage?: string
// //   createdAt: string
// //   updatedAt: string
// //   __v?: number
// // }

// // interface ApiResponse {
// //   success: boolean
// //   message: string
// //   data: {
// //     farm: Farm[]
// //     pagination: {
// //       total: number
// //       page: number
// //       limit: number
// //       totalPage: number
// //     }
// //   }
// // }

// // const Featured_Farms = () => {
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const limit = 8 // Show 8 farms per page
// //   const { data: session } = useSession() // Get session data from next-auth

// //   const { data, isLoading, error } = useQuery<ApiResponse>({
// //     queryKey: ["farms", currentPage],
// //     queryFn: async () => {
// //       if (!process.env.NEXT_PUBLIC_API_URL) {
// //         throw new Error("API URL is not defined")
// //       }

// //       // Prepare headers with token if available
// //       const headers: HeadersInit = {
// //         "Content-Type": "application/json",
// //       }
// //       if (session?.accessToken) {
// //         headers["Authorization"] = `Bearer ${session.accessToken}` 
// //       }

// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/user/all-farm?page=${currentPage}&limit=${limit}`,
// //         {
// //           headers, // Include headers in the request
// //         }
// //       )
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch farms: ${response.statusText}`)
// //       }
// //       const result = await response.json()
// //       if (!result.success) {
// //         throw new Error(result.message || "API returned unsuccessful response")
// //       }
// //       if (!Array.isArray(result.data.farm)) {
// //         throw new Error("Invalid API response format: farm data is not an array")
// //       }
// //       return result
// //     },
// //   })

// //   // Helper function to get first letter of farm name
// //   const getFirstLetter = (name: string) => {
// //     return name.charAt(0).toUpperCase()
// //   }

// //   // Helper function to render farms with banner ad after first 4 cards
// //   const renderFarmsWithAds = (farms: Farm[]) => {
// //     const items = []

// //     // First 4 cards
// //     const firstFourFarms = farms.slice(0, 4)
// //     const remainingFarms = farms.slice(4)

// //     // Render first 4 farm cards
// //     firstFourFarms.forEach((farm) => {
// //       const hasProfileImage = farm.seller?.avatar?.url || farm.profileImage

// //       items.push(
// //         <FarmsCard
// //           key={farm._id}
// //           id={farm._id}
// //           name={farm.name || "Farm Name"}
// //           location={farm.location?.city || "Unknown city"}
// //           street={farm.location?.street || "Unknown street"}
// //           state={farm.location?.state || "Unknown state"}
// //           image={farm.images?.[0]?.url || "/placeholder.svg?height=260&width=320"}
// //           profileImage={
// //             hasProfileImage
// //               ? farm.seller?.avatar?.url || farm.profileImage || "/placeholder.svg?height=260&width=320"
// //               : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
// //           }
// //           description={farm.description || "No description available"}
// //           rating={farm.rating || 0}
// //         />,
// //       )
// //     })

// //     // Add banner ad after first 4 cards (only if there are more than 4 farms)
// //     if (farms.length > 4) {
// //       items.push(
// //         <div key="banner-ad" className="col-span-full mb-6">
// //           <Add_Banner />
// //         </div>,
// //       )
// //     }

// //     // Add remaining farm cards
// //     remainingFarms.forEach((farm) => {
// //       const hasProfileImage = farm.seller?.avatar?.url || farm.profileImage

// //       items.push(
// //         <FarmsCard
// //           key={farm._id}
// //           id={farm._id}
// //           name={farm.name || "Farm Name"}
// //           location={farm.location?.city || "Unknown city"}
// //           street={farm.location?.street || "Unknown street"}
// //           state={farm.location?.state || "Unknown state"}
// //           image={farm.images?.[0]?.url || "/placeholder.svg?height=260&width=320"}
// //           profileImage={
// //             hasProfileImage
// //               ? farm.seller?.avatar?.url || farm.profileImage || "/placeholder.svg?height=260&width=320"
// //               : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
// //           }
// //           description={farm.description || "No description available"}
// //           rating={farm.rating || 0}
// //         />,
// //       )
// //     })

// //     return items
// //   }

// //   // Generate page numbers for pagination
// //   const generatePageNumbers = () => {
// //     if (!data?.data.pagination) return []

// //     const { page: currentPage, totalPage } = data.data.pagination
// //     const pages = []

// //     if (totalPage <= 7) {
// //       // Show all pages if total pages <= 7
// //       for (let i = 1; i <= totalPage; i++) {
// //         pages.push(i)
// //       }
// //     } else {
// //       // Show first page
// //       pages.push(1)

// //       if (currentPage > 4) {
// //         pages.push("...")
// //       }

// //       // Show pages around current page
// //       const start = Math.max(2, currentPage - 1)
// //       const end = Math.min(totalPage - 1, currentPage + 1)

// //       for (let i = start; i <= end; i++) {
// //         if (!pages.includes(i)) {
// //           pages.push(i)
// //         }
// //       }

// //       if (currentPage < totalPage - 3) {
// //         pages.push("...")
// //       }

// //       // Show last page
// //       if (!pages.includes(totalPage)) {
// //         pages.push(totalPage)
// //       }
// //     }

// //     return pages
// //   }

// //   if (isLoading) {
// //     return (
// //       <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
// //         <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {[...Array(8)].map((_, index) => (
// //             <div key={index} className="animate-pulse">
// //               <div className="bg-gray-300 w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px]"></div>
// //               <div className="p-2 sm:p-3 md:p-4 lg:p-3 mt-4 sm:mt-5 md:mt-6">
// //                 <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2 mb-2">
// //                   <div className="bg-gray-300 rounded-full w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] lg:w-[50px] lg:h-[50px]"></div>
// //                   <div className="flex-1">
// //                     <div className="bg-gray-300 h-4 rounded mb-1"></div>
// //                     <div className="bg-gray-300 h-3 rounded w-3/4"></div>
// //                   </div>
// //                 </div>
// //                 <div className="bg-gray-300 h-3 rounded mb-2"></div>
// //                 <div className="bg-gray-300 h-3 rounded w-1/2"></div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
// //         <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>
// //         <div className="text-center py-12">
// //           <p className="text-red-600 text-lg">
// //             {error instanceof Error ? error.message : "Error loading farms. Please try again later."}
// //           </p>
// //         </div>
// //       </section>
// //     )
// //   }

// //   const pagination = data?.data.pagination
// //   const farms = data?.data.farm || []

// //   return (
// //     <section className="container mx-auto px-4 md:px-0 py-12 mt-[40px] md:mt-[100px]">
// //       <div>
// //         <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>

// //         {/* Grid layout for farm cards with ads */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {farms.length > 0 ? (
// //             renderFarmsWithAds(farms)
// //           ) : (
// //             <div className="col-span-full text-center py-12">
// //               <p className="text-gray-600 text-lg">No farms available at the moment.</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Pagination */}
// //         {pagination && pagination.totalPage > 1 && (
// //           <div className="flex items-center justify-between mt-12">
// //             {/* Results info */}
// //             <div className="text-sm text-gray-600">
// //               Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
// //               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
// //             </div>

// //             {/* Pagination controls */}
// //             <div className="flex items-center gap-1">
// //               {/* Previous button */}
// //               <Button
// //                 variant="ghost"
// //                 size="sm"
// //                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
// //                 disabled={currentPage === 1}
// //                 className="h-8 w-8 p-0"
// //               >
// //                 <ChevronLeft className="h-4 w-4" />
// //               </Button>

// //               {/* Page numbers */}
// //               {generatePageNumbers().map((page, index) => (
// //                 <div key={index}>
// //                   {page === "..." ? (
// //                     <span className="px-2 py-1 text-sm text-gray-500">...</span>
// //                   ) : (
// //                     <Button
// //                       variant={currentPage === page ? "default" : "ghost"}
// //                       size="sm"
// //                       onClick={() => setCurrentPage(page as number)}
// //                       className={`h-8 w-8 p-0 ${
// //                         currentPage === page ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100"
// //                       }`}
// //                     >
// //                       {page}
// //                     </Button>
// //                   )}
// //                 </div>
// //               ))}

// //               {/* Next button */}
// //               <Button
// //                 variant="ghost"
// //                 size="sm"
// //                 onClick={() => setCurrentPage(Math.min(pagination.totalPage, currentPage + 1))}
// //                 disabled={currentPage === pagination.totalPage}
// //                 className="h-8 w-8 p-0"
// //               >
// //                 <ChevronRight className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </section>
// //   )
// // }

// // export default Featured_Farms  


// "use client"

// import { useState, useEffect } from "react"
// import { useQuery } from "@tanstack/react-query"
// import { useSession } from "next-auth/react"
// import { useSearchParams} from "next/navigation"
// import FarmsCard from "./sheard/FramsCarda"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import Add_Banner from "./Add_Banner"

// // Interface definitions remain unchanged
// interface Location {
//   street: string
//   city: string
//   state: string
//   zipCode: string
// }

// interface Image {
//   public_id: string
//   url: string
//   _id: string
// }

// interface Seller {
//   avatar: {
//     public_id: string
//     url: string
//   }
//   _id: string
// }

// interface Farm {
//   _id: string
//   status: "approved" | "pending" | "rejected"
//   name: string
//   description: string
//   isOrganic?: boolean
//   images: Image[]
//   seller: Seller | null
//   code: string
//   location?: Location
//   rating?: number
//   profileImage?: string
//   createdAt: string
//   updatedAt: string
//   __v?: number
// }

// interface ApiResponse {
//   success: boolean
//   message: string
//   data: {
//     farm: Farm[]
//     pagination: {
//       total: number
//       page: number
//       limit: number
//       totalPage: number
//     }
//   }
// }

// const Featured_Farms = () => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const limit = 8 // Show 8 farms per page
//   const { data: session } = useSession()
//   const searchParams = useSearchParams()
//   const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

//   // Sync searchTerm with URL changes
//   useEffect(() => {
//     setSearchTerm(searchParams.get("search") || "")
//     setCurrentPage(1) // Reset to page 1 when search term changes
//   }, [searchParams])

//   const { data, isLoading, error } = useQuery<ApiResponse>({
//     queryKey: ["farms", currentPage, searchTerm],
//     queryFn: async () => {
//       if (!process.env.NEXT_PUBLIC_API_URL) {
//         throw new Error("API URL is not defined")
//       }

//       // Prepare headers with token if available
//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//       }
//       if (session?.accessToken) {
//         headers["Authorization"] = `Bearer ${session.accessToken}`
//       }

//       // Build API URL with search query if present
//       const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user/all-farm`)
//       url.searchParams.set("page", currentPage.toString())
//       url.searchParams.set("limit", limit.toString())
//       if (searchTerm) {
//         url.searchParams.set("search", searchTerm)
//       }

//       const response = await fetch(url.toString(), {
//         headers,
//       })
//       if (!response.ok) {
//         throw new Error(` "Not Found farms"`)
//       }
//       const result = await response.json()
//       if (!result.success) {
//         throw new Error(result.message || "API returned unsuccessful response")
//       }
//       if (!Array.isArray(result.data.farm)) {
//         throw new Error("Invalid API response format: farm data is not an array")
//       }
//       return result
//     },
//   })

 
//   const getFirstLetter = (name: string) => {
//     return name.charAt(0).toUpperCase()
//   }

//   // Helper function to render farms with banner ad after first 4 cards
//   const renderFarmsWithAds = (farms: Farm[]) => {
//     const items = []

//     // First 4 cards
//     const firstFourFarms = farms.slice(0, 4)
//     const remainingFarms = farms.slice(4)

//     // Render first 4 farm cards
//     firstFourFarms.forEach((farm) => {
//       const hasProfileImage = farm.seller?.avatar.url 
//       console.log(hasProfileImage);

//       items.push(
//         <FarmsCard
//           key={farm._id}
//           id={farm._id}
//           name={farm.name || "Farm Name"}
//           location={farm.location?.city || "Unknown city"}
//           street={farm.location?.street || "Unknown street"}
//           state={farm.location?.state || "Unknown state"}
//           image={farm.images?.[0]?.url || "/placeholder.svg?height=260&width=320"}
//           profileImage={
//             hasProfileImage
//               ? farm.seller?.avatar?.url || farm.profileImage || "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
//               : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
//           }
//           description={farm.description || "No description available"}
//           rating={farm.rating || 0}
//         />,
//       )
//     })

//     // Add banner ad after first 4 cards (only if there are more than 4 farms)
//     if (farms.length > 4) {
//       items.push(
//         <div key="banner-ad" className="col-span-full mb-6">
//           <Add_Banner />
//         </div>,
//       )
//     }

//     // Add remaining farm cards
//     remainingFarms.forEach((farm) => {
//       const hasProfileImage = farm.seller?.avatar?.url || farm.profileImage

//       items.push(
//         <FarmsCard
//           key={farm._id}
//           id={farm._id}
//           name={farm.name || "Farm Name"}
//           location={farm.location?.city || "Unknown city"}
//           street={farm.location?.street || "Unknown street"}
//           state={farm.location?.state || "Unknown state"}
//           image={farm.images?.[0]?.url || "/placeholder.svg?height=260&width=320"}
//           profileImage={
//             hasProfileImage
//               ? farm.seller?.avatar?.url || farm.profileImage || "/placeholder.svg?height=260&width=320"
//               : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
//           }
//           description={farm.description || "No description available"}
//           rating={farm.rating || 0}
//         />,
//       )
//     })

//     return items
//   }

//   // Generate page numbers for pagination
//   const generatePageNumbers = () => {
//     if (!data?.data.pagination) return []

//     const { page: currentPage, totalPage } = data.data.pagination
//     const pages = []

//     if (totalPage <= 7) {
//       // Show all pages if total pages <= 7
//       for (let i = 1; i <= totalPage; i++) {
//         pages.push(i)
//       }
//     } else {
//       // Show first page
//       pages.push(1)

//       if (currentPage > 4) {
//         pages.push("...")
//       }

//       // Show pages around current page
//       const start = Math.max(2, currentPage - 1)
//       const end = Math.min(totalPage - 1, currentPage + 1)

//       for (let i = start; i <= end; i++) {
//         if (!pages.includes(i)) {
//           pages.push(i)
//         }
//       }

//       if (currentPage < totalPage - 3) {
//         pages.push("...")
//       }

//       // Show last page
//       if (!pages.includes(totalPage)) {
//         pages.push(totalPage)
//       }
//     }

//     return pages
//   }

//   if (isLoading) {
//     return (
//       <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
//         <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, index) => (
//             <div key={index} className="animate-pulse">
//               <div className="bg-gray-300 w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px]"></div>
//               <div className="p-2 sm:p-3 md:p-4 lg:p-3 mt-4 sm:mt-5 md:mt-6">
//                 <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2 mb-2">
//                   <div className="bg-gray-300 rounded-full w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] lg:w-[50px] lg:h-[50px]"></div>
//                   <div className="flex-1">
//                     <div className="bg-gray-300 h-4 rounded mb-1"></div>
//                     <div className="bg-gray-300 h-3 rounded w-3/4"></div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-300 h-3 rounded mb-2"></div>
//                 <div className="bg-gray-300 h-3 rounded w-1/2"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     )
//   }

//   if (error) {
//     return (
//       <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
//         <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>
//         <div className="text-center py-12">
//           <p className=" text-lg">
//             {error instanceof Error ? error.message : "Error loading farms. Please try again later."}
//           </p>
//         </div>
//       </section>
//     )
//   }

//   const pagination = data?.data.pagination
//   const farms = data?.data.farm || []

//   return (
//     <section className="container mx-auto px-4 md:px-0 py-12 mt-[40px] md:mt-[100px]">
//       <div>
//         <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>

     

//         {/* Grid layout for farm cards with ads */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {farms.length > 0 ? (
//             renderFarmsWithAds(farms)
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-gray-600 text-lg">
//                 {searchTerm ? "Farm not found" : "No farms available at the moment."}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {pagination && pagination.totalPage > 1 && (
//           <div className="flex items-center justify-between mt-12">
//             {/* Results info */}
//             <div className="text-sm text-gray-600">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
//             </div>

//             {/* Pagination controls */}
//             <div className="flex items-center gap-1">
//               {/* Previous button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="h-8 w-8 p-0"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>

//               {/* Page numbers */}
//               {generatePageNumbers().map((page, index) => (
//                 <div key={index}>
//                   {page === "..." ? (
//                     <span className="px-2 py-1 text-sm text-gray-500">...</span>
//                   ) : (
//                     <Button
//                       variant={currentPage === page ? "default" : "ghost"}
//                       size="sm"
//                       onClick={() => setCurrentPage(page as number)}
//                       className={`h-8 w-8 p-0 ${
//                         currentPage === page ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100"
//                       }`}
//                     >
//                       {page}
//                     </Button>
//                   )}
//                 </div>
//               ))}

//               {/* Next button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setCurrentPage(Math.min(pagination.totalPage, currentPage + 1))}
//                 disabled={currentPage === pagination.totalPage}
//                 className="h-8 w-8 p-0"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }

// export default Featured_Farms

"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import FarmsCard from "./sheard/FramsCarda"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Image } from "lucide-react"
import Add_Banner from "./Add_Banner"
import DummyBanner from "./DummyBanner"

interface Location {
  street: string
  city: string
  state: string
  zipCode: string
}

interface Image {
  public_id: string
  url: string
  _id: string
}

interface Seller {
  avatar: {
    public_id: string
    url: string
  }
  _id: string
}

interface Review {
  text: string
  rating: number
  user: string
  _id: string
}

interface Farm {
  _id: string
  status: "approved" | "pending" | "rejected"
  name: string
  description: string
  isOrganic?: boolean
  images: Image[]
  seller: Seller | null
  code: string
  location?: Location
  review?: Review[]
  profileImage?: string
  createdAt: string
  updatedAt: string
  __v?: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    farm: Farm[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPage: number
    }
  }
}

const Featured_Farms = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 8 // Show 8 farms per page
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  // Sync searchTerm with URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
    setCurrentPage(1) // Reset to page 1 when search term changes
  }, [searchParams])

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["farms", currentPage, searchTerm],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not defined")
      }

      // Prepare headers with token if available
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (session?.accessToken) {
        headers["Authorization"] = `Bearer ${session.accessToken}`
      }

      // Build API URL with search query if present
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user/all-farm`)
      url.searchParams.set("page", currentPage.toString())
      url.searchParams.set("limit", limit.toString())
      if (searchTerm) {
        url.searchParams.set("search", searchTerm)
      }

      const response = await fetch(url.toString(), {
        headers,
      })
      if (!response.ok) {
        throw new Error(` "Not Found farms"`)
      }
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || "API returned unsuccessful response")
      }
      if (!Array.isArray(result.data.farm)) {
        throw new Error("Invalid API response format: farm data is not an array")
      }
      return result
    },
  })

  // Helper function to calculate average rating
  const calculateAverageRating = (reviews: Review[] = []) => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return sum / reviews.length
  }

  // Helper function to get first letter of farm name
  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  // Helper function to render farms with banner ad after first 4 cards
  const renderFarmsWithAds = (farms: Farm[]) => {
    const items = []

    // First 4 cards
    const firstFourFarms = farms.slice(0, 4)
    const remainingFarms = farms.slice(4)

    // Render first 4 farm cards
    firstFourFarms.forEach((farm) => {
      const hasProfileImage = farm.seller?.avatar?.url 

      items.push(
        <FarmsCard
          key={farm._id}
          id={farm._id}
          name={farm.name || "Farm Name"}
          location={farm.location?.city || "Unknown city"}
          street={farm.location?.street || "Unknown street"}
          state={farm.location?.state || "Unknown state"}
          image={farm.images?.[0]?.url || "/placeholder.svg?height=260&width=320"}
          profileImage={
            hasProfileImage
              ? farm.seller?.avatar?.url || farm.profileImage || "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
              : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
          }
          description={farm.description || "No description available"}
          rating={calculateAverageRating(farm.review)}
        />
      )
    })

    // Add banner ad after first 4 cards (only if there are more than 4 farms)
    if (farms.length > 4) {
      if (farms.length) {
        items.push(
          <div key="banner-ad" className="col-span-full mb-6">
            <Add_Banner />
          </div>
        )
      } else {
        items.push(
          <div key="banner-ad" className="col-span-full mb-6">
            <DummyBanner />
          </div>
        )
      }
    }

    // Add remaining farm cards
    remainingFarms.forEach((farm) => {
      const hasProfileImage = farm.seller?.avatar?.url || farm.profileImage

      items.push(
        <FarmsCard
          key={farm._id}
          id={farm._id}
          name={farm.name || "Farm Name"}
          location={farm.location?.city || "Unknown city"}
          street={farm.location?.street || "Unknown street"}
          state={farm.location?.state || "Unknown state"}
          image={farm.images?.[0]?.url || "/placeholder.svg?height=260&width=320"}
          profileImage={
            hasProfileImage
              ? farm.seller?.avatar?.url || farm.profileImage || "/placeholder.svg?height=260&width=320"
              : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
          }
          description={farm.description || "No description available"}
          rating={calculateAverageRating(farm.review)}
        />
      )
    })

    return items
  }

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!data?.data.pagination) return []

    const { page: currentPage, totalPage } = data.data.pagination
    const pages = []

    if (totalPage <= 7) {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPage - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPage - 3) {
        pages.push("...")
      }

      // Show last page
      if (!pages.includes(totalPage)) {
        pages.push(totalPage)
      }
    }

    return pages
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
        <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px]"></div>
              <div className="p-2 sm:p-3 md:p-4 lg:p-3 mt-4 sm:mt-5 md:mt-6">
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2 mb-2">
                  <div className="bg-gray-300 rounded-full w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] lg:w-[50px] lg:h-[50px]"></div>
                  <div className="flex-1">
                    <div className="bg-gray-300 h-4 rounded mb-1"></div>
                    <div className="bg-gray-300 h-3 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="bg-gray-300 h-3 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
        <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>
        <div className="text-center py-12">
          <p className="text-lg">
            {error instanceof Error ? error.message : "Error loading farms. Please try again later."}
          </p>
        </div>
      </section>
    )
  }

  const pagination = data?.data.pagination
  const farms = data?.data.farm || []

  return (
    <section className="container mx-auto px-4 md:px-0 py-12 mt-[40px] md:mt-[100px]">
      <div>
        <h2 className="text-3xl text-[#272727] font-semibold mb-8">Featured Farms</h2>

        {/* Grid layout for farm cards with ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {farms.length > 0 ? (
            renderFarmsWithAds(farms)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchTerm ? "Farm not found" : "No farms available at the moment."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPage > 1 && (
          <div className="flex items-center justify-between mt-12">
            {/* Results info */}
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
              {/* Previous button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              {generatePageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={`h-8 w-8 p-0 ${
                        currentPage === page ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}

              {/* Next button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.min(pagination.totalPage, currentPage + 1))}
                disabled={currentPage === pagination.totalPage}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Featured_Farms
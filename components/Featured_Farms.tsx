"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import FarmsCard from "./sheard/FramsCarda" // Assuming this path is correct

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Added Badge import
import { ChevronLeft, ChevronRight, Star } from "lucide-react" // Added Star import

import Add_Banner from "./Add_Banner" // Assuming this path is correct

interface Location {
  street: string
  city: string
  state: string
  zipCode: string
}

interface FarmImage {
  // Renamed to avoid conflict with ProductImage
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
  images: FarmImage[]
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

// New interfaces for Products
interface ProductImage {
  public_id: string
  url: string
  type: string
  _id: string
}

interface ProductReview {
  text: string
  rating: number
  user: string
  _id: string
  date: string
}

interface Product {
  thumbnail: {
    public_id: string
    url: string
  }
  _id: string
  title: string
  price: number
  quantity: string
  category: string
  description?: string
  media: ProductImage[]
  farm: string
  status: "active" | "inactive" | "out_of_stock" 
  code: string
  review: ProductReview[]
  createdAt: string
  updatedAt: string
  __v?: number
}

interface ProductApiResponse {
  success: boolean
  message: string
  data: Product[]
}

const Featured_Farms = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 8 // Show 8 farms per page
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const categoryId = searchParams.get("category")

  // Sync searchTerm with URL changes and reset page for both search and category
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
    setCurrentPage(1) // Reset to page 1 when search term or category changes
  }, [searchParams])

  // Helper function to calculate average rating for any review array
  const calculateAverageRating = (reviews: { rating: number }[] = []) => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return sum / reviews.length
  }

  // Query for Farms
  const {
    data: farmsData,
    isLoading: isLoadingFarms,
    error: errorFarms,
  } = useQuery<ApiResponse>({
    queryKey: ["farms", currentPage, searchTerm],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not defined")
      }
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (session?.accessToken) {
        headers["Authorization"] = `Bearer ${session.accessToken}`
      }
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
        throw new Error(`"Not Found farms"`)
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
    enabled: !categoryId, // Only fetch farms if no categoryId is present
  })

  // Query for Products by Category
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useQuery<ProductApiResponse>({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not defined")
      }
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (session?.accessToken) {
        headers["Authorization"] = `Bearer ${session.accessToken}`
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/product-by-category/${categoryId}`, {
        headers,
      })
      if (!response.ok) {
        throw new Error(`"Not Found products"`)
      }
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || "API returned unsuccessful response")
      }
      if (!Array.isArray(result.data)) {
        throw new Error("Invalid API response format: product data is not an array")
      }
      return result
    },
    enabled: !!categoryId, // Only fetch products if categoryId is present
  })

  const isCategoryView = !!categoryId

  // Helper function to get first letter of farm name
  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  // Helper function to render farms with banner ad after first 4 cards
  const renderFarmsWithAds = (farms: Farm[]) => {
    const items = []
    const firstFourFarms = farms.slice(0, 4)
    const remainingFarms = farms.slice(4)

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
              ? farm.seller?.avatar?.url ||
                farm.profileImage ||
                "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
              : "/placeholder.svg?height=50&width=50&text=" + encodeURIComponent(getFirstLetter(farm.name || "F"))
          }
          description={farm.description || "No description available"}
          rating={calculateAverageRating(farm.review)}
        />,
      )
    })

    if (farms.length > 4) {
      // The original logic for Add_Banner vs DummyBanner was based on `farms.length` which is always true here.
      // Assuming there's a more specific condition for Add_Banner vs DummyBanner,
      // for now, I'll just use Add_Banner as it was the first condition.
      items.push(
        <div key="banner-ad" className="col-span-full mb-6">
          <Add_Banner />
        </div>,
      )
    }

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
        />,
      )
    })
    return items
  }

  // Helper function to generate page numbers
  const generatePageNumbers = () => {
    const pageNumbers = []
    const totalPage = farmsData?.data.pagination.totalPage || 0

    for (let i = 1; i <= totalPage; i++) {
      if (i === 1 || i === totalPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(i)
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...")
      }
    }

    return pageNumbers
  }

  // Determine current loading and error states
  const currentIsLoading = isCategoryView ? isLoadingProducts : isLoadingFarms
  const currentError = isCategoryView ? errorProducts : errorFarms

  if (currentIsLoading) {
    return (
      <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
        <h2 className="text-3xl text-[#272727] font-semibold mb-8">
          {isCategoryView ? "Loading Products..." : "Featured Farms"}
        </h2>
        <div
          className={`grid ${
            isCategoryView
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          } gap-6`}
        >
          {[...Array(isCategoryView ? 10 : 8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px]"></div>
              <div className="p-2 sm:p-3 md:p-4 lg:p-3 mt-4 sm:mt-5 md:mt-6">
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2 mb-2">
                  {!isCategoryView && (
                    <div className="bg-gray-300 rounded-full w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] lg:w-[50px] lg:h-[50px]"></div>
                  )}
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

  if (currentError) {
    return (
      <section className="container mx-auto px-4 md:px-0 py-12 mt-[100px]">
        <h2 className="text-3xl text-[#272727] font-semibold mb-8">
          {isCategoryView ? "Products by Category" : "Featured Farms"}
        </h2>
        <div className="text-center py-12">
          <p className="text-lg">{currentError instanceof Error ? currentError.message : "Error loading data."}</p>
        </div>
      </section>
    )
  }

  const farms = farmsData?.data.farm || []
  const products = productsData?.data || []
  const pagination = farmsData?.data.pagination // Pagination only applies to farms

  return (
    <section className="container mx-auto px-4 md:px-0 py-12 mt-[40px] md:mt-[100px]">
      <div>
        <h2 className="text-3xl text-[#272727] font-semibold mb-8">
          {isCategoryView ? "Products by Category" : "Featured Farms"}
        </h2>
        {isCategoryView ? (
          // Product Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product._id} href={`/product-details/${product._id}`} className="group">
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.thumbnail?.url || "/placeholder.svg"}
                        alt={product.title}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                    {product.status !== "active" && (
                      <Badge className="absolute top-2 left-2 bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className="pt-3">
                    <h3 className="font-semibold text-sm sm:text-base text-[#111827] mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4B5563] mb-1">{"2.5 kilometers away"}</p>
                    <p className="text-xs sm:text-sm text-[#4B5563] mb-2">{"Available all year"}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm sm:text-base text-[#111827]">
                        ${product.price} per Box
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                        <span className="text-sm sm:text-base text-gray-900">
                          {calculateAverageRating(product.review).toFixed(1)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">({product.review.length})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchTerm ? "Product not found" : "No products available for this category."}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Farm Grid
          <>
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
            {/* Pagination for Farms */}
            {pagination && pagination.totalPage > 1 && (
              <div className="flex items-center justify-between mt-12">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 border border-green-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
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
                            currentPage === page ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100 border border-green-600"
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(pagination.totalPage, currentPage + 1))}
                    disabled={currentPage === pagination.totalPage}
                    className="h-8 w-8 p-0 border border-green-600"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Featured_Farms

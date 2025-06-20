"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

// Types for the API response - Updated to match your actual API
interface BlogData {
  _id: string
  blogName: string
  description: string
  thumbnail?: {
    public_id: string
    url: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  success: boolean
  message: string
  data?: BlogData
  errorSources?: Array<{
    path: string
    message: string
  }>
}

export default function BlogDetails() {
  const params = useParams()
  const id = params.id as string
  const { data: session, status } = useSession()
  const token = session?.accessToken

  // Debug logging
  useEffect(() => {
    console.log("Debug Info:", {
      id,
      hasToken: !!token,
      sessionStatus: status,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    })
  }, [id, token, status])

  // Fetch blog data
  async function fetchBlogData(id: string): Promise<BlogData> {
    console.log("Fetching blog data for ID:", id)

    if (!token) {
      throw new Error("No authentication token available")
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API URL not configured")
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}`
    console.log("Fetching from URL:", url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", errorText)
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`)
    }

    const result: ApiResponse = await response.json()
    console.log("API Response:", result)

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch blog data")
    }

    return result.data
  }

  const {
    data: blog,
    isLoading,
    error,
    isError,
  } = useQuery<BlogData, Error>({
    queryKey: ["blog", id, token],
    queryFn: () => fetchBlogData(id),
    enabled: !!id && !!token && status === "authenticated",
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // Debug the query state
  useEffect(() => {
    console.log("Query State:", {
      isLoading,
      isError,
      error: error?.message,
      hasBlog: !!blog,
      blogData: blog,
      queryEnabled: !!id && !!token && status === "authenticated",
    })
  }, [isLoading, isError, error, blog, id, token, status])

  // Show authentication loading
  if (status === "loading") {
    return (
      <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[100px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#039B06] mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[100px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-4">You need to be logged in to view this blog post.</p>
            <Link
              href="/login"
              className="inline-block bg-[#039B06] text-white px-6 py-2 rounded-lg hover:bg-[#028505] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[100px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[561px] bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !blog) {
    return (
      <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[100px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {isError ? "Error Loading Blog" : "Blog Not Found"}
            </h1>
            <p className="text-gray-600 mb-4">
              {isError && error ? error.message : "The requested blog post could not be found."}
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">Debug Info:</p>
              <p className="text-xs text-gray-400">ID: {id}</p>
              <p className="text-xs text-gray-400">Has Token: {!!token ? "Yes" : "No"}</p>
              <p className="text-xs text-gray-400">Status: {status}</p>
              <p className="text-xs text-gray-400">API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
            </div>
            <Link
              href="/blog"
              className="inline-block bg-[#039B06] text-white px-6 py-2 rounded-lg hover:bg-[#028505] transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[100px]">
      <main className="flex-1 flex flex-col">
        {/* Navigation bar */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="container mx-auto flex flex-wrap items-center gap-2">
            <span className="text-sm sm:text-base font-medium text-[#039B06]">{formatDate(blog.createdAt)}</span>
            <span className="mx-1 sm:mx-2 text-sm sm:text-base font-medium text-[#039B06]">|</span>
            <span className="text-sm sm:text-base font-medium text-[#039B06]">Blog Post</span>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mt-6 sm:mt-8">
            <h1 className="mb-4 text-[#272727] text-xl sm:text-2xl md:text-[24px] font-semibold leading-tight">
              {blog.blogName}
            </h1>

            {blog.thumbnail?.url && (
              <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[561px] overflow-hidden mb-4 pt-4 sm:pt-6 md:pt-[50px]">
                <Image
                  src={blog.thumbnail.url || "/placeholder.svg"}
                  alt={blog.blogName}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[32px]"
                  priority
                  onError={(e) => {
                    console.error("Image failed to load:", blog.thumbnail?.url)
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Blog content */}
          <div className="mb-8 mt-8 sm:mt-10 md:mt-[60px]">
            <div className="text-base sm:text-lg md:text-[18px] text-[#595959] leading-relaxed md:leading-[150%] font-normal">
              {/* Render description content */}
              {blog.description ? (
                <div className="prose prose-lg max-w-none">
                  {/* Check if description contains HTML */}
                  {blog.description.includes("<") ? (
                    <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                  ) : (
                    <div className="whitespace-pre-wrap">{blog.description}</div>
                  )}
                </div>
              ) : (
                <p>No content available for this blog post.</p>
              )}
            </div>
          </div>

   
         

          {/* Back to blog link */}
          <div className="mt-8 pt-6 border-t pb-10">
            <Link href="/blog" className="inline-flex items-center text-[#039B06] hover:underline font-medium">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

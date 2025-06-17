"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

// Types
interface BlogThumbnail {
  public_id: string;
  url: string;
}

interface Blog {
  _id: string;
  blogName: string;
  description: string;
  thumbnail: BlogThumbnail;
  createdAt: string;
  updatedAt: string;
}

interface BlogsResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  };
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showingFrom: number;
  showingTo: number;
}

// Pagination Component (inline)
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,

  onPageChange,
  showingFrom,
  showingTo,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-gray-600">
        Showing {showingFrom} to {showingTo} of {totalItems} results
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-2 py-1 text-sm text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`h-8 w-8 p-0 ${
                  currentPage === page
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Main Blog Component
export default function BlogWithPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = session.data?.accessToken;
  const limit = 10; // Show 6 blogs per page

  // Get token from localStorage on component mount

  // API fetch function with authentication
  const fetchBlogs = async (
    page: number,
    limit: number
  ): Promise<BlogsResponse> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Add authorization header if token exists

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs?page=1&limit=${limit}`,
      {
        method: "GET",
        headers,
      }
    );

    // Handle unauthorized responses
    if (response.status === 401) {
      // Token might be expired, remove it
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");

      throw new Error("Unauthorized - Please login again");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // TanStack Query hook
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blogs", currentPage, limit, token],
    queryFn: () => fetchBlogs(currentPage, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Only run query if token exists
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if (error.message.includes("Unauthorized")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle token update (you can call this function to set token)
  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
    }
  };

  // Handle logout
  const handleLogout = () => {
    updateToken(null);
    // Optionally redirect to login page
    // window.location.href = "/login"
  };

  // Show login prompt if no token
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[100px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to view blogs.</p>
          <div className="space-x-4">
            <Button
              onClick={() => {
                // Example: Set a demo token
                const demoToken = prompt("Enter your auth token:");
                if (demoToken) {
                  updateToken(demoToken);
                }
              }}
            >
              Enter Token
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[100px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            Error loading blogs: {error.message}
          </div>
          <div className="space-x-4">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton className="w-full h-[250px] md:h-[330px] mb-4 rounded-[32px]" />
              <div className="flex flex-col flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.blogs.map((post) => (
              <div key={post._id} className="flex flex-col">
                <div className="relative w-full h-[250px] md:h-[330px] mb-4 rounded-[32px] overflow-hidden">
                  <Image
                    src={post.thumbnail.url || "/placeholder.svg"}
                    alt={post.blogName}
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-base font-normal text-[#595959] mb-1">
                    {formatDate(post.createdAt)}
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#272727] mb-2">
                    {post.blogName}
                  </h3>
                 <div className="list-item list-none">
  {(post?.description ?? "Blog Description").replace(/<[^>]+>/g, '').slice(0, 65)}...
</div>

                  <div className="mt-auto">
                    <Link
                      href={`/red-blog/${post._id}`}
                      className="text-[#039B06] hover:text-[#039B06]/80 text-base font-medium inline-flex items-center"
                    >
                      Read More <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data?.data.pagination && data.data.pagination.totalPage > 1 && (
            <Pagination
              currentPage={data.data.pagination.page}
              totalPages={data.data.pagination.totalPage}
              totalItems={data.data.pagination.total}
              itemsPerPage={data.data.pagination.limit}
              onPageChange={handlePageChange}
              showingFrom={
                (data.data.pagination.page - 1) * data.data.pagination.limit + 1
              }
              showingTo={Math.min(
                data.data.pagination.page * data.data.pagination.limit,
                data.data.pagination.total
              )}
            />
          )}
        </>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PacificPagination from "@/components/ui/PacificPagination";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogWithPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const [data, setData] = useState<BlogsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://gman54-backend.onrender.com/api/v1/admin/blogs?page=${currentPage}&limit=${limit}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const json: BlogsResponse = await res.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        } else if (!(err instanceof Error)) {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [currentPage]);

  const blogs = data?.data.blogs || [];
  const pagination = data?.data.pagination || {
    total: 0,
    page: 1,
    limit,
    totalPage: 1,
  };

  const showingFrom = (currentPage - 1) * limit + 1;
  const showingTo = Math.min(currentPage * limit, pagination.total);

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      {isLoading ? (
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
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <div key={post._id} className="flex flex-col">
                <div className="relative w-full h-[250px] md:h-[330px] mb-4 rounded-[32px] overflow-hidden">
                  <Image
                    src={post.thumbnail?.url || "/placeholder.svg"}
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
                    {(post?.description ?? "Blog Description")
                      .replace(/<[^>]+>/g, "")
                      .slice(0, 65)}
                    ...
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

          {pagination.totalPage > 10 && (
            <div className="flex justify-between items-center mt-8 py-2">
              <div className="text-sm text-muted-foreground">
                Showing {showingFrom} to {showingTo} of {pagination.total} blogs
              </div>
              <PacificPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

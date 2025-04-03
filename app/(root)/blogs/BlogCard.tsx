"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "../../../components/ui/button";

const BlogCard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const isMounted = useRef(false); // Prevents duplicate API calls

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?page=${page}&limit=5`);
      const data = await res.json();

      if (data.posts.length < 5) {
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...data.posts]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     if (!isMounted.current) {
       fetchPosts();
       isMounted.current = true; // Ensures the API call runs only once
     }

     return () => {
       if (observer.current) {
         observer.current.disconnect();
         observer.current = null;
       }
     };
  }, []);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="bg-gradient-to-r from-blue-100 via-white to-green-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-6">
          Latest Blogs
        </h1>

        <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-1">
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostRef : null}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col transition-all hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-500 hover:text-blue-600 transition-all"
                >
                  Read More
                </Link>
                <span className="text-sm text-gray-400">
                  📅 {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mt-6">
            <Button className="px-6 py-3 text-lg">Loading more...</Button>
          </div>
        )}

        {!hasMore && (
          <div className="text-center mt-6 text-gray-500">
            No more blogs to load.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;

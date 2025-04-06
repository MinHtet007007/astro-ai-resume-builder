"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { Button } from "../../../../components/ui/button";

export default function DashboardPage() {
  const [posts, setPosts] = useState<
    { id: string; slug: string; title: string; content: string }[]
  >([]);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(false); // Prevents duplicate API calls

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?page=${page}&limit=10`);
      const data = await res.json();

      if (data.posts.length < 10) {
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
    <div>
      <div className=" flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-5">Your Posts</h1>
        <Link
          href="/dashboard/posts/create"
          // className=" bg-black text-white text-2xl font-bold mb-5"
        >
          <Button>Create Post</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {posts.map((post, index) => {
          const isExpanded = expandedPosts[post.id] || false;
          const shortContent =
            post.content.length > 200
              ? `${post.content.slice(0, 200)}...`
              : post.content;

          return (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostRef : null}
              className="p-5 border rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 whitespace-pre-line">
                {isExpanded ? post.content : shortContent}
              </p>
              {post.content.length > 200 && (
                <button
                  onClick={() =>
                    setExpandedPosts((prev) => ({
                      ...prev,
                      [post.id]: !isExpanded,
                    }))
                  }
                  className="text-blue-500 mt-2 cursor-pointer"
                >
                  {isExpanded ? "Show Less" : "See More"}
                </button>
              )}
              <div className="flex gap-3 mt-3">
                <Link
                  href={`/dashboard/posts/edit/${post.slug}`}
                  className="text-blue-500"
                >
                  Edit
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="text-red-500 cursor-pointer">Delete</div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={async () => {
                          await fetch(`/api/posts/${post.slug}`, {
                            method: "DELETE",
                          });
                          setPosts(posts.filter((p) => p.id !== post.id));
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-5">Loading more...</p>
      )}
    </div>
  );
}

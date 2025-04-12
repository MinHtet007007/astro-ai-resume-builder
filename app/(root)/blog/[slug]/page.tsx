"use client";

import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function updateViewCount(postId: string) {
  await fetch("/api/posts/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId }),
  });
}

export default function BlogPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      setPost(data);
    //   setRelatedPosts(data.relatedPosts);
      updateViewCount(data.id as string);
    }
    if (slug) fetchData();
  }, [slug]);

  if (!post) return <p className="text-center text-gray-600 h-screen flex justify-center items-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className=" min-h-screen max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg flex flex-col border border-gray-300">
        <h1 className="text-4xl font-extrabold text-green-700">{post.title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          📅 {new Date(post.createdAt).toLocaleDateString()} | 👀 {post.viewCount} Views
        </p>
        <hr className="my-4" />
        <p className="text-gray-700 leading-7 whitespace-pre-line mb-8">{post.content}</p>

        {/* <div className="mt-auto">
          <h3 className="text-lg font-semibold text-gray-800">👤 Author: {post.authorName || "Anonymous"}</h3>
        </div> */}
      </div>

      {/* 🔥 Related Blogs Section */}
      {/* {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📢 You May Also Like</h2>
          <div className="grid gap-4">
            {relatedPosts.map((related) => (
              <Link key={related.id} href={`/blog/${related.id}`}>
                <div className="p-4 bg-white shadow-md border border-gray-200 rounded-lg hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-green-600">{related.title}</h3>
                  <p className="text-sm text-gray-600">👀 {related.viewCount} Views</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )} */}

      {/* CTA - Back to Blogs */}
      <div className="flex justify-center mt-10">
        <Link href="/blogs">
          <Button className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700">← Back to Blogs</Button>
        </Link>
      </div>
    </div>
  );
}

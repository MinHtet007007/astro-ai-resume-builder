import { prisma } from "@/lib/prisma";
import BlogCard from "./BlogCard";
import Link from "next/link";

// Fetch trending posts (Most viewed)
async function getTrendingPosts() {
  return await prisma.post.findMany({
    orderBy: { viewCount: "desc" },
    take: 3,
  });
}

export default async function PostsPage() {
  const trendingPosts = await getTrendingPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
        Blogs
      </h1>

      {/* 🔥 Trending Section */}
      {trendingPosts.length > 0 && (
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🔥 Trending Now
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {trendingPosts.map((post) => (
              <TrendingPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* 📝 Infinite Scroll Post List */}
      <div className="max-w-6xl mx-auto">
        <BlogCard />
      </div>
    </div>
  );
}

// 🔥 Trending Post Card
function TrendingPostCard({ post }: { post: any }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-300 w-full md:w-1/3 lg:w-1/4 flex flex-col">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-gray-600">🔥 {post.viewCount} Views</p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-auto text-blue-500 hover:text-blue-700 transition"
      >
        Read More
      </Link>
    </div>
  );
}

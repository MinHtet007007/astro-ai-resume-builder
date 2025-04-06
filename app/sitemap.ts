import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma"; // Adjust path to your prisma client

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // Fetch all published blog posts with slugs
  const blogs = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/create-resume`,
      lastModified: new Date(),
    },
    // Add each blog post
    ...blogs.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}

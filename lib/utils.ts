import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with "-"
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim();
}

// Fetch trending posts (Most viewed)
export async function getTrendingPosts() {
  return await prisma.post.findMany({
    orderBy: { viewCount: "desc" },
    take: 3,
  });
}


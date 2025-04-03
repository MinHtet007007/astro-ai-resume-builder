import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "../../../lib/utils";

export const GET = auth(async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      take: limit,
      skip,
      orderBy: { id: "desc" },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalPosts = await prisma.post.count(); // Total number of posts
    const hasMore = skip + limit < totalPosts; // Check if there are more posts

    return NextResponse.json({ posts, hasMore });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function POST(req) {
  if (!req.auth || req.auth?.user?.role?.toLocaleLowerCase() !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, image } = await req.json();

    // Generate a slug from the title
    let slug = slugify(title);

    // Ensure the slug is unique
    let existingPost = await prisma.post.findUnique({ where: { slug } });
    let count = 1;
    while (existingPost) {
      slug = `${slug}-${count}`;
      existingPost = await prisma.post.findUnique({ where: { slug } });
      count++;
    }

    // Create the post with the slug
    const post = await prisma.post.create({
      data: {
        title,
        slug, // ✅ Store slug
        content,
        image,
        viewCount: 0,
        authorId: req.auth.user?.id ?? "",
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
});

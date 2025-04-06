import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export const incrementViewCount = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }, // Increment view count
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
};

// ✅ GET a single post
export const GET = auth(async (req, { params }) => {
  try {
    // Ensuring params is awaited
    const { slug } = await params; // Await params here
    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug: slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
});

export const PATCH = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensuring params is awaited
    const { slug } = await params; // Await params here
    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const { title, content, image } = await req.json();

    const post = await prisma.post.updateMany({
      where: {
        slug: slug,
        authorId: req.auth.user?.id,
      },
      data: { title, content, image },
    });

    if (post.count === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensuring params is awaited
    const { slug } = await params; // Await params here
    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const deletedPost = await prisma.post.deleteMany({
      where: {
        slug: slug,
        authorId: req.auth.user?.id,
      },
    });

    if (deletedPost.count === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
});

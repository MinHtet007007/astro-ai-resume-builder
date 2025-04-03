import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } }, // Increase view count
    });

    return NextResponse.json({ message: "View count updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}

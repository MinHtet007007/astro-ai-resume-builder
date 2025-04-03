import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users
//   const user = await prisma.user.upsert({
//     where: { email: "admin@example.com" },
//     update: {},
//     create: {
//       name: "Admin User",
//       email: "admin@example.com",
//       role: "ADMIN",
//     },
//   });

  // Sample posts
const posts = Array.from({ length: 30 }, (_, i) => ({
    title: `Post Title ${i + 1}`,
    slug: `post-title-${i + 1}`,
    content: `Content for post ${i + 1}. ${"This is a detailed description.".repeat(
      Math.floor(Math.random() * 3) + 1
    )}`,
    authorId: "cm8pqzr6y0000a2twwyd9484p",
    viewCount: Math.floor(Math.random() * 1000),
}));

  // Insert posts into the database
  await prisma.post.createMany({
    data: posts,
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

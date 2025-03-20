import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.Next_PUBLIC_VERCEL_URL}`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.Next_PUBLIC_VERCEL_URL}/create-resume`,
      lastModified: new Date(),
    },
  ];
}

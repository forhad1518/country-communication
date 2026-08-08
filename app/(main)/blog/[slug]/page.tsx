import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const blog = data.data;

    if (!blog) {
      return {
        title: "Blog Not Found",
        description: "The blog post you are looking for does not exist.",
      };
    }

    const title = `${blog.title} | Blog | Country Communication`;
    const description =
      blog.subtitle || blog.content?.[0]?.content?.substring(0, 160) || "";
    const imageUrl = blog.image?.url || "";

    const keywords = [
      blog.title,
      blog.category,
      ...(blog.tags || []),
      "exhibition blog",
      "trade show tips",
      "Country Communication",
      "Bangladesh exhibition",
    ].filter(Boolean);

    return {
      title,
      description:
        typeof description === "string" ? description.substring(0, 160) : "",
      keywords: keywords.join(", "),
      openGraph: {
        title,
        description:
          typeof description === "string" ? description.substring(0, 160) : "",
        type: "article",
        publishedTime: blog.publishedAt || blog.createdAt,
        modifiedTime: blog.updatedAt || blog.createdAt,
        url: `${baseUrl}/blog/${slug}`,
        images: imageUrl
          ? [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }]
          : [],
        siteName: "Country Communication",
        locale: "en_US",
        authors: [blog.authorName],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description:
          typeof description === "string" ? description.substring(0, 160) : "",
        images: imageUrl ? [imageUrl] : [],
        creator: "@CountryCommBD",
      },
      alternates: {
        canonical: `${baseUrl}/blog/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${slug.replace(/-/g, " ")} | Blog | Country Communication`,
      description: "Read our latest blog post.",
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}

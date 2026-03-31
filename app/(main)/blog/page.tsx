"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const allBlogs = [
    {
        id: 1,
        title: "How to Design an Attractive Exhibition Booth",
        category: "Booth Design",
        image: "https://picsum.photos/600/400?1",
        date: "March 2025",
        excerpt:
            "Learn the essential design principles that make exhibition booths stand out and attract more visitors.",
    },
    {
        id: 2,
        title: "Top Exhibition Trends in 2025",
        category: "Industry Trends",
        image: "https://picsum.photos/600/400?2",
        date: "Feb 2025",
        excerpt:
            "Explore the latest global exhibition trends that are shaping event marketing strategies.",
    },
    {
        id: 3,
        title: "Modular Booth vs Custom Booth",
        category: "Booth Strategy",
        image: "https://picsum.photos/600/400?3",
        date: "Jan 2025",
        excerpt:
            "Understand the difference between modular and custom exhibition booths.",
    },
];

const moreBlogs = Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    title: `Exhibition Marketing Guide ${i + 1}`,
    category: "Marketing",
    image: `https://picsum.photos/600/400?random=${i + 10}`,
    date: "2025",
    excerpt:
        "Professional insights on how to improve brand visibility in exhibitions.",
}));

export default function BlogPage() {
    const router = useRouter();
    const [visible, setVisible] = useState(6);

    const blogs = [...allBlogs, ...moreBlogs];

    return (
        <div className="bg-white min-h-screen">

            {/* TOP NAV BUTTONS */}
            <div className="max-w-7xl mx-auto px-4 pt-10 flex justify-between items-center">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                    ← Back
                </button>

                <Link
                    href="/"
                    className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                    Home
                </Link>
            </div>

            {/* HERO */}
            <div className="text-center py-14 px-4">
                <h1 className="text-4xl font-bold text-gray-800">Our Blog</h1>
                <p className="text-gray-500 mt-3">
                    Insights, tips & trends from exhibition industry
                </p>
            </div>

            {/* BLOG GRID */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid gap-8
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3">

                    {blogs.slice(0, visible).map((blog) => (
                        <div
                            key={blog.id}
                            className="border rounded-xl overflow-hidden transition duration-500 hover:shadow-xl hover:scale-[1.04]"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={blog.image}
                                    className="w-full h-56 object-cover transition duration-700 hover:scale-110"
                                />
                            </div>

                            <div className="p-5">
                                <p className="text-primary text-sm font-medium">
                                    {blog.category}
                                </p>

                                <h3 className="text-xl font-semibold mt-2 text-gray-800">
                                    {blog.title}
                                </h3>

                                <p className="text-gray-500 text-sm mt-2">
                                    {blog.date}
                                </p>

                                <p className="text-gray-600 mt-3 text-sm">
                                    {blog.excerpt}
                                </p>
                                <Link href={`/blog/${blog.id}`} className="mt-4 text-primary font-medium cursor-pointer">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEE MORE */}
                {visible < blogs.length && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setVisible(visible + 6)}
                            className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
                        >
                            See More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
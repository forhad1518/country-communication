"use client";

import Heading1 from "@/components/Heading1";
import Link from "next/link";
import { useState } from "react";
import { Slide } from "react-awesome-reveal";

const projects = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    title: `Exhibition Booth Project ${i + 1}`,
    location: "Dhaka Expo",
    size: "36 sqm",
    image: `https://picsum.photos/500/400?random=${i + 1}`,
}));

export default function Portfolio() {
    const [page, setPage] = useState(1);

    const perPage = 20;
    const totalPages = Math.ceil(projects.length / perPage);

    const start = (page - 1) * perPage;
    const currentProjects = projects.slice(start, start + perPage);

    return (
        <div className="bg-white">
            <div className="min-h-screen w-10/12 mx-auto">
                {/* HEADER */}
                <div className="text-center py-8 lg:py-12 md:py-10">
                    <Heading1 text="Our Portfolio" />
                    <p className="text-gray-500">
                        Explore our latest exhibition booth projects
                    </p>
                </div>

                {/* GRID */}
                <div className="pb-16">
                    <div className="grid gap-6
          grid-cols-1
          sm:grid-cols-1
          lg:grid-cols-2
          xl:grid-cols-3">

                        {currentProjects.map((p) => (
                            <Slide key={p.id} direction="down">
                            <div
                                
                                className="group bg-white border-primaryColor border hover:border-primaryColor-hover rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={p.image}
                                        className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800">{p.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{p.location}</p>
                                    <p className="text-sm text-gray-400">{p.size}</p>
                                    <Link href={`/portfolio/${p.id}`}>
                                        <button className="mt-4 text-primaryColor font-medium cursor-pointer hover:text-primaryColor-hover transition">
                                            View Project →
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            </Slide>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className={`px-5 py-2 rounded-lg border
              ${page === 1
                                    ? "text-gray-300 border-gray-200"
                                    : "text-primaryColor border-primaryColor hover:bg-primaryColor hover:text-white"
                                }`}
                        >
                            Previous
                        </button>

                        <span className="text-gray-600">
                            Page  <span className="text-primaryColor">{page}</span> of <span className="text-primaryColor">{totalPages}</span>
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className={`px-5 py-2 rounded-lg border
              ${page === totalPages
                                    ? "text-gray-300 border-gray-200"
                                    : "text-primaryColor border-primaryColor hover:bg-primaryColor hover:text-white"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
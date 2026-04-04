"use client";

import Heading1 from "@/components/Heading1";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Slide } from "react-awesome-reveal";
import axios from "axios";
import Image from "next/image";

// ✅ TYPES
type ProjectInfo = {
    clientName?: string;
    boothSize?: string;
    projectOverview?: string;
};

type PortfolioType = {
    _id: string;
    title: string;
    exhibition_name: string;
    slug: string;
    designImage: string;
    projectInfo?: ProjectInfo;
};

export default function Portfolio() {
    const [data, setData] = useState<PortfolioType[]>([]);
    const [page, setPage] = useState<number>(1);

    const perPage = 20;

    // ✅ Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<{ data: PortfolioType[] }>(
                    "/api/portfolio"
                );
                setData(res.data.data || []);
            } catch (err) {
                console.error("Error fetching portfolio:", err);
            }
        };

        fetchData();
    }, []);

    // ✅ Pagination Logic
    const totalPages = Math.ceil(data.length / perPage);
    const start = (page - 1) * perPage;
    const currentProjects = data.slice(start, start + perPage);

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
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {currentProjects.map((p) => (
                            <Slide key={p._id} direction="down">
                                <div className="group bg-white border border-primary hover:border-primary-hover rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">

                                    {/* IMAGE */}
                                    <div className="relative w-full h-52 overflow-hidden">
                                        <Image
                                            src={p.designImage}
                                            alt={`${p.title} exhibition booth design`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800">
                                            {p.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {p.exhibition_name}
                                        </p>

                                        <p className="text-sm text-gray-400">
                                            {p.projectInfo?.boothSize} sqm
                                        </p>

                                        <Link href={`/portfolio/${p.slug}`}>
                                            <button className="mt-4 text-primary font-medium hover:text-primary-hover transition cursor-pointer">
                                                View Project →
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Slide>
                        ))}
                    </div>

                    {/* EMPTY STATE */}
                    {data.length === 0 && (
                        <p className="text-center text-gray-400 mt-10">
                            No portfolio found
                        </p>
                    )}

                    {/* PAGINATION */}
                    {data.length > 0 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button
                                onClick={() => setPage((prev) => prev - 1)}
                                disabled={page === 1}
                                className={`px-5 py-2 rounded-lg border
                  ${page === 1
                                        ? "text-gray-300 border-gray-200"
                                        : "text-primary border-primary hover:bg-primary hover:text-white"
                                    }`}
                            >
                                Previous
                            </button>

                            <span className="text-gray-600">
                                Page{" "}
                                <span className="text-primary">{page}</span> of{" "}
                                <span className="text-primary">
                                    {totalPages}
                                </span>
                            </span>

                            <button
                                onClick={() => setPage((prev) => prev + 1)}
                                disabled={page === totalPages}
                                className={`px-5 py-2 rounded-lg border
                  ${page === totalPages
                                        ? "text-gray-300 border-gray-200"
                                        : "text-primary border-primary hover:bg-primary hover:text-white"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
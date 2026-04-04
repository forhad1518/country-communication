"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";

export default function SinglePortfolio({ data }: any) {
    const [pos, setPos] = useState<number>(50);

    return (
        <div className="bg-white min-h-screen">
            {/* HERO */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <Fade delay={300}>
                    <h1 className="text-4xl font-bold text-gray-800">
                        {data.title}
                    </h1>
                </Fade>

                <Slide>
                    <p className="text-gray-500 mt-2">
                        {data.exhibition_name}
                    </p>
                </Slide>

            </div>

            {/* INFO */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4 pb-16">
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Project Information
                    </h2>
                    <p>Client: {data.projectInfo?.clientName}</p>
                    <p>Booth Size: {data.projectInfo?.boothSize}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Exhibition Booth Overview
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {data.projectInfo?.projectOverview}
                    </p>
                </div>
            </div>

            {/* BEFORE AFTER */}
            <div className="max-w-5xl mx-auto px-4 pb-20">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Design vs Live Booth
                </h2>

                <div className="relative w-full h-100 overflow-hidden rounded-xl">
                    <Image
                        src={data.designImage}
                        alt={`${data.title} exhibition booth design Bangladesh`}
                        fill
                        className="object-cover"
                        priority
                    />

                    <div
                        className="absolute top-0 left-0 h-full overflow-hidden"
                        style={{ width: `${pos}%` }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={data.liveImage}
                                alt={`${data.title} live booth setup Bangladesh`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={pos}
                        onChange={(e) => setPos(Number(e.target.value))}
                        className="absolute bottom-4 w-full z-10"
                    />
                </div>
            </div>

            {/* GALLERY */}
            <div className="max-w-6xl mx-auto px-4 pb-24">
                <h2 className="text-2xl font-semibold mb-6">
                    Exhibition Booth Gallery
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <Fade cascade damping={0.1}>
                        {data.galleryImage?.map((img: string, i: number) => (
                            <div key={i} className="relative w-full h-60">
                                <Image
                                    src={img}
                                    alt={`exhibition booth design image ${i} Bangladesh`}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        ))}
                    </Fade>
                </div>
            </div>

            {/* KEYWORDS UI */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <h3 className="text-lg font-semibold mb-4">
                    Related Keywords
                </h3>

                <div className="flex flex-wrap gap-2">
                    {[
                        ...data.keywords,
                        "Exhibition Booth Design",
                        "Trade Show Booth",
                        "Expo Stall Design",
                        "Booth Fabrication Bangladesh",
                    ].map((k: string, i: number) => (
                        <span
                            key={i}
                            className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition"
                        >
                            {k}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
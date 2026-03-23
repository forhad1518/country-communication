"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";

const projects = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    title: `Exhibition Booth Project ${i + 1}`,
    client: "Square Pharmaceuticals",
    event: "Dhaka Expo 2025",
    location: "ICCB Dhaka",
    size: "36 sqm",
    year: "2025",
    description:
        "We designed and fabricated a modern exhibition booth focused on strong branding visibility, visitor engagement, and product display optimization.",
    before: `https://picsum.photos/800/500?random=${i + 200}`,
    after: `https://picsum.photos/800/500?random=${i + 300}`,
    gallery: [
        `https://picsum.photos/600/400?random=${i + 10}`,
        `https://picsum.photos/600/400?random=${i + 11}`,
        `https://picsum.photos/600/400?random=${i + 12}`,
        `https://picsum.photos/600/400?random=${i + 13}`,
        `https://picsum.photos/600/400?random=${i + 14}`,
        `https://picsum.photos/600/400?random=${i + 15}`,
    ],
}));

export default function SinglePortfolio() {
    const { id } = useParams();
    const projectId =
        typeof id === "string" ? parseInt(id, 10) : Array.isArray(id) && id.length ? parseInt(id[0], 10) : NaN;
    const project = projects.find((p) => p.id === projectId);

    const [pos, setPos] = useState<number>(50);

    if (!project) return <div>Project not found</div>;

    return (
        <div className="bg-white min-h-screen">
            {/* HERO */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <Fade delay={1e3} cascade damping={1e-1}>
                    <h1 className="text-4xl font-bold text-gray-800">
                        {project.title}
                    </h1>
                </Fade>
                <Slide>
                    <p className="text-gray-500 mt-2">
                        {project.event} — {project.location}
                    </p>
                </Slide>
            </div>

            {/* INFO */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4 pb-16">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Project Info</h2>
                    <p>Client: {project.client}</p>
                    <p>Booth Size: {project.size}</p>
                    <p>Year: {project.year}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {project.description}
                    </p>
                </div>
            </div>

            {/* BEFORE AFTER */}
            <div className="max-w-5xl mx-auto px-4 pb-20">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Before / After
                </h2>

                <div className="relative w-full h-100 overflow-hidden rounded-xl">
                    <img
                        src={project.before}
                        className="absolute w-full h-full object-cover"

                    />

                    <div
                        className="absolute top-0 left-0 h-full overflow-hidden"
                        style={{ width: `${pos}%` }}
                    >
                        <img
                            src={project.after}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={pos}
                        onChange={(e) => setPos(Number(e.target.value))}
                        className="absolute bottom-4 w-full"
                    />
                </div>
            </div>

            {/* GALLERY */}
            <div className="max-w-6xl mx-auto px-4 pb-24">
                <h2 className="text-2xl font-semibold mb-6">Gallery</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <Fade cascade damping={1e-1}>
                    {project.gallery.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            className="rounded-lg object-cover w-full h-60"
                        />
                    ))}
                    </Fade>
                </div>
            </div>
        </div>
    );
}
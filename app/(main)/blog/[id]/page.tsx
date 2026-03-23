"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BlogPage({ params }: { params: { id: string } }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const total =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const current = window.scrollY;
            setProgress((current / total) * 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-white">

            {/* READING PROGRESS */}
            <div
                style={{ width: `${progress}%` }}
                className="fixed top-0 left-0 h-1 bg-primaryColor z-50"
            />

            {/* HERO */}
            <div className="h-105 bg-gray-200 flex items-center justify-center">
                <h1 className="text-5xl font-bold">Blog Title</h1>
            </div>

            {/* ARTICLE */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto py-16 px-4"
            >
                <p className="text-lg text-gray-700">
                    Exhibition marketing content loaded from markdown...
                </p>

                {/* SHARE */}
                <div className="flex gap-4 mt-10">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">
                        Facebook
                    </button>
                    <button className="px-4 py-2 bg-sky-500 text-white rounded">
                        Twitter
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded">
                        WhatsApp
                    </button>
                </div>

                {/* AUTHOR */}
                <div className="mt-16 border-t pt-10 flex gap-6">
                    <div className="w-20 h-20 bg-gray-300 rounded-full" />
                    <div>
                        <h3 className="font-semibold text-xl">Iqbal Mahmud</h3>
                        <p className="text-gray-500">
                            Exhibition strategist with 10+ years experience.
                        </p>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
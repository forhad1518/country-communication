"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Client {
  _id: string;
  companyName: string;
  logo: string;
}

export default function OurClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Our-Client");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load clients");
        }
        const data = await res.json();
        const clientsData = data.data || data;
        setClients(clientsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Split into two rows (alternating)
  const row1 = clients.filter((_, i) => i % 2 === 0);
  const row2 = clients.filter((_, i) => i % 2 === 1);

  // Duplicate twice for seamless loop (enough for smooth scrolling)
  const row1Logos = [...row1, ...row1];
  const row2Logos = [...row2, ...row2];

  if (loading) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-black overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-black overflow-hidden">
        <div className="text-center text-red-400">Error: {error}</div>
      </section>
    );
  }

  if (clients.length === 0) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-black overflow-hidden">
        <div className="text-center text-gray-400">No clients yet.</div>
      </section>
    );
  }

  return (
      <div className="w-[95%] sm:w-[90%] lg:w-[85%] xl:w-[80%] max-w-400 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
        </motion.div>
        {/* Row 1 - Left to Right */}
        <div className="relative overflow-hidden mb-6 md:mb-8 py-2 md:py-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 sm:gap-6 md:gap-8"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                duration: 20, // slightly faster
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row1Logos.map((client, index) => (
              <div
                key={`${client._id}-${index}`}
                className="relative shrink-0 w-32 sm:w-40 md:w-44 lg:w-48 h-16 sm:h-18 md:h-20 bg-white backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 flex items-center justify-center p-2 sm:p-3 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={client.logo}
                    alt={client.companyName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 176px, 192px"
                  />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                  {client.companyName}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="relative overflow-hidden py-2 md:py-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 sm:gap-6 md:gap-8"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              x: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row2Logos.map((client, index) => (
              <div
                key={`${client._id}-${index}`}
                className="relative shrink-0 w-32 sm:w-40 md:w-44 lg:w-48 h-16 sm:h-18 md:h-20 bg-white backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 flex items-center justify-center p-2 sm:p-3 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={client.logo}
                    alt={client.companyName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 176px, 192px"
                  />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                  {client.companyName}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
  );
}

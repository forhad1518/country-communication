"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Heading1 from "@/components/Heading1";

// Demo client logos (replace with real logos)
const clientLogos1 = [
  { id: 1, name: "Samsung", logo: "https://picsum.photos/200/80?random=1" },
  { id: 2, name: "LG", logo: "https://picsum.photos/200/80?random=2" },
  { id: 3, name: "Sony", logo: "https://picsum.photos/200/80?random=3" },
  { id: 4, name: "Panasonic", logo: "https://picsum.photos/200/80?random=4" },
  { id: 5, name: "Toshiba", logo: "https://picsum.photos/200/80?random=5" },
  { id: 6, name: "Hitachi", logo: "https://picsum.photos/200/80?random=6" },
  { id: 7, name: "Sharp", logo: "https://picsum.photos/200/80?random=7" },
  { id: 8, name: "Philips", logo: "https://picsum.photos/200/80?random=8" },
];

const clientLogos2 = [
  { id: 9, name: "Nokia", logo: "https://picsum.photos/200/80?random=9" },
  { id: 10, name: "Ericsson", logo: "https://picsum.photos/200/80?random=10" },
  { id: 11, name: "Motorola", logo: "https://picsum.photos/200/80?random=11" },
  { id: 12, name: "Huawei", logo: "https://picsum.photos/200/80?random=12" },
  { id: 13, name: "Xiaomi", logo: "https://picsum.photos/200/80?random=13" },
  { id: 14, name: "Oppo", logo: "https://picsum.photos/200/80?random=14" },
  { id: 15, name: "Vivo", logo: "https://picsum.photos/200/80?random=15" },
  { id: 16, name: "OnePlus", logo: "https://picsum.photos/200/80?random=16" },
];

// Duplicate for seamless loop
const row1Logos = [...clientLogos1, ...clientLogos1];
const row2Logos = [...clientLogos2, ...clientLogos2];

export default function OurClients() {
  return (
    <section className="py-8 md:py-10 bg-black overflow-hidden">
      <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <Heading1 text="Our Valuable Clients" />
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Proud to work with leading brands across the globe
          </p>
        </motion.div>

        {/* Row 1 - Left to Right */}
        <div className="relative overflow-hidden mb-8 py-4">
          {/* Gradient Fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-linear-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-linear-to-l from-black to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-8"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row1Logos.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="shrink-0 w-45 h-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-center p-3 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={140}
                    height={60}
                    className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="relative overflow-hidden py-4">
          {/* Gradient Fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-linear-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-linear-to-l from-black to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-8"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row2Logos.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="shrink-0 w-45 h-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-center p-3 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={140}
                    height={60}
                    className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm mb-4">
            Join 200+ brands who trust us
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          >
            <span>Become Our Client</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

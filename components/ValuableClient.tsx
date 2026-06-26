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

// Duplicate for seamless loop - show more items on mobile
const row1Logos = [...clientLogos1, ...clientLogos1, ...clientLogos1];
const row2Logos = [...clientLogos2, ...clientLogos2, ...clientLogos2];

export default function OurClients() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-black overflow-hidden">
      <div className="w-[95%] sm:w-[90%] lg:w-[85%] xl:w-[80%] max-w-400 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <Heading1 text="Our Valuable Clients" />
          <p className="text-gray-400 mt-3 md:mt-4 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
            Proud to work with leading brands across the globe
          </p>
        </motion.div>

        {/* Row 1 - Left to Right */}
        <div className="relative overflow-hidden mb-6 md:mb-8 py-2 md:py-4">
          {/* Gradient Fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 bg-linear-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 bg-linear-to-l from-black to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-4 sm:gap-6 md:gap-8"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row1Logos.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="shrink-0 w-32 sm:w-40 md:w-44 lg:w-48 h-16 sm:h-18 md:h-20 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 flex items-center justify-center p-2 sm:p-3 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={50}
                    className="object-contain opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="relative overflow-hidden py-2 md:py-4">
          {/* Gradient Fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 bg-linear-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 bg-linear-to-l from-black to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-4 sm:gap-6 md:gap-8"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              x: {
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row2Logos.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="shrink-0 w-32 sm:w-40 md:w-44 lg:w-48 h-16 sm:h-18 md:h-20 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 flex items-center justify-center p-2 sm:p-3 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={50}
                    className="object-contain opacity-60 group-hover:opacity-80 transition-opacity duration-300"
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
          className="text-center mt-12 md:mt-16 lg:mt-20"
        >
          <p className="text-gray-500 text-xs sm:text-sm mb-3 md:mb-4">
            Join 200+ brands who trust us
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group text-sm sm:text-base"
          >
            <span>Become Our Client</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
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

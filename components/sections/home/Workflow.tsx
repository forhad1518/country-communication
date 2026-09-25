"use client";

import { useState, useEffect } from "react";
import Heading1 from "@/components/Heading1";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Maximize2,
  X,
  ArrowRight,
  Layers,
  FileCode2,
  Hammer,
} from "lucide-react";
import Link from "next/link";

// =========================================================================
// ASSETS IMPORTED BY USER
// =========================================================================

// Hero Assets
import hero01 from "@/public/images/workflow_asset/hero/hero01.png";
import hero02 from "@/public/images/workflow_asset/hero/hero02.png";

// 3D Design Assets
import threeD_1 from "@/public/images/workflow_asset/3d-design/3d design 01.png";
import threeD_2 from "@/public/images/workflow_asset/3d-design/3d design 02.png";
import threeD_3 from "@/public/images/workflow_asset/3d-design/3d design 03.png";
import threeD_4 from "@/public/images/workflow_asset/3d-design/3d design 04.png";

// Planning & Blueprint Assets
import planing_1 from "@/public/images/workflow_asset/planing/Production planning 01.png";
import planing_2 from "@/public/images/workflow_asset/planing/Production planning 02.png";
import planing_3 from "@/public/images/workflow_asset/planing/Production planning 03.png";
import planing_4 from "@/public/images/workflow_asset/planing/Production planning 04.png";

// Final Booth Execution Assets
import finalBooth1 from "@/public/images/workflow_asset/final-booth/Actual booth 01.png";
import finalBooth2 from "@/public/images/workflow_asset/final-booth/Actual booth 02.png";
import finalBooth3 from "@/public/images/workflow_asset/final-booth/Actual booth 03.png";
import finalBooth4 from "@/public/images/workflow_asset/final-booth/Actual booth 04.png";

// =========================================================================
// DATA CONFIGURATIONS
// =========================================================================

// Top Hero Showcase: 2 Wide Comparison Banners (100% Equal Height)
const heroShowcase = [
  {
    id: "hero-1",
    tag: "3D CAD & Spatial Engineering",
    title: "Isometric 3D Modeling with Dimensions",
    imageUrl: hero01.src,
  },
  {
    id: "hero-2",
    tag: "Technical Blueprint & Grid Planning",
    title: "2D Architectural Elevation & Grid Layout",
    imageUrl: hero02.src,
  },
];

// The 3 Core Process Columns (4 Clean Images per Column)
const processPhases = [
  {
    phaseNumber: "01",
    phaseTitle: "3D Design & Client Approval",
    icon: Layers,
    colorBadge: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    images: [
      { id: "p1-1", title: "3D Design - View 01", imageUrl: threeD_1.src },
      { id: "p1-2", title: "3D Design - View 02", imageUrl: threeD_2.src },
      { id: "p1-3", title: "3D Design - View 03", imageUrl: threeD_3.src },
      { id: "p1-4", title: "3D Design - View 04", imageUrl: threeD_4.src },
    ],
  },
  {
    phaseNumber: "02",
    phaseTitle: "Technical Drawings & Production Planning",
    icon: FileCode2,
    colorBadge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    images: [
      { id: "p2-1", title: "Production Planning - Sheet 01", imageUrl: planing_1.src },
      { id: "p2-2", title: "Production Planning - Sheet 02", imageUrl: planing_2.src },
      { id: "p2-3", title: "Production Planning - Sheet 03", imageUrl: planing_3.src },
      { id: "p2-4", title: "Production Planning - Sheet 04", imageUrl: planing_4.src },
    ],
  },
  {
    phaseNumber: "03",
    phaseTitle: "Fabrication, Installation & Final Booth",
    icon: Hammer,
    colorBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    images: [
      { id: "p3-1", title: "Actual Booth - View 01", imageUrl: finalBooth1.src },
      { id: "p3-2", title: "Actual Booth - View 02", imageUrl: finalBooth2.src },
      { id: "p3-3", title: "Actual Booth - View 03", imageUrl: finalBooth3.src },
      { id: "p3-4", title: "Actual Booth - View 04", imageUrl: finalBooth4.src },
    ],
  },
];

export default function Workflow() {
  // Lightbox Modal State
  const [activeImage, setActiveImage] = useState<{
    imageUrl: string;
    title: string;
  } | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    if (activeImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeImage]);

  return (
    <section className="py-12 md:py-20 bg-black relative overflow-hidden text-white">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/6 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <Heading1 text="Our Working Process" />
          <p className="text-gray-400 text-sm md:text-base -mt-4 max-w-2xl mx-auto leading-relaxed">
            From 3D architectural visualization and technical blueprints to precision factory fabrication and on-site booth delivery.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. TOP HERO SHOWCASE: 2 EQUAL-HEIGHT CARDS SIDE-BY-SIDE                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 lg:mb-16 items-stretch">
          {heroShowcase.map((hero, idx) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-teal-500/40 p-4 sm:p-5 shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              {/* Header Title (Aligned) */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Sparkles className="w-3 h-3" />
                  {hero.tag}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                  {hero.title}
                </span>
              </div>

              {/* Image Frame (Exact Equal Height on Both Cards) */}
              <div
                onClick={() =>
                  setActiveImage({
                    imageUrl: hero.imageUrl,
                    title: hero.title,
                  })
                }
                className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] rounded-xl overflow-hidden bg-black/70 border border-white/5 cursor-pointer shadow-inner flex items-center justify-center flex-1"
              >
                <img
                  src={hero.imageUrl}
                  alt={hero.title}
                  loading="lazy"
                  className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle Hover Zoom Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>View Full Image</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 2. THE 3 PROCESS COLUMNS (CLEAN & SIMPLE IMAGE SHOWCASE)                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {processPhases.map((phase, pIdx) => {
            const Icon = phase.icon;

            return (
              <div key={phase.phaseNumber} className="flex flex-col space-y-4">
                {/* Phase Header Card (100% Equal Height Across All 3 Columns) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: pIdx * 0.1 }}
                  className="h-[76px] sm:h-[82px] px-4 py-3 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 shadow-lg flex items-center justify-between text-center"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${phase.colorBadge}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                        Phase 0{pIdx + 1}
                      </span>
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug line-clamp-2">
                        {phase.phaseTitle}
                      </h3>
                    </div>
                  </div>
                </motion.div>

                {/* 4 Stacked Clean Image Cards for this Phase */}
                <div className="space-y-4">
                  {phase.images.map((item, imgIdx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: imgIdx * 0.07 + pIdx * 0.08 }}
                      onClick={() =>
                        setActiveImage({
                          imageUrl: item.imageUrl,
                          title: item.title,
                        })
                      }
                      className="group relative rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-500/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      {/* Clean Image Frame - Unobstructed Visual */}
                      <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/60 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Minimal Index Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 font-semibold shadow-xs">
                          {pIdx + 1}.{imgIdx + 1}
                        </div>

                        {/* Minimal Zoom Icon on Hover */}
                        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                          <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM CTA BANNER                                                      */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 lg:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-teal-500/5 to-primary/10 border border-white/10 text-center relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to Turn Your Exhibition Vision into Reality?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Our architects, estimators, and in-house carpenters build the physical booth to 100% precision of the approved 3D design.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/get-free-quote"
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2"
              >
                <span>Get a Free Booth Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/15 transition-all"
              >
                Explore All Portfolio Builds
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. HIGH-RESOLUTION LIGHTBOX MODAL                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
            {/* Backdrop Click to Close */}
            <div
              className="absolute inset-0"
              onClick={() => setActiveImage(null)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 max-w-4xl w-full bg-gray-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/40">
                <h3 className="text-base font-bold text-white">
                  {activeImage.title}
                </h3>
                <button
                  onClick={() => setActiveImage(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* High-Res Image Display */}
              <div className="p-3 sm:p-5 bg-black/80 flex items-center justify-center max-h-[75vh] overflow-hidden">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain border border-white/10 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

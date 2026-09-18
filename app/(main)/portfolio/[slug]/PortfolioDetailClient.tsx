"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Heart,
  Share2,
  ChevronLeft,
  Eye,
  ArrowUp,
  CheckCircle,
  Link2,
  Users,
  Target,
  Building2,
  Wrench,
  Quote,
  BookOpen,
  Grid,
  Layers,
  Award,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  X,
  ChevronRight,
  Menu,
  Tag,
  TrendingUp,
  Maximize2,
  Minimize2,
  MoveHorizontal,
} from "lucide-react";

// ---- Social Icons ----
const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-500"
  >
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);
const TwitterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-sky-500"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-600"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-green-500"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.32-1.41c1.48.8 3.15 1.22 4.87 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.9z" />
    <path
      d="M17.5 14.5c-.3.85-1.5 1.55-2.45 1.65-.65.07-1.45-.15-3.05-1.05-2.55-1.45-4.2-4.15-4.35-4.35-.15-.2-1.05-1.4-1.05-2.65 0-1.25.65-1.85.9-2.1.25-.25.55-.3.75-.3h.55c.2 0 .4 0 .5.4.2.4.65 1.6.7 1.7.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.35-.45.45-.15.15-.3.3-.1.55.4.65 1.05 1.35 2 1.85 1.2.65 1.8.85 2.1.75.3-.1.45-.35.6-.6.15-.25.25-.4.4-.35.15.05.95.45 1.1.55.15.1.25.15.3.25.05.1.05.35-.1.7z"
      fill="#ffffff"
    />
  </svg>
);

// ---- Types ----
type ImageItem = { url: string; publicId: string; _id?: string };
type PortfolioType = {
  _id: string;
  title: string;
  exhibition_name: string;
  slug: string;
  projectInfo?: {
    clientName?: string;
    boothSize?: string;
    location?: string;
    buildTime?: string;
    overview?: string;
  };
  process?: {
    rendersImages?: ImageItem[];
    realImages?: ImageItem[];
    moodboardImages?: ImageItem[];
    processText?: string;
  };
  materials?: string[];
  technologies?: string[];
  execution?: string;
  objective?: string;
  challenges?: string;
  results?: {
    visitors?: string;
    engagement?: string;
    testimonial?: string;
    clientName?: string;
    clientImage?: ImageItem;
  };
  keywords?: string[];
  views?: number;
  likes?: number;
  createdAt?: string;
};

// ---- Helpers ----
const getOptimizedUrl = (url: string, w = 800, h = 600): string => {
  if (!url) return "";
  if (url.includes("cloudinary.com"))
    return url.replace(
      "/upload/",
      `/upload/w_${w},h_${h},c_fill,q_auto,f_auto/`,
    );
  return url;
};
const formatDate = (d?: string): string =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

// ---- Before/After Slider (Responsive Device Fit, Drag & Click, Both Badges) ----
const BeforeAfterSlider = ({
  before,
  after,
}: {
  before: string;
  after: string;
}) => {
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Smooth sinusoidal preview sweep on initial load
  useEffect(() => {
    let start: number | null = null;
    const duration = 2200;
    let cancelled = false;

    const animatePreview = (timestamp: number) => {
      if (cancelled) return;
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth sine wave motion: 50 -> 36 -> 64 -> 50
      const offset = Math.sin(progress * Math.PI * 2) * 14;
      setPos(50 + offset);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animatePreview);
      } else {
        setPos(50);
      }
    };

    const timer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animatePreview);
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPos = (clampedX / rect.width) * 100;
    setPos(newPos);
  }, []);

  const startDrag = useCallback(
    (clientX: number) => {
      stopAnimation();
      setHasInteracted(true);
      isDraggingRef.current = true;
      setIsDragging(true);
      handleMove(clientX);
    },
    [handleMove],
  );

  // Global window listeners so dragging never gets stuck or lost
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      handleMove(e.clientX);
    };

    const onPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [handleMove]);

  // Click or drag from anywhere on the photo
  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    startDrag(e.clientX);
  };

  // Click or drag directly on the divider bar or knob
  const handleBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    startDrag(e.clientX);
  };

  return (
    <div className="relative group w-full">
      <div
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[78vh] min-h-[260px] sm:min-h-[360px] md:min-h-[440px] rounded-2xl md:rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl bg-neutral-950 touch-none"
      >
        {/* Ambient Blurred Background (keeps luxury ambient lighting when fitMode is contain) */}
        {fitMode === "contain" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 blur-3xl scale-110">
            <Image
              src={after || before}
              alt=""
              fill
              sizes="100vw"
              draggable={false}
              className="object-cover pointer-events-none"
              priority
            />
          </div>
        )}

        {/* 1. Base Layer: 3D Render Image (Left Side from 0 to pos) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src={before}
            alt="3D Image"
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            draggable={false}
            className={`transition-all duration-300 pointer-events-none ${
              fitMode === "contain" ? "object-contain" : "object-cover"
            }`}
            priority
          />
        </div>

        {/* 2. Top Layer: Real Image (Right Side from pos to 100) */}
        <div
          className={`absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none ${
            isDragging ? "" : "transition-[clip-path] duration-150 ease-out"
          }`}
          style={{
            clipPath: `inset(0 0 0 ${pos}%)`,
            willChange: "clip-path",
          }}
        >
          {fitMode === "contain" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 blur-3xl scale-110">
              <Image
                src={after}
                alt=""
                fill
                sizes="100vw"
                draggable={false}
                className="object-cover pointer-events-none"
                priority
              />
            </div>
          )}

          <Image
            src={after}
            alt="Real Image"
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            draggable={false}
            className={`transition-all duration-300 pointer-events-none ${
              fitMode === "contain" ? "object-contain" : "object-cover"
            }`}
            priority
          />
        </div>

        {/* 3. Badges (Both permanently visible on top of their respective image zones) */}
        {/* 3D Image Badge (Left) */}
        <div
          className={`absolute top-4 left-4 z-20 pointer-events-none transition-opacity duration-200 ${
            pos < 18 ? "opacity-20" : "opacity-100"
          }`}
        >
          <span className="px-3.5 py-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>3D Image</span>
          </span>
        </div>

        {/* Real Image Badge (Right) */}
        <div
          className={`absolute top-4 right-4 z-20 pointer-events-none transition-opacity duration-200 ${
            pos > 82 ? "opacity-20" : "opacity-100"
          }`}
        >
          <span className="px-3.5 py-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real Image</span>
          </span>
        </div>

        {/* 4. Divider Line & Interactive Handle Bar (Draggable directly and clickable) */}
        <div
          className={`absolute top-0 bottom-0 z-30 cursor-ew-resize select-none ${
            isDragging ? "" : "transition-[left] duration-150 ease-out"
          }`}
          style={{
            left: `${pos}%`,
            willChange: "left",
          }}
          onPointerDown={handleBarPointerDown}
        >
          {/* Wider invisible grab target for easy grabbing */}
          <div className="absolute top-0 bottom-0 -left-5 w-10 cursor-ew-resize" />

          {/* Vertical Glowing Divider Line */}
          <div className="absolute top-0 bottom-0 -left-[1.5px] w-[3px] bg-gradient-to-b from-white/95 via-primary to-white/95 shadow-[0_0_14px_rgba(255,255,255,0.8)] pointer-events-none" />

          {/* Handle Knob with grab cursor and hover scale */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white text-neutral-900 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex items-center justify-center border-2 border-primary/50 ring-4 ring-black/40 cursor-grab active:cursor-grabbing select-none transition-transform duration-150 ${
              isDragging ? "scale-115 ring-primary/60 shadow-primary/40 cursor-grabbing" : "hover:scale-110"
            }`}
          >
            <MoveHorizontal className="w-5 h-5 text-neutral-800 pointer-events-none" />
          </div>
        </div>

        {/* 5. Controls Overlay: Fit/Fill Toggle */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFitMode((m) => (m === "contain" ? "cover" : "contain"));
            }}
            className="px-3 py-1.5 bg-black/75 hover:bg-black/95 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/20 hover:border-primary/50 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
            title={fitMode === "contain" ? "Switch to Fill Screen" : "Switch to Fit Whole Image"}
          >
            {fitMode === "contain" ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Fit Whole Image</span>
                <span className="sm:hidden">Fit</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Fill Screen</span>
                <span className="sm:hidden">Fill</span>
              </>
            )}
          </button>
        </div>

        {/* 6. Hint label */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 ${
            hasInteracted ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="bg-black/75 backdrop-blur-md text-gray-200 px-4 py-1.5 rounded-full text-xs border border-white/15 shadow-lg flex items-center gap-1.5">
            <MoveHorizontal className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Drag bar or click photo to compare</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Share Button ----
const ShareButton = ({ title, url }: { title: string; url: string }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  };
  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-primary/50 transition-colors cursor-pointer"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-12 bg-gray-900 border border-white/10 rounded-xl p-2 shadow-xl z-20 min-w-48"
          >
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <FacebookIcon /> Facebook
            </a>
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <TwitterIcon /> Twitter
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <LinkedinIcon /> LinkedIn
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => {
                navigator.clipboard?.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 text-gray-400" /> Copy Link
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---- Accordion Menu Item ----
const AccordionItem = ({
  id,
  label,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: any) => {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 text-white">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-medium">{label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-gray-300 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---- Full Width Image Gallery ----
const FullWidthGallery = ({
  images,
  title,
}: {
  images: ImageItem[];
  title: string;
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="space-y-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/30"
          >
            <Image
              src={getOptimizedUrl(img.url, 1200, 700)}
              alt={`${title} ${index + 1}`}
              fill
              className="object-contain bg-black/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
// ---- Skeleton ----
const DetailSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-[60vh] bg-gray-800 rounded-3xl" />
    <div className="space-y-4">
      <div className="h-8 bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-800 rounded w-1/2" />
    </div>
  </div>
);
type Props = {
  params: Promise<{ slug: string }>;
};
// ===== MAIN COMPONENT =====
export default function PortfolioDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  useEffect(() => {
    fetchPortfolio(slug);
  }, [slug]);

  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [similarProjects, setSimilarProjects] = useState<PortfolioType[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Fetch portfolio detail
  useEffect(() => {
    if (slug) fetchPortfolio(slug);
  }, [slug]);

  const fetchPortfolio = async (s: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/portfolio/${s}`);
      const data = res.data.data;
      setPortfolio(data);
      setLikesCount(data.likes || 0);
      const liked = JSON.parse(localStorage.getItem("likedPortfolios") || "{}");
      if (liked[data.slug]) setIsLiked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch similar projects based on exhibition_name
  useEffect(() => {
    if (portfolio?.exhibition_name) {
      axios
        .get(
          `/api/portfolio?exhibition=${encodeURIComponent(portfolio.exhibition_name)}&limit=10`,
        )
        .then((res) => {
          const all = res.data.data || [];
          const filtered = all.filter(
            (p: PortfolioType) => p.slug !== portfolio.slug,
          );
          setSimilarProjects(filtered.slice(0, 4));
        })
        .catch(console.error);
    }
  }, [portfolio?.exhibition_name, portfolio?.slug]);

  // Track view once
  useEffect(() => {
    if (portfolio?.slug) {
      const viewed = sessionStorage.getItem(`viewed_${portfolio.slug}`);
      if (!viewed) {
        axios
          .post(`/api/portfolio/${portfolio.slug}/like`, { action: "view" })
          .catch(console.error);
        sessionStorage.setItem(`viewed_${portfolio.slug}`, "true");
      }
    }
  }, [portfolio?.slug]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = async () => {
    if (!portfolio) return;
    const action = isLiked ? "unlike" : "like";
    setIsLiked(!isLiked);
    setLikesCount((prev) =>
      action === "like" ? prev + 1 : Math.max(0, prev - 1),
    );
    try {
      const res = await axios.post(`/api/portfolio/${portfolio.slug}/like`, {
        action,
      });
      setLikesCount(res.data.likes);
      const liked = JSON.parse(localStorage.getItem("likedPortfolios") || "{}");
      isLiked ? delete liked[portfolio.slug] : (liked[portfolio.slug] = true);
      localStorage.setItem("likedPortfolios", JSON.stringify(liked));
    } catch {
      setIsLiked(isLiked);
      setLikesCount(portfolio.likes || 0);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build accordion items
  const accordionItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BookOpen,
      content: portfolio?.projectInfo?.overview,
      show: !!portfolio?.projectInfo?.overview,
    },
    {
      id: "brief",
      label: "Brief",
      icon: Target,
      content: portfolio?.objective,
      show: !!portfolio?.objective,
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: TrendingUp,
      content: portfolio?.challenges,
      show: !!portfolio?.challenges,
    },
    {
      id: "materials",
      label: "Materials & Technology",
      icon: Wrench,
      content: (
        <div className="space-y-4">
          {(portfolio?.materials?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-primary mb-2">
                Materials
              </h4>
              <div className="flex flex-wrap gap-2">
                {portfolio?.materials?.map((m, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(portfolio?.technologies?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-accent mb-2">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {portfolio?.technologies?.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      show: !!(portfolio?.materials?.length || portfolio?.technologies?.length),
    },
    {
      id: "execution",
      label: "Execution",
      icon: Grid,
      content: portfolio?.execution,
      show: !!portfolio?.execution,
    },
    {
      id: "results",
      label: "Results & Testimonials",
      icon: Award,
      content: (
        <div className="space-y-4">
          {(portfolio?.results?.visitors || portfolio?.results?.engagement) && (
            <div className="grid grid-cols-2 gap-4">
              {portfolio.results.visitors && (
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">
                    {portfolio.results.visitors}+
                  </p>
                  <p className="text-xs text-gray-400">Visitors</p>
                </div>
              )}
              {portfolio.results.engagement && (
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-accent mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">
                    {portfolio.results.engagement}
                  </p>
                  <p className="text-xs text-gray-400">Engagement</p>
                </div>
              )}
            </div>
          )}
          {(portfolio?.results?.testimonial ||
            portfolio?.results?.clientName) && (
            <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20 relative">
              <Quote className="w-8 h-8 text-primary/30 absolute top-3 left-3" />
              {portfolio.results.clientImage?.url && (
                <div className="flex justify-center mb-3">
                  <Image
                    src={getOptimizedUrl(
                      portfolio.results.clientImage.url,
                      80,
                      80,
                    )}
                    alt=""
                    width={60}
                    height={60}
                    className="rounded-full object-cover border-2 border-primary/30"
                  />
                </div>
              )}
              {portfolio.results.testimonial && (
                <p className="text-white text-sm italic text-center leading-relaxed mb-2">
                  "{portfolio.results.testimonial}"
                </p>
              )}
              {portfolio.results.clientName && (
                <p className="text-primary text-sm font-semibold text-center">
                  — {portfolio.results.clientName}
                </p>
              )}
            </div>
          )}
        </div>
      ),
      show: !!(
        portfolio?.results?.visitors ||
        portfolio?.results?.engagement ||
        portfolio?.results?.testimonial
      ),
    },
  ].filter((item) => item.show);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <DetailSkeleton />
      </div>
    );
  if (!portfolio)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Not found
      </div>
    );

  const beforeImage = portfolio.process?.rendersImages?.[0]?.url || "";
  const afterImage = portfolio.process?.realImages?.[0]?.url || "";
  const heroImage =
    portfolio.process?.rendersImages?.[0]?.url ||
    portfolio.process?.realImages?.[0]?.url ||
    "";

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Progress bar */}
      <motion.div
        style={{ width: `${progress}%` }}
        className="fixed top-0 left-0 h-1 bg-linear-to-r from-primary to-accent z-50"
      />

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 p-3 bg-primary text-white rounded-full shadow-lg cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-[95%] sm:w-[92%] lg:w-[90%] max-w-400 mx-auto">
        {/* Back button */}
        <div className="pt-6 pb-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors cursor-pointer text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <Link
            href="/portfolio"
            className="text-gray-400 hover:text-primary transition-colors text-sm"
          >
            All Projects
          </Link>
        </div>

        {/* Hero: Full width Before/After slider */}
        <section className="pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {beforeImage && afterImage ? (
              <BeforeAfterSlider before={beforeImage} after={afterImage} />
            ) : (
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[78vh] min-h-[260px] sm:min-h-[360px] md:min-h-[440px] border border-white/10 shadow-2xl bg-neutral-950 flex items-center justify-center">
                {/* Ambient Blurred Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 blur-3xl scale-110">
                  <Image
                    src={getOptimizedUrl(heroImage, 600, 300)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <Image
                  src={getOptimizedUrl(heroImage, 1400, 800)}
                  alt={portfolio.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              </div>
            )}
          </motion.div>
        </section>

        {/* Title & Meta + Like/Share (Row) */}
        <section className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-primary/90 text-white text-xs font-medium rounded-full mb-3">
                {portfolio.exhibition_name}
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                {portfolio.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(portfolio.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {portfolio.views || 0}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  {likesCount}
                </span>
                {portfolio.projectInfo?.clientName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {portfolio.projectInfo.clientName}
                  </span>
                )}
                {portfolio.projectInfo?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {portfolio.projectInfo.location}
                  </span>
                )}
                {portfolio.projectInfo?.boothSize && (
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    {portfolio.projectInfo.boothSize}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 lg:flex-col lg:items-end">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer text-sm ${isLiked ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50"}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />{" "}
                {likesCount}
              </button>
              <ShareButton
                title={portfolio.title}
                url={typeof window !== "undefined" ? window.location.href : ""}
              />
            </div>
          </div>
        </section>

        {/* Main Content: Accordion + Sidebar Similar Projects */}
        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          {/* Left: Accordion Sections */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              {accordionItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  isOpen={openSections[item.id] || false}
                  onToggle={toggleSection}
                >
                  {item.content}
                </AccordionItem>
              ))}
            </div>

            {/* Image Galleries - Full Width (no grid) */}
            <div className="mt-8 space-y-10">
              {(portfolio.process?.moodboardImages?.length ?? 0) > 0 && (
                <FullWidthGallery
                  images={portfolio.process?.moodboardImages ?? []}
                  title="🎨 Moodboard"
                />
              )}
              {(portfolio.process?.rendersImages?.length ?? 0) > 0 && (
                <FullWidthGallery
                  images={portfolio.process?.rendersImages ?? []}
                  title="🎯 3D Renders"
                />
              )}
              {(portfolio.process?.realImages?.length ?? 0) > 0 && (
                <FullWidthGallery
                  images={portfolio.process?.realImages ?? []}
                  title="📸 Real Images"
                />
              )}
            </div>

            {/* Keywords */}
            {portfolio.keywords && portfolio.keywords.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Similar Projects */}
          <div className="lg:col-span-1">
            {similarProjects.length > 0 && (
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Similar Projects
                </h3>
                <div className="space-y-3">
                  {similarProjects.map((p) => (
                    <Link
                      key={p._id}
                      href={`/portfolio/${p.slug}`}
                      className="block group bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={getOptimizedUrl(
                              p.process?.rendersImages?.[0]?.url ||
                                p.process?.realImages?.[0]?.url ||
                                "",
                              100,
                              100,
                            )}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {p.title}
                          </h4>
                          <p className="text-gray-400 text-xs truncate">
                            {p.exhibition_name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {p.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {p.likes || 0}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

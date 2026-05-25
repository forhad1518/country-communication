"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import axios from "axios";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import Image from "next/image";

// Types
type SliderItem = {
  _id: string;
  image: {
    url: string;
    publicId: string;
  };
  comment: string;
  isActive: boolean;
  order: number;
};

export default function TripleSlider() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH SLIDERS FROM API =====
  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("/api/slider");
      // API returns only active sliders sorted by order
      const activeSlides = (res.data.data || []).filter(
        (slide: SliderItem) => slide.isActive && slide.image?.url,
      );
      setSlides(activeSlides);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  // If no slides or loading, show nothing
  if (loading) {
    return (
      <section className="relative flex items-center justify-center overflow-hidden bg-black py-5">
        <div className="w-10/12 max-w-7xl">
          <div className="relative h-[calc(30vh)] md:h-[calc(40vh)] lg:h-[calc(100vh-100px)] rounded-3xl bg-gray-800 animate-pulse" />
        </div>
      </section>
    );
  }

  // If no slides, don't render
  if (slides.length === 0) return null;

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-black py-5">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Swiper
        effect={"coverflow"}
        centeredSlides={true}
        slidesPerView={"auto"}
        slideToClickedSlide={true}
        loop={slides.length > 1}
        speed={3000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 250,
          modifier: 2.5,
          slideShadows: false,
        }}
        className="w-10/12 max-w-7xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative h-[calc(30vh)] md:h-[calc(40vh)] lg:h-[calc(100vh-100px)] rounded-3xl overflow-hidden">
              <Image
                src={slide.image.url}
                alt={slide.comment || "slider"}
                fill
                className="object-cover"
                unoptimized
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Comment/Title */}
              {slide.comment && (
                <div className="absolute bottom-10 left-10 text-white z-10">
                  <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                    {slide.comment}
                  </h2>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Styling */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: #009999 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </section>
  );
}

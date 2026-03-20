"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import Image from "next/image";

import slide1 from "@/public/images/hero/hero1.jpeg";
import slide2 from "@/public/images/hero/hero2.jpeg";
import slide3 from "@/public/images/hero/hero3.jpeg";
import slide4 from "@/public/images/hero/hero4.jpeg";

export default function TripleSlider() {

    const slides = [
        { img: slide1, title: "Creative Design" },
        { img: slide2, title: "Modern Booth" },
        { img: slide3, title: "Exhibition Setup" },
        { img: slide4, title: "Brand Experience" }
    ];

    return (
        <section className="relative flex items-center justify-center overflow-hidden">

            <Swiper
                effect={"coverflow"}
                centeredSlides={true}
                slidesPerView={"auto"}
                slideToClickedSlide={true}
                loop={true}
                speed={3000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
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

                {slides.map((slide, index) => (

                    <SwiperSlide
                        key={index}
                        // className="w-[70%]! md:w-[50%]! lg:w-[40%]!"
                        // className="overflow-hidden"
                    >

                        <div className="relative h-[calc(30vh)] md:h-[calc(40vh)] lg:h-[calc(100vh-100px)] rounded-3xl overflow-x-hidden">

                            <Image
                                src={slide.img}
                                alt="slide"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0"></div>

                            <div className="absolute bottom-10 left-10 text-white">
                                <h2 className="text-3xl font-bold">
                                    {slide.title}
                                </h2>
                            </div>

                        </div>

                    </SwiperSlide>

                ))}

            </Swiper>

        </section>
    );
}
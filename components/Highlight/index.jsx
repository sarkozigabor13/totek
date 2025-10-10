"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper";

const HighlightComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);

  const images = [
    "/images/highlight/totek01_pixel.png",
    "/images/highlight/totek02_pixel.png",
    "/images/footer/palya.png",
  ];

  useEffect(() => {
    setMounted(true);
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 },
    );

    observer.observe(section);
    return () => observer.unobserve(section);
  }, []);

  return (
    <>
      {/* Global dark overlay */}
      {mounted &&
        createPortal(
          <div
            className={`hello pointer-events-none fixed inset-0 z-[5] bg-black transition-opacity duration-700 ${
              isVisible ? "opacity-93" : "opacity-0"
            }`}
            style={{zIndex: 11111}}
          />,
          document.body,
        )}
      <section
        ref={sectionRef}
        className="bg-blacksection relative flex h-[50vh] w-full items-center justify-center overflow-hidden py-20 transition-all duration-700"
      >
        {/* Light beams */}
        <div
          className={`pointer-events-none absolute top-10 left-[110px] z-0 z-11 h-full w-30 rotate-[-36deg] rounded-[50px] bg-gradient-to-b from-yellow-300/40 to-transparent transition-opacity duration-700 lg:top-0 lg:left-[300px] lg:w-54 lg:rotate-[-45deg] ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{zIndex: 11114}}
        />
        <div
          className={`pointer-events-none top-0 left-[300px] z-0 z-11 hidden h-full w-30 rotate-[-30deg] rounded-[50px] bg-gradient-to-b from-yellow-300/40 to-transparent transition-opacity duration-700 lg:absolute lg:block ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{zIndex: 11114}}
        />

        <div
          className={`pointer-events-none top-0 left-[300px] z-0 z-11 hidden h-full w-30 rotate-[-20deg] rounded-[50px] bg-gradient-to-b from-yellow-300/40 to-transparent transition-opacity duration-700 lg:absolute lg:block ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{zIndex: 11114}}
        />
        <div
          className={`pointer-events-none absolute top-10 right-[110px] z-0 z-11 h-full w-35 rotate-[45deg] rounded-[50px] bg-gradient-to-b from-yellow-300/40 to-transparent transition-opacity duration-700 lg:top-0 lg:right-[300px] lg:w-54 lg:rotate-[45deg] ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{zIndex: 11114}}
        />
        <div
          className={`pointer-events-none top-0 right-[300px] z-0 z-11 hidden h-full w-30 rotate-[30deg] rounded-[50px] bg-gradient-to-b from-yellow-300/40 to-transparent transition-opacity duration-700 lg:absolute lg:block ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{zIndex: 11114}}
        />

        <div
          className={`pointer-events-none top-0 right-[300px] z-0 z-11 hidden h-full w-30 rotate-[20deg] rounded-[50px] bg-gradient-to-b from-yellow-300/40 to-transparent transition-opacity duration-700 lg:absolute lg:block ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{zIndex: 11114}}
        />

        {/* Carousel */}
        <div
          className={`relative flex h-[50vh] w-full items-center justify-center overflow-hidden py-20 transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          } `}
          style={{zIndex: 11112}}
        >
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop={true}
            className={`z-5 h-full w-5/7 lg:w-2/3`}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`slide-${i}`}
                  className="h-full w-full rounded-lg object-cover shadow-lg grayscale-100"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Spotlights */}
        <img
          src="/images/highlight/stadium-light-preview-removebg-preview.png"
          alt="left spotlight"
          className={`absolute top-[200px] lg:top-[300px] left-[-150px] z-10 h-84 -translate-y-1/2 transition-opacity duration-700 lg:left-[-100px] lg:h-164 ${
            isVisible ? "opacity-100" : "opacity-100"
          }`}
          style={{
            transform: "scale(-1, 1)",
            zIndex: 11113
          }}
        />
        <img
          src="/images/highlight/stadium-light-preview-removebg-preview.png"
          alt="right spotlight"
          className={`absolute top-[200px] lg:top-[300px] right-[-150px] z-10 h-84 -translate-y-1/2 transition-opacity duration-700 lg:right-[-100px] lg:h-164 ${
            isVisible ? "opacity-100" : "opacity-100"
          }`}
          style={{zIndex: 11113}}
        />
      </section>
    </>
  );
};

export default HighlightComponent;

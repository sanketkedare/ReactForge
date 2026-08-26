"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IMAGES } from "./utils";
import { BiArrowBack } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const rightSlider = useCallback(() => {
    setCurrentIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
  }, []);

  const leftSlider = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    intervalRef.current = setInterval(rightSlider, 3000);
  }, [rightSlider, stopAutoSlide]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  const prevIndex = currentIndex === 0 ? IMAGES.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === IMAGES.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="w-full">
      <h1 className="text-center mt-10 font-bold text-2xl">Image Slider</h1>

      <div className="flex w-[90%] lg:w-[80%] m-auto justify-center items-center gap-4 lg:gap-10 mt-6">
        <BiArrowBack
          onClick={leftSlider}
          className="text-4xl lg:text-5xl rounded-full border p-2 font-bold cursor-pointer bg-yellow-500 text-black hover:bg-sky-400 shrink-0 transition-colors"
          aria-label="Previous Slide"
        />

        <div className="relative w-full h-[350px] lg:h-[450px] flex justify-center items-center overflow-hidden">
          {/* Previous Image */}
          <motion.img
            src={IMAGES[prevIndex]}
            className="absolute left-2 lg:left-10 w-[180px] lg:w-[300px] h-[150px] lg:h-[250px] opacity-40 z-10 rounded-md object-cover"
            style={{ transform: "scale(0.85)" }}
            alt="Previous Slide"
          />

          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={IMAGES[currentIndex]}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
              className="w-[300px] sm:w-[450px] lg:w-[600px] h-[260px] sm:h-[320px] lg:h-[400px] z-30 rounded-lg shadow-2xl border object-cover"
              alt={`Slide ${currentIndex + 1}`}
              onMouseEnter={stopAutoSlide}
              onMouseLeave={startAutoSlide}
            />
          </AnimatePresence>

          {/* Next Image */}
          <motion.img
            src={IMAGES[nextIndex]}
            className="absolute right-2 lg:right-10 w-[180px] lg:w-[300px] h-[150px] lg:h-[250px] opacity-40 z-10 rounded-md object-cover"
            style={{ transform: "scale(0.85)" }}
            alt="Next Slide"
          />
        </div>

        <BsArrowRight
          onClick={rightSlider}
          className="text-4xl lg:text-5xl rounded-full border p-2 font-bold cursor-pointer bg-yellow-500 text-black hover:bg-sky-400 shrink-0 transition-colors"
          aria-label="Next Slide"
        />
      </div>
    </div>
  );
};

export default ImageSlider;

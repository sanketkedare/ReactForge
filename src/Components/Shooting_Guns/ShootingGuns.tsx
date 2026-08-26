"use client";

import React, { useRef, useState } from "react";
import SingleGun from "./SingleGun";

export const ShootingGuns: React.FC = () => {
  const [totalShots, setTotalShots] = useState<number>(0);
  const [throttleShots, setThrottleShots] = useState<number>(0);
  const [debounceShots, setDebounceShots] = useState<number>(0);

  // Use refs for timers to persist correctly across renders
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDebounce = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebounceShots((prev) => prev + 1);
    }, 1000);
  };

  const handleThrottle = () => {
    if (throttleTimeoutRef.current) return;
    throttleTimeoutRef.current = setTimeout(() => {
      setThrottleShots((prev) => prev + 1);
      throttleTimeoutRef.current = null;
    }, 1000);
  };

  const handleBulletShot = () => {
    setTotalShots((prev) => prev + 1);
    handleThrottle();
    handleDebounce();
  };

  return (
    <div className="w-[80%] m-auto mt-10">
      <h1 className="lg:text-3xl text-xl text-center font-semibold">
        Shooting Guns (Debouncing & Throttling)
      </h1>
      <div className="p-2 mt-6 grid lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 border rounded-xl bg-gray-800 bg-opacity-40">
          <span className="text-xl font-bold mb-4">Click to Fire!</span>
          <button
            onClick={handleBulletShot}
            className="lg:w-[90px] w-[70px] h-[70px] lg:h-[90px] rounded-full bg-red-500 hover:bg-red-600 active:scale-95 cursor-pointer flex justify-center items-center p-2 text-white font-bold shadow-2xl transition-all"
            aria-label="Shoot Gun Trigger"
          >
            FIRE
          </button>
        </div>

        <div className="lg:col-span-3">
          {/* Normal Gun */}
          <SingleGun
            type="Normal Gun"
            shots={totalShots}
            message="Shoots every time you click the button (immediate firing)."
          />

          {/* Throttling Gun */}
          <SingleGun
            type="Throttling Gun"
            shots={throttleShots}
            message="Shoots at most once every 1 second, even with rapid clicks."
          />

          {/* Debouncing Gun */}
          <SingleGun
            type="Debouncing Gun"
            shots={debounceShots}
            message="Shoots only after 1 second of inactivity after clicking stops."
          />
        </div>
      </div>
    </div>
  );
};

export default ShootingGuns;

"use client";

import React, { useEffect, useState } from "react";

// Static light pattern component
export const StaticLights: React.FC = () => (
  <div className="text-black h-full bg-yellow-400 border rounded-xl" />
);

interface DynamicLightProps {
  duration: number;
  pause: boolean;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

// Fading light pattern with adjustable duration
export const FadingLights: React.FC<DynamicLightProps> = ({
  duration,
  pause,
  setDuration,
}) => {
  const [opacity, setOpacity] = useState<number>(0);

  useEffect(() => {
    if (!pause) {
      const interval = setInterval(() => {
        setOpacity((prev) => (prev >= 1 ? 0.1 : prev + 0.05));
      }, Math.max(duration, 1) * 100);

      return () => clearInterval(interval);
    }
  }, [pause, duration]);

  useEffect(() => {
    if (duration <= 0) setDuration(1);
  }, [duration, setDuration]);

  return (
    <div
      className="h-full bg-yellow-400 border rounded-xl transition-opacity duration-100"
      style={{ opacity }}
    />
  );
};

// Blinking light pattern with adjustable duration
export const BlinkingLights: React.FC<DynamicLightProps> = ({
  duration,
  pause,
  setDuration,
}) => {
  const [opacity, setOpacity] = useState<number>(0);

  useEffect(() => {
    if (!pause) {
      const interval = setInterval(() => {
        setOpacity((prev) => (prev === 1 ? 0 : 1));
      }, (Math.max(duration, 1) / 2) * 500);

      return () => clearInterval(interval);
    }
  }, [pause, duration]);

  useEffect(() => {
    if (duration <= 0) setDuration(1);
  }, [duration, setDuration]);

  return (
    <div
      className="h-full bg-yellow-400 border rounded-xl"
      style={{ opacity }}
    />
  );
};

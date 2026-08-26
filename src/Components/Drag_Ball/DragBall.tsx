"use client";

import React, { useRef, useState } from "react";

export const DragBall: React.FC = () => {
  const ballRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const ball = ballRef.current;
    const container = containerRef.current;
    if (ball && container) {
      const ballRect = ball.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Store original position relative to the container
      setOriginalPosition({
        x: ballRect.left - containerRect.left,
        y: ballRect.top - containerRect.top,
      });

      // Calculate mouse offset within the ball
      setOffset({
        x: e.clientX - ballRect.left,
        y: e.clientY - ballRect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const container = containerRef.current;
    const ball = ballRef.current;
    if (container && ball) {
      const containerRect = container.getBoundingClientRect();

      // Calculate new ball position within container bounds
      const newLeft = e.clientX - containerRect.left - offset.x;
      const newTop = e.clientY - containerRect.top - offset.y;

      // Update ball position
      ball.style.position = "absolute";
      ball.style.left = `${Math.max(
        0,
        Math.min(newLeft, containerRect.width - ball.offsetWidth)
      )}px`;
      ball.style.top = `${Math.max(
        0,
        Math.min(newTop, containerRect.height - ball.offsetHeight)
      )}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const ball = ballRef.current;
    if (ball) {
      // Reset to original position
      ball.style.left = `${originalPosition.x}px`;
      ball.style.top = `${originalPosition.y}px`;
    }
  };

  return (
    <div className="w-[80%] m-auto select-none">
      <h1 className="text-center text-3xl font-bold mt-10">Drag the Ball</h1>
      <div
        ref={containerRef}
        className="border w-[80%] h-[60vh] m-auto mt-10 rounded-xl bg-gray-700 bg-opacity-40 p-4 flex justify-center items-center relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          id="ball"
          ref={ballRef}
          className="w-[150px] h-[150px] border rounded-full bg-yellow-400 cursor-grab active:cursor-grabbing flex justify-center items-center text-black shadow-xl"
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default DragBall;

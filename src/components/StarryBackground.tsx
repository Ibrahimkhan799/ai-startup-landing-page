"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
}

interface Props extends React.HTMLAttributes<HTMLCanvasElement> {
  minNumberOfStars?: number;
  height?: number | string;
  width?: number | string;
}

const StarryBackground = React.forwardRef<HTMLDivElement, Props>(({className,minNumberOfStars, height , width , ...props}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetParallax = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const shootingStarCooldown = useRef(0);

  const generateStars = useCallback(() => {
    const stars: Star[] = [];
    const starCount = Math.min(minNumberOfStars || 100, (dimensions.width * dimensions.height) / 10000); // Dynamic count
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 1 + 0.1,
        speed: Math.random() * 0.05 + 0.01,
      });
    }
    starsRef.current = stars;
  }, [dimensions]);

  const drawStars = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.fillStyle = "white";

    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [dimensions]);

  const generateShootingStar = useCallback(() => {
    // Delay between shooting stars
    if (shootingStarCooldown.current > 0) {
      shootingStarCooldown.current -= 1;
      return;
    }

    if (Math.random() < 0.01) { // Low probability to trigger
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const angle = Math.random() * Math.PI / 4 + Math.PI / 8; // Randomized angle (22.5° to 67.5°)
      shootingStarsRef.current.push({
        x,
        y,
        length: Math.random() * 100 + 50,
        angle,
        speed: Math.random() * 5 + 2,
        opacity: 1,
      });
      shootingStarCooldown.current = 150; // Reset cooldown (frames)
    }
  }, [dimensions]);

  const drawShootingStars = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "white";
    shootingStarsRef.current.forEach((star, index) => {
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
        star.x - star.length * Math.cos(star.angle),
        star.y - star.length * Math.sin(star.angle)
      );
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Update shooting star position and opacity
      star.x += star.speed * Math.cos(star.angle);
      star.y += star.speed * Math.sin(star.angle);
      star.opacity -= 0.02;

      // Remove the star if it's invisible or out of bounds
      if (star.opacity <= 0 || star.x < 0 || star.y > dimensions.height) {
        shootingStarsRef.current.splice(index, 1);
      }
    });
  }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement("canvas");
        }
        offscreenCanvasRef.current.width = width;
        offscreenCanvasRef.current.height = height;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    generateStars();
    if (offscreenCanvasRef.current) {
      const offscreenCtx = offscreenCanvasRef.current.getContext("2d");
      if (offscreenCtx) {
        drawStars(offscreenCtx);
      }
    }
  }, [dimensions, generateStars, drawStars]);

  const animateStars = useCallback(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentParallax.current.x += (targetParallax.current.x - currentParallax.current.x) * 0.1; // Smooth interpolation
    currentParallax.current.y += (targetParallax.current.y - currentParallax.current.y) * 0.1;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.drawImage(
      offscreenCanvas,
      -currentParallax.current.x,
      -currentParallax.current.y
    );

    generateShootingStar();
    drawShootingStars(ctx);

    animationRef.current = requestAnimationFrame(animateStars);
  }, [dimensions, generateShootingStar, drawShootingStars]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateStars);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateStars]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePositionRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    targetParallax.current.x = (mousePositionRef.current.x - centerX) * 0.05;
    targetParallax.current.y = (mousePositionRef.current.y - centerY) * 0.05;
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className={twMerge("absolute top-0 left-0", className)}
      style={{ height : height || "100%" , width : width || "100%" }}
      {...props}
    />
  );
});

export default StarryBackground;
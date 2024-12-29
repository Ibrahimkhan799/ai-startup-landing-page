"use client";
import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    numberOfStars: number;
}

const ParallaxStars  : React.FC<Props> = ({numberOfStars , className , ...props}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create stars once and store them in refs
    const stars = Array.from({ length: numberOfStars }, () => {
      if (!containerRef.current) return;
      const div = document.createElement('div');
      div.className = 'absolute rounded-full bg-white';
      
      const data = {
        element: div,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        depth: Math.random() * 0.5 + 0.1, // Reduced depth range for subtler effect
      };
      
      div.style.cssText = `
        left: ${data.x}%;
        top: ${data.y}%;
        width: ${data.size}px;
        height: ${data.size}px;
        opacity: ${0.4 + data.depth * 0.6};
        transform: translate(-50%, -50%);
        will-change: transform;
      `;
      
      containerRef.current.appendChild(div);
      return data;
    }) as { element: HTMLDivElement, x: number, y: number, size: number, depth: number }[];

    let rafId = null as unknown as number;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e : MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1)
      mouseX = (-clientX - innerWidth / 2) / (innerWidth / 2);
      mouseY = (-clientY - innerHeight / 2) / (innerHeight / 2);
    };

    const animate = () => {
      // Smooth lerp for mouse movement
      const ease = 0.1;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      // Update all stars in a single frame
      stars.forEach(({ element, x, y, depth }) => {
        // Reverse the direction by removing the minus sign
        const moveX = currentX * 50 * depth;
        const moveY = currentY * 50 * depth;
        
        element.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      // Clean up DOM elements
      stars.forEach(({ element }) => element.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={twMerge("absolute w-full h-screen overflow-hidden", className)}
      {...props}
    />
  );
};

export default ParallaxStars;
"use client";
import Button from "@/components/Button";
import { CTASection } from "@/lib/constants";
import StarsBg from "@/assets/stars.png";
import gridLines from "@/assets/grid-lines.png";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import type { Function, useRelativeMouse } from "@/lib/types";

const useRelativeMouse: useRelativeMouse = (to) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition: Function<[MouseEvent]> = (ev) => {
    if (!to.current) return;
    const { top, left } = to.current.getBoundingClientRect();
    mouseX.set(ev.x - left);
    mouseY.set(ev.y - top);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return { x: mouseX, y: mouseY };
};

export const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  let { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  let backgroundPositionY = useTransform(scrollYProgress, [0, 1], [-300, 300]);

  const { x, y } = useRelativeMouse(circleRef);

  let maskImage = useMotionTemplate`radial-gradient(50% 50% at ${x}px ${y}px, black, transparent)`;

  return (
    <section ref={sectionRef} className="py-20 md:py-24">
      <div className="container">
        <motion.div
          animate={{
            backgroundPositionX: StarsBg.width,
          }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: "linear",
          }}
          className="border border-border py-24 rounded-xl overflow-hidden relative group"
          style={{
            backgroundImage: `url(${StarsBg.src})`,
            backgroundPositionY,
          }}
        >
          <div
            className="absolute inset-0 bg-light-secondary bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-700"
            style={{
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></div>
          <motion.div
            ref={circleRef}
            className="absolute inset-0 bg-light-secondary bg-blend-overlay opacity-0 group-hover:opacity-100 transition duration-700"
            style={{
              backgroundImage: `url(${gridLines.src})`,
              maskImage,
            }}
          ></motion.div>
          <div className="relative">
            <h2 className="text-5xl md:text-6xl max-w-sm mx-auto font-medium text-center tracking-tighter">
              {CTASection.title}
            </h2>
            <p className="text-neutral-400 text-center text-lg md:text-xl tracking-tight mt-5 max-w-md mx-auto">
              {CTASection.description}
            </p>
            <div className="flex justify-center mt-8">
              <Button>Join waitlist</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

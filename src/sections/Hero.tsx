"use client";
import Button from "@/components/Button";
import ParallaxStars from "@/components/ParallaxStars";
import { HeroSection } from "@/lib/constants";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="h-hero-sm md:h-hero-md flex items-center overflow-hidden relative [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <ParallaxStars numberOfStars={100} />
      <div className="absolute inset-0 bg-hero-background-gradient"></div>
      {/* Globe */}
      <div className="absolute h-64 w-64 md:h-96 md:w-96 bg-purple-500 rounded-full border border-opacity-20 border-white centered bg-hero-globe-gradient shadow-hero-globe-shadow"></div>
      {/* Ring-1 */}
      <motion.div
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          rotate: "1turn",
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[344px] w-[344px] md:h-[580px] md:w-[580px] border rounded-full centered opacity-20"
      >
        <div className="h-2 w-2 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-0 bg-white rounded-full"></div>
        <div className="h-2 w-2 absolute top-0 -translate-x-1/2 -translate-y-1/2 left-1/2 bg-white rounded-full"></div>
        <div className="h-5 w-5 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-full border border-white rounded-full">
          <div className="h-2 w-2 absolute centered bg-white rounded-full"></div>
        </div>
      </motion.div>
      {/* Ring-2 */}
      <motion.div
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          rotate: "-1turn",
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[444px] w-[444px] md:h-[780px] md:w-[780px]  border border-dashed rounded-full centered opacity-20"
      ></motion.div>
      {/* Ring-3 */}
      <motion.div
        style={{
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          rotate: "-1turn",
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[544px] w-[544px] md:h-[980px] md:w-[980px]  border rounded-full centered opacity-20"
      >
        <div className="h-2 w-2 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-0 bg-white rounded-full"></div>
        <div className="h-2 w-2 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-full bg-white rounded-full"></div>
      </motion.div>
      <div className="container relative mt-6">
        <h1 className="text-8xl md:text-hero-md font-semibold tracking-tighter bg-white bg-hero-heading-gradient text-transparent bg-clip-text text-center">
          {HeroSection.title}
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 mt-5 text-center max-w-xl mx-auto">
          {HeroSection.description}
        </p>
        <div className="flex justify-center mt-5">
          <Button>Join waitlist</Button>
        </div>
      </div>
    </section>
  );
};
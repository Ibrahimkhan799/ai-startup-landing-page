"use client";
import { LogoTickerSection } from "@/lib/constants";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { IoPlay, IoPause } from "react-icons/io5";

export const LogoTicker = () => {
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        translateX: "0",
        transition: {
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="flex items-center gap-5">
          <h2 className="flex-1 md:flex-none">{LogoTickerSection.title}</h2>
          <div className="flex flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              initial={{
                translateX: "-50%",
              }}
              animate={controls}
              className="flex flex-none gap-14 pr-14"
            >
              {LogoTickerSection.cards?.map((logo) => (
                <img key={logo.description + "-r-1"} src={logo.description} className="h-6 w-auto" alt={logo.title} />
              ))}
              {LogoTickerSection.cards?.map((logo) => (
                <img key={logo.description + "-r-2"} src={logo.description} className="h-6 w-auto" alt={logo.title} />
              ))}
            </motion.div>
          </div>
          <button
              onClick={togglePause}
              className="rounded-full bg-white/5 p-2 shadow-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              aria-label={isPaused ? "Play animation" : "Pause animation"}
            >
              {isPaused ? (
                <IoPlay className="h-4 w-4 text-stone-50" />
              ) : (
                <IoPause className="h-4 w-4 text-stone-50" />
              )}
          </button>
        </div>
      </div>
    </section>
  );
};
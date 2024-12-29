"use client";
import { FeaturesSection } from "@/lib/constants";
import { DotLottieCommonPlayer, DotLottiePlayer } from "@dotlottie/react-player";
import ProductImage from "@/assets/product-image.png";
import type { Function, Infer } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, ValueAnimationTransition } from "framer-motion";

const FeatureTab: React.FC<Infer<typeof FeaturesSection.tabs> & React.ComponentPropsWithoutRef<"div"> & { selected: boolean }> = ({ onClick, selected, ...tab }) => {
  const dotLottieRef = useRef<DotLottieCommonPlayer>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const xPer = useMotionValue(0);
  const yPer = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPer}% ${yPer}%, black, transparent)`

  useEffect(() => {
    if (!tabRef.current || !selected) return;
    const { height, width } = tabRef.current.getBoundingClientRect();
    const circumference = height * 2 + width * 2;
    const times = [0, width / circumference, (width + height) / circumference, (width * 2 + height) / circumference, 1]
    let options: ValueAnimationTransition<number> = {
      times,
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop"
    }
    animate(xPer, [0, 100, 100, 0, 0], options);
    animate(yPer, [0, 0, 100, 100, 0], options);
  }, [selected])

  const handleTabHover: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!dotLottieRef.current) return;
    dotLottieRef.current.seek(0);
    dotLottieRef.current.play();
  }

  return (
    <div ref={tabRef} onClick={onClick} onMouseEnter={handleTabHover} className="relative border border-border flex p-2.5 rounded-xl items-center gap-2.5 lg:flex-1 w-full cursor-pointer">
      {selected && <motion.div className="absolute inset-0 -m-px border border-light-primary rounded-xl" style={{ maskImage }}></motion.div>}
      <div className="border border-border h-12 w-12 rounded-lg inline-flex items-center justify-center">
        <DotLottiePlayer ref={dotLottieRef} src={tab.icon} className="h-5 w-5" />
      </div>
      <div className="font-medium text-neutral-50">{tab.title}</div>
      {tab.isNew && <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-semi-light-primary text-stone-950">new</div>}
    </div>
  )
}

export const Features = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const bgPosX = useMotionValue(FeaturesSection.tabs[selectedTab].backgroundPositionX);
  const bgPosY = useMotionValue(FeaturesSection.tabs[selectedTab].backgroundPositionY);
  const bgSizeX = useMotionValue(FeaturesSection.tabs[selectedTab].backgroundSizeX);

  const backgroundSize = useMotionTemplate`${bgSizeX}% auto`;
  const backgroundPosition = useMotionTemplate`${bgPosX}% ${bgPosY}%`

  const handleSelectTab: Function<[number]> = (i) => {
    setSelectedTab(i);

    const animateOpts: ValueAnimationTransition<number> = {
      duration: 2,
      ease: "easeInOut",
    }

    animate(bgSizeX, [bgSizeX.get(), 100, FeaturesSection.tabs[i].backgroundSizeX], animateOpts)

    animate(bgPosX, [bgPosX.get(), 100, FeaturesSection.tabs[i].backgroundPositionX], animateOpts)

    animate(bgPosY, [bgPosY.get(), 100, FeaturesSection.tabs[i].backgroundPositionY], animateOpts)

  }

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter">{FeaturesSection.title}</h2>
        <p className="text-neutral-400 text-center text-lg md:text-xl tracking-tight mt-5 max-w-2xl mx-auto">{FeaturesSection.description}</p>
        <div className="mt-10 flex gap-2.5 flex-col lg:flex-row items-center">
          {FeaturesSection.tabs.map((tab, tabIndex) => (
            <FeatureTab selected={selectedTab === tabIndex} {...tab} onClick={() => handleSelectTab(tabIndex)} key={tab.title} />
          ))}
        </div>
        <div className="border border-border p-2.5 rounded-xl mt-2.5">
          <motion.div
            className="aspect-video bg-cover border border-border rounded-lg"
            style={{
              backgroundImage: `url(${ProductImage.src})`,
              backgroundPosition,
              backgroundSize,
            }}
          ></motion.div>
        </div>
      </div>
    </section>
  );
};

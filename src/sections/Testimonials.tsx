"use client";
import { TestimonialSection } from "@/lib/constants";
import { motion } from "framer-motion";
import Image from "next/image";

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter">
          {TestimonialSection.title}
        </h2>
        <p className="text-neutral-400 text-center text-lg md:text-xl tracking-tight mt-5 max-w-md mx-auto">
          {TestimonialSection.description}
        </p>
        <div className="flex overflow-hidden mt-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <motion.div
            initial={{
              translateX: "-50%",
            }}
            animate={{
              translateX: "0",
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
            className="flex gap-5 pr-5 flex-none *:flex-none"
          >
            {[...TestimonialSection.testimonials, ...TestimonialSection.testimonials].map((testimonial, index) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.name + index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

type Props = {
  testimonial: typeof TestimonialSection.testimonials extends Array<infer U> ? U : never;
}

const TestimonialCard: React.FC<Props> = ({ testimonial }) => {
  return (
    <div className="border border-border p-6 md:p-10 rounded-xl bg-testimonial-card-gradient max-w-xs md:max-w-md">
      <h3 className="text-lg tracking-tight md:text-2xl font-light">{testimonial.text}</h3>
      <div className="flex flex-row gap-3 items-center mt-5">
        <div className="relative after:content-[''] after:absolute after:inset-0 after:bg-shadow-primary after:mix-blend-soft-light before:absolute before:content-[''] before:inset-0 before:border before:border-border before:z-10 before:rounded-lg after:rounded-lg">
          <Image src={testimonial.avatarImg} alt={testimonial.name} className="h-11 w-11 rounded-lg grayscale" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="tracking-tight">{testimonial.name}</span>
          <span className="tracking-tight text-sm text-neutral-400">{testimonial.title}</span>
        </div>
      </div>
    </div>
  )
}
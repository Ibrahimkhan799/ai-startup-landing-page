import React from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({children, className, ...props}, ref) => {
  return (
    <button className={twMerge("relative py-2 px-3 rounded-lg font-medium text-sm bg-gradient-to-b from-secondary to-primary shadow-button-secondary", className)} {...props} ref={ref}>
      <div className="absolute inset-0 *:absolute *:inset-0 *:rounded-lg">
        <div className="border border-neutral-700 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div className="border border-neutral-500 [mask-image:linear-gradient(to_top,black,transparent)]"></div>
        <div className="shadow-button-primary"></div>
      </div>
      <span className="text-neutral-100">{children}</span>
    </button>
  );
});

Button.displayName = "Button";

export default Button;
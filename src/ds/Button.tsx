import React from "react";
import { twMerge } from "tailwind-merge";

const DEFAULT_STYLE = "w-fit rounded-2xl p-3 text-[1.8rem] font-bold";

const BUTTON_VARIANTS = {
  primary: `${DEFAULT_STYLE} bg-primary hover:bg-primary/80 text-white`,
  secondary: `${DEFAULT_STYLE} bg-gray-500 text-white hover:bg-gray-500/50`,
  outlined: `${DEFAULT_STYLE} border border-primary hover:bg-primary/50`,
  transparent: `${DEFAULT_STYLE} bg-transparent hover:bg-primary/20`,
};

type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export default function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"button">) {
  const varaints = BUTTON_VARIANTS[variant];

  return (
    <button className={twMerge(varaints, className)} {...rest}>
      {children}
    </button>
  );
}

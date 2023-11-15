import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary";

const DEFAULT_STYLE = "w-fit rounded-2xl p-3 text-[1.8rem] font-bold";

const BUTTON_VARIANTS = {
  primary: `bg-primary ${DEFAULT_STYLE}`,
  secondary: `bg-secondary ${DEFAULT_STYLE} `,
};

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

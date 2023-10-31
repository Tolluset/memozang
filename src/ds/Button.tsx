import React from "react";

type Variant = "primary" | "secondary";

export default function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"button">) {
  const bgColor = variant === "primary" ? "bg-primary" : "bg-secondary";

  return (
    <button
      className={`${bgColor} w-fit font-bold text-[1.8rem] p-3 rounded-2xl ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

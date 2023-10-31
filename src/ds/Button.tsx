import React from "react";

type Variant = "primary" | "secondary";

export default function Button({
  variant = "primary",
  children,
  ...rest
}: {
  variant?: Variant;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">) {
  const bgColor = variant === "primary" ? "bg-primary" : "bg-secondary";

  return (
    <button
      className={`${bgColor} w-fit font-bold text-[1.8rem] p-3 rounded-2xl`}
      {...rest}
    >
      {children}
    </button>
  );
}

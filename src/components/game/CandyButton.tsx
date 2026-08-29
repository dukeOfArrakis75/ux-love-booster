import { motion } from "motion/react";
import type { ReactNode } from "react";

interface CandyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit";
}

export function CandyButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  type = "button",
}: CandyButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`btn-main ${variant === "outline" ? "btn-outline" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}

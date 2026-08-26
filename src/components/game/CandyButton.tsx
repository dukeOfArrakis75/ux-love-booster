import { motion } from "motion/react";
import type { ReactNode } from "react";

interface CandyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "gold";
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
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={`candy-btn ${variant === "gold" ? "candy-btn-gold" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

type GlowIntensity = "none" | "sm" | "md" | "lg" | "xl";
type ShadowIntensity = "none" | "sm" | "md" | "lg" | "xl";
type BlurIntensity = "none" | "sm" | "md" | "lg" | "xl";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowIntensity?: GlowIntensity;
  shadowIntensity?: ShadowIntensity;
  borderRadius?: string;
  blurIntensity?: BlurIntensity;
  draggable?: boolean;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
}

const glowIntensities = {
  none: "",
  sm: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
  md: "shadow-[0_0_30px_rgba(255,255,255,0.15)]",
  lg: "shadow-[0_0_40px_rgba(255,255,255,0.2)]",
  xl: "shadow-[0_0_50px_rgba(255,255,255,0.25)]",
};

const shadowIntensities = {
  none: "",
  sm: "shadow-lg",
  md: "shadow-xl",
  lg: "shadow-2xl",
  xl: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
};

const blurIntensities = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

export function LiquidGlassCard({
  children,
  className = "",
  glowIntensity = "md",
  shadowIntensity = "md",
  borderRadius = "12px",
  blurIntensity = "md",
  draggable = false,
  onDrag,
  onDragEnd,
}: LiquidGlassCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!draggable) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onDrag?.(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        onDragEnd?.(rect.left, rect.top);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, draggable, onDrag, onDragEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;

    setIsDragging(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden",
        "bg-white/10 dark:bg-black/10",
        "border border-white/20 dark:border-white/10",
        glowIntensities[glowIntensity],
        shadowIntensities[shadowIntensity],
        blurIntensities[blurIntensity],
        className
      )}
      style={{
        borderRadius,
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
      }}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      onMouseDown={handleMouseDown}
      drag={draggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileHover={{ scale: draggable ? 1.02 : 1 }}
      whileTap={{ scale: draggable ? 0.98 : 1 }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
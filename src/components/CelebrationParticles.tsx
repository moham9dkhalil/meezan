import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

export function fireCelebrationParticles(customOptions?: { count?: number }) {
  if (typeof window === "undefined") return;

  const count = customOptions?.count || 90;

  // Main cannon burst
  confetti({
    particleCount: count,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#3b82f6", "#eab308", "#8b5cf6"],
    disableForReducedMotion: true
  });

  // Left cannon burst
  setTimeout(() => {
    confetti({
      particleCount: Math.round(count * 0.6),
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.7 },
      colors: ["#f59e0b", "#10b981", "#3b82f6", "#f43f5e"]
    });
  }, 120);

  // Right cannon burst
  setTimeout(() => {
    confetti({
      particleCount: Math.round(count * 0.6),
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.7 },
      colors: ["#ec4899", "#a855f7", "#eab308", "#10b981"]
    });
  }, 240);
}

interface ParticleItem {
  id: string;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: string;
  symbol: string;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface CelebrationParticlesProps {
  trigger?: boolean;
  message?: string;
  xpPoints?: number;
  onComplete?: () => void;
}

const SYMBOLS = ["✨", "⭐", "🎉", "📈", "💎", "🌟", "✅", "💰", "🧾"];
const COLORS = [
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#f43f5e"  // Rose
];

export function CelebrationParticles({ trigger, message, xpPoints, onComplete }: CelebrationParticlesProps) {
  const [particles, setParticles] = useState<ParticleItem[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (trigger) {
      // Fire confetti cannons
      fireCelebrationParticles();

      // Create Framer Motion particle items
      const newParticles: ParticleItem[] = Array.from({ length: 28 }).map((_, i) => {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
          id: `p_${Date.now()}_${i}`,
          x: 40 + (Math.random() * 20 - 10), // centered burst point
          y: 50 + (Math.random() * 20 - 10),
          size: Math.floor(Math.random() * 18) + 16,
          color,
          symbol,
          rotation: Math.random() * 360 - 180,
          velocityX: (Math.random() - 0.5) * 350,
          velocityY: -Math.random() * 400 - 150
        };
      });

      setParticles(newParticles);
      setActiveMessage(message || "أحسنت! إنجاز رائع 🏆");

      const timer = setTimeout(() => {
        setParticles([]);
        setActiveMessage(null);
        if (onComplete) onComplete();
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      <AnimatePresence>
        {/* Banner Popup Notification */}
        {activeMessage && (
          <motion.div
            key="celebration-banner-popup"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-[#0c1328] via-[#101b3d] to-[#0a1024] border-2 border-amber-400/80 rounded-3xl px-6 py-4 shadow-2xl shadow-amber-500/30 flex items-center gap-4 text-white">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shrink-0"
              >
                🏆
              </motion.div>

              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 block">
                  إنجاز جديد في ميـزان 🎉
                </span>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {activeMessage}
                </h3>
              </div>

              {xpPoints && (
                <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-lg shadow-amber-500/20">
                  <span>+{xpPoints} XP</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Framer Motion Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              scale: 0.2,
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              rotate: 0
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.5, 1.4, 0.8],
              x: `calc(${p.x}vw + ${p.velocityX}px)`,
              y: `calc(${p.y}vh + ${p.velocityY}px)`,
              rotate: p.rotation
            }}
            transition={{
              duration: 2.2,
              ease: "easeOut"
            }}
            className="absolute font-black drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] select-none"
            style={{ fontSize: `${p.size}px`, color: p.color }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

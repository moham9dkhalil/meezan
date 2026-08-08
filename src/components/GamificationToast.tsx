import React, { useEffect } from "react";
import { Zap, Award, Sparkles, X, CheckCircle2 } from "lucide-react";
import { Badge } from "../types";

export interface GamificationToastEvent {
  id: string;
  type: "xp" | "badge" | "challenge";
  title: string;
  message: string;
  xpAmount?: number;
  badge?: Badge;
}

interface GamificationToastProps {
  event: GamificationToastEvent | null;
  onClose: () => void;
}

export function GamificationToast({ event, onClose }: GamificationToastProps) {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounceIn shadow-2xl">
      <div
        className={`p-4 rounded-2xl border backdrop-blur-2xl text-white space-y-2 relative overflow-hidden shadow-2xl ${
          event.type === "badge"
            ? "bg-gradient-to-r from-amber-950/95 via-purple-950/95 to-indigo-950/95 border-amber-400/60 ring-2 ring-amber-400/40"
            : event.type === "challenge"
            ? "bg-gradient-to-r from-emerald-950/95 via-teal-950/95 to-slate-900/95 border-emerald-400/60"
            : "bg-gradient-to-r from-indigo-950/95 via-blue-950/95 to-slate-900/95 border-indigo-400/60"
        }`}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 text-xl border ${
                event.type === "badge"
                  ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                  : "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
              }`}
            >
              {event.badge ? (
                <span>{event.badge.icon}</span>
              ) : event.type === "challenge" ? (
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300">
                  {event.type === "badge"
                    ? "🎉 إنجاز وشارة جديدة!"
                    : event.type === "challenge"
                    ? "⚡ تم إنجاز التحدي!"
                    : "✨ كسب نقاط خبرة!"}
                </span>

                {event.xpAmount && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-black">
                    +{event.xpAmount} XP
                  </span>
                )}
              </div>

              <h4 className="text-sm font-black text-white mt-0.5">{event.title}</h4>
              <p className="text-xs text-slate-300 font-medium leading-snug mt-0.5">
                {event.message}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

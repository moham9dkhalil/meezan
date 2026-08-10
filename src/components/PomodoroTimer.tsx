import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, Coffee, Brain, X } from "lucide-react";

export function playPomodoroBell() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Harmonic chime notes (E5, G#5, B5, E6)
    const frequencies = [659.25, 830.61, 987.77, 1318.51];
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.16);

      // Envelope: smooth attack and exponential decay
      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.16);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + index * 0.16 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.16 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.16);
      osc.stop(ctx.currentTime + index * 0.16 + 0.8);
    });
  } catch (e) {
    console.error("Failed to play timer sound:", e);
  }
}

type TimerMode = "work" | "shortBreak" | "longBreak";

const MODE_CONFIGS: Record<TimerMode, { label: string; duration: number; color: string; icon: any }> = {
  work: {
    label: "تركيز ومذاكرة (25 د)",
    duration: 25 * 60,
    color: "from-indigo-500 via-purple-500 to-pink-500",
    icon: Brain
  },
  shortBreak: {
    label: "راحة قصيرة (5 د)",
    duration: 5 * 60,
    color: "from-emerald-500 to-teal-500",
    icon: Coffee
  },
  longBreak: {
    label: "راحة طويلة (15 د)",
    duration: 15 * 60,
    color: "from-amber-500 to-orange-500",
    icon: Sparkles
  }
};

export function PomodoroTimer({ expanded = false }: { expanded?: boolean }) {
  const [isOpen, setIsOpen] = useState(expanded);
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIGS.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("meezan_pomodoro_completed");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Main countdown timer logic
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      
      if (soundEnabled) {
        playPomodoroBell();
      }

      if (mode === "work") {
        const nextSessions = completedSessions + 1;
        setCompletedSessions(nextSessions);
        try {
          localStorage.setItem("meezan_pomodoro_completed", nextSessions.toString());
        } catch {}
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, soundEnabled, mode, completedSessions]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIGS[newMode].duration);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIGS[mode].duration);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalDuration = MODE_CONFIGS[mode].duration;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div className="relative" ref={popoverRef}>
      {/* TRIGGER BUTTON IN NAVBAR */}
      {!expanded && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-md ${
            isRunning
              ? "bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-pink-600/30 border-purple-400/50 text-purple-200 ring-2 ring-purple-400/30 animate-pulse"
              : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-purple-400/40"
          }`}
          title="مؤقت المذاكرة والتركيز (Pomodoro)"
        >
          <Timer className={`w-3.5 h-3.5 ${isRunning ? "text-purple-400 animate-spin" : "text-purple-300"}`} />
          <span className="font-mono text-xs font-black tracking-wider">{formatTime(timeLeft)}</span>
          {isRunning && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>
      )}

      {/* EXPANDED POPOVER MODAL MENU */}
      {isOpen && (
        <div className={`${expanded ? "relative" : "absolute top-12 left-0 sm:left-auto sm:right-0"} z-50 w-80 p-5 rounded-3xl bg-gradient-to-br from-[#0c1226] via-[#0a1024] to-[#070b1a] border border-purple-500/30 shadow-2xl backdrop-blur-2xl text-white space-y-4 animate-fadeIn`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">مؤقت المذاكرة والتركيز</h3>
                <p className="text-[10px] text-slate-400">تقنية بومودورو للتحصيل المحاسبي</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-purple-500/20 border-purple-400/40 text-purple-300"
                    : "bg-white/5 border-white/10 text-slate-500"
                }`}
                title={soundEnabled ? "التنبيه الصوتي مفعّل" : "التنبيه الصوتي مكتوم"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MODE SELECTOR TABS */}
          <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[11px] font-bold">
            {(Object.keys(MODE_CONFIGS) as TimerMode[]).map((mKey) => {
              const isActive = mode === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => switchMode(mKey)}
                  className={`py-1.5 px-1 rounded-lg transition-all cursor-pointer text-center text-[10px] truncate ${
                    isActive
                      ? "bg-purple-600 text-white font-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {mKey === "work" ? "جلسة 25د" : mKey === "shortBreak" ? "راحة 5د" : "راحة 15د"}
                </button>
              );
            })}
          </div>

          {/* BIG DISPLAY TIMER */}
          <div className="text-center py-4 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden space-y-2">
            {/* Background Glow Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />

            <div className="text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-white">
              {formatTime(timeLeft)}
            </div>

            <p className="text-xs font-black text-purple-300">
              {MODE_CONFIGS[mode].label}
            </p>
          </div>

          {/* CONTROLS BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                isRunning
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>بدء الجلسة</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all cursor-pointer"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => playPomodoroBell()}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 transition-all cursor-pointer"
              title="تجربة صوت التنبيه"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* SESSION STATS FOOTER */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>الجلسات المكتملة اليوم:</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono font-black">
              {completedSessions} جلسة
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

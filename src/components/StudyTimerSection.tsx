import { useState, useEffect } from "react";
import { PomodoroTimer } from "./PomodoroTimer";
import { Timer, Brain, Coffee, Sparkles, CheckCircle2, TrendingUp, Target } from "lucide-react";

export function StudyTimerSection() {
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [todayMinutes, setTodayMinutes] = useState<number>(0);

  useEffect(() => {
    const readStats = () => {
      try {
        const sessions = parseInt(localStorage.getItem("meezan_pomodoro_completed") || "0", 10) || 0;
        setCompletedSessions(sessions);
        setTodayMinutes(sessions * 25);
      } catch {}
    };
    readStats();
    window.addEventListener("focus", readStats);
    return () => window.removeEventListener("focus", readStats);
  }, []);

  const TIPS = [
    { icon: Brain, title: "قاعدة الـ 25 دقيقة", desc: "ركّز بجلسات قصيرة 25 دقيقة ثم خذ راحة 5 دقائق — أفضل لاستيعاب قيود المحاسبة والمعايير." },
    { icon: Target, title: "جلسة واحدة = درس واحد", desc: "كل جلسة بومودورو مخصصة لموضوع واحد: معيار، قيد، حساب، أو فصل من كتاب." },
    { icon: TrendingUp, title: "لاحظ التحسّن", desc: "تابع عدد الجلسات المكتملة يومياً وزدها تدريجياً لتكوين عادة مذاكرة مستمرة." }
  ];

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-black">
          <Timer className="w-3.5 h-3.5" />
          <span>تقنية بومودورو</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          مؤقت المذاكرة والتركيز
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto font-bold">
          نظّم وقت مذاكرتك المحاسبية بجلسات تركيز ذكية — 25 دقيقة عمل مركّز يليها راحة قصيرة، مع عدّاد للجلسات المكتملة لتحفيزك على الاستمرار.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0a1024]/70 border border-white/10 rounded-3xl p-6 flex items-center justify-center">
          <PomodoroTimer expanded />
        </div>

        <div className="space-y-3">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-purple-950/70 to-[#0a1024] border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>إحصائيات اليوم</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                <div className="text-2xl font-black font-mono text-purple-300">{completedSessions}</div>
                <div className="text-[10px] text-slate-400 font-bold">جلسة مكتملة</div>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                <div className="text-2xl font-black font-mono text-amber-300">{todayMinutes} د</div>
                <div className="text-[10px] text-slate-400 font-bold">دقائق تركيز</div>
              </div>
            </div>
          </div>

          {TIPS.map((tip, i) => {
            const TipIcon = tip.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 border border-purple-400/30">
                  <TipIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">{tip.title}</div>
                  <div className="text-[11px] text-slate-400 font-bold leading-relaxed">{tip.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
        <Coffee className="w-4 h-4" />
        <span>نصيحة: بعد كل 4 جلسات تركيز خذ راحة طويلة 15 دقيقة لإعادة شحن تركيزك.</span>
      </div>
    </section>
  );
}

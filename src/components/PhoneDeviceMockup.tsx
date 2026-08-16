import { useId, useState } from "react";
import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import { STAGES_DATA } from "../data/curriculum";
import {
  Play,
  Flame,
  Award,
  ArrowLeft,
  Send,
  Wifi,
  Battery,
  Signal,
  Home,
  Map,
  Scale,
  GraduationCap,
  User,
  Bell,
  Sparkles
} from "lucide-react";

type PhoneTab = "home" | "stages" | "assistant" | "courses" | "profile";

interface PhoneDeviceMockupProps {
  onSelectTab?: (tab: ActiveTab) => void;
  onOpenStage?: (stageId: number, lessonIndex?: number, tab?: "read" | "flashcards" | "quiz" | "notes" | "ai") => void;
  onOpenDownloadModal?: () => void;
  appName?: string;
  appLanguage?: Language;
}

export function PhoneDeviceMockup({ onSelectTab, onOpenStage, appName = "تطبيق ميزان", appLanguage = "ar" }: PhoneDeviceMockupProps) {
  const uid = useId().replace(/:/g, "");
  const hgradId = `hgrad-${uid}`;
  const pgradId = `pgrad-${uid}`;

  const [phoneTab, setPhoneTab] = useState<PhoneTab>("home");

  const [streakCount] = useState(14);
  const [xpPoints] = useState(2340);
  const [levelName] = useState("محاسب متوسط");

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "مرحباً بك! أنا مساعد ميزان المحاسبي الذكي 🤖. كيف أساعدك اليوم في فهم القيد أو حل سؤال محاسبي؟",
      time: "9:41 ص"
    }
  ]);
  const [inputChat, setInputChat] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const safeSelectTab = onSelectTab || (() => {});
  const safeOpenStage = onOpenStage || (() => {});

  const bottomNav: { id: PhoneTab; label: string; Icon: any }[] = [
    { id: "home", label: "الرئيسية", Icon: Home },
    { id: "stages", label: "المراحل", Icon: Map },
    { id: "assistant", label: "مساعد ميزان", Icon: Scale },
    { id: "courses", label: "كورسات", Icon: GraduationCap },
    { id: "profile", label: "حسابي", Icon: User }
  ];

  const exploreItems = [
    { icon: "🗺️", title: "خريطة المراحل", sub: "32 مرحلة تفاعلية", accent: "text-purple-300 border-purple-500/30 bg-purple-500/10", onClick: () => setPhoneTab("stages") },
    { icon: "🎓", title: "الكورسات", sub: "ACCA · IFRS · CPA", accent: "text-blue-300 border-blue-500/30 bg-blue-500/10", onClick: () => setPhoneTab("courses") },
    { icon: "📝", title: "معمل القيود", sub: "Journal Entry Lab", accent: "text-violet-300 border-violet-500/30 bg-violet-500/10", onClick: () => safeSelectTab("lab") },
    { icon: "📚", title: "المكتبة", sub: "كتب ومراجع", accent: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10", onClick: () => safeSelectTab("library") },
    { icon: "🧮", title: "الأدوات", sub: "حاسبات مالية", accent: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10", onClick: () => safeSelectTab("tools") },
    { icon: "🏛️", title: "دليل الضرائب", sub: "مصر · السعودية · الإمارات", accent: "text-green-300 border-green-500/30 bg-green-500/10", onClick: () => safeSelectTab("taxGuide") }
  ];

  const levelTabs = [
    { label: "مبتدئ", icon: "🌱", accent: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" },
    { label: "متوسط", icon: "📊", accent: "text-blue-400 border-blue-500/50 bg-blue-500/10" },
    { label: "متقدم", icon: "🏆", accent: "text-amber-400 border-amber-500/50 bg-amber-500/10" },
    { label: "محترف", icon: "💎", accent: "text-purple-400 border-purple-500/50 bg-purple-500/10" }
  ];

  const courseCards = [
    { icon: "🎓", name: "الجمعية الملكية للشهادات المهنية", org: "ACCA · شهادة دولية", grad: "from-indigo-500/40 to-transparent", tag: "6 وحدات", diff: "متوسط", rating: "4.9" },
    { icon: "🌍", name: "دبلوم المعايير الدولية IFRS", org: "DipIFR · التقارير المالية", grad: "from-amber-500/40 to-transparent", tag: "4 وحدات", diff: "متقدم", rating: "4.8" },
    { icon: "🏛️", name: "المراجعة والتدقيق الداخلي", org: "CIA · المعايير الدولية", grad: "from-blue-500/40 to-transparent", tag: "5 وحدات", diff: "متقدم", rating: "4.7" }
  ];

  const profileBadges = [
    { icon: "🎯", name: "بداية الرحلة", locked: false },
    { icon: "⚖️", name: "فاهم المعادلة", locked: false },
    { icon: "📓", name: "سيد اليومية", locked: false },
    { icon: "🔍", name: "دقيق الميزان", locked: true },
    { icon: "🏅", name: "محاسب وسط", locked: true },
    { icon: "🏆", name: "محاسب محترف", locked: true }
  ];

  const handleSendMiniChat = (textToSend?: string) => {
    const text = textToSend || inputChat;
    if (!text.trim()) return;

    const userMsg = { sender: "user" as const, text, time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputChat("");
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "ممتاز! القيد المحاسبي السليم يتطلب طرفاً مديناً (Dr) وطرفاً دائناً (Cr) متساويين تماماً في الميزان.";
      if (text.includes("معادلة") || text.includes("المعادلة")) {
        reply = "المعادلة المحاسبية الأساسية هي: الأصول = الخصوم + حقوق الملكية. كل قيد يومية يحافظ على توازن هذه المعادلة.";
      } else if (text.includes("مدين") || text.includes("دائن")) {
        reply = "القاعدة الذهبية: الحسابات التي تزيد (الأصول والمصروفات) تكون مدينة (Dr)، بينما الإيرادات والخصوم وحقوق الملكية تكون دائنة (Cr).";
      } else if (text.includes("إهلاك") || text.includes("أصول")) {
        reply = "إهلاك الأصل الثابت هو توزيع تكلفته على عمره الإنتاجي. القيد: من حـ/ مصروف الإهلاك إلى حـ/ مجمع الإهلاك.";
      } else if (text.includes("قائمة الدخل") || text.includes("الدخل")) {
        reply = "قائمة الدخل تعرض الإيرادات والمصروفات لفترة معينة، والفرق بينهما هو صافي الربح أو الخسارة.";
      } else if (text.includes("دورة") || text.includes("الدورة")) {
        reply = "الدورة المحاسبية: القيد في اليومية ← الترحيل للأستاذ ← ميزان المراجعة ← التسويات ← القوائم المالية.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsAiThinking(false);
    }, 600);
  };

  return (
    <div className="relative w-[320px] sm:w-[355px] rounded-[52px] bg-gradient-to-b from-[#2e3752] via-[#141b2d] to-[#0a0f1d] p-[11px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] border border-slate-600/60 ring-1 ring-white/20 transition-all hover:scale-[1.01] duration-300">

      {/* Hardware Buttons - Power Button on Right */}
      <div className="w-1 h-12 bg-slate-500/80 rounded-r-md absolute -right-1.5 top-28 border-r border-slate-300/40 shadow-inner" />
      {/* Hardware Buttons - Volume Up & Down on Left */}
      <div className="w-1 h-9 bg-slate-500/80 rounded-l-md absolute -left-1.5 top-24 border-l border-slate-300/40 shadow-inner" />
      <div className="w-1 h-9 bg-slate-500/80 rounded-l-md absolute -left-1.5 top-36 border-l border-slate-300/40 shadow-inner" />

      {/* Internal Screen Bezel */}
      <div className="bg-[#070b18] rounded-[42px] h-[610px] overflow-hidden p-3 text-right flex flex-col justify-between border border-white/15 relative shadow-inner">

        {/* Phone Top System Status Bar */}
        <div className="shrink-0 space-y-2">

          {/* Status Bar Icons + Dynamic Island */}
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-300 px-2 pt-0.5">
            <span>9:41</span>

            {/* Sleek Dynamic Island Pill Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#1e2333] border border-slate-700" />
              <div className="w-8 h-1 rounded-full bg-[#181c2b]" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 text-gray-300">
              <Signal className="w-3 h-3 text-slate-200" />
              <Wifi className="w-3 h-3 text-slate-200" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* App Header Bar inside Phone */}
          <div className="flex items-center justify-between pt-1 pb-2 px-1 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-xs font-black text-white shadow-md border border-white/20">
                ⚖️
              </div>
              <div>
                <span className="font-black text-xs text-white block leading-none">{appName}</span>
                <span className="text-[9px] text-emerald-400 font-bold">نشط الآن</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] flex items-center gap-1 border border-amber-500/30">
                <Award className="w-3 h-3 text-amber-400" />
                <span>XP {xpPoints}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-black text-[10px] flex items-center gap-1 border border-orange-500/30">
                <Flame className="w-3 h-3 fill-orange-400" />
                <span>{streakCount}d</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                <Bell className="w-3.5 h-3.5 text-slate-300" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-[#070b18]" />
              </div>
            </div>
          </div>
        </div>

        {/* PHONE VIEWPORT CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 my-1 space-y-3">

          {/* SCREEN 1: HOME DASHBOARD (mirrors HomeScreen.kt) */}
          {phoneTab === "home" && (
            <div className="space-y-3 animate-fadeIn">
              {/* Greeting */}
              <div className="px-1">
                <h4 className="text-sm font-black text-white leading-tight">أهلاً بك، محمد خليل 👋</h4>
                <p className="text-[10px] text-slate-400 font-medium">استمر في رحلتك لتصبح محاسباً محترفاً</p>
              </div>

              {/* Hero progress card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#101830] via-[#0D1528] to-[#121040] border border-indigo-500/40 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <defs>
                        <linearGradient id={hgradId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke={`url(#${hgradId})`} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="60" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-black text-white leading-none">38%</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold">📊 تقدمك في التعلم</p>
                    <p className="text-xs font-black text-white mt-0.5">3 من 18 مرحلة</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] text-amber-400 font-bold">
                      ⭐ {levelName}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-around text-center">
                  <div><span className="block text-xs font-black text-purple-300">3</span><span className="text-[8px] text-slate-400 font-bold">مرحلة ✅</span></div>
                  <div><span className="block text-xs font-black text-amber-400">{xpPoints}</span><span className="text-[8px] text-slate-400 font-bold">نقطة XP ⭐</span></div>
                  <div><span className="block text-xs font-black text-orange-400">{streakCount}</span><span className="text-[8px] text-slate-400 font-bold">يوم 🔥</span></div>
                </div>
              </div>

              {/* Continue learning card */}
              <button
                onClick={() => safeOpenStage(1)}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 flex items-center justify-between gap-2 text-right cursor-pointer shadow-lg transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg shrink-0">📊</div>
                  <div className="min-w-0">
                    <span className="block text-[9px] text-white/75">استكمل من حيث توقفت</span>
                    <span className="block text-xs font-black text-white truncate">أساسيات المحاسبة</span>
                    <span className="block text-[9px] text-white/65 truncate">المرحلة ٤ · المعادلة المحاسبية</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                </div>
              </button>

              {/* Streak + Daily goal */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-gradient-to-b from-orange-500/15 to-white/5 border border-orange-500/30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🔥</span>
                    <div>
                      <span className="block text-base font-black text-orange-400 leading-none">{streakCount}</span>
                      <span className="text-[8px] text-slate-400 font-bold">يوم متتالي</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex gap-1">
                    {["أ", "إ", "ث", "أ", "خ", "ج", "س"].map((d, i) => (
                      <span key={i} className={`flex-1 aspect-square rounded-full flex items-center justify-center text-[7px] font-bold ${i < 3 ? "bg-orange-400 text-white" : "bg-white/5 text-slate-500"}`}>{d}</span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/25">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🎯</span>
                    <span className="text-[8px] text-slate-400 font-bold">هدف اليوم</span>
                  </div>
                  <p className="text-[10px] font-black text-white mt-2">أكمل مرحلة واحدة</p>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[60%] rounded-full bg-gradient-to-l from-emerald-400 to-emerald-300" />
                  </div>
                  <p className="text-[9px] text-emerald-400 font-bold mt-1.5">٦٠٪ مكتمل</p>
                </div>
              </div>

              {/* Word of the day */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1A0F3A] via-[#151050] to-[#0D1B3E] border border-purple-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-purple-300 font-extrabold flex items-center gap-1"><span>✨</span> مصطلح اليوم</span>
                  <span className="text-[8px] font-bold text-purple-300 bg-purple-500/20 rounded-lg px-1.5 py-0.5">ACC</span>
                </div>
                <h4 className="text-sm font-black text-white mt-2">أصول متداولة</h4>
                <p className="text-[10px] text-purple-300 font-bold">Current Assets</p>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">الأصول التي يُتوقع تحويلها إلى نقد خلال سنة مالية واحدة</p>
                <div className="flex gap-1.5 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[9px] font-bold">🔊 نطق</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-slate-400 text-[9px] font-bold">📖 المزيد</span>
                </div>
              </div>

              {/* Explore section */}
              <div>
                <p className="text-[11px] font-extrabold text-white px-1 pb-2">استكشف المزيد</p>
                <div className="grid grid-cols-2 gap-2">
                  {exploreItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={item.onClick}
                      className={`p-2.5 rounded-xl border ${item.accent} text-right cursor-pointer transition-all hover:brightness-125`}
                    >
                      <span className="text-lg block">{item.icon}</span>
                      <span className="font-extrabold text-[11px] text-white block mt-1.5">{item.title}</span>
                      <span className="text-[9px] text-slate-400 block">{item.sub}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => safeSelectTab("flashcards")}
                  className="mt-2 w-full p-3 rounded-xl bg-gradient-to-l from-amber-500/15 to-white/5 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:brightness-125"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📖</span>
                    <span className="text-right">
                      <span className="block text-[11px] font-extrabold text-white">بطاقات المصطلحات</span>
                      <span className="text-[9px] text-slate-400 block">راجع +500 مصطلح محاسبي</span>
                    </span>
                  </span>
                  <span className="text-amber-400 font-bold">←</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: STAGES PATH (mirrors StagesScreen.kt) */}
          {phoneTab === "stages" && (
            <div className="space-y-3 animate-fadeIn">
              {/* Learning map header */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="flex-1">
                  <h4 className="text-xs font-black text-white">خريطة التعلم</h4>
                  <p className="text-[9px] text-slate-400">رحلتك في عالم المحاسبة</p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] text-amber-400 font-black">⭐ {xpPoints} XP</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[9px] text-orange-400 font-black">🔥 {streakCount}</span>
                  </div>
                </div>
                <div className="relative w-14 h-14 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="81" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-black text-white leading-none">17%</span>
                    <span className="text-[7px] text-slate-400">3/18</span>
                  </div>
                </div>
              </div>

              {/* Level tabs */}
              <div className="grid grid-cols-4 gap-1.5">
                {levelTabs.map((tab, i) => (
                  <div key={i} className={`rounded-xl border p-1.5 text-center ${i === 0 ? tab.accent : "bg-white/5 border-white/10"}`}>
                    <span className="text-base block">{tab.icon}</span>
                    <span className={`text-[9px] font-black block mt-0.5 ${i === 0 ? "text-white" : "text-slate-400"}`}>{tab.label}</span>
                    <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full ${i === 0 ? "w-[38%] bg-emerald-400" : i === 1 ? "w-[20%] bg-blue-400" : "w-0"}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Active stage card */}
              <div className="p-3 rounded-2xl bg-gradient-to-b from-emerald-500/15 via-white/5 to-[#090E1C] border border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] font-black">⚡ متاح الآن</span>
                  <span className="text-[9px] text-slate-400 font-bold">مستوى مبتدئ · 1/8</span>
                </div>
                <div className="flex items-center gap-2.5 mt-2.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
                    {STAGES_DATA[0]?.icon || "📘"}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-black text-white truncate">{STAGES_DATA[0]?.name || "أساسيات المحاسبة"}</h5>
                    <p className="text-[9px] text-slate-400 truncate">{STAGES_DATA[0]?.sub || "مقدمة في عالم المحاسبة"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 py-1 text-center"><span className="block text-[10px]">⏱️</span><span className="text-[8px] text-slate-300 font-bold">{STAGES_DATA[0]?.durationMinutes || 20} د</span></div>
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 py-1 text-center"><span className="block text-[10px]">❓</span><span className="text-[8px] text-slate-300 font-bold">{STAGES_DATA[0]?.questions || 10}</span></div>
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 py-1 text-center"><span className="block text-[10px]">📄</span><span className="text-[8px] text-slate-300 font-bold">20</span></div>
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 py-1 text-center"><span className="block text-[10px]">⚡</span><span className="text-[8px] text-amber-400 font-bold">+{STAGES_DATA[0]?.xp || 50} XP</span></div>
                </div>
                <button
                  onClick={() => safeOpenStage(STAGES_DATA[0]?.id || 1)}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-purple-600 text-white text-[11px] font-black cursor-pointer hover:brightness-110"
                >
                  ▶ ابدأ الدرس الآن
                </button>
                <button
                  onClick={() => safeOpenStage(STAGES_DATA[0]?.id || 1, 0, "flashcards")}
                  className="mt-2 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-[11px] font-bold cursor-pointer"
                >
                  🃏 البطاقات التعليمية
                </button>
              </div>

              {/* Lesson path list */}
              <div>
                <div className="flex items-center justify-between px-1 pb-2">
                  <p className="text-[11px] font-extrabold text-white">📍 مسار المبتدئ</p>
                  <span className="text-[9px] text-slate-400 font-bold">2 / 8 مكتمل</span>
                </div>
                <div className="space-y-2">
                  {STAGES_DATA.slice(0, 4).map((stage, i) => {
                    const done = i < 2;
                    const locked = i >= 3;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => !locked && safeOpenStage(stage.id)}
                        className={`w-full p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                          locked ? "bg-white/[0.03] border-white/5 opacity-70" : "bg-gradient-to-b from-indigo-500/10 via-white/5 to-[#090E1C] border-indigo-500/25 hover:brightness-125"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded-lg text-[8px] font-black ${
                            done ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                            : locked ? "bg-white/5 border border-white/10 text-slate-400"
                            : "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                          }`}>
                            {done ? "✅ مكتمل" : locked ? "🔒 مقفل" : "⚡ متاح الآن"}
                          </span>
                          <span className="text-[8px] text-slate-500 font-bold">مستوى مبتدئ · {i + 1}/8</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-white/5 border border-white/10">{locked ? "🔒" : stage.icon}</span>
                          <span className="min-w-0">
                            <span className="block text-[10px] font-black text-white truncate">{stage.name}</span>
                            <span className="block text-[8px] text-slate-400 truncate">{stage.sub}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => safeSelectTab("path")}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 text-xs font-black border border-white/10 cursor-pointer"
              >
                عرض جميع الـ 32 مرحلة ←
              </button>
            </div>
          )}

          {/* SCREEN 3: AI ASSISTANT (mirrors AssistantScreen.kt) */}
          {phoneTab === "assistant" && (
            <div className="flex flex-col h-full space-y-2 animate-fadeIn">
              {/* Assistant header */}
              <div className="text-center pb-2 border-b border-white/10 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_70%)] pointer-events-none" />
                <div className="relative flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#312E81] to-[#4338CA] border-2 border-purple-300/50 flex items-center justify-center text-xl">⚖️</div>
                  </div>
                </div>
                <h4 className="text-xs font-black text-white mt-1.5">مساعد ميزان</h4>
                <p className="text-[9px] text-slate-400">محاسبك الذكي</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 🤖 ذكاء اصطناعي نشط
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-2 overflow-y-auto no-scrollbar max-h-[300px] min-h-[80px] p-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-[10px] font-medium leading-relaxed max-w-[90%] space-y-1 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-l from-purple-600 to-indigo-600 text-white ml-auto text-right rounded-bl-none"
                        : "bg-white/10 text-slate-200 mr-auto text-right border border-white/10 rounded-br-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[7px] opacity-60 block font-mono text-left">{msg.time}</span>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="p-2 rounded-xl bg-white/5 text-slate-400 text-[9px] animate-pulse flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>مساعد ميزان يحلل السؤال ويكتب الرد...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div>
                <p className="text-[9px] text-slate-400 font-bold px-1 pb-1">أسئلة سريعة</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[9px]">
                  {[
                    { e: "⚖️", l: "المعادلة" },
                    { e: "💡", l: "مدين/دائن" },
                    { e: "📊", l: "قائمة الدخل" },
                    { e: "📉", l: "الإهلاك" },
                    { e: "🔄", l: "الدورة" }
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMiniChat(chip.l === "المعادلة" ? "ما هي المعادلة المحاسبية؟" : chip.l === "مدين/دائن" ? "كيف أفرّق بين المدين والدائن؟" : chip.l === "الإهلاك" ? "اشرح الإهلاك المحاسبي" : chip.l === "الدورة" ? "ما هي الدورة المحاسبية؟" : "ما هي قائمة الدخل؟")}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-purple-500/30 text-purple-200 whitespace-nowrap cursor-pointer hover:bg-purple-500/20 flex items-center gap-1 font-bold"
                    >
                      <span>{chip.e}</span>
                      <span>{chip.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMiniChat()}
                  placeholder="اسأل عن المحاسبة..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[10px] text-white placeholder-slate-400 outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => handleSendMiniChat()}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer shrink-0 flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: COURSES (mirrors CoursesScreen.kt) */}
          {phoneTab === "courses" && (
            <div className="space-y-3 animate-fadeIn">
              {/* Top bar */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h4 className="text-xs font-black text-white">كورسات خارجية</h4>
                  <p className="text-[9px] text-slate-400">12 شهادة مهنية معتمدة</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">1/12 ✓</span>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/25 py-1.5 text-center"><span className="block text-sm font-black text-indigo-400">12</span><span className="text-[8px] text-slate-400 font-bold">كورس</span></div>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/25 py-1.5 text-center"><span className="block text-sm font-black text-blue-400">26</span><span className="text-[8px] text-slate-400 font-bold">وحدة</span></div>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 py-1.5 text-center"><span className="block text-sm font-black text-emerald-400">120</span><span className="text-[8px] text-slate-400 font-bold">موضوع</span></div>
              </div>

              {/* Category filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { l: "الكل", e: "🎓", a: true },
                  { l: "محاسبة", e: "📊", a: false },
                  { l: "مراجعة", e: "🔍", a: false },
                  { l: "مالية", e: "📈", a: false },
                  { l: "IFRS", e: "🌍", a: false }
                ].map((cat, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black whitespace-nowrap cursor-pointer border ${
                      cat.a ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-400"
                    }`}
                  >
                    {cat.e} {cat.l}
                  </span>
                ))}
              </div>

              {/* Course cards */}
              <div className="space-y-2.5">
                {courseCards.map((course, i) => (
                  <button
                    key={i}
                    onClick={() => safeSelectTab("courses")}
                    className="w-full rounded-2xl bg-[#0D1424] border border-white/10 overflow-hidden text-right cursor-pointer hover:border-indigo-400/40 transition-all"
                  >
                    <div className={`h-12 bg-gradient-to-b from-indigo-500/35 via-indigo-500/10 to-transparent ${course.grad}`} />
                    <div className="p-2.5 -mt-5">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base shrink-0">{course.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-black text-white truncate">{course.name}</span>
                          <span className="block text-[8px] text-slate-400 truncate">{course.org}</span>
                        </div>
                        <div className="relative w-8 h-8 shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" stroke={i === 0 ? "#a78bfa" : i === 1 ? "#f59e0b" : "#3b82f6"} strokeWidth="3" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="72" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[8px] font-black text-white leading-none">0</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1">
                          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[8px] font-bold">{course.tag}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 text-[8px] font-bold">{course.diff}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[8px] font-bold">⭐ {course.rating}</span>
                        </div>
                        <span className="text-[9px] font-black text-indigo-400">ابدأ ←</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => safeSelectTab("courses")}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black cursor-pointer shadow-md"
              >
                تصفح جميع الكورسات المعتمدة ←
              </button>
            </div>
          )}

          {/* SCREEN 5: PROFILE (mirrors ProfileScreen.kt) */}
          {phoneTab === "profile" && (
            <div className="space-y-3 animate-fadeIn">
              {/* Identity card */}
              <div className="p-3 rounded-2xl bg-gradient-to-b from-[#121E35] to-[#0D1525] border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-14 h-14 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke={`url(#${pgradId})`} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="23" />
                      <defs>
                        <linearGradient id={pgradId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#ff8c00" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center text-lg border-[3px] border-[#0D1525]">👤</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-[#0D1525] flex items-center justify-center text-[7px] font-black text-white">3</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white">محمد خليل</h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[8px] text-amber-400 font-bold">⭐ المستوى ٣ — متوسط</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 truncate">أتعلم المحاسبة على ميزان 📚 طالب ACCA</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[9px] font-bold shrink-0">✏️ تعديل</span>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex justify-around text-center">
                  <div><span className="block text-[11px] font-black text-white">128</span><span className="text-[8px] text-slate-400">متابع</span></div>
                  <div><span className="block text-[11px] font-black text-white">47</span><span className="text-[8px] text-slate-400">يتابع</span></div>
                  <div><span className="block text-[11px] font-black text-amber-400">{xpPoints}</span><span className="text-[8px] text-slate-400">نقاط XP</span></div>
                  <div><span className="block text-[11px] font-black text-orange-400">🔥 {streakCount}</span><span className="text-[8px] text-slate-400">يوم متتالي</span></div>
                </div>

                <div className="mt-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">🪙</span>
                    <span className="text-right">
                      <span className="block text-[9px] font-bold text-white">توكنات الذكاء الاصطناعي</span>
                      <span className="block text-[8px] text-slate-400">5 Token متاح</span>
                    </span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gradient-to-l from-purple-600 to-blue-600 text-white text-[8px] font-bold">🎁 شاهد إعلاناً</span>
                </div>
              </div>

              {/* Course progress */}
              <div className="p-3 rounded-2xl bg-white/5 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold text-white">🗺️ تقدم الخريطة</p>
                    <p className="text-[9px] text-slate-400">21 من 55 درس مكتمل</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-black">38%</span>
                </div>
                <div className="mt-2.5 relative h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[38%] rounded-full bg-gradient-to-l from-purple-500 via-blue-500 to-cyan-400" />
                </div>
                <div className="flex justify-between mt-1.5 text-[8px] font-bold">
                  <span className="text-blue-300">٢٥٪</span>
                  <span className="text-blue-300">٥٠٪</span>
                  <span className="text-slate-500">٧٥٪</span>
                  <span className="text-slate-500">١٠٠٪</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-gradient-to-b from-orange-500/15 to-white/5 border border-orange-500/25 py-2 text-center">
                  <span className="text-base block">🔥</span>
                  <span className="block text-[11px] font-black text-orange-400">{streakCount}</span>
                  <span className="text-[8px] text-slate-400">يوم سلسلة</span>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-amber-500/15 to-white/5 border border-amber-500/25 py-2 text-center">
                  <span className="text-base block">⭐</span>
                  <span className="block text-[11px] font-black text-amber-400">{xpPoints}</span>
                  <span className="text-[8px] text-slate-400">XP إجمالي</span>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-emerald-500/15 to-white/5 border border-emerald-500/25 py-2 text-center">
                  <span className="text-base block">🏆</span>
                  <span className="block text-[11px] font-black text-emerald-400">أفضل ١٢٪</span>
                  <span className="text-[8px] text-slate-400">مرتبتك</span>
                </div>
              </div>

              {/* Badges */}
              <div className="p-3 rounded-2xl bg-white/5 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-white">🏆 الإنجازات</p>
                  <span className="text-[10px] font-black text-amber-400">3 / {profileBadges.length}</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[50%] rounded-full bg-gradient-to-l from-amber-400 to-orange-500" />
                </div>
                <div className="flex gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
                  {profileBadges.map((badge, i) => (
                    <div
                      key={i}
                      className={`w-14 shrink-0 rounded-xl border py-2 text-center ${
                        badge.locked ? "bg-white/[0.03] border-white/5" : "bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-500/30"
                      }`}
                    >
                      <span className={`block text-lg ${badge.locked ? "opacity-25 grayscale" : ""}`}>{badge.icon}</span>
                      <span className={`block text-[7px] mt-0.5 leading-tight ${badge.locked ? "text-slate-500" : "text-slate-300 font-bold"}`}>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison */}
              <div className="p-3 rounded-2xl bg-white/5 border border-purple-500/25">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold text-white">📊 أنت مقابل الجميع</p>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold">أفضل ١٢٪</span>
                </div>
                <div className="flex gap-3 mt-2 text-[8px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> أنت</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20" /> متوسط المتعلمين</span>
                </div>
                <div className="space-y-2.5 mt-2.5">
                  <div>
                    <div className="flex justify-between text-[9px]"><span className="text-slate-400">دروس هذا الأسبوع</span><span className="text-emerald-400 font-bold">+67% · 7</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/10"><div className="h-full w-[85%] rounded-full bg-gradient-to-l from-emerald-400 to-emerald-300" /></div>
                    <div className="mt-0.5 h-1 rounded-full bg-white/5"><div className="h-full w-[50%] rounded-full bg-white/15" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px]"><span className="text-slate-400">XP هذا الشهر</span><span className="text-emerald-400 font-bold">+50% · 840</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/10"><div className="h-full w-[75%] rounded-full bg-gradient-to-l from-emerald-400 to-emerald-300" /></div>
                    <div className="mt-0.5 h-1 rounded-full bg-white/5"><div className="h-full w-[50%] rounded-full bg-white/15" /></div>
                  </div>
                </div>
                <div className="mt-2.5 rounded-xl bg-gradient-to-l from-purple-500/10 to-blue-500/10 border border-purple-500/25 p-2 text-[9px] text-slate-300 leading-relaxed">
                  💡 أنت أفضل من ٨٨٪ من المتعلمين في الوحدات المكتملة هذا الشهر — استمر!
                </div>
              </div>

              <button
                onClick={() => safeSelectTab("profile")}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 text-xs font-black border border-white/10 cursor-pointer"
              >
                فتح حسابي الكامل على المنصة ←
              </button>
            </div>
          )}

        </div>

        {/* Glass Bottom Navigation Bar (mirrors GlassBottomBar.kt) */}
        <div className="shrink-0 mt-1 pt-1.5">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#101F3D]/75 to-[#050B18]/90 border border-[#CFE0FF]/20 px-1.5 py-1 flex items-center justify-around overflow-hidden">
            <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-[#CFE0FF]/70 to-transparent pointer-events-none" />
            {bottomNav.map((item) => {
              const Icon = item.Icon;
              const isActive = phoneTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPhoneTab(item.id)}
                  className={`relative flex flex-col items-center justify-center px-1.5 py-1 rounded-xl transition-all cursor-pointer ${
                    isActive ? "bg-white/[0.07] border border-[#CFE0FF]/20" : "border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] transition-all ${isActive ? "text-white" : "text-[#7E96BD]/40"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-[8px] mt-0.5 whitespace-nowrap ${isActive ? "text-[#D3E2FF] font-black" : "text-[#7E96BD]/30"}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 w-4 h-[3px] rounded-full bg-gradient-to-r from-[#CFE0FF]/50 via-white/80 to-[#CFE0FF]/50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* iOS Home Gesture Indicator Bar */}
          <div className="w-28 h-1 rounded-full bg-white/30 mx-auto mt-1.5" />
        </div>

      </div>
    </div>
  );
}

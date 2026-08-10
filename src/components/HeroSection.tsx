import { useState } from "react";
import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import {
  Play,
  Flame,
  Award,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Calculator,
  Zap,
  MessageSquare,
  Send,
  RotateCcw,
  Check,
  ShieldCheck,
  Wifi,
  Battery,
  Signal,
  BookOpen,
  Layers,
  Smartphone,
  Download,
  Building2,
  Briefcase,
  HardHat,
  Factory,
  ShoppingCart,
  Utensils,
  Hospital,
  Building,
  Laptop,
  FileCheck2
} from "lucide-react";

interface HeroSectionProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenStage: (stageId: number) => void;
  onOpenDownloadModal?: () => void;
  appLanguage?: Language;
}

export function HeroSection({ onSelectTab, onOpenStage, onOpenDownloadModal, appLanguage = "ar" }: HeroSectionProps) {
  const isEn = appLanguage === "en";
  const [phoneTab, setPhoneTab] = useState<"home" | "chat" | "stages" | "lab" | "flashcards">("home");

  // Phone state simulation
  const [streakCount] = useState(7);
  const [xpPoints, setXpPoints] = useState(480);
  const [levelNum] = useState(4);

  // Phone Mini AI Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "مرحباً بك! أنا مساعد ميزان المحاسبي الذكي 🤖. كيف أساعدك اليوم في فهم القيد أو حل سؤال محاسبي؟",
      time: "9:41 ص"
    }
  ]);
  const [inputChat, setInputChat] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Phone Mini Journal Lab State
  const [miniTx, setMiniTx] = useState({
    title: "شراء أثاث مكتبي نقداً",
    debitAcc: "الأصول الثابتة - الأثاث",
    creditAcc: "الصندوق (الخزينة)",
    amount: 5000,
    isApplied: false
  });

  // Phone Mini Flashcards State
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  const miniCards = [
    {
      term: "الاستحقاق المحاسبي (Accrual Accounting)",
      def: "مبدأ الاعتراف بالإيرادات والمصروفات عند حدوثها بصرف النظر عن تاريخ تحصيل أو دفع النقدية الفعلي.",
      example: "إثبات رواتب الشهر المستحقة في 12/31 حتى لو تم صرفها يوم 1/5."
    },
    {
      term: "القيد المزدوج (Double-Entry System)",
      def: "قاعدة محاسبية تشترط وجود طرفين لكل معاملة مالية (مدين ودائن) بحيث يتساوى مجموع المبالغ في الجانبين تماماً.",
      example: "من حـ/ البنك (مدين) إلى حـ/ المبيعات (دائن)."
    },
    {
      term: "الأصول المتداولة (Current Assets)",
      def: "الموارد والنقدية التي يتوقع تحويلها إلى كاش أو استهلاكها خلال سنة مالية واحدة أو دورة تشغيلية.",
      example: "الصندوق، البنك، المخزون، والعملاء (المدينون)."
    }
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
    <section className="relative pt-6 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right space-y-6">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-black backdrop-blur-xl shadow-lg">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>{isEn ? "#1 AI-Powered Accounting Platform" : "المنصة المحاسبية الأولى بالذكاء الاصطناعي"}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] text-white">
              {isEn ? "Meezan Platform — Learn Accounting " : "تطبيق ميزان — تعلّم المحاسبة "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                {isEn ? "Smart & Interactively" : "بأسلوب ذكي وتفاعلي"}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              {isEn
                ? "An all-in-one platform featuring 32 interactive learning stages, professional certificate courses, journal entry simulator, instant AI assistant, financial calculators, and a comprehensive digital library."
                : "تطبيق متكامل يضم 32 مرحلة تعليمية تفاعلية، مع كورسات شهادات مهنية، معمل قيود محاسبية، شات ذكاء اصطناعي فوري، حاسبات مالية، ومكتبة كتب شاملة."}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 w-full">
              <button
                onClick={() => onSelectTab("path")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-lg shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-600/70 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-3 border border-white/20"
              >
                <span>{isEn ? "Start Learning Free" : "ابدأ التعلم الآن"}</span>
                <ArrowLeft className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
              </button>

              <button
                onClick={() => onSelectTab("odooJournal")}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-800/80 via-purple-900/90 to-indigo-900/90 hover:from-purple-700 hover:to-indigo-800 text-purple-100 font-extrabold text-base shadow-xl shadow-purple-900/30 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2.5 border border-purple-400/40 backdrop-blur-xl"
              >
                <Building2 className="w-5 h-5 text-purple-300" />
                <span>{isEn ? "Odoo ERP Journal Lab 🏢" : "تسجيل قيود أودو Odoo 🏢"}</span>
                <span className="text-[10px] font-black bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-400/40">Odoo v17</span>
              </button>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full max-w-2xl">
              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-indigo-400">32</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Learning Stages" : "مرحلة تعليمية"}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-emerald-400">+1000</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Interactive Lessons" : "درس تفاعلي"}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-amber-400">+500</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Active Learners" : "مستخدم نشط"}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-pink-400">AI</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Smart Assistant" : "مساعد ذكي"}</span>
              </div>
            </div>

          </div>

          {/* Right Column: ULTRA-MODERN SMARTPHONE MOCKUP */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Ambient Multi-Layer Background Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 bg-gradient-to-tr from-indigo-600/40 via-purple-600/30 to-pink-500/25 rounded-full blur-3xl pointer-events-none" />

            {/* Smartphone Outer Metallic Chassis (Titanium Edition) */}
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
                        <span className="font-black text-xs text-white block leading-none">تطبيق ميزان</span>
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
                    </div>
                  </div>

                  {/* Phone Screen Switcher Segmented Control */}
                  <div className="grid grid-cols-5 bg-white/5 rounded-2xl p-1 gap-1 border border-white/10 text-[10px] font-black text-center shadow-inner">
                    <button
                      onClick={() => setPhoneTab("home")}
                      className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                        phoneTab === "home" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-black" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      الرئيسية
                    </button>
                    <button
                      onClick={() => setPhoneTab("chat")}
                      className={`py-1.5 rounded-xl transition-all cursor-pointer relative ${
                        phoneTab === "chat" ? "bg-purple-600 text-white shadow-md font-black" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      شات AI
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                    </button>
                    <button
                      onClick={() => setPhoneTab("stages")}
                      className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                        phoneTab === "stages" ? "bg-indigo-600 text-white shadow-md font-black" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      المراحل
                    </button>
                    <button
                      onClick={() => setPhoneTab("lab")}
                      className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                        phoneTab === "lab" ? "bg-blue-600 text-white shadow-md font-black" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      القيود
                    </button>
                    <button
                      onClick={() => setPhoneTab("flashcards")}
                      className={`py-1.5 rounded-xl transition-all cursor-pointer ${
                        phoneTab === "flashcards" ? "bg-emerald-600 text-white shadow-md font-black" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      قاموس
                    </button>
                  </div>
                </div>

                {/* PHONE VIEWPORT CONTENT */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 my-1 space-y-3">
                  
                  {/* TAB 1: HOME DASHBOARD */}
                  {phoneTab === "home" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/70 via-purple-900/50 to-slate-900 border border-indigo-500/40 text-white shadow-lg">
                        <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300">
                          <span>المرحلة الحالية</span>
                          <span>مستوى {levelNum}</span>
                        </div>
                        <h4 className="font-extrabold text-xs text-white mt-1">المعادلة المحاسبية وقيد اليومية</h4>
                        <p className="text-[10px] text-gray-300 mt-1">الأصول = الخصوم + حقوق الملكية</p>
                        
                        <div className="mt-2.5">
                          <div className="flex justify-between text-[9px] font-bold text-indigo-200 mb-1">
                            <span>نسبة التقدم</span>
                            <span>65%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[65%] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full" />
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenStage(1)}
                          className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                        >
                          <span>متابعة الدرس</span>
                          <Play className="w-3 h-3 fill-white" />
                        </button>
                      </div>

                      {/* Quick Action Tiles inside Phone */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPhoneTab("chat")}
                          className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-right cursor-pointer transition-all"
                        >
                          <MessageSquare className="w-4 h-4 text-purple-400 mb-1" />
                          <span className="font-extrabold text-[11px] text-white block">مساعد AI</span>
                          <span className="text-[9px] text-purple-300 block">اسأل عن أي قيد</span>
                        </button>

                        <button
                          onClick={() => setPhoneTab("lab")}
                          className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-right cursor-pointer transition-all"
                        >
                          <Calculator className="w-4 h-4 text-blue-400 mb-1" />
                          <span className="font-extrabold text-[11px] text-white block">معمل القيود</span>
                          <span className="text-[9px] text-blue-300 block">تطبيق مباشر</span>
                        </button>
                      </div>

                      {/* Achievements Strip */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-[11px] font-bold text-slate-200">وسام القيد المزدوج</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          مكتمل 100%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: INTERACTIVE MINI AI CHAT */}
                  {phoneTab === "chat" && (
                    <div className="space-y-2 flex flex-col justify-between h-full animate-fadeIn">
                      <div className="space-y-2 overflow-y-auto max-h-[360px] no-scrollbar p-1">
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl text-xs font-medium leading-relaxed max-w-[88%] space-y-1 ${
                              msg.sender === "user"
                                ? "bg-indigo-600 text-white ml-auto text-right rounded-br-none"
                                : "bg-white/10 text-slate-200 mr-auto text-right border border-white/10 rounded-bl-none"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span className="text-[8px] opacity-60 block font-mono text-left">{msg.time}</span>
                          </div>
                        ))}

                        {isAiThinking && (
                          <div className="p-2 rounded-xl bg-white/5 text-slate-400 text-[10px] animate-pulse flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>مساعد ميزان يحلل السؤال ويكتب الرد...</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Prompt Chips */}
                      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[9px]">
                        <button
                          onClick={() => handleSendMiniChat("ما هي المعادلة المحاسبية؟")}
                          className="px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 whitespace-nowrap cursor-pointer hover:bg-purple-500/30"
                        >
                          💡 المعادلة المحاسبية؟
                        </button>
                        <button
                          onClick={() => handleSendMiniChat("كيف أفرّق بين المدين والدائن؟")}
                          className="px-2 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 whitespace-nowrap cursor-pointer hover:bg-indigo-500/30"
                        >
                          ⚖️ مدين ولا دائن؟
                        </button>
                      </div>

                      {/* Input Box */}
                      <div className="flex items-center gap-1 pt-1 border-t border-white/10">
                        <input
                          type="text"
                          value={inputChat}
                          onChange={(e) => setInputChat(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMiniChat()}
                          placeholder="اكتب سؤالك هنا..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-400"
                        />
                        <button
                          onClick={() => handleSendMiniChat()}
                          className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: STAGES PATH */}
                  {phoneTab === "stages" && (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold text-white block">1. أساسيات المحاسبة</span>
                          <span className="text-[9px] text-indigo-300 block">10 أسئلة · 50 XP</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>

                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold text-white block">2. القيود اليومية والقيد المزدوج</span>
                          <span className="text-[9px] text-purple-300 block">12 سؤال · 60 XP</span>
                        </div>
                        <button
                          onClick={() => onOpenStage(2)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-black cursor-pointer"
                        >
                          ابدأ
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">3. الترحيل لدفتر الأستاذ</span>
                          <span className="text-[9px] text-slate-400 block">10 أسئلة · 50 XP</span>
                        </div>
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">قريباً</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between opacity-70">
                        <div>
                          <span className="text-xs font-bold text-white block">4. ميزان المراجعة والأخطاء</span>
                          <span className="text-[9px] text-slate-400 block">15 سؤال · 75 XP</span>
                        </div>
                        <span className="text-[9px] text-slate-400">🔒 مغلَق</span>
                      </div>

                      <button
                        onClick={() => onSelectTab("path")}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 text-xs font-black border border-white/10 cursor-pointer mt-1"
                      >
                        عرض جميع الـ 32 مرحلة ←
                      </button>
                    </div>
                  )}

                  {/* TAB 4: MINI JOURNAL LAB */}
                  {phoneTab === "lab" && (
                    <div className="space-y-3 p-1 animate-fadeIn">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 space-y-2">
                        <span className="text-[10px] text-blue-300 font-bold block">تمرين قيد تفاعلي سريع</span>
                        <h4 className="text-xs font-black text-white">{miniTx.title}</h4>
                        
                        <div className="space-y-1 text-[11px] font-mono">
                          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 flex justify-between">
                            <span>[من حـ/] {miniTx.debitAcc}</span>
                            <span className="font-bold">{miniTx.amount} (مدين)</span>
                          </div>

                          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex justify-between mr-3">
                            <span>[إلى حـ/] {miniTx.creditAcc}</span>
                            <span className="font-bold">{miniTx.amount} (دائن)</span>
                          </div>
                        </div>

                        {!miniTx.isApplied ? (
                          <button
                            onClick={() => {
                              setMiniTx((prev) => ({ ...prev, isApplied: true }));
                              setXpPoints((p) => p + 20);
                            }}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-lg cursor-pointer mt-2"
                          >
                            تثبيت القيد لكسب +20 XP 🎯
                          </button>
                        ) : (
                          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black text-center flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>تم تسجيل القيد بنجاح! (+20 XP)</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectTab("lab")}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                      >
                        <span>فتح معمل القيود الكامل</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* TAB 5: FLASHCARDS */}
                  {phoneTab === "flashcards" && (
                    <div className="space-y-3 p-1 animate-fadeIn">
                      <div
                        onClick={() => setCardFlipped(!cardFlipped)}
                        className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/50 via-teal-900/30 to-slate-900 border border-emerald-500/30 text-center space-y-2 cursor-pointer hover:border-emerald-400 transition-all min-h-[140px] flex flex-col justify-center items-center shadow-lg"
                      >
                        <span className="text-[10px] text-emerald-300 font-bold">
                          {cardFlipped ? "التعريف والمثال 💡" : "المصطلح المحاسبي 📖 (اضغط للقلب)"}
                        </span>

                        {!cardFlipped ? (
                          <h4 className="text-sm font-black text-white">{miniCards[cardIdx].term}</h4>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
                              {miniCards[cardIdx].def}
                            </p>
                            <p className="text-[10px] text-emerald-300 font-semibold pt-1">
                              مثال: {miniCards[cardIdx].example}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            setCardIdx((prev) => (prev + 1) % miniCards.length);
                            setCardFlipped(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3 text-emerald-400" />
                          <span>البطاقة التالية</span>
                        </button>

                        <button
                          onClick={() => onSelectTab("flashcards")}
                          className="text-emerald-300 font-extrabold underline cursor-pointer text-[10px]"
                        >
                          عرض كل الـ 500+ بطاقة ←
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer AI Prompt inside Phone */}
                <div className="mt-1 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 shrink-0">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    مساعد ميزان جاهز
                  </span>
                  <button
                    onClick={() => setPhoneTab("chat")}
                    className="text-purple-300 font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>شات AI محاكاة</span>
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </button>
                </div>

                {/* iOS Home Gesture Indicator Bar */}
                <div className="w-28 h-1 rounded-full bg-white/30 mx-auto mt-1 shrink-0" />

              </div>
            </div>

          </div>

        </div>

        {/* PROMINENT SECTOR SELECTION QUESTION WIZARD CARD */}
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1133] via-[#2D164E] to-[#140B22] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                <Briefcase className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>{isEn ? "Career Specialization Question" : "سؤال تحديد المسار المحاسبي والقطاع"}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                {isEn ? "Which accounting field do you plan to work in?" : "في أي مجال محاسبي تخطط للعمل؟ 🎯"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                اختر تخصصك القطاعي (المقاولات، المصانع والتكاليف، العقارات، المطاعم، التكنولوجيا، الضرائب، إلخ) للحصول فوراً على خريطة التعلم والقيود وشجرة الحسابات المخصصة!
              </p>
            </div>

            <button
              onClick={() => onSelectTab("sectors")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer hover:scale-105"
            >
              <span>{isEn ? "View All Sector Roadmaps" : "استكشاف كل خرائط القطاعات ←"}</span>
            </button>
          </div>

          {/* QUICK SECTOR BUTTON CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { id: "contracting", name: "محاسب مقاولات", icon: HardHat, color: "text-amber-300", badge: "الأكثر طلباً" },
              { id: "industrial", name: "محاسب مصانع وتكاليف", icon: Factory, color: "text-purple-300", badge: "تكاليف" },
              { id: "retail", name: "محاسب تجارة وتجزئة", icon: ShoppingCart, color: "text-emerald-300", badge: "مبيعات" },
              { id: "hospitality", name: "محاسب مطاعم وفنادق", icon: Utensils, color: "text-rose-300", badge: "ضيافة" },
              { id: "healthcare", name: "محاسب مستشفيات وتأمين", icon: Hospital, color: "text-cyan-300", badge: "طبي" },
              { id: "realestate", name: "محاسب عقارات وتطوير", icon: Building, color: "text-blue-300", badge: "أراضي" },
              { id: "tech_startups", name: "محاسب شركات ناشئة SaaS", icon: Laptop, color: "text-indigo-300", badge: "تكنولوجيا" },
              { id: "taxation_audit", name: "محاسب ضرائب ومراجعة", icon: FileCheck2, color: "text-yellow-300", badge: "فحص ضريبي" },
            ].map((sec) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => onSelectTab("sectors")}
                  className="p-3.5 rounded-2xl bg-[#130B22] hover:bg-[#1f1137] border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer flex flex-col items-center text-center space-y-2 group shadow-md"
                >
                  <div className={`p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform ${sec.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {sec.name}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-bold">
                    {sec.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

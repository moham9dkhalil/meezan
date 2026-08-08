import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { playSound } from "../utils/soundEffects";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Zap,
  Scale,
  Award,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Download,
  Share2,
  ChevronLeft,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Cpu,
  Layers,
  Calculator,
  Printer,
  Compass,
  CheckCircle2,
  PieChart,
  Image as ImageIcon,
  X,
  Eye,
  Paperclip,
  Upload
} from "lucide-react";

type PersonaType = "general" | "ifrs" | "socpa" | "odoo" | "analysis";

export function AiAssistantSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      sender: "ai",
      text: "أهلاً بك! أنا «مساعد ميزان» المستشار المحاسبي الذكي معزز بنماذج Gemini. 🤖\n\nأستطيع مساعدتك في:\n1. 📝 تحليل وتسجيل القيود اليومية والدفاتر المزدوجة.\n2. 🖼️ قراءة وتحليل الفواتير والمستندات المحاسبية المرفقة.\n3. 📘 شرح وتبسيط معايير المحاسبة الدولية (IFRS / IAS).\n4. 🎓 حل أسئلة وتطبيقات زمالة SOCPA وشهادات CMA & CPA.\n5. ⚡ توجيه القيود ودليل الحسابات في برامج Odoo ERP.\n6. 📊 تحليل القوائم المالية، النسب، والتدفقات النقدية.\n\nيمكنك كتابة سؤالك مباشرة أو إرفاق صورة فاتورة/مستند من جهازك!",
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ url: string; mimeType: string; data: string } | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("general");
  const [activeCategory, setActiveCategory] = useState<"all" | "entries" | "ifrs" | "exams" | "odoo">("all");
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميجابايت.");
      return;
    }

    playSound.click();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage({
        url: dataUrl,
        mimeType: file.type,
        data: dataUrl
      });
    };
    reader.readAsDataURL(file);

    // reset input so user can re-select same image if needed
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    playSound.click();
    setSelectedImage(null);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Speech Recognition (Dictation) setup
  const toggleRecording = () => {
    playSound.click();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("عذراً، ميزة الإملاء الصوتي غير مدعومة في متصفحك الحالي. يرجى تجربة متصفح Google Chrome.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "ar-SA";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMsg((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsRecording(false);
        };

        recognition.onerror = (err: any) => {
          console.error("Speech recognition error", err);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    }
  };

  // Text-To-Speech Read Aloud
  const toggleSpeech = (msgId: string, text: string) => {
    playSound.click();
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      // Clean up markdown markers for speech
      const cleanText = text.replace(/[*#`_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "ar-SA";
      utterance.rate = 0.95;
      
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Persona Options
  const personas = [
    { id: "general", name: "مساعد ميزان العام", icon: Bot, badge: "عام", color: "from-purple-600 to-indigo-600" },
    { id: "ifrs", name: "خبير معايير IFRS", icon: BookOpen, badge: "معايير دولية", color: "from-blue-600 to-cyan-600" },
    { id: "socpa", name: "مدرب SOCPA & CMA", icon: Award, badge: "زمالات واختبارات", color: "from-amber-600 to-orange-600" },
    { id: "odoo", name: "خبير Odoo ERP", icon: Cpu, badge: "ميكنة وأنظمة", color: "from-pink-600 to-rose-600" },
    { id: "analysis", name: "محلل القوائم المالية", icon: PieChart, badge: "نسب وتدفقات", color: "from-emerald-600 to-teal-600" }
  ];

  // Prompt categories
  const categories = [
    { id: "all", label: "الكل", icon: MessageSquare },
    { id: "entries", label: "قيود يومية", icon: Scale },
    { id: "ifrs", label: "معايير IFRS", icon: BookOpen },
    { id: "exams", label: "SOCPA / CMA", icon: Award },
    { id: "odoo", label: "نظام Odoo", icon: Cpu }
  ];

  const samplePrompts = [
    {
      cat: "entries",
      title: "قيد مبيعات مع خصم تجاري ونقدي",
      text: "كيف أسجل قيد مبيعات آجل بقيمة 10,000 ريال مع خصم تجاري 5% وخصم نقدي 2% إذا تم السداد خلال 10 أيام؟"
    },
    {
      cat: "entries",
      title: "إثبات وتوزيع الإهلاك",
      text: "إيه الفرق بين طريقة القسط الثابت ومجموع أرقام السنوات في حساب إهلاك الأصل الثابت مع إعطائي مثالاً بالقيد؟"
    },
    {
      cat: "ifrs",
      title: "معيار الإيرادات IFRS 15",
      text: "اشرح لي الخطوات الخمس للتعرف على الإيراد وفق معيار IFRS 15 بأسلوب مبسط جداً مع مثال عملي."
    },
    {
      cat: "ifrs",
      title: "معيار العقود الإيجارية IFRS 16",
      text: "كيف يتم معالجة عقد الإيجار التشغيلي لدى المستأجر وفق معيار IFRS 16 وإثبات أصل حق الاستخدام؟"
    },
    {
      cat: "exams",
      title: "سؤال زمالة SOCPA في التسويات",
      text: "أعطني سؤال اختيار من متعدد من مستوى امتحانات SOCPA في التسويات المحاسبية مع الشرح والحل."
    },
    {
      cat: "exams",
      title: "تحليل انحرافات التكاليف CMA",
      text: "اشرح لي انحراف المواد المباشرة (انحراف السعر وانحراف الكمية) كما يأتي في امتحان CMA."
    },
    {
      cat: "odoo",
      title: "إدخال قيد تسوية في Odoo 17",
      text: "كيف أقوم بإنشاء وتأكيد قيود تسوية الأجور والرواتب المستحقة في نظام Odoo v17 بأسلوب خطوة بخطوة؟"
    },
    {
      cat: "odoo",
      title: "شجرة الحسابات COA في Odoo",
      text: "ما هي القواعد الذهبية لترقيم وتصنيف دليل الحسابات Chart of Accounts في Odoo للشركات التجارية؟"
    }
  ];

  const filteredPrompts = activeCategory === "all"
    ? samplePrompts
    : samplePrompts.filter((p) => p.cat === activeCategory);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if ((!text && !selectedImage) || loading) return;

    playSound.click();
    setErrorMsg(null);
    setInputMsg("");

    const attachedImg = selectedImage;
    setSelectedImage(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text || "يرجى قراءة هذه الصورة أو المستند المحاسبي المرفق وتحليله وتوجيه القيد اليومي المناسب له.",
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      image: attachedImg || undefined
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          image: attachedImg ? { mimeType: attachedImg.mimeType, data: attachedImg.data } : undefined,
          persona: selectedPersona,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
            image: m.image ? { mimeType: m.image.mimeType, data: m.image.data } : undefined
          }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ في الاتصال بالذكاء الاصطناعي.");
      }

      playSound.success();
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply || "عذراً، لم أستطع فهم السؤال، يرجى المحاولة بأسلوب آخر.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "عذراً، تعذر الاتصال بـ Gemini API حالياً.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    playSound.click();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    playSound.click();
    setMessages([
      {
        id: "m0",
        sender: "ai",
        text: "تم بدء محادثة جديدة! أنا جاهز لإجابة جميع أسئلتك وتدريباتك المحاسبية.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setErrorMsg(null);
  };

  const handleExportChat = () => {
    playSound.click();
    let exportText = "=== محادثة مساعد ميزان المحاسبي الذكي (Mizan AI) ===\n\n";
    messages.forEach((m) => {
      exportText += `[${m.timestamp}] ${m.sender === "user" ? "المستخدم" : "مساعد ميزان"}:\n${m.text}\n\n-------------------------\n\n`;
    });

    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Mizan_AI_Chat_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper renderer to style debit/credit entry lines nicely inside AI text
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Highlight Debit Lines: [من حـ/ ...]
      if (line.includes("من حـ/") || line.includes("من ح/")) {
        return (
          <div key={idx} className="my-1.5 p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 font-mono font-black flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-500/30 text-[10px] text-red-300 font-bold shrink-0">مدين (Dr)</span>
            <span>{line}</span>
          </div>
        );
      }
      // Highlight Credit Lines: [إلى حـ/ ...]
      if (line.includes("إلى حـ/") || line.includes("إلى ح/")) {
        return (
          <div key={idx} className="my-1.5 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 font-mono font-black flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-[10px] text-emerald-300 font-bold shrink-0">دائن (Cr)</span>
            <span>{line}</span>
          </div>
        );
      }
      return <div key={idx} className="min-h-[1rem]">{line}</div>;
    });
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-2 sm:px-4 text-right dir-rtl font-sans">
      
      {/* Main Heading Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 border border-purple-500/30 text-purple-200 text-xs font-black shadow-lg">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>مساعد Mizan AI المحاسبي التفاعلي المتقدم</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          المستشار المحاسبي الذكي{" "}
          <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            بين يديك
          </span>
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium max-w-2xl mx-auto">
          احصل على تحليلات دقيقة لقيود اليومية، معايير IFRS، تدريبات SOCPA & CMA، وشروحات Odoo مع إمكانيات الإملاء الصوتي والقراءة الفورية.
        </p>
      </div>

      {/* PERSONA SELECTION SWITCHER BAR */}
      <div className="mb-6 bg-[#130b21] p-2 rounded-2xl border border-purple-500/30 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xl">
        <span className="text-xs font-black text-purple-300 shrink-0 px-2 flex items-center gap-1">
          <Compass className="w-4 h-4 text-pink-400" />
          <span>وضع الخبير:</span>
        </span>
        {personas.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                playSound.click();
                setSelectedPersona(p.id as PersonaType);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isSelected
                  ? `bg-gradient-to-r ${p.color} text-white border-white/40 shadow-lg shadow-purple-600/30 font-black`
                  : "bg-[#0a0512] text-slate-300 border-white/10 hover:border-purple-400/30 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${isSelected ? "bg-black/30 text-white" : "bg-white/5 text-purple-300"}`}>
                {p.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN LAYOUT: CHAT WORKSPACE (LEFT 8 COLS) + SIDE KNOWLEDGE PANEL (RIGHT 4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CHAT WINDOW */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Quick Filter Category Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playSound.click();
                      setActiveCategory(cat.id as any);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isActive
                        ? "bg-purple-600/40 text-purple-200 border-purple-400/60 font-black shadow-md"
                        : "bg-[#0f091a] text-slate-400 border-white/10 hover:border-purple-400/30 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleExportChat}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="تصدير نص المحادثة إلى ملف نصي"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">تصدير المحادثة</span>
            </button>
          </div>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredPrompts.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.text)}
                className="p-3 rounded-2xl bg-[#120a1f] hover:bg-[#1b0e30] border border-white/10 hover:border-purple-400/40 text-right transition-all cursor-pointer group flex flex-col justify-between shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-[11px] font-black text-purple-300 mb-1">
                  <span>{prompt.title}</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {prompt.text}
                </p>
              </button>
            ))}
          </div>

          {/* MAIN CHAT BOX CONTAINER */}
          <div className="bg-[#0e0717] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] relative">
            
            {/* Header Bar */}
            <div className="p-4 bg-gradient-to-r from-[#170e28] via-[#1d1133] to-[#170e28] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg border border-white/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0e0717] animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      مساعد ميزان الذكي
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-500/20 border border-purple-400/30 text-purple-300">
                      Gemini 3.6 Flash
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    الوضع النشط: <span className="text-purple-300 font-bold">{personas.find(p => p.id === selectedPersona)?.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10 flex items-center gap-1.5 text-xs font-bold"
                  title="بدء محادثة جديدة"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">محادثة جديدة</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-6 no-scrollbar bg-[#080311]">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 transition-all ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Expressive Avatar with Glow Ring */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-xl transition-transform hover:scale-105 ${
                          isUser
                            ? "bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400/50"
                            : "bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-600 text-white ring-2 ring-purple-400/50 shadow-purple-900/50"
                        }`}
                      >
                        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#080311] ${
                          isUser ? "bg-indigo-400" : "bg-emerald-400 animate-pulse"
                        }`}
                      />
                    </div>

                    {/* Message Bubble Container */}
                    <div className="max-w-[88%] sm:max-w-[82%] space-y-1.5">
                      
                      {/* Sender Header Name & Expressive Emoji */}
                      <div
                        className={`flex items-center gap-2 text-[11px] font-bold px-1 ${
                          isUser ? "justify-end text-indigo-300" : "justify-start text-purple-300"
                        }`}
                      >
                        {isUser ? (
                          <>
                            <span className="font-mono text-slate-400 text-[10px]">{msg.timestamp}</span>
                            <span className="text-slate-300">أنت (المستخدم)</span>
                            <span className="text-xs">🙋‍♂️</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs">🤖</span>
                            <span className="font-black text-white">مساعد ميزان</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-200 border border-purple-400/30 font-extrabold">
                              {personas.find((p) => p.id === selectedPersona)?.badge || "مستشار ذكي"}
                            </span>
                            <span className="font-mono text-slate-400 text-[10px] mr-auto">{msg.timestamp}</span>
                          </>
                        )}
                      </div>

                      {/* MODERN BUBBLE CARD */}
                      <div
                        className={`p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-2xl relative group transition-all ${
                          isUser
                            ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white font-medium rounded-3xl rounded-tr-sm border border-indigo-400/40 shadow-indigo-950/60"
                            : "bg-[#180e2d] text-slate-100 border border-purple-500/30 rounded-3xl rounded-tl-sm shadow-black/80 backdrop-blur-sm"
                        }`}
                      >
                        {/* ATTACHED IMAGE DISPLAY */}
                        {msg.image?.url && (
                          <div className="mb-3 space-y-1">
                            <div className="relative group/img inline-block overflow-hidden rounded-2xl border border-white/20 shadow-lg bg-black/40 max-w-sm">
                              <img
                                src={msg.image.url}
                                alt="المستند المحاسبي المرفق"
                                className="max-h-56 w-auto object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setPreviewModalImage(msg.image!.url)}
                              />
                              <button
                                type="button"
                                onClick={() => setPreviewModalImage(msg.image!.url)}
                                className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border border-white/20 cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-pink-400" />
                                <span>تكبير المستند</span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          {renderFormattedText(msg.text)}
                        </div>

                        {/* AI Response Footer Quick Action Bar */}
                        {!isUser && (
                          <div className="pt-3 mt-3 border-t border-white/10 space-y-2.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-[9px] text-purple-300 font-mono font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-pink-400" />
                                <span>Gemini AI Engine</span>
                              </span>
                              
                              <div className="flex items-center gap-1.5">
                                {/* Speech Read Aloud Button */}
                                <button
                                  onClick={() => toggleSpeech(msg.id, msg.text)}
                                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer border font-bold text-[11px] ${
                                    speakingMsgId === msg.id
                                      ? "bg-purple-600 text-white border-purple-400 animate-pulse shadow-md"
                                      : "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10"
                                  }`}
                                  title={speakingMsgId === msg.id ? "إيقاف القراءة" : "قراءة صوتية للرسالة"}
                                >
                                  {speakingMsgId === msg.id ? (
                                    <>
                                      <VolumeX className="w-3.5 h-3.5 text-pink-300" />
                                      <span className="text-pink-200">إيقاف</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                                      <span>🔊 استماع</span>
                                    </>
                                  )}
                                </button>

                                {/* Copy Button */}
                                <button
                                  onClick={() => copyText(msg.id, msg.text)}
                                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer border border-white/10 text-[11px] font-bold"
                                >
                                  {copiedId === msg.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400">تم النسخ ✨</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                                      <span>📋 نسخ</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Quick Interactive Follow-up Prompts */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5">
                              <span className="text-[10px] text-slate-400 font-bold ml-1">تكملة سريعة:</span>
                              <button
                                onClick={() => handleSend("اعطني مثالاً تطبيقياً بالمبالغ بالجنيه/الريال لنفس القيد")}
                                className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/25 text-purple-200 border border-purple-500/30 text-[10px] font-bold cursor-pointer transition-all hover:scale-105"
                              >
                                💡 مثال بالأرقام
                              </button>
                              <button
                                onClick={() => handleSend("كيف أسجل هذا القيد في شاشة Odoo اليومية؟")}
                                className="px-2.5 py-1 rounded-xl bg-pink-500/10 hover:bg-pink-500/25 text-pink-200 border border-pink-500/30 text-[10px] font-bold cursor-pointer transition-all hover:scale-105"
                              >
                                ⚡ تطبيق Odoo
                              </button>
                              <button
                                onClick={() => handleSend("اختبرني في هذا الموضوع بسؤال اختيار من متعدد")}
                                className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 text-[10px] font-bold cursor-pointer transition-all hover:scale-105"
                              >
                                🎯 سؤال اختباري
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Typing Loader */}
              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="bg-[#160b26] border border-purple-500/30 p-3.5 rounded-2xl flex items-center gap-2 text-xs text-purple-200 font-bold shadow-lg">
                    <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                    <span>مساعد ميزان يحلل السؤال ويكتب الإجابة المحاسبية المنظمة...</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Control Bar */}
            <div className="p-3 bg-[#11071f] border-t border-white/10 space-y-2.5">
              
              {/* SUGGESTED QUESTIONS CHIPS SECTION */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-1 text-[11px] font-black text-purple-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                  <span>أسئلة مقترحة سريعة:</span>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { label: "📝 إثبات شراء أصل مع مصاريف نقل", prompt: "كيف أثبت قيد شراء أصل ثابت مع مصاريف النقل والتركيب بالجنيه/الريال؟" },
                    { label: "📘 الفرق بين IFRS 15 و IFRS 16", prompt: "شرح مبسط للفرق بين معيار الإيرادات IFRS 15 ومعيار العقود الإيجارية IFRS 16" },
                    { label: "📊 حساب رأس المال العامل Working Capital", prompt: "كيف أحسب صافي رأس المال العامل وأثر النسبة على السيولة؟" },
                    { label: "⚡ قيد تسوية أجور في Odoo 17", prompt: "خطوات توجيه وإنشاء قيد تسوية الأجور والرواتب المستحقة في Odoo ERP" },
                    { label: "🎓 تدريب سؤال زمالة SOCPA / CMA", prompt: "اعطني سؤال اختبار اختيار من متعدد بمستوى SOCPA أو CMA مع التفسير والحل" }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(item.prompt)}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-600/40 border border-purple-400/30 hover:border-purple-400/60 text-purple-200 hover:text-white text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all hover:scale-105 shadow-sm shrink-0 flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECTED IMAGE PREVIEW BADGE */}
              {selectedImage && (
                <div className="p-2 bg-[#1a0f30] border border-purple-500/40 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={selectedImage.url}
                      alt="مستند مرفق"
                      className="w-12 h-12 object-cover rounded-xl border border-white/20 shrink-0"
                    />
                    <div className="text-right overflow-hidden">
                      <span className="block text-xs font-bold text-white truncate">صورة فاتورة/مستند جاهزة للإرسال 📷</span>
                      <span className="block text-[10px] text-purple-300">سيقوم Gemini بقراءتها واستخراج القيد المحاسبي</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 transition-all cursor-pointer shrink-0"
                    title="إزالة المستند المرفق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* HIDDEN FILE INPUT FOR IMAGE UPLOAD */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              <div className="flex items-center gap-2 bg-[#090312] border border-white/15 rounded-2xl p-1.5 focus-within:border-purple-400 transition-all shadow-inner">
                
                {/* Image Upload Button */}
                <button
                  type="button"
                  onClick={() => {
                    playSound.click();
                    fileInputRef.current?.click();
                  }}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 border ${
                    selectedImage
                      ? "bg-purple-600 text-white border-purple-300 shadow-md shadow-purple-600/40"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10"
                  }`}
                  title="إرفاق صورة فاتورة أو مستند من جهازك"
                >
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                </button>

                {/* Voice Dictation Microphone Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                    isRecording
                      ? "bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/50"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                  }`}
                  title={isRecording ? "جاري الاستماع... اضغط للإيقاف" : "إملاء صوتي باللغة العربية"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-400" />}
                </button>

                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    isRecording
                      ? "جاري الاستماع لصوتك باللغة العربية..."
                      : selectedImage
                      ? "اكتب تفاصيل إضافية عن الفاتورة أو اضغط إرسال مباشرة..."
                      : "اكتب معاملة مالية، سؤال، أو ارفع صورة فاتورة..."
                  }
                  className="flex-1 bg-transparent border-none px-2 py-2 text-xs sm:text-sm text-white font-medium outline-none placeholder-slate-400"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={loading || (!inputMsg.trim() && !selectedImage)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 text-white font-black cursor-pointer transition-all shadow-lg shadow-purple-600/30 shrink-0 flex items-center gap-1.5 text-xs"
                >
                  <span>إرسال</span>
                  <Send className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-2">
                <span className="flex items-center gap-1 text-purple-300 font-bold">
                  <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>تلميح: يمكنك إرفاق أي صورة فاتورة أو بيان حساب ليقوم مساعد ميزان بقراءته فوراً!</span>
                </span>
                <span className="hidden sm:inline font-mono text-slate-500">Enter للإرسال</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: KNOWLEDGE REFERENCE & QUICK CALCULATOR TOOLS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Box 1: Golden Rules Cheat Sheet */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#150a26] to-[#0e061a] border border-purple-500/30 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-white/10 pb-2.5">
              <Scale className="w-4 h-4 text-pink-400" />
              <span>القواعد الذهبية للمدين والدائن</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                <span className="font-extrabold text-emerald-400 block mb-0.5">🟢 طبيعتها مدينة (Debit - Dr)</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  تزيد بالمدين وتقل بالدائن: <strong>الأصول، المصروفات، والمسحوبات الشخصية.</strong>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200">
                <span className="font-extrabold text-purple-400 block mb-0.5">🟣 طبيعتها دائنة (Credit - Cr)</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  تزيد بالدائن وتقل بالمدين: <strong>الإيرادات، الخصوم (الالتزامات)، وحقوق الملكية.</strong>
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-[11px] text-center font-mono font-black">
              الأصول = الالتزامات + حقوق الملكية
            </div>
          </div>

          {/* Box 2: Quick Template Prompts */}
          <div className="p-5 rounded-3xl bg-[#12071f] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-white/10 pb-2.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>أسئلة شائعة وسريعة</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => handleSend("شراء أصل ثابت بشيك ونقداً مع المصاريف الرأسمالية")}
                className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer border border-white/5 font-medium flex items-center justify-between"
              >
                <span>شراء أصل مع مصاريف نقل وتركيب</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => handleSend("كيف أعد قائمة التدفقات النقدية بالطريقة المباشرة وغير المباشرة؟")}
                className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer border border-white/5 font-medium flex items-center justify-between"
              >
                <span>شرح التدفقات النقدية المباشرة</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => handleSend("كيف يتم المعالجة المحاسبية للديون المعدومة ومخصص الديون المشكوك فيها؟")}
                className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer border border-white/5 font-medium flex items-center justify-between"
              >
                <span>الديون المعدومة ومخصصها</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => handleSend("كيف أحسب القيمة الحالية والمستقبلية للتدفقات النقدية PV & FV؟")}
                className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer border border-white/5 font-medium flex items-center justify-between"
              >
                <span>حساب القيمة الحالية PV</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Box 3: Certificate & Badges Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/40 border border-purple-500/30 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-white">مدرب لاختبارات الزمالة والشهادات</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              يدعم التحضير لاختبارات SOCPA ،CMA ،CPA ،IFRS Dip من خلال أسئلة وشروح نموذجية متوافقة مع أحدث المناهج.
            </p>
          </div>

        </div>

      </div>

      {/* FULL-SCREEN IMAGE LIGHTBOX MODAL */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center space-y-3">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-10 left-0 sm:left-2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
              title="إغلاق معاينة الصورة"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={previewModalImage}
              alt="معاينة المستند المحاسبي المرفق"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl border border-white/20 shadow-2xl"
            />

            <div className="flex items-center gap-3 pt-2">
              <a
                href={previewModalImage}
                download="invoice_document.png"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصورة</span>
              </a>

              <button
                onClick={() => setPreviewModalImage(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

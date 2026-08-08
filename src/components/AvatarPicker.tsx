import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, User, ShieldCheck, Star } from "lucide-react";

export interface AvatarOption {
  emoji: string;
  label: string;
  category: "EXEC" | "ANALYST" | "SCHOLAR" | "INNOVATOR" | "EMBLEM";
  badge?: string;
}

export const RICH_AVATARS: AvatarOption[] = [
  // EXECUTIVES & PROFESSIONALS
  { emoji: "👨‍💼", label: "محاسب رئيسي (Senior Accountant)", category: "EXEC", badge: "محترف" },
  { emoji: "👩‍💼", label: "محاسبة مالية متميزة", category: "EXEC", badge: "محترفة" },
  { emoji: "💼", label: "مدير الشؤون المالية", category: "EXEC" },
  { emoji: "👔", label: "مستشار مالي وإداري", category: "EXEC" },
  { emoji: "👑", label: "مدير مالي تنفيذي (CFO)", category: "EXEC", badge: "قيادي" },
  { emoji: "🏛️", label: "مراجع حسابات قانوني", category: "EXEC" },
  { emoji: "🕴️", label: "خبير التدقيق والامتثال", category: "EXEC" },
  { emoji: "🎩", label: "شريك في مكتب مراجعة", category: "EXEC" },

  // ANALYSTS & SPECIALISTS
  { emoji: "📊", label: "محلل قوائم وتقارير مالية", category: "ANALYST", badge: "تحليل" },
  { emoji: "📈", label: "محلل استثمار وتكاليف", category: "ANALYST" },
  { emoji: "⚖️", label: "أخصائي المعايير الدولية IFRS", category: "ANALYST", badge: "IFRS" },
  { emoji: "🔍", label: "مفتش ومراجع داخلي", category: "ANALYST" },
  { emoji: "🧮", label: "حاسب تكاليف وضرائب", category: "ANALYST" },
  { emoji: "💻", label: "محاسب أنظمة ERP وبرمجيات", category: "ANALYST" },
  { emoji: "⚙️", label: "مهندس عمليات محاسبية", category: "ANALYST" },
  { emoji: "📉", label: "أخصائي إدارة المخاطر المالية", category: "ANALYST" },

  // SCHOLARS & STUDENTS
  { emoji: "🎓", label: "طالب محاسبة وزميل SOCPA", category: "SCHOLAR", badge: "SOCPA" },
  { emoji: "👨‍🎓", label: "باحث في العلوم المالية", category: "SCHOLAR" },
  { emoji: "👩‍🎓", label: "خريجة محاسبة متميزة", category: "SCHOLAR" },
  { emoji: "📜", label: "حامل شهادة CMA المعتمدة", category: "SCHOLAR", badge: "CMA" },
  { emoji: "📖", label: "شغوف بالمعايير والقيود", category: "SCHOLAR" },
  { emoji: "📚", label: "مدرس محاضر ماليات", category: "SCHOLAR" },
  { emoji: "🏆", label: "متصدر الأوائل في المسار", category: "SCHOLAR", badge: "متفوق" },

  // INNOVATORS & TECH ACCOUNTANTS
  { emoji: "⚡", label: "محاسب أتمتة وذكاء اصطناعي", category: "INNOVATOR", badge: "AI" },
  { emoji: "🚀", label: "رائد أعمال مالي متطور", category: "INNOVATOR" },
  { emoji: "💎", label: "مستشار ثروات وأصول", category: "INNOVATOR" },
  { emoji: "🌐", label: "محاسب التجارة الرقمية", category: "INNOVATOR" },
  { emoji: "🧠", label: "مفكر إستراتيجي مالي", category: "INNOVATOR" },
  { emoji: "🎯", label: "مخطط مالي دقيق", category: "INNOVATOR" },
  { emoji: "🛡️", label: "حارس الأصول والسيليكون", category: "INNOVATOR" },
  { emoji: "🔥", label: "محاسب الشغف اليومي", category: "INNOVATOR" },

  // PREMIUM EMBLEMS
  { emoji: "⚜️", label: "شعار الفخامة المالية", category: "EMBLEM", badge: "VIP" },
  { emoji: "🥇", label: "الميدالية الذهبية المحاسبية", category: "EMBLEM" },
  { emoji: "🌟", label: "النجم المحاسبي اللامع", category: "EMBLEM" },
  { emoji: "🏆", label: "كأس التميز المهني", category: "EMBLEM" }
];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
  compact?: boolean;
}

export function AvatarPicker({
  selectedAvatar,
  onSelectAvatar,
  compact = false
}: AvatarPickerProps) {
  const [activeCategory, setActiveCategory] = useState<"ALL" | "EXEC" | "ANALYST" | "SCHOLAR" | "INNOVATOR" | "EMBLEM">("ALL");
  const [customEmoji, setCustomEmoji] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredAvatars = activeCategory === "ALL"
    ? RICH_AVATARS
    : RICH_AVATARS.filter(a => a.category === activeCategory);

  const selectedItem = RICH_AVATARS.find(a => a.emoji === selectedAvatar) || {
    emoji: selectedAvatar || "👨‍💼",
    label: "رمز تعبيري مخصص",
    badge: "مخصص"
  };

  const categories = [
    { id: "ALL", label: "الكل", icon: "🌐" },
    { id: "EXEC", label: "قياديون", icon: "👔" },
    { id: "ANALYST", label: "محللون", icon: "📊" },
    { id: "SCHOLAR", label: "أكاديميون", icon: "🎓" },
    { id: "INNOVATOR", label: "ابتكار", icon: "⚡" },
    { id: "EMBLEM", label: "شارات", icon: "👑" },
  ] as const;

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Selected Live Card */}
        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <motion.div
              key={selectedAvatar}
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/50 flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/30 shrink-0"
            >
              {selectedAvatar || "👨‍💼"}
            </motion.div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{selectedItem.label}</span>
                {selectedItem.badge && (
                  <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-md">
                    {selectedItem.badge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">انقر أدناه للتبديل السريع بين الرموز الاحترافية</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10 shrink-0 cursor-pointer"
          >
            {showCustomInput ? "إغلاق المخصص" : "رمز آخر ✏️"}
          </motion.button>
        </div>

        {/* Custom Input field if toggled */}
        <AnimatePresence>
          {showCustomInput && (
            <motion.div
              key="custom-avatar-input-mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2.5 rounded-xl bg-black/60 border border-indigo-500/40 flex items-center gap-2 overflow-hidden"
            >
              <span className="text-xs text-slate-300 font-bold shrink-0">اكتب أي إيموجي أو حرف:</span>
              <input
                type="text"
                maxLength={2}
                value={customEmoji}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomEmoji(val);
                  if (val) onSelectAvatar(val);
                }}
                placeholder="مثال: 💼 أو A"
                className="w-20 bg-black border border-white/20 rounded-lg text-center text-lg text-white py-1 focus:outline-none focus:border-indigo-400"
              />
              <span className="text-[10px] text-emerald-400 font-bold">تطبيق مباشر ✨</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Bar */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Compact Horizontal Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-600">
          {filteredAvatars.map((item, idx) => {
            const isSelected = selectedAvatar === item.emoji;
            return (
              <motion.button
                key={item.emoji + idx}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={() => onSelectAvatar(item.emoji)}
                title={item.label}
                className={`relative h-11 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-tr from-indigo-600 to-purple-600 border-indigo-400 shadow-lg shadow-indigo-600/50"
                    : "bg-black/40 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span>{item.emoji}</span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[8px] font-black shadow-sm"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Full Rich Grid Layout
  return (
    <div className="space-y-5">
      
      {/* Selected Avatar Highlight Header */}
      <motion.div
        layout
        className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-[#0a1024] to-purple-950/80 border border-indigo-500/40 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          
          <div className="relative group">
            <motion.div
              key={selectedAvatar}
              initial={{ scale: 0.6, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-indigo-400/80 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-indigo-600/40"
            >
              {selectedAvatar || "👨‍💼"}
            </motion.div>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-emerald-500 text-black text-[10px] font-black shadow-md flex items-center gap-0.5"
            >
              <Check className="w-3 h-3" />
              <span>محدد</span>
            </motion.span>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-base sm:text-lg font-black text-white">{selectedItem.label}</h4>
              {selectedItem.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {selectedItem.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">الرمز الظاهر في بطاقة الشرف والملف الشخصي والمسابقات</p>
          </div>

        </div>

        {/* Custom Input Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10 transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{showCustomInput ? "إغلاق الرمز المخصص" : "إدخال إيموجي خاص"}</span>
        </motion.button>
      </motion.div>

      {/* Custom Emoji Input Box */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            key="custom-avatar-input-desktop"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="p-4 rounded-2xl bg-black/60 border border-indigo-500/50 space-y-2 overflow-hidden"
          >
            <label className="text-xs font-black text-indigo-300 block">
              اكتب الرمز التعبيري أو الحرف الأول الذي تفضله (Custom Avatar):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                maxLength={3}
                value={customEmoji}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomEmoji(val);
                  if (val) onSelectAvatar(val);
                }}
                placeholder="ضع إيموجي هنا (مثلاً: 👑 أو A)"
                className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-bold"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  if (customEmoji) onSelectAvatar(customEmoji);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer shrink-0"
              >
                اعتماد الرمز
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1 rounded-2xl bg-[#080d1e] border border-white/10">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Full Grid of Avatars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-600">
        {filteredAvatars.map((item, idx) => {
          const isSelected = selectedAvatar === item.emoji;
          return (
            <motion.button
              key={item.emoji + idx}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => onSelectAvatar(item.emoji)}
              className={`p-3 rounded-2xl border text-right transition-colors cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                isSelected
                  ? "bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-400 shadow-xl shadow-indigo-600/30"
                  : "bg-black/40 border-white/10 hover:bg-white/10 hover:border-indigo-500/30"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${
                isSelected ? "bg-indigo-600 text-white shadow-md" : "bg-white/5 border border-white/10"
              }`}>
                {item.emoji}
              </div>

              <div className="overflow-hidden space-y-0.5">
                <div className="text-xs font-black text-white truncate group-hover:text-indigo-200">
                  {item.label}
                </div>
                {item.badge ? (
                  <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded border border-indigo-500/30 inline-block">
                    {item.badge}
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500 block">رمز احترافي</span>
                )}
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-black shadow-md"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}

import { useState, useEffect, FormEvent } from "react";
import { INITIAL_REVIEWS } from "../data/seedReviews";
import { Review } from "../types";
import { Language } from "../data/translations";
import { Star, MessageSquarePlus, User, CheckCircle2 } from "lucide-react";

interface TestimonialsSectionProps {
  appLanguage?: Language;
}

export function TestimonialsSection({ appLanguage = "ar" }: TestimonialsSectionProps) {
  const isEn = appLanguage === "en";
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_reviews");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formText, setFormText] = useState("");
  const [selectedStars, setSelectedStars] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("meezan_reviews", JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Calculate Average Stars
  const avgStars = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length).toFixed(1)
    : "4.8";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) return;

    const newRev: Review = {
      id: Date.now().toString(),
      name: formName.trim(),
      role: formRole.trim() || "متعلم في ميزان",
      text: formText.trim(),
      stars: selectedStars,
      createdAt: "الآن"
    };

    setReviews([newRev, ...reviews]);
    setFormName("");
    setFormRole("");
    setFormText("");
    setSelectedStars(5);
    setIsSubmitted(true);

    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-extrabold">
          <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
          <span>{isEn ? "Learner Reviews & Feedback" : "آراء وتقييمات مجتمع ميزان"}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          {isEn ? "What do students and accountants say about Meezan?" : "ماذا يقول الطلاب والمحاسبون عن ميزان؟"}
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
          {isEn
            ? "Join over 120,000 learners mastering accounting with Meezan. Share your authentic review to help others."
            : "أكثر من 120 ألف متعلم يستمتعون بتجربة ميزان. شارك رأيك وتقييمك الحقيقي معنا ليدعم باقي زملائك."}
        </p>
      </div>

      {/* Average Score Banner */}
      <div className="glass-panel p-6 rounded-3xl mb-10 max-w-xl mx-auto flex items-center justify-around border border-white/10 text-center shadow-xl">
        <div>
          <span className="text-4xl font-black text-amber-400 block">{avgStars}</span>
          <div className="flex items-center justify-center gap-1 text-amber-400 my-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400 block">
            {isEn ? `Out of ${reviews.length} total reviews` : `من إجمالي ${reviews.length} تقييماً`}
          </span>
        </div>

        <div className="h-12 w-px bg-white/10" />

        <div className="text-right rtl:text-right ltr:text-left">
          <span className="text-sm font-extrabold text-white block">{isEn ? "Verified Genuine Reviews" : "تقييمات حقيقية موثقة"}</span>
          <span className="text-xs text-gray-400 mt-1 block max-w-[200px]">
            {isEn ? "From app users, universities, and corporate professionals" : "من مستخدمي التطبيق والجامعات والشركات بالوطن العربي"}
          </span>
        </div>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-pink-500/30 transition-all duration-300 flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.stars ? "fill-amber-400 text-amber-400" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal mb-4 italic">
                "{rev.text}"
              </p>
            </div>

            {/* Author */}
            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">{rev.name}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Form */}
      <div className="max-w-2xl mx-auto bg-[#0d1424] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 text-pink-300 font-black text-lg border-b border-white/10 pb-3">
          <MessageSquarePlus className="w-5 h-5 text-pink-400" />
          <span>أضف تقييمك وتجربتك مع ميزان 📝</span>
        </div>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl font-extrabold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>شكراً جزيلاً! تم نشر تقييمك فورياً في المنصة.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: د. أحمد المحاسب"
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">الوظيفة / الجامعة (اختياري)</label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="مثال: طالب بكالوريوس تجارة"
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-pink-400"
                />
              </div>
            </div>

            {/* Star Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">حدد التقييم بالنجوم *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedStars(s)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= selectedStars
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-300 mr-2">
                  ({selectedStars} من 5 نجوم)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">اكتب رأيك بالتفصيل *</label>
              <textarea
                required
                rows={3}
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="اكتب انطباعك عن الدروس، المعمل، وحاسبات ميزان..."
                className="w-full bg-[#080c1c] border border-white/10 rounded-2xl p-3 text-xs text-white font-medium outline-none focus:border-pink-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-pink-600/30 hover:opacity-90 cursor-pointer transition-all"
            >
              نشر التقييم في المنصة 🚀
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { Newspaper, Search, UserCheck, Link2, FolderOpen } from "lucide-react";
import { fetchPublishedCms, CmsItem, CmsCollection } from "../utils/cms";

const TABS: { id: CmsCollection; label: string }[] = [
  { id: "lesson", label: "الدروس المنسّقة" },
  { id: "tax", label: "المواد الضريبية" },
  { id: "quiz", label: "أسئلة مختارة" },
  { id: "reference", label: "المراجع والمعايير" },
];

export const ContentLibrarySection: React.FC = () => {
  const [tab, setTab] = useState<CmsCollection>("lesson");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPublishedCms(tab)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const filtered = items.filter(
    (i) =>
      !query.trim() ||
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.body.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6 dir-rtl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black mb-3">
          <Newspaper className="w-4 h-4" />
          محتوى منسّق ومنشور من فريق المنصة
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">مكتبة المحتوى المنسّق</h2>
        <p className="text-sm text-slate-400 mt-1">دروس ومصادر ضريبية وأسئلة ومراجع مختارة ومحدّثة — يراجعها المختصون، مع المصدر الرسمي واسم المراجع.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                tab === t.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 border-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث في المحتوى…"
            className="pr-9 pl-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 w-56"
          />
        </div>
      </div>

      {loading && <p className="text-center text-xs text-slate-400 py-8">جارٍ تحميل المحتوى...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-xs text-slate-400 py-8">لا يوجد محتوى منشور بعد في هذا التصنيف.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <article key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-black text-white leading-snug">{item.title}</h3>
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                {item.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{item.body}</p>
            <div className="flex flex-wrap gap-2 text-[10px] pt-2 border-t border-slate-800/70">
              {item.reference && (
                <span className="flex items-center gap-1 text-slate-400">
                  <FolderOpen className="w-3 h-3 text-amber-400" />
                  المرجع: <b className="text-slate-200">{item.reference}</b>
                </span>
              )}
              {item.source && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Link2 className="w-3 h-3 text-cyan-400" />
                  المصدر الرسمي: <b dir="ltr" className="text-cyan-300">{item.source}</b>
                </span>
              )}
              {item.reviewedBy && (
                <span className="flex items-center gap-1 text-slate-400">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  مراجعة: <b className="text-emerald-300">{item.reviewedBy}</b>
                </span>
              )}
              {item.updatedAt && (
                <span className="text-slate-500 ml-auto">
                  تحديث: {new Date(item.updatedAt).toLocaleDateString("ar-EG")}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ContentLibrarySection;
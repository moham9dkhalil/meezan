import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Ticket,
  FolderOpen,
  Link2,
  UserCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserProfile } from "../types";
import {
  fetchAdminCms,
  saveAdminCmsItem,
  deleteAdminCmsItem,
  fetchAdminTickets,
  updateAdminTicket,
  CmsItem,
  CmsCollection,
  Ticket as SupportTicket,
} from "../utils/cms";

const COLLECTIONS: { id: CmsCollection; label: string }[] = [
  { id: "lesson", label: "دروس" },
  { id: "tax", label: "ضرائب" },
  { id: "quiz", label: "أسئلة" },
  { id: "reference", label: "مراجع" },
];

const EMPTY_ITEM: CmsItem = {
  id: "",
  title: "",
  body: "",
  category: "",
  reference: "",
  source: "",
  reviewedBy: "",
  published: true,
  updatedAt: "",
};

type AdminTab = "content" | "tickets";

export const AdminDashboardSection: React.FC<{ currentUser: UserProfile | null }> = ({ currentUser }) => {
  const [tab, setTab] = useState<AdminTab>("content");
  const [collection, setCollection] = useState<CmsCollection>("lesson");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CmsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [ticketStatus, setTicketStatus] = useState<Record<string, string>>({});
  const [ticketNotes, setTicketNotes] = useState<Record<string, string>>({});

  const refreshCms = () => {
    setLoading(true);
    setError("");
    fetchAdminCms(collection)
      .then(setItems)
      .catch((e) => setError(e.message || "تعذر تحميل المحتوى."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshCms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  useEffect(() => {
    if (tab !== "tickets") return;
    setLoading(true);
    fetchAdminTickets()
      .then((data) => {
        setTickets(data);
        setTicketStatus(Object.fromEntries(data.map((t) => [t.id, t.status])));
        setTicketNotes(Object.fromEntries(data.map((t) => [t.id, t.notes || ""])));
      })
      .catch((e) => setError(e.message || "تعذر تحميل التذاكر."))
      .finally(() => setLoading(false));
  }, [tab]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      setError("العنوان مطلوب.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveAdminCmsItem(collection, editing);
      setEditing(null);
      await refreshCms();
      flash("تم حفظ المحتوى ونشره بنجاح.");
    } catch (e: any) {
      setError(e.message || "فشل الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: CmsItem) => {
    if (!window.confirm(`حذف "${item.title}" نهائياً؟`)) return;
    try {
      await deleteAdminCmsItem(collection, item.id);
      await refreshCms();
      flash("تم حذف العنصر.");
    } catch (e: any) {
      setError(e.message || "فشل الحذف.");
    }
  };

  const handleTicketSave = async (t: SupportTicket) => {
    try {
      const updated = await updateAdminTicket(t.id, {
        status: ticketStatus[t.id] || t.status,
        notes: ticketNotes[t.id],
      });
      setTickets((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
      flash("تم تحديث التذكرة.");
    } catch (e: any) {
      setError(e.message || "فشل التحديث.");
    }
  };

  const statusColor = (s: string) =>
    s === "resolved" || s === "closed" ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" : "bg-amber-500/15 border-amber-500/40 text-amber-300";

  const inputCls =
    "w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500";
  const labelCls = "block text-[10px] font-bold text-slate-400 mb-0.5";

  if (!currentUser?.isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16 text-center dir-rtl">
        <ShieldAlert className="w-14 h-14 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-white">هذه الصفحة مخصصة للمشرفين فقط</h2>
        <p className="text-xs text-slate-400 mt-2">سجل الدخول بحساب مدير المنصة للوصول إلى لوحة الإدارة.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6 dir-rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">لوحة إدارة ميزان</h2>
            <p className="text-[11px] text-slate-400">مرحباً {currentUser?.name} — تعديلاتك تنشر فوراً بدون إعادة نشر الموقع.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("content")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${tab === "content" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 border-slate-700"}`}
          >
            إدارة المحتوى
          </button>
          <button
            onClick={() => setTab("tickets")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${tab === "tickets" ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 border-slate-700"}`}
          >
            تذاكر الدعم ({tickets.length})
          </button>
        </div>
      </div>

      {notice && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          {notice}
        </div>
      )}
      {error && (
        <div className="px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold">{error}</div>
      )}

      {tab === "content" && (
        <>
          <div className="flex flex-wrap gap-2 justify-between items-center bg-slate-900/50 border border-slate-800 rounded-2xl p-3">
            <div className="flex gap-2 flex-wrap">
              {COLLECTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCollection(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${collection === c.id ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 border-slate-700"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setEditing({ ...EMPTY_ITEM })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              عنصر جديد
            </button>
          </div>

          {editing && (
            <div className="bg-slate-900/80 border border-indigo-500/40 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-400" />
                {editing.id ? "تعديل عنصر" : "إضافة عنصر جديد"} — {COLLECTIONS.find((c) => c.id === collection)?.label}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>العنوان *</label>
                  <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>التصنيف</label>
                  <input className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="مثال: الأنظمة السعودية" />
                </div>
                <div>
                  <label className={labelCls}>المرجع</label>
                  <input className={inputCls} value={editing.reference} onChange={(e) => setEditing({ ...editing, reference: e.target.value })} placeholder="مثال: هيئة الزكاة والضريبة والجمارك" />
                </div>
                <div>
                  <label className={labelCls}>المصدر الرسمي (رابط أو اسم الجهة)</label>
                  <input className={inputCls} dir="ltr" value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} placeholder="zatca.gov.sa" />
                </div>
                <div>
                  <label className={labelCls}>اسم المراجع / المختص</label>
                  <input className={inputCls} value={editing.reviewedBy} onChange={(e) => setEditing({ ...editing, reviewedBy: e.target.value })} placeholder="د. محمد أحمد — ضرائب" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.published}
                      onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    {editing.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                    منشور ومرئي للزوار
                  </label>
                </div>
              </div>
              <div>
                <label className={labelCls}>محتوى العنصر</label>
                <textarea
                  className={`${inputCls} min-h-[140px]`}
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ ونشر
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {loading && <p className="text-center text-xs text-slate-400 py-8">جارٍ التحميل...</p>}
          {!loading && items.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">لا توجد عناصر في هذه المجموعة بعد. أضف عنصراً جديداً.</div>
          )}

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black text-white">{item.title}</h4>
                    {!item.published && (
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[9px] font-bold">مسودة</span>
                    )}
                    <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[9px] font-bold">{item.category || "عام"}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 whitespace-pre-line">{item.body}</p>
                  <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 mt-2">
                    {item.reference && (
                      <span className="flex items-center gap-1">
                        <FolderOpen className="w-3 h-3 text-amber-400" />
                        {item.reference}
                      </span>
                    )}
                    {item.source && (
                      <span className="flex items-center gap-1">
                        <Link2 className="w-3 h-3 text-cyan-400" />
                        {item.source}
                      </span>
                    )}
                    {item.reviewedBy && (
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        {item.reviewedBy}
                      </span>
                    )}
                    <span>آخر تحديث: {new Date(item.updatedAt || Date.now()).toLocaleDateString("ar-EG")}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing({ ...item })}
                    className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 font-black text-xs cursor-pointer transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/40 text-rose-200 font-black text-xs cursor-pointer transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "tickets" && (
        <div className="space-y-4">
          {loading && <p className="text-center text-xs text-slate-400 py-8">جارٍ التحميل...</p>}
          {!loading && tickets.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">لا توجد تذاكر حالياً.</div>
          )}
          {tickets.map((t) => (
            <div key={t.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black text-white" dir="ltr">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${statusColor(t.status)}`}>{t.status}</span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(t.createdAt).toLocaleString("ar-EG")}</span>
              </div>
              <div>
                <p className="text-xs font-black text-white">{t.subject}</p>
                <p className="text-[11px] text-slate-300 mt-1 whitespace-pre-line">{t.message}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {t.name} — <span dir="ltr">{t.email}</span> — {t.category}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>الحالة</label>
                  <select
                    className={inputCls}
                    value={ticketStatus[t.id] || t.status}
                    onChange={(e) => setTicketStatus({ ...ticketStatus, [t.id]: e.target.value })}
                  >
                    <option value="open">new (open)</option>
                    <option value="in_progress">قيد المعالجة</option>
                    <option value="resolved">تم الحل</option>
                    <option value="closed">مغلقة</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>ملاحظة الدعم</label>
                  <input
                    className={inputCls}
                    value={ticketNotes[t.id] || ""}
                    onChange={(e) => setTicketNotes({ ...ticketNotes, [t.id]: e.target.value })}
                    placeholder="رد أو ملاحظة على التذكرة"
                  />
                </div>
              </div>
              <button
                onClick={() => handleTicketSave(t)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors cursor-pointer"
              >
                حفظ التحديث
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardSection;
import React, { useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { getConsent, setConsent } from "../utils/privacy";
import { ActiveTab } from "../types";

export const CookieConsentBanner: React.FC<{ onNavigate?: (tab: ActiveTab) => void }> = ({ onNavigate }) => {
  const [visible, setVisible] = useState<boolean>(() => getConsent() === null);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-4 sm:max-w-sm z-[80] dir-rtl">
      <div className="bg-[#0a1026]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl shadow-black/60 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <Cookie className="w-4 h-4 text-indigo-300" />
            </div>
            <h4 className="text-sm font-black text-white">نوافق على القياسات؟</h4>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          نحترم خصوصيتك. القياسات تُخزَّن على جهازك فقط ولا تُرسل لأي طرف ثالث إلا بعد موافقتك. للمزيد:
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setConsent("accepted");
              setVisible(false);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            موافق على القياسات
          </button>
          <button
            onClick={() => {
              setConsent("declined");
              setVisible(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black transition-colors cursor-pointer"
          >
            لست موافقاً
          </button>
          {onNavigate && (
            <button
              onClick={() => {
                setVisible(false);
                onNavigate("privacy");
              }}
              className="text-[11px] text-indigo-300 underline cursor-pointer"
            >
              سياسة الخصوصية
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
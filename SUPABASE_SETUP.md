# إعداد المصادقة الحقيقية على Supabase (Meezan)

المنصة الآن تستخدم **Supabase Auth + Postgres** كخلفية حقيقية للمصادقة بدلاً من
التخزين المحلي فقط. الخطوات لإطلاقها:

## 1) إنشاء مشروع Supabase
- ادخل [supabase.com](https://supabase.com) → New Project.
- انتظر جاهزية قاعدة البيانات.

## 2) تشغيل ملف الهجرة (Migration)
في Supabase → **SQL Editor** الصق محتوى `supabase/migrations/0001_profiles.sql`
ونفّذه. هذا ينشئ:
- جدول `public.profiles` (id, email, name, avatar, role, learning_track, xp, streak, progress, is_admin, ...).
- Trigger ينشئ صف الملف الشخصي تلقائياً عند تسجيل مستخدم جديد.
- سياسات RLS تسمح لكل مستخدم بقراءة/تعديل ملفه فقط.

## 3) ضبط متغيرات البيئة
انسخ `.env.example` إلى `.env`، واضبط القيم في:
- **Supabase** → Project Settings → API: `URL` و `anon key` و `service_role key`.
- **Vercel** → Project Settings → Environment Variables: المتغيرات الأربعة `VITE_SUPABASE_URL`،
  `VITE_SUPABASE_ANON_KEY`، `SUPABASE_URL`، `SUPABASE_SERVICE_ROLE_KEY` + المتغيرات الموجودة
  (`GEMINI_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAILS`).

## 4) ضبط تأكيد البريد الإلكتروني (اختياري)
- Authentication → Providers → Email: فعّل "Confirm email" لإرسال رابط تحقق عند التسجيل.
- أضف `{{ .SiteURL }}` أو رابط الموقع في **Redirect URLs** (مثلاً `https://meezan-*.vercel.app`).

## 5) منح صلاحية المشرف
حساب المشرف يُحدّد عبر `ADMIN_EMAILS` (قائمة بريدات مفصولة بفاصلة). لوحة الإدارة تظهر
للحساب المطابق تلقائياً بعد تسجيل الدخول (يتحقق الخادم من الـJWT).

## ما الذي تغيّر
- `src/lib/supabase.ts` — عميل Supabase للواجهة.
- `src/lib/auth.ts` — تسجيل/دخول/تسجيل خروج/استعادة كلمة/تحديث ملف + مزامنة التقدم (XP/streak/الدروس).
- `src/components/AuthModal.tsx` — استخدم Supabase بدلاً من وهم localStorage (مع تحقق البريد).
- `src/App.tsx` — إدارة الجلسة عبر `onAuthStateChange` + مزامنة التقدم السحابي.
- `api/lib/supabaseServer.ts` + `api/index.ts` — حارس لوحة الإدارة يتحقق من JWT عبر Supabase.

export type Language = "ar" | "en";

export interface TranslationDictionary {
  // Navigation
  nav: {
    home: string;
    courses: string;
    roadmaps: string;
    quizzes: string;
    flashcards: string;
    lab: string;
    tools: string;
    community: string;
    library: string;
    profile: string;
    excel: string;
    downloadApp: string;
    achievements: string;
    darkMode: string;
    lightMode: string;
    language: string;
  };
  // General & Common
  common: {
    welcome: string;
    xp: string;
    streak: string;
    level: string;
    days: string;
    minutes: string;
    guest: string;
    guestNotice: string;
    login: string;
    signup: string;
    logout: string;
    search: string;
    filter: string;
    save: string;
    saved: string;
    close: string;
    cancel: string;
    delete: string;
    edit: string;
    viewAll: string;
    loading: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
  };
  // User Profile & Settings
  profile: {
    title: string;
    overview: string;
    certificates: string;
    notes: string;
    editProfile: string;
    settings: string;
    languageAndRegion: string;
    languageSelect: string;
    arabic: string;
    english: string;
    languageDesc: string;
    themeMode: string;
    themeMidnight: string;
    themePaper: string;
    fontSize: string;
    dailyGoal: string;
    studyReminder: string;
    notifications: string;
    saveSuccess: string;
    notesPlaceholder: string;
  };
  // Hero Section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    startLearning: string;
    exploreTools: string;
    activeUsers: string;
    certifiedStudents: string;
    satisfactionRate: string;
  };
  // Community Section
  community: {
    title: string;
    subtitle: string;
    askQuestion: string;
    notifications: string;
    latestQuestions: string;
    topContributors: string;
    addAnswer: string;
    aiAnswer: string;
    bestAnswer: string;
  };
  // Tools Section
  tools: {
    title: string;
    subtitle: string;
    depreciation: string;
    incomeTax: string;
    taxInvoice: string;
    budgetTracker: string;
    payrollSimulator: string;
    tradingSimulator: string;
    accountantDictionary: string;
    odooJournal: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    nav: {
      home: "الرئيسية",
      courses: "المناهج والدورات",
      roadmaps: "مسارات التخصص",
      quizzes: "الاختبارات والتحديات",
      flashcards: "بطاقات المراجعة",
      lab: "المختبر المحاسبي",
      tools: "الأدوات الحاسبة",
      community: "مجتمع المحاسبين",
      library: "المكتبة الرقمية",
      profile: "الملف الشخصي",
      excel: "نماذج إكسل",
      downloadApp: "تحميل التطبيق",
      achievements: "الأوسمة والإنجازات",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      language: "اللغة",
    },
    common: {
      welcome: "أهلاً بك",
      xp: "نقطة خبرة",
      streak: "أيام تتابع",
      level: "المستوى",
      days: "أيام",
      minutes: "دقيقة",
      guest: "حساب تجريبي (زائر)",
      guestNotice: "تتصفح المنصة كزائر. سجل دخولك لحفظ تقدمك بشكل دائم.",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      logout: "تسجيل الخروج",
      search: "بحث...",
      filter: "تصفية",
      save: "حفظ التغييرات",
      saved: "تم الحفظ بنجاح",
      close: "إغلاق",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      viewAll: "عرض الكل",
      loading: "جاري التحميل...",
      success: "تمت العملية بنجاح",
      confirm: "تأكيد",
      back: "عودة",
      next: "التالي",
      previous: "السابق",
    },
    profile: {
      title: "الملف الشخصي والإعدادات",
      overview: "نظرة عامة",
      certificates: "الشهادات المكتسبة",
      notes: "الملاحظات المحاسبية",
      editProfile: "تعديل البيانات",
      settings: "إعدادات المنصة",
      languageAndRegion: "اللغة والمنطقة (Language & Region)",
      languageSelect: "اختر لغة الواجهة والمنصة:",
      arabic: "العربية (Arabic) 🇸🇦",
      english: "English (الإنجليزية) 🇬🇧",
      languageDesc: "يمكنك التبديل بين العربية والإنجليزية، حيث يتم ضبط اتجاه الصفحة (RTL/LTR) والترجمات تلقائياً.",
      themeMode: "مظهر التطبيق والقراءة",
      themeMidnight: "وضع منتصف الليل (داكن)",
      themePaper: "نمط الورق (فاتح)",
      fontSize: "حجم خط الدروس القراءة",
      dailyGoal: "هدف دراسة المحاسبة اليومي",
      studyReminder: "تذكير الدراسة اليومية",
      notifications: "تفضيلات التنبيهات والتذكير",
      saveSuccess: "تم حفظ الإعدادات بنجاح!",
      notesPlaceholder: "اكتب ملاحظاتك المحاسبية والقيود الهامة هنا...",
    },
    hero: {
      badge: "المنصة المحاسبية الشاملة الأولى",
      title: "احترف المحاسبة والمالية والمعايير الدولية IFRS تفاعلياً",
      subtitle: "منصة تعليمية محاكاة شاملة تجمع بين الدروس التفاعلية، المحاكاة العلمية، الأدوات الحاسبة ومجتمع المحاسبين.",
      startLearning: "ابدأ التعلم الآن مجاناً",
      exploreTools: "استكشف الأدوات والآلات الحاسبة",
      activeUsers: "متعلم نشط",
      certifiedStudents: "شهادة صادرة",
      satisfactionRate: "نسبة الرضا والتقييم",
    },
    community: {
      title: "مجتمع المحاسبين والخبراء",
      subtitle: "اطرح أسئلتك المحاسبية، وشارك الحلول، وتفاعل مع نخبة من الخبراء والمحاسبين المعتمدين.",
      askQuestion: "اطرح سؤالاً محاسبياً",
      notifications: "التنبيهات الإشعارات",
      latestQuestions: "أحدث الأسئلة والنقاشات",
      topContributors: "أبرز المساهمين والأعضاء",
      addAnswer: "أضف إجابة محاسبية",
      aiAnswer: "إجابة الذكاء الاصطناعي",
      bestAnswer: "أفضل إجابة نموذجية",
    },
    tools: {
      title: "حقيبة الأدوات والآلات الحاسبة المالية",
      subtitle: "مجموعة متكاملة من الأدوات المحاسبية لحساب الإهلاك، الضرائب، الرواتب، الفواتير، والقيود.",
      depreciation: "حاسبة إهلاك الأصول",
      incomeTax: "حاسبة ضريبة الدخل والزكاة",
      taxInvoice: "نموذج الفاتورة الضريبية",
      budgetTracker: "مخطط الميزانية الشخصية",
      payrollSimulator: "محاكي مسيرات الرواتب",
      tradingSimulator: "محاكي تداول الأوراق المالية",
      accountantDictionary: "القاموس المحاسبي الذكي",
      odooJournal: "محاكي قيود Odoo ERP",
    },
  },
  en: {
    nav: {
      home: "Home",
      courses: "Courses & Curricula",
      roadmaps: "Specialization Paths",
      quizzes: "Quizzes & Challenges",
      flashcards: "Flashcards",
      lab: "Accounting Lab",
      tools: "Financial Tools",
      community: "Community",
      library: "Digital Library",
      profile: "Profile",
      excel: "Excel Templates",
      downloadApp: "Download App",
      achievements: "Badges & Achievements",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      language: "Language",
    },
    common: {
      welcome: "Welcome",
      xp: "XP Points",
      streak: "Day Streak",
      level: "Level",
      days: "Days",
      minutes: "Minutes",
      guest: "Guest Account",
      guestNotice: "You are browsing as a guest. Log in to save your progress permanently.",
      login: "Log In",
      signup: "Sign Up",
      logout: "Log Out",
      search: "Search...",
      filter: "Filter",
      save: "Save Changes",
      saved: "Saved Successfully",
      close: "Close",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      viewAll: "View All",
      loading: "Loading...",
      success: "Operation Successful",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      previous: "Previous",
    },
    profile: {
      title: "Profile & Settings",
      overview: "Overview",
      certificates: "Earned Certificates",
      notes: "Accounting Notes",
      editProfile: "Edit Profile",
      settings: "App Settings",
      languageAndRegion: "Language & Region",
      languageSelect: "Choose interface language:",
      arabic: "العربية (Arabic) 🇸🇦",
      english: "English 🇬🇧",
      languageDesc: "Switch between Arabic and English. Document direction (RTL/LTR) and UI labels update automatically.",
      themeMode: "App Appearance & Theme",
      themeMidnight: "Midnight Mode (Dark)",
      themePaper: "Paper Mode (Light)",
      fontSize: "Reading Font Size",
      dailyGoal: "Daily Accounting Study Goal",
      studyReminder: "Daily Study Reminder",
      notifications: "Notification Preferences",
      saveSuccess: "Settings saved successfully!",
      notesPlaceholder: "Write your key accounting notes and journal entries here...",
    },
    hero: {
      badge: "The #1 Interactive Accounting Platform",
      title: "Master Accounting, Finance & IFRS Standards Interactively",
      subtitle: "A complete simulation platform combining interactive lessons, real-world scenarios, financial calculators, and a vibrant community.",
      startLearning: "Start Learning Free",
      exploreTools: "Explore Financial Tools",
      activeUsers: "Active Learners",
      certifiedStudents: "Certificates Issued",
      satisfactionRate: "Satisfaction Score",
    },
    community: {
      title: "Accounting Community & Experts",
      subtitle: "Ask accounting questions, share solutions, and engage with top certified financial professionals.",
      askQuestion: "Ask a Question",
      notifications: "Notifications",
      latestQuestions: "Latest Discussions",
      topContributors: "Top Contributors",
      addAnswer: "Add Answer",
      aiAnswer: "AI Response",
      bestAnswer: "Best Answer",
    },
    tools: {
      title: "Financial Toolkit & Calculators",
      subtitle: "A comprehensive suite for asset depreciation, tax & zakat, payroll, invoices, and journal entries.",
      depreciation: "Asset Depreciation Calculator",
      incomeTax: "Income Tax & Zakat Calculator",
      taxInvoice: "Tax Invoice Generator",
      budgetTracker: "Personal Budget Planner",
      payrollSimulator: "Payroll Simulator",
      tradingSimulator: "Stock Trading Simulator",
      accountantDictionary: "Smart Accounting Dictionary",
      odooJournal: "Odoo ERP Journal Simulator",
    },
  },
};

/**
 * Get stored language setting from localStorage or fallback to "ar"
 */
export function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem("meezan_app_language");
    return saved === "en" || saved === "ar" ? saved : "ar";
  } catch {
    return "ar";
  }
}

/**
 * Apply language to document direction and attributes
 */
export function applyLanguageSettings(lang: Language): void {
  try {
    localStorage.setItem("meezan_app_language", lang);
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    
    if (lang === "ar") {
      html.classList.remove("dir-ltr");
      html.classList.add("dir-rtl");
    } else {
      html.classList.remove("dir-rtl");
      html.classList.add("dir-ltr");
    }

    window.dispatchEvent(new CustomEvent("meezan_language_changed", { detail: { language: lang } }));
  } catch (e) {
    console.error("Error applying language settings:", e);
  }
}

/**
 * Helper hook / accessor to get text strings
 */
export function useTranslation(lang: Language = "ar") {
  return translations[lang] || translations.ar;
}

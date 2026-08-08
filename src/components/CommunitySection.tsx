import { useState, useEffect, useMemo, FormEvent } from "react";
import { UserProfile } from "../types";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  PlusCircle,
  Search,
  Filter,
  Sparkles,
  Award,
  BookMarked,
  Share2,
  Send,
  HelpCircle,
  Tag,
  Clock,
  Flame,
  Check,
  TrendingUp,
  UserCheck,
  Building2,
  Calculator,
  ShieldCheck,
  X,
  MessageCircle,
  ArrowUpRight,
  Bot,
  Loader2,
  Copy,
  PieChart,
  BarChart3,
  Star,
  Zap,
  BookmarkPlus,
  Trophy,
  Medal,
  Crown,
  Heart,
  Target,
  ChevronRight,
  Bell,
  BellRing,
  CheckCheck,
  Trash2
} from "lucide-react";

export interface CommunityNotification {
  id: string;
  type: "answer" | "upvote" | "best_answer" | "system";
  title: string;
  message: string;
  questionId?: string;
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}

const INITIAL_NOTIFICATIONS: CommunityNotification[] = [
  {
    id: "notif-1",
    type: "answer",
    title: "إجابة جديدة على سؤالك 💬",
    message: "أضاف د. طارق السعدي إجابة نموذجية على سؤالك: معالجة مصروفات التأسيس وفق IAS 38",
    questionId: "q-1",
    createdAt: "منذ 10 دقائق",
    isRead: false,
    senderName: "د. طارق السعدي",
    senderAvatar: "👨‍🏫"
  },
  {
    id: "notif-2",
    type: "upvote",
    title: "تصويت إيجابي جديد ⬆️",
    message: "حصل سؤالك 'معالجة مصروفات التأسيس والافتتاح' على تصويت إيجابي جديد! (+5 XP)",
    questionId: "q-1",
    createdAt: "منذ ساعة",
    isRead: false,
    senderName: "أشرف الخولي",
    senderAvatar: "👨‍💼"
  },
  {
    id: "notif-3",
    type: "best_answer",
    title: "اعتماد أفضل إجابة 🌟",
    message: "تم اختيار إجابتك كـ أفضل إجابة نموذجية في قسم القيود المحاسبية (+30 XP)",
    questionId: "q-2",
    createdAt: "منذ يوم واحد",
    isRead: true,
    senderName: "سارة المنصور",
    senderAvatar: "👩‍💻"
  }
];

export interface Answer {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  isVerifiedAccountant?: boolean;
  content: string;
  createdAt: string;
  votes: number;
  userVote?: "up" | "down" | null;
  isBestAnswer?: boolean;
  aiGenerated?: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  votes: number;
  views: number;
  userVote?: "up" | "down" | null;
  isSaved?: boolean;
  answers: Answer[];
  tags: string[];
}

export interface LeaderboardMember {
  id: string;
  rank: number;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  isVerifiedAccountant: boolean;
  allXp: number;
  monthXp: number;
  weekXp: number;
  answersCount: number;
  bestAnswersCount: number;
  upvotesCount: number;
  helpfulRating: number;
  recentTitle: string;
}

interface CommunitySectionProps {
  currentUser: UserProfile | null;
  onOpenAuth?: () => void;
  onAddXP?: (amount: number, reason: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "جميع الأسئلة", icon: Users },
  { id: "entries", label: "القيود والتسويات", icon: Calculator },
  { id: "ifrs", label: "معايير IFRS", icon: ShieldCheck },
  { id: "tax", label: "الضرائب والزكاة", icon: Building2 },
  { id: "excel", label: "إكسيل والمراجعة", icon: BookMarked },
  { id: "systems", label: "أنظمة ERP وأودو", icon: Sparkles },
  { id: "interviews", label: "مقابلات وتطوير مهني", icon: Award },
];

const LEADERBOARD_MEMBERS: LeaderboardMember[] = [
  {
    id: "m-1",
    rank: 1,
    name: "د. طارق السعدي",
    role: "مراجع حسابات قانوني & خبير IFRS",
    avatar: "👨‍🏫",
    badge: "SOCPA / CPA",
    isVerifiedAccountant: true,
    allXp: 3450,
    monthXp: 820,
    weekXp: 290,
    answersCount: 142,
    bestAnswersCount: 89,
    upvotesCount: 612,
    helpfulRating: 99,
    recentTitle: "خبير معايير المحاسبة الدولية لعام 2026",
  },
  {
    id: "m-2",
    rank: 2,
    name: "أشرف الخولي",
    role: "مدير مالي CFO",
    avatar: "👨‍💼",
    badge: "خبير مالي معتمد",
    isVerifiedAccountant: true,
    allXp: 2890,
    monthXp: 690,
    weekXp: 210,
    answersCount: 98,
    bestAnswersCount: 56,
    upvotesCount: 480,
    helpfulRating: 97,
    recentTitle: "استشاري الميزانيات والتحليل المالي",
  },
  {
    id: "m-3",
    rank: 3,
    name: "ياسر الحربي",
    role: "أخصائي إقرارات ضريبية وزكاة",
    avatar: "👨‍⚖️",
    badge: "مستشار ZATCA",
    isVerifiedAccountant: true,
    allXp: 2410,
    monthXp: 540,
    weekXp: 180,
    answersCount: 85,
    bestAnswersCount: 48,
    upvotesCount: 395,
    helpfulRating: 96,
    recentTitle: "مرجع الفوترة الإلكترونية والضريبة",
  },
  {
    id: "m-4",
    rank: 4,
    name: "مريم العتيبي",
    role: "رئيسة قسم الحسابات",
    avatar: "👩‍💼",
    badge: "محاسب قانوني",
    isVerifiedAccountant: true,
    allXp: 1980,
    monthXp: 460,
    weekXp: 140,
    answersCount: 76,
    bestAnswersCount: 38,
    upvotesCount: 310,
    helpfulRating: 95,
    recentTitle: "متخصصة التسويات والقفلات السنوية",
  },
  {
    id: "m-5",
    rank: 5,
    name: "م. عصام حسن",
    role: "مطور نماذج مالي وإكسيل متقدم",
    avatar: "📊",
    badge: "Excel MVP",
    isVerifiedAccountant: true,
    allXp: 1750,
    monthXp: 390,
    weekXp: 120,
    answersCount: 64,
    bestAnswersCount: 31,
    upvotesCount: 285,
    helpfulRating: 98,
    recentTitle: "مهندس النماذج المالية وإكسيل",
  },
  {
    id: "m-6",
    rank: 6,
    name: "سارة المنصور",
    role: "محاسبة أصول ومخزون",
    avatar: "👩‍💻",
    badge: "أخصائي أصول",
    isVerifiedAccountant: false,
    allXp: 1420,
    monthXp: 310,
    weekXp: 95,
    answersCount: 49,
    bestAnswersCount: 22,
    upvotesCount: 210,
    helpfulRating: 93,
    recentTitle: "خبير معالجة الأصول الثابتة والإهلاك",
  },
  {
    id: "m-7",
    rank: 7,
    name: "أحمد الفارس",
    role: "محاسب عام حديث",
    avatar: "👨‍💼",
    badge: "محاسب متفاعل",
    isVerifiedAccountant: false,
    allXp: 1180,
    monthXp: 270,
    weekXp: 80,
    answersCount: 38,
    bestAnswersCount: 15,
    upvotesCount: 165,
    helpfulRating: 91,
    recentTitle: "نجم الإجابات السريعة للقيود",
  },
  {
    id: "m-8",
    rank: 8,
    name: "خالد المحمد",
    role: "مستشار ضريبي متدرب",
    avatar: "👨‍💻",
    badge: "عضو نشط",
    isVerifiedAccountant: false,
    allXp: 950,
    monthXp: 210,
    weekXp: 60,
    answersCount: 29,
    bestAnswersCount: 11,
    upvotesCount: 130,
    helpfulRating: 90,
    recentTitle: "متابع أنظمة القيمة المضافة",
  },
  {
    id: "m-9",
    rank: 9,
    name: "عمر الدوسري",
    role: "باحث محاسبة سنة رابعة",
    avatar: "🎓",
    badge: "محاسب طموح",
    isVerifiedAccountant: false,
    allXp: 820,
    monthXp: 180,
    weekXp: 50,
    answersCount: 24,
    bestAnswersCount: 8,
    upvotesCount: 105,
    helpfulRating: 88,
    recentTitle: "عضو مجتمعي متألق",
  },
  {
    id: "m-10",
    rank: 10,
    name: "نورة القحطاني",
    role: "مراجعة حسابات داخلية",
    avatar: "👩‍🏫",
    badge: "SOCPA Student",
    isVerifiedAccountant: false,
    allXp: 710,
    monthXp: 150,
    weekXp: 40,
    answersCount: 19,
    bestAnswersCount: 6,
    upvotesCount: 88,
    helpfulRating: 89,
    recentTitle: "شغوفة بالمراجعة الداخلية",
  },
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q-1",
    title: "كيف يتم معالجة مصروفات التأسيس والافتتاح وفقاً لمعالجة المعايير الدولية (IAS 38)؟",
    content: "أعمل في شركة جديدة وتم دفع مبالغ كبيرة للاستشارات القانونية وتراخيص التأسيس وحفلة الافتتاح. هل يجوز رأسمالتها وإطفائها على 5 سنوات أم يجب تحميلها بالكامل على قائمة الدخل كـ مصروفات في نفس السنة؟",
    category: "ifrs",
    authorName: "أحمد الفارس",
    authorRole: "محاسب عام حديث",
    authorAvatar: "👨‍💼",
    createdAt: "منذ ساعتين",
    votes: 28,
    views: 342,
    tags: ["IAS 38", "مصروفات التأسيس", "معايير دولية"],
    answers: [
      {
        id: "a-101",
        authorName: "د. طارق السعدي",
        authorRole: "مراجع حسابات قانوني & خبير IFRS",
        authorAvatar: "👨‍🏫",
        isVerifiedAccountant: true,
        content: "وفقاً لمعيار الأصول غير الملموسة (IAS 38)، يُحظر رأسمالة مصروفات التأسيس والافتتاح ومصاريف التدريب ومصاريف الدعاية والتسويق. يجب الاعتراف بها فوراً كمصروف في قائمة الأرباح أو الخسائر في الفترة التي تُنفق فيها.\n\nالاستثناء الوحيد هو التكاليف التي تتطابق مباشرة مع بناء أو الاستحواذ على أصل ملموس (مثل الرسوم الجمركية أو تكاليف تركيب الآلات وفق IAS 16).",
        createdAt: "منذ ساعة",
        votes: 42,
        isBestAnswer: true
      },
      {
        id: "a-102",
        authorName: "مريم العتيبي",
        authorRole: "رئيسة قسم الحسابات",
        authorAvatar: "👩‍💼",
        isVerifiedAccountant: true,
        content: "بالفعل كلام الدكتور دقيق، والمعالجة القديمة للإطفاء على 3 أو 5 سنوات كانت إلغاؤها منذ تعديل المعايير الدولية. القيد يكون من حـ/ مصاريف عمومية وإدارية (مصاريف تأسيس وافتتاح) إلى حـ/ النقدية أو البنك.",
        createdAt: "منذ 45 دقيقة",
        votes: 19
      }
    ]
  },
  {
    id: "q-2",
    title: "ما هو القيد المحاسبي الصحيح عند بيع أصل ثابت بخسارة وتسجيل الإهلاك المتراكم؟",
    content: "لدينا سيارة قيمتها الدفترية التاريخية 100,000 ريال، وإهلاكها المتراكم حتى تاريخ البيع 60,000 ريال. تم بيعها نقداً بمبلغ 35,000 ريال. ما هو قيد البيع وكيف يُحسب الربح أو الخسارة؟",
    category: "entries",
    authorName: "سارة المنصور",
    authorRole: "محاسبة أصول ومخزون",
    authorAvatar: "👩‍💻",
    createdAt: "منذ 5 ساعات",
    votes: 35,
    views: 512,
    tags: ["الأصول الثابتة", "قيود اليومية", "إهلاك الأصول"],
    answers: [
      {
        id: "a-201",
        authorName: "أشرف الخولي",
        authorRole: "مدير مالي CFO",
        authorAvatar: "👨‍💼",
        isVerifiedAccountant: true,
        content: "القيمة الدفترية الصافية = 100,000 - 60,000 = 40,000 ريال.\nثمن البيع = 35,000 ريال.\nالنتيجة = خسارة بيع أصول = 5,000 ريال.\n\nيكون قيد اليومية كالتالي:\nمن مذكورين:\nحـ/ النقدية أو البنك: 35,000\nحـ/ مجمع إهلاك السيارات: 60,000\nحـ/ خسائر بيع أصول ثابتة (قائمة الدخل): 5,000\nإلى حـ/ السيارات (التكلفة التاريخية): 100,000",
        createdAt: "منذ 4 ساعات",
        votes: 56,
        isBestAnswer: true
      }
    ]
  },
  {
    id: "q-3",
    title: "كيف تتعامل مع ضريبة القيمة المضافة (VAT) في المشتريات المعفاة والمستردة؟",
    content: "عند الشراء من مورد مسجل في الضريبة، متى يحق للشركة خصم ضريبة المدخلات؟ وما هي شروط الفاتورة الضريبية المقبولة لدى هيئة الزكاة والضريبة والجمارك؟",
    category: "tax",
    authorName: "خالد المحمد",
    authorRole: "مستشار ضريبي متدرب",
    authorAvatar: "👨‍💼",
    createdAt: "منذ يوم واحد",
    votes: 21,
    views: 410,
    tags: ["ضريبة القيمة المضافة", "الفاتورة الضريبية", "ZATCA"],
    answers: [
      {
        id: "a-301",
        authorName: "ياسر الحربي",
        authorRole: "أخصائي إقرارات ضريبية وزكاة",
        authorAvatar: "👨‍⚖️",
        isVerifiedAccountant: true,
        content: "يشترط لاسترداد أو خصم ضريبة المدخلات:\n1. أن تكون الشراء لأغراض النشاط الخاضع للضريبة.\n2. وجود فاتورة ضريبية حقيقية تتضمن الرقم الضريبي للمورد وللعميل ورمز QR Code متوافق مع نظام الفوترة الإلكترونية.\n3. ألا تكون من المصاريف المستبعدة قانوناً مثل (مصاريف الترفيه والسيارات الشخصية).",
        createdAt: "منذ 18 ساعة",
        votes: 31,
        isBestAnswer: true
      }
    ]
  },
  {
    id: "q-4",
    title: "ماهي أهم معادلات إكسيل التي يطلبها رؤساء الحسابات في المقابلات الشخصية؟",
    content: "مقبل على مقابلة عمل كـ محاسب أول. ماهي الدواد الأكثر استخداماً وأهمية في التحليل المالي والربط بين الجداول بخلاف VLOOKUP؟",
    category: "interviews",
    authorName: "عمر الدوسري",
    authorRole: "طالب محاسبة سنة رابعة",
    authorAvatar: "🎓",
    createdAt: "منذ يومين",
    votes: 49,
    views: 890,
    tags: ["مقابلات العمل", "إكسيل محاسبي", "XLOOKUP", "PivotTables"],
    answers: [
      {
        id: "a-401",
        authorName: "م. عصام حسن",
        authorRole: "مطور نماذج مالي وإكسيل متقدم",
        authorAvatar: "📊",
        isVerifiedAccountant: true,
        content: "أهم 5 أدوات ودوال يركز عليها المراجعون ورؤساء الحسابات:\n1. XLOOKUP & INDEX/MATCH (لبديل أسرع وأكثر مرونة عن VLOOKUP).\n2. SUMIFS & COUNTIFS (لتجميع المبيعات والقيود بناءً على عدة شروط مثل التاريخ والفرع).\n3. Pivot Tables & Pivot Charts (لتحليل حركة الحسابات وإعداد ميزان المراجعة).\n4. IFERROR (لتنظيف مخرجات التقارير من الأخطاء).\n5. TEXT functions & DATEDIF (لأعمار الديون وأقساط الإهلاك).",
        createdAt: "منذ يوم ونصف",
        votes: 68,
        isBestAnswer: true
      }
    ]
  }
];

export function CommunitySection({ currentUser, onOpenAuth, onAddXP }: CommunitySectionProps) {
  // Main Sub-Tab State: questions vs leaderboard
  const [activeSubTab, setActiveSubTab] = useState<"questions" | "leaderboard">("questions");

  // State for questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_community_questions");
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  // State for Leaderboard Likes/Thanks Sent
  const [thankedMembers, setThankedMembers] = useState<{ [id: string]: boolean }>({});

  // Leaderboard Filter Period
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"all" | "month" | "week">("all");
  const [leaderboardSearch, setLeaderboardSearch] = useState<string>("");

  // Question Filters & Sorting state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "votes" | "unanswered" | "solved">("latest");
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);

  // Daily Case Study Poll State
  const [pollSelectedOption, setPollSelectedOption] = useState<number | null>(null);
  const [pollVotesCount, setPollVotesCount] = useState({ opt1: 342, opt2: 89 });

  // Modal / Form States
  const [showNewQuestionModal, setShowNewQuestionModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("entries");
  const [newContent, setNewContent] = useState("");
  const [newTagsInput, setNewTagsInput] = useState("");

  // Active expanded question ID
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>("q-1");

  // New Answer State
  const [answerInputs, setAnswerInputs] = useState<{ [qId: string]: string }>({});

  // AI Loading per question
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notification System State
  const [notifications, setNotifications] = useState<CommunityNotification[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_community_notifications");
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");

  // Save Notifications to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("meezan_community_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Helper Toast Trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to Push New Notification
  const addNotification = (notif: Omit<CommunityNotification, "id" | "createdAt" | "isRead">) => {
    const newNotif: CommunityNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: "الآن",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Mark single notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Mark all as read
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    triggerToast("تم تحديد جميع التنبيهات كمقروءة 👁️");
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    triggerToast("تم مسح كافة التنبيهات 🗑️");
  };

  // Dynamic Simulator for testing real-time notifications
  const handleSimulateNotification = (type: "answer" | "upvote") => {
    if (type === "answer") {
      addNotification({
        type: "answer",
        title: "إجابة جديدة على سؤالك 💬",
        message: "قدّم أخصائي الزكاة والضريبة ياسر الحربي إجابة نموذجية جديدة على سؤالك!",
        questionId: "q-3",
        senderName: "ياسر الحربي",
        senderAvatar: "👨‍⚖️"
      });
      triggerToast("وصلك تنبيه جديد: تلقيت إجابة جديدة! 💬");
    } else {
      addNotification({
        type: "upvote",
        title: "تصويت إيجابي جديد ⬆️",
        message: "قام د. طارق السعدي بالتصويت إيجابياً على إجابتك المحاسبية (+5 XP)!",
        questionId: "q-1",
        senderName: "د. طارق السعدي",
        senderAvatar: "👨‍🏫"
      });
      triggerToast("وصلك تنبيه جديد: تلقيت تصويتاً إيجابياً! ⬆️");
    }
  };

  // Unread Count
  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Upvote / Downvote Question
  const handleVoteQuestion = (qId: string, type: "up" | "down") => {
    const targetQ = questions.find((q) => q.id === qId);

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;

        let voteDiff = 0;
        let newVoteState: "up" | "down" | null = type;

        if (q.userVote === type) {
          voteDiff = type === "up" ? -1 : 1;
          newVoteState = null;
        } else if (q.userVote) {
          voteDiff = type === "up" ? 2 : -2;
        } else {
          voteDiff = type === "up" ? 1 : -1;
        }

        return {
          ...q,
          votes: q.votes + voteDiff,
          userVote: newVoteState,
        };
      })
    );

    if (type === "up") {
      if (onAddXP) {
        onAddXP(5, "التفاعل بالتصويت على سؤال في مجتمع المحاسبين");
      }
      if (targetQ) {
        addNotification({
          type: "upvote",
          title: "تصويت إيجابي جديد ⬆️",
          message: `تلقيت تصويتاً إيجابياً جديداً على السؤال: "${targetQ.title.slice(0, 45)}..."`,
          questionId: qId,
          senderName: currentUser?.name || "عضو في المجتمع",
          senderAvatar: currentUser?.avatar || "👨‍💼"
        });
      }
    }
  };

  // Toggle Bookmark/Save Question
  const handleToggleSaveQuestion = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const newSaved = !q.isSaved;
        triggerToast(newSaved ? "تم حفظ السؤال في قائمتك المفضلة 📌" : "تم إزالة السؤال من المفضلة");
        return { ...q, isSaved: newSaved };
      })
    );
  };

  // Share Question Link
  const handleShareQuestion = (q: Question) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#community?q=${q.id}`);
      triggerToast("تم نسخ رابط السؤال بنجاح إلى الحافظة 🔗");
    } else {
      triggerToast("تمت مشاركة السؤال بنجاح 🚀");
    }
  };

  // Upvote / Downvote Answer
  const handleVoteAnswer = (qId: string, aId: string, type: "up" | "down") => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;

        const updatedAnswers = q.answers.map((ans) => {
          if (ans.id !== aId) return ans;

          let voteDiff = 0;
          let newVoteState: "up" | "down" | null = type;

          if (ans.userVote === type) {
            voteDiff = type === "up" ? -1 : 1;
            newVoteState = null;
          } else if (ans.userVote) {
            voteDiff = type === "up" ? 2 : -2;
          } else {
            voteDiff = type === "up" ? 1 : -1;
          }

          return {
            ...ans,
            votes: ans.votes + voteDiff,
            userVote: newVoteState,
          };
        });

        return { ...q, answers: updatedAnswers };
      })
    );

    if (type === "up") {
      if (onAddXP) {
        onAddXP(5, "تأييد إجابة مفيدة في المجتمع");
      }
      addNotification({
        type: "upvote",
        title: "تصويت إيجابي على إجابة ⬆️",
        message: "تم الحصول على تصويت إيجابي جديد على الإجابة المحاسبية! (+5 XP)",
        questionId: qId,
        senderName: currentUser?.name || "محاسب متفاعل",
        senderAvatar: currentUser?.avatar || "👍"
      });
    }
  };

  // Mark Best Answer
  const handleMarkBestAnswer = (qId: string, aId: string) => {
    const targetQ = questions.find((q) => q.id === qId);

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;

        const updatedAnswers = q.answers.map((ans) => ({
          ...ans,
          isBestAnswer: ans.id === aId ? !ans.isBestAnswer : false,
        }));

        return { ...q, answers: updatedAnswers };
      })
    );

    triggerToast("تم اعتماد هذه الإجابة كـ أفضل إجابة نموذجية! 🌟");
    if (onAddXP) {
      onAddXP(30, "اعتماد إجابة نموذجية في مجتمع المحاسبين");
    }

    if (targetQ) {
      addNotification({
        type: "best_answer",
        title: "اعتماد أفضل إجابة 🌟",
        message: `تم اعتماد إجابة نموذجية ممتازة على السؤال: "${targetQ.title.slice(0, 40)}..."`,
        questionId: qId,
        senderName: currentUser?.name || "مراجِع معتمد",
        senderAvatar: "🌟"
      });
    }
  };

  // Generate AI Answer for Question
  const handleGenerateAiAnswer = (q: Question) => {
    setAiGeneratingId(q.id);

    setTimeout(() => {
      let generatedText = "";
      if (q.category === "ifrs") {
        generatedText = `🤖 **التحليل المحاسبي الذكي المعياري (وفق معايير IFRS/IAS):**\n\nبناءً على المعايير المحاسبية المعتمدة، نلخص المعالجة الدقيقة للموضوع في النقاط التالية:\n1. **الأصل في المعيار**: يُشترط لتحقيق أصل غير ملموس حقيقي توفر السيطرة، والمنافع الاقتصادية المستقبلية، وإمكانية قياس التكلفة بموثوقية.\n2. **المعالجة المالية**: يتم إثبات المصروف مباشرة في قائمة الأرباح أو الخسائر خلال السنة الحالية دون رأسمالتها.\n3. **الأثر المالي**: يُحفظ التوازن المالي وتُجنب الشركة مخاطر تضخيم الأصول المفتعلة.\n\n✅ *إجابة موثقة بنظام الذكاء الاصطناعي للمنصة المطبقة لمعايير المحاسبة الدولية.*`;
      } else if (q.category === "tax") {
        generatedText = `🤖 **التحليل الضريبي المعتمد (وفق تعليمات ZATCA وضريبة القيمة المضافة):**\n\n1. **خصم ضريبة المدخلات**: يُشترط وجود فاتورة ضريبية إلكترونية مكتملة تحتوي على رمز الاستجابة السريعة QR والرقم الضريبي للمورد.\n2. **المصاريف المستبعدة**: عدم إدراج نفقات الترفيه الشخصي أو المركبات غير المرتبطة بالنشاط التجاري.\n3. **التوثيق**: حفظ الفواتير في النظام المحاسبي لمدة لا تقل عن 5 سنوات.`;
      } else {
        generatedText = `🤖 **التوجيه المحاسبي الموصى به:**\n\nتتطلب هذه الحالة إعداد قيد اليومية المزدوج لضمان توازن ميزان المراجعة وتأكيد دقة التسويات الختامية:\n- **طرف القيد المدين (من حـ/)**: الحسابات المباشرة المرتبطة بالمركز المالي.\n- **طرف القيد الدائن (إلى حـ/)**: الحسابات الوسيطة أو النقدية بالبنك.\n\n💡 يُنصح بمراجعة القيد مع المراجع الداخلي قبل ترحيله لشجرة الحسابات.`;
      }

      const aiAns: Answer = {
        id: `a-ai-${Date.now()}`,
        authorName: "مُجيب الذكاء الاصطناعي للميزان",
        authorRole: "مستشار محاسبي آلي آلي",
        authorAvatar: "🤖",
        isVerifiedAccountant: true,
        aiGenerated: true,
        content: generatedText,
        createdAt: "الآن",
        votes: 15,
        isBestAnswer: false,
      };

      setQuestions((prev) =>
        prev.map((item) => {
          if (item.id !== q.id) return item;
          return {
            ...item,
            answers: [aiAns, ...item.answers],
          };
        })
      );

      setAiGeneratingId(null);
      triggerToast("تم توليد التحليل المحاسبي الذكي بنجاح! 🤖✨");

      addNotification({
        type: "answer",
        title: "إجابة جديدة من مساعد الذكاء الاصطناعي 🤖",
        message: `تم توليد إجابة نموذجية آلياً على سؤالك: "${q.title.slice(0, 40)}..."`,
        questionId: q.id,
        senderName: "مُجيب الذكاء الاصطناعي",
        senderAvatar: "🤖"
      });
    }, 1200);
  };

  // Create New Question
  const handleCreateQuestion = (e: FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newContent.trim()) {
      triggerToast("يرجى ملء جميع الحقول المطلوبة للسؤال");
      return;
    }

    const tagList = newTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const createdQ: Question = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      authorName: currentUser?.name || "محاسب ميزان",
      authorRole: currentUser?.role || "عضو متفاعل",
      authorAvatar: currentUser?.avatar || "👨‍💼",
      createdAt: "الآن",
      votes: 1,
      views: 12,
      userVote: "up",
      answers: [],
      tags: tagList.length > 0 ? tagList : ["أسئلة المحاسبة"],
    };

    setQuestions([createdQ, ...questions]);
    setExpandedQuestionId(createdQ.id);

    // Reset Form
    setNewTitle("");
    setNewContent("");
    setNewTagsInput("");
    setShowNewQuestionModal(false);

    triggerToast("تم نشر سؤالك بنجاح في مجتمع المحاسبين! 🎉 (+15 XP)");
    if (onAddXP) {
      onAddXP(15, "طرح سؤال محاسبي في المجتمع");
    }

    addNotification({
      type: "system",
      title: "تم نشر سؤالك بنجاح 📌",
      message: `تم نشر سؤالك "${createdQ.title.slice(0, 40)}..." في قسم ${CATEGORIES.find(c => c.id === newCategory)?.label || "المجتمع"}. (+15 XP)`,
      questionId: createdQ.id,
      senderName: "نظام المجتمع",
      senderAvatar: "🎉"
    });
  };

  // Add Answer to Question
  const handleAddAnswer = (qId: string) => {
    const text = answerInputs[qId] || "";
    if (!text.trim()) return;

    const targetQ = questions.find((q) => q.id === qId);

    const newAnswer: Answer = {
      id: `a-${Date.now()}`,
      authorName: currentUser?.name || "محاسب ميزان",
      authorRole: currentUser?.role || "عضو المجتمع",
      authorAvatar: currentUser?.avatar || "👨‍💼",
      isVerifiedAccountant: true,
      content: text.trim(),
      createdAt: "الآن",
      votes: 1,
      userVote: "up",
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          answers: [newAnswer, ...q.answers],
        };
      })
    );

    setAnswerInputs((prev) => ({ ...prev, [qId]: "" }));
    triggerToast("تم إضافة إجابتك بنجاح! شكرًا لإثراء النقاش المحاسبي 💬 (+25 XP)");

    if (onAddXP) {
      onAddXP(25, "المشاركة بتقديم إجابة محاسبية في المجتمع");
    }

    if (targetQ) {
      addNotification({
        type: "answer",
        title: "إجابة جديدة على السؤال 💬",
        message: `تم إضافة إجابة جديدة بواسطة ${newAnswer.authorName} على: "${targetQ.title.slice(0, 40)}..."`,
        questionId: qId,
        senderName: newAnswer.authorName,
        senderAvatar: newAnswer.authorAvatar
      });
    }
  };

  // Handle Thanking / Supporting Member in Leaderboard
  const handleSendThanks = (member: LeaderboardMember) => {
    if (thankedMembers[member.id]) return;

    setThankedMembers((prev) => ({ ...prev, [member.id]: true }));
    triggerToast(`أرسلت تحية شكر وتقدير للـ ${member.name}! 👏 (+5 XP)`);

    if (onAddXP) {
      onAddXP(5, `إرسال تحية تشجيعية للـ ${member.name}`);
    }
  };

  // Filter & Sort Logic for Questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        if (selectedCategory !== "all" && q.category !== selectedCategory) {
          return false;
        }

        if (showSavedOnly && !q.isSaved) {
          return false;
        }

        if (showVerifiedOnly && !q.answers.some((a) => a.isVerifiedAccountant)) {
          return false;
        }

        if (searchQuery.trim()) {
          const qText = (q.title + " " + q.content + " " + q.tags.join(" ")).toLowerCase();
          if (!qText.includes(searchQuery.toLowerCase().trim())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "votes") {
          return b.votes - a.votes;
        }
        if (sortBy === "unanswered") {
          return a.answers.length - b.answers.length;
        }
        if (sortBy === "solved") {
          const aSolved = a.answers.some((ans) => ans.isBestAnswer) ? 1 : 0;
          const bSolved = b.answers.some((ans) => ans.isBestAnswer) ? 1 : 0;
          return bSolved - aSolved;
        }
        return 0;
      });
  }, [questions, selectedCategory, searchQuery, sortBy, showSavedOnly, showVerifiedOnly]);

  // Filtered Leaderboard Members
  const filteredLeaderboard = useMemo(() => {
    let list = [...LEADERBOARD_MEMBERS];

    if (leaderboardSearch.trim()) {
      const query = leaderboardSearch.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.role.toLowerCase().includes(query) ||
          m.badge.toLowerCase().includes(query)
      );
    }

    // Sort according to period
    if (leaderboardPeriod === "week") {
      list.sort((a, b) => b.weekXp - a.weekXp);
    } else if (leaderboardPeriod === "month") {
      list.sort((a, b) => b.monthXp - a.monthXp);
    } else {
      list.sort((a, b) => b.allXp - a.allXp);
    }

    // Update dynamically calculated rank
    return list.map((item, idx) => ({ ...item, currentRank: idx + 1 }));
  }, [leaderboardPeriod, leaderboardSearch]);

  // Overall Community Stats
  const totalQuestions = questions.length;
  const totalAnswers = questions.reduce((acc, q) => acc + q.answers.length, 0);
  const totalBestAnswers = questions.reduce(
    (acc, q) => acc + q.answers.filter((a) => a.isBestAnswer).length,
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-16 dir-rtl text-right" id="accountants-community-section">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c152e] via-[#101b3d] to-[#0a0f24] p-6 sm:p-10 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>ملتقى العقول المحاسبية والمهنية</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              مجتمع المحاسبين الماليين 🤝
            </h1>

            <p className="text-xs sm:text-base text-gray-300 font-normal leading-relaxed">
              اطرح استفساراتك المحاسبية والضريبية، شارك خبراتك في حل المشكلات العملية، وصوّت لأفضل الإجابات النموذجية المعتمدة لرفع مستوى المعرفة في العالم العربي.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            {/* Bell Notifications Button */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="relative px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-105"
              title="مركز التنبيهات والإشعارات"
            >
              <Bell className={`w-5 h-5 ${unreadNotifCount > 0 ? "text-amber-300 animate-pulse" : "text-gray-300"}`} />
              <span>التنبيهات</span>
              {unreadNotifCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-black bg-red-500 text-white rounded-full border border-red-300 shadow-md">
                  {unreadNotifCount}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-gray-300 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (!currentUser && onOpenAuth) {
                  onOpenAuth();
                } else {
                  setShowNewQuestionModal(true);
                  setActiveSubTab("questions");
                }
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5 text-white" />
              <span>اطرح سؤالاً محاسبياً (+15 XP)</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center bg-[#080d1f] p-1.5 rounded-2xl border border-white/15 shadow-inner">
            <button
              onClick={() => setActiveSubTab("questions")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === "questions"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-300" />
              <span>منتدى الأسئلة والنقاشات ({totalQuestions})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("leaderboard")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 relative ${
                activeSubTab === "leaderboard"
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>لوحة صدارة المجتمع 🏆</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-400 text-black rounded-full uppercase">
                الخبراء
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-300 font-bold">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{totalBestAnswers} إجابة نموذجية معتمدة</span>
            </span>
          </div>
        </div>
      </div>

      {/* SUB-TAB CONTENT 1: QUESTIONS FEED */}
      {activeSubTab === "questions" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Daily Case Study Poll & Top Experts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Accounting Poll Case Study */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#0c1328] via-[#0f1938] to-[#080d1e] p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-amber-400" />
                  <span>استطلاع وقضية اليوم المحاسبية 📊</span>
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  إجمالي الأصوات: {pollVotesCount.opt1 + pollVotesCount.opt2}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                كيف تُعالج أرباح وخسائر إعادة تقييم العملات الأجنبية للنقدية بالبنك في نهاية السنة المالية وفقاً لمعيار IAS 21؟
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                لدينا رصيد نقدية بالدولار في البنك ارتفع سعر صرفه بنهاية السنة. أين تُسجل أرباح التقييم الفروقات غير المحققة؟
              </p>

              {/* Poll Options */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => {
                    if (pollSelectedOption === null) {
                      setPollSelectedOption(1);
                      setPollVotesCount((prev) => ({ ...prev, opt1: prev.opt1 + 1 }));
                      triggerToast("شكرًا لمشاركتك في استطلاع المجتمع المحاسبي! 📊 (+10 XP)");
                      if (onAddXP) onAddXP(10, "المشاركة في استطلاع قضية اليوم المحاسبية");
                    }
                  }}
                  className={`w-full p-4 rounded-2xl text-right text-xs sm:text-sm font-bold border transition-all cursor-pointer relative overflow-hidden ${
                    pollSelectedOption === 1
                      ? "bg-emerald-600/30 border-emerald-500 text-white"
                      : "bg-black/30 border-white/10 text-gray-200 hover:border-amber-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span>1. أرباح أو خسائر تشغيلية ضمن قائمة الأرباح أو الخسائر (قائمة الدخل) ✅</span>
                    {pollSelectedOption !== null && (
                      <span className="text-xs font-black text-emerald-400">
                        {Math.round(
                          (pollVotesCount.opt1 / (pollVotesCount.opt1 + pollVotesCount.opt2)) * 100
                        )}
                        %
                      </span>
                    )}
                  </div>
                  {pollSelectedOption !== null && (
                    <div
                      className="absolute top-0 bottom-0 right-0 bg-emerald-500/20 transition-all duration-700"
                      style={{
                        width: `${Math.round(
                          (pollVotesCount.opt1 / (pollVotesCount.opt1 + pollVotesCount.opt2)) * 100
                        )}%`,
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (pollSelectedOption === null) {
                      setPollSelectedOption(2);
                      setPollVotesCount((prev) => ({ ...prev, opt2: prev.opt2 + 1 }));
                      triggerToast("شكرًا لمشاركتك في استطلاع المجتمع المحاسبي! 📊 (+10 XP)");
                      if (onAddXP) onAddXP(10, "المشاركة في استطلاع قضية اليوم المحاسبية");
                    }
                  }}
                  className={`w-full p-4 rounded-2xl text-right text-xs sm:text-sm font-bold border transition-all cursor-pointer relative overflow-hidden ${
                    pollSelectedOption === 2
                      ? "bg-amber-600/30 border-amber-500 text-white"
                      : "bg-black/30 border-white/10 text-gray-200 hover:border-amber-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span>2. تُرَأسمَل ضمن الدخل الشامل الآخر (OCI) وتُحوَّل لحقوق الملكية</span>
                    {pollSelectedOption !== null && (
                      <span className="text-xs font-black text-amber-400">
                        {Math.round(
                          (pollVotesCount.opt2 / (pollVotesCount.opt1 + pollVotesCount.opt2)) * 100
                        )}
                        %
                      </span>
                    )}
                  </div>
                  {pollSelectedOption !== null && (
                    <div
                      className="absolute top-0 bottom-0 right-0 bg-amber-500/20 transition-all duration-700"
                      style={{
                        width: `${Math.round(
                          (pollVotesCount.opt2 / (pollVotesCount.opt1 + pollVotesCount.opt2)) * 100
                        )}%`,
                      }}
                    />
                  )}
                </button>
              </div>

              {pollSelectedOption !== null && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 font-semibold animate-fadeIn flex items-center justify-between">
                  <span>
                    💡 **الإجابة النموذجية المعيارية**: Option 1 هي الإجابة الصحيحة تماماً وفق IAS 21 لجميع البنود النقدية!
                  </span>
                </div>
              )}
            </div>

            {/* Top Community Experts Preview */}
            <div className="bg-[#0b1124] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <h3 className="font-black text-sm text-white">متصدرو صدارة المجتمع</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab("leaderboard")}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض اللوحة 🏆</span>
                  </button>
                </div>

                <div className="space-y-2.5 pt-3">
                  {LEADERBOARD_MEMBERS.slice(0, 4).map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-base">
                          {exp.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1">
                            <span>{exp.name}</span>
                            <UserCheck className="w-3 h-3 text-emerald-400" />
                          </div>
                          <div className="text-[10px] text-gray-400 line-clamp-1">{exp.role}</div>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 block">
                          {exp.allXp} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-center border-t border-white/10">
                <button
                  onClick={() => setActiveSubTab("leaderboard")}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs hover:bg-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>افتح لوحة الصدارة الشاملة 🏆</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar Header */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0d152c] p-4 rounded-3xl border border-white/10 shadow-lg">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن سؤال أو معيار أو قيد محاسبي..."
                  className="w-full bg-[#080d1f] border border-white/10 rounded-2xl pr-11 pl-4 py-3 text-xs sm:text-sm text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Buttons & Saved Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-[#080d1f] p-1 rounded-2xl border border-white/10">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      sortBy === "latest"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    الأحدث
                  </button>
                  <button
                    onClick={() => setSortBy("votes")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                      sortBy === "votes"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>الأعلى تصويتاً</span>
                  </button>
                  <button
                    onClick={() => setSortBy("solved")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      sortBy === "solved"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    إجابات معتمدة ✅
                  </button>
                  <button
                    onClick={() => setSortBy("unanswered")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      sortBy === "unanswered"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    بحاجة لإجابة
                  </button>
                </div>

                <button
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showVerifiedOnly
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                      : "bg-[#080d1f] text-gray-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>إجابات معتمدة فقط</span>
                </button>

                <button
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showSavedOnly
                      ? "bg-pink-600 text-white border-pink-500 shadow-md"
                      : "bg-[#080d1f] text-gray-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>المحفوظة ({questions.filter((q) => q.isSaved).length})</span>
                </button>
              </div>
            </div>

            {/* Categories Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20"
                        : "bg-[#0b1226] text-gray-300 border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-indigo-400"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Feed List */}
          <div className="space-y-5">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0b1226] border border-white/10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-black text-white">لم يتم العثور على أسئلة مطابقة</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  جرب تغيير كلمات البحث أو اختر تصنيفاً آخر، أو كن أول من يطرح هذا الاستفسار في المجتمع!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setShowSavedOnly(false);
                    setShowVerifiedOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                const bestAnswer = q.answers.find((a) => a.isBestAnswer);

                return (
                  <div
                    key={q.id}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? "bg-[#0c142b] border-indigo-500/40 shadow-2xl ring-1 ring-indigo-500/20"
                        : "bg-[#0a0f21] border-white/10 hover:border-white/20 shadow-lg"
                    }`}
                  >
                    {/* Question Header Card */}
                    <div className="p-5 sm:p-7 space-y-4">
                      {/* Category & Tags Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-indigo-400" />
                            <span>
                              {CATEGORIES.find((c) => c.id === q.category)?.label || "عام"}
                            </span>
                          </span>

                          {bestAnswer && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>تم الإجابة بنجاح ✅</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            <span>{q.createdAt}</span>
                          </span>

                          <button
                            onClick={() => handleShareQuestion(q)}
                            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                            title="مشاركة رابط السؤال"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleSaveQuestion(q.id)}
                            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                              q.isSaved
                                ? "text-pink-400 bg-pink-500/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                            title="حفظ السؤال"
                          >
                            <BookMarked className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h2
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="text-base sm:text-xl font-black text-white hover:text-indigo-300 cursor-pointer transition-colors leading-snug"
                      >
                        {q.title}
                      </h2>

                      {/* Author and Snippet */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-lg">
                            {q.authorAvatar}
                          </div>
                          <div>
                            <div className="text-xs font-black text-white flex items-center gap-1">
                              <span>{q.authorName}</span>
                              <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded">
                                {q.authorRole}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
                          <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                            <span>{q.answers.length} إجابات</span>
                          </div>

                          <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span>{q.votes} صوت</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags Pill Row */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {q.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Content Preview or Expanded Content */}
                      <div className="pt-2 text-xs sm:text-sm text-gray-300 leading-relaxed font-normal bg-black/20 p-4 rounded-2xl border border-white/5">
                        {q.content}
                      </div>

                      {/* Expand / Collapse Button */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVoteQuestion(q.id, "up")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 border transition-all cursor-pointer ${
                              q.userVote === "up"
                                ? "bg-indigo-600 text-white border-indigo-500"
                                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>تأييد ({q.votes})</span>
                          </button>

                          <button
                            onClick={() => handleGenerateAiAnswer(q)}
                            disabled={aiGeneratingId === q.id}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
                          >
                            {aiGeneratingId === q.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                            ) : (
                              <Bot className="w-3.5 h-3.5 text-amber-300" />
                            )}
                            <span>توليد تحليل ذكي 🤖</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="text-xs font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? "إغلاق النقاش" : `عرض الإجابات (${q.answers.length})`}</span>
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED ANSWERS SECTION */}
                    {isExpanded && (
                      <div className="bg-[#080d1f] p-5 sm:p-7 border-t border-white/10 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h3 className="text-sm font-black text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-400" />
                            <span>الإجابات والتوضيحات المحاسبية ({q.answers.length})</span>
                          </h3>
                        </div>

                        {/* List of Answers */}
                        <div className="space-y-4">
                          {q.answers.length === 0 ? (
                            <div className="p-6 text-center text-xs text-gray-400 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                              <div>💬 لا توجد إجابات حتى الآن. كن أول من يضيف إجابة ودية ومفيدة!</div>
                            </div>
                          ) : (
                            q.answers.map((ans) => (
                              <div
                                key={ans.id}
                                className={`p-4 rounded-2xl border space-y-3 transition-all ${
                                  ans.isBestAnswer
                                    ? "bg-gradient-to-br from-emerald-950/40 via-[#0a1f18] to-[#081510] border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/30"
                                    : ans.aiGenerated
                                    ? "bg-gradient-to-br from-purple-950/30 to-indigo-950/30 border-purple-500/40"
                                    : "bg-white/5 border-white/5"
                                }`}
                              >
                                {/* Answer Author Row */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-base flex items-center justify-center border border-indigo-400/30">
                                      {ans.authorAvatar}
                                    </div>
                                    <div>
                                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                                        <span>{ans.authorName}</span>
                                        {ans.isVerifiedAccountant && (
                                          <UserCheck
                                            className="w-3.5 h-3.5 text-emerald-400"
                                            title="خبير محاسبي موثق"
                                          />
                                        )}
                                        {ans.aiGenerated && (
                                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                                            <Bot className="w-3 h-3 text-purple-300" />
                                            <span>ذكاء اصطناعي</span>
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-gray-400">{ans.authorRole}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {ans.isBestAnswer && (
                                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-black flex items-center gap-1 shadow-md">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>إجابة نموذجية معتمدة 🌟</span>
                                      </span>
                                    )}

                                    <span className="text-[10px] text-gray-500 font-semibold">
                                      {ans.createdAt}
                                    </span>
                                  </div>
                                </div>

                                {/* Answer Content */}
                                <div className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line font-normal pr-2">
                                  {ans.content}
                                </div>

                                {/* Answer Footer Controls */}
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleVoteAnswer(q.id, ans.id, "up")}
                                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                        ans.userVote === "up"
                                          ? "bg-indigo-600 text-white"
                                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                                      }`}
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>مفيد ({ans.votes})</span>
                                    </button>
                                  </div>

                                  {/* Button to mark best answer */}
                                  <button
                                    onClick={() => handleMarkBestAnswer(q.id, ans.id)}
                                    className={`text-[11px] font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                      ans.isBestAnswer
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                                    }`}
                                  >
                                    {ans.isBestAnswer ? "إلغاء اعتماد الإجابة" : "اعتماد كـ أفضل إجابة 🌟"}
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Answer Form Input */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                          <label className="text-xs font-black text-white flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-indigo-400" />
                            <span>أضف إجابتك المحاسبية أو تعقيبك المهني (+25 XP):</span>
                          </label>

                          <div className="flex gap-2">
                            <textarea
                              rows={3}
                              value={answerInputs[q.id] || ""}
                              onChange={(e) =>
                                setAnswerInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                              }
                              placeholder="اكتب التوجيه المحاسبي المعياري أو المعالجة الموصى بها هنا..."
                              className="w-full bg-[#0d1428] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleAddAnswer(q.id)}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>نشر الإجابة (+25 XP)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB CONTENT 2: COMMUNITY LEADERBOARD (لوحة صدارة المجتمع) */}
      {activeSubTab === "leaderboard" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Leaderboard Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121c3b] via-[#1a1438] to-[#120e2e] p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>لوحة صدارة الخبراء والمساهمين الأكثر مساعدة 🏆</span>
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white">
                  أبطال ومستشارو مجتمع الميزان المحاسبي
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                  تُكرّم هذه اللوحة المحاسبين الماليين والمراجعين القانونيين الأكثر تفاعلاً وإثراءً للمحتوى المعياري والضريبي بالمنصة.
                </p>
              </div>

              {/* Period Switcher */}
              <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
                <button
                  onClick={() => setLeaderboardPeriod("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    leaderboardPeriod === "all"
                      ? "bg-amber-500 text-black shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  الترتيب العام (All-time)
                </button>
                <button
                  onClick={() => setLeaderboardPeriod("month")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    leaderboardPeriod === "month"
                      ? "bg-amber-500 text-black shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  هذا الشهر
                </button>
                <button
                  onClick={() => setLeaderboardPeriod("week")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    leaderboardPeriod === "week"
                      ? "bg-amber-500 text-black shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  هذا الأسبوع
                </button>
              </div>
            </div>

            {/* TOP 3 PODIUM (منصة التتويج للمراكز الثلاثة الأولى) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* RANK 2 - SILVER */}
              {filteredLeaderboard[1] && (
                <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-5 rounded-3xl border border-slate-400/40 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute top-3 left-3 bg-slate-400/20 text-slate-200 text-xs font-black px-2.5 py-1 rounded-full border border-slate-400/30 flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-slate-300" />
                    <span>المركز 2</span>
                  </div>

                  <div className="relative mt-2">
                    <div className="w-20 h-20 rounded-full bg-slate-700 border-4 border-slate-300 flex items-center justify-center text-3xl shadow-lg">
                      {filteredLeaderboard[1].avatar}
                    </div>
                    <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-slate-200 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      🥈 التاج الفضي
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
                      <span>{filteredLeaderboard[1].name}</span>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-slate-300 font-semibold">{filteredLeaderboard[1].role}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-black bg-slate-400/20 text-slate-200 rounded border border-slate-400/30">
                      {filteredLeaderboard[1].badge}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-700/60 text-center">
                    <div className="bg-slate-800/50 p-2 rounded-xl">
                      <div className="text-xs font-black text-amber-300">
                        {leaderboardPeriod === "week"
                          ? filteredLeaderboard[1].weekXp
                          : leaderboardPeriod === "month"
                          ? filteredLeaderboard[1].monthXp
                          : filteredLeaderboard[1].allXp}{" "}
                        XP
                      </div>
                      <div className="text-[9px] text-gray-400">النقاط</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-xl">
                      <div className="text-xs font-black text-white">
                        {filteredLeaderboard[1].answersCount}
                      </div>
                      <div className="text-[9px] text-gray-400">إجابة</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-xl">
                      <div className="text-xs font-black text-emerald-400">
                        {filteredLeaderboard[1].bestAnswersCount}
                      </div>
                      <div className="text-[9px] text-gray-400">معتمدة</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendThanks(filteredLeaderboard[1])}
                    className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        thankedMembers[filteredLeaderboard[1].id]
                          ? "fill-pink-500 text-pink-500"
                          : "text-pink-400"
                      }`}
                    />
                    <span>
                      {thankedMembers[filteredLeaderboard[1].id]
                        ? "تم إرسال التحية 💖"
                        : "إرسال تحية شكر (+5 XP)"}
                    </span>
                  </button>
                </div>
              )}

              {/* RANK 1 - GOLD (CENTER & LARGER) */}
              {filteredLeaderboard[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/80 via-[#261b0c] to-[#120d06] p-6 rounded-3xl border-2 border-amber-400/80 shadow-2xl flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:scale-[1.03] transition-transform md:-translate-y-3">
                  <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black text-[11px] font-black py-1 text-center shadow-md flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4 fill-black" />
                    <span>المركز الأول - بطل المجتمع الذهبي 🏆</span>
                  </div>

                  <div className="relative mt-6">
                    <div className="w-24 h-24 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-2xl ring-4 ring-amber-500/30">
                      {filteredLeaderboard[0].avatar}
                    </div>
                    <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-amber-400 text-black text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg">
                      🥇 الفائز الذهبي
                    </span>
                  </div>

                  <div className="pt-1">
                    <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                      <span>{filteredLeaderboard[0].name}</span>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-amber-200 font-semibold">{filteredLeaderboard[0].role}</p>
                    <span className="inline-block mt-1 px-3 py-0.5 text-[10px] font-black bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/40">
                      {filteredLeaderboard[0].badge}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-amber-500/30 text-center">
                    <div className="bg-amber-900/30 p-2.5 rounded-xl border border-amber-500/20">
                      <div className="text-sm font-black text-amber-300">
                        {leaderboardPeriod === "week"
                          ? filteredLeaderboard[0].weekXp
                          : leaderboardPeriod === "month"
                          ? filteredLeaderboard[0].monthXp
                          : filteredLeaderboard[0].allXp}{" "}
                        XP
                      </div>
                      <div className="text-[10px] text-gray-300 font-bold">نقاط XP</div>
                    </div>
                    <div className="bg-amber-900/30 p-2.5 rounded-xl border border-amber-500/20">
                      <div className="text-sm font-black text-white">
                        {filteredLeaderboard[0].answersCount}
                      </div>
                      <div className="text-[10px] text-gray-300 font-bold">إجابة</div>
                    </div>
                    <div className="bg-amber-900/30 p-2.5 rounded-xl border border-amber-500/20">
                      <div className="text-sm font-black text-emerald-400">
                        {filteredLeaderboard[0].bestAnswersCount}
                      </div>
                      <div className="text-[10px] text-gray-300 font-bold">معتمدة</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendThanks(filteredLeaderboard[0])}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        thankedMembers[filteredLeaderboard[0].id]
                          ? "fill-black text-black"
                          : "text-black"
                      }`}
                    />
                    <span>
                      {thankedMembers[filteredLeaderboard[0].id]
                        ? "تم تقديم تحية الشكر 💖"
                        : "إرسال تحية تشجيعية (+5 XP)"}
                    </span>
                  </button>
                </div>
              )}

              {/* RANK 3 - BRONZE */}
              {filteredLeaderboard[2] && (
                <div className="order-3 bg-gradient-to-b from-orange-950/70 to-amber-950/80 p-5 rounded-3xl border border-orange-500/40 shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute top-3 left-3 bg-orange-500/20 text-orange-200 text-xs font-black px-2.5 py-1 rounded-full border border-orange-500/30 flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-orange-400" />
                    <span>المركز 3</span>
                  </div>

                  <div className="relative mt-2">
                    <div className="w-20 h-20 rounded-full bg-orange-950 border-4 border-orange-500 flex items-center justify-center text-3xl shadow-lg">
                      {filteredLeaderboard[2].avatar}
                    </div>
                    <span className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      🥉 التاج البرونزي
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
                      <span>{filteredLeaderboard[2].name}</span>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-orange-200 font-semibold">{filteredLeaderboard[2].role}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-black bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                      {filteredLeaderboard[2].badge}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-orange-900/60 text-center">
                    <div className="bg-orange-950/50 p-2 rounded-xl">
                      <div className="text-xs font-black text-amber-300">
                        {leaderboardPeriod === "week"
                          ? filteredLeaderboard[2].weekXp
                          : leaderboardPeriod === "month"
                          ? filteredLeaderboard[2].monthXp
                          : filteredLeaderboard[2].allXp}{" "}
                        XP
                      </div>
                      <div className="text-[9px] text-gray-400">النقاط</div>
                    </div>
                    <div className="bg-orange-950/50 p-2 rounded-xl">
                      <div className="text-xs font-black text-white">
                        {filteredLeaderboard[2].answersCount}
                      </div>
                      <div className="text-[9px] text-gray-400">إجابة</div>
                    </div>
                    <div className="bg-orange-950/50 p-2 rounded-xl">
                      <div className="text-xs font-black text-emerald-400">
                        {filteredLeaderboard[2].bestAnswersCount}
                      </div>
                      <div className="text-[9px] text-gray-400">معتمدة</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendThanks(filteredLeaderboard[2])}
                    className="w-full py-2 rounded-xl bg-orange-900/50 hover:bg-orange-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        thankedMembers[filteredLeaderboard[2].id]
                          ? "fill-pink-500 text-pink-500"
                          : "text-pink-400"
                      }`}
                    />
                    <span>
                      {thankedMembers[filteredLeaderboard[2].id]
                        ? "تم إرسال التحية 💖"
                        : "إرسال تحية شكر (+5 XP)"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current User Rank Card (موقعي في صدارة المجتمع) */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 p-5 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg border border-indigo-400/30">
                #12
              </div>
              <div>
                <div className="text-xs text-indigo-300 font-bold">موقعك الحالي في صدارة المجتمع</div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>{currentUser?.name || "محاسب ميزان الطموح"}</span>
                  <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-500/20 text-indigo-200 rounded">
                    {currentUser?.role || "عضو متفاعل"}
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-gray-200">
              <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-center">
                <div className="text-amber-300 font-black text-sm">
                  {currentUser?.xp || 320} XP
                </div>
                <div className="text-[10px] text-gray-400">إجمالي النقاط</div>
              </div>

              <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-center">
                <div className="text-emerald-400 font-black text-sm">3 إجابات</div>
                <div className="text-[10px] text-gray-400">مشاركاتك</div>
              </div>

              <button
                onClick={() => {
                  setShowNewQuestionModal(true);
                  setActiveSubTab("questions");
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer transition-all shadow-md"
              >
                شارك إجابة لرفع ترتيبك 🚀
              </button>
            </div>
          </div>

          {/* FULL LEADERBOARD TABLE / LIST */}
          <div className="bg-[#0b1226] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <span>جدول ترتيب جميع أعضاء وخبراء المجتمع</span>
                </h3>
                <p className="text-xs text-gray-400">
                  مرتبة بناءً على مساهماتهم وحصولهم على إجابات معتمدة من المراجعين القانونيين.
                </p>
              </div>

              {/* Leaderboard Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  placeholder="ابحث عن خبير أو عضو..."
                  className="w-full bg-[#070b18] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3 pt-2">
              {filteredLeaderboard.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-amber-400/40 ${
                    member.rank === 1
                      ? "bg-amber-950/20 border-amber-500/30"
                      : member.rank === 2
                      ? "bg-slate-800/20 border-slate-400/30"
                      : member.rank === 3
                      ? "bg-orange-950/20 border-orange-500/30"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  {/* Left info: Rank + Avatar + Name */}
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-9 h-9 rounded-2xl text-xs font-black flex items-center justify-center shrink-0 border ${
                        member.rank === 1
                          ? "bg-amber-500 text-black border-amber-400"
                          : member.rank === 2
                          ? "bg-slate-300 text-black border-slate-200"
                          : member.rank === 3
                          ? "bg-orange-500 text-black border-orange-400"
                          : "bg-white/5 text-gray-300 border-white/10"
                      }`}
                    >
                      #{member.rank}
                    </span>

                    <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-xl shrink-0">
                      {member.avatar}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.isVerifiedAccountant && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" title="خبير معتمد" />
                        )}
                        <span className="px-2 py-0.2 text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                          {member.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 line-clamp-1">{member.role}</div>
                    </div>
                  </div>

                  {/* Stats & Points */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                    <div className="text-right sm:text-center">
                      <div className="text-xs font-black text-white">{member.answersCount}</div>
                      <div className="text-[9px] text-gray-400">إجابات</div>
                    </div>

                    <div className="text-right sm:text-center">
                      <div className="text-xs font-black text-emerald-400">
                        {member.bestAnswersCount}
                      </div>
                      <div className="text-[9px] text-gray-400">معتمدة</div>
                    </div>

                    <div className="text-right sm:text-center">
                      <div className="text-xs font-black text-amber-300">
                        {leaderboardPeriod === "week"
                          ? member.weekXp
                          : leaderboardPeriod === "month"
                          ? member.monthXp
                          : member.allXp}{" "}
                        XP
                      </div>
                      <div className="text-[9px] text-gray-400">النقاط</div>
                    </div>

                    <button
                      onClick={() => handleSendThanks(member)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
                        thankedMembers[member.id]
                          ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          thankedMembers[member.id]
                            ? "fill-pink-400 text-pink-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span>{thankedMembers[member.id] ? "شكراً! ❤️" : "تحية"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamification Guide: How to Earn Leaderboard Points */}
          <div className="bg-gradient-to-br from-[#0e1633] to-[#070c1e] p-6 rounded-3xl border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-black text-white">
                طرق الارتقاء في لوحة الصدارة وكسب شارات الخبراء 🌟
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-black text-amber-300">+50 XP</div>
                <div className="text-xs text-white font-bold">إجابة نموذجية معتمدة</div>
                <div className="text-[10px] text-gray-400">عند اختيار إجابتك كـ أفضل حل</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-black text-purple-300">+25 XP</div>
                <div className="text-xs text-white font-bold">تقديم إجابة محاسبية</div>
                <div className="text-[10px] text-gray-400">عند كتابة حل لسؤال مطروح</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-black text-indigo-300">+15 XP</div>
                <div className="text-xs text-white font-bold">طرح سؤال محاسبي</div>
                <div className="text-[10px] text-gray-400">عند فتح موضوع أو استفسار جديد</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-black text-emerald-300">+10 XP</div>
                <div className="text-xs text-white font-bold">التصويت في قضية اليوم</div>
                <div className="text-[10px] text-gray-400">المشاركة في استطلاعات الرأي</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-black text-pink-300">+5 XP</div>
                <div className="text-xs text-white font-bold">تأييد وتفاعل</div>
                <div className="text-[10px] text-gray-400">عند دعم زملائك بالأجوبة</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW QUESTION MODAL */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d152c] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-scaleUp text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">طرح استفسار محاسبي جديد (+15 XP)</h3>
              </div>
              <button
                onClick={() => setShowNewQuestionModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">عنوان السؤال (باختصار ووضوح):</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: كيف يتم معالجة الخصم النقدي المكتسب وفق IFRS 15؟"
                  className="w-full bg-[#070b18] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">التصنيف المحاسبي الرئيسي:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#070b18] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">الكلمات المفتاحية (وسوم مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={newTagsInput}
                    onChange={(e) => setNewTagsInput(e.target.value)}
                    placeholder="مثال: IAS 18, الخصم, قيود"
                    className="w-full bg-[#070b18] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">تفاصيل وتساؤل القيد أو المعيار:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="اشرح الحالة المحاسبية، أرقام المبالغ، والسيناريو الخاص بشركتك بالتفصيل لتسهيل الإجابة..."
                  className="w-full bg-[#070b18] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-gray-300 hover:bg-white/20 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>نشر السؤال الآن (+15 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL OVERLAY */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
          <div className="bg-[#0d152c] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl animate-scaleUp text-right max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                  <BellRing className="w-5 h-5 text-amber-300 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>مركز التنبيهات والإشعارات</span>
                    {unreadNotifCount > 0 && (
                      <span className="px-2.5 py-0.5 text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 rounded-full">
                        {unreadNotifCount} جديد
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400">إخطارات الردود والتصويطات على أسئلتك وإجاباتك</p>
                </div>
              </div>

              <button
                onClick={() => setShowNotificationsModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNotifFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    notifFilter === "all"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  الكل ({notifications.length})
                </button>
                <button
                  onClick={() => setNotifFilter("unread")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    notifFilter === "unread"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  غير مقروءة ({unreadNotifCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>تحديد الكل كمقروء</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                    title="مسح كافة التنبيهات"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Simulation test banner */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-2xl border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
              <span className="text-xs text-purple-200 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>تجربة استقبال تنبيه فورية (اختبار):</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateNotification("answer")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 text-xs text-white font-bold border border-indigo-400/40 transition-all cursor-pointer"
                >
                  تلقي إجابة 💬
                </button>
                <button
                  onClick={() => handleSimulateNotification("upvote")}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 text-xs text-white font-bold border border-purple-400/40 transition-all cursor-pointer"
                >
                  تلقي تصويت ⬆️
                </button>
              </div>
            </div>

            {/* Notifications Scrollable List */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[50vh]">
              {notifications.filter((n) => (notifFilter === "unread" ? !n.isRead : true)).length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 mx-auto flex items-center justify-center text-3xl">
                    🔔
                  </div>
                  <p className="text-sm font-bold text-gray-400">لا توجد تنبيهات حالياً في هذه القائمة</p>
                </div>
              ) : (
                notifications
                  .filter((n) => (notifFilter === "unread" ? !n.isRead : true))
                  .map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.questionId) {
                          setExpandedQuestionId(notif.questionId);
                          setActiveSubTab("questions");
                          setShowNotificationsModal(false);
                          triggerToast("تم الانتقال إلى موضوع السؤال المرتبط 📌");
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative ${
                        !notif.isRead
                          ? "bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-400 shadow-md"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute top-4 left-4 animate-ping" />
                      )}

                      {/* Icon / Sender Avatar */}
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-xl shrink-0">
                        {notif.senderAvatar || (notif.type === "answer" ? "💬" : notif.type === "upvote" ? "⬆️" : "🌟")}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                            <span>{notif.title}</span>
                            {notif.type === "best_answer" && (
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-semibold">{notif.createdAt}</span>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed font-normal">{notif.message}</p>

                        {notif.questionId && (
                          <div className="text-[11px] text-indigo-400 font-bold flex items-center gap-1 pt-1">
                            <span>عرض التفاصيل والسؤال</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 shrink-0">
              <span>تُحفظ الإشعارات تلقائياً في حسابك المحاسبي</span>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

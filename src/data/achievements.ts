import { Badge } from "../types";

export interface UserRank {
  level: number;
  title: string;
  subTitle: string;
  icon: string;
  color: string;
  bgGradient: string;
  minXp: number;
  nextLevelXp: number;
}

export const USER_RANKS: UserRank[] = [
  {
    level: 1,
    title: "مبتدئ محاسبي",
    subTitle: "بداية رحلة إتقان القيود والمعادلات",
    icon: "🌱",
    color: "#22C55E",
    bgGradient: "from-emerald-500/20 to-teal-500/10",
    minXp: 0,
    nextLevelXp: 100
  },
  {
    level: 2,
    title: "محاسب موقع وقيد",
    subTitle: "إجادة التوجيه وإعداد ميزان المراجعة",
    icon: "📊",
    color: "#3B82F6",
    bgGradient: "from-blue-500/20 to-indigo-500/10",
    minXp: 100,
    nextLevelXp: 250
  },
  {
    level: 3,
    title: "رئيس حسابات متقدم",
    subTitle: "احتراف التسويات والقوائم المالية والضريبية",
    icon: "💼",
    color: "#EAB308",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
    minXp: 250,
    nextLevelXp: 500
  },
  {
    level: 4,
    title: "مدير مالي (CFO)",
    subTitle: "إتقان التحليل المالي والنمذجة والتخطيط",
    icon: "🏆",
    color: "#A855F7",
    bgGradient: "from-purple-500/20 to-fuchsia-500/10",
    minXp: 500,
    nextLevelXp: 1000
  },
  {
    level: 5,
    title: "خبير زمالة CPA / IFRS",
    subTitle: "مرجع المعايير الدولية والرقابة المالية",
    icon: "💎",
    color: "#EC4899",
    bgGradient: "from-pink-500/20 to-rose-500/10",
    minXp: 1000,
    nextLevelXp: 2000
  },
  {
    level: 6,
    title: "رائد التحول المالي",
    subTitle: "أعلى مرتبة في منصة ميزان المحاسبية",
    icon: "👑",
    color: "#F59E0B",
    bgGradient: "from-amber-400/30 to-orange-500/20",
    minXp: 2000,
    nextLevelXp: 5000
  }
];

export function getUserRank(xp: number): {
  rank: UserRank;
  progressPercent: number;
  currentLevelXp: number;
  neededXpForNext: number;
} {
  let currentRank = USER_RANKS[0];
  for (let i = USER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= USER_RANKS[i].minXp) {
      currentRank = USER_RANKS[i];
      break;
    }
  }

  const range = currentRank.nextLevelXp - currentRank.minXp;
  const currentInLevel = Math.max(0, xp - currentRank.minXp);
  const progressPercent = Math.min(100, Math.round((currentInLevel / range) * 100));
  const neededXpForNext = Math.max(0, currentRank.nextLevelXp - xp);

  return {
    rank: currentRank,
    progressPercent,
    currentLevelXp: currentInLevel,
    neededXpForNext
  };
}

export const BADGES_LIST: Badge[] = [
  {
    id: "b_first_lesson",
    title: "الخطوة الأولى 🏅",
    description: "إكمال أول درس تعليمي في طريق التعلم المحاسبي",
    icon: "📖",
    category: "lesson",
    xpReward: 50,
    condition: "إكمال درس واحد"
  },
  {
    id: "b_lessons_5",
    title: "محاسب ناشئ 📚",
    description: "إكمال 5 دروس محاسبية بنجاح",
    icon: "🎓",
    category: "lesson",
    xpReward: 100,
    condition: "إكمال 5 دروس"
  },
  {
    id: "b_lessons_15",
    title: "طالب زمالة 🌟",
    description: "إكمال 15 درساً تعليمياً شاملاً",
    icon: "🏫",
    category: "lesson",
    xpReward: 200,
    condition: "إكمال 15 درساً"
  },
  {
    id: "b_lessons_30",
    title: "خبير المناهج 👑",
    description: "إكمال 30 درساً تعليمياً متقدماً",
    icon: "📜",
    category: "lesson",
    xpReward: 350,
    condition: "إكمال 30 درساً"
  },
  {
    id: "b_lab_first",
    title: "قيد متوازن ⚖️",
    description: "حل وتسجيل أول قيد محاسبي صحيح بالمعمل",
    icon: "📐",
    category: "lab",
    xpReward: 75,
    condition: "حل أول قيد بالمعمل"
  },
  {
    id: "b_lab_5",
    title: "مهندس القيود ⚡",
    description: "إنجاز 5 قيود وسيناريوهات محاسبية في المعمل",
    icon: "💼",
    category: "lab",
    xpReward: 150,
    condition: "حل 5 قيود بالمعمل"
  },
  {
    id: "b_lab_15",
    title: "مدير الحسابات 🏭",
    description: "إتقان 15 عملية محاسبية معقدة في المعمل",
    icon: "🏆",
    category: "lab",
    xpReward: 300,
    condition: "حل 15 قيداً بالمعمل"
  },
  {
    id: "b_daily_first",
    title: "التحدي الأول 🔥",
    description: "إجابة سؤال التحدي اليومي السريع بنجاح",
    icon: "⚡",
    category: "challenge",
    xpReward: 50,
    condition: "حل سؤال تحدي يومي"
  },
  {
    id: "b_daily_3",
    title: "مواظب التحديات 🎯",
    description: "حل 3 أسئلة من التحديات اليومية",
    icon: "🗓️",
    category: "challenge",
    xpReward: 120,
    condition: "حل 3 تحديات يومية"
  },
  {
    id: "b_streak_3",
    title: "المواظب الذهبي ⚡",
    description: "الاستمرار في التعلم لـ 3 أيام متتالية",
    icon: "🔥",
    category: "streak",
    xpReward: 100,
    condition: "سلسلة 3 أيام متتالية"
  },
  {
    id: "b_xp_200",
    title: "جامع النقاط ⭐",
    description: "الوصول إلى 200 نقطة خبرة (XP) في منصة ميزان",
    icon: "✨",
    category: "xp",
    xpReward: 100,
    condition: "الوصول لـ 200 XP"
  },
  {
    id: "b_xp_500",
    title: "المحاسب الماسي 💎",
    description: "تخطي حاجز 500 نقطة خبرة بنجاح",
    icon: "💎",
    category: "xp",
    xpReward: 250,
    condition: "الوصول لـ 500 XP"
  }
];

export function checkNewlyUnlockedBadges(
  currentlyUnlocked: string[],
  stats: {
    completedLessonsCount: number;
    solvedLabEntriesCount: number;
    dailyChallengesSolvedCount: number;
    streakCount: number;
    xp: number;
  }
): Badge[] {
  const newlyUnlocked: Badge[] = [];

  for (const badge of BADGES_LIST) {
    if (currentlyUnlocked.includes(badge.id)) continue;

    let unlocked = false;

    switch (badge.id) {
      case "b_first_lesson":
        unlocked = stats.completedLessonsCount >= 1;
        break;
      case "b_lessons_5":
        unlocked = stats.completedLessonsCount >= 5;
        break;
      case "b_lessons_15":
        unlocked = stats.completedLessonsCount >= 15;
        break;
      case "b_lessons_30":
        unlocked = stats.completedLessonsCount >= 30;
        break;

      case "b_lab_first":
        unlocked = stats.solvedLabEntriesCount >= 1;
        break;
      case "b_lab_5":
        unlocked = stats.solvedLabEntriesCount >= 5;
        break;
      case "b_lab_15":
        unlocked = stats.solvedLabEntriesCount >= 15;
        break;

      case "b_daily_first":
        unlocked = stats.dailyChallengesSolvedCount >= 1;
        break;
      case "b_daily_3":
        unlocked = stats.dailyChallengesSolvedCount >= 3;
        break;

      case "b_streak_3":
        unlocked = stats.streakCount >= 3;
        break;

      case "b_xp_200":
        unlocked = stats.xp >= 200;
        break;
      case "b_xp_500":
        unlocked = stats.xp >= 500;
        break;

      default:
        break;
    }

    if (unlocked) {
      newlyUnlocked.push({
        ...badge,
        unlockedAt: new Date().toLocaleDateString("ar-SA")
      });
    }
  }

  return newlyUnlocked;
}

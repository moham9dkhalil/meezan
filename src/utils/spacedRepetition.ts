export type DifficultyRating = "hard" | "good" | "easy";

export interface SRSCardData {
  cardKey: string; // unique key, e.g., `${cat}::${ar}` or `${stageId}_${lessonIdx}_${questionNum}`
  box: number; // 1 to 5 (Leitner system)
  intervalDays: number;
  lastReviewed: number; // timestamp ms
  nextReviewDate: number; // timestamp ms
  reviewCount: number;
  againCount: number;
  easeFactor: number;
}

export const INTERVAL_MAP: Record<number, number> = {
  1: 1,  // 1 day
  2: 3,  // 3 days
  3: 7,  // 7 days
  4: 14, // 14 days
  5: 30, // 30 days
};

const STORAGE_KEY = "mizan_srs_data_v1";

export function loadSRSData(): Record<string, SRSCardData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load SRS data", e);
    return {};
  }
}

export function saveSRSData(data: Record<string, SRSCardData>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save SRS data", e);
  }
}

export function recordSRSReview(
  cardKey: string,
  rating: DifficultyRating
): { updatedItem: SRSCardData; isRequeue: boolean } {
  const data = loadSRSData();
  const now = Date.now();
  const existing = data[cardKey] || {
    cardKey,
    box: 1,
    intervalDays: 1,
    lastReviewed: now,
    nextReviewDate: now,
    reviewCount: 0,
    againCount: 0,
    easeFactor: 2.5,
  };

  let newBox = existing.box;
  let newEase = existing.easeFactor;
  let againCount = existing.againCount;
  let isRequeue = false;

  if (rating === "hard") {
    newBox = 1; // Reset to Box 1 for urgent review
    newEase = Math.max(1.3, existing.easeFactor - 0.2);
    againCount += 1;
    isRequeue = true;
  } else if (rating === "good") {
    newBox = Math.min(5, Math.max(2, existing.box + 1));
  } else if (rating === "easy") {
    newBox = Math.min(5, existing.box + 2);
    newEase = existing.easeFactor + 0.15;
  }

  const intervalDays = INTERVAL_MAP[newBox] || 1;
  // If hard, next review timestamp is set to today/tomorrow (12h), else intervalDays
  const nextReviewDate = rating === "hard" ? now + 12 * 3600 * 1000 : now + intervalDays * 24 * 3600 * 1000;

  const updatedItem: SRSCardData = {
    cardKey,
    box: newBox,
    intervalDays,
    lastReviewed: now,
    nextReviewDate,
    reviewCount: existing.reviewCount + 1,
    againCount,
    easeFactor: newEase,
  };

  data[cardKey] = updatedItem;
  saveSRSData(data);

  return { updatedItem, isRequeue };
}

export function isCardDue(cardKey: string): boolean {
  const data = loadSRSData();
  const item = data[cardKey];
  if (!item) return true; // new card is due
  return Date.now() >= item.nextReviewDate || item.box === 1;
}

export function getSRSStatusText(cardKey: string): {
  box: number;
  label: string;
  badgeColor: string;
  dueText: string;
  againCount: number;
  reviewCount: number;
} {
  const data = loadSRSData();
  const item = data[cardKey];

  if (!item) {
    return {
      box: 1,
      label: "بطاقة جديدة (لم تُراجع)",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      dueText: "جاهزة للمراجعة الأولى",
      againCount: 0,
      reviewCount: 0,
    };
  }

  const now = Date.now();
  const isDueNow = now >= item.nextReviewDate;

  let label = "";
  let badgeColor = "";

  switch (item.box) {
    case 1:
      label = "صندوق 1 (صعبة / تكرار مكثف)";
      badgeColor = "bg-rose-500/20 text-rose-300 border-rose-500/30";
      break;
    case 2:
      label = "صندوق 2 (مراجعة بعد 3 أيام)";
      badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
      break;
    case 3:
      label = "صندوق 3 (مراجعة بعد 7 أيام)";
      badgeColor = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      break;
    case 4:
      label = "صندوق 4 (مراجعة بعد 14 يوماً)";
      badgeColor = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      break;
    case 5:
      label = "صندوق 5 (ذاكرة دائمة / 30 يوماً)";
      badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      break;
    default:
      label = `صندوق ${item.box}`;
      badgeColor = "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }

  let dueText = "";
  if (isDueNow) {
    dueText = "مستحقة للمراجعة الآن ⏰";
  } else {
    const diffHours = Math.max(1, Math.round((item.nextReviewDate - now) / (1000 * 3600)));
    if (diffHours < 24) {
      dueText = `بعد ${diffHours} ساعة`;
    } else {
      const diffDays = Math.round(diffHours / 24);
      dueText = `بعد ${diffDays} يوم`;
    }
  }

  return {
    box: item.box,
    label,
    badgeColor,
    dueText,
    againCount: item.againCount,
    reviewCount: item.reviewCount,
  };
}

export function getOverallSRSStats(allCardKeys: string[]): {
  dueCount: number;
  boxDistribution: Record<number, number>;
  totalReviewed: number;
  hardCardsCount: number;
} {
  const data = loadSRSData();
  const now = Date.now();
  let dueCount = 0;
  let hardCardsCount = 0;
  let totalReviewed = 0;
  const boxDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  allCardKeys.forEach((key) => {
    const item = data[key];
    if (item) {
      totalReviewed++;
      boxDistribution[item.box] = (boxDistribution[item.box] || 0) + 1;
      if (now >= item.nextReviewDate || item.box === 1) {
        dueCount++;
      }
      if (item.againCount > 0 || item.box === 1) {
        hardCardsCount++;
      }
    } else {
      // Unreviewed cards are due for first review
      dueCount++;
      boxDistribution[1] = (boxDistribution[1] || 0) + 1;
    }
  });

  return { dueCount, boxDistribution, totalReviewed, hardCardsCount };
}

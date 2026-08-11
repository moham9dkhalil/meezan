import * as XLSX from "xlsx";

// ============================================================================
// مهام النسخ الاحتياطي والاستعادة
// كل المفاتيح هنا تطابق المفاتيح الفعلية التي يكتبها التطبيق (meezan_*).
// لا يزال هناك دعم قراءة/استيراد للمفاتيح القديمة (mizan_*) للتوافق مع نسخ سابقة.
// ============================================================================

export interface BackupData {
  version: string;
  exportDate: string;
  totalXp: number;
  streak: number;
  userProfile: any;
  completedLessons: string[];
  lessonNotes: Record<string, string>;
  srsData: Record<string, any>;
  masteredAccountingCards: string[];
  accountingCardsXp: number;
  masteredLessonCards: string[];
  unlockedBadges: string[];
  quizHistory: any[];
  quizWeaknessTopics: any[];
  stageMasteredQuestions: any[];
  dailyChallengesCount: number;
  dailySolvedDate: string;
  solvedLabEntriesCount: number;
  preferredTrack: string;
  glossaryFavs: string[];
  dictionaryBookmarks: string[];
  courseTopicNotes: Record<string, string>;
  completedCourseTopics: string[];
  bookmarkedCourseTopics: string[];
  userGeneralNotes: string;
  communityQuestions: any[];
  communityNotifications: any[];
  reviews: any[];
}

const APP_KEYS: (keyof BackupData)[] = [
  "totalXp",
  "streak",
  "userProfile",
  "completedLessons",
  "lessonNotes",
  "srsData",
  "masteredAccountingCards",
  "accountingCardsXp",
  "masteredLessonCards",
  "unlockedBadges",
  "quizHistory",
  "quizWeaknessTopics",
  "stageMasteredQuestions",
  "dailyChallengesCount",
  "dailySolvedDate",
  "solvedLabEntriesCount",
  "preferredTrack",
  "glossaryFavs",
  "dictionaryBookmarks",
  "courseTopicNotes",
  "completedCourseTopics",
  "bookmarkedCourseTopics",
  "userGeneralNotes",
  "communityQuestions",
  "communityNotifications",
  "reviews"
];

// Mapping: key in the backup object -> localStorage key read/written by the app.
// Legacy mizan_* keys are read as fallback during export and migrated on restore.
const KEY_MAP: Record<string, { read: string[]; write: string }> = {
  totalXp: { read: ["meezan_user_xp", "mizan_total_xp"], write: "meezan_user_xp" },
  streak: { read: ["meezan_daily_streak"], write: "meezan_daily_streak" },
  userProfile: { read: ["meezan_auth_user", "mizan_user_profile"], write: "meezan_auth_user" },
  completedLessons: { read: ["meezan_completed_lessons", "mizan_completed_lessons"], write: "meezan_completed_lessons" },
  lessonNotes: { read: ["meezan_lesson_notes", "mizan_lesson_notes"], write: "meezan_lesson_notes" },
  srsData: { read: ["mizan_srs_data_v1"], write: "mizan_srs_data_v1" },
  masteredAccountingCards: { read: ["accounting_mastered_cards"], write: "accounting_mastered_cards" },
  accountingCardsXp: { read: ["accounting_cards_xp"], write: "accounting_cards_xp" },
  masteredLessonCards: { read: ["meezan_mastered_lesson_cards"], write: "meezan_mastered_lesson_cards" },
  unlockedBadges: { read: ["meezan_unlocked_badges"], write: "meezan_unlocked_badges" },
  quizHistory: { read: ["meezan_quiz_history_logs", "mizan_quiz_scores"], write: "meezan_quiz_history_logs" },
  quizWeaknessTopics: { read: ["meezan_quiz_weakness_topics"], write: "meezan_quiz_weakness_topics" },
  stageMasteredQuestions: { read: ["mizan_stage_mastered_q"], write: "mizan_stage_mastered_q" },
  dailyChallengesCount: { read: ["meezan_daily_challenges_count"], write: "meezan_daily_challenges_count" },
  dailySolvedDate: { read: ["meezan_daily_solved_date"], write: "meezan_daily_solved_date" },
  solvedLabEntriesCount: { read: ["meezan_solved_lab_entries_count"], write: "meezan_solved_lab_entries_count" },
  preferredTrack: { read: ["meezan_preferred_track"], write: "meezan_preferred_track" },
  glossaryFavs: { read: ["meezan_glossary_favs"], write: "meezan_glossary_favs" },
  dictionaryBookmarks: { read: ["meezan_dictionary_bookmarks"], write: "meezan_dictionary_bookmarks" },
  courseTopicNotes: { read: ["meezan_course_topic_notes"], write: "meezan_course_topic_notes" },
  completedCourseTopics: { read: ["meezan_completed_course_topics"], write: "meezan_completed_course_topics" },
  bookmarkedCourseTopics: { read: ["meezan_bookmarked_course_topics"], write: "meezan_bookmarked_course_topics" },
  userGeneralNotes: { read: ["meezan_user_general_notes"], write: "meezan_user_general_notes" },
  communityQuestions: { read: ["meezan_community_questions"], write: "meezan_community_questions" },
  communityNotifications: { read: ["meezan_community_notifications"], write: "meezan_community_notifications" },
  reviews: { read: ["meezan_reviews"], write: "meezan_reviews" }
};

function readJson(key: string): any {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readField(reads: string[], fallback: any): any {
  for (const key of reads) {
    const value = readJson(key);
    if (value !== null && value !== undefined) return value;
  }
  return fallback;
}

function writeField(writeKey: string, raw: any, fallback: any): boolean {
  const value = raw !== undefined && raw !== null && raw !== "" ? raw : fallback;
  if (value === undefined || value === null) return false;
  try {
    localStorage.setItem(writeKey, typeof value === "string" ? value : JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function generateBackupJSON(): BackupData {
  const empty = () => ({});

  return {
    version: "2.1.0",
    exportDate: new Date().toISOString(),
    totalXp: Number(readField(KEY_MAP.totalXp.read, 0)) || 0,
    streak: Number(readField(KEY_MAP.streak.read, 0)) || 0,
    userProfile: readField(KEY_MAP.userProfile.read, null),
    completedLessons: readField(KEY_MAP.completedLessons.read, []),
    lessonNotes: readField(KEY_MAP.lessonNotes.read, empty()) || {},
    srsData: readField(KEY_MAP.srsData.read, empty()) || {},
    masteredAccountingCards: readField(KEY_MAP.masteredAccountingCards.read, []),
    accountingCardsXp: Number(readField(KEY_MAP.accountingCardsXp.read, 0)) || 0,
    masteredLessonCards: readField(KEY_MAP.masteredLessonCards.read, []),
    unlockedBadges: readField(KEY_MAP.unlockedBadges.read, []),
    quizHistory: readField(KEY_MAP.quizHistory.read, []),
    quizWeaknessTopics: readField(KEY_MAP.quizWeaknessTopics.read, []),
    stageMasteredQuestions: readField(KEY_MAP.stageMasteredQuestions.read, []),
    dailyChallengesCount: Number(readField(KEY_MAP.dailyChallengesCount.read, 0)) || 0,
    dailySolvedDate: readField(KEY_MAP.dailySolvedDate.read, "") || "",
    solvedLabEntriesCount: Number(readField(KEY_MAP.solvedLabEntriesCount.read, 0)) || 0,
    preferredTrack: readField(KEY_MAP.preferredTrack.read, "") || "",
    glossaryFavs: readField(KEY_MAP.glossaryFavs.read, []),
    dictionaryBookmarks: readField(KEY_MAP.dictionaryBookmarks.read, []),
    courseTopicNotes: readField(KEY_MAP.courseTopicNotes.read, empty()) || {},
    completedCourseTopics: readField(KEY_MAP.completedCourseTopics.read, []),
    bookmarkedCourseTopics: readField(KEY_MAP.bookmarkedCourseTopics.read, []),
    userGeneralNotes: readField(KEY_MAP.userGeneralNotes.read, "") || "",
    communityQuestions: readField(KEY_MAP.communityQuestions.read, []),
    communityNotifications: readField(KEY_MAP.communityNotifications.read, []),
    reviews: readField(KEY_MAP.reviews.read, [])
  };
}

export function downloadBackupJSON(): void {
  const data = generateBackupJSON();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = `meezan_accounting_backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadBackupExcel(): void {
  const backup = generateBackupJSON();
  const wb = XLSX.utils.book_new();

  const summaryData = [
    { Parameter: "تاريخ التصدير", Value: new Date().toLocaleString("ar-SA") },
    { Parameter: "مجموع نقاط الخبرة (XP)", Value: backup.totalXp },
    { Parameter: "سلسلة الأيام المتتالية", Value: backup.streak },
    { Parameter: "عدد الدروس المكتملة", Value: (backup.completedLessons || []).length },
    { Parameter: "عدد الملاحظات المحفوظة", Value: Object.keys(backup.lessonNotes || {}).length },
    { Parameter: "عدد بطاقات التكرار المتباعد", Value: Object.keys(backup.srsData || {}).length },
    { Parameter: "عدد الشارات المكتسبة", Value: (backup.unlockedBadges || []).length },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "الملخص");

  if (backup.lessonNotes && Object.keys(backup.lessonNotes).length > 0) {
    const notesArr = Object.entries(backup.lessonNotes).map(([lessonKey, note]) => ({
      "معرف الدرس": lessonKey,
      "ملاحظات المحاسب": note,
    }));
    const wsNotes = XLSX.utils.json_to_sheet(notesArr);
    XLSX.utils.book_append_sheet(wb, wsNotes, "ملاحظات الدروس");
  }

  if (backup.srsData && Object.keys(backup.srsData).length > 0) {
    const srsArr = Object.values(backup.srsData).map((item: any) => ({
      "مفتاح البطاقة": item.cardKey,
      "الصندوق (1-5)": item.box,
      "أيام الفاصل": item.intervalDays,
      "تاريخ المراجعة القادمة": item.nextReviewDate ? new Date(item.nextReviewDate).toLocaleDateString("ar-SA") : "",
      "عدد التكرارات": item.reviewCount,
      "عدد مرات الصعوبة": item.againCount,
    }));
    const wsSRS = XLSX.utils.json_to_sheet(srsArr);
    XLSX.utils.book_append_sheet(wb, wsSRS, "التكرار المتباعد");
  }

  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `meezan_accounting_data_${dateStr}.xlsx`);
}

export function restoreBackupFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== "object") {
      return { success: false, message: "ملف التنسيق غير صالح." };
    }

    let restoredCount = 0;
    for (const field of APP_KEYS) {
      const map = KEY_MAP[field];
      if (!map) continue;
      if (writeField(map.write, data[field], null)) restoredCount += 1;
    }

    // Migrate legacy-only keys that the user might have exported with mizan_ name
    const legacyOnly = ["mizan_user_profile", "mizan_total_xp", "mizan_completed_lessons", "mizan_lesson_notes", "mizan_quiz_scores", "mizan_mastered_flashcards", "mizan_unlocked_achievements"];
    for (const legacy of legacyOnly) {
      try {
        const raw = localStorage.getItem(legacy);
        if (raw) {
          localStorage.removeItem(legacy);
          restoredCount += 1;
        }
      } catch {
        // ignore
      }
    }

    return {
      success: true,
      message: `تمت استعادة ${restoredCount} مجموعة بيانات بنجاح! 🎉`,
    };
  } catch (e: any) {
    return { success: false, message: `فشل استيراد البيانات: ${e?.message || "ملف غير صالح"}` };
  }
}
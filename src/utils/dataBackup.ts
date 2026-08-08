import * as XLSX from "xlsx";

export interface MizanBackupData {
  version: string;
  exportDate: string;
  totalXp: number;
  userProfile?: any;
  lessonNotes?: Record<string, string>;
  srsData?: Record<string, any>;
  masteredFlashcards?: string[];
  completedLessons?: string[];
  quizHistory?: any[];
  budgetData?: any;
}

const STORAGE_KEYS = [
  "mizan_user_profile",
  "mizan_total_xp",
  "mizan_mastered_flashcards",
  "mizan_lesson_notes",
  "mizan_srs_data_v1",
  "mizan_unlocked_achievements",
  "mizan_budget_data",
  "mizan_quiz_scores",
  "mizan_completed_lessons"
];

export function generateBackupJSON(): MizanBackupData {
  const getItem = (k: string) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const totalXp = Number(localStorage.getItem("mizan_total_xp") || "0");

  return {
    version: "2.0.0",
    exportDate: new Date().toISOString(),
    totalXp,
    userProfile: getItem("mizan_user_profile"),
    lessonNotes: getItem("mizan_lesson_notes") || {},
    srsData: getItem("mizan_srs_data_v1") || {},
    masteredFlashcards: getItem("mizan_mastered_flashcards") || [],
    completedLessons: getItem("mizan_completed_lessons") || [],
    quizHistory: getItem("mizan_quiz_scores") || [],
    budgetData: getItem("mizan_budget_data") || null,
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
  link.download = `mizan_accounting_backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadBackupExcel(): void {
  const backup = generateBackupJSON();
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    { Parameter: "تاريخ التصدير", Value: new Date().toLocaleString("ar-SA") },
    { Parameter: "مجموع نقاط الخبرة (XP)", Value: backup.totalXp },
    { Parameter: "عدد الملاحظات المحفوظة", Value: Object.keys(backup.lessonNotes || {}).length },
    { Parameter: "عدد بطاقات التكرار المتباعد", Value: Object.keys(backup.srsData || {}).length },
    { Parameter: "عدد البطاقات المتقنة", Value: (backup.masteredFlashcards || []).length },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "الملخص");

  // Notes Sheet
  if (backup.lessonNotes && Object.keys(backup.lessonNotes).length > 0) {
    const notesArr = Object.entries(backup.lessonNotes).map(([lessonKey, note]) => ({
      "معرف الدرس": lessonKey,
      "ملاحظات المحاسب": note,
    }));
    const wsNotes = XLSX.utils.json_to_sheet(notesArr);
    XLSX.utils.book_append_sheet(wb, wsNotes, "ملاحظات الدروس");
  }

  // SRS Cards Sheet
  if (backup.srsData && Object.keys(backup.srsData).length > 0) {
    const srsArr = Object.values(backup.srsData).map((item: any) => ({
      "مفتاح البطاقة": item.cardKey,
      "الصندوق (1-5)": item.box,
      "أيام الفاصل": item.intervalDays,
      "تاريخ المراجعة القادمة": new Date(item.nextReviewDate).toLocaleDateString("ar-SA"),
      "عدد التكرارات": item.reviewCount,
      "عدد مرات الصعوبة": item.againCount,
    }));
    const wsSRS = XLSX.utils.json_to_sheet(srsArr);
    XLSX.utils.book_append_sheet(wb, wsSRS, "التكرار المتباعد");
  }

  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `mizan_accounting_data_${dateStr}.xlsx`);
}

export function restoreBackupFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const data: MizanBackupData = JSON.parse(jsonString);

    if (!data || typeof data !== "object") {
      return { success: false, message: "ملف التنسيق غير صالح." };
    }

    if (data.totalXp !== undefined) {
      localStorage.setItem("mizan_total_xp", data.totalXp.toString());
    }
    if (data.userProfile) {
      localStorage.setItem("mizan_user_profile", JSON.stringify(data.userProfile));
    }
    if (data.lessonNotes) {
      localStorage.setItem("mizan_lesson_notes", JSON.stringify(data.lessonNotes));
    }
    if (data.srsData) {
      localStorage.setItem("mizan_srs_data_v1", JSON.stringify(data.srsData));
    }
    if (data.masteredFlashcards) {
      localStorage.setItem("mizan_mastered_flashcards", JSON.stringify(data.masteredFlashcards));
    }
    if (data.completedLessons) {
      localStorage.setItem("mizan_completed_lessons", JSON.stringify(data.completedLessons));
    }
    if (data.quizHistory) {
      localStorage.setItem("mizan_quiz_scores", JSON.stringify(data.quizHistory));
    }
    if (data.budgetData) {
      localStorage.setItem("mizan_budget_data", JSON.stringify(data.budgetData));
    }

    return { success: true, message: "تمت استعادة كافة البيانات والملاحظات وسجل التعلم بنجاح! 🎉" };
  } catch (e: any) {
    return { success: false, message: `فشل استيراد البيانات: ${e.message}` };
  }
}

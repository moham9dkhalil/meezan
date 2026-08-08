export type ActiveTab =
  | "hero"
  | "features"
  | "path"
  | "lessonView"
  | "smartQuizzes"
  | "socpaExam"
  | "community"
  | "courses"
  | "stageFlashcards"
  | "flashcards"
  | "glossary"
  | "lab"
  | "odooJournal"
  | "tools"
  | "taxGuide"
  | "appDownload"
  | "library"
  | "excel"
  | "ai"
  | "testimonials"
  | "profile";

export interface StageLesson {
  title: string;
  body: string;
  keys: string[];
  exLabel?: string;
  exText?: string;
}

export interface Stage {
  id: number;
  icon: string;
  color: string;
  name: string;
  sub: string;
  level: number;
  levelBadge: string;
  levelColor: string;
  xp: number;
  questions: number;
  durationMinutes: number;
  lessons: StageLesson[];
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export interface CourseTopic {
  id: string;
  title: string;
  sub: string;
  formula?: string;
  content: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  sub: string;
  icon: string;
  topics: CourseTopic[];
}

export interface CoursePracticalBenefit {
  careerImpact: string;
  practicalSkills: string[];
  targetRoles: string[];
  salaryImpact?: string;
}

export interface CourseExamStrategy {
  studyHours: string;
  passRate: string;
  passStrategySteps: string[];
  examFormat: string;
}

export interface CourseCertificationGuide {
  grantingBody: string;
  registrationSteps: string[];
  examCenters: string;
  requirements: string[];
}

export interface Course {
  id: string;
  cat: string;
  name: string;
  org: string;
  icon: string;
  diff: string;
  rating: number;
  students: string;
  desc: string;
  grad: string;
  modules: CourseModule[];
  practicalBenefit?: CoursePracticalBenefit;
  examStrategy?: CourseExamStrategy;
  certificationGuide?: CourseCertificationGuide;
}

export interface FlashcardTerm {
  ar: string;
  en: string;
  hint?: string;
}

export interface FlashCard {
  ar: string;
  en: string;
  cat: string;
  hint?: string;
  answer?: string;
  exText?: string;
  stageId?: number;
}

export interface FlashcardCategory {
  cat: string;
  color: string;
  terms: FlashcardTerm[];
}

export interface LabEntryItem {
  acc: string;
  amt: number | "";
}

export interface LabScenario {
  id: string;
  title: string;
  desc: string;
  category?: string;
  difficulty?: "مبتدئ" | "متوسط" | "متقدم";
  explanation?: string;
  hint?: string;
  answer: {
    debit: { acc: string; amt: number }[];
    credit: { acc: string; amt: number }[];
  };
}

export interface BookChapter {
  t: string;
  sections: string[];
}

export interface Book {
  icon: string;
  title: string;
  sub: string;
  chapters: BookChapter[];
  category?: string;
  spineColor?: string;
  accentColor?: string;
  foilColor?: string;
  heightPx?: number;
  thicknessPx?: number;
  callNumber?: string;
}

export interface Review {
  id: string;
  stars: number;
  name: string;
  role: string;
  text: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  image?: {
    url: string;
    mimeType: string;
    data: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  xp: number;
  streak: number;
  joinedDate: string;
  isLoggedIn: boolean;
  savedCourses?: string[];
  completedStages?: number[];
  unlockedBadges?: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "lesson" | "lab" | "challenge" | "xp" | "streak";
  xpReward: number;
  condition: string;
  unlockedAt?: string;
}

export interface AchievementState {
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  unlockedBadgeIds: string[];
  completedLessonsCount: number;
  solvedLabEntriesCount: number;
  dailyChallengesSolvedCount: number;
}

export interface AccountingTerm {
  term: string;
  aliases?: string[];
  definition: string;
  example?: string;
  category: "محاسبة مالية" | "محاسبة إدارية" | "معايير دولية" | "أساسيات المحاسبة" | "قيود وتسويات" | "تكاليف ومراجعة" | "ضرائب وزكاة" | string;
  formula?: string;
  journalEntry?: string;
  relatedTerms?: string[];
}


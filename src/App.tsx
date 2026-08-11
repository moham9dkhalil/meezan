import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { ActiveTab, Book, UserProfile, Badge } from "./types";
import { ParticlesBg } from "./components/ParticlesBg";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { DailyChallengeSection } from "./components/DailyChallengeSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { AppDownloadSection } from "./components/AppDownloadSection";
import { GamificationToast, GamificationToastEvent } from "./components/GamificationToast";
import { checkNewlyUnlockedBadges } from "./data/achievements";
import { Language, getSavedLanguage, applyLanguageSettings } from "./data/translations";
import { getToken, setToken, fetchMe, fetchSync, pushSync, CloudSyncState } from "./utils/cloudSync";
import { ArrowUp, Smartphone, Download, Loader2 } from "lucide-react";

// Code-split all heavy screens & modals so only the section the user opens is loaded.
const PathSection = lazy(() => import("./components/PathSection").then((m) => ({ default: m.PathSection })));
const AccountingSectorsSection = lazy(() => import("./components/AccountingSectorsSection").then((m) => ({ default: m.AccountingSectorsSection })));
const SectorDetailSection = lazy(() => import("./components/SectorDetailSection").then((m) => ({ default: m.SectorDetailSection })));
const InterviewQuestionsSection = lazy(() => import("./components/InterviewQuestionsSection").then((m) => ({ default: m.InterviewQuestionsSection })));
const AccountingStandardsSection = lazy(() => import("./components/AccountingStandardsSection").then((m) => ({ default: m.AccountingStandardsSection })));
const CoursesSection = lazy(() => import("./components/CoursesSection").then((m) => ({ default: m.CoursesSection })));
const FlashcardsSection = lazy(() => import("./components/FlashcardsSection").then((m) => ({ default: m.FlashcardsSection })));
const GlossarySection = lazy(() => import("./components/GlossarySection").then((m) => ({ default: m.GlossarySection })));
const StageFlashcardsSection = lazy(() => import("./components/StageFlashcardsSection").then((m) => ({ default: m.StageFlashcardsSection })));
const LabSection = lazy(() => import("./components/LabSection").then((m) => ({ default: m.LabSection })));
const OdooJournalEntrySection = lazy(() => import("./components/OdooJournalEntrySection").then((m) => ({ default: m.OdooJournalEntrySection })));
const ToolsSection = lazy(() => import("./components/ToolsSection").then((m) => ({ default: m.ToolsSection })));
const TaxGuideSection = lazy(() => import("./components/TaxGuideSection").then((m) => ({ default: m.TaxGuideSection })));
const AppDownloadModal = lazy(() => import("./components/AppDownloadModal").then((m) => ({ default: m.AppDownloadModal })));
const LibrarySection = lazy(() => import("./components/LibrarySection").then((m) => ({ default: m.LibrarySection })));
const ExcelSection = lazy(() => import("./components/ExcelSection").then((m) => ({ default: m.ExcelSection })));
const AiAssistantSection = lazy(() => import("./components/AiAssistantSection").then((m) => ({ default: m.AiAssistantSection })));
const TestimonialsSection = lazy(() => import("./components/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })));
const LessonDetailSection = lazy(() => import("./components/LessonDetailSection").then((m) => ({ default: m.LessonDetailSection })));
const SmartQuizzesSection = lazy(() => import("./components/SmartQuizzesSection").then((m) => ({ default: m.SmartQuizzesSection })));
const CommunitySection = lazy(() => import("./components/CommunitySection").then((m) => ({ default: m.CommunitySection })));
const BookReaderModal = lazy(() => import("./components/BookReaderModal").then((m) => ({ default: m.BookReaderModal })));
const AuthModal = lazy(() => import("./components/AuthModal").then((m) => ({ default: m.AuthModal })));
const UserProfileSection = lazy(() => import("./components/UserProfileSection").then((m) => ({ default: m.UserProfileSection })));
const StudyTimerSection = lazy(() => import("./components/StudyTimerSection").then((m) => ({ default: m.StudyTimerSection })));
const AchievementsModal = lazy(() => import("./components/AchievementsModal").then((m) => ({ default: m.AchievementsModal })));
const CertificateModal = lazy(() => import("./components/CertificateModal").then((m) => ({ default: m.CertificateModal })));
const DataBackupModal = lazy(() => import("./components/DataBackupModal").then((m) => ({ default: m.DataBackupModal })));
const SocpaExamSimulator = lazy(() => import("./components/SocpaExamSimulator").then((m) => ({ default: m.SocpaExamSimulator })));

function SectionFallback() {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
      <span className="text-xs font-bold text-slate-400">سيتم تحميل القسم...</span>
    </div>
  );
}

const ModalFallback = () => null;

interface AppHistoryState {
  tab: ActiveTab;
  sectorId?: string;
  stageId?: number;
  lessonIdx?: number;
  lessonTab?: "read" | "flashcards" | "quiz" | "notes" | "ai";
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");
  const [selectedSectorId, setSelectedSectorId] = useState<string>("contracting");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [dataBackupModalOpen, setDataBackupModalOpen] = useState(false);
  const [isFocusReadingMode, setIsFocusReadingMode] = useState(false);

  // Language state
  const [language, setLanguage] = useState<Language>(() => getSavedLanguage());
  const isEn = language === "en";

  useEffect(() => {
    applyLanguageSettings(language);
  }, [language]);

  // User Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("meezan_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dark / Light Theme State with LocalStorage Persistence
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("meezan_theme");
      return saved === "light" || saved === "dark" ? saved : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("meezan_theme", theme);
      if (theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
        document.body.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.classList.remove("light");
      }
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");

  // Lesson modal state
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [initialLessonTab, setInitialLessonTab] = useState<"read" | "flashcards" | "quiz" | "notes" | "ai">("read");
  const [selectedFlashcardStageId, setSelectedFlashcardStageId] = useState<number | null>(null);

  // Book reader modal state
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Gamification & Achievements state
  const [userXP, setUserXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("meezan_user_xp");
      if (saved) return parseInt(saved, 10);
      const savedUser = localStorage.getItem("meezan_auth_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.xp || 150;
      }
      return 150;
    } catch {
      return 150;
    }
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_unlocked_badges");
      return saved ? JSON.parse(saved) : ["b_first_lesson"];
    } catch {
      return ["b_first_lesson"];
    }
  });

  const [solvedLabEntries, setSolvedLabEntries] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("meezan_solved_lab_entries_count");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [dailyChallengesSolved, setDailyChallengesSolved] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("meezan_daily_challenges_count");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("meezan_daily_streak");
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [achievementsModalOpen, setAchievementsModalOpen] = useState<boolean>(false);
  const [toastEvent, setToastEvent] = useState<GamificationToastEvent | null>(null);

  // Throttled best-effort cloud sync of the user's progress
  const lastCloudPushAt = useRef(0);
  const pushCloudState = (xp: number, streak: number) => {
    const token = getToken();
    if (!token) return;
    const now = Date.now();
    if (now - lastCloudPushAt.current < 15000) return;
    lastCloudPushAt.current = now;
    pushSync({ savedAt: new Date().toISOString(), xp, streak }, token).catch(() => {
      // offline/cloud failure: local progress stays authoritative until next sync
    });
  };

  const awardXPAndCheckBadges = (
    amount: number,
    title: string,
    message: string,
    type: "xp" | "challenge",
    statsIncrement?: {
      completedLessons?: boolean;
      labEntrySolved?: boolean;
      dailyChallengeSolved?: boolean;
    }
  ) => {
    const newXP = userXP + amount;
    setUserXP(newXP);
    try {
      localStorage.setItem("meezan_user_xp", newXP.toString());
    } catch {
      // ignore
    }
    pushCloudState(newXP, streakCount);

    if (currentUser) {
      const updatedUser = { ...currentUser, xp: newXP };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("meezan_auth_user", JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
    }

    let completedLessonsArr: string[] = [];
    try {
      const saved = localStorage.getItem("meezan_completed_lessons");
      completedLessonsArr = saved ? JSON.parse(saved) : [];
    } catch {}

    let newLabEntriesCount = solvedLabEntries;
    let newDailyCount = dailyChallengesSolved;

    if (statsIncrement?.labEntrySolved) {
      newLabEntriesCount += 1;
      setSolvedLabEntries(newLabEntriesCount);
      try {
        localStorage.setItem("meezan_solved_lab_entries_count", newLabEntriesCount.toString());
      } catch {}
    }

    if (statsIncrement?.dailyChallengeSolved) {
      newDailyCount += 1;
      setDailyChallengesSolved(newDailyCount);
      try {
        localStorage.setItem("meezan_daily_challenges_count", newDailyCount.toString());
      } catch {}
    }

    const newlyUnlocked = checkNewlyUnlockedBadges(unlockedBadges, {
      completedLessonsCount: completedLessonsArr.length,
      solvedLabEntriesCount: newLabEntriesCount,
      dailyChallengesSolvedCount: newDailyCount,
      streakCount,
      xp: newXP
    });

    if (newlyUnlocked.length > 0) {
      const newBadgeIds = [...unlockedBadges, ...newlyUnlocked.map((b) => b.id)];
      setUnlockedBadges(newBadgeIds);
      try {
        localStorage.setItem("meezan_unlocked_badges", JSON.stringify(newBadgeIds));
      } catch {}

      const firstBadge = newlyUnlocked[0];
      setToastEvent({
        id: Date.now().toString(),
        type: "badge",
        title: `فتح شارة جديدة: ${firstBadge.title}`,
        message: firstBadge.description,
        xpAmount: amount + firstBadge.xpReward,
        badge: firstBadge
      });
    } else {
      setToastEvent({
        id: Date.now().toString(),
        type,
        title,
        message,
        xpAmount: amount
      });
    }
  };

  // Auth Handlers
  const handleOpenAuth = (mode: "LOGIN" | "SIGNUP" = "LOGIN") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile, token?: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("meezan_auth_user", JSON.stringify(user));
    } catch {
      // ignore
    }
    if (token) setToken(token);
    setUserXP(user.xp || 0);
    setStreakCount(user.streak || 0);

    // Pull the user's cloud-saved progress the moment they sign in
    const savedToken = token || getToken();
    if (savedToken) {
      fetchSync(savedToken)
        .catch(() => ({ state: null }))
        .then(({ state }) => {
          if (state) adoptCloudState(state);
        });
    }
  };

  const adoptCloudState = (state: CloudSyncState) => {
    if (typeof state.xp === "number" && Number.isFinite(state.xp)) {
      setUserXP(state.xp);
      try {
        localStorage.setItem("meezan_user_xp", state.xp.toString());
      } catch {}
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, xp: state.xp };
        try {
          localStorage.setItem("meezan_auth_user", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
    if (typeof state.streak === "number" && Number.isFinite(state.streak)) {
      setStreakCount(state.streak);
      try {
        localStorage.setItem("meezan_daily_streak", state.streak.toString());
      } catch {}
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    try {
      localStorage.removeItem("meezan_auth_user");
    } catch {
      // ignore
    }
  };

  // Restore/validate a cloud session on first load when a token exists
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    fetchMe(token)
      .then(({ user }) => {
        if (cancelled) return;
        setCurrentUser(user);
        setUserXP(user.xp || 0);
        setStreakCount(user.streak || 0);
        try {
          localStorage.setItem("meezan_auth_user", JSON.stringify(user));
        } catch {}
        return fetchSync(token).catch(() => ({ state: null }));
      })
      .then((sync) => {
        if (cancelled || !sync) return;
        if (sync.state) adoptCloudState(sync.state);
      })
      .catch(() => {
        // token invalid/expired → clear the broken session
        setCurrentUser(null);
        setToken(null);
        try {
          localStorage.removeItem("meezan_auth_user");
        } catch {}
      });
    return () => {
      cancelled = true;
    };
  }, []);


  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (tab: ActiveTab, extra?: Omit<AppHistoryState, "tab">) => {
    if (tab === activeTab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState({ tab, ...extra } as AppHistoryState, "");
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTab = (tab: ActiveTab) => {
    navigateTo(tab);
  };

  // Browser history integration: push an entry per screen so the browser
  // Back button returns to the screen the user was on before.
  useEffect(() => {
    window.history.pushState({ tab: "hero" }, "");
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as AppHistoryState | null;
      if (!state || !state.tab) return;
      if (state.sectorId !== undefined) setSelectedSectorId(state.sectorId);
      if (state.stageId !== undefined) setSelectedStageId(state.stageId);
      if (state.lessonIdx !== undefined) setActiveLessonIdx(state.lessonIdx);
      if (state.lessonTab) setInitialLessonTab(state.lessonTab);
      setIsFocusReadingMode(false);
      setActiveTab(state.tab);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpenSector = (sectorId: string) => {
    window.history.pushState({ tab: "sectorDetail", sectorId }, "");
    setSelectedSectorId(sectorId);
    setActiveTab("sectorDetail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenStage = (
    stageId: number,
    lessonIndex: number = 0,
    tab: "read" | "flashcards" | "quiz" | "notes" | "ai" = "read"
  ) => {
    window.history.pushState({ tab: "lessonView", stageId, lessonIdx: lessonIndex, lessonTab: tab }, "");
    setSelectedStageId(stageId);
    setActiveLessonIdx(lessonIndex);
    setInitialLessonTab(tab);
    setActiveTab("lessonView");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseBookModal = () => {
    setSelectedBook(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#080C1C] text-[#F3F4F6] relative pb-12 selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Dynamic Background Particles */}
      <ParticlesBg />

      {/* Ambient Radial Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-ambient-gradient opacity-90" />

      {/* Top Glass Navbar */}
      {!isFocusReadingMode && (
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onOpenDownloadModal={() => setDownloadModalOpen(true)}
          xp={userXP}
          streak={streakCount}
          onOpenAchievements={() => setAchievementsModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          appLanguage={language}
        />
      )}


      {/* Main Content Area */}
      <main className="relative z-10">
        <Suspense fallback={<SectionFallback />}>
        {(activeTab === "hero" || activeTab === "features" || activeTab === "testimonials") && (
          <div className="space-y-12">
            <HeroSection
              onSelectTab={handleSelectTab}
              onOpenStage={handleOpenStage}
              onOpenDownloadModal={() => setDownloadModalOpen(true)}
              onOpenSector={handleOpenSector}
              appLanguage={language}
            />
            <DailyChallengeSection
              appLanguage={language}
              onSolveChallenge={(xpReward) =>
                awardXPAndCheckBadges(
                  xpReward || 50,
                  "إنجاز التحدي اليومي!",
                  "نجحت في إجابة سؤال اليوم المحاسبي السريع بنجاح",
                  "challenge",
                  { dailyChallengeSolved: true }
                )
              }
            />
            <div id="features-section">
              <FeaturesSection onSelectTab={handleSelectTab} appLanguage={language} />
            </div>

            {/* Mobile App Download Banner Section on Home */}
            <AppDownloadSection
              onOpenDownloadModal={() => setDownloadModalOpen(true)}
              onSelectTab={handleSelectTab}
              appLanguage={language}
            />

            <div id="testimonials-section">
              <TestimonialsSection appLanguage={language} />
            </div>
          </div>
        )}

        {activeTab === "appDownload" && (
          <AppDownloadSection
            onOpenDownloadModal={() => setDownloadModalOpen(true)}
            onSelectTab={handleSelectTab}
            appLanguage={language}
          />
        )}

        {activeTab === "path" && (
          <PathSection
            onOpenStage={handleOpenStage}
            onOpenFlashcards={(stageId) => {
              handleOpenStage(stageId || 1, 0, "flashcards");
            }}
            appLanguage={language}
          />
        )}

        {activeTab === "sectors" && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <AccountingSectorsSection
              onSelectTab={handleSelectTab}
              onOpenOdooWithEntry={() => handleSelectTab("odooJournal")}
              onOpenSector={handleOpenSector}
              appLanguage={language}
            />
          </div>
        )}

        {activeTab === "sectorDetail" && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <SectorDetailSection
              sectorId={selectedSectorId}
              onBack={() => handleSelectTab("sectors")}
              onSelectTab={handleSelectTab}
              onOpenOdooWithEntry={() => handleSelectTab("odooJournal")}
              onChangeSector={setSelectedSectorId}
              appLanguage={language}
            />
          </div>
        )}

        {activeTab === "interviewQuestions" && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <InterviewQuestionsSection
              onSelectTab={handleSelectTab}
              appLanguage={language}
            />
          </div>
        )}

        {activeTab === "accountingStandards" && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <AccountingStandardsSection
              onSelectTab={handleSelectTab}
              appLanguage={language}
            />
          </div>
        )}

        {activeTab === "lessonView" && (
          <LessonDetailSection
            stageId={selectedStageId || 1}
            initialLessonIndex={activeLessonIdx}
            initialTab={initialLessonTab}
            onBackToPath={() => {
              setIsFocusReadingMode(false);
              handleSelectTab("path");
            }}
            onSelectStageLesson={(sId, lIdx) => handleOpenStage(sId, lIdx, "read")}
            onFocusModeChange={setIsFocusReadingMode}
            onCompleteLesson={(stageId, lessonIdx, xpReward) =>
              awardXPAndCheckBadges(
                xpReward || 30,
                "إكمال درس محاسبي!",
                "أنجزت قراءة وإكمال درساً تعليمياً متقدماً برحلة التعلم",
                "xp",
                { completedLessons: true }
              )
            }
          />
        )}

        {activeTab === "stageFlashcards" && (
          <StageFlashcardsSection initialStageId={selectedFlashcardStageId || undefined} />
        )}

        {activeTab === "smartQuizzes" && (
          <SmartQuizzesSection
            onAwardXp={(amount, title, message) =>
              awardXPAndCheckBadges(amount, title, message, "xp")
            }
            onSelectTab={handleSelectTab}
            onOpenStage={(sId) => handleOpenStage(sId, 0, "read")}
          />
        )}

        {activeTab === "socpaExam" && (
          <SocpaExamSimulator
            onAwardXp={(amount, title, message) =>
              awardXPAndCheckBadges(amount, title, message, "xp")
            }
          />
        )}

        {activeTab === "community" && (
          <CommunitySection
            currentUser={currentUser}
            onOpenAuth={() => {
              setAuthModalMode("LOGIN");
              setAuthModalOpen(true);
            }}
            onAddXP={(amount, reason) =>
              awardXPAndCheckBadges(amount, "تفاعل مجتمعي!", reason, "xp")
            }
          />
        )}

        {activeTab === "courses" && <CoursesSection />}

        {activeTab === "flashcards" && <FlashcardsSection />}

        {activeTab === "glossary" && <GlossarySection onSelectTab={handleSelectTab} />}

        {activeTab === "lab" && (
          <LabSection
            onSolveLabEntry={(xpReward, title) =>
              awardXPAndCheckBadges(
                xpReward || 50,
                "إتقان قيد محاسبي!",
                `سجلت قيداً متوازناً وصحيحاً بـ LabSection: ${title || ""}`,
                "xp",
                { labEntrySolved: true }
              )
            }
          />
        )}

        {activeTab === "odooJournal" && (
          <OdooJournalEntrySection
            onAwardXp={(amount, title, message) =>
              awardXPAndCheckBadges(
                amount,
                title,
                message,
                "xp",
                { labEntrySolved: true }
              )
            }
          />
        )}

        {activeTab === "tools" && <ToolsSection />}

        {activeTab === "taxGuide" && <TaxGuideSection onSelectTab={handleSelectTab} />}

        {activeTab === "library" && (
          <LibrarySection onOpenBook={handleOpenBook} />
        )}

        {activeTab === "excel" && <ExcelSection />}

        {activeTab === "ai" && <AiAssistantSection />}

        {activeTab === "studyTimer" && <StudyTimerSection />}

        {activeTab === "profile" && (
          <UserProfileSection
            currentUser={currentUser}
            onUpdateUser={handleLoginSuccess}
            onLogout={handleLogout}
            onOpenAuth={handleOpenAuth}
            onSelectTab={handleSelectTab}
            appLanguage={language}
            onLanguageChange={setLanguage}
            onOpenCertificateModal={() => setCertificateModalOpen(true)}
            onOpenDataBackupModal={() => setDataBackupModalOpen(true)}
          />
        )}
        </Suspense>
      </main>

      {/* Footer Branding */}
      {!isFocusReadingMode && (
        <footer className="relative z-10 mt-16 py-8 border-t border-white/10 text-center text-xs font-bold text-gray-400 max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <p className="flex items-center gap-2 text-indigo-300">
              <span>⚖️ {isEn ? "Meezan" : "ميزان"}</span>
              <span>·</span>
              <span>
                {isEn
                  ? "The #1 AI-Powered Accounting Learning Platform"
                  : "منصة تعليم المحاسبة الأولى بالذكاء الاصطناعي"}
              </span>
            </p>
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-all text-xs font-black cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEn ? "Download Mobile App (APK)" : "تنزيل تطبيق الهاتف (APK)"}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400">
            {isEn
              ? `All Rights Reserved © ${new Date().getFullYear()} — Built with premium interface quality`
              : `جميع الحقوق محفوظة © ${new Date().getFullYear()} — صُممت وبُنيت بأعلى معايير جودة الواجهات`}
          </p>
        </footer>
      )}

      {/* Floating Back to Top Button */}
      {!isFocusReadingMode && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-indigo-600/90 border border-indigo-400/40 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer backdrop-blur-md"
          title="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* App Download Modal */}
      <Suspense fallback={<ModalFallback />}>
      <AppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

      {/* Library Book Reader Modal */}
      <BookReaderModal
        book={selectedBook}
        onClose={handleCloseBookModal}
      />

      {/* Auth & User Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        initialMode={authModalMode}
      />

      {/* Gamification Achievements & Daily Challenges Modal */}
      <AchievementsModal
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        xp={userXP}
        streak={streakCount}
        unlockedBadgeIds={unlockedBadges}
        completedLessonsCount={(() => {
          try {
            const saved = localStorage.getItem("meezan_completed_lessons");
            return saved ? JSON.parse(saved).length : 0;
          } catch {
            return 0;
          }
        })()}
        solvedLabEntriesCount={solvedLabEntries}
        dailyChallengesSolvedCount={dailyChallengesSolved}
        onNavigateToTab={(tab) => handleSelectTab(tab)}
      />

      {/* Certificate Generator Modal */}
      <CertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        userName={currentUser?.name || (language === "en" ? "Distinguished Accountant" : "المحاسب المالي المتميز")}
        appLanguage={language}
      />

      {/* Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={dataBackupModalOpen}
        onClose={() => setDataBackupModalOpen(false)}
        appLanguage={language}
      />

      {/* Gamification Notification Toast */}
      <GamificationToast
        event={toastEvent}
        onClose={() => setToastEvent(null)}
      />
      </Suspense>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { FicheGeneratorForm } from "./components/FicheGeneratorForm";
import { FicheViewer } from "./components/FicheViewer";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { SavedFichesModal } from "./components/SavedFichesModal";
import { CurriculumBrowserModal } from "./components/CurriculumBrowserModal";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { PREBUILT_FICHES } from "./data/prebuiltFiches";
import { PedagogicalFiche, MiddleSchoolLevel } from "./types";
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  FileCheck2,
  CheckCircle2,
  Printer,
  Compass,
  ArrowRight,
  Layers,
  BarChart3,
} from "lucide-react";
import { ALGERIAN_LEVELS } from "./data/algerianCurriculum";
import { deserializeFiche } from "./utils/shareUtils";
import { Share2, X, Download } from "lucide-react";

export default function App() {
  const [currentFiche, setCurrentFiche] = useState<PedagogicalFiche | null>(PREBUILT_FICHES[0]);
  const [viewMode, setViewMode] = useState<"form" | "viewer" | "dashboard">("viewer");
  const [savedFiches, setSavedFiches] = useState<PedagogicalFiche[]>([]);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [serverHasKey, setServerHasKey] = useState<boolean>(true);
  const [sharedNotice, setSharedNotice] = useState<{
    title: string;
    subject: string;
    level: string;
    fiche: PedagogicalFiche;
  } | null>(null);

  // Modals
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Initialize saved fiches and key from localStorage
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem("sanad_saved_fiches");
      if (storedSaved) {
        setSavedFiches(JSON.parse(storedSaved));
      } else {
        // Seed initial prebuilt fiches
        setSavedFiches(PREBUILT_FICHES);
        localStorage.setItem("sanad_saved_fiches", JSON.stringify(PREBUILT_FICHES));
      }

      const storedKey = localStorage.getItem("sanad_custom_gemini_key");
      if (storedKey) {
        setCustomApiKey(storedKey);
      }
    } catch (e) {
      console.error("Local storage access error:", e);
    }

    // Check server health
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasServerApiKey === "boolean") {
          setServerHasKey(data.hasServerApiKey);
        }
      })
      .catch((err) => console.warn("Could not check health:", err));

    // Handle shared pedagogical fiche in URL (#share=... or ?share=...)
    const processSharedLink = () => {
      try {
        const hash = window.location.hash || "";
        const search = window.location.search || "";
        let serialized: string | null = null;

        if (hash.startsWith("#share=")) {
          serialized = hash.replace("#share=", "");
        } else if (hash.startsWith("#fiche=")) {
          serialized = hash.replace("#fiche=", "");
        } else if (search.includes("share=") || search.includes("fiche=")) {
          const params = new URLSearchParams(search);
          serialized = params.get("share") || params.get("fiche");
        }

        if (serialized) {
          const sharedFiche = deserializeFiche(serialized);
          if (sharedFiche && sharedFiche.header && sharedFiche.steps) {
            setCurrentFiche(sharedFiche);
            setViewMode("viewer");
            setSharedNotice({
              title: sharedFiche.header.resourceTitle || "مذكرة مشتركة",
              subject: sharedFiche.header.subject,
              level: sharedFiche.header.level,
              fiche: sharedFiche,
            });
          }
        }
      } catch (err) {
        console.error("Error loading shared fiche from link:", err);
      }
    };

    processSharedLink();
    window.addEventListener("hashchange", processSharedLink);
    return () => {
      window.removeEventListener("hashchange", processSharedLink);
    };
  }, []);

  const handleSaveToArchive = (ficheToSave: PedagogicalFiche) => {
    const exists = savedFiches.some((f) => f.id === ficheToSave.id);
    let updated: PedagogicalFiche[];
    if (exists) {
      updated = savedFiches.map((f) => (f.id === ficheToSave.id ? ficheToSave : f));
    } else {
      updated = [ficheToSave, ...savedFiches];
    }
    setSavedFiches(updated);
    try {
      localStorage.setItem("sanad_saved_fiches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save to local storage:", e);
    }
  };

  const handleDeleteSavedFiche = (id: string) => {
    const updated = savedFiches.filter((f) => f.id !== id);
    setSavedFiches(updated);
    try {
      localStorage.setItem("sanad_saved_fiches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to delete from local storage:", e);
    }
  };

  const handleSaveCustomKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key) {
        localStorage.setItem("sanad_custom_gemini_key", key);
      } else {
        localStorage.removeItem("sanad_custom_gemini_key");
      }
    } catch (e) {
      console.error("Failed to persist custom key:", e);
    }
  };

  const handleGenerateSuccess = (newFiche: PedagogicalFiche) => {
    setCurrentFiche(newFiche);
    setViewMode("viewer");
    handleSaveToArchive(newFiche);
  };

  const handleSelectPrebuilt = (prebuilt: PedagogicalFiche) => {
    setCurrentFiche(prebuilt);
    setViewMode("viewer");
  };

  const handleCurriculumResourceSelect = (
    level: MiddleSchoolLevel,
    subjectId: string,
    sequenceName: string,
    fieldName: string,
    resourceTitle: string
  ) => {
    // Switch to form and pre-fill can happen or generate
    setViewMode("form");
  };

  const isCurrentSaved = currentFiche
    ? savedFiches.some((f) => f.id === currentFiche.id)
    : false;

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-900 flex flex-col font-['Cairo',sans-serif]">
      {/* Global Navbar */}
      <Navbar
        onNewFicheClick={() => setViewMode("form")}
        onOpenSavedClick={() => setIsSavedModalOpen(true)}
        onOpenCurriculumClick={() => setIsCurriculumModalOpen(true)}
        onOpenApiKeyClick={() => setIsApiKeyModalOpen(true)}
        onOpenDashboardClick={() => setViewMode("dashboard")}
        savedCount={savedFiches.length}
        hasCustomKey={Boolean(customApiKey)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Shared Fiche Alert Banner */}
        {sharedNotice && (
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border border-indigo-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    تم استيراد مذكرة بيداغوجية مشتركة من زميل!
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs">
                    {sharedNotice.level}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-medium text-xs">
                    {sharedNotice.subject}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  المورد: <span className="font-bold text-slate-800">{sharedNotice.title}</span> — يمكنك مراجعتها، التعديل عليها، تصديرها كـ Word/PDF، أو حفظها مباشرة في أرشيفك.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleSaveToArchive(sharedNotice.fiche);
                  setSharedNotice(null);
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>حفظ بأرشيفي الآن</span>
              </button>
              <button
                onClick={() => setSharedNotice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
                title="إغلاق التنبيه"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Mode Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setViewMode("viewer")}
              disabled={!currentFiche}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === "viewer"
                  ? "bg-[#3b82f6] text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                <span>معاينة المذكرة الرسمية</span>
              </span>
            </button>

            <button
              onClick={() => setViewMode("form")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === "form"
                  ? "bg-[#3b82f6] text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>إعداد وتوليد مذكرة جديدة</span>
              </span>
            </button>

            <button
              onClick={() => setViewMode("dashboard")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                viewMode === "dashboard"
                  ? "bg-[#3b82f6] text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>لوحة البيانات والإحصائيات</span>
              </span>
            </button>
          </div>

          {/* 4 Levels Badge Summary */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 font-bold ml-1">مستويات المتوسط:</span>
            {ALGERIAN_LEVELS.map((lvl) => (
              <span
                key={lvl.id}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-bold whitespace-nowrap text-xs"
              >
                {lvl.badge}
              </span>
            ))}
          </div>
        </div>

        {/* View Mode Router */}
        {viewMode === "dashboard" ? (
          <AnalyticsDashboard
            fiches={savedFiches}
            onSelectFiche={(f) => {
              setCurrentFiche(f);
              setViewMode("viewer");
            }}
            onNewFicheClick={() => setViewMode("form")}
          />
        ) : viewMode === "form" ? (
          <div className="space-y-6">
            <FicheGeneratorForm
              onGenerateSuccess={handleGenerateSuccess}
              onSelectPrebuilt={handleSelectPrebuilt}
              customApiKey={customApiKey}
            />

            {/* Official Algerian Curriculum & Methodology Explainer Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3 font-['Amiri',serif]">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>منهجية بناء المذكرات البيداغوجية في التعليم المتوسط الجزائري (الجيل الثاني)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    1. المقاربة بالكفاءات
                  </h4>
                  <p className="leading-relaxed text-xs">
                    الانتقال من التلقين المعرفي إلى تجنيد الموارد في وضعيات مشكلة دالة مستمدة من محيط المتعلم المعيشي، مع تحديد الكفاءة الشاملة والختامية والمركبات.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    2. سيرورة الحصة الثلاثية
                  </h4>
                  <p className="leading-relaxed text-xs">
                    تبنى الحصة على ثلاثة أطوار: مرحلة الانطلاق (المشكلة الحافزة)، مرحلة بناء التعلمات (النشاط الذاتي للمتعلم وتوجيه الأستاذ)، ومرحلة الاستثمار والتقويم التكويني.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    3. التوثيق والتأمل المهني
                  </h4>
                  <p className="leading-relaxed text-xs">
                    صياغة ملخص سبوري مهيكل يكتبه التلميذ على كراسه، ونشاط منزلي مكمل، مع خانة التقييم الذاتي لملاحظات الأستاذ بعد تنفيذ الحصة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : currentFiche ? (
          <FicheViewer
            fiche={currentFiche}
            onUpdateFiche={(updated) => {
              setCurrentFiche(updated);
              handleSaveToArchive(updated);
            }}
            onSaveToArchive={handleSaveToArchive}
            isSaved={isCurrentSaved}
            onBackToForm={() => setViewMode("form")}
          />
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">لا توجد مذكرة معروضة حالياً</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              يمكنك اختيار نموذج جاهز أو البدء في توليد مذكرة بيداغوجية جديدة.
            </p>
            <button
              onClick={() => setViewMode("form")}
              className="px-5 py-2.5 rounded-xl bg-[#3b82f6] text-white font-bold text-sm shadow-sm hover:bg-blue-700 cursor-pointer"
            >
              توليد مذكرة الآن
            </button>
          </div>
        )}
      </main>

      {/* Footer (Hidden during print) */}
      <footer className="bg-[#1e293b] text-slate-300 border-t border-slate-800 py-6 text-center text-xs print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-['Amiri',serif] text-base">تطبيق سَنَد</span>
            <span>•</span>
            <span className="text-slate-400">مخصص لأساتذة ومفتشي مرحلة التعليم المتوسط بالجزائر</span>
          </div>
          <div className="text-slate-400">
            <span>منهاج الجيل الثاني (2G) • وزارة التربية الوطنية الجزائرية</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SavedFichesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        fiches={savedFiches}
        onSelectFiche={(f) => {
          setCurrentFiche(f);
          setViewMode("viewer");
        }}
        onDeleteFiche={handleDeleteSavedFiche}
      />

      <CurriculumBrowserModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        onSelectResourceForFiche={handleCurriculumResourceSelect}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        customKey={customApiKey}
        onSaveKey={handleSaveCustomKey}
        serverHasKey={serverHasKey}
      />
    </div>
  );
}

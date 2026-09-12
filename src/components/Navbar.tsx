import React from "react";
import { Sparkles, BookOpen, Bookmark, Key, Compass, GraduationCap, PlusCircle, BarChart3 } from "lucide-react";

interface NavbarProps {
  onNewFicheClick: () => void;
  onOpenSavedClick: () => void;
  onOpenCurriculumClick: () => void;
  onOpenApiKeyClick: () => void;
  onOpenDashboardClick: () => void;
  savedCount: number;
  hasCustomKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewFicheClick,
  onOpenSavedClick,
  onOpenCurriculumClick,
  onOpenApiKeyClick,
  onOpenDashboardClick,
  savedCount,
  hasCustomKey,
}) => {
  return (
    <header className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-4 sm:px-8 shadow-md shrink-0 sticky top-0 z-30 print:hidden">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Brand Logo & Algerian Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm ring-1 ring-blue-400/40 shrink-0">
            س
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Amiri',serif]">
                تطبيق سَـند
              </h1>
              <span className="text-xs font-normal bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                بذكاء اصطناعي
              </span>
              <span className="hidden md:inline-block text-[11px] font-medium bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                التعليم المتوسط • الجيل 2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              المنظومة المتوازنة لتوليد المذكرات البيداغوجية الرسمية
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
          <button
            onClick={onOpenDashboardClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            title="لوحة البيانات والرسوم البيانية للمذكرات"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">لوحة البيانات</span>
          </button>

          <button
            onClick={onOpenCurriculumClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            title="استعراض المنهاج الرسمي والكفاءات"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="hidden lg:inline">المناهج الرسمية</span>
          </button>

          <button
            onClick={onOpenSavedClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors relative cursor-pointer"
            title="سجل مذكراتي المحفوظة"
          >
            <Bookmark className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">الأرشيف</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-[#3b82f6] rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenApiKeyClick}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              hasCustomKey
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
            }`}
            title="مفتاح الذكاء الاصطناعي (API)"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">مفتاح API</span>
          </button>

          <button
            onClick={onNewFicheClick}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#3b82f6] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-900/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>مذكرة جديدة</span>
          </button>
        </div>
      </div>
    </header>
  );
};

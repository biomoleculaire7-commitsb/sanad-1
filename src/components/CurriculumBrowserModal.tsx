import React, { useState } from "react";
import { X, Compass, ChevronLeft, BookOpen, Layers, CheckCircle } from "lucide-react";
import { ALGERIAN_LEVELS, ALGERIAN_SUBJECTS } from "../data/algerianCurriculum";
import { MiddleSchoolLevel } from "../types";

interface CurriculumBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResourceForFiche: (level: MiddleSchoolLevel, subjectId: string, sequenceName: string, fieldName: string, resourceTitle: string) => void;
}

export const CurriculumBrowserModal: React.FC<CurriculumBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectResourceForFiche,
}) => {
  const [activeLevel, setActiveLevel] = useState<MiddleSchoolLevel>("4am");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("snv");

  if (!isOpen) return null;

  const subject = ALGERIAN_SUBJECTS.find((s) => s.id === activeSubjectId);
  const levelData = subject?.levels[activeLevel];
  const sequences = levelData?.sequences || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Amiri',serif]">
                دليل منهاج التعليم المتوسط (الجيل الثاني)
              </h3>
              <p className="text-xs text-slate-500">
                استعراض الكفاءات الشاملة، الميادين، والمقاطع والموارد المعرفية الرسمية المعتمدة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Tabs (1م، 2م، 3م، 4م) */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-200 bg-white flex flex-wrap gap-2">
          {ALGERIAN_LEVELS.map((lvl) => {
            const isActive = activeLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setActiveLevel(lvl.id)}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-[#3b82f6] text-[#3b82f6]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {lvl.name}
              </button>
            );
          })}
        </div>

        {/* Subject Pills */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
          {ALGERIAN_SUBJECTS.map((sub) => {
            const isActive = activeSubjectId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubjectId(sub.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5 bg-white">
          {/* General Competence Card */}
          {levelData?.generalCompetence && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800">
              <span className="text-xs font-bold text-blue-800 block mb-1">
                الكفاءة الشاملة للطور / المستوى:
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {levelData.generalCompetence}
              </p>
            </div>
          )}

          {/* Sequences & Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>المقاطع التعلمية والموارد المعرفية المقررة:</span>
            </h4>

            {sequences.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                لا توجد مقاطع مدرجة لهذا المستوى في قاعدة البيانات الحالية، يمكنك كتابة المورد يدوياً في نموذج المذكرة.
              </p>
            ) : (
              sequences.map((seq) => (
                <div
                  key={seq.id}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                >
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md ml-2">
                        الميدان: {seq.field}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {seq.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {seq.resources.length} موارد معرفية
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100">
                    {seq.resources.map((res) => (
                      <div
                        key={res.id}
                        className="py-2.5 px-2 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50/80 rounded-lg transition-colors group"
                      >
                        <div className="space-y-0.5">
                          <h5 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                            {res.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>المدة: {res.duration}</span>
                            <span>•</span>
                            <span className="text-blue-700 font-medium">{res.type}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectResourceForFiche(activeLevel, activeSubjectId, seq.name, seq.field, res.title);
                            onClose();
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-[#3b82f6] hover:text-white rounded-lg border border-blue-200 transition-colors cursor-pointer"
                        >
                          إنشاء مذكرة لهذا الدرس
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

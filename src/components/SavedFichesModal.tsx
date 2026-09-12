import React, { useState } from "react";
import { X, Bookmark, Trash2, ExternalLink, Calendar, BookOpen, Layers, FileText, Share2, Copy } from "lucide-react";
import { PedagogicalFiche } from "../types";
import { exportFicheToWordDoc } from "../utils/wordExport";
import { ShareFicheModal } from "./ShareFicheModal";
import { CopyContentModal } from "./CopyContentModal";

interface SavedFichesModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiches: PedagogicalFiche[];
  onSelectFiche: (fiche: PedagogicalFiche) => void;
  onDeleteFiche: (id: string) => void;
}

export const SavedFichesModal: React.FC<SavedFichesModalProps> = ({
  isOpen,
  onClose,
  fiches,
  onSelectFiche,
  onDeleteFiche,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [shareFiche, setShareFiche] = useState<PedagogicalFiche | null>(null);
  const [copyModalFiche, setCopyModalFiche] = useState<PedagogicalFiche | null>(null);

  if (!isOpen) return null;

  const filteredFiches = fiches.filter((f) => {
    const matchesSearch =
      f.header.resourceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.header.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.header.sequence.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      filterLevel === "all" ||
      f.header.level.toLowerCase().includes(filterLevel.toLowerCase());

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Amiri',serif]">
                سجل مذكراتي المحفوظة
              </h3>
              <p className="text-xs text-slate-500">
                إدارة واستعراض المذكرات البيداغوجية التي قمت بحفظها
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

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 bg-white">
          <input
            type="text"
            placeholder="بحث بالعنوان، المادة، أو المقطع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">جميع المستويات (1م - 4م)</option>
            <option value="الأولى">الأولى متوسط (1AM)</option>
            <option value="الثانية">الثانية متوسط (2AM)</option>
            <option value="الثالثة">الثالثة متوسط (3AM)</option>
            <option value="الرابعة">الرابعة متوسط (4AM)</option>
          </select>
        </div>

        {/* Fiche List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
          {filteredFiches.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">لا توجد مذكرات محفوظة حالياً</p>
              <p className="text-xs text-slate-400 mt-1">
                عند توليد أو استعراض أي مذكرة، اضغط على زر "حفظ بأرشيفي" للاحتفاظ بها هنا.
              </p>
            </div>
          ) : (
            filteredFiches.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3 group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectFiche(f);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-800 rounded">
                      {f.header.level}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {f.header.subject}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {f.createdAt}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {f.header.resourceTitle}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {f.header.sequence} • {f.header.field}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareFiche(f);
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="مشاركة المذكرة برابط أو رمز QR"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCopyModalFiche(f);
                    }}
                    className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="نسخ نص المذكرة (Markdown / نص عادي)"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportFicheToWordDoc(f);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="تصدير كملف Word (.doc)"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectFiche(f);
                      onClose();
                    }}
                    className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="فتح المذكرة والمعاينة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteFiche(f.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف من الأرشيف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>

      {shareFiche && (
        <ShareFicheModal
          isOpen={Boolean(shareFiche)}
          onClose={() => setShareFiche(null)}
          fiche={shareFiche}
        />
      )}

      {copyModalFiche && (
        <CopyContentModal
          isOpen={Boolean(copyModalFiche)}
          onClose={() => setCopyModalFiche(null)}
          fiche={copyModalFiche}
        />
      )}
    </div>
  );
};

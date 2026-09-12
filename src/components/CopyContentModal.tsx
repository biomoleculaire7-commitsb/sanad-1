import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  X,
  FileCode,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { PedagogicalFiche } from "../types";
import {
  convertFicheToMarkdown,
  convertFicheToPlainText,
} from "../utils/ficheTextExport";
import { copyToClipboard } from "../utils/shareUtils";

interface CopyContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiche: PedagogicalFiche;
}

export const CopyContentModal: React.FC<CopyContentModalProps> = ({
  isOpen,
  onClose,
  fiche,
}) => {
  const [format, setFormat] = useState<"markdown" | "plain">("markdown");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const markdownContent = useMemo(() => convertFicheToMarkdown(fiche), [fiche]);
  const plainTextContent = useMemo(() => convertFicheToPlainText(fiche), [fiche]);

  const activeContent = format === "markdown" ? markdownContent : plainTextContent;

  const handleCopy = async (overrideFormat?: "markdown" | "plain") => {
    const targetFormat = overrideFormat || format;
    const textToCopy = targetFormat === "markdown" ? markdownContent : plainTextContent;

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  const charCount = activeContent.length;
  const wordCount = activeContent.trim().split(/\s+/).length;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-fadeIn my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Copy className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                نسخ نص المذكرة البيداغوجية بالكامل
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                تصدير النص فورياً إلى الحافظة لنقله بسهولة إلى Notion، Word، WhatsApp، أو أي تطبيق آخر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formats Selection Bar */}
        <div className="p-4 sm:p-5 pb-0">
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFormat("markdown")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                format === "markdown"
                  ? "bg-white text-indigo-700 shadow-xs border border-indigo-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>تنسيق Markdown (مع الجداول والعناوين)</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px]">
                المستحسن
              </span>
            </button>

            <button
              onClick={() => setFormat("plain")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                format === "plain"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4 text-slate-700" />
              <span>نص عادي (Plain Text)</span>
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">
              معاينة النص المُعد للنسخ ({wordCount} كلمة • {charCount} حرف):
            </span>
            <span className="text-[11px] text-slate-500">
              {format === "markdown"
                ? "متوافق مع Notion وObsidian ومحررات الويب"
                : "نص بسيط متوافق مع كافة البرامج والمحادثات"}
            </span>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={activeContent}
              className="w-full h-64 text-xs font-mono bg-slate-50 text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed select-all"
            />
          </div>

          {/* Quick Explanation */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>نصيحة:</strong> عند لصق نص Markdown في محررات تدعم التنسيق الغني (مثل Notion أو Google Docs أو Microsoft Word الحديث)، ستتحول الجداول والعناوين تلقائياً إلى عناصر منسقة ومرتبة.
            </p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy("markdown")}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors border border-indigo-200 cursor-pointer flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>نسخ كـ Markdown</span>
            </button>
            <button
              onClick={() => handleCopy("plain")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-300 cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>نسخ كنص عادي</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy()}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isCopied
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>تم النسخ إلى الحافظة!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ المحتوى الحالي</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

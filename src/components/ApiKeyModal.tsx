import React, { useState } from "react";
import { X, Key, ShieldCheck, Sparkles, ExternalLink, Check } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customKey: string;
  onSaveKey: (key: string) => void;
  serverHasKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  customKey,
  onSaveKey,
  serverHasKey,
}) => {
  const [inputValue, setInputValue] = useState(customKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputValue.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputValue("");
    onSaveKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Amiri',serif]">
                مفتاح الذكاء الاصطناعي (Gemini)
              </h3>
              <p className="text-xs text-slate-500">
                تطبيق سَنَد مدعوم بنموذج Google Gemini 3 Flash
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

        {/* Body */}
        <div className="p-5 space-y-4 text-sm text-slate-700">
          {serverHasKey ? (
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-2.5 text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs sm:text-sm">المفتاح الافتراضي متصل ويعمل بنجاح</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  تم ضبط مفتاح Gemini في بيئة العمل تلقائياً لتوليد المذكرات البيداغوجية مجاناً وبسرعة عالية.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs sm:text-sm">إدخال مفتاحك المجاني الخاص</p>
                <p className="text-xs text-amber-800 mt-0.5">
                  يمكنك استخدام مفتاحك المجاني من Google AI Studio لتوليد عدد غير محدود من المذكرات.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              مفتاح Gemini API مخصص (اختياري):
            </label>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              يتم حفظ المفتاح محلياً في متصفحك بشكل آمن ولا يشارك مع أي طرف آخر.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">كيف تحصل على مفتاح مجاني؟</p>
            <p>1. قم بزيارة موقع Google AI Studio وسجل الدخول بحساب Google الخاص بك.</p>
            <p>2. اضغط على زر "Get API Key" ثم انسخ المفتاح المجاني وضعه هنا.</p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline mt-1"
            >
              <span>فتح صفحة استخراج المفتاح من Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-red-600 font-medium cursor-pointer"
          >
            مسح المفتاح المخصص
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#3b82f6] hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم الحفظ</span>
                </>
              ) : (
                <span>حفظ المفتاح</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

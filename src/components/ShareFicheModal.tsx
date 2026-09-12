import React, { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
  X,
  Sparkles,
  Layers,
  GraduationCap,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PedagogicalFiche } from "../types";
import {
  generateShareableLink,
  generateQrCodeDataUrl,
  copyToClipboard,
} from "../utils/shareUtils";

interface ShareFicheModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiche: PedagogicalFiche;
}

export const ShareFicheModal: React.FC<ShareFicheModalProps> = ({
  isOpen,
  onClose,
  fiche,
}) => {
  const [shareLink, setShareLink] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"link" | "qr" | "json">("link");

  useEffect(() => {
    if (!isOpen || !fiche) return;

    // Reset states
    setCopiedLink(false);
    setCopiedJson(false);
    setIsGeneratingQr(true);

    try {
      const link = generateShareableLink(fiche);
      setShareLink(link);

      // Generate QR Code
      generateQrCodeDataUrl(link)
        .then((url) => {
          setQrDataUrl(url);
          setIsGeneratingQr(false);
        })
        .catch((err) => {
          console.error("Failed to generate QR:", err);
          setIsGeneratingQr(false);
        });
    } catch (err) {
      console.error("Share generation error:", err);
      setIsGeneratingQr(false);
    }
  }, [isOpen, fiche]);

  if (!isOpen || !fiche) return null;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareLink);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyJson = async () => {
    const success = await copyToClipboard(JSON.stringify(fiche, null, 2));
    if (success) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 3000);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const cleanTitle = (fiche.header.resourceTitle || "fiche")
      .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_")
      .slice(0, 30);
    a.download = `QR_Sanad_${cleanTitle}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `السلام عليكم زميلي الأستاذ،\nأشاركك هذه المذكرة البيداغوجية المعتمدة لمنهاج الجيل الثاني:\n` +
      `📌 المادة: ${fiche.header.subject}\n` +
      `🎓 المستوى: ${fiche.header.level}\n` +
      `📖 المورد المعرفي: ${fiche.header.resourceTitle}\n\n` +
      `اضغط على الرابط التالي لفتح ومعاينة المذكرة مباشرة:\n${shareLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `مذكرة بيداغوجية نموذجية: ${fiche.header.subject} (${fiche.header.level}) - ${fiche.header.resourceTitle}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${text}`, "_blank");
  };

  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: `مذكرة: ${fiche.header.resourceTitle}`,
        text: `مذكرة بيداغوجية لمادة ${fiche.header.subject} - المستوى: ${fiche.header.level}`,
        url: shareLink,
      });
    } catch (e) {
      // User cancelled or not supported
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-fadeIn my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                مشاركة المذكرة البيداغوجية مع الزملاء
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                توليد رابط مباشر مشفر أو رمز QR يتيح لأي أستاذ فتح المذكرة واستعراضها فوراً
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

        {/* Fiche Brief Card */}
        <div className="px-5 py-3.5 bg-blue-50/50 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-['Amiri',serif] text-sm">
              {fiche.header.resourceTitle || "مذكرة بيداغوجية"}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold text-[11px]">
              {fiche.header.level}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
              {fiche.header.subject}
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            {fiche.steps?.length || 0} مراحل تعليمية
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab("link")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "link"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>رابط المشاركة المباشر</span>
            </button>

            <button
              onClick={() => setActiveTab("qr")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "qr"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>رمز الاستجابة السريعة (QR)</span>
            </button>

            <button
              onClick={() => setActiveTab("json")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "json"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>بيانات JSON الخام</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4">
          {activeTab === "link" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  رابط المذكرة المشفر الكامل:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-700 font-mono dir-ltr select-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Informative note */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">ميزة المشاركة الذاتية الخالية من الخوادم (Self-Contained):</div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    كامل تفاصيل المذكرة (الأهداف، الكفاءات، الجداول الزمنية، أثر السبورة، والتقويم) مشفرة ومضغوطة تلقائياً داخل الرابط. يمكن لأي زميل فتحه فوراً من أي هاتف أو حاسوب دون الحاجة لتسجيل دخول أو خادم.
                  </p>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="pt-2 border-t border-slate-200">
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  إرسال سريع إلى مجموعات الأساتذة:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>عبر واتساب</span>
                  </button>

                  <button
                    onClick={handleShareTelegram}
                    className="py-2 px-3 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>عبر تيليغرام</span>
                  </button>

                  {canNativeShare ? (
                    <button
                      onClick={handleNativeShare}
                      className="py-2 px-3 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer col-span-2 sm:col-span-1"
                    >
                      <Share2 className="w-4 h-4 text-indigo-600" />
                      <span>مشاركة الجهاز</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCopyLink}
                      className="py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer col-span-2 sm:col-span-1"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>{copiedLink ? "تم النسخ" : "نسخ الحافظة"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                وجّه كاميرا الهاتف أو الجهاز اللوحي نحو الرمز لفتح المذكرة البيداغوجية كاملة فوراً. مثالي لجلسات التنسيق البيداغوجي والندوات التربوية!
              </p>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-xs mx-auto">
                {isGeneratingQr ? (
                  <div className="w-48 h-48 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">جاري إنشاء رمز QR...</span>
                  </div>
                ) : qrDataUrl ? (
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                    <img
                      src={qrDataUrl}
                      alt="رمز الاستجابة السريعة للمذكرة"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-rose-500">
                    تعذر إنشاء الرمز
                  </div>
                )}

                <div className="mt-3 text-xs font-bold text-slate-900">
                  {fiche.header.resourceTitle}
                </div>
                <div className="text-[11px] text-slate-500">
                  {fiche.header.subject} • {fiche.header.level}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleDownloadQr}
                  disabled={!qrDataUrl}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل رمز QR كصورة (PNG)</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ الرابط</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "json" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">هيكل البيانات الكامل بصيغة JSON:</span>
                <button
                  onClick={handleCopyJson}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">تم نسخ الـ JSON!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ كود JSON</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                value={JSON.stringify(fiche, null, 2)}
                className="w-full h-44 text-[11px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl border border-slate-800 dir-ltr text-left overflow-auto focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            منظومة سَنَد • المشاركة البيداغوجية بين أساتذة المتوسط
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

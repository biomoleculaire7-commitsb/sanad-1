import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileQuestion,
  HelpCircle,
} from "lucide-react";
import { FicheImage } from "../types";
import { CURATED_EDUCATIONAL_IMAGES, CuratedImageItem } from "../data/curatedEducationalImages";

interface EducationalImageManagerProps {
  images: FicheImage[];
  onImagesChange: (images: FicheImage[]) => void;
  subjectTitle?: string;
  subjectId?: string;
  resourceTitle?: string;
  customApiKey?: string;
  compact?: boolean;
}

export const EducationalImageManager: React.FC<EducationalImageManagerProps> = ({
  images,
  onImagesChange,
  subjectTitle = "المادة",
  subjectId = "snv",
  resourceTitle = "",
  customApiKey,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"ai" | "url" | "library">("ai");

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<{
    url: string;
    caption: string;
  } | null>(null);

  // External URL State
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlCaption, setUrlCaption] = useState<string>("");
  const [urlDescription, setUrlDescription] = useState<string>("");
  const [urlPreviewValid, setUrlPreviewValid] = useState<boolean | null>(null);

  // Library State
  const [libraryFilter, setLibraryFilter] = useState<string>(subjectId || "all");

  // Preview Modal
  const [previewImage, setPreviewImage] = useState<FicheImage | null>(null);

  // Auto-suggest AI prompt when resourceTitle changes
  useEffect(() => {
    if (resourceTitle) {
      setAiPrompt(`رسم تخطيطي تعليمي يوضح: ${resourceTitle} مع بيانات واضحة وتسميات باللغة العربية`);
      if (!urlCaption) {
        setUrlCaption(`سند تعليمي: ${resourceTitle}`);
      }
    } else {
      setAiPrompt("رسم تخطيطي علمي دقيق يوضح البنية والعناصر الأساسية للدرس");
    }
  }, [resourceTitle]);

  // Handle AI Generation
  const handleGenerateAiImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          subject: subjectTitle,
          userApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "تعذر توليد الصورة التعليمية");
      }

      const generated = {
        url: data.imageUrl,
        caption: `وثيقة ${images.length + 1}: ${resourceTitle || aiPrompt.slice(0, 40)}`,
      };
      setLastGeneratedImage(generated);

      // Automatically add to list
      const newFicheImage: FicheImage = {
        id: `img_ai_${Date.now()}`,
        url: data.imageUrl,
        caption: generated.caption,
        description: `رسم توضيحي مولد بالذكاء الاصطناعي يوضح: ${aiPrompt}`,
        placement: "didacticSupports",
        sourceType: "ai_generated",
      };

      onImagesChange([...images, newFicheImage]);
    } catch (err: any) {
      console.error("AI image generation error:", err);
      setAiError(err.message || "حدث خطأ أثناء التوليد. يرجى التحقق من الاتصال.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handle Adding External URL Image
  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;

    const newImage: FicheImage = {
      id: `img_url_${Date.now()}`,
      url: urlInput.trim(),
      caption: urlCaption.trim() || `وثيقة ${images.length + 1}: سند تعليمي للدرس`,
      description: urlDescription.trim() || undefined,
      placement: "didacticSupports",
      sourceType: "external_url",
    };

    onImagesChange([...images, newImage]);
    setUrlInput("");
    setUrlCaption("");
    setUrlDescription("");
    setUrlPreviewValid(null);
  };

  // Handle Adding Library Image
  const handleAddLibraryImage = (item: CuratedImageItem) => {
    const isAlreadyAdded = images.some((img) => img.url === item.url);
    if (isAlreadyAdded) return;

    const newImage: FicheImage = {
      id: `img_lib_${Date.now()}`,
      url: item.url,
      caption: `وثيقة ${images.length + 1}: ${item.title}`,
      description: item.description,
      placement: "didacticSupports",
      sourceType: "library",
    };

    onImagesChange([...images, newImage]);
  };

  // Remove Image
  const handleRemoveImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  // Update Caption
  const handleUpdateCaption = (id: string, newCaption: string) => {
    onImagesChange(
      images.map((img) => (img.id === id ? { ...img, caption: newCaption } : img))
    );
  };

  // Filter curated images
  const filteredCuratedImages = CURATED_EDUCATIONAL_IMAGES.filter((item) => {
    if (libraryFilter === "all") return true;
    return item.subject === libraryFilter;
  });

  return (
    <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 border border-blue-200/80 rounded-2xl overflow-hidden shadow-xs">
      {/* Header Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-blue-50/60 transition-colors border-b border-blue-100/70 select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                السندات والوثائق الإيضاحية المصورة
              </span>
              {images.length > 0 ? (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  {images.length} {images.length === 1 ? "صورة مرفقة" : "صور مرفقة"}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-full">
                  اختياري (سندات ورسومات للدرس)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              إدراج صور وروابط توضيحية أو توليد رسومات تعليمية بالذكاء الاصطناعي لتضمينها مباشرة في المذكرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <div className="hidden sm:flex items-center -space-x-2 space-x-reverse">
              {images.slice(0, 3).map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.caption}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover border-2 border-white shadow-xs"
                />
              ))}
              {images.length > 3 && (
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  +{images.length - 3}
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Method Selection Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "ai"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>توليد بالذكاء الاصطناعي</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "url"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>رابط صورة خارجي</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "library"
                  ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>مكتبة المنهاج الجزائري</span>
            </button>
          </div>

          {/* TAB 1: AI GENERATION */}
          {activeTab === "ai" && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    توليد رسم أو سند تعليمي دقيق بالذكاء الاصطناعي
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    يقوم الذكاء الاصطناعي برسم مخطط علمي أو تخطيطي دقيق مخصص لدرسك مع بيانات وتسميات عربية.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  تضمين تلقائي
                </span>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  وصف السند أو الرسم المراد توليده:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثال: رسم تخطيطي لبنية الخلية النباتية أو مخطط دارة كهربائية بسيطة..."
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                  {resourceTitle && (
                    <button
                      type="button"
                      onClick={() =>
                        setAiPrompt(`رسم تخطيطي دقيق وواضح لـ: ${resourceTitle} مع كتابة البيانات والشرح`)
                      }
                      className="absolute left-2 top-2 text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                      title="اقتراح وصف مستوحى من عنوان الدرس الحالي"
                    >
                      استخدام عنوان الدرس
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 font-medium">اقتراحات سريعة:</span>
                <button
                  type="button"
                  onClick={() => setAiPrompt("رسم تخطيطي للجهاز الهضمي ومحطات تأثير الإنزيمات الهاضمة")}
                  className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  الجهاز الهضمي
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt("تركيب تجريبي للتحليل الكهربائي البسيط في وعاء فولطا")}
                  className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  التحليل الكهربائي
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt("رسم بياني يوضح تغيرات سرعة متحرك بدلالة الزمن مع المراحل")}
                  className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  مخطط سرعة
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt("بنية الزغابة المعوية وشبكة الشعيرات الدموية والبلغمية")}
                  className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  الزغابة المعوية
                </button>
              </div>

              {/* Generate Button & Status */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleGenerateAiImage}
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري رسم وتوليد السند التعليمي...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>توليد وإرفاق بالمذكرة</span>
                    </>
                  )}
                </button>

                {lastGeneratedImage && !isGeneratingAi && (
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    تم التوليد وإضافتها لقائمة السندات!
                  </span>
                )}
              </div>

              {aiError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{aiError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXTERNAL URL */}
          {activeTab === "url" && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                  إدراج صورة عبر رابط خارجي (مواقع تعليمية، صور ويكيبيديا، كتب مدرسية...)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ألصق رابط أي صورة أو وثيقة من الإنترنت ليتم تضمينها وعرضها بدقة في المذكرة ومستند Word.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">رابط الصورة (URL):</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlPreviewValid(null);
                    }}
                    placeholder="https://example.com/diagram.png"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dir-ltr text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    تسمية الوثيقة / عنوان السند:
                  </label>
                  <input
                    type="text"
                    value={urlCaption}
                    onChange={(e) => setUrlCaption(e.target.value)}
                    placeholder="مثال: وثيقة 1: بنية الخلية النباتية"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  وصف تربوي للاستثمار في الحصة (اختياري):
                </label>
                <input
                  type="text"
                  value={urlDescription}
                  onChange={(e) => setUrlDescription(e.target.value)}
                  placeholder="مثال: استثمار الوثيقة في استنتاج شروط حدوث التفاعل الكيميائي..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              {/* URL Preview Thumbnail if valid */}
              {urlInput.trim() && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <img
                    src={urlInput}
                    alt="معاينة الرابط"
                    referrerPolicy="no-referrer"
                    onError={() => setUrlPreviewValid(false)}
                    onLoad={() => setUrlPreviewValid(true)}
                    className="w-16 h-12 object-cover rounded border border-slate-300 bg-white"
                  />
                  <div className="flex-1 text-xs">
                    {urlPreviewValid === true ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        الصورة صالحة وجاهزة للإضافة
                      </span>
                    ) : urlPreviewValid === false ? (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        تعذر تحميل الصورة من هذا الرابط، تأكد من صحته
                      </span>
                    ) : (
                      <span className="text-slate-500">جاري فحص الرابط...</span>
                    )}
                    <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      {urlCaption || "بدون عنوان مخصص"}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddUrlImage}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة الصورة إلى المذكرة</span>
              </button>
            </div>
          )}

          {/* TAB 3: CURATED LIBRARY */}
          {activeTab === "library" && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    مكتبة السندات والرسومات النموذجية للمنهاج الجزائري
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    اختر وثيقة جاهزة بنقرة واحدة لإرفاقها فورياً بمذكرتك البيداغوجية.
                  </p>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLibraryFilter("all")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      libraryFilter === "all"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryFilter("snv")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      libraryFilter === "snv"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    علوم الطبيعة
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryFilter("physique")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      libraryFilter === "physique"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    فيزياء
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryFilter("math")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      libraryFilter === "math"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    رياضيات
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryFilter("geo")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      libraryFilter === "geo"
                        ? "bg-amber-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    جغرافيا
                  </button>
                </div>
              </div>

              {/* Grid of Curated Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredCuratedImages.map((item) => {
                  const isAdded = images.some((img) => img.url === item.url);
                  return (
                    <div
                      key={item.id}
                      className={`p-2 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        isAdded
                          ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400"
                          : "bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
                      }`}
                    >
                      <div>
                        <div className="relative h-24 w-full rounded-lg overflow-hidden bg-white border border-slate-200 mb-2">
                          <img
                            src={item.url}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain p-1"
                          />
                          <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white">
                            {item.category}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImage({
                              id: item.id,
                              url: item.url,
                              caption: item.caption,
                              description: item.description,
                            })
                          }
                          className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>معاينة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddLibraryImage(item)}
                          disabled={isAdded}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>مرفقة</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>إدراج</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ATTACHED IMAGES LIST */}
          {images.length > 0 ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  السندات المصورة المعتمدة للمذكرة ({images.length}):
                </span>
                <span className="text-[11px] text-slate-500">
                  سيتم تضمينها رسمياً داخل جدول السندات وملحق المذكرة
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3 hover:border-blue-300 transition-colors"
                  >
                    <div
                      onClick={() => setPreviewImage(img)}
                      className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          الوثيقة {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="حذف هذه الصورة من المذكرة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                        className="w-full text-xs font-semibold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none py-0.5 mt-1"
                        placeholder="تسمية الوثيقة..."
                        title="انقر لتعديل عنوان الوثيقة"
                      />

                      <div className="text-[11px] text-slate-500 truncate mt-1">
                        {img.sourceType === "ai_generated" ? (
                          <span className="text-blue-600 font-medium">✨ رسم ذكاء اصطناعي</span>
                        ) : img.sourceType === "library" ? (
                          <span className="text-emerald-600 font-medium">📚 من مكتبة المنهاج</span>
                        ) : (
                          <span className="text-indigo-600 font-medium">🔗 رابط خارجي</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50/80 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              لم يتم إرفاق صور بعد. يمكنك توليد رسم بالذكاء الاصطناعي، لصق رابط خارجي، أو اختيار وثيقة من مكتبة المنهاج أعلاه.
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                {previewImage.caption}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-900/5">
              <img
                src={previewImage.url}
                alt={previewImage.caption}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm bg-white"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">الاستثمار البيداغوجي: </span>
                <span>{previewImage.description || "سند إيضاحي لمرافقة التعلمات وأثر السبورة."}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

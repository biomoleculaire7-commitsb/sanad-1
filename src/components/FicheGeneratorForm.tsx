import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  Layers,
  Clock,
  Wand2,
  Lightbulb,
  Compass,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Languages,
  FileText,
  BookmarkCheck,
  Check,
  Globe,
  Zap,
  Sliders,
} from "lucide-react";
import { ALGERIAN_LEVELS, ALGERIAN_SUBJECTS } from "../data/algerianCurriculum";
import { MiddleSchoolLevel, PedagogicalFiche, FicheStyle } from "../types";
import { PREBUILT_FICHES } from "../data/prebuiltFiches";
import {
  FRENCH_PEDAGOGICAL_TEMPLATES,
  ENGLISH_PEDAGOGICAL_TEMPLATES,
  ForeignLanguageTemplate,
} from "../data/foreignLanguageTemplates";

interface FicheGeneratorFormProps {
  onGenerateSuccess: (fiche: PedagogicalFiche) => void;
  onSelectPrebuilt: (fiche: PedagogicalFiche) => void;
  customApiKey: string;
}

export const FicheGeneratorForm: React.FC<FicheGeneratorFormProps> = ({
  onGenerateSuccess,
  onSelectPrebuilt,
  customApiKey,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<MiddleSchoolLevel>("4am");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("snv");
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>("");
  const [customSequenceName, setCustomSequenceName] = useState<string>("");
  const [customFieldName, setCustomFieldName] = useState<string>("");
  const [resourceTitle, setResourceTitle] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("إرساء موارد معرفية وتجريبية");
  const [duration, setDuration] = useState<string>("1 ساعة (60 دقيقة)");
  const [ficheStyle, setFicheStyle] = useState<FicheStyle>("detailed");
  const [customNotes, setCustomNotes] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Foreign language mode state
  const [languageFilter, setLanguageFilter] = useState<"all" | "ar" | "fr" | "en">("all");
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>("all");
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);
  const [templateNotification, setTemplateNotification] = useState<string | null>(null);

  // Get active subject config
  const currentSubject = ALGERIAN_SUBJECTS.find((s) => s.id === selectedSubjectId);
  const isFrench = currentSubject?.language === "fr";
  const isEnglish = currentSubject?.language === "en";
  const currentLevelData = currentSubject?.levels[selectedLevel];
  const sequences = currentLevelData?.sequences || [];

  // Update default sequence and resources when subject or level changes
  useEffect(() => {
    if (sequences.length > 0) {
      const firstSeq = sequences[0];
      setSelectedSequenceId(firstSeq.id);
      setCustomSequenceName(firstSeq.name);
      setCustomFieldName(firstSeq.field);
      if (firstSeq.resources.length > 0) {
        setResourceTitle(firstSeq.resources[0].title);
      }
    } else {
      setSelectedSequenceId("custom");
      setCustomSequenceName("");
      setCustomFieldName("");
      setResourceTitle("");
    }

    if (currentSubject?.language === "fr") {
      setSessionType("Apprentissage linguistique : Grammaire");
      setLanguageFilter("fr");
    } else if (currentSubject?.language === "en") {
      setSessionType("Language Focus: Grammar & Language Forms (PPU Framework)");
      setLanguageFilter("en");
    } else {
      setSessionType("إرساء موارد معرفية وتجريبية");
    }
  }, [selectedSubjectId, selectedLevel]);

  const handleLanguageTabClick = (lang: "all" | "ar" | "fr" | "en") => {
    setLanguageFilter(lang);
    if (lang === "fr") {
      setSelectedSubjectId("francais");
    } else if (lang === "en") {
      setSelectedSubjectId("anglais");
    } else if (lang === "ar" && (selectedSubjectId === "francais" || selectedSubjectId === "anglais")) {
      setSelectedSubjectId("arabe");
    }
  };

  const handleSequenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seqId = e.target.value;
    setSelectedSequenceId(seqId);
    if (seqId === "custom") {
      setCustomSequenceName("");
      setCustomFieldName("");
    } else {
      const found = sequences.find((s) => s.id === seqId);
      if (found) {
        setCustomSequenceName(found.name);
        setCustomFieldName(found.field);
        if (found.resources.length > 0) {
          setResourceTitle(found.resources[0].title);
        }
      }
    }
  };

  const handleQuickResourceSelect = (resTitle: string) => {
    setResourceTitle(resTitle);
  };

  const handleApplyTemplate = (tpl: ForeignLanguageTemplate) => {
    setSelectedLevel(tpl.level);
    setSelectedSubjectId(tpl.subjectId);
    setSelectedSequenceId("custom");
    setCustomSequenceName(tpl.sequence);
    setCustomFieldName(tpl.field);
    setResourceTitle(tpl.resourceTitle);
    setSessionType(tpl.sessionType);
    setDuration(tpl.duration);
    setCustomNotes(tpl.customNotes);
    setAppliedTemplateId(tpl.id);
    setTemplateNotification(
      tpl.language === "fr"
        ? `Modèle appliqué avec succès : ${tpl.title}`
        : `Template applied successfully: ${tpl.title}`
    );
    setTimeout(() => {
      setTemplateNotification(null);
    }, 4500);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resourceTitle.trim()) {
      setErrorMessage(
        isFrench
          ? "Veuillez saisir le titre de la ressource ou l'objet d'étude."
          : isEnglish
          ? "Please enter the target resource or lesson title."
          : "يرجى إدخال عنوان المورد المعرفي (موضوع الدرس المستهدف)"
      );
      return;
    }

    setIsLoading(true);

    try {
      const selectedLevelObj = ALGERIAN_LEVELS.find((l) => l.id === selectedLevel);
      const res = await fetch("/api/generate-fiche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: selectedLevelObj?.name || selectedLevel,
          subject: currentSubject?.name || selectedSubjectId,
          field:
            customFieldName ||
            (isFrench
              ? "Projet d'apprentissage"
              : isEnglish
              ? "Learning Sequence"
              : "ميدان تعليمي أساسي"),
          sequence:
            customSequenceName ||
            (isFrench
              ? "Séquence officielle"
              : isEnglish
              ? "Official Sequence"
              : "مقطع تعلمي رسمي"),
          resourceTitle: resourceTitle.trim(),
          sessionType,
          duration,
          ficheStyle,
          customNotes: customNotes.trim(),
          language: currentSubject?.language || (isFrench ? "fr" : isEnglish ? "en" : "ar"),
          userApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "تعذر توليد المذكرة، يرجى المحاولة ثانية");
      }

      const generatedFiche: PedagogicalFiche = {
        ...data.fiche,
        id: `fiche_${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };

      onGenerateSuccess(generatedFiche);
    } catch (err: any) {
      console.error("Generation error:", err);
      let rawMsg = err.message || String(err || "");

      // Try parsing if rawMsg is a JSON string from the API
      try {
        if (rawMsg.startsWith("{") && rawMsg.endsWith("}")) {
          const parsed = JSON.parse(rawMsg);
          if (parsed?.error?.message) {
            rawMsg = parsed.error.message;
          }
        }
      } catch {
        // ignore json parse error
      }

      if (
        rawMsg.includes("503") ||
        rawMsg.includes("high demand") ||
        rawMsg.includes("UNAVAILABLE")
      ) {
        setErrorMessage(
          "خوادم الذكاء الاصطناعي (Google Gemini) تشهد ضغطاً مؤقتاً وعالياً حالياً (خطأ 503 - High Demand). هذا الارتفاع مؤقت لبضع ثوانٍ فقط، يرجى الضغط على زر 'إعادة المحاولة الآن'."
        );
      } else if (rawMsg.includes("API_KEY_INVALID") || rawMsg.includes("API key not valid")) {
        setErrorMessage(
          "مفتاح Gemini API غير صالح أو منتهي الصلاحية. يرجى التحقق من المفتاح في الإعدادات أو إدخال مفتاح مخصص."
        );
      } else {
        setErrorMessage(rawMsg || "حدث خطأ غير متوقع أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter subjects based on language tab
  const filteredSubjects = ALGERIAN_SUBJECTS.filter((subject) => {
    if (languageFilter === "fr") return subject.language === "fr";
    if (languageFilter === "en") return subject.language === "en";
    if (languageFilter === "ar") return !subject.language || subject.language === "ar";
    return true; // 'all'
  });

  // Current foreign language templates
  const activeForeignTemplates = isFrench
    ? FRENCH_PEDAGOGICAL_TEMPLATES
    : isEnglish
    ? ENGLISH_PEDAGOGICAL_TEMPLATES
    : [];

  const filteredForeignTemplates = activeForeignTemplates.filter((t) => {
    if (activeTemplateCategory === "all") return true;
    return t.category === activeTemplateCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      {/* Header Introduction */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                المقاربة بالكفاءات • منهاج الجيل الثاني 2024
              </span>
              {(isFrench || isEnglish) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Languages className="w-3.5 h-3.5" />
                  {isFrench ? "Mode Langue Française (C.E.M)" : "English Language Mode (MS)"}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-['Amiri',serif]">
              إعداد وتوليد مذكرة بيداغوجية رسمية
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              اختر المستوى والمادة والمقطع لتوليد المذكرة الوزارية المتكاملة بجميع اللغات الرسمية المعتمدة (العربية، الفرنسية، الإنجليزية).
            </p>
          </div>

          {/* Quick Prebuilts */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">نماذج جاهزة سريعة:</span>
            <button
              type="button"
              onClick={() => onSelectPrebuilt(PREBUILT_FICHES[0])}
              className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              title="مذكرة علوم 4م - الهضم في الفم"
            >
              علوم 4م
            </button>
            <button
              type="button"
              onClick={() => onSelectPrebuilt(PREBUILT_FICHES[1])}
              className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              title="مذكرة فيزياء 4م - التحليل الكهربائي"
            >
              فيزياء 4م
            </button>
            <button
              type="button"
              onClick={() => onSelectPrebuilt(PREBUILT_FICHES[2])}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="مذكرة لغة عربية 4م - عطف النسق"
            >
              عربية 4م
            </button>
            {PREBUILT_FICHES[3] && (
              <button
                type="button"
                onClick={() => onSelectPrebuilt(PREBUILT_FICHES[3])}
                className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                title="Fiche Français 4AM - La proposition relative"
              >
                فرنسية 4م (FR)
              </button>
            )}
            {PREBUILT_FICHES[4] && (
              <button
                type="button"
                onClick={() => onSelectPrebuilt(PREBUILT_FICHES[4])}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                title="English Lesson Plan 4MS - Landmarks"
              >
                إنجليزية 4م (EN)
              </button>
            )}
          </div>
        </div>

        {/* Language Tabs Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              تخصيص لغة التدريس:
            </span>
            <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => handleLanguageTabClick("all")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  languageFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                جميع المواد
              </button>
              <button
                type="button"
                onClick={() => handleLanguageTabClick("ar")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  languageFilter === "ar"
                    ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                اللغة العربية
              </button>
              <button
                type="button"
                onClick={() => handleLanguageTabClick("fr")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  languageFilter === "fr"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-purple-700 hover:text-purple-900"
                }`}
              >
                <span>Français (C.E.M)</span>
                <span className="text-[10px] px-1 py-0.2 bg-white/20 rounded font-mono">FR</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageTabClick("en")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  languageFilter === "en"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-700 hover:text-emerald-900"
                }`}
              >
                <span>English (MS)</span>
                <span className="text-[10px] px-1 py-0.2 bg-white/20 rounded font-mono">EN</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-slate-500">
            {isFrench
              ? "Sélectionnez un modèle français ci-dessous pour remplir le formulaire"
              : isEnglish
              ? "Select an English template below to autofill the form"
              : "معالجة مستقلة تماماً للمصطلحات والترويسة البيداغوجية"}
          </span>
        </div>
      </div>

      {/* Applied Template Toast Banner */}
      {templateNotification && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs sm:text-sm font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{templateNotification}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">جاهز للتوليد الآن</span>
        </div>
      )}

      {/* Foreign Language Dedicated Templates Section */}
      {(isFrench || isEnglish) && activeForeignTemplates.length > 0 && (
        <div
          className={`mb-7 rounded-xl border p-4 sm:p-5 transition-all ${
            isFrench
              ? "bg-gradient-to-br from-purple-50/60 to-white border-purple-200"
              : "bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <BookmarkCheck
                className={`w-5 h-5 ${isFrench ? "text-purple-600" : "text-emerald-600"}`}
              />
              <h3
                className={`text-sm font-bold ${
                  isFrench ? "text-purple-950" : "text-emerald-950"
                }`}
              >
                {isFrench
                  ? "قوالب ومخططات بيداغوجية خاصة باللغة الفرنسية (Modèles de fiches - G2) :"
                  : "قوالب ومخططات بيداغوجية خاصة باللغة الإنجليزية (English CBA Lesson Templates) :"}
              </h3>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isFrench ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              نقرة واحدة لتعبئة النموذج رسمياً
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            {isFrench
              ? "نماذج جاهزة معتمدة لمادة اللغة الفرنسية بالتعليم المتوسط الجزائري (قواعد، فهم المنطوق، قراءة تحليلية، إنتاج كتابي) وفق منهاج الجيل الثاني."
              : "Official CBA lesson plan presets for Algerian Middle School English (Grammar PPU, Reading PDP, Listening & Speaking, Guided Writing)."}
          </p>

          {/* Filter Pills for Templates */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button
              type="button"
              onClick={() => setActiveTemplateCategory("all")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTemplateCategory === "all"
                  ? isFrench
                    ? "bg-purple-700 text-white font-bold"
                    : "bg-emerald-700 text-white font-bold"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              الكل (Tous)
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateCategory("grammar")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTemplateCategory === "grammar"
                  ? isFrench
                    ? "bg-purple-700 text-white font-bold"
                    : "bg-emerald-700 text-white font-bold"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {isFrench ? "Grammaire" : "Grammar (PPU)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateCategory("reading")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTemplateCategory === "reading"
                  ? isFrench
                    ? "bg-purple-700 text-white font-bold"
                    : "bg-emerald-700 text-white font-bold"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {isFrench ? "Compréhension de l'écrit" : "Reading (PDP)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateCategory("oral")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTemplateCategory === "oral"
                  ? isFrench
                    ? "bg-purple-700 text-white font-bold"
                    : "bg-emerald-700 text-white font-bold"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {isFrench ? "Oral & Écoute" : "Listening & Speaking"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateCategory("writing")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTemplateCategory === "writing"
                  ? isFrench
                    ? "bg-purple-700 text-white font-bold"
                    : "bg-emerald-700 text-white font-bold"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {isFrench ? "Production écrite" : "Writing & Integration"}
            </button>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredForeignTemplates.map((tpl) => {
              const isApplied = appliedTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  className={`p-3 rounded-lg border text-right transition-all flex flex-col justify-between ${
                    isApplied
                      ? isFrench
                        ? "border-purple-500 bg-purple-100/70 shadow-xs"
                        : "border-emerald-500 bg-emerald-100/70 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                          isFrench
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {tpl.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {tpl.category.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {tpl.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {tpl.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`mt-2.5 w-full py-1.5 px-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isApplied
                        ? isFrench
                          ? "bg-purple-700 text-white"
                          : "bg-emerald-700 text-white"
                        : isFrench
                        ? "bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم التطبيق (Appliqué)</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>تطبيق القالب في النموذج</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Step 1: Level Selection (الأطوار الأربعة) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              {isFrench
                ? "Niveau scolaire (Enseignement Moyen Algérien) :"
                : isEnglish
                ? "Grade / Form (Middle School Algeria) :"
                : "المستوى التعليمي:"}
            </label>
            <span className="text-[11px] text-slate-500">
              {isFrench ? "1AM, 2AM, 3AM ou 4AM" : isEnglish ? "1MS, 2MS, 3MS or 4MS" : "السنوات 1، 2، 3، 4 متوسط"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ALGERIAN_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.id;
              const displayBadge = isFrench
                ? level.id.toUpperCase()
                : isEnglish
                ? level.id.toUpperCase().replace("AM", "MS")
                : level.badge;
              const displayName = isFrench
                ? `${level.id[0]}ère/ème Année Moyenne`
                : isEnglish
                ? `${level.id[0]}th Year Middle School`
                : level.name;

              return (
                <button
                  type="button"
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-3 rounded-lg text-right transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs ring-1 ring-blue-500/20"
                      : "border border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/70 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                        isSelected
                          ? "bg-[#3b82f6] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {displayBadge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{displayName}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {level.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Subject Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              {isFrench
                ? "Matière d'enseignement (المادة الدراسية) :"
                : isEnglish
                ? "Teaching Subject (المادة الدراسية) :"
                : "المادة الدراسية:"}
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              تكييف تلقائي للمفردات والترويسة وسيرورة الدرس
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filteredSubjects.map((subject) => {
              const isSelected = selectedSubjectId === subject.id;
              const langBadge =
                subject.language === "fr"
                  ? "FR"
                  : subject.language === "en"
                  ? "EN"
                  : null;
              return (
                <button
                  type="button"
                  key={subject.id}
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`p-2.5 rounded-lg border text-right sm:text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-blue-600 bg-[#3b82f6] text-white font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between sm:justify-center gap-1.5">
                    <span className="text-xs font-bold truncate">{subject.name}</span>
                    {langBadge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {langBadge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Domain & Sequence Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFrench
                ? "Séquence d'apprentissage (المقطع التعلمي) :"
                : isEnglish
                ? "Learning Sequence (المقطع التعلمي) :"
                : "المقطع التعلمي (Séquence d'apprentissage):"}
            </label>
            <div className="relative">
              <select
                value={selectedSequenceId}
                onChange={handleSequenceChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 appearance-none font-medium"
              >
                {sequences.map((seq) => (
                  <option key={seq.id} value={seq.id}>
                    {seq.name}
                  </option>
                ))}
                <option value="custom">
                  {isFrench
                    ? "-- Saisie manuelle personnalisée --"
                    : isEnglish
                    ? "-- Custom Sequence Entry --"
                    : "-- كتابة مقطع وميدان مخصص --"}
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
            {selectedSequenceId === "custom" && (
              <input
                type="text"
                placeholder={
                  isFrench
                    ? "Ex: Séquence 1 : Bienvenue dans ma région..."
                    : isEnglish
                    ? "Ex: Sequence 1 : Universal Landmarks & Figures..."
                    : "أدخل اسم المقطع التعلمي..."
                }
                value={customSequenceName}
                onChange={(e) => setCustomSequenceName(e.target.value)}
                className="mt-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFrench
                ? "Projet ou Domaine d'apprentissage (المشروع / الميدان) :"
                : isEnglish
                ? "Project Theme / Domain (المشروع / الميدان) :"
                : "الميدان البيداغوجي (Domaine):"}
            </label>
            <input
              type="text"
              value={customFieldName}
              onChange={(e) => setCustomFieldName(e.target.value)}
              placeholder={
                isFrench
                  ? "Ex: Projet 1 : Créer un blog touristique / Le texte argumentatif..."
                  : isEnglish
                  ? "Ex: Interpersonal communication, Arts & National Heritage..."
                  : "مثال: الإنسان والصحة / الظواهر الميكانيكية..."
              }
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-medium"
            />
          </div>
        </div>

        {/* Suggested Resources pills from Official Syllabus */}
        {sequences.find((s) => s.id === selectedSequenceId)?.resources?.length ? (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-600">
                {isFrench
                  ? "Ressources officielles suggérées pour cette séquence :"
                  : isEnglish
                  ? "Suggested official syllabus resources for this sequence:"
                  : "الموارد المعرفية الرسمية المقترحة لهذا المقطع:"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sequences
                .find((s) => s.id === selectedSequenceId)!
                .resources.map((res) => {
                  const isCurrent = resourceTitle === res.title;
                  return (
                    <button
                      type="button"
                      key={res.id}
                      onClick={() => handleQuickResourceSelect(res.title)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-blue-50 text-blue-800 border-blue-300 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-200"
                      }`}
                    >
                      {res.title}
                    </button>
                  );
                })}
            </div>
          </div>
        ) : null}

        {/* Step 4: Resource Title (المورد المعرفي) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {isFrench
              ? "Titre de la ressource / Objet d'étude (عنوان المورد أو الدرس المستهدف) : *"
              : isEnglish
              ? "Target Resource / Learning Focus (عنوان المورد أو الدرس المستهدف) : *"
              : "عنوان المورد المعرفي (موضوع الدرس المستهدف): *"}
          </label>
          <input
            type="text"
            required
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            placeholder={
              isFrench
                ? "Ex: Grammaire : La subordonnée relative avec qui / que / où..."
                : isEnglish
                ? "Ex: Grammar : The Passive Voice in the Past Simple (was/were + p.p)..."
                : "مثال: التشبيه وأركانه / الهضم الكيميائي لمطبوخ النشاء..."
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        {/* Step 5: Session Type & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFrench
                ? "Nature de la séance / Type d'activité :"
                : isEnglish
                ? "Lesson Type / Pedagogical Framework :"
                : "طبيعة الحصة البيداغوجية:"}
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-medium"
            >
              {isFrench ? (
                <>
                  <option value="Apprentissage linguistique : Grammaire">
                    Apprentissage linguistique : Grammaire
                  </option>
                  <option value="Apprentissage linguistique : Vocabulaire / Lexique">
                    Apprentissage linguistique : Vocabulaire / Lexique
                  </option>
                  <option value="Apprentissage linguistique : Conjugaison">
                    Apprentissage linguistique : Conjugaison
                  </option>
                  <option value="Apprentissage linguistique : Orthographe">
                    Apprentissage linguistique : Orthographe
                  </option>
                  <option value="Compréhension de l'oral (Écoute & Restitution)">
                    Compréhension de l'oral (Écoute & Restitution)
                  </option>
                  <option value="Production de l'oral (Expression guidée / Débat)">
                    Production de l'oral (Expression guidée / Débat)
                  </option>
                  <option value="Compréhension de l'écrit (Lecture analytique du texte)">
                    Compréhension de l'écrit (Lecture analytique du texte)
                  </option>
                  <option value="Atelier d'écriture / Préparation à l'écrit">
                    Atelier d'écriture / Préparation à l'écrit
                  </option>
                  <option value="Production écrite (Situation d'intégration)">
                    Production écrite (Situation d'intégration)
                  </option>
                  <option value="Compte-rendu et remédiation pédagogique">
                    Compte-rendu et remédiation pédagogique
                  </option>
                </>
              ) : isEnglish ? (
                <>
                  <option value="Language Focus: Grammar & Language Forms (PPU Framework)">
                    Language Focus: Grammar & Language Forms (PPU Framework)
                  </option>
                  <option value="Language Focus: Lexis & Vocabulary Building">
                    Language Focus: Lexis & Vocabulary Building
                  </option>
                  <option value="Listening & Speaking (PDP Framework - I listen and do)">
                    Listening & Speaking (PDP Framework - I listen and do)
                  </option>
                  <option value="Reading Comprehension & Interpretation (PDP - I read and do)">
                    Reading Comprehension & Interpretation (PDP - I read and do)
                  </option>
                  <option value="Pronunciation & Phonics (Final -ed, diphthongs, word stress)">
                    Pronunciation & Phonics (Final -ed, diphthongs, word stress)
                  </option>
                  <option value="Guided Written Production (I learn to integrate)">
                    Guided Written Production (I learn to integrate)
                  </option>
                  <option value="Free Written Production (I think and write)">
                    Free Written Production (I think and write)
                  </option>
                  <option value="Assessment, Self-correction & Remediation">
                    Assessment, Self-correction & Remediation
                  </option>
                </>
              ) : (
                <>
                  <option value="إرساء موارد معرفية وتجريبية">إرساء موارد معرفية وتجريبية</option>
                  <option value="تعلم إدماجي (وضعية إدماجية جزئية)">تعلم إدماجي (وضعية إدماجية جزئية)</option>
                  <option value="وضعية انطلاقية أم للمقطع">وضعية انطلاقية مشكلة أم</option>
                  <option value="حصة تقويم ومعالجة بيداغوجية">حصة تقويم ومعالجة بيداغوجية</option>
                  <option value="أعمال مخبرية وتطبيقية موجهة">أعمال مخبرية وتطبيقية موجهة</option>
                  <option value="فهم المنطوق والإنتاج الشفوي">فهم المنطوق والإنتاج الشفوي</option>
                  <option value="فهم المكتوب (قراءة مشروحة ودراسة نص)">فهم المكتوب (قراءة مشروحة ودراسة نص)</option>
                  <option value="إنتاج المكتوب (تعبير كتابي)">إنتاج المكتوب (تعبير كتابي)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFrench
                ? "Durée de la séance :"
                : isEnglish
                ? "Session Timing / Duration :"
                : "المدة الزمنية المقررة للحصة:"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuration("1 ساعة (60 دقيقة)")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                  duration.includes("1")
                    ? "bg-blue-50 border-2 border-blue-600 text-blue-700"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-blue-200"
                }`}
              >
                {isFrench ? "1 heure (60 min)" : isEnglish ? "1 hour (60 min)" : "1 ساعة (60 دقيقة)"}
              </button>
              <button
                type="button"
                onClick={() => setDuration("2 ساعة (120 دقيقة)")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                  duration.includes("2")
                    ? "bg-blue-50 border-2 border-blue-600 text-blue-700"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-blue-200"
                }`}
              >
                {isFrench ? "2 heures (120 min)" : isEnglish ? "2 hours (120 min)" : "2 ساعة (120 دقيقة)"}
              </button>
            </div>
          </div>
        </div>

        {/* Step: Note Style Selection (نمط المذكرة وعمق الصياغة) */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  {isFrench
                    ? "Style de la fiche & Niveau de détail (نمط المذكرة) : *"
                    : isEnglish
                    ? "Lesson Plan Style & Detail Level (نمط المذكرة) : *"
                    : "نمط المذكرة وعمق الصياغة المطلوب: *"}
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isFrench
                    ? "Sélectionnez le niveau de détail et la longueur du déroulement didactique généré"
                    : isEnglish
                    ? "Select pedagogical depth and procedural length generated by AI"
                    : "حدد درجة التفصيل وطول محتوى سيرورة الحصة الملائم لاحتياجك البيداغوجي"}
                </p>
              </div>
            </div>

            <span className="self-start sm:self-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              {ficheStyle === "concise"
                ? isFrench
                  ? "⚡ Style Synthétique"
                  : isEnglish
                  ? "⚡ Concise Mode"
                  : "⚡ نمط مختصر وموجز"
                : ficheStyle === "technical"
                ? isFrench
                  ? "🛠️ Style Didactique C1/C2/C3"
                  : isEnglish
                  ? "🛠️ Technical CBA"
                  : "🛠️ نمط تقني وديدكتيكي"
                : isFrench
                ? "📜 Modèle Détaillé"
                : isEnglish
                ? "📜 Comprehensive Model"
                : "📜 نمط تفصيلي ونموذجي"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1: Concise (مختصر) */}
            <button
              type="button"
              onClick={() => setFicheStyle("concise")}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border-2 text-right transition-all cursor-pointer ${
                ficheStyle === "concise"
                  ? "bg-amber-50/70 border-amber-500 shadow-sm"
                  : "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        ficheStyle === "concise"
                          ? "bg-amber-500 text-white"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {isFrench ? "Synthétique & Concis" : isEnglish ? "Concise & Focused" : "مختصر وموجز"}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      ficheStyle === "concise"
                        ? "border-amber-600 bg-amber-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {ficheStyle === "concise" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isFrench
                    ? "Fiche allégée et directe : objectifs ciblés, étapes procédurales synthétiques et trace écrite épurée."
                    : isEnglish
                    ? "Compact lesson plan: sharp language targets, streamlined stages, and core board takeaway."
                    : "مذكرة مكثفة تركز على الكفاءات الجوهرية وسيرورة سريعة ومباشرة مع ملخص سبوري مرسي موجز دون تفاصيل ثانوية."}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                <span>{isFrench ? "⚡ Rapide & Essentiel" : isEnglish ? "⚡ Fast & Direct" : "⚡ تحضير سريع ومباشر"}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 text-[9px]">
                  {isFrench ? "Court" : isEnglish ? "Short" : "مقتضب"}
                </span>
              </div>
            </button>

            {/* Card 2: Detailed (تفصيلي - الافتراضي) */}
            <button
              type="button"
              onClick={() => setFicheStyle("detailed")}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border-2 text-right transition-all cursor-pointer ${
                ficheStyle === "detailed"
                  ? "bg-blue-50/70 border-blue-600 shadow-sm"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        ficheStyle === "detailed"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {isFrench ? "Détaillé & Approfondi" : isEnglish ? "Detailed & In-Depth" : "تفصيلي ونموذجي"}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      ficheStyle === "detailed"
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {ficheStyle === "detailed" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isFrench
                    ? "Déroulement exhaustif : questions d'étayage orales de l'enseignant, réponses attendues et bilan riche."
                    : isEnglish
                    ? "Full classroom procedures, explicit scaffolding questions, anticipated answers, and rich board record."
                    : "تفصيل وافٍ لمسار الحصة، أسئلة الأستاذ الحوارية نصياً، فرضيات وأجوبة التلاميذ، واستراتيجيات الأفواج."}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-blue-800 font-semibold">
                <span>{isFrench ? "📜 Modèle d'excellence" : isEnglish ? "📜 Standard Master" : "📜 النموذج المتكامل"}</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-900 text-[9px] font-bold">
                  {isFrench ? "Recommandé" : isEnglish ? "Recommended" : "موصى به"}
                </span>
              </div>
            </button>

            {/* Card 3: Technical (تقني) */}
            <button
              type="button"
              onClick={() => setFicheStyle("technical")}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border-2 text-right transition-all cursor-pointer ${
                ficheStyle === "technical"
                  ? "bg-emerald-50/70 border-emerald-600 shadow-sm"
                  : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        ficheStyle === "technical"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {isFrench ? "Technique & Didactique" : isEnglish ? "Technical & Didactic" : "تقني وديدكتيكي"}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      ficheStyle === "technical"
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {ficheStyle === "technical" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isFrench
                    ? "Critères officiels formels (C1, C2, C3), formulation comportementale rigoureuse et supports techniques."
                    : isEnglish
                    ? "Measurable behavioral outcomes, rubric-based formative criteria (C1/C2/C3), and didactic matrix."
                    : "صياغة سلوكية إجرائية دقيقة، تصنيف معايير ومؤشرات C1/C2/C3، واستثمار السندات والمحاكاة التجريبية والتقنية."}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
                <span>{isFrench ? "🛠️ Critérié & Procédural" : isEnglish ? "🛠️ Rubrics & Metrics" : "🛠️ معايير C1/C2/C3"}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-900 text-[9px]">
                  {isFrench ? "Inspection" : isEnglish ? "Inspectorate" : "تفتيشي دقيق"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 6: Custom Teacher Notes (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {isFrench
              ? "Consignes pédagogiques et supports spécifiques (توجيهات وسندات خاصة بالأستاذ) :"
              : isEnglish
              ? "Teacher's Special Focus & Didactic Aids (توجيهات وسندات خاصة بالأستاذ) :"
              : "توجيهات إضافية خاصة بالأستاذ (اختياري):"}
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder={
              isFrench
                ? "Ex: Manuel scolaire 4AM p. 24, travail en binômes, insister sur la valeur de l'antécédent et la ponctuation..."
                : isEnglish
                ? "Ex: Coursebook p. 32, flashcards of Algerian landmarks, pair interaction, fill-in biographical chart..."
                : "مثال: التركيز على العمل بالأفواج، ربط الحصة بالواقع المعيشي للجزائر، استخدام جهاز العرض..."
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        {/* Error message display with retry action */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">تنبيه في الخادم:</p>
                <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="self-end sm:self-center px-4 py-2 bg-[#3b82f6] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              إعادة المحاولة الآن
            </button>
          </div>
        )}

        {/* Submit Button & Official Note Card */}
        <div className="pt-2 space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isFrench
                ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                : isEnglish
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                : "bg-[#3b82f6] hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {isFrench
                    ? "Génération de la fiche pédagogique en cours..."
                    : isEnglish
                    ? "Generating official CBA lesson plan..."
                    : "جاري صياغة وتوليد المذكرة البيداغوجية الذكية..."}
                </span>
              </>
            ) : (
              <>
                <span>
                  {isFrench
                    ? "Générer la Fiche Pédagogique Officielle (توليد المذكرة)"
                    : isEnglish
                    ? "Generate Official CBA Lesson Plan (توليد المذكرة)"
                    : "توليد المذكرة البيداغوجية الذكية"}
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              {isFrench
                ? "Les fiches de français sont rédigées selon le programme officiel de 2ème Génération (G2), les guides méthodologiques de l'inspecteur et l'Approche par Compétences (APC)."
                : isEnglish
                ? "English lesson plans follow the official 2nd Generation CBA guidelines, PDP / PPU teaching stages, and Algerian Ministry of National Education syllabi."
                : "يتم بناء المذكرات بناءً على المخططات السنوية الرسمية لوزارة التربية الوطنية الجزائرية ومناهج الجيل الثاني المعتمدة."}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

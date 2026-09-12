import React, { useState } from "react";
import {
  Printer,
  Edit3,
  Check,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  Download,
  FileDown,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  FileText,
  Save,
  CheckCircle,
  BookOpen,
  Type,
  Palette,
  Moon,
  Sun,
  X,
  ChevronDown,
} from "lucide-react";
import { PedagogicalFiche } from "../types";
import { exportFicheToPdf } from "../utils/pdfExport";
import { exportFicheToWordDoc, exportFicheToDocx } from "../utils/wordExport";
import { ShareFicheModal } from "./ShareFicheModal";
import { CopyContentModal } from "./CopyContentModal";
import { convertFicheToMarkdown } from "../utils/ficheTextExport";
import { copyToClipboard } from "../utils/shareUtils";

interface FicheViewerProps {
  fiche: PedagogicalFiche;
  onUpdateFiche: (updatedFiche: PedagogicalFiche) => void;
  onSaveToArchive: (fiche: PedagogicalFiche) => void;
  isSaved: boolean;
  onBackToForm: () => void;
}

export const FicheViewer: React.FC<FicheViewerProps> = ({
  fiche,
  onUpdateFiche,
  onSaveToArchive,
  isSaved,
  onBackToForm,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableFiche, setEditableFiche] = useState<PedagogicalFiche>(fiche);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // PDF Export State (تصدير كملف PDF عالي الجودة عبر jsPDF)
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Word Export State (تصدير كملف Word قابل للتعديل والإضافة)
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [wordExportSuccess, setWordExportSuccess] = useState<boolean>(false);
  const [showWordMenu, setShowWordMenu] = useState<boolean>(false);

  // Reading Mode State (وضع القراءة المريح)
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
  const [readingFontSize, setReadingFontSize] = useState<"normal" | "large" | "xlarge">("large");
  const [readingTheme, setReadingTheme] = useState<"sepia" | "night" | "contrast">("sepia");

  // Share Modal State (مشاركة المذكرة عبر رابط أو رمز QR)
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Copy Content Modal & Quick Copy State (نسخ نص المذكرة كـ Markdown أو نص عادي)
  const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);
  const [quickCopySuccess, setQuickCopySuccess] = useState<boolean>(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setEditableFiche(fiche);
  }, [fiche]);

  // Reading Mode theme constants
  const isSepia = isReadingMode && readingTheme === "sepia";
  const isNight = isReadingMode && readingTheme === "night";
  const isHighContrast = isReadingMode && readingTheme === "contrast";

  // Detect language of the current fiche
  const isFrench =
    editableFiche.header.language === "fr" ||
    editableFiche.header.subject?.toLowerCase().includes("franç") ||
    editableFiche.header.subject?.toLowerCase().includes("franc") ||
    editableFiche.header.subject?.includes("فرنسية");

  const isEnglish =
    editableFiche.header.language === "en" ||
    editableFiche.header.subject?.toLowerCase().includes("anglais") ||
    editableFiche.header.subject?.toLowerCase().includes("english") ||
    editableFiche.header.subject?.includes("إنجليزية") ||
    editableFiche.header.subject?.includes("انجليزية");

  const isForeign = isFrench || isEnglish;

  const labels = isFrench
    ? {
        defaultRepublic: "République Algérienne Démocratique et Populaire",
        defaultMinistry: "Ministère de l'Éducation Nationale",
        directorate: "Direction de l'Éducation :",
        school: "Établissement (C.E.M) :",
        schoolLogo: "Sceau / Logo",
        ficheTitle: `FICHE PÉDAGOGIQUE OFFICIELLE N° ${editableFiche.header.ficheNumber || "01"}`,
        ficheSubtitle: "Approche par compétences - Programme de 2ème Génération",
        teacher: "Professeur(e) :",
        year: "Année scolaire :",
        level: "Niveau scolaire :",
        subject: "Matière :",
        field: "Projet / Domaine :",
        sequence: "Séquence d'apprentissage :",
        resource: "Ressource ciblée / Objet d'étude :",
        sessionType: "Nature de la séance :",
        durationAndNum: "Durée & N° :",
        competenciesTitle: "I. CADRE PÉDAGOGIQUE & COMPÉTENCES VISÉES (G2)",
        globalComp: "Compétence globale du cycle :",
        terminalComp: "Compétence terminale :",
        compComponents: "Composantes de la compétence :",
        indicators: "Critères & indicateurs d'évaluation :",
        supports: "Supports et matériel didactique :",
        values: "Valeurs et attitudes ciblées :",
        flowTitle: "II. DÉROULEMENT MÉTHODOLOGIQUE DE LA SÉANCE",
        phaseCol: "Moments / Durée",
        contentCol: "Contenus d'apprentissage",
        activitiesCol: "Activités d'enseignement-apprentissage (Rôle enseignant / apprenant)",
        evalCol: "Évaluation formative",
        teacherRole: "Rôle de l'enseignant (Consignes & Guidage) :",
        studentRole: "Rôle de l'apprenant (Tâches & Réalisation) :",
        strategy: "Modalité de travail :",
        boardTitle: "III. TRACE ÉCRITE AU TABLEAU (RÉSUMÉ POUR CAHIER DE L'ÉLÈVE)",
        rule: "Règle de synthèse :",
        homeTitle: "IV. TRAVAIL EN AUTONOMIE & DEVOIR À DOMICILE",
        evalSelfTitle: "V. AUTO-ÉVALUATION & REMARQUES PÉDAGOGIQUES",
        forTeacher: "Réservé à l'enseignant après la séance",
        notes: "Remarques pédagogiques :",
        difficulties: "Difficultés prévues et remédiation :",
        sigTeacher: "Visa de l'Enseignant(e)",
        sigPrincipal: "Visa du Directeur du C.E.M",
        sigInspector: "Visa de l'Inspecteur de l'Éducation Nationale",
      }
    : isEnglish
    ? {
        defaultRepublic: "People's Democratic Republic of Algeria",
        defaultMinistry: "Ministry of National Education",
        directorate: "Directorate of Education :",
        school: "Middle School :",
        schoolLogo: "School Seal / Logo",
        ficheTitle: `OFFICIAL PEDAGOGICAL LESSON PLAN N° ${editableFiche.header.ficheNumber || "01"}`,
        ficheSubtitle: "Competency-Based Approach - Middle School (2nd Generation Curriculum)",
        teacher: "Teacher :",
        year: "School Year :",
        level: "Level / Form :",
        subject: "Subject :",
        field: "Domain / Project :",
        sequence: "Learning Sequence :",
        resource: "Learning Focus / Target Structure :",
        sessionType: "Lesson Framework / Type :",
        durationAndNum: "Duration & Fiche N° :",
        competenciesTitle: "I. TARGET COMPETENCIES & DIDACTIC OBJECTIVES (CBA - G2)",
        globalComp: "Global Competence :",
        terminalComp: "Terminal Competence :",
        compComponents: "Competence Components / Objectives :",
        indicators: "Assessment Indicators & Success Criteria :",
        supports: "Didactic Materials & Aids :",
        values: "Cross-curricular Values & Attitudes :",
        flowTitle: "II. LESSON PROCEDURE & CLASSROOM INTERACTION",
        phaseCol: "Stages & Timing",
        contentCol: "Content & Target Language",
        activitiesCol: "Teaching & Learning Activities (Teacher / Pupils)",
        evalCol: "Formative Assessment",
        teacherRole: "Teacher's Tasks (Instructions & Facilitation) :",
        studentRole: "Pupils' Activities (Tasks & Interaction) :",
        strategy: "Grouping / Interaction :",
        boardTitle: "III. BOARD RECORD / SUMMARY (PUPIL'S COPYBOOK)",
        rule: "Takeaway Rule :",
        homeTitle: "IV. HOMEWORK & INTEGRATION TASK",
        evalSelfTitle: "V. TEACHER'S SELF-EVALUATION & POST-LESSON REFLECTION",
        forTeacher: "For teacher's pedagogical review post-lesson",
        notes: "Pedagogical Notes :",
        difficulties: "Anticipated Difficulties & Remediation :",
        sigTeacher: "Teacher's Signature",
        sigPrincipal: "Middle School Headmaster's Visa",
        sigInspector: "National Education Inspector's Visa",
      }
    : {
        defaultRepublic: "الجمهورية الجزائرية الديمقراطية الشعبية",
        defaultMinistry: "وزارة التربية الوطنية",
        directorate: "مديرية التربية لولاية :",
        school: "متوسطة :",
        schoolLogo: "شعار المؤسسة",
        ficheTitle: `مذكرة تعليمية بيداغوجية رقم: ${editableFiche.header.ficheNumber || "01"}`,
        ficheSubtitle: "وفق المقاربة بالكفاءات ومنهاج الجيل الثاني المعتمد",
        teacher: "الأستاذ(ة) :",
        year: "السنة الدراسية :",
        level: "المستوى الدراسي :",
        subject: "المادة :",
        field: "الميدان البيداغوجي :",
        sequence: "المقطع التعلمي :",
        resource: "المورد المعرفي المستهدف :",
        sessionType: "طبيعة الحصة :",
        durationAndNum: "المدة الزمنية / رقم المذكرة :",
        competenciesTitle: "أولاً: شبكة الكفاءات المستهدفة والسندات الديدكتيكية",
        globalComp: "الكفاءة الشاملة للطور/المستوى :",
        terminalComp: "الكفاءة الختامية للميدان :",
        compComponents: "مركّبات الكفاءة :",
        indicators: "معايير ومؤشرات التقويم :",
        supports: "السندات والدعائم الديدكتيكية :",
        values: "القيم والمواقف المستهدفة :",
        flowTitle: "ثانياً: سيرورة الحصة التعليمية التعلمية (مراحل الدرس)",
        phaseCol: "المراحل والزمن",
        contentCol: "عناصر المحتوى (المورد)",
        activitiesCol: "نشاطات التعليم والتعلم (سيرورة التعلم)",
        evalCol: "التقويم التكويني",
        teacherRole: "دور الأستاذ (التوجيه والتسيير) :",
        studentRole: "دور المتعلم (المهام والإنجاز) :",
        strategy: "طريقة العمل :",
        boardTitle: "ثالثاً: الملخص السبوري والمورد المعرفي المُرسي (المسجل على كراس التلميذ)",
        rule: "قاعدة ختامية :",
        homeTitle: "رابعاً: النشاط الإدماجي المنزلي / التقويم الذاتي للمتعلم",
        evalSelfTitle: "خامساً: النقد الذاتي والتأمل المهني للأستاذ (Auto-évaluation)",
        forTeacher: "خاص بالأستاذ بعد إنجاز الحصة",
        notes: "ملاحظات بيداغوجية :",
        difficulties: "الصعوبات المتوقعة ومعالجتها :",
        sigTeacher: "تأشيرة الأستاذ(ة)",
        sigPrincipal: "تأشيرة السيد مدير المتوسطة",
        sigInspector: "تأشيرة السيد مفتش التربية الوطنية",
      };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdit = () => {
    onUpdateFiche(editableFiche);
    setIsEditing(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      const textToCopy = `${editableFiche.header.republic || labels.defaultRepublic}
${editableFiche.header.ministry || labels.defaultMinistry}
${labels.ficheTitle}
${labels.level} ${editableFiche.header.level} | ${labels.subject} ${editableFiche.header.subject}
${labels.field} ${editableFiche.header.field} | ${labels.sequence} ${editableFiche.header.sequence}
${labels.resource} ${editableFiche.header.resourceTitle}
${labels.sessionType} ${editableFiche.header.sessionType} | ${labels.durationAndNum} ${editableFiche.header.duration}

${labels.competenciesTitle}:
- ${labels.globalComp} ${editableFiche.competencies.globalCompetence}
- ${labels.terminalComp} ${editableFiche.competencies.terminalCompetence}
- ${labels.compComponents}:
${editableFiche.competencies.competenceComponents.map((c) => `  * ${c}`).join("\n")}
- ${labels.indicators}:
${editableFiche.competencies.assessmentIndicators.map((a) => `  * ${a}`).join("\n")}
- ${labels.supports}:
${editableFiche.competencies.didacticSupports.map((d) => `  * ${d}`).join("\n")}

${labels.flowTitle}:
${editableFiche.steps
  .map(
    (step) => `
[${step.phase} - ${step.timing}]
- ${labels.contentCol}: ${step.contentElement}
- ${labels.teacherRole}: ${step.teacherActivity}
- ${labels.studentRole}: ${step.studentActivity}
- ${labels.strategy}: ${step.strategy || "..."}
- ${labels.evalCol}: ${step.formativeAssessment}`
  )
  .join("\n--------------------------\n")}

${labels.boardTitle}:
${editableFiche.boardSummary.title}
${editableFiche.boardSummary.points.map((p) => `* ${p}`).join("\n")}
${editableFiche.boardSummary.takeawayRule ? `${labels.rule} ${editableFiche.boardSummary.takeawayRule}` : ""}

${labels.homeTitle}:
${editableFiche.homeAssignment}
`;

      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setPdfError(null);
    try {
      const subject = editableFiche.header.subject || (isFrench ? "Matiere" : isEnglish ? "Subject" : "مادة");
      const title = editableFiche.header.resourceTitle || editableFiche.header.field || (isFrench ? "Fiche" : isEnglish ? "Fiche" : "مذكرة");
      const sanitizedSubject = subject.replace(/[\/\\?%*:|"<>]/g, "-").trim();
      const sanitizedTitle = title.replace(/[\/\\?%*:|"<>]/g, "-").trim();
      const fileName = isFrench
        ? `Fiche_Pedagogique_${sanitizedSubject}_${sanitizedTitle}.pdf`
        : isEnglish
        ? `Pedagogical_Fiche_${sanitizedSubject}_${sanitizedTitle}.pdf`
        : `مذكرة_${sanitizedSubject}_${sanitizedTitle}.pdf`;

      await exportFicheToPdf("printable-fiche", {
        fileName,
        title: `${editableFiche.header.subject} - ${editableFiche.header.resourceTitle}`,
        author: editableFiche.header.teacherName || (isFrench ? "Enseignant" : isEnglish ? "Teacher" : "أستاذ المادة"),
        subject: editableFiche.header.subject,
      });

      setPdfExportSuccess(true);
      setTimeout(() => setPdfExportSuccess(false), 3500);
    } catch (err: any) {
      console.error("PDF export failed:", err);
      setPdfError(
        isFrench
          ? "Échec de l'exportation PDF. Vous pouvez utiliser l'impression navigateur comme alternative."
          : isEnglish
          ? "PDF export failed. You can use the browser print dialog instead."
          : "تعذر تصدير ملف PDF، يمكنك استخدام خيار الطباعة الورقية كبديل."
      );
      setTimeout(() => setPdfError(null), 5000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportWord = async (format: "doc" | "docx" = "doc") => {
    setIsExportingWord(true);
    setShowWordMenu(false);
    try {
      if (format === "doc") {
        exportFicheToWordDoc(editableFiche);
      } else {
        await exportFicheToDocx(editableFiche);
      }
      setWordExportSuccess(true);
      setTimeout(() => setWordExportSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to export Word document:", err);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Typography scaling classes for reading mode
  const fontBodyClass = isReadingMode
    ? readingFontSize === "xlarge"
      ? "text-base sm:text-lg leading-relaxed"
      : readingFontSize === "large"
      ? "text-sm sm:text-base leading-relaxed"
      : "text-xs sm:text-sm leading-normal"
    : "text-xs sm:text-sm";

  const fontTableCellClass = isReadingMode
    ? readingFontSize === "xlarge"
      ? "text-sm sm:text-base p-3.5 leading-relaxed"
      : readingFontSize === "large"
      ? "text-xs sm:text-sm p-3 leading-relaxed"
      : "text-xs sm:text-sm p-2"
    : "text-xs sm:text-sm p-2";

  // Dynamic Theme Palette
  const theme = {
    container: isSepia
      ? "bg-[#fbf7ee] text-[#2c2416] border-[#d7cbaf] shadow-lg"
      : isNight
      ? "bg-[#0b1120] text-[#f1f5f9] border-[#334155] shadow-2xl"
      : isHighContrast
      ? "bg-white text-black border-2 border-black shadow-xl"
      : "bg-white text-slate-900 border-slate-300 shadow-[0_0_15px_rgba(0,0,0,0.05)]",

    headerBorder: isSepia
      ? "border-b-2 border-[#8c7355]"
      : isNight
      ? "border-b-2 border-[#475569]"
      : isHighContrast
      ? "border-b-4 border-black"
      : "border-b-2 border-slate-800",

    subText: isSepia
      ? "text-[#6b583f]"
      : isNight
      ? "text-[#94a3b8]"
      : isHighContrast
      ? "text-black font-semibold"
      : "text-slate-600",

    tableBorder: isSepia
      ? "border-[#b8a68b]"
      : isNight
      ? "border-[#334155]"
      : isHighContrast
      ? "border-2 border-black"
      : "border-slate-800",

    tableCellBorder: isSepia
      ? "border-[#d7cbaf]"
      : isNight
      ? "border-[#334155]"
      : isHighContrast
      ? "border border-black"
      : "border-slate-700",

    tableHeaderBg: isSepia
      ? "bg-[#544331] text-[#fff8ee]"
      : isNight
      ? "bg-[#1e293b] text-[#f8fafc]"
      : isHighContrast
      ? "bg-black text-white font-extrabold"
      : "bg-slate-800 text-white",

    tableLabelCol: isSepia
      ? "bg-[#ede2ce] text-[#2c2416]"
      : isNight
      ? "bg-[#1e293b] text-[#f8fafc]"
      : isHighContrast
      ? "bg-black text-white font-extrabold"
      : "bg-slate-100 text-slate-900",

    resourceHighlight: isSepia
      ? "bg-[#e8f0e6] text-[#1c3818] border-[#c0d6bc]"
      : isNight
      ? "bg-[#064e3b]/50 text-[#6ee7b7] border-[#047857]"
      : isHighContrast
      ? "bg-yellow-200 text-black border-2 border-black font-extrabold"
      : "bg-emerald-50/40 text-emerald-950 border-slate-700",

    tableRowHover: isSepia
      ? "hover:bg-[#f5ede0]"
      : isNight
      ? "hover:bg-[#162238]"
      : isHighContrast
      ? "hover:bg-slate-100"
      : "hover:bg-slate-50/50",

    teacherCard: isSepia
      ? "bg-[#f2e9d7] border-[#d8cbb3] text-[#2c2416]"
      : isNight
      ? "bg-[#162238] border-[#334155] text-[#e2e8f0]"
      : isHighContrast
      ? "bg-slate-100 border border-black text-black font-medium"
      : "bg-slate-50 border-slate-200/80 text-slate-800",

    studentCard: isSepia
      ? "bg-[#e8f0e6] border-[#c0d6bc] text-[#1c3818]"
      : isNight
      ? "bg-[#064e3b]/40 border-[#047857]/60 text-[#a7f3d0]"
      : isHighContrast
      ? "bg-yellow-50 border-2 border-black text-black font-semibold"
      : "bg-emerald-50/40 border-emerald-100 text-slate-800",

    timingBadge: isSepia
      ? "bg-[#dfd3bc] text-[#4f3e2b]"
      : isNight
      ? "bg-[#1e3a8a] text-[#bfdbfe]"
      : isHighContrast
      ? "bg-black text-white font-extrabold"
      : "bg-emerald-100 text-emerald-800",

    boardContentBg: isSepia
      ? "bg-[#f6efe4] border-[#cbbca3]"
      : isNight
      ? "bg-[#111827] border-[#334155]"
      : isHighContrast
      ? "bg-white border-2 border-black"
      : "bg-slate-50/50 border-slate-200",

    takeawayRule: isSepia
      ? "bg-[#fbedd0] text-[#4a3411] border-[#d7b77b]"
      : isNight
      ? "bg-[#422006]/90 text-[#fef08a] border-[#a16207]"
      : isHighContrast
      ? "bg-yellow-200 text-black border-2 border-black font-extrabold"
      : "bg-amber-50/80 border-amber-200 text-amber-950",

    cardBoxBorder: isSepia
      ? "border-[#cbbca3]"
      : isNight
      ? "border-[#334155]"
      : isHighContrast
      ? "border-2 border-black"
      : "border-slate-700",

    footerBorder: isSepia
      ? "border-[#d7cbaf]"
      : isNight
      ? "border-[#334155]"
      : isHighContrast
      ? "border-black"
      : "border-slate-300",
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <span>توليد مذكرة أخرى</span>
          </button>
          <span className="h-5 w-px bg-slate-200" />
          <span className="text-xs sm:text-sm font-bold text-slate-600">
            معاينة المذكرة الرسمية ({editableFiche.header.subject} • {editableFiche.header.level})
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Reading Mode Button */}
          <button
            type="button"
            onClick={() => setIsReadingMode(!isReadingMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
              isReadingMode
                ? "bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-400/30"
                : "bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
            }`}
            title="تفعيل وضع القراءة المريح لمراجعة المذكرات الطويلة دون إجهاد العين"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isReadingMode ? "إلغاء وضع القراءة" : "وضع القراءة"}</span>
          </button>

          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#3b82f6] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التعديلات</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 bg-white cursor-pointer"
              title="تعديل مباشر على نصوص وبيانات المذكرة"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>تعديل يدوي</span>
            </button>
          )}

          {/* Word Export Button (.doc / .docx) */}
          <div className="relative inline-flex items-center">
            <div className="inline-flex rounded-lg shadow-xs">
              <button
                type="button"
                onClick={() => handleExportWord("doc")}
                disabled={isExportingWord}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-s-lg border transition-all cursor-pointer ${
                  wordExportSuccess
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : isExportingWord
                    ? "bg-blue-50 text-blue-800 border-blue-200 cursor-wait"
                    : "bg-white text-blue-900 border-slate-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800"
                }`}
                title="تصدير المذكرة كملف Word كامل التنسيق قابل للتعديل والإضافة في Microsoft Word"
              >
                {isExportingWord ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>جاري التصدير...</span>
                  </>
                ) : wordExportSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span>تم تصدير Word!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>تصدير Word (.doc)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowWordMenu(!showWordMenu)}
                className="px-1.5 py-1.5 text-xs font-bold bg-white text-slate-600 border-y border-e border-slate-300 rounded-e-lg hover:bg-slate-100 cursor-pointer"
                title="خيارات صيغ Word (DOC / DOCX)"
              >
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
            </div>

            {showWordMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1.5 text-xs animate-fadeIn"
                onMouseLeave={() => setShowWordMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => handleExportWord("doc")}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-800 flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Word منسق (.doc) • موصى به</div>
                    <div className="text-[11px] text-slate-500">جداول ملونة كاملة، خطوط عربية، وهوامش A4 جاهزة للتعديل المباشر في Word</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportWord("docx")}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-800 flex items-start gap-2.5 cursor-pointer transition-colors mt-1"
                >
                  <FileText className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">مستند حديث (.docx)</div>
                    <div className="text-[11px] text-slate-500">صيغة OpenXML القياسية للإصدارات الحديثة وتطبيقات الهاتف</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleCopyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 bg-white cursor-pointer"
            title="نسخ نص المذكرة منسقاً للصق السريع"
          >
            {copySuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-700 font-bold">تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">نسخ النص</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSaveToArchive(editableFiche)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border cursor-pointer ${
              isSaved
                ? "bg-blue-50 text-blue-800 border-blue-300 font-semibold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title="حفظ في سجل مذكراتي"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>محفوظة</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">حفظ بأرشيفي</span>
              </>
            )}
          </button>

          {/* PDF Export via jsPDF Button */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer ${
              pdfExportSuccess
                ? "bg-emerald-600 text-white"
                : isExportingPdf
                ? "bg-blue-400 text-white cursor-wait opacity-90"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-sm"
            }`}
            title="تصدير المذكرة كملف PDF منظم وعالي الدقة عبر jsPDF لمشاركتها وحفظها رقمياً"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري إنشاء PDF...</span>
              </>
            ) : pdfExportSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                <span>تم تنزيل الـ PDF !</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-blue-100" />
                <span>تصدير PDF (jsPDF)</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 bg-white cursor-pointer"
            title="طباعة ورقية رسمية A4 عبر نافذة المتصفح"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>طباعة A4</span>
          </button>

          {/* Share Fiche with Colleagues (رابط مشاركة مشفر + رمز QR) */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 cursor-pointer shadow-2xs"
            title="مشاركة المذكرة مع الزملاء برابط مباشر أو رمز QR"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>مشاركة (رابط / QR)</span>
          </button>

          {/* Copy Content to Clipboard (نسخ نص المذكرة بتنسيق Markdown أو نص عادي) */}
          <div className="relative inline-flex items-center rounded-lg border border-slate-300 bg-white shadow-2xs">
            <button
              type="button"
              onClick={async () => {
                const md = convertFicheToMarkdown(editableFiche);
                const success = await copyToClipboard(md);
                if (success) {
                  setQuickCopySuccess(true);
                  setTimeout(() => setQuickCopySuccess(false), 2500);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-r-lg ${
                quickCopySuccess
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              title="نسخ نص المذكرة بالكامل بتنسيق Markdown فوراً إلى الحافظة"
            >
              {quickCopySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>نسخ المحتوى</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsCopyModalOpen(true)}
              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-r border-slate-200 rounded-l-lg transition-colors cursor-pointer"
              title="خيارات النسخ (اختيار صيغة Markdown أو نص عادي ومعاينة النص)"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {pdfError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2 print:hidden animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{pdfError}</span>
        </div>
      )}

      {/* Reading Mode Control Bar (Visible only when Reading Mode is Active) */}
      {isReadingMode && (
        <div className="bg-amber-50/95 border border-amber-300/90 rounded-2xl p-4 sm:p-5 shadow-sm print:hidden flex flex-wrap items-center justify-between gap-4 transition-all animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-amber-950">وضع القراءة المريح مفعّل (Reading Mode)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  راحة بصرية وتكبير الخط
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                تكبير الخط وضبط تباين الألوان لمراجعة المذكرات الطويلة والمتشعبة بأريحية تامة ودون إجهاد بصري.
              </p>
            </div>
          </div>

          {/* Reading Mode Controls: Font Size Scaling + Contrast Themes */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Font Size Selector */}
            <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-amber-700" />
                <span>حجم الخط:</span>
              </span>
              <button
                type="button"
                onClick={() => setReadingFontSize("normal")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  readingFontSize === "normal"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-amber-100/70"
                }`}
                title="حجم خط عادي"
              >
                A عادي
              </button>
              <button
                type="button"
                onClick={() => setReadingFontSize("large")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  readingFontSize === "large"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-amber-100/70"
                }`}
                title="حجم خط كبير ومريح (+15%)"
              >
                A+ كبير
              </button>
              <button
                type="button"
                onClick={() => setReadingFontSize("xlarge")}
                className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                  readingFontSize === "xlarge"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-amber-100/70"
                }`}
                title="حجم خط مكبر جداً (+30%)"
              >
                A++ مكبر
              </button>
            </div>

            {/* Contrast / Color Theme Selector */}
            <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-700" />
                <span>التباين:</span>
              </span>
              <button
                type="button"
                onClick={() => setReadingTheme("sepia")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  readingTheme === "sepia"
                    ? "bg-[#8c7355] text-white shadow-xs"
                    : "text-slate-700 hover:bg-amber-100/70"
                }`}
                title="ورق كلاسيكي دافئ مريح للعينين"
              >
                <span className="w-2 h-2 rounded-full bg-[#fbf7ee] border border-[#8c7355]" />
                <span>ورقي دافئ (Sepia)</span>
              </button>
              <button
                type="button"
                onClick={() => setReadingTheme("night")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  readingTheme === "night"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-amber-100/70"
                }`}
                title="وضع ليلي داكن عالي التباين"
              >
                <Moon className="w-3 h-3 text-blue-300" />
                <span>ليلي داكن (Night)</span>
              </button>
              <button
                type="button"
                onClick={() => setReadingTheme("contrast")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  readingTheme === "contrast"
                    ? "bg-black text-white shadow-xs"
                    : "text-slate-700 hover:bg-amber-100/70"
                }`}
                title="تباين ناصع أبيض وأسود"
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>تباين أبيض (Monochrome)</span>
              </button>
            </div>

            {/* Quick Close Button */}
            <button
              type="button"
              onClick={() => setIsReadingMode(false)}
              className="p-1.5 rounded-lg text-amber-900 hover:bg-amber-200/80 transition-colors cursor-pointer"
              title="إغلاق وضع القراءة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* The Printable Official Algerian Pedagogical Document Container */}
      <div
        id="printable-fiche"
        dir={isForeign ? "ltr" : "rtl"}
        className={`w-full border-2 border-double p-6 sm:p-10 flex flex-col transition-all duration-200 rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none print:bg-white print:text-black ${
          isForeign ? "text-left font-sans" : "text-right"
        } ${theme.container} ${
          isReadingMode
            ? readingFontSize === "xlarge"
              ? "text-base sm:text-lg space-y-8 max-w-5xl mx-auto font-medium"
              : readingFontSize === "large"
              ? "text-sm sm:text-base space-y-7 max-w-5xl mx-auto"
              : "text-xs sm:text-sm space-y-6 max-w-5xl mx-auto"
            : "space-y-6"
        }`}
      >
        {/* Official Header: Republic & Ministry with Institution Badge Box */}
        <div className={`pb-4 mb-6 ${theme.headerBorder}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`${isForeign ? "text-left" : "text-right"} ${fontBodyClass} space-y-1`}>
              <p className={`font-bold ${isForeign ? "font-sans uppercase text-sm tracking-wide" : "font-['Amiri',serif]"}`}>
                {editableFiche.header.republic || labels.defaultRepublic}
              </p>
              <p className={`font-bold ${isForeign ? "font-sans text-xs" : "font-['Amiri',serif]"}`}>
                {editableFiche.header.ministry || labels.defaultMinistry}
              </p>
              <p className={theme.subText}>
                {labels.directorate} {editableFiche.header.directorate || (isForeign ? "Alger" : "الجزائر")}
              </p>
              <p className={theme.subText}>
                {labels.school} {editableFiche.header.schoolName || "...................................."}
              </p>
            </div>

            <div className={`w-16 h-16 border rounded flex items-center justify-center text-[10px] text-center p-1 shrink-0 ${
              isNight ? "border-slate-700 bg-slate-900/60 text-slate-400" : isSepia ? "border-[#cbbca3] bg-[#f2e9d7] text-[#6b583f]" : "border-slate-200 bg-slate-50 text-slate-400"
            }`}>
              {labels.schoolLogo}
            </div>
          </div>

          <div className="text-center my-4">
            <h3
              className={`text-center font-bold underline ${
                isForeign ? "font-sans tracking-wide" : "font-['Amiri',serif]"
              } ${
                isReadingMode
                  ? readingFontSize === "xlarge"
                    ? "text-2xl sm:text-3xl"
                    : readingFontSize === "large"
                    ? "text-xl sm:text-2xl"
                    : "text-lg sm:text-xl"
                  : "text-xl text-slate-900"
              }`}
            >
              {labels.ficheTitle}
            </h3>
            <span className={`block mt-1 ${theme.subText} ${
              isReadingMode ? "text-xs sm:text-sm font-medium" : "text-[11px]"
            }`}>
              {labels.ficheSubtitle}
            </span>

            {editableFiche.header.ficheStyle && (
              <div className="flex items-center justify-center gap-2 mt-2 print:mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border print:text-black print:border-black ${
                    editableFiche.header.ficheStyle === "concise"
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : editableFiche.header.ficheStyle === "technical"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                      : "bg-blue-50 text-blue-900 border-blue-300"
                  }`}
                >
                  {editableFiche.header.ficheStyle === "concise" ? (
                    <>
                      <span>⚡</span>
                      <span>
                        {isFrench
                          ? "Style Synthétique & Concis (Fiche allégée)"
                          : isEnglish
                          ? "Concise & Focused Layout"
                          : "نمط المذكرة: مختصر وموجز (مباشرة ومكثفة)"}
                      </span>
                    </>
                  ) : editableFiche.header.ficheStyle === "technical" ? (
                    <>
                      <span>🛠️</span>
                      <span>
                        {isFrench
                          ? "Style Technique & Didactique (Critérié C1/C2/C3)"
                          : isEnglish
                          ? "Technical & Didactic Framework (CBA Criteria)"
                          : "نمط المذكرة: تقني وديدكتيكي (معايير C1/C2/C3)"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>📜</span>
                      <span>
                        {isFrench
                          ? "Style Détaillé & Approfondi (Modèle complet)"
                          : isEnglish
                          ? "Detailed & In-Depth Model"
                          : "نمط المذكرة: تفصيلي ونموذجي (شامل)"}
                      </span>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className={`flex flex-wrap items-center justify-between mt-2 px-1 ${fontBodyClass}`}>
            <div className="space-y-0.5">
              {isEditing ? (
                <>
                  <div>
                    <span>{labels.directorate} </span>
                    <input
                      type="text"
                      value={editableFiche.header.directorate || ""}
                      onChange={(e) =>
                        setEditableFiche({
                          ...editableFiche,
                          header: { ...editableFiche.header, directorate: e.target.value },
                        })
                      }
                      className="border border-slate-300 rounded px-1.5 py-0.5 text-xs font-medium text-slate-900 bg-white"
                      placeholder={isForeign ? "Direction de l'Éducation..." : "مديرية التربية لولاية..."}
                    />
                  </div>
                  <div>
                    <span>{labels.school} </span>
                    <input
                      type="text"
                      value={editableFiche.header.schoolName || ""}
                      onChange={(e) =>
                        setEditableFiche({
                          ...editableFiche,
                          header: { ...editableFiche.header, schoolName: e.target.value },
                        })
                      }
                      className="border border-slate-300 rounded px-1.5 py-0.5 text-xs font-medium text-slate-900 bg-white"
                      placeholder={isForeign ? "C.E.M..." : "متوسطة..."}
                    />
                  </div>
                </>
              ) : null}
            </div>

            <div className="space-y-0.5">
              {isEditing ? (
                <>
                  <div>
                    <span>{labels.teacher} </span>
                    <input
                      type="text"
                      value={editableFiche.header.teacherName || ""}
                      onChange={(e) =>
                        setEditableFiche({
                          ...editableFiche,
                          header: { ...editableFiche.header, teacherName: e.target.value },
                        })
                      }
                      className="border border-slate-300 rounded px-1.5 py-0.5 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <span>{labels.year} </span>
                    <input
                      type="text"
                      value={editableFiche.header.academicYear || "2024 / 2025"}
                      onChange={(e) =>
                        setEditableFiche({
                          ...editableFiche,
                          header: { ...editableFiche.header, academicYear: e.target.value },
                        })
                      }
                      className="border border-slate-300 rounded px-1.5 py-0.5 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p><strong>{labels.teacher}</strong> {editableFiche.header.teacherName || "...................."}</p>
                  <p><strong>{labels.year}</strong> {editableFiche.header.academicYear || "2024 / 2025"}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: Official Administrative & Pedagogical Grid */}
        <div className="mb-6 overflow-x-auto">
          <table className={`w-full border-collapse border ${theme.tableBorder}`}>
            <tbody>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold w-1/6`}>
                  {labels.level}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} font-semibold w-2/6`}>
                  {editableFiche.header.level}
                </td>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold w-1/6`}>
                  {labels.subject}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} font-semibold w-2/6`}>
                  {editableFiche.header.subject}
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold`}>
                  {labels.field}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  {editableFiche.header.field}
                </td>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold`}>
                  {labels.sequence}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  {editableFiche.header.sequence}
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold`}>
                  {labels.resource}
                </td>
                <td
                  className={`border ${theme.tableCellBorder} ${fontTableCellClass} font-bold ${theme.resourceHighlight}`}
                  colSpan={3}
                >
                  {editableFiche.header.resourceTitle}
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold`}>
                  {labels.sessionType}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  {editableFiche.header.sessionType}
                </td>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold`}>
                  {labels.durationAndNum}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  {editableFiche.header.duration} | N° {editableFiche.header.ficheNumber || "01"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Competency Matrix (شبكة الكفاءات والمؤشرات) */}
        <div className="mb-6 overflow-x-auto">
          <table className={`w-full border-collapse border ${theme.tableBorder}`}>
            <thead>
              <tr className={theme.tableHeaderBg}>
                <th
                  colSpan={2}
                  className={`border ${theme.tableBorder} p-2.5 ${
                    isForeign ? "text-left font-sans" : "text-right font-['Amiri',serif]"
                  } ${isReadingMode ? "text-base sm:text-lg" : "text-sm"} font-bold`}
                >
                  {labels.competenciesTitle}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold w-1/4 align-top`}>
                  {labels.globalComp}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} leading-relaxed`}>
                  {editableFiche.competencies.globalCompetence}
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold align-top`}>
                  {labels.terminalComp}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} font-medium leading-relaxed`}>
                  {editableFiche.competencies.terminalCompetence}
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold align-top`}>
                  {labels.compComponents}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  <ul className={`list-disc list-inside ${isReadingMode ? "space-y-2" : "space-y-1"}`}>
                    {editableFiche.competencies.competenceComponents.map((comp, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {comp}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold align-top`}>
                  {labels.indicators}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  <ul className={`list-disc list-inside ${isReadingMode ? "space-y-2" : "space-y-1"}`}>
                    {editableFiche.competencies.assessmentIndicators.map((ind, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {ind}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold align-top`}>
                  {labels.supports}
                </td>
                <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                  <ul className={`list-disc list-inside ${isReadingMode ? "space-y-2" : "space-y-1"}`}>
                    {editableFiche.competencies.didacticSupports.map((sup, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {sup}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              {editableFiche.competencies.valuesAndAttitudes &&
                editableFiche.competencies.valuesAndAttitudes.length > 0 && (
                  <tr>
                    <td className={`border ${theme.tableCellBorder} ${theme.tableLabelCol} ${fontTableCellClass} font-bold align-top`}>
                      {labels.values}
                    </td>
                    <td className={`border ${theme.tableCellBorder} ${fontTableCellClass}`}>
                      <ul className={`list-disc list-inside ${isReadingMode ? "space-y-2" : "space-y-1"}`}>
                        {editableFiche.competencies.valuesAndAttitudes.map((val, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {val}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Section 3: Pedagogical Lesson Flow (جدول سيرورة الحصة التعليمية التعلمية) */}
        <div className="mb-6">
          <div
            className={`${theme.tableHeaderBg} ${
              isForeign ? "font-sans" : "font-['Amiri',serif]"
            } p-2.5 border ${theme.tableBorder} font-bold ${
              isReadingMode ? "text-base sm:text-lg" : "text-sm"
            }`}
          >
            {labels.flowTitle}
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse border ${theme.tableBorder}`}>
              <thead>
                <tr className={`${theme.tableLabelCol} text-center font-bold`}>
                  <th className={`border ${theme.tableCellBorder} ${fontTableCellClass} w-[14%]`}>
                    {labels.phaseCol}
                  </th>
                  <th className={`border ${theme.tableCellBorder} ${fontTableCellClass} w-[22%]`}>
                    {labels.contentCol}
                  </th>
                  <th className={`border ${theme.tableCellBorder} ${fontTableCellClass} w-[46%]`}>
                    {labels.activitiesCol}
                  </th>
                  <th className={`border ${theme.tableCellBorder} ${fontTableCellClass} w-[18%]`}>
                    {labels.evalCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {editableFiche.steps.map((step, idx) => (
                  <tr key={idx} className={`align-top ${theme.tableRowHover}`}>
                    <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} font-bold text-center`}>
                      <div className="font-bold">{step.phase}</div>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs font-bold rounded ${theme.timingBadge}`}>
                        {step.timing}
                      </span>
                    </td>
                    <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} font-medium leading-relaxed`}>
                      {step.contentElement}
                    </td>
                    <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} space-y-2.5`}>
                      <div className={`p-2 sm:p-2.5 rounded-lg border ${theme.teacherCard}`}>
                        <span className="font-bold block mb-1">
                          {labels.teacherRole}
                        </span>
                        <p className={`whitespace-pre-line leading-relaxed ${fontBodyClass}`}>
                          {step.teacherActivity}
                        </p>
                      </div>
                      <div className={`p-2 sm:p-2.5 rounded-lg border ${theme.studentCard}`}>
                        <span className="font-bold block mb-1">
                          {labels.studentRole}
                        </span>
                        <p className={`whitespace-pre-line leading-relaxed ${fontBodyClass}`}>
                          {step.studentActivity}
                        </p>
                      </div>
                      {step.strategy && (
                        <div className={`text-xs font-semibold ${theme.subText}`}>
                          {labels.strategy} <span className="font-normal">{step.strategy}</span>
                        </div>
                      )}
                    </td>
                    <td className={`border ${theme.tableCellBorder} ${fontTableCellClass} leading-relaxed text-xs sm:text-sm`}>
                      {step.formativeAssessment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Board Summary (الملخص السبوري والمورد المعرفي المُرسي) */}
        <div className={`mb-6 border rounded-xl overflow-hidden ${theme.cardBoxBorder}`}>
          <div
            className={`${theme.tableHeaderBg} ${
              isForeign ? "font-sans" : "font-['Amiri',serif]"
            } p-2.5 font-bold ${isReadingMode ? "text-base sm:text-lg" : "text-sm"}`}
          >
            {labels.boardTitle}
          </div>
          <div className={`p-4 sm:p-5 space-y-3 ${theme.boardContentBg}`}>
            <h4
              className={`font-bold border-b pb-2 ${
                isForeign ? "font-sans" : "font-['Amiri',serif]"
              } ${isReadingMode ? "text-base sm:text-lg border-current/20" : "text-sm border-slate-200"}`}
            >
              {editableFiche.boardSummary.title}
            </h4>
            <div className={`space-y-2 ${isForeign ? "pl-2" : "pr-2"}`}>
              {editableFiche.boardSummary.points.map((point, idx) => (
                <p key={idx} className={`leading-relaxed ${fontBodyClass}`}>
                  • {point}
                </p>
              ))}
            </div>
            {editableFiche.boardSummary.takeawayRule && (
              <div className={`mt-4 p-3 rounded-lg border font-semibold ${theme.takeawayRule} ${fontBodyClass}`}>
                <span className="font-bold">{labels.rule} </span>
                {editableFiche.boardSummary.takeawayRule}
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Home Assignment / Application (الواجب المنزلي) */}
        <div className={`mb-6 border rounded-xl overflow-hidden ${theme.cardBoxBorder}`}>
          <div
            className={`${theme.tableHeaderBg} ${
              isForeign ? "font-sans" : "font-['Amiri',serif]"
            } p-2.5 font-bold ${isReadingMode ? "text-base sm:text-lg" : "text-sm"}`}
          >
            {labels.homeTitle}
          </div>
          <div className={`p-4 leading-relaxed ${theme.boardContentBg} ${fontBodyClass}`}>
            {editableFiche.homeAssignment}
          </div>
        </div>

        {/* Section 6: Teacher Self Evaluation & Notes (التقويم الذاتي للأستاذ) */}
        {editableFiche.teacherSelfEvaluation && (
          <div className={`border rounded-xl overflow-hidden print:break-inside-avoid ${theme.cardBoxBorder}`}>
            <div className={`${theme.tableLabelCol} border-b ${theme.tableCellBorder} p-2.5 font-bold flex items-center justify-between ${fontBodyClass}`}>
              <span>{labels.evalSelfTitle}</span>
              <span className={`text-xs font-normal ${theme.subText}`}>{labels.forTeacher}</span>
            </div>
            <div className={`p-4 space-y-2.5 ${theme.boardContentBg} ${fontBodyClass}`}>
              {editableFiche.teacherSelfEvaluation.pedagogicalNotes && (
                <p>
                  <span className="font-bold">{labels.notes} </span>
                  {editableFiche.teacherSelfEvaluation.pedagogicalNotes}
                </p>
              )}
              {editableFiche.teacherSelfEvaluation.anticipatedDifficulties &&
                editableFiche.teacherSelfEvaluation.anticipatedDifficulties.length > 0 && (
                  <div>
                    <span className="font-bold">{labels.difficulties} </span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {editableFiche.teacherSelfEvaluation.anticipatedDifficulties.map((diff, idx) => (
                        <li key={idx}>{diff}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Official Signatures Box (Footer) */}
        <div className={`mt-8 pt-6 border-t ${theme.footerBorder} grid grid-cols-3 text-center font-bold ${fontBodyClass}`}>
          <div>{labels.sigTeacher}</div>
          <div>{labels.sigPrincipal}</div>
          <div>{labels.sigInspector}</div>
        </div>
      </div>

      {/* Share Fiche Modal */}
      <ShareFicheModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fiche={editableFiche}
      />

      {/* Copy Content Modal */}
      <CopyContentModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        fiche={editableFiche}
      />
    </div>
  );
};

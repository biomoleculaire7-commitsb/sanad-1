import { PedagogicalFiche } from "../types";

/**
 * Converts a PedagogicalFiche into a beautifully formatted Markdown string.
 */
export function convertFicheToMarkdown(fiche: PedagogicalFiche): string {
  const h = fiche.header;
  const c = fiche.competencies;
  const lines: string[] = [];

  // Header Title
  lines.push(`# ${h.republic || "الجمهورية الجزائرية الديمقراطية الشعبية"}`);
  lines.push(`## ${h.ministry || "وزارة التربية الوطنية"}`);
  if (h.directorate) lines.push(`### مديرية التربية: ${h.directorate}`);
  lines.push("");
  lines.push(`---`);
  lines.push("");
  lines.push(`# مذكرة بيداغوجية رقم: ${h.ficheNumber || "01"}`);
  lines.push(`### المورد المعرفي المستهدف: **${h.resourceTitle || "عنوان الدرس"}**`);
  lines.push("");

  // Metadata Table
  lines.push(`| البيانات الأساسية | التفاصيل |`);
  lines.push(`| :--- | :--- |`);
  lines.push(`| **المادة** | ${h.subject || ""} |`);
  lines.push(`| **المستوى** | ${h.level || ""} |`);
  lines.push(`| **الميدان** | ${h.field || ""} |`);
  lines.push(`| **المقطع التعلمي** | ${h.sequence || ""} |`);
  lines.push(`| **نوع الحصة** | ${h.sessionType || "إرساء موارد"} |`);
  lines.push(`| **المدة الزمنية** | ${h.duration || "1 ساعة"} |`);
  if (h.teacherName) lines.push(`| **الأستاذ(ة)** | ${h.teacherName} |`);
  if (h.schoolName) lines.push(`| **المتوسطة** | ${h.schoolName} |`);
  if (h.academicYear) lines.push(`| **السنة الدراسية** | ${h.academicYear} |`);
  if (h.date) lines.push(`| **التاريخ** | ${h.date} |`);
  if (h.classGroup) lines.push(`| **الفوج التربوي** | ${h.classGroup} |`);
  lines.push("");

  // Objectives & Competencies
  lines.push(`## 🎯 الكفاءات والأهداف البيداغوجية`);
  lines.push("");
  if (c.globalCompetence) {
    lines.push(`- **الكفاءة الشاملة:** ${c.globalCompetence}`);
  }
  if (c.terminalCompetence) {
    lines.push(`- **الكفاءة الختامية:** ${c.terminalCompetence}`);
  }
  if (c.competenceComponents && c.competenceComponents.length > 0) {
    lines.push(`- **مركّبات الكفاءة:**`);
    c.competenceComponents.forEach((comp) => lines.push(`  * ${comp}`));
  }
  if (c.assessmentIndicators && c.assessmentIndicators.length > 0) {
    lines.push(`- **معايير ومؤشرات التقويم:**`);
    c.assessmentIndicators.forEach((crit) => lines.push(`  * ${crit}`));
  }
  lines.push("");

  // Didactic Supports & Values
  if (c.didacticSupports && c.didacticSupports.length > 0) {
    lines.push(`## 📚 السندات والدعائم الديدكتيكية`);
    c.didacticSupports.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (c.valuesAndAttitudes && c.valuesAndAttitudes.length > 0) {
    lines.push(`## 🌟 القيم والمواقف المستهدفة`);
    c.valuesAndAttitudes.forEach((v) => lines.push(`- ${v}`));
    lines.push("");
  }

  // Attached Images / Documents
  if (fiche.images && fiche.images.length > 0) {
    lines.push(`## 🖼️ السندات والوثائق المصورة`);
    fiche.images.forEach((img, idx) => {
      lines.push(`- **وثيقة ${idx + 1}:** ${img.caption}`);
      if (img.description) lines.push(`  * الاستثمار: ${img.description}`);
      if (img.url && !img.url.startsWith("data:")) {
        lines.push(`  * الرابط: [عرض الوثيقة](${img.url})`);
      }
    });
    lines.push("");
  }

  // Chronological Lesson Progress Steps Table
  lines.push(`## ⏱️ سيرورة الحصة التعليمية التعلمية (الجدول البيداغوجي)`);
  lines.push("");
  lines.push(`| المرحلة / المحطة | المدة | الوضعيات وعناصر المحتوى | دور ونشاط الأستاذ | نشاط ومهام المتعلم | التقويم ومؤشرات النجاح |`);
  lines.push(`| :--- | :---: | :--- | :--- | :--- | :--- |`);

  fiche.steps.forEach((step) => {
    const cleanPhase = (step.phase || "").replace(/\|/g, "/");
    const cleanTiming = (step.timing || "").replace(/\|/g, "/");
    const cleanContent = (step.contentElement || "").replace(/\|/g, "/").replace(/\n/g, "<br>");
    const cleanTeacher = (step.teacherActivity || "").replace(/\|/g, "/").replace(/\n/g, "<br>");
    const cleanStudent = (step.studentActivity || "").replace(/\|/g, "/").replace(/\n/g, "<br>");
    const cleanEval = (step.formativeAssessment || "").replace(/\|/g, "/").replace(/\n/g, "<br>");

    lines.push(`| **${cleanPhase}** | ${cleanTiming} | ${cleanContent} | ${cleanTeacher} | ${cleanStudent} | ${cleanEval} |`);
  });
  lines.push("");

  // Blackboard Summary (أثر السبورة)
  if (fiche.boardSummary) {
    lines.push(`## 📝 أثر السبورة (الملخص المعرفي المهيكل للدفتر)`);
    if (fiche.boardSummary.title) {
      lines.push(`### ${fiche.boardSummary.title}`);
    }
    if (fiche.boardSummary.points && fiche.boardSummary.points.length > 0) {
      fiche.boardSummary.points.forEach((pt) => lines.push(`- ${pt}`));
    }
    if (fiche.boardSummary.takeawayRule) {
      lines.push("");
      lines.push(`> **استنتاج / قاعدة:** ${fiche.boardSummary.takeawayRule}`);
    }
    lines.push("");
  }

  // Homework / Integration Activity
  if (fiche.homeAssignment) {
    lines.push(`## 🏠 النشاط الإدماجي المنزلي (الواجب)`);
    lines.push("");
    lines.push(fiche.homeAssignment);
    lines.push("");
  }

  // Self Evaluation / Pedagogical Notes
  if (fiche.teacherSelfEvaluation) {
    lines.push(`## 🔍 التقييم الذاتي والتأمل البيداغوجي للأستاذ`);
    if (fiche.teacherSelfEvaluation.pedagogicalNotes) {
      lines.push(`- **ملاحظات بيداغوجية:** ${fiche.teacherSelfEvaluation.pedagogicalNotes}`);
    }
    if (fiche.teacherSelfEvaluation.anticipatedDifficulties && fiche.teacherSelfEvaluation.anticipatedDifficulties.length > 0) {
      lines.push(`- **صعوبات متوقعة وحلولها:**`);
      fiche.teacherSelfEvaluation.anticipatedDifficulties.forEach((d) => lines.push(`  * ${d}`));
    }
    if (fiche.teacherSelfEvaluation.personalReflection) {
      lines.push(`- **تأمل الأستاذ:** ${fiche.teacherSelfEvaluation.personalReflection}`);
    }
    lines.push("");
  }

  lines.push(`---`);
  lines.push(`*تم إعداد هذه المذكرة عبر منظومة سند - مذكرات التعليم المتوسط الجزائري وفق منهاج الجيل الثاني والمقاربة بالكفاءات.*`);

  return lines.join("\n");
}

/**
 * Converts a PedagogicalFiche into a clean plain text string suitable for simple copy-pasting.
 */
export function convertFicheToPlainText(fiche: PedagogicalFiche): string {
  const h = fiche.header;
  const c = fiche.competencies;
  const lines: string[] = [];

  lines.push("=================================================");
  lines.push(h.republic || "الجمهورية الجزائرية الديمقراطية الشعبية");
  lines.push(h.ministry || "وزارة التربية الوطنية");
  if (h.directorate) lines.push(`مديرية التربية: ${h.directorate}`);
  lines.push("=================================================");
  lines.push("");
  lines.push(`مذكرة بيداغوجية رقم: ${h.ficheNumber || "01"}`);
  lines.push(`المورد المعرفي المستهدف: ${h.resourceTitle || ""}`);
  lines.push(`المادة: ${h.subject || ""} | المستوى: ${h.level || ""}`);
  lines.push(`الميدان: ${h.field || ""} | المقطع: ${h.sequence || ""}`);
  lines.push(`نوع الحصة: ${h.sessionType || ""} | المدة: ${h.duration || ""}`);
  if (h.teacherName) lines.push(`الأستاذ(ة): ${h.teacherName}`);
  if (h.schoolName) lines.push(`المؤسسة: ${h.schoolName}`);
  if (h.academicYear) lines.push(`السنة الدراسية: ${h.academicYear}`);
  lines.push("");

  lines.push("--- الكفاءات والأهداف البيداغوجية ---");
  if (c.globalCompetence) lines.push(`الكفاءة الشاملة: ${c.globalCompetence}`);
  if (c.terminalCompetence) lines.push(`الكفاءة الختامية: ${c.terminalCompetence}`);
  if (c.competenceComponents?.length) {
    lines.push("مركبات الكفاءة:");
    c.competenceComponents.forEach((comp) => lines.push(`- ${comp}`));
  }
  if (c.assessmentIndicators?.length) {
    lines.push("معايير ومؤشرات التقويم:");
    c.assessmentIndicators.forEach((crit) => lines.push(`- ${crit}`));
  }
  lines.push("");

  if (c.didacticSupports?.length) {
    lines.push("--- السندات والدعائم الديدكتيكية ---");
    c.didacticSupports.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (c.valuesAndAttitudes?.length) {
    lines.push("--- القيم والمواقف المستهدفة ---");
    c.valuesAndAttitudes.forEach((v) => lines.push(`- ${v}`));
    lines.push("");
  }

  lines.push("--- سيرورة الحصة التعليمية التعلمية ---");
  fiche.steps.forEach((step, idx) => {
    lines.push(`[المرحلة ${idx + 1}: ${step.phase} (${step.timing})]`);
    lines.push(`• عناصر المحتوى: ${step.contentElement}`);
    lines.push(`• نشاط ودور الأستاذ: ${step.teacherActivity}`);
    lines.push(`• نشاط ومهام المتعلم: ${step.studentActivity}`);
    if (step.strategy) lines.push(`• طريقة العمل والوساطة: ${step.strategy}`);
    lines.push(`• التقويم التكويني ومعايير النجاح: ${step.formativeAssessment}`);
    lines.push("");
  });

  if (fiche.boardSummary) {
    lines.push("--- أثر السبورة (الملخص المعرفي) ---");
    if (fiche.boardSummary.title) lines.push(`العنوان: ${fiche.boardSummary.title}`);
    if (fiche.boardSummary.points?.length) {
      fiche.boardSummary.points.forEach((pt) => lines.push(`- ${pt}`));
    }
    if (fiche.boardSummary.takeawayRule) {
      lines.push(`استنتاج / قاعدة: ${fiche.boardSummary.takeawayRule}`);
    }
    lines.push("");
  }

  if (fiche.homeAssignment) {
    lines.push("--- النشاط الإدماجي المنزلي ---");
    lines.push(fiche.homeAssignment);
    lines.push("");
  }

  if (fiche.teacherSelfEvaluation) {
    lines.push("--- التقييم الذاتي والتأمل البيداغوجي ---");
    if (fiche.teacherSelfEvaluation.pedagogicalNotes) {
      lines.push(`ملاحظات: ${fiche.teacherSelfEvaluation.pedagogicalNotes}`);
    }
    if (fiche.teacherSelfEvaluation.anticipatedDifficulties?.length) {
      lines.push("الصعوبات المتوقعة:");
      fiche.teacherSelfEvaluation.anticipatedDifficulties.forEach((d) => lines.push(`- ${d}`));
    }
    if (fiche.teacherSelfEvaluation.personalReflection) {
      lines.push(`تأمل الأستاذ: ${fiche.teacherSelfEvaluation.personalReflection}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

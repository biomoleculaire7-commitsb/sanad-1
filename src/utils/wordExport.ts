import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
} from "docx";
import { PedagogicalFiche } from "../types";

/**
 * Generates an HTML-based Microsoft Word document (.doc) with Office Word XML markup.
 * This format is 100% editable in all versions of Microsoft Word (2007-2024, Office 365),
 * LibreOffice Writer, WPS Office, and Google Docs.
 * It natively preserves Arabic RTL alignment, custom table borders, shaded headers,
 * and column widths, allowing teachers to easily modify, add rows, or reword content.
 */
export function exportFicheToWordDoc(fiche: PedagogicalFiche): void {
  const isFrench = fiche.header.language === "fr";
  const isEnglish = fiche.header.language === "en";
  const dir = isFrench || isEnglish ? "ltr" : "rtl";
  const align = isFrench || isEnglish ? "left" : "right";
  const fontFamily = isFrench || isEnglish
    ? "'Segoe UI', 'Calibri', 'Arial', sans-serif"
    : "'Traditional Arabic', 'Cairo', 'Arial', 'Calibri', sans-serif";

  const labels = isFrench
    ? {
        ficheDocTitle: "FICHE PÉDAGOGIQUE OFFICIELLE - ENSEIGNEMENT MOYEN",
        republic: fiche.header.republic || "RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE",
        ministry: fiche.header.ministry || "MINISTÈRE DE L'ÉDUCATION NATIONALE",
        directorate: fiche.header.directorate || "Direction de l'Éducation",
        school: fiche.header.schoolName || "Collège d'Enseignement Moyen (CEM)",
        teacher: fiche.header.teacherName || "Enseignant(e)",
        year: fiche.header.academicYear || "Année scolaire 2025/2026",
        level: "Niveau",
        subject: "Matière",
        field: "Domaine",
        sequence: "Projet / Séquence",
        resource: "Ressource ciblée",
        sessionType: "Type de séance",
        duration: "Durée",
        ficheNumber: "Fiche N°",
        date: "Date",
        classGroup: "Groupe / Classe",
        compTitle: "I. CADRE PÉDAGOGIQUE ET COMPÉTENCES VISÉES (APPROCHE PAR COMPÉTENCES)",
        globalComp: "Compétence Globale",
        terminalComp: "Compétence Terminale",
        compComponents: "Composantes de la compétence",
        indicators: "Critères et indicateurs d'évaluation",
        supports: "Supports et moyens didactiques",
        values: "Valeurs et attitudes développées",
        stepsTitle: "II. DÉROULEMENT DE LA SÉANCE ET SITUATIONS D'APPRENTISSAGE",
        phase: "Phase",
        timing: "Durée",
        content: "Contenu & Éléments du savoir",
        teacherRole: "Rôle de l'enseignant (Consignes & Tâches)",
        studentRole: "Activité de l'élève (Tâches & Démarches)",
        strategy: "Modalité de travail",
        assessment: "Évaluation formative & Régulation",
        boardTitle: "III. TRACE ÉCRITE / RÉSUMÉ AU TABLEAU",
        rule: "Règle / Retenir :",
        homeTitle: "IV. ACTIVITÉ / INVESTISSEMENT À DOMICILE",
        notesTitle: "V. ÉVALUATION ET RÉFLEXION PÉDAGOGIQUE DE L'ENSEIGNANT",
        pedagogicalNotes: "Remarques pédagogiques",
        difficulties: "Difficultés prévues et remédiations",
        reflection: "Auto-évaluation",
      }
    : isEnglish
    ? {
        ficheDocTitle: "OFFICIAL PEDAGOGICAL LESSON PLAN - MIDDLE SCHOOL",
        republic: fiche.header.republic || "PEOPLE'S DEMOCRATIC REPUBLIC OF ALGERIA",
        ministry: fiche.header.ministry || "MINISTRY OF NATIONAL EDUCATION",
        directorate: fiche.header.directorate || "Directorate of Education",
        school: fiche.header.schoolName || "Middle School (CEM)",
        teacher: fiche.header.teacherName || "Teacher",
        year: fiche.header.academicYear || "Academic Year 2025/2026",
        level: "Level",
        subject: "Subject",
        field: "Domain",
        sequence: "Sequence / Unit",
        resource: "Target Resource",
        sessionType: "Session Type",
        duration: "Duration",
        ficheNumber: "Plan No.",
        date: "Date",
        classGroup: "Class / Group",
        compTitle: "I. PEDAGOGICAL FRAMEWORK & COMPETENCIES (CBA)",
        globalComp: "Global Competence",
        terminalComp: "Terminal Competence",
        compComponents: "Competence Components",
        indicators: "Assessment Indicators",
        supports: "Didactic Aids & Materials",
        values: "Values & Attitudes",
        stepsTitle: "II. LESSON PROCEDURE & LEARNING SITUATIONS",
        phase: "Stage",
        timing: "Time",
        content: "Content & Knowledge Elements",
        teacherRole: "Teacher's Role (Instructions & Guidance)",
        studentRole: "Student's Activity (Tasks & Production)",
        strategy: "Work Strategy",
        assessment: "Formative Assessment & Evidence",
        boardTitle: "III. BOARD WORK SUMMARY / TAKEAWAY",
        rule: "Key Rule / Takeaway:",
        homeTitle: "IV. HOME ASSIGNMENT / FURTHER PRACTICE",
        notesTitle: "V. TEACHER'S POST-LESSON REFLECTION",
        pedagogicalNotes: "Pedagogical Notes",
        difficulties: "Anticipated Difficulties & Remediation",
        reflection: "Self-Reflection",
      }
    : {
        ficheDocTitle: "مذكرة بيداغوجية رسمية للتعليم المتوسط - الجيل الثاني",
        republic: fiche.header.republic || "الجمهورية الجزائرية الديمقراطية الشعبية",
        ministry: fiche.header.ministry || "وزارة التربية الوطنية",
        directorate: fiche.header.directorate || "مديرية التربية لولاية",
        school: fiche.header.schoolName || "متوسطة",
        teacher: fiche.header.teacherName || "الأستاذ(ة)",
        year: fiche.header.academicYear || "السنة الدراسية: 2025 / 2026",
        level: "المستوى التعليمي",
        subject: "المادة",
        field: "الميدان",
        sequence: "المقطع التعلمي",
        resource: "المورد المستهدف",
        sessionType: "نوع الحصة",
        duration: "المدة الزمنية",
        ficheNumber: "رقم المذكرة",
        date: "التاريخ",
        classGroup: "القسم / الفوج",
        compTitle: "أولاً: الكفاءات والأهداف البيداغوجية (المقاربة بالكفاءات)",
        globalComp: "الكفاءة الشاملة للمرحلة",
        terminalComp: "الكفاءة الختامية للطور",
        compComponents: "مركبات الكفاءة",
        indicators: "مؤشرات التقويم ومعايير النجاح",
        supports: "السندات والوسائل التعليمية",
        values: "القيم والمواقف المكتسبة",
        stepsTitle: "ثانياً: سيرورة التعلم والوضعيات البيداغوجية (مراحل إنجاز الحصة)",
        phase: "المرحلة / المحطة",
        timing: "المدة",
        content: "عناصر المحتوى المعرفي",
        teacherRole: "نشاط الأستاذ ودوره (توجيهات، تعليمات، إسناد مهام)",
        studentRole: "نشاط المتعلم ومسار الإنجاز (محاولات، استنتاج، حل وضعية)",
        strategy: "استراتيجية العمل",
        assessment: "التقويم التكويني ومؤشر التحقق",
        boardTitle: "ثالثاً: أثر السبورة / الخلاصة التعلمية",
        rule: "القاعدة المستخلصة / أتذكر:",
        homeTitle: "رابعاً: الاستثمار المنزلي والواجب الإثرائي",
        notesTitle: "خامساً: التقييم الذاتي وملاحظات ما بعد الحصة",
        pedagogicalNotes: "ملاحظات وتوجيهات بيداغوجية",
        difficulties: "صعوبات متوقعة وخطة المعالجة",
        reflection: "التأمل البيداغوجي للأستاذ",
      };

  // Build HTML table for Steps
  const stepsRowsHtml = fiche.steps
    .map(
      (step, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="border: 1px solid #334155; padding: 6px 8px; font-weight: bold; text-align: center; vertical-align: top; width: 14%;">
        ${step.phase}
        <div style="font-size: 9pt; color: #475569; font-weight: normal; margin-top: 4px;">⏱️ ${step.timing}</div>
        ${step.strategy ? `<div style="font-size: 8.5pt; background-color: #e2e8f0; color: #1e293b; padding: 2px 4px; border-radius: 4px; margin-top: 4px;">${step.strategy}</div>` : ""}
      </td>
      <td style="border: 1px solid #334155; padding: 6px 8px; vertical-align: top; font-weight: 600; width: 18%;">
        ${step.contentElement}
      </td>
      <td style="border: 1px solid #334155; padding: 6px 8px; vertical-align: top; width: 28%; line-height: 1.4;">
        ${step.teacherActivity.replace(/\n/g, "<br/>")}
      </td>
      <td style="border: 1px solid #334155; padding: 6px 8px; vertical-align: top; width: 25%; line-height: 1.4;">
        ${step.studentActivity.replace(/\n/g, "<br/>")}
      </td>
      <td style="border: 1px solid #334155; padding: 6px 8px; vertical-align: top; width: 15%; background-color: #f1f5f9; font-size: 9.5pt; line-height: 1.35;">
        ${step.formativeAssessment.replace(/\n/g, "<br/>")}
      </td>
    </tr>
  `
    )
    .join("");

  // Build HTML list for points
  const boardPointsHtml = fiche.boardSummary.points
    .map((pt) => `<li style="margin-bottom: 4px;">${pt}</li>`)
    .join("");

  const compComponentsHtml = fiche.competencies.competenceComponents
    .map((c) => `<li style="margin-bottom: 3px;">${c}</li>`)
    .join("");

  const assessmentIndicatorsHtml = fiche.competencies.assessmentIndicators
    .map((i) => `<li style="margin-bottom: 3px;">${i}</li>`)
    .join("");

  const didacticSupportsHtml = fiche.competencies.didacticSupports
    .map((s) => `<li style="margin-bottom: 3px;">${s}</li>`)
    .join("");

  const valuesHtml = (fiche.competencies.valuesAndAttitudes || [])
    .map((v) => `<li style="margin-bottom: 3px;">${v}</li>`)
    .join("");

  // Assemble Complete Word-Compatible HTML
  const fullHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${fiche.header.subject} - ${fiche.header.resourceTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 210mm 297mm; /* A4 */
      margin: 12mm 12mm 12mm 12mm;
      mso-header-margin: 36pt;
      mso-footer-margin: 36pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: ${fontFamily};
      font-size: 11pt;
      line-height: 1.35;
      direction: ${dir};
      text-align: ${align};
      color: #0f172a;
      background-color: #ffffff;
    }
    h1, h2, h3, h4 {
      margin: 0;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 12px;
      direction: ${dir};
    }
    th, td {
      border: 1px solid #334155;
      padding: 5px 8px;
      font-size: 10pt;
      text-align: ${align};
    }
    th {
      background-color: #1e293b;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
    }
    .header-box {
      border: 1.5px solid #0f172a;
      padding: 10px;
      margin-bottom: 12px;
      background-color: #f8fafc;
    }
    .section-banner {
      background-color: #1e293b;
      color: #ffffff;
      padding: 5px 8px;
      font-size: 11pt;
      font-weight: bold;
      margin-top: 14px;
      margin-bottom: 4px;
      border-radius: 2px;
    }
    .callout {
      border-left: 4px solid #2563eb;
      border-right: 4px solid #2563eb;
      background-color: #eff6ff;
      padding: 8px 12px;
      margin-top: 6px;
      margin-bottom: 10px;
    }
    .rule-box {
      border: 2px solid #0284c7;
      background-color: #f0f9ff;
      padding: 8px 12px;
      margin-top: 8px;
      border-radius: 4px;
    }
    ul {
      margin: 2px 0;
      padding-${dir === "rtl" ? "right" : "left"}: 20px;
    }
    .text-center {
      text-align: center;
    }
    .bold {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="Section1">
    
    <!-- 1. Institutional Algerian Ministry Header -->
    <div class="header-box">
      <table style="border: none; margin: 0; width: 100%;">
        <tr style="border: none;">
          <td style="border: none; width: 33%; vertical-align: top; font-size: 9.5pt;">
            <b>${labels.ministry}</b><br/>
            ${labels.directorate}: ${fiche.header.directorate || "........................"}<br/>
            ${labels.school}: ${fiche.header.schoolName || "........................"}
          </td>
          <td style="border: none; width: 34%; text-align: center; vertical-align: middle;">
            <div style="font-size: 11pt; font-weight: bold;">${labels.republic}</div>
            <div style="font-size: 12pt; font-weight: 800; color: #1e3a8a; margin-top: 4px; border-bottom: 2px solid #1e3a8a; padding-bottom: 3px;">
              ${labels.ficheDocTitle}
            </div>
            <div style="font-size: 9pt; color: #475569; margin-top: 3px;">
              ${fiche.header.sessionType} • المنهاج المخفف للجيل الثاني
            </div>
          </td>
          <td style="border: none; width: 33%; text-align: ${dir === "rtl" ? "left" : "right"}; vertical-align: top; font-size: 9.5pt;">
            ${labels.teacher}: <b>${fiche.header.teacherName || "........................"}</b><br/>
            ${labels.year}<br/>
            ${labels.date}: ${fiche.header.date || new Date().toLocaleDateString("ar-DZ")}<br/>
            <b>${labels.ficheNumber}: ${fiche.header.ficheNumber || "01"}</b>
          </td>
        </tr>
      </table>
    </div>

    <!-- 2. Pedagogical Identity Grid (Editable Table) -->
    <table style="width: 100%; border: 1.5px solid #1e293b;">
      <tr style="background-color: #f1f5f9;">
        <td style="width: 15%; font-weight: bold; background-color: #e2e8f0;">${labels.subject}</td>
        <td style="width: 35%; font-weight: 700; color: #1e3a8a; font-size: 11pt;">${fiche.header.subject}</td>
        <td style="width: 15%; font-weight: bold; background-color: #e2e8f0;">${labels.level}</td>
        <td style="width: 35%; font-weight: 700;">${fiche.header.level}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.field}</td>
        <td>${fiche.header.field}</td>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.sequence}</td>
        <td>${fiche.header.sequence}</td>
      </tr>
      <tr style="background-color: #f8fafc;">
        <td style="font-weight: bold; background-color: #e2e8f0;">${labels.resource}</td>
        <td style="font-weight: bold; color: #0f172a; font-size: 11pt;" colspan="3">
          ${fiche.header.resourceTitle}
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.duration}</td>
        <td>${fiche.header.duration}</td>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.classGroup}</td>
        <td>${fiche.header.classGroup || "الأفواج التربوية المعتمدة"}</td>
      </tr>
    </table>

    <!-- 3. Competencies & Pedagogical Framework -->
    <div class="section-banner">${labels.compTitle}</div>
    <table style="width: 100%; border: 1.5px solid #1e293b;">
      <tr>
        <td style="width: 25%; font-weight: bold; background-color: #f1f5f9;">${labels.globalComp}</td>
        <td style="width: 75%;">${fiche.competencies.globalCompetence}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.terminalComp}</td>
        <td><b>${fiche.competencies.terminalCompetence}</b></td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.compComponents}</td>
        <td>
          <ul>${compComponentsHtml}</ul>
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.indicators}</td>
        <td>
          <ul>${assessmentIndicatorsHtml}</ul>
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.supports}</td>
        <td>
          <ul>${didacticSupportsHtml}</ul>
        </td>
      </tr>
      ${
        valuesHtml
          ? `
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.values}</td>
        <td>
          <ul>${valuesHtml}</ul>
        </td>
      </tr>`
          : ""
      }
    </table>

    <!-- 4. The Core Lesson Progression Table (Fully Editable) -->
    <div class="section-banner">${labels.stepsTitle}</div>
    <table style="width: 100%; border: 1.5px solid #1e293b;">
      <thead>
        <tr style="background-color: #0f172a; color: #ffffff;">
          <th style="padding: 7px 5px; width: 14%;">${labels.phase}</th>
          <th style="padding: 7px 5px; width: 18%;">${labels.content}</th>
          <th style="padding: 7px 5px; width: 28%;">${labels.teacherRole}</th>
          <th style="padding: 7px 5px; width: 25%;">${labels.studentRole}</th>
          <th style="padding: 7px 5px; width: 15%;">${labels.assessment}</th>
        </tr>
      </thead>
      <tbody>
        ${stepsRowsHtml}
      </tbody>
    </table>

    <!-- 5. Board Summary / Trace Écrite -->
    <div class="section-banner">${labels.boardTitle}</div>
    <div style="border: 1px solid #334155; padding: 10px; background-color: #f8fafc; margin-bottom: 10px;">
      <div style="font-weight: bold; font-size: 11pt; color: #1e3a8a; margin-bottom: 6px;">
        📌 ${fiche.boardSummary.title}
      </div>
      <ul>
        ${boardPointsHtml}
      </ul>
      ${
        fiche.boardSummary.takeawayRule
          ? `
      <div class="rule-box">
        <b>${labels.rule}</b><br/>
        ${fiche.boardSummary.takeawayRule}
      </div>`
          : ""
      }
    </div>

    <!-- 6. Home Assignment -->
    <div class="section-banner">${labels.homeTitle}</div>
    <div style="border: 1px solid #334155; padding: 8px 12px; background-color: #ffffff; margin-bottom: 12px;">
      ${fiche.homeAssignment.replace(/\n/g, "<br/>")}
    </div>

    <!-- 7. Teacher Self-Evaluation & Notes -->
    ${
      fiche.teacherSelfEvaluation
        ? `
    <div class="section-banner">${labels.notesTitle}</div>
    <table style="width: 100%; border: 1px solid #334155;">
      ${
        fiche.teacherSelfEvaluation.pedagogicalNotes
          ? `
      <tr>
        <td style="width: 25%; font-weight: bold; background-color: #f1f5f9;">${labels.pedagogicalNotes}</td>
        <td style="width: 75%;">${fiche.teacherSelfEvaluation.pedagogicalNotes}</td>
      </tr>`
          : ""
      }
      ${
        fiche.teacherSelfEvaluation.anticipatedDifficulties?.length
          ? `
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.difficulties}</td>
        <td>
          <ul>
            ${fiche.teacherSelfEvaluation.anticipatedDifficulties.map((d) => `<li>${d}</li>`).join("")}
          </ul>
        </td>
      </tr>`
          : ""
      }
      ${
        fiche.teacherSelfEvaluation.personalReflection
          ? `
      <tr>
        <td style="font-weight: bold; background-color: #f1f5f9;">${labels.reflection}</td>
        <td>${fiche.teacherSelfEvaluation.personalReflection}</td>
      </tr>`
          : ""
      }
    </table>`
        : ""
    }

    <!-- Official Teacher & Inspector Signature Stamps -->
    <div style="margin-top: 20px; page-break-inside: avoid;">
      <table style="border: none; width: 100%;">
        <tr style="border: none;">
          <td style="border: none; width: 50%; text-align: center; vertical-align: top;">
            <div style="font-weight: bold; margin-bottom: 40px;">تأشيرة أستاذ المادة:</div>
            <div style="color: #64748b; font-size: 9pt;">(التوقيع والتاريخ)</div>
          </td>
          <td style="border: none; width: 50%; text-align: center; vertical-align: top;">
            <div style="font-weight: bold; margin-bottom: 40px;">تأشيرة السيد مفتش التربية الوطنية / مدير المؤسسة:</div>
            <div style="color: #64748b; font-size: 9pt;">(الملاحظة والختم)</div>
          </td>
        </tr>
      </table>
    </div>

  </div>
</body>
</html>`;

  // Create Blob with Word Document MIME type
  const blob = new Blob(["\ufeff" + fullHtml], {
    type: "application/msword;charset=utf-8",
  });

  const rawSubject = fiche.header.subject || "مادة";
  const rawTitle = fiche.header.resourceTitle || fiche.header.field || "مذكرة";
  const sanitizedSubject = rawSubject.replace(/[\/\\?%*:|"<>]/g, "-").trim();
  const sanitizedTitle = rawTitle.replace(/[\/\\?%*:|"<>]/g, "-").trim();
  const fileName = isFrench
    ? `Fiche_Pedagogique_${sanitizedSubject}_${sanitizedTitle}.doc`
    : isEnglish
    ? `Pedagogical_Fiche_${sanitizedSubject}_${sanitizedTitle}.doc`
    : `مذكرة_${sanitizedSubject}_${sanitizedTitle}.doc`;

  // Trigger download
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Generates a modern native OpenXML (.docx) file using the docx npm package.
 * Allows teachers who prefer strict .docx format to also download natively.
 */
export async function exportFicheToDocx(fiche: PedagogicalFiche): Promise<void> {
  const isFrench = fiche.header.language === "fr";
  const isEnglish = fiche.header.language === "en";
  const isRtl = !isFrench && !isEnglish;
  const primaryFont = isRtl ? "Traditional Arabic" : "Calibri";

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Republic & Ministry Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: isRtl,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: fiche.header.republic || "الجمهورية الجزائرية الديمقراطية الشعبية",
                bold: true,
                size: 24, // 12pt
                font: primaryFont,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: isRtl,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: fiche.header.ministry || "وزارة التربية الوطنية",
                bold: true,
                size: 22,
                font: primaryFont,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: isRtl,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: isFrench
                  ? `FICHE PÉDAGOGIQUE: ${fiche.header.subject} - ${fiche.header.resourceTitle}`
                  : isEnglish
                  ? `PEDAGOGICAL FICHE: ${fiche.header.subject} - ${fiche.header.resourceTitle}`
                  : `مذكرة بيداغوجية: ${fiche.header.subject} - ${fiche.header.resourceTitle}`,
                bold: true,
                size: 26,
                color: "1e3a8a",
                font: primaryFont,
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        bidirectional: isRtl,
                        children: [
                          new TextRun({
                            text: isFrench ? "Matière:" : isEnglish ? "Subject:" : "المادة:",
                            bold: true,
                            font: primaryFont,
                          }),
                          new TextRun({ text: ` ${fiche.header.subject}`, font: primaryFont }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        bidirectional: isRtl,
                        children: [
                          new TextRun({
                            text: isFrench ? "Niveau:" : isEnglish ? "Level:" : "المستوى:",
                            bold: true,
                            font: primaryFont,
                          }),
                          new TextRun({ text: ` ${fiche.header.level}`, font: primaryFont }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        bidirectional: isRtl,
                        children: [
                          new TextRun({
                            text: isFrench ? "Domaine:" : isEnglish ? "Field:" : "الميدان:",
                            bold: true,
                            font: primaryFont,
                          }),
                          new TextRun({ text: ` ${fiche.header.field}`, font: primaryFont }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        bidirectional: isRtl,
                        children: [
                          new TextRun({
                            text: isFrench ? "Séquence:" : isEnglish ? "Sequence:" : "المقطع التعلمي:",
                            bold: true,
                            font: primaryFont,
                          }),
                          new TextRun({ text: ` ${fiche.header.sequence}`, font: primaryFont }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        bidirectional: isRtl,
                        children: [
                          new TextRun({
                            text: isFrench ? "Durée:" : isEnglish ? "Duration:" : "المدة الزمنية:",
                            bold: true,
                            font: primaryFont,
                          }),
                          new TextRun({ text: ` ${fiche.header.duration}`, font: primaryFont }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        bidirectional: isRtl,
                        children: [
                          new TextRun({
                            text: isFrench ? "Enseignant:" : isEnglish ? "Teacher:" : "الأستاذ(ة):",
                            bold: true,
                            font: primaryFont,
                          }),
                          new TextRun({ text: ` ${fiche.header.teacherName || ""}`, font: primaryFont }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Competencies Section Title
          new Paragraph({
            spacing: { before: 240, after: 120 },
            bidirectional: isRtl,
            children: [
              new TextRun({
                text: isFrench
                  ? "I. COMPÉTENCES ET OBJECTIFS PÉDAGOGIQUES"
                  : isEnglish
                  ? "I. PEDAGOGICAL COMPETENCIES & OBJECTIVES"
                  : "أولاً: الكفاءات والأهداف البيداغوجية",
                bold: true,
                size: 24,
                font: primaryFont,
                color: "1e293b",
              }),
            ],
          }),

          new Paragraph({
            bidirectional: isRtl,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: isFrench ? "Compétence Globale: " : isEnglish ? "Global Competence: " : "الكفاءة الشاملة: ",
                bold: true,
                font: primaryFont,
              }),
              new TextRun({ text: fiche.competencies.globalCompetence, font: primaryFont }),
            ],
          }),
          new Paragraph({
            bidirectional: isRtl,
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: isFrench ? "Compétence Terminale: " : isEnglish ? "Terminal Competence: " : "الكفاءة الختامية: ",
                bold: true,
                font: primaryFont,
              }),
              new TextRun({ text: fiche.competencies.terminalCompetence, font: primaryFont }),
            ],
          }),

          // Procedure / Steps Section
          new Paragraph({
            spacing: { before: 240, after: 140 },
            bidirectional: isRtl,
            children: [
              new TextRun({
                text: isFrench
                  ? "II. DÉROULEMENT DE LA SÉANCE ET ACTIVITÉS"
                  : isEnglish
                  ? "II. LESSON PROCEDURE & ACTIVITIES"
                  : "ثانياً: سيرورة التعلم والوضعيات البيداغوجية",
                bold: true,
                size: 24,
                font: primaryFont,
                color: "1e293b",
              }),
            ],
          }),

          // Steps Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "1e293b", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: isFrench ? "Phase" : isEnglish ? "Phase" : "المرحلة والمدة",
                            bold: true,
                            color: "ffffff",
                            font: primaryFont,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "1e293b", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: isFrench ? "Contenu" : isEnglish ? "Content" : "عنصر المحتوى",
                            bold: true,
                            color: "ffffff",
                            font: primaryFont,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "1e293b", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: isFrench ? "Rôle Enseignant" : isEnglish ? "Teacher Role" : "نشاط الأستاذ ودوره",
                            bold: true,
                            color: "ffffff",
                            font: primaryFont,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "1e293b", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: isFrench ? "Activité Élève" : isEnglish ? "Student Activity" : "نشاط المتعلم ومساره",
                            bold: true,
                            color: "ffffff",
                            font: primaryFont,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "1e293b", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: isFrench ? "Évaluation" : isEnglish ? "Assessment" : "التقويم التكويني",
                            bold: true,
                            color: "ffffff",
                            font: primaryFont,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              // Data Rows
              ...fiche.steps.map(
                (step) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            bidirectional: isRtl,
                            children: [
                              new TextRun({ text: step.phase, bold: true, font: primaryFont }),
                              new TextRun({ text: `\n(${step.timing})`, size: 18, font: primaryFont }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            bidirectional: isRtl,
                            children: [new TextRun({ text: step.contentElement, bold: true, font: primaryFont })],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            bidirectional: isRtl,
                            children: [new TextRun({ text: step.teacherActivity, font: primaryFont })],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            bidirectional: isRtl,
                            children: [new TextRun({ text: step.studentActivity, font: primaryFont })],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            bidirectional: isRtl,
                            children: [new TextRun({ text: step.formativeAssessment, font: primaryFont })],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Board Summary
          new Paragraph({
            spacing: { before: 240, after: 100 },
            bidirectional: isRtl,
            children: [
              new TextRun({
                text: isFrench
                  ? `III. TRACE ÉCRITE: ${fiche.boardSummary.title}`
                  : isEnglish
                  ? `III. BOARD SUMMARY: ${fiche.boardSummary.title}`
                  : `ثالثاً: أثر السبورة / الخلاصة: ${fiche.boardSummary.title}`,
                bold: true,
                size: 22,
                font: primaryFont,
              }),
            ],
          }),
          ...fiche.boardSummary.points.map(
            (pt) =>
              new Paragraph({
                bidirectional: isRtl,
                bullet: { level: 0 },
                children: [new TextRun({ text: pt, font: primaryFont })],
              })
          ),
          ...(fiche.boardSummary.takeawayRule
            ? [
                new Paragraph({
                  spacing: { before: 100 },
                  bidirectional: isRtl,
                  children: [
                    new TextRun({
                      text: isFrench ? "Règle: " : isEnglish ? "Rule: " : "القاعدة المستخلصة: ",
                      bold: true,
                      font: primaryFont,
                    }),
                    new TextRun({ text: fiche.boardSummary.takeawayRule, font: primaryFont }),
                  ],
                }),
              ]
            : []),

          // Home Assignment
          new Paragraph({
            spacing: { before: 200, after: 100 },
            bidirectional: isRtl,
            children: [
              new TextRun({
                text: isFrench
                  ? "IV. INVESTISSEMENT À DOMICILE"
                  : isEnglish
                  ? "IV. HOME ASSIGNMENT"
                  : "رابعاً: المهمة والاستثمار المنزلي",
                bold: true,
                size: 22,
                font: primaryFont,
              }),
            ],
          }),
          new Paragraph({
            bidirectional: isRtl,
            children: [new TextRun({ text: fiche.homeAssignment, font: primaryFont })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const rawSubject = fiche.header.subject || "مادة";
  const rawTitle = fiche.header.resourceTitle || fiche.header.field || "مذكرة";
  const sanitizedSubject = rawSubject.replace(/[\/\\?%*:|"<>]/g, "-").trim();
  const sanitizedTitle = rawTitle.replace(/[\/\\?%*:|"<>]/g, "-").trim();
  const fileName = isFrench
    ? `Fiche_Pedagogique_${sanitizedSubject}_${sanitizedTitle}.docx`
    : isEnglish
    ? `Pedagogical_Fiche_${sanitizedSubject}_${sanitizedTitle}.docx`
    : `مذكرة_${sanitizedSubject}_${sanitizedTitle}.docx`;

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

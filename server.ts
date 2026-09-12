import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { PREBUILT_FICHES } from "./src/data/prebuiltFiches";
import { ALGERIAN_SUBJECTS } from "./src/data/algerianCurriculum";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "سند - منظومة مذكرات التعليم المتوسط الجزائري",
    hasServerApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API endpoint to generate educational diagrams and illustrations (الصور والسندات التعليمية)
app.post("/api/generate-image", async (req, res) => {
  try {
    const {
      prompt,
      subject,
      userApiKey,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "يرجى تقديم وصف للسند التعليمي المراد توليده" });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "لم يتم العثور على مفتاح API. يرجى إدخال مفتاح Gemini في الإعدادات أو استخدام الروابط الخارجية.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const enhancedPrompt = `Educational illustration for Algerian middle school curriculum (${subject || 'علوم'}): ${prompt}. Clean white background, scientifically accurate, clear pedagogical details, sharp lines, high quality textbook diagram style.`;

    let generatedImageUrl: string | null = null;

    // Strategy 1: Attempt image generation using gemini-3.1-flash-lite-image
    try {
      const imgRes = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3",
          },
        },
      });

      if (imgRes.candidates?.[0]?.content?.parts) {
        for (const part of imgRes.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || "image/png";
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imageModelErr: any) {
      console.warn("gemini-3.1-flash-lite-image unavailable or requires paid key, generating educational SVG...", imageModelErr?.message);
    }

    // Strategy 2: If raster model is unavailable on current key tier, generate high-quality pedagogical SVG diagram
    if (!generatedImageUrl) {
      const isFr = (subject || "").toLowerCase().includes("fran") || (subject || "").toLowerCase().includes("فرنس");
      const isEn = (subject || "").toLowerCase().includes("ang") || (subject || "").toLowerCase().includes("eng") || (subject || "").toLowerCase().includes("إنجل");
      const langName = isFr ? "French" : isEn ? "English" : "Arabic";

      const svgPrompt = `You are a master pedagogical scientific graphic designer for Algerian middle school (C.E.M) textbooks.
Generate a comprehensive, scientifically accurate, and beautifully styled educational vector diagram in raw SVG format for the lesson topic:
"${prompt}" (Subject: ${subject || 'Sciences'}).

Design and Pedagogical Guidelines:
- Return ONLY valid raw SVG starting with <svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> and ending with </svg>.
- Do not wrap in markdown or backticks. Only the <svg>...</svg> element.
- Background: Soft modern light backdrop (#f8fafc) with a subtle rounded border.
- Layout: Large central scientific/pedagogical illustration (organs, apparatus, circuit, cell, geometry, map, or experiment setup) with clear contrasting colors, distinct outlines (#1e293b), and professional subtle gradients.
- Callout pointers & Labels: Use clear pointer lines with circles or arrowheads pointing to key parts, each with a neat label card/box written in ${langName}.
- Title bar at the top with a clear, professional Arabic/Latin title and subtitle.
- A small legend or key box at the bottom right/left summarizing the components.
- Ensure text is legible (font-family: 'Cairo', 'Segoe UI', system-ui, sans-serif, font-weight: 600).`;

      const svgModelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
      for (const svgModel of svgModelsToTry) {
        try {
          const svgRes = await ai.models.generateContent({
            model: svgModel,
            contents: svgPrompt,
          });

          let svgText = svgRes.text?.trim() || "";
          if (svgText.includes("```")) {
            svgText = svgText.replace(/```(?:xml|svg)?/gi, "").replace(/```/g, "").trim();
          }
          const svgStart = svgText.indexOf("<svg");
          const svgEnd = svgText.lastIndexOf("</svg>");
          if (svgStart !== -1 && svgEnd !== -1) {
            svgText = svgText.substring(svgStart, svgEnd + 6);
            const encodedSvg = encodeURIComponent(svgText)
              .replace(/'/g, "%27")
              .replace(/"/g, "%22");
            generatedImageUrl = `data:image/svg+xml;utf8,${encodedSvg}`;
            break;
          }
        } catch (svgErr: any) {
          console.warn(`SVG generation with ${svgModel} failed:`, svgErr?.message || svgErr);
        }
      }

      // If AI SVG models both failed, provide a clean pedagogical vector diagram
      if (!generatedImageUrl) {
        const titleText = (prompt || "سند تعليمي توضيحي").slice(0, 45);
        const fallbackSvg = `<svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="16" fill="url(#bgGrad)" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="24" y="24" width="752" height="64" rx="12" fill="url(#headerGrad)"/>
  <text x="750" y="62" fill="#ffffff" font-family="'Cairo', system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="end">${titleText}</text>
  <rect x="50" y="120" width="700" height="380" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="400" cy="300" r="110" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
  <circle cx="400" cy="300" r="65" fill="#dbeafe" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,4"/>
  <circle cx="400" cy="300" r="25" fill="#1d4ed8"/>
  <line x1="400" y1="190" x2="400" y2="150" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)"/>
  <rect x="330" y="140" width="140" height="34" rx="6" fill="#1e293b"/>
  <text x="400" y="162" fill="#ffffff" font-family="'Cairo', system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">المحور / البنية المركزية</text>
  <line x1="510" y1="300" x2="560" y2="300" stroke="#0f172a" stroke-width="2"/>
  <rect x="560" y="282" width="130" height="36" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <text x="625" y="305" fill="#0f172a" font-family="'Cairo', system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">المستوى الوظيفي</text>
  <rect x="40" y="520" width="720" height="50" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>
  <text x="730" y="552" fill="#475569" font-family="'Cairo', system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="end">سند بيداغوجي توضيحي لمناهج التعليم المتوسط بالجمهورية الجزائرية (الجيل الثاني)</text>
</svg>`;
        const encodedSvg = encodeURIComponent(fallbackSvg).replace(/'/g, "%27").replace(/"/g, "%22");
        generatedImageUrl = `data:image/svg+xml;utf8,${encodedSvg}`;
      }
    }

    if (!generatedImageUrl) {
      throw new Error("تعذر توليد الرسم التعليمي. يرجى إعادة المحاولة أو استخدام خيار الرابط الخارجي.");
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      prompt: prompt,
    });
  } catch (err: any) {
    console.error("Error in /api/generate-image:", err);
    return res.status(500).json({
      error: err.message || "حدث خطأ أثناء توليد الصورة التعليمية",
    });
  }
});

// Helper function to synthesize official Algerian Generation 2 Pedagogical Fiche
function synthesizeCurricularFiche(params: {
  level?: string;
  subject?: string;
  field?: string;
  sequence?: string;
  resourceTitle?: string;
  sessionType?: string;
  duration?: string;
  ficheStyle?: string;
  customNotes?: string;
  language?: string;
}): any {
  const resourceTitle = params.resourceTitle?.trim() || "المورد المعرفي المستهدف";
  const level = params.level?.trim() || "السنة الرابعة متوسط (4AM)";
  const subject = params.subject?.trim() || "علوم الطبيعة والحياة";
  const field = params.field?.trim() || "الميدان التعليمي";
  const sequence = params.sequence?.trim() || "المقطع التعلمي الرسمي";
  const sessionType = params.sessionType?.trim() || "حصة إرساء موارد معرفية وتجريبية";
  const duration = params.duration?.trim() || "1 ساعة (60 دقيقة)";
  const ficheStyle = params.ficheStyle || "detailed";

  // Check if an existing prebuilt fiche matches closely
  const match = PREBUILT_FICHES.find(
    (pf) =>
      pf.header.resourceTitle.toLowerCase().includes(resourceTitle.toLowerCase()) ||
      resourceTitle.toLowerCase().includes(pf.header.resourceTitle.toLowerCase())
  );
  if (match) {
    return {
      ...match,
      id: `fiche_syn_${Date.now()}`,
      header: {
        ...match.header,
        level: level || match.header.level,
        subject: subject || match.header.subject,
        field: field || match.header.field,
        sequence: sequence || match.header.sequence,
        resourceTitle: resourceTitle || match.header.resourceTitle,
        sessionType: sessionType || match.header.sessionType,
        duration: duration || match.header.duration,
        ficheStyle: ficheStyle || match.header.ficheStyle || "detailed",
      },
    };
  }

  const isFr =
    params.language === "fr" ||
    subject.toLowerCase().includes("fran") ||
    subject.toLowerCase().includes("فرنس");

  const isEn =
    params.language === "en" ||
    subject.toLowerCase().includes("ang") ||
    subject.toLowerCase().includes("eng") ||
    subject.toLowerCase().includes("إنجل");

  if (isFr) {
    return {
      header: {
        republic: "République Algérienne Démocratique et Populaire",
        ministry: "Ministère de l'Éducation Nationale",
        level: level,
        subject: subject,
        field: field || "Projet d'apprentissage officiel",
        sequence: sequence || "Séquence pédagogique officielle",
        resourceTitle: resourceTitle,
        sessionType: sessionType || "Apprentissage linguistique",
        duration: duration,
        ficheNumber: "0" + Math.floor(Math.random() * 8 + 1),
        ficheStyle: ficheStyle,
        language: "fr",
      },
      competencies: {
        globalCompetence:
          "L'apprenant est capable de communiquer et d'interagir oralement et par écrit dans des situations de communication variées en mobilisant ses acquis linguistiques et discursifs selon les programmes de 2ème Génération.",
        terminalCompetence: `Produire des énoncés cohérents et pertinents en mobilisant la notion didactique : ${resourceTitle}.`,
        competenceComponents: [
          `Identifier et analyser la structure linguistique et conceptuelle de : ${resourceTitle}.`,
          `Manipuler et réinvestir la règle grammaticale dans des activités d'entraînement ciblées.`,
          `Intégrer la ressource dans une courte production d'écrit autonome et expressive.`,
        ],
        assessmentIndicators: [
          "C1 (Pertinence) : Reconnaissance exacte de la règle et de ses conditions d'emploi.",
          "C2 (Correction) : Application correcte des accords et marques morphosyntaxiques.",
          "C3 (Cohérence) : Formulation d'énoncés clairs, bien construits et conformes au sens.",
        ],
        didacticSupports: [
          "Manuel scolaire officiel de 2ème Génération (G2).",
          "Tableau didactique, corpus de phrases supports et fiches d'exercices d'application.",
          "Cahier de cours de l'apprenant.",
        ],
        valuesAndAttitudes: [
          "Développer l'esprit critique, le goût de la lecture et le travail coopératif en binômes.",
          "Valoriser le patrimoine culturel et l'ouverture sur le monde.",
        ],
      },
      steps: [
        {
          phase: "Mise en situation / Éveil de l'intérêt",
          timing: "10 min",
          contentElement: "Rappel des prérequis et situation déclenchante",
          teacherActivity: `Présente au tableau une phrase déclencheuse contextuelle liée à "${resourceTitle}". Pose des questions d'orientation pour réactiver les prérequis des élèves.`,
          studentActivity:
            "Observe la phrase support, participe au rappel des acquis antérieurs et émet des hypothèses sur le phénomène linguistique.",
          strategy: "Dialogue horizontal et questionnement interactif",
          formativeAssessment: "Capacité à mobiliser les acquis antérieurs indispensables.",
        },
        {
          phase: "Construction des apprentissages (Analyse & Règle)",
          timing: "35 min",
          contentElement: `Découverte, conceptualisation et manipulation de : ${resourceTitle}`,
          teacherActivity:
            "Guide les apprenants à travers des questions précises pour identifier les régularités linguistiques, formaliser la règle au tableau et encadrer la manipulation guidée.",
          studentActivity:
            "Travaille en binôme, isole les constituants cibles, dégage la règle avec le professeur et réalise les exercices d'entraînement oral et écrit.",
          strategy: "Travail en binômes puis mise en commun collective",
          formativeAssessment: "Exactitude de l'application de la règle lors des manipulations.",
        },
        {
          phase: "Évaluation & Réinvestissement",
          timing: "15 min",
          contentElement: "Application immédiate et synthèse",
          teacherActivity:
            "Propose un exercice d'intégration court ou une consigne d'écriture rapide en deux à trois phrases. Circule pour guider les élèves en difficulté.",
          studentActivity:
            "Rédige individuellement la courte production demandée en réinvestissant la notion étudiée.",
          strategy: "Travail individuel autonome",
          formativeAssessment: "Réussite du réinvestissement dans la production écrite.",
        },
      ],
      boardSummary: {
        title: `Retenons : ${resourceTitle}`,
        points: [
          `Définition et rôle fondamental de la notion dans la construction de la phrase.`,
          `Règle d'emploi, morphologie et connecteurs spécifiques.`,
          `Exemple modèle annoté à recopier soigneusement sur le cahier.`,
        ],
        takeawayRule: `Règle d'or : Maîtriser ${resourceTitle} permet d'enrichir et de structurer logiquement les énoncés écrits et oraux.`,
      },
      homeAssignment:
        "Réaliser l'exercice d'application n°3 du manuel scolaire officiel sur le cahier d'activités.",
      teacherSelfEvaluation: {
        pedagogicalNotes:
          "Veiller à faire reformuler la règle par plusieurs élèves avant de passer à la phase de copie au tableau.",
        anticipatedDifficulties: [
          "Confusion possible avec des structures morphologiquement proches : prévoir un tableau comparatif d'appui.",
        ],
      },
    };
  }

  if (isEn) {
    return {
      header: {
        republic: "People's Democratic Republic of Algeria",
        ministry: "Ministry of National Education",
        level: level,
        subject: subject,
        field: field || "Learning Sequence",
        sequence: sequence || "Official CBA Sequence",
        resourceTitle: resourceTitle,
        sessionType: sessionType || "Language Focus (PPU / PDP Framework)",
        duration: duration,
        ficheNumber: "0" + Math.floor(Math.random() * 8 + 1),
        ficheStyle: ficheStyle,
        language: "en",
      },
      competencies: {
        globalCompetence:
          "By the end of the middle school cycle, the learner will be able to interact orally and in writing in meaningful communicative situations using appropriate English structures according to Algerian 2nd Generation standards.",
        terminalCompetence: `Mobilize linguistic and communicative resources to interact and produce meaning regarding: ${resourceTitle}.`,
        competenceComponents: [
          `Discover and deduce the target grammatical and functional pattern of: ${resourceTitle}.`,
          `Practice the language pattern through controlled and semi-controlled activities.`,
          `Produce short meaningful oral or written messages applying the target structure in authentic contexts.`,
        ],
        assessmentIndicators: [
          "Accuracy: Correct identification and formulation of the linguistic form.",
          "Appropriacy: Proper communicative usage in meaningful sentences.",
          "Fluency & Coherence: Clear articulation and well-organized written thoughts.",
        ],
        didacticSupports: [
          "Algerian 2nd Generation official textbook.",
          "Whiteboard, prompt cards, worksheets, visual aids, or realia.",
          "Pupils' copybooks.",
        ],
        valuesAndAttitudes: [
          "Fostering open communication, active pair collaboration, and mutual respect.",
          "Building self-confidence in using English as an international language.",
        ],
      },
      steps: [
        {
          phase: "Warm-up / Lead-in",
          timing: "10 min",
          contentElement: "Prior knowledge activation and situational trigger",
          teacherActivity: `Presents an engaging situational question or visual prompt on the board connected to "${resourceTitle}". Elicits pupils' ideas.`,
          studentActivity:
            "Listen attentively, answer teacher prompt questions, and discover the core topic of the session.",
          strategy: "Whole-class interactive elicitation",
          formativeAssessment: "Pupils' readiness and engagement in sharing initial answers.",
        },
        {
          phase: "Presentation & Practice (PPU)",
          timing: "35 min",
          contentElement: `Target structure presentation, rule deduction, and guided practice for: ${resourceTitle}`,
          teacherActivity:
            "Highlights the key language forms, guides pupils to deduce the grammatical rule, and facilitates pair practice tasks.",
          studentActivity:
            "Work in pairs, identify target rules, complete guided practice exercises, and check answers collaboratively.",
          strategy: "Pair work followed by board consolidation",
          formativeAssessment: "Accuracy in applying the rule during controlled exercises.",
        },
        {
          phase: "Use / Production",
          timing: "15 min",
          contentElement: "Communicative task and production",
          teacherActivity:
            "Sets a short communicative task (writing 2-3 sentences or a quick dialogue). Circulates to provide formative feedback.",
          studentActivity:
            "Complete the task independently or in pairs, applying the newly learned linguistic structure.",
          strategy: "Individual / Pair autonomous task",
          formativeAssessment: "Learner ability to use the form in a meaningful sentence.",
        },
      ],
      boardSummary: {
        title: `Summary: ${resourceTitle}`,
        points: [
          `Key rule & structural pattern.`,
          `Clear contextual example sentence with highlighted target forms.`,
          `Usage notes and common pitfalls to avoid.`,
        ],
        takeawayRule: `Remember: Practice using ${resourceTitle} in meaningful sentences every day!`,
      },
      homeAssignment: "Complete activity 2 on page from the official textbook.",
      teacherSelfEvaluation: {
        pedagogicalNotes:
          "Ensure peer-correction takes place before final board summary validation.",
        anticipatedDifficulties: [
          "L1 interference: emphasize repeated contextualized drilling and clear board modeling.",
        ],
      },
    };
  }

  // Arabic default (Official 2nd Generation format)
  return {
    header: {
      republic: "الجمهورية الجزائرية الديمقراطية الشعبية",
      ministry: "وزارة التربية الوطنية",
      level: level,
      subject: subject,
      field: field,
      sequence: sequence,
      resourceTitle: resourceTitle,
      sessionType: sessionType,
      duration: duration,
      ficheNumber: "0" + Math.floor(Math.random() * 8 + 1),
      ficheStyle: ficheStyle,
      language: "ar",
    },
    competencies: {
      globalCompetence:
        "يحل مشكلات دالة بتجنيد موارده المعرفية والمنهجية والقيمية المرتبطة بالمادة، معتمداً على مسعى علمي موضوعي وفق مناهج الجيل الثاني المعتمدة رسمياً.",
      terminalCompetence: `يمارس مسعى بيداغوجياً واستقصائياً لحل وضعيات مشكلة تتعلق بـ: ${resourceTitle}.`,
      competenceComponents: [
        `يحدد المفاهيم والمبادئ الأساسية المرتبطة بمورد: ${resourceTitle}.`,
        `يوظف السندات الديدكتيكية والملاحظة العلمية والتجريبية لاستخراج العلاقات السببية وبناء المعرفة.`,
        `يصوغ استنتاجاً علمياً دقيقاً وموثقاً يسجل كأثر كتابي مرسي على كراس التلميذ.`,
      ],
      assessmentIndicators: [
        "معيار الوجاهة (C1): تحديد المشكل العلمي وصياغة فرضيات وجيهة قابلة للاختبار.",
        "معيار الاستعمال السليم لأدوات المادة (C2): استثمار الوثائق والسندات بدقة علمية ومنهجية.",
        "معيار الانسجام (C3): التوصل إلى النتيجة المعرفية المستهدفة وصياغة ملخص سليم لغوياً وعلمياً.",
      ],
      didacticSupports: [
        "الكتاب المدرسي الرسمي المعتمد (الجيل الثاني).",
        "السبورة المدرسية، وثائق وسندات مصورة، تجارب مخبرية أو برمجيات محاكاة رقمية.",
        "كراس الدروس وكراس الأنشطة للتلميذ.",
      ],
      valuesAndAttitudes: [
        "تنمية الفكر العلمي النقدي، والملاحظة المنظمة، والفضول المعرفي الإيجابي.",
        "ترسيخ روح العمل الجماعي التعاوني واحترام الرأي الآخر والمحافظة على الممتلكات العامة والصحة.",
      ],
    },
    steps: [
      {
        phase: "مرحلة الانطلاق (Mise en situation)",
        timing: "10 دقائق",
        contentElement: "التذكير بالمكتسبات القبلية وطرح الوضعية المشكلة الانطلاقية الجزئية",
        teacherActivity: `يقدم الأستاذ تذكيراً سريعاً بالمكتسبات القبلية، ثم يطرح وضعية مشكلة جزئية محفزة حول موضوع "${resourceTitle}" تثير الفضول العلمي لدى المتعلمين، ويدون التساؤلات والفرضيات الصادرة عنهم على السبورة.`,
        studentActivity:
          "يستمع بتركيز، يسترجع معارفه السابقة، يشارك في مناقشة المشكل العلمي، ويصوغ فرضيات أولية قابلة للتحقق.",
        strategy: "عصف ذهني ومناقشة أفقية موجهة",
        formativeAssessment:
          "مدى تفاعل المتعلمين في استرجاع المكتسبات وصياغة فرضيات سليمة مرتبطة بالمشكل.",
      },
      {
        phase: "مرحلة بناء التعلمات (إرساء الموارد المعرفية)",
        timing: "35 دقيقة",
        contentElement: `البحث، استغلال السندات وبناء المفهوم المعرفي لـ: ${resourceTitle}`,
        teacherActivity:
          "يقسم التلاميذ إلى أفواج عمل مصغرة، يوزع السندات والتعليمات المحددة بدقة، يتنقل بين الأفواج للتوجيه والتحفيز وتذليل الصعوبات المنهجية، ثم يسير مرحلة المصادقة والمناقشة الجماعية.",
        studentActivity:
          "يعمل ضمن الفوج بتعاون، يحلل الوثائق / يجري التجربة، يدون الملاحظات، يناقش النتائج مع أقرانه، ويشارك في صياغة الحوصلة المعرفية النهائية.",
        strategy: "العمل بالأفواج التعاونية ثم التركيب الجماعي",
        formativeAssessment:
          "مدى قدرة الفوج على قراءة السند واستخلاص المعلومة المستهدفة بدقة علمية.",
      },
      {
        phase: "مرحلة الاستثمار والتقويم (الإدماج الجزئي)",
        timing: "15 دقيقة",
        contentElement: "تطبيق فوري لتقويم المورد المعرفي المكتسب وتثبيته",
        teacherActivity:
          "يقترح تعليمة أو تمريناً تطبيقياً سريعاً من الكتاب المدرسي للتحقق من مدى استيعاب المورد المُرسي، ويتابع إنجازات التلاميذ الفردية.",
        studentActivity:
          "يقوم بحل التمرين فردياً على كراس المحاولات، ويشارك في التصحيح الجماعي الذاتي على السبورة.",
        strategy: "عمل فردي مستقل ثم تصحيح جماعي موجه",
        formativeAssessment: "التحقق من قدرة المتعلم على تجنيد المورد في سياق تطبيقي جديد.",
      },
    ],
    boardSummary: {
      title: `الملخص السبوري: ${resourceTitle}`,
      points: [
        `المفهوم الأساسي: تعريف دقيق وموجز للمورد المعرفي المستهدف.`,
        `الآلية والخصائص: العناصر والمراحل الجوهرية المكتشفة خلال الحصة.`,
        `العلاقة الوظيفية: الأثر الإيجابي والتطبيقي في المحيط والحياة اليومية.`,
      ],
      takeawayRule: `إرساء معرفي جامع: يعتبر مورد (${resourceTitle}) قاعدة أساسية في فهم كفاءة هذا المقطع التعلمي.`,
    },
    homeAssignment:
      "حل النشاط التطبيقي المحدد في الكتاب المدرسي في الصفحة المقابلة للمورد لتعزيز وتثبيت التعلمات.",
    teacherSelfEvaluation: {
      pedagogicalNotes:
        "الحرص على التوزيع العادل لفرص المشاركة والتأكد من وضوح السندات لجميع التلاميذ.",
      anticipatedDifficulties: [
        "صعوبة في التعبير العلمي الدقيق: التدخل لإكساب التلميذ المصطلحات الرسمية للمنهاج.",
      ],
    },
  };
}

// API endpoint to generate official Algerian pedagogical lesson plan (المذكرة البيداغوجية الرسمية)
app.post("/api/generate-fiche", async (req, res) => {
  try {
    const {
      level, // "1am", "2am", "3am", "4am"
      subject, // "علوم الطبيعة والحياة", "العلوم الفيزيائية والتكنولوجيا", "اللغة العربية", "الرياضيات", etc.
      field, // الميدان (Domaine)
      sequence, // المقطع التعلمي (Séquence)
      resourceTitle, // المورد المعرفي / عنوان الدرس
      sessionType, // نوع الحصة: إرساء موارد / تعلم إدماجي / معالجة بيداغوجية
      duration, // "1 ساعة", "2 ساعة"
      customNotes, // ملاحظات أو توجيهات الأستاذ الإضافية
      language, // "ar" | "fr" | "en"
      userApiKey, // Optional custom key if provided by user
      ficheStyle = "detailed", // "concise" | "detailed" | "technical"
      images = [], // السندات والوثائق المصورة المرفقة
    } = req.body;

    const apiKey = (userApiKey && userApiKey.trim()) || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.info("No API key available, using curriculum synthesizer directly.");
      const fallback = synthesizeCurricularFiche({
        level,
        subject,
        field,
        sequence,
        resourceTitle,
        sessionType,
        duration,
        ficheStyle,
        customNotes,
        language,
      });
      return res.json({
        success: true,
        fiche: fallback,
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const isFrench =
      language === "fr" ||
      subject?.toLowerCase().includes("franç") ||
      subject?.toLowerCase().includes("franc") ||
      subject?.toLowerCase().includes("فرنسية");

    const isEnglish =
      language === "en" ||
      subject?.toLowerCase().includes("anglais") ||
      subject?.toLowerCase().includes("english") ||
      subject?.toLowerCase().includes("إنجليزية") ||
      subject?.toLowerCase().includes("انجليزية");

    let prompt = "";
    let systemInstruction = "";

    if (isFrench) {
      systemInstruction =
        "Tu es un inspecteur pédagogique expérimenté de l'enseignement moyen au Ministère de l'Éducation Nationale en Algérie. Tu es expert du programme officiel de 2ème Génération (Génération 2) et de l'Approche par Compétences (APC). Tout le contenu généré doit être entièrement en français, officiel et bidaudique.";
      
      const styleInstructionFr =
        ficheStyle === "concise"
          ? `\n- STYLE DE RÉDACTION: SYNTHÉTIQUE ET CONCIS (Fiche courte et épurée)
  * Rédige une fiche allégée se concentrant sur l'essentiel didactique direct.
  * Formule des compétences et objectifs courts, directs et sans fioritures.
  * Déroulement procédural épuré : phases chronologiques claires et directes sans développements excessifs.
  * Rôle de l'enseignant et de l'élève concis et ciblés.
  * Trace écrite au tableau nette et condensée (l'essentiel absolu à retenir).`
          : ficheStyle === "technical"
          ? `\n- STYLE DE RÉDACTION: TECHNIQUE ET DIDACTIQUE PROCÉDURAL (Normes d'inspection)
  * Rédige une fiche hautement technique, formalisée et rigoureuse selon les standards d'inspection.
  * Formulation strictement opérationnelle et comportementale des compétences (verbes d'action observables et mesurables).
  * Critères et indicateurs d'évaluation structurés formellement (ex: C1 Pertinence, C2 Utilisation correcte des outils de la langue, C3 Cohérence).
  * Précision didactique aiguë des phases d'apprentissage, analyse fine des démarches de résolution et des variables didactiques.
  * Exploitation explicite des supports didactiques techniques/numériques et grille de remédiation formative détaillée.`
          : `\n- STYLE DE RÉDACTION: DÉTAILLÉ ET APPROFONDI (Fiche modèle d'excellence recommandée)
  * Rédige une fiche pédagogique exhaustive, riche et minutieusement détaillée.
  * Déroulement très complet de la séance : retranscription fidèle des questions orales d'étayage de l'enseignant, des réponses et hypothèses attendues des élèves.
  * Détail approfondi des stratégies de travail coopératif (binômes/groupes), des interactions verbales et de l'institutionnalisation.
  * Trace écrite au tableau richement structurée et bilan pédagogique prévisionnel approfondi.`;

      prompt = `Tu es un inspecteur pédagogique de l'enseignement moyen algérien (Algérie). Rédige une "Fiche Pédagogique Officielle et Modèle" pour la matière: Français (Langue Française).
Données de la séance:
- Niveau: ${level || "4ème Année Moyenne (4AM)"}
- Matière: Français (Langue Française)
- Domaine / Projet: ${field || "Projet 1: À la découverte de notre région"}
- Séquence: ${sequence || "Séquence 1: Décrire un lieu et son patrimoine"}
- Ressource / Titre de la séance: ${resourceTitle || "La subordonnée relative par qui, que, où"}
- Nature de la séance: ${sessionType || "Apprentissage linguistique / Grammaire"}
- Durée: ${duration || "1 heure (60 minutes)"}
- Style de fiche sélectionné: ${ficheStyle === "concise" ? "Synthétique (Concis)" : ficheStyle === "technical" ? "Technique (Didactique)" : "Détaillé (Approfondi)"}
${customNotes ? `- Orientations de l'enseignant: ${customNotes}` : ""}
${styleInstructionFr}

Exigences pédagogiques algériennes (Génération 2):
1. Formulation des compétences selon les termes officiels de l'Éducation Nationale algérienne:
   - Compétence globale du niveau.
   - Compétence terminale du projet/domaine.
   - Composantes de la compétence (objectifs d'apprentissage opérationnels).
   - Indicateurs d'évaluation / critères de réussite.
   - Supports didactiques (Manuel scolaire, textes supports, tableau, audio/vidéo).
   - Valeurs et attitudes (Identité nationale, citoyenneté, esprit critique, travail collaboratif).
2. Déroulement chronologique détaillé de la séance (tableau):
   - Phase de mise en situation / Éveil de l'intérêt (Rappel des prérequis + situation problème ou phrase déclencheuse).
   - Phase de construction des apprentissages (Observation, analyse, formulation de la règle, manipulation/entraînement, avec détails précis du rôle de l'enseignant et du rôle de l'élève, et stratégie: travail en binômes/collectif).
   - Phase d'évaluation / Réinvestissement immédiat (Exercice d'application ou courte production).
3. Synthèse / Trace écrite au tableau (la règle ou le tableau récapitulatif que l'élève recopie sur son cahier).
4. Travail à domicile (exercice ou petite recherche).
5. Auto-évaluation et difficultés prévues.

Tous les textes doivent être rédigés en français soigné et conforme au programme algérien. Format JSON strict.`;
    } else if (isEnglish) {
      systemInstruction =
        "You are an expert pedagogical inspector and curriculum designer for middle school English at the Algerian Ministry of National Education. You are fully proficient in the 2nd Generation syllabus (MS1-MS4 / BEM), the Competency-Based Approach (CBA), and the PDP (Pre, During, Post) / PPU (Presentation, Practice, Use) teaching frameworks.";
      
      const styleInstructionEn =
        ficheStyle === "concise"
          ? `\n- LESSON PLAN STYLE: CONCISE AND FOCUSED (Compact & Direct Layout)
  * Keep terminal and enabling objectives sharp, precise, and straight to the point.
  * Streamlined PDP / PPU procedure: concise teacher cues, direct learner tasks, immediate formative check without extra verbiage.
  * Concise board summary focused on core rules and essential examples.`
          : ficheStyle === "technical"
          ? `\n- LESSON PLAN STYLE: TECHNICAL AND DIDACTIC (Formative criteria-based)
  * Formulate strictly observable behavioral outcomes and measurable competencies.
  * Didactic classification of assessment criteria (accuracy, fluency, appropriacy, coherence).
  * Explicit technical breakdown of linguistic forms, phonological rules, and scaffolding matrices.
  * Structured didactic remedial interventions for anticipated learning hurdles.`
          : `\n- LESSON PLAN STYLE: DETAILED AND IN-DEPTH (Comprehensive Model)
  * Exhaustive procedural breakdown of each phase (Warm-up, Presentation, Practice, Use).
  * Explicit script-level teacher elicitation questions and anticipated learner responses/hypotheses.
  * Thorough descriptions of cooperative pair/group work strategies and multi-tiered scaffolding.
  * In-depth board record and comprehensive pedagogical self-evaluation notes.`;

      prompt = `You are a middle school English inspector at the Algerian Ministry of National Education. Prepare an "Official Algerian Pedagogical Lesson Plan (Fiche Pédagogique)" entirely in English.
Lesson Specifications:
- Level: ${level || "4th Year Middle School (4MS)"}
- Subject: English Language
- Domain / Project: ${field || "Sequence 1: Me, Universal Landmarks and Outstanding Figures"}
- Sequence: ${sequence || "Sequence 1: Describing Landmarks and Historical Figures"}
- Learning Resource / Focus: ${resourceTitle || "Expressing similarities and differences with like/unlike/as...as"}
- Framework / Session Type: ${sessionType || "Language Focus (PPU) / Listening & Speaking (PDP)"}
- Duration: ${duration || "1 hour (60 minutes)"}
- Selected Plan Style: ${ficheStyle === "concise" ? "Concise (Compact)" : ficheStyle === "technical" ? "Technical (Didactic)" : "Detailed (Comprehensive)"}
${customNotes ? `- Teacher's remarks: ${customNotes}` : ""}
${styleInstructionEn}

Algerian 2nd Generation Standards:
1. Formulate competencies using Algerian Ministry of National Education terminology:
   - Global Competence of the level (MS1, MS2, MS3, or MS4).
   - Terminal Competence of the sequence.
   - Enabling objectives / Competence components.
   - Assessment criteria and indicators of success.
   - Didactic materials (Textbook, flashcards, board, worksheets, realia).
   - Core Values & Cross-curricular competencies (National identity, openness to the world, critical thinking).
2. Detailed Lesson Procedure table:
   - Warm-up / Review: engaging pupils and activating prior knowledge.
   - Presentation / Input: Presentation of the target structure or listening/reading text in context.
   - Practice / Skill building: Guided and semi-guided practice with teacher and learner activities clearly detailed.
   - Use / Production: Communicative task, role-play or writing task.
3. Board Summary / Written Record (Clear structure for pupils' copybooks).
4. Homework / Assignment.
5. Anticipated difficulties and pedagogical solutions.

Return strictly in the required JSON schema entirely in English.`;
    } else {
      systemInstruction =
        "أنت خبير التفتيش البيداغوجي للتعليم المتوسط الجزائري. صياغتك رسمية، تربوية دقيقة، تستخدم مصطلحات منهاج الجيل الثاني المعتمد رسمياً في الجزائر.";
      
      const styleInstructionAr =
        ficheStyle === "concise"
          ? `\n- نمط المذكرة المطلوب: مختصر وموجز (Concise / Synthétique)
  * صياغة مركزة ومباشرة تقتصر على اللب والأساسيات التربوية دون حشو أو إطالة.
  * صياغة الكفاءات ومؤشرات النجاح في نقاط مقتضبة ومحددة بدقة.
  * مراحل سيرورة الدرس موجزة ومكثفة: تقتصر على التعليمات الأساسية للأستاذ ونشاط المتعلم المستهدف والتقويم التكويني السريع.
  * ملخص سبوري مرسي مركز وسريع الاستيعاب على كراس التلميذ.`
          : ficheStyle === "technical"
          ? `\n- نمط المذكرة المطلوب: تقني وديدكتيكي إجرائي (Technical / Didactique)
  * صياغة تفتيشية ديدكتيكية بالغة الدقة والمصطلحات التخصصية الرسمية لمنهاج الجيل الثاني.
  * صياغة سلوكية إجرائية صارمة لمركبات الكفاءة بأفعال قابلة للملاحظة والقياس الدقيق.
  * تصنيف شبكة معايير ومؤشرات التقويم التكويني بدقة تفتيشية (معيار الوجاهة C1، الاستعمال السليم لأدوات المادة C2، الانسجام C3).
  * تفصيل الاستثمار الديدكتيكي للسندات والوسائط التقنية والتجريبية والمحاكاة الرقمية، مع شبكة مؤشرات ومعالجة بيداغوجية دقيقة للتعثرات.`
          : `\n- نمط المذكرة المطلوب: تفصيلي وشامل (Detailed / Approfondi)
  * صياغة نموذجية وافية وشديدة التفصيل والعمق تلبي أعلى معايير التفتيش والتأطير التربوي.
  * تفصيل دقيق لسيرورة الحصة التعليمية التعلمية: كتابة الأسئلة الحوارية والاستدراجية التي يطرحها الأستاذ نصياً، الأجوبة والفرضيات المتوقعة من التلاميذ، وتفاصيل العمل بالأفواج واستراتيجيات التعلم النشط.
  * ملخص سبوري مهيكل وموسع مع شبكة تقويم موسعة ومعالجة دقيقة للصعوبات البيداغوجية المتوقعة.`;

      prompt = `أنت مفتش تربوي وبيداغوجي خبير في التعليم المتوسط بوزارة التربية الوطنية الجزائرية ومتمكن جداً من منهاج الجيل الثاني (الجيل 2) والمقاربة بالكفاءات (Approche par compétences) والوثيقة المرافقة للمناهج ودليل الأستاذ.

المطلوب إعداد "مذكرة بيداغوجية رسمية نموذجية ومعتمدة" لحصة تعليمية وفق المعطيات التالية:
- المستوى: ${level || "الرابعة متوسط"}
- المادة: ${subject || "علوم الطبيعة والحياة"}
- الميدان (Domaine): ${field || "الإنسان والصحة"}
- المقطع التعلمي (Séquence): ${sequence || "التغذية عند الإنسان"}
- المورد المعرفي المستهدف (عنوان الحصة): ${resourceTitle || "الهضم في الأنبوب الهضمي"}
- نوع الحصة: ${sessionType || "إرساء موارد معرفية"}
- المدة الزمنية: ${duration || "1 ساعة (60 دقيقة)"}
- نمط المذكرة المختار: ${ficheStyle === "concise" ? "مختصر وموجز" : ficheStyle === "technical" ? "تقني وديدكتيكي إجرائي" : "تفصيلي وشامل"}
${customNotes ? `- توجيهات خاصة من الأستاذ: ${customNotes}` : ""}
${styleInstructionAr}

احرص بدقة تامة على:
1. صياغة الكفاءات وفق المصطلحات الرسمية لوزارة التربية الوطنية الجزائرية:
   - الكفاءة الشاملة للطور/المستوى.
   - الكفاءة الختامية الخاصة بالميدان.
   - مركّبات الكفاءة (أفعال إجرائية دقيقة).
   - معايير ومؤشرات التقويم ومؤشرات النجاح.
   - السندات والدعائم الديدكتيكية (الكتاب المدرسي، وثائق، تجارب، عينات، برمجيات محاكاة).
   - القيم والمواقف الوطنية والتربوية المستهدفة (الهوية، العمل الجماعي، الحس البيئي والصحي...).
2. تفصيل مراحل سيرورة الحصة التعليمية التعلمية في جدول زمني واقعي يتضمن:
   أ. وضعية الانطلاق (Mise en situation): التذكير بالمكتسبات القبلية + طرح وضعية مشكلة انطلاقية جزئية تثير دافعية المتعلم والفضول العلمي.
   ب. مرحلة بناء التعلمات / إرساء الموارد (Construction des apprentissages): التفصيل الدقيق لمهام الأستاذ (توجيه، حوار أفقي، طرح أسئلة محفزة)، ومهام المتعلم (الملاحظة، صياغة الفرضيات، التجريب/التحليل، التفسير والاستنتاج)، مع تحديد طريقة العمل (أفواج / عمل فردي / عصف ذهني).
   ج. مرحلة الاستثمار والتقويم / الإدماج الجزئي (Évaluation & Réinvestissement): وضعية تقويمية أو تطبيق لإدماج المورد فورياً.
3. الملخص السبوري المهيكل (المورد المعرفي المُرسي الذي يكتبه التلميذ على كراسه).
4. النشاط الإدماجي المنزلي (الواجب).
5. شبكة التقويم الذاتي والملاحظات للأستاذ.

أرجع النتيجة بصيغة JSON حصراً مطابقة تماماً للمخطط المحدد.`;
    }

    const config = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          header: {
            type: Type.OBJECT,
            properties: {
              republic: { type: Type.STRING, description: "الجمهورية الجزائرية الديمقراطية الشعبية" },
              ministry: { type: Type.STRING, description: "وزارة التربية الوطنية" },
              level: { type: Type.STRING, description: "المستوى الدراسي مثلا: الرابعة متوسط" },
              subject: { type: Type.STRING, description: "المادة الدراسية" },
              field: { type: Type.STRING, description: "الميدان" },
              sequence: { type: Type.STRING, description: "المقطع التعلمي" },
              resourceTitle: { type: Type.STRING, description: "المورد المعرفي المستهدف" },
              sessionType: { type: Type.STRING, description: "طبيعة الحصة (إرساء موارد، إدماج...)" },
              duration: { type: Type.STRING, description: "المدة الزمنية (مثلاً 60 دقيقة)" },
              ficheNumber: { type: Type.STRING, description: "رقم المذكرة المقترح مثلا: 08" },
              ficheStyle: { type: Type.STRING, description: "نمط المذكرة (concise, detailed, technical)" },
            },
            required: ["level", "subject", "field", "sequence", "resourceTitle", "duration"],
          },
          competencies: {
            type: Type.OBJECT,
            properties: {
              globalCompetence: { type: Type.STRING, description: "الكفاءة الشاملة للطور أو السنة" },
              terminalCompetence: { type: Type.STRING, description: "الكفاءة الختامية للميدان" },
              competenceComponents: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "مركبات الكفاءة (أفعال إنجازية)",
              },
              assessmentIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "معايير ومؤشرات التقويم",
              },
              didacticSupports: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "السندات والدعائم الديدكتيكية والوسائل التعليمية",
              },
              valuesAndAttitudes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "القيم والمواقف المستهدفة",
              },
            },
            required: ["globalCompetence", "terminalCompetence", "competenceComponents", "assessmentIndicators", "didacticSupports"],
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING, description: "المرحلة (مرحلة الانطلاق، مرحلة بناء التعلمات، مرحلة الاستثمار والتقويم)" },
                timing: { type: Type.STRING, description: "المدة الزمنية المخصصة للمرحلة (مثلا: 10 د، 35 د، 15 د)" },
                contentElement: { type: Type.STRING, description: "المورد المعرفي / عناصر المحتوى والمفاهيم" },
                teacherActivity: { type: Type.STRING, description: "نشاط الأستاذ ودوره والتوجيه البيداغوجي" },
                studentActivity: { type: Type.STRING, description: "نشاط المتعلم والمهام المنجزة والفرضيات" },
                strategy: { type: Type.STRING, description: "طريقة العمل (عمل بالأفواج، حوار أفقي، حل مشكلات، فردي)" },
                formativeAssessment: { type: Type.STRING, description: "التقويم التكويني ومؤشر التحقق" },
              },
              required: ["phase", "timing", "contentElement", "teacherActivity", "studentActivity", "formativeAssessment"],
            },
          },
          boardSummary: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "عنوان الملخص السبوري" },
              points: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "النقاط الرئيسية للمورد المعرفي المُرسي التي تسجل على كراس التلميذ",
              },
              takeawayRule: { type: Type.STRING, description: "قاعدة ختامية أو إرساء معرفي جامع" },
            },
            required: ["title", "points"],
          },
          homeAssignment: {
            type: Type.STRING,
            description: "النشاط المنزلي أو الوضعية الإدماجية الجزئية المكملة",
          },
          teacherSelfEvaluation: {
            type: Type.OBJECT,
            properties: {
              pedagogicalNotes: { type: Type.STRING, description: "توصيات وملاحظات لتطبيق الحصة بنجاح" },
              anticipatedDifficulties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "الصعوبات البيداغوجية المتوقعة لدى التلاميذ وكيفية معالجتها",
              },
            },
          },
        },
        required: ["header", "competencies", "steps", "boardSummary", "homeAssignment"],
      },
    };

    // Resilient generation with automatic retry and model fallback (gemini-3.1-flash-lite -> gemini-3.8-flash -> gemini-flash-latest)
    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const modelConfig: any = {
            ...config,
            ...(modelName === "gemini-3.8-flash"
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
          };

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: modelConfig,
          });

          if (response.text) {
            responseText = response.text.trim();
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} attempt ${attempts} failed:`, err?.message || err);
          const errStr = JSON.stringify(err?.message || err || "");
          const is503Or429 =
            errStr.includes("503") ||
            errStr.includes("UNAVAILABLE") ||
            errStr.includes("high demand") ||
            errStr.includes("429");

          if (is503Or429 && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
          // Move on to next model in chain
          break;
        }
      }

      if (responseText) {
        break;
      }
    }

    let parsedData: any = null;

    if (responseText) {
      try {
        let cleanJson = responseText.trim();
        if (cleanJson.includes("```")) {
          cleanJson = cleanJson.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
        }
        const firstBrace = cleanJson.indexOf("{");
        const lastBrace = cleanJson.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }
        parsedData = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn("Could not parse AI JSON output, utilizing Algerian curriculum synthesizer...", parseErr);
      }
    }

    // Fallback: If AI models were unavailable or returned non-JSON, synthesize official Algerian 2G lesson plan
    if (!parsedData || !parsedData.header || !parsedData.steps) {
      console.info("Using official Algerian 2nd-generation curriculum synthesizer for:", resourceTitle);
      parsedData = synthesizeCurricularFiche({
        level,
        subject,
        field,
        sequence,
        resourceTitle,
        sessionType,
        duration,
        ficheStyle,
        customNotes,
        language,
      });
    }

    if (!parsedData.header) {
      parsedData.header = {};
    }
    parsedData.header.language = isFrench ? "fr" : isEnglish ? "en" : "ar";

    if (isFrench) {
      if (!parsedData.header.republic || parsedData.header.republic.includes("الجمهورية")) {
        parsedData.header.republic = "République Algérienne Démocratique et Populaire";
      }
      if (!parsedData.header.ministry || parsedData.header.ministry.includes("وزارة")) {
        parsedData.header.ministry = "Ministère de l'Éducation Nationale";
      }
    } else if (isEnglish) {
      if (!parsedData.header.republic || parsedData.header.republic.includes("الجمهورية")) {
        parsedData.header.republic = "People's Democratic Republic of Algeria";
      }
      if (!parsedData.header.ministry || parsedData.header.ministry.includes("وزارة")) {
        parsedData.header.ministry = "Ministry of National Education";
      }
    }

    parsedData.header.ficheStyle = parsedData.header.ficheStyle || ficheStyle || "detailed";

    return res.json({
      success: true,
      fiche: parsedData,
    });
  } catch (error: any) {
    console.error("Error generating pedagogical fiche:", error);

    // If any unexpected error reached here, guarantee a response via the curriculum synthesizer
    try {
      const fallback = synthesizeCurricularFiche({
        level: req.body?.level,
        subject: req.body?.subject,
        field: req.body?.field,
        sequence: req.body?.sequence,
        resourceTitle: req.body?.resourceTitle,
        sessionType: req.body?.sessionType,
        duration: req.body?.duration,
        ficheStyle: req.body?.ficheStyle,
        customNotes: req.body?.customNotes,
        language: req.body?.language,
      });
      return res.json({
        success: true,
        fiche: fallback,
      });
    } catch (fallbackErr) {
      const rawError = error?.message || String(error || "");
      return res.status(500).json({
        error: "حدث خطأ أثناء توليد المذكرة البيداغوجية. يرجى المحاولة مرة أخرى.",
        technicalDetails: rawError,
      });
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

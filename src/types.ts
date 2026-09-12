export type MiddleSchoolLevel = "1am" | "2am" | "3am" | "4am";

export type FicheStyle = "concise" | "detailed" | "technical";

export interface LevelConfig {
  id: MiddleSchoolLevel;
  name: string; // "السنة الأولى متوسط", "السنة الثانية متوسط", etc.
  shortName: string; // "1م", "2م", "3م", "4م"
  description: string;
  badge: string;
}

export interface CurriculumResource {
  id: string;
  title: string;
  duration: string;
  type: string;
  suggestedCompetence?: string;
}

export interface CurriculumSequence {
  id: string;
  name: string; // اسم المقطع التعلمي
  field: string; // الميدان
  description?: string;
  resources: CurriculumResource[];
}

export interface CurriculumSubject {
  id: string;
  name: string; // مثلا: علوم الطبيعة والحياة
  iconName: string;
  color: string;
  language?: "ar" | "fr" | "en";
  levels: {
    [key in MiddleSchoolLevel]?: {
      generalCompetence: string;
      sequences: CurriculumSequence[];
    };
  };
}

export interface FicheHeader {
  republic: string;
  ministry: string;
  directorate?: string;
  schoolName?: string;
  teacherName?: string;
  academicYear?: string;
  level: string;
  subject: string;
  field: string;
  sequence: string;
  resourceTitle: string;
  sessionType: string;
  duration: string;
  ficheNumber?: string;
  date?: string;
  classGroup?: string;
  language?: "ar" | "fr" | "en";
  ficheStyle?: FicheStyle | string;
}

export interface FicheCompetencies {
  globalCompetence: string;
  terminalCompetence: string;
  competenceComponents: string[];
  assessmentIndicators: string[];
  didacticSupports: string[];
  valuesAndAttitudes?: string[];
}

export interface FicheStep {
  phase: string; // مرحلة الانطلاق / مرحلة بناء التعلمات / مرحلة الاستثمار والتقويم
  timing: string; // 10 د، 35 د، 15 د
  contentElement: string; // المورد المعرفي وعناصر المحتوى
  teacherActivity: string; // نشاط الأستاذ ودوره
  studentActivity: string; // نشاط المتعلم والمهام المنجزة
  strategy?: string; // طريقة العمل (أفواج، حوار أفقي، حل المشكلات)
  formativeAssessment: string; // التقويم التكويني ومؤشر النجاح
}

export interface BoardSummary {
  title: string;
  points: string[];
  takeawayRule?: string;
}

export interface TeacherSelfEvaluation {
  pedagogicalNotes?: string;
  anticipatedDifficulties?: string[];
  personalReflection?: string;
}

export interface FicheImage {
  id: string;
  url: string; // HTTP URL or data URL
  caption: string; // تسمية الوثيقة / عنوان السند
  description?: string; // وصف بيداغوجي / كيفية الاستغلال
  placement?: "didacticSupports" | "steps" | "boardSummary" | "annex"; // موقع الإدراج
  sourceType?: "ai_generated" | "external_url" | "library"; // مصدر الصورة
}

export interface PedagogicalFiche {
  id: string;
  createdAt: string;
  header: FicheHeader;
  competencies: FicheCompetencies;
  steps: FicheStep[];
  boardSummary: BoardSummary;
  homeAssignment: string;
  teacherSelfEvaluation?: TeacherSelfEvaluation;
  images?: FicheImage[];
}

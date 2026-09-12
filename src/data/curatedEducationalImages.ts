import { FicheImage } from "../types";

export interface CuratedImageItem {
  id: string;
  subject: string;
  category: string;
  title: string;
  caption: string;
  description: string;
  url: string;
  tags: string[];
}

export const CURATED_EDUCATIONAL_IMAGES: CuratedImageItem[] = [
  // علوم الطبيعة والحياة
  {
    id: "snv_digestive_system",
    subject: "snv",
    category: "علوم الطبيعة والحياة",
    title: "بنية الجهاز الهضمي ومحطات الهضم عند الإنسان",
    caption: "وثيقة 1: رسم تخطيطي للجهاز الهضمي يوضح محطات الهضم الثلاث والغدد الملحقة",
    description: "استثمار الوثيقة لتحديد مسار اللقمة الغذائية ومحطات تأثير العصارات الهاضمة (الفم، المعدة، المعي الدقيق).",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_ar.svg/800px-Digestive_system_diagram_ar.svg.png",
    tags: ["الهضم", "الجهاز الهضمي", "الأنبوب الهضمي", "المعدة", "المعي الدقيق", "التغذية"],
  },
  {
    id: "snv_starch_digestion",
    subject: "snv",
    category: "علوم الطبيعة والحياة",
    title: "تجربة الهضم الاصطناعي للنشاء باللعابين (ماء اليود + محلول فهلنك)",
    caption: "وثيقة 2: خطوات تجربة الهضم الكيميائي لمطبوخ النشاء في حمام مائي 37°م",
    description: "ملاحظة زوال اللون الأزرق البنفسجي وظهور الراسب الأحمر الآجوري بعد المعاملة بفهلنك مع التسخين.",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    tags: ["النشاء", "اللعابين", "الأميلاز", "فهلنك", "ماء اليود", "تجربة"],
  },
  {
    id: "snv_villi",
    subject: "snv",
    category: "علوم الطبيعة والحياة",
    title: "بنية الزغابة المعوية ومقر الامتصاص المعوي",
    caption: "وثيقة 3: رسم تخطيطي لمقطع عرضي في زغابة معوية موضحاً الشبكة الدموية والوعاء البلغمي",
    description: "إبراز الخصائص البنيوية لجدار المعي الدقيق التي تسمح بالامتصاص السريع للمغذيات.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Intestinal_villus_simplified.svg/800px-Intestinal_villus_simplified.svg.png",
    tags: ["الزغابة المعوية", "الامتصاص", "المعي الدقيق", "المغذيات"],
  },
  {
    id: "snv_blood_components",
    subject: "snv",
    category: "علوم الطبيعة والحياة",
    title: "مكونات الدم وسحب دموي تحت المجهر",
    caption: "وثيقة 4: سحبة دموية مجهرية تبرز الكريات الحمراء، الكريات البيضاء والمصورة",
    description: "التعرف على دور كريات الدم الحمراء في نقل الغازات التنفسية والصفائح والمصورة في نقل المغذيات.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Blausen_0425_FormedElements.png/800px-Blausen_0425_FormedElements.png",
    tags: ["الدم", "الكريات الحمراء", "المصورة", "التنفس", "الدوران"],
  },
  {
    id: "snv_plant_cell",
    subject: "snv",
    category: "علوم الطبيعة والحياة",
    title: "الخلية النباتية والخلية الحيوانية بالمجهر",
    caption: "وثيقة 5: مقارنة تخطيطية بين بنية الخلية النباتية والحيوانية وعضياتها",
    description: "تحديد أوجه التشابه والاختلاف (الجدار السليلوزي، الصانعات الخضراء، النواة، السيتوبلازم).",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Simple_diagram_of_plant_cell_%28en%29.svg/800px-Simple_diagram_of_plant_cell_%28en%29.svg.png",
    tags: ["الخلية", "الخلية النباتية", "الصانعات الخضراء", "المجهر"],
  },

  // العلوم الفيزيائية والتكنولوجيا
  {
    id: "phys_simple_circuit",
    subject: "physique",
    category: "العلوم الفيزيائية",
    title: "مخطط نظامي لدارة كهربائية بسيطة مع قاطعة ومصباح",
    caption: "وثيقة 1: المخطط النظامي للدارة الكهربائية وتحديد جهة التيار الاصطلاحية",
    description: "استنتاج شروط توهج المصباح ومفهوم الدارة المغلقة والمفتوحة ودور المولد.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Simple_circuit.svg/800px-Simple_circuit.svg.png",
    tags: ["دارة كهربائية", "مصباح", "قاطعة", "بطارية", "التيار الكهربائي"],
  },
  {
    id: "phys_electrolysis",
    subject: "physique",
    category: "العلوم الفيزيائية",
    title: "وعاء فولطا والتحليل الكهربائي البسيط لمحلول كلور القصدير أو كلور الزنك",
    caption: "وثيقة 2: التركيب التجريبي للتحليل الكهربائي البسيط في وعاء فولطا بمسريين من الفحم",
    description: "تفسير هجرة الشوارد نحو المهبط والمصعد وملاحظة انطلاق غاز الكلور وترسب المعدن.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Electrolysis_apparatus_chemical.svg/800px-Electrolysis_apparatus_chemical.svg.png",
    tags: ["التحليل الكهربائي", "المسريان", "وعاء فولطا", "الشوارد", "المحاليل الكيميائية"],
  },
  {
    id: "phys_atom_model",
    subject: "physique",
    category: "العلوم الفيزيائية",
    title: "النموذج الكوكبي للذرة والجسيمات المكونة (بروتونات، نترونات، إلكترونات)",
    caption: "وثيقة 3: نموذج مبسط لبنية الذرة والسحابة الإلكترونية حول النواة",
    description: "إبراز شحنة النواة الموجبة وشحنة الإلكترونات السالبة ومفهوم التعادل الكهربائي للذرة.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.png/800px-Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.png",
    tags: ["الذرة", "النواة", "الإلكترونات", "البروتونات", "المادة وتحولاتها"],
  },
  {
    id: "phys_dynamometer",
    subject: "physique",
    category: "العلوم الفيزيائية",
    title: "قياس ثقل جسم باستعمال الربيعة (الدينامومتر)",
    caption: "وثيقة 4: مخطط توازن جسم صلب خاضع لقوتين (الثقل ورد الفعل)",
    description: "التمييز بين الكتلة والثقل وتمثيل القوى بشعاع (المبدأ، الحامل، الجهة، الشدة).",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Federkraftmesser.jpg/800px-Federkraftmesser.jpg",
    tags: ["الثقل", "الربيعة", "الدينامومتر", "توازن جسم صلب", "القوة"],
  },

  // الرياضيات
  {
    id: "math_pythagoras",
    subject: "math",
    category: "الرياضيات",
    title: "التمثيل الهندسي لمبرهنة فيثاغورس (المربعات على الأضلاع)",
    caption: "وثيقة 1: تمثيل هندسي للمثلث القائم والعلاقة الرياضية بين مربعات أطوال الأضلاع",
    description: "الاستدلال الهندسي لحساب طول الوتر أو أحد أضلاع القائمة في المثلث القائم.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pythagorean.svg/800px-Pythagorean.svg.png",
    tags: ["فيثاغورس", "مثلث قائم", "الوتر", "هندسة", "حساب أطوال"],
  },
  {
    id: "math_thales",
    subject: "math",
    category: "الرياضيات",
    title: "وضعية مبرهنة طاليس في المثلث وشبه المنحرف",
    caption: "وثيقة 2: مخطط مبرهنة طاليس لحساب الأطوال وإثبات التوازي",
    description: "تطبيق نسب طاليس في حالة المثلث وفي حالة وضعية الفراشة لتحديد أطوال مجهولة.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Thales_theorem.svg/800px-Thales_theorem.svg.png",
    tags: ["طاليس", "التوازي", "المثلثات المتشابهة", "النسب الهندسية"],
  },

  // التاريخ والجغرافيا
  {
    id: "geo_algeria_relief",
    subject: "geo",
    category: "التاريخ والجغرافيا",
    title: "خريطة تضاريس الجزائر والأقاليم الجغرافية الكبرى (الشمال والصحراء)",
    caption: "وثيقة 1: خريطة التضاريس والأطلس التلي والصحراوي والسهول في الجزائر",
    description: "تحليل التوزيع التضاريسي وتأثيره على المناخ والتساقط والكثافة السكانية في الجزائر.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Algeria_Topography.png/800px-Algeria_Topography.png",
    tags: ["خريطة الجزائر", "التضاريس", "الأطلس التلي", "المناخ", "الجغرافيا"],
  },
];

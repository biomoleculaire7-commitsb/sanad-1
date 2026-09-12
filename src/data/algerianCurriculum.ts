import { CurriculumSubject, LevelConfig, MiddleSchoolLevel } from "../types";

export const ALGERIAN_LEVELS: LevelConfig[] = [
  {
    id: "1am",
    name: "السنة الأولى متوسط",
    shortName: "1 متوسط (1AM)",
    description: "طور التكيف والترسيخ الأساسي للمفاهيم",
    badge: "1 AM",
  },
  {
    id: "2am",
    name: "السنة الثانية متوسط",
    shortName: "2 متوسط (2AM)",
    description: "طور التعميق وبناء النماذج وتطوير الكفاءات",
    badge: "2 AM",
  },
  {
    id: "3am",
    name: "السنة الثالثة متوسط",
    shortName: "3 متوسط (3AM)",
    description: "طور الاستدلال العلمي والتحليل النسقي",
    badge: "3 AM",
  },
  {
    id: "4am",
    name: "السنة الرابعة متوسط",
    shortName: "4 متوسط (BEM)",
    description: "طور الإدماج الكلي والتأهيل لشهادة التعليم المتوسط",
    badge: "4 AM - BEM",
  },
];

export const ALGERIAN_SUBJECTS: CurriculumSubject[] = [
  {
    id: "snv",
    name: "علوم الطبيعة والحياة",
    iconName: "Microscope",
    color: "emerald",
    levels: {
      "4am": {
        generalCompetence: "يحل مشكلات متعلقة بسلامة وظائف العضوية، والتوازن البيئي، والتحكم في تقنيات الاتصال العصبي والمناعي، وانتقال الصفات الوراثية بتجنيد الموارد العلمية المعارف والمنهجيات المناسبة.",
        sequences: [
          {
            id: "snv_4_seq1",
            name: "المقطع 01: التغذية عند الإنسان",
            field: "الإنسان والصحة",
            resources: [
              { id: "res_snv_4_1", title: "الهضم وتحولات الأغذية في الأنبوب الهضمي", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_2", title: "امتصاص المغذيات وبنية الزغابة المعوية", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_3", title: "نقل المغذيات في العضوية (طريقا الامتصاص)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_4", title: "استعمال المغذيات وثنائي الأكسجين في التنفس الخلوي", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_5", title: "التوازن الغذائي والسلوكيات الصحية السليمة", duration: "1 ساعة", type: "إدماج وتقويم" },
            ],
          },
          {
            id: "snv_4_seq2",
            name: "المقطع 02: التنسيق الوظيفي في العضوية (الاتصال العصبي)",
            field: "الإنسان والصحة",
            resources: [
              { id: "res_snv_4_6", title: "الأعضاء الحسية والاتصال بالمحيط الخارجي", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_7", title: "بنية الجهاز العصبي والرسالة العصبية", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_8", title: "الحركة الإرادية والفعل اللاإرادي (المنعكس الفطري)", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_9", title: "تأثير المخدرات والكحول على التنسيق العصبي", duration: "1 ساعة", type: "إدماج وتوعية" },
            ],
          },
          {
            id: "snv_4_seq3",
            name: "المقطع 03: الاستجابة المناعية والاعتلالات",
            field: "الإنسان والصحة",
            resources: [
              { id: "res_snv_4_10", title: "الخطوط الدفاعية للعضوية (الحواجز الطبيعية والتفاعل الالتهابي)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_11", title: "الاستجابة المناعية النوعية (الخلطية والخلوية)", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_12", title: "الاعتلالات المناعية (الحساسية والتلقيح والاستمصال)", duration: "1 ساعة", type: "إدماج وتطبيق" },
            ],
          },
          {
            id: "snv_4_seq4",
            name: "المقطع 04: انتقال الصفات الوراثية",
            field: "الإنسان والبيئة والوراثة",
            resources: [
              { id: "res_snv_4_13", title: "تشكل الأمشاج والانقسام المنصف", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_14", title: "النمط النووي ودعامة انتقال الصفات الوراثية (الصبغيات)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_4_15", title: "الأمراض الوراثية والزواج بين ذوي القربى", duration: "1 ساعة", type: "إدماج وتقويم" },
            ],
          },
        ],
      },
      "3am": {
        generalCompetence: "يحل مشكلات متعلقة بالدينامية الداخلية والخارجية للكرة الأرضية وعلاقتها بالموارد الطبيعية، مقترحاً حلولاً إيجابية لحماية المحيط والتربة.",
        sequences: [
          {
            id: "snv_3_seq1",
            name: "المقطع 01: الدينامية الداخلية للكرة الأرضية (النشاط التكتوني)",
            field: "الإنسان والمحيط",
            resources: [
              { id: "res_snv_3_1", title: "الزلزال ظاهرة طبيعية (خصائص الهزة الأرضية والبؤرة)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_3_2", title: "أسباب الزلازل وتصدع الفوالق", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_3_3", title: "نشاط الظهرات المحيطية وتوسع قاع المحيطات", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_3_4", title: "ظاهرة الغوص والنشاط البركاني الانفجاري", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_snv_3_5", title: "التكتونية العامة وتشكل الجبال (الألب والأطلس)", duration: "1 ساعة", type: "إدماج" },
            ],
          },
          {
            id: "snv_3_seq2",
            name: "المقطع 02: الدينامية الخارجية وتطور المنظر الطبيعي",
            field: "الإنسان والمحيط",
            resources: [
              { id: "res_snv_3_6", title: "العوامل المناخية وتأثيرها على الصخور (الحث والنقل والترسيب)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_3_7", title: "دور الإنسان في تطور المنظر الطبيعي وعواقبه", duration: "1 ساعة", type: "إدماج ومشاريع" },
            ],
          },
        ],
      },
      "2am": {
        generalCompetence: "يحل مشكلات متعلقة بالتفاعلات القائمة بين الكائنات الحية وتكيفها مع أوساط عيشها، والتكاثر وإعمار الأوساط.",
        sequences: [
          {
            id: "snv_2_seq1",
            name: "المقطع 01: الوسط الحي والعلاقات بين عناصره",
            field: "الكائنات الحية في أوساطها",
            resources: [
              { id: "res_snv_2_1", title: "عناصر الوسط الحي (العوامل الحيوية واللاحيوية)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_2_2", title: "العلاقات القائمة بين الكائنات الحية والسلاسل الغذائية", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_2_3", title: "تأثير العوامل اللاحيوية (الحرارة، الإضاءة، الرطوبة) على توزع الكائنات", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "snv_2_seq2",
            name: "المقطع 02: التكاثر وإعمار الأوساط ومقاومة الظروف القاسية",
            field: "الكائنات الحية في أوساطها",
            resources: [
              { id: "res_snv_2_4", title: "أنماط التكاثر عند الحيوانات (الجنسي) واستراتيجياته", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_2_5", title: "التكاثر الجنسي والخضري عند النباتات ذات الأزهار", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_2_6", title: "مقاومة الكائنات الحية للظروف القاسية (السبات، الحياة البطيئة)", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
        ],
      },
      "1am": {
        generalCompetence: "يحل مشكلات دالة بتجنيد معارفه حول تغذية الإنسان والنبات الأخضر، والتنفس والتكاثر، متبنياً سلوكات استهلاكية وصحية سليمة.",
        sequences: [
          {
            id: "snv_1_seq1",
            name: "المقطع 01: التغذية عند الإنسان",
            field: "الإنسان والصحة",
            resources: [
              { id: "res_snv_1_1", title: "مصدر وتركيب الأغذية (الأغذية البسيطة والمركبة)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_1_2", title: "دور الأغذية في الجسم (أغذية البناء وأغذية الطاقة)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_1_3", title: "الرواتب الغذائية والتوازن الغذائي", duration: "1 ساعة", type: "إدماج وتقويم" },
            ],
          },
          {
            id: "snv_1_seq2",
            name: "المقطع 02: التغذية عند النبات الأخضر",
            field: "النبات الأخضر والوسط",
            resources: [
              { id: "res_snv_1_4", title: "أغذية النبات الأخضر (الماء، الأملاح المعدنية، CO2 والضوء)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_snv_1_5", title: "التركيب الضوئي ومسار النسغ الخام والنسغ الكامل", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "physique",
    name: "العلوم الفيزيائية والتكنولوجيا",
    iconName: "Atom",
    color: "blue",
    levels: {
      "4am": {
        generalCompetence: "يحل مشكلات متعلقة بالتحولات الكيميائية في المحاليل الشاردية، والأمن الكهربائي، والمقاربة الأولية للقوة وتوازن الأجسام، مبرزاً أثرها في الحياة اليومية ومطبقاً قواعد السلامة.",
        sequences: [
          {
            id: "phy_4_seq1",
            name: "المقطع 01: المادة وتحولاتها (المحاليل الشاردية)",
            field: "المادة وتحولاتها",
            resources: [
              { id: "res_phy_4_1", title: "الشاردة والمحلول الشاردي (الناقلية الكهربائية للمحاليل)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_4_2", title: "التحليل الكهربائي البسيط لمحلول كلور الزنك / كلور القصدير", duration: "2 ساعة", type: "إرساء موارد تجريبية" },
              { id: "res_phy_4_3", title: "التفاعلات الكيميائية في المحاليل الشاردية (تفاعل حمض كلور الماء مع معدن)", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_phy_4_4", title: "تفاعل محلول ملحي مع معدن وتفاعل حمض مع كلس", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "phy_4_seq2",
            name: "المقطع 02: الظواهر الميكانيكية",
            field: "الظواهر الميكانيكية",
            resources: [
              { id: "res_phy_4_5", title: "المقاربة الأولية للقوة كشعاع (نقطة التأثير، المنحى، الجهة، القيمة)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_4_6", title: "الثقل والكتلة وتمييز العلاقة الرياضية (P = m × g)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_4_7", title: "توازن جسم صلب خاضع لفعل قوتين / ثلاث قوى", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_phy_4_8", title: "دافعية أرخميدس في السوائل وشروط الطفو والغطس", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "phy_4_seq3",
            name: "المقطع 03: الظواهر الكهربائية (التيار المتناوب والأمن)",
            field: "الظواهر الكهربائية",
            resources: [
              { id: "res_phy_4_9", title: "التيار الكهربائي المتناوب (ظاهرة التحريض الكهرومغناطيسي)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_4_10", title: "معاينة التوتر المتناوب براسم الاهتزاز المهبطي (Umax, Ueff, T, f)", duration: "2 ساعة", type: "إرساء تجريبي" },
              { id: "res_phy_4_11", title: "الأمن الكهربائي في المنزل (المأخذ الأرضي، القاطع، المنصهرة)", duration: "1 ساعة", type: "إدماج وتطبيق" },
            ],
          },
        ],
      },
      "3am": {
        generalCompetence: "يحل مشكلات معقدة متعلقة بالتفاعل الكيميائي كنموذج للتحول الكيميائي، والاستطاعة والطاقة الكهربائية، والضوء والألوان.",
        sequences: [
          {
            id: "phy_3_seq1",
            name: "المقطع 01: التفاعل الكيميائي كنموذج للتحول الكيميائي",
            field: "المادة وتحولاتها",
            resources: [
              { id: "res_phy_3_1", title: "التفاعل الكيميائي ومفهوم الفرد والنوع الكيميائي", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_3_2", title: "معادلة التفاعل الكيميائي وموازنتها بانحفاظ الذرات نوعاً وعدداً", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_phy_3_3", title: "احتراق الفحوم الهيدروجينية (التام وغير التام وخطر CO)", duration: "1 ساعة", type: "إرساء وتوعية" },
            ],
          },
          {
            id: "phy_3_seq2",
            name: "المقطع 02: الطاقة وتحولاتها والاستطاعة",
            field: "الظواهر الكهربائية والطاقوية",
            resources: [
              { id: "res_phy_3_4", title: "السلسلة الوظيفية والسلسلة الطاقوية ومبدأ انحفاظ الطاقة", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_phy_3_5", title: "الاستطاعة والطاقة المستهلكة والعلاقة E = P × t وحساب تكلفة فاتورة الكهرباء", duration: "2 ساعة", type: "إدماج وتطبيق" },
            ],
          },
        ],
      },
      "2am": {
        generalCompetence: "يحل مشكلات متعلقة بالتحول الكيميائي والفيزيائي بالنموذج المجهري، والحركة والسرعة، والمغناطيسية وتطبيقاتها.",
        sequences: [
          {
            id: "phy_2_seq1",
            name: "المقطع 01: المادة وتحولاتها (النموذج الحبيبي والذري)",
            field: "المادة وتحولاتها",
            resources: [
              { id: "res_phy_2_1", title: "التحول الفيزيائي والتحول الكيميائي والتمييز التجريبي بينهما", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_2_2", title: "انحفاظ الكتلة خلال التحول الفيزيائي والكيميائي", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_2_3", title: "تفسير التحول الكيميائي بالنموذج الحبيبي والذري والرموز الكيميائية", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "phy_2_seq2",
            name: "المقطع 02: الظواهر الميكانيكية (الحركة والسكون)",
            field: "الظواهر الميكانيكية",
            resources: [
              { id: "res_phy_2_4", title: "نسبية الحركة ومفهوم المرجع والمسار (مستقيم، منحني، دائري)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_2_5", title: "سرعة المتحرك ومخطط السرعة (حركة منتظمة، متسارعة، متباطئة)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_2_6", title: "نقل الحركة (بالاحتكاك، بالتعشيق، بالسيور، بالسلاسل)", duration: "1 ساعة", type: "تطبيقات تكنولوجية" },
            ],
          },
        ],
      },
      "1am": {
        generalCompetence: "يحل مشكلات متعلقة بالقياسات وحالات المادة وتحولاتها، وتركيب الدارات الكهربائية البسيطة وتفادي الدارة المستقصرة.",
        sequences: [
          {
            id: "phy_1_seq1",
            name: "المقطع 01: المادة وتحولاتها والقياسات",
            field: "المادة وتحولاتها",
            resources: [
              { id: "res_phy_1_1", title: "بعض القياسات (قياس الأطوال، الحجوم، والكتلة، وحساب الكتلة الحجمية)", duration: "2 ساعة", type: "إرساء تجريبي" },
              { id: "res_phy_1_2", title: "حالات المادة وتغيراتها ودرجة الحرارة والغليان", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_1_3", title: "المحلول المائي والتركيز الكتلي والذوبان والتشبع", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "phy_1_seq2",
            name: "المقطع 02: الدارة الكهربائية",
            field: "الظواهر الكهربائية",
            resources: [
              { id: "res_phy_1_4", title: "مفهوم الدارة الكهربائية وعناصرها والمواد الناقلة والعازلة", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_phy_1_5", title: "الربط على التسلسل والربط على التفرغ وميزات كل منهما", duration: "1 ساعة", type: "إرساء تجريبي" },
              { id: "res_phy_1_6", title: "دارة ذهاب وإياب وكيفية التحكم في إنارة من مكانين", duration: "1 ساعة", type: "تطبيقات تكنولوجية" },
              { id: "res_phy_1_7", title: "الدارة المستقصرة والمخاطر وكيفية الوقاية (المنصهرة)", duration: "1 ساعة", type: "أمن ووقاية" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "arabe",
    name: "اللغة العربية",
    iconName: "BookOpen",
    color: "amber",
    levels: {
      "4am": {
        generalCompetence: "ينتج خطابات شفوية وكتابية متنوعة، مع التركيز على النمط التفسيري والنمط الحجاجي، محترماً الخصائص البنائية واللغوية وموظفاً رصيده المعجمي والقواعد النحوية والصرفية والبلاغية بدقة.",
        sequences: [
          {
            id: "ara_4_seq1",
            name: "المقطع 01: قضايا اجتماعية",
            field: "فهم المنطوق والتعبير الكتابي والقواعد",
            resources: [
              { id: "res_ara_4_1", title: "قراءة ودراسة نص: سهرة عائلية (النمط التفسيري والحجاجي)", duration: "1 ساعة", type: "قراءة مشروحة" },
              { id: "res_ara_4_2", title: "قواعد اللغة: عطف النسق وحروف العطف ودلالاتها", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_3", title: "قواعد اللغة: البدل وأنواعه (مطابق، بعض من كل، اشتمال)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_4", title: "إنتاج المكتوب: كتابة نص حجاجي يعالج ظاهرة اجتماعية سلبية", duration: "1 ساعة", type: "إنتاج كتابي" },
            ],
          },
          {
            id: "ara_4_seq2",
            name: "المقطع 02: الإعلام والمجتمع",
            field: "فهم المنطوق والتعبير الكتابي والقواعد",
            resources: [
              { id: "res_ara_4_5", title: "قراءة ودراسة نص: الصحافة والإعلام الرقمي", duration: "1 ساعة", type: "قراءة مشروحة" },
              { id: "res_ara_4_6", title: "قواعد اللغة: التوكيد اللفظي والمعنوي وأحكامه", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_7", title: "قواعد اللغة: العدد والمعدود (المفرد والركب والعقود والمعطوف)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_8", title: "إنتاج المكتوب: مقال صحفي تحسيسي حول مخاطر الشائعات", duration: "1 ساعة", type: "إنتاج كتابي" },
            ],
          },
          {
            id: "ara_4_seq3",
            name: "المقطع 03: التضامن الإنساني",
            field: "فهم المنطوق والمكتوب",
            resources: [
              { id: "res_ara_4_9", title: "قواعد اللغة: التمييز (تمييز الذات وتمييز النسبة)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_10", title: "قواعد اللغة: الاستثناء بـ (إلا، غير، سوى، خلا، عدا، حاشا)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_11", title: "قواعد اللغة: الممنوع من الصرف لعلة واحدة ولعلتين", duration: "2 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_4_12", title: "قواعد اللغة: الجملة البسيطة والجملة المركبة", duration: "2 ساعة", type: "ظاهرة لغوية" },
            ],
          },
        ],
      },
      "3am": {
        generalCompetence: "ينتج نصوصاً تفسيرية وتوجيهية وحوارية في وضعيات تواصلية دالة، موظفاً الموارد النحوية والصرفية المقررة.",
        sequences: [
          {
            id: "ara_3_seq1",
            name: "المقطع 01: الآفات الاجتماعية",
            field: "فهم المنطوق والمكتوب وإنتاجهما",
            resources: [
              { id: "res_ara_3_1", title: "قواعد اللغة: بناء الفعل الماضي وأحوال بنائه", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_3_2", title: "قواعد اللغة: بناء الفعل المضارع (مع نون النسوة ونون التوكيد)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_3_3", title: "قراءة مشروحة: نص آفة التدخين وتداعياته الصحية", duration: "1 ساعة", type: "قراءة وتحليل" },
            ],
          },
          {
            id: "ara_3_seq2",
            name: "المقطع 02: الإعلام والاتصال",
            field: "فهم المنطوق والمكتوب",
            resources: [
              { id: "res_ara_3_4", title: "قواعد اللغة: اسم الفعل وأقسامه (ماض، مضارع، أمر)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_3_5", title: "قواعد اللغة: صيغ المبالغة وأوزانها وعملها", duration: "1 ساعة", type: "ظاهرة لغوية" },
            ],
          },
        ],
      },
      "2am": {
        generalCompetence: "ينتج نصوصاً سردية ووصفية وحوارية ملائمة لمقامات التواصل المختلفة، مستعملاً القواعد اللغوية السليمة.",
        sequences: [
          {
            id: "ara_2_seq1",
            name: "المقطع 01: الحياة العائلية",
            field: "فهم المكتوب والمنطوق",
            resources: [
              { id: "res_ara_2_1", title: "قواعد اللغة: الفعل المعتل وأنواعه (مثال، أجوف، ناقص، لفيف)", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_2_2", title: "قواعد اللغة: إسناد الفعل المثال والأجوف إلى الضمائر", duration: "1 ساعة", type: "ظاهرة صرفية" },
              { id: "res_ara_2_3", title: "إنتاج المكتوب: سرد أحداث يوم عائلي مشهود بتوظيف الوصف", duration: "1 ساعة", type: "تعبير كتابي" },
            ],
          },
          {
            id: "ara_2_seq2",
            name: "المقطع 02: حب الوطن",
            field: "فهم المكتوب والمنطوق",
            resources: [
              { id: "res_ara_2_4", title: "قواعد اللغة: الاسم المنقوص والمقصور والممدود وإعرابها", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_2_5", title: "قراءة مشروحة: نشيد الشهيد وفضائل التضحية من أجل الوطن", duration: "1 ساعة", type: "قراءة وتحليل" },
            ],
          },
        ],
      },
      "1am": {
        generalCompetence: "يفهم وينتج خطابات شفوية وكتابية يغلب عليها النمطان السردي والوصفي، محترماً قواعد اللغة والإملاء الأساسية.",
        sequences: [
          {
            id: "ara_1_seq1",
            name: "المقطع 01: الحياة العائلية",
            field: "فهم المنطوق والمكتوب",
            resources: [
              { id: "res_ara_1_1", title: "قواعد اللغة: النعت الحقيقي وأوجه مطابقته للمنعوت", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_1_2", title: "قواعد اللغة: الفاعل والمفعول به وعلامات إعرابهما", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_1_3", title: "إنتاج المكتوب: وصف أفراد الأسرة ودور كل منهم في البيت", duration: "1 ساعة", type: "تعبير كتابي" },
            ],
          },
          {
            id: "ara_1_seq2",
            name: "المقطع 02: حب الوطن",
            field: "فهم المنطوق والمكتوب",
            resources: [
              { id: "res_ara_1_4", title: "قواعد اللغة: كان وأخواتها وإن وأخواتها وعملهما", duration: "1 ساعة", type: "ظاهرة لغوية" },
              { id: "res_ara_1_5", title: "قواعد الإملاء: همزة الوصل وهمزة القطع ومواضعهما", duration: "1 ساعة", type: "إملاء ورسم كتابي" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "maths",
    name: "الرياضيات",
    iconName: "Calculator",
    color: "indigo",
    levels: {
      "4am": {
        generalCompetence: "يحل مشكلات حسابية وهندسية ودالية معقدة، مجنداً مبرهنتي طالس وفيثاغورس، والنسب المثلثية، والدوال وحساب الإحصاء والاحتمال في الحياة العملية.",
        sequences: [
          {
            id: "mat_4_seq1",
            name: "المقطع 01: الأعداد الطبيعية والأعداد الناطقة والحساب على الجذور",
            field: "الأنشطة العددية",
            resources: [
              { id: "res_mat_4_1", title: "القاسم المشترك الأكبر (PGCD) بطريقة الفروق المتتالية وبطريقة خوارزمية إقليدس", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_mat_4_2", title: "الكسور غير القابلة للاختزال وتطبيقاتها الحسابية", duration: "1 ساعة", type: "إرساء وتدريب" },
              { id: "res_mat_4_3", title: "العمليات على الجذور التربيعية وقواعد الحساب (ضرب، قسمة، تبسيط)", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_mat_4_4", title: "كتابة نسبة على شكل كسر مقامه عدد ناطق", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "mat_4_seq2",
            name: "المقطع 02: خاصية طالس وحساب المثلثات في المثلث القائم",
            field: "الأنشطة الهندسية",
            resources: [
              { id: "res_mat_4_5", title: "خاصية طالس وحساب الأطوال في وضعيات التوازي", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_mat_4_6", title: "الخاصية العكسية لطالس وإثبات توازي مستقيمين", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_mat_4_7", title: "النسب المثلثية في المثلث القائم (الجيب، جيب التمام، والظل)", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "mat_4_seq3",
            name: "المقطع 03: الحساب الحرفي والمعادلات والمتراجحات والدوال",
            field: "الأنشطة العددية والدوال",
            resources: [
              { id: "res_mat_4_8", title: "المتطابقات الشهيرة ونشر وتبسيط عبارة جبرية", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_mat_4_9", title: "تحليل عبارة جبرية إلى جداء عاملين من الدرجة الأولى", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_mat_4_10", title: "الدالة الخطية والدالة التآلفية وتمثيلهما البياني واستعمالهما في حل المشكلات", duration: "2 ساعة", type: "إرساء موارد وإدماج" },
            ],
          },
        ],
      },
      "3am": {
        generalCompetence: "يحل مشكلات تتضمن الأعداد النسبية والناطقة، والمثلثات القائمة ومبرهنة فيثاغورس، ومستقيم المنتصفين، والقوى ذات الأسس النسبية الصحيحة.",
        sequences: [
          {
            id: "mat_3_seq1",
            name: "المقطع 01: العمليات على الأعداد النسبية والأعداد الناطقة",
            field: "الأنشطة العددية",
            resources: [
              { id: "res_mat_3_1", title: "جداء وقسمة عدة أعداد نسبية وقاعدة الإشارات", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_mat_3_2", title: "مقارنة وجمع وطرح وضرب كسرين وأعداد ناطقة", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "mat_3_seq2",
            name: "المقطع 02: المثلثات والخاصية العكسية لفيثاغورس",
            field: "الأنشطة الهندسية",
            resources: [
              { id: "res_mat_3_3", title: "خاصية مستقيم المنتصفين في المثلث وتطبيقاتها", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_mat_3_4", title: "مبرهنة فيثاغورس لحساب أطوال أضلاع المثلث القائم", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
        ],
      },
      "2am": {
        generalCompetence: "يحل مشكلات تتضمن العمليات على الأعداد الطبيعية والعشرية، والكسور، وإنشاءات الأشكال المستوية وحساب المساحات والتناظر المركزي.",
        sequences: [
          {
            id: "mat_2_seq1",
            name: "المقطع 01: العمليات على الأعداد الطبيعية والعشرية والأعداد النسبية",
            field: "الأنشطة العددية",
            resources: [
              { id: "res_mat_2_1", title: "سلسلة عمليات تتضمن أقواس وبدون أقواس وأولويات الحساب", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_mat_2_2", title: "جمع وطرح الأعداد النسبية والمسافة بين نقطتين على مستقيم مدرج", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "mat_2_seq2",
            name: "المقطع 02: التناظر المركزي وإنشاء الأشكال الهندسية",
            field: "الأنشطة الهندسية",
            resources: [
              { id: "res_mat_2_3", title: "التناظر المركزي ونظائر أشكال هندسية (نقطة، قطعة، مستقيم، زاوية)", duration: "2 ساعة", type: "إرساء موارد" },
              { id: "res_mat_2_4", title: "خواص التناظر المركزي (انحفاظ المسافات، استقامية النقط، المساحات)", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
        ],
      },
      "1am": {
        generalCompetence: "يتحكم في الحساب على الأعداد الطبيعية والعشرية وتوظيف الكسور، والمفاهيم الهندسية الأولية (الاستقامية، التعامد، التوازي والمحيطات والمساحات).",
        sequences: [
          {
            id: "mat_1_seq1",
            name: "المقطع 01: الأعداد الطبيعية والأعداد العشرية",
            field: "الأنشطة العددية",
            resources: [
              { id: "res_mat_1_1", title: "الكتابة العشرية والكتابة الكسرية والمفكوك النموذجي لعدد عشري", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_mat_1_2", title: "القسمة الإقليدية والقسمة العشرية وقواعد قابلية القسمة (2, 3, 4, 5, 9)", duration: "2 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "mat_1_seq2",
            name: "المقطع 02: التوازي والتعامد وإنشاء الأشكال الأساسية",
            field: "الأنشطة الهندسية",
            resources: [
              { id: "res_mat_1_3", title: "المستقيمات المتوازية والمتعامدة واستعمال الكوس والمسطرة", duration: "1 ساعة", type: "إرساء وتدريب" },
              { id: "res_mat_1_4", title: "الدائرة وقوس الدائرة وإنشاء مثلثات خاصة ومستطيل ومربع", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "histoire_geo",
    name: "التاريخ والجغرافيا والتربية المدنية",
    iconName: "Globe",
    color: "rose",
    levels: {
      "4am": {
        generalCompetence: "يحلل وثائق تاريخية وجغرافية متعلقة بالثورة التحريرية الجزائرية الكبرى والمجال الجغرافي للجزائر ومؤسسات الدولة، معتزاً بالهوية الوطنية وممارساً للمواطنة الإيجابية.",
        sequences: [
          {
            id: "hg_4_seq1",
            name: "المقطع 01 (تاريخ): الوثائق التاريخية والاحتلال الفرنسي ومقاومة الشعب",
            field: "التاريخ الوطني",
            resources: [
              { id: "res_hg_4_1", title: "دراسة وثيقة تاريخية وفق المنهجية (نداء دي بورمون / معاهدة الاستسلام)", duration: "1 ساعة", type: "إرساء موارد ومنهجية" },
              { id: "res_hg_4_2", title: "السياسة الاستعمارية الفرنسية في الجزائر (مصادرة الأراضي، الاستيطان، القضاء على التعليم)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_hg_4_3", title: "مقاومة الشعب الجزائري من المقاومات الشعبية المسلحة إلى الحركة الوطنية", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
          {
            id: "hg_4_seq2",
            name: "المقطع 02 (تاريخ): الثورة التحريرية الكبرى (1954 - 1962)",
            field: "التاريخ الوطني",
            resources: [
              { id: "res_hg_4_4", title: "اندلاع الثورة التحريرية وتحليل بيان أول نوفمبر 1954", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_hg_4_5", title: "هجومات الشمال القسنطيني 20 أوت 1955 وأثرها في تدويل القضية", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_hg_4_6", title: "مؤتمر الصومام 20 أوت 1956 وهيكلة وتنظيم الثورة سياسياً وعسكرياً", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_hg_4_7", title: "المفاوضات واسترجاع السيادة الوطنية وإعلان الاستقلال 1962", duration: "1 ساعة", type: "إدماج وتتويج" },
            ],
          },
          {
            id: "hg_4_seq3",
            name: "المقطع 01 (جغرافيا): المجال الجغرافي للجزائر والتضاريس والمناخ",
            field: "الجغرافيا الإقليمية للجزائر",
            resources: [
              { id: "res_hg_4_8", title: "الموقع الجغرافي والفلكي للجزائر وأهميته الإستراتيجية والإقليمية", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_hg_4_9", title: "السطح والتضاريس في الجزائر (الإقليم الشمالي والإقليم الجنوبي الصحراوي)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_hg_4_10", title: "المناخ والأقاليم المناخية وشبكة المجاري المائية (الأودية)", duration: "1 ساعة", type: "إرساء موارد" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "francais",
    name: "اللغة الفرنسية (Français)",
    iconName: "Languages",
    color: "purple",
    language: "fr",
    levels: {
      "4am": {
        generalCompetence: "L'élève est capable de comprendre et de produire des textes argumentatifs (à visée descriptive, narrative et explicative) à l'oral et à l'écrit, en mobilisant ses compétences linguistiques et méthodologiques selon le programme de 4e Année Moyenne (Génération 2).",
        sequences: [
          {
            id: "fr_4_p1_s1",
            name: "Projet 1 - Séquence 1: À la découverte de notre région (Décrire un lieu et son patrimoine)",
            field: "Compréhension et production de l'oral et de l'écrit",
            resources: [
              { id: "res_fr_4_1", title: "Vocabulaire: Le lexique thématique du patrimoine et les verbes de perception", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_2", title: "Grammaire: La proposition subordonnée relative par 'qui, que, où' (expansion du nom)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_3", title: "Conjugaison: Le présent de l'indicatif (valeur narrative et descriptive)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_4", title: "Orthographe: L'accord de l'adjectif qualificatif avec le nom", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_5", title: "Production écrite: Rédiger un court paragraphe descriptif pour inciter à visiter une région d'Algérie", duration: "1 heure", type: "Production de l'écrit" },
            ],
          },
          {
            id: "fr_4_p1_s2",
            name: "Projet 1 - Séquence 2: Raconter pour vanter un événement historique ou culturel",
            field: "Compréhension et production de l'oral et de l'écrit",
            resources: [
              { id: "res_fr_4_6", title: "Vocabulaire: Les connecteurs chronologiques et logiques", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_7", title: "Grammaire: Les rapports logiques de cause et de conséquence (parce que, car, donc, par conséquent)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_8", title: "Conjugaison: L'imparfait et le passé composé dans le récit", duration: "2 heures", type: "Ressource linguistique" },
              { id: "res_fr_4_9", title: "Production écrite: Éloge d'une personnalité historique ou d'un artisan algérien", duration: "1 heure", type: "Production écrite" },
            ],
          },
          {
            id: "fr_4_p2_s1",
            name: "Projet 2 - Séquence 1: Vivre ensemble en paix (Argumenter dans le dialogue)",
            field: "Texte argumentatif et dialogue",
            resources: [
              { id: "res_fr_4_10", title: "Vocabulaire: Le champ lexical de la paix, la tolérance et la solidarité", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_11", title: "Grammaire: Le discours direct et le discours indirect (verbes introducteurs de parole)", duration: "2 heures", type: "Ressource linguistique" },
              { id: "res_fr_4_12", title: "Grammaire: L'expression de l'opposition et de la concession (mais, cependant, bien que)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_4_13", title: "Production écrite: Insérer un passage dialogué argumenté sur le respect des différences", duration: "1 heure", type: "Production écrite" },
            ],
          },
        ],
      },
      "3am": {
        generalCompetence: "L'élève comprend et produit des textes narratifs réels (faits divers, récits de vie/biographie, et légendes patrimoniales).",
        sequences: [
          {
            id: "fr_3_p1_s1",
            name: "Projet 1 - Séquence 1: Le fait divers (Accident / Catastrophe naturelle)",
            field: "Le récit de faits réels",
            resources: [
              { id: "res_fr_3_1", title: "Vocabulaire: Le champ lexical de l'accident et les indicateurs temporels", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_3_2", title: "Grammaire: La voix passive dans les titres et les articles de presse", duration: "2 heures", type: "Ressource linguistique" },
              { id: "res_fr_3_3", title: "Conjugaison: Le passé composé et l'accord du participe passé", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_3_4", title: "Production écrite: Rédiger un fait divers à partir d'une grille d'informations (Quoi? Qui? Quand? Où? Comment?)", duration: "1 heure", type: "Production écrite" },
            ],
          },
          {
            id: "fr_3_p2_s1",
            name: "Projet 2 - Séquence 1: Le portrait et la biographie d'un héros national",
            field: "Le récit de vie",
            resources: [
              { id: "res_fr_3_5", title: "Vocabulaire: Les adjectifs mélioratifs et le lexique de l'héroïsme", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_3_6", title: "Grammaire: Les substituts lexicaux et grammaticaux pour éviter les répétitions", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_3_7", title: "Production écrite: Rédiger la notice biographique d'un chahid ou d'une personnalité scientifique", duration: "1 heure", type: "Production écrite" },
            ],
          },
        ],
      },
      "2am": {
        generalCompetence: "L'élève comprend et produit des textes narratifs fictionnels (le conte merveilleux, la fable et la bande dessinée).",
        sequences: [
          {
            id: "fr_2_p1_s1",
            name: "Projet 1 - Séquence 1: Entrer dans l'univers du conte (La situation initiale)",
            field: "Le récit imaginaire",
            resources: [
              { id: "res_fr_2_1", title: "Vocabulaire: Les formules d'ouverture du conte (Il était une fois...)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_2_2", title: "Grammaire: Les compléments circonstanciels de lieu et de temps (CCL / CCT)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_2_3", title: "Conjugaison: L'imparfait de description dans le conte", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_2_4", title: "Production écrite: Rédiger le début d'un conte imaginaire", duration: "1 heure", type: "Production écrite" },
            ],
          },
          {
            id: "fr_2_p1_s2",
            name: "Projet 1 - Séquence 2: Les péripéties et les aventures du conte",
            field: "Le récit imaginaire",
            resources: [
              { id: "res_fr_2_5", title: "Vocabulaire: Les éléments modificateurs (Soudain, tout à coup...)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_2_6", title: "Conjugaison: Le passé simple des verbes du 1er et 2ème groupe", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_2_7", title: "Production écrite: Rédiger les événements et péripéties vécus par le héros", duration: "1 heure", type: "Production écrite" },
            ],
          },
        ],
      },
      "1am": {
        generalCompetence: "L'élève comprend et produit des textes explicatifs simples portant sur l'hygiène de vie, la santé et l'environnement.",
        sequences: [
          {
            id: "fr_1_p1_s1",
            name: "Projet 1 - Séquence 1: Des gestes pour une bonne hygiène corporelle",
            field: "Le texte explicatif",
            resources: [
              { id: "res_fr_1_1", title: "Vocabulaire: Le champ lexical de l'hygiène et la propreté (se laver les mains)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_1_2", title: "Grammaire: La tournure impersonnelle 'Il faut / Il ne faut pas' et la phrase déclarative", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_1_3", title: "Conjugaison: Les verbes du 1er groupe au présent de l'indicatif", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_1_4", title: "Production écrite: Rédiger un texte explicatif court sur l'importance du brossage des dents", duration: "1 heure", type: "Production écrite" },
            ],
          },
          {
            id: "fr_1_p1_s2",
            name: "Projet 1 - Séquence 2: Une alimentation saine et équilibrée",
            field: "Le texte explicatif",
            resources: [
              { id: "res_fr_1_5", title: "Vocabulaire: La définition et la reformulation (c'est-à-dire, en d'autres termes)", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_1_6", title: "Grammaire: La relative explicative avec le pronom 'qui'", duration: "1 heure", type: "Ressource linguistique" },
              { id: "res_fr_1_7", title: "Production écrite: Expliquer les bienfaits des fruits et légumes pour la santé", duration: "1 heure", type: "Production écrite" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "anglais",
    name: "اللغة الإنجليزية (English)",
    iconName: "Globe2",
    color: "emerald",
    language: "en",
    levels: {
      "4am": {
        generalCompetence: "The learner interacts, interprets oral/written discourse, and produces coherent texts to describe universal landmarks, biographical milestones, and active eco-citizenship according to the Algerian 2nd Generation 4MS syllabus.",
        sequences: [
          {
            id: "en_4_seq1",
            name: "Sequence 1: Me, Universal Landmarks and Outstanding Figures",
            field: "Interpersonal communication, Arts and Culture",
            resources: [
              { id: "res_en_4_1", title: "Lexis: Architectural features, landmarks, monuments and historical sites", duration: "1 hour", type: "PDP Listening & Speaking" },
              { id: "res_en_4_2", title: "Grammar: Expressing similarities and differences (like / unlike / whereas / as...as)", duration: "1 hour", type: "PPU Language Focus" },
              { id: "res_en_4_3", title: "Grammar: The passive voice in the past simple (was/were + past participle)", duration: "2 hours", type: "PPU Language Focus" },
              { id: "res_en_4_4", title: "Phonology: Pronunciation of final '-ed' (/t/, /d/, /ɪd/) and diphthongs", duration: "1 hour", type: "Pronunciation Practice" },
              { id: "res_en_4_5", title: "Writing (Produce): Writing a guided travel itinerary and short bio of an Algerian architect or artist", duration: "1 hour", type: "Integration & Writing" },
            ],
          },
          {
            id: "en_4_seq2",
            name: "Sequence 2: Me, My Personality and Life Experiences",
            field: "Personal Identity and Self-Reflection",
            resources: [
              { id: "res_en_4_6", title: "Lexis: Positive and negative personality traits, feelings, and future careers", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_4_7", title: "Grammar: Past Simple vs Present Perfect with 'since' and 'for'", duration: "2 hours", type: "Grammar in Context" },
              { id: "res_en_4_8", title: "Grammar: Suffixes forming adjectives (-ful, -less, -ive, -able)", duration: "1 hour", type: "Vocabulary Building" },
              { id: "res_en_4_9", title: "Writing (Produce): Writing a letter/email about unforgettable school memories and future dreams", duration: "1 hour", type: "Written Production" },
            ],
          },
          {
            id: "en_4_seq3",
            name: "Sequence 3: Me, My Community and Citizenship",
            field: "Community Service, Charity and Environment",
            resources: [
              { id: "res_en_4_10", title: "Lexis: Charity work, voluntary associations, eco-friendly habits and community duties", duration: "1 hour", type: "Listening & Speaking" },
              { id: "res_en_4_11", title: "Grammar: Modals of obligation, prohibition and advice (must, mustn't, should, ought to)", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_4_12", title: "Writing (Produce): Drafting an eco-charter or green pledge for a cleaner school and neighborhood", duration: "1 hour", type: "Project Integration" },
            ],
          },
        ],
      },
      "3am": {
        generalCompetence: "The learner interacts, listens, reads and produces texts about personal abilities, interests, healthy lifestyles, and technological inventions.",
        sequences: [
          {
            id: "en_3_seq1",
            name: "Sequence 1: Me, My Abilities, My Interests and My Personality",
            field: "Self-expression and Daily Life",
            resources: [
              { id: "res_en_3_1", title: "Grammar: Expressing ability and inability in the present and past (can/can't, could/couldn't)", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_3_2", title: "Lexis: Expressing likes, interests and hobbies (fond of, keen on, interested in + gerund)", duration: "1 hour", type: "Vocabulary" },
              { id: "res_en_3_3", title: "Writing (Produce): Writing a self-introduction profile for an online international penfriend club", duration: "1 hour", type: "Writing" },
            ],
          },
          {
            id: "en_3_seq2",
            name: "Sequence 2: Me and My Lifestyles (Past vs Present)",
            field: "Algerian Culture and Traditions",
            resources: [
              { id: "res_en_3_4", title: "Grammar: Expressing past habits with 'used to / didn't use to'", duration: "2 hours", type: "Language Focus" },
              { id: "res_en_3_5", title: "Lexis: Traditional Algerian clothing, dishes, and folklore vs modern life", duration: "1 hour", type: "Reading Comprehension" },
              { id: "res_en_3_6", title: "Writing: Compare how grandparents lived in Algerian villages vs modern city life", duration: "1 hour", type: "Written Production" },
            ],
          },
        ],
      },
      "2am": {
        generalCompetence: "The learner interacts and produces descriptive texts about family, physical appearance, shopping, and common illnesses.",
        sequences: [
          {
            id: "en_2_seq1",
            name: "Sequence 1: Me, My Friends and My Family",
            field: "Descriptive Discourse",
            resources: [
              { id: "res_en_2_1", title: "Lexis: Describing physical appearance (height, build, hair style/colour, eyes)", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_2_2", title: "Grammar: The present continuous for ongoing actions (be + V-ing)", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_2_3", title: "Writing: Describing a best friend or family member in a short portrait", duration: "1 hour", type: "Writing" },
            ],
          },
          {
            id: "en_2_seq2",
            name: "Sequence 2: Me and My Shopping",
            field: "Daily Encounters and Transactions",
            resources: [
              { id: "res_en_2_4", title: "Grammar: Countable and uncountable nouns (how much / how many, some / any)", duration: "2 hours", type: "Language Focus" },
              { id: "res_en_2_5", title: "Speaking: Asking for prices and quantities at the grocery store/bazaar", duration: "1 hour", type: "Role-play & Dialogue" },
            ],
          },
        ],
      },
      "1am": {
        generalCompetence: "The learner acquires basic communicative skills in English (greetings, personal identification, classroom objects, family and daily routine).",
        sequences: [
          {
            id: "en_1_seq1",
            name: "Sequence 1: Hello! (Greetings, Alphabet and Personal Details)",
            field: "Interpersonal Initiation",
            resources: [
              { id: "res_en_1_1", title: "Speaking & Lexis: Greetings, saying hello/goodbye, asking for names and age", duration: "1 hour", type: "Oral Interaction" },
              { id: "res_en_1_2", title: "Phonics: English alphabet, numbers 1 to 20, and cardinal pronunciation", duration: "1 hour", type: "Pronunciation & Spelling" },
              { id: "res_en_1_3", title: "Grammar: Personal subject pronouns (I, you, he, she, it, we, they) and verb 'to be'", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_1_4", title: "Writing: Filling a pupil school ID card with name, age, city, and school", duration: "1 hour", type: "Guided Writing" },
            ],
          },
          {
            id: "en_1_seq2",
            name: "Sequence 2: My Family and My Friends",
            field: "Personal Environment",
            resources: [
              { id: "res_en_1_5", title: "Lexis: Family tree members (father, mother, brother, sister, grandparents)", duration: "1 hour", type: "Vocabulary" },
              { id: "res_en_1_6", title: "Grammar: Possessive adjectives (my, your, his, her) and verb 'to have'", duration: "1 hour", type: "Language Focus" },
              { id: "res_en_1_7", title: "Writing: Introducing one's family with short simple sentences", duration: "1 hour", type: "Production" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "islamique",
    name: "التربية الإسلامية",
    iconName: "Moon",
    color: "teal",
    language: "ar",
    levels: {
      "4am": {
        generalCompetence: "يستظهر النصوص الشرعية (القرآن والحديث) ويوظف معانيها، مطبقاً أحكام العقيدة والعبادات والمعاملات، متمثلاً السلوك النبوي والآداب الإسلامية الرفيعة.",
        sequences: [
          {
            id: "isl_4_seq1",
            name: "المقطع 01: العقيدة والقرآن والحديث الشريف",
            field: "القرآن الكريم والعقيدة",
            resources: [
              { id: "res_isl_4_1", title: "القرآن الكريم: سورة النبأ (حفظاً، شرحاً، واستخراجاً للعبر)", duration: "2 ساعة", type: "حفظ وتدبر" },
              { id: "res_isl_4_2", title: "العقيدة الإسلامية: الإيمان بالقضاء والقدر وآثاره الإيمانية والنفسية", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_isl_4_3", title: "الحديث النبوي: حديث الإحسان (إن الله كتب الإحسان على كل شيء)", duration: "1 ساعة", type: "شرح حديث وتطبيق" },
            ],
          },
          {
            id: "isl_4_seq2",
            name: "المقطع 02: الفقه والسيرة والآداب",
            field: "الفقه والسيرة النبوية",
            resources: [
              { id: "res_isl_4_4", title: "الفقه الإسلامي: الحج والعمرة (المفهوم، الحكم، الأركان، والحكم التشريعية)", duration: "2 ساعة", type: "فقه تشريعي" },
              { id: "res_isl_4_5", title: "السيرة النبوية: فتح مكة المكرمة وعفو النبي الشامل ومبدأ التسامح", duration: "1 ساعة", type: "سيرة وعبر" },
              { id: "res_isl_4_6", title: "الأخلاق الإسلامية: صلة الرحم وحسن الجوار ورعاية الوالدين", duration: "1 ساعة", type: "قيم وأخلاق" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "civique",
    name: "التربية المدنية",
    iconName: "Scale",
    color: "cyan",
    language: "ar",
    levels: {
      "4am": {
        generalCompetence: "يمارس المواطنة الفاعلة الواعية، متفاعلاً مع القضاء ومؤسسات الجمهورية، متمسكاً بحقوق الإنسان والمساواة والحل السلمي للنزاعات.",
        sequences: [
          {
            id: "civ_4_seq1",
            name: "المقطع 01: الحياة الجماعية والصلح القضائي",
            field: "الحياة الجماعية والنظام القضائي",
            resources: [
              { id: "res_civ_4_1", title: "الصلح والوساطة الاجتماعية وأهميتهما في تسوية النزاعات سلمياً", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_civ_4_2", title: "مؤسسة القضاء وأجهزته (المحكمة الابتدائية، المجلس القضائي، المحكمة العليا)", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_civ_4_3", title: "جلسة محاكمة (دراسة إجراءات التقاضي وحق الدفاع وضمانات المحاكمة العادلة)", duration: "1 ساعة", type: "وضعية إدماجية وتطبيق" },
            ],
          },
          {
            id: "civ_4_seq2",
            name: "المقطع 02: الإعلام ومؤسسات الجمهورية الديمقراطية",
            field: "الإعلام وحقوق الإنسان",
            resources: [
              { id: "res_civ_4_4", title: "حرية التعبير وضوابطها ومسؤولية استخدام شبكات التواصل الاجتماعي", duration: "1 ساعة", type: "إرساء موارد" },
              { id: "res_civ_4_5", title: "الدستور الجزائري (المفهوم، الأهمية، والتعديلات الدستورية)", duration: "1 ساعة", type: "إرساء مفاهيم" },
              { id: "res_civ_4_6", title: "الهلال الأحمر الجزائري ومنظمة اليونيسف والعمل التطوعي الإنساني", duration: "1 ساعة", type: "قيم ومواطنة" },
            ],
          },
        ],
      },
    },
  },
];

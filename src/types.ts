export type ExperienceLevel =
  | 'student_intern'
  | 'fresh_grad'
  | 'junior'
  | 'mid'
  | 'senior';

export type InterviewerStyle = 'supportive' | 'challenging' | 'technical_deep';

export interface CandidateProfile {
  name: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  universityOrSchool: string;
  skills: string[];
  eventsAndProjects: string[];
  additionalNotes: string;
}

export interface InterviewerProfile {
  name: string;
  title: string;
  company: string;
  styleMode: InterviewerStyle;
}

export interface QuestionItem {
  id: string;
  category: 'event_project' | 'technical' | 'behavioral_star' | 'reverse_question';
  categoryLabel: string;
  question: string;
  whyItMatters: string;
  idealAnswerGuideline: string;
  commonPitfalls: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
}

export interface QuestionGenerationResult {
  overview: string;
  interviewerBrief: string;
  questions: QuestionItem[];
}

export interface SimulationMessage {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  coachHint?: string;
}

export interface SessionReport {
  overallScore: number;
  categoryScores: {
    technicalScore: number;
    starMethodScore: number;
    communicationScore: number;
    projectMasteryScore: number;
  };
  strengths: string[];
  growthAreas: string[];
  starAnalysis: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  studentOrCareerAdvice: string;
  summary: string;
}

export interface PresetScenario {
  id: string;
  label: string;
  badge: string;
  description: string;
  candidate: CandidateProfile;
  interviewer: InterviewerProfile;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'student_intern',
    label: 'Üniversite 3. Sınıf Stajyer Adayı',
    badge: 'Öğrenci & Staj',
    description: 'Yazılım Mühendisliği öğrencisi, hackathon ve kulüp tecrübeli; üst düzey mimarla staj mülakatı.',
    candidate: {
      name: 'Eren Yılmaz',
      targetRole: 'Frontend & Mobil Geliştirici Stajyeri',
      experienceLevel: 'student_intern',
      universityOrSchool: 'İTÜ Bilgisayar Mühendisliği (3. Sınıf)',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'React Native', 'Git', 'REST API'],
      eventsAndProjects: [
        'Google DSC Üniversite Hackathonu 2.lik Ödülü (Sürdürülebilirlik Mobil Uygulaması)',
        'TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projesi (Görüntü İşleme ile Bitki Hastalıkları Tespiti)',
        'IEEE Öğrenci Kulübü Web Komitesi Başkanlığı',
        'Açık Kaynak Kodlu Kampüs Yemekhane Menüsü PWA Uygulaması (500+ aktif öğrenci kullanıcısı)',
      ],
      additionalNotes: 'İlk kurumsal yaz stajı için başvuruyor. Hızlı öğrenmeye ve takım çalışmasına hevesli.',
    },
    interviewer: {
      name: 'Selin Aktaş',
      title: 'Head of Mobile & Web Engineering',
      company: 'Getir Tech',
      styleMode: 'supportive',
    },
  },
  {
    id: 'fresh_grad_backend',
    label: 'Yeni Mezun Junior Backend Geliştirici',
    badge: 'Yeni Mezun',
    description: 'Yeni mezun mühendis, mikroservis ve API geliştirme deneyimi; teknik liderle zorlayıcı mülakat.',
    candidate: {
      name: 'Melis Kaya',
      targetRole: 'Junior Backend Developer',
      experienceLevel: 'fresh_grad',
      universityOrSchool: 'ODTÜ Elektrik-Elektronik Mühendisliği (Yeni Mezun)',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Redis', 'Unit Testing', 'TypeScript'],
      eventsAndProjects: [
        'Bitirme Tezi: Dağıtık IoT Cihazları için Ölçeklenebilir Telemetri Mimarisi',
        'Trendyol Tech Bootcamp Backend Mezuniyet Projesi (E-Ticaret Sepet Mikroservisi)',
        'Global Game Jam 2025 Çok Oyunculu WebSockets Sunucu Altyapısı',
      ],
      additionalNotes: 'Temel veri yapıları ve SQL optimizasyonu konularında iddialı.',
    },
    interviewer: {
      name: 'Burak Demir',
      title: 'Principal Software Architect',
      company: 'Trendyol',
      styleMode: 'technical_deep',
    },
  },
  {
    id: 'student_ai_research',
    label: 'Yapay Zeka & Veri Bilimi Kulüp Araştırmacısı',
    badge: 'Öğrenci & AI',
    description: 'Yapay Zeka kulübü başkanı, Teknofest ve Kaggle yarışmacısı; startup kurucusuyla kriz senaryosu.',
    candidate: {
      name: 'Caner Özkan',
      targetRole: 'Machine Learning & AI Intern',
      experienceLevel: 'student_intern',
      universityOrSchool: 'Yıldız Teknik Üniversitesi Bilgisayar Mühendisliği (4. Sınıf)',
      skills: ['Python', 'PyTorch', 'Gemini API', 'Pandas', 'FastAPI', 'Vector Databases', 'LangChain'],
      eventsAndProjects: [
        'Teknofest Yapay Zeka Sağlıkta İnovasyon Yarışması Finalisti',
        'Kaggle Tabular Playground Bronz Madalya',
        'Üniversite Yapay Zeka Kulübü (AI Society) Kurucu Üyesi & Hackathon Organizatörü',
        'RAG Tabanlı Akademik Makale Arama Motoru Projesi',
      ],
      additionalNotes: 'Modern LLM mimarilerine ve veri ön işleme süreçlerine hakim.',
    },
    interviewer: {
      name: 'Dr. Mert Arslan',
      title: 'CTO & Co-Founder',
      company: 'CognitiveLabs AI',
      styleMode: 'challenging',
    },
  },
  {
    id: 'senior_lead',
    label: 'Kıdemli Sistem & Bulut Mühendisi',
    badge: 'Senior & Lider',
    description: 'Yüksek trafikli sistemler ve ekip liderliği deneyimi; Mühendislik Direktörü ile stratejik mülakat.',
    candidate: {
      name: 'Zeynep Çelik',
      targetRole: 'Senior Cloud & Platform Engineer',
      experienceLevel: 'senior',
      universityOrSchool: 'Boğaziçi Üniversitesi Bilgisayar Mühendisliği (2019 Mezun)',
      skills: ['Kubernetes', 'Go', 'AWS', 'Terraform', 'Kafka', 'System Architecture', 'CI/CD Pipelines'],
      eventsAndProjects: [
        'DevOpsdays Istanbul 2024 Konuşmacısı ("Zero-Downtime Migration at Scale")',
        'Açık Kaynak Kubernetes Otomasyon Operatörü (800+ GitHub Star)',
        '100K+ RPS Trafik Taşıyan Ödeme Geçidi Altyapısının Sıfırdan Tasarımı',
      ],
      additionalNotes: 'Fintech ve e-ticaret altyapılarında yüksek erişilebilirlik (99.99%) tecrübesi.',
    },
    interviewer: {
      name: 'Hakan Şentürk',
      title: 'VP of Engineering',
      company: 'Hepsiburada',
      styleMode: 'challenging',
    },
  },
];

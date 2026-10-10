import React, { useState } from 'react';
import {
  CandidateProfile,
  InterviewerProfile,
  PRESET_SCENARIOS,
  PresetScenario,
  ExperienceLevel,
  InterviewerStyle,
} from '../types';
import {
  GraduationCap,
  Briefcase,
  User,
  Building,
  Plus,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface ProfileSetupProps {
  candidate: CandidateProfile;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  interviewer: InterviewerProfile;
  setInterviewer: React.Dispatch<React.SetStateAction<InterviewerProfile>>;
  onGenerateQuestions: () => void;
  onStartSimulation: () => void;
  isLoading: boolean;
}

const COMMON_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'Git',
  'Tailwind CSS',
  'Java / Spring',
  'Go',
  'REST API',
  'GraphQL',
  'AWS',
  'Data Structures & Algorithms',
  'Machine Learning',
];

const SUGGESTED_ACTIVITIES = [
  'Google DSC Üniversite Hackathonu Finalisti',
  'TÜBİTAK 2209-A Öğrenci Araştırma Projesi',
  'Teknofest Yarışması Katılımcısı',
  'IEEE / ACM Öğrenci Kulübü Aktif Üyeliği',
  'Global Game Jam Projesi',
  'Açık Kaynak Kodlu GitHub Projesi',
  'Üniversite Bitirme Tezi / Dönem Projesi',
  'Bootcamp / Geliştirici Eğitimi Mezuniyeti',
];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  candidate,
  setCandidate,
  interviewer,
  setInterviewer,
  onGenerateQuestions,
  onStartSimulation,
  isLoading,
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const handleApplyPreset = (preset: PresetScenario) => {
    setCandidate({ ...preset.candidate });
    setInterviewer({ ...preset.interviewer });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !candidate.skills.includes(trimmed)) {
      setCandidate((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCandidate((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const addActivity = (act: string) => {
    const trimmed = act.trim();
    if (trimmed && !candidate.eventsAndProjects.includes(trimmed)) {
      setCandidate((prev) => ({
        ...prev,
        eventsAndProjects: [...prev.eventsAndProjects, trimmed],
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (activityToRemove: string) => {
    setCandidate((prev) => ({
      ...prev,
      eventsAndProjects: prev.eventsAndProjects.filter((a) => a !== activityToRemove),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto pt-4 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kişiselleştirilmiş Mülakat & Senaryo Hazırlığı
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Mülakatçının unvanı ve şirketine, sizin teknik yetkinliklerinize, katıldığınız etkinlik ve öğrenci/mezun durumunuza özel yapay zeka koçu ile hazırlanın.
        </p>
      </div>

      {/* Preset Fast Selector */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Hızlı Hazır Senaryolar (Öğrenci & Profesyonel Şablonları)
          </div>
          <span className="text-xs text-slate-500">Tek tıkla formu doldurun</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-blue-600 mb-1">
                <span>{preset.badge}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                {preset.label}
              </div>
              <div className="text-xs text-slate-500 line-clamp-2 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Candidate & Interviewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Candidate Profile (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Adayın Profili & Yetkinlikleri
              </h2>
              <p className="text-xs text-slate-500">
                Öğrenci, yeni mezun veya profesyonel geçmişiniz
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Adınız & Soyadınız
              </label>
              <input
                type="text"
                value={candidate.name}
                onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
                placeholder="Örn: Eren Yılmaz"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Hedef Pozisyon / Rol
              </label>
              <input
                type="text"
                value={candidate.targetRole}
                onChange={(e) => setCandidate({ ...candidate, targetRole: e.target.value })}
                placeholder="Örn: Frontend Developer Stajyeri"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kariyer Durumu / Seviye
              </label>
              <select
                value={candidate.experienceLevel}
                onChange={(e) =>
                  setCandidate({ ...candidate, experienceLevel: e.target.value as ExperienceLevel })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="student_intern">🎓 Üniversite / Lise Öğrencisi (Staj / Part-time)</option>
                <option value="fresh_grad">🎓 Yeni Mezun (0 - 1 Yıl)</option>
                <option value="junior">💼 Junior Geliştirici (1 - 2 Yıl)</option>
                <option value="mid">🚀 Mid-Level Uzman (2 - 5 Yıl)</option>
                <option value="senior">👑 Senior / Ekip Lideri (5+ Yıl)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Üniversite / Bölüm / Okul Bilgisi
              </label>
              <input
                type="text"
                value={candidate.universityOrSchool}
                onChange={(e) => setCandidate({ ...candidate, universityOrSchool: e.target.value })}
                placeholder="Örn: İTÜ Bilgisayar Mühendisliği 3. Sınıf"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Teknik Beceriler & Teknolojiler
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(newSkill);
                  }
                }}
                placeholder="Beceri yazıp Enter'a basın (örn. React, Docker)"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => addSkill(newSkill)}
                className="px-3.5 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Ekle
              </button>
            </div>

            {/* Added Skills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200/60"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Suggestions */}
            <div className="text-xs text-slate-500 pt-1">
              <span className="text-slate-400">Hızlı ekle: </span>
              {COMMON_SKILLS.slice(0, 7).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  disabled={candidate.skills.includes(s)}
                  className="inline-block text-slate-600 hover:text-blue-600 mr-2 underline decoration-slate-300 disabled:opacity-30 disabled:no-underline"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          {/* Events, Hackathons & Projects */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                Katıldığınız Etkinlikler, Projeler, Kulüpler & Hackathon'lar
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                Mülakat sorularında doğrudan sorulur
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addActivity(newActivity);
                  }
                }}
                placeholder="Örn: TÜBİTAK 2209A Projesi, Google DSC Hackathonu 2.'lik"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => addActivity(newActivity)}
                className="px-3.5 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Ekle
              </button>
            </div>

            {/* Added Activities List */}
            <div className="space-y-1.5 pt-1">
              {candidate.eventsAndProjects.map((act) => (
                <div
                  key={act}
                  className="flex items-center justify-between gap-2 p-2 text-xs bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700"
                >
                  <span className="line-clamp-2">{act}</span>
                  <button
                    type="button"
                    onClick={() => removeActivity(act)}
                    className="text-slate-400 hover:text-rose-500 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick activity suggestion pills */}
            <div className="text-xs text-slate-500 pt-1">
              <span className="text-slate-400">Örnek ekle: </span>
              {SUGGESTED_ACTIVITIES.slice(0, 4).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => addActivity(a)}
                  disabled={candidate.eventsAndProjects.includes(a)}
                  className="inline-block text-slate-600 hover:text-blue-600 mr-2 underline decoration-slate-300 disabled:opacity-30 disabled:no-underline truncate max-w-[200px]"
                >
                  +{a}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ekstra Notlar veya Vurgulamak İstedikleriniz (Opsiyonel)
            </label>
            <textarea
              rows={2}
              value={candidate.additionalNotes}
              onChange={(e) => setCandidate({ ...candidate, additionalNotes: e.target.value })}
              placeholder="Örn: İlk mülakatım olduğu için biraz heyecanlıyım; ya da sistem mimarisi tarafında kendimi test etmek istiyorum."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Col: Interviewer Profile & Modes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Mülakat Yapacak Kişi
                </h2>
                <p className="text-xs text-slate-500">
                  Soruların şekilleneceği hedef pozisyon ve unvan
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mülakatçının Adı
              </label>
              <input
                type="text"
                value={interviewer.name}
                onChange={(e) => setInterviewer({ ...interviewer, name: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mülakatçının Unvanı
              </label>
              <input
                type="text"
                value={interviewer.title}
                onChange={(e) => setInterviewer({ ...interviewer, title: e.target.value })}
                placeholder="Örn: Engineering Manager veya Senior HR Partner"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Yapay zeka, mülakatçının unvanının beklentilerine göre sorular üretecektir.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Şirket / Kurum Adı
              </label>
              <input
                type="text"
                value={interviewer.company}
                onChange={(e) => setInterviewer({ ...interviewer, company: e.target.value })}
                placeholder="Örn: Trendyol, Getir, Global Startup"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Interviewer Persona Modes */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-slate-700">
                Mülakatçının Tarzı & Zorluk Seviyesi
              </label>

              <div className="space-y-2">
                {/* Supportive */}
                <label
                  onClick={() => setInterviewer({ ...interviewer, styleMode: 'supportive' })}
                  className={`block p-3 border rounded-xl cursor-pointer transition-all ${
                    interviewer.styleMode === 'supportive'
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-800">
                      🟢 Destekleyici Koç (Supportive)
                    </span>
                    {interviewer.styleMode === 'supportive' && (
                      <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">
                        Seçili
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Cesaretlendirici, yapıcı ipuçları verir. Özellikle öğrenciler ve ilk mülakat tecrübesi için idealdir.
                  </p>
                </label>

                {/* Challenging */}
                <label
                  onClick={() => setInterviewer({ ...interviewer, styleMode: 'challenging' })}
                  className={`block p-3 border rounded-xl cursor-pointer transition-all ${
                    interviewer.styleMode === 'challenging'
                      ? 'border-rose-500 bg-rose-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-800">
                      🔴 Zorlayıcı & Stres Mülakatı (Challenging)
                    </span>
                    {interviewer.styleMode === 'challenging' && (
                      <span className="text-[10px] bg-rose-600 text-white font-semibold px-2 py-0.5 rounded-full">
                        Seçili
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Cevaplardaki boşlukları sorgular, "Ya sistem çökerse?" gibi baskı altında kriz senaryolarını test eder.
                  </p>
                </label>

                {/* Technical Deep */}
                <label
                  onClick={() => setInterviewer({ ...interviewer, styleMode: 'technical_deep' })}
                  className={`block p-3 border rounded-xl cursor-pointer transition-all ${
                    interviewer.styleMode === 'technical_deep'
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-800">
                      🔵 Teknik Derinlik (Deep Technical Lead)
                    </span>
                    {interviewer.styleMode === 'technical_deep' && (
                      <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full">
                        Seçili
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Kod kalitesi, veri yapıları, karmaşıklık analizi (Big-O) ve mimari trade-off'lara odaklanır.
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isLoading || !candidate.name || !interviewer.name}
              onClick={onGenerateQuestions}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Sorular & Senaryolar Oluşturuluyor...' : 'Soru Havuzu & Senaryoları Üret'}
            </button>

            <button
              type="button"
              disabled={isLoading || !candidate.name || !interviewer.name}
              onClick={onStartSimulation}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Doğrudan Canlı Simülasyona Başla
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

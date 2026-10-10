# MülakatAI - Kişiselleştirilmiş AI Mülakat Koçu & Simülasyon Platformu

Mülakat yapacak kişinin adı ve unvanına (örn. "Ahmet Yılmaz - Head of Engineering @ Trendyol"), adayın teknik yeteneklerine, katıldığı etkinlik/hackathon'lara ve yetkinliklerine özel gerçekçi mülakat senaryoları, soru havuzları ve sesli/yazılı canlı simülasyon koçluğu sunan kapsamlı bir platform.

### User Review & Critical Decisions

> [!IMPORTANT]
> Kullanıcı tercihleriyle netleşen kararlar ve planlanan mimari kurgu:

- **Confirmed Decision 1 (Format)**: Canlı interaktif mülakat simülasyonu (rol canlandırma ve anlık koç yönlendirmeleri) ile kategorize edilmiş detaylı soru havuzu (teknik, davranışsal/STAR, etkinlik/proje bazlı sorular ve örnek ideal yanıtlar) birlikte sunulacak.
- **Confirmed Decision 2 (Ses ve Metin Hibrit Modu)**: Kullanıcılar hem mikrofonla sesli konuşup otomatik metne döküm (Speech-to-Text) alabilecek, hem de istediklerinde klavyeyle yazabilecek; mülakatçının soruları ve koç geribildirimleri sesli dinlenebilecek.
- **Confirmed Decision 3 (Mülakatçı Tarzı & Zorluk)**: 3 farklı mülakat tarzı seçilebilecek:
  1. *Destekleyici & Rehber (Supportive Coach)*: Cesaretlendirici, yapıcı ipuçları veren ve rehberlik eden koç.
  2. *Zorlayıcı & Baskı Altında (Stress/Challenging)*: Detayları sorgulayan, boşlukları yakalayan, gerçek kurumsal mülakat baskısı hissettiren tarz.
  3. *Teknik Derinlik (Deep Technical Lead)*: Mimari kararları, edge-case'leri, trade-off'ları ve sistem tasarımını derinlemesine irdeleyen teknik lider.

---

### 1. Overview & Core Concept

- **What It Does**: Kullanıcı; mülakatçının adı/unvanı/şirketini ve kendi profilini (teknik beceriler, katıldığı etkinlikler, hackathon'lar, yetkinlikler ve hedef pozisyonu) girer. Sistem; Gemini 3.8 Flash motoruyla bu spesifik eşleşmeye özel senaryo haritası çıkarır. Aday, ya "Soru Havuzu & Hazırlık Masası"nda soruları ve STAR analizlerini inceler, ya da "Canlı Simülasyon Stüdyosu"nda seçtiği mülakatçı modunda sesli/yazılı pratik yaparak anlık koç puanlaması ve gelişim tavsiyeleri alır.
- **Target Audience / Persona**: Yazılım mühendisleri, veri bilimciler, ürün yöneticileri, yeni mezunlar ve kariyerinde seviye atlamak isteyen profesyoneller.
- **Key Value**: Ezber kalıp sorulardan ziyade adayın gerçek geçmişine (katıldığı etkinlikler, kullandığı teknolojiler) ve karşısındaki mülakatçının unvanına özel hiper-kişiselleştirilmiş gerçekçi prova imkanı.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Aday & Mülakatçı Profil Tanımlama (Onboarding / Setup)**:
   - *Mülakatçı Bilgisi*: İsim, Unvan (örn. Engineering Manager, Senior HR Partner, Principal Architect), Şirket/Sektör.
   - *Aday Becerileri & Yetkinlikleri*: Teknik stack (etiketler veya serbest metin), katıldığı etkinlikler/projeler (örn. "TÜBİTAK 2209A, Global Game Jam, GDG DevFest sunumu"), soft-skill yetkinlikler.
   - *Hızlı Şablonlar*: Kullanıcının hemen denemesi için hazır profiller (Frontend Lead mülakatı, Junior Backend, Veri Mühendisi mülakatı vb.).
2. **Hazırlık Masası (Tailored Question Bank & Scenarios)**:
   - Gemini tarafından üretilen 4 ana kategori:
     - *Kişiye & Etkinliklere Özel*: Adayın katıldığı etkinlikler ve projelerden yola çıkan sorgulayıcı sorular.
     - *Teknik Derinlik Soruları*: Adayın belirttiği teknolojilere ve pozisyona yönelik mimari/kodlama soruları.
     - *Davranışsal (STAR) Sorular*: Kriz anı, takım çatışması, teslim tarihi baskısı senaryoları.
     - *Mülakatçıya Sorulacak Ters Sorular*: Adayın mülakatçı unvanına göre sorması tavsiye edilen akıllı sorular.
   - Her soruda: Beklenen cevap yaklaşımı, dikkat edilmesi gereken tuzaklar ve örnek ideal STAR yanıtı.
3. **Canlı Mülakat Simülasyonu (Live Simulation Studio)**:
   - Seçilen mod (Destekleyici, Zorlayıcı, Teknik Derinlik) ile gerçek zamanlı simülasyon.
   - Gerçek mülakat hissi: Mülakatçı soruyu sorar, sesli okuma düğmesi ile dinlenebilir.
   - Yanıt verme: Mikrofon ile Türkçe ses kaydı (Web Speech STT) veya metin kutusundan yazarak yanıtlama.
   - Anlık "Koç İpucu" ve "Mülakatı Bitir & Rapor Al" kontrolleri.
4. **Kapsamlı Değerlendirme & STAR Raporu**:
   - Güçlü yönler, geliştirilmesi gereken alanlar, iletişim ve teknik derinlik puanı (100 üzerinden kriter bazlı).
   - Simülasyon geçmişini kaydetme ve PDF/Metin olarak dışa aktarma.

#### Visual Identity & Theme
- **Aesthetic Direction**: Modern SaaS & Profesyonel Kariyer Stüdyosu. Derin lacivert/antrasit ve temiz beyaz zemin dengesi, yüksek okunabilirlik, sıfır yapay süsleme ("anti-AI slop").
- **Color Palette**:
  - Neutral Canvas: `%60` temiz nötr arka plan (`#F8FAFC` light / `#0B0F19` dark uyumlu).
  - Structural Surfaces: `%30` kart ve panel yüzeyleri (`#FFFFFF`, ince kenarlık `border-slate-200/80`).
  - High-Intent Accent: `%10` odak rengi (güven verici kobalt mavisi `#2563EB`, mülakat modlarına özel subtle vurgular: Amber `#D97706` teknik mod, Emerald `#059669` destekleyici, Rose/Violet zorlayıcı).
- **Typography & Hierarchy**:
  - Başlıklar: Modern geometrik sans (`Plus Jakarta Sans`), `text-balance` ile taşmasız ve dengeli.
  - Gövde Metni: Okunaklı `DM Sans` / `Plus Jakarta Sans` (14-16px, ferah satır aralığı).
  - Metrikler ve Süreler: `font-mono tabular-nums`.
- **Top Bar Contract**:
  - Tek satır marka adı: **MülakatAI** · *AI Interview & Career Coach*
  - 4 net navigasyon sekmesi: `Profil & Ayarlar`, `Soru Havuzu`, `Canlı Simülasyon`, `Gelişim Raporu`.
  - Sağ alanda: Hızlı "Yeni Oturum Başlat" birincil butonu.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hibrit Ses & Yazı Mimarisi**:
  - *Chosen Approach*: Web Speech API (tarayıcı yerel SpeechRecognition ve SpeechSynthesis) entegrasyonu + tam metin alternatif girişi.
  - *Why*: Sıfır ağ gecikmesi, kullanıcı gizliliği, anında geri bildirim ve hem konuşmak isteyenlere hem de sessiz ortamda yazmak isteyenlere kesintisiz hibrit deneyim.
  - *Alternatives Considered*: Harici ağır ses streaming kütüphaneleri (yüksek latency ve izin sorunları yaratabileceği için yerel tarayıcı yetenekleri + sunucu Gemini Flash metin analiz pipeline'ı tercih edildi).
- **Decision 2: Server-Side Gemini 3.8 Flash Proxy**:
  - *Chosen Approach*: Express arka uç rotalarında (`/api/interview/generate`, `/api/interview/chat`, `/api/interview/feedback`) `@google/genai` resmi SDK'sı ile `gemini-3.8-flash` kullanımı.
  - *Why*: API anahtarını tarayıcıdan izole tutar, yapılandırılmış JSON şemalarıyla hatasız soru formatlaması sağlar, hızlı yanıt süresi sunar.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MülakatAI Frontend                            │
│  ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐  │
│  │ Profile & Context │  │ Question Bank     │  │ Live Simulation    │  │
│  │ Setup (Interviewer│  │ & Preparation     │  │ Studio (Audio/Text │  │
│  │ + Candidate Info) │  │ Hub (STAR format) │  │ + 3 Coach Modes)   │  │
│  └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬──────────┘  │
│            │                      │                      │             │
│            ▼                      ▼                      ▼             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  State Store (Active Session, Messages, Scores, Audio Controls)   │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ HTTP / JSON API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express Backend (/api)                          │
│  ┌───────────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ POST /api/interview/  │  │ POST /api/chat   │  │ POST /api/eval  │  │
│  │ generate-questions    │  │ (Simulation Turn)│  │ (STAR Analysis) │  │
│  └───────────┬───────────┘  └────────┬─────────┘  └────────┬────────┘  │
│              │                       │                     │           │
│              ▼                       ▼                     ▼           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │    @google/genai SDK (gemini-3.8-flash with Structured Outputs)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Model & Entities
- **CandidateProfile**: `name`, `targetRole`, `skills` (string[]), `eventsAndProjects` (string[]), `experienceLevel`, `additionalNotes`.
- **InterviewerProfile**: `name`, `title`, `company`, `styleMode` (`supportive` | `challenging` | `technical_deep`).
- **QuestionItem**: `id`, `category` (`event_project` | `technical` | `behavioral_star` | `reverse_question`), `question`, `whyItMatters`, `idealAnswerGuideline`, `commonPitfalls`, `difficulty`.
- **SimulationMessage**: `id`, `sender` (`interviewer` | `candidate` | `coach_hint`), `text`, `timestamp`, `feedback` (optional immediate coaching note).
- **SessionReport**: `overallScore`, `strengths` (string[]), `growthAreas` (string[]), `starEvaluation`, `summary`.

#### Interactive Component Mapping
- **ContextForm**: Aday ve mülakatçı girdilerini doğrular, tek tıkla hazır örnek senaryoları yükler.
- **QuestionBankView**: Soruları kategoriye göre filtreler, ipucu ve STAR örneklerini akordeon ile açar, istenen soruyu simülasyona aktarır.
- **SimulationStudio**: Dinamik mesajlaşma alanı, mülakatçının avatarı ve modu, sesli oynatma (TTS), sesli yanıt mikrofon düğmesi, anlık ipucu butonu ve oturum sonlandırma.
- **ReportModal / Export**: Oturum tamamlandığında detaylı geri bildirim kartı, puan dağılımı ve dışa aktarım (TXT/JSON/Kopyala).

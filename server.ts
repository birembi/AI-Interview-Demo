import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Interfaces
interface CandidateProfile {
  name: string;
  targetRole: string;
  experienceLevel: string; // e.g., 'student_intern', 'fresh_grad', 'junior', 'mid', 'senior'
  universityOrSchool?: string;
  skills: string[];
  eventsAndProjects: string[];
  additionalNotes?: string;
}

interface InterviewerProfile {
  name: string;
  title: string;
  company: string;
  styleMode: 'supportive' | 'challenging' | 'technical_deep';
}

// 1. Generate Question Bank & Scenarios Endpoint
app.post('/api/interview/generate-questions', async (req: Request, res: Response) => {
  try {
    const { candidate, interviewer }: { candidate: CandidateProfile; interviewer: InterviewerProfile } = req.body;

    if (!candidate || !interviewer) {
      return res.status(400).json({ error: 'Candidate and Interviewer profiles are required.' });
    }

    const prompt = `
Sen Türkiye'nin en deneyimli baş yetenek koçu ve teknik mülakat mentörüsün.
Aşağıda bilgileri verilen aday ve mülakatçı eşleşmesine özel, son derece gerçekçi ve derinlemesine bir mülakat hazırlık seti oluştur.

ADAY PROFİLİ:
- İsim: ${candidate.name || 'Aday'}
- Hedef Pozisyon: ${candidate.targetRole || 'Yazılım Geliştirici'}
- Deneyim / Durum: ${candidate.experienceLevel || 'Öğrenci / Yeni Mezun'}
- Okul / Üniversite: ${candidate.universityOrSchool || 'Belirtilmedi'}
- Teknik Beceriler: ${(candidate.skills || []).join(', ')}
- Katıldığı Etkinlikler, Projeler, Yarışmalar (Hackathon, Kulüpler, Teknofest vb.): ${(candidate.eventsAndProjects || []).join('; ')}
- Ek Notlar: ${candidate.additionalNotes || 'Yok'}

MÜLAKATÇI PROFİLİ:
- İsim: ${interviewer.name || 'Mülakatçı'}
- Unvan: ${interviewer.title || 'Engineering Manager'}
- Şirket / Kurum: ${interviewer.company || 'Teknoloji Şirketi'}
- Mülakat Tarzı: ${interviewer.styleMode}

ÖNEMLİ KURALLAR:
1. Eğer aday "Öğrenci / Stajyer" ise, sorular okul projelerine, hackathon/etkinlik deneyimlerine, öğrenme hevesine ve temel algoritma/teknik kavramlara odaklanmalı, ancak mülakatçının unvanının ciddiyetini korumalıdır.
2. Adayın girdiği etkinlikler (hackathon, öğrenci kulübü sunumu, açık kaynak, yarışma) mutlaka doğrudan sorularda referans verilmeli ("... etkinliğinde yaptığınız projede..." şeklinde).
3. Mülakatçının unvanına (${interviewer.title}) özgü gerçekçi bir bakış açısı sunulmalıdır.
4. Toplamda 4 kategoride en az 8-10 adet soru üret:
   - "event_project": Adayın katıldığı etkinlikler ve projelerle ilgili derinlemesine sorular.
   - "technical": Adayın belirttiği teknolojiler ve pozisyon için teknik/mimari sorular.
   - "behavioral_star": Takım çalışması, zaman yönetimi, kriz anı gibi durumsal STAR soruları.
   - "reverse_question": Adayın bu mülakatçıya (${interviewer.name} - ${interviewer.title}) sorması tavsiye edilen zekice sorular.
5. Her soru için 'whyItMatters' (mülakatçı neden soruyor), 'idealAnswerGuideline' (STAR metoduna uygun nasıl cevap verilmeli) ve 'commonPitfalls' (yapılmaması gereken hatalar) alanlarını eksiksiz doldur.
`;

    if (!apiKey) {
      // Fallback response if API key is not configured
      return res.json({
        overview: `${interviewer.name} (${interviewer.title}) ile mülakatınız için kişiselleştirilmiş soru seti oluşturuldu.`,
        questions: getFallbackQuestions(candidate, interviewer),
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: 'Sen profesyonel bir kariyer ve teknik mülakat mentörüsün. Yanıtlarını Türkçe ve yapılandırılmış JSON formatında üret.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: 'Mülakat oturumu hakkında 2-3 cümlelik koç özeti' },
            interviewerBrief: { type: Type.STRING, description: 'Mülakatçının beklentileri ve psikolojisi hakkında adaya tüyo' },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'event_project, technical, behavioral_star, reverse_question' },
                  categoryLabel: { type: Type.STRING, description: 'Türkçe kategori başlığı' },
                  question: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING, description: 'Mülakatçı bu soruda neyi ölçüyor?' },
                  idealAnswerGuideline: { type: Type.STRING, description: 'STAR formatında ideal cevap rehberi' },
                  commonPitfalls: { type: Type.STRING, description: 'Adayların düştüğü yaygın hatalar' },
                  difficulty: { type: Type.STRING, description: 'Kolay, Orta, Zor' },
                },
                required: ['id', 'category', 'categoryLabel', 'question', 'whyItMatters', 'idealAnswerGuideline', 'commonPitfalls', 'difficulty'],
              },
            },
          },
          required: ['overview', 'interviewerBrief', 'questions'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: error.message || 'Sorular oluşturulurken hata meydana geldi.' });
  }
});

// 2. Interactive Simulation Turn Endpoint
app.post('/api/interview/chat-turn', async (req: Request, res: Response) => {
  try {
    const {
      candidate,
      interviewer,
      conversationHistory,
      userMessage,
    }: {
      candidate: CandidateProfile;
      interviewer: InterviewerProfile;
      conversationHistory: Array<{ sender: 'interviewer' | 'candidate'; text: string }>;
      userMessage?: string;
    } = req.body;

    const styleInstructions = {
      supportive: 'Tavrın dost canlısı, cesaretlendirici ve yapıcı bir mentör gibidir. Aday öğrenciyse veya gerginse rahatlatır, ipucu verir, ancak mesleki ciddiyetini korur.',
      challenging: 'Tavrın doğrudan, sorgulayıcı ve zorlayıcıdır (Stres mülakatı). Adayın cevaplarındaki yüzeysellikleri hemen yakalar, "Peki ya şu senaryo gerçekleşseydi?", "Bunu yaparken neden x yerine y tercih ettin?" gibi derinleştirici ve test edici sorular sorar.',
      technical_deep: 'Tavrın tam bir Principal Architect / Teknik Lider gibidir. Detaylara, kod kalitesine, veri yapılarına, karmaşıklığa (Big-O), ölçeklenebilirliğe ve mimari ödünleşimlere (trade-offs) odaklanırsın.',
    }[interviewer.styleMode || 'supportive'];

    const prompt = `
Rol Canlandırma: Sen şu anda ${interviewer.name} kişisisin.
Unvanın: ${interviewer.title}
Şirketin: ${interviewer.company}
Mülakat Tarzın: ${styleInstructions}

Karşındaki Aday:
- İsim: ${candidate.name}
- Pozisyon: ${candidate.targetRole}
- Seviye/Durum: ${candidate.experienceLevel} (${candidate.universityOrSchool || ''})
- Becerileri: ${(candidate.skills || []).join(', ')}
- Etkinlikleri & Projeleri: ${(candidate.eventsAndProjects || []).join('; ')}

MÜLAKAT GEÇMİŞİ:
${conversationHistory.map((m) => `${m.sender === 'interviewer' ? interviewer.name : candidate.name}: ${m.text}`).join('\n')}

Adayın son yanıtı (varsa): "${userMessage || 'Mülakatın açılışı'}"

GÖREVLER:
1. Mülakatçı olarak (${interviewer.name}) adayın son yanıtına doğal, rolüne uygun ve Türkçe bir karşılık ver ve bir sonraki sorunu sor ya da konuyu derinleştir.
2. Ayrıca, sahne arkasında görünmeyen bir "AI Yetenek Koçu" olarak, adayın son yanıtını değerlendir:
   - "coachHint": Adayın neyi iyi söylediğini veya STAR metodunda hangi eksik kaldığını (1-2 yapıcı cümle).
3. Mülakat tamamlanma aşamasına geldi mi? "isConcluded" (boolean).
`;

    if (!apiKey) {
      return res.json({
        interviewerReply: `Merhaba ${candidate.name}, aramıza hoş geldin! ${interviewer.company} ekibimizde ${candidate.targetRole} pozisyonu için görüşmekten mutluyum. Bize son katıldığın etkinliklerden veya üzerinde çalıştığın projelerden bahsedebilir misin?`,
        coachHint: 'Giriş yaparken projendeki kendi rolünü ve karşılaştığın somut bir problemi STAR (Durum-Görev-Eylem-Sonuç) ile net vurgulamaya özen göster.',
        isConcluded: false,
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: 'Sen hem rol yapan mülakatçısın hem de arka plandaki uzman kariyer koçusun. Sadece geçerli JSON döndür.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerReply: { type: Type.STRING, description: 'Mülakatçının doğrudan adaya söylediği replik/soru' },
            coachHint: { type: Type.STRING, description: 'Arka plandaki koçun adaya özel gizli tavsiyesi ve anlık analizi' },
            isConcluded: { type: Type.BOOLEAN, description: 'Mülakat sona erdi mi?' },
          },
          required: ['interviewerReply', 'coachHint', 'isConcluded'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in chat turn:', error);
    return res.status(500).json({ error: error.message || 'Sohbet adımında hata oluştu.' });
  }
});

// 3. Evaluate Session Endpoint
app.post('/api/interview/evaluate-session', async (req: Request, res: Response) => {
  try {
    const {
      candidate,
      interviewer,
      conversationHistory,
    }: {
      candidate: CandidateProfile;
      interviewer: InterviewerProfile;
      conversationHistory: Array<{ sender: 'interviewer' | 'candidate'; text: string }>;
    } = req.body;

    const prompt = `
Aşağıda tamamlanmış bir mülakatın tam dökümü bulunmaktadır.
Aday: ${candidate.name} (${candidate.targetRole}, Seviye: ${candidate.experienceLevel}, Okul: ${candidate.universityOrSchool || 'Yok'})
Teknik Beceriler: ${(candidate.skills || []).join(', ')}
Etkinlik & Projeler: ${(candidate.eventsAndProjects || []).join('; ')}
Mülakatçı: ${interviewer.name} (${interviewer.title} @ ${interviewer.company})

MÜLAKAT DÖKÜMÜ:
${conversationHistory.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}

Lütfen profesyonel bir İK & Teknik Değerlendirme Raporu oluştur.
Rapor şunları içermelidir:
1. overallScore (0-100 arası genel başarı puanı)
2. categoryScores:
   - technicalScore (0-100)
   - starMethodScore (0-100)
   - communicationScore (0-100)
   - projectMasteryScore (0-100)
3. strengths (En az 3 güçlü yön maddesi)
4. growthAreas (Geliştirilmesi gereken 3 somut alan)
5. starAnalysis:
   - situation: Durum tespiti ve bağlam kurma performansı
   - task: Sorumluluk tanımlama performansı
   - action: Kendi aldığı aksiyonları anlatma performansı ("Biz" yerine "Ben ne yaptım")
   - result: Ölçülebilir sonuç ve kazanımları aktarma performansı
6. studentOrCareerAdvice: Özellikle ${candidate.experienceLevel} durumuna ve ${candidate.universityOrSchool ? 'öğrencilik sürecine' : 'kariyerine'} özel somut bir sonraki adım tavsiyesi
7. summary: 2-3 paragraflık genel koçluk değerlendirmesi
`;

    if (!apiKey) {
      return res.json(getFallbackEvaluation(candidate));
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: 'Sen objektif ve geliştirici bir yetenek değerlendirme uzmanısın. JSON formatında Türkçe rapor üret.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            categoryScores: {
              type: Type.OBJECT,
              properties: {
                technicalScore: { type: Type.INTEGER },
                starMethodScore: { type: Type.INTEGER },
                communicationScore: { type: Type.INTEGER },
                projectMasteryScore: { type: Type.INTEGER },
              },
              required: ['technicalScore', 'starMethodScore', 'communicationScore', 'projectMasteryScore'],
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            starAnalysis: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            studentOrCareerAdvice: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ['overallScore', 'categoryScores', 'strengths', 'growthAreas', 'starAnalysis', 'studentOrCareerAdvice', 'summary'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error evaluating session:', error);
    return res.status(500).json({ error: error.message || 'Değerlendirme raporu oluşturulurken hata meydana geldi.' });
  }
});

// Fallback generator helpers if API key is in setup
function getFallbackQuestions(candidate: CandidateProfile, interviewer: InterviewerProfile) {
  const isStudent = candidate.experienceLevel.includes('student') || candidate.experienceLevel.includes('öğrenci') || candidate.experienceLevel.includes('intern');
  const projectRef = candidate.eventsAndProjects[0] || 'kulüp ve hackathon projeleriniz';

  return [
    {
      id: 'q1',
      category: 'event_project',
      categoryLabel: 'Etkinlik & Proje Odaklı',
      question: `Özgeçmişinizde belirttiğiniz "${projectRef}" deneyiminizde karşılaştığınız en büyük teknik ya da ekip içi darboğaz neydi ve bunu nasıl çözdünüz?`,
      whyItMatters: `${interviewer.title} unvanındaki bir yönetici, adayın sadece etkinliklere katılmış olmasını değil, orada inisiyatif alıp problem çözme yetisini görmek ister.`,
      idealAnswerGuideline: 'STAR Metodu: Projenin hedefini (Situation), senin rolünü (Task), aldığın somut teknik/iletişim aksiyonunu (Action) ve projenin çıktısını (Result) net belirt.',
      commonPitfalls: 'Sadece "Çok eğlenceliydi, birinci olduk" demek yerine teknik mimariyi ve senin bireysel katkını anlatmamak.',
      difficulty: 'Orta',
    },
    {
      id: 'q2',
      category: 'technical',
      categoryLabel: 'Teknik Derinlik',
      question: `Becerileriniz arasında yer alan ${(candidate.skills || ['teknoloji'])[0]} kullanırken karşılaştığınız bir performans veya ölçeklenebilirlik problemini nasıl debug edersiniz?`,
      whyItMatters: `${interviewer.company} gibi bir ortamda çalışan kod kadar, hata ayıklama ve performans bilinci de kritiktir.`,
      idealAnswerGuideline: isStudent ? 'Temel debugging adımlarını, loglamayı, profiling araçlarını ve mantıksal yaklaşımını adım adım ifade et.' : 'Metrikler, APM araçları, bellek sızıntıları ve optimizasyon tekniklerinden bahset.',
      commonPitfalls: 'Hemen hazır bir kütüphane önerip problemin kök neden analizine (root cause) girmemek.',
      difficulty: 'Zor',
    },
    {
      id: 'q3',
      category: 'behavioral_star',
      categoryLabel: 'Davranışsal (STAR)',
      question: 'Ekip arkadaşınızla teknik bir çözüm konusunda tamamen zıt düştüğünüz bir anı anlatır mısınız? Ortak bir uzlaşıya nasıl vardınız?',
      whyItMatters: 'Yazılım bir takım oyunudur. Fikir ayrılıklarında egoyu bir kenara bırakıp veriye dayalı karar alma olgunluğunu ölçer.',
      idealAnswerGuideline: 'Anlaşmazlığın konusunu kişiselleştirmeden, trade-off analizi veya küçük bir prototip/test ile nasıl çözüme kavuşturduğunuzu anlatın.',
      commonPitfalls: '"Ben haklıydım o yüzden benim dediğim oldu" demek ya da sessizce kabullenip geri çekildiğini söylemek.',
      difficulty: 'Orta',
    },
    {
      id: 'q4',
      category: 'reverse_question',
      categoryLabel: 'Mülakatçıya Sorulacak Ters Soru',
      question: `${interviewer.name} Bey/Hanım, ${interviewer.title} olarak ekibinizde ${candidate.targetRole} rolünde başlayan birinde ilk 90 günde görmeyi beklediğiniz en kritik başarı metriği nedir?`,
      whyItMatters: 'Bu soru adayın sıradan bir iş arayan değil, şirkete hemen somut değer katmak isteyen vizyoner bir profesyonel olduğunu gösterir.',
      idealAnswerGuideline: 'Görüşmenin sonunda "Bize bir sorunuz var mı?" dendiğinde bu soruyu özgüvenle ve göz temasıyla yöneltin.',
      commonPitfalls: '"Maaş ne zaman yatar?" veya "Şirkette yan haklar neler?" gibi ilk aşamada sorulmaması gereken sorular sormak.',
      difficulty: 'Kolay',
    },
  ];
}

function getFallbackEvaluation(candidate: CandidateProfile) {
  return {
    overallScore: 84,
    categoryScores: {
      technicalScore: 82,
      starMethodScore: 80,
      communicationScore: 88,
      projectMasteryScore: 86,
    },
    strengths: [
      'Katıldığı etkinlik ve projelerden örnekler verirken tutkulu ve samimi bir dil kullandı.',
      'Teknik temel kavramları ifade etmede net ve anlaşılırdı.',
      'Soruya odaklanıp dinleme becerisi gösterdi.',
    ],
    growthAreas: [
      'STAR metodunda "Action" (Kendi bireysel aksiyonu) kısmını "Biz yaptık" yerine "Ben şu mimariyi kurdum" şeklinde daha somutlaştırmalı.',
      'Sonuçları (Result) mümkünse somut metriklerle desteklemeli (örn. %30 daha hızlı, 200 aktif kullanıcı).',
      'Teknik soru geldiğinde alternatif yaklaşımları (trade-off) da dile getirmeli.',
    ],
    starAnalysis: {
      situation: 'Bağlamı ve projeyi hızlıca özetledi, giriş seviyesi için oldukça netti.',
      task: 'Üzerine düşen sorumluluğu belirtti ancak takım arkadaşlarıyla iş bölümünü daha net ayırabilir.',
      action: 'Teknik tercihlerini savundu, debugging adımlarını mantıklı sıraladı.',
      result: 'Kişisel öğrenim ve proje çıktısını aktardı; metriklerle güçlendirilebilir.',
    },
    studentOrCareerAdvice:
      'Öğrencilik ve staj aşamasında katıldığınız hackathon ve kulüp projeleri en büyük kozunuz! Bir sonraki mülakatta bu projelerdeki GitHub depolarınızı ve canlı linklerinizi mülakatçıya gururla sunun.',
    summary:
      'Aday genel olarak yüksek potansiyelli, öğrenmeye açık ve pozisyona istekli bir profil çizdi. Belirli teknik konularda daha derin örneklerle ve net STAR yapılandırmasıyla üst düzey şirketlerin mülakatlarında çok daha yüksek başarı elde edebilir.',
  };
}

// Vite middleware setup
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});

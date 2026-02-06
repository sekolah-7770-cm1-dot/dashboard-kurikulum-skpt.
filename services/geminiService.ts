
import { GoogleGenAI } from "@google/genai";
import { TakwimEvent, PBDRecord } from "../types";

// Memberitahu TypeScript bahawa process disediakan oleh persekitaran build
declare var process: {
  env: {
    API_KEY: string;
  };
};

export async function generateScheduleSummary(
  events: TakwimEvent[], 
  pbdData: PBDRecord[] = [], 
  queryType: string = 'general'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Analisis statistik kritikal untuk AI
  const total = pbdData.reduce((a, b) => a + (b.tp1+b.tp2+b.tp3+b.tp4+b.tp5+b.tp6), 0);
  const mtm = pbdData.reduce((a, b) => a + (b.tp3+b.tp4+b.tp5+b.tp6), 0);
  const mtmPct = total > 0 ? ((mtm/total)*100).toFixed(1) : "0";
  
  const subjectsCemerlang = pbdData
    .filter(d => ((d.tp5+d.tp6)/(d.tp1+d.tp2+d.tp3+d.tp4+d.tp5+d.tp6)) > 0.4)
    .slice(0, 2)
    .map(d => `${d.subjek} (${d.kelas})`);

  const prompt = `
    Anda adalah Cgu Din, AI Mastermind Unit Kurikulum SK Pekan Tenom.
    Data Prestasi Terkini:
    - Kadar MTM: ${mtmPct}%
    - Subjek Dengan Kualiti Tinggi: ${subjectsCemerlang.join(', ') || 'Sedang diproses'}
    
    Tugas: Berikan "Executive Insight" dalam 35 patah perkataan yang memotivasikan guru.
    Nada: Berwibawa, Membina, Profesional. Fokus kepada "Kemenjadian Murid" dan "Kualiti Instruksional".
    
    PERATURAN KRITIKAL:
    1. JANGAN sebut atau reka bilangan intervensi atau murid belum capai TP3.
    2. JANGAN guna data yang tidak ada dalam parameter di atas.
    3. Fokus hanya kepada pencapaian MTM dan Kualiti TP5/TP6.
    4. JANGAN gunakan senarai. 
    5. JANGAN gunakan bahasa inggeris kecuali teknikal (MTM, PBD).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return (response.text || "Sistem sedang mensintesis data prestasi kurikulum...").trim();
  } catch (error) {
    return "Analisis Kurikulum SKPTen sedang dikemaskini oleh Cgu Din AI.";
  }
}

export async function chatConsultant(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Anda adalah Edu_SKPTen AI - Personal Cgu Din Core Intelligence. 
    Misi: Membantu guru menterjemah data kepada tindakan penambahbaikan instruksional.
    Nada: Profesional, berfokuskan solusi, dan sentiasa merujuk data MTM (TP3-TP6).
    
    LARANGAN:
    - JANGAN beri maklumat intervensi atau bilangan murid gagal yang tidak sahih.
    - Jika ditanya tentang intervensi, jawab dengan fokus kepada "pengukuhan instruksional" dan "pdpc berkualiti".
    - JANGAN reka angka. Rujuk hanya data MTM and Kualiti TP5/6.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction, temperature: 0.5 },
      history: history,
    });
    const response = await chat.sendMessage({ message });
    return response.text || "Mohon pencerahan lanjut tentang kueri kurikulum anda.";
  } catch (error) {
    return "Sistem AI SKPTEN sedang diselenggara. Sila cuba sebentar lagi.";
  }
}

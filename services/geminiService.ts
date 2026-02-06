
import { GoogleGenAI } from "@google/genai";
import { TakwimEvent } from "../types";

export async function generateScheduleSummary(
  events: TakwimEvent[], 
  queryType: string = 'general'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const upcomingEvents = events.filter(e => e.date >= new Date());
  const upcomingCount = upcomingEvents.length;
  const unitSummary = Array.from(new Set(events.map(e => e.unit))).slice(0, 5).join(', ');
  
  const now = new Date();
  const monthName = now.toLocaleDateString('ms-MY', { month: 'long' });

  const prompt = `
    Anda adalah Edu_SKPTen AI, Mastermind Pengurusan Kurikulum SK Pekan Tenom.
    
    KONTEKS DATA:
    - Bulan Semasa: ${monthName}
    - Jumlah Aktiviti Terdekat: ${upcomingCount}
    - Unit Terlibat: ${unitSummary}
    - Fokus Analisis: ${queryType === 'busy' ? 'Kepadatan Takwim' : queryType === 'focus' ? 'Hala Tuju Unit' : 'Perancangan Keseluruhan'}
    
    TUGAS:
    Berikan satu perenggan "Executive Insight" (maksimum 40 patah perkataan) tentang status pengurusan kurikulum sekolah berdasarkan data di atas.
    
    SYARAT TEGAS:
    1. Gunakan Bahasa Melayu yang sangat profesional dan memberi inspirasi.
    2. Jangan gunakan senarai atau poin.
    3. Fokus kepada kualiti pelaksanaan program.
    4. Jika data aktiviti adalah 0, berikan motivasi untuk pengisian takwim baharu.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const text = response.text;
    if (!text || text.trim().length === 0) {
      return "Sistem sedang menyelaraskan data takwim untuk memberikan analisis yang lebih tepat. Sila cuba sebentar lagi.";
    }
    return text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, sistem AI sedang mengalami kesesakan trafik. Analisis takwim akan tersedia semula dalam beberapa saat.";
  }
}

export async function chatConsultant(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Anda adalah Edu_SKPTen AI - Pakar Pengurusan Kurikulum Sekolah Kebangsaan Pekan Tenom.
    Nada: Profesional, berfokuskan solusi, dan mesra guru.
    Misi: Membantu guru dalam pengurusan takwim, dokumentasi panitia, dan strategi PdP.
    Pastikan jawapan anda sentiasa menyokong visi Transformasi Sekolah 2026.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction, temperature: 0.7 },
      history: history,
    });
    const response = await chat.sendMessage({ message });
    return response.text || "Mohon pencerahan lanjut tentang kueri kurikulum anda.";
  } catch (error) {
    return "Sistem Konsultasi AI sedang dikemas kini. Sila cuba lagi seketika.";
  }
}

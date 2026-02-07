
import { GoogleGenAI } from "@google/genai";
import { TakwimEvent, PBDRecord } from "../types";

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
    
    TUGAS:
    Berikan satu perenggan "Executive Insight" (maksimum 40 patah perkataan) tentang status pengurusan kurikulum sekolah.
    Gunakan Bahasa Melayu yang profesional dan memberi inspirasi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Sistem sedia memproses data.";
  } catch (error) {
    return "Analisis takwim akan tersedia semula sebentar lagi.";
  }
}

export async function generatePBDAnalysis(
  subjek: string,
  stats: { tp1: number, tp2: number, tp3: number, tp4: number, tp5: number, tp6: number, total: number, mtm: string, quality: string }
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Anda adalah Pakar Analisis Data Akademik SK Pekan Tenom (cikgu Din).
    Analisis data PBD bagi subjek: ${subjek}
    
    DATA SEMASA:
    - Jumlah Murid: ${stats.total}
    - Peratus MTM (TP3-TP6): ${stats.mtm}%
    - Peratus Kualiti (TP5-TP6): ${stats.quality}%
    - TP1: ${stats.tp1} murid, TP2: ${stats.tp2} murid
    
    TUGAS:
    Berikan ulasan eksekutif ringkas (maksimum 50 patah perkataan) dalam Bahasa Melayu. 
    1. Nyatakan status pencapaian.
    2. Berikan 1 cadangan strategi intervensi untuk murid TP1/TP2.
    3. Gunakan nada yang memberi galakan kepada guru.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "Data sedang dianalisis oleh sistem.";
  } catch (error) {
    return `Bagi subjek ${subjek}, fokus perlu diberikan kepada murid TP1 & TP2 melalui bimbingan berfokus untuk meningkatkan MTM melepasi sasaran sekolah.`;
  }
}

export async function chatConsultant(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Anda adalah Edu_SKPTen AI - Pakar Pengurusan Kurikulum Sekolah Kebangsaan Pekan Tenom.
    Nada: Profesional, berfokuskan solusi, dan mesra guru.
    Misi: Membantu guru dalam pengurusan takwim, dokumentasi panitia, dan strategi PdP.
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
    return "Sistem Konsultasi AI sedang dikemas kini.";
  }
}

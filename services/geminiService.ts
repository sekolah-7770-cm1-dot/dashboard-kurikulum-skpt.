
import { GoogleGenAI } from "@google/genai";
import { TakwimEvent } from "../types";

// Removed declare var process to follow guidelines and use process.env directly.

export async function generateScheduleSummary(
  events: TakwimEvent[], 
  queryType: string = 'general'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const upcomingCount = events.filter(e => e.date >= new Date()).length;
  const unitSummary = Array.from(new Set(events.map(e => e.unit))).slice(0, 3).join(', ');

  const prompt = `
    Anda adalah Edu_SKPTen AI, Mastermind Pengurusan Takwim Unit Kurikulum SK Pekan Tenom.
    Data Semasa:
    - Jumlah Aktiviti Terdekat: ${upcomingCount}
    - Unit Terlibat: ${unitSummary}
    
    Tugas: Berikan "Executive Insight" dalam 30 patah perkataan tentang keberkesanan perancangan takwim sekolah.
    Nada: Profesional, Membina, Memberi Inspirasi. Fokus kepada pengurusan masa dan kualiti program.
    
    PERATURAN:
    1. JANGAN reka angka akademik (TP/Lulus).
    2. JANGAN guna data yang tidak ada.
    3. JANGAN gunakan senarai. 
    4. Bahasa Melayu sepenuhnya.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return (response.text || "Sistem sedang menganalisis takwim kurikulum...").trim();
  } catch (error) {
    return "Analisis Takwim SKPTen sedang dikemaskini.";
  }
}

export async function chatConsultant(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Anda adalah Edu_SKPTen AI - Pakar Pengurusan Kurikulum Sekolah.
    Misi: Membantu guru dalam pengurusan takwim, dokumen panitia, dan strategi pengajaran.
    Nada: Profesional, berfokuskan solusi, dan mesra guru.
    
    LARANGAN:
    - JANGAN beri data gred murid yang tidak wujud.
    - Fokus kepada sokongan teknikal kurikulum (Takwim, Dokumen, Program).
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
    return "Sistem AI SKPTEN sedang diselenggara.";
  }
}

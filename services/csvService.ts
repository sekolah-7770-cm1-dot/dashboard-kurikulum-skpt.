
import { TakwimEvent, ProgramActivity, PBDRecord, HeadcountRecord, TeacherRecord } from '../types';

function parseCsvLine(line: string): string[] {
  const values = [];
  let currentVal = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  values.push(currentVal.trim());
  return values;
}

function extractDriveId(text: string): string | null {
  if (!text) return null;
  const idMatch = text.match(/([-\w]{25,50})/);
  return idMatch ? idMatch[1] : null;
}

const getFreshUrl = (url: string) => `${url}${url.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;

export async function fetchTeachers(url: string): Promise<TeacherRecord[]> {
  try {
    const response = await fetch(getFreshUrl(url));
    if (!response.ok) return [];
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    if (lines.length < 1) return [];

    let headerIdx = -1;
    let indices = { nama: -1, gred: -1, jawatan: -1, opsyen: -1 };

    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const h = parseCsvLine(lines[i]).map(v => v.toUpperCase().trim());
      const nIdx = h.findIndex(v => v.includes('NAMA'));
      if (nIdx !== -1) {
        headerIdx = i;
        indices = {
          nama: nIdx,
          gred: h.findIndex(v => v.includes('GRED')),
          jawatan: h.findIndex(v => v.includes('JAWATAN')),
          opsyen: h.findIndex(v => v.includes('OPSYEN') || v.includes('BIDANG') || v.includes('SUBJEK'))
        };
        break;
      }
    }

    if (headerIdx === -1) return [];

    const teachers: TeacherRecord[] = [];
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length <= indices.nama) continue;
      const nama = (values[indices.nama] || "").trim();
      if (nama && nama !== "NAMA" && isNaN(Number(nama))) {
        teachers.push({
          nama: nama,
          gred: indices.gred !== -1 ? (values[indices.gred] || "N/A") : "N/A",
          jawatan: indices.jawatan !== -1 ? (values[indices.jawatan] || "Guru") : "Guru",
          opsyen: indices.opsyen !== -1 ? (values[indices.opsyen] || "Am") : "Am",
        });
      }
    }
    return teachers;
  } catch (e) {
    return [];
  }
}

export async function fetchFolderImages(url: string): Promise<{url: string, name: string, dateStr?: string}[]> {
  try {
    const response = await fetch(getFreshUrl(url)); 
    if (!response.ok) return [];
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    const images: {url: string, name: string, dateStr?: string}[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length >= 2) {
        const id = extractDriveId(values[0]);
        const name = values[1] || "";
        if (id) {
          images.push({
            url: `https://lh3.googleusercontent.com/d/${id}=s1600`,
            name: name,
            dateStr: values[2] || "" 
          });
        }
      }
    }
    return images;
  } catch (e) { return []; }
}

export async function fetchTakwim(url: string): Promise<TakwimEvent[]> {
  try {
    const response = await fetch(getFreshUrl(url));
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    let headerFound = false;
    let indices = { tarikh: -1, prog: -1, tindakan: -1 };
    const events: TakwimEvent[] = [];
    for (let i = 0; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const h = values.map(v => v.toUpperCase().trim());
      if (!headerFound) {
        const tIdx = h.findIndex(v => v.includes('TARIKH'));
        const pIdx = h.findIndex(v => v.includes('PROGRAM') || v.includes('AKTIVITI'));
        if (pIdx !== -1) { 
          headerFound = true; 
          indices = { 
            tarikh: tIdx, 
            prog: pIdx, 
            tindakan: h.findIndex(v => v.includes('UNIT') || v.includes('TINDAKAN')) 
          }; 
        }
      } else {
        const program = (values[indices.prog] || '').trim();
        const date = parseFlexibleDate(values[indices.tarikh], new Date().getFullYear());
        if (date && program) {
          events.push({ 
            date, 
            program, 
            unit: indices.tindakan !== -1 ? (values[indices.tindakan] || 'UMUM') : 'UMUM', 
            catatan: '' 
          });
        }
      }
    }
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (e) { return []; }
}

function parseFlexibleDate(dateStr: string, currentYear: number): Date | null {
  if (!dateStr) return null;
  const cleanStr = dateStr.trim().replace(/[^\x20-\x7E]/g, '').toLowerCase();
  const separators = ['/', '-', '.'];
  let separator = null;
  for (const s of separators) {
    if (cleanStr.includes(s)) { separator = s; break; }
  }
  if (separator) {
    const parts = cleanStr.split(separator);
    if (parts.length >= 2) {
      let m = parseInt(parts[0], 10);
      let d = parseInt(parts[1], 10);
      let y = parts.length === 3 ? parseInt(parts[2], 10) : currentYear;
      if (!isNaN(m) && !isNaN(d)) {
        if (!isNaN(y) && y < 100) y += 2000;
        const date = new Date(y, m - 1, d);
        return isNaN(date.getTime()) ? null : date;
      }
    }
  }
  return null;
}

export async function fetchPrograms(url: string): Promise<ProgramActivity[]> {
  try {
    const response = await fetch(getFreshUrl(url));
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    let headerIdx = -1;
    let indices = { date: -1, prog: -1, unit: -1, bidang: -1 };
    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const h = parseCsvLine(lines[i]).map(v => v.toUpperCase().trim());
      if (h.some(v => v.includes('TARIKH')) && h.some(v => v.includes('PROGRAM'))) {
        headerIdx = i;
        indices = { 
          date: h.findIndex(v => v.includes('TARIKH')), 
          prog: h.findIndex(v => v.includes('PROGRAM') || v.includes('AKTIVITI')), 
          unit: h.findIndex(v => v.includes('UNIT')), 
          bidang: h.findIndex(v => v.includes('BIDANG')) 
        };
        break;
      }
    }
    if (headerIdx === -1) return [];
    const programs: ProgramActivity[] = [];
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < 2) continue;
      const prog = (values[indices.prog] || '').trim();
      const date = parseFlexibleDate(values[indices.date], new Date().getFullYear());
      if (date && prog) {
        programs.push({ 
          date, 
          program: prog, 
          bidang: indices.bidang !== -1 ? (values[indices.bidang] || 'UMUM') : 'UMUM', 
          unit: indices.unit !== -1 ? (values[indices.unit] || 'UMUM') : 'UMUM', 
          imageUrls: [] 
        });
      }
    }
    return programs;
  } catch (e) { return []; }
}

export async function fetchPBD(url: string): Promise<PBDRecord[]> {
  try {
    const response = await fetch(getFreshUrl(url));
    if (!response.ok) return [];
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    if (lines.length < 1) return [];

    let bestHeaderIdx = -1;
    let bestScore = 0;
    let bestIdx = { subjek: -1, kelas: -1, tp1: -1, tp2: -1, tp3: -1, tp4: -1, tp5: -1, tp6: -1, total: -1 };

    // Imbas 50 baris pertama untuk mencari baris tajuk yang paling lengkap
    for (let i = 0; i < Math.min(lines.length, 50); i++) {
      const h = parseCsvLine(lines[i]).map(v => v.toUpperCase().trim());
      
      const subjekIdx = h.findIndex(v => v.includes('SUBJEK') || v.includes('MATA PELAJARAN') || v.includes('SUBJECT') || v.includes('M/P'));
      const kelasIdx = h.findIndex(v => v.includes('KELAS') || v.includes('TAHUN') || v.includes('CLASS') || v.includes('YEAR'));
      const tp1Idx = h.findIndex(v => v.replace(/\s/g, '').includes('TP1') || v.includes('TAHAP1'));
      const tp2Idx = h.findIndex(v => v.replace(/\s/g, '').includes('TP2') || v.includes('TAHAP2'));
      const tp3Idx = h.findIndex(v => v.replace(/\s/g, '').includes('TP3') || v.includes('TAHAP3'));
      const tp4Idx = h.findIndex(v => v.replace(/\s/g, '').includes('TP4') || v.includes('TAHAP4'));
      const tp5Idx = h.findIndex(v => v.replace(/\s/g, '').includes('TP5') || v.includes('TAHAP5'));
      const tp6Idx = h.findIndex(v => v.replace(/\s/g, '').includes('TP6') || v.includes('TAHAP6'));
      const totalIdx = h.findIndex(v => v.includes('TOTAL') || v.includes('JUMLAH') || v.includes('BIL') || v.includes('MURID'));

      let score = 0;
      if (subjekIdx !== -1) score++;
      if (kelasIdx !== -1) score++;
      if (tp1Idx !== -1) score++;
      if (tp2Idx !== -1) score++;
      if (tp3Idx !== -1) score++;
      if (tp4Idx !== -1) score++;
      if (tp5Idx !== -1) score++;
      if (tp6Idx !== -1) score++;

      if (score > bestScore) {
        bestScore = score;
        bestHeaderIdx = i;
        bestIdx = {
          subjek: subjekIdx,
          kelas: kelasIdx,
          tp1: tp1Idx,
          tp2: tp2Idx,
          tp3: tp3Idx,
          tp4: tp4Idx,
          tp5: tp5Idx,
          tp6: tp6Idx,
          total: totalIdx
        };
      }
    }

    if (bestHeaderIdx === -1 || bestScore < 3) {
      console.warn("PBD: Gagal mencari baris tajuk yang sah.");
      return [];
    }

    const records: PBDRecord[] = [];
    for (let i = bestHeaderIdx + 1; i < lines.length; i++) {
      const v = parseCsvLine(lines[i]);
      if (v.length <= bestIdx.subjek || !v[bestIdx.subjek]) continue;
      
      const subjek = v[bestIdx.subjek].trim();
      // Pastikan bukan baris tajuk yang berulang atau baris jumlah di bawah
      if (subjek && 
          subjek.toUpperCase() !== 'SUBJEK' && 
          subjek.toUpperCase() !== 'MATA PELAJARAN' &&
          subjek.toUpperCase() !== 'JUMLAH' &&
          subjek.toUpperCase() !== 'TOTAL' &&
          isNaN(Number(subjek))) {
        
        const tp1 = bestIdx.tp1 !== -1 ? (parseInt(v[bestIdx.tp1]) || 0) : 0;
        const tp2 = bestIdx.tp2 !== -1 ? (parseInt(v[bestIdx.tp2]) || 0) : 0;
        const tp3 = bestIdx.tp3 !== -1 ? (parseInt(v[bestIdx.tp3]) || 0) : 0;
        const tp4 = bestIdx.tp4 !== -1 ? (parseInt(v[bestIdx.tp4]) || 0) : 0;
        const tp5 = bestIdx.tp5 !== -1 ? (parseInt(v[bestIdx.tp5]) || 0) : 0;
        const tp6 = bestIdx.tp6 !== -1 ? (parseInt(v[bestIdx.tp6]) || 0) : 0;
        
        // Kira jumlah secara manual jika lajur jumlah tidak tepat atau tidak wujud
        const total = tp1 + tp2 + tp3 + tp4 + tp5 + tp6;

        records.push({
          subjek,
          kelas: bestIdx.kelas !== -1 ? (v[bestIdx.kelas] || 'N/A') : 'N/A',
          tp1, tp2, tp3, tp4, tp5, tp6,
          total: total || (bestIdx.total !== -1 ? (parseInt(v[bestIdx.total]) || 0) : 0)
        });
      }
    }
    
    console.log(`PBD: Berjaya memuatkan ${records.length} rekod.`);
    return records;
  } catch (e) { 
    console.error("PBD Fetch Error:", e);
    return []; 
  }
}

export async function fetchHeadcount(url: string): Promise<HeadcountRecord[]> {
  try {
    const response = await fetch(getFreshUrl(url));
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    const records: HeadcountRecord[] = [];
    for (let i = 0; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length >= 4 && values[0] && !values[0].toUpperCase().includes('SUBJEK')) {
        const etr = parseFloat(values[2]) || 0;
        const ar = parseFloat(values[3]) || 0;
        if (etr > 0 || ar > 0) {
          records.push({
            subjek: values[0],
            tov: parseFloat(values[1]) || 0,
            etr: etr,
            ar: ar
          });
        }
      }
    }
    return records;
  } catch (e) { return []; }
}

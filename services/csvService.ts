
import { TakwimEvent, ProgramActivity, PBDRecord, HeadcountRecord } from '../types';

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

export async function fetchFolderImages(url: string): Promise<{url: string, name: string, dateStr?: string}[]> {
  try {
    const response = await fetch(`${url}&t=${new Date().getTime()}`); 
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
  } catch (e) {
    return [];
  }
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

export async function fetchTakwim(url: string): Promise<TakwimEvent[]> {
  try {
    const response = await fetch(url);
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

export async function fetchPrograms(url: string): Promise<ProgramActivity[]> {
  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split(/\r\n|\n/);
    
    const records: PBDRecord[] = [];
    for (let i = 0; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      // Pastikan baris mempunyai data subjek dan nombor-nombor TP
      if (values.length >= 8 && values[0] && !values[0].toUpperCase().includes('SUBJEK')) {
        const tp1 = parseInt(values[2]) || 0;
        const tp2 = parseInt(values[3]) || 0;
        const tp3 = parseInt(values[4]) || 0;
        const tp4 = parseInt(values[5]) || 0;
        const tp5 = parseInt(values[6]) || 0;
        const tp6 = parseInt(values[7]) || 0;
        
        // Hanya masukkan rekod jika ada sekurang-kurangnya 1 TP yang diisi
        if (tp1 + tp2 + tp3 + tp4 + tp5 + tp6 > 0) {
          records.push({
            subjek: values[0],
            kelas: values[1] || 'N/A',
            tp1, tp2, tp3, tp4, tp5, tp6,
            total: parseInt(values[8]) || (tp1+tp2+tp3+tp4+tp5+tp6)
          });
        }
      }
    }
    return records;
  } catch (e) { return []; }
}

export async function fetchHeadcount(url: string): Promise<HeadcountRecord[]> {
  try {
    const response = await fetch(url);
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

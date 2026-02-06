
export interface TakwimEvent {
  date: Date;
  program: string;
  unit: string;
  catatan: string;
}

export interface ProgramActivity {
  date: Date;
  bidang: string;
  unit: string;
  program: string;
  imageUrls: string[]; 
}

export interface TeacherRecord {
  nama: string;
  gred: string;
  jawatan: string;
  opsyen: string;
  email?: string;
}

export interface PanitiaStatus {
  name: string;
  focus: string;
  status: 'Selesai' | 'Dalam Proses' | 'Perlu Tindakan';
}

export interface PBDRecord {
  subjek: string;
  kelas: string;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  tp5: number;
  tp6: number;
  total: number;
}

export interface HeadcountRecord {
  subjek: string;
  tov: number;
  etr: number;
  ar: number;
}

export type DashboardView = 'dashboard' | 'carta' | 'eopr' | 'panitia' | 'takwim' | 'buku' | 'guru';

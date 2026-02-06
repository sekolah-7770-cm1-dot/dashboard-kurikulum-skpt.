
import React from 'react';
import { PanitiaStatus as PanitiaType } from '../types';

const mockStatuses: PanitiaType[] = [
  { name: 'Bahasa Melayu', focus: 'Peningkatan PBD', status: 'Selesai' },
  { name: 'Bahasa Inggeris', focus: 'Literasi HIP', status: 'Dalam Proses' },
  { name: 'Matematik', focus: 'Fokus Sifir', status: 'Selesai' },
  { name: 'Sains', focus: 'Amali Sains', status: 'Perlu Tindakan' },
  { name: 'P. Islam', focus: 'Jawi & Al-Quran', status: 'Dalam Proses' },
];

const PanitiaStatus: React.FC = () => {
  const getStatusColor = (status: PanitiaType['status']) => {
    switch (status) {
      case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Dalam Proses': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Perlu Tindakan': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Status Fokus Panitia</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase text-slate-400 font-bold tracking-widest border-b border-slate-50">
              <th className="py-3 px-2">Panitia</th>
              <th className="py-3 px-2">Fokus Utama</th>
              <th className="py-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockStatuses.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-2 font-bold text-slate-700 text-sm">{p.name}</td>
                <td className="py-4 px-2 text-slate-500 text-sm">{p.focus}</td>
                <td className="py-4 px-2 text-right">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanitiaStatus;

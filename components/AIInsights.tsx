
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateScheduleSummary } from '../services/geminiService';
import { TakwimEvent } from '../types';
import { ICONS } from '../constants';

interface AIInsightsProps {
  events: TakwimEvent[];
  loading: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ events, loading }) => {
  const [insight, setInsight] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [fetching, setFetching] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string>('general');
  const typingTimerRef = useRef<number | null>(null);

  const getAIResponse = useCallback(async (type: string = activeQuery) => {
    if (loading) return;
    
    setFetching(true);
    setActiveQuery(type);
    setDisplayedText('');
    
    try {
      const result = await generateScheduleSummary(events, type);
      setInsight(result);
    } catch (err) {
      setInsight("Sistem AI sedang bersedia. Sila klik semula butang analisis.");
    } finally {
      setFetching(false);
    }
  }, [events, loading, activeQuery]);

  // Efek Animasi Menaip
  useEffect(() => {
    if (!fetching && insight) {
      let i = 0;
      setDisplayedText('');
      
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
      
      typingTimerRef.current = window.setInterval(() => {
        setDisplayedText((prev) => {
          if (i < insight.length) {
            const nextChar = insight.charAt(i);
            i++;
            return prev + nextChar;
          } else {
            if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
            return prev;
          }
        });
      }, 30);
    }
    
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, [insight, fetching]);

  // Trigger awal apabila data sudah sedia
  useEffect(() => {
    if (!loading && events.length > 0 && !insight && !fetching) {
      getAIResponse('general');
    }
  }, [loading, events, insight, fetching, getAIResponse]);

  const chips = [
    { id: 'general', label: 'Analisis Perancangan', icon: '📈' },
    { id: 'busy', label: 'Kepadatan Takwim', icon: '📅' },
    { id: 'focus', label: 'Hala Tuju Unit', icon: '🎯' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-1000"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 shadow-inner group-hover:border-blue-400/50 transition-colors">
               <ICONS.Bot className={`w-8 h-8 ${fetching ? 'animate-bounce text-blue-400' : 'animate-pulse text-white'}`} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Wawasan EduSKPT AI</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Sintesis Takwim Pintar</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => getAIResponse(chip.id)}
                disabled={fetching || loading}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all border uppercase tracking-widest active:scale-95 disabled:opacity-50 ${
                  activeQuery === chip.id 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="mr-2">{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-white/5 min-h-[140px] flex items-center shadow-inner relative overflow-hidden">
          {fetching ? (
            <div className="w-full space-y-4">
              <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-full w-[85%] animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-full w-[60%] animate-pulse"></div>
            </div>
          ) : (
            <div className="relative w-full">
              {displayedText ? (
                <p className="text-blue-50 text-sm md:text-base font-medium leading-relaxed italic pl-2">
                  "{displayedText}"
                  <span className="inline-block w-2 h-5 bg-blue-400 ml-2 animate-pulse align-middle"></span>
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 opacity-40">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sistem Sedia Menjana Wawasan...</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-between items-center opacity-40">
           <p className="text-[9px] font-black uppercase tracking-[0.4em]">Gemini 3 Flash Powered</p>
           <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

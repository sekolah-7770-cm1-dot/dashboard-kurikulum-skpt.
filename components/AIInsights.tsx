
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateScheduleSummary } from '../services/geminiService';
import { TakwimEvent, PBDRecord } from '../types';
import { ICONS } from '../constants';

interface AIInsightsProps {
  events: TakwimEvent[];
  pbdData: PBDRecord[];
  loading: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ events, pbdData, loading }) => {
  const [insight, setInsight] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [fetching, setFetching] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string>('general');
  const typingTimerRef = useRef<number | null>(null);

  const getAIResponse = useCallback(async (type: string = 'general') => {
    setFetching(true);
    setActiveQuery(type);
    setDisplayedText('');
    const result = await generateScheduleSummary(events, pbdData, type);
    setInsight(result.trim());
    setFetching(false);
  }, [events, pbdData]);

  useEffect(() => {
    if (!fetching && insight) {
      let i = 0;
      setDisplayedText('');
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
      
      const textToType = insight;
      typingTimerRef.current = window.setInterval(() => {
        if (i < textToType.length) {
          setDisplayedText((prev) => prev + textToType.charAt(i));
          i++;
        } else {
          if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
        }
      }, 25);
    }
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, [insight, fetching]);

  useEffect(() => {
    if (!loading && (events.length > 0 || pbdData.length > 0) && !insight) {
      getAIResponse();
    }
  }, [events, pbdData, loading, insight, getAIResponse]);

  const chips = [
    { id: 'general', label: 'Analisis Akademik', icon: '📈' },
    { id: 'busy', label: 'Status Takwim', icon: '📅' },
    { id: 'focus', label: 'Strategi Intervensi', icon: '🎯' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
               <ICONS.Bot className={`w-7 h-7 ${fetching ? 'animate-bounce' : 'animate-pulse'}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Wawasan EduSKPT AI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-blue-300">Menterjemah Data File Anda</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => getAIResponse(chip.id)}
                disabled={fetching}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                  activeQuery === chip.id 
                  ? 'bg-blue-600 border-blue-400 text-white' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/5 min-h-[100px]">
          {fetching ? (
            <div className="h-3 bg-white/5 rounded-full w-full animate-pulse"></div>
          ) : (
            <p className="text-blue-50 font-medium leading-relaxed italic pl-2">
              {displayedText}
              <span className="inline-block w-1.5 h-5 bg-blue-400 ml-1 animate-pulse"></span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

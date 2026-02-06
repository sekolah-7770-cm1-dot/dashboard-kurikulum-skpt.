
import React, { useState, useRef, useEffect } from 'react';
import { chatConsultant } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sistem EduSKPT AI diaktifkan. Saya sedia membantu anda dengan konsultasi data kurikulum dan pengurusan akademik SKPTEN melalui integrasi Cgu Din. Apakah input yang anda perlukan?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatConsultant(text, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const quickPrompts = [
    "SOP Kurikulum SKPT",
    "Integrasi PBD & AI",
    "Panduan eRPH Digital",
    "Analisis Data Murid"
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[420px] h-[600px] bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col animate-fade-in origin-bottom-right">
          {/* Futuristic Header */}
          <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50 relative z-10">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-blue-500 rounded-2xl animate-ping opacity-20"></div>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em] text-blue-400">EduSKPT AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-emerald-400/80">Cgu Din Core Intelligence Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-[12px] leading-relaxed shadow-lg ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500' 
                  : 'bg-white/5 text-slate-100 border border-white/10 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Footer Area */}
          <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
              {quickPrompts.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 rounded-xl text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-all active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Masukkan kueri akademik SKPT..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[12px] text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping}
                className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 active:scale-90 transition-all shadow-lg shadow-blue-900/40"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em]">
                System Encryption Active
              </p>
              <p className="text-[8px] text-blue-500 font-black uppercase tracking-[0.3em]">
                Cgu Din Core Intelligence
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-110 active:scale-90 relative group ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600'
        }`}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-[1.5rem] animate-ping opacity-20"></div>
        {isOpen ? (
           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
           </svg>
        ) : (
          <div className="relative">
             <svg className="w-8 h-8 text-white group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-blue-600 rounded-full"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIConsultant;

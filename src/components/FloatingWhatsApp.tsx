import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Clock, ShieldCheck, Database } from 'lucide-react';
import { submitContactMessage } from '../lib/supabase';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  const phoneNumber = '5511983755672';
  const displayPhone = '(11) 983755672';

  const defaultTemplates = [
    'Olá! Gostaria de cotar um frete urgente.',
    'Olá! Preciso de transporte para carga fracionada.',
    'Olá! Gostaria de falar com o atendimento comercial.',
    'Olá! Quero tirar uma dúvida sobre coleta em Itupeva e região.',
  ];

  const handleSend = (text: string) => {
    const message = text || 'Olá! Gostaria de solicitar uma cotação de frete com a Itupeva Log Express.';
    
    // Asynchronously log to Supabase leads
    submitContactMessage({
      name: 'Visitante WhatsApp Web',
      phone: displayPhone,
      email: 'itupevalogexpress8@gmail.com',
      subject: 'Início de Atendimento WhatsApp',
      message: message,
    }).catch(() => {});

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setHasUnread(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Prompt initial gentle attention
      setHasUnread(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* WhatsApp Chat Popover */}
      {isOpen && (
        <div
          id="whatsapp-chat-modal"
          className="mb-4 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#0B2240] p-4 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 z-10">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-emerald-400/40">
                  <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0B2240] rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Itupeva Log Express
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded">Oficial</span>
                </h4>
                <p className="text-xs text-emerald-300 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online agora • Resposta rápida
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 max-h-[360px] overflow-y-auto space-y-3">
            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-100 text-xs text-slate-700 space-y-2">
              <p className="font-medium text-slate-900">
                👋 Olá! Seja bem-vindo à <strong className="text-[#0B2240]">Itupeva Log Express</strong>.
              </p>
              <p className="text-slate-600">
                Estamos prontos para orçar seu frete com agilidade e os melhores prazos para São Paulo e todo o Brasil.
              </p>
              <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Atendimento ágil
                </span>
                <span className="flex items-center gap-1 text-[#0B2240] font-medium">
                  Atendimento oficial
                </span>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
                Selecione uma opção rápida:
              </p>
              {defaultTemplates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(template)}
                  className="w-full text-left text-xs bg-white hover:bg-amber-50/70 hover:border-amber-400 p-2.5 rounded-lg border border-slate-200 text-slate-700 hover:text-[#0B2240] transition-all flex items-center justify-between group shadow-2xs"
                >
                  <span className="line-clamp-1">{template}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all shadow-xs">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(customMsg)}
                  placeholder="Escreva sua mensagem aqui..."
                  className="flex-1 text-xs px-2 py-1 bg-transparent focus:outline-none text-slate-800"
                />
                <button
                  onClick={() => handleSend(customMsg)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-xs"
                  aria-label="Enviar mensagem"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                Central de Atendimento: <span className="font-semibold text-slate-700">{displayPhone}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="relative group">
        {/* Tooltip on hover */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 bg-[#0B2240] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-700">
            <span>Fale no WhatsApp</span>
            <span className="text-amber-400 font-bold">{displayPhone}</span>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-6 border-l-[#0B2240]" />
          </div>
        )}

        <button
          id="btn-floating-whatsapp"
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
          }}
          className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-emerald-400/30"
          aria-label="Falar no WhatsApp oficial da Itupeva Log Express"
        >
          {/* Animated radar rings */}
          <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping -z-10" />

          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-8 h-8 fill-white text-[#25D366]" />
          )}

          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-[#0B2240] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle, 
  ArrowRight, 
  MessageCircle, 
  PhoneCall, 
  Navigation,
  Globe2,
  Sparkles
} from 'lucide-react';
import { QuickQuoteForm } from './QuickQuoteForm';

interface HeroSectionProps {
  onQuoteSubmitted?: (quoteId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuoteSubmitted }) => {
  return (
    <section
      id="inicio"
      className="relative bg-[#081C33] text-white pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden"
    >
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-40" />
        {/* Subtle grid pattern */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(rgba(217, 155, 38, 0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Statement & Badges */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Itupeva Log Express • Hub Logístico Estratégico</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.15] text-white">
                O TRANSPORTE QUE{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 underline decoration-amber-500/40">
                  GIRA O MUNDO.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Soluções completas em transporte rodoviário, cargas fracionadas, lotação dedicada e distribuição expressa com segurança máxima, pontualidade e rastreamento 24h.
              </p>
            </div>

            {/* Quick Benefits Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Frota Diversificada</h4>
                  <p className="text-[11px] text-slate-400">Fiorino, VUC, 3/4, Toco e Truck</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Pontualidade & Agilidade</h4>
                  <p className="text-[11px] text-slate-400">SLA rigoroso em cada entrega</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Telemetria & Gestão</h4>
                  <p className="text-[11px] text-slate-400">Monitoramento contínuo de rotas</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Cobertura Ampla</h4>
                  <p className="text-[11px] text-slate-400">SP, Grande SP, Interior e Brasil</p>
                </div>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/5511983755672?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20r%C3%A1pido%20de%20frete%20com%20a%20Itupeva%20Log%20Express"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chamar no WhatsApp: (11) 983755672</span>
              </a>

              <a
                href="#servicos"
                className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <span>Conhecer Serviços</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
            </div>

            {/* Key Hub Highlight */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Base Operacional:</strong> Itupeva/SP — Acesso direto às Rodovias Anhanguera, Bandeirantes e Dom Gabriel.
              </span>
            </div>
          </div>

          {/* Right Column: Quick Quote Form right in the principal section */}
          <div className="lg:col-span-5" id="cotacao">
            <QuickQuoteForm onQuoteSubmitted={onQuoteSubmitted} />
          </div>

        </div>
      </div>
    </section>
  );
};

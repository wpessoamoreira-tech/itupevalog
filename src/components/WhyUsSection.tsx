import React from 'react';
import { 
  Truck, 
  MapPin, 
  Clock4, 
  Headphones, 
  Award, 
  Radio, 
  CheckCircle,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const differentiators = [
    {
      icon: MapPin,
      title: 'Ponto Estratégico em Itupeva - SP',
      description: 'Sede no coração dos maiores polos logísticos do Brasil, com acesso imediato às Rodovias Anhanguera, Bandeirantes e Dom Gabriel Paulino Bueno Couto.',
      highlight: 'Acesso Rápido às Capitais',
    },
    {
      icon: Truck,
      title: 'Frota Moderna e Equipada',
      description: 'Veículos rigorosamente revisados, preparados para cargas secas, fracionadas, paletizadas e entregas com agilidade máxima.',
      highlight: 'Frota Própria & Ágil',
    },
    {
      icon: Radio,
      title: 'Gerenciamento de Rotas e Telemetria',
      description: 'Acompanhamento detalhado do percurso, comunicação direta com os motoristas e monitoramento constante durante o trajeto.',
      highlight: 'Controle de Rotas',
    },
    {
      icon: Clock4,
      title: 'Compromisso Absoluto com o Prazo',
      description: 'Rotas planejadas com inteligência logística para garantir que sua carga chegue no horário combinado, sem surpresas ou atrasos.',
      highlight: 'SLA Rigoroso',
    },
    {
      icon: Headphones,
      title: 'Atendimento Humanizado e Direto',
      description: 'Aqui você não fala com robôs confusos. Nossos consultores e coordenadores de tráfego atendem você diretamente no WhatsApp e telefone.',
      highlight: 'Suporte Ágil',
    },
    {
      icon: FileCheck2,
      title: 'Conformidade Fiscal & Documental',
      description: 'Emissão ágil de CT-e, MDF-e, averbações eletrônicas instantâneas e canhoto de entrega digitalizado em alta resolução.',
      highlight: 'Agilidade Fiscal',
    },
  ];

  return (
    <section id="diferenciais" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-900 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" /> Por que a Itupeva Log Express?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2240] tracking-tight">
            Eficiência, Velocidade e Confiança em Cada Quilômetro
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Mais do que transportar mercadorias, conectamos sua empresa aos seus clientes com responsabilidade, tecnologia e excelência operacional.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {differentiators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B2240] text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2240] bg-amber-100/70 border border-amber-200/80 px-2.5 py-1 rounded-full">
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0B2240] mb-2 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Numbers Strip */}
        <div className="mt-16 bg-[#0B2240] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Dedicação Operacional</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white">24/7</div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Atendimento & Suporte</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">99.4%</div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Índice de Pontualidade</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white">+500</div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Cidades Atendidas</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

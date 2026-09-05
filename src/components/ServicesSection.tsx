import React from 'react';
import { 
  Package, 
  Truck, 
  Zap, 
  Warehouse, 
  RotateCcw, 
  Factory, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 'fracionada',
      icon: Package,
      badge: 'Alta Economia',
      title: 'Carga Fracionada (LTL)',
      description: 'Ideal para empresas que não completam a capacidade total de um caminhão. Você paga apenas pelo espaço e peso que utiliza, com saídas diárias frequentes.',
      features: [
        'Saídas diárias programadas',
        'Consolidação inteligente de cargas',
        'Rastreamento ponto a ponto',
        'Preços competitivos por m³ e kg',
      ],
      color: 'amber',
    },
    {
      id: 'dedicada',
      icon: Truck,
      badge: 'Exclusividade Total',
      title: 'Carga Dedicada / Fechada (FTL)',
      description: 'Veículo 100% exclusivo para a sua mercadoria. Rota direta da sua empresa até o destino final, sem paradas intermediárias e com velocidade máxima.',
      features: [
        'Veículo e equipe dedicados',
        'Coleta e entrega expressa porta a porta',
        'Ideal para grandes volumes e urgências',
        'Segurança máxima e lacre eletrônico',
      ],
      color: 'blue',
    },
    {
      id: 'expressa',
      icon: Zap,
      badge: 'Mesmo Dia / 24h',
      title: 'Distribuição Expressa Urbana',
      description: 'Entregas ultra-rápidas para centros urbanos, Grande São Paulo, Região Metropolitana de Campinas, Jundiaí e interior paulista.',
      features: [
        'Opções Same Day e Next Day',
        'Frota ágil (VUCs, Vans e Fiorinos)',
        'Circulação livre em zonas restritas',
        'Comprovante digital de entrega imediato',
      ],
      color: 'emerald',
    },
    {
      id: 'armazenagem',
      icon: Warehouse,
      badge: 'Hub Estratégico',
      title: 'Armazenagem & Cross-Docking',
      description: 'Estrutura completa em Itupeva/SP para recepção, armazenagem temporária, separação de pedidos (picking/packing) e despacho imediato.',
      features: [
        'Galpão com segurança 24h e CFTV',
        'Agilidade no transbordo de cargas',
        'Gestão de estoque e paletização',
        'Localização estratégica nas rodovias',
      ],
      color: 'purple',
    },
    {
      id: 'reversa',
      icon: RotateCcw,
      badge: 'Gestão Inteligente',
      title: 'Logística Reversa & Devoluções',
      description: 'Recolhimento ágil de mercadorias, trocas em garantia, materiais promocionais ou produtos com avaria com rastreamento completo.',
      features: [
        'Coleta no cliente ou fornecedor',
        'Triagem e conferência minuciosa',
        'Emissão de relatórios fotográficos',
        'Devolução rápida ao remetente',
      ],
      color: 'indigo',
    },
    {
      id: 'industrial',
      icon: Factory,
      badge: 'B2B Corporativo',
      title: 'Logística Industrial & E-commerce',
      description: 'Abastecimento de linhas de produção, transporte de matéria-prima, produtos acabados e despacho direto para centros de distribuição (CDs).',
      features: [
        'Atendimento com agendamento em CDs',
        'Procedimentos rigorosos de carga e descarga',
        'Apoio fiscal e conferência de notas',
        'Contratos corporativos personalizados',
      ],
      color: 'cyan',
    },
  ];

  return (
    <section id="servicos" className="py-16 sm:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0B2240]/10 text-[#0B2240] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Nossas Soluções em Transporte
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2240] tracking-tight">
            Serviços Especializados para Impulsionar o seu Negócio
          </h2>
          <p className="text-base text-slate-600">
            Da carga fracionada ao frete dedicado de grande porte, a <strong>Itupeva Log Express</strong> entrega tecnologia, segurança e pontualidade sob medida.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#0B2240] text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {srv.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-xl font-bold text-[#0B2240] group-hover:text-amber-600 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <a
                    href={`https://wa.me/5511983755672?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o%20para%20${encodeURIComponent(srv.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#0B2240] hover:text-white bg-slate-100 hover:bg-[#0B2240] py-2.5 px-4 rounded-xl transition-all"
                  >
                    <span>Cotar {srv.title.split('(')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0B2240] to-[#0F2C54] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              Precisa de uma operação logística customizada?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Desenhamos fluxos de coletas e entregas programadas com SLAs exclusivos para sua indústria ou comércio.
            </p>
          </div>
          <a
            href="https://wa.me/5511983755672?text=Ol%C3%A1%21%20Gostaria%20de%20uma%20proposta%20personalizada%20para%20minha%20empresa"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-amber-500 hover:bg-amber-400 text-[#0B2240] font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <span>FALAR COM ESPECIALISTA COMERCIAL</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

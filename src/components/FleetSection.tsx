import React, { useState } from 'react';
import { Truck, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { FleetVehicle } from '../types';

// Authentic fleet images uploaded by the company
import realFiorinoImg from '../assets/images/real_fiorino.jpg';
import realVucImg from '../assets/images/real_vuc.jpg';
import realTruck34Img from '../assets/images/real_truck_3_4.jpg';
import realRodoviarioImg from '../assets/images/real_rodoviario.jpg';

export const FleetSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const fleetList: FleetVehicle[] = [
    {
      id: 'fiorino-van',
      name: 'Fiorino & Utilitários Leves',
      type: 'Urbano & Rápido',
      capacityKg: 650,
      capacityVolM3: 3.5,
      palletCapacity: 1,
      idealFor: [
        'Entregas expressas urgentes',
        'E-commerce e caixas fracionadas',
        'Acesso total a garagens e subsolos',
        'Circulação sem restrição em SP'
      ],
      features: [
        'Frota própria ágil no trânsito',
        'Monitoramento e rastreador 24h',
        'Lacre de segurança nas portas traseiras'
      ],
      imageUrl: realFiorinoImg,
    },
    {
      id: 'vuc',
      name: 'V.U.C. (Veículo Urbano de Carga)',
      type: 'Distribuição Urbana',
      capacityKg: 3000,
      capacityVolM3: 18,
      palletCapacity: 4,
      idealFor: [
        'Centros urbanos com restrição (ZMRC)',
        'Entregas programadas em shoppings',
        'Distribuição fracionada entre lojas',
        'Cargas paletizadas de médio porte'
      ],
      features: [
        'Adequado à legislação da capital e região',
        'Baú fechado de alta resistência',
        'Rastreamento em tempo real via satélite'
      ],
      imageUrl: realVucImg,
    },
    {
      id: 'truck-tres-quartos',
      name: 'Caminhão 3/4',
      type: 'Médio Porte Intermunicipal',
      capacityKg: 5000,
      capacityVolM3: 30,
      palletCapacity: 8,
      idealFor: [
        'Coletas industriais no polo de Itupeva/Jundiaí',
        'Rotas intermunicipais em todo o estado de SP',
        'Cargas paletizadas com peso concentrado',
        'Transferências de insumos fabris'
      ],
      features: [
        'Excelente custo-benefício por tonelada',
        'Baú espaçoso e vedado contra intempéries',
        'Rastreamento híbrido Satélite/GPRS'
      ],
      imageUrl: realTruck34Img,
    },
    {
      id: 'truck-pesado',
      name: 'Caminhão Truck',
      type: 'Pesado Rodoviário',
      capacityKg: 14000,
      capacityVolM3: 55,
      palletCapacity: 16,
      idealFor: [
        'Lotes industriais de grande porte',
        'Linhas diretas dedicadas e consolidadas',
        'Cargas pesadas para o interior e outros estados',
        'Suporte a grandes centros logísticos'
      ],
      features: [
        'Alta capacidade de carga líquida',
        'Equipamento robusto com manutenção preventiva',
        'PGR (Plano de Gerenciamento de Risco) completo'
      ],
      imageUrl: realTruck34Img,
    },
    {
      id: 'carreta-rodoviario',
      name: 'Carreta Rodoviária (Cavalo Mecânico)',
      type: 'Extra Pesado / Rodoviário',
      capacityKg: 28000,
      capacityVolM3: 105,
      palletCapacity: 30,
      idealFor: [
        'Grandes operações fabris e transferências CD-a-CD',
        'Cargas completas fechadas de alto volume',
        'Rotas de longa distância e interestaduais',
        'Grandes volumes paletizados'
      ],
      features: [
        'Máxima capacidade cúbica e tonelagem',
        'Equipamentos rodoviários modernos e seguros',
        'Seguro total de carga (RCTR-C e RCF-DC)'
      ],
      imageUrl: realRodoviarioImg,
    },
  ];

  const categories = [
    { id: 'todos', label: 'Todos os Veículos' },
    { id: 'leves', label: 'Leves & Urbanos' },
    { id: 'pesados', label: 'Médios & Rodoviários' },
  ];

  const filtered = fleetList.filter((item) => {
    if (selectedCategory === 'leves') return item.capacityKg <= 3000;
    if (selectedCategory === 'pesados') return item.capacityKg > 3000;
    return true;
  });

  return (
    <section id="frota" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-900 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Frota Própria Oficial Itupeva Log</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2240] tracking-tight">
              Veículos Prontos para Atender sua Operação
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Fotos reais dos nossos veículos em operação. Frota inspecionada, rastreada 24 horas via satélite e pronta para coletas e entregas ágeis.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B2240] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0B2240]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Type Badge */}
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2240]/80 via-transparent to-black/10" />
                  
                  <span className="absolute top-3 left-3 bg-[#0B2240]/90 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    {vehicle.type}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-bold text-[#0B2240] group-hover:text-amber-600 transition-colors">
                    {vehicle.name}
                  </h3>

                  {/* 3 Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Capacidade</span>
                      <strong className="text-xs font-bold text-[#0B2240]">
                        {vehicle.capacityKg >= 1000 ? `${(vehicle.capacityKg / 1000).toFixed(1)} t` : `${vehicle.capacityKg} kg`}
                      </strong>
                    </div>
                    <div className="border-x border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Volume</span>
                      <strong className="text-xs font-bold text-[#0B2240]">{vehicle.capacityVolM3} m³</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Paletes</span>
                      <strong className="text-xs font-bold text-[#0B2240]">{vehicle.palletCapacity} un</strong>
                    </div>
                  </div>

                  {/* Ideal For */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Recomendado para:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {vehicle.idealFor.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-5 pt-0">
                <a
                  href={`https://wa.me/5511983755672?text=Ol%C3%A1!%20Tenho%20interesse%20em%20cotar%20frete%20com%20o%20ve%C3%ADculo%20${encodeURIComponent(vehicle.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-amber-500 text-slate-800 hover:text-[#0B2240] font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 hover:border-amber-500 transition-all shadow-2xs cursor-pointer"
                >
                  <span>Cotar com este veículo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

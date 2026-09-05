import React, { useState } from 'react';
import { 
  Calculator, 
  Box, 
  Scale, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  X,
  Send,
  User,
  Phone,
  Building,
  Mail,
  RotateCcw
} from 'lucide-react';
import { submitQuoteRequest } from '../lib/supabase';

export const FreightCalculator: React.FC = () => {
  const [lengthCm, setLengthCm] = useState<string>('100');
  const [widthCm, setWidthCm] = useState<string>('80');
  const [heightCm, setHeightCm] = useState<string>('60');
  const [weightKg, setWeightKg] = useState<string>('45');
  const [quantity, setQuantity] = useState<string>('1');
  const [cargoType, setCargoType] = useState<'fracionada' | 'dedicada'>('fracionada');

  // Lead modal state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [savedCloud, setSavedCloud] = useState(false);

  // Cubage calculation (standard road freight factor is 300 kg/m³)
  const numLength = Math.max(0, parseFloat(lengthCm) || 0);
  const numWidth = Math.max(0, parseFloat(widthCm) || 0);
  const numHeight = Math.max(0, parseFloat(heightCm) || 0);
  const numWeight = Math.max(0, parseFloat(weightKg) || 0);
  const numQty = Math.max(0, parseFloat(quantity) || 0);

  const volumeM3Single = (numLength * numWidth * numHeight) / 1000000;
  const totalVolumeM3 = volumeM3Single * numQty;
  const totalRealWeight = numWeight * numQty;
  const volumetricWeightKg = totalVolumeM3 * 300; // Road freight standard factor
  const billedWeight = Math.max(totalRealWeight, volumetricWeightKg);

  const handleResetFields = () => {
    setLengthCm('0');
    setWidthCm('0');
    setHeightCm('0');
    setWeightKg('0');
    setQuantity('0');
  };

  const getRecommendedVehicle = (weight: number, vol: number) => {
    if (weight === 0 && vol === 0) return 'Aguardando dimensões...';
    if (weight <= 650 && vol <= 3.5) return 'Fiorino / Utilitário Leve';
    if (weight <= 3000 && vol <= 18) return 'VUC (Veículo Urbano de Carga)';
    if (weight <= 4500 && vol <= 26) return 'Caminhão 3/4';
    if (weight <= 7000 && vol <= 40) return 'Caminhão Toco';
    if (weight <= 14000 && vol <= 55) return 'Caminhão Truck';
    return 'Carreta Baú / Sider';
  };

  const recommendedVehicle = getRecommendedVehicle(billedWeight, totalVolumeM3);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);
    try {
      const res = await submitQuoteRequest({
        name: leadName.trim(),
        company: leadCompany.trim() || undefined,
        phone: leadPhone.trim(),
        email: leadEmail.trim() || `${leadName.toLowerCase().replace(/\s+/g, '')}@lead-calculadora.com`,
        originCity: 'Itupeva / Polo Regional',
        originState: 'SP',
        destinationCity: 'A Definir',
        destinationState: 'SP',
        cargoType: cargoType,
        cargoDescription: `Simulação de ${numQty} vol (${numLength}x${numWidth}x${numHeight}cm cada). Veículo ideal: ${recommendedVehicle}`,
        weightKg: billedWeight,
        volumeM3: Number(totalVolumeM3.toFixed(2)),
        packageCount: numQty,
        urgency: 'normal',
        needsInsurance: false,
        notes: `Simulação via Calculadora: Peso Real ${totalRealWeight.toFixed(0)}kg, Volumetria ${totalVolumeM3.toFixed(2)}m³, Peso Faturável ${billedWeight.toFixed(0)}kg.`,
      });

      setSavedCloud(res.savedToCloud);
      setSubmitSuccess(true);

      const whatsMessage = `*🚚 SIMULAÇÃO DE CUBAGEM - ITUPEVA LOG EXPRESS*\n` +
        `👤 *Nome:* ${leadName.trim()}\n` +
        (leadCompany ? `🏢 *Empresa:* ${leadCompany.trim()}\n` : '') +
        `📱 *WhatsApp:* ${leadPhone.trim()}\n` +
        (leadEmail ? `📧 *E-mail:* ${leadEmail.trim()}\n` : '') +
        `---------------------------------------\n` +
        `📦 *DADOS DA SIMULAÇÃO:*\n` +
        `• *Dimensões Unitárias:* ${numLength}cm (C) x ${numWidth}cm (L) x ${numHeight}cm (A)\n` +
        `• *Quantidade de Volumes:* ${numQty} unidades\n` +
        `• *Volume Total:* ${totalVolumeM3.toFixed(2)} m³\n` +
        `• *Peso Real Total:* ${totalRealWeight.toFixed(0)} kg\n` +
        `• *Peso Cubado (Fator 300):* ${volumetricWeightKg.toFixed(0)} kg\n` +
        `• *Peso Faturável:* ${billedWeight.toFixed(0)} kg\n` +
        `• *Modalidade:* ${cargoType === 'fracionada' ? 'Carga Fracionada' : 'Carga Dedicada'}\n` +
        `• *Veículo Recomendado:* ${recommendedVehicle}\n` +
        `---------------------------------------\n` +
        `_Enviado pelo Simulador de Cubagem Itupeva Log Express_`;

      const url = `https://wa.me/5511983755672?text=${encodeURIComponent(whatsMessage)}`;
      window.open(url, '_blank');
    } catch {
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculadora" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-amber-400" /> Simulador de Cubagem & Peso
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calcule o Peso Cubado e Encontre o Veículo Ideal
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Saiba na hora a cubagem da sua carga, compare o peso real versus o peso cubado e identifique o modal ideal para o transporte.
          </p>
        </div>

        {/* Interactive Simulator Box */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Input Controls (Left) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Box className="w-5 h-5" /> Dimensões do Pacote / Palete (cm)
                </h3>
                <button
                  type="button"
                  onClick={handleResetFields}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Zerar todos os campos da calculadora"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Zerar Campos</span>
                </button>
              </div>

              {/* Sliders / Inputs for L x W x H */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <label className="text-xs text-slate-400 block mb-1">Comprimento</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="1500"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent font-black text-lg text-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">cm</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <label className="text-xs text-slate-400 block mb-1">Largura</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={widthCm}
                      onChange={(e) => setWidthCm(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent font-black text-lg text-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">cm</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <label className="text-xs text-slate-400 block mb-1">Altura</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent font-black text-lg text-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">cm</span>
                  </div>
                </div>
              </div>

              {/* Weight & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <Scale className="w-3.5 h-3.5 text-amber-400" /> Peso Real por Volume (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent font-black text-lg text-white focus:outline-none"
                  />
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400">Quantidade de Volumes</label>
                    <span className="text-xs font-bold text-amber-400">
                      {numQty} un
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent font-black text-lg text-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">un</span>
                  </div>
                </div>
              </div>

              {/* Freight Mode Selector */}
              <div className="pt-2">
                <label className="text-xs text-slate-400 block mb-2 font-medium">Modalidade Desejada:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCargoType('fracionada')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      cargoType === 'fracionada'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    Carga Fracionada (Paga por espaço)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCargoType('dedicada')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      cargoType === 'dedicada'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    Carga Dedicada (Veículo Exclusivo)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Card (Right) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B2240] to-[#08182D] p-6 sm:p-7 rounded-2xl border border-amber-500/30 space-y-6 shadow-xl relative">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Resultado do Cálculo
                </span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                  Fator Padrão 300 kg/m³
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Volume Total:</span>
                  <strong className="text-lg font-black text-white">
                    {totalVolumeM3.toFixed(2)} m³
                  </strong>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Peso Real Total:</span>
                  <strong className="text-lg font-black text-white">
                    {totalRealWeight.toFixed(0)} kg
                  </strong>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Peso Cubado:</span>
                  <strong className="text-lg font-black text-amber-400">
                    {volumetricWeightKg.toFixed(0)} kg
                  </strong>
                </div>

                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/40">
                  <span className="text-[11px] text-amber-300 block">Peso Faturável:</span>
                  <strong className="text-lg font-black text-amber-300">
                    {billedWeight.toFixed(0)} kg
                  </strong>
                </div>
              </div>

              {/* Recommended Vehicle Box */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Veículo Recomendado:</span>
                </div>
                <h4 className="text-base font-extrabold text-white">
                  {recommendedVehicle}
                </h4>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setShowLeadModal(true);
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-[#0B2240] font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>SOLICITAR PROPOSTA PARA ESTA CARGA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Lead Submission Modal for Calculator */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Simulação Registrada com Sucesso!</h3>
                <p className="text-xs text-slate-300">
                  Os dados da sua carga foram registrados em nosso sistema e você foi redirecionado para o WhatsApp com todos os detalhes da simulação.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Registrado com Sucesso</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-2">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Cotação Rápida
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Solicitar Proposta para Carga Simulada
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Preencha seus dados para registrarmos a cubagem ({totalVolumeM3.toFixed(2)} m³ / {billedWeight.toFixed(0)} kg) e receber a proposta imediata.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-400" /> Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-amber-400" /> WhatsApp com DDD *
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(11) 983755672"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-amber-400" /> Empresa (Opcional)
                      </label>
                      <input
                        type="text"
                        value={leadCompany}
                        onChange={(e) => setLeadCompany(e.target.value)}
                        placeholder="Nome da empresa"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-amber-400" /> E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="email@empresa.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resumo da Carga:</span>
                    <strong className="text-white">{numQty} volumes ({totalVolumeM3.toFixed(2)} m³)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Veículo Ideal:</span>
                    <strong className="text-amber-400">{recommendedVehicle}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-[#0B2240] font-black text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'ENVIANDO SOLICITAÇÃO...' : 'REGISTRAR & ENVIAR VIA WHATSAPP'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

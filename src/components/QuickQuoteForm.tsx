import React, { useState } from 'react';
import { 
  Send, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  Mail, 
  User, 
  Building2, 
  AlertCircle,
  Sparkles,
  Loader2,
  FileText,
  Briefcase,
  Calendar,
  DollarSign,
  Layers,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitQuoteRequest } from '../lib/supabase';
import { QuoteRequest } from '../types';

interface QuickQuoteFormProps {
  onQuoteSubmitted?: (quoteId: string) => void;
  className?: string;
  variant?: 'hero' | 'compact' | 'full';
}

const BRAZILIAN_STATES = [
  'SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'GO', 'DF', 'ES', 'BA', 'PE', 'CE', 'MT', 'MS', 'PA', 'AM', 'RN', 'PB', 'AL', 'SE', 'PI', 'MA', 'TO', 'RO', 'AC', 'AP', 'RR'
];

export const QuickQuoteForm: React.FC<QuickQuoteFormProps> = ({
  onQuoteSubmitted,
  className = '',
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string>('');
  const [cloudSaved, setCloudSaved] = useState(false);
  const [cloudErrorDetails, setCloudErrorDetails] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // Step 1: Route & Cargo
  const [originCity, setOriginCity] = useState('Itupeva');
  const [originState, setOriginState] = useState('SP');
  const [originCep, setOriginCep] = useState('');
  const [originAddress, setOriginAddress] = useState('');

  const [destinationCity, setDestinationCity] = useState('São Paulo');
  const [destinationState, setDestinationState] = useState('SP');
  const [destinationCep, setDestinationCep] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');

  const [cargoType, setCargoType] = useState<QuoteRequest['cargoType']>('fracionada');
  const [cargoDescription, setCargoDescription] = useState('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [volumeM3, setVolumeM3] = useState<string>('');
  const [packageCount, setPackageCount] = useState<string>('');
  const [cargoValue, setCargoValue] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [urgency, setUrgency] = useState<QuoteRequest['urgency']>('normal');

  // Step 2: Requester Personal & Corporate Info
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [document, setDocument] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email' | 'telefone'>('whatsapp');
  const [notes, setNotes] = useState('');

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const formatCep = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 8);
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  };

  const buildWhatsAppMessage = (quoteId: string) => {
    const cargoLabels: Record<string, string> = {
      fracionada: 'Carga Fracionada',
      dedicada: 'Carga Dedicada / Fechada',
      expressa: 'Distribuição Expressa Urbana',
      armazenagem: 'Armazenagem & Logística',
      ecommerce: 'E-commerce & B2B',
      outros: 'Cargas Especiais',
    };

    const urgencyLabels: Record<string, string> = {
      normal: 'Normal / Convencional',
      urgente: 'Urgente / Prioridade Máxima',
      programado: 'Programado / Data Específica',
    };

    const lines = [
      `*🚚 SOLICITAÇÃO DE COTAÇÃO - ITUPEVA LOG EXPRESS*`,
      `📋 *Protocolo:* ${quoteId || 'NOVA'}`,
      `---------------------------------------`,
      `👤 *DADOS DO SOLICITANTE:*`,
      `• *Nome:* ${name}`,
      role ? `• *Cargo / Depto:* ${role}` : '',
      company ? `• *Empresa / Razão Social:* ${company}` : '',
      document ? `• *CPF / CNPJ:* ${document}` : '',
      `• *WhatsApp / Telefone:* ${phone}`,
      `• *E-mail:* ${email}`,
      `• *Canal Preferencial:* ${preferredContact.toUpperCase()}`,
      `---------------------------------------`,
      `📍 *ROTA DO FRETE:*`,
      `• *Origem (Coleta):* ${originCity}/${originState}${originCep ? ` (CEP: ${originCep})` : ''}${originAddress ? ` - ${originAddress}` : ''}`,
      `• *Destino (Entrega):* ${destinationCity}/${destinationState}${destinationCep ? ` (CEP: ${destinationCep})` : ''}${destinationAddress ? ` - ${destinationAddress}` : ''}`,
      `---------------------------------------`,
      `📦 *DADOS DA CARGA:*`,
      `• *Modalidade:* ${cargoLabels[cargoType] || cargoType}`,
      cargoDescription ? `• *Mercadoria:* ${cargoDescription}` : '',
      weightKg ? `• *Peso Informado:* ${weightKg} kg` : '',
      volumeM3 ? `• *Volume Estimado:* ${volumeM3} m³` : '',
      packageCount ? `• *Qtd Volumes / Paletes:* ${packageCount} un` : '',
      cargoValue ? `• *Valor Estimado NF:* R$ ${cargoValue}` : '',
      pickupDate ? `• *Data Prevista de Coleta:* ${new Date(pickupDate + 'T00:00:00').toLocaleDateString('pt-BR')}` : '',
      `• *Nível de Urgência:* ${urgencyLabels[urgency] || urgency}`,
      notes ? `---------------------------------------\n📝 *Observações / Requisitos Especiais:*\n${notes}` : '',
      `---------------------------------------`,
      `_Enviado pelo formulário de cotação oficial Itupeva Log Express_`
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!phone.replace(/\D/g, '') || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Por favor, informe um WhatsApp ou telefone com DDD válido.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido para receber a cotação.');
      return;
    }
    if (!originCity.trim() || !destinationCity.trim()) {
      setErrorMessage('Por favor, informe a cidade de origem e destino.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitQuoteRequest({
        name: name.trim(),
        company: company.trim() || undefined,
        document: document.trim() || undefined,
        role: role.trim() || undefined,
        phone: phone.trim(),
        email: email.trim(),
        preferredContact,
        originCity: originCity.trim(),
        originState,
        originCep: originCep.trim() || undefined,
        originAddress: originAddress.trim() || undefined,
        destinationCity: destinationCity.trim(),
        destinationState,
        destinationCep: destinationCep.trim() || undefined,
        destinationAddress: destinationAddress.trim() || undefined,
        cargoType,
        cargoDescription: cargoDescription.trim() || undefined,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        volumeM3: volumeM3 ? parseFloat(volumeM3) : undefined,
        packageCount: packageCount ? parseInt(packageCount, 10) : undefined,
        cargoValue: cargoValue ? parseFloat(cargoValue.replace(/\D/g, '')) / 100 : undefined,
        pickupDate: pickupDate || undefined,
        urgency,
        needsInsurance: false,
        notes: notes.trim() || undefined,
      });

      setSubmittedQuoteId(result.id);
      setCloudSaved(result.savedToCloud);
      setCloudErrorDetails(result.error || null);
      setIsSuccess(true);

      // Trigger full data forward to official WhatsApp (5511983755672)
      const fullText = buildWhatsAppMessage(result.id);
      const whatsappUrl = `https://wa.me/5511983755672?text=${encodeURIComponent(fullText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Confetti effect
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#D99B26', '#0B2240', '#10B981', '#F59E0B'],
        });
      } catch {
        // Safe fallback
      }

      if (onQuoteSubmitted) {
        onQuoteSubmitted(result.id);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Houve um erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const forwardToWhatsApp = () => {
    const fullText = buildWhatsAppMessage(submittedQuoteId);
    window.open(
      `https://wa.me/5511983755672?text=${encodeURIComponent(fullText)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const resetForm = () => {
    setIsSuccess(false);
    setStep(1);
    setNotes('');
    setWeightKg('');
    setVolumeM3('');
    setCargoDescription('');
    setPackageCount('');
    setCargoValue('');
  };

  return (
    <div
      id="quick-quote-form-wrapper"
      className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative ${className}`}
    >
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#0B2240] via-[#0F2C54] to-[#0B2240] p-4 sm:p-5 text-white flex items-center justify-between border-b border-amber-500/20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Cotação Rápida & Registro Direto
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
              Calcule seu Frete com a Itupeva Log Express
            </h3>
          </div>
        </div>

        {/* Step indicator */}
        {!isSuccess && (
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className={step === 1 ? 'text-amber-400 font-bold' : 'text-slate-300'}>1. Rota & Carga</span>
            <span className="text-slate-400">/</span>
            <span className={step === 2 ? 'text-amber-400 font-bold' : 'text-slate-300'}>2. Seus Dados</span>
          </div>
        )}
      </div>

      {/* Form Content */}
      <div className="p-5 sm:p-7">
        {isSuccess ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-black text-[#0B2240]">
                Cotação Registrada com Sucesso!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Olá <strong>{name}</strong>, recebemos os detalhes do seu frete de <strong>{originCity}/{originState}</strong> para <strong>{destinationCity}/{destinationState}</strong>.
              </p>
            </div>

            {/* Protocol & Database Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200 pb-2">
                <span>Protocolo de Atendimento:</span>
                <span className="font-mono font-bold text-[#0B2240] text-sm bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded">
                  {submittedQuoteId}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Solicitante:</strong> {name} {company ? `(${company})` : ''}</p>
                <p><strong>Contato:</strong> {phone} | {email}</p>
              </div>
              <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-200 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="font-medium">
                  Solicitação registrada com sucesso e encaminhada à equipe operacional.
                </p>
              </div>
            </div>

            {/* Email contact prompt */}
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Você também pode nos enviar notas fiscais ou minutas no e-mail: <strong className="text-[#0B2240]">itupevalogexpress8@gmail.com</strong>
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                type="button"
                onClick={forwardToWhatsApp}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Agilizar Atendimento via WhatsApp</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-3.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Nova Cotação
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: ROUTE & CARGO */
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Route: Origin & Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Origin */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" /> Origem (Coleta) *
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Cidade / UF</span>
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        value={originCity}
                        onChange={(e) => setOriginCity(e.target.value)}
                        placeholder="Ex: Itupeva, Jundiaí, SP"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-medium focus:bg-white focus:border-[#0B2240] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                      />
                      <select
                        value={originState}
                        onChange={(e) => setOriginState(e.target.value)}
                        className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#0B2240]"
                      >
                        {BRAZILIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0B2240]" /> Destino (Entrega) *
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Cidade / UF</span>
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        value={destinationCity}
                        onChange={(e) => setDestinationCity(e.target.value)}
                        placeholder="Ex: Campinas, Rio, Curitiba"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-medium focus:bg-white focus:border-[#0B2240] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
                      />
                      <select
                        value={destinationState}
                        onChange={(e) => setDestinationState(e.target.value)}
                        className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#0B2240]"
                      >
                        {BRAZILIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cargo Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-amber-500" /> Modalidade de Transporte *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'fracionada', label: 'Carga Fracionada', desc: 'Compartilhe espaço' },
                      { id: 'dedicada', label: 'Carga Fechada / Dedicada', desc: 'Veículo exclusivo' },
                      { id: 'expressa', label: 'Distribuição Expressa', desc: 'Urgente / Porta a porta' },
                      { id: 'armazenagem', label: 'Armazenagem', desc: 'Hub Itupeva' },
                      { id: 'ecommerce', label: 'E-commerce B2B', desc: 'Entregas regulares' },
                      { id: 'outros', label: 'Cargas Especiais', desc: 'Outras demandas' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setCargoType(item.id as QuoteRequest['cargoType'])}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          cargoType === item.id
                            ? 'border-amber-500 bg-amber-50/80 text-[#0B2240] font-bold shadow-xs ring-1 ring-amber-400'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                        }`}
                      >
                        <div className="truncate font-semibold">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal truncate">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cargo Specs: Weight, Volume, Description */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Peso aprox. (kg)</label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="Ex: 250"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Volume est. (m³)</label>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={volumeM3}
                      onChange={(e) => setVolumeM3(e.target.value)}
                      placeholder="Ex: 2.5"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Tipo de Mercadoria</label>
                    <input
                      type="text"
                      value={cargoDescription}
                      onChange={(e) => setCargoDescription(e.target.value)}
                      placeholder="Ex: Peças, Eletrônicos..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Advanced cargo inputs toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showAdvancedFields ? 'Ocultar detalhes avançados' : '+ Informar CEPs, valor da nota fiscal e data de coleta'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedFields ? 'rotate-180' : ''}`} />
                  </button>

                  {showAdvancedFields && (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium">CEP de Origem (Coleta)</label>
                        <input
                          type="text"
                          value={originCep}
                          onChange={(e) => setOriginCep(formatCep(e.target.value))}
                          placeholder="13295-000"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B2240]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium">CEP de Destino (Entrega)</label>
                        <input
                          type="text"
                          value={destinationCep}
                          onChange={(e) => setDestinationCep(formatCep(e.target.value))}
                          placeholder="01001-000"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B2240]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-600" /> Valor Estimado da Nota Fiscal (R$)
                        </label>
                        <input
                          type="text"
                          value={cargoValue}
                          onChange={(e) => setCargoValue(e.target.value)}
                          placeholder="Ex: 15.000,00"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B2240]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-600" /> Data Prevista para Coleta
                        </label>
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0B2240]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!originCity.trim() || !destinationCity.trim()) {
                      setErrorMessage('Preencha a cidade de origem e destino para continuar.');
                      return;
                    }
                    setErrorMessage(null);
                    setStep(2);
                  }}
                  className="w-full bg-[#0B2240] hover:bg-[#08182D] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-[#0B2240]/20 hover:shadow-[#0B2240]/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Avançar para Identificação do Solicitante</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
                </button>
              </div>
            ) : (
              /* STEP 2: REQUESTER DETAILS & SUBMISSION */
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Route Summary Badge */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#0B2240]">
                  <div className="flex items-center gap-2 font-semibold">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>{originCity}/{originState} ➔ {destinationCity}/{destinationState}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                  >
                    Editar rota
                  </button>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-500" /> Nome Completo do Solicitante *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Cargo / Departamento
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ex: Compras, Logística, Proprietário"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Company & Document (CPF/CNPJ) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> Empresa / Razão Social (Opcional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex: LogTech Distribuidora Ltda"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> CPF ou CNPJ (Opcional)
                    </label>
                    <input
                      type="text"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      placeholder="Ex: 00.000.000/0001-00"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp / Telefone com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 98375-5672"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-amber-500" /> E-mail Comercial para Proposta *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preferred contact channel */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Canal preferencial de resposta:</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp' },
                      { id: 'email', label: 'E-mail' },
                      { id: 'telefone', label: 'Ligação' },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setPreferredContact(opt.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          preferredContact === opt.id
                            ? 'bg-[#0B2240] text-amber-400 border-[#0B2240]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Observações & Requisitos Especiais</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Horário específico de carga, necessidade de ajudantes, plataforma elevatória..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Envio automático para o WhatsApp da Itupeva Log Express</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Registro Direto</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    id="btn-submit-quote"
                    disabled={isSubmitting}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0B2240] font-black text-sm py-3.5 px-5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#0B2240]" />
                        <span>Armazenando no Banco...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#0B2240]" />
                        <span>SOLICITAR COTAÇÃO & REGISTRAR</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Footer Trust Bar */}
      <div className="bg-slate-100/90 border-t border-slate-200 px-5 py-2.5 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-slate-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Coleta e entrega com máxima agilidade e pontualidade
        </span>
        <span className="text-slate-500">
          Resposta ágil em até <strong className="text-[#0B2240]">15 minutos</strong>
        </span>
      </div>
    </div>
  );
};

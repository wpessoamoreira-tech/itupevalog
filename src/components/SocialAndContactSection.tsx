import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Building, 
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { submitContactMessage } from '../lib/supabase';

export const SocialAndContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Cotação e Fretes');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);

  const socialLinks = {
    instagram: 'https://www.instagram.com/itupevalogexpress?utm_source=qr',
    facebook: 'https://facebook.com/itupevalogexpress',
    youtube: 'https://youtube.com/@itupevalogexpress',
    whatsapp: 'https://wa.me/5511983755672?text=Ol%C3%A1%21%20Gostaria%20de%20falar%20com%20o%20atendimento%20da%20Itupeva%20Log%20Express',
    phone: 'tel:11983755672',
    email: 'mailto:itupevalogexpress8@gmail.com',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) return;

    setIsSending(true);
    try {
      const res = await submitContactMessage({
        name,
        company: company.trim() || undefined,
        email,
        phone,
        subject,
        message,
      });
      setCloudSaved(res.savedToCloud);
      setSentSuccess(true);
    } catch {
      setSentSuccess(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contato" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5 text-amber-400" /> Canais Oficiais de Atendimento
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Conecte-se com a Itupeva Log Express
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Estamos presentes nas principais redes e com atendimento imediato via WhatsApp, Telefone e E-mail.
          </p>
        </div>

        {/* 4 Social & Quick Action Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          {/* Instagram Official Card */}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-social-instagram"
            className="bg-gradient-to-b from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 hover:border-pink-500/70 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">Perfil Oficial</span>
                <h4 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">Instagram</h4>
                <p className="text-xs text-slate-400 mt-1">
                  @itupevalogexpress — Acompanhe nosso dia a dia, frotas e novidades.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300">
              <span>Acessar Instagram</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          {/* WhatsApp Direct Card */}
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-contact-whatsapp"
            className="bg-gradient-to-b from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/70 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Atendimento Ágil</span>
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">WhatsApp Comercial</h4>
                <p className="text-xs text-slate-400 mt-1">
                  (11) 983755672 — Cotações rápidas e suporte direto com nossa equipe.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Iniciar Conversa</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          {/* YouTube Card */}
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-social-youtube"
            className="bg-gradient-to-b from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 hover:border-red-500/70 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">Vídeos & Operações</span>
                <h4 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">Canal YouTube</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Conheça nossa infraestrutura, frota e processos de transporte.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-red-400 group-hover:text-red-300">
              <span>Assistir Vídeos</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

          {/* Facebook Card */}
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-social-facebook"
            className="bg-gradient-to-b from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/70 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">Comunidade & Atualizações</span>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">Facebook</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Página oficial com avaliações, informativos e avisos operacionais.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
              <span>Visitar Página</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>

        </div>

        {/* Contact Info & Email Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Address & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6">
              <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Building className="w-5 h-5" /> Base & Atendimento
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2240] text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Telefone & WhatsApp Comercial:</span>
                    <a
                      href={socialLinks.phone}
                      className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      (11) 983755672
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2240] text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">E-mail para Propostas & SAC:</span>
                    <a
                      href={socialLinks.email}
                      id="btn-direct-email"
                      className="text-sm font-bold text-white hover:text-amber-400 transition-colors break-all"
                    >
                      itupevalogexpress8@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2240] text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Localização Estratégica:</span>
                    <p className="text-sm font-medium text-white">
                      Itupeva - SP • CEP 13295-000
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Próximo ao Polo Industrial e Rodovias Anhanguera, Bandeirantes e Dom Gabriel.
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2240] text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Horário de Operação:</span>
                    <p className="text-sm font-medium text-white">
                      Segunda a Sexta: 07h às 19h | Sábados: 08h às 13h
                    </p>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      • Plantão de cargas urgentes e rastreamento 24h
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Mail Button CTA */}
              <a
                href={socialLinks.email}
                className="w-full bg-[#0B2240] hover:bg-[#071930] text-amber-400 border border-amber-500/40 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>ENVIAR E-MAIL DIRETO</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-white">
                Envie uma Mensagem para Nossa Equipe
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Preencha os campos abaixo e nosso time comercial entrará em contato prontamente.
              </p>
            </div>

            {sentSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white">Mensagem Enviada e Registrada!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Olá <strong>{name}</strong>, recebemos sua mensagem e entraremos em contato no WhatsApp <strong>{phone}</strong> ou e-mail <strong>{email}</strong>.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mensagem recebida pela nossa central de atendimento</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setSentSuccess(false);
                      setMessage('');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer pt-2"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Empresa / Razão Social (Opcional)</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nome da sua empresa"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">WhatsApp / Telefone com DDD *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 983755672"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Seu E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Assunto do Contato</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Cotação de Frete Fracionado">Cotação de Frete Fracionado</option>
                    <option value="Cotação de Carga Fechada / Dedicada">Cotação de Carga Fechada / Dedicada</option>
                    <option value="Armazenagem e Logística Itupeva">Armazenagem e Logística Itupeva</option>
                    <option value="Parcerias e Contratos B2B">Parcerias e Contratos B2B</option>
                    <option value="SAC / Informações Gerais">SAC / Informações Gerais</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Como podemos ajudar? (Mensagem) *</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva sua necessidade de frete, dúvida sobre rotas ou solicitação..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Atendimento Expresso
                  </span>
                  <span>Retorno comercial rápido</span>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-[#0B2240] font-black text-sm py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'ENVIANDO MENSAGEM...' : 'ENVIAR MENSAGEM'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

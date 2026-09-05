import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Truck
} from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = {
    instagram: 'https://www.instagram.com/itupevalogexpress?utm_source=qr',
    facebook: 'https://facebook.com/itupevalogexpress',
    youtube: 'https://youtube.com/@itupevalogexpress',
    whatsapp: 'https://wa.me/5511983755672?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20com%20a%20Itupeva%20Log%20Express',
    phone: 'tel:11983755672',
    email: 'mailto:itupevalogexpress8@gmail.com',
  };

  return (
    <footer className="bg-[#061528] text-slate-400 text-xs border-t border-slate-800 relative overflow-hidden">
      {/* Top Banner */}
      <div className="bg-[#0B2240] py-6 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                Pronto para girar o mundo com sua carga?
              </h4>
              <p className="text-slate-300 text-xs">
                Faça sua cotação agora mesmo e receba o melhor valor de frete para seu frete.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#cotacao"
              className="bg-amber-500 hover:bg-amber-400 text-[#0B2240] font-black px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              COTAR ONLINE
            </a>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>(11) 983755672</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-sm">
              <Logo size="sm" />
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong>Itupeva Log Express:</strong> O transporte que gira o mundo. Especialistas em transporte rodoviário de cargas fracionadas e dedicadas, distribuição urbana e armazenagem com segurança e pontualidade.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center transition-colors"
                aria-label="Instagram da Itupeva Log Express"
                title="Instagram @itupevalogexpress"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                aria-label="Facebook da Itupeva Log Express"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                aria-label="YouTube da Itupeva Log Express"
                title="Canal no YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp da Itupeva Log Express"
                title="WhatsApp (11) 983755672"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={socialLinks.email}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
                aria-label="Email da Itupeva Log Express"
                title="itupevalogexpress8@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Navegação Rápida
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Início', href: '#inicio' },
                { label: 'Cotação Imediata', href: '#cotacao' },
                { label: 'Serviços de Transporte', href: '#servicos' },
                { label: 'Nossa Frota', href: '#frota' },
                { label: 'Simulador de Cubagem', href: '#calculadora' },
                { label: 'Diferenciais de Qualidade', href: '#diferenciais' },
                { label: 'Contato & Redes Sociais', href: '#contato' },
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-500" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services & Coverage */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Modalidades
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300">Cargas Fracionadas (LTL)</li>
              <li className="text-slate-300">Cargas Fechadas / Lotação (FTL)</li>
              <li className="text-slate-300">Distribuição Expressa SP</li>
              <li className="text-slate-300">Armazenagem & Cross-docking</li>
              <li className="text-slate-300">Logística Reversa</li>
              <li className="text-slate-300">E-commerce & Indústrias</li>
            </ul>
          </div>

          {/* Col 4: Contact & Base */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Fale Conosco
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">WhatsApp & Telefone:</span>
                  <a href={socialLinks.phone} className="font-bold text-white hover:text-amber-400">
                    (11) 983755672
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">E-mail Comercial:</span>
                  <a href={socialLinks.email} className="font-bold text-white hover:text-amber-400 break-all">
                    itupevalogexpress8@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Base Operacional:</span>
                  <span className="text-white">Itupeva - SP | CEP 13295-000</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {currentYear} Itupeva Log Express. Todos os direitos reservados. "O Transporte Que Gira O Mundo."</p>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-medium">
              Operação Logística & Fretes
            </span>
            <span>Emissão de CT-e & MDF-e</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

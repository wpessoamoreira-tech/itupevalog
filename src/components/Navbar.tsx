import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Nossa Frota', href: '#frota' },
    { name: 'Simulador', href: '#calculadora' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Contato', href: '#contato' },
  ];

  const socialLinks = {
    instagram: 'https://www.instagram.com/itupevalogexpress?utm_source=qr',
    facebook: 'https://facebook.com/itupevalogexpress',
    youtube: 'https://youtube.com/@itupevalogexpress',
    whatsapp: 'https://wa.me/5511983755672?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20Itupeva%20Log%20Express',
    email: 'mailto:itupevalogexpress8@gmail.com',
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification / Contact Bar */}
      <div className="bg-[#071930] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Contact snippets */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <a
              href={`tel:11983755672`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white">(11) 983755672</span>
            </a>

            <a
              href="mailto:itupevalogexpress8@gmail.com"
              className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>itupevalogexpress8@gmail.com</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Itupeva - SP | Atendimento Nacional</span>
            </div>
          </div>

          {/* Social Icons Bar & Admin trigger */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden lg:inline">Siga-nos:</span>
            
            {/* Instagram */}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-pink-400 transition-colors"
              title="Instagram Oficial: @itupevalogexpress"
              aria-label="Instagram da Itupeva Log Express"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>

            {/* Facebook */}
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-blue-400 transition-colors"
              title="Facebook Oficial"
              aria-label="Facebook da Itupeva Log Express"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>

            {/* YouTube */}
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-red-500 transition-colors"
              title="Canal YouTube Oficial"
              aria-label="YouTube da Itupeva Log Express"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>

            {/* Direct Email */}
            <a
              href={socialLinks.email}
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-colors"
              title="Enviar E-mail"
              aria-label="Email da Itupeva Log Express"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200'
            : 'bg-white py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <Logo size={isScrolled ? 'sm' : 'md'} />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-[#0B2240] hover:border-b-2 hover:border-amber-500 pb-1 transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp: (11) 983755672</span>
            </a>

            <a
              href="#cotacao"
              className="flex items-center gap-2 text-xs font-black text-[#0B2240] bg-amber-500 hover:bg-amber-400 active:bg-amber-600 px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
            >
              <span>COTAR FRETE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs"
              aria-label="WhatsApp rápido"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0B2240] hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0B2240] hover:bg-amber-50 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento WhatsApp: (11) 983755672</span>
              </a>

              <a
                href="#cotacao"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-[#0B2240] font-black py-3 rounded-xl text-xs shadow-md"
              >
                <span>Solicitar Cotação de Frete</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Social buttons in mobile menu */}
              <div className="flex items-center justify-center gap-4 pt-2 text-slate-600">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:text-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:text-red-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href={socialLinks.email}
                  className="p-2 hover:text-amber-600 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Table,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveCustomSupabaseCredentials, 
  clearCustomSupabaseCredentials, 
  fetchAllQuoteRequests, 
  testSupabaseConnection,
  SUPABASE_SQL_HELPER 
} from '../lib/supabase';
import { QuoteRequest } from '../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'config' | 'sql'>('quotes');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [fromCloud, setFromCloud] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testingConn, setTestingConn] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    canRead: boolean;
    canWrite: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const handleRunTest = async () => {
    setTestingConn(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.canRead) {
        loadQuotes();
      }
    } catch (e: any) {
      setTestResult({
        connected: false,
        canRead: false,
        canWrite: false,
        message: e?.message || 'Erro inesperado ao testar conexão',
      });
    } finally {
      setTestingConn(false);
    }
  };

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetchAllQuoteRequests();
      setQuotes(res.quotes);
      setFromCloud(res.fromCloud);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      if (creds) {
        setSupabaseUrl(creds.url);
        setSupabaseKey(creds.key);
      }
      loadQuotes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl && supabaseKey) {
      saveCustomSupabaseCredentials(supabaseUrl, supabaseKey);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadQuotes();
    }
  };

  const handleClearCredentials = () => {
    clearCustomSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseKey('');
    loadQuotes();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_HELPER);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportCsv = () => {
    if (quotes.length === 0) return;
    const headers = [
      'ID Protocolo',
      'Data Criacao',
      'Nome Solicitante',
      'Empresa',
      'Doc/CNPJ',
      'Cargo/Setor',
      'Telefone',
      'E-mail',
      'Canal Preferencial',
      'Origem Cidade/UF',
      'Origem CEP',
      'Origem Endereco',
      'Destino Cidade/UF',
      'Destino CEP',
      'Destino Endereco',
      'Tipo de Carga',
      'Descricao Carga',
      'Peso (kg)',
      'Volume (m3)',
      'Qtd Volumes',
      'Valor Carga (R$)',
      'Data Coleta',
      'Urgencia',
      'Seguro',
      'Observacoes',
    ];

    const rows = quotes.map((q) => [
      q.id,
      new Date(q.createdAt).toLocaleString('pt-BR'),
      `"${q.name.replace(/"/g, '""')}"`,
      `"${(q.company || '').replace(/"/g, '""')}"`,
      `"${(q.document || '').replace(/"/g, '""')}"`,
      `"${(q.role || '').replace(/"/g, '""')}"`,
      `"${q.phone}"`,
      `"${q.email}"`,
      `"${q.preferredContact || 'whatsapp'}"`,
      `"${q.originCity}/${q.originState}"`,
      `"${q.originCep || ''}"`,
      `"${(q.originAddress || '').replace(/"/g, '""')}"`,
      `"${q.destinationCity}/${q.destinationState}"`,
      `"${q.destinationCep || ''}"`,
      `"${(q.destinationAddress || '').replace(/"/g, '""')}"`,
      `"${q.cargoType}"`,
      `"${(q.cargoDescription || '').replace(/"/g, '""')}"`,
      q.weightKg || '',
      q.volumeM3 || '',
      q.packageCount || '',
      q.cargoValue || '',
      q.pickupDate || '',
      q.urgency,
      q.needsInsurance ? 'Sim' : 'Não',
      `"${(q.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cotacoes-itupevalog-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuotes = quotes.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      q.name.toLowerCase().includes(term) ||
      (q.company && q.company.toLowerCase().includes(term)) ||
      (q.document && q.document.toLowerCase().includes(term)) ||
      (q.email && q.email.toLowerCase().includes(term)) ||
      (q.cargoDescription && q.cargoDescription.toLowerCase().includes(term)) ||
      q.phone.includes(term) ||
      q.id.toLowerCase().includes(term) ||
      q.originCity.toLowerCase().includes(term) ||
      q.destinationCity.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0B2240] p-5 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Painel Administrativo & Banco Supabase
              </h3>
              <p className="text-xs text-slate-300">
                Gerencie as solicitações de cotação e a integração com o Supabase.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-white text-[#0B2240] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-[#0B2240]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-amber-600" />
                Cotações Recebidas ({quotes.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-white text-[#0B2240] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-[#0B2240]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                Configurar Supabase
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-white text-[#0B2240] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-[#0B2240]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-600" />
                Script SQL (Tabela)
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <span
              className={`w-2 h-2 rounded-full ${
                fromCloud ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{fromCloud ? 'Conectado ao Supabase' : 'Armazenamento Local Ativo'}</span>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, telefone, cidade ou protocolo..."
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 w-full sm:w-72 focus:outline-none focus:border-[#0B2240]"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadQuotes}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                  </button>

                  <button
                    onClick={handleExportCsv}
                    disabled={quotes.length === 0}
                    className="flex items-center gap-1.5 text-xs bg-[#0B2240] hover:bg-[#071930] text-amber-400 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV (Excel)</span>
                  </button>
                </div>
              </div>

              {/* Quotes List */}
              {filteredQuotes.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-700">Nenhuma cotação encontrada</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    As solicitações preenchidas pelos clientes no formulário principal aparecerão aqui em tempo real.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            {quote.id}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(quote.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/55${quote.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(quote.name)}%2C%20aqui%20%C3%A9%20da%20Itupeva%20Log%20Express%20sobre%20sua%20cota%C3%A7%C3%A3o%20${quote.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>Chamar no WhatsApp</span>
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                        <div className="space-y-1">
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Solicitante</span>
                          <p className="font-bold text-slate-900 text-sm">{quote.name}</p>
                          {quote.company && (
                            <p className="text-slate-700 font-semibold text-[11px]">{quote.company}</p>
                          )}
                          {quote.document && (
                            <p className="text-slate-500 text-[10px]">Doc: {quote.document}</p>
                          )}
                          {quote.role && (
                            <p className="text-slate-500 text-[10px]">Cargo: {quote.role}</p>
                          )}
                          <p className="text-slate-600 text-[11px] pt-1">
                            <span className="font-medium text-slate-800">{quote.phone}</span> • {quote.email}
                          </p>
                          {quote.preferredContact && (
                            <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              Pref: {quote.preferredContact}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Trajeto & Endereços</span>
                          <p className="font-semibold text-[#0B2240] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            {quote.originCity}/{quote.originState} ➔ {quote.destinationCity}/{quote.destinationState}
                          </p>
                          {quote.originCep && (
                            <p className="text-slate-500 text-[10px]">CEP Origem: {quote.originCep}</p>
                          )}
                          {quote.destinationCep && (
                            <p className="text-slate-500 text-[10px]">CEP Destino: {quote.destinationCep}</p>
                          )}
                          <p className="text-slate-600 text-[11px] capitalize pt-1">
                            Modal: <strong className="text-[#0B2240]">{quote.cargoType}</strong>
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Carga & Condições</span>
                          {quote.cargoDescription && (
                            <p className="font-medium text-slate-800 text-[11px]">"{quote.cargoDescription}"</p>
                          )}
                          <p className="text-slate-700 text-[11px]">
                            {quote.weightKg ? `Peso: ${quote.weightKg} kg` : 'Peso: a combinar'}
                            {quote.volumeM3 ? ` | Vol: ${quote.volumeM3} m³` : ''}
                            {quote.packageCount ? ` | Qtd: ${quote.packageCount} un` : ''}
                          </p>
                          {quote.cargoValue && (
                            <p className="text-emerald-700 font-semibold text-[11px]">
                              Valor NF: R$ {quote.cargoValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                          {quote.pickupDate && (
                            <p className="text-amber-800 text-[10px]">
                              Coleta: {new Date(quote.pickupDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          {quote.notes && (
                            <p className="text-slate-600 italic text-[11px] mt-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                              "{quote.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-base font-bold text-[#0B2240]">
                  Conectar ao seu Projeto Supabase
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Insira o <strong>Project URL</strong> e a <strong>anon public API key</strong> do seu painel Supabase (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-amber-600 underline font-semibold">supabase.com</a>) para salvar todas as cotações diretamente na sua nuvem.
                </p>
              </div>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Credenciais do Supabase salvas e conectadas com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Project URL (SUPABASE_URL)</label>
                  <input
                    type="url"
                    required
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Anon Public Key (SUPABASE_ANON_KEY)</label>
                  <input
                    type="text"
                    required
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0B2240] focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="bg-[#0B2240] hover:bg-[#071930] text-amber-400 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Salvar e Conectar
                  </button>

                  <button
                    type="button"
                    onClick={handleRunTest}
                    disabled={testingConn}
                    className="bg-amber-500 hover:bg-amber-400 text-[#0B2240] font-black text-xs py-3 px-4 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingConn ? 'animate-spin' : ''}`} />
                    <span>{testingConn ? 'Testando Conexão...' : 'Testar Conexão (Gravação e Leitura)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearCredentials}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    Restaurar Padrão
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      testResult.canWrite && testResult.canRead
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {testResult.canWrite && testResult.canRead ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                    {testResult.details && (
                      <p className="text-[11px] text-slate-600 font-mono bg-white/60 p-2 rounded border border-slate-200">
                        {testResult.details}
                      </p>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0B2240]">
                    Estrutura da Tabela no Supabase
                  </h4>
                  <p className="text-xs text-slate-600">
                    Copie e execute no <strong>SQL Editor</strong> do seu Supabase para criar a tabela com permissões RLS.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="bg-amber-500 hover:bg-amber-400 text-[#0B2240] font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-900 text-amber-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 max-h-72">
                {SUPABASE_SQL_HELPER.trim()}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

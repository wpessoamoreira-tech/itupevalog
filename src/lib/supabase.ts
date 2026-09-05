import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QuoteRequest } from '../types';

const STORAGE_KEY_CONFIG = 'itupeva_supabase_custom_config';
const STORAGE_KEY_QUOTES = 'itupeva_stored_quotes';

// Default Supabase project credentials for Itupeva Log Express
export const DEFAULT_SUPABASE_URL = 'https://amfkyizzcjgrcnrbdqba.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZmt5aXp6Y2pncmNucmJkcWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDU0NDYsImV4cCI6MjEwMzE4MTQ0Nn0.Ivnxem7P9A0UcRiWCfpg2_A5qLWuClTECoXByOF2LAI';

// Retrieve configuration from env or local override, fallback to configured project
export function getSupabaseCredentials() {
  const customConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (customConfig) {
    try {
      const parsed = JSON.parse(customConfig);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key, isCustom: true };
      }
    } catch {
      // Ignore parse error
    }
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && envUrl !== 'https://your-project.supabase.co') {
    return { url: envUrl, key: envKey, isCustom: false };
  }

  // Fallback to active project credentials provided
  return {
    url: DEFAULT_SUPABASE_URL,
    key: DEFAULT_SUPABASE_KEY,
    isCustom: false,
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds) return null;

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(creds.url, creds.key);
    }
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to init Supabase client:', err);
    return null;
  }
}

export function saveCustomSupabaseCredentials(url: string, key: string) {
  if (url && key) {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({ url: url.trim(), key: key.trim() }));
    supabaseInstance = createClient(url.trim(), key.trim());
    return true;
  }
  return false;
}

export function clearCustomSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  supabaseInstance = null;
}

// Local storage fallback / cache
export function getLocalQuotes(): QuoteRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUOTES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalQuote(quote: QuoteRequest) {
  try {
    const existing = getLocalQuotes();
    const updated = [quote, ...existing.filter(q => q.id !== quote.id)];
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving quote locally:', err);
  }
}

/**
 * Sanitizes an object by removing NaN or undefined and converting empty strings to null for date/number fields
 */
function sanitizePayload(raw: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (val === undefined || val === '') {
      clean[key] = null;
    } else if (typeof val === 'number') {
      clean[key] = isNaN(val) ? null : val;
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Tests connection to Supabase and reports if table 'cotacoes' is accessible for read and write
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  canRead: boolean;
  canWrite: boolean;
  message: string;
  details?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      canRead: false,
      canWrite: false,
      message: 'Cliente Supabase não inicializado. Verifique a URL e a Chave pública.',
    };
  }

  try {
    // 1. Test Read
    const { data: readData, error: readError } = await client
      .from('cotacoes')
      .select('id')
      .limit(1);

    if (readError) {
      return {
        connected: true,
        canRead: false,
        canWrite: false,
        message: `Erro ao ler tabela 'cotacoes': ${readError.message}`,
        details: readError.details || readError.hint || readError.code,
      };
    }

    // 2. Test Write (Probe record that we then remove or mark as test)
    const probeId = 'TEST-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const { error: writeError } = await client.from('cotacoes').insert([
      {
        id: probeId,
        nome: 'Teste Conexão Sistema',
        telefone: '11999999999',
        email: 'teste@conexao.com',
        origem_cidade: 'Itupeva',
        origem_estado: 'SP',
        destino_cidade: 'São Paulo',
        destino_estado: 'SP',
        tipo_carga: 'fracionada',
        urgencia: 'normal',
        seguro: true,
        observacoes: '[PROBE TESTE DE CONEXÃO]',
        status: 'pendente',
      },
    ]);

    if (writeError) {
      return {
        connected: true,
        canRead: true,
        canWrite: false,
        message: `Leitura OK, mas gravação bloqueada por RLS ou coluna: ${writeError.message}`,
        details: writeError.details || writeError.hint || writeError.code,
      };
    }

    // Clean up probe record if possible
    await client.from('cotacoes').delete().eq('id', probeId);

    return {
      connected: true,
      canRead: true,
      canWrite: true,
      message: 'Conexão, leitura e gravação no Supabase 100% operacionais!',
    };
  } catch (err: any) {
    return {
      connected: false,
      canRead: false,
      canWrite: false,
      message: err?.message || 'Falha ao conectar com o Supabase',
    };
  }
}

/**
 * Submits a quote request to Supabase and saves locally
 */
export async function submitQuoteRequest(
  data: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; id: string; savedToCloud: boolean; error?: string }> {
  const quoteId = 'COT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const newQuote: QuoteRequest = {
    ...data,
    id: quoteId,
    createdAt: new Date().toISOString(),
    status: 'pendente',
  };

  // Always save to local cache
  saveLocalQuote(newQuote);

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: true,
      id: quoteId,
      savedToCloud: false,
      error: 'Supabase não configurado. Salvo no armazenamento local e pronto para envio via WhatsApp.',
    };
  }

  const fullPayload = sanitizePayload({
    id: newQuote.id,
    nome: newQuote.name?.trim(),
    empresa: newQuote.company?.trim() || null,
    documento: newQuote.document?.trim() || null,
    cargo_funcao: newQuote.role?.trim() || null,
    telefone: newQuote.phone?.trim(),
    email: newQuote.email?.trim(),
    contato_preferencial: newQuote.preferredContact || 'whatsapp',
    origem_cidade: newQuote.originCity?.trim(),
    origem_estado: newQuote.originState?.trim(),
    origem_cep: newQuote.originCep?.trim() || null,
    origem_endereco: newQuote.originAddress?.trim() || null,
    destino_cidade: newQuote.destinationCity?.trim(),
    destino_estado: newQuote.destinationState?.trim(),
    destino_cep: newQuote.destinationCep?.trim() || null,
    destino_endereco: newQuote.destinationAddress?.trim() || null,
    tipo_carga: newQuote.cargoType,
    descricao_carga: newQuote.cargoDescription?.trim() || null,
    peso_kg: typeof newQuote.weightKg === 'number' && !isNaN(newQuote.weightKg) ? newQuote.weightKg : null,
    volume_m3: typeof newQuote.volumeM3 === 'number' && !isNaN(newQuote.volumeM3) ? newQuote.volumeM3 : null,
    quantidade_volumes: typeof newQuote.packageCount === 'number' && !isNaN(newQuote.packageCount) ? newQuote.packageCount : null,
    valor_carga: typeof newQuote.cargoValue === 'number' && !isNaN(newQuote.cargoValue) ? newQuote.cargoValue : null,
    data_coleta: newQuote.pickupDate && newQuote.pickupDate.trim() !== '' ? newQuote.pickupDate.trim() : null,
    urgencia: newQuote.urgency || 'normal',
    seguro: Boolean(newQuote.needsInsurance),
    observacoes: newQuote.notes?.trim() || null,
    status: newQuote.status || 'pendente',
    created_at: newQuote.createdAt,
  });

  try {
    const { error } = await client.from('cotacoes').insert([fullPayload]);

    if (error) {
      console.warn('Supabase full payload insert error:', error.message, error.details);

      // Fallback: If some columns don't exist yet in the database, retry with essential columns
      const minimalPayload = sanitizePayload({
        id: newQuote.id,
        nome: newQuote.name?.trim(),
        empresa: newQuote.company?.trim() || null,
        telefone: newQuote.phone?.trim(),
        email: newQuote.email?.trim(),
        origem_cidade: newQuote.originCity?.trim(),
        origem_estado: newQuote.originState?.trim(),
        destino_cidade: newQuote.destinationCity?.trim(),
        destino_estado: newQuote.destinationState?.trim(),
        tipo_carga: newQuote.cargoType,
        peso_kg: typeof newQuote.weightKg === 'number' && !isNaN(newQuote.weightKg) ? newQuote.weightKg : null,
        volume_m3: typeof newQuote.volumeM3 === 'number' && !isNaN(newQuote.volumeM3) ? newQuote.volumeM3 : null,
        urgencia: newQuote.urgency || 'normal',
        seguro: Boolean(newQuote.needsInsurance),
        observacoes: newQuote.notes?.trim() || null,
        created_at: newQuote.createdAt,
      });

      const { error: retryError } = await client.from('cotacoes').insert([minimalPayload]);

      if (retryError) {
        console.error('Supabase retry error:', retryError.message);
        return {
          success: true,
          id: quoteId,
          savedToCloud: false,
          error: `${error.message}. Execute o script SQL de atualização de colunas no Supabase.`,
        };
      }

      return {
        success: true,
        id: quoteId,
        savedToCloud: true,
      };
    }

    return {
      success: true,
      id: quoteId,
      savedToCloud: true,
    };
  } catch (err: any) {
    console.error('Supabase exception:', err);
    return {
      success: true,
      id: quoteId,
      savedToCloud: false,
      error: err?.message || 'Erro de conexão com Supabase',
    };
  }
}

/**
 * Fetches all quote requests from Supabase or LocalStorage
 */
export async function fetchAllQuoteRequests(): Promise<{ quotes: QuoteRequest[]; fromCloud: boolean }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('cotacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: QuoteRequest[] = data.map(item => ({
          id: item.id || item.id_cotacao,
          name: item.nome || item.name,
          company: item.empresa || item.company,
          document: item.documento || item.document,
          role: item.cargo_funcao || item.role,
          phone: item.telefone || item.phone,
          email: item.email,
          preferredContact: item.contato_preferencial || item.preferredContact || 'whatsapp',
          originCity: item.origem_cidade || item.originCity,
          originState: item.origem_estado || item.originState,
          originCep: item.origem_cep || item.originCep,
          originAddress: item.origem_endereco || item.originAddress,
          destinationCity: item.destino_cidade || item.destinationCity,
          destinationState: item.destino_estado || item.destinationState,
          destinationCep: item.destino_cep || item.destinationCep,
          destinationAddress: item.destino_endereco || item.destinationAddress,
          cargoType: item.tipo_carga || item.cargoType || 'fracionada',
          cargoDescription: item.descricao_carga || item.cargoDescription,
          weightKg: item.peso_kg || item.weightKg,
          volumeM3: item.volume_m3 || item.volumeM3,
          packageCount: item.quantidade_volumes || item.packageCount,
          cargoValue: item.valor_carga || item.cargoValue,
          pickupDate: item.data_coleta || item.pickupDate,
          urgency: item.urgencia || item.urgency || 'normal',
          needsInsurance: item.seguro ?? item.needsInsurance ?? true,
          notes: item.observacoes || item.notes,
          createdAt: item.created_at || item.createdAt || new Date().toISOString(),
          status: item.status || 'pendente',
        }));
        return { quotes: mapped, fromCloud: true };
      }
    } catch (e) {
      console.warn('Could not fetch from Supabase, returning local quotes:', e);
    }
  }

  return { quotes: getLocalQuotes(), fromCloud: false };
}

export const SUPABASE_SQL_HELPER = `
-- Execute este script no SQL Editor do seu Supabase Dashboard:

-- 1. TABELA PRINCIPAL DE COTAÇÕES E LEADS
CREATE TABLE IF NOT EXISTS cotacoes (
  id TEXT PRIMARY KEY,
  -- Dados do Solicitante
  nome TEXT NOT NULL,
  empresa TEXT,
  documento TEXT,
  cargo_funcao TEXT,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  contato_preferencial TEXT DEFAULT 'whatsapp',

  -- Rota e Endereço
  origem_cidade TEXT NOT NULL,
  origem_estado TEXT NOT NULL,
  origem_cep TEXT,
  origem_endereco TEXT,
  destino_cidade TEXT NOT NULL,
  destino_estado TEXT NOT NULL,
  destino_cep TEXT,
  destino_endereco TEXT,

  -- Dados da Carga
  tipo_carga TEXT NOT NULL,
  descricao_carga TEXT,
  peso_kg NUMERIC,
  volume_m3 NUMERIC,
  quantidade_volumes INTEGER,
  valor_carga NUMERIC,
  data_coleta DATE,

  -- Condições
  urgencia TEXT DEFAULT 'normal',
  seguro BOOLEAN DEFAULT true,
  observacoes TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existir em seu projeto, execute os comandos abaixo para adicionar as novas colunas:
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS documento TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS cargo_funcao TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS contato_preferencial TEXT DEFAULT 'whatsapp';
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS origem_cep TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS origem_endereco TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS destino_cep TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS destino_endereco TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS descricao_carga TEXT;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS quantidade_volumes INTEGER;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS data_coleta DATE;
ALTER TABLE cotacoes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente';

-- Habilitar RLS para cotacoes
ALTER TABLE cotacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserções públicas de cotações" ON cotacoes;
CREATE POLICY "Permitir inserções públicas de cotações" 
ON cotacoes FOR INSERT 
TO anon 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública ou autenticada" ON cotacoes;
DROP POLICY IF EXISTS "Permitir leitura de cotações" ON cotacoes;
CREATE POLICY "Permitir leitura de cotações" 
ON cotacoes FOR SELECT 
TO anon 
USING (true);

-- 2. TABELA DE MENSAGENS E CONTATOS DIRETOS
CREATE TABLE IF NOT EXISTS mensagens_contato (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  empresa TEXT,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  assunto TEXT,
  mensagem TEXT NOT NULL,
  status TEXT DEFAULT 'novo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mensagens_contato ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir envio de mensagens de contato" ON mensagens_contato;
CREATE POLICY "Permitir envio de mensagens de contato"
ON mensagens_contato FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de mensagens de contato" ON mensagens_contato;
CREATE POLICY "Permitir leitura de mensagens de contato"
ON mensagens_contato FOR SELECT
TO anon
USING (true);
`;

const STORAGE_KEY_MESSAGES = 'itupeva_stored_messages';

export function getLocalMessages(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalMessage(msg: any) {
  try {
    const existing = getLocalMessages();
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify([msg, ...existing]));
  } catch (e) {
    console.error('Error saving local message:', e);
  }
}

/**
 * Submits a contact inquiry to Supabase (and duplicates into cotacoes as lead if needed)
 */
export async function submitContactMessage(data: {
  name: string;
  company?: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; id: string; savedToCloud: boolean; error?: string }> {
  const msgId = 'MSG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const newMsg = {
    id: msgId,
    nome: data.name.trim(),
    empresa: data.company?.trim() || null,
    telefone: data.phone.trim(),
    email: data.email.trim(),
    assunto: data.subject?.trim() || 'Contato Geral via Site',
    mensagem: data.message.trim(),
    status: 'novo',
    created_at: new Date().toISOString(),
  };

  saveLocalMessage(newMsg);

  // Also log into quote/leads list so everything appears in the centralized administrative panel
  await submitQuoteRequest({
    name: data.name,
    company: data.company,
    phone: data.phone,
    email: data.email,
    preferredContact: 'whatsapp',
    originCity: 'Contato / Mensagem',
    originState: 'SP',
    destinationCity: 'Itupeva / Central',
    destinationState: 'SP',
    cargoType: 'outros',
    urgency: 'normal',
    needsInsurance: false,
    notes: `[MENSAGEM DE CONTATO - ${data.subject || 'Geral'}]: ${data.message}`,
  });

  const client = getSupabaseClient();
  if (!client) {
    return { success: true, id: msgId, savedToCloud: false };
  }

  try {
    const { error } = await client.from('mensagens_contato').insert([newMsg]);
    if (error) {
      console.warn('Supabase mensagens_contato notice:', error.message);
      return { success: true, id: msgId, savedToCloud: false, error: error.message };
    }
    return { success: true, id: msgId, savedToCloud: true };
  } catch (err: any) {
    return { success: true, id: msgId, savedToCloud: false, error: err?.message };
  }
}

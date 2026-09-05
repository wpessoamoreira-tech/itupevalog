export interface QuoteRequest {
  id: string;
  // Requester Identification
  name: string;
  company?: string;
  document?: string; // CPF or CNPJ
  role?: string; // e.g. Gerente de Compras, Logística, Autônomo
  phone: string;
  email: string;
  preferredContact?: 'whatsapp' | 'email' | 'telefone';

  // Origin Location
  originCity: string;
  originState: string;
  originCep?: string;
  originAddress?: string;

  // Destination Location
  destinationCity: string;
  destinationState: string;
  destinationCep?: string;
  destinationAddress?: string;

  // Cargo Information
  cargoType: 'fracionada' | 'dedicada' | 'expressa' | 'armazenagem' | 'ecommerce' | 'outros';
  cargoDescription?: string;
  weightKg?: number;
  volumeM3?: number;
  packageCount?: number;
  cargoValue?: number;
  pickupDate?: string;

  // Conditions & Metadata
  urgency: 'normal' | 'urgente' | 'programado';
  needsInsurance: boolean;
  notes?: string;
  createdAt: string;
  status: 'pendente' | 'em_analise' | 'respondido' | 'fechado';
  source?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'novo' | 'lido' | 'respondido';
}

export interface TrackingResult {
  code: string;
  invoiceNumber: string;
  recipient: string;
  origin: string;
  destination: string;
  currentStatus: string;
  statusType: 'in_transit' | 'delivered' | 'processing' | 'dispatched';
  estimatedDelivery: string;
  timeline: {
    title: string;
    date: string;
    location: string;
    completed: boolean;
    description: string;
  }[];
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  capacityKg: number;
  capacityVolM3: number;
  palletCapacity: number;
  idealFor: string[];
  features: string[];
  imageUrl: string;
}

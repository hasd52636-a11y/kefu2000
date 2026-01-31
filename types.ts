
export interface KBDocument {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'txt';
  uploadDate: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  description: string;
  category: string;
  status: 'active' | 'draft';
  updatedAt: string;
  qrCode: string;
  documents: KBDocument[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'audio';
  imageUrl?: string;
}

export interface StatsData {
  name: string;
  visits: number;
  queries: number;
}

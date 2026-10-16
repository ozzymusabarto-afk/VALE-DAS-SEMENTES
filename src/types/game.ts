export type Season = 'Primavera' | 'Verão' | 'Outono' | 'Inverno';

export type LocationId =
  | 'market'
  | 'workshop'
  | 'house'
  | 'silo'
  | 'field'
  | 'bridge'
  | 'woods';

export type GameStage = 
  | 'welcome'              // Tela inicial
  | 'map_overview'         // Mapa do Vale livre para explorar
  | 'location_scene'       // Cena interativa do local escolhido (Ponte, Mercado, Oficina, etc.)
  | 'bridge_inspection'    // Compatibilidade direta para a cena da Ponte
  | 'narrative_card'       // Apresentação da carta narrativa viva
  | 'prediction'           // Momento de pausa e reflexão prévia
  | 'seed_allocation'      // Distribuição das sementes (Agora / Proteção / Depois)
  | 'confirmation'         // Resumo gentil antes de avançar
  | 'season_transition'    // Passagem da estação com a tempestade interativa
  | 'consequence'          // Explicação clara e sem julgamento com mudanças no mundo
  | 'journal'              // Diário de Bordo para registrar reflexões
  | 'transfer_challenge'   // Situação 2 para transferir e fixar o raciocínio
  | 'stage_completed';     // Encerramento da rodada com aprendizado

export interface SeedAllocation {
  now: number;         // Agora (Necessidades básicas e pequenos prazeres)
  protection: number;  // Proteção (O Silo / Reserva para imprevistos)
  future: number;      // Depois (Metas para o futuro / Projeto comunitário)
}

export interface JournalEntry {
  predictionText: string;
  predictionReason: string;
  selectedCards: string[];
  allocation: SeedAllocation;
  outcomeReflection: string;
  feeling: string;
  drawingDataUrl?: string;
  timestamp: string;
}

export interface ValleyLocation {
  id: 'house' | 'field' | 'market' | 'silo' | 'workshop' | 'square' | 'woods';
  name: string;
  title: string;
  roleDescription: string;
  iconName: string;
  badge?: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoNarrate: boolean;
  reducedMotion: boolean;
}

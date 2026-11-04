export interface PlayerStats {
  health: number;
  satiety: number;
  warmth: number;
  sobriety: number;
  hygiene: number;
  authority: number;
  morale: number;
  money: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  tags: string[];
  warmth?: number;
  food?: number;
  medicine?: number;
  value?: number;
  condition: number; // 0-100
}

export interface Choice {
  text: string;
  requirements?: {
    item?: string;
    itemTag?: string;
    authorityMin?: number;
    moraleMin?: number;
    sobrietyMax?: number;
  };
  outcomes: {
    successChance: number;
    success: { text: string; stats?: Partial<PlayerStats>; items?: InventoryItem[]; removeItems?: string[] };
    fail: { text: string; stats?: Partial<PlayerStats>; items?: InventoryItem[]; removeItems?: string[] };
  };
}

export interface Scenario {
  id: string;
  category: string;
  title: string;
  triggerConditions: {
    locations?: string[];
    seasons?: string[];
    healthMax?: number;
    healthMin?: number;
    hygieneMin?: number;
    hygieneMax?: number;
    warmthMin?: number;
    warmthMax?: number;
    satietyMax?: number;
    sobrietyMax?: number;
    sobrietyMin?: number;
    moraleMax?: number;
    moraleMin?: number;
    authorityMin?: number;
    timeOfDay?: string[];
  };
  description: string;
  choices: Choice[];
}

export interface GameLog {
  text: string;
  type: 'narrative' | 'success' | 'fail' | 'info' | 'death' | 'system';
  timestamp: number;
}

export interface GameState {
  player: PlayerStats;
  inventory: InventoryItem[];
  maxWeight: number;
  currentLocation: string;
  time: { day: number; hour: number; season: string };
  weather: string;
  temperature: number;
  logs: GameLog[];
  isAlive: boolean;
  isGameOver: boolean;
  gameOverReason: string;
  daysAlive: number;
  currentScenario: Scenario | null;
  flags: Record<string, boolean>;
  money: number;
}

export type Location = {
  id: string;
  name: string;
  description: string;
  icon: string;
  warmthBonus: number;
  dangerLevel: number;
};

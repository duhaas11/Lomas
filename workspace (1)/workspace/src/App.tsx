import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameLog, Scenario, Choice, InventoryItem, PlayerStats } from './types';
import { LOCATIONS, SCENARIOS, SEASONS, WEATHER_TYPES } from './gameData';

const INITIAL_STATE: GameState = {
  player: { health: 80, satiety: 60, warmth: 70, sobriety: 80, hygiene: 40, authority: 10, morale: 50, money: 0 },
  inventory: [
    { id: 'old_jacket', name: 'Старая куртка', weight: 2, tags: ['warmth', 'clothing'], warmth: 10, condition: 50 },
    { id: 'bottle', name: 'Пустая бутылка', weight: 0.5, tags: ['valuable'], value: 10, condition: 100 },
  ],
  maxWeight: 25,
  currentLocation: 'station',
  time: { day: 1, hour: 8, season: 'Осень' },
  weather: 'Облачно',
  temperature: 5,
  logs: [{ text: 'Ты просыпаешься на холодной скамейке вокзала. Осень. Серое небо давит на город. В кармане — 0 рублей. В животе — пусто. Но ты жив. Пока.', type: 'system', timestamp: 0 }],
  isAlive: true,
  isGameOver: false,
  gameOverReason: '',
  daysAlive: 0,
  currentScenario: null,
  flags: {},
  money: 0,
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getRandomWeather(season: string): { weather: string; temperature: number } {
  const seasonWeathers: Record<string, string[]> = {
    'Зима': ['Ясно', 'Снег', 'Метель', 'Мороз', 'Облачно'],
    'Весна': ['Ясно', 'Дождь', 'Облачно', 'Ливень'],
    'Лето': ['Ясно', 'Жара', 'Облачно', 'Дождь'],
    'Осень': ['Облачно', 'Дождь', 'Ливень', 'Ясно'],
  };
  const options = seasonWeathers[season] || ['Облачно'];
  const weather = options[Math.floor(Math.random() * options.length)];
  const range = WEATHER_TYPES[weather]?.tempRange || [0, 20];
  const temperature = Math.floor(range[0] + Math.random() * (range[1] - range[0]));
  return { weather, temperature };
}

function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return 'утро';
  if (hour >= 12 && hour < 17) return 'день';
  if (hour >= 17 && hour < 22) return 'вечер';
  return 'ночь';
}

function checkTrigger(scenario: Scenario, state: GameState): boolean {
  const tc = scenario.triggerConditions;
  const timeOfDay = getTimeOfDay(state.time.hour);

  if (tc.locations && !tc.locations.includes(state.currentLocation)) return false;
  if (tc.seasons && !tc.seasons.includes(state.time.season)) return false;
  if (tc.timeOfDay && !tc.timeOfDay.includes(timeOfDay)) return false;
  if (tc.healthMax !== undefined && state.player.health > tc.healthMax) return false;
  if (tc.healthMin !== undefined && state.player.health < tc.healthMin) return false;
  if (tc.hygieneMin !== undefined && state.player.hygiene < tc.hygieneMin) return false;
  if (tc.hygieneMax !== undefined && state.player.hygiene > tc.hygieneMax) return false;
  if (tc.warmthMax !== undefined && state.player.warmth > tc.warmthMax) return false;
  if (tc.warmthMin !== undefined && state.player.warmth < tc.warmthMin) return false;
  if (tc.satietyMax !== undefined && state.player.satiety > tc.satietyMax) return false;
  if (tc.sobrietyMax !== undefined && state.player.sobriety > tc.sobrietyMax) return false;
  if (tc.sobrietyMin !== undefined && state.player.sobriety < tc.sobrietyMin) return false;
  if (tc.moraleMax !== undefined && state.player.morale > tc.moraleMax) return false;
  if (tc.moraleMin !== undefined && state.player.morale < tc.moraleMin) return false;
  if (tc.authorityMin !== undefined && state.player.authority < tc.authorityMin) return false;

  return true;
}

function getAvailableScenarios(state: GameState): Scenario[] {
  return SCENARIOS.filter(s => checkTrigger(s, state));
}

function getRandomScenario(state: GameState): Scenario | null {
  const available = getAvailableScenarios(state);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function canChoose(choice: Choice, state: GameState): boolean {
  const req = choice.requirements;
  if (!req) return true;
  if (req.item && !state.inventory.find(i => i.id === req.item || i.name === req.item)) return false;
  if (req.itemTag && !state.inventory.find(i => i.tags.includes(req.itemTag!))) return false;
  if (req.authorityMin !== undefined && state.player.authority < req.authorityMin) return false;
  if (req.moraleMin !== undefined && state.player.morale < req.moraleMin) return false;
  if (req.sobrietyMax !== undefined && state.player.sobriety > req.sobrietyMax) return false;
  return true;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('asphalt_save');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_STATE;
  });
  const [showInventory, setShowInventory] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Save game
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('asphalt_save', JSON.stringify(gameState));
    }, 10000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.logs]);

  // Typing effect
  useEffect(() => {
    if (gameState.currentScenario && !isTyping) {
      setIsTyping(true);
      setTypingText('');
      const text = gameState.currentScenario.description;
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setTypingText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [gameState.currentScenario?.id]);

  const addLog = useCallback((text: string, type: GameLog['type'] = 'narrative') => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, { text, type, timestamp: prev.time.day * 24 + prev.time.hour }]
    }));
  }, []);

  const advanceTime = useCallback((hours: number) => {
    setGameState(prev => {
      let newHour = prev.time.hour + hours;
      let newDay = prev.time.day;
      let newSeason = prev.time.season;

      while (newHour >= 24) {
        newHour -= 24;
        newDay++;
      }

      // Change season every 30 days
      const seasonIndex = Math.floor((newDay - 1) / 30) % 4;
      newSeason = SEASONS[seasonIndex];

      // Weather change every 6 hours
      let weather = prev.weather;
      let temperature = prev.temperature;
      if (newHour % 6 === 0 || newSeason !== prev.time.season) {
        const w = getRandomWeather(newSeason);
        weather = w.weather;
        temperature = w.temperature;
      }

      // Stat decay per hour
      const decayMultiplier = hours;
      let newPlayer = { ...prev.player };
      
      // Satiety decay
      newPlayer.satiety = clamp(newPlayer.satiety - 2 * decayMultiplier, 0, 100);
      
      // Warmth based on weather and location
      const location = LOCATIONS.find(l => l.id === prev.currentLocation);
      const warmthChange = (location?.warmthBonus || 0) * 0.1 * decayMultiplier;
      const weatherWarmth = temperature < 0 ? -3 * decayMultiplier : temperature > 30 ? -1 * decayMultiplier : 0;
      newPlayer.warmth = clamp(newPlayer.warmth + warmthChange + weatherWarmth, 0, 100);

      // Health damage from low stats
      if (newPlayer.satiety <= 0) newPlayer.health = clamp(newPlayer.health - 3 * decayMultiplier, 0, 100);
      if (newPlayer.warmth <= 0) newPlayer.health = clamp(newPlayer.health - 5 * decayMultiplier, 0, 100);
      if (newPlayer.sobriety <= 10) newPlayer.health = clamp(newPlayer.health - 2 * decayMultiplier, 0, 100);

      // Hygiene slowly increases
      newPlayer.hygiene = clamp(newPlayer.hygiene + 0.5 * decayMultiplier, 0, 100);

      // Morale decay
      if (newPlayer.health < 30) newPlayer.morale = clamp(newPlayer.morale - 2 * decayMultiplier, 0, 100);
      if (newPlayer.warmth < 20) newPlayer.morale = clamp(newPlayer.morale - 1 * decayMultiplier, 0, 100);

      // Sobriety natural decay
      newPlayer.sobriety = clamp(newPlayer.sobriety - 1 * decayMultiplier, 0, 100);

      // Check death
      let isAlive = true;
      let gameOverReason = '';
      if (newPlayer.health <= 0) {
        isAlive = false;
        if (newPlayer.warmth <= 0) gameOverReason = 'Ты замёрз насмерть. Холод забрал тебя тихо, во сне.';
        else if (newPlayer.satiety <= 0) gameOverReason = 'Ты умер от голода. Тело просто отказало.';
        else gameOverReason = 'Твоё тело не выдержало. Слишком много ран, слишком мало сил.';
      }
      if (newPlayer.morale <= 0) {
        isAlive = false;
        gameOverReason = 'Ты не выдержал. Психика сломалась. Ты просто лёг и не встал.';
      }

      return {
        ...prev,
        player: newPlayer,
        time: { day: newDay, hour: newHour, season: newSeason },
        weather,
        temperature,
        isAlive,
        gameOverReason,
        isGameOver: !isAlive,
        daysAlive: newDay - 1,
      };
    });
  }, []);

  const handleChoice = useCallback((choiceIndex: number) => {
    if (!gameState.currentScenario) return;
    const choice = gameState.currentScenario.choices[choiceIndex];
    if (!canChoose(choice, gameState)) return;

    const success = Math.random() * 100 < choice.outcomes.successChance;
    const outcome = success ? choice.outcomes.success : choice.outcomes.fail;

    if (!success && !choice.outcomes.fail.text) {
      // No fail text means it always "succeeds" in some way
      const successOutcome = choice.outcomes.success;
      setGameState(prev => {
        let newPlayer = { ...prev.player };
        if (successOutcome.stats) {
          Object.entries(successOutcome.stats).forEach(([key, val]) => {
            if (key in newPlayer) {
              (newPlayer as any)[key] = clamp((newPlayer as any)[key] + (val as number), 0, 100);
            }
          });
        }
        return {
          ...prev,
          player: newPlayer,
          currentScenario: null,
          logs: [...prev.logs,
            { text: `> ${choice.text}`, type: 'info', timestamp: prev.time.day * 24 + prev.time.hour },
            { text: successOutcome.text, type: 'success', timestamp: prev.time.day * 24 + prev.time.hour }
          ]
        };
      });
    } else {
      setGameState(prev => {
        let newPlayer = { ...prev.player };
        if (outcome.stats) {
          Object.entries(outcome.stats).forEach(([key, val]) => {
            if (key in newPlayer) {
              (newPlayer as any)[key] = clamp((newPlayer as any)[key] + (val as number), key === 'money' ? -99999 : 0, key === 'money' ? 99999 : 100);
            }
          });
        }
        return {
          ...prev,
          player: newPlayer,
          currentScenario: null,
          logs: [...prev.logs,
            { text: `> ${choice.text}`, type: 'info', timestamp: prev.time.day * 24 + prev.time.hour },
            { text: outcome.text, type: success ? 'success' : 'fail', timestamp: prev.time.day * 24 + prev.time.hour }
          ]
        };
      });
    }

    advanceTime(1);
  }, [gameState, advanceTime]);

  const moveToLocation = useCallback((locationId: string) => {
    const location = LOCATIONS.find(l => l.id === locationId);
    if (!location) return;

    setGameState(prev => ({
      ...prev,
      currentLocation: locationId,
      logs: [...prev.logs, { text: `Ты идёшь: ${location.name}. ${location.description}`, type: 'system', timestamp: prev.time.day * 24 + prev.time.hour }]
    }));
    setShowLocations(false);
    advanceTime(1);

    // Random encounter chance
    setTimeout(() => {
      setGameState(prev => {
        if (Math.random() < 0.6) {
          const scenario = getRandomScenario(prev);
          if (scenario) {
            return { ...prev, currentScenario: scenario };
          }
        }
        return prev;
      });
    }, 500);
  }, [advanceTime]);

  const searchArea = useCallback(() => {
    addLog('Ты осматриваешься в поисках чего-нибудь полезного...', 'info');
    advanceTime(1);

    setTimeout(() => {
      setGameState(prev => {
        if (Math.random() < 0.7) {
          const scenario = getRandomScenario(prev);
          if (scenario) {
            return { ...prev, currentScenario: scenario };
          }
        }
        // Small chance to find something
        if (Math.random() < 0.3) {
          const finds: InventoryItem[] = [
            { id: `bottle_${Date.now()}`, name: 'Пустая бутылка', weight: 0.5, tags: ['valuable'], value: 10, condition: 100 },
            { id: `bread_${Date.now()}`, name: 'Кусок хлеба', weight: 0.3, tags: ['food'], food: 10, condition: 80 },
            { id: `cloth_${Date.now()}`, name: 'Тряпка', weight: 0.2, tags: ['warmth'], warmth: 2, condition: 60 },
          ];
          const found = finds[Math.floor(Math.random() * finds.length)];
          return {
            ...prev,
            inventory: [...prev.inventory, found],
            logs: [...prev.logs, { text: `Нашёл: ${found.name}`, type: 'success', timestamp: prev.time.day * 24 + prev.time.hour }]
          };
        }
        return {
          ...prev,
          logs: [...prev.logs, { text: 'Ничего полезного не нашёл.', type: 'narrative', timestamp: prev.time.day * 24 + prev.time.hour }]
        };
      });
    }, 300);
  }, [addLog, advanceTime]);

  const sleep = useCallback(() => {
    addLog('Ты закрываешь глаза и пытаешься уснуть...', 'info');
    advanceTime(8);
  }, [addLog, advanceTime]);

  const sellItem = useCallback((item: InventoryItem) => {
    if (!item.value) return;
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, money: prev.player.money + item.value! },
      inventory: prev.inventory.filter(i => i.id !== item.id),
      logs: [...prev.logs, { text: `Сдал: ${item.name} за ${item.value} руб.`, type: 'success', timestamp: prev.time.day * 24 + prev.time.hour }]
    }));
  }, []);

  const restartGame = useCallback(() => {
    localStorage.removeItem('asphalt_save');
    setGameState({ ...INITIAL_STATE, logs: [{ text: 'Новая жизнь. Новый день. Тот же асфальт.', type: 'system', timestamp: 0 }] });
  }, []);

  const triggerRandomEvent = useCallback(() => {
    const scenario = getRandomScenario(gameState);
    if (scenario) {
      setGameState(prev => ({ ...prev, currentScenario: scenario }));
    } else {
      addLog('Ничего не происходит. Тишина.', 'narrative');
      advanceTime(1);
    }
  }, [gameState, addLog, advanceTime]);

  const currentLocation = LOCATIONS.find(l => l.id === gameState.currentLocation);
  const totalWeight = gameState.inventory.reduce((sum, i) => sum + i.weight, 0);
  const timeOfDay = getTimeOfDay(gameState.time.hour);

  // Background based on time of day
  const bgClass = timeOfDay === 'ночь' ? 'bg-[#020617]' :
    timeOfDay === 'утро' ? 'bg-[#0a0f1a]' :
    timeOfDay === 'день' ? 'bg-[#0f172a]' :
    'bg-[#0c1222]';

  // Game Over screen
  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-300 flex items-center justify-center p-4 font-mono">
        <div className="max-w-lg text-center space-y-6">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-3xl text-red-500 font-bold">КОНЕЦ</h1>
          <p className="text-xl text-gray-400">{gameState.gameOverReason}</p>
          <div className="border border-gray-700 p-4 rounded">
            <p>Ты прожил: <span className="text-yellow-400">{gameState.daysAlive} дней</span></p>
            <p>Последняя локация: <span className="text-blue-400">{currentLocation?.name}</span></p>
          </div>
          <button onClick={restartGame} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-green-400 transition">
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} text-gray-300 font-mono flex flex-col transition-colors duration-1000`}>
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-gray-800 p-3 flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-green-400 text-lg font-bold">🌃 ТЕПЛО АСФАЛЬТА</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-yellow-400">📅 День {gameState.time.day}</span>
          <span className="text-blue-300">🕐 {gameState.time.hour}:00 ({timeOfDay})</span>
          <span className="text-purple-300">🌡️ {gameState.temperature}°C</span>
          <span className="text-cyan-300">☁️ {gameState.weather}</span>
          <span className="text-orange-300">🍂 {gameState.time.season}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel - Stats */}
        <aside className="lg:w-72 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto space-y-3">
          <div className="text-green-400 text-sm font-bold mb-2">═══ СТАТУС ═══</div>
          
          <StatBar label="❤️ Здоровье" value={gameState.player.health} color="red" />
          <StatBar label="🍖 Сытость" value={gameState.player.satiety} color="orange" />
          <StatBar label="🔥 Тепло" value={gameState.player.warmth} color="yellow" />
          <StatBar label="🍺 Трезвость" value={gameState.player.sobriety} color="blue" />
          <StatBar label="🧼 Гигиена" value={100 - gameState.player.hygiene} color="green" inverted />
          <StatBar label="⭐ Авторитет" value={gameState.player.authority} color="purple" />
          <StatBar label="🧠 Психика" value={gameState.player.morale} color="pink" />
          
          <div className="border-t border-gray-700 pt-2 mt-2">
            <p className="text-sm">💰 Деньги: <span className="text-yellow-400">{gameState.player.money} ₽</span></p>
            <p className="text-sm">⚖️ Вес: <span className={totalWeight > gameState.maxWeight ? 'text-red-400' : 'text-gray-400'}>{totalWeight.toFixed(1)}/{gameState.maxWeight} кг</span></p>
          </div>

          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="text-green-400 text-sm font-bold mb-1">═══ ЛОКАЦИЯ ═══</div>
            <p className="text-lg">{currentLocation?.icon} {currentLocation?.name}</p>
            <p className="text-xs text-gray-500 mt-1">{currentLocation?.description}</p>
          </div>

          {/* Warnings */}
          <div className="space-y-1 mt-2">
            {gameState.player.health < 30 && <p className="text-red-400 text-xs animate-pulse">⚠️ Здоровье критическое!</p>}
            {gameState.player.warmth < 20 && <p className="text-blue-400 text-xs animate-pulse">⚠️ Ты замерзаешь!</p>}
            {gameState.player.satiety < 15 && <p className="text-orange-400 text-xs animate-pulse">⚠️ Ты голодаешь!</p>}
            {gameState.player.morale < 20 && <p className="text-purple-400 text-xs animate-pulse">⚠️ Психика на грани!</p>}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Action Buttons */}
          <div className="bg-gray-900 border-b border-gray-800 p-3 flex flex-wrap gap-2">
            <button onClick={() => setShowLocations(!showLocations)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-blue-300 transition">
              🗺️ Перейти
            </button>
            <button onClick={searchArea} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-green-300 transition">
              🔍 Искать
            </button>
            <button onClick={triggerRandomEvent} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-yellow-300 transition">
              🎲 Ждать
            </button>
            <button onClick={sleep} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-purple-300 transition">
              😴 Спать
            </button>
            <button onClick={() => setShowInventory(!showInventory)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-orange-300 transition">
              🎒 Инвентарь ({gameState.inventory.length})
            </button>
            <button onClick={restartGame} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-red-300 transition ml-auto">
              🔄 Заново
            </button>
          </div>

          {/* Location Selection */}
          {showLocations && (
            <div className="bg-gray-900 border-b border-gray-800 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => moveToLocation(loc.id)}
                  disabled={loc.id === gameState.currentLocation}
                  className={`p-3 border rounded text-left transition ${
                    loc.id === gameState.currentLocation
                      ? 'border-green-600 bg-green-900/20 text-green-400'
                      : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{loc.icon}</span>
                  <span className="ml-2 font-bold">{loc.name}</span>
                  <p className="text-xs text-gray-500 mt-1">{loc.description}</p>
                  <div className="flex gap-2 mt-1 text-xs">
                    <span className={loc.warmthBonus > 0 ? 'text-yellow-400' : 'text-blue-400'}>
                      🌡️ {loc.warmthBonus > 0 ? '+' : ''}{loc.warmthBonus}
                    </span>
                    <span className="text-red-400">⚔️ {'🔴'.repeat(loc.dangerLevel)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Inventory */}
          {showInventory && (
            <div className="bg-gray-900 border-b border-gray-800 p-3 max-h-60 overflow-y-auto">
              <div className="text-green-400 text-sm font-bold mb-2">═══ ИНВЕНТАРЬ ═══</div>
              {gameState.inventory.length === 0 ? (
                <p className="text-gray-500 text-sm">Пусто. Как и твои карманы.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gameState.inventory.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.weight}кг | Сост: {item.condition}%</p>
                      </div>
                      {item.value && gameState.currentLocation === 'pawnshop' && (
                        <button onClick={() => sellItem(item)} className="px-2 py-1 bg-yellow-900 hover:bg-yellow-800 text-yellow-300 text-xs rounded border border-yellow-700">
                          Сдать {item.value}₽
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scenario Display */}
          {gameState.currentScenario && (
            <div className="bg-gray-900/50 border-b border-gray-800 p-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-yellow-400 text-xs mb-1">[{gameState.currentScenario.category}] {gameState.currentScenario.title}</div>
                <p className="text-gray-200 leading-relaxed mb-4 min-h-[3em]">
                  {isTyping ? typingText : gameState.currentScenario.description}
                </p>
                {!isTyping && (
                  <div className="space-y-2">
                    {gameState.currentScenario.choices.map((choice, idx) => {
                      const available = canChoose(choice, gameState);
                      return (
                        <button
                          key={idx}
                          onClick={() => available && handleChoice(idx)}
                          disabled={!available}
                          className={`w-full text-left p-3 rounded border transition ${
                            available
                              ? 'border-gray-600 hover:border-green-500 hover:bg-gray-800 text-gray-200'
                              : 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-green-400 mr-2">{'>'}</span>
                          {choice.text}
                          {!available && <span className="text-xs text-red-400 ml-2">(недоступно)</span>}
                          {choice.requirements?.item && <span className="text-xs text-yellow-400 ml-2">[нужно: {choice.requirements.item}]</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Log */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto space-y-2">
              {gameState.logs.map((log, idx) => (
                <div key={idx} className={`text-sm leading-relaxed ${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'fail' ? 'text-red-400' :
                  log.type === 'info' ? 'text-blue-300' :
                  log.type === 'system' ? 'text-yellow-400' :
                  log.type === 'death' ? 'text-red-500 font-bold' :
                  'text-gray-400'
                }`}>
                  {log.type === 'info' ? '' : log.type === 'system' ? '▸ ' : ''}{log.text}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 p-2 text-center text-xs text-gray-600">
        Тепло Асфальта v1.0 | День {gameState.time.day} | {gameState.time.season} | {gameState.weather} {gameState.temperature}°C
      </footer>
    </div>
  );
}

function StatBar({ label, value, color, inverted }: { label: string; value: number; color: string; inverted?: boolean }) {
  const displayValue = inverted ? value : value;
  const barColor = inverted
    ? value < 30 ? 'bg-red-500' : value < 60 ? 'bg-yellow-500' : 'bg-green-500'
    : value < 20 ? 'bg-red-500' : value < 40 ? 'bg-orange-500' : value < 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span>{label}</span>
        <span className={value < 20 ? 'text-red-400 animate-pulse' : 'text-gray-400'}>{Math.round(displayValue)}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-500 rounded-full`} style={{ width: `${clamp(value, 0, 100)}%` }} />
      </div>
    </div>
  );
}

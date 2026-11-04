import { Location, Scenario } from './types';

export const LOCATIONS: Location[] = [
  { id: 'station', name: 'Вокзал', description: 'Тепло, но много охраны и полиции. Люди спешат, иногда роняют мелочь.', icon: '🚂', warmthBonus: 20, dangerLevel: 3 },
  { id: 'dumpsters', name: 'Мусорные Баки', description: 'За рестораном и рынком. Пахнет гнилью, но здесь можно найти еду.', icon: '🗑️', warmthBonus: 0, dangerLevel: 2 },
  { id: 'construction', name: 'Стройка', description: 'Грузчики иногда подкидывают халтуру. Охрана злая, но тепло.', icon: '🏗️', warmthBonus: 10, dangerLevel: 2 },
  { id: 'park', name: 'Парк', description: 'Скамейки для сна. Тихо, но ночью опасно.', icon: '🌳', warmthBonus: -10, dangerLevel: 4 },
  { id: 'abandoned', name: 'Заброшка', description: 'Старое здание. Тепло от труб, но крысы и другие бомжи.', icon: '🏚️', warmthBonus: 15, dangerLevel: 3 },
  { id: 'shelter', name: 'Ночлежка', description: 'Бесплатный суп и койка. Но без алкоголя и с правилами.', icon: '🏠', warmthBonus: 30, dangerLevel: 1 },
  { id: 'pawnshop', name: 'Пункт Скупки', description: 'Сдают металл, бутылки, старьё. Рядом ларёк с cheapest водкой.', icon: '🏪', warmthBonus: 5, dangerLevel: 2 },
];

export const SEASONS = ['Зима', 'Весна', 'Лето', 'Осень'];

export const WEATHER_TYPES: Record<string, { tempRange: [number, number]; effects: string[] }> = {
  'Ясно': { tempRange: [-5, 35], effects: [] },
  'Облачно': { tempRange: [-10, 30], effects: [] },
  'Дождь': { tempRange: [5, 25], effects: ['warmth', 'hygiene'] },
  'Снег': { tempRange: [-25, 0], effects: ['warmth'] },
  'Метель': { tempRange: [-30, -10], effects: ['warmth', 'health'] },
  'Жара': { tempRange: [30, 42], effects: ['satiety', 'sobriety'] },
  'Ливень': { tempRange: [10, 20], effects: ['warmth', 'hygiene', 'health'] },
  'Мороз': { tempRange: [-35, -15], effects: ['warmth', 'health'] },
};

export const SCENARIOS: Scenario[] = [
  // === КАТЕГОРИЯ 1: ПОИСК ЕДЫ ===
  {
    id: 'FOOD_001', category: 'Поиск еды', title: 'Полусгнившее яблоко',
    triggerConditions: { locations: ['dumpsters'] },
    description: 'Копаясь в мусорном баке за рестораном, ты находишь яблоко. Оно помятое, с коричневым пятном, но ещё не полностью сгнило. Желудок сводит от голода.',
    choices: [
      { text: 'Съесть как есть', outcomes: { successChance: 60, success: { text: 'Кислое, но съедобное. Живот перестал урчать.', stats: { satiety: 15 } }, fail: { text: 'Яблоко оказалось хуже, чем казалось. Тебя скрутило.', stats: { health: -10, satiety: 5 } } } },
      { text: 'Срезать гниль и съесть', outcomes: { successChance: 85, success: { text: 'Осторожно срезав плохое, ты съел нормальную часть.', stats: { satiety: 10 } }, fail: { text: 'Не помогло. Всё равно подташнивает.', stats: { health: -5, satiety: 5 } } } },
      { text: 'Отдать бродячей собаке', outcomes: { successChance: 100, success: { text: 'Собака виляет хвостом и смотрит преданными глазами. На душе теплее.', stats: { morale: 10, authority: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'FOOD_002', category: 'Поиск еды', title: 'Заначка в кармане куртки',
    triggerConditions: { locations: ['dumpsters', 'park'], satietyMax: 40 },
    description: 'На скамейке кто-то оставил старую куртку. В кармане нащупываешь завёрнутый в фольгу бутерброд. Выглядит подозрительно, но пахнет колбасой.',
    choices: [
      { text: 'Съесть не раздумывая', outcomes: { successChance: 50, success: { text: 'Колбаса оказалась нормальная! Целый день сытости.', stats: { satiety: 30 } }, fail: { text: 'Бутерброд был трёхдневной давности. Тошнота и боль в животе.', stats: { health: -15, satiety: 10 } } } },
      { text: 'Понюхать и проверить', outcomes: { successChance: 80, success: { text: 'Запах нормальный. Ешь аккуратно — всё хорошо.', stats: { satiety: 20 } }, fail: { text: 'Пахло нормально, но вкус выдал — протухшее мясо. Выплюнул.', stats: { health: -5 } } } },
      { text: 'Оставить кому-то более нуждающемуся', outcomes: { successChance: 100, success: { text: 'Ты чувствуешь себя человеком. Может, это кому-то спасёт жизнь.', stats: { morale: 15 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'FOOD_003', category: 'Поиск еды', title: 'Бабушка с пирожками',
    triggerConditions: { locations: ['station'], hygieneMin: 0, hygieneMax: 60 },
    description: 'Старушка торгует пирожками у входа. Она замечает тебя и... протягивает один. "На, сынок, поешь."',
    choices: [
      { text: 'Принять с благодарностью', outcomes: { successChance: 100, success: { text: 'Пирожок с капустой — как у мамы. Глаза защипало.', stats: { satiety: 25, morale: 20 } }, fail: { text: '', stats: {} } } },
      { text: 'Отказаться из гордости', outcomes: { successChance: 100, success: { text: '"Спаси бог, бабушка, я не голодный." Она кивает с пониманием.', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'FOOD_004', category: 'Поиск еды', title: 'Консервная банка',
    triggerConditions: { locations: ['dumpsters', 'abandoned'] },
    description: 'Ты находишь закрытую консервную банку. Тушёнка! Но открывалки нет, а банка мятая.',
    choices: [
      { text: 'Открыть об камень', outcomes: { successChance: 70, success: { text: 'После нескольких ударов крышка поддалась. Тушёнка оказалась хорошая!', stats: { satiety: 35 } }, fail: { text: 'Камень раскрошил банку. Тушёнка вывалилась в грязь.', stats: { morale: -10 } } } },
      { text: 'Найти острый край', outcomes: { successChance: 90, success: { text: 'Аккуратно протёр крышку об асфальт и открыл. Нормально.', stats: { satiety: 30 } }, fail: { text: 'Порезал руку. Кровь капает на банку, но ты всё равно ешь.', stats: { health: -10, satiety: 25 } } } },
      { text: 'Обменять у соседнего бомжа на открывалку', outcomes: { successChance: 60, success: { text: 'Петрович дал открывалку за половину банки. Справедливо.', stats: { satiety: 15, authority: 5 } }, fail: { text: 'Петрович забрал банку целиком, пообещав открыть. И исчез.', stats: { morale: -10 } } } }
    ]
  },

  // === КАТЕГОРИЯ 2: АЛКОГОЛЬ ===
  {
    id: 'ALC_001', category: 'Алкоголь', title: 'Найти бутылку',
    triggerConditions: { locations: ['park', 'dumpsters', 'abandoned'] },
    description: 'Под скамейкой стоит недопитая бутылка водки. Ещё пол-литра. Руки трясутся.',
    choices: [
      { text: 'Выпить залпом', outcomes: { successChance: 100, success: { text: 'Огонь по горлу. Мир становится мягче. Руки перестают дрожать.', stats: { sobriety: 40, morale: 10, warmth: 5 } }, fail: { text: '', stats: {} } } },
      { text: 'Выпить половину, остальное приберечь', outcomes: { successChance: 100, success: { text: 'Разумное решение. Половина — на потом.', stats: { sobriety: 20, morale: 5 } }, fail: { text: '', stats: {} } } },
      { text: 'Не трогать — завязать', outcomes: { successChance: 100, success: { text: 'Ты проходишь мимо. Это маленькая победа.', stats: { morale: 15 } }, fail: { text: 'Ты не смог. Выпил.', stats: { sobriety: 40 } } } }
    ]
  },
  {
    id: 'ALC_002', category: 'Алкоголь', title: 'Паленая водка',
    triggerConditions: { locations: ['pawnshop'], sobrietyMax: 30 },
    description: 'Мужик у ларька продаёт "настоящую" водку по 100 рублей за пол-литра. Бутылка без маркировки, жидкость мутноватая.',
    choices: [
      { text: 'Купить и выпить', outcomes: { successChance: 40, success: { text: 'Нормальная водка. Даже хорошо греет.', stats: { sobriety: 50, warmth: 10, money: -100 } }, fail: { text: 'Это был спирт с ацетоном. Тебя рвёт, печень горит.', stats: { health: -25, sobriety: 30 } } } },
      { text: 'Поторговаться', outcomes: { successChance: 50, success: { text: '"Давай за 50, дядя." Мужик скрепя согласился.', stats: { sobriety: 50, authority: 5 } }, fail: { text: '"Или бери, или иди дальше." Ты ушёл ни с чем.', stats: { morale: -5 } } } },
      { text: 'Не рисковать', outcomes: { successChance: 100, success: { text: 'Мудрое решение. Палёнка убивает быстрее мороза.', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'ALC_003', category: 'Алкоголь', title: 'Ломка с утра',
    triggerConditions: { sobrietyMax: 15, timeOfDay: ['утро'] },
    description: 'Утро. Голова раскалывается. Руки не слушаются. Тело требует — надо опохмелиться, иначе не встанешь.',
    choices: [
      { text: 'Найти что-нибудь спиртное', outcomes: { successChance: 70, success: { text: 'Нашёл бутылочку одеколона. Выпил. Полегчало, но печень стонет.', stats: { sobriety: 25, health: -15 } }, fail: { text: 'Ничего не нашёл. Приходится терпеть.', stats: { health: -5, morale: -15 } } } },
      { text: 'Перетерпеть', outcomes: { successChance: 50, success: { text: 'К обеду отпустило. Ты сильнее, чем думал.', stats: { morale: 20, health: -10 } }, fail: { text: 'Не выдержал. Весь день трясёт.', stats: { morale: -20, health: -10 } } } },
      { text: 'Идти в ночлежку — там дают чай', outcomes: { successChance: 90, success: { text: 'Горячий сладкий чай. Не водка, но помогает.', stats: { morale: 10, health: 5 } }, fail: { text: 'В ночлежке очередь. Не пустили.', stats: { morale: -10 } } } }
    ]
  },

  // === КАТЕГОРИЯ 3: ПОЛИЦИЯ ===
  {
    id: 'POL_001', category: 'Полиция', title: 'Облава на вокзале',
    triggerConditions: { locations: ['station'] },
    description: 'Двое полицейских идут по залу, проверяют документы. Один смотрит в твою сторону. До выхода метров двадцать.',
    choices: [
      { text: 'Бежать к выходу', outcomes: { successChance: 60, success: { text: 'Ты юркнул в толпу и выскочил на улицу. Сердце колотится.', stats: { health: -5 } }, fail: { text: 'Тебя скрутили. Проверили карманы, забрали всё ценное, выгнали.', stats: { morale: -15 } } } },
      { text: 'Спокойно пройти мимо', outcomes: { successChance: 40, success: { text: '"Документы есть?" — "Потерял, товарищ майор." — "Иди отсюда." Отпустили.', stats: { morale: 5 } }, fail: { text: '"Без документов — в участок." Посидел ночь в камере. Отпустили утром.', stats: { warmth: -20, morale: -10 } } } },
      { text: 'Спрятаться в туалете', outcomes: { successChance: 75, success: { text: 'Просидел в кабинке час, пока они не ушли. Безопасно.', stats: { hygiene: -10 } }, fail: { text: 'Нашли. "Что прячешься? Документы!" Забрали в участок.', stats: { morale: -15 } } } }
    ]
  },
  {
    id: 'POL_002', category: 'Полиция', title: 'Охранник на стройке',
    triggerConditions: { locations: ['construction'] },
    description: 'Охранник заметил тебя на территории. "Эй, бродяга! А ну пошёл вон! Или вызову ментов!"',
    choices: [
      { text: 'Уйти тихо', outcomes: { successChance: 100, success: { text: 'Ты ушёл, опустив голову. Безопасность важнее.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Предложить работу — "Я могу помочь разгрузить"', outcomes: { successChance: 35, success: { text: 'Охранник задумался. "Ладно, грузи. За это дам 200 рублей и обед."', stats: { satiety: 20, morale: 15 } }, fail: { text: '"Мне не нужны тут бомжи!" Он схватил тебя за шиворот и вытолкнул.', stats: { health: -10, morale: -10 } } } },
      { text: 'Послать его', outcomes: { successChance: 10, success: { text: 'Охранник растерялся и отошёл. Ты остался греться у вентиляции.', stats: { authority: 10, warmth: 10 } }, fail: { text: 'Он вызвал наряд. Тебя забрали и избили в участке.', stats: { health: -30, morale: -20 } } } }
    ]
  },

  // === КАТЕГОРИЯ 4: ЗДОРОВЬЕ ===
  {
    id: 'HP_001', category: 'Здоровье', title: 'Зубная боль',
    triggerConditions: { locations: ['park', 'abandoned'], healthMax: 60 },
    description: 'Дикая боль в щеке не даёт уснуть. Десна опухла, голова гудит. Зуб нужно рвать, но к стоматологу — нужны деньги.',
    choices: [
      { text: 'Попросить водки у соседа — "заморозить" нерв', outcomes: { successChance: 80, success: { text: 'Водка помогла, боль утихла. Ты уснул.', stats: { sobriety: 30, health: -5 } }, fail: { text: 'Сосед оказался жадным и ударил тебя за наглость.', stats: { health: -15, authority: -5 } } } },
      { text: 'Вырвать зуб самому — нитка и дверь', outcomes: { successChance: 40, success: { text: 'Кровь везде, но зуб на нитке. Боль прошла.', stats: { health: -10 } }, fail: { text: 'Ты оторвал кусок десны. Рана не заживает.', stats: { health: -30 } } } },
      { text: 'Терпеть', outcomes: { successChance: 50, success: { text: 'К утру боль немного утихла. Ты выжил.', stats: { health: -5, morale: 5 } }, fail: { text: 'Ночь была адом. Ты не спал и ослаб.', stats: { health: -15, morale: -15 } } } }
    ]
  },
  {
    id: 'HP_002', category: 'Здоровье', title: 'Простуда',
    triggerConditions: { warmthMax: 30 },
    description: 'Нос заложен, температура, кашель. Если не согреться — будет пневмония. А пневмония на улице — это смерть.',
    choices: [
      { text: 'Идти в ночлежку греться', outcomes: { successChance: 85, success: { text: 'Тёплая койка, горячий чай. К утру полегчало.', stats: { warmth: 30, health: 10 } }, fail: { text: 'Мест нет. Пришлось ночевать на улице.', stats: { health: -15, warmth: -10 } } } },
      { text: 'Развести костёр', outcomes: { successChance: 60, success: { text: 'Костёр из palletов. Тепло, дым. Пот прошибает — хорошо.', stats: { warmth: 25, health: 5 } }, fail: { text: 'Дрова мокрые. Костёр не разгорелся, только дым в глаза.', stats: { health: -10 } } } },
      { text: 'Найти аптечку', outcomes: { successChance: 30, success: { text: 'В мусорке у поликлиники нашёл упаковку парацетамола. Выпил.', stats: { health: 15 } }, fail: { text: 'Ничего не нашёл. Придётся терпеть.', stats: { health: -10 } } } }
    ]
  },
  {
    id: 'HP_003', category: 'Здоровье', title: 'Порез на руке',
    triggerConditions: { locations: ['dumpsters', 'construction'] },
    description: 'Острый кусок металла рассёк ладонь. Кровь капает. Рану нужно обработать, иначе заражение.',
    choices: [
      { text: 'Промыть водой и перевязать тряпкой', outcomes: { successChance: 70, success: { text: 'Больно, но чисто. Кровь остановилась.', stats: { health: -5 } }, fail: { text: 'Грязная вода. Рана воспалилась к вечеру.', stats: { health: -20 } } } },
      { text: 'Прижечь сигаретой', outcomes: { successChance: 80, success: { text: 'Адская боль, но рана обеззаражена. Кровь stopped.', stats: { health: -10, morale: -5 } }, fail: { text: 'Ожог хуже пореза. Теперь болит двойное.', stats: { health: -15 } } } },
      { text: 'Не обращать внимания', outcomes: { successChance: 40, success: { text: 'Заживёт как на собаке. Организм крепкий.', stats: { health: -5 } }, fail: { text: 'К утру рука опухла. Началось заражение.', stats: { health: -30 } } } }
    ]
  },

  // === КАТЕГОРИЯ 5: ПОГОДА ===
  {
    id: 'WTH_001', category: 'Погода', title: 'Метель',
    triggerConditions: { seasons: ['Зима'], warmthMax: 50 },
    description: 'Метель усилилась. Ветер пронизывает до костей. Видимость — метр. Если не найти укрытие — замёрзнешь за час.',
    choices: [
      { text: 'Бежать в ближайшее укрытие', outcomes: { successChance: 70, success: { text: 'Нашёл подъезд. Дверь закрыта, но ты забрался через подвал. Тепло!', stats: { warmth: 20 } }, fail: { text: 'Все двери заперты. Ты промокаешь и мёрзнешь ещё сильнее.', stats: { warmth: -20, health: -10 } } } },
      { text: 'Закопаться в снег под деревом', outcomes: { successChance: 40, success: { text: 'Снег как одеяло. Под ним теплее, чем на ветру. Ты переждал.', stats: { warmth: 5, health: -10 } }, fail: { text: 'Ты не смог уснуть от холода. Утром еле встал.', stats: { warmth: -15, health: -15 } } } },
      { text: 'Идти в ночлежку сквозь метель', outcomes: { successChance: 55, success: { text: 'Добрёл. Мокрым, но живым. Дали сухую одежду.', stats: { warmth: 30, health: 5 } }, fail: { text: 'Не дошёл. Пришлось вернуться. Силы на исходе.', stats: { warmth: -15, health: -10, satiety: -10 } } } }
    ]
  },
  {
    id: 'WTH_002', category: 'Погода', title: 'Летняя жара',
    triggerConditions: { seasons: ['Лето'] },
    description: 'Солнце палит нещадно. Асфальт плавится. Нужно найти воду и тень, иначе тепловой удар.',
    choices: [
      { text: 'Искать фонтан или кран с водой', outcomes: { successChance: 75, success: { text: 'Нашёл рабочий кран во дворе. Напился, умылся.', stats: { hygiene: 10, health: 5 } }, fail: { text: 'Все краны перекрыты. Ходишь как зомби.', stats: { health: -10, satiety: -5 } } } },
      { text: 'Зайти в торговый центр — там кондиционеры', outcomes: { successChance: 80, success: { text: 'Прохлада! Сидишь на скамейке, охрана не гонит.', stats: { warmth: -10, health: 5 } }, fail: { text: 'Охранник выгнал: "Вон отсюда, воняешь!"', stats: { morale: -10 } } } },
      { text: 'Спать в тени до вечера', outcomes: { successChance: 90, success: { text: 'Проспал до заката. Проснулся — легче.', stats: { health: 5 } }, fail: { text: 'Проснулся — обгорел. Кожа красная и болит.', stats: { health: -15 } } } }
    ]
  },

  // === КАТЕГОРИЯ 6: NPC ===
  {
    id: 'NPC_001', category: 'NPC', title: 'Философ-собутыльник',
    triggerConditions: { locations: ['abandoned', 'park'] },
    description: 'Сосед по трубе, Михалыч, подливает тебе из горлышка и говорит: "Знаешь, брат, жизнь — это река. Мы все в ней — щепки."',
    choices: [
      { text: 'Поддержать разговор', outcomes: { successChance: 100, success: { text: 'Вы говорили до рассвета. О бывшей жизни, о детях, о Боге. На душе легче.', stats: { morale: 20, sobriety: 20 } }, fail: { text: '', stats: {} } } },
      { text: 'Промолчать и пить', outcomes: { successChance: 100, success: { text: 'Молчание — тоже ответ. Вы допили бутылку молча.', stats: { sobriety: 30, morale: 5 } }, fail: { text: '', stats: {} } } },
      { text: '"Хватит бухать, Михалыч"', outcomes: { successChance: 100, success: { text: 'Михалыч усмехнулся: "Поздно, брат. Поезд ушёл." Но ты почувствовал себя трезвее.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'NPC_002', category: 'NPC', title: 'Агрессивные подростки',
    triggerConditions: { locations: ['park', 'station'], timeOfDay: ['вечер', 'ночь'] },
    description: 'Трое пацанов лет 16 обступили тебя. "Эй, бомж! Дай закурить! А ну, покажи что в карманах!"',
    choices: [
      { text: 'Отдать всё, что просят', outcomes: { successChance: 100, success: { text: 'Они забрали мелочь и ушли, посмеявшись. Ты цел.', stats: { morale: -15 } }, fail: { text: '', stats: {} } } },
      { text: 'Послать их', outcomes: { successChance: 25, success: { text: 'Ты рявкнул так, что пацаны попятились. "Свалили, малолетки!"', stats: { authority: 15, morale: 10 } }, fail: { text: 'Они избили тебя. Синяки, раны, забрали всё.', stats: { health: -25, morale: -20 } } } },
      { text: 'Убежать', outcomes: { successChance: 60, success: { text: 'Ты оказался быстрее. Они не стали догонять.', stats: { health: -5 } }, fail: { text: 'Догнали. Избили и отобрали куртку.', stats: { health: -20, morale: -15 } } } }
    ]
  },
  {
    id: 'NPC_003', category: 'NPC', title: 'Волонтёр из церкви',
    triggerConditions: { locations: ['shelter', 'station'] },
    description: 'Молодая девушка в жилетке раздаёт горячую еду. "Здравствуйте! Хотите пообедать? У нас ещё есть одежда."',
    choices: [
      { text: 'Принять еду и одежду', outcomes: { successChance: 100, success: { text: 'Горячий суп и чистая рубашка. Девушка улыбается: "Держитесь!"', stats: { satiety: 30, warmth: 10, morale: 15, hygiene: 10 } }, fail: { text: '', stats: {} } } },
      { text: 'Поговорить о жизни', outcomes: { successChance: 100, success: { text: 'Она слушает внимательно. "Мы можем помочь с документами, если хотите." Надежда.', stats: { morale: 25 } }, fail: { text: '', stats: {} } } },
      { text: 'Отказаться — "Я не нищий"', outcomes: { successChance: 100, success: { text: 'Она кивает с уважением. "Если передумаете — мы каждый день здесь."', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 7: КРИМИНАЛ ===
  {
    id: 'CRIM_001', category: 'Криминал', title: 'Пьяный бизнесмен',
    triggerConditions: { locations: ['station'], timeOfDay: ['ночь'] },
    description: 'Мужик в дорогом пальто спит на скамейке. Из кармана торчит кошелёк. Он пьян в стельку.',
    choices: [
      { text: 'Обчистить карманы', outcomes: { successChance: 70, success: { text: 'В кошельке — 3000 рублей и кредитки. Богатый улов.', stats: { authority: -5 }, items: [] }, fail: { text: 'Он проснулся и схватил тебя за руку. Крик, охрана, полиция.', stats: { health: -20, morale: -15 } } } },
      { text: 'Разбудить и предупредить', outcomes: { successChance: 100, success: { text: '"Дядя, проснись! Обчистят!" Он благодарит, даёт 500 рублей.', stats: { morale: 20, authority: 10 } }, fail: { text: '', stats: {} } } },
      { text: 'Пройти мимо', outcomes: { successChance: 100, success: { text: 'Не твоё дело. Или уже твоё?', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'CRIM_002', category: 'Криминал', title: 'Кража на рынке',
    triggerConditions: { locations: ['dumpsters'], satietyMax: 30 },
    description: 'На рынке торгуют фруктами. Ящик яблок стоит у края прилавка. Продавщица отвернулась.',
    choices: [
      { text: 'Схватить и бежать', outcomes: { successChance: 50, success: { text: 'Ты схватил три яблока и нырнул в толпу. Удача!', stats: { satiety: 20, authority: -5 } }, fail: { text: 'Тебя поймали. Продавщица вызвала охрану. Избили.', stats: { health: -20, morale: -15 } } } },
      { text: 'Попросить "брак" — гнилые', outcomes: { successChance: 60, success: { text: '"Бери, выкидывать всё равно." Она дала пакет с подпорченными.', stats: { satiety: 15, morale: 5 } }, fail: { text: '"Вон отсюда! Вор!" Крик, стыд.', stats: { morale: -10 } } } },
      { text: 'Не воровать', outcomes: { successChance: 100, success: { text: 'Голодно, но совесть чиста.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 8: РАБОТА ===
  {
    id: 'WORK_001', category: 'Работа', title: 'Разгрузка фургонов',
    triggerConditions: { locations: ['construction'], timeOfDay: ['утро', 'день'] },
    description: 'Прораб ищет грузчиков на час. "500 рублей, но быстро. Кто?"',
    choices: [
      { text: 'Взяться за работу', outcomes: { successChance: 75, success: { text: 'Спина ломит, но в кармане 500 рублей. И дали обед!', stats: { satiety: 20, health: -5 } }, fail: { text: 'Не выдержал. Спина не та. Прораб выгнал без оплаты.', stats: { health: -15, morale: -10 } } } },
      { text: 'Попросить аванс', outcomes: { successChance: 30, success: { text: '"Ладно, 200 вперед." Ты отработал остаток.', stats: { satiety: 20, health: -5 } }, fail: { text: '"Аванс?! Иди отсюда, бездомный!"', stats: { morale: -10 } } } },
      { text: 'Отказаться', outcomes: { successChance: 100, success: { text: 'Сил нет. Может, в другой раз.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'WORK_002', category: 'Работа', title: 'Уборка снега',
    triggerConditions: { seasons: ['Зима'], locations: ['construction', 'station'] },
    description: 'ЖЭК ищет тех, кто уберёт снег за 300 рублей. Лопату дадут.',
    choices: [
      { text: 'Работать', outcomes: { successChance: 80, success: { text: 'Два часа работы. 300 рублей и горячий чай из термоса.', stats: { health: -5, satiety: 10, warmth: 10 } }, fail: { text: 'Поскользнулся, упал на лопату. Больно.', stats: { health: -15 } } } },
      { text: 'Отказаться', outcomes: { successChance: 100, success: { text: 'Слишком холодно для работы.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'WORK_003', category: 'Работа', title: 'Сбор металлолома',
    triggerConditions: { locations: ['abandoned', 'construction'] },
    description: 'В заброшке полно металлического хлама. Если собрать и сдать — будут деньги.',
    choices: [
      { text: 'Собрать и сдать', outcomes: { successChance: 90, success: { text: 'Килограмм 20 железа. На скупке дали 400 рублей.', stats: { health: -5 } }, fail: { text: 'Порезался о ржавый лист. Но металл сдал.', stats: { health: -10 } } } },
      { text: 'Собрать побольше, но нелегально', outcomes: { successChance: 50, success: { text: 'Натаскал целую тележку. 800 рублей! Но это чья-то территория...', stats: { authority: -5 } }, fail: { text: 'Хозяин территории поймал. Отнял всё и дал в глаз.', stats: { health: -20, morale: -15 } } } }
    ]
  },

  // === КАТЕГОРИЯ 9: ТЕРРИТОРИИ ===
  {
    id: 'TERR_001', category: 'Территории', title: 'Драка за мусорный бак',
    triggerConditions: { locations: ['dumpsters'] },
    description: 'Какой-то здоровый бомж утверждает, что этот бак — его территория. "Это моё место! Уходи, пока цел!"',
    choices: [
      { text: 'Уйти — не стоит рисковать', outcomes: { successChance: 100, success: { text: 'Ты ушёл. Мусорных баков в городе много.', stats: { morale: -5, authority: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Встать в позу — "Я тут первый"', outcomes: { successChance: 40, success: { text: 'Он попятился. "Ладно, копай." Ты победил.', stats: { authority: 15, morale: 10 } }, fail: { text: 'Он ударил. Ты упал. Он забрал твою сумку.', stats: { health: -25, morale: -20 } } } },
      { text: 'Предложить делить поровну', outcomes: { successChance: 55, success: { text: '"Ну... давай." Он неохотно согласился. Справедливо.', stats: { authority: 5, satiety: 10 } }, fail: { text: '"Делить?! С таким как ты?!" Он замахнулся.', stats: { health: -10, morale: -10 } } } }
    ]
  },
  {
    id: 'TERR_002', category: 'Территории', title: 'Поджог картонажки',
    triggerConditions: { locations: ['abandoned', 'park'], timeOfDay: ['ночь'] },
    description: 'Ты проснулся от запаха дыма. Кто-то поджёг картонки соседского бомжа. Огонь быстро распространяется.',
    choices: [
      { text: 'Тушить', outcomes: { successChance: 50, success: { text: 'Ты забросал огонь снегом и землёй. Сосед благодарен.', stats: { authority: 15, warmth: -10 } }, fail: { text: 'Огонь слишком сильный. Ты обжёг руки.', stats: { health: -15 } } } },
      { text: 'Забрать его вещи, пока он в панике', outcomes: { successChance: 60, success: { text: 'Пока он тушит, ты утащил его одеяло и бутылку.', stats: { warmth: 15, authority: -15 } }, fail: { text: 'Он заметил. Драка. Ты проиграл.', stats: { health: -20, authority: -10 } } } },
      { text: 'Убежать подальше от огня', outcomes: { successChance: 100, success: { text: 'Безопасность прежде всего. Пусть сами разбираются.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 10: ТРАНСПОРТ ===
  {
    id: 'TRANS_001', category: 'Транспорт', title: 'Заяц в электричке',
    triggerConditions: { locations: ['station'] },
    description: 'Электричка отходит. Можно проскочить без билета — в соседнем городе тёплые перроны и добрые люди.',
    choices: [
      { text: 'Проскочить в вагон', outcomes: { successChance: 55, success: { text: 'Проскочил! Едешь, греешься. Контролёр не дошёл до твоего вагона.', stats: { warmth: 15 } }, fail: { text: 'Контролёр высадил на следующей станции. Штраф 500 рублей.', stats: { morale: -15 } } } },
      { text: 'Попросить машиниста подвезти', outcomes: { successChance: 20, success: { text: '"Садись в кабину, дед." Он подвёз тебя бесплатно.', stats: { warmth: 20, morale: 15 } }, fail: { text: '"Нет, брат, не могу." Отказ.', stats: { morale: -5 } } } },
      { text: 'Не рисковать', outcomes: { successChance: 100, success: { text: 'Остаёшься здесь. Безопасно, но холодно.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 11: ТОРГОВЛЯ ===
  {
    id: 'TRADE_001', category: 'Торговля', title: 'Обман на скупке',
    triggerConditions: { locations: ['pawnshop'] },
    description: 'Сдаёшь металл. Хозяин скупки смотрит на весы и говорит: "5 кило, 100 рублей." Ты уверен, что там 10.',
    choices: [
      { text: 'Спорить и требовать перевесить', outcomes: { successChance: 50, success: { text: '"Ладно, 10 кило, 200." Он нехотя пересчитал.', stats: { morale: 10, authority: 5 } }, fail: { text: '"Не нравится — иди в другое место." Ты ушёл ни с чем.', stats: { morale: -10 } } } },
      { text: 'Согласиться — лишь бы деньги', outcomes: { successChance: 100, success: { text: '100 рублей. Мало, но хоть что-то.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Пригрозить полицией за обвес', outcomes: { successChance: 30, success: { text: 'Он побледнел. "Ладно-ладно, 200, только не шуми."', stats: { authority: 10 } }, fail: { text: '"Давай, вызывай. Тут все свои." Тебя выгнали.', stats: { morale: -15 } } } }
    ]
  },

  // === КАТЕГОРИЯ 12: ПСИХИКА ===
  {
    id: 'PSY_001', category: 'Психика', title: 'Голос матери',
    triggerConditions: { moraleMax: 25 },
    description: 'Ночью ты слышишь мамин голос. Она зовёт тебя домой. "Сынок, иди домой. Я приготовила ужин." Но мамы нет уже 10 лет.',
    choices: [
      { text: 'Пойти на голос', outcomes: { successChance: 100, success: { text: 'Ты шёл и шёл. Нашёл стену тупика. Голос замолк. Ты плакал до рассвета.', stats: { morale: -10, health: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Закрыть уши и повторять "это не реально"', outcomes: { successChance: 60, success: { text: 'Ты справился. Галлюцинация отступила. Ты сильнее.', stats: { morale: 15 } }, fail: { text: 'Голос стал громче. Ты не смог его заглушить.', stats: { morale: -15 } } } },
      { text: 'Поговорить с "мамой"', outcomes: { successChance: 100, success: { text: '"Мам, я не могу прийти. Прости." Голос затих. Ты чувствуешь странное облегчение.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'PSY_002', category: 'Психика', title: 'Чёрная собака',
    triggerConditions: { moraleMax: 30, timeOfDay: ['ночь'] },
    description: 'На перекрёстке стоит чёрная собака. Не лает, не шевелится. Просто смотрит. Её глаза — как два красных уголька.',
    choices: [
      { text: 'Пройти мимо', outcomes: { successChance: 70, success: { text: 'Ты прошёл. Собака исчезла. Может, показалось.', stats: { morale: -5 } }, fail: { text: 'Она завыла. Звук пронзил мозг. Ты бежал до самой заброшки.', stats: { morale: -15, health: -5 } } } },
      { text: 'Посмотреть в глаза', outcomes: { successChance: 40, success: { text: 'В её глазах ты увидел... себя. Молодого. В чистой одежде. Это было видение прошлого.', stats: { morale: 10 } }, fail: { text: 'В глазах — только тьма. Ты упал на колени. Утром нашёл себя на асфальте.', stats: { health: -10, morale: -10 } } } },
      { text: 'Позвать её — "Пойдём, пёс"', outcomes: { successChance: 50, success: { text: 'Собака подошла. Тёплая, живая. Может, это просто собака. Она легла рядом.', stats: { morale: 20, warmth: 5 } }, fail: { text: 'Она растворилась в тумане. Ты стоишь один.', stats: { morale: -10 } } } }
    ]
  },

  // === КАТЕГОРИЯ 13: ЖИЛЬЁ ===
  {
    id: 'HOME_001', category: 'Жильё', title: 'Поиск картона',
    triggerConditions: { locations: ['dumpsters', 'construction'], warmthMax: 40 },
    description: 'Ночь будет холодной. Нужен картон — подстелить, укрыться. Но хороший картон разбирают быстро.',
    choices: [
      { text: 'Искать у магазинов', outcomes: { successChance: 70, success: { text: 'Нашёл большие листы у мебельного. Отличный "матрас".', stats: { warmth: 15 } }, fail: { text: 'Всё разобрали. Только мокрая бумага.', stats: { warmth: 5, health: -5 } } } },
      { text: 'Разобрать чей-то "дом"', outcomes: { successChance: 80, success: { text: 'Хозяин не заметил. У тебя теперь двойной картон.', stats: { warmth: 20, authority: -10 } }, fail: { text: 'Хозяин вернулся. Драка за картон.', stats: { health: -15, warmth: 5 } } } },
      { text: 'Попросить у соседа', outcomes: { successChance: 45, success: { text: '"На, брат, бери половину." Добрый человек.', stats: { warmth: 10, authority: 5 } }, fail: { text: '"Сам без картона сижу. Ищи."', stats: { morale: -5 } } } }
    ]
  },
  {
    id: 'HOME_002', category: 'Жильё', title: 'Крысы в трубах',
    triggerConditions: { locations: ['abandoned'], timeOfDay: ['ночь'] },
    description: 'Ночью из стен доносится писк и шуршание. Крысы. Много крыс. Одна уже бежит к твоей ноге.',
    choices: [
      { text: 'Проигнорировать и спать', outcomes: { successChance: 50, success: { text: 'Привык. Они тоже привыкли. Соседи по несчастью.', stats: { morale: -5 } }, fail: { text: 'Крыса укусила. Больно. Рана горит.', stats: { health: -15, morale: -10 } } } },
      { text: 'Разогнать палкой', outcomes: { successChance: 70, success: { text: 'Ты помахал палкой — они разбежались. Тишина.', stats: { warmth: 5 } }, fail: { text: 'Они не боятся. Их слишком много. Ты ушёл искать другое место.', stats: { warmth: -10, morale: -10 } } } },
      { text: 'Уйти спать на вокзал', outcomes: { successChance: 100, success: { text: 'Лучше рискнуть с охраной, чем с крысами. Вокзал теплее.', stats: { warmth: 15, health: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 14: ЦЕРКОВЬ И ГОСУДАРСТВО ===
  {
    id: 'CHURCH_001', category: 'Церковь', title: 'Паспорт',
    triggerConditions: { locations: ['shelter', 'station'] },
    description: 'Волонтёр говорит: "У нас есть юрист. Он может помочь восстановить паспорт. Это бесплатно. Но нужно не пить месяц."',
    choices: [
      { text: 'Согласиться', outcomes: { successChance: 60, success: { text: 'Ты записался. Впервые за годы — шанс на документы. Надежда.', stats: { morale: 30 } }, fail: { text: 'Ты записался, но сомневаешься. Сможешь ли не пить?', stats: { morale: 10 } } } },
      { text: '"Не мой формат"', outcomes: { successChance: 100, success: { text: 'Волонтёр грустно кивает. "Если передумаете..."', stats: { morale: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Попросить еды вместо документов', outcomes: { successChance: 100, success: { text: '"Хорошо, вот вам обед." Документы подождут.', stats: { satiety: 20 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'CHURCH_002', category: 'Церковь', title: 'Исповедь',
    triggerConditions: { locations: ['shelter'], moraleMax: 40 },
    description: 'Батюшка зовёт на исповедь. "Заходи, сын мой. Расскажи, что на душе."',
    choices: [
      { text: 'Рассказать всё', outcomes: { successChance: 100, success: { text: 'Ты говорил час. О прошлом, о вине, о детях. Батюшка обнял. "Бог простит."', stats: { morale: 30 } }, fail: { text: '', stats: {} } } },
      { text: 'Отказаться', outcomes: { successChance: 100, success: { text: '"Не готов, батюшка." Он кивнул: "Двери открыты всегда."', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 15: ВОСПОМИНАНИЯ ===
  {
    id: 'MEM_001', category: 'Воспоминания', title: 'Бывший коллега',
    triggerConditions: { locations: ['station'] },
    description: 'Из толпы выходит человек в пальто. Ты узнаёшь его — бывший коллега по заводу! Он увидел тебя и замер.',
    choices: [
      { text: 'Поздороваться', outcomes: { successChance: 100, success: { text: '"Ваня?! Это ты?!" Он обнял. Дал 1000 рублей. "Держись, брат." Стыдно, но тепло на душе.', stats: { morale: 15 } }, fail: { text: '', stats: {} } } },
      { text: 'Отвернуться', outcomes: { successChance: 100, success: { text: 'Ты сделал вид, что не узнал. Он прошёл мимо. Стыд жжёт.', stats: { morale: -15 } }, fail: { text: '', stats: {} } } },
      { text: 'Попросить денег', outcomes: { successChance: 50, success: { text: '"Ваня... помоги." Он дал 500 рублей и вздохнул.', stats: { morale: -5 } }, fail: { text: 'Он быстро отошёл, делая вид, что не слышал. Больно.', stats: { morale: -20 } } } }
    ]
  },
  {
    id: 'MEM_002', category: 'Воспоминания', title: 'Фотография в кармане',
    triggerConditions: { moraleMax: 50 },
    description: 'Роясь в старой куртке, ты находишь фотографию. Жена, дочь, ты — на даче. Всё это было. Всё это кончилось.',
    choices: [
      { text: 'Спрятать обратно', outcomes: { successChance: 100, success: { text: 'Не сейчас. Не можешь сейчас.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } },
      { text: 'Рассмотреть внимательно', outcomes: { successChance: 100, success: { text: 'Дочке было пять. Она смеялась. Ты помнишь этот день. Слёзы капают на фото.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Порвать', outcomes: { successChance: 100, success: { text: 'Ты рвёшь фото. Кусочки летят в лужу. Прошлое — в прошлом. Но почему так больно?', stats: { morale: -20 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'MEM_003', category: 'Воспоминания', title: 'Песня из окна',
    triggerConditions: { locations: ['station', 'park'], timeOfDay: ['вечер'] },
    description: 'Из окна дома доносится песня. Та самая, что играла на твоей свадьбе. Ноги приросли к асфальту.',
    choices: [
      { text: 'Стоять и слушать', outcomes: { successChance: 100, success: { text: 'Ты стоял пока песня не кончилась. Потом ещё стоял. Мир стал чуть тише.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Уйти быстрее', outcomes: { successChance: 100, success: { text: 'Нельзя. Нельзя вспоминать. Ты зашагал быстрее.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } },
      { text: 'Подпеть тихо', outcomes: { successChance: 100, success: { text: 'Ты пел тихо, почти шёпотом. Голос хриплый, но мелодия — та самая. На мгновение ты был собой.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // Дополнительные сценарии
  {
    id: 'FOOD_005', category: 'Поиск еды', title: 'Суп из ночлежки',
    triggerConditions: { locations: ['shelter'], timeOfDay: ['день', 'вечер'] },
    description: 'В ночлежке раздают суп. Очередь из 20 человек. Стоять долго, но суп горячий.',
    choices: [
      { text: 'Встать в очередь', outcomes: { successChance: 90, success: { text: 'Дождался. Миска горячей баланды. Не ресторан, но согревает.', stats: { satiety: 25, warmth: 10 } }, fail: { text: 'Еда кончилась до тебя. Завтра раньше приходить.', stats: { morale: -10, satiety: -5 } } } },
      { text: 'Попроситься без очереди — "я замёрз"', outcomes: { successChance: 30, success: { text: 'Повар сжалился. "Ладно, на, брат." Дали миску.', stats: { satiety: 25, warmth: 10, authority: 5 } }, fail: { text: '"Все мёрзнут. В очередь." Очередь шипит.', stats: { morale: -10 } } } }
    ]
  },
  {
    id: 'POL_003', category: 'Полиция', title: 'Документы',
    triggerConditions: { locations: ['station', 'park'] },
    description: 'Полицейский проверяет документы. "Паспорт покажи." А паспорта нет. Давно нет.',
    choices: [
      { text: '"Потерял, товарищ"', outcomes: { successChance: 50, success: { text: '"Иди отсюда. И не попадайся." Отпустили.', stats: { morale: 5 } }, fail: { text: '"В участок для установления личности." Ночь в камере.', stats: { warmth: -20, morale: -15, health: -5 } } } },
      { text: 'Бежать', outcomes: { successChance: 55, success: { text: 'Ты рванул в переулок. Не догнали!', stats: { health: -10 } }, fail: { text: 'Скрутили. За сопротивление — наручники и участок.', stats: { health: -20, morale: -20 } } } },
      { text: 'Показать любой документ', outcomes: { successChance: 35, success: { text: 'Старый проездной. Полицейский не разглядел. "Иди."', stats: { morale: 5 } }, fail: { text: '"Это что за шутка?" Забрали в участок.', stats: { morale: -15, warmth: -15 } } } }
    ]
  },
  {
    id: 'HOME_003', category: 'Жильё', title: 'Костёр из паллетов',
    triggerConditions: { locations: ['construction', 'abandoned', 'park'] },
    description: 'Нужно развести огонь. Рядом деревянные поддоны. Но костёр на улице — это риск.',
    choices: [
      { text: 'Развести костёр', outcomes: { successChance: 75, success: { text: 'Огонь! Тепло! Ты греешь руки и сушишь одежду.', stats: { warmth: 25, morale: 10 } }, fail: { text: 'Дрова сырые. Много дыма, мало тепла. Глаза слезятся.', stats: { warmth: 5, health: -5 } } } },
      { text: 'Не рисковать — полиция приедет', outcomes: { successChance: 100, success: { text: 'Мудро. Или трусливо. Зависит от точки зрения.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'NPC_004', category: 'NPC', title: 'Доктор на районе',
    triggerConditions: { locations: ['park', 'abandoned'], healthMax: 40 },
    description: 'Местный врач-пенсионер, Пална, подзывает тебя. "Иди сюда, покажу тебе кое-что." У него есть аптечка.',
    choices: [
      { text: 'Пойти', outcomes: { successChance: 85, success: { text: 'Пална обработал раны, дал таблетки. "Береги себя, сынок."', stats: { health: 20, morale: 10 } }, fail: { text: 'Он просто хотел поговорить. Но таблетки всё равно дал.', stats: { health: 10, morale: 5 } } } },
      { text: 'Не доверять', outcomes: { successChance: 100, success: { text: 'Мало ли что. Ты ушёл. Здоровье подождёт.', stats: { health: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'ALC_004', category: 'Алкоголь', title: 'Настойка боярышника',
    triggerConditions: { sobrietyMax: 20, locations: ['pawnshop'] },
    description: 'В аптеке продают настойку боярышника за копейки. Это не водка, но... 100 мл и полегчает.',
    choices: [
      { text: 'Купить и выпить', outcomes: { successChance: 100, success: { text: 'Горько. Но полегчало. Руки не трясутся.', stats: { sobriety: 20, health: -10 } }, fail: { text: '', stats: {} } } },
      { text: 'Не унижаться', outcomes: { successChance: 100, success: { text: 'Боярышник — это дно. Ты ещё не на самом дне. Или уже?', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'WTH_003', category: 'Погода', title: 'Оттепель',
    triggerConditions: { seasons: ['Зима', 'Весна'] },
    description: 'Снег тает. Везде слякоть. Промокнуть легко — а потом замёрзнуть. Лужи по щиколотку.',
    choices: [
      { text: 'Искать сухое место', outcomes: { successChance: 70, success: { text: 'Нашёл козырёк у магазина. Сухо и относительно тепло.', stats: { warmth: 5 } }, fail: { text: 'Все места заняты. Мокрые ноги — плохой знак.', stats: { warmth: -10, health: -5 } } } },
      { text: 'Переждать в помещении', outcomes: { successChance: 80, success: { text: 'Зашёл в подъезд. Сушишь носки на батарее.', stats: { warmth: 15, hygiene: 5 } }, fail: { text: 'Жильцы выгнали. "Нечего тут мокнуть!"', stats: { morale: -10 } } } }
    ]
  },
  {
    id: 'CRIM_003', category: 'Криминал', title: 'Найти кошелёк',
    triggerConditions: { locations: ['station', 'park'] },
    description: 'На асфальте лежит кошелёк. Внутри — 2000 рублей и чья-то фотография. Чужие деньги.',
    choices: [
      { text: 'Забрать себе', outcomes: { successChance: 100, success: { text: '2000 рублей. Целое состояние. Но совесть... она молчит? Нет.', stats: { morale: -10, authority: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Попытаться найти хозяина', outcomes: { successChance: 40, success: { text: 'Нашёл владельца по документам. Он дал 500 в благодарность. Честные деньги!', stats: { morale: 25, authority: 10 } }, fail: { text: 'Не нашёл. Деньги остались у тебя. Или ты их выбросил?', stats: { morale: 5 } } } },
      { text: 'Оставить на видном месте', outcomes: { successChance: 100, success: { text: 'Положил на скамейку. Кто найдёт — тому и радость.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'PSY_003', category: 'Психика', title: 'Смех без причины',
    triggerConditions: { moraleMax: 20 },
    description: 'Ты начинаешь смеяться. Просто так. На улице. Без причины. Люди обходят тебя стороной. Смех не останавливается.',
    choices: [
      { text: 'Остановиться силой воли', outcomes: { successChance: 45, success: { text: 'Ты сжал кулаки и замолчал. Мир поплыл, но ты держишься.', stats: { morale: 5, health: -5 } }, fail: { text: 'Не можешь. Смех переходит в рыдания. Люди смотрят.', stats: { morale: -15 } } } },
      { text: 'Смеяться дальше', outcomes: { successChance: 100, success: { text: 'Пусть смотрят. Пусть боятся. Ты свободен от их мнений.', stats: { authority: 5, morale: -5 } }, fail: { text: '', stats: {} } } },
      { text: 'Уйти в безлюдное место', outcomes: { successChance: 80, success: { text: 'Ты ушёл за гаражи. Там можно. Смех сменился тишиной.', stats: { morale: 5 } }, fail: { text: 'Ты упал на колени и бился головой о стену. Долго.', stats: { health: -10, morale: -10 } } } }
    ]
  },
  {
    id: 'WORK_004', category: 'Работа', title: 'Мойка посуды',
    triggerConditions: { locations: ['dumpsters'], timeOfDay: ['день', 'вечер'] },
    description: 'Ресторан ищет мойщика посуды. За 500 рублей и ужин. Работа грязная, но легальная.',
    choices: [
      { text: 'Согласиться', outcomes: { successChance: 70, success: { text: 'Три часа у раковины. Руки в морщинах, но 500 рублей и полная тарелка еды!', stats: { satiety: 30, health: -5 } }, fail: { text: 'Повар посмотрел на твои руки: "Нет, не могу. Иди отсюда."', stats: { morale: -15 } } } },
      { text: 'Попросить 700', outcomes: { successChance: 20, success: { text: '"Ну ладно, 700. Но чтобы быстро!"', stats: { satiety: 30, health: -5 } }, fail: { text: '"700?! За такую работу? Вали отсюда."', stats: { morale: -10 } } } }
    ]
  },
  {
    id: 'TRANS_002', category: 'Транспорт', title: 'Теплушка товарного поезда',
    triggerConditions: { locations: ['construction', 'station'] },
    description: 'На путях стоит товарняк. В одном из вагонов — солома и тепло. Можно уехать в другой город.',
    choices: [
      { text: 'Забраться в вагон', outcomes: { successChance: 65, success: { text: 'Ты в вагоне. Солома, тепло, стук колёс. Ты едешь куда-то.', stats: { warmth: 20, morale: 10 } }, fail: { text: 'Охрана заметила. "Стой! А ну вылез!" Выгнали.', stats: { morale: -10 } } } },
      { text: 'Не рисковать', outcomes: { successChance: 100, success: { text: 'Поезд уходит. Ты остаёшься. Может, к лучшему.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'HOME_004', category: 'Жильё', title: 'Ночлег в подъезде',
    triggerConditions: { locations: ['station', 'park'], timeOfDay: ['ночь', 'вечер'], warmthMax: 40 },
    description: 'Нужно переспать. Подъезд — тепло, но жильцы могут вызвать полицию. Лестничная клетка — компромисс.',
    choices: [
      { text: 'Зайти на последний этаж', outcomes: { successChance: 60, success: { text: 'Тихо. Тепло от батарей. Ты спишь под дверью. Утром никто не заметил.', stats: { warmth: 20, health: 5 } }, fail: { text: 'Жилец открыл дверь в 3 ночи. "Кто тут?! Милицию вызову!" Ты бежал.', stats: { warmth: -10, morale: -10 } } } },
      { text: 'Спать на лестничной площадке', outcomes: { successChance: 80, success: { text: 'Холодновато, но безопасно. Проспал до утра.', stats: { warmth: 10 } }, fail: { text: 'Наркоманы на площадке. Пришлось уйти ночью.', stats: { warmth: -5, morale: -10 } } } }
    ]
  },
  {
    id: 'CHURCH_003', category: 'Церковь', title: 'Реабилитация',
    triggerConditions: { locations: ['shelter'], moraleMin: 30 },
    description: 'В церкви есть программа реабилитации. 3 месяца, бесплатно, без алкоголя. "Мы поможем тебе вернуться к жизни."',
    choices: [
      { text: 'Согласиться', outcomes: { successChance: 100, success: { text: 'Ты записался. Это шанс. Может, последний. 90 дней без водки.', stats: { morale: 30 } }, fail: { text: '', stats: {} } } },
      { text: '"Я не алкоголик"', outcomes: { successChance: 100, success: { text: 'Батюшка усмехнулся: "Кто не алкоголик — тот не был на улице." Ты задумался.', stats: { morale: 5 } }, fail: { text: '', stats: {} } } },
      { text: '"Позже. Не сейчас"', outcomes: { successChance: 100, success: { text: '"Двери открыты. Приходи."', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'MEM_004', category: 'Воспоминания', title: 'Запах хлеба',
    triggerConditions: { locations: ['dumpsters', 'station'], satietyMax: 30 },
    description: 'Из пекарни несёт свежим хлебом. Этот запах — как из детства. Мама пекла по воскресеньям.',
    choices: [
      { text: 'Стоять и вдыхать', outcomes: { successChance: 100, success: { text: 'Ты стоял у вентиляции пекарни 10 минут. Запах хлеба — лучшее, что есть в мире.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } },
      { text: 'Попросить вчерашний', outcomes: { successChance: 60, success: { text: 'Пекарь вынес пакет с чёрствым, но ещё хорошим хлебом. "На, брат."', stats: { satiety: 20, morale: 10 } }, fail: { text: '"Всё раздали. Приходи завтра." Завтра — это целая вечность.', stats: { morale: -5 } } } }
    ]
  }
];

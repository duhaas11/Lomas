  },

  // === КАТЕГОРИЯ 16: ЛОХАТРОН (казино) ===
  {
    id: 'GAM_001', category: 'Лохатрон', title: 'Лохотрон',
    triggerConditions: { locations: ['station'], moneyMin: 100 },
    description: 'У перехода мужик раскладывает на газетке три напёрстка и шарик. "Три рубля — сто рублей! Купи билет в новую жизнь!" Вокруг толпа азартных рожей. Ты знаешь, что это развод. Но вдруг повезёт?',
    choices: [
      { text: 'Сыграть на 100 рублей', outcomes: { successChance: 30, success: { text: 'Шарик оказался под нужным напёрстком! Мужик побледнел и отдал 400 рублей. "Чтоб тебя..."', stats: { money: 300, morale: 10 } }, fail: { text: 'Ты выбрал не тот. Мужик сгреб газету и растворился в толпе. Как всегда.', stats: { money: -100, morale: -10 } } } },
      { text: 'Сыграть по-крупному — 500 рублей', outcomes: { successChance: 15, success: { text: 'НЕВЕРОЯТНО. Шарик там, где ты сказал. Толпа ахает. Тебя отпускают с двумя тысячами.', stats: { money: 1500, morale: 20, authority: 10 } }, fail: { text: '500 рублей испарились за секунду. Руки трясутся. Надо было уходить.', stats: { money: -500, morale: -20 } } } },
      { text: 'Пройти мимо', outcomes: { successChance: 100, success: { text: '"Обойдусь." Ты знаешь, где настоящий выигрыш — он в мусорном баке надёжнее.', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'GAM_002', category: 'Лохатрон', title: 'Карты в заброшке',
    triggerConditions: { locations: ['abandoned'], moneyMin: 200 },
    description: 'В подвале заброшки горит коптилка. За фанерным столом — карточная игра. Ставки — бутылки, еда, деньги. Михалыч подмигивает: "Садись, новичкам везёт."',
    choices: [
      { text: 'Сесть играть на 200 рублей', outcomes: { successChance: 45, success: { text: 'Карты легли. Плюс четыреста и уважение пацанов.', stats: { money: 200, morale: 15, authority: 10 } }, fail: { text: 'Тебя разделали под ноль. Или просто не повезло. На душе паршиво.', stats: { money: -200, morale: -15 } } } },
      { text: 'Смотреть со стороны', outcomes: { successChance: 100, success: { text: 'Ты заметил шулерский приём — карту из рукава. Опыт. Теперь ты умнее.', stats: { morale: 5, authority: 5 } }, fail: { text: '', stats: {} } } },
      { text: 'Обвинить шулера', outcomes: { successChance: 35, success: { text: '"Он прячет!" Толпа окрутила шулера. Тебе вернули ставку. Авторитет!', stats: { money: 200, authority: 20 } }, fail: { text: '"Ты нас за дураков держишь?" Тебя вынесли на улицу за шкирку.', stats: { health: -15, morale: -10 } } } }
    ]
  },

  // === КАТЕГОРИЯ 17: ЖЕНЩИНЫ ===
  {
    id: 'WOM_001', category: 'Женщины', title: 'Настя с рынка',
    triggerConditions: { locations: ['dumpsters', 'station'] },
    description: 'Женщина лет сорока, торгующая у рынка вяленой рыбой, каждый день молча кидает тебе огрызки и головы. Сегодня она задержала на тебе взгляд: "Голодный?" Голос хриплый, глаза добрые и усталые.',
    choices: [
      { text: '"Спасибо, Настя" — запомнил имя', outcomes: { successChance: 100, success: { text: 'Она удивлена: "Помнишь, значит." Улыбнулась впервые. И добавила к огрызкам целую рыбину.', stats: { satiety: 15, morale: 15 } }, fail: { text: '', stats: {} } } },
      { text: 'Пошутить: "Записываю вас в жёны"', outcomes: { successChance: 40, success: { text: 'Она рассмеялась так, что оборачивались прохожие. "Приходи, когда помоете полы." Шутка, но ты запомнил.', stats: { morale: 20, authority: 5 } }, fail: { text: '"Иди отсюда, пьянь." Глаза стали холодными. Огрызков сегодня не будет.', stats: { morale: -15 } } } },
      { text: 'Промолчать — стыдно', outcomes: { successChance: 100, success: { text: 'От таких, как ты, отводят глаза. Она права. Ты взял огрызок и ушёл.', stats: { satiety: 10, morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'WOM_002', category: 'Женщины', title: 'Ночная знакомая',
    triggerConditions: { locations: ['park', 'abandoned'], timeOfDay: ['вечер', 'ночь'], sobrietyMax: 50 },
    description: 'У костра сидит женщина. Седые пряди, когда-то красивое лицо, бутылка портвейна пополам. "Мерзнешь, родной? Садись. Меня Люба зовут."',
    choices: [
      { text: 'Сесть греться и поболтать', outcomes: { successChance: 100, success: { text: 'Люба рассказала, как потеряла квартиру из-за сына. Ты — как потерял всё. Чай из жестяной банки был почти как дома.', stats: { morale: 25, warmth: 10 } }, fail: { text: '', stats: {} } } },
      { text: 'Предложить разделить бутылку', outcomes: { successChance: 70, success: { text: 'Вы допили портвейн, болтая о жизни. Тепло, даже если не от огня.', stats: { sobriety: -25, morale: 15, warmth: 5 } }, fail: { text: 'Она прижала бутылку к себе: "Не допивайся, я её до утра берегу." Обидно.', stats: { morale: -10 } } } },
      { text: 'Уйти — нельзя отвлекаться', outcomes: { successChance: 100, success: { text: 'Ты кивнул и пошёл. Привязанности на улице — роскошь, которую никто не переживал дважды.', stats: { morale: -5, health: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 18: СОБАКА ===
  {
    id: 'DOG_001', category: 'Собака', title: 'Пёс у ларька',
    triggerConditions: { locations: ['pawnshop', 'dumpsters'] },
    description: 'Из-за ларька выползает тощий пёс с обломанным ухом. Он не просит еду — он просто садится рядом и смотрит. Как будто знает тебя. Хозяин у него? Был. Как и у тебя.',
    choices: [
      { text: 'Отдать половину своей еды', outcomes: { successChance: 100, success: { text: 'Пёс жадно умял еду, а потом положил морду тебе на колено. Он остаётся. Теперь вас двое. Назовёшь его Гошей.', stats: { satiety: -10, morale: 25 } }, fail: { text: '', stats: {} } } },
      { text: 'Погладить и пойти дальше', outcomes: { successChance: 100, success: { text: '"Ищи хозяина, брат." Пёс тявкнул вслед. Может, ещё увидитесь.', stats: { morale: 10 } }, fail: { text: '', stats: {} } } },
      { text: 'Прогнать — лишняя пасть', outcomes: { successChance: 100, success: { text: 'Пёс отошёл на несколько шагов и сел. Не уходит. Смотрит. Совести некуда деться.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'DOG_002', category: 'Собака', title: 'Верный друг',
    triggerConditions: { flags: { has_dog: true } },
    description: 'Гоша поднимает голову и принюхивается. Потом срывается с места и тянет тебя за рукав к переулку. Там, у стены, спит мужик, а над ним нависает другой — с занесённой рукой. Твои вещи лежат рядом.',
    choices: [
      { text: 'Рвануть на помощь Гоше', outcomes: { successChance: 80, success: { text: 'Гоша залаял так, что тот отскочил. Ты успел схватить куртку. Вор свалил. Гоша гордо фыркает.', stats: { morale: 15, authority: 5 } }, fail: { text: 'Вор ударил Гошу палкой. Тот взвизгнул. Ты бросился в драку и отбил его, но получил по зубам.', stats: { health: -15, morale: 5 } } } },
      { text: 'Позвать соседей', outcomes: { successChance: 65, success: { text: 'Трое вышли из укрытий. Вору пришлось ретироваться. Гоша цел, вещи целы. Стая — сила.', stats: { authority: 15, morale: 10 } }, fail: { text: 'Никто не вышел. Пока вы звали, вор скрылся с твоей бутылкой.', stats: { morale: -10 } } } }
    ]
  },
  {
    id: 'DOG_003', category: 'Собака', title: 'Гоша болеет',
    triggerConditions: { flags: { has_dog: true }, seasons: ['Зима', 'Осень'] },
    description: 'Гоша весь день не встаёт. Нос горячий, глаза сухие. Он скулит во сне. Уличная собака зимой — это приговор, если не помочь. А помощи ждать неоткуда. Кроме тебя.',
    choices: [
      { text: 'Отнести к ветеринару при ночлежке', outcomes: { successChance: 70, success: { text: '"Бесплатно для ваших?" — он усмехнулся, но осмотрел. Укол, тепло. Гоша ожил.', stats: { morale: 20 } }, fail: { text: 'Ветеринара не оказалось. Пришлось греть Гошу самому, у груди. К утру ему лучше.', stats: { warmth: -15, morale: 5 } } } },
      { text: 'Завернуть в свой бушлат и греть', outcomes: { successChance: 60, success: { text: 'Двое под одним бушлатом теплее, чем одному. Гоша дрожит, но дышит ровно. Вы оба выстоите.', stats: { warmth: -10, morale: 15 } }, fail: { text: 'Сам свалился с температурой. Но Гоша жив. Оно того стоило?', stats: { health: -20, morale: 10 } } } }
    ]
  },

  // === КАТЕГОРИЯ 19: БАНКИР ===
  {
    id: 'BANK_001', category: 'Банкир', title: 'Банкир',
    triggerConditions: { locations: ['station', 'pawnshop'], moneyMin: 1000 },
    description: 'Чистый мужчина в очках без оправы сидит на корточках у перехода и рисует мелом схемы. "Ты умеешь считать деньги? Я — нет. Раньше возглавлял отдел рисков банка. Теперь крашу забор. Хочешь, научу хранить то, что найдёшь? Ящик под замком, проценты честные. Без обмана — мы оба на дне."',
    choices: [
      { text: 'Доверить ему 1000 рублей', outcomes: { successChance: 75, success: { text: 'Он завернул деньги в газету, запечатал воском от огарка. "Через неделю — 1150. Слово банкира." Через неделю слово сдержал.', stats: { money: 150, morale: 10 } }, fail: { text: 'Через неделю на этом месте была только потёкшая меловая схема. Больше ты его не видел.', stats: { money: -1000, morale: -25 } } } },
      { text: 'Спросить: "А сам-то почему здесь?"', outcomes: { successChance: 100, success: { text: 'Он долго молчал. "Поверил человеку. Единственному, кому не должен был верить." Так ты узнал историю Льва Абрамыча.', stats: { morale: 10, authority: 5 } }, fail: { text: '', stats: {} } } },
      { text: 'Не доверять никому', outcomes: { successChance: 100, success: { text: '"Деньги должны быть вот тут." Ты сжал кулак. Банкир усмехнулся: "Консерватор. Прав, кстати."', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'BANK_002', category: 'Банкир', title: 'Проценты',
    triggerConditions: { locations: ['pawnshop'], flags: { banker_met: true }, moneyMin: 500 },
    description: 'Лев Абрамыч находит тебя у скупки. "Предложение простое: ты собираешь металл, я знаю, где брать тележку и куда сдавать без обвеса. Полпрома мне, полпрома тебе. Честный бизнес на честном дне."',
    choices: [
      { text: 'Согласиться на партнёрство', outcomes: { successChance: 85, success: { text: 'За день натаскали столько, сколько один бы не собрал и за три. Скупщик не обвесил — Абрамыч знал его лично.', stats: { money: 300, morale: 15, authority: 10 } }, fail: { text: 'Тележка сломалась на середине пути. День потерян, спина ноет. Но идея жива.', stats: { health: -10, morale: -5 } } } },
      { text: 'Работать один', outcomes: { successChance: 100, success: { text: '"Как знаешь. Только помни: одиночка на дне — это мишень." Ты ушёл с мешком и без доли.', stats: { morale: 5 } }, fail: { text: '', stats: {} } } }
    ]
  },

  // === КАТЕГОРИЯ 20: СЮЖЕТ «С ДНА» (цепочка выхода) ===
  {
    id: 'STORY_01', category: 'Сюжет', title: 'Свидетель',
    triggerConditions: { locations: ['station'], storyStageMin: 0, healthMin: 40 },
    description: 'На перроне толпа. Мужчина в дорогом костюме кричит в телефон, распихивая людей. Его портфель расстёгнут. Портфель выпадает, бумаги летят в снег. Никто не видит, кроме тебя. Внутри блеснули купюры.',
    choices: [
      { text: 'Поднять портфель и вернуть', outcomes: { successChance: 100, success: { text: '"Ваш портфель, гражданин." Костюмник выхватил его, проверил. И замер, глядя на тебя. "Ты... мог украсть." — "Мог." Он сунул тебе визитку и две тысячи. "Сергей Петрович. Запомни."', stats: { money: 2000, morale: 25, authority: 10 } }, fail: { text: '', stats: {} } } },
      { text: 'Украсть, пока все в шоке', outcomes: { successChance: 50, success: { text: 'Портфель у тебя. Пересчёт за гаражами: пачка денег и документы на фирму. Это больше, чем деньги. Это рычаг.', stats: { money: 3000, morale: -15 } }, fail: { text: 'Тебя схватили за рукав. Крик, толпа, чьи-то кулаки. Портфель отобрали, тебя отпустили — брезгливо.', stats: { health: -20, morale: -20 } } } },
      { text: 'Это не мои проблемы', outcomes: { successChance: 100, success: { text: 'Ты отвернулся и пошёл к своей скамейке. Правда иногда проходит мимо тех, кто в ней нуждается.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'STORY_02', category: 'Сюжет', title: 'Дядя Гриша со стройки',
    triggerConditions: { locations: ['construction'], storyStageMin: 0, storyStageMax: 1, flags: { story_honest: true } },
    description: 'Прораб Гриша — единственный, кто не гоняет тебя со стройки за так. Сегодня он вызывает к бытовке: "Слушай, ночной сторож запил до непотопляемости. Мне нужны глаза и ноги на ночь. Триста рублей и тёплая бытовка. Ну как?"',
    choices: [
      { text: 'Согласиться — дежурить ночью', outcomes: { successChance: 90, success: { text: 'Ты обошёл периметр дважды, согнал пацанов с великами, подремал в бытовке у печки. Утром Гриша дал денег и сказал: "Ты не подвёл. Это редкость."', stats: { money: 300, morale: 20, authority: 10 } }, fail: { text: 'Ночью ты уснул и проспал воровство кабеля. Гриша не бил — просто выгнал молча. Было хуже, чем если бы бил.', stats: { morale: -20, authority: -10 } } } },
      { text: 'Сказать, что не годишься для такой работы', outcomes: { successChance: 100, success: { text: '"Как хочешь." Гриша пожал плечами. Может, это и правильно. Может, ты только что пропустил первый поезд.', stats: { morale: -5 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'STORY_03', category: 'Сюжет', title: 'Уголок',
    triggerConditions: { locations: ['shelter'], storyStageMin: 1, storyStageMax: 2, flags: { work_started: true }, moneyMin: 800 },
    description: 'Заведующая ночлежкой Анна Сергеевна стучит карандашом по столу: "Новый порядок — всех, кто работает, селят отдельно. Есть койка в подсобке за пятьсот в месяц. С тумбочкой. И ключом. Своим." Ключ. У тебя давно ничего своего не было.',
    choices: [
      { text: 'Снять уголок', outcomes: { successChance: 100, success: { text: 'Койка, тумбочка и ключ на цепочке. Первый за три года. Ложишься, смотришь на потолок — и не можешь уснуть от счастья.', stats: { money: -500, morale: 30, warmth: 20 } }, fail: { text: '', stats: {} } } },
      { text: 'Подождать — деньги нужнее', outcomes: { successChance: 100, success: { text: '"Подожду." Анна Сергеевна не осудила. Но койку отдали другому. Такие вещи не ждут.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'STORY_04', category: 'Сюжет', title: 'Документы',
    triggerConditions: { locations: ['shelter'], storyStageMin: 2, storyStageMax: 3, flags: { home_got: true }, moraleMin: 40 },
    description: 'Волонтёры приводят юриста. Он смотрит на тебя поверх очков: "Фамилия та же? Отчество? Где родился? Хорошо. Мы можем восстановить паспорт. Нужно заявление, две фотографии и терпение. Месяца два. Сможешь не пить эти два месяца?"',
    choices: [
      { text: '"Смогу. Пишите заявление."', outcomes: { successChance: 85, success: { text: 'Ты расписался дрожащей рукой. Юрист пожал её: "Теперь вы — снова кто-то." На стене висит уведомление: документы готовы через 60 дней.', stats: { morale: 35, authority: 10 } }, fail: { text: 'На второй неделе сорвался. Юрист покачал головой: "Начнём заново. Но время упущено."', stats: { morale: -20, sobriety: -20 } } } },
      { text: '"Зачем они мне"', outcomes: { successChance: 100, success: { text: 'Юрист убрал бумаги. "Дело ваше. Только без паспорта вы навсегда — никто." Эти слова засели под рёбра.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'STORY_05', category: 'Сюжет', title: 'Первый рабочий день',
    triggerConditions: { locations: ['shelter', 'construction'], storyStageMin: 3, storyStageMax: 3, flags: { docs_started: true } },
    description: 'Конверт с паспортом. Настоящий. Твой. Гриша со стройки говорит: "С документами можно оформляться. У нас вакансия подсобника. Официально. Со справкой о медосмотре." Мир вдруг стал состоять из бумажек. И ты их собрал.',
    choices: [
      { text: 'Устроиться официально', outcomes: { successChance: 100, success: { text: 'Трудовая книжка. Графа: "принят". Ты держишь её двумя руками, как фарфор. Смена начинается в понедельник. Ты будешь работать.', stats: { morale: 40, authority: 15 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'STORY_06', category: 'Сюжет', title: 'Комната',
    triggerConditions: { locations: ['shelter', 'station'], storyStageMin: 4, storyStageMax: 4, flags: { job_got: true }, moneyMin: 3000 },
    description: 'Комната в коммуналке на окраине. Три тысячи в месяц, печка во дворе, сосед-старик, играющий на баяне по вечерам. Хозяйка спрашивает: "Прожписка нужна? Сделаем. Только платите вовремя." Это не дом. Но это — крыша. Твоя.',
    choices: [
      { text: 'Снять комнату', outcomes: { successChance: 100, success: { text: 'Ключ от комнаты. Весной ты покрасишь стены. Зимой истопишь печку. А сейчас просто сидишь посреди пустой комнаты и слушаешь тишину. Свою.', stats: { money: -3000, morale: 40, warmth: 25 } }, fail: { text: '', stats: {} } } },
      { text: 'Ещё рано. Деньги — на подушку', outcomes: { successChance: 100, success: { text: 'Ты откладываешь. Комната ушла другому. В следующий раз может не быть.', stats: { morale: -10 } }, fail: { text: '', stats: {} } } }
    ]
  },
  {
    id: 'STORY_07', category: 'Сюжет', title: 'Звонишь домой',
    triggerConditions: { locations: ['shelter', 'station'], storyStageMin: 5, flags: { flat_got: true } },
    description: 'Таксофон у вокзала. Монета в руке. Номер дочери ты помнишь. Сколько бы ни прошло — помнишь. Гудки. "Папа?" Голос взрослой женщины, в котором ты узнаёшь свою девочку. "Папа, это правда ты?"',
    choices: [
      { text: '"Привет, дочка. Я... я выправился."', outcomes: { successChance: 100, success: { text: 'Тишина на том конце. Потом всхлип. "Мама не поверила бы. Пап, приезжай в воскресенье. У нас адрес." Ты положишь трубку и простоишь у таксофона ещё час. Держась за небо. ТЫ ВЫШЕЛ С ДНА.', stats: { morale: 50 } }, fail: { text: '', stats: {} } } },
      { text: 'Положить трубку', outcomes: { successChance: 100, success: { text: '"Не тем голосом", — скажешь ты себе. Но знаешь: не тем голосом — это когда нечем. Ещё один шаг. Тогда точно.', stats: { morale: -15 } }, fail: { text: '', stats: {} } } }
    ]
  }
];

// === МАГАЗИН: ларёк у скупки / ночлежка / вокзал ===
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'bread_loaf', name: 'Чёрствый хлеб', price: 20, icon: '🍞', description: 'Вчерашний, но мягкий внутри.', food: 20 },
  { id: 'herring', name: 'Селёдка', price: 40, icon: '🐟', description: 'С луком. Роскошь по меркам дна.', food: 30 },
  { id: 'hot_soup', name: 'Борщ в столовой', price: 60, icon: '🍲', description: 'Горячее, жидкое, сытое.', food: 35, warmth: 10 },
  { id: 'tea_sugar', name: 'Чай с сахаром', price: 15, icon: '🫖', description: 'Сладкий, горячий. Из стаканчика.', food: 5, warmth: 15, medicine: 3 },
  { id: 'vodka', name: 'Водка «Столичная»', price: 180, icon: '🍸', description: 'Тепло и веселье. Цена — утро.', warmth: 20, stats: { sobriety: -40, morale: 10 } },
  { id: 'aspirin', name: 'Аспирин', price: 50, icon: '💊', description: 'От головы, от жара, от похмелья.', medicine: 10, sobrietyCure: true },
  { id: 'antibiotics', name: 'Антибиотики', price: 150, icon: '🧪', description: 'Дорого. Но заражение дороже.', medicine: 30 },
  { id: 'soap', name: 'Хозяйственное мыло', price: 25, icon: '🧼', description: 'Поможет стать человеком.', hygiene: 30 },
  { id: 'socks', name: 'Носки шерстяные', price: 100, icon: '🧦', description: 'Сухие ноги — живой человек.', warmth: 20 },
  { id: 'thermos', name: 'Б/у термос', price: 200, icon: '🍶', description: 'Горячее всегда с собой.', item: { id: 'thermos', name: 'Термос', weight: 1, tags: ['warmth', 'valuable'], warmth: 10, value: 80, condition: 70 } },
  { id: 'cigarettes', name: 'Примитивы', price: 60, icon: '🚬', description: 'Валюта дна. И кашель.', stats: { morale: 10, authority: 5, health: -5 } },
  { id: 'newspaper', name: 'Газета', price: 10, icon: '📰', description: 'Читать, подстилать, заклеивать окна.', stats: { morale: 5 } },
];

const storageKey = "ai-tamagotchi-save-v2";

const petCatalog = {
  bobo: {
    name: "啵啵",
    trait: "撒娇型",
    species: "阳光团子",
    faceClass: "bobo",
    avatar: "啵",
    stageTitles: ["幼崽期", "探险期", "星糖骑士"],
    moodLines: {
      excited: "我今天状态超好，想和你把整个房间都玩遍。",
      okay: "只要你在旁边，我就能继续元气满满。",
      sleepy: "我有点困，但如果你叫我，我还是会爬起来。",
      sad: "今天有一点点脆弱，抱一抱我就会恢复。",
    },
  },
  momo: {
    name: "默默",
    trait: "冷静型",
    species: "云朵水母",
    faceClass: "momo",
    avatar: "默",
    stageTitles: ["幼崽期", "巡游期", "月海守望者"],
    moodLines: {
      excited: "能量稳定而充沛，今天适合做一件厉害的事。",
      okay: "我在观察今天的空气流向，一切都还不错。",
      sleepy: "让房间安静一点，我也许会梦到新的地图。",
      sad: "我的节奏乱了些，先陪我待一会儿吧。",
    },
  },
  pipi: {
    name: "皮皮",
    trait: "戏精型",
    species: "糖心蝠球",
    faceClass: "pipi",
    avatar: "皮",
    stageTitles: ["幼崽期", "表演期", "舞台明星"],
    moodLines: {
      excited: "聚光灯请立刻打过来，我准备好闪亮登场了。",
      okay: "今天的可爱度维持在专业水平线以上。",
      sleepy: "我得先补个美容觉，醒来再继续发光。",
      sad: "没有掌声的时候，我会有一点小失落。",
    },
  },
};

const inventoryCatalog = {
  pudding: {
    label: "草莓布丁",
    icon: "🍮",
    effect: { hunger: 16, mood: 6, health: 3, bond: 2, xp: 6 },
    log: "你拿出草莓布丁，宠物舔着勺子开心得眼睛发亮。",
  },
  bubble: {
    label: "泡泡喷雾",
    icon: "🫧",
    effect: { hygiene: 18, mood: 4, xp: 5 },
    log: "细小泡泡在空中打转，宠物洗得香喷喷。",
  },
  toyball: {
    label: "弹跳球",
    icon: "🧶",
    effect: { mood: 12, energy: -6, hunger: -4, bond: 3, xp: 8 },
    log: "你们用弹跳球玩追逐赛，整个房间都热闹起来。",
  },
  ribbon: {
    label: "闪亮丝带",
    icon: "🎀",
    effect: { mood: 10, bond: 4, xp: 10 },
    log: "你别上闪亮丝带后，宠物立刻进入了想被夸夸模式。",
  },
  cocoa: {
    label: "暖暖可可",
    icon: "☕",
    effect: { energy: 10, health: 6, mood: 5, xp: 7 },
    log: "暖暖可可让宠物放松下来，呼吸都变得平稳了。",
  },
};

const unlockCatalog = {
  bobo: [
    { level: 3, icon: "🎀", title: "撒娇丝带", description: "解锁 1 个闪亮丝带，互动时更容易涨羁绊。", reward: { ribbon: 1 } },
    { level: 5, icon: "🧁", title: "甜点时间", description: "额外获得 2 个草莓布丁，啵啵的新剧情也会变多。", reward: { pudding: 2 } },
    { level: 7, icon: "👑", title: "星糖骑士", description: "进入最终成长称号，并额外获得 20 星糖。", reward: { coins: 20 } },
  ],
  momo: [
    { level: 3, icon: "☕", title: "安静茶会", description: "解锁 1 杯暖暖可可，恢复节奏更轻松。", reward: { cocoa: 1 } },
    { level: 5, icon: "🫧", title: "月海泡泡", description: "获得 2 个泡泡喷雾，并开启更多巡游类事件。", reward: { bubble: 2 } },
    { level: 7, icon: "🌙", title: "月海守望者", description: "成长为终阶形态，额外获得 20 星糖。", reward: { coins: 20 } },
  ],
  pipi: [
    { level: 3, icon: "🎭", title: "开场表演", description: "获得 1 个弹跳球，表演欲会让剧情更热闹。", reward: { toyball: 1 } },
    { level: 5, icon: "🎀", title: "舞台装饰", description: "获得 1 个闪亮丝带和 1 个草莓布丁。", reward: { ribbon: 1, pudding: 1 } },
    { level: 7, icon: "🌟", title: "舞台明星", description: "进入终阶称号，额外获得 20 星糖。", reward: { coins: 20 } },
  ],
};

const choiceEventPool = [
  {
    title: "路过的神秘纸箱",
    description: (pet) => `${pet.name}发现门口有个会轻轻晃动的纸箱，你们准备怎么处理？`,
    rarity: "common",
    options: [
      {
        label: "悄悄打开",
        detail: "看看里面藏了什么，可能有奖励也可能被吓一跳。",
        effect: { mood: 8, xp: 10, coins: 4 },
        result: (pet) => `${pet.name}在纸箱里翻到一张贴纸和几颗星糖，得意得不行。`,
        log: (pet) => `${pet.name}选择打开纸箱，结果幸运地找到了一点奖励。`,
        rareOutcome: {
          chance: 0.18,
          effect: { coins: 10, xp: 14, mood: 6 },
          result: (pet) => `${pet.name}居然在最里面翻出一枚亮晶晶徽章，今天的好运直接拉满了。`,
          log: (pet) => `${pet.name}触发了稀有好运，从纸箱深处翻到了大奖。`,
          tone: "好运暴击",
        },
      },
      {
        label: "先绕着观察",
        detail: "稳一点，减少风险，但惊喜感会小一些。",
        effect: { mood: 4, bond: 3, health: 2, xp: 6 },
        result: (pet) => `${pet.name}认真巡视了一圈，最后把纸箱安全拖回了角落。`,
        log: (pet) => `${pet.name}谨慎地观察纸箱，虽然没爆大奖，但过程很安心。`,
        badOutcome: {
          chance: 0.16,
          effect: { mood: -4, energy: -4 },
          result: (pet) => `${pet.name}绕太久把自己都绕晕了，最后只好坐下来缓一会儿。`,
          log: (pet) => `${pet.name}过度谨慎反而把自己折腾得有点疲惫。`,
          tone: "小小翻车",
        },
      },
    ],
  },
  {
    title: "下午茶邀请",
    description: (pet) => `${pet.name}突然想来一场小小下午茶，你想走哪种路线？`,
    rarity: "common",
    options: [
      {
        label: "甜点派对",
        detail: "偏快乐和羁绊，适合冲心情。",
        effect: { hunger: 10, mood: 10, bond: 4, xp: 8 },
        result: (pet) => `${pet.name}抱着盘子晃来晃去，宣布这是一场非常成功的茶会。`,
        log: (pet) => `${pet.name}选了甜点派对路线，整个下午都甜甜的。`,
        badOutcome: {
          chance: 0.14,
          effect: { health: -4, energy: -3 },
          result: (pet) => `${pet.name}吃太快有点腻住了，只好窝在垫子上慢慢缓过来。`,
          log: (pet) => `${pet.name}下午茶太兴奋，一不小心吃得有点过头。`,
          tone: "甜蜜失误",
        },
      },
      {
        label: "热饮恢复",
        detail: "偏体力和健康，适合稳住状态。",
        effect: { energy: 10, health: 8, mood: 4, xp: 8 },
        result: (pet) => `${pet.name}捧着热饮坐了一会儿，整只宠物都柔和了下来。`,
        log: (pet) => `${pet.name}选择慢慢喝热饮，状态被稳稳拉了回来。`,
        rareOutcome: {
          chance: 0.15,
          effect: { health: 10, bond: 4, xp: 10 },
          result: (pet) => `${pet.name}在热气里突然说出一句超级真诚的心里话，你们的距离一下近了很多。`,
          log: (pet) => `${pet.name}在安静时刻触发了稀有羁绊剧情。`,
          tone: "羁绊暴击",
        },
      },
    ],
  },
  {
    title: "今晚的小冒险",
    description: (pet) => `${pet.name}想把夜晚过得特别一点，你们要走冒险派还是休息派？`,
    rarity: "rare",
    options: [
      {
        label: "继续探险",
        detail: "推进成长更快，但会消耗一点体力。",
        effect: { mood: 8, energy: -8, xp: 14, bond: 3 },
        result: (pet) => `${pet.name}在房间里完成了一场迷你夜探，回来说今晚超值得。`,
        log: (pet) => `${pet.name}拉着你继续夜间冒险，虽然有点累，但非常满足。`,
        rareOutcome: {
          chance: 0.22,
          effect: { coins: 12, xp: 18, bond: 5 },
          result: (pet) => `${pet.name}居然在夜探终点发现了传说中的星糖藏点，这一晚直接封神。`,
          log: (pet) => `${pet.name}在夜间冒险里触发了稀有大成功。`,
          tone: "传奇发现",
        },
        badOutcome: {
          chance: 0.14,
          effect: { health: -6, energy: -8, mood: -3 },
          result: (pet) => `${pet.name}夜里跑太快差点撞翻玩具堆，回来后决定乖乖休息。`,
          log: (pet) => `${pet.name}在冒险途中有点翻车，今晚的后半程只能收着点。`,
          tone: "冒险失手",
        },
      },
      {
        label: "早点收尾",
        detail: "更适合保状态，适合睡前。",
        effect: { health: 8, energy: 6, mood: 3, xp: 6 },
        result: (pet) => `${pet.name}把小窝整理得整整齐齐，决定用平静结束今天。`,
        log: (pet) => `${pet.name}选择提早收尾，今晚的节奏格外舒服。`,
        rareOutcome: {
          chance: 0.18,
          effect: { health: 10, energy: 10, xp: 10 },
          result: (pet) => `${pet.name}在安静收尾后做了一个超甜的梦，醒来时整只宠物都亮亮的。`,
          log: (pet) => `${pet.name}因为早点休息触发了稀有“好梦加成”。`,
          tone: "完美收尾",
        },
      },
    ],
  },
  {
    title: "流星擦过窗边",
    description: (pet) => `${pet.name}突然看见一颗流星划过窗外，你们只有一瞬间能决定要做什么。`,
    rarity: "rare",
    options: [
      {
        label: "立刻许愿",
        detail: "赌一个高回报，可能直接抽到大成功。",
        effect: { mood: 10, xp: 12 },
        result: (pet) => `${pet.name}闭眼许下一个夸张的愿望，整只宠物都被浪漫感击中了。`,
        log: (pet) => `${pet.name}对着流星飞快许愿，气氛一下子梦幻起来。`,
        rareOutcome: {
          chance: 0.24,
          effect: { coins: 16, bond: 6, xp: 16 },
          result: (pet) => `${pet.name}的愿望像被真的听见了一样，窗台上竟多了一小袋星糖。`,
          log: (pet) => `${pet.name}在流星事件里触发了稀有愿望成真。`,
          tone: "愿望成真",
        },
      },
      {
        label: "静静看完",
        detail: "更稳，也更像一段安静羁绊剧情。",
        effect: { bond: 5, mood: 6, health: 4, xp: 8 },
        result: (pet) => `${pet.name}和你一起把那道光看完，像把今天悄悄收进了记忆盒。`,
        log: (pet) => `${pet.name}选择静静看完流星，这一刻很安静也很珍贵。`,
        badOutcome: {
          chance: 0.12,
          effect: { mood: -3 },
          result: (pet) => `${pet.name}刚准备认真欣赏，流星却已经消失，只剩一点点可惜。`,
          log: (pet) => `${pet.name}错过了最亮的那一秒，心里有点小失落。`,
          tone: "擦肩而过",
        },
      },
    ],
  },
];

const questTemplates = [
  {
    title: "零食王国的门票",
    description: (pet) =>
      `${pet.name}相信窗外那朵云后面藏着零食王国，想先收集 3 次“快乐证明”。`,
    target: 3,
    tags: ["feed", "play", "chat"],
    reward: { coins: 10, bond: 6, xp: 18 },
    completeText: (pet) => `${pet.name}拿到了闪亮门票，宣布你是今天的最佳搭档。`,
  },
  {
    title: "午睡星星计划",
    description: (pet) =>
      `${pet.name}想要一场完美午睡，需要连续推进时间或睡觉来找回安静节奏。`,
    target: 4,
    tags: ["sleep", "time"],
    reward: { coins: 8, health: 8, xp: 15 },
    completeText: (pet) => `${pet.name}做了一个甜甜的梦，醒来后送了你一颗梦境星糖。`,
  },
  {
    title: "房间可爱大扫除",
    description: (pet) =>
      `${pet.name}决定举办房间可爱比赛，想把自己和小窝都整理到闪闪发亮。`,
    target: 3,
    tags: ["wash", "item"],
    reward: { coins: 9, hygiene: 10, bond: 4, xp: 14 },
    completeText: (pet) => `${pet.name}宣布这次大扫除获得满分，并给你颁发闪亮丝带。`,
  },
  {
    title: "午后演出排练",
    description: (pet) =>
      `${pet.name}想在傍晚前排出一段像样的小演出，需要通过玩耍、聊天和互动把状态炒热。`,
    target: 4,
    tags: ["play", "chat", "tap"],
    reward: { coins: 12, mood: 10, bond: 5, xp: 20 },
    completeText: (pet) => `${pet.name}顺利完成排练，观众只有你一个，但掌声特别响。`,
  },
  {
    title: "夜晚热饮补给",
    description: (pet) =>
      `${pet.name}准备在晚间来一场小小恢复仪式，吃点东西、喝点热的，再早点休息。`,
    target: 3,
    tags: ["feed", "sleep", "item"],
    reward: { coins: 9, health: 12, xp: 16 },
    completeText: (pet) => `${pet.name}完成晚安仪式后，窝在软垫里说今天真的很满足。`,
  },
];

const mathMissionThemes = {
  arithmetic: "宠物训练计算",
  money: "宠物零食采购",
  time: "宠物日程安排",
};

const defaultState = {
  hour: 8,
  day: 1,
  coins: 28,
  activePetId: "bobo",
  pets: {
    bobo: createPetState("bobo", { hunger: 78, mood: 82, energy: 66, hygiene: 73, health: 91 }),
    momo: createPetState("momo", { hunger: 71, mood: 69, energy: 80, hygiene: 76, health: 88 }),
    pipi: createPetState("pipi", { hunger: 75, mood: 88, energy: 62, hygiene: 64, health: 84 }),
  },
  inventory: {
    pudding: 3,
    bubble: 2,
    toyball: 2,
    ribbon: 0,
    cocoa: 0,
  },
  quest: {
    index: 0,
    progress: 0,
    completed: 0,
  },
  math: createMathState(4),
  settings: {
    soundOn: false,
    motionOn: true,
  },
  pendingChoice: null,
  globalStory: "今早醒来后，啵啵盯着窗外发呆，说云朵像一块没吃完的棉花糖。",
  logs: [
    { time: "08:00", text: "今天的宠物屋开门营业，三只小家伙都在自己的角落醒来了。" },
    { time: "08:10", text: "啵啵先跑来打招呼，默默和皮皮则在观察今天的天气。" },
  ],
};

const state = loadState();

const statsConfig = [
  { key: "hunger", label: "饱足", icon: "🍓", color: "#ff7a59" },
  { key: "mood", label: "心情", icon: "🌈", color: "#2cb8b0" },
  { key: "energy", label: "体力", icon: "⚡", color: "#7a71ff" },
  { key: "hygiene", label: "清洁", icon: "🫧", color: "#4f93ff" },
  { key: "health", label: "健康", icon: "💖", color: "#97db4f" },
];

const actionEffects = {
  feed: {
    stats: { hunger: 18, health: 4, mood: 5 },
    coins: -2,
    bond: 3,
    xp: 9,
    log: (pet) => `你喂了${pet.name}一顿香香餐，它满足地舔了舔嘴角。`,
    story: (pet) => `你端来热乎乎的小餐盘，${pet.name}吃饱后连耳朵都跟着精神起来。`,
  },
  play: {
    stats: { mood: 15, energy: -10, hunger: -8, hygiene: -4 },
    coins: 0,
    bond: 4,
    xp: 11,
    log: (pet) => `你陪${pet.name}疯玩了一阵，它现在眼睛亮亮的。`,
    story: (pet) => `你和${pet.name}在房间里追逐玩耍，它笑得快要滚成一个圆球。`,
  },
  wash: {
    stats: { hygiene: 22, mood: 6, health: 3 },
    coins: -1,
    bond: 2,
    xp: 8,
    log: (pet) => `你帮${pet.name}认真清洁了一遍，它看起来舒服多了。`,
    story: (pet) => `泡泡在空中飞来飞去，${pet.name}洗完后软乎乎地蹭了你一下。`,
  },
  sleep: {
    stats: { energy: 24, health: 5, mood: 2, hunger: -6 },
    coins: 0,
    bond: 2,
    xp: 7,
    log: (pet) => `${pet.name}小睡了一会儿，呼吸变得平稳又安心。`,
    story: (pet) => `你替${pet.name}盖好小被子，它抱着星星玩偶很快就睡熟了。`,
  },
};

const eventPool = [
  {
    condition: (pet) => pet.stats.mood < 45,
    apply: (pet) => ({
      badge: "需要安慰",
      story: `${pet.name}抱着小毯子缩成一团，像在等一句今天也很棒。`,
      line: `${pet.name}低声问你，今天可不可以只慢慢地待在一起。`,
      effect: { mood: 8, bond: 2 },
      log: `${pet.name}闹了点小情绪，安慰后明显放松了。`,
    }),
  },
  {
    condition: (pet) => pet.stats.hunger < 40,
    apply: (pet) => ({
      badge: "肚子咕咕叫",
      story: `${pet.name}正盯着厨房方向发呆，像在等待什么奇迹发生。`,
      line: "有没有一种可能，现在就是零食时间？",
      effect: { health: -2 },
      log: `${pet.name}太饿了，连走路节奏都慢下来一点。`,
    }),
  },
  {
    condition: (pet) => pet.stats.hygiene < 50,
    apply: (pet) => ({
      badge: "有点灰扑扑",
      story: `${pet.name}滚进抱枕堆里，把自己玩成了一只毛绒小团子。`,
      line: "先别拍照，我今天是灰尘限定皮肤。",
      effect: { mood: -2 },
      log: `${pet.name}玩得太疯后，身上沾了不少灰。`,
    }),
  },
  {
    condition: () => true,
    apply: (pet) => ({
      badge: "剧情片段",
      story: `${pet.name}突然宣布地板上的光斑是一扇秘密门，邀请你一起守着它。`,
      line: "只要我们够认真，门后面就会出现新的冒险。",
      effect: { mood: 5, xp: 8 },
      log: `${pet.name}拉着你演了一小段临时冒险剧情。`,
    }),
  },
  {
    condition: () => true,
    apply: (pet) => ({
      badge: "好运掉落",
      story: `窗边掉进一颗亮晶晶的小星糖，${pet.name}把它当成今天的幸运物。`,
      line: "我刚刚被幸运轻轻撞了一下。",
      effect: { mood: 4, coins: 4 },
      log: `${pet.name}捡到一颗星糖，开心得转了三圈。`,
    }),
  },
  {
    condition: (pet) => state.hour >= 18 && pet.stats.energy < 60,
    apply: (pet) => ({
      badge: "夜晚降临",
      story: `${pet.name}看着窗外一点点变暗，忽然安静下来，想把今天最后一段时间过得柔软一点。`,
      line: "天快黑了，我们是不是该准备晚安仪式啦？",
      effect: { mood: 3, xp: 6 },
      log: `${pet.name}在傍晚时分变得格外安静，像在等待一天的收尾。`,
    }),
  },
  {
    condition: (pet) => state.hour <= 10 && pet.stats.energy > 50,
    apply: (pet) => ({
      badge: "清晨灵感",
      story: `${pet.name}一大早就精神饱满，开始构思今天的新游戏和新冒险。`,
      line: "早上最适合出发了，我已经想到今天的第一关了。",
      effect: { mood: 5, xp: 8 },
      log: `${pet.name}一早就冒出很多新点子，整个房间都跟着热闹起来。`,
    }),
  },
  {
    condition: (pet) => pet.bond >= 24,
    apply: (pet) => ({
      badge: "羁绊片段",
      story: `${pet.name}突然靠过来贴了你一下，像在确认“你还会一直陪我吧”。`,
      line: "我最近常常觉得，只要一回头就能找到你。",
      effect: { mood: 6, health: 2, xp: 8 },
      log: `${pet.name}触发了一段更亲近的羁绊剧情。`,
    }),
  },
];

const elements = {
  day: document.querySelector("#day-count"),
  coins: document.querySelector("#coins-count"),
  roster: document.querySelector("#pet-roster"),
  petLine: document.querySelector("#pet-line"),
  petName: document.querySelector("#pet-name"),
  petTrait: document.querySelector("#pet-trait"),
  story: document.querySelector("#story-copy"),
  badge: document.querySelector("#event-badge"),
  growthStage: document.querySelector("#growth-stage"),
  level: document.querySelector("#level-value"),
  bond: document.querySelector("#bond-value"),
  xp: document.querySelector("#xp-value"),
  growthFill: document.querySelector("#growth-fill"),
  unlockHint: document.querySelector("#unlock-hint"),
  unlockList: document.querySelector("#unlock-list"),
  questTitle: document.querySelector("#quest-title"),
  questText: document.querySelector("#story-copy"),
  questProgressText: document.querySelector("#quest-progress-text"),
  questFill: document.querySelector("#quest-fill"),
  gradeSwitch: document.querySelector("#grade-switch"),
  mathTitle: document.querySelector("#math-title"),
  mathQuestion: document.querySelector("#math-question"),
  mathOptions: document.querySelector("#math-options"),
  mathProgressText: document.querySelector("#math-progress-text"),
  mathFill: document.querySelector("#math-fill"),
  mathRewardCopy: document.querySelector("#math-reward-copy"),
  choiceCard: document.querySelector("#choice-card"),
  choiceTitle: document.querySelector("#choice-title"),
  choiceCopy: document.querySelector("#choice-copy"),
  choiceActions: document.querySelector("#choice-actions"),
  settingsCard: document.querySelector("#settings-card"),
  toggleSettings: document.querySelector("#toggle-settings"),
  toggleSound: document.querySelector("#toggle-sound"),
  toggleMotion: document.querySelector("#toggle-motion"),
  resetSave: document.querySelector("#reset-save"),
  soundState: document.querySelector("#sound-state"),
  motionState: document.querySelector("#motion-state"),
  stage: document.querySelector(".pet-stage"),
  grid: document.querySelector("#status-grid"),
  inventory: document.querySelector("#inventory-list"),
  log: document.querySelector("#event-log"),
  petFace: document.querySelector("#pet-face"),
  nextTurn: document.querySelector("#next-turn"),
  cheerUp: document.querySelector("#cheer-up"),
  advanceQuest: document.querySelector("#advance-quest"),
  actionButtons: [...document.querySelectorAll(".action-button")],
};

function createPetState(id, stats) {
  return {
    id,
    level: 1,
    bond: 12,
    xp: 18,
    stage: 0,
    currentLine: `${petCatalog[id].name}想玩接球球！`,
    currentStory: `${petCatalog[id].name}在小窝前晃来晃去，等待今天的第一场互动。`,
    badge: "状态稳定",
    unlockedMilestones: [],
    stats,
  };
}

function createMathState(grade = 4) {
  return {
    grade,
    currentIndex: 0,
    completed: 0,
    streak: 0,
    questions: createMathQuestions(grade),
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function buildQuestion(theme, prompt, answer, wrongAnswers) {
  return {
    theme,
    prompt,
    answer,
    choices: shuffle([answer, ...wrongAnswers]).slice(0, 4),
  };
}

function createArithmeticQuestion(grade) {
  if (grade === 4) {
    const a = randomInt(12, 48);
    const b = randomInt(3, 9);
    const prompt = `啵啵要做训练，今天完成了 ${a} 次跳跃，又追加了 ${b} 次，一共多少次？`;
    const answer = a + b;
    return buildQuestion("arithmetic", prompt, answer, [answer - 2, answer + 3, answer + 5]);
  }

  if (grade === 5) {
    const a = randomInt(6, 12);
    const b = randomInt(4, 9);
    const prompt = `皮皮要准备表演，一排放 ${a} 个气球，共 ${b} 排，一共有多少个气球？`;
    const answer = a * b;
    return buildQuestion("arithmetic", prompt, answer, [answer - b, answer + a, answer + 6]);
  }

  const a = randomInt(24, 72);
  const b = randomInt(3, 8);
  const prompt = `默默收集了 ${a} 颗星糖，想平均分成 ${b} 份，每份有多少颗？`;
  const answer = Math.floor(a / b);
  return buildQuestion("arithmetic", prompt, answer, [answer - 2, answer + 1, answer + 3]);
}

function createMoneyQuestion(grade) {
  if (grade === 4) {
    const price = randomInt(2, 6);
    const qty = randomInt(2, 4);
    const answer = price * qty;
    return buildQuestion(
      "money",
      `宠物想买 ${qty} 个零食，每个 RM${price}，一共要多少钱？`,
      `RM${answer}`,
      [`RM${answer + price}`, `RM${Math.max(1, answer - qty)}`, `RM${answer + 2}`]
    );
  }

  if (grade === 5) {
    const wallet = randomInt(15, 30);
    const spend = randomInt(6, 14);
    const answer = wallet - spend;
    return buildQuestion(
      "money",
      `你带着 RM${wallet} 去帮宠物买玩具，花了 RM${spend}，还剩多少？`,
      `RM${answer}`,
      [`RM${answer + 2}`, `RM${Math.max(0, answer - 3)}`, `RM${wallet + spend}`]
    );
  }

  const price = randomInt(8, 15);
  const discount = randomInt(1, 4);
  const answer = price - discount;
  return buildQuestion(
    "money",
    `宠物背包原价 RM${price}，现在便宜了 RM${discount}，折后是多少钱？`,
    `RM${answer}`,
    [`RM${price + discount}`, `RM${discount}`, `RM${answer + 3}`]
  );
}

function createTimeQuestion(grade) {
  const hour = randomInt(1, 9);
  const minuteOptions = [0, 15, 30, 45];
  const minute = minuteOptions[randomInt(0, minuteOptions.length - 1)];
  const extra = grade === 4 ? randomInt(15, 45) : grade === 5 ? randomInt(20, 80) : randomInt(30, 90);
  const totalMinutes = hour * 60 + minute + extra;
  const resultHour = Math.floor(totalMinutes / 60);
  const resultMinute = totalMinutes % 60;
  const formatTime = `${resultHour}:${String(resultMinute).padStart(2, "0")}`;
  return buildQuestion(
    "time",
    `现在是 ${hour}:${String(minute).padStart(2, "0")}，再过 ${extra} 分钟，宠物几点开始活动？`,
    formatTime,
    [
      `${resultHour}:${String((resultMinute + 15) % 60).padStart(2, "0")}`,
      `${Math.max(0, resultHour - 1)}:${String(resultMinute).padStart(2, "0")}`,
      `${resultHour + 1}:${String(resultMinute).padStart(2, "0")}`,
    ]
  );
}

function createMathQuestions(grade) {
  return [
    createArithmeticQuestion(grade),
    createMoneyQuestion(grade),
    createTimeQuestion(grade),
  ];
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function activePet() {
  return state.pets[state.activePetId];
}

function activePetInfo() {
  return petCatalog[state.activePetId];
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return cloneDefaultState();

    const parsed = JSON.parse(raw);
    const merged = cloneDefaultState();

    merged.hour = parsed.hour ?? merged.hour;
    merged.day = parsed.day ?? merged.day;
    merged.coins = parsed.coins ?? merged.coins;
    merged.activePetId = parsed.activePetId ?? merged.activePetId;
    merged.inventory = { ...merged.inventory, ...(parsed.inventory || {}) };
    merged.quest = { ...merged.quest, ...(parsed.quest || {}) };
    merged.math = parsed.math
      ? {
          ...createMathState(parsed.math.grade || 4),
          ...parsed.math,
        }
      : merged.math;
    merged.settings = { ...merged.settings, ...(parsed.settings || {}) };
    merged.pendingChoice = parsed.pendingChoice || null;
    merged.globalStory = parsed.globalStory || merged.globalStory;
    merged.logs = Array.isArray(parsed.logs) ? parsed.logs.slice(0, 6) : merged.logs;

    Object.keys(merged.pets).forEach((petId) => {
      merged.pets[petId] = {
        ...merged.pets[petId],
        ...(parsed.pets?.[petId] || {}),
        stats: {
          ...merged.pets[petId].stats,
          ...(parsed.pets?.[petId]?.stats || {}),
        },
      };
    });

    return merged;
  } catch {
    return cloneDefaultState();
  }
}

function saveState() {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

function playSound(type = "soft") {
  if (!state.settings.soundOn) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!window.__petAudioCtx) {
    window.__petAudioCtx = new AudioContextClass();
  }

  const ctx = window.__petAudioCtx;
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  const tones = {
    soft: 520,
    happy: 660,
    rare: 820,
    sleepy: 420,
  };

  osc.type = "triangle";
  osc.frequency.setValueAtTime(tones[type] || 520, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.025, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function addLog(text) {
  const timestamp = `${String(state.hour).padStart(2, "0")}:00`;
  state.logs.unshift({ time: timestamp, text });
  state.logs = state.logs.slice(0, 6);
}

function applyPetChanges(pet, changes) {
  Object.entries(changes).forEach(([key, amount]) => {
    if (key === "coins") {
      state.coins = Math.max(0, state.coins + amount);
      return;
    }

    if (key === "bond") {
      pet.bond = Math.max(0, pet.bond + amount);
      return;
    }

    if (key === "xp") {
      pet.xp = Math.max(0, pet.xp + amount);
      return;
    }

    if (!(key in pet.stats)) {
      return;
    }

    pet.stats[key] = clamp(pet.stats[key] + amount);
  });

  maybeLevelUp(pet);
}

function maybeLevelUp(pet) {
  while (pet.xp >= pet.level * 100) {
    pet.xp -= pet.level * 100;
    pet.level += 1;
    pet.bond += 4;
    addLog(`${petCatalog[pet.id].name}升到了 Lv.${pet.level}，看起来比刚才更有精神。`);
  }

  const nextStage = pet.level >= 7 ? 2 : pet.level >= 3 ? 1 : 0;
  if (nextStage !== pet.stage) {
    pet.stage = nextStage;
    pet.badge = "完成进化";
    pet.currentStory = `${petCatalog[pet.id].name}被柔光包围，顺利成长到了${petCatalog[pet.id].stageTitles[nextStage]}。`;
    pet.currentLine = "我好像变得更厉害，也更想跟你一起冒险了。";
    addLog(`${petCatalog[pet.id].name}完成了一次成长进化。`);
  }

  unlockMilestonesForPet(pet);
}

function applyInventoryRewards(reward) {
  Object.entries(reward).forEach(([key, amount]) => {
    if (key === "coins") {
      state.coins += amount;
      return;
    }

    state.inventory[key] = (state.inventory[key] || 0) + amount;
  });
}

function unlockMilestonesForPet(pet) {
  const milestones = unlockCatalog[pet.id] || [];
  milestones.forEach((milestone) => {
    if (pet.level < milestone.level) return;
    if (pet.unlockedMilestones.includes(milestone.level)) return;

    pet.unlockedMilestones.push(milestone.level);
    applyInventoryRewards(milestone.reward);
    pet.badge = "解锁奖励";
    pet.currentStory = `${petCatalog[pet.id].name}解锁了“${milestone.title}”，宠物屋里多了一份新的收藏。`;
    pet.currentLine = `${petCatalog[pet.id].name}兴奋地围着新奖励转圈，像在催你立刻试试看。`;
    addLog(`${petCatalog[pet.id].name}达成 Lv.${milestone.level}，解锁了${milestone.title}。`);
  });
}

function getMoodProfile(pet) {
  const average =
    Object.values(pet.stats).reduce((sum, value) => sum + value, 0) /
    Object.values(pet.stats).length;
  const lines = petCatalog[pet.id].moodLines;

  if (average >= 78) {
    return { face: "excited", line: lines.excited, badge: "超有活力" };
  }

  if (average >= 48) {
    return { face: "happy", line: lines.okay, badge: "状态稳定" };
  }

  if (pet.stats.energy < 35) {
    return { face: "sleepy", line: lines.sleepy, badge: "有点困了" };
  }

  return { face: "sad", line: lines.sad, badge: "需要照顾" };
}

function getCurrentQuest() {
  return questTemplates[state.quest.index % questTemplates.length];
}

function updateQuestProgress(tag) {
  const quest = getCurrentQuest();
  if (!quest.tags.includes(tag)) return;

  state.quest.progress += 1;
  const pet = activePet();
  pet.currentStory = quest.description(activePetInfo());
  pet.badge = "剧情推进";
  if (state.quest.progress >= quest.target) {
    completeQuest();
  }
}

function completeQuest() {
  const quest = getCurrentQuest();
  const pet = activePet();
  applyPetChanges(pet, quest.reward);
  pet.currentStory = quest.completeText(activePetInfo());
  pet.currentLine = `${activePetInfo().name}把奖励认真地交到你手上。`;
  pet.badge = "剧情完成";
  state.globalStory = pet.currentStory;
  addLog(`${quest.title}完成，获得了额外奖励。`);
  state.quest.completed += 1;
  state.quest.index += 1;
  state.quest.progress = 0;
}

function decayOverTime() {
  Object.values(state.pets).forEach((pet) => {
    applyPetChanges(pet, {
      hunger: -5,
      mood: -3,
      energy: -5,
      hygiene: -4,
      health: pet.stats.hunger < 35 || pet.stats.hygiene < 35 ? -4 : -1,
    });
  });
}

function maybeTriggerEvent() {
  const pet = activePet();
  if (Math.random() >= 0.52) {
    const profile = getMoodProfile(pet);
    pet.currentLine = profile.line;
    pet.badge = profile.badge;
    pet.currentStory = `${activePetInfo().name}在小房间里晃来晃去，等待下一次和你的互动。`;
    state.globalStory = pet.currentStory;
    return;
  }

  if (!state.pendingChoice && Math.random() < 0.36) {
    const rareRoll = Math.random();
    const pool = choiceEventPool.filter((event) => (rareRoll < 0.18 ? event.rarity === "rare" : event.rarity !== "rare"));
    const sourcePool = pool.length > 0 ? pool : choiceEventPool;
    const choiceEvent = sourcePool[Math.floor(Math.random() * sourcePool.length)];
    const info = activePetInfo();
    state.pendingChoice = {
      petId: state.activePetId,
      title: choiceEvent.title,
      description: choiceEvent.description(info),
      rarity: choiceEvent.rarity,
      options: choiceEvent.options.map((option) => ({
        label: option.label,
        detail: option.detail,
        effect: option.effect,
        result: option.result(info),
        log: option.log(info),
        rareOutcome: option.rareOutcome
          ? {
              chance: option.rareOutcome.chance,
              effect: option.rareOutcome.effect,
              result: option.rareOutcome.result(info),
              log: option.rareOutcome.log(info),
              tone: option.rareOutcome.tone,
            }
          : null,
        badOutcome: option.badOutcome
          ? {
              chance: option.badOutcome.chance,
              effect: option.badOutcome.effect,
              result: option.badOutcome.result(info),
              log: option.badOutcome.log(info),
              tone: option.badOutcome.tone,
            }
          : null,
      })),
    };
    pet.badge = choiceEvent.rarity === "rare" ? "稀有事件" : "需要决定";
    pet.currentStory = state.pendingChoice.description;
    pet.currentLine = `${info.name}抬头看着你，像在等你拍板。`;
    state.globalStory = pet.currentStory;
    addLog(`${info.name}遇到一个需要你来决定的小事件。`);
    return;
  }

  const candidates = eventPool.filter((event) => event.condition(pet));
  const selected = candidates[Math.floor(Math.random() * candidates.length)].apply(activePetInfo());
  applyPetChanges(pet, selected.effect);
  pet.currentStory = selected.story;
  pet.currentLine = selected.line;
  pet.badge = selected.badge;
  state.globalStory = selected.story;
  addLog(selected.log);
}

function resolveChoice(optionIndex) {
  if (!state.pendingChoice) return;
  if (state.pendingChoice.petId !== state.activePetId) return;

  const pet = activePet();
  const option = state.pendingChoice.options[optionIndex];
  if (!option) return;

  applyPetChanges(pet, option.effect);
  let outcomeStory = option.result;
  let outcomeLog = option.log;
  let outcomeBadge = state.pendingChoice.rarity === "rare" ? "稀有选择" : "选择完成";
  let outcomeQuestTag = "tap";

  if (option.rareOutcome && Math.random() < option.rareOutcome.chance) {
    applyPetChanges(pet, option.rareOutcome.effect);
    outcomeStory = option.rareOutcome.result;
    outcomeLog = option.rareOutcome.log;
    outcomeBadge = option.rareOutcome.tone;
    outcomeQuestTag = "play";
  } else if (option.badOutcome && Math.random() < option.badOutcome.chance) {
    applyPetChanges(pet, option.badOutcome.effect);
    outcomeStory = option.badOutcome.result;
    outcomeLog = option.badOutcome.log;
    outcomeBadge = option.badOutcome.tone;
    outcomeQuestTag = "time";
  }

  pet.currentStory = outcomeStory;
  pet.currentLine = `${activePetInfo().name}对你的决定点了点头，马上照做。`;
  pet.badge = outcomeBadge;
  state.globalStory = pet.currentStory;
  addLog(outcomeLog);
  updateQuestProgress(outcomeQuestTag);
  state.pendingChoice = null;
  playSound(outcomeBadge === "选择完成" ? "happy" : outcomeQuestTag === "play" ? "rare" : "soft");
  render();
}

function performAction(actionKey) {
  const action = actionEffects[actionKey];
  if (!action) return;

  const pet = activePet();
  const info = activePetInfo();
  applyPetChanges(pet, { ...action.stats, bond: action.bond, xp: action.xp });
  state.coins = Math.max(0, state.coins + action.coins);
  pet.currentLine = generateContextLine(info, actionKey);
  pet.currentStory = action.story(info);
  pet.badge = actionKey === "sleep" ? "正在恢复" : "互动完成";
  state.globalStory = pet.currentStory;
  addLog(action.log(info));
  updateQuestProgress(actionKey);
  playSound(actionKey === "sleep" ? "sleepy" : "happy");
  render();
}

function generateContextLine(info, context) {
  const pet = activePet();
  const profile = getMoodProfile(pet);
  const map = {
    feed: `${info.name}满意地眯起眼睛，说今天这餐值得记进幸福日记。`,
    play: `${info.name}在原地转了一圈，宣布刚才的比赛非常精彩。`,
    wash: `${info.name}闻了闻自己，确认现在已经是香喷喷状态。`,
    sleep: `${info.name}打了个哈欠，抱着小枕头准备再做一会儿好梦。`,
    chat: `${info.name}认真看着你，像是把每一句话都偷偷记了下来。`,
    tap: `${info.name}被你轻轻碰了一下，立刻露出“我知道你在意我”的表情。`,
    quest: `${info.name}对新任务很认真，连尾巴摆动都带着计划感。`,
  };

  return map[context] || profile.line;
}

function advanceHour() {
  state.hour += 1;
  if (state.hour >= 24) {
    state.hour = 0;
    state.day += 1;
    state.coins += 6;
    addLog("新的一天开始了，系统发放了登录奖励 6 星糖。");
  }

  decayOverTime();
  maybeTriggerEvent();
  updateQuestProgress("time");
  render();
}

function cheerUpPet() {
  const pet = activePet();
  const info = activePetInfo();
  pet.currentLine = generateContextLine(info, "chat");
  pet.currentStory = `你蹲下来和${info.name}说了会儿话，它专心听着，尾巴轻轻摇来摇去。`;
  pet.badge = "聊天中";
  applyPetChanges(pet, { mood: 8, bond: 3, xp: 6 });
  state.globalStory = pet.currentStory;
  addLog(`你陪${info.name}聊了聊天，它的情绪变得更轻松了。`);
  updateQuestProgress("chat");
  playSound("soft");
  render();
}

function petTapReaction() {
  const pet = activePet();
  const info = activePetInfo();
  pet.currentLine = generateContextLine(info, "tap");
  pet.currentStory = `你轻轻碰了碰${info.name}，它抬头看你，像是在等下一步指令。`;
  pet.badge = "正在互动";
  applyPetChanges(pet, { mood: 4, bond: 2, xp: 4 });
  state.globalStory = pet.currentStory;
  addLog(`你点了点${info.name}，它立刻给了你一个可爱的回应。`);
  updateQuestProgress("tap");
  playSound("soft");
  render();
}

function useItem(itemKey) {
  if (!state.inventory[itemKey]) return;

  const item = inventoryCatalog[itemKey];
  const pet = activePet();
  const info = activePetInfo();
  state.inventory[itemKey] -= 1;
  applyPetChanges(pet, item.effect);
  pet.currentLine = `${info.name}收到${item.label}后，整只宠物都亮了一点。`;
  pet.currentStory = `${info.name}抱着${item.label}不肯松手，看起来像拿到了今天最喜欢的礼物。`;
  pet.badge = "使用道具";
  state.globalStory = pet.currentStory;
  addLog(item.log.replace("宠物", info.name));
  updateQuestProgress("item");
  playSound("happy");
  render();
}

function advanceQuestManually() {
  const pet = activePet();
  const info = activePetInfo();
  pet.currentLine = generateContextLine(info, "quest");
  pet.currentStory = getCurrentQuest().description(info);
  pet.badge = "任务更新";
  state.globalStory = pet.currentStory;
  applyPetChanges(pet, { mood: 3, xp: 5 });
  addLog(`${info.name}认真研究了当前的小情节目标。`);
  updateQuestProgress("time");
  playSound("soft");
  render();
}

function toggleSettingsPanel() {
  elements.settingsCard.classList.toggle("hidden");
}

function toggleSoundSetting() {
  state.settings.soundOn = !state.settings.soundOn;
  playSound(state.settings.soundOn ? "happy" : "soft");
  render();
}

function applyMotionSetting() {
  document.body.classList.toggle("motion-off", !state.settings.motionOn);
}

function toggleMotionSetting() {
  state.settings.motionOn = !state.settings.motionOn;
  applyMotionSetting();
  render();
}

function resetSaveData() {
  const confirmed = window.confirm("要清空当前电子宠物进度并重新开始吗？");
  if (!confirmed) return;

  const freshState = cloneDefaultState();
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, freshState);
  window.localStorage.removeItem(storageKey);
  applyMotionSetting();
  render();
}

function setMathGrade(grade) {
  state.math = createMathState(grade);
  state.globalStory = `${activePetInfo().name}换上了 ${grade} 年级的数学委托清单，准备开始新的任务。`;
  addLog(`你把数学委托切换到了 ${grade} 年级模式。`);
  render();
}

function completeMathQuestion(isCorrect) {
  const pet = activePet();
  const rewards = isCorrect
    ? { coins: 3, xp: 8, bond: 2, mood: 3 }
    : { xp: 2, mood: 1 };

  applyPetChanges(pet, rewards);

  if (isCorrect) {
    state.math.completed += 1;
    state.math.streak += 1;
    pet.currentLine = `${activePetInfo().name}开心地说，这题算得太及时了。`;
    pet.currentStory = `${activePetInfo().name}顺利完成了一项数学委托，准备把奖励收进背包。`;
    pet.badge = "数学完成";
    state.globalStory = pet.currentStory;
    addLog(`${activePetInfo().name}完成了一道数学委托，获得了成长奖励。`);

    if (state.math.completed >= state.math.questions.length) {
      state.inventory.pudding = (state.inventory.pudding || 0) + 1;
      pet.currentLine = `${activePetInfo().name}宣布今日数学委托全部完成，可以去领奖了。`;
      pet.currentStory = `${activePetInfo().name}把今日 3 道数学委托都做完了，你们拿到了一份草莓布丁奖励。`;
      pet.badge = "数学全清";
      addLog(`今日数学委托全部完成，额外获得 1 个草莓布丁。`);
      updateQuestProgress("chat");
    } else {
      state.math.currentIndex += 1;
    }

    playSound("happy");
  } else {
    pet.currentLine = `${activePetInfo().name}说没关系，我们再认真看一次题目。`;
    pet.currentStory = `${activePetInfo().name}没有生气，只是想和你再试一次数学委托。`;
    pet.badge = "继续尝试";
    state.globalStory = pet.currentStory;
    addLog(`${activePetInfo().name}这道数学题答错了，但它愿意继续陪你尝试。`);
    playSound("soft");
  }

  render();
}

function answerMathQuestion(choice) {
  const question = state.math.questions[state.math.currentIndex];
  if (!question) return;
  completeMathQuestion(choice === question.answer);
}

function switchPet(petId) {
  state.activePetId = petId;
  const pet = activePet();
  const profile = getMoodProfile(pet);
  if (!pet.currentLine) {
    pet.currentLine = profile.line;
  }
  if (!pet.currentStory) {
    pet.currentStory = `${activePetInfo().name}回到了舞台中央。`;
  }
  render();
}

function renderRoster() {
  elements.roster.innerHTML = Object.keys(state.pets)
    .map((petId) => {
      const info = petCatalog[petId];
      const pet = state.pets[petId];
      const active = petId === state.activePetId ? "active" : "";
      const bg =
        petId === "bobo"
          ? "linear-gradient(180deg, #ffb347, #ff7a59)"
          : petId === "momo"
            ? "linear-gradient(180deg, #64c8ff, #4d88ff)"
            : "linear-gradient(180deg, #ff99bb, #ff7292)";

      return `
        <button class="roster-chip ${active}" data-pet="${petId}">
          <span class="chip-avatar" style="background:${bg};">${info.avatar}</span>
          <span class="chip-copy">
            <strong>${info.name}</strong>
            <span>Lv.${pet.level} ${info.trait}</span>
          </span>
        </button>
      `;
    })
    .join("");

  elements.roster.querySelectorAll(".roster-chip").forEach((button) => {
    button.addEventListener("click", () => switchPet(button.dataset.pet));
  });
}

function renderStats() {
  const pet = activePet();
  elements.grid.innerHTML = statsConfig
    .map(({ key, label, icon, color }) => {
      const value = pet.stats[key];
      return `
        <article class="status-item">
          <div class="status-icon" aria-hidden="true">${icon}</div>
          <div class="status-main">
            <div class="status-header">
              <span>${label}</span>
              <span>${value}/100</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${value}%; background:${color};"></div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderInventory() {
  elements.inventory.innerHTML = Object.entries(inventoryCatalog)
    .map(([key, item]) => {
      const count = state.inventory[key] || 0;
      return `
        <article class="inventory-item">
          <div class="inventory-meta">
            <span class="inventory-icon">${item.icon}</span>
            <div class="inventory-copy">
              <strong>${item.label}</strong>
              <span>小道具支援本轮养成</span>
            </div>
          </div>
          <div>
            <span class="inventory-count">x${count}</span>
            <button class="use-item-button" data-item="${key}" ${count <= 0 ? "disabled" : ""}>使用</button>
          </div>
        </article>
      `;
    })
    .join("");

  elements.inventory.querySelectorAll(".use-item-button").forEach((button) => {
    button.addEventListener("click", () => useItem(button.dataset.item));
  });
}

function renderLogs() {
  elements.log.innerHTML = state.logs
    .map(
      (entry) => `
        <li class="log-item">
          <span class="log-time">${entry.time}</span>
          <p class="log-text">${entry.text}</p>
        </li>
      `
    )
    .join("");
}

function renderQuest() {
  const quest = getCurrentQuest();
  const progress = Math.min(state.quest.progress, quest.target);
  const percent = (progress / quest.target) * 100;
  elements.questTitle.textContent = quest.title;
  elements.questText.textContent = state.globalStory || quest.description(activePetInfo());
  elements.questProgressText.textContent = `进度 ${progress} / ${quest.target}`;
  elements.questFill.style.width = `${percent}%`;
}

function renderGrowth() {
  const pet = activePet();
  const info = activePetInfo();
  const nextLevelTarget = pet.level * 100;
  const percent = Math.min(100, (pet.xp / nextLevelTarget) * 100);
  elements.growthStage.textContent = info.stageTitles[pet.stage];
  elements.level.textContent = `Lv. ${pet.level}`;
  elements.bond.textContent = String(pet.bond);
  elements.xp.textContent = `${pet.xp} / ${nextLevelTarget}`;
  elements.growthFill.style.width = `${percent}%`;
}

function renderUnlocks() {
  const pet = activePet();
  const milestones = unlockCatalog[pet.id] || [];
  const nextLocked = milestones.find((milestone) => !pet.unlockedMilestones.includes(milestone.level));
  elements.unlockHint.textContent = nextLocked ? `下一奖励 Lv. ${nextLocked.level}` : "已解锁全部奖励";
  elements.unlockList.innerHTML = milestones
    .map((milestone) => {
      const unlocked = pet.unlockedMilestones.includes(milestone.level);
      return `
        <article class="unlock-item ${unlocked ? "" : "locked"}">
          <div class="unlock-meta">
            <span class="unlock-icon">${milestone.icon}</span>
            <div class="unlock-copy">
              <strong>${milestone.title}</strong>
              <span>Lv.${milestone.level} · ${milestone.description}</span>
            </div>
          </div>
          <span class="unlock-badge">${unlocked ? "已解锁" : "未解锁"}</span>
        </article>
      `;
    })
    .join("");
}

function renderChoiceCard() {
  if (!state.pendingChoice || state.pendingChoice.petId !== state.activePetId) {
    elements.choiceCard.classList.add("hidden");
    elements.choiceActions.innerHTML = "";
    return;
  }

  elements.choiceCard.classList.remove("hidden");
  elements.choiceTitle.textContent = state.pendingChoice.title;
  elements.choiceCopy.textContent =
    state.pendingChoice.rarity === "rare"
      ? `稀有遭遇: ${state.pendingChoice.description}`
      : state.pendingChoice.description;
  elements.choiceActions.innerHTML = state.pendingChoice.options
    .map(
      (option, index) => `
        <button class="choice-button" data-choice="${index}">
          <strong>${option.label}</strong>
          <span>${option.detail}</span>
        </button>
      `
    )
    .join("");

  elements.choiceActions.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => resolveChoice(Number(button.dataset.choice)));
  });
}

function renderMathCard() {
  const grade = state.math.grade;
  const question = state.math.questions[state.math.currentIndex];
  const completed = Math.min(state.math.completed, state.math.questions.length);
  const percent = (completed / state.math.questions.length) * 100;

  elements.gradeSwitch.querySelectorAll(".grade-chip").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.grade) === grade);
  });

  if (!question) {
    elements.mathTitle.textContent = "今日数学委托完成";
    elements.mathQuestion.textContent = "你已经帮宠物完成今天所有数学任务了，明天再来继续。";
    elements.mathOptions.innerHTML = "";
    elements.mathRewardCopy.textContent = "今日奖励已经发放，宠物很满意。";
  } else {
    elements.mathTitle.textContent = mathMissionThemes[question.theme];
    elements.mathQuestion.textContent = question.prompt;
    elements.mathOptions.innerHTML = question.choices
      .map(
        (choice) => `
          <button class="math-option" data-answer="${choice}">
            <strong>${choice}</strong>
          </button>
        `
      )
      .join("");

    elements.mathOptions.querySelectorAll(".math-option").forEach((button) => {
      button.addEventListener("click", () => answerMathQuestion(button.dataset.answer));
    });

    elements.mathRewardCopy.textContent = "答对可得 3 星糖、成长经验和羁绊奖励。";
  }

  elements.mathProgressText.textContent = `进度 ${completed} / ${state.math.questions.length}`;
  elements.mathFill.style.width = `${percent}%`;
}

function renderSettings() {
  elements.soundState.textContent = state.settings.soundOn ? "开启" : "关闭";
  elements.motionState.textContent = state.settings.motionOn ? "开启" : "关闭";
  applyMotionSetting();
}

function renderStageAtmosphere() {
  let stageMode = "day";
  if (state.hour >= 18) {
    stageMode = "night";
  } else if (state.hour >= 16) {
    stageMode = "sunset";
  }

  elements.stage.classList.remove("day", "sunset", "night");
  elements.stage.classList.add(stageMode);
}

function renderPetFace() {
  const pet = activePet();
  const info = activePetInfo();
  const profile = getMoodProfile(pet);
  const currentFace = pet.badge === "互动完成" || pet.badge === "剧情完成" ? "excited" : profile.face;
  const motionClass =
    pet.badge.includes("稀有") || pet.badge === "传奇发现" || pet.badge === "愿望成真"
      ? "rare"
      : ["互动完成", "选择完成", "剧情完成", "聊天中", "正在互动"].includes(pet.badge)
        ? "interact"
        : "";
  elements.petFace.className = `pet-face stage-${pet.stage} ${currentFace} ${motionClass} ${info.faceClass}`;
  elements.petName.textContent = info.name;
  elements.petTrait.textContent = `${info.trait} · ${info.species}`;
  if (!pet.currentLine || pet.badge === "状态稳定") {
    pet.currentLine = profile.line;
  }
}

function render() {
  const pet = activePet();
  renderRoster();
  renderStats();
  renderGrowth();
  renderUnlocks();
  renderMathCard();
  renderQuest();
  renderChoiceCard();
  renderSettings();
  renderStageAtmosphere();
  renderInventory();
  renderLogs();
  renderPetFace();
  elements.day.textContent = state.day;
  elements.coins.textContent = state.coins;
  elements.petLine.textContent = pet.currentLine;
  elements.story.textContent = pet.currentStory || state.globalStory;
  elements.badge.textContent = pet.badge;
  saveState();
}

elements.actionButtons.forEach((button) => {
  button.addEventListener("click", () => performAction(button.dataset.action));
});

elements.gradeSwitch.querySelectorAll(".grade-chip").forEach((button) => {
  button.addEventListener("click", () => setMathGrade(Number(button.dataset.grade)));
});

elements.nextTurn.addEventListener("click", advanceHour);
elements.cheerUp.addEventListener("click", cheerUpPet);
elements.advanceQuest.addEventListener("click", advanceQuestManually);
elements.petFace.addEventListener("click", petTapReaction);
elements.toggleSettings.addEventListener("click", toggleSettingsPanel);
elements.toggleSound.addEventListener("click", toggleSoundSetting);
elements.toggleMotion.addEventListener("click", toggleMotionSetting);
elements.resetSave.addEventListener("click", resetSaveData);

render();

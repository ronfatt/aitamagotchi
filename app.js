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
};

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
];

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
  },
  quest: {
    index: 0,
    progress: 0,
    completed: 0,
  },
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
  questTitle: document.querySelector("#quest-title"),
  questText: document.querySelector("#story-copy"),
  questProgressText: document.querySelector("#quest-progress-text"),
  questFill: document.querySelector("#quest-fill"),
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
    stats,
  };
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

  const candidates = eventPool.filter((event) => event.condition(pet));
  const selected = candidates[Math.floor(Math.random() * candidates.length)].apply(activePetInfo());
  applyPetChanges(pet, selected.effect);
  pet.currentStory = selected.story;
  pet.currentLine = selected.line;
  pet.badge = selected.badge;
  state.globalStory = selected.story;
  addLog(selected.log);
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
  render();
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

function renderPetFace() {
  const pet = activePet();
  const info = activePetInfo();
  const profile = getMoodProfile(pet);
  const currentFace = pet.badge === "互动完成" || pet.badge === "剧情完成" ? "excited" : profile.face;
  elements.petFace.className = `pet-face ${currentFace} ${info.faceClass}`;
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
  renderQuest();
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

elements.nextTurn.addEventListener("click", advanceHour);
elements.cheerUp.addEventListener("click", cheerUpPet);
elements.advanceQuest.addEventListener("click", advanceQuestManually);
elements.petFace.addEventListener("click", petTapReaction);

render();

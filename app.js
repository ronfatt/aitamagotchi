const storageKeyPrefix = "ai-tamagotchi-save-v3";
const activePlayerKey = "ai-tamagotchi-active-player";

const petCatalog = {
  bobo: {
    name: "Oyen",
    trait: "Manja",
    species: "Kucing Oren",
    faceClass: "bobo",
    avatar: "O",
    stageTitles: ["Anak kucing", "Kucing remaja", "Jaguh rumah"],
    moodLines: {
      excited: "Hari ini aku sangat bertenaga. Jom kuasai satu rumah ni sama-sama.",
      okay: "Kalau kamu ada dekat sini, aku masih boleh kekal ceria.",
      sleepy: "Aku dah mula mengantuk, tapi kalau kamu panggil aku masih larat bangun.",
      sad: "Hari ini hati aku agak lembut. Peluk sikit, mesti okay semula.",
    },
  },
  momo: {
    name: "Abu",
    trait: "Tenang",
    species: "Kucing Kelabu",
    faceClass: "momo",
    avatar: "A",
    stageTitles: ["Anak kucing", "Penjaga halaman", "Pengawas malam"],
    moodLines: {
      excited: "Tenaga aku penuh dan stabil. Hari ini sesuai buat sesuatu yang hebat.",
      okay: "Aku tengah perhati suasana rumah. Setakat ni semuanya baik.",
      sleepy: "Bagi suasana senyap sikit. Mungkin aku boleh mimpi tempat baru.",
      sad: "Rentak aku hari ini sedikit lari. Teman aku sekejap ya.",
    },
  },
  pipi: {
    name: "Tompok",
    trait: "Nakal",
    species: "Kucing Bertompok",
    faceClass: "pipi",
    avatar: "T",
    stageTitles: ["Anak kucing", "Si lincah", "Bintang rumah"],
    moodLines: {
      excited: "Cepat pasang spotlight, aku dah sedia untuk buat hal comel.",
      okay: "Tahap comel aku hari ini masih pada paras profesional.",
      sleepy: "Aku kena tidur kejap dulu. Lepas bangun baru sambung bersinar.",
      sad: "Kalau tak ada yang layan, aku memang rasa sedikit muram.",
    },
  },
};

const inventoryCatalog = {
  pudding: {
    label: "Puding Strawberi",
    icon: "🍮",
    effect: { hunger: 16, mood: 6, health: 3, bond: 2, xp: 6 },
    log: "Kamu keluarkan puding strawberi, si kucing terus jilat sudu dengan mata yang bersinar.",
  },
  bubble: {
    label: "Semburan Buih",
    icon: "🫧",
    effect: { hygiene: 18, mood: 4, xp: 5 },
    log: "Buih kecil berterbangan dan si kucing pun jadi bersih serta wangi.",
  },
  toyball: {
    label: "Bola Mainan",
    icon: "🧶",
    effect: { mood: 12, energy: -6, hunger: -4, bond: 3, xp: 8 },
    log: "Kamu bermain kejar bola dengan si kucing sampai satu bilik jadi riuh.",
  },
  ribbon: {
    label: "Riben Berkilat",
    icon: "🎀",
    effect: { mood: 10, bond: 4, xp: 10 },
    log: "Bila riben berkilat dipakaikan, si kucing terus masuk mod mahu dipuji.",
  },
  cocoa: {
    label: "Koko Suam",
    icon: "☕",
    effect: { energy: 10, health: 6, mood: 5, xp: 7 },
    log: "Koko suam menenangkan si kucing hingga nafasnya jadi lebih teratur.",
  },
};

const unlockCatalog = {
  bobo: [
    { level: 3, icon: "🎀", title: "Riben Oyen", description: "Buka 1 riben berkilat. Oyen jadi lebih mudah tambah ikatan.", reward: { ribbon: 1 } },
    { level: 5, icon: "🧁", title: "Masa Snek", description: "Dapat 2 puding strawberi tambahan dan lebih banyak cerita Oyen.", reward: { pudding: 2 } },
    { level: 7, icon: "👑", title: "Raja Rumah", description: "Masuk gelaran akhir dan dapat 20 bintang tambahan.", reward: { coins: 20 } },
  ],
  momo: [
    { level: 3, icon: "☕", title: "Rehat Tenang", description: "Buka 1 koko suam untuk bantu Abu pulih dengan lebih mudah.", reward: { cocoa: 1 } },
    { level: 5, icon: "🫧", title: "Buih Malam", description: "Dapat 2 semburan buih dan lebih banyak acara ronda.", reward: { bubble: 2 } },
    { level: 7, icon: "🌙", title: "Penjaga Malam", description: "Abu capai bentuk akhir dan dapat 20 bintang tambahan.", reward: { coins: 20 } },
  ],
  pipi: [
    { level: 3, icon: "🎭", title: "Aksi Nakal", description: "Dapat 1 bola mainan. Tompok jadi lebih seronok buat hal.", reward: { toyball: 1 } },
    { level: 5, icon: "🎀", title: "Hiasan Comel", description: "Dapat 1 riben berkilat dan 1 puding strawberi.", reward: { ribbon: 1, pudding: 1 } },
    { level: 7, icon: "🌟", title: "Bintang Rumah", description: "Masuk gelaran akhir dan dapat 20 bintang tambahan.", reward: { coins: 20 } },
  ],
};

const choiceEventPool = [
  {
    title: "Kotak Misteri di Pintu",
    description: (pet) => `${pet.name} nampak satu kotak di depan pintu yang bergerak-gerak sedikit. Nak buat apa?`,
    rarity: "common",
    options: [
      {
        label: "Buka perlahan-lahan",
        detail: "Mungkin ada hadiah, mungkin juga ada kejutan.",
        effect: { mood: 8, xp: 10, coins: 4 },
        result: (pet) => `${pet.name} jumpa pelekat kecil dan beberapa bintang di dalam kotak, lalu terus bangga dengan diri sendiri.`,
        log: (pet) => `${pet.name} pilih untuk buka kotak dan berjaya jumpa sedikit hadiah.`,
        rareOutcome: {
          chance: 0.18,
          effect: { coins: 10, xp: 14, mood: 6 },
          result: (pet) => `${pet.name} malah berjaya jumpa lencana berkilat di bahagian paling bawah. Memang hari bertuah.`,
          log: (pet) => `${pet.name} terkena tuah luar biasa dan jumpa hadiah besar dalam kotak.`,
          tone: "Tuah besar",
        },
      },
      {
        label: "Pusing tengok dulu",
        detail: "Lebih selamat, tapi kurang kejutan.",
        effect: { mood: 4, bond: 3, health: 2, xp: 6 },
        result: (pet) => `${pet.name} periksa sekeliling dengan teliti sebelum menarik kotak itu ke sudut rumah dengan selamat.`,
        log: (pet) => `${pet.name} memerhati kotak dengan berhati-hati. Tak meletup pun, tapi rasa lebih tenang.`,
        badOutcome: {
          chance: 0.16,
          effect: { mood: -4, energy: -4 },
          result: (pet) => `${pet.name} terlalu lama berlegar sampai sendiri pun pening, lalu terus duduk diam sekejap.`,
          log: (pet) => `${pet.name} terlalu berhati-hati sampai jadi sedikit letih.`,
          tone: "Tersilap sikit",
        },
      },
    ],
  },
  {
    title: "Jemputan Minum Petang",
    description: (pet) => `${pet.name} tiba-tiba mahu sesi minum petang kecil. Kamu nak pilih cara yang mana?`,
    rarity: "common",
    options: [
      {
        label: "Pesta snek",
        detail: "Bagus untuk mood dan ikatan.",
        effect: { hunger: 10, mood: 10, bond: 4, xp: 8 },
        result: (pet) => `${pet.name} berjalan sambil memeluk pinggan kecil dan mengisytiharkan sesi minum petang itu memang berjaya.`,
        log: (pet) => `${pet.name} pilih pesta snek dan petang itu terus terasa manis.`,
        badOutcome: {
          chance: 0.14,
          effect: { health: -4, energy: -3 },
          result: (pet) => `${pet.name} makan terlalu laju sampai rasa sedikit muak, lalu berehat atas kusyen dulu.`,
          log: (pet) => `${pet.name} terlalu teruja ketika minum petang dan termakan berlebihan.`,
          tone: "Silap manis",
        },
      },
      {
        label: "Minuman suam",
        detail: "Lebih baik untuk tenaga dan kesihatan.",
        effect: { energy: 10, health: 8, mood: 4, xp: 8 },
        result: (pet) => `${pet.name} duduk diam sambil menikmati minuman suam sehingga seluruh badannya nampak lebih tenang.`,
        log: (pet) => `${pet.name} pilih minuman suam dan keadaannya kembali stabil.`,
        rareOutcome: {
          chance: 0.15,
          effect: { health: 10, bond: 4, xp: 10 },
          result: (pet) => `${pet.name} tiba-tiba mengiau dengan cara yang sangat lembut, dan hubungan kamu berdua terasa lebih rapat.`,
          log: (pet) => `${pet.name} mencetuskan detik ikatan yang jarang berlaku semasa saat tenang itu.`,
          tone: "Ikatan kuat",
        },
      },
    ],
  },
  {
    title: "Pengembaraan Malam",
    description: (pet) => `${pet.name} mahu menjadikan malam ini lebih istimewa. Nak pilih cara lasak atau santai?`,
    rarity: "rare",
    options: [
      {
        label: "Terus meneroka",
        detail: "Naik XP lebih cepat, tapi guna lebih tenaga.",
        effect: { mood: 8, energy: -8, xp: 14, bond: 3 },
        result: (pet) => `${pet.name} habiskan satu ronda malam kecil dalam rumah dan pulang dengan muka puas hati.`,
        log: (pet) => `${pet.name} tarik kamu ikut pengembaraan malam. Memang penat, tapi sangat berbaloi.`,
        rareOutcome: {
          chance: 0.22,
          effect: { coins: 12, xp: 18, bond: 5 },
          result: (pet) => `${pet.name} jumpa tempat simpanan bintang yang tersembunyi. Malam ini memang luar biasa.`,
          log: (pet) => `${pet.name} mencetuskan kejayaan besar semasa pengembaraan malam.`,
          tone: "Penemuan hebat",
        },
        badOutcome: {
          chance: 0.14,
          effect: { health: -6, energy: -8, mood: -3 },
          result: (pet) => `${pet.name} berlari terlalu laju dan hampir langgar timbunan mainan, jadi akhirnya dia berehat sahaja.`,
          log: (pet) => `${pet.name} tersalah langkah sedikit semasa pengembaraan malam.`,
          tone: "Silap langkah",
        },
      },
      {
        label: "Tamat awal",
        detail: "Lebih sesuai untuk jaga keadaan sebelum tidur.",
        effect: { health: 8, energy: 6, mood: 3, xp: 6 },
        result: (pet) => `${pet.name} kemaskan tempat tidurnya dan memilih untuk menutup hari ini dengan tenang.`,
        log: (pet) => `${pet.name} pilih untuk tamat awal dan malam jadi sangat selesa.`,
        rareOutcome: {
          chance: 0.18,
          effect: { health: 10, energy: 10, xp: 10 },
          result: (pet) => `${pet.name} tidur awal dan bermimpi indah, lalu bangun dengan wajah yang sangat segar.`,
          log: (pet) => `${pet.name} mendapat bonus mimpi indah kerana tidur awal.`,
          tone: "Penutup sempurna",
        },
      },
    ],
  },
  {
    title: "Bintang Jatuh di Tingkap",
    description: (pet) => `${pet.name} ternampak bintang jatuh di luar tingkap. Kamu cuma ada sekejap untuk buat pilihan.`,
    rarity: "rare",
    options: [
      {
        label: "Terus buat hajat",
        detail: "Ganjaran boleh jadi sangat tinggi kalau bernasib baik.",
        effect: { mood: 10, xp: 12 },
        result: (pet) => `${pet.name} pejam mata dan buat satu hajat besar. Suasana terus terasa magis.`,
        log: (pet) => `${pet.name} cepat-cepat buat hajat pada bintang jatuh.`,
        rareOutcome: {
          chance: 0.24,
          effect: { coins: 16, bond: 6, xp: 16 },
          result: (pet) => `${pet.name} rasa macam hajat itu didengar. Atas tingkap tiba-tiba muncul satu uncang kecil bintang.`,
          log: (pet) => `${pet.name} berjaya mencetuskan hajat yang benar-benar menjadi kenyataan.`,
          tone: "Hajat jadi nyata",
        },
      },
      {
        label: "Tengok sampai habis",
        detail: "Lebih stabil dan sesuai untuk detik ikatan yang tenang.",
        effect: { bond: 5, mood: 6, health: 4, xp: 8 },
        result: (pet) => `${pet.name} duduk bersama kamu melihat cahaya itu sampai hilang, seolah-olah menyimpan hari ini dalam kotak kenangan.`,
        log: (pet) => `${pet.name} memilih untuk melihat bintang jatuh dengan tenang. Saat itu memang sangat berharga.`,
        badOutcome: {
          chance: 0.12,
          effect: { mood: -3 },
          result: (pet) => `${pet.name} baru nak lihat betul-betul, tapi bintang itu sudah hilang. Tinggal rasa terkilan sedikit.`,
          log: (pet) => `${pet.name} terlepas saat paling terang dan jadi sedikit sedih.`,
          tone: "Terlepas peluang",
        },
      },
    ],
  },
];

const questTemplates = [
  {
    title: "Tiket ke Dunia Snek",
    description: (pet) =>
      `${pet.name} yakin di balik awan ada dunia snek dan mahu kumpul 3 bukti kegembiraan dahulu.`,
    target: 3,
    tags: ["feed", "play", "chat"],
    reward: { coins: 10, bond: 6, xp: 18 },
    completeText: (pet) => `${pet.name} berjaya dapat tiket berkilat dan mengisytiharkan kamu pasangan terbaik hari ini.`,
  },
  {
    title: "Pelan Tidur Siang",
    description: (pet) =>
      `${pet.name} mahu tidur siang yang sempurna dan perlu beberapa langkah tenang untuk dapatkan rentak semula.`,
    target: 4,
    tags: ["sleep", "time"],
    reward: { coins: 8, health: 8, xp: 15 },
    completeText: (pet) => `${pet.name} bermimpi indah dan menghadiahkan kamu sebutir bintang mimpi selepas bangun.`,
  },
  {
    title: "Gotong-Royong Sudut Kucing",
    description: (pet) =>
      `${pet.name} mahu jadikan sudut tidur paling comel dan berkilat di rumah.`,
    target: 3,
    tags: ["wash", "item"],
    reward: { coins: 9, hygiene: 10, bond: 4, xp: 14 },
    completeText: (pet) => `${pet.name} umumkan aktiviti bersih-bersih itu dapat markah penuh lalu menghadiahkan riben berkilat.`,
  },
  {
    title: "Latihan Aksi Petang",
    description: (pet) =>
      `${pet.name} mahu buat aksi petang yang kemas sebelum senja, jadi perlukan sesi main dan interaksi.`,
    target: 4,
    tags: ["play", "chat", "tap"],
    reward: { coins: 12, mood: 10, bond: 5, xp: 20 },
    completeText: (pet) => `${pet.name} berjaya habiskan latihan, dan walaupun penonton cuma kamu seorang, tepukannya paling kuat.`,
  },
  {
    title: "Persediaan Malam Selesa",
    description: (pet) =>
      `${pet.name} mahu malam yang selesa dengan sedikit makanan, minuman hangat dan rehat awal.`,
    target: 3,
    tags: ["feed", "sleep", "item"],
    reward: { coins: 9, health: 12, xp: 16 },
    completeText: (pet) => `${pet.name} selesai rutin malamnya lalu berbaring atas kusyen sambil nampak sangat puas hati.`,
  },
];

const mathMissionThemes = {
  arithmetic: "Kiraan latihan kucing",
  money: "Membeli snek kucing",
  time: "Jadual harian kucing",
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
  globalStory: "Pagi tadi Oyen termenung di tepi tingkap dan kata awan nampak macam kapas gula yang belum habis dimakan.",
  logs: [
    { time: "08:00", text: "Rumah kucing dibuka pagi ini, dan tiga ekor kucing kecil mula bangun di sudut masing-masing." },
    { time: "08:10", text: "Oyen datang dahulu untuk beri salam, sementara Abu dan Tompok memerhati cuaca di luar." },
  ],
};

let currentPlayerId = loadActivePlayerId();
const state = loadState();

const statsConfig = [
  { key: "hunger", label: "Kenyang", icon: "🍓", color: "#ff7a59" },
  { key: "mood", label: "Mood", icon: "🌈", color: "#2cb8b0" },
  { key: "energy", label: "Tenaga", icon: "⚡", color: "#7a71ff" },
  { key: "hygiene", label: "Bersih", icon: "🫧", color: "#4f93ff" },
  { key: "health", label: "Sihat", icon: "💖", color: "#97db4f" },
];

const actionEffects = {
  feed: {
    stats: { hunger: 18, health: 4, mood: 5 },
    coins: -2,
    bond: 3,
    xp: 9,
    log: (pet) => `Kamu beri ${pet.name} makan dan dia menjilat mulutnya dengan sangat puas.`,
    story: (pet) => `Kamu hulurkan satu pinggan kecil makanan hangat, dan ${pet.name} terus nampak lebih segar selepas kenyang.`,
  },
  play: {
    stats: { mood: 15, energy: -10, hunger: -8, hygiene: -4 },
    coins: 0,
    bond: 4,
    xp: 11,
    log: (pet) => `Kamu melayan ${pet.name} bermain seketika dan matanya terus bersinar terang.`,
    story: (pet) => `Kamu dan ${pet.name} berkejaran dalam rumah sampai dia hampir bergolek kerana terlalu seronok.`,
  },
  wash: {
    stats: { hygiene: 22, mood: 6, health: 3 },
    coins: -1,
    bond: 2,
    xp: 8,
    log: (pet) => `Kamu membersihkan ${pet.name} dengan teliti dan dia nampak jauh lebih selesa.`,
    story: (pet) => `Buih berterbangan di udara dan selepas siap dibersihkan, ${pet.name} menggesel lembut pada kamu.`,
  },
  sleep: {
    stats: { energy: 24, health: 5, mood: 2, hunger: -6 },
    coins: 0,
    bond: 2,
    xp: 7,
    log: (pet) => `${pet.name} tidur sekejap dan nafasnya jadi lebih tenang.`,
    story: (pet) => `Kamu rapikan tempat tidurnya, dan ${pet.name} pun cepat lena sambil memeluk bantal kecil.`,
  },
};

const eventPool = [
  {
    condition: (pet) => pet.stats.mood < 45,
    apply: (pet) => ({
      badge: "Perlu dipujuk",
      story: `${pet.name} meringkuk atas kain kecilnya seolah-olah hanya mahu ditemani dengan tenang.`,
      line: `${pet.name} mengiau perlahan, seolah-olah meminta kamu duduk bersamanya sekejap.`,
      effect: { mood: 8, bond: 2 },
      log: `${pet.name} sedikit merajuk, tetapi nampak lebih lega selepas dipujuk.`,
    }),
  },
  {
    condition: (pet) => pet.stats.hunger < 40,
    apply: (pet) => ({
      badge: "Perut berbunyi",
      story: `${pet.name} asyik memandang ke arah dapur seperti menunggu keajaiban makanan berlaku.`,
      line: "Ada kemungkinan tak... sekarang ni masa snek?",
      effect: { health: -2 },
      log: `${pet.name} terlalu lapar sampai langkahnya pun jadi perlahan sedikit.`,
    }),
  },
  {
    condition: (pet) => pet.stats.hygiene < 50,
    apply: (pet) => ({
      badge: "Sedikit comot",
      story: `${pet.name} bergolek dalam timbunan kusyen sampai badannya jadi penuh habuk halus.`,
      line: "Jangan ambil gambar dulu, bulu aku tengah versi berdebu.",
      effect: { mood: -2 },
      log: `${pet.name} bermain terlalu seronok sampai badannya diselaputi habuk.`,
    }),
  },
  {
    condition: () => true,
    apply: (pet) => ({
      badge: "Babak kecil",
      story: `${pet.name} tiba-tiba mengisytiharkan tompokan cahaya di lantai ialah pintu rahsia dan mengajak kamu menjaganya.`,
      line: "Kalau kita serius cukup lama, mesti ada pengembaraan di belakang pintu ni.",
      effect: { mood: 5, xp: 8 },
      log: `${pet.name} mengajak kamu berlakon satu pengembaraan kecil secara spontan.`,
    }),
  },
  {
    condition: () => true,
    apply: (pet) => ({
      badge: "Tuah kecil",
      story: `Satu bintang kecil jatuh dekat tingkap dan ${pet.name} terus anggapnya sebagai pembawa tuah hari ini.`,
      line: "Aku rasa macam tuah baru singgah tadi.",
      effect: { mood: 4, coins: 4 },
      log: `${pet.name} jumpa sebutir bintang dan berpusing gembira tiga kali.`,
    }),
  },
  {
    condition: (pet) => state.hour >= 18 && pet.stats.energy < 60,
    apply: (pet) => ({
      badge: "Malam tiba",
      story: `${pet.name} memandang langit yang makin gelap dan mahu habiskan waktu terakhir hari ini dengan tenang.`,
      line: "Hari dah nak malam. Patutkah kita mula rutin sebelum tidur?",
      effect: { mood: 3, xp: 6 },
      log: `${pet.name} jadi lebih senyap waktu petang, seolah-olah menunggu hari ini ditutup dengan lembut.`,
    }),
  },
  {
    condition: (pet) => state.hour <= 10 && pet.stats.energy > 50,
    apply: (pet) => ({
      badge: "Idea pagi",
      story: `${pet.name} bangun dengan tenaga penuh dan terus dapat idea untuk permainan baru hari ini.`,
      line: "Waktu pagi paling sesuai untuk mula. Aku dah fikir cabaran pertama kita.",
      effect: { mood: 5, xp: 8 },
      log: `${pet.name} sudah penuh idea sejak pagi dan seluruh rumah terasa lebih hidup.`,
    }),
  },
  {
    condition: (pet) => pet.bond >= 24,
    apply: (pet) => ({
      badge: "Detik ikatan",
      story: `${pet.name} datang rapat dan menggesel pada kamu seperti mahu memastikan kamu akan terus ada di sisinya.`,
      line: "Sekarang aku rasa, bila aku toleh saja, mesti kamu ada dekat sini.",
      effect: { mood: 6, health: 2, xp: 8 },
      log: `${pet.name} mencetuskan satu detik hubungan yang lebih rapat dengan kamu.`,
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
  welcomeShell: document.querySelector("#welcome-shell"),
  playerIdInput: document.querySelector("#player-id-input"),
  startGame: document.querySelector("#start-game"),
  welcomeNote: document.querySelector("#welcome-note"),
  toggleSettings: document.querySelector("#toggle-settings"),
  switchPlayer: document.querySelector("#switch-player"),
  playerIdState: document.querySelector("#player-id-state"),
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
    currentLine: `${petCatalog[id].name} nak main tangkap bola!`,
    currentStory: `${petCatalog[id].name} mundar-mandir di depan tempat tidur sambil menunggu interaksi pertama hari ini.`,
    badge: "Keadaan stabil",
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
    const prompt = `Oyen sedang berlatih melompat. Dia buat ${a} lompatan, kemudian tambah ${b} lagi. Berapa jumlah semuanya?`;
    const answer = a + b;
    return buildQuestion("arithmetic", prompt, answer, [answer - 2, answer + 3, answer + 5]);
  }

  if (grade === 5) {
    const a = randomInt(6, 12);
    const b = randomInt(4, 9);
    const prompt = `Tompok mahu sediakan hiasan persembahan. Setiap baris ada ${a} belon dan ada ${b} baris. Berapa jumlah belon semuanya?`;
    const answer = a * b;
    return buildQuestion("arithmetic", prompt, answer, [answer - b, answer + a, answer + 6]);
  }

  const a = randomInt(24, 72);
  const b = randomInt(3, 8);
  const prompt = `Abu kumpul ${a} bintang dan mahu bahagi sama rata kepada ${b} bahagian. Setiap bahagian ada berapa?`;
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
      `Seekor kucing mahu beli ${qty} snek. Setiap satu RM${price}. Jumlah semuanya berapa?`,
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
      `Kamu bawa RM${wallet} untuk beli mainan kucing. Selepas belanja RM${spend}, baki tinggal berapa?`,
      `RM${answer}`,
      [`RM${answer + 2}`, `RM${Math.max(0, answer - 3)}`, `RM${wallet + spend}`]
    );
  }

  const price = randomInt(8, 15);
  const discount = randomInt(1, 4);
  const answer = price - discount;
  return buildQuestion(
    "money",
    `Beg kucing berharga RM${price}, sekarang diskaun RM${discount}. Harga selepas diskaun berapa?`,
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
    `Sekarang pukul ${hour}:${String(minute).padStart(2, "0")}. Selepas ${extra} minit, pukul berapa kucing mula aktiviti?`,
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

function sanitizePlayerId(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 18);
}

function getPlayerStorageKey(playerId) {
  return `${storageKeyPrefix}-${playerId}`;
}

function loadActivePlayerId() {
  return sanitizePlayerId(window.localStorage.getItem(activePlayerKey) || "");
}

function saveActivePlayerId(playerId) {
  window.localStorage.setItem(activePlayerKey, playerId);
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
    if (!currentPlayerId) return cloneDefaultState();

    const raw = window.localStorage.getItem(getPlayerStorageKey(currentPlayerId));
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
  if (!currentPlayerId) return;
  window.localStorage.setItem(getPlayerStorageKey(currentPlayerId), JSON.stringify(state));
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
    addLog(`${petCatalog[pet.id].name} naik ke Lv.${pet.level} dan nampak lebih bertenaga daripada tadi.`);
  }

  const nextStage = pet.level >= 7 ? 2 : pet.level >= 3 ? 1 : 0;
  if (nextStage !== pet.stage) {
    pet.stage = nextStage;
    pet.badge = "Naik tahap";
    pet.currentStory = `${petCatalog[pet.id].name} diselubungi cahaya lembut dan berjaya membesar menjadi ${petCatalog[pet.id].stageTitles[nextStage]}.`;
    pet.currentLine = "Aku rasa makin hebat sekarang, dan makin seronok nak buat aktiviti dengan kamu.";
    addLog(`${petCatalog[pet.id].name} baru sahaja melalui perubahan tahap pertumbuhan.`);
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
    pet.badge = "Ganjaran baru";
    pet.currentStory = `${petCatalog[pet.id].name} membuka ganjaran "${milestone.title}", dan rumah kucing kini ada koleksi baru.`;
    pet.currentLine = `${petCatalog[pet.id].name} berpusing-pusing dengan gembira seolah-olah menyuruh kamu cuba ganjaran itu sekarang juga.`;
    addLog(`${petCatalog[pet.id].name} mencapai Lv.${milestone.level} dan membuka ${milestone.title}.`);
  });
}

function getMoodProfile(pet) {
  const average =
    Object.values(pet.stats).reduce((sum, value) => sum + value, 0) /
    Object.values(pet.stats).length;
  const lines = petCatalog[pet.id].moodLines;

  if (average >= 78) {
    return { face: "excited", line: lines.excited, badge: "Sangat aktif" };
  }

  if (average >= 48) {
    return { face: "happy", line: lines.okay, badge: "Keadaan stabil" };
  }

  if (pet.stats.energy < 35) {
    return { face: "sleepy", line: lines.sleepy, badge: "Sudah mengantuk" };
  }

  return { face: "sad", line: lines.sad, badge: "Perlu dijaga" };
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
  pet.badge = "Cerita bergerak";
  if (state.quest.progress >= quest.target) {
    completeQuest();
  }
}

function completeQuest() {
  const quest = getCurrentQuest();
  const pet = activePet();
  applyPetChanges(pet, quest.reward);
  pet.currentStory = quest.completeText(activePetInfo());
  pet.currentLine = `${activePetInfo().name} serahkan ganjaran itu pada kamu dengan penuh bangga.`;
  pet.badge = "Cerita selesai";
  state.globalStory = pet.currentStory;
  addLog(`${quest.title} selesai dan kamu menerima ganjaran tambahan.`);
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
    pet.currentStory = `${activePetInfo().name} mundar-mandir dalam ruang kecilnya sambil menunggu interaksi seterusnya dengan kamu.`;
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
    pet.badge = choiceEvent.rarity === "rare" ? "Acara rare" : "Perlu pilih";
    pet.currentStory = state.pendingChoice.description;
    pet.currentLine = `${info.name} mendongak memandang kamu, seolah-olah menunggu keputusan akhir.`;
    state.globalStory = pet.currentStory;
    addLog(`${info.name} berdepan satu peristiwa kecil yang memerlukan keputusan kamu.`);
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
  let outcomeBadge = state.pendingChoice.rarity === "rare" ? "Pilihan rare" : "Pilihan selesai";
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
  pet.currentLine = `${activePetInfo().name} mengangguk kecil dan terus ikut keputusan kamu.`;
  pet.badge = outcomeBadge;
  state.globalStory = pet.currentStory;
  addLog(outcomeLog);
  updateQuestProgress(outcomeQuestTag);
  state.pendingChoice = null;
  playSound(outcomeBadge === "Pilihan selesai" ? "happy" : outcomeQuestTag === "play" ? "rare" : "soft");
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
  pet.badge = actionKey === "sleep" ? "Sedang pulih" : "Interaksi selesai";
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
    feed: `${info.name} mengecilkan mata dengan puas, seolah-olah mahu simpan hidangan ini dalam diari bahagia.`,
    play: `${info.name} berpusing setempat dan mengisytiharkan permainan tadi memang hebat.`,
    wash: `${info.name} menghidu badannya sendiri dan mengesahkan dia kini sangat wangi.`,
    sleep: `${info.name} menguap sambil memeluk kusyen kecil, bersedia untuk satu lagi tidur yang lena.`,
    chat: `${info.name} memandang kamu penuh fokus, seolah-olah menyimpan setiap kata dalam hati.`,
    tap: `${info.name} disentuh perlahan dan terus tunjuk muka seperti faham kamu memang sayang padanya.`,
    quest: `${info.name} nampak sangat serius dengan tugas baru, sampai ekornya pun bergerak penuh semangat.`,
  };

  return map[context] || profile.line;
}

function advanceHour() {
  state.hour += 1;
  if (state.hour >= 24) {
    state.hour = 0;
    state.day += 1;
    state.coins += 6;
    addLog("Hari baru bermula dan kamu menerima 6 bintang sebagai ganjaran masuk.");
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
  pet.currentStory = `Kamu duduk dekat ${info.name} dan berbual seketika. Dia mendengar dengan penuh fokus sambil menggerakkan ekor perlahan-lahan.`;
  pet.badge = "Sedang berbual";
  applyPetChanges(pet, { mood: 8, bond: 3, xp: 6 });
  state.globalStory = pet.currentStory;
  addLog(`Kamu meluangkan masa berbual dengan ${info.name}, dan moodnya jadi lebih ringan.`);
  updateQuestProgress("chat");
  playSound("soft");
  render();
}

function petTapReaction() {
  const pet = activePet();
  const info = activePetInfo();
  pet.currentLine = generateContextLine(info, "tap");
  pet.currentStory = `Kamu sentuh ${info.name} perlahan-lahan, lalu dia mendongak seperti menunggu arahan seterusnya.`;
  pet.badge = "Sedang berinteraksi";
  applyPetChanges(pet, { mood: 4, bond: 2, xp: 4 });
  state.globalStory = pet.currentStory;
  addLog(`Kamu sentuh ${info.name} dan dia terus memberi reaksi yang comel.`);
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
  pet.currentLine = `${info.name} terus nampak lebih ceria selepas menerima ${item.label}.`;
  pet.currentStory = `${info.name} memeluk ${item.label} erat-erat seolah-olah itulah hadiah paling disukainya hari ini.`;
  pet.badge = "Item digunakan";
  state.globalStory = pet.currentStory;
  addLog(item.log.replace("si kucing", info.name));
  updateQuestProgress("item");
  playSound("happy");
  render();
}

function advanceQuestManually() {
  const pet = activePet();
  const info = activePetInfo();
  pet.currentLine = generateContextLine(info, "quest");
  pet.currentStory = getCurrentQuest().description(info);
  pet.badge = "Tugas dikemas kini";
  state.globalStory = pet.currentStory;
  applyPetChanges(pet, { mood: 3, xp: 5 });
  addLog(`${info.name} meneliti sasaran cerita semasa dengan bersungguh-sungguh.`);
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
  const confirmed = window.confirm("Padam semua progres kucing sekarang dan mula semula?");
  if (!confirmed) return;

  const freshState = cloneDefaultState();
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, freshState);
  if (currentPlayerId) {
    window.localStorage.removeItem(getPlayerStorageKey(currentPlayerId));
  }
  applyMotionSetting();
  render();
}

function enterGameWithPlayer(playerId) {
  const cleanId = sanitizePlayerId(playerId);
  if (!cleanId) {
    elements.welcomeNote.textContent = "Masukkan ID ringkas menggunakan huruf atau nombor.";
    return;
  }

  currentPlayerId = cleanId;
  saveActivePlayerId(cleanId);
  const freshState = loadState();
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, freshState);
  document.body.classList.remove("app-locked");
  elements.welcomeNote.textContent = "Setiap ID akan simpan permainan yang berasingan.";
  render();
}

function showWelcomeScreen() {
  document.body.classList.add("app-locked");
  elements.playerIdInput.value = currentPlayerId || "";
}

function switchPlayerFlow() {
  const confirmed = window.confirm("Tukar ID pemain? Progres semasa sudah disimpan pada ID ini.");
  if (!confirmed) return;
  showWelcomeScreen();
}

function setMathGrade(grade) {
  state.math = createMathState(grade);
  state.globalStory = `${activePetInfo().name} kini menggunakan senarai misi matematik Tahun ${grade} dan bersedia untuk tugasan baru.`;
  addLog(`Kamu menukar misi matematik ke mod Tahun ${grade}.`);
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
    pet.currentLine = `${activePetInfo().name} mengiau gembira kerana jawapan itu memang tepat pada masanya.`;
    pet.currentStory = `${activePetInfo().name} berjaya menyelesaikan satu misi matematik dan bersedia mengutip ganjaran ke dalam beg item.`;
    pet.badge = "Misi matematik siap";
    state.globalStory = pet.currentStory;
    addLog(`${activePetInfo().name} menyelesaikan satu misi matematik dan mendapat ganjaran perkembangan.`);

    if (state.math.completed >= state.math.questions.length) {
      state.inventory.pudding = (state.inventory.pudding || 0) + 1;
      pet.currentLine = `${activePetInfo().name} mengumumkan semua misi matematik hari ini sudah siap dan ganjaran boleh diambil.`;
      pet.currentStory = `${activePetInfo().name} menyiapkan ketiga-tiga misi matematik hari ini dan kamu menerima 1 puding strawberi sebagai bonus.`;
      pet.badge = "Semua misi siap";
      addLog(`Semua misi matematik hari ini selesai. Kamu mendapat 1 puding strawberi tambahan.`);
      updateQuestProgress("chat");
    } else {
      state.math.currentIndex += 1;
    }

    playSound("happy");
  } else {
    pet.currentLine = `${activePetInfo().name} kata tak apa, mari tengok soalan itu sekali lagi dengan tenang.`;
    pet.currentStory = `${activePetInfo().name} tidak marah, malah masih mahu cuba semula misi matematik bersama kamu.`;
    pet.badge = "Cuba lagi";
    state.globalStory = pet.currentStory;
    addLog(`${activePetInfo().name} tersalah satu soalan matematik, tetapi masih mahu terus mencuba bersama kamu.`);
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
    pet.currentStory = `${activePetInfo().name} kembali ke tengah pentas.`;
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
            <span>Lv.${pet.level} · ${info.trait}</span>
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
              <span>Item kecil untuk bantu penjagaan kucing</span>
            </div>
          </div>
          <div>
            <span class="inventory-count">x${count}</span>
            <button class="use-item-button" data-item="${key}" ${count <= 0 ? "disabled" : ""}>Guna</button>
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
  elements.questProgressText.textContent = `Progres ${progress} / ${quest.target}`;
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
  elements.unlockHint.textContent = nextLocked ? `Ganjaran seterusnya Lv. ${nextLocked.level}` : "Semua ganjaran sudah dibuka";
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
          <span class="unlock-badge">${unlocked ? "Sudah buka" : "Belum buka"}</span>
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
      ? `Acara rare: ${state.pendingChoice.description}`
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
    elements.mathTitle.textContent = "Semua misi matematik selesai";
    elements.mathQuestion.textContent = "Kamu sudah bantu kucing menyiapkan semua tugasan matematik hari ini. Datang semula esok.";
    elements.mathOptions.innerHTML = "";
    elements.mathRewardCopy.textContent = "Ganjaran hari ini sudah diberi, dan si kucing sangat puas hati.";
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

    elements.mathRewardCopy.textContent = "Jawapan betul memberi 3 bintang, XP pertumbuhan dan ganjaran ikatan.";
  }

  elements.mathProgressText.textContent = `Progres ${completed} / ${state.math.questions.length}`;
  elements.mathFill.style.width = `${percent}%`;
}

function renderSettings() {
  elements.soundState.textContent = state.settings.soundOn ? "Buka" : "Tutup";
  elements.motionState.textContent = state.settings.motionOn ? "Buka" : "Tutup";
  elements.playerIdState.textContent = currentPlayerId || "-";
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
  const currentFace = pet.badge === "Interaksi selesai" || pet.badge === "Cerita selesai" ? "excited" : profile.face;
  const excitedBadges = ["Interaksi selesai", "Pilihan selesai", "Cerita selesai", "Sedang berbual", "Sedang berinteraksi", "Misi matematik siap", "Semua misi siap"];
  const motionClass =
    pet.badge.includes("rare") || pet.badge === "Penemuan hebat" || pet.badge === "Hajat jadi nyata" || pet.badge === "Tuah besar" || pet.badge === "Ikatan kuat"
      ? "rare"
      : excitedBadges.includes(pet.badge)
        ? "interact"
        : "";
  const resolvedFace = excitedBadges.includes(pet.badge) ? "excited" : currentFace;
  elements.petFace.className = `pet-face stage-${pet.stage} ${resolvedFace} ${motionClass} ${info.faceClass}`;
  elements.petName.textContent = info.name;
  elements.petTrait.textContent = `${info.trait} · ${info.species}`;
  if (!pet.currentLine || pet.badge === "Keadaan stabil") {
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
elements.switchPlayer.addEventListener("click", switchPlayerFlow);
elements.startGame.addEventListener("click", () => enterGameWithPlayer(elements.playerIdInput.value));
elements.playerIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    enterGameWithPlayer(elements.playerIdInput.value);
  }
});

if (currentPlayerId) {
  document.body.classList.remove("app-locked");
  render();
} else {
  showWelcomeScreen();
}

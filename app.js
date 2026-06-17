(() => {
"use strict";

// ══════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════
const P = "ss4_";
const K = {
  U: P + "users",
  C: P + "cur",
  V: P + "ver",
  S: P + "set",
  W: P + "weak",
  PL: P + "placed"
};
const VER = "7.0.0";
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const M = document.getElementById("mainArea");

const MSG = {
  idle: ["Ready?", "Let's go!", "Your turn!", "Nice to see you!", "Time to learn!"],
  correct: ["Correct!", "Nice one!", "You got it!", "Exactly!", "Right on!", "Well done!"],
  wrong: ["Not quite", "Almost!", "Try again", "Close one!", "Keep trying"],
  greet: ["Welcome back!", "Hey there!", "Good to see you!", "Let's go!", "Ready?"]
};

const LEVEL_NAMES = [
  "Novice","Novice","Novice","Novice","Novice",
  "Apprentice","Apprentice","Apprentice","Apprentice","Apprentice",
  "Learner","Learner","Learner","Learner","Learner",
  "Student","Student","Student","Student","Student",
  "Scholar","Scholar","Scholar","Scholar","Scholar",
  "Expert","Expert","Expert","Expert","Expert",
  "Expert","Expert","Expert","Expert","Expert",
  "Master","Master","Master","Master","Master",
  "Master","Master","Master","Master","Master",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Sage","Sage","Sage","Sage","Sage",
  "Legend","Legend","Legend","Legend","Legend",
  "Legend","Legend","Legend","Legend","Legend",
  "Mythic","Mythic","Mythic","Mythic","Mythic",
  "Mythic","Mythic","Mythic","Mythic","Mythic"
];

const LEAGUES = [
  { id: "bronze", name: "Bronze", icon: "🥉", minXP: 0, color: "#CD7F32" },
  { id: "silver", name: "Silver", icon: "🥈", minXP: 500, color: "#C0C0C0" },
  { id: "gold", name: "Gold", icon: "🥇", minXP: 1500, color: "#FFD700" },
  { id: "diamond", name: "Diamond", icon: "💎", minXP: 4000, color: "#B9F2FF" }
];

const AVATARS = [
  { id: "frame_gold", name: "Gold Frame", cost: 100, icon: "🖼️", type: "frame", color: "#FFD700" },
  { id: "frame_diamond", name: "Diamond Frame", cost: 200, icon: "🖼️", type: "frame", color: "#B9F2FF" },
  { id: "frame_fire", name: "Fire Frame", cost: 150, icon: "🖼️", type: "frame", color: "#FF4B4B" },
  { id: "frame_star", name: "Star Frame", cost: 120, icon: "🖼️", type: "frame", color: "#FFC800" },
  { id: "frame_crown", name: "Crown Frame", cost: 180, icon: "👑", type: "frame", color: "#CE82FF" },
  { id: "frame_rainbow", name: "Rainbow Frame", cost: 250, icon: "🌈", type: "frame", color: "#FF86D0" },
  { id: "pet_lion", name: "Lion Cub", cost: 80, icon: "🦁", type: "pet" },
  { id: "pet_parrot", name: "Parrot", cost: 60, icon: "🦜", type: "pet" },
  { id: "pet_turtle", name: "Turtle", cost: 50, icon: "🐢", type: "pet" },
  { id: "pet_monkey", name: "Monkey", cost: 70, icon: "🐒", type: "pet" },
  { id: "bg_safari", name: "Safari BG", cost: 100, icon: "🌿", type: "bg" },
  { id: "bg_ocean", name: "Ocean BG", cost: 100, icon: "🌊", type: "bg" },
  { id: "bg_space", name: "Space BG", cost: 100, icon: "🚀", type: "bg" }
];

const WEEKLY_CHALLENGES = [
  { id: "w_learn", icon: "📝", label: "Learn 20 words", need: 20 },
  { id: "w_lessons", icon: "📚", label: "Complete 5 lessons", need: 5 },
  { id: "w_xp", icon: "✨", label: "Earn 200 XP", need: 200 }
];

const TUTOR_TIPS = {
  default: [
    "Try to remember the pattern!",
    "Practice makes perfect!",
    "You'll get it next time!"
  ],
  greetings: "Greetings are used at specific times of day. 'Good morning' is for before noon.",
  numbers: "Numbers in English follow a pattern. Practice counting out loud!",
  family: "Family words are very common. Mother = Mama, Father = Baba.",
  colors: "Colors are adjectives that describe things. Red = Nyekundu!",
  food: "Food words help you order meals. Water = Maji, Bread = Mkate.",
  animals: "African animals have unique names. Lion = Simba, Elephant = Tembo.",
  body: "Body parts are basic vocabulary. Head = Kichwa, Hand = Mkono.",
  phrases: "Common phrases are used every day. Thank you = Asante.",
  weather: "Weather words describe the sky. Sunny = Jua kali, Rainy = Mvua.",
  default_tip: "Keep practicing and you will remember!"
};

const BADGES = [
  { id: "first_word", icon: "🐣", name: "First Steps", desc: "Learn your first word" },
  { id: "five_lessons", icon: "📚", name: "Bookworm", desc: "Complete 5 lessons" },
  { id: "ten_lessons", icon: "🎓", name: "Scholar", desc: "Complete 10 lessons" },
  { id: "twenty_lessons", icon: "🏅", name: "Honor Roll", desc: "Complete 20 lessons" },
  { id: "streak_3", icon: "🔥", name: "On Fire", desc: "3-day streak" },
  { id: "streak_7", icon: "💎", name: "Week Warrior", desc: "7-day streak" },
  { id: "streak_14", icon: "⚡", name: "Fortnight Fighter", desc: "14-day streak" },
  { id: "streak_30", icon: "👑", name: "Unstoppable", desc: "30-day streak" },
  { id: "words_10", icon: "📝", name: "Word Collector", desc: "Learn 10 words" },
  { id: "words_25", icon: "📖", name: "Storyteller", desc: "Learn 25 words" },
  { id: "words_50", icon: "🏆", name: "Vocabulary Master", desc: "Learn 50 words" },
  { id: "words_100", icon: "📚", name: "Word Wizard", desc: "Learn 100 words" },
  { id: "perfect_3", icon: "⭐", name: "Rising Star", desc: "3 perfect lessons" },
  { id: "perfect_10", icon: "🌟", name: "Superstar", desc: "10 perfect lessons" },
  { id: "perfect_25", icon: "🎯", name: "Perfectionist", desc: "25 perfect lessons" },
  { id: "xp_100", icon: "🚀", name: "Level Up", desc: "Earn 100 XP" },
  { id: "xp_500", icon: "🎖️", name: "Veteran", desc: "Earn 500 XP" },
  { id: "xp_1000", icon: "🌍", name: "Globe Trotter", desc: "Earn 1000 XP" },
  { id: "xp_5000", icon: "🏅", name: "XP Champion", desc: "Earn 5000 XP" },
  { id: "no_wrong", icon: "💎", name: "Diamond", desc: "Complete with 0 mistakes" },
  { id: "speed_demon", icon: "⚡", name: "Speed Demon", desc: "Finish under 2 minutes" },
  { id: "speed_run", icon: "⏱️", name: "Speed Run", desc: "Lesson under 60s" },
  { id: "night_owl", icon: "🦉", name: "Night Owl", desc: "Study after 9 PM" },
  { id: "early_bird", icon: "🌅", name: "Early Bird", desc: "Study before 8 AM" },
  { id: "night_master", icon: "🌙", name: "Night Master", desc: "5 lessons at night" },
  { id: "early_master", icon: "☀️", name: "Early Master", desc: "5 lessons morning" },
  { id: "all_units", icon: "🎯", name: "Safari Master", desc: "Complete all units" },
  { id: "first_boss", icon: "🐉", name: "Boss Slayer", desc: "Defeat first boss" },
  { id: "vocab_master_50", icon: "📖", name: "Vocab Expert", desc: "50 words mastered" },
  { id: "league_gold", icon: "🥇", name: "Gold League", desc: "Reach Gold league" },
  { id: "league_diamond", icon: "💎", name: "Diamond League", desc: "Reach Diamond league" },
  { id: "all_lessons", icon: "🎓", name: "Graduate", desc: "Complete all lessons" },
  { id: "friend_3", icon: "👫", name: "Social Butterfly", desc: "Add 3 friends" },
  { id: "quest_7", icon: "🏆", name: "Quest Champion", desc: "Complete all quests 7x" }
];

const SHOP = [
  { id: "streak_freeze", name: "Streak Freeze", desc: "Protect streak 1 day", cost: 50, icon: "🧊" },
  { id: "hearts_refill", name: "Heart Refill", desc: "Refill all hearts", cost: 30, icon: "❤️" },
  { id: "xp_boost", name: "XP Boost", desc: "Double XP 30 min", cost: 80, icon: "⚡" }
];

const DAILY = [
  { id: "lesson", icon: "📚", label: "Complete 1 lesson", need: 1 },
  { id: "xp", icon: "✨", label: "Earn 30 XP", need: 30 },
  { id: "perfect", icon: "💎", label: "Get a perfect score", need: 1 },
  { id: "words", icon: "📝", label: "Practice 5 words", need: 5 },
  { id: "minutes", icon: "⏱️", label: "Study 10 minutes", need: 10 }
];

const FETCH_CATEGORIES = [
  "animals", "food", "colors", "family", "body+parts",
  "nature", "school", "home", "travel", "weather"
];
const FETCH_EMOJIS = [
  "🐶","🍎","🌈","👨‍👩‍👧","🦴","🌿","📚","🏠","✈️","☀️",
  "🐱","🍊","🌺","👩","👁️","🌳","✏️","🛋️","🚗","❄️",
  "🐰","🍋","🌻","👦","👂","🌙","🎒","🍳","🚌","🌧️"
];

const SWAHILI = {
  hello: "habari", goodbye: "kwaheri", thank: "asante", please: "tafadhali",
  water: "maji", food: "chakula", friend: "rafiki", family: "familia",
  cat: "paka", dog: "mbwa", tree: "mti", sun: "jua", moon: "mwezi",
  book: "kitabu", pen: "kalamu", school: "shule", teacher: "mwalimu",
  big: "kubwa", small: "ndogo", good: "nzuri", bad: "mbaya",
  one: "moja", two: "mbili", three: "tatu", four: "nne", five: "tano",
  six: "sita", seven: "saba", eight: "nane", nine: "tisa", ten: "kumi",
  red: "nyekundu", blue: "bluu", green: "kijani", yellow: "njano",
  happy: "furaha", sad: "huzuni", eat: "kula", drink: "kunywa",
  go: "kwenda", come: "kuja", see: "kuona", hear: "kusikia",
  mother: "mama", father: "baba", sister: "dada", brother: "kaka",
  grandmother: "bibi", grandfather: "babu", morning: "asubuhi",
  afternoon: "mchana", evening: "jioni", night: "usiku",
  apple: "tufaha", banana: "ndizi", mango: "embe", orange: "chungwa",
  head: "kichwa", eye: "jicho", ear: "sikio", mouth: "mdomo",
  hand: "mkono", leg: "mguu", heart: "moyo", blood: "damu",
  beautiful: "nzuri", strong: "imara", fast: "haraka", slow: "taratibu",
  open: "fungua", close: "funga", give: "pa", take: "chukua",
  today: "leo", tomorrow: "kesho", yesterday: "jana", always: "daima",
  yes: "ndio", no: "hapana", sorry: "pole",
  house: "nyumba", door: "mlango", window: "dirisha", chair: "kiti",
  table: "meza", bed: "kitanda", floor: "sakafu", wall: "ukuta",
  boy: "mvulana", girl: "msichana", man: "mtu", woman: "mwanamke",
  baby: "mtoto", old: "mzee", new: "mpya", first: "kwanza",
  learn: "jifunze", read: "soma", write: "andika", speak: "ongea",
  listen: "sikiliza", understand: "elewa", remember: "kumbuka",
  star: "nyota", rain: "mvua", fire: "moto",
  time: "wakati", clock: "saa", hour: "saa", minute: "dakika",
  name: "jina", age: "umri", country: "nchi", city: "jiji",
  animal: "mnyama", bird: "ndege", fish: "samaki", cow: "ng'ombe",
  chicken: "kuku", rice: "mchele", milk: "maziwa", tea: "chai",
  car: "gari", bus: "basi", plane: "ndege", train: "treini",
  // Unit 5 - Wild Safari
  rhino: "kifaru", buffalo: "nyati", cheetah: "duma", crocodile: "mamba",
  hyena: "fisi", warthog: "ngiri", mountain: "mlima",
  // Unit 6 - Actions & Fun
  run: "kukimbia", jump: "kuruka", sleep: "kulala", sing: "kuimba",
  dance: "kucheza", shirt: "shati", pants: "suruali", shoes: "viatu",
  hat: "kofia", dress: "gauni", socks: "soksi",
  // Unit 7 - School & Learning
  student: "mwanafunzi", classroom: "darasa", homework: "kazi ya nyumbani",
  paper: "karatasi", circle: "duara", square: "mraba", triangle: "pembetatu",
  rectangle: "mstatili",
  // Unit 8 - Weather & Time
  sunny: "jua kali", rainy: "mvua", cloudy: "wingu", windy: "upepo",
  hot: "joto", cold: "baridi", storm: "dhoruba",
  monday: "jumatatu", tuesday: "jumanne", wednesday: "jumatano",
  thursday: "alhamisi", friday: "ijumaa", saturday: "jumamosi", sunday: "jumapili",
  // Unit 9 - Transport & Places
  bicycle: "baisikeli", motorcycle: "boda boda", boat: "mashua",
  hospital: "hospitali", market: "soko", church: "kanisa", shop: "duka",
  park: "bustani", library: "maktaba",
  // Unit 10 - Emotions & People
  angry: "hasira", scared: "wasiwasi", tired: "uchovu", excited: "msisimko",
  doctor: "daktari", nurse: "nurse", farmer: "mkulima", cook: "mpishi",
  driver: "dereva", police: "polisi", artist: "msanaa"
};

// ══════════════════════════════════════
// STATE
// ══════════════════════════════════════
function freshState() {
  return {
    user: null,
    progress: {},
    stats: { lessonsDone: 0, wordsLearned: 0, correct: 0, wrong: 0, xp: 0, perfectLessons: 0, nightLessons: 0, earlyLessons: 0, questsDone: 0 },
    streak: 0,
    stars: 30,
    xp: 0,
    xpLevel: 1,
    hearts: 5,
    heartsRegen: Date.now(),
    vocab: [],
    badges: [],
    dailyActivity: {},
    streakFreeze: 0,
    daily: {},
    weakCategories: {},
    wrongWords: [],
    placed: false,
    friends: [],
    ownedAvatars: [],
    avatar: { frame: null, pet: null, bg: null },
    weeklyXp: 0,
    lastWeekReset: 0,
    weeklyChallenge: {},
    bossDefeated: [],
    lastLogin: 0,
    studyMinutes: 0,
    lastStudyStart: 0
  };
}

let S = freshState();

// ══════════════════════════════════════
// SOUND
// ══════════════════════════════════════
let audioCtx = null;

function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (_) { /* ignore */ }
}

function playTone(freq, duration, type = "sine", volume = 0.12) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) { /* ignore */ }
}

function sndCorrect() {
  playTone(523, 0.08);
  setTimeout(() => playTone(659, 0.08), 80);
  setTimeout(() => playTone(784, 0.15), 160);
}

function sndWrong() {
  playTone(300, 0.12, "sawtooth");
  setTimeout(() => playTone(250, 0.15, "sawtooth"), 120);
}

function sndLevelUp() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.12), i * 100));
}

function sndClick() {
  playTone(880, 0.03);
}

function sndBadge() {
  [784, 988, 1175, 1319].forEach((f, i) => setTimeout(() => playTone(f, 0.1), i * 80));
}

function sndBoss() {
  [392, 440, 523, 659, 784, 880, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.15, "sawtooth", 0.08), i * 80));
}

function sndCoin() {
  playTone(988, 0.06);
  setTimeout(() => playTone(1319, 0.1), 60);
}

// ══════════════════════════════════════
// STORAGE
// ══════════════════════════════════════
function getUsers() {
  try { return JSON.parse(localStorage.getItem(K.U)) || {}; }
  catch (_) { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(K.U, JSON.stringify(users));
}

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(K.S)) || {
      dark: false, sound: true, notif: false,
      shuffle: false, timer: 0, pin: ""
    };
  } catch (_) {
    return { dark: false, sound: true, notif: false, shuffle: false, timer: 0, pin: "" };
  }
}

function saveSettings(settings) {
  localStorage.setItem(K.S, JSON.stringify(settings));
}

function applySettings(settings) {
  document.documentElement.setAttribute("data-theme", settings.dark ? "dark" : "light");
}

function saveState() {
  if (!S.user) return;
  const users = getUsers();
  users[S.user.name] = {
    name: S.user.name,
    role: S.user.role,
    progress: S.progress,
    stats: S.stats,
    streak: S.streak,
    stars: S.stars,
    xp: S.xp,
    xpLevel: S.xpLevel,
    hearts: S.hearts,
    heartsRegen: S.heartsRegen,
    vocab: S.vocab,
    badges: S.badges,
    dailyActivity: S.dailyActivity,
    streakFreeze: S.streakFreeze,
    daily: S.daily,
    weakCategories: S.weakCategories,
    wrongWords: S.wrongWords,
    placed: S.placed,
    friends: S.friends || [],
    ownedAvatars: S.ownedAvatars || [],
    avatar: S.avatar || { frame: null, pet: null, bg: null },
    weeklyXp: S.weeklyXp || 0,
    lastWeekReset: S.lastWeekReset || 0,
    weeklyChallenge: S.weeklyChallenge || {},
    bossDefeated: S.bossDefeated || [],
    lastLogin: S.lastLogin || 0,
    studyMinutes: S.studyMinutes || 0,
    lastStudyStart: S.lastStudyStart || 0
  };
  saveUsers(users);
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

// ══════════════════════════════════════
// XP / LEVEL
// ══════════════════════════════════════
function xpNeeded(level) {
  return level * 100;
}

function addXP(amount) {
  if (!S.user) return;
  S.xp += amount;
  S.stats.xp += amount;
  trackWeeklyXp(amount);
  trackWeeklyChallenge("w_xp", amount);
  while (S.xp >= xpNeeded(S.xpLevel)) {
    S.xp -= xpNeeded(S.xpLevel);
    S.xpLevel++;
    sndLevelUp();
  }
  saveState();
  refreshXPDisplay();
}

function refreshXPDisplay() {
  const needed = xpNeeded(S.xpLevel);
  const pct = Math.min(100, (S.xp / needed) * 100);

  const bar = document.getElementById("xpBarFill");
  const text = document.getElementById("xpProgressText");
  const level = document.getElementById("levelDisplay");
  const xp = document.getElementById("xpDisplay");

  if (bar) bar.style.width = pct + "%";
  if (text) text.textContent = S.xp + " / " + needed;
  if (level) level.textContent = S.xpLevel;
  if (xp) xp.textContent = S.stats.xp;
}

// ══════════════════════════════════════
// HEARTS
// ══════════════════════════════════════
function refreshHeartsDisplay() {
  const el = document.getElementById("heartsDisplay");
  if (el) el.textContent = S.hearts;
}

function loseHeart() {
  if (S.hearts <= 0) return false;
  S.hearts--;
  S.heartsRegen = Date.now();
  refreshHeartsDisplay();
  saveState();
  return S.hearts > 0;
}

function regenHearts() {
  if (S.hearts >= 5 || !S.user) return;
  const elapsed = Date.now() - (S.heartsRegen || Date.now());
  const gained = Math.floor(elapsed / 300000);
  if (gained > 0) {
    S.hearts = Math.min(5, S.hearts + gained);
    S.heartsRegen = Date.now();
    saveState();
    refreshHeartsDisplay();
  }
}

// ══════════════════════════════════════
// STREAK
// ══════════════════════════════════════
function refreshStreakDisplay() {
  const el = document.getElementById("streakDisplay");
  if (el) el.textContent = S.streak;
}

function markDay() {
  const today = dateKey();
  if (!S.dailyActivity[today]) {
    S.dailyActivity[today] = true;
    const yesterday = dateKey(new Date(Date.now() - 86400000));
    S.streak = (S.dailyActivity[yesterday] ? S.streak : 0) + 1;
    saveState();
    refreshStreakDisplay();
  }
}

function checkStreak() {
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  const today = dateKey();
  if (!S.dailyActivity[yesterday] && !S.dailyActivity[today]) {
    if (S.streakFreeze > 0) {
      S.streakFreeze--;
      saveState();
    } else {
      S.streak = 0;
      saveState();
    }
  }
  refreshStreakDisplay();
}

// ══════════════════════════════════════
// BADGES
// ══════════════════════════════════════
function checkBadges() {
  const owned = S.badges || [];
  const has = (id) => owned.some((b) => b.id === id);
  const newlyEarned = [];

  // Word badges
  if (!has("first_word") && S.vocab.length >= 1) newlyEarned.push("first_word");
  if (!has("words_10") && S.vocab.length >= 10) newlyEarned.push("words_10");
  if (!has("words_25") && S.vocab.length >= 25) newlyEarned.push("words_25");
  if (!has("words_50") && S.vocab.length >= 50) newlyEarned.push("words_50");
  if (!has("words_100") && S.vocab.length >= 100) newlyEarned.push("words_100");

  // Lesson badges
  if (!has("five_lessons") && S.stats.lessonsDone >= 5) newlyEarned.push("five_lessons");
  if (!has("ten_lessons") && S.stats.lessonsDone >= 10) newlyEarned.push("ten_lessons");
  if (!has("twenty_lessons") && S.stats.lessonsDone >= 20) newlyEarned.push("twenty_lessons");

  // Streak badges
  if (!has("streak_3") && S.streak >= 3) newlyEarned.push("streak_3");
  if (!has("streak_7") && S.streak >= 7) newlyEarned.push("streak_7");
  if (!has("streak_14") && S.streak >= 14) newlyEarned.push("streak_14");
  if (!has("streak_30") && S.streak >= 30) newlyEarned.push("streak_30");

  // XP badges
  if (!has("xp_100") && S.stats.xp >= 100) newlyEarned.push("xp_100");
  if (!has("xp_500") && S.stats.xp >= 500) newlyEarned.push("xp_500");
  if (!has("xp_1000") && S.stats.xp >= 1000) newlyEarned.push("xp_1000");
  if (!has("xp_5000") && S.stats.xp >= 5000) newlyEarned.push("xp_5000");

  // Perfect badge
  const perfectCount = S.stats.perfectLessons || 0;
  if (!has("perfect_3") && perfectCount >= 3) newlyEarned.push("perfect_3");
  if (!has("perfect_10") && perfectCount >= 10) newlyEarned.push("perfect_10");
  if (!has("perfect_25") && perfectCount >= 25) newlyEarned.push("perfect_25");

  // Time-based badges
  const hour = new Date().getHours();
  if (!has("night_owl") && hour >= 21 && S.stats.lessonsDone > 0) newlyEarned.push("night_owl");
  if (!has("early_bird") && hour < 8 && S.stats.lessonsDone > 0) newlyEarned.push("early_bird");
  if (!has("night_master") && (S.stats.nightLessons || 0) >= 5) newlyEarned.push("night_master");
  if (!has("early_master") && (S.stats.earlyLessons || 0) >= 5) newlyEarned.push("early_master");

  // Boss badge
  if (!has("first_boss") && (S.bossDefeated || []).length >= 1) newlyEarned.push("first_boss");

  // League badges
  const league = getLeague(S.weeklyXp || 0);
  if (!has("league_gold") && (league.id === "gold" || league.id === "diamond")) newlyEarned.push("league_gold");
  if (!has("league_diamond") && league.id === "diamond") newlyEarned.push("league_diamond");

  // All lessons badge
  const allDone = LESSONS.filter((l) => !l.id.startsWith("boss_")).every((l) => S.progress[l.id]?.completed);
  if (!has("all_lessons") && allDone) newlyEarned.push("all_lessons");

  // All units badge
  const units = [...new Set(LESSONS.filter((l) => !l.id.startsWith("boss_")).map((l) => l.unit))];
  const allUnitsDone = units.every((unit) =>
    LESSONS.filter((l) => l.unit === unit && !l.id.startsWith("boss_")).every((l) => S.progress[l.id]?.completed)
  );
  if (!has("all_units") && allUnitsDone) newlyEarned.push("all_units");

  // Vocab mastery badge
  const mastered = (S.vocab || []).filter((v) => (v.mastery || 0) >= 3).length;
  if (!has("vocab_master_50") && mastered >= 50) newlyEarned.push("vocab_master_50");

  // Friend badge
  if (!has("friend_3") && (S.friends || []).length >= 3) newlyEarned.push("friend_3");

  // Quest badge
  if (!has("quest_7") && (S.stats.questsDone || 0) >= 7) newlyEarned.push("quest_7");

  // Award new badges
  newlyEarned.forEach((id) => {
    const badge = BADGES.find((b) => b.id === id);
    if (badge) {
      owned.push({ id, at: Date.now() });
      sndBadge();
      toast(badge.icon + " " + badge.name + " unlocked!", "ok");
    }
  });

  S.badges = owned;
  saveState();
}

function renderBadges(containerId) {
  const grid = document.getElementById(containerId || "badgeGrid");
  if (!grid) return;

  grid.innerHTML = BADGES.map((badge) => {
    const unlocked = (S.badges || []).some((b) => b.id === badge.id);
    return '<div class="badge-item ' + (unlocked ? "unlocked" : "locked") + '" title="' + badge.desc + '">'
      + '<span class="badge-icon">' + badge.icon + '</span>'
      + '<span class="badge-lbl">' + badge.name + '</span>'
      + '</div>';
  }).join("");
}

// ══════════════════════════════════════
// WEAK AREAS
// ══════════════════════════════════════
function trackWeak(unit, wasWrong) {
  if (!S.weakCategories) S.weakCategories = {};
  S.weakCategories[unit] = (S.weakCategories[unit] || 0) + (wasWrong ? 1 : 0);
  saveState();
}

function renderWeakAreas(containerId) {
  const container = document.getElementById(containerId || "weaknessList");
  if (!container) return;

  const entries = Object.entries(S.weakCategories || {})
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    container.innerHTML = '<div class="no-weak">No weak areas yet!</div>';
    return;
  }

  container.innerHTML = entries.map(([unit, count]) => {
    const shortName = unit.replace(/Unit \d+ - /, "");
    return '<div class="weak-item">'
      + '<div class="weak-dot"></div>'
      + '<div class="weak-info"><strong>' + shortName + '</strong>'
      + '<small>' + count + ' wrong</small></div>'
      + '</div>';
  }).join("");
}

// ══════════════════════════════════════
// DAILY GOALS
// ══════════════════════════════════════
function initDaily() {
  const today = dateKey();
  if (!S.daily) S.daily = {};
  if (!S.daily[today]) S.daily[today] = {};
  DAILY.forEach((goal) => {
    if (S.daily[today][goal.id] === undefined) S.daily[today][goal.id] = 0;
  });
  saveState();
}

function trackDaily(id, amount = 1) {
  const today = dateKey();
  if (!S.daily) S.daily = {};
  if (!S.daily[today]) S.daily[today] = {};
  S.daily[today][id] = (S.daily[today][id] || 0) + amount;
  saveState();
}

// ══════════════════════════════════════
// LEVEL NAMES & LEAGUES
// ══════════════════════════════════════
function getLevelName(level) {
  const idx = Math.min(level - 1, LEVEL_NAMES.length - 1);
  return LEVEL_NAMES[idx] || "Mythic";
}

function getLeague(xp) {
  let league = LEAGUES[0];
  for (const l of LEAGUES) {
    if (xp >= l.minXP) league = l;
  }
  return league;
}

function resetWeeklyLeague() {
  const now = Date.now();
  const lastReset = S.lastWeekReset || 0;
  const weekMs = 7 * 86400000;
  if (now - lastReset > weekMs) {
    S.weeklyXp = 0;
    S.weeklyChallenge = {};
    S.lastWeekReset = now;
    saveState();
  }
}

function trackWeeklyXp(amount) {
  S.weeklyXp = (S.weeklyXp || 0) + amount;
  saveState();
}

function trackWeeklyChallenge(id, amount = 1) {
  if (!S.weeklyChallenge) S.weeklyChallenge = {};
  S.weeklyChallenge[id] = (S.weeklyChallenge[id] || 0) + amount;
  saveState();
}

// ══════════════════════════════════════
// BOSS LEVELS
// ══════════════════════════════════════
function isBossLesson(lessonId) {
  return lessonId && lessonId.startsWith("boss_");
}

function getBossLevel() {
  return (S.bossDefeated || []).length + 1;
}

function generateBossExercises(count) {
  const exercises = [];
  const usedQuestions = new Set();
  const allLessons = LESSONS.filter((l) => !l.id.startsWith("boss_"));

  while (exercises.length < count && exercises.length < allLessons.length * 6) {
    const lesson = allLessons[Math.floor(Math.random() * allLessons.length)];
    const pool = lesson.exercises.filter((e) =>
      (e.type === "multiple" || e.type === "fillblank") && !usedQuestions.has(JSON.stringify(e))
    );
    if (pool.length > 0) {
      const ex = pool[Math.floor(Math.random() * pool.length)];
      usedQuestions.add(JSON.stringify(ex));
      exercises.push({ ...ex, bossUnit: lesson.unit });
    }
  }
  return exercises;
}

// ══════════════════════════════════════
// SPACED REPETITION
// ══════════════════════════════════════
function getSpacedRepetitionExercises() {
  const wrongWords = S.wrongWords || [];
  const lowMastery = (S.vocab || []).filter((v) => (v.mastery || 0) < 2 && !v.online);
  const words = [...new Set([...wrongWords.slice(-10), ...lowMastery.slice(-5).map((v) => v.word)])];
  if (words.length === 0) return [];
  return words.slice(0, 5).map((word) => {
    const sw = SWAHILI[word.toLowerCase()] || "";
    const others = Object.values(SWAHILI).filter((v) => v !== sw).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [sw, ...others].sort(() => Math.random() - 0.5);
    return {
      type: "multiple",
      question: "What does '" + word + "' mean in Swahili?",
      options: options,
      correct: options.indexOf(sw),
      _spaced: true
    };
  });
}

// ══════════════════════════════════════
// AI TUTOR
// ══════════════════════════════════════
function getAITip(exercise, unit) {
  const answer = exercise.answer || (exercise.options ? exercise.options[exercise.correct] : "");
  const sw = SWAHILI[answer.toLowerCase()] || "";
  const tipKey = (unit || "").replace(/Unit \d+ - /, "").toLowerCase().split(" ")[0];
  const tip = TUTOR_TIPS[tipKey] || TUTOR_TIPS.default[Math.floor(Math.random() * TUTOR_TIPS.default.length)];
  let result = "The correct answer is " + answer;
  if (sw) result += " (Swahili: " + sw + ")";
  result += ". " + tip;
  return result;
}

// ══════════════════════════════════════
// FLYING COIN ANIMATION
// ══════════════════════════════════════
function spawnFlyingCoin(amount) {
  const el = document.createElement("div");
  el.className = "xp-float";
  el.textContent = "+" + amount + " XP";
  el.style.left = Math.random() * 60 + 20 + "%";
  el.style.top = "40%";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ══════════════════════════════════════
// COMEBACK REWARDS
// ══════════════════════════════════════
function checkComebackReward() {
  if (!S.user) return;
  const last = S.lastLogin || 0;
  const now = Date.now();
  const daysMissed = Math.floor((now - last) / 86400000);
  if (daysMissed >= 1 && last > 0) {
    const bonus = Math.min(50, daysMissed * 10);
    S.stars += bonus;
    toast("Welcome back! +" + bonus + " stars!", "ok");
  }
  S.lastLogin = now;
  saveState();
}

// ══════════════════════════════════════
// MASCOT REACTION
// ══════════════════════════════════════
function getMascotFace(correctStreak) {
  if (correctStreak >= 5) return "🎉";
  if (correctStreak >= 3) return "😄";
  if (correctStreak > 0) return "😊";
  return "🦁";
}

// ══════════════════════════════════════
// TOAST
// ══════════════════════════════════════
function toast(message, type = "info") {
  const toastEl = document.createElement("div");
  toastEl.className = "toast " + type;
  toastEl.textContent = message;
  document.getElementById("toastWrap").appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.opacity = "0";
    toastEl.style.transition = "opacity .3s";
    setTimeout(() => toastEl.remove(), 300);
  }, 2200);
}

// ══════════════════════════════════════
// TEXT-TO-SPEECH
// ══════════════════════════════════════
function speakWord(word) {
  if (!word) return;
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  } catch (_) { /* ignore */ }
}

function getDailyWord() {
  const today = dateKey();
  const seed = today.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const allWords = [];
  LESSONS.forEach((lesson) => {
    lesson.exercises.forEach((ex) => {
      if (ex.options) ex.options.forEach((o) => allWords.push(o));
      if (ex.answer) allWords.push(ex.answer);
      if (ex.audio) allWords.push(ex.audio);
      if (ex.phrase) ex.phrase.split(" ").forEach((w) => allWords.push(w));
    });
  });
  const unique = [...new Set(allWords.filter((w) => w && w.length >= 3))];
  if (unique.length === 0) return { en: "Hello", sw: "Habari" };
  const word = unique[seed % unique.length];
  const lower = word.toLowerCase();
  return { en: word.charAt(0).toUpperCase() + word.slice(1), sw: SWAHILI[lower] || "—" };
}

// ══════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════
function showPage(page) {
  switch (page) {
    case "home": renderHome(); break;
    case "profile": renderProfile(); break;
    case "shop": renderShop(); break;
    case "leaderboard": renderLeaderboard(); break;
    case "settings": renderSettings(); break;
    case "daily": renderDailyPage(); break;
    case "vocab": renderVocabPage(); break;
    case "speak": renderSpeakPage(); break;
    case "friends": renderFriendsPage(); break;
    case "avatars": renderAvatarPage(); break;
    case "weekly": renderWeeklyPage(); break;
    case "boss": renderBossPage(); break;
    case "practicewords": renderPracticeWords(); break;
  }
}

// ══════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════
function renderHome() {
  const greeting = MSG.greet[Math.floor(Math.random() * MSG.greet.length)];
  const completedCount = Object.values(S.progress).filter((p) => p.completed).length;
  resetWeeklyLeague();

  // Mascot face based on recent performance
  const mascotFace = getMascotFace(S._correctStreak || 0);

  // Comeback banner
  const last = S.lastLogin || 0;
  const daysMissed = Math.floor((Date.now() - last) / 86400000);
  const comebackHTML = (daysMissed >= 1 && last > 0)
    ? '<div class="comeback-banner">🎉 Welcome back! You missed ' + daysMissed + ' day' + (daysMissed > 1 ? "s" : "") + '!</div>'
    : "";

  // League badge
  const league = getLeague(S.weeklyXp || 0);

  // Boss level check - every 10 lessons
  const nextBossAt = (Math.floor(completedCount / 10) + 1) * 10;
  const lessonsUntilBoss = nextBossAt - completedCount;
  const bossHTML = (lessonsUntilBoss <= 3 && completedCount >= 10)
    ? '<div class="practice-bar" style="background:linear-gradient(135deg,#FF4B4B,#CE82FF)"><div><b>🐉 Boss Level Soon!</b>'
      + '<br><small style="opacity:.85">' + lessonsUntilBoss + ' lesson' + (lessonsUntilBoss > 1 ? "s" : "") + ' until boss</small></div>'
      + '<button class="btn btn-sm" style="background:#fff;color:#FF4B4B" id="bossBtn">Fight</button></div>'
    : "";

  // Build practice banner if weak areas exist
  const weakEntries = Object.entries(S.weakCategories || {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const practiceHTML = (weakEntries.length > 0 || (S.vocab || []).length >= 3)
    ? '<div class="practice-bar"><div><b>📝 Practice Weak Words</b>'
      + '<br><small style="opacity:.85">' + (S.wrongWords || []).length + ' wrong words to review</small></div>'
      + '<button class="btn btn-sm btn-blue" id="practiceBtn">Start</button></div>'
    : "";

  // Build lesson map with connecting path
  const units = [...new Set(LESSONS.map((l) => l.unit))];
  let mapHTML = "";
  let lessonIndex = 0;

  units.forEach((unit) => {
    const lessons = LESSONS.filter((l) => l.unit === unit);
    mapHTML += '<div class="unit-label">' + unit + '</div>';

    lessons.forEach((lesson) => {
      const progress = S.progress[lesson.id];
      const isCompleted = progress?.completed;
      const score = progress?.bestScore || 0;
      const idx = LESSONS.findIndex((x) => x.id === lesson.id);
      const prevCompleted = idx === 0 || S.progress[LESSONS[idx - 1].id]?.completed;
      const isUnlocked = S.progress[lesson.id]?.unlocked;
      const isLocked = !isCompleted && !prevCompleted && !isUnlocked;
      const isCurrent = !isCompleted && (prevCompleted || isUnlocked) && !isLocked;
      const dotIdx = lessonIndex % 6;
      lessonIndex++;

      const colors = ["g", "b", "p", "o", "r", "pk"];
      const dotClass = colors[dotIdx];

      const nodeClass = isCurrent ? "current" : (isCompleted ? "done" : "") + (isLocked ? " locked" : "");

      mapHTML += '<div class="map-node ' + nodeClass + '" data-id="' + lesson.id + '">'
        + '<div class="map-connector"></div>'
        + '<div class="lcard ' + (isCompleted ? "done " : "") + (isLocked ? "locked" : "") + '" data-id="' + lesson.id + '">'
        + '<div class="lc-ic"><div class="lc-dot ' + dotClass + '"></div></div>'
        + '<div class="lc-info"><h3>' + lesson.icon + ' ' + lesson.title + '</h3>'
        + '<p>' + lesson.exercises.length + ' exercises</p>'
        + (isCompleted ? '<div class="lc-pg"><div style="width:' + score + '%"></div></div>' : "")
        + '</div>'
        + '<span class="lc-st ' + (isCompleted ? "done" : (score > 0 ? "pct" : ""))
        + '">' + (isCompleted ? score + "%" : (isLocked ? "🔒" : (isCurrent ? "▶" : "○"))) + '</span>'
        + '</div>'
        + '</div>';
    });
  });

  // Render page
  M.innerHTML = ''
    + comebackHTML
    + '<div class="mascot-row">'
    +   '<div class="mascot-face">' + mascotFace + '</div>'
    +   '<div class="mascot-speech"><b>' + greeting + '</b>'
    +   '<p class="muted">' + getLevelName(S.xpLevel) + ' Level ' + S.xpLevel + ' • ' + league.icon + ' ' + league.name + ' League</p></div>'
    + '</div>'
    + '<div class="xp-row">'
    +   '<span class="xp-label">Lv.<b id="levelDisplay">' + S.xpLevel + '</b></span>'
    +   '<div class="xp-track"><div class="xp-bar" id="xpBarFill" style="width:'
    +   Math.min(100, (S.xp / xpNeeded(S.xpLevel)) * 100) + '%"></div></div>'
    +   '<span class="xp-num" id="xpProgressText">' + S.xp + '/' + xpNeeded(S.xpLevel) + '</span>'
    +   '<button class="hdr-btn" id="dailyBtn"><i class="i-target"></i></button>'
    + '</div>'
    + bossHTML
    + practiceHTML
    + '<div class="map">' + mapHTML + '</div>'
    + '<div class="home-nav">'
    +   '<button class="home-nav-btn" data-page="vocab"><i class="i-book"></i><span>Words</span></button>'
    +   '<button class="home-nav-btn" data-page="speak"><i class="i-target"></i><span>Speak</span></button>'
    +   '<button class="home-nav-btn" data-page="friends"><i class="i-user"></i><span>Friends</span></button>'
    +   '<button class="home-nav-btn" data-page="shop"><i class="i-shop"></i><span>Shop</span></button>'
    +   '<button class="home-nav-btn" data-page="profile"><i class="i-user"></i><span>Profile</span></button>'
    + '</div>';

  // Bind events
  refreshXPDisplay();
  refreshHeartsDisplay();
  refreshStreakDisplay();

  M.querySelectorAll(".lcard:not(.locked)").forEach((card) => {
    card.addEventListener("click", () => {
      sndClick();
      openLesson(card.dataset.id);
    });
  });

  const dailyBtn = document.getElementById("dailyBtn");
  if (dailyBtn) dailyBtn.addEventListener("click", () => showPage("daily"));

  const bossBtn = document.getElementById("bossBtn");
  if (bossBtn) bossBtn.addEventListener("click", () => openBossLevel());

  const practiceBtn = document.getElementById("practiceBtn");
  if (practiceBtn) practiceBtn.addEventListener("click", () => openPracticeMode());

  M.querySelectorAll(".home-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      showPage(btn.dataset.page);
    });
  });
}

// ══════════════════════════════════════
// PLACEMENT TEST
// ══════════════════════════════════════
let placementQuestions = [];
let placementIndex = 0;
let placementScore = 0;
let placementSelected = null;
let placementAnswered = false;

function buildPlacementQuestions() {
  const questions = [];
  LESSONS.forEach((lesson) => {
    const multipleChoice = lesson.exercises.filter((e) => e.type === "multiple");
    if (multipleChoice.length > 0) {
      const exercise = multipleChoice[Math.floor(Math.random() * multipleChoice.length)];
      questions.push({ ...exercise, unit: lesson.unit, lessonTitle: lesson.title });
    }
  });

  // Shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions.slice(0, 15);
}

function startPlacement() {
  placementQuestions = buildPlacementQuestions();
  placementIndex = 0;
  placementScore = 0;
  renderPlacementQuestion();
}

function renderPlacementQuestion() {
  if (placementIndex >= placementQuestions.length) {
    finishPlacement();
    return;
  }

  placementSelected = null;
  placementAnswered = false;

  const question = placementQuestions[placementIndex];
  const total = placementQuestions.length;
  const progressPct = Math.round((placementIndex / total) * 100);

  M.innerHTML = ''
    + '<div class="ex-screen">'
    +   '<div class="ex-header">'
    +     '<span class="ex-close" id="exBack">✕</span>'
    +     '<span class="ex-prog">Placement ' + (placementIndex + 1) + '/' + total + '</span>'
    +     '<div class="ex-hp">' + "❤️".repeat(S.hearts) + "🖤".repeat(Math.max(0, 5 - S.hearts)) + '</div>'
    +   '</div>'
    +   '<div class="prog-bar"><div class="prog-fill" style="width:' + progressPct + '%"></div></div>'
    +   '<div class="ex-body">'
    +     '<div class="placement-q">' + question.question + '</div>'
    +     '<div class="opt-grid">'
    +       question.options.map((opt, i) => '<button class="opt-btn" data-idx="' + i + '">' + opt + '</button>').join("")
    +     '</div>'
    +   '</div>'
    +   '<div class="ex-bottom">'
    +     '<div class="fb" id="exFB"></div>'
    +     '<button class="btn btn-green btn-block" id="exCheck" style="display:none">Check</button>'
    +   '</div>'
    + '</div>';

  document.getElementById("exBack").addEventListener("click", () => showPage("home"));

  M.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (placementAnswered) return;
      sndClick();
      placementSelected = parseInt(btn.dataset.idx);
      M.querySelectorAll(".opt-btn").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      document.getElementById("exCheck").style.display = "block";
    });
  });

  document.getElementById("exCheck").addEventListener("click", checkPlacementAnswer);
}

function checkPlacementAnswer() {
  if (placementAnswered || placementSelected === null) return;
  placementAnswered = true;

  const question = placementQuestions[placementIndex];
  const isCorrect = placementSelected === question.correct;

  if (isCorrect) {
    placementScore++;
    sndCorrect();
    trackWeak(question.unit, false);
  } else {
    sndWrong();
    trackWeak(question.unit, true);
  }

  // Highlight answers
  M.querySelectorAll(".opt-btn").forEach((btn, i) => {
    btn.classList.add("off");
    if (i === question.correct) btn.classList.add("correct");
    if (i === placementSelected && !isCorrect) btn.classList.add("wrong");
  });

  const feedback = document.getElementById("exFB");
  feedback.className = "fb show " + (isCorrect ? "ok" : "fail");
  feedback.textContent = isCorrect ? "✅ Correct!" : "❌ Answer: " + question.options[question.correct];

  document.getElementById("exCheck").style.display = "none";

  setTimeout(() => {
    placementIndex++;
    renderPlacementQuestion();
  }, 1200);
}

function finishPlacement() {
  S.placed = true;
  const total = placementQuestions.length;
  const pct = Math.round((placementScore / total) * 100);

  let emoji, title, level;
  if (pct >= 80) { emoji = "🏆"; title = "Excellent!"; level = "Advanced Start — Unit 4+"; }
  else if (pct >= 60) { emoji = "🌟"; title = "Good Job!"; level = "Intermediate Start — Unit 3"; }
  else if (pct >= 40) { emoji = "💪"; title = "Nice Try!"; level = "Beginner+ Start — Unit 2"; }
  else { emoji = "📚"; title = "Let's Learn!"; level = "Beginner Start — Unit 1"; }

  // Build weak areas HTML
  const weakEntries = Object.entries(S.weakCategories || {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const weakHTML = weakEntries.length > 0
    ? "<ul>" + weakEntries.map(([u]) => "<li>⚠️ " + u.replace(/Unit \d+ - /, "") + "</li>").join("") + "</ul>"
    : "<p style='color:var(--g);font-weight:600'>No weak areas!</p>";

  // Unlock lessons based on score
  function unlockUpTo(lessonId) {
    const idx = LESSONS.findIndex((l) => l.id === lessonId);
    if (idx < 0) return;
    for (let i = 0; i <= idx; i++) {
      const id = LESSONS[i].id;
      S.progress[id] = S.progress[id] || {};
      S.progress[id].unlocked = true;
      if (!S.progress[id].completed) S.progress[id].completed = false;
    }
  }

  if (pct >= 80) unlockUpTo("phrases");
  else if (pct >= 60) unlockUpTo("colors");
  else if (pct >= 40) unlockUpTo("numbers");
  else unlockUpTo("greetings");

  saveState();

  M.innerHTML = ''
    + '<div class="ex-screen" style="justify-content:center;text-align:center;padding:30px 20px">'
    +   '<div style="font-size:3rem;margin-bottom:10px">' + emoji + '</div>'
    +   '<h2>' + title + '</h2>'
    +   '<p class="muted">' + placementScore + '/' + total + ' correct (' + pct + '%)</p>'
    +   '<div style="margin:12px 0;padding:12px;background:var(--bg);border-radius:var(--R);font-weight:700;color:var(--g)">' + level + '</div>'
    +   '<div style="text-align:left;margin:12px 0;font-size:.85rem">' + weakHTML + '</div>'
    +   '<button class="btn btn-green btn-block" id="placeOk">Start Learning</button>'
    + '</div>';

  document.getElementById("placeOk").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// LESSONS
// ══════════════════════════════════════
let currentLesson = null;
let exerciseIndex = 0;
let exerciseOrder = [];
let selectedOption = null;
let matchLeftSel = null;
let matchRightSel = null;
let tapWords = [];
let timerInterval = null;
let timerSeconds = 0;
let correctCount = 0;
let totalAttempts = 0;
let exerciseAdvancing = false;

function openLesson(lessonId) {
  currentLesson = LESSONS.find((l) => l.id === lessonId);
  if (!currentLesson) return;

  currentLesson.exercises.forEach((e) => { delete e._done; delete e._retry; });

  const settings = getSettings();
  exerciseOrder = currentLesson.exercises.map((_, i) => i);

  // Spaced repetition: inject wrong word exercises at the start
  const spacedExercises = getSpacedRepetitionExercises();
  if (spacedExercises.length > 0 && !isBossLesson(lessonId)) {
    spacedExercises.forEach((ex) => {
      currentLesson.exercises.unshift(ex);
      exerciseOrder.unshift(currentLesson.exercises.length - 1);
    });
    exerciseOrder = currentLesson.exercises.map((_, i) => i);
  }

  if (settings.shuffle) {
    for (let i = exerciseOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [exerciseOrder[i], exerciseOrder[j]] = [exerciseOrder[j], exerciseOrder[i]];
    }
  }

  exerciseIndex = 0;
  correctCount = 0;
  totalAttempts = 0;
  S._correctStreak = 0;
  S._lessonStart = Date.now();

  // Track study time
  S.lastStudyStart = Date.now();

  renderExercise();
}

function openBossLevel() {
  const bossNum = getBossLevel();
  if ((S.bossDefeated || []).includes(bossNum)) {
    toast("Boss already defeated!", "info");
    return;
  }

  currentLesson = {
    id: "boss_" + bossNum,
    unit: "Boss Level",
    title: "🐉 Boss Level " + bossNum,
    icon: "🐉",
    isBoss: true,
    exercises: generateBossExercises(10)
  };

  if (currentLesson.exercises.length < 5) {
    toast("Not enough exercises for boss level yet!", "err");
    return;
  }

  exerciseOrder = currentLesson.exercises.map((_, i) => i);
  exerciseIndex = 0;
  correctCount = 0;
  totalAttempts = 0;
  S._correctStreak = 0;
  S._lessonStart = Date.now();
  S.lastStudyStart = Date.now();

  renderExercise();
}

function openPracticeMode() {
  const words = (S.wrongWords || []).slice(-10);
  const lowMastery = (S.vocab || []).filter((v) => (v.mastery || 0) < 2 && !v.online).slice(-5);

  if (words.length === 0 && lowMastery.length === 0) {
    toast("No words to practice!", "info");
    return;
  }

  const exercises = [];
  [...words, ...lowMastery.map((v) => v.word)].slice(0, 8).forEach((word) => {
    const sw = SWAHILI[word.toLowerCase()] || "";
    const others = Object.values(SWAHILI).filter((v) => v !== sw).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [sw, ...others].sort(() => Math.random() - 0.5);
    exercises.push({
      type: "multiple",
      question: "What does '" + word + "' mean in Swahili?",
      options: options,
      correct: options.indexOf(sw)
    });
  });

  if (exercises.length === 0) return;

  currentLesson = {
    id: "practice_" + Date.now(),
    unit: "Practice",
    title: "📝 Word Practice",
    icon: "📝",
    exercises: exercises
  };

  exerciseOrder = currentLesson.exercises.map((_, i) => i);
  exerciseIndex = 0;
  correctCount = 0;
  totalAttempts = 0;
  S._correctStreak = 0;
  S._lessonStart = Date.now();
  S.lastStudyStart = Date.now();

  renderExercise();
}

function closeLesson() {
  stopTimer();
  currentLesson = null;
  showPage("home");
  refreshHeartsDisplay();
  checkBadges();
  renderWeakAreas();
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ── Render Exercise ──
function renderExercise() {
  if (!currentLesson || exerciseIndex >= currentLesson.exercises.length) {
    if (currentLesson) finishLesson();
    return;
  }

  const exerciseIdx = exerciseOrder[exerciseIndex];
  const exercise = currentLesson.exercises[exerciseIdx];

  selectedOption = null;
  matchLeftSel = null;
  matchRightSel = null;
  tapWords = [];
  totalAttempts++;

  const total = currentLesson.exercises.length;
  const heartsStr = "❤️".repeat(S.hearts) + "🖤".repeat(Math.max(0, 5 - S.hearts));
  const isBoss = currentLesson.isBoss;

  M.innerHTML = ''
    + '<div class="ex-screen">'
    +   '<div class="ex-header">'
    +     '<span class="ex-close" id="exBack">✕</span>'
    +     '<span class="ex-prog">' + (isBoss ? "🐉 " : "") + (exerciseIndex + 1) + '/' + total + '</span>'
    +     '<div class="ex-hp">' + heartsStr + '</div>'
    +     '<span class="ex-timer" id="exTimer"></span>'
    +   '</div>'
    +   '<div class="ex-body" id="exBody"></div>'
    +   '<div class="ex-bottom">'
    +     '<div class="fb" id="exFB"></div>'
    +     '<button class="btn btn-green btn-block" id="exCheck" style="display:none">Check</button>'
    +     (isBoss ? '' : '<button class="btn-flat" id="exSkip">Skip</button>')
    +   '</div>'
    + '</div>';

  document.getElementById("exBack").addEventListener("click", closeLesson);
  const skipBtn = document.getElementById("exSkip");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      stopTimer();
      exerciseIndex++;
      renderExercise();
    });
  }
  document.getElementById("exCheck").addEventListener("click", () => checkExercise(exercise));

  startTimer();

  const body = document.getElementById("exBody");
  switch (exercise.type) {
    case "multiple": renderMultipleChoice(exercise, body); break;
    case "fillblank": renderFillBlank(exercise, body); break;
    case "match": renderMatch(exercise, body); break;
    case "tap": renderTapWords(exercise, body); break;
    case "listen": renderListen(exercise, body); break;
    default: renderMultipleChoice(exercise, body);
  }
}

// ── Exercise Types ──
function renderMultipleChoice(exercise, container) {
  container.innerHTML = ''
    + '<div class="placement-q">' + exercise.question + '</div>'
    + '<div class="opt-grid">'
    + exercise.options.map((opt, i) =>
      '<button class="opt-btn" data-i="' + i + '">' + opt + '</button>'
    ).join("")
    + '</div>';

  container.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      selectedOption = parseInt(btn.dataset.i);
      container.querySelectorAll(".opt-btn").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      document.getElementById("exCheck").style.display = "block";
      document.getElementById("exSkip").style.display = "none";
    });
  });
}

function renderFillBlank(exercise, container) {
  const parts = exercise.sentence.split("___");

  container.innerHTML = ''
    + '<div class="placement-q">' + parts[0]
    + '<span style="display:inline-block;min-width:80px;border-bottom:3px solid var(--o);margin:0 4px">&nbsp;</span>'
    + (parts[1] || '')
    + '</div>'
    + '<div class="opt-grid">'
    + exercise.options.map((opt, i) =>
      '<button class="opt-btn" data-i="' + i + '">' + opt + '</button>'
    ).join("")
    + '</div>';

  container.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      selectedOption = parseInt(btn.dataset.i);
      container.querySelectorAll(".opt-btn").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");

      // Fill in the blank
      const blankSpan = container.querySelector("span[style]");
      if (blankSpan && blankSpan.style.borderBottom && selectedOption !== null) {
        blankSpan.textContent = exercise.options[selectedOption];
      }

      document.getElementById("exCheck").style.display = "block";
      document.getElementById("exSkip").style.display = "none";
    });
  });
}

function renderMatch(exercise, container) {
  const pairs = exercise.pairs;
  const leftItems = pairs.map((p, i) => ({ text: p[0], idx: i }));
  const rightItems = pairs.map((p, i) => ({ text: p[1], idx: i }));

  // Shuffle right side
  for (let i = rightItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
  }

  container.innerHTML = ''
    + '<div class="placement-q">Match the pairs</div>'
    + '<div class="match-cols">'
    +   '<div class="match-col" id="mL">'
    +     leftItems.map((item) => '<button class="match-btn" data-i="' + item.idx + '">' + item.text + '</button>').join("")
    +   '</div>'
    +   '<div class="match-col" id="mR">'
    +     rightItems.map((item) => '<button class="match-btn" data-i="' + item.idx + '">' + item.text + '</button>').join("")
    +   '</div>'
    + '</div>';

  const matched = new Set();

  container.querySelectorAll(".match-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      const idx = parseInt(btn.dataset.i);
      const isLeft = btn.parentElement.id === "mL";

      if (isLeft) {
        container.querySelectorAll("#mL .match-btn").forEach((b) => b.classList.remove("sel"));
        btn.classList.add("sel");
        matchLeftSel = idx;
      } else {
        container.querySelectorAll("#mR .match-btn").forEach((b) => b.classList.remove("sel"));
        btn.classList.add("sel");
        matchRightSel = idx;
      }

      // Check if both sides selected
      if (matchLeftSel !== null && matchRightSel !== null) {
        if (matchLeftSel === matchRightSel) {
          // Correct match
          const leftBtn = container.querySelector('#mL .match-btn[data-i="' + matchLeftSel + '"]');
          const rightBtn = container.querySelector('#mR .match-btn[data-i="' + matchRightSel + '"]');
          if (leftBtn) { leftBtn.classList.add("correct"); leftBtn.classList.remove("sel"); }
          if (rightBtn) { rightBtn.classList.add("correct"); rightBtn.classList.remove("sel"); }
          matched.add(matchLeftSel);

          if (matched.size === pairs.length) {
            selectedOption = "matched";
            document.getElementById("exCheck").style.display = "block";
            document.getElementById("exSkip").style.display = "none";
          }
        } else {
          // Wrong match
          const leftBtn = container.querySelector('#mL .match-btn[data-i="' + matchLeftSel + '"]');
          const rightBtn = container.querySelector('#mR .match-btn[data-i="' + matchRightSel + '"]');
          if (leftBtn) { leftBtn.classList.add("wrong"); setTimeout(() => leftBtn.classList.remove("wrong", "sel"), 400); }
          if (rightBtn) { rightBtn.classList.add("wrong"); setTimeout(() => rightBtn.classList.remove("wrong", "sel"), 400); }
        }

        matchLeftSel = null;
        matchRightSel = null;
        setTimeout(() => container.querySelectorAll(".match-btn").forEach((b) => b.classList.remove("sel")), 400);
      }
    });
  });
}

function renderTapWords(exercise, container) {
  const phraseWords = exercise.phrase.split(" ");
  const allWords = [...exercise.words];

  // Shuffle
  for (let i = allWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
  }

  container.innerHTML = ''
    + '<div class="placement-q">Build the phrase</div>'
    + '<div class="tap-target" id="tapTarget"></div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">'
    + allWords.map((w, i) =>
      '<button class="tap-word" data-w="' + w + '" data-i="' + i + '">' + w + '</button>'
    ).join("")
    + '</div>';

  tapWords = [];

  container.querySelectorAll(".tap-word").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      const word = btn.dataset.w;
      tapWords.push(word);
      btn.style.visibility = "hidden";

      const target = document.getElementById("tapTarget");
      const tag = document.createElement("button");
      tag.className = "tap-word in-target";
      tag.textContent = word;
      tag.dataset.w = word;

      tag.addEventListener("click", () => {
        sndClick();
        tapWords = tapWords.filter((w, i) => i !== tapWords.indexOf(word));
        tag.remove();
        btn.style.visibility = "visible";
        if (tapWords.length < phraseWords.length) {
          document.getElementById("exCheck").style.display = "none";
          document.getElementById("exSkip").style.display = "block";
        }
      });

      target.appendChild(tag);

      if (tapWords.length >= phraseWords.length) {
        document.getElementById("exCheck").style.display = "block";
        document.getElementById("exSkip").style.display = "none";
      }
    });
  });
}

function renderListen(exercise, container) {
  container.innerHTML = ''
    + '<div class="placement-q">' + exercise.question + '</div>'
    + '<button class="listen-btn" id="listenBtn">🔊</button>'
    + '<div class="opt-grid">'
    + exercise.display.map((opt, i) =>
      '<button class="opt-btn" data-i="' + i + '">' + opt + '</button>'
    ).join("")
    + '</div>';

  document.getElementById("listenBtn").addEventListener("click", () => {
    try {
      const utterance = new SpeechSynthesisUtterance(exercise.audio);
      utterance.lang = "en";
      utterance.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (_) { /* ignore */ }
  });

  // Auto-play
  setTimeout(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(exercise.audio);
      utterance.lang = "en";
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    } catch (_) { /* ignore */ }
  }, 300);

  container.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      selectedOption = parseInt(btn.dataset.i);
      container.querySelectorAll(".opt-btn").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      document.getElementById("exCheck").style.display = "block";
      document.getElementById("exSkip").style.display = "none";
    });
  });
}

// ── Check Answer ──
function checkExercise(exercise) {
  document.getElementById("exCheck").style.display = "none";
  document.getElementById("exSkip").style.display = "none";
  stopTimer();

  let isCorrect = false;

  switch (exercise.type) {
    case "multiple":
    case "listen":
      isCorrect = selectedOption === exercise.correct;
      highlightOptions(M.querySelectorAll(".opt-btn"), selectedOption, exercise.correct);
      break;

    case "fillblank":
      isCorrect = selectedOption !== null
        && exercise.options[selectedOption]?.toLowerCase() === exercise.answer.toLowerCase();
      highlightOptions(M.querySelectorAll(".opt-btn"), selectedOption, exercise.options.indexOf(exercise.answer));
      break;

    case "match":
      isCorrect = selectedOption === "matched";
      break;

    case "tap": {
      const targetWords = exercise.phrase.split(" ");
      isCorrect = tapWords.length === targetWords.length
        && tapWords.every((w, i) => w.toLowerCase() === targetWords[i].toLowerCase());
      break;
    }
  }

  const feedback = document.getElementById("exFB");

  if (isCorrect) {
    correctCount++;
    sndCorrect();
    S.stats.correct++;
    S.stars += 2;
    S._correctStreak = (S._correctStreak || 0) + 1;

    // Track vocabulary
    const word = exercise.answer || exercise.options?.[exercise.correct] || exercise.audio || "";
    if (word) {
      const existing = S.vocab.find((v) => v.word === word);
      if (existing) {
        existing.mastery = Math.min(5, (existing.mastery || 0) + 1);
      } else {
        S.vocab.push({
          word, sw: SWAHILI[word.toLowerCase()] || "",
          mastery: 1, learned: Date.now(), unit: currentLesson.unit
        });
      }
      S.stats.wordsLearned = S.vocab.length;

      // Remove from wrongWords if mastered
      if (existing && existing.mastery >= 3) {
        S.wrongWords = (S.wrongWords || []).filter((w) => w !== word);
      }
    }

    const xpAmount = currentLesson.isBoss ? 20 : 10;
    addXP(xpAmount);
    trackDaily("xp", xpAmount);
    trackDaily("words", 1);
    trackWeeklyChallenge("w_learn", 1);
    trackWeak(currentLesson.unit, false);

    // Flying coin animation
    spawnFlyingCoin(xpAmount);

    feedback.className = "fb show ok";
    feedback.textContent = "✅ Correct! +" + xpAmount + " XP";
  } else {
    sndWrong();
    S.stats.wrong++;
    S._correctStreak = 0;
    trackWeak(currentLesson.unit, true);

    // Track wrong word for spaced repetition
    const wrongWord = exercise.answer || (exercise.options ? exercise.options[exercise.correct] : "");
    if (wrongWord && !(S.wrongWords || []).includes(wrongWord)) {
      if (!S.wrongWords) S.wrongWords = [];
      S.wrongWords.push(wrongWord);
    }

    // AI Tutor tip
    const tip = getAITip(exercise, currentLesson.unit);

    if (exercise.type === "multiple" || exercise.type === "listen" || exercise.type === "fillblank") {
      const answer = exercise.answer || (exercise.options ? exercise.options[exercise.correct] : "");
      feedback.className = "fb show fail";
      feedback.textContent = "❌ " + tip;
    } else if (exercise.type === "tap") {
      feedback.className = "fb show fail";
      feedback.textContent = "❌ " + exercise.phrase + ". " + tip;
    } else {
      feedback.className = "fb show fail";
      feedback.textContent = "❌ Try to match all pairs. " + tip;
    }

    if (!loseHeart()) {
      closeLesson();
      toast("No hearts left!", "err");
      return;
    }
  }

  saveState();
  exerciseAdvancing = true;
  setTimeout(() => {
    if (!currentLesson) return;
    exerciseAdvancing = false;
    exerciseIndex++;
    renderExercise();
  }, 1300);
}

function highlightOptions(buttons, selectedIndex, correctIndex) {
  buttons.forEach((btn, i) => {
    btn.classList.add("off");
    if (i === correctIndex) btn.classList.add("correct");
    if (i === selectedIndex && i !== correctIndex) btn.classList.add("wrong");
  });
}

// ── Timer ──
function startTimer() {
  stopTimer();
  const setting = getSettings().timer || 0;
  if (setting <= 0) return;

  timerSeconds = setting;
  const timerEl = document.getElementById("exTimer");
  if (timerEl) {
    timerEl.textContent = timerSeconds + "s";
    timerEl.classList.remove("urgent");
  }

  timerInterval = setInterval(() => {
    timerSeconds--;
    const el = document.getElementById("exTimer");
    if (el) {
      el.textContent = timerSeconds + "s";
      if (timerSeconds <= 5) el.classList.add("urgent");
    }
    if (timerSeconds <= 0) {
      stopTimer();
      const feedback = document.getElementById("exFB");
      if (feedback) {
        feedback.className = "fb show fail";
        feedback.textContent = "⏰ Time's up!";
      }
      if (!loseHeart()) {
        closeLesson();
      } else {
        setTimeout(() => { if (!currentLesson || exerciseAdvancing) return; exerciseAdvancing = false; exerciseIndex++; renderExercise(); }, 1000);
      }
    }
  }, 1000);
}

// ── Finish Lesson ──
function finishLesson() {
  stopTimer();
  if (!currentLesson) return;
  const total = currentLesson.exercises.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const xp = correctCount * (currentLesson.isBoss ? 20 : 10);
  const isPerfect = pct >= 100;
  const isBoss = currentLesson.isBoss;

  // Track study time
  const studyStart = S.lastStudyStart || Date.now();
  const studyMins = Math.round((Date.now() - studyStart) / 60000);
  S.studyMinutes = (S.studyMinutes || 0) + studyMins;
  trackDaily("minutes", studyMins);

  // Boss level: need 80% to pass
  if (isBoss && pct < 80) {
    S.stats.wrong += total - correctCount;
    saveState();
    M.innerHTML = ''
      + '<div class="ex-screen" style="justify-content:center;text-align:center;padding:30px 20px">'
      +   '<div style="font-size:3rem;margin-bottom:10px">💀</div>'
      +   '<h2>Boss Defeated You!</h2>'
      +   '<p class="muted">You got ' + pct + '% but need 80% to win</p>'
      +   '<p class="muted">' + correctCount + '/' + total + ' correct</p>'
      +   '<button class="btn btn-green btn-block" id="lessonOk">Try Again</button>'
      + '</div>';
    document.getElementById("lessonOk").addEventListener("click", () => openBossLevel());
    return;
  }

  // Boss defeated!
  if (isBoss) {
    const bossNum = getBossLevel();
    if (!S.bossDefeated) S.bossDefeated = [];
    S.bossDefeated.push(bossNum);
    S.stars += 50;
    sndBoss();
    toast("🐉 Boss " + bossNum + " defeated! +50 stars!", "ok");
  }

  S.progress[currentLesson.id] = {
    completed: true,
    bestScore: Math.max(pct, S.progress[currentLesson.id]?.bestScore || 0),
    at: Date.now()
  };
  S.stats.lessonsDone++;
  if (isPerfect) S.stats.perfectLessons = (S.stats.perfectLessons || 0) + 1;
  S.stars += isPerfect ? 10 : 5;
  if (isPerfect) addXP(20);
  markDay();
  trackDaily("lesson", 1);
  trackDaily("perfect", isPerfect ? 1 : 0);
  trackWeeklyChallenge("w_lessons", 1);

  // Speed badges
  const elapsed = (Date.now() - (S._lessonStart || Date.now())) / 1000;
  if (elapsed < 60 && !isBoss) {
    const owned = S.badges || [];
    if (!owned.find((b) => b.id === "speed_run")) {
      S.badges.push({ id: "speed_run", at: Date.now() });
      sndBadge();
      toast("⏱️ Speed Run badge unlocked!", "ok");
    }
  }
  if (elapsed < 120 && !isBoss) {
    const owned = S.badges || [];
    if (!owned.find((b) => b.id === "speed_demon")) {
      S.badges.push({ id: "speed_demon", at: Date.now() });
      sndBadge();
      toast("⚡ Speed Demon badge unlocked!", "ok");
    }
  }

  // Night/Early lessons
  const hour = new Date().getHours();
  if (hour >= 21 || hour < 6) {
    S.stats.nightLessons = (S.stats.nightLessons || 0) + 1;
  }
  if (hour >= 5 && hour < 8) {
    S.stats.earlyLessons = (S.stats.earlyLessons || 0) + 1;
  }

  // Quest tracking
  S.stats.questsDone = (S.stats.questsDone || 0);

  // Check no_wrong badge
  if (correctCount === total && total > 0) {
    const owned = S.badges || [];
    if (!owned.find((b) => b.id === "no_wrong")) {
      S.badges.push({ id: "no_wrong", at: Date.now() });
      sndBadge();
    }
  }

  S.hearts = Math.min(5, S.hearts + 1);
  refreshHeartsDisplay();
  saveState();
  checkBadges();
  renderWeakAreas();

  // Show result
  const levelName = getLevelName(S.xpLevel);
  const league = getLeague(S.weeklyXp || 0);

  M.innerHTML = ''
    + '<div class="ex-screen" style="justify-content:center;text-align:center;padding:30px 20px">'
    +   '<div class="result-icon">' + (isBoss ? "🐉" : (isPerfect ? "💎" : "🎉")) + '</div>'
    +   '<h2>' + (isBoss ? "Boss Defeated!" : (isPerfect ? "Perfect Score!" : "Lesson Complete!")) + '</h2>'
    +   '<p class="muted">You earned ' + xp + ' XP!</p>'
    +   '<div class="result-level">Lv. ' + S.xpLevel + ' ' + levelName + ' • ' + league.icon + ' ' + league.name + '</div>'
    +   '<div class="celeb-tags">'
    +     '<span class="xp-tag">✨ ' + xp + ' XP</span>'
    +     (isPerfect ? '<span class="badge-tag">💎 Perfect</span>' : "")
    +     '<span class="star-tag">⭐ +' + (isBoss ? 50 : (isPerfect ? 10 : 5)) + '</span>'
    +   '</div>'
    +   '<button class="btn btn-green btn-block" id="lessonOk">Continue</button>'
    + '</div>';

  document.getElementById("lessonOk").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════
function renderProfile() {
  const roleName = { child: "Student", parent: "Parent", teacher: "Teacher" }[S.user?.role] || "";
  const league = getLeague(S.weeklyXp || 0);
  const levelName = getLevelName(S.xpLevel);
  const avatar = S.avatar || {};
  const pet = avatar.pet ? AVATARS.find((a) => a.id === avatar.pet) : null;

  M.innerHTML = ''
    + '<div class="prof-top">'
    +   '<div class="avatar-circle lg orange">' + (pet ? pet.icon : 'SS') + '</div>'
    +   '<h2>' + (S.user?.name || "Learner") + '</h2>'
    +   '<small class="muted">' + roleName + ' • ' + levelName + ' Level ' + S.xpLevel + '</small>'
    +   '<div style="margin-top:6px">' + league.icon + ' ' + league.name + ' League</div>'
    + '</div>'
    + '<div class="grid3">'
    +   '<div class="statbox"><div class="statbox-ic fire"><i class="i-fire"></i></div><b>' + S.streak + '</b><small>Streak</small></div>'
    +   '<div class="statbox"><div class="statbox-ic gold"><i class="i-star"></i></div><b>' + S.stars + '</b><small>Stars</small></div>'
    +   '<div class="statbox"><div class="statbox-ic purple"><i class="i-star"></i></div><b>' + S.stats.xp + '</b><small>XP</small></div>'
    +   '<div class="statbox"><div class="statbox-ic green"><i class="i-book"></i></div><b>' + S.stats.lessonsDone + '</b><small>Lessons</small></div>'
    +   '<div class="statbox"><div class="statbox-ic blue"><i class="i-check"></i></div><b>' + S.stats.correct + '</b><small>Correct</small></div>'
    +   '<div class="statbox"><div class="statbox-ic pink"><i class="i-book"></i></div><b>' + S.vocab.length + '</b><small>Words</small></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:12px">'
    +   '<button class="btn btn-outline btn-block btn-sm" id="goAvatars">🖼️ Avatar</button>'
    +   '<button class="btn btn-outline btn-block btn-sm" id="goWeekly">📅 Weekly</button>'
    +   '<button class="btn btn-outline btn-block btn-sm" id="goBoss">🐉 Boss</button>'
    + '</div>'
    + '<div class="section"><h3>Badges</h3><div class="badge-row" id="badgeGrid"></div></div>'
    + '<div class="section"><h3>Weak Areas</h3><div id="weaknessList"></div></div>'
    + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

  renderBadges("badgeGrid");
  renderWeakAreas("weaknessList");
  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
  document.getElementById("goAvatars").addEventListener("click", () => showPage("avatars"));
  document.getElementById("goWeekly").addEventListener("click", () => showPage("weekly"));
  document.getElementById("goBoss").addEventListener("click", () => showPage("boss"));
}

// ══════════════════════════════════════
// SHOP PAGE
// ══════════════════════════════════════
function renderShop() {
  M.innerHTML = ''
    + '<h2>Shop</h2>'
    + '<p class="muted">Use stars to buy items</p>'
    + '<div class="shop-coins"><b>' + S.stars + '</b> stars</div>'
    + '<div class="shop-list" id="shopGrid"></div>'
    + '<div style="margin-top:12px"><button class="btn btn-blue btn-block" id="goAvatarShop">🖼️ Avatar Shop</button></div>'
    + '<button class="btn btn-outline btn-block" style="margin-top:8px" id="backHome">← Back</button>';

  const grid = document.getElementById("shopGrid");
  grid.innerHTML = SHOP.map((item) => {
    const colorClass = item.id === "streak_freeze" ? "blue"
      : item.id === "hearts_refill" ? "red" : "purple";
    const iconClass = item.id === "streak_freeze" ? "lock"
      : item.id === "hearts_refill" ? "heart" : "star";

    return '<div class="shop-item" data-id="' + item.id + '">'
      + '<div class="shop-ic ' + colorClass + '"><i class="i-' + iconClass + '"></i></div>'
      + '<div class="shop-info"><b>' + item.name + '</b><small>' + item.desc + '</small></div>'
      + '<span class="shop-cost">⭐ ' + item.cost + '</span>'
      + '</div>';
  }).join("");

  grid.querySelectorAll(".shop-item").forEach((el) => {
    el.addEventListener("click", () => {
      const item = SHOP.find((i) => i.id === el.dataset.id);
      if (!item) return;
      if (S.stars < item.cost) { toast("Not enough stars!", "err"); return; }

      sndClick();
      S.stars -= item.cost;

      if (item.id === "streak_freeze") {
        S.streakFreeze = (S.streakFreeze || 0) + 1;
        toast("Streak Freeze active! 🧊", "ok");
      } else if (item.id === "hearts_refill") {
        S.hearts = 5;
        S.heartsRegen = Date.now();
        refreshHeartsDisplay();
        toast("Hearts full! ❤️", "ok");
      } else if (item.id === "xp_boost") {
        toast("XP Boost 30m! ⚡", "ok");
      }

      saveState();
      renderShop();
    });
  });

  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
  document.getElementById("goAvatarShop").addEventListener("click", () => showPage("avatars"));
}

// ══════════════════════════════════════
// LEADERBOARD PAGE
// ══════════════════════════════════════
function renderLeaderboard() {
  const users = getUsers();
  const list = Object.values(users)
    .map((u) => ({ name: u.name, xp: u.stats?.xp || 0, streak: u.streak || 0, words: u.vocab?.length || 0 }))
    .sort((a, b) => b.xp - a.xp);

  const league = getLeague(S.weeklyXp || 0);

  M.innerHTML = ''
    + '<h2>🏆 Leaderboard</h2>'
    + '<div style="text-align:center;padding:12px;background:var(--c);border-radius:var(--R);margin:12px 0;box-shadow:var(--sh);border:2px solid ' + league.color + '">'
    +   '<span style="font-size:2rem">' + league.icon + '</span>'
    +   '<div style="font-weight:700">' + league.name + ' League</div>'
    +   '<div style="font-size:.75rem;color:var(--t2)">' + (S.weeklyXp || 0) + ' XP this week</div>'
    + '</div>'
    + '<p class="muted">All-time rankings</p>'
    + '<ol class="league">'
    + list.map((r, i) => {
      const isMe = r.name === S.user?.name;
      const rLeague = getLeague(r.xp);
      return '<li>'
        + '<span class="league-rank">#' + (i + 1) + '</span>'
        + '<span class="league-name">' + rLeague.icon + ' ' + r.name + (isMe ? " (you)" : "") + '</span>'
        + '<span class="league-xp">' + r.xp + ' XP</span>'
        + '</li>';
    }).join("")
    + '</ol>'
    + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════
function renderSettings() {
  const settings = getSettings();

  M.innerHTML = ''
    + '<h2>Settings</h2>'
    + '<label class="sw-row"><span>Dark Mode</span><input type="checkbox" id="sDark" ' + (settings.dark ? "checked" : "") + '/></label>'
    + '<label class="sw-row"><span>Sound</span><input type="checkbox" id="sSound" ' + (settings.sound !== false ? "checked" : "") + '/></label>'
    + '<label class="sw-row"><span>Reminder</span><input type="checkbox" id="sNotif" ' + (settings.notif ? "checked" : "") + '/></label>'
    + '<label class="sw-row"><span>Shuffle</span><input type="checkbox" id="sShuffle" ' + (settings.shuffle ? "checked" : "") + '/></label>'
    + '<label class="sw-row"><span>Timer</span><select id="sTimer">'
    +   '<option value="0"' + (settings.timer == 0 ? " selected" : "") + '>Off</option>'
    +   '<option value="15"' + (settings.timer == 15 ? " selected" : "") + '>15s</option>'
    +   '<option value="30"' + (settings.timer == 30 ? " selected" : "") + '>30s</option>'
    +   '<option value="60"' + (settings.timer == 60 ? " selected" : "") + '>60s</option>'
    + '</select></label>'
    + '<hr/>'
    + '<button class="btn btn-outline btn-block" id="sReset">Reset Progress</button>'
    + '<button class="btn btn-outline btn-block" id="sExport">Export Data</button>'
    + '<p class="ver">v' + VER + '</p>'
    + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

  // Bind events
  document.getElementById("sDark").addEventListener("change", function () {
    const s = getSettings(); s.dark = this.checked; saveSettings(s); applySettings(s);
  });
  document.getElementById("sSound").addEventListener("change", function () {
    const s = getSettings(); s.sound = this.checked; saveSettings(s);
  });
  document.getElementById("sNotif").addEventListener("change", function () {
    const s = getSettings(); s.notif = this.checked; saveSettings(s);
    if (s.notif && typeof Notification !== "undefined") Notification.requestPermission();
  });
  document.getElementById("sShuffle").addEventListener("change", function () {
    const s = getSettings(); s.shuffle = this.checked; saveSettings(s);
  });
  document.getElementById("sTimer").addEventListener("change", function () {
    const s = getSettings(); s.timer = parseInt(this.value); saveSettings(s);
  });
  document.getElementById("sReset").addEventListener("click", () => {
    if (confirm("Delete ALL progress?")) {
      if (S.user) {
        const users = getUsers();
        const fresh = freshState();
        users[S.user.name] = {
          name: S.user.name, role: S.user.role,
          progress: fresh.progress, stats: fresh.stats,
          streak: fresh.streak, stars: fresh.stars, xp: fresh.xp, xpLevel: fresh.xpLevel,
          hearts: fresh.hearts, heartsRegen: fresh.heartsRegen,
          vocab: fresh.vocab, badges: fresh.badges, dailyActivity: fresh.dailyActivity,
          streakFreeze: fresh.streakFreeze, daily: fresh.daily,
          weakCategories: fresh.weakCategories, wrongWords: fresh.wrongWords, placed: fresh.placed,
          friends: fresh.friends, ownedAvatars: fresh.ownedAvatars, avatar: fresh.avatar,
          weeklyXp: fresh.weeklyXp, lastWeekReset: fresh.lastWeekReset,
          weeklyChallenge: fresh.weeklyChallenge, bossDefeated: fresh.bossDefeated,
          bossLessons: fresh.bossLessons, lastLogin: fresh.lastLogin,
          studyMinutes: fresh.studyMinutes, lastStudyStart: fresh.lastStudyStart
        };
        saveUsers(users);
      }
      S = freshState();
      showPage("home");
      toast("Reset!", "info");
    }
  });
  document.getElementById("sExport").addEventListener("click", () => {
    const data = { v: VER, date: new Date().toISOString(), users: getUsers(), settings: getSettings() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "SafariStars_backup.json"; a.click();
    URL.revokeObjectURL(url);
    toast("Data exported! 📤", "ok");
  });
  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// DAILY GOALS PAGE
// ══════════════════════════════════════
function renderDailyPage() {
  const today = dateKey();
  const goals = (S.daily || {})[today] || {};

  M.innerHTML = ''
    + '<h2>Daily Goals</h2>'
    + DAILY.map((goal) => {
      const current = goals[goal.id] || 0;
      const done = current >= goal.need;
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--bg);border-radius:var(--R);margin-bottom:8px">'
        + '<span style="font-size:1.5rem">' + goal.icon + '</span>'
        + '<div style="flex:1"><strong style="font-size:.85rem">' + goal.label + '</strong>'
        + '<br><small style="font-size:.7rem;color:var(--t2)">' + current + ' / ' + goal.need + '</small></div>'
        + '<span style="font-size:1.2rem">' + (done ? "✅" : "") + '</span>'
        + '</div>';
    }).join("")
    + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// VOCAB PAGE (WORD HISTORY)
// ══════════════════════════════════════
function renderVocabPage() {
  const vocab = S.vocab || [];
  const today = getDailyWord();

  if (vocab.length === 0) {
    M.innerHTML = ''
      + '<div class="daily-word-banner">'
      +   '<h3>Word of the Day</h3>'
      +   '<div class="dw-en">' + today.en + '</div>'
      +   '<div class="dw-sw">' + today.sw + '</div>'
      +   '<button class="dw-speak" id="dwSpeak">🔊</button>'
      + '</div>'
      + '<h2>My Vocabulary</h2>'
      + '<p class="muted">Start learning to build your word list!</p>'
      + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

    document.getElementById("dwSpeak").addEventListener("click", () => speakWord(today.en));
    document.getElementById("backHome").addEventListener("click", () => showPage("home"));
    return;
  }

  M.innerHTML = ''
    + '<div class="daily-word-banner">'
    +   '<h3>Word of the Day</h3>'
    +   '<div class="dw-en">' + today.en + '</div>'
    +   '<div class="dw-sw">' + today.sw + '</div>'
    +   '<button class="dw-speak" id="dwSpeak">🔊</button>'
    + '</div>'
    + '<h2>My Vocabulary (' + vocab.length + ' words)</h2>'
    + '<div id="vocabList"></div>'
    + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

  document.getElementById("dwSpeak").addEventListener("click", () => speakWord(today.en));
  document.getElementById("backHome").addEventListener("click", () => showPage("home"));

  const list = document.getElementById("vocabList");
  list.innerHTML = vocab.slice().reverse().map((v) => {
    const mastery = v.mastery || 1;
    const dots = [1, 2, 3].map((i) =>
      '<span class="vi-dot' + (i <= mastery ? " filled" : "") + '"></span>'
    ).join("");
    return '<div class="vocab-item">'
      + '<span class="vi-icon">' + (v.icon || "📝") + '</span>'
      + '<div class="vi-info"><div class="vi-en">' + v.word + '</div>'
      + '<div class="vi-sw">' + (v.sw || "") + '</div></div>'
      + '<button class="vi-speak" data-word="' + v.word + '">🔊</button>'
      + '<div class="vi-mastery">' + dots + '</div>'
      + '</div>';
  }).join("");

  list.querySelectorAll(".vi-speak").forEach((btn) => {
    btn.addEventListener("click", () => speakWord(btn.dataset.word));
  });
}

// ══════════════════════════════════════
// SPEAK PAGE
// ══════════════════════════════════════
let speakTarget = "";
let speakRecognition = null;

function renderSpeakPage() {
  const vocab = S.vocab || [];
  if (vocab.length === 0) {
    M.innerHTML = ''
      + '<h2>Speaking Practice</h2>'
      + '<p class="muted">Learn some words first to practice speaking!</p>'
      + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';
    document.getElementById("backHome").addEventListener("click", () => showPage("home"));
    return;
  }

  const word = vocab[Math.floor(Math.random() * vocab.length)];
  speakTarget = word.word;

  M.innerHTML = ''
    + '<h2>Speaking Practice</h2>'
    + '<div class="speak-area">'
    +   '<p class="muted">Say this word:</p>'
    +   '<div class="speak-target" id="speakWord">' + speakTarget + '</div>'
    +   '<button class="dw-speak" id="speakListen" style="background:var(--b)">🔊 Listen</button>'
    +   '<button class="speak-btn" id="speakMic">🎤</button>'
    +   '<div class="speak-result" id="speakResult"></div>'
    +   '<button class="btn btn-green btn-block" id="speakNext">Next Word</button>'
    + '</div>'
    + '<button class="btn btn-outline btn-block" id="backHome">← Back</button>';

  document.getElementById("speakListen").addEventListener("click", () => speakWord(speakTarget));
  document.getElementById("speakNext").addEventListener("click", () => renderSpeakPage());
  document.getElementById("backHome").addEventListener("click", () => {
    if (speakRecognition) { try { speakRecognition.stop(); } catch (_) {} }
    showPage("home");
  });

  const micBtn = document.getElementById("speakMic");
  const resultEl = document.getElementById("speakResult");

  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    resultEl.textContent = "Speech recognition not supported in this browser";
    resultEl.style.color = "var(--r)";
    micBtn.style.opacity = "0.4";
    micBtn.style.pointerEvents = "none";
    return;
  }

  micBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speakRecognition = new SpeechRecognition();
    speakRecognition.lang = "en";
    speakRecognition.continuous = false;
    speakRecognition.interimResults = false;

    micBtn.classList.add("recording");
    resultEl.textContent = "Listening...";
    resultEl.style.color = "var(--t2)";

    speakRecognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase().trim();
      const target = speakTarget.toLowerCase().trim();

      if (spoken === target || target.includes(spoken) || spoken.includes(target)) {
        resultEl.textContent = "✅ Correct! You said: " + event.results[0][0].transcript;
        resultEl.style.color = "var(--g)";
        sndCorrect();
        addXP(5);
        S.stats.correct++;
        saveState();
      } else {
        resultEl.textContent = "❌ You said: " + event.results[0][0].transcript + " (Expected: " + speakTarget + ")";
        resultEl.style.color = "var(--r)";
        sndWrong();
      }
      micBtn.classList.remove("recording");
    };

    speakRecognition.onerror = () => {
      resultEl.textContent = "❌ Could not recognize. Try again!";
      resultEl.style.color = "var(--r)";
      micBtn.classList.remove("recording");
    };

    speakRecognition.onend = () => {
      micBtn.classList.remove("recording");
    };

    speakRecognition.start();
  });
}

// ══════════════════════════════════════
// ONLINE WORD FETCH
// ══════════════════════════════════════
async function fetchOnlineWords(count = 8) {
  if (!navigator.onLine) return [];

  const today = dateKey();
  const lastFetch = localStorage.getItem("ss_lastOnlineFetch");
  if (lastFetch === today) {
    try { return JSON.parse(localStorage.getItem("ss_onlineWords") || "[]"); }
    catch (_) { return []; }
  }

  const fetched = [];
  const topics = [...FETCH_CATEGORIES].sort(() => Math.random() - 0.5).slice(0, 3);

  for (const topic of topics) {
    if (fetched.length >= count) break;
    try {
      const response = await fetch("https://api.datamuse.com/words?topics=" + topic + "&md=d&max=" + (count * 2));
      if (!response.ok) continue;
      const data = await response.json();
      const valid = data.filter((w) =>
        w.word.length >= 3 && w.word.length <= 10
        && /^[a-z]+$/.test(w.word)
        && w.defs && w.defs.length > 0
      );
      for (const v of valid) {
        if (fetched.length >= count) break;
        if (!fetched.find((f) => f.en === v.word)) {
          const def = v.defs[0] ? v.defs[0].replace(/^\w+\s*/, "") : "";
          fetched.push({
            en: v.word.charAt(0).toUpperCase() + v.word.slice(1),
            sw: def || topic,
            online: true,
            icon: FETCH_EMOJIS[Math.floor(Math.random() * FETCH_EMOJIS.length)]
          });
        }
      }
    } catch (_) { /* ignore */ }
  }

  localStorage.setItem("ss_onlineWords", JSON.stringify(fetched));
  localStorage.setItem("ss_lastOnlineFetch", today);
  return fetched;
}

async function autoFetchWords() {
  if (!S.user) return;
  const words = await fetchOnlineWords(10);
  if (words.length > 0) {
    const existing = S.vocab.filter((v) => v.online);
    const newWords = words.filter((w) => !existing.find((e) => e.word === w.en));
    if (newWords.length > 0) {
      S.vocab.push(...newWords.map((w) => ({
        word: w.en, sw: w.sw, mastery: 0, learned: Date.now(),
        unit: "Online", icon: w.icon, online: true
      })));
      saveState();
      toast("📥 " + newWords.length + " new words fetched!", "info");
    }
  }
}

// ══════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════
let notifPermission = "default";

function requestNotifPermission() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") { notifPermission = "granted"; return; }
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then((p) => {
      notifPermission = p;
      if (p === "granted") scheduleDailyReminder();
    });
  }
}

function scheduleDailyReminder() {
  if (notifPermission !== "granted") return;
  const last = localStorage.getItem("ss_lastNotif");
  const today = dateKey();
  if (last === today) return;

  const dw = getDailyWord();
  setTimeout(() => {
    try {
      new Notification("🦁 Safari Stars — " + dw.en, {
        body: "Word of the day: " + dw.en + " (" + dw.sw + ") — Time to practice! 📚",
        icon: "icons/icon-192.svg",
        tag: "safari-daily"
      });
      localStorage.setItem("ss_lastNotif", today);
    } catch (_) { /* ignore */ }
  }, 5000);
}

// ══════════════════════════════════════
// FRIENDS PAGE
// ══════════════════════════════════════
function renderFriendsPage() {
  const users = getUsers();
  const friends = S.friends || [];

  M.innerHTML = ''
    + '<h2>Friends</h2>'
    + '<p class="muted">Add friends and compare progress</p>'
    + '<div style="display:flex;gap:8px;margin:12px 0">'
    +   '<input type="text" id="friendInput" placeholder="Enter friend name..." style="flex:1;padding:10px;border:2px solid var(--bd);border-radius:var(--Rs);font-size:.85rem;background:var(--bg)"/>'
    +   '<button class="btn btn-green btn-sm" id="addFriendBtn">Add</button>'
    + '</div>'
    + '<div id="friendList"></div>'
    + '<button class="btn btn-outline btn-block" style="margin-top:12px" id="backHome">← Back</button>';

  const list = document.getElementById("friendList");

  function renderFriendList() {
    if (friends.length === 0) {
      list.innerHTML = '<div class="no-weak">No friends yet! Add someone above.</div>';
      return;
    }
    list.innerHTML = friends.map((name) => {
      const u = users[name];
      if (!u) return '<div class="weak-item"><div class="weak-info"><strong>' + name + '</strong><small>Not found</small></div></div>';
      const league = getLeague(u.stats?.xp || 0);
      return '<div class="weak-item">'
        + '<div style="font-size:1.4rem">' + league.icon + '</div>'
        + '<div class="weak-info"><strong>' + name + '</strong>'
        + '<small>🔥 ' + (u.streak || 0) + ' streak • ⭐ ' + (u.stats?.xp || 0) + ' XP • 📝 ' + (u.vocab?.length || 0) + ' words</small></div>'
        + '<button class="btn btn-sm btn-outline" style="color:var(--r);border-color:var(--r)" data-remove="' + name + '">✕</button>'
        + '</div>';
    }).join("");

    list.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = friends.indexOf(btn.dataset.remove);
        if (idx >= 0) { friends.splice(idx, 1); S.friends = friends; saveState(); renderFriendList(); }
      });
    });
  }

  renderFriendList();

  document.getElementById("addFriendBtn").addEventListener("click", () => {
    const name = document.getElementById("friendInput").value.trim();
    if (!name) return;
    if (name === S.user?.name) { toast("Can't add yourself!", "err"); return; }
    if (friends.includes(name)) { toast("Already friends!", "info"); return; }
    if (!users[name]) { toast("User not found!", "err"); return; }
    friends.push(name);
    S.friends = friends;
    saveState();
    document.getElementById("friendInput").value = "";
    renderFriendList();
    toast(name + " added as friend! 👫", "ok");
  });

  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// AVATAR SHOP PAGE
// ══════════════════════════════════════
function renderAvatarPage() {
  const owned = S.ownedAvatars || [];
  const avatar = S.avatar || { frame: null, pet: null, bg: null };

  M.innerHTML = ''
    + '<h2>Avatar Shop</h2>'
    + '<p class="muted">Customize your profile</p>'
    + '<div class="shop-coins"><b>' + S.stars + '</b> stars</div>'
    + '<div id="avatarGrid"></div>'
    + '<h3 style="margin-top:16px">Your Items</h3>'
    + '<div id="ownedItems"></div>'
    + '<button class="btn btn-outline btn-block" style="margin-top:12px" id="backHome">← Back</button>';

  const grid = document.getElementById("avatarGrid");
  const types = ["frame", "pet", "bg"];

  types.forEach((type) => {
    const items = AVATARS.filter((a) => a.type === type);
    const typeLabel = type === "frame" ? "🖼️ Frames" : (type === "pet" ? "🐾 Pets" : "🎨 Backgrounds");
    grid.innerHTML += '<h3 style="margin:12px 0 8px">' + typeLabel + '</h3>'
      + items.map((item) => {
        const isOwned = owned.includes(item.id);
        const isActive = avatar[type] === item.id;
        return '<div class="shop-item" data-id="' + item.id + '">'
          + '<div class="shop-ic" style="background:' + (item.color || 'var(--b)') + '">' + item.icon + '</div>'
          + '<div class="shop-info"><b>' + item.name + '</b><small>' + (isOwned ? (isActive ? "✅ Equipped" : "Tap to equip") : item.cost + ' stars') + '</small></div>'
          + '<span class="shop-cost">' + (isOwned ? (isActive ? "Equipped" : "Owned") : "⭐ " + item.cost) + '</span>'
          + '</div>';
      }).join("");
  });

  grid.querySelectorAll(".shop-item").forEach((el) => {
    el.addEventListener("click", () => {
      const item = AVATARS.find((a) => a.id === el.dataset.id);
      if (!item) return;
      if (owned.includes(item.id)) {
        avatar[item.type] = avatar[item.type] === item.id ? null : item.id;
        S.avatar = avatar;
        saveState();
        renderAvatarPage();
        toast(item.name + (avatar[item.type] === item.id ? " equipped!" : " unequipped"), "ok");
      } else {
        if (S.stars < item.cost) { toast("Not enough stars!", "err"); return; }
        S.stars -= item.cost;
        owned.push(item.id);
        S.ownedAvatars = owned;
        avatar[item.type] = item.id;
        S.avatar = avatar;
        saveState();
        renderAvatarPage();
        toast(item.name + " purchased! 🎉", "ok");
      }
    });
  });

  // Show owned items
  const ownedEl = document.getElementById("ownedItems");
  if (owned.length === 0) {
    ownedEl.innerHTML = '<div class="no-weak">No items yet!</div>';
  } else {
    ownedEl.innerHTML = owned.map((id) => {
      const item = AVATARS.find((a) => a.id === id);
      if (!item) return "";
      const isActive = avatar[item.type] === id;
      return '<div class="vocab-item" style="cursor:pointer" data-equip="' + id + '">'
        + '<span class="vi-icon">' + item.icon + '</span>'
        + '<div class="vi-info"><div class="vi-en">' + item.name + '</div>'
        + '<div class="vi-sw">' + (isActive ? "✅ Equipped" : "Tap to equip") + '</div></div>'
        + '</div>';
    }).join("");

    ownedEl.querySelectorAll("[data-equip]").forEach((el) => {
      el.addEventListener("click", () => {
        const item = AVATARS.find((a) => a.id === el.dataset.equip);
        if (!item) return;
        avatar[item.type] = avatar[item.type] === item.id ? null : item.id;
        S.avatar = avatar;
        saveState();
        renderAvatarPage();
      });
    });
  }

  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// WEEKLY CHALLENGES PAGE
// ══════════════════════════════════════
function renderWeeklyPage() {
  resetWeeklyLeague();
  const weekly = S.weeklyChallenge || {};

  M.innerHTML = ''
    + '<h2>Weekly Challenges</h2>'
    + '<p class="muted">Complete challenges for bonus rewards</p>'
    + '<div class="shop-coins" style="margin:12px 0"><b>' + (S.weeklyXp || 0) + '</b> XP this week</div>'
    + WEEKLY_CHALLENGES.map((ch) => {
      const current = weekly[ch.id] || 0;
      const done = current >= ch.need;
      const pct = Math.min(100, Math.round((current / ch.need) * 100));
      return '<div style="padding:14px;background:var(--c);border-radius:var(--R);margin-bottom:8px;box-shadow:var(--sh);border-left:4px solid ' + (done ? 'var(--g)' : 'var(--bd)') + '">'
        + '<div style="display:flex;align-items:center;gap:10px">'
        + '<span style="font-size:1.4rem">' + ch.icon + '</span>'
        + '<div style="flex:1"><strong style="font-size:.85rem">' + ch.label + '</strong>'
        + '<br><small style="font-size:.7rem;color:var(--t2)">' + current + ' / ' + ch.need + '</small>'
        + '<div class="lc-pg" style="margin-top:6px"><div style="width:' + pct + '%"></div></div>'
        + '</div>'
        + '<span style="font-size:1.2rem">' + (done ? "✅" : "") + '</span>'
        + '</div></div>';
    }).join("")
    + '<div style="margin-top:12px"><h3>This Week\'s League</h3>'
    + LEAGUES.slice().reverse().map((l) => {
      const isActive = getLeague(S.weeklyXp || 0).id === l.id;
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--c);border-radius:var(--R);margin-bottom:6px;box-shadow:var(--sh);border:2px solid ' + (isActive ? l.color : 'transparent') + '">'
        + '<span style="font-size:1.4rem">' + l.icon + '</span>'
        + '<div style="flex:1"><strong>' + l.name + '</strong><br><small style="color:var(--t2)">' + l.minXP + '+ XP</small></div>'
        + (isActive ? '<span style="color:var(--g);font-weight:700">YOU</span>' : '')
        + '</div>';
    }).join("") + '</div>'
    + '<button class="btn btn-outline btn-block" style="margin-top:12px" id="backHome">← Back</button>';

  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// BOSS LEVEL PAGE
// ══════════════════════════════════════
function renderBossPage() {
  const bossNum = getBossLevel();
  const defeated = S.bossDefeated || [];

  M.innerHTML = ''
    + '<h2>🐉 Boss Levels</h2>'
    + '<p class="muted">Defeat bosses every 10 lessons</p>'
    + '<div style="margin:12px 0">'
    + 'Boss ' + bossNum + ': ' + (defeated.includes(bossNum) ? '✅ Defeated' : '⚔️ Waiting')
    + '</div>'
    + '<p class="muted">Boss levels have 10 hard questions. No skipping! You need 80% to win.</p>'
    + '<p class="muted">Boss ' + bossNum + ' unlocked after ' + (bossNum * 10) + ' lessons. (' + S.stats.lessonsDone + ' done)</p>'
    + (S.stats.lessonsDone >= bossNum * 10 && !defeated.includes(bossNum)
      ? '<button class="btn btn-green btn-block" id="startBoss">⚔️ Fight Boss!</button>'
      : '<button class="btn btn-outline btn-block" disabled>Complete more lessons to unlock</button>')
    + '<button class="btn btn-outline btn-block" style="margin-top:8px" id="backHome">← Back</button>';

  const startBtn = document.getElementById("startBoss");
  if (startBtn && !defeated.includes(bossNum)) {
    startBtn.addEventListener("click", () => openBossLevel());
  }
  document.getElementById("backHome").addEventListener("click", () => showPage("home"));
}

// ══════════════════════════════════════
// PRACTICE WORDS PAGE
// ══════════════════════════════════════
function renderPracticeWords() {
  openPracticeMode();
}

// ══════════════════════════════════════
// AUTH
// ══════════════════════════════════════
function login(name, role) {
  initAudio();
  const users = getUsers();

  if (users[name]) {
    Object.assign(S, users[name]);
    S.user = { name, role: users[name].role || role };
  } else {
    S = freshState();
    S.user = { name, role };
    users[name] = {
      name, role, progress: {}, stats: S.stats,
      streak: 0, stars: 30, xp: 0, xpLevel: 1,
      hearts: 5, heartsRegen: Date.now(),
      vocab: [], badges: [], dailyActivity: {},
      streakFreeze: 0, daily: {}, weakCategories: {},
      wrongWords: [], placed: false,
      friends: [], ownedAvatars: [], avatar: { frame: null, pet: null, bg: null },
      weeklyXp: 0, lastWeekReset: 0, weeklyChallenge: {},
      bossDefeated: [], bossLessons: 0, lastLogin: 0,
      studyMinutes: 0, lastStudyStart: 0
    };
    saveUsers(users);
  }

  localStorage.setItem(K.C, JSON.stringify({ name }));
  document.getElementById("authScreen").style.display = "none";
  document.getElementById("appShell").classList.add("active");

  initDaily();
  checkStreak();
  regenHearts();
  autoFetchWords();

  const settings = getSettings();
  if (settings.notif) requestNotifPermission();
  setTimeout(() => { if (settings.notif) scheduleDailyReminder(); }, 2000);

  showPage("home");

  // Comeback rewards
  checkComebackReward();

  if (!S.placed) {
    setTimeout(startPlacement, 600);
  }
}

function logout() {
  saveState();
  S = freshState();
  document.getElementById("authScreen").style.display = "";
  document.getElementById("appShell").classList.remove("active");
  localStorage.removeItem(K.C);
  renderSavedUsers();
}

function renderSavedUsers() {
  const container = document.getElementById("savedUsers");
  if (!container) return;

  const users = getUsers();
  container.innerHTML = Object.keys(users)
    .map((n) => '<button>👤 ' + n + '</button>')
    .join("");

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      sndClick();
      login(btn.textContent.replace("👤 ", "").trim());
    });
  });
}

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
function init() {
  initAudio();

  const settings = getSettings();
  applySettings(settings);

  // Migrate old data
  const oldVersion = localStorage.getItem(K.V) || "1.0.0";
  if (oldVersion !== VER) {
    try {
      const users = getUsers();
      Object.values(users).forEach((u) => {
        if (u.weakCategories === undefined) u.weakCategories = {};
        if (u.wrongWords === undefined) u.wrongWords = [];
        if (u.placed === undefined) u.placed = false;
        if (u.daily === undefined) u.daily = {};
        if (u.friends === undefined) u.friends = [];
        if (u.ownedAvatars === undefined) u.ownedAvatars = [];
        if (u.avatar === undefined) u.avatar = { frame: null, pet: null, bg: null };
        if (u.weeklyXp === undefined) u.weeklyXp = 0;
        if (u.lastWeekReset === undefined) u.lastWeekReset = 0;
        if (u.weeklyChallenge === undefined) u.weeklyChallenge = {};
        if (u.bossDefeated === undefined) u.bossDefeated = [];
        if (u.lastLogin === undefined) u.lastLogin = 0;
        if (u.studyMinutes === undefined) u.studyMinutes = 0;
        if (u.lastStudyStart === undefined) u.lastStudyStart = 0;
        if (u.stats && u.stats.perfectLessons === undefined) u.stats.perfectLessons = 0;
        if (u.stats && u.stats.nightLessons === undefined) u.stats.nightLessons = 0;
        if (u.stats && u.stats.earlyLessons === undefined) u.stats.earlyLessons = 0;
        if (u.stats && u.stats.questsDone === undefined) u.stats.questsDone = 0;
        if (Array.isArray(u.vocab)) {
          u.vocab = u.vocab.map((v) => {
            if (v && !v.word && v.en) {
              return { word: v.en, sw: v.sw || SWAHILI[v.en.toLowerCase()] || "",
                mastery: v.mastery || 0, learned: v.learned || Date.now(),
                unit: v.unit || "Online", icon: v.icon, online: v.online || false };
            }
            return v;
          });
        }
      });
      saveUsers(users);
      localStorage.setItem(K.V, VER);
    } catch (_) { localStorage.setItem(K.V, VER); }
  }

  // Login form
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    initAudio();
    const name = document.getElementById("loginName").value.trim();
    const role = document.getElementById("loginRole").value;
    if (name.length < 2) return;
    login(name, role);
  });

  // Settings button
  document.getElementById("settingsBtn").addEventListener("click", () => showPage("settings"));

  // Heart regen every minute
  setInterval(() => { if (S.user) regenHearts(); }, 60000);

  // Notifications
  requestNotifPermission();

  // Restore saved session
  const saved = localStorage.getItem(K.C);
  if (saved) {
    try {
      const user = JSON.parse(saved);
      if (user?.name) { login(user.name); return; }
    } catch (_) { /* ignore */ }
  }

  renderSavedUsers();

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(function() {});
  }
}

document.addEventListener("DOMContentLoaded", init);
})();

(() => {
"use strict";
const P = "ss4_";
const K = { U: P+"users", C: P+"cur", V: P+"ver", S: P+"set", W: P+"weak", PL: P+"placed" };
const VER = "4.0.0";
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const D = {};
function grab() {
  ["authScreen","appShell","loginForm","loginName","loginRole","savedUsers",
   "lessonMap","lessonDialog","closeLesson","exerciseArea","feedbackBox",
   "checkButton","skipButton","lessonProgress","lessonHearts","lessonTimer",
   "celebDialog","celebEmoji","celebTitle","celebDesc","celebEarned","celebContinue","celebConfetti",
   "streakDisplay","heartsDisplay","xpDisplay","levelDisplay","xpBarFill","xpProgressText",
   "greetLine","greetSub","profileName","profileRole",
   "statStreak","statStars","statXP","statLessons","statCorrect","statWords",
   "badgeGrid","weaknessList","shopGrid","shopStars","leagueList",
   "settingsBtn","settingsDialog","settingsClose","darkModeToggle","soundToggle",
   "notifToggle","shuffleToggle","timerSetting","pinToggle","resetBtn","exportBtn","appVersion",
   "dailyBtn","dailyDialog","dailyClose","dailyBody",
   "practiceBanner","practiceDesc","practiceBtn",
   "placementDialog","placementProgress","placementBarFill","placementBody",
   "placementCheck","placementFeedback","placementClose",
   "resultDialog","resultEmoji","resultTitle","resultDesc","resultLevel","resultWeak","resultContinue",
   "toastWrap","mascotMini"
  ].forEach(id => D[id] = document.getElementById(id));
}

const MSG = {
  idle: ["Ready to learn?","You can do this! 💪","New adventure! 🌟","Let's go! 🚀","I believe in you! ❤️"],
  correct: ["Amazing! 🎉","Great job! 👏","You're a star! ⭐","Fantastic! ✨","Brilliant! 💎","Superb! 🌈"],
  wrong: ["Almost! 💪","Try again! 🌟","You'll get it! 🎯","Keep going! 🔥","Not yet! 📚"],
  greet: ["Karibu! 👋","Welcome back! 🌅","Ready for fun? 🎮","Let's learn! 📚","Habari! 🦁"]
};

const BADGES = [
  {id:"first_lesson",icon:"🌟",name:"First Step",desc:"Complete 1 lesson"},
  {id:"five_lessons",icon:"📚",name:"Bookworm",desc:"Complete 5 lessons"},
  {id:"ten_lessons",icon:"🎓",name:"Scholar",desc:"Complete 10 lessons"},
  {id:"streak_3",icon:"🔥",name:"On Fire",desc:"3-day streak"},
  {id:"streak_7",icon:"⚡",name:"Lightning",desc:"7-day streak"},
  {id:"words_10",icon:"📝",name:"Collector",desc:"Learn 10 words"},
  {id:"words_25",icon:"📖",name:"Storyteller",desc:"Learn 25 words"},
  {id:"perfect",icon:"💎",name:"Diamond",desc:"Perfect lesson"},
  {id:"xp_100",icon:"🏅",name:"Rising Star",desc:"100 XP earned"},
  {id:"xp_500",icon:"🏆",name:"Safari Champ",desc:"500 XP earned"},
  {id:"all_units",icon:"🌍",name:"Safari Master",desc:"All units done"}
];

const SHOP = [
  {id:"streak_freeze",name:"Streak Freeze",desc:"Protect streak 1 day",cost:50,icon:"🧊"},
  {id:"hearts_refill",name:"Hearts Refill",desc:"Full hearts",cost:30,icon:"❤️"},
  {id:"xp_boost",name:"XP Boost 30m",desc:"Double XP",cost:80,icon:"⚡"}
];

const DAILY = [
  {id:"lesson",icon:"📚",label:"Complete 1 lesson",need:1},
  {id:"xp",icon:"✨",label:"Earn 30 XP",need:30},
  {id:"perfect",icon:"💎",label:"Get a perfect score",need:1}
];

// ── State ──
function fresh() {
  return {
    user: null, progress: {}, stats: { lessonsDone: 0, wordsLearned: 0, correct: 0, wrong: 0, xp: 0 },
    streak: 0, stars: 30, xp: 0, xpLevel: 1, hearts: 5, heartsRegen: Date.now(),
    vocab: [], badges: [], dailyActivity: {}, streakFreeze: 0,
    daily: {}, weakCategories: {}, wrongWords: [], placed: false
  };
}
let S = fresh();

// ── Sound ──
let ctx = null;
function initAudio() { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} }
function tone(f, d, type = "sine", vol = 0.12) {
  if (!ctx) return;
  try {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + d);
  } catch {}
}
function sndCorrect() { tone(523,.08); setTimeout(()=>tone(659,.08),80); setTimeout(()=>tone(784,.15),160); }
function sndWrong() { tone(300,.12,"sawtooth"); setTimeout(()=>tone(250,.15,"sawtooth"),120); }
function sndLevelUp() { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.12),i*100)); }
function sndClick() { tone(880,.03); }
function sndBadge() { [784,988,1175,1319].forEach((f,i)=>setTimeout(()=>tone(f,.1),i*80)); }

// ── Storage ──
function getUsers() { try { return JSON.parse(localStorage.getItem(K.U)) || {}; } catch { return {}; } }
function saveUsers(u) { localStorage.setItem(K.U, JSON.stringify(u)); }
function getSet() {
  try { return JSON.parse(localStorage.getItem(K.S)) || { dark: false, sound: true, notif: false, shuffle: false, timer: 0, pin: "" }; }
  catch { return { dark: false, sound: true, notif: false, shuffle: false, timer: 0, pin: "" }; }
}
function saveSet(s) { localStorage.setItem(K.S, JSON.stringify(s)); }
function applySet(s) {
  document.documentElement.setAttribute("data-theme", s.dark ? "dark" : "light");
  if (D.darkModeToggle) D.darkModeToggle.checked = s.dark;
  if (D.soundToggle) D.soundToggle.checked = s.sound !== false;
  if (D.notifToggle) D.notifToggle.checked = !!s.notif;
  if (D.shuffleToggle) D.shuffleToggle.checked = !!s.shuffle;
  if (D.timerSetting) D.timerSetting.value = String(s.timer || 0);
  if (D.pinToggle) D.pinToggle.textContent = s.pin ? "Remove" : "Set";
}
function save() {
  if (!S.user) return;
  const u = getUsers();
  u[S.user.name] = {
    name: S.user.name, role: S.user.role, progress: S.progress, stats: S.stats,
    streak: S.streak, stars: S.stars, xp: S.xp, xpLevel: S.xpLevel,
    hearts: S.hearts, heartsRegen: S.heartsRegen, vocab: S.vocab, badges: S.badges,
    dailyActivity: S.dailyActivity, streakFreeze: S.streakFreeze,
    daily: S.daily, weakCategories: S.weakCategories, wrongWords: S.wrongWords, placed: S.placed
  };
  saveUsers(u);
}
function dateKey(d = new Date()) { return d.toISOString().slice(0, 10); }

// ── XP / Level ──
function xpNeed(l) { return l * 100; }
function addXP(amt) {
  if (!S.user) return;
  S.xp += amt; S.stats.xp += amt;
  while (S.xp >= xpNeed(S.xpLevel)) { S.xp -= xpNeed(S.xpLevel); S.xpLevel++; sndLevelUp(); }
  save(); refreshXP(); floatXP(amt);
}
function refreshXP() {
  const need = xpNeed(S.xpLevel);
  const pct = Math.min(100, (S.xp / need) * 100);
  if (D.xpBarFill) D.xpBarFill.style.width = pct + "%";
  if (D.xpProgressText) D.xpProgressText.textContent = S.xp + " / " + need;
  if (D.levelDisplay) D.levelDisplay.textContent = S.xpLevel;
  if (D.xpDisplay) D.xpDisplay.textContent = "✨ " + S.stats.xp;
  if (D.statXP) D.statXP.textContent = S.stats.xp;
}
function floatXP(amt) {
  if (!D.exerciseArea) return;
  const el = document.createElement("div");
  el.className = "xp-float"; el.textContent = "+" + amt + " XP";
  const r = D.exerciseArea.getBoundingClientRect();
  el.style.left = (r.left + r.width / 2 - 30) + "px";
  el.style.top = (r.top + 40) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ── Hearts ──
function refreshHearts() {
  if (D.heartsDisplay) D.heartsDisplay.textContent = "❤️".repeat(S.hearts) + "🖤".repeat(Math.max(0, 5 - S.hearts));
  if (D.lessonHearts) D.lessonHearts.textContent = "❤️".repeat(S.hearts) + "🖤".repeat(Math.max(0, 5 - S.hearts));
}
function loseHeart() {
  if (S.hearts <= 0) return false;
  S.hearts--; S.heartsRegen = Date.now(); refreshHearts(); save();
  return S.hearts > 0;
}
function regenHearts() {
  if (S.hearts >= 5 || !S.user) return;
  const elapsed = Date.now() - (S.heartsRegen || Date.now());
  const add = Math.floor(elapsed / 300000);
  if (add > 0) { S.hearts = Math.min(5, S.hearts + add); S.heartsRegen = Date.now(); save(); refreshHearts(); }
}

// ── Streak ──
function refreshStreak() {
  if (D.streakDisplay) D.streakDisplay.textContent = "🔥 " + S.streak;
  if (D.statStreak) D.statStreak.textContent = S.streak;
}
function markDay() {
  const t = dateKey();
  if (!S.dailyActivity[t]) {
    S.dailyActivity[t] = true;
    const yesterday = dateKey(new Date(Date.now() - 86400000));
    S.streak = (S.dailyActivity[yesterday] ? S.streak : 0) + 1;
    save(); refreshStreak();
  }
}
function checkStreak() {
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  if (!S.dailyActivity[yesterday] && !S.dailyActivity[dateKey()]) {
    if (S.streakFreeze > 0) { S.streakFreeze--; save(); }
    else { S.streak = 0; save(); }
  }
  refreshStreak();
}

// ── Badges ──
function checkBadges() {
  const owned = S.badges || [];
  const has = id => owned.some(b => b.id === id);
  const earn = [];
  if (!has("first_lesson") && S.stats.lessonsDone >= 1) earn.push("first_lesson");
  if (!has("five_lessons") && S.stats.lessonsDone >= 5) earn.push("five_lessons");
  if (!has("ten_lessons") && S.stats.lessonsDone >= 10) earn.push("ten_lessons");
  if (!has("streak_3") && S.streak >= 3) earn.push("streak_3");
  if (!has("streak_7") && S.streak >= 7) earn.push("streak_7");
  if (!has("words_10") && S.vocab.length >= 10) earn.push("words_10");
  if (!has("words_25") && S.vocab.length >= 25) earn.push("words_25");
  if (!has("xp_100") && S.stats.xp >= 100) earn.push("xp_100");
  if (!has("xp_500") && S.stats.xp >= 500) earn.push("xp_500");
  earn.forEach(id => {
    const b = BADGES.find(x => x.id === id);
    if (b) { owned.push({ id, at: Date.now() }); sndBadge(); setTimeout(() => showCeleb("badge", b), 400); }
  });
  S.badges = owned; save(); renderBadges();
}
function renderBadges() {
  if (!D.badgeGrid) return;
  D.badgeGrid.innerHTML = BADGES.map(b => {
    const ok = (S.badges || []).some(x => x.id === b.id);
    return `<div class="badge-item ${ok ? 'unlocked' : 'locked'}" title="${b.desc}">${b.icon}<span class="badge-lbl">${b.name}</span></div>`;
  }).join("");
}

// ── Daily ──
function initDaily() {
  const t = dateKey();
  if (!S.daily) S.daily = {};
  if (!S.daily[t]) S.daily[t] = {};
  DAILY.forEach(g => { if (S.daily[t][g.id] === undefined) S.daily[t][g.id] = 0; });
  save();
}
function trackDaily(id, n = 1) {
  const t = dateKey();
  if (!S.daily) S.daily = {};
  if (!S.daily[t]) S.daily[t] = {};
  S.daily[t][id] = (S.daily[t][id] || 0) + n;
  save();
}
function renderDaily() {
  if (!D.dailyBody) return;
  const t = dateKey(); const g = (S.daily || {})[t] || {};
  D.dailyBody.innerHTML = DAILY.map(d => {
    const cur = g[d.id] || 0; const ok = cur >= d.need;
    return `<div class="daily-goal ${ok ? 'done' : ''}" style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--bg);border-radius:var(--r);margin-bottom:8px">
      <span style="font-size:1.5rem">${d.icon}</span>
      <div style="flex:1"><strong style="font-size:.85rem">${d.label}</strong><br><small style="font-size:.7rem;color:var(--text2)">${cur} / ${d.need}</small></div>
      <span style="font-size:1.2rem">${ok ? '✅' : ''}</span>
    </div>`;
  }).join("");
}

// ── Weak Areas ──
function trackWeak(unit, wrong) {
  if (!S.weakCategories) S.weakCategories = {};
  S.weakCategories[unit] = (S.weakCategories[unit] || 0) + (wrong ? 1 : 0);
  save();
}
function renderWeak() {
  if (!D.weaknessList) return;
  const wc = S.weakCategories || {};
  const entries = Object.entries(wc).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    D.weaknessList.innerHTML = '<div class="no-weak">🎉 No weak areas yet! Keep learning.</div>';
    return;
  }
  D.weaknessList.innerHTML = entries.map(([unit, count]) => {
    const short = unit.replace(/Unit \d+ - /, "");
    return `<div class="weakness-item"><span class="w-icon">⚠️</span><div class="w-info"><strong>${short}</strong><small>${count} wrong answers</small></div></div>`;
  }).join("");
  // Practice banner
  if (D.practiceBanner) {
    const top = entries[0];
    if (top) {
      D.practiceBanner.style.display = "flex";
      D.practiceDesc.textContent = "Focus on: " + top[0].replace(/Unit \d+ - /, "");
    }
  }
}

// ── Toast ──
function toast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = "toast " + type; t.textContent = msg;
  D.toastWrap.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 300); }, 2200);
}

// ── Celebration ──
function showCeleb(type, data) {
  if (type === "level") {
    D.celebEmoji.textContent = "🎉";
    D.celebTitle.textContent = "Level " + data + "!";
    D.celebDesc.textContent = "You're getting better every day!";
    D.celebEarned.innerHTML = '<span class="xp-tag">✨ +50 XP bonus</span>';
    addXP(50); launchConfetti(D.celebConfetti);
  } else if (type === "badge") {
    D.celebEmoji.textContent = data.icon;
    D.celebTitle.textContent = "Badge Earned!";
    D.celebDesc.textContent = data.name + " — " + data.desc;
    D.celebEarned.innerHTML = '<span class="badge-tag">' + data.icon + ' ' + data.name + '</span>';
    launchConfetti(D.celebConfetti);
  } else if (type === "lesson") {
    const p = data || {};
    D.celebEmoji.textContent = p.perfect ? "💎" : "🎊";
    D.celebTitle.textContent = p.perfect ? "Perfect Score!" : "Lesson Complete!";
    D.celebDesc.textContent = "You earned " + p.xp + " XP!";
    let tags = '<span class="xp-tag">✨ ' + p.xp + ' XP</span>';
    if (p.perfect) tags += '<span class="badge-tag">💎 Perfect</span>';
    tags += '<span class="star-tag">⭐ +' + (p.stars || 5) + '</span>';
    D.celebEarned.innerHTML = tags;
    launchConfetti(D.celebConfetti);
  } else if (type === "placement") {
    D.resultEmoji.textContent = data.emoji;
    D.resultTitle.textContent = data.title;
    D.resultDesc.textContent = data.desc;
    D.resultLevel.textContent = data.level;
    D.resultWeak.innerHTML = data.weakHTML;
    launchConfetti(D.celebConfetti);
  }
  D.celebDialog.showModal();
}

// ── Confetti ──
function launchConfetti(canvas) {
  if (!canvas) return;
  canvas.width = canvas.parentElement.clientWidth || 400;
  canvas.height = canvas.parentElement.clientHeight || 400;
  const c = canvas.getContext("2d");
  const colors = ["#FF6B35","#FFB800","#58CC02","#1CB0F6","#A560E8","#FF6B9D","#FF4245"];
  const ps = [];
  for (let i = 0; i < 60; i++) {
    ps.push({
      x: Math.random() * canvas.width, y: -10,
      w: Math.random() * 8 + 3, h: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - .5) * 3, vy: Math.random() * 2 + 1.5,
      r: Math.random() * 360, rv: (Math.random() - .5) * 5, a: 1
    });
  }
  let f = 0;
  function draw() {
    if (f > 90) { c.clearRect(0, 0, canvas.width, canvas.height); return; }
    c.clearRect(0, 0, canvas.width, canvas.height); f++;
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .04; p.r += p.rv; p.a -= .008;
      c.save(); c.translate(p.x, p.y); c.rotate(p.r * Math.PI / 180);
      c.globalAlpha = Math.max(0, p.a); c.fillStyle = p.color;
      c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Auth ──
function login(name, role) {
  const users = getUsers();
  if (users[name]) {
    Object.assign(S, users[name]); S.user = { name, role: users[name].role || role };
  } else {
    S = fresh(); S.user = { name, role };
    users[name] = { name, role, progress: {}, stats: S.stats, streak: 0, stars: 30, xp: 0, xpLevel: 1,
      hearts: 5, heartsRegen: Date.now(), vocab: [], badges: [], dailyActivity: {}, streakFreeze: 0,
      daily: {}, weakCategories: {}, wrongWords: [], placed: false };
    saveUsers(users);
  }
  localStorage.setItem(K.C, JSON.stringify({ name }));
  D.authScreen.style.display = "none"; D.appShell.classList.add("active");
  initDaily(); checkStreak(); regenHearts(); renderAll();
  // Check placement
  if (!S.placed) { setTimeout(startPlacement, 600); }
}
function logout() {
  save(); S = fresh(); D.authScreen.style.display = ""; D.appShell.classList.remove("active");
  localStorage.removeItem(K.C); renderSavedUsers();
}

// ── Navigation ──
function goPage(id) {
  $$(".page").forEach(p => p.classList.remove("active"));
  const pg = document.getElementById(id); if (pg) pg.classList.add("active");
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  if (id === "pageHome") renderMap();
  if (id === "pageProfile") renderProfile();
  if (id === "pageShop") renderShop();
  if (id === "pageLeaderboard") renderLeague();
}

// ── Mascot ──
function setGreeting(type) {
  const m = MSG[type] || MSG.idle;
  if (D.greetLine) D.greetLine.textContent = m[Math.floor(Math.random() * m.length)];
}

// ═══════════════════════════════════
// PLACEMENT TEST
// ═══════════════════════════════════
let placeQs = [], placeIdx = 0, placeScore = 0, placeSelected = null, placeAnswered = false;

function buildPlacement() {
  // Pick one multiple-choice question from each of the first 10 lessons + 5 random
  const qs = [];
  LESSONS.forEach(l => {
    const mc = l.exercises.filter(e => e.type === "multiple");
    if (mc.length > 0) {
      const ex = mc[Math.floor(Math.random() * mc.length)];
      qs.push({ ...ex, unit: l.unit, lessonTitle: l.title });
    }
  });
  // Shuffle and take 15
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  return qs.slice(0, 15);
}

function startPlacement() {
  placeQs = buildPlacement(); placeIdx = 0; placeScore = 0;
  D.placementDialog.showModal(); renderPlaceQ();
}

function renderPlaceQ() {
  if (placeIdx >= placeQs.length) { finishPlacement(); return; }
  placeSelected = null; placeAnswered = false;
  const q = placeQs[placeIdx];
  const total = placeQs.length;
  if (D.placementProgress) D.placementProgress.textContent = (placeIdx + 1) + " / " + total;
  if (D.placementBarFill) D.placementBarFill.style.width = ((placeIdx / total) * 100) + "%";
  if (D.placementFeedback) { D.placementFeedback.className = "lesson-feedback"; D.placementFeedback.textContent = ""; }
  if (D.placementCheck) D.placementCheck.style.display = "none";

  D.placementBody.innerHTML = `
    <div class="placement-q">${q.question}</div>
    <div class="opt-grid">${q.options.map((o, i) => `<button class="opt-btn" data-idx="${i}">${o}</button>`).join("")}</div>
  `;
  D.placementBody.querySelectorAll(".opt-btn").forEach(b => {
    b.addEventListener("click", () => {
      if (placeAnswered) return;
      sndClick();
      placeSelected = parseInt(b.dataset.idx);
      D.placementBody.querySelectorAll(".opt-btn").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
      D.placementCheck.style.display = "block";
    });
  });
  D.placementCheck.onclick = checkPlaceQ;
}

function checkPlaceQ() {
  if (placeAnswered || placeSelected === null) return;
  placeAnswered = true;
  const q = placeQs[placeIdx];
  const correct = placeSelected === q.correct;
  if (correct) { placeScore++; sndCorrect(); trackWeak(q.unit, false); }
  else { sndWrong(); trackWeak(q.unit, true); }

  // Highlight
  const btns = D.placementBody.querySelectorAll(".opt-btn");
  btns.forEach((b, i) => {
    b.classList.add("disabled");
    if (i === q.correct) b.classList.add("correct");
    if (i === placeSelected && !correct) b.classList.add("wrong");
  });

  if (D.placementFeedback) {
    D.placementFeedback.className = "lesson-feedback show " + (correct ? "ok" : "fail");
    D.placementFeedback.textContent = correct ? "✅ Correct!" : "❌ Answer: " + q.options[q.correct];
  }

  setTimeout(() => { placeIdx++; renderPlaceQ(); }, 1200);
}

function finishPlacement() {
  S.placed = true; save();
  D.placementDialog.close();
  const pct = Math.round((placeScore / placeQs.length) * 100);
  let emoji, title, desc, level;
  if (pct >= 80) { emoji = "🏆"; title = "Excellent!"; level = "Advanced Start — Unit 4+"; }
  else if (pct >= 60) { emoji = "🌟"; title = "Good Job!"; level = "Intermediate Start — Unit 3"; }
  else if (pct >= 40) { emoji = "💪"; title = "Nice Try!"; level = "Beginner+ Start — Unit 2"; }
  else { emoji = "📚"; title = "Let's Learn!"; level = "Beginner Start — Unit 1"; }

  // Build weak areas HTML
  const wc = S.weakCategories || {};
  const weakEntries = Object.entries(wc).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  let weakHTML = "";
  if (weakEntries.length > 0) {
    weakHTML = "<h4>Areas to focus on:</h4><ul>" + weakEntries.map(([u]) =>
      '<li><span class="rw-icon">⚠️</span>' + u.replace(/Unit \d+ - /, "") + '</li>'
    ).join("") + "</ul>";
  } else {
    weakHTML = "<p style='color:var(--green);font-weight:600'>🎉 No weak areas detected!</p>";
  }

  // Unlock lessons based on placement
  if (pct >= 80) { ["greetings","numbers","family","colors","food","animals","body","phrases"].forEach(id => { S.progress[id] = { completed: true, bestScore: 100 }; }); }
  else if (pct >= 60) { ["greetings","numbers","family","colors"].forEach(id => { S.progress[id] = { completed: true, bestScore: 100 }; }); }
  else if (pct >= 40) { ["greetings","numbers"].forEach(id => { S.progress[id] = { completed: true, bestScore: 80 }; }); }
  save();

  setTimeout(() => showCeleb("placement", { emoji, title, desc: placeScore + "/" + placeQs.length + " correct (" + pct + "%)", level, weakHTML }), 300);
}

// ═══════════════════════════════════
// LESSONS
// ═══════════════════════════════════
let curLesson = null, curIdx = 0, exOrder = [], selOpt = null, matchLeft = null, matchRight = null, tapWords = [], timerInt = null, timerSec = 0, _correct = 0, _total = 0;

function renderMap() {
  if (!D.lessonMap) return;
  const units = [...new Set(LESSONS.map(l => l.unit))];
  let html = "";
  units.forEach(unit => {
    const lessons = LESSONS.filter(l => l.unit === unit);
    html += `<div class="unit-label" style="font-size:.7rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.05em;margin:12px 0 6px;padding-left:4px">${unit}</div>`;
    lessons.forEach(l => {
      const p = S.progress[l.id]; const done = p?.completed; const score = p?.bestScore || 0;
      const li = LESSONS.findIndex(x => x.id === l.id);
      const prevDone = li === 0 || S.progress[LESSONS[li - 1].id]?.completed;
      const locked = !done && !prevDone;
      html += `<div class="lesson-card ${done ? 'done' : ''} ${locked ? 'locked' : ''}" data-id="${l.id}">
        <div class="lc-icon">${locked ? '🔒' : l.icon}</div>
        <div class="lc-info">
          <h3>${l.title}</h3>
          <p>${l.exercises.length} exercises</p>
          ${done ? '<div class="lc-prog"><div style="width:' + score + '%"></div></div>' : ''}
        </div>
        <span class="lc-status ${done ? 'done' : ''}">${done ? '✅ ' + score + '%' : locked ? '🔒' : '▶'}</span>
      </div>`;
    });
  });
  D.lessonMap.innerHTML = html;
  D.lessonMap.querySelectorAll(".lesson-card:not(.locked)").forEach(el => {
    el.addEventListener("click", () => { sndClick(); openLesson(el.dataset.id); });
  });
  setGreeting(Object.values(S.progress).filter(p => p.completed).length === 0 ? "greet" : "idle");
}

function openLesson(id) {
  curLesson = LESSONS.find(l => l.id === id);
  if (!curLesson) return;
  curLesson.exercises.forEach(e => { delete e._done; delete e._retry; });
  const s = getSet();
  exOrder = curLesson.exercises.map((_, i) => i);
  if (s.shuffle) for (let i = exOrder.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [exOrder[i], exOrder[j]] = [exOrder[j], exOrder[i]]; }
  curIdx = 0; _correct = 0; _total = 0;
  D.lessonDialog.showModal();
  renderEx();
}
function closeLesson() {
  stopTimer(); D.lessonDialog.close(); curLesson = null;
  renderMap(); refreshHearts(); checkBadges(); renderWeak();
}

function stopTimer() { if (timerInt) { clearInterval(timerInt); timerInt = null; } if (D.lessonTimer) D.lessonTimer.textContent = ""; }

function renderEx() {
  if (!curLesson || curIdx >= curLesson.exercises.length) { finishLesson(); return; }
  const idx = exOrder[curIdx];
  const ex = curLesson.exercises[idx];
  selOpt = null; matchLeft = null; matchRight = null; tapWords = [];
  _total++;
  const total = curLesson.exercises.length;
  D.lessonProgress.textContent = (curIdx + 1) + " / " + total;
  refreshHearts();
  D.checkButton.style.display = "none";
  D.skipButton.style.display = "block";
  D.feedbackBox.className = "lesson-feedback";
  startTimer();

  switch (ex.type) {
    case "multiple": renderMultiple(ex); break;
    case "fillblank": renderFillBlank(ex); break;
    case "match": renderMatch(ex); break;
    case "tap": renderTap(ex); break;
    case "listen": renderListen(ex); break;
    default: renderMultiple(ex);
  }

  D.skipButton.onclick = () => { stopTimer(); curIdx++; renderEx(); };
  D.checkButton.onclick = () => checkEx(ex);
}

function renderMultiple(ex) {
  D.exerciseArea.innerHTML = `
    <div class="placement-q">${ex.question}</div>
    <div class="opt-grid">${ex.options.map((o, i) => '<button class="opt-btn" data-i="' + i + '">' + o + '</button>').join("")}</div>`;
  D.exerciseArea.querySelectorAll(".opt-btn").forEach(b => b.addEventListener("click", () => {
    sndClick(); selOpt = parseInt(b.dataset.i);
    D.exerciseArea.querySelectorAll(".opt-btn").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel"); D.checkButton.style.display = "block"; D.skipButton.style.display = "none";
  }));
}

function renderFillBlank(ex) {
  const parts = ex.sentence.split("___");
  D.exerciseArea.innerHTML = `
    <div class="placement-q">${parts[0]}<span style="display:inline-block;min-width:80px;border-bottom:3px solid var(--orange);margin:0 4px">&nbsp;</span>${parts[1] || ''}</div>
    <div class="opt-grid">${ex.options.map((o, i) => '<button class="opt-btn" data-i="' + i + '">' + o + '</button>').join("")}</div>`;
  D.exerciseArea.querySelectorAll(".opt-btn").forEach(b => b.addEventListener("click", () => {
    sndClick(); selOpt = parseInt(b.dataset.i);
    D.exerciseArea.querySelectorAll(".opt-btn").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
    // Show selected word in blank
    const spans = D.exerciseArea.querySelectorAll("span[style]");
    spans.forEach(s => { if (s.style.borderBottom && selOpt !== null) s.textContent = ex.options[selOpt]; });
    D.checkButton.style.display = "block"; D.skipButton.style.display = "none";
  }));
}

function renderMatch(ex) {
  const pairs = ex.pairs;
  const leftItems = pairs.map((p, i) => ({ text: p[0], idx: i }));
  const rightItems = pairs.map((p, i) => ({ text: p[1], idx: i }));
  // Shuffle right
  for (let i = rightItems.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]]; }

  D.exerciseArea.innerHTML = `
    <div class="placement-q">Match the pairs</div>
    <div class="match-cols">
      <div class="match-col" id="matchLeft">${leftItems.map(i => '<button class="match-btn" data-i="' + i.idx + '">' + i.text + '</button>').join("")}</div>
      <div class="match-col" id="matchRight">${rightItems.map(i => '<button class="match-btn" data-i="' + i.idx + '">' + i.text + '</button>').join("")}</div>
    </div>`;

  const matched = new Set();
  D.exerciseArea.querySelectorAll(".match-btn").forEach(b => {
    b.addEventListener("click", () => {
      sndClick(); const idx = parseInt(b.dataset.i);
      const isLeft = b.parentElement.id === "matchLeft";
      if (isLeft) {
        D.exerciseArea.querySelectorAll("#matchLeft .match-btn").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel"); matchLeft = idx;
      } else {
        D.exerciseArea.querySelectorAll("#matchRight .match-btn").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel"); matchRight = idx;
      }
      // Check if both selected
      if (matchLeft !== null && matchRight !== null) {
        if (matchLeft === matchRight) {
          // Correct match
          const lb = D.exerciseArea.querySelector('#matchLeft .match-btn[data-i="' + matchLeft + '"]');
          const rb = D.exerciseArea.querySelector('#matchRight .match-btn[data-i="' + matchRight + '"]');
          if (lb) { lb.classList.add("correct"); lb.classList.remove("sel"); }
          if (rb) { rb.classList.add("correct"); rb.classList.remove("sel"); }
          matched.add(matchLeft);
          if (matched.size === pairs.length) {
            selOpt = "matched";
            D.checkButton.style.display = "block"; D.skipButton.style.display = "none";
          }
        } else {
          // Wrong match
          const lb = D.exerciseArea.querySelector('#matchLeft .match-btn[data-i="' + matchLeft + '"]');
          const rb = D.exerciseArea.querySelector('#matchRight .match-btn[data-i="' + matchRight + '"]');
          if (lb) { lb.classList.add("wrong"); setTimeout(() => lb.classList.remove("wrong", "sel"), 400); }
          if (rb) { rb.classList.add("wrong"); setTimeout(() => rb.classList.remove("wrong", "sel"), 400); }
        }
        matchLeft = null; matchRight = null;
        setTimeout(() => D.exerciseArea.querySelectorAll(".match-btn").forEach(x => x.classList.remove("sel")), 400);
      }
    });
  });
}

function renderTap(ex) {
  const phraseWords = ex.phrase.split(" ");
  const allWords = [...ex.words];
  // Shuffle all words
  for (let i = allWords.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [allWords[i], allWords[j]] = [allWords[j], allWords[i]]; }

  D.exerciseArea.innerHTML = `
    <div class="placement-q">Build the phrase</div>
    <div class="tap-target" id="tapTarget"></div>
    <div class="tap-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${allWords.map((w, i) => '<button class="tap-word" data-w="' + w + '" data-i="' + i + '">' + w + '</button>').join("")}</div>`;

  tapWords = [];
  D.exerciseArea.querySelectorAll(".tap-word").forEach(b => {
    b.addEventListener("click", () => {
      sndClick(); const w = b.dataset.w;
      tapWords.push(w); b.style.visibility = "hidden";
      const target = document.getElementById("tapTarget");
      const tag = document.createElement("button");
      tag.className = "tap-word in-target"; tag.textContent = w; tag.dataset.w = w;
      tag.addEventListener("click", () => {
        sndClick();
        tapWords = tapWords.filter((x, i2) => { const ri = tapWords.indexOf(w); return i2 !== ri; });
        tag.remove(); b.style.visibility = "visible";
        if (tapWords.length < phraseWords.length) { D.checkButton.style.display = "none"; D.skipButton.style.display = "block"; }
      });
      target.appendChild(tag);
      if (tapWords.length >= phraseWords.length) {
        D.checkButton.style.display = "block"; D.skipButton.style.display = "none";
      }
    });
  });
}

function renderListen(ex) {
  D.exerciseArea.innerHTML = `
    <div class="placement-q">${ex.question}</div>
    <button class="listen-btn" id="listenBtn">🔊</button>
    <div class="opt-grid">${ex.display.map((o, i) => '<button class="opt-btn" data-i="' + i + '">' + o + '</button>').join("")}</div>`;
  document.getElementById("listenBtn").addEventListener("click", () => {
    try {
      const u = new SpeechSynthesisUtterance(ex.audio);
      u.lang = "en"; u.rate = 0.85; speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch {}
  });
  // Auto-play
  setTimeout(() => {
    try { const u = new SpeechSynthesisUtterance(ex.audio); u.lang = "en"; u.rate = 0.85; speechSynthesis.speak(u); } catch {}
  }, 300);
  D.exerciseArea.querySelectorAll(".opt-btn").forEach(b => b.addEventListener("click", () => {
    sndClick(); selOpt = parseInt(b.dataset.i);
    D.exerciseArea.querySelectorAll(".opt-btn").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel"); D.checkButton.style.display = "block"; D.skipButton.style.display = "none";
  }));
}

function checkEx(ex) {
  D.checkButton.style.display = "none"; D.skipButton.style.display = "none";
  stopTimer();
  let correct = false;

  switch (ex.type) {
    case "multiple":
    case "listen":
      correct = selOpt === ex.correct;
      highlightOpts(D.exerciseArea.querySelectorAll(".opt-btn"), selOpt, ex.correct);
      break;
    case "fillblank":
      correct = selOpt !== null && ex.options[selOpt]?.toLowerCase() === ex.answer.toLowerCase();
      highlightOpts(D.exerciseArea.querySelectorAll(".opt-btn"), selOpt, ex.options.indexOf(ex.answer));
      break;
    case "match":
      correct = selOpt === "matched";
      break;
    case "tap": {
      const target = ex.phrase.split(" ");
      correct = tapWords.length === target.length && tapWords.every((w, i) => w.toLowerCase() === target[i].toLowerCase());
      break;
    }
  }

  if (correct) {
    _correct++; sndCorrect();
    S.stats.correct++; S.stars += 2;
    // Track vocab
    const word = ex.answer || ex.options?.[ex.correct] || ex.audio || "";
    if (word) {
      const existing = S.vocab.find(v => v.word === word);
      if (existing) existing.mastery = Math.min(3, (existing.mastery || 0) + 1);
      else S.vocab.push({ word, mastery: 1, learned: Date.now(), unit: curLesson.unit });
      S.stats.wordsLearned = S.vocab.length;
    }
    addXP(10); trackDaily("xp", 10);
    trackWeak(curLesson.unit, false);
    showFB("✅ Correct! +10 XP", "ok");
  } else {
    sndWrong(); S.stats.wrong++;
    trackWeak(curLesson.unit, true);
    if (ex.type === "multiple" || ex.type === "listen" || ex.type === "fillblank") {
      const ans = ex.answer || (ex.options ? ex.options[ex.correct] : "");
      showFB("❌ " + (ans || "Wrong"), "fail");
    } else if (ex.type === "tap") {
      showFB("❌ " + ex.phrase, "fail");
    } else {
      showFB("❌ Try to match all pairs", "fail");
    }
    if (!loseHeart()) { closeLesson(); toast("No hearts left!", "err"); return; }
  }

  save();
  setTimeout(() => { curIdx++; renderEx(); }, 1300);
}

function highlightOpts(btns, sel, correctIdx) {
  btns.forEach((b, i) => {
    b.classList.add("disabled");
    if (i === correctIdx) b.classList.add("correct");
    if (i === sel && i !== correctIdx) b.classList.add("wrong");
  });
}

function showFB(msg, type) {
  D.feedbackBox.textContent = msg;
  D.feedbackBox.className = "lesson-feedback show " + type;
}

function startTimer() {
  stopTimer(); const t = getSet().timer || 0;
  if (t <= 0) return;
  timerSec = t; D.lessonTimer.textContent = timerSec + "s"; D.lessonTimer.classList.remove("urgent");
  timerInt = setInterval(() => {
    timerSec--;
    if (D.lessonTimer) D.lessonTimer.textContent = timerSec + "s";
    if (timerSec <= 5 && D.lessonTimer) D.lessonTimer.classList.add("urgent");
    if (timerSec <= 0) { stopTimer(); showFB("⏰ Time's up!", "fail"); if (!loseHeart()) { closeLesson(); } else { setTimeout(() => { curIdx++; renderEx(); }, 1000); } }
  }, 1000);
}

function finishLesson() {
  stopTimer(); const total = curLesson.exercises.length;
  const pct = total > 0 ? Math.round((_correct / total) * 100) : 0;
  const xp = _correct * 10;
  const perfect = pct >= 100;
  S.progress[curLesson.id] = { completed: true, bestScore: Math.max(pct, S.progress[curLesson.id]?.bestScore || 0), at: Date.now() };
  S.stats.lessonsDone++;
  S.stars += perfect ? 10 : 5;
  addXP(perfect ? xp + 20 : xp);
  markDay(); trackDaily("lesson", 1); if (perfect) trackDaily("perfect", 1);
  S.hearts = Math.min(5, S.hearts + 1); refreshHearts(); save();
  checkBadges(); renderWeak();
  D.lessonDialog.close();
  setTimeout(() => showCeleb("lesson", { xp: perfect ? xp + 20 : xp, stars: perfect ? 10 : 5, perfect }), 300);
}

// ── Profile ──
function renderProfile() {
  if (D.profileName) D.profileName.textContent = S.user?.name || "Learner";
  if (D.profileRole) D.profileRole.textContent = { child: "Child", parent: "Parent", teacher: "Teacher" }[S.user?.role] || "";
  if (D.statStreak) D.statStreak.textContent = S.streak;
  if (D.statStars) D.statStars.textContent = S.stars;
  if (D.statXP) D.statXP.textContent = S.stats.xp;
  if (D.statLessons) D.statLessons.textContent = S.stats.lessonsDone;
  if (D.statCorrect) D.statCorrect.textContent = S.stats.correct;
  if (D.statWords) D.statWords.textContent = S.vocab.length;
  renderBadges(); renderWeak();
}

// ── Shop ──
function renderShop() {
  if (D.shopStars) D.shopStars.textContent = S.stars;
  if (!D.shopGrid) return;
  D.shopGrid.innerHTML = SHOP.map(i => '<div class="shop-item" data-id="' + i.id + '"><span class="shop-icon">' + i.icon + '</span><div class="shop-info"><h3>' + i.name + '</h3><p>' + i.desc + '</p></div><span class="shop-cost">⭐' + i.cost + '</span></div>').join("");
  D.shopGrid.querySelectorAll(".shop-item").forEach(el => el.addEventListener("click", () => {
    const item = SHOP.find(i => i.id === el.dataset.id); if (!item) return;
    if (S.stars < item.cost) { toast("Not enough stars!", "err"); return; }
    sndClick(); S.stars -= item.cost;
    if (item.id === "streak_freeze") { S.streakFreeze = (S.streakFreeze || 0) + 1; toast("Streak Freeze active! 🧊", "ok"); }
    else if (item.id === "hearts_refill") { S.hearts = 5; S.heartsRegen = Date.now(); refreshHearts(); toast("Hearts full! ❤️", "ok"); }
    else if (item.id === "xp_boost") { toast("XP Boost 30m! ⚡", "ok"); }
    save(); renderShop();
  }));
}

// ── Leaderboard ──
function renderLeague() {
  if (!D.leagueList) return;
  const users = getUsers();
  const list = Object.values(users).map(u => ({ name: u.name, xp: u.stats?.xp || 0 }));
  list.sort((a, b) => b.xp - a.xp);
  D.leagueList.innerHTML = list.map((r, i) => '<li><span class="league-idx">#' + (i + 1) + '</span><span class="league-name">' + r.name + (r.name === S.user?.name ? ' (you)' : '') + '</span><span class="league-xp">' + r.xp + ' XP</span></li>').join("");
}

// ── Settings ──
async function askPin(pin) {
  return new Promise(r => {
    const p = prompt("Enter PIN:"); r(p === pin);
  });
}

// ── Export ──
function exportData() {
  const d = { v: VER, date: new Date().toISOString(), users: getUsers(), settings: getSet() };
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "SafariStars_backup.json"; a.click();
  URL.revokeObjectURL(url); toast("Data exported! 📤", "ok");
}

// ── Auto-Update ──
async function checkUpdate() {
  try {
    const r = await fetch("https://galaxymushi-lang.github.io/SafariStars/version.json?t=" + Date.now());
    if (!r.ok) return;
    const v = await r.json();
    if (v.version && v.version !== VER) toast("Update v" + v.version + " available!", "info");
  } catch {}
}

// ── Render All ──
function renderAll() {
  renderMap(); refreshXP(); refreshHearts(); refreshStreak();
  renderProfile(); renderShop(); renderLeague(); renderBadges(); renderDaily(); renderWeak();
}

// ── Saved Users ──
function renderSavedUsers() {
  if (!D.savedUsers) return;
  const users = getUsers();
  D.savedUsers.innerHTML = Object.keys(users).map(n => '<button>👤 ' + n + '</button>').join("");
  D.savedUsers.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { sndClick(); login(b.textContent.replace("👤 ", "").trim()); }));
}

// ═══════════════════════════════════
// INIT
// ═══════════════════════════════════
function init() {
  grab(); initAudio();
  const s = getSet(); applySet(s);

  // Migration
  const old = localStorage.getItem(K.V) || "1.0.0";
  if (old !== VER) {
    const users = getUsers();
    Object.values(users).forEach(u => {
      if (u.weakCategories === undefined) u.weakCategories = {};
      if (u.wrongWords === undefined) u.wrongWords = [];
      if (u.placed === undefined) u.placed = false;
      if (u.daily === undefined) u.daily = {};
    });
    saveUsers(users);
    localStorage.setItem(K.V, VER);
  }
  if (D.appVersion) D.appVersion.textContent = VER;

  // Auth
  D.loginForm.addEventListener("submit", e => { e.preventDefault(); const n = D.loginName.value.trim(); const r = D.loginRole.value; if (n.length < 2) return; login(n, r); });
  D.logoutBtn.addEventListener("click", logout);

  // Nav
  $$(".nav-btn").forEach(b => b.addEventListener("click", () => { sndClick(); goPage(b.dataset.page); }));

  // Settings
  D.settingsBtn.addEventListener("click", async () => {
    const set = getSet();
    if (set.pin) { const ok = await askPin(set.pin); if (!ok) return; }
    applySet(set); D.settingsDialog.showModal();
  });
  D.settingsClose.addEventListener("click", () => D.settingsDialog.close());
  D.darkModeToggle.addEventListener("change", () => { const set = getSet(); set.dark = D.darkModeToggle.checked; saveSet(set); applySet(set); });
  D.soundToggle.addEventListener("change", () => { const set = getSet(); set.sound = D.soundToggle.checked; saveSet(set); });
  D.notifToggle.addEventListener("change", () => { const set = getSet(); set.notif = D.notifToggle.checked; saveSet(set); if (set.notif && typeof Notification !== "undefined") Notification.requestPermission(); });
  D.shuffleToggle.addEventListener("change", () => { const set = getSet(); set.shuffle = D.shuffleToggle.checked; saveSet(set); });
  D.timerSetting.addEventListener("change", () => { const set = getSet(); set.timer = parseInt(D.timerSetting.value); saveSet(set); });
  D.pinToggle.addEventListener("click", () => {
    const set = getSet();
    if (set.pin) { if (confirm("Remove PIN?")) { set.pin = ""; saveSet(set); D.pinToggle.textContent = "Set"; toast("PIN removed", "info"); } }
    else { const p = prompt("Enter 4-digit PIN:"); if (p && /^\d{4}$/.test(p)) { set.pin = p; saveSet(set); D.pinToggle.textContent = "Remove"; toast("PIN set!", "ok"); } else if (p) toast("Need 4 digits", "err"); }
  });
  D.resetBtn.addEventListener("click", () => { if (confirm("Delete ALL progress?")) { S = fresh(); save(); renderAll(); toast("Reset!", "info"); } });
  D.exportBtn.addEventListener("click", exportData);

  // Daily
  D.dailyBtn.addEventListener("click", () => { renderDaily(); D.dailyDialog.showModal(); });
  D.dailyClose.addEventListener("click", () => D.dailyDialog.close());

  // Placement
  D.placementClose.addEventListener("click", () => { D.placementDialog.close(); });

  // Lesson
  D.closeLesson.addEventListener("click", closeLesson);

  // Celebration
  D.celebContinue.addEventListener("click", () => D.celebDialog.close());

  // Practice
  D.practiceBtn.addEventListener("click", () => {
    // Find weakest category and practice it
    const wc = S.weakCategories || {};
    const entries = Object.entries(wc).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    if (entries.length > 0) {
      const weakUnit = entries[0][0];
      const lessons = LESSONS.filter(l => l.unit === weakUnit);
      if (lessons.length > 0) { openLesson(lessons[0].id); }
    }
  });

  // Heart regen
  setInterval(() => { if (S.user) regenHearts(); }, 60000);

  // Auto-update
  setTimeout(checkUpdate, 3000);

  // Restore
  const saved = localStorage.getItem(K.C);
  if (saved) { try { const u = JSON.parse(saved); if (u?.name) { login(u.name); return; } } catch {} }
  renderSavedUsers();
}

document.addEventListener("DOMContentLoaded", init);
})();

(() => {
  "use strict";
  const PREFIX = "safari_stars_";
  const KEY_USERS = PREFIX + "users";
  const KEY_CURRENT = PREFIX + "currentUser";
  const KEY_VERSION = PREFIX + "version";
  const KEY_FEEDBACK = PREFIX + "feedback";
  const KEY_RECIPIENT = PREFIX + "recipient_email";
  const KEY_SETTINGS = PREFIX + "settings";

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const D = {
    authScreen: $("#authScreen"), appShell: $(".app-shell"), loginForm: $("#loginForm"),
    loginName: $("#loginName"), loginRole: $("#loginRole"), savedUsers: $("#savedUsers"),
    logoutBtn: $("#logoutButton"), topLogout: $("#topLogoutButton"),
    learnerName: $("#learnerName"), roleLabel: $("#roleLabel"), profileLevel: $("#profileLevel"),
    streakVal: $("#streakValue"), starsVal: $("#starsValue"), xpVal: $("#xpValue"),
    heartsDisplay: $("#heartsDisplay"), xpLevelBadge: $("#xpLevelBadge"),
    xpProgressText: $("#xpProgressText"), xpBarFill: $("#xpBarFill"),
    mascotMsg: $("#mascotMessage"), lessonPath: $("#lessonPath"), resetBtn: $("#resetProgress"),
    exerciseArea: $("#exerciseArea"), feedbackBox: $("#feedbackBox"),
    checkBtn: $("#checkButton"), skipBtn: $("#skipButton"), closeLesson: $("#closeLesson"),
    lessonDialog: $("#lessonDialog"), lessonUnit: $("#lessonUnit"),
    lessonTitle: $("#lessonTitle"), lessonProgress: $("#lessonProgress"),
    lessonHearts: $("#lessonHearts"), lessonTimer: $("#lessonTimer"),
    celebDialog: $("#celebrationDialog"), celebContent: $("#celebrationContent"),
    celebContinue: $("#celebrationContinue"),
    closeGuide: $("#closeGuide"), guideDialog: $("#guideDialog"),
    guideTitle: $("#guideTitle"), guideContent: $("#guideContent"),
    wordList: $("#wordList"), questList: $("#questList"),
    reportLessons: $("#reportLessons"), reportWords: $("#reportWords"),
    reportCorrect: $("#reportCorrect"), reportWeak: $("#reportWeak"),
    recommendedLesson: $("#recommendedLesson"), studentList: $("#studentList"),
    leagueList: $("#leagueList"), badgeRow: $("#badgeRow"), exportBtn: $("#exportReport"),
    dateRange: $("#reportDateRange"), masteryBars: $("#masteryBars"),
    streakCalendar: $("#streakCalendar"), shopItems: $("#shopItems"),
    toastContainer: $("#toastContainer"),
  };

  let state = {
    user: null, progress: {}, stats: { lessonsDone: 0, wordsLearned: 0, correct: 0, wrong: 0, xp: 0 },
    streak: 0, stars: 30, xp: 0, xpLevel: 1, hearts: 5, heartsLastRegen: Date.now(),
    level: 1, vocab: [], badges: [], dailyActivity: {}, streakFreeze: 0, _shownBadges: [],
    sessionStart: Date.now(),
  };

  let currentLesson = null, currentExerciseIdx = 0, selectedOption = null, matchSelected = null, tappedWords = [], fillBlankVal = "", isChecking = false;
  let timerInterval = null, timerSeconds = 0;

  const APP_VERSION = "2.1.0";
  const BADGES = [
    { id: "first_lesson", icon: "🌟", name: "First Lesson", desc: "Complete first lesson" },
    { id: "five_lessons", icon: "📚", name: "Bookworm", desc: "Complete 5 lessons" },
    { id: "ten_lessons", icon: "🎓", name: "Scholar", desc: "Complete 10 lessons" },
    { id: "streak_3", icon: "🔥", name: "On Fire", desc: "3 day streak" },
    { id: "streak_7", icon: "⚡", name: "Lightning", desc: "7 day streak" },
    { id: "words_10", icon: "📝", name: "Collector", desc: "Learn 10 words" },
    { id: "words_25", icon: "📖", name: "Storyteller", desc: "Learn 25 words" },
    { id: "perfect", icon: "💎", name: "Diamond", desc: "Perfect lesson score" },
    { id: "xp_100", icon: "🏅", name: "Rising Star", desc: "Earn 100 XP" },
    { id: "xp_500", icon: "🏆", name: "Safari Champ", desc: "Earn 500 XP" },
    { id: "all_units", icon: "🌟", name: "Safari Master", desc: "Complete all units" },
  ];
  const SHOP_ITEMS = [
    { id: "streak_freeze", name: "Streak Freeze", desc: "Protect streak 1 day", cost: 50, icon: "🧊" },
    { id: "hearts_refill", name: "Hearts Refill", desc: "Refill all hearts", cost: 30, icon: "❤️" },
    { id: "xp_boost", name: "XP Boost 30m", desc: "Double XP for 30 min", cost: 80, icon: "⚡" },
  ];
  const MASCOT_MSGS = {
    idle: ["Twende! Pick a lesson.","You can do it!","Time to learn!","Keep your streak!","New adventure!"],
    correct: ["Sawa! Great!","Excellent!","You got it!","Keep going!","Amazing!"],
    wrong: ["Almost! Try again.","Don't give up!","You'll get it!","Keep trying!"],
  };

  function pickRandom(a) { return a[Math.floor(Math.random() * a.length)]; }
  function save() {
    const users = JSON.parse(localStorage.getItem(KEY_USERS)) || {};
    if (state.user) {
      users[state.user.name] = {
        ...state.user, progress: state.progress, stats: state.stats,
        streak: state.streak, stars: state.stars, xp: state.xp, xpLevel: state.xpLevel,
        hearts: state.hearts, heartsLastRegen: state.heartsLastRegen,
        level: state.level, vocab: state.vocab, badges: state.badges,
        dailyActivity: state.dailyActivity, streakFreeze: state.streakFreeze,
      };
    }
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  }
  function getUsers() { try { return JSON.parse(localStorage.getItem(KEY_USERS)) || {}; } catch { return {}; } }
  function dateKey(d = new Date()) { return d.toISOString().slice(0, 10); }
  function todayKey() { return dateKey(); }

  // ── Settings ──
  function getSettings() {
    try { return JSON.parse(localStorage.getItem(KEY_SETTINGS)) || { timer: 30, shuffle: true, darkMode: false, highContrast: false, fontSize: 16, notifications: false, pin: "" }; }
    catch { return { timer: 30, shuffle: true, darkMode: false, highContrast: false, fontSize: 16, notifications: false, pin: "" }; }
  }
  function saveSettings(s) { localStorage.setItem(KEY_SETTINGS, JSON.stringify(s)); }

  function applySettings(s) {
    document.documentElement.style.setProperty("--font-size-base", s.fontSize + "px");
    document.documentElement.setAttribute("data-theme", s.darkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-highcontrast", s.highContrast ? "true" : "false");
    const dt = document.getElementById("darkModeToggle");
    if (dt) dt.textContent = s.darkMode ? "\u2600" : "\u263E";
    const dmt = document.getElementById("darkModeToggleSetting");
    if (dmt) dmt.checked = s.darkMode;
    const hc = document.getElementById("highContrastSetting");
    if (hc) hc.checked = s.highContrast;
    const sh = document.getElementById("shuffleToggle");
    if (sh) sh.checked = s.shuffle;
    const tim = document.getElementById("timerSetting");
    if (tim) tim.value = s.timer;
    const ntf = document.getElementById("notifToggle");
    if (ntf) ntf.checked = s.notifications;
  }

  // ── PIN Lock ──
  function checkPin(required) {
    if (!required) return true;
    const dialog = document.getElementById("pinDialog");
    const input = document.getElementById("pinInput");
    const submitBtn = document.getElementById("pinSubmitBtn");
    const closeBtn = document.getElementById("pinCloseBtn");
    return new Promise(resolve => {
      input.value = "";
      dialog.showModal();
      const handler = () => {
        if (input.value === required) { dialog.close(); resolve(true); }
        else { toast("PIN incorrect!", "error"); input.value = ""; input.focus(); }
      };
      submitBtn.onclick = handler;
      input.onkeydown = (e) => { if (e.key === "Enter") handler(); };
      closeBtn.onclick = () => { dialog.close(); resolve(false); };
      input.focus();
    });
  }

  // ── Auth ──
  function renderSavedUsers() {
    const users = getUsers();
    const names = Object.keys(users);
    if (!names.length) { D.savedUsers.innerHTML = ""; return; }
    D.savedUsers.innerHTML = "<p style='font-size:0.75rem;color:var(--text-light);margin:0.4rem 0;'>Saved accounts:</p>" +
      names.map(n => `<button class="saved-user-btn" data-user="${n}">${n}</button>`).join("");
    D.savedUsers.querySelectorAll(".saved-user-btn").forEach(b => b.addEventListener("click", () => loginAs(b.dataset.user)));
  }
  function loginAs(name) {
    const users = getUsers();
    const d = users[name];
    if (!d) return;
    Object.assign(state, {
      user: { name: d.name, role: d.role }, progress: d.progress || {},
      stats: d.stats || { lessonsDone: 0, wordsLearned: 0, correct: 0, wrong: 0, xp: d.xp || 0 },
      streak: d.streak || 0, stars: d.stars || 30, xp: d.xp || 0, xpLevel: d.xpLevel || 1,
      hearts: d.hearts ?? 5, heartsLastRegen: d.heartsLastRegen || Date.now(),
      level: d.level || 1, vocab: d.vocab || [], badges: d.badges || [],
      dailyActivity: d.dailyActivity || {}, streakFreeze: d.streakFreeze || 0,
      sessionStart: Date.now(),
    });
    enterApp();
  }
  function login(name, role) {
    state.user = { name, role };
    const existing = getUsers()[name];
    if (existing) { loginAs(name); return; }
    state.progress = {}; state.stats = { lessonsDone: 0, wordsLearned: 0, correct: 0, wrong: 0, xp: 0 };
    state.streak = 0; state.stars = 30; state.xp = 0; state.xpLevel = 1;
    state.hearts = 5; state.heartsLastRegen = Date.now(); state.level = 1;
    state.vocab = []; state.badges = []; state.dailyActivity = {}; state.streakFreeze = 0;
    state.sessionStart = Date.now();
    save(); enterApp();
  }
  function logout() {
    state.user = null; D.authScreen.style.display = ""; D.appShell.classList.remove("is-active");
    localStorage.removeItem(KEY_CURRENT); renderSavedUsers();
  }
  function enterApp() {
    D.authScreen.style.display = "none"; D.appShell.classList.add("is-active");
    regenerateHearts(); updateAll(); renderMap(); renderVocab(); renderPractice();
    renderReport(); renderLeague(); renderBadges(); renderShop();
    localStorage.setItem(KEY_CURRENT, JSON.stringify(state.user));
  }

  // ── Update ──
  function updateAll() {
    D.learnerName.textContent = state.user.name;
    D.roleLabel.textContent = state.user.role.charAt(0).toUpperCase() + state.user.role.slice(1);
    D.profileLevel.textContent = state.level;
    D.streakVal.textContent = state.streak;
    D.starsVal.textContent = state.stars;
    D.xpVal.textContent = state.xp;
    updateHearts(); updateXPBar();
  }
  function updateHearts() {
    if (!D.heartsDisplay) return;
    D.heartsDisplay.innerHTML = "";
    for (let i = 0; i < 5; i++) { const s = document.createElement("span"); s.className = "heart" + (i < state.hearts ? " full" : ""); s.textContent = "\u2665"; D.heartsDisplay.appendChild(s); }
  }
  function loseHeart() {
    if (state.hearts <= 0) return;
    state.hearts--; updateHearts(); save();
    toast("Lost a heart! " + state.hearts + " remaining.", "error");
    if (state.hearts <= 0) { toast("No hearts! Wait for refill or shop.", "error"); setTimeout(() => D.lessonDialog.close(), 1500); }
  }
  function regenerateHearts() {
    const now = Date.now();
    if (state.hearts >= 5) { state.heartsLastRegen = now; return; }
    const earned = Math.floor((now - state.heartsLastRegen) / (30 * 60 * 1000));
    if (earned > 0) { state.hearts = Math.min(5, state.hearts + earned); state.heartsLastRegen = now; save(); updateHearts(); }
  }

  // ── XP ──
  function addXP(amount) {
    const s = getSettings();
    const boosted = state.xpBoostUntil && Date.now() < state.xpBoostUntil ? 2 : 1;
    const final = amount * boosted;
    state.xp += final; state.stats.xp = (state.stats.xp || 0) + final;
    const needed = state.xpLevel * 100;
    while (state.xp >= needed) { state.xp -= needed; state.xpLevel++; toast("Level Up! Lv " + state.xpLevel + "!", "success"); }
    updateXPBar(); save(); showFloatXP(final);
  }
  function updateXPBar() {
    const needed = state.xpLevel * 100;
    const pct = Math.min(100, (state.xp / needed) * 100);
    D.xpLevelBadge.textContent = "Lv " + state.xpLevel;
    D.xpProgressText.textContent = state.xp + " / " + needed + " XP";
    D.xpBarFill.style.width = pct + "%";
    const track = document.getElementById("xpBarTrack");
    if (track) track.setAttribute("aria-valuenow", Math.round(pct));
  }
  function showFloatXP(amount) {
    const el = document.createElement("div"); el.className = "float-xp";
    el.textContent = "+" + amount + " XP"; el.style.color = "#5C6BC0";
    el.style.left = (Math.random() * 60 + 20) + "%"; el.style.top = "40%";
    document.body.appendChild(el); setTimeout(() => el.remove(), 1000);
  }

  // ── Nav ──
  function setupNav() {
    $$(".nav-button[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".nav-button[data-view]").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const v = btn.dataset.view;
        $$(".view").forEach(x => x.classList.remove("is-visible"));
        const view = $(`#${v}View`);
        if (view) view.classList.add("is-visible");
        if (v === "parent") renderReport();
        if (v === "practice") renderPractice();
        if (v === "vocab") renderVocab();
      });
    });
  }

  // ── Map ──
  function renderMap() {
    D.lessonPath.innerHTML = "";
    LESSONS.forEach((l, i) => {
      const done = state.progress[l.id]?.completed;
      const stars = state.progress[l.id]?.stars || 0;
      const unlocked = i === 0 || state.progress[LESSONS[i - 1].id]?.completed;
      const isCurrent = unlocked && !done;
      const nod = document.createElement("div");
      nod.className = `lesson-node ${done ? "completed" : ""} ${isCurrent ? "current" : ""} ${!unlocked ? "locked" : ""}`;
      nod.setAttribute("role", "listitem");
      nod.innerHTML = `<div class="node-icon ${done ? "done-bg" : isCurrent ? "current-bg" : "locked-bg"}">${l.icon}</div><div class="node-info"><strong>${l.title}</strong><span>${l.unit}</span></div><div class="node-stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>`;
      if (unlocked) nod.addEventListener("click", () => openLesson(l));
      D.lessonPath.appendChild(nod);
    });
  }

  // ── Lesson ──
  function openLesson(lesson) {
    if (state.hearts <= 0) { toast("No hearts left!", "error"); return; }
    currentLesson = lesson; currentExerciseIdx = 0; selectedOption = null; matchSelected = null; tappedWords = []; isChecking = false;
    D.lessonUnit.textContent = lesson.unit; D.lessonTitle.textContent = lesson.title;
    D.skipBtn.style.display = "none"; D.checkBtn.style.display = ""; D.checkBtn.disabled = false;
    D.checkBtn.textContent = "Check"; renderHeartsInLesson();
    const s = getSettings();
    if (s.shuffle) {
      currentLesson = { ...lesson, exercises: [...lesson.exercises].sort(() => Math.random() - 0.5) };
    }
    D.lessonDialog.showModal(); renderExercise();
  }
  function renderHeartsInLesson() {
    D.lessonHearts.innerHTML = "";
    for (let i = 0; i < 5; i++) { const s = document.createElement("span"); s.className = "heart" + (i < state.hearts ? " full" : ""); s.textContent = "\u2665"; D.lessonHearts.appendChild(s); }
  }
  function startTimer() {
    clearInterval(timerInterval);
    const s = getSettings();
    if (!s.timer || s.timer <= 0) { D.lessonTimer.textContent = ""; return; }
    timerSeconds = s.timer;
    D.lessonTimer.textContent = timerSeconds + "s";
    D.lessonTimer.classList.remove("urgent");
    timerInterval = setInterval(() => {
      timerSeconds--;
      D.lessonTimer.textContent = timerSeconds + "s";
      if (timerSeconds <= 5) D.lessonTimer.classList.add("urgent");
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        toast("Time's up!", "error");
        state.stats.wrong++; logActivity("wrong"); loseHeart();
        advanceExercise(false);
      }
    }, 1000);
  }
  function stopTimer() { clearInterval(timerInterval); D.lessonTimer.textContent = ""; D.lessonTimer.classList.remove("urgent"); }

  function renderExercise() {
    if (!currentLesson) return;
    const exs = currentLesson.exercises;
    if (currentExerciseIdx >= exs.length) { finishLesson(); return; }
    const ex = exs[currentExerciseIdx];
    D.lessonProgress.style.width = ((currentExerciseIdx) / exs.length * 100) + "%";
    D.feedbackBox.textContent = ""; D.feedbackBox.className = "feedback";
    selectedOption = null; matchSelected = null; tappedWords = []; fillBlankVal = ""; isChecking = false;
    D.checkBtn.style.display = ""; D.checkBtn.disabled = false; D.checkBtn.textContent = "Check";
    renderHeartsInLesson(); stopTimer(); startTimer();
    if (ex.type === "multiple" || ex.type === "listen") renderMultiple(ex);
    else if (ex.type === "fillblank") renderFillBlank(ex);
    else if (ex.type === "match") renderMatch(ex);
    else if (ex.type === "tap") renderTap(ex);
    else if (ex.type === "speak") renderSpeak(ex);
    else renderMultiple(ex);
  }

  function renderMultiple(ex) {
    const letters = ["A", "B", "C", "D"];
    const isListen = ex.type === "listen";
    let html = "";
    if (isListen) {
      html += `<div style="text-align:center;"><button class="listen-btn" id="listenPlayBtn">🔊</button></div>`;
    }
    html += `<div class="exercise-question">${ex.question || (isListen ? "What do you hear?" : "")}</div><div class="exercise-options">`;
    ex.options || (ex.options = ex.display || []);
    (ex.options).forEach((o, i) => { html += `<button class="option-btn" data-idx="${i}"><span class="option-letter">${letters[i]}</span>${o}</button>`; });
    html += "</div>";
    D.exerciseArea.innerHTML = html;
    if (isListen) {
      const btn = document.getElementById("listenPlayBtn");
      if (btn) {
        btn.addEventListener("click", () => { speakText(ex.audio); btn.classList.add("playing"); setTimeout(() => btn.classList.remove("playing"), 800); });
        setTimeout(() => btn.click(), 300);
      }
    }
    D.exerciseArea.querySelectorAll(".option-btn").forEach(b => {
      b.addEventListener("click", () => {
        D.exerciseArea.querySelectorAll(".option-btn").forEach(x => x.classList.remove("selected"));
        b.classList.add("selected"); selectedOption = parseInt(b.dataset.idx); D.checkBtn.disabled = false;
      });
    });
  }
  function renderFillBlank(ex) {
    let html = `<div class="fill-blank-sentence">`;
    const parts = ex.sentence.split("___");
    html += parts[0] + `<input class="fill-blank-input" id="fillInput" type="text" autocomplete="off" spellcheck="false">` + (parts[1] || "");
    html += `</div>`;
    if (ex.options) {
      html += `<div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-top:0.5rem;">`;
      [...ex.options].sort(() => Math.random() - 0.5).forEach(o => { html += `<button class="option-btn" style="min-width:60px;justify-content:center;" data-word="${o}">${o}</button>`; });
      html += `</div>`;
    }
    D.exerciseArea.innerHTML = html;
    const inp = document.getElementById("fillInput");
    if (inp) { inp.focus(); inp.addEventListener("input", () => { fillBlankVal = inp.value.trim().toLowerCase(); D.checkBtn.disabled = !fillBlankVal; }); }
    D.exerciseArea.querySelectorAll(".option-btn[data-word]").forEach(b => {
      b.addEventListener("click", () => { if (inp) { inp.value = b.dataset.word; fillBlankVal = b.dataset.word.toLowerCase(); D.checkBtn.disabled = false; } });
    });
  }
  function renderMatch(ex) {
    const left = ex.pairs.map(([a]) => a);
    const right = [...ex.pairs.map(([, b]) => b)].sort(() => Math.random() - 0.5);
    const matched = new Set();
    let html = `<p style="text-align:center;font-size:0.85rem;color:var(--text-mid);margin-bottom:0.75rem;">Tap English then Swahili to match.</p><div class="match-container"><div class="match-col">`;
    left.forEach((w, i) => { html += `<button class="match-item" data-side="left" data-idx="${i}">${w}</button>`; });
    html += `</div><div class="match-col">`;
    right.forEach((w, i) => { html += `<button class="match-item" data-side="right" data-val="${w}">${w}</button>`; });
    html += `</div></div>`;
    D.exerciseArea.innerHTML = html;
    let selLeft = null;
    D.exerciseArea.querySelectorAll(".match-item").forEach(b => {
      b.addEventListener("click", () => {
        if (b.classList.contains("matched")) return;
        if (b.dataset.side === "left") {
          D.exerciseArea.querySelectorAll(".match-item[data-side='left']").forEach(x => x.classList.remove("selected"));
          b.classList.add("selected"); selLeft = b.dataset.idx;
        } else if (selLeft !== null) {
          const eng = left[parseInt(selLeft)];
          const sw = ex.pairs.find(p => p[0] === eng)[1];
          if (b.dataset.val === sw) {
            matched.add(selLeft);
            D.exerciseArea.querySelectorAll(`.match-item[data-side="left"][data-idx="${selLeft}"]`).forEach(x => { x.classList.add("matched"); x.classList.remove("selected"); });
            b.classList.add("matched");
            if (matched.size === ex.pairs.length) { stopTimer(); D.feedbackBox.textContent = "All matched!"; D.feedbackBox.className = "feedback correct"; setTimeout(() => advanceExercise(true), 800); }
          } else { b.classList.add("wrong-match"); toast("Not a match.", "error"); setTimeout(() => b.classList.remove("wrong-match"), 500); }
          selLeft = null;
        }
      });
    });
  }
  function renderTap(ex) {
    tappedWords = [];
    const shuffled = [...ex.words].sort(() => Math.random() - 0.5);
    let html = `<p style="font-size:0.85rem;color:var(--text-mid);margin-bottom:0.5rem;">Make: <b>"${ex.phrase}"</b></p><div class="tap-answer-area" id="tapAnswer"></div><div class="tap-words">`;
    shuffled.forEach(w => { html += `<button class="tap-word" data-word="${w}">${w}</button>`; });
    html += `</div>`;
    D.exerciseArea.innerHTML = html;
    const ans = document.getElementById("tapAnswer");
    D.exerciseArea.querySelectorAll(".tap-word").forEach(b => {
      b.addEventListener("click", () => {
        if (b.classList.contains("tapped")) return;
        b.classList.add("tapped"); const s = document.createElement("span"); s.className = "tap-word tapped"; s.textContent = b.dataset.word + " "; ans.appendChild(s);
        tappedWords.push(b.dataset.word); D.checkBtn.disabled = tappedWords.length < ex.phrase.split(" ").length;
      });
    });
  }
  function renderSpeak(ex) {
    let html = `<p style="text-align:center;font-size:1rem;margin-bottom:0.5rem;">Say:</p><div style="text-align:center;font-size:1.5rem;font-weight:800;margin-bottom:1rem;color:var(--sky-blue);">${ex.expected || ex.audio}</div>
    <button class="speak-btn" id="speakBtn">🎤</button><div class="speak-result" id="speakResult"><p class="speak-transcript">Tap mic to speak</p></div>`;
    D.exerciseArea.innerHTML = html;
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SR(); r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 1;
      document.getElementById("speakBtn").addEventListener("click", () => {
        document.getElementById("speakBtn").classList.add("listening");
        document.getElementById("speakResult").querySelector(".speak-transcript").textContent = "Listening...";
        try { r.start(); } catch {}
      });
      r.onresult = (e) => {
        const t = e.results[0][0].transcript.trim().toLowerCase();
        const exp = (ex.expected || ex.audio).toLowerCase();
        const el = document.getElementById("speakResult").querySelector(".speak-transcript");
        el.textContent = "You said: " + t;
        if (t === exp || t.includes(exp)) { D.feedbackBox.textContent = "Great!"; D.feedbackBox.className = "feedback correct"; stopTimer(); advanceExercise(true); }
        else { D.feedbackBox.textContent = "Try: " + exp; D.feedbackBox.className = "feedback wrong"; document.getElementById("speakBtn").classList.remove("listening"); }
      };
      r.onerror = () => { document.getElementById("speakBtn").classList.remove("listening"); document.getElementById("speakResult").querySelector(".speak-transcript").textContent = "Try again."; };
    } else {
      document.getElementById("speakResult").innerHTML = '<p class="speak-transcript" style="font-size:0.85rem;">Speech not supported. Tap Check.</p>';
      D.checkBtn.textContent = "Continue";
    }
  }
  function speakText(text) {
    if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.85; window.speechSynthesis.speak(u); }
  }

  // ── Check ──
  function checkAnswer() {
    if (isChecking || !currentLesson) return;
    const ex = currentLesson.exercises[currentExerciseIdx];
    if (!ex) return; isChecking = true; stopTimer();
    if (ex.type === "multiple" || ex.type === "listen") checkMultiple(ex);
    else if (ex.type === "fillblank") checkFillBlank(ex);
    else if (ex.type === "tap") checkTap(ex);
    else if (ex.type === "match" || ex.type === "speak") { isChecking = false; return; }
  }
  function checkMultiple(ex) {
    if (selectedOption === null) { isChecking = false; startTimer(); return; }
    const btns = D.exerciseArea.querySelectorAll(".option-btn");
    btns.forEach(b => b.style.pointerEvents = "none"); D.checkBtn.disabled = true;
    if (selectedOption === ex.correct) {
      btns[selectedOption].classList.add("correct");
      D.feedbackBox.textContent = pickRandom(MASCOT_MSGS.correct); D.feedbackBox.className = "feedback correct";
      state.stats.correct++; logActivity("correct"); speakText((ex.options||ex.display)[ex.correct]); addXP(10);
      setTimeout(() => advanceExercise(true), 1000);
    } else {
      btns[selectedOption].classList.add("wrong"); btns[ex.correct].classList.add("correct");
      D.exerciseArea.classList.add("shake");
      D.feedbackBox.textContent = pickRandom(MASCOT_MSGS.wrong) + " Answer: " + (ex.options||ex.display)[ex.correct];
      D.feedbackBox.className = "feedback wrong"; state.stats.wrong++; logActivity("wrong"); loseHeart();
      setTimeout(() => { D.exerciseArea.classList.remove("shake"); advanceExercise(false); }, 1500);
    }
  }
  function checkFillBlank(ex) {
    const inp = document.getElementById("fillInput");
    if (!inp) { isChecking = false; return; }
    const val = inp.value.trim().toLowerCase(); D.checkBtn.disabled = true;
    if (val === ex.answer.toLowerCase()) {
      inp.classList.add("correct"); D.feedbackBox.textContent = pickRandom(MASCOT_MSGS.correct);
      D.feedbackBox.className = "feedback correct"; state.stats.correct++; logActivity("correct"); addXP(10);
      setTimeout(() => advanceExercise(true), 1000);
    } else {
      inp.classList.add("wrong"); D.feedbackBox.textContent = pickRandom(MASCOT_MSGS.wrong) + " Answer: " + ex.answer;
      D.feedbackBox.className = "feedback wrong"; state.stats.wrong++; logActivity("wrong"); loseHeart();
      setTimeout(() => { inp.classList.remove("wrong"); advanceExercise(false); }, 1500);
    }
  }
  function checkTap(ex) {
    const u = tappedWords.join(" "); D.checkBtn.disabled = true;
    if (u === ex.phrase.toLowerCase()) {
      D.feedbackBox.textContent = pickRandom(MASCOT_MSGS.correct); D.feedbackBox.className = "feedback correct";
      state.stats.correct++; logActivity("correct"); addXP(10);
      setTimeout(() => advanceExercise(true), 1000);
    } else {
      D.feedbackBox.textContent = pickRandom(MASCOT_MSGS.wrong) + " Expected: " + ex.phrase;
      D.feedbackBox.className = "feedback wrong"; state.stats.wrong++; logActivity("wrong"); loseHeart();
      setTimeout(() => advanceExercise(false), 1500);
    }
  }
  function advanceExercise(correct) {
    isChecking = false;
    currentExerciseIdx++;
    if (currentExerciseIdx >= (currentLesson?.exercises?.length || 0)) finishLesson();
    else renderExercise();
  }

  // ── Finish ──
  function finishLesson() {
    if (!currentLesson) return;
    stopTimer(); D.lessonProgress.style.width = "100%";
    const wasCompleted = !!state.progress[currentLesson.id]?.completed;
    if (!wasCompleted) {
      state.stats.lessonsDone++;
      state.progress[currentLesson.id] = { completed: true, stars: 3, lastPracticed: todayKey() };
      state.stars += 30;
      if (currentLesson.words) {
        currentLesson.words.forEach(w => { if (!state.vocab.find(v => v.en === w.en)) { state.vocab.push({ ...w, mastery: "new", addedDate: todayKey() }); state.stats.wordsLearned++; } });
      }
      addXP(50); checkBadges(); save();
      speakText("Congratulations!"); showCelebration(currentLesson.title, 50, 30);
    }
    D.exerciseArea.innerHTML = `<div style="text-align:center;padding:2rem 0;"><div style="font-size:3rem;margin-bottom:0.5rem;">🎉</div><h3>Complete!</h3><p style="color:var(--text-mid);margin:0.5rem 0;">+50 XP</p></div>`;
    D.feedbackBox.textContent = "Finished!"; D.feedbackBox.className = "feedback correct";
    D.checkBtn.style.display = "none"; D.skipBtn.style.display = "none";
    setTimeout(() => { D.lessonDialog.close(); renderMap(); updateAll(); renderReport(); }, 2500);
  }

  function showCelebration(title, xp, stars) {
    D.celebContent.innerHTML = `<div class="celebration-icon">🌟</div><h2>${title} Complete!</h2><div class="xp-earned">+${xp} XP</div><div class="stars-earned">+${stars} ⭐</div><p id="celebBadgeMsg"></p>`;
    D.celebDialog.showModal(); launchConfetti();
    const newB = [];
    BADGES.forEach(b => { if ((state.badges||[]).includes(b.id) && !(state._shownBadges||[]).includes(b.id)) { newB.push(b); if (!state._shownBadges) state._shownBadges = []; state._shownBadges.push(b.id); } });
    if (newB.length) D.celebContent.querySelector("#celebBadgeMsg").textContent = "New badge: " + newB.map(b => b.icon + " " + b.name).join(", ");
  }
  function launchConfetti() {
    const colors = ["#F5A623", "#D64541", "#4A7C59", "#3B82C4", "#6B4C9A"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div"); p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%"; p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (Math.random() * 2 + 2) + "s"; p.style.animationDelay = (Math.random() * 0.5) + "s";
      p.style.width = (Math.random() * 6 + 4) + "px"; p.style.height = (Math.random() * 6 + 4) + "px";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(p); setTimeout(() => p.remove(), 5000);
    }
  }

  // ── Vocab ──
  function renderVocab() {
    if (!state.vocab.length) { D.wordList.innerHTML = "<p style='color:var(--text-light);text-align:center;padding:2rem;'>No words yet.</p>"; return; }
    D.wordList.innerHTML = state.vocab.map(w => `<div class="word-item"><span class="word-en">${w.en}</span><span class="word-sw">${w.sw}</span><span class="mastery-badge ${w.mastery||"new"}">${(w.mastery||"new").charAt(0).toUpperCase()+(w.mastery||"new").slice(1)}</span></div>`).join("");
  }

  // ── Practice ──
  function renderPractice() {
    $$(".practice-card").forEach(c => c.onclick = () => startPractice(c.dataset.practice));
    const qs = [
      { text: "Complete 1 lesson", done: state.stats.lessonsDone >= 1 },
      { text: "Learn 5 words", done: state.stats.wordsLearned >= 5 },
      { text: "Get 10 correct", done: state.stats.correct >= 10 },
      { text: "Earn 50 XP today", done: (state.dailyActivity[todayKey()]?.xp || 0) >= 50 },
      { text: "Keep streak", done: state.streak >= 1 },
    ];
    D.questList.innerHTML = qs.map(q => `<li><span class="quest-check ${q.done ? "done" : ""}">${q.done ? "✓" : ""}</span>${q.text}</li>`).join("");
  }
  function startPractice(type) {
    if (state.hearts <= 0) { toast("No hearts!", "error"); return; }
    if (type === "mistakes") {
      const w = []; LESSONS.forEach(l => l.exercises.forEach(e => { if (Math.random() > 0.7) w.push({ lesson: l }); }));
      openLesson(w.length ? w[Math.floor(Math.random() * w.length)].lesson : LESSONS[Math.floor(Math.random() * LESSONS.length)]);
    } else if (type === "mixed") { openLesson(LESSONS[Math.floor(Math.random() * LESSONS.length)]); }
    else { openLesson(LESSONS.find(x => x.exercises.some(e => e.type === (type === "listen" ? "listen" : "multiple"))) || LESSONS[0]); }
  }

  // ── Report ──
  function renderReport() {
    D.reportLessons.textContent = state.stats.lessonsDone;
    D.reportWords.textContent = state.stats.wordsLearned;
    D.reportCorrect.textContent = state.stats.correct;
    D.reportWeak.textContent = state.stats.wrong;
    const inc = LESSONS.find(l => !state.progress[l.id]?.completed);
    D.recommendedLesson.textContent = inc ? inc.title : "All done!";
    renderStudentList(); renderMasteryBars(); renderStreakCalendar();
    drawProgressChart(); drawCategoryChart(); drawAccuracyChart(); drawStudyTimeChart();
  }
  function renderStudentList() {
    if (state.user.role === "teacher") {
      const all = Object.values(getUsers()).map(u => ({ name: u.name, lessons: u.stats?.lessonsDone || 0, words: u.stats?.wordsLearned || 0, correct: u.stats?.correct || 0 }));
      all.sort((a, b) => b.lessons - a.lessons);
      D.studentList.innerHTML = all.map(s => `<div class="student-row"><span class="student-name">${s.name}</span><span class="student-stat">${s.lessons} lessons · ${s.words} words · ${s.correct} correct</span></div>`).join("");
    } else {
      D.studentList.innerHTML = `<div class="student-row"><span class="student-name">${state.user.name}</span><span class="student-stat">${state.stats.lessonsDone} lessons · ${state.stats.wordsLearned} words · ${state.stats.correct} correct</span></div>`;
    }
  }
  function renderMasteryBars() {
    const c = { new: 0, learning: 0, mastered: 0 };
    state.vocab.forEach(w => { c[w.mastery||"new"]++; });
    const t = Math.max(state.vocab.length, 1);
    D.masteryBars.innerHTML = [
      { label: "New", count: c.new, cls: "new-fill" },
      { label: "Learning", count: c.learning, cls: "learning-fill" },
      { label: "Mastered", count: c.mastered, cls: "mastered-fill" },
    ].map(m => `<div class="mastery-row"><span class="mastery-label">${m.label}</span><div class="mastery-track"><div class="mastery-fill ${m.cls}" style="width:${(m.count/t)*100}%"></div></div><span class="mastery-count">${m.count}</span></div>`).join("");
  }
  function renderStreakCalendar() {
    const t = new Date(); const days = [];
    for (let i = 27; i >= 0; i--) { const d = new Date(t); d.setDate(d.getDate() - i); const k = dateKey(d); const a = state.dailyActivity[k]; days.push(`<div class="streak-day ${i===0?"today":a&&a.lessons?"active":"empty"}">${d.getDate()}</div>`); }
    D.streakCalendar.innerHTML = days.join("");
  }
  function logActivity(type, xp) {
    const k = todayKey();
    if (!state.dailyActivity[k]) state.dailyActivity[k] = { correct: 0, wrong: 0, lessons: 0, xp: 0 };
    if (type === "correct") state.dailyActivity[k].correct++;
    if (type === "wrong") state.dailyActivity[k].wrong++;
    if (xp) state.dailyActivity[k].xp = (state.dailyActivity[k].xp || 0) + xp;
    state.dailyActivity[k].lessons = (state.dailyActivity[k].lessons || 0) + 1;
    state.streak = Math.max(1, state.streak || 1);
    save();
  }

  // ── Charts ──
  function drawProgressChart() {
    const canvas = $("#progressChart"); if (!canvas) return;
    const ctx = canvas.getContext("2d"); const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const days = []; const today = new Date();
    for (let i = 13; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate()-i); const k = dateKey(d); const a = state.dailyActivity[k]||{}; days.push({ label: d.getDate()+"/"+(d.getMonth()+1), correct: a.correct||0, wrong: a.wrong||0 }); }
    const maxV = Math.max(...days.map(d=>d.correct+d.wrong),1);
    const pad = {top:20,right:20,bottom:35,left:35}; const cw = w-pad.left-pad.right, ch = h-pad.top-pad.bottom;
    ctx.strokeStyle="#E0D5C5"; ctx.lineWidth=0.5;
    for(let i=0;i<=4;i++){const y=pad.top+(ch/4)*i;ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(w-pad.right,y);ctx.stroke();}
    ctx.fillStyle="#8A7A6A"; ctx.font="10px sans-serif"; ctx.textAlign="center";
    days.forEach((d,i)=>ctx.fillText(d.label,pad.left+(cw/(days.length-1))*i,h-8));
    ctx.strokeStyle="#4A7C59"; ctx.lineWidth=2.5; ctx.beginPath();
    days.forEach((d,i)=>{const x=pad.left+(cw/(days.length-1))*i;const y=pad.top+ch-(d.correct/maxV)*ch;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}); ctx.stroke();
    ctx.strokeStyle="#D64541"; ctx.lineWidth=2; ctx.setLineDash([5,3]); ctx.beginPath();
    days.forEach((d,i)=>{const x=pad.left+(cw/(days.length-1))*i;const y=pad.top+ch-(d.wrong/maxV)*ch;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}); ctx.stroke(); ctx.setLineDash([]);
    days.forEach((d,i)=>{const x=pad.left+(cw/(days.length-1))*i; ctx.fillStyle="#4A7C59"; ctx.beginPath(); ctx.arc(x,pad.top+ch-(d.correct/maxV)*ch,3.5,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#D64541"; ctx.beginPath(); ctx.arc(x,pad.top+ch-(d.wrong/maxV)*ch,3,0,Math.PI*2); ctx.fill(); });
  }
  function drawCategoryChart() {
    const canvas = $("#categoryChart"); if(!canvas) return;
    const ctx=canvas.getContext("2d"); const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    const cats={}; LESSONS.forEach(l=>{const c=l.category||"vocab";if(!cats[c])cats[c]={total:0,done:0};cats[c].total++;if(state.progress[l.id]?.completed)cats[c].done++;});
    const e=Object.entries(cats); if(!e.length) return;
    const pad={top:25,right:15,bottom:45,left:35}; const cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
    const gap=cw/e.length; const bw=Math.min(gap*0.55,45); const mv=Math.max(...e.map(([,v])=>v.total),1);
    const cols=["#F5A623","#3B82C4","#4A7C59","#6B4C9A"];
    e.forEach(([n,d],i)=>{const x=pad.left+gap*i+gap/2-bw/2; ctx.fillStyle="#E0D5C5"; ctx.fillRect(x,pad.top+ch-(d.total/mv)*ch,bw,(d.total/mv)*ch); ctx.fillStyle=cols[i%cols.length]; ctx.fillRect(x,pad.top+ch-(d.done/mv)*ch,bw,(d.done/mv)*ch); ctx.fillStyle="#2C1810"; ctx.font="10px sans-serif"; ctx.textAlign="center"; ctx.fillText(n,pad.left+gap*i+gap/2,h-12); });
  }
  function drawAccuracyChart() {
    const canvas=$("#accuracyChart"); if(!canvas) return;
    const ctx=canvas.getContext("2d"); const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    const t=state.stats.correct+state.stats.wrong; const cp=t>0?state.stats.correct/t:0.5;
    const cx=w/2,cy=h/2,r=Math.min(w,h)/2-15;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+cp*Math.PI*2);ctx.closePath();ctx.fillStyle="#4A7C59";ctx.fill();
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,-Math.PI/2+cp*Math.PI*2,-Math.PI/2+Math.PI*2);ctx.closePath();ctx.fillStyle="#D64541";ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,r*0.55,0,Math.PI*2);ctx.fillStyle="white";ctx.fill();
    ctx.fillStyle="#2C1810";ctx.font="bold 22px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(Math.round(cp*100)+"%",cx,cy);
    const l=$("#accuracyLegend"); if(l) l.innerHTML=`<div class="legend-item"><span class="legend-dot" style="background:#4A7C59"></span>Correct (${state.stats.correct})</div><div class="legend-item"><span class="legend-dot" style="background:#D64541"></span>Wrong (${state.stats.wrong})</div><div class="legend-item" style="margin-top:0.5rem;font-weight:700;">Total: ${t}</div>`;
  }
  function drawStudyTimeChart() {
    const canvas=$("#studyTimeChart"); if(!canvas) return;
    const ctx=canvas.getContext("2d"); const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    const days=[]; const today=new Date();
    for(let i=13;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);const k=dateKey(d);const a=state.dailyActivity[k];const m=a?Math.min((a.correct+a.wrong)*2,60):0;days.push({label:d.getDate()+"/"+(d.getMonth()+1),minutes:m});}
    const mv=Math.max(...days.map(d=>d.minutes),10);
    const pad={top:15,right:15,bottom:35,left:35}; const cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
    const gap=cw/days.length; const bw=Math.min(gap*0.55,25);
    days.forEach((d,i)=>{const x=pad.left+gap*i+gap/2-bw/2;const bh=(d.minutes/mv)*ch;ctx.fillStyle="#F5A623";ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,pad.top+ch-bh,bw,bh,3);else ctx.fillRect(x,pad.top+ch-bh,bw,bh);ctx.fill();ctx.fillStyle="#8A7A6A";ctx.font="9px sans-serif";ctx.textAlign="center";ctx.fillText(d.label,pad.left+gap*i+gap/2,h-8);});
  }

  // ── League ──
  function renderLeague() {
    const users = getUsers();
    const list = Object.values(users).map(u => ({ name: u.name, xp: u.xp || 0, stars: u.stars || 0 }));
    list.sort((a, b) => b.xp - a.xp);
    D.leagueList.innerHTML = list.map(r => `<li><span class="league-name">${r.name}</span><span class="league-stars">${r.xp} XP</span></li>`).join("");
  }

  // ── Badges ──
  function checkBadges() {
    const e = state.badges||[];
    const checks = {
      first_lesson: state.stats.lessonsDone>=1, five_lessons: state.stats.lessonsDone>=5, ten_lessons: state.stats.lessonsDone>=10,
      streak_3: state.streak>=3, streak_7: state.streak>=7,
      words_10: state.stats.wordsLearned>=10, words_25: state.stats.wordsLearned>=25,
      perfect: Object.values(state.progress).some(p=>p.stars===3),
      xp_100: state.stats.xp>=100, xp_500: state.stats.xp>=500,
      all_units: LESSONS.every(l=>state.progress[l.id]?.completed),
    };
    Object.entries(checks).forEach(([id,met])=>{if(met&&!e.includes(id)){e.push(id);toast("Badge: "+BADGES.find(b=>b.id===id)?.icon+" "+BADGES.find(b=>b.id===id)?.name,"success");}});
    state.badges=e;
  }
  function renderBadges() {
    D.badgeRow.innerHTML = BADGES.map(b=>`<div class="badge ${(state.badges||[]).includes(b.id)?"earned":""}" title="${b.name}: ${b.desc}">${b.icon}</div>`).join("");
  }

  // ── Shop ──
  function renderShop() {
    if(!D.shopItems) return;
    D.shopItems.innerHTML = SHOP_ITEMS.map(i=>{const a=state.stars>=i.cost;return`<div class="shop-item"><div class="shop-item-info"><h4>${i.icon} ${i.name}</h4><span>${i.desc} — ${i.cost}★</span></div><button class="shop-buy-btn" data-shop="${i.id}" ${a?"":"disabled"}>${a?"Buy":"Locked"}</button></div>`;}).join("");
    D.shopItems.querySelectorAll(".shop-buy-btn").forEach(b=>b.addEventListener("click",()=>buyItem(b.dataset.shop)));
  }
  function buyItem(id) {
    const i=SHOP_ITEMS.find(x=>x.id===id);
    if(!i||state.stars<i.cost){toast("Not enough stars!","error");return;}
    state.stars-=i.cost;
    if(id==="streak_freeze"){state.streakFreeze=(state.streakFreeze||0)+1;toast("Streak Freeze bought!","success");}
    else if(id==="hearts_refill"){state.hearts=5;state.heartsLastRegen=Date.now();updateHearts();toast("Hearts refilled!","success");}
    else if(id==="xp_boost"){state.xpBoostUntil=Date.now()+30*60*1000;toast("XP Boost active 30m!","success");}
    save();updateAll();renderShop();
  }

  // ── Feedback ──
  function getRecipientEmail(){return localStorage.getItem(KEY_RECIPIENT)||"";}
  function setRecipientEmail(e){localStorage.setItem(KEY_RECIPIENT,e);updateRecipDisplay();}
  function updateRecipDisplay(){
    const el=document.getElementById("feedbackRecipientDisplay");
    if(!el)return;const e=getRecipientEmail();el.textContent=e||"(hajawekwa)";el.style.color=e?"var(--sky-blue)":"var(--lion-red)";
  }
  function submitFeedback(cat,msg,email){
    const fb=JSON.parse(localStorage.getItem(KEY_FEEDBACK))||[];
    fb.push({id:Date.now(),category:cat,message:msg,email:email||"",date:new Date().toISOString(),version:APP_VERSION,user:state.user?.name||"anon"});
    localStorage.setItem(KEY_FEEDBACK,JSON.stringify(fb));
    const r=getRecipientEmail();
    if(r){
      const n={bug:"Bug",suggestion:"Suggestion",feature:"Feature",other:"Other"};
      const s=encodeURIComponent("Safari Stars Feedback - "+(n[cat]||cat));
      const b=encodeURIComponent("Category: "+(n[cat]||cat)+"\nUser: "+(state.user?.name||"anon")+"\nRole: "+(state.user?.role||"none")+"\nVersion: "+APP_VERSION+"\nEmail: "+(email||"none")+"\n\nMessage:\n"+msg);
      window.location.href="mailto:"+r+"?subject="+s+"&body="+b;
      toast("Email client opened!", "success");
    } else toast("Feedback saved. Set email in Settings.","info");
  }
  function renderFeedbackList(){
    const c=document.getElementById("feedbackList"); if(!c)return;
    c.style.display="block";
    const fb=JSON.parse(localStorage.getItem(KEY_FEEDBACK))||[];
    if(!fb.length){c.innerHTML="<p style='text-align:center;color:var(--text-light);padding:1rem;'>No feedback.</p>";return;}
    const n={bug:"Bug",suggestion:"Suggestion",feature:"Feature",other:"Other"};
    c.innerHTML="<h4 style='margin-bottom:0.75rem;'>Feedback ("+fb.length+")</h4>"+
      fb.slice().reverse().map(f=>`<div class="feedback-item ${f.category}"><div class="fb-meta"><span class="fb-cat ${f.category}">${n[f.category]||f.category}</span><span>${f.user}</span><span>v${f.version}</span><span>${new Date(f.date).toLocaleDateString()}</span></div><div class="fb-msg">${f.message}</div>${f.email?'<div style="font-size:0.7rem;color:var(--text-light);">'+f.email+'</div>':''}<button class="fb-delete" data-id="${f.id}">Delete</button></div>`).join("")+
      '<button class="small-action" id="exportFeedbackBtn" style="margin-top:0.5rem;">Export JSON</button>';
    c.querySelectorAll(".fb-delete").forEach(b=>b.addEventListener("click",()=>{let fb2=JSON.parse(localStorage.getItem(KEY_FEEDBACK))||[];fb2=fb2.filter(f=>f.id!==parseInt(b.dataset.id));localStorage.setItem(KEY_FEEDBACK,JSON.stringify(fb2));renderFeedbackList();}));
    const eb=c.querySelector("#exportFeedbackBtn");
    if(eb)eb.addEventListener("click",()=>{const fb3=JSON.parse(localStorage.getItem(KEY_FEEDBACK))||[];if(!fb3.length){toast("Nothing to export.","info");return;}const bl=new Blob([JSON.stringify(fb3,null,2)],{type:"application/json"});const u=URL.createObjectURL(bl);const a=document.createElement("a");a.href=u;a.download="feedback_"+todayKey()+".json";a.click();URL.revokeObjectURL(u);toast("Exported!","success");});
  }

  // ── Changelog ──
  const CHANGELOG = [
    {ver:"2.1.0",date:"2026-06-15",changes:["Dark mode & high contrast","Keyboard shortcuts (1-4, M/P/W/R, D)","Exercise timer (configurable)","Shuffle exercises option","PIN lock for settings","Accessibility: font size controls, ARIA","PWA: install as app, offline support","Copy to clipboard for feedback","Local notifications reminder","12 lessons total (+4 new)","Fixed: speech fallback for unsupported browsers","Fixed: better mobile responsive","Fixed: streak tracking on activity"]},
    {ver:"2.0.0",date:"2026-06-15",changes:["XP system with levels","Hearts system (5 lives)","Shop & badges","New exercise types","Charts & analytics","Celebrations & confetti"]},
    {ver:"1.1.0",date:"2026-06-10",changes:["Analytics charts","Date filter","CSV export","Mastery bars"]},
    {ver:"1.0.0",date:"2026-06-01",changes:["Initial release","Login & 8 lessons","Adventure map","Vocabulary notebook","Basic reports"]},
  ];
  function showChangelog() {
    document.getElementById("changelogContent").innerHTML=CHANGELOG.map(e=>"<h4>v"+e.ver+" ("+e.date+")</h4><ul>"+e.changes.map(c=>"<li>"+c+"</li>").join("")+"</ul>").join("");
    document.getElementById("changelogDialog").showModal();
  }

  // ── Notifications ──
  function requestNotifPermission() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission();
  }
  function sendDailyReminder() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const s = getSettings();
    if (!s.notifications) return;
    new Notification("Safari Stars English", { body: "Time to practice! Your safari awaits. 🦁", icon: "icons/icon-192.svg" });
  }

  // ── Export / Import ──
  function exportReport() {
    const rows=[["Metric","Value"],["Student",state.user.name],["Role",state.user.role],["Level",state.level],["XP",state.xp],["Lessons",state.stats.lessonsDone],["Words",state.stats.wordsLearned],["Correct",state.stats.correct],["Wrong",state.stats.wrong],["Stars",state.stars],["Streak",state.streak],["",""],["Date","Correct","Wrong","Lessons"]];
    Object.entries(state.dailyActivity).sort().forEach(([d,a])=>rows.push([d,a.correct||0,a.wrong||0,a.lessons||0]));
    rows.push(["",""],["Vocabulary","Mastery"]);state.vocab.forEach(w=>rows.push([w.en+" = "+w.sw,w.mastery]));
    const csv=rows.map(r=>r.join(",")).join("\n");const bl=new Blob([csv],{type:"text/csv"});const u=URL.createObjectURL(bl);const a=document.createElement("a");a.href=u;a.download="safari_report_"+state.user.name+"_"+todayKey()+".csv";a.click();URL.revokeObjectURL(u);toast("Exported!","success");
  }
  function exportAllData(){
    const d={version:APP_VERSION,exportDate:new Date().toISOString(),users:getUsers(),feedback:JSON.parse(localStorage.getItem(KEY_FEEDBACK))||[],settings:getSettings()};
    const bl=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const u=URL.createObjectURL(bl);const a=document.createElement("a");a.href=u;a.download="safari_backup_"+todayKey()+".json";a.click();URL.revokeObjectURL(u);toast("Backup exported!","success");
  }

  // ── Toast ──
  function toast(msg,type){
    const t=document.createElement("div");t.className="toast toast-"+(type||"info");t.textContent=msg;
    D.toastContainer.appendChild(t);setTimeout(()=>t.remove(),3000);
  }

  // ── Reset ──
  function resetProgress(){
    if(!confirm("Delete ALL progress?")) return;
    state.progress={};state.stats={lessonsDone:0,wordsLearned:0,correct:0,wrong:0,xp:0};
    state.streak=0;state.stars=30;state.xp=0;state.xpLevel=1;
    state.hearts=5;state.heartsLastRegen=Date.now();state.level=1;
    state.vocab=[];state.badges=[];state.dailyActivity={};state.streakFreeze=0;
    save();updateAll();renderMap();renderVocab();renderReport();renderBadges();renderLeague();renderShop();
    toast("Reset!","info");
  }

  // ── Keyboard Shortcuts ──
  function setupKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (D.lessonDialog.open) {
        if (e.key === "Escape") { D.lessonDialog.close(); stopTimer(); return; }
        if (e.key === "Enter" && !D.checkBtn.disabled && D.checkBtn.style.display !== "none") { checkAnswer(); return; }
        if (["1","2","3","4"].includes(e.key)) {
          const btns = D.exerciseArea.querySelectorAll(".option-btn");
          const idx = parseInt(e.key) - 1;
          if (btns[idx]) btns[idx].click();
        }
        return;
      }
      if (D.celebDialog.open) { if (e.key === "Enter" || e.key === "Escape") { D.celebDialog.close(); } return; }
      if (D.feedbackDialog?.open) { if (e.key === "Escape") D.feedbackDialog.close(); return; }
      if (D.guideDialog?.open) { if (e.key === "Escape") D.guideDialog.close(); return; }
      const nav = { "m": "map", "p": "practice", "w": "vocab", "r": "parent" };
      if (nav[e.key.toLowerCase()]) {
        const btn = document.querySelector(`.nav-button[data-view="${nav[e.key.toLowerCase()]}"]`);
        if (btn) btn.click();
      }
      if (e.key.toLowerCase() === "d") {
        const dtBtn = document.getElementById("darkModeToggle");
        if (dtBtn) dtBtn.click();
      }
    });
  }

  // ── Auto-Update ──
  const GITHUB_USER = "galaxymushi-lang";
  const GITHUB_REPO = "SafariStars";
  const UPDATE_CHECK_URL = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}/version.json`;

  async function checkForUpdate() {
    try {
      const resp = await fetch(UPDATE_CHECK_URL + "?t=" + Date.now());
      if (!resp.ok) return;
      const remote = await resp.json();
      if (!remote.version) return;
      if (remote.version === APP_VERSION) return;
      // New version found
      localStorage.setItem("safari_stars_new_version", JSON.stringify(remote));
      showUpdateAvailable(remote);
    } catch {}
  }

  function showUpdateAvailable(remote) {
    const existing = document.getElementById("updateBanner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "updateBanner";
    banner.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:9999;background:var(--accent,#58cc02);color:#fff;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:14px;box-shadow:0 -2px 10px rgba(0,0,0,0.2);";
    banner.innerHTML = `
      <span><strong>Update ${remote.version}</strong> available! (You have ${APP_VERSION})</span>
      <div style="display:flex;gap:8px">
        <button id="updateViewBtn" style="padding:6px 16px;border:none;border-radius:6px;background:#fff;color:var(--accent,#58cc02);font-weight:bold;cursor:pointer">View Changes</button>
        <button id="updateReloadBtn" style="padding:6px 16px;border:none;border-radius:6px;background:#ff9600;color:#fff;font-weight:bold;cursor:pointer">Refresh</button>
        <button id="updateDismissBtn" style="padding:6px 12px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:#fff;cursor:pointer">✕</button>
      </div>`;
    document.body.appendChild(banner);

    document.getElementById("updateViewBtn").addEventListener("click", () => {
      const changes = remote.changelog ? remote.changelog.map(c => "<li>" + c + "</li>").join("") : "<li>Bug fixes & improvements</li>";
      const html = `<div style="text-align:left"><h3 style="margin:0 0 8px">v${remote.version} - What's New</h3><ul style="margin:0;padding-left:20px">${changes}</ul><p style="margin:12px 0 0;font-size:0.8rem">Refresh to get the latest version.</p></div>`;
      const d = document.createElement("dialog");
      d.innerHTML = `<div style="padding:20px;min-width:300px">${html}<button id="updateDialogClose" style="margin-top:12px;padding:8px 20px;border:none;border-radius:6px;background:var(--accent,#58cc02);color:#fff;font-weight:bold;cursor:pointer;width:100%">OK</button></div>`;
      document.body.appendChild(d);
      d.showModal();
      document.getElementById("updateDialogClose").addEventListener("click", () => { d.close(); d.remove(); });
    });
    document.getElementById("updateReloadBtn").addEventListener("click", () => location.reload());
    document.getElementById("updateDismissBtn").addEventListener("click", () => banner.remove());
  }

  // ── Init ──
  function init() {
    // Settings
    const s = getSettings();
    applySettings(s);

    // Version migration
    const oldVer = localStorage.getItem(KEY_VERSION) || "1.0.0";
    if (oldVer !== APP_VERSION) {
      // migrate data
      const users = getUsers();
      Object.keys(users).forEach(name => {
        const u = users[name];
        if (u.xp === undefined) u.xp = 0;
        if (u.xpLevel === undefined) u.xpLevel = 1;
        if (u.hearts === undefined) u.hearts = 5;
        if (u.heartsLastRegen === undefined) u.heartsLastRegen = Date.now();
        if (u.streakFreeze === undefined) u.streakFreeze = 0;
      });
      localStorage.setItem(KEY_USERS, JSON.stringify(users));
      localStorage.setItem(KEY_VERSION, APP_VERSION);
    }

    const verEl = document.getElementById("appVersion");
    if (verEl) verEl.textContent = APP_VERSION;

    setupNav();
    setupKeyboard();

    // PWA - Register SW
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }

    // Auth
    D.loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = D.loginName.value.trim();
      const role = D.loginRole.value;
      if (name.length < 2) return;
      login(name, role);
    });
    D.logoutBtn.addEventListener("click", logout);
    D.topLogout.addEventListener("click", logout);
    D.resetBtn.addEventListener("click", resetProgress);
    D.checkBtn.addEventListener("click", checkAnswer);
    D.skipBtn.addEventListener("click", () => { stopTimer(); currentExerciseIdx++; isChecking = false; renderExercise(); });
    D.closeLesson.addEventListener("click", () => { stopTimer(); D.lessonDialog.close(); });
    D.closeGuide.addEventListener("click", () => D.guideDialog.close());
    D.celebContinue.addEventListener("click", () => D.celebDialog.close());
    D.exportBtn.addEventListener("click", exportReport);

    // Dark mode toggle
    const dtBtn = document.getElementById("darkModeToggle");
    if (dtBtn) dtBtn.addEventListener("click", () => {
      const set = getSettings();
      set.darkMode = !set.darkMode;
      saveSettings(set);
      applySettings(set);
      toast(set.darkMode ? "Dark mode on" : "Light mode on", "info");
    });

    // Accessibility bar
    const fontDec = document.getElementById("fontDecrease");
    const fontInc = document.getElementById("fontIncrease");
    const hcToggle = document.getElementById("highContrastToggle");
    if (fontDec) fontDec.addEventListener("click", () => { const set = getSettings(); set.fontSize = Math.max(12, set.fontSize - 2); saveSettings(set); applySettings(set); });
    if (fontInc) fontInc.addEventListener("click", () => { const set = getSettings(); set.fontSize = Math.min(24, set.fontSize + 2); saveSettings(set); applySettings(set); });
    if (hcToggle) hcToggle.addEventListener("click", () => { const set = getSettings(); set.highContrast = !set.highContrast; saveSettings(set); applySettings(set); toast(set.highContrast ? "High contrast on" : "High contrast off", "info"); });

    // Feedback
    const fbOpen = document.getElementById("feedbackOpenBtn");
    const fbDialog = document.getElementById("feedbackDialog");
    const fbClose = document.getElementById("feedbackCloseBtn");
    const fbForm = document.getElementById("feedbackForm");
    const fbView = document.getElementById("feedbackViewBtn");
    const fbCopy = document.getElementById("feedbackCopyBtn");
    const fbSet = document.getElementById("feedbackSetEmailBtn");
    if (fbOpen) fbOpen.addEventListener("click", () => { updateRecipDisplay(); fbDialog.showModal(); });
    if (fbClose) fbClose.addEventListener("click", () => fbDialog.close());
    if (fbForm) fbForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const r = getRecipientEmail();
      if (!r) {
        const a = prompt("Ingiza email yako (mahali feedback itumwe):");
        if (a && a.includes("@")) { setRecipientEmail(a.trim()); toast("Email saved!", "success"); }
        else { toast("Invalid email.", "error"); return; }
      }
      const cat = document.getElementById("feedbackCategory").value;
      const msg = document.getElementById("feedbackMessage").value.trim();
      const email = document.getElementById("feedbackEmail").value.trim();
      if (!msg) return;
      submitFeedback(cat, msg, email);
      fbForm.reset();
      fbDialog.close();
    });
    if (fbCopy) fbCopy.addEventListener("click", () => {
      const msg = document.getElementById("feedbackMessage")?.value;
      if (!msg) { toast("Write a message first.", "error"); return; }
      navigator.clipboard.writeText("Safari Stars Feedback:\n" + msg).then(() => toast("Copied to clipboard!", "success")).catch(() => toast("Copy failed.", "error"));
    });
    if (fbView) fbView.addEventListener("click", renderFeedbackList);
    if (fbSet) fbSet.addEventListener("click", () => {
      const cur = getRecipientEmail();
      const e = prompt("Email yako (mahali feedback itumwe):", cur);
      if (e && e.includes("@")) { setRecipientEmail(e.trim()); toast("Email: " + e.trim(), "success"); } else if (e) toast("Invalid email.", "error");
    });
    updateRecipDisplay();

    // Settings dialog
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsDialog = document.getElementById("settingsDialog");
    const settingsClose = document.getElementById("settingsCloseBtn");
    const pinToggle = document.getElementById("pinToggle");
    const timerSetting = document.getElementById("timerSetting");
    const shuffleToggle = document.getElementById("shuffleToggle");
    const dmtSetting = document.getElementById("darkModeToggleSetting");
    const hcSetting = document.getElementById("highContrastSetting");
    const notifToggle = document.getElementById("notifToggle");
    const fontDecBtn = document.getElementById("fontDecBtn");
    const fontIncBtn = document.getElementById("fontIncBtn");
    const fontResetBtn = document.getElementById("fontResetBtn");

    if (settingsBtn) settingsBtn.addEventListener("click", async () => {
      const set = getSettings();
      if (set.pin) {
        const ok = await checkPin(set.pin);
        if (!ok) return;
      }
      // Apply current settings to form
      applySettings(set);
      settingsDialog.showModal();
    });
    if (settingsClose) settingsClose.addEventListener("click", () => settingsDialog.close());

    if (pinToggle) pinToggle.addEventListener("click", () => {
      const set = getSettings();
      if (set.pin) {
        if (confirm("Remove PIN?")) { set.pin = ""; saveSettings(set); toast("PIN removed!", "info"); pinToggle.textContent = "Set PIN"; }
      } else {
        const p = prompt("Enter a 4-digit PIN:");
        if (p && p.length === 4 && /^\d{4}$/.test(p)) { set.pin = p; saveSettings(set); toast("PIN set!", "success"); pinToggle.textContent = "Remove PIN"; } else if (p) toast("PIN must be 4 digits.", "error");
      }
    });
    const updatedSettings = getSettings();
    if (pinToggle) pinToggle.textContent = updatedSettings.pin ? "Remove PIN" : "Set PIN";

    if (timerSetting) timerSetting.addEventListener("change", () => { const set = getSettings(); set.timer = parseInt(timerSetting.value); saveSettings(set); toast("Timer set to " + set.timer + "s", "info"); });
    if (shuffleToggle) shuffleToggle.addEventListener("change", () => { const set = getSettings(); set.shuffle = shuffleToggle.checked; saveSettings(set); });
    if (dmtSetting) dmtSetting.addEventListener("change", () => { const set = getSettings(); set.darkMode = dmtSetting.checked; saveSettings(set); applySettings(set); });
    if (hcSetting) hcSetting.addEventListener("change", () => { const set = getSettings(); set.highContrast = hcSetting.checked; saveSettings(set); applySettings(set); });
    if (notifToggle) notifToggle.addEventListener("change", () => { const set = getSettings(); set.notifications = notifToggle.checked; saveSettings(set); if (set.notifications) { requestNotifPermission(); } });
    if (fontDecBtn) fontDecBtn.addEventListener("click", () => { const set = getSettings(); set.fontSize = Math.max(12, set.fontSize - 2); saveSettings(set); applySettings(set); });
    if (fontIncBtn) fontIncBtn.addEventListener("click", () => { const set = getSettings(); set.fontSize = Math.min(24, set.fontSize + 2); saveSettings(set); applySettings(set); });
    if (fontResetBtn) fontResetBtn.addEventListener("click", () => { const set = getSettings(); set.fontSize = 16; saveSettings(set); applySettings(set); toast("Font reset.", "info"); });

    // Changelog
    const clBtn = document.getElementById("changelogBtn");
    const clDialog = document.getElementById("changelogDialog");
    const clClose = document.getElementById("changelogCloseBtn");
    if (clBtn) clBtn.addEventListener("click", showChangelog);
    if (clClose) clClose.addEventListener("click", () => clDialog.close());

    // Upload
    const upInput = document.getElementById("uploadFileInput");
    const upApply = document.getElementById("uploadApplyBtn");
    const upPreview = document.getElementById("uploadPreview");
    const upExport = document.getElementById("uploadExportDataBtn");
    const upImport = document.getElementById("uploadImportDataBtn");
    const impInput = document.getElementById("importDataInput");
    const upClose = document.getElementById("uploadCloseBtn");
    const upDialog = document.getElementById("uploadDialog");
    const verBadge = document.querySelector(".version-badge");
    if (verBadge) verBadge.addEventListener("dblclick", () => upDialog.showModal());
    if (upClose) upClose.addEventListener("click", () => upDialog.close());
    if (upInput) upInput.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) { upPreview.style.display = "none"; return; }
      upPreview.style.display = "block";
      upPreview.innerHTML = "<div class='preview-item'><strong>File:</strong> " + f.name + " (" + (f.size / 1024).toFixed(1) + " KB)</div>";
      const reader = new FileReader();
      reader.onload = (ev) => { upPreview.dataset.content = ev.target.result; upPreview.dataset.ext = f.name.split(".").pop().toLowerCase(); };
      reader.readAsText(f);
    });
    if (upApply) upApply.addEventListener("click", () => {
      if (!upPreview.dataset.content) { toast("Select a file first.", "error"); return; }
      const ext = upPreview.dataset.ext;
      const name = {html:"index.html",js:"app.js",css:"styles.css",json:"data.json"}[ext] || "file";
      const blob = new Blob([upPreview.dataset.content], {type: "text/plain"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = name;
      a.click(); URL.revokeObjectURL(url);
      toast(name + " downloaded. Replace manually.", "info");
    });
    if (upExport) upExport.addEventListener("click", exportAllData);
    if (upImport) upImport.addEventListener("click", () => impInput.click());
    if (impInput) impInput.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const d = JSON.parse(ev.target.result);
          if (d.users) localStorage.setItem(KEY_USERS, JSON.stringify(d.users));
          if (d.feedback) localStorage.setItem(KEY_FEEDBACK, JSON.stringify(d.feedback));
          if (d.settings) { const s = getSettings(); Object.assign(s, d.settings); saveSettings(s); applySettings(s); }
          toast("Data imported! Refresh page.", "success");
        } catch { toast("Invalid JSON.", "error"); }
      };
      reader.readAsText(f);
    });

    // Auto-update check
    checkForUpdate();

    // Heart regen
    setInterval(() => { if (state.user) regenerateHearts(); }, 60000);

    // Notification request
    setTimeout(requestNotifPermission, 5000);

    // Show changelog on update
    if (oldVer !== APP_VERSION && oldVer !== "1.0.0") setTimeout(showChangelog, 1000);

    // Login restore
    const saved = localStorage.getItem(KEY_CURRENT);
    if (saved) {
      try { const u = JSON.parse(saved); if (u && u.name) { loginAs(u.name); return; } } catch {}
    }
    renderSavedUsers();
  }
  init();
})();

(() => {
"use strict";
const PREFIX = "ss_";
const K = { USERS:PREFIX+"users", CURRENT:PREFIX+"current", VERSION:PREFIX+"ver", SETTINGS:PREFIX+"settings" };
const APP_VERSION = "3.0.0";

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const D = {};
function initD() {
  const ids = "authScreen,appShell,loginForm,loginName,loginRole,savedUsers,lessonMap,lessonDialog,closeLesson,exerciseArea,feedbackBox,checkButton,skipButton,lessonProgress,lessonHearts,lessonTimer,celebDialog,celebContent,celebEmoji,celebTitle,celebDesc,celebEarned,celebContinue,confettiCanvas,streakDisplay,heartsDisplay,xpDisplay,levelDisplay,xpBarFill,xpProgressText,greetLine,greetSub,profileName,profileRole,statStreak,statStars,statXP,statLessons,statCorrect,statWords,badgeGrid,shopGrid,shopStars,leagueList,settingsBtn,settingsClose,settingsDialog,darkModeToggle,soundToggle,notifToggle,shuffleToggle,timerSetting,pinToggle,resetBtn,exportBtn,appVersion,dailyBtn,dailyDialog,dailyClose,dailyBody,mascotMini,logoutBtn,topLogout,celebDialog,celebContent".split(",");
  ids.forEach(id => D[id] = document.getElementById(id));
}

const MASCOT = {
  idle: ["Ready to learn? 🦁","You can do this! 💪","New adventure awaits! 🌟","Keep going, superstar! ⭐","I believe in you! ❤️"],
  correct: ["Amazing! 🎉","Great job! 👏","You're a star! ⭐","Fantastic! 🎊","Brilliant! ✨"],
  wrong: ["Almost! Try again 💪","Don't give up! 🌟","You'll get it! 🎯","Keep trying! 🔥"],
  greet: ["Karibu! 👋","Welcome back! 🌅","Ready for fun? 🎮","Let's learn! 📚"]
};

const BADGES = [
  {id:"first_lesson",icon:"🌟",name:"First Lesson",desc:"Complete 1 lesson"},
  {id:"five_lessons",icon:"📚",name:"Bookworm",desc:"Complete 5 lessons"},
  {id:"ten_lessons",icon:"🎓",name:"Scholar",desc:"Complete 10 lessons"},
  {id:"streak_3",icon:"🔥",name:"On Fire",desc:"3-day streak"},
  {id:"streak_7",icon:"⚡",name:"Lightning",desc:"7-day streak"},
  {id:"words_10",icon:"📝",name:"Collector",desc:"Learn 10 words"},
  {id:"words_25",icon:"📖",name:"Storyteller",desc:"Learn 25 words"},
  {id:"perfect",icon:"💎",name:"Diamond",desc:"Perfect lesson"},
  {id:"xp_100",icon:"🏅",name:"Rising Star",desc:"Earn 100 XP"},
  {id:"xp_500",icon:"🏆",name:"Safari Champ",desc:"Earn 500 XP"},
  {id:"all_units",icon:"🌟",name:"Safari Master",desc:"Complete all units"}
];

const SHOP = [
  {id:"streak_freeze",name:"Streak Freeze",desc:"Protect streak 1 day",cost:50,icon:"🧊"},
  {id:"hearts_refill",name:"Hearts Refill",desc:"❤️❤️❤️❤️❤️",cost:30,icon:"❤️"},
  {id:"xp_boost",name:"XP Boost 30m",desc:"Double XP",cost:80,icon:"⚡"}
];

const DAILY_GOALS = [
  {id:"lesson",icon:"📚",label:"Complete a lesson",need:1},
  {id:"xp",icon:"✨",label:"Earn 30 XP",need:30},
  {id:"perfect",icon:"💎",label:"Perfect lesson",need:1}
];

function state() {
  return {
    user:null,users:{},progress:{},stats:{lessonsDone:0,wordsLearned:0,correct:0,wrong:0,xp:0},
    streak:0,stars:30,xp:0,xpLevel:1,hearts:5,heartsLastRegen:Date.now(),
    level:1,vocab:[],badges:[],dailyActivity:{},streakFreeze:0,_shownBadges:[],daily:{}
  };
}
let S = state();

// ── Sound System ──
let audioCtx = null;
function initAudio(){ try{audioCtx=new(window.AudioContext||window.webkitAudioContext)()}catch{}}
function playTone(freq,dur,type="sine"){
  if(!audioCtx)return; try{
  const o=audioCtx.createOscillator();const g=audioCtx.createGain();
  o.type=type;o.frequency.value=freq;g.gain.value=0.15;g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur);
  o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch{}
}
function playCorrect(){playTone(523,0.1);setTimeout(()=>playTone(659,0.1),100);setTimeout(()=>playTone(784,0.2),200)}
function playWrong(){playTone(300,0.15,"sawtooth");setTimeout(()=>playTone(250,0.2,"sawtooth"),150)}
function playLevelUp(){playTone(523,0.1);setTimeout(()=>playTone(659,0.1),120);setTimeout(()=>playTone(784,0.1),240);setTimeout(()=>playTone(1047,0.3),360)}
function playClick(){playTone(800,0.05)}

// ── Storage ──
function save(){
  const u=getUsers();if(!S.user)return;
  u[S.user.name]={...S.user,progress:S.progress,stats:S.stats,streak:S.streak,stars:S.stars,xp:S.xp,xpLevel:S.xpLevel,hearts:S.hearts,heartsLastRegen:S.heartsLastRegen,level:S.level,vocab:S.vocab,badges:S.badges,dailyActivity:S.dailyActivity,streakFreeze:S.streakFreeze};
  localStorage.setItem(K.USERS,JSON.stringify(u));
}
function getUsers(){try{return JSON.parse(localStorage.getItem(K.USERS))||{}}catch{return{}}}
function getSettings(){
  try{return JSON.parse(localStorage.getItem(K.SETTINGS))||{darkMode:false,sound:true,notif:false,shuffle:false,timer:0,pin:"",fontSize:16}}catch{return{darkMode:false,sound:true,notif:false,shuffle:false,timer:0,pin:"",fontSize:16}}
}
function saveSettings(s){localStorage.setItem(K.SETTINGS,JSON.stringify(s))}
function applySettings(s){
  document.documentElement.setAttribute("data-theme",s.darkMode?"dark":"light");
  const dt=document.getElementById("darkModeToggle");if(dt)dt.checked=s.darkMode;
  const st=document.getElementById("soundToggle");if(st)st.checked=s.sound!==false;
  const nt=document.getElementById("notifToggle");if(nt)nt.checked=!!s.notif;
  const sh=document.getElementById("shuffleToggle");if(sh)sh.checked=!!s.shuffle;
  const tm=document.getElementById("timerSetting");if(tm)tm.value=String(s.timer||0);
  const pt=document.getElementById("pinToggle");if(pt)pt.textContent=s.pin?"Remove PIN":"Set PIN";
}
function dateKey(d=new Date()){return d.toISOString().slice(0,10)}
function todayKey(){return dateKey()}

// ── XP / Level ──
function xpForLevel(l){return l*100}
function addXP(amt){
  if(!S.user)return;
  const s=getSettings();const mult=s.sound===false?1:(S._xpBoost?2:1);
  const total=Math.round(amt*mult);
  S.xp+=total;S.stats.xp+=total;
  const next=xpForLevel(S.xpLevel);
  if(S.xp>=next){S.xp-=next;S.xpLevel++;playLevelUp();showCelebration("level",S.xpLevel);}
  updateXPBar();save();showFloatXP(total);
}
function updateXPBar(){
  const next=xpForLevel(S.xpLevel);
  const pct=Math.min(100,(S.xp/next)*100);
  if(D.xpBarFill)D.xpBarFill.style.width=pct+"%";
  if(D.xpProgressText)D.xpProgressText.textContent=S.xp+" / "+next+" XP";
  if(D.levelDisplay)D.levelDisplay.textContent=S.xpLevel;
  if(D.xpDisplay)D.xpDisplay.textContent="✨ "+S.stats.xp+" XP";
  if(D.statXP)D.statXP.textContent=S.stats.xp;
}
function showFloatXP(amt){
  if(!D.exerciseArea)return;
  const el=document.createElement("div");el.className="xp-float";el.textContent="+"+amt+" XP";
  const r=D.exerciseArea.getBoundingClientRect();
  el.style.left=(r.left+r.width/2-30)+"px";el.style.top=(r.top+60)+"px";
  document.body.appendChild(el);setTimeout(()=>el.remove(),1000);
}

// ── Hearts ──
function updateHearts(){
  if(D.heartsDisplay)D.heartsDisplay.textContent="❤️".repeat(S.hearts)+"🖤".repeat(5-S.hearts);
  if(D.lessonHearts)D.lessonHearts.textContent="❤️".repeat(S.hearts)+"🖤".repeat(5-S.hearts);
}
function loseHeart(){
  if(S.hearts<=0)return;S.hearts--;S.heartsLastRegen=Date.now();updateHearts();save();
  if(S.hearts<=0){closeLesson();toast("No hearts left! Refill in the shop.","error");}
}
function regenerateHearts(){
  const now=Date.now();const elapsed=now-(S.heartsLastRegen||now);
  if(S.hearts>=5)return;
  const regen=Math.floor(elapsed/300000);
  if(regen>0){S.hearts=Math.min(5,S.hearts+regen);S.heartsLastRegen=now;save();updateHearts();}
}

// ── Streak ──
function updateStreak(){
  const today=todayKey();const acts=S.dailyActivity||{};
  if(acts[today]){if(D.streakDisplay)D.streakDisplay.textContent="🔥 "+S.streak;if(D.statStreak)D.statStreak.textContent=S.streak;}
  else{if(D.streakDisplay)D.streakDisplay.textContent="🔥 "+S.streak;if(D.statStreak)D.statStreak.textContent=S.streak;}
}
function markActivity(){
  const today=todayKey();const acts=S.dailyActivity||{};
  if(!acts[today]){acts[today]=true;S.dailyActivity=acts;S.streak=(S.streak||0)+1;save();updateStreak();checkBadges();}
}
function checkStreak(){
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  const yKey=dateKey(yesterday);const acts=S.dailyActivity||{};
  if(!acts[yKey]&&!acts[todayKey()]){if(S.streakFreeze>0){S.streakFreeze--;save();}else{S.streak=0;save();}}
  updateStreak();
}

// ── Badges ──
function checkBadges(){
  const b=S.badges||[];const newBadges=[];
  const has=id=>b.some(x=>x.id===id);
  if(!has("first_lesson")&&S.stats.lessonsDone>=1)newBadges.push("first_lesson");
  if(!has("five_lessons")&&S.stats.lessonsDone>=5)newBadges.push("five_lessons");
  if(!has("ten_lessons")&&S.stats.lessonsDone>=10)newBadges.push("ten_lessons");
  if(!has("streak_3")&&S.streak>=3)newBadges.push("streak_3");
  if(!has("streak_7")&&S.streak>=7)newBadges.push("streak_7");
  if(!has("words_10")&&S.stats.wordsLearned>=10)newBadges.push("words_10");
  if(!has("words_25")&&S.stats.wordsLearned>=25)newBadges.push("words_25");
  if(!has("xp_100")&&S.stats.xp>=100)newBadges.push("xp_100");
  if(!has("xp_500")&&S.stats.xp>=500)newBadges.push("xp_500");
  const allUnits=[...new Set(LESSONS.map(l=>l.unit))];
  const doneUnits=[...new Set(Object.values(S.progress).filter(p=>p.completed).map(p=>LESSONS.find(l=>l.id===p.id)?.unit).filter(Boolean))];
  if(!has("all_units")&&doneUnits.length>=allUnits.length)newBadges.push("all_units");
  newBadges.forEach(id=>{
    const badge=BADGES.find(b=>b.id===id);if(!badge)return;
    b.push({id,earned:Date.now()});S.badges=b;save();
    setTimeout(()=>showCelebration("badge",badge),500);
  });
  renderBadges();
}
function renderBadges(){
  if(D.badgeGrid)D.badgeGrid.innerHTML=BADGES.map(b=>{
    const owned=S.badges?.some(x=>x.id===b.id);
    return `<div class="badge-item ${owned?'unlocked':'locked'}" title="${b.desc}">${b.icon}<span class="badge-label">${owned?'✓':''}${b.name}</span></div>`;
  }).join("");
}

// ── Daily Goals ──
function initDaily(){
  const today=todayKey();const d=S.daily||{};
  if(!d[today])d[today]={};
  const goals=d[today]||{};
  DAILY_GOALS.forEach(g=>{if(goals[g.id]===undefined)goals[g.id]=0;});
  d[today]=goals;S.daily=d;save();
}
function trackDaily(id,val=1){
  const today=todayKey();const d=S.daily||{};
  if(!d[today])d[today]={};
  d[today][id]=(d[today][id]||0)+val;S.daily=d;save();
}
function renderDaily(){
  if(!D.dailyBody)return;
  const today=todayKey();const d=S.daily||{};const g=d[today]||{};
  D.dailyBody.innerHTML=DAILY_GOALS.map(dg=>{
    const cur=g[dg.id]||0;const done=cur>=dg.need;
    return `<div class="daily-goal ${done?'done':''}">
      <span class="goal-icon">${dg.icon}</span>
      <div class="goal-info"><strong>${dg.label}</strong><small>${cur}/${dg.need}</small></div>
      <span class="goal-check">${done?'✅':''}</span>
    </div>`;
  }).join("");
}

// ── Auth ──
function login(name,role){
  const users=getUsers();
  if(users[name]){Object.assign(S,users[name]);S.user={name,...users[name]};}
  else{
    S=state();S.user={name,role};
    S.stats={lessonsDone:0,wordsLearned:0,correct:0,wrong:0,xp:0};
    users[name]={name,role,progress:{},stats:S.stats,streak:0,stars:30,xp:0,xpLevel:1,hearts:5,heartsLastRegen:Date.now(),level:1,vocab:[],badges:[],dailyActivity:{},streakFreeze:0};
    localStorage.setItem(K.USERS,JSON.stringify(users));
  }
  S.users=getUsers();
  localStorage.setItem(K.CURRENT,JSON.stringify({name}));
  D.authScreen.style.display="none";D.appShell.classList.add("active");
  initDaily();checkStreak();regenerateHearts();renderAll();
}
function logout(){
  save();S=state();D.authScreen.style.display="";D.appShell.classList.remove("active");
  localStorage.removeItem(K.CURRENT);renderSavedUsers();
}

// ── Navigation ──
function switchPage(id){
  $$(".page").forEach(p=>p.classList.remove("active"));
  const page=document.getElementById(id);if(page)page.classList.add("active");
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  if(id==="pageHome"){renderMap();updateStreak();}
  if(id==="pageProfile")renderProfile();
  if(id==="pageShop")renderShop();
  if(id==="pageLeaderboard")renderLeague();
}

// ── Mascot Messages ──
function setMascotMsg(type){
  const msgs=MASCOT[type]||MASCOT.idle;
  const msg=msgs[Math.floor(Math.random()*msgs.length)];
  if(D.greetLine)D.greetLine.textContent=msg;
}

// ── Toast ──
function toast(msg,type="info"){
  let c=document.querySelector(".toast-container");
  if(!c){c=document.createElement("div");c.className="toast-container";document.body.appendChild(c);}
  const t=document.createElement("div");t.className="toast "+type;t.textContent=msg;
  c.appendChild(t);setTimeout(()=>{t.remove();if(!c.children.length)c.remove()},2500);
}

// ── Celebration ──
function showCelebration(type,data){
  if(type==="level"){
    D.celebEmoji.textContent="🎉";
    D.celebTitle.textContent="Level Up!";
    D.celebDesc.textContent="You reached Level "+data+"!";
    D.celebEarned.innerHTML="<span>⭐ +50 bonus</span>";
    addXP(50);launchConfetti();
  }else if(type==="badge"){
    D.celebEmoji.textContent=data.icon;
    D.celebTitle.textContent="Badge Earned!";
    D.celebDesc.textContent=data.name+" - "+data.desc;
    D.celebEarned.innerHTML="";
    launchConfetti();
  }else if(type==="lesson"){
    const p=data||{};
    D.celebEmoji.textContent="🎊";
    D.celebTitle.textContent=p.perfect?"Perfect! 💎":"Lesson Complete!";
    D.celebDesc.textContent="You earned "+p.xp+" XP!";
    D.celebEarned.innerHTML=(p.perfect?"<span>💎 Perfect Bonus</span>":"")+"<span>✨ "+p.xp+" XP</span>"+(p.stars?"<span>⭐ "+p.stars+" stars</span>":"");
    launchConfetti();
  }
  D.celebDialog.showModal();
}

// ── Confetti ──
function launchConfetti(){
  const c=D.confettiCanvas;if(!c)return;
  c.width=window.innerWidth;c.height=window.innerHeight;
  const ctx=c.getContext("2d");const colors=["#FF6B35","#FFB800","#58CC02","#1CB0F6","#A560E8","#FF6B9D","#FF4242"];
  const particles=[];
  for(let i=0;i<80;i++)particles.push({x:Math.random()*c.width,y:-20,w:Math.random()*10+4,h:Math.random()*6+3,color:colors[Math.floor(Math.random()*colors.length)],vx:(Math.random()-0.5)*4,vy:Math.random()*3+2,rot:Math.random()*360,rv:(Math.random()-0.5)*6,opacity:1});
  let frames=0;
  function draw(){
    if(frames>120){ctx.clearRect(0,0,c.width,c.height);return;}
    ctx.clearRect(0,0,c.width,c.height);frames++;
    particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.05;p.rot+=p.rv;p.opacity-=0.006;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.globalAlpha=Math.max(0,p.opacity);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Lesson Map ──
function renderMap(){
  if(!D.lessonMap)return;
  const units=[...new Set(LESSONS.map(l=>l.unit))];
  D.lessonMap.innerHTML=LESSONS.map(l=>{
    const p=S.progress[l.id];const done=p?.completed;const score=p?.bestScore||0;
    const prevIdx=LESSONS.findIndex(x=>x.id===l.id)-1;
    const prevDone=prevIdx<0||S.progress[LESSONS[prevIdx].id]?.completed;
    const locked=!done&&!prevDone;
    return `<div class="lesson-card ${done?'completed':''} ${locked?'locked':''}" data-id="${l.id}" role="button" tabindex="0" aria-label="${l.title}">
      <span class="lesson-card-icon">${locked?'🔒':l.icon}</span>
      <div class="lesson-card-info">
        <h3>${l.title}</h3>
        <p>${l.unit}</p>
        ${done?`<div class="lesson-card-progress"><div style="width:${score}%"></div></div>`:''}
      </div>
      <span class="lesson-card-status ${done?'done':locked?'locked':''}">${done?'✅ '+(score||0)+'%':locked?'🔒':'▶️'}</span>
    </div>`;
  }).join("");
  D.lessonMap.querySelectorAll(".lesson-card:not(.locked)").forEach(el=>{
    el.addEventListener("click",()=>{playClick();openLesson(el.dataset.id);});
  });
  const doneCount=Object.values(S.progress).filter(p=>p.completed).length;
  const allUnits=[...new Set(LESSONS.map(l=>l.unit))];
  const doneUnits=[...new Set(Object.values(S.progress).filter(p=>p.completed).map(p=>LESSONS.find(l=>l.id===p.id)?.unit).filter(Boolean))];
  if(doneUnits.length>=allUnits.length&&!S.badges?.some(b=>b.id==="all_units"))checkBadges();
  setMascotMsg(doneCount===0?"greet":"idle");
}

// ── Open Lesson ──
let currentLesson=null,currentIdx=0,selectedOpt=null,matchSel=null,tappedWords=[],fillVal="",isChecking=false,exerciseOrder=[],timerInt=null,timerSec=0;

function openLesson(id){
  currentLesson=LESSONS.find(l=>l.id===id);if(!currentLesson)return;
  const s=getSettings();
  exerciseOrder=currentLesson.exercises.map((_,i)=>i);
  if(s.shuffle)for(let i=exerciseOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[exerciseOrder[i],exerciseOrder[j]]=[exerciseOrder[j],exerciseOrder[i]];}
  currentIdx=0;S._lessonCorrect=0;S._lessonTotal=0;
  D.lessonDialog.showModal();renderExercise();
}
function closeLesson(){
  stopTimer();D.lessonDialog.close();currentLesson=null;
  renderMap();updateHearts();updateStreak();renderBadges();
}

function stopTimer(){
  if(timerInt){clearInterval(timerInt);timerInt=null;}
  if(D.lessonTimer)D.lessonTimer.textContent="";
}

function renderExercise(){
  if(!currentLesson||currentIdx>=currentLesson.exercises.length){finishLesson();return;}
  const idx=exerciseOrder[currentIdx];const ex=currentLesson.exercises[idx];
  S._lessonTotal++;isChecking=false;selectedOpt=null;matchSel=null;tappedWords=[];fillVal="";
  const total=currentLesson.exercises.length;
  D.lessonProgress.textContent=(currentIdx+1)+"/"+total;
  updateHearts();
  D.checkButton.style.display="none";D.skipButton.style.display="block";D.feedbackBox.classList.remove("show","correct","wrong");
  startTimer();
  renderExerciseByType(ex);
}

function renderExerciseByType(ex){
  if(!D.exerciseArea)return;
  const q=ex.question;
  switch(ex.type){
    case "multiple":
      D.exerciseArea.innerHTML=`<div class="exercise-prompt">${q}</div><div class="options-grid">${ex.options.map((o,i)=>`<button class="option-btn" data-idx="${i}">${o}</button>`).join("")}</div>`;
      D.exerciseArea.querySelectorAll(".option-btn").forEach(b=>b.addEventListener("click",()=>{
        playClick();selectedOpt=parseInt(b.dataset.idx);
        D.exerciseArea.querySelectorAll(".option-btn").forEach(bb=>bb.classList.remove("selected"));
        b.classList.add("selected");D.checkButton.style.display="block";D.skipButton.style.display="none";
      }));
      break;
    case "fillblank":
      D.exerciseArea.innerHTML=`<div class="exercise-prompt">${q}</div><input class="fill-input" id="fillInput" placeholder="Type answer here..." autocomplete="off" />`;
      const inp=document.getElementById("fillInput");if(inp){
        inp.addEventListener("input",()=>{fillVal=inp.value.trim();D.checkButton.style.display=fillVal?"block":"none";D.skipButton.style.display=fillVal?"none":"block";});
        setTimeout(()=>inp.focus(),100);
      }
      break;
    case "match":
      D.exerciseArea.innerHTML=`<div class="exercise-prompt">${q}</div><div class="match-grid">${ex.options.map((o,i)=>`<button class="match-btn" data-idx="${i}">${o}</button>`).join("")}</div>`;
      D.exerciseArea.querySelectorAll(".match-btn").forEach(b=>b.addEventListener("click",()=>{
        playClick();matchSel=parseInt(b.dataset.idx);
        D.exerciseArea.querySelectorAll(".match-btn").forEach(bb=>bb.classList.remove("selected"));
        b.classList.add("selected");D.checkButton.style.display="block";D.skipButton.style.display="none";
      }));
      break;
    case "tap":
      D.exerciseArea.innerHTML=`<div class="exercise-prompt">${q}</div><div class="tap-grid">${ex.options.map((o,i)=>`<button class="tap-btn" data-idx="${i}">${o}</button>`).join("")}</div>`;
      const max=ex.maxSelect||ex.correct.length;
      D.exerciseArea.querySelectorAll(".tap-btn").forEach(b=>b.addEventListener("click",()=>{
        playClick();const idx=parseInt(b.dataset.idx);const ti=tappedWords.indexOf(idx);
        if(ti>=0){tappedWords.splice(ti,1);b.classList.remove("selected");}
        else if(tappedWords.length<max){tappedWords.push(idx);b.classList.add("selected");}
        D.checkButton.style.display=tappedWords.length>0?"block":"none";
        D.skipButton.style.display=tappedWords.length>0?"none":"block";
      }));
      break;
    case "listen":
      const clues=ex.clue?`<small>${ex.clue}</small>`:"";
      D.exerciseArea.innerHTML=`<div class="exercise-prompt">${q}${clues}</div><button class="listen-btn" id="listenBtn">🔊</button><div class="options-grid">${ex.options.map((o,i)=>`<button class="option-btn" data-idx="${i}">${o}</button>`).join("")}</div>`;
      const lb=document.getElementById("listenBtn");
      if(lb)lb.addEventListener("click",()=>{
        const u=new SpeechSynthesisUtterance(currentLesson.exercises[currentIdx]?.listenText||ex.options[ex.correct]);
        u.lang="en";u.rate=0.9;speechSynthesis.cancel();speechSynthesis.speak(u);
      });
      D.exerciseArea.querySelectorAll(".option-btn").forEach(b=>b.addEventListener("click",()=>{
        playClick();selectedOpt=parseInt(b.dataset.idx);
        D.exerciseArea.querySelectorAll(".option-btn").forEach(bb=>bb.classList.remove("selected"));
        b.classList.add("selected");D.checkButton.style.display="block";D.skipButton.style.display="none";
      }));
      break;
  }
  if(D.skipButton)D.skipButton.onclick=()=>{stopTimer();currentIdx++;isChecking=false;renderExercise();};
  D.checkButton.onclick=checkAnswer;
}

function startTimer(){
  stopTimer();const s=getSettings();const t=s.timer||0;
  if(t<=0){if(D.lessonTimer)D.lessonTimer.textContent="";return;}
  timerSec=t;D.lessonTimer.textContent=timerSec+"s";D.lessonTimer.classList.remove("urgent");
  timerInt=setInterval(()=>{timerSec--;if(D.lessonTimer)D.lessonTimer.textContent=timerSec+"s";if(timerSec<=5)D.lessonTimer.classList.add("urgent");if(timerSec<=0){stopTimer();handleTimeout();}},1000);
}

function handleTimeout(){
  loseHeart();const s=getSettings();playWrong();
  showFeedback("⏰ Time's up!","wrong");
  setTimeout(()=>{currentIdx++;renderExercise();},1200);
}

function checkAnswer(){
  if(isChecking)return;isChecking=true;stopTimer();
  if(!currentLesson||currentIdx>=currentLesson.exercises.length)return;
  const idx=exerciseOrder[currentIdx];const ex=currentLesson.exercises[idx];
  let correct=false;let userAns="";
  switch(ex.type){
    case "multiple":correct=selectedOpt===ex.correct;userAns=ex.options[selectedOpt];break;
    case "fillblank":{const inp=document.getElementById("fillInput");if(inp){userAns=inp.value.trim();correct=ex.acceptable?ex.acceptable.map(a=>a.toLowerCase()).includes(userAns.toLowerCase()):userAns.toLowerCase()===ex.answer.toLowerCase();if(!correct&&inp){correct=userAns.toLowerCase()===ex.answer.toLowerCase();}}break;}
    case "match":correct=matchSel===ex.correct;userAns=ex.options[matchSel];break;
    case "tap":{const correctSet=[...ex.correct];correct=tappedWords.length===correctSet.length&&tappedWords.every(v=>correctSet.includes(v));userAns=tappedWords.join(",");break;}
    case "listen":correct=selectedOpt===ex.correct;userAns=ex.options[selectedOpt];break;
  }
  if(correct){
    playCorrect();S.stats.correct++;S._lessonCorrect=(S._lessonCorrect||0)+1;S.stars+=2;
    const sfix=S.vocab?.find(v=>v.word===(ex.answer||ex.options[ex.correct]));
    if(sfix)sfix.mastery=Math.min(3,(sfix.mastery||0)+1);
    else if(ex.answer||ex.options[ex.correct]){S.vocab=S.vocab||[];S.vocab.push({word:ex.answer||ex.options[ex.correct],mastery:1,learned:Date.now()});S.stats.wordsLearned=S.vocab.length;}
    addXP(10);trackDaily("xp",10);trackDaily("lesson");
    setMascotMsg("correct");
    showFeedback("✅ Correct! +10 XP","correct");
    if(ex.feedback)D.exerciseArea.innerHTML+=`<div style="margin-top:10px;padding:10px;background:var(--bg);border-radius:var(--radius);font-size:.8rem;color:var(--text-light)">💡 ${ex.feedback}</div>`;
  }else{
    playWrong();S.stats.wrong++;loseHeart();setMascotMsg("wrong");
    const ans=ex.answer||(ex.options?ex.options[ex.correct]:"");
    showFeedback("❌ "+(ans?"Answer: "+ans:"Try again!").substring(0,80),"wrong");
    // If wrong on multiple/tap, let them retry once
    if((ex.type==="multiple"||ex.type==="tap")&&!ex._retried){ex._retried=true;isChecking=false;D.checkButton.style.display="block";D.skipButton.style.display="none";return;}
  }
  D.skipButton.style.display="none";D.checkButton.style.display="none";
  save();updateXPBar();
  setTimeout(()=>{currentIdx++;renderExercise();},1200);
}

function showFeedback(msg,type){
  D.feedbackBox.textContent=msg;D.feedbackBox.className="lesson-feedback show "+type;
}

function finishLesson(){
  stopTimer();const total=currentLesson.exercises.length;
  const correct=S._lessonCorrect||0;const pct=total>0?Math.round((correct/total)*100):0;
  const xp=correct*10+(pct>=100?20:0);
  const perfect=pct>=100;
  S.progress[currentLesson.id]={completed:true,bestScore:Math.max(pct,S.progress[currentLesson.id]?.bestScore||0),lastAttempt:Date.now()};
  S.stats.lessonsDone++;S.stars+=perfect?10:5;addXP(perfect?xp+20:xp);
  markActivity();trackDaily("lesson",1);if(perfect)trackDaily("perfect",1);
  S.hearts=Math.min(5,S.hearts+1);updateHearts();save();
  checkBadges();renderMap();
  setTimeout(()=>{
    D.lessonDialog.close();
    showCelebration("lesson",{xp:perfect?xp+20:xp,stars:perfect?10:5,perfect});
  },600);
}

// ── Profile ──
function renderProfile(){
  if(D.profileName)D.profileName.textContent=S.user?.name||"Learner";
  if(D.profileRole)D.profileRole.textContent={child:"Child / Mtoto",parent:"Parent / Mzazi",teacher:"Teacher / Mwalimu"}[S.user?.role]||S.user?.role;
  if(D.statStreak)D.statStreak.textContent=S.streak;
  if(D.statStars)D.statStars.textContent=S.stars;
  if(D.statXP)D.statXP.textContent=S.stats.xp;
  if(D.statLessons)D.statLessons.textContent=S.stats.lessonsDone;
  if(D.statCorrect)D.statCorrect.textContent=S.stats.correct;
  if(D.statWords)D.statWords.textContent=S.vocab?.length||0;
  renderBadges();
}

// ── Shop ──
function renderShop(){
  if(D.shopStars)D.shopStars.textContent=S.stars;
  if(!D.shopGrid)return;
  D.shopGrid.innerHTML=SHOP.map(item=>`<div class="shop-item" data-id="${item.id}">
    <span class="shop-item-icon">${item.icon}</span>
    <div class="shop-item-info"><h3>${item.name}</h3><p>${item.desc}</p></div>
    <span class="shop-item-cost">⭐${item.cost}</span>
  </div>`).join("");
  D.shopGrid.querySelectorAll(".shop-item").forEach(el=>{
    el.addEventListener("click",()=>{
      const id=el.dataset.id;const item=SHOP.find(i=>i.id===id);if(!item)return;
      if(S.stars<item.cost){toast("Not enough stars! ⭐","error");return;}
      playClick();S.stars-=item.cost;
      if(id==="streak_freeze"){S.streakFreeze=(S.streakFreeze||0)+1;toast("Streak Freeze activated! 🧊","success");}
      else if(id==="hearts_refill"){S.hearts=5;S.heartsLastRegen=Date.now();updateHearts();toast("Hearts refilled! ❤️","success");}
      else if(id==="xp_boost"){S._xpBoost=true;setTimeout(()=>{S._xpBoost=false;toast("XP Boost ended","info");},1800000);toast("XP Boost 30m active! ⚡","success");}
      save();renderShop();renderMap();
    });
  });
}

// ── Leaderboard ──
function renderLeague(){
  if(!D.leagueList)return;
  const users=getUsers();const list=Object.values(users).map(u=>({name:u.name,xp:u.stats?.xp||0,lessons:u.stats?.lessonsDone||0}));
  list.sort((a,b)=>b.xp-a.xp);
  D.leagueList.innerHTML=list.map((r,i)=>`<li><span class="league-idx">#${i+1}</span><span class="league-name">${r.name}${r.name===S.user?.name?' (you)':''}</span><span class="league-xp">${r.xp} XP</span></li>`).join("");
}

// ── Settings ──
async function checkPin(pin){
  return new Promise(r=>{
    const p=prompt("Enter PIN:");
    if(p===pin){r(true)}else{if(p!==null)toast("Wrong PIN!","error");r(false)}
  });
}

// ── Export ──
function exportAllData(){
  const d={version:APP_VERSION,date:new Date().toISOString(),users:getUsers(),settings:getSettings()};
  const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="SafariStars_backup.json";
  a.click();URL.revokeObjectURL(url);toast("Data exported! 📤","success");
}

// ── Auto-Update ──
const GH_USER="galaxymushi-lang";const GH_REPO="SafariStars";
const UPDATE_URL=`https://${GH_USER}.github.io/${GH_REPO}/version.json`;
async function checkUpdate(){
  try{
    const r=await fetch(UPDATE_URL+"?t="+Date.now());if(!r.ok)return;
    const v=await r.json();if(!v.version||v.version===APP_VERSION)return;
    localStorage.setItem(PREFIX+"update",JSON.stringify(v));
    toast("Update v"+v.version+" available! Refresh to get it.","info");
  }catch{}
}

// ── Render All ──
function renderAll(){
  renderMap();updateXPBar();updateHearts();updateStreak();renderProfile();renderShop();renderLeague();renderBadges();renderDaily();
}

// ── Init ──
function init(){
  initD();initAudio();
  const s=getSettings();applySettings(s);

  // Version migration
  const oldVer=localStorage.getItem(K.VERSION)||"1.0.0";
  if(oldVer!==APP_VERSION){
    const users=getUsers();
    Object.values(users).forEach(u=>{if(u.xp===undefined)u.xp=0;if(u.xpLevel===undefined)u.xpLevel=1;if(u.hearts===undefined)u.hearts=5;if(u.streakFreeze===undefined)u.streakFreeze=0;});
    localStorage.setItem(K.USERS,JSON.stringify(users));
    localStorage.setItem(K.VERSION,APP_VERSION);
  }
  if(D.appVersion)D.appVersion.textContent=APP_VERSION;

  // Auth
  D.loginForm.addEventListener("submit",e=>{e.preventDefault();const n=D.loginName.value.trim();const r=D.loginRole.value;if(n.length<2)return;login(n,r);});
  D.logoutBtn.addEventListener("click",logout);

  // Navigation
  $$(".nav-btn").forEach(b=>b.addEventListener("click",()=>{playClick();switchPage(b.dataset.page);}));

  // Shop
  renderShop();

  // Daily
  D.dailyBtn.addEventListener("click",()=>{renderDaily();D.dailyDialog.showModal();});
  D.dailyClose.addEventListener("click",()=>D.dailyDialog.close());

  // Lesson
  D.closeLesson.addEventListener("click",closeLesson);

  // Celebration
  D.celebContinue.addEventListener("click",()=>D.celebDialog.close());

  // Settings
  D.settingsBtn.addEventListener("click",async()=>{
    const set=getSettings();
    if(set.pin){const ok=await checkPin(set.pin);if(!ok)return;}
    applySettings(set);D.settingsDialog.showModal();
  });
  D.settingsClose.addEventListener("click",()=>D.settingsDialog.close());
  D.darkModeToggle.addEventListener("change",()=>{const set=getSettings();set.darkMode=D.darkModeToggle.checked;saveSettings(set);applySettings(set);});
  D.soundToggle.addEventListener("change",()=>{const set=getSettings();set.sound=D.soundToggle.checked;saveSettings(set);});
  D.notifToggle.addEventListener("change",()=>{const set=getSettings();set.notif=D.notifToggle.checked;saveSettings(set);if(set.notif)Notification.requestPermission();});
  D.shuffleToggle.addEventListener("change",()=>{const set=getSettings();set.shuffle=D.shuffleToggle.checked;saveSettings(set);});
  D.timerSetting.addEventListener("change",()=>{const set=getSettings();set.timer=parseInt(D.timerSetting.value);saveSettings(set);toast("Timer: "+set.timer+"s","info");});
  D.pinToggle.addEventListener("click",()=>{const set=getSettings();if(set.pin){if(confirm("Remove PIN?")){set.pin="";saveSettings(set);D.pinToggle.textContent="Set PIN";toast("PIN removed!","info");}}else{const p=prompt("Enter 4-digit PIN:");if(p&&/^\d{4}$/.test(p)){set.pin=p;saveSettings(set);D.pinToggle.textContent="Remove PIN";toast("PIN set!","success");}else if(p)toast("PIN: 4 digits","error");}});
  D.resetBtn.addEventListener("click",()=>{if(confirm("Delete all progress?")){S=state();save();renderAll();toast("Progress reset!","info");}});
  D.exportBtn.addEventListener("click",exportAllData);

  // Heart regen
  setInterval(()=>{if(S.user)regenerateHearts()},60000);

  // Check update
  setTimeout(checkUpdate,3000);

  // Restore login
  const saved=localStorage.getItem(K.CURRENT);
  if(saved){try{const u=JSON.parse(saved);if(u&&u.name){login(u.name);renderAll();return}}catch{}}
  renderSavedUsers();
}

function renderSavedUsers(){
  if(!D.savedUsers)return;
  const users=getUsers();
  D.savedUsers.innerHTML=Object.keys(users).map(n=>`<button class="saved-user-btn">👤 ${n}</button>`).join("");
  D.savedUsers.querySelectorAll(".saved-user-btn").forEach(b=>{
    b.addEventListener("click",()=>{playClick();login(b.textContent.replace("👤 ","").trim());renderAll();});
  });
}

document.addEventListener("DOMContentLoaded",init);
})();

(() => {
"use strict";
const P = "ss4_";
const K = { U: P+"users", C: P+"cur", V: P+"ver", S: P+"set", W: P+"weak", PL: P+"placed" };
const VER = "5.0.0";
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const M = document.getElementById("mainArea");

const MSG = {
  idle: ["Ready?","Let's go!","Your turn!","Nice to see you!","Time to learn!"],
  correct: ["Correct!","Nice one!","You got it!","Exactly!","Right on!","Well done!"],
  wrong: ["Not quite","Almost!","Try again","Close one!","Keep trying"],
  greet: ["Welcome back!","Hey there!","Good to see you!","Let's go!","Ready?"]
};

const BADGES = [
  {id:"first_word",icon:"🐣",name:"First Steps",desc:"Learn your first word"},
  {id:"five_lessons",icon:"📚",name:"Bookworm",desc:"Complete 5 lessons"},
  {id:"ten_lessons",icon:"🎓",name:"Scholar",desc:"Complete 10 lessons"},
  {id:"twenty_lessons",icon:"🏅",name:"Honor Roll",desc:"Complete 20 lessons"},
  {id:"streak_3",icon:"🔥",name:"On Fire",desc:"3-day streak"},
  {id:"streak_7",icon:"💎",name:"Week Warrior",desc:"7-day streak"},
  {id:"streak_30",icon:"👑",name:"Unstoppable",desc:"30-day streak"},
  {id:"words_10",icon:"📝",name:"Word Collector",desc:"Learn 10 words"},
  {id:"words_25",icon:"📖",name:"Storyteller",desc:"Learn 25 words"},
  {id:"words_50",icon:"🏆",name:"Vocabulary Master",desc:"Learn 50 words"},
  {id:"perfect_3",icon:"⭐",name:"Rising Star",desc:"3 perfect lessons"},
  {id:"perfect_10",icon:"🌟",name:"Superstar",desc:"10 perfect lessons"},
  {id:"xp_100",icon:"🚀",name:"Level Up",desc:"Earn 100 XP"},
  {id:"xp_500",icon:"🎖️",name:"Veteran",desc:"Earn 500 XP"},
  {id:"xp_1000",icon:"🌍",name:"Globe Trotter",desc:"Earn 1000 XP"},
  {id:"no_wrong",icon:"💎",name:"Diamond",desc:"Complete with 0 mistakes"},
  {id:"speed_demon",icon:"⚡",name:"Speed Demon",desc:"Finish under 2 minutes"},
  {id:"night_owl",icon:"🦉",name:"Night Owl",desc:"Study after 9 PM"},
  {id:"early_bird",icon:"🌅",name:"Early Bird",desc:"Study before 8 AM"},
  {id:"all_units",icon:"🎯",name:"Safari Master",desc:"Complete all units"}
];

const SHOP = [
  {id:"streak_freeze",name:"Streak Freeze",desc:"Protect streak 1 day",cost:50,icon:"🧊"},
  {id:"hearts_refill",name:"Heart Refill",desc:"Refill all hearts",cost:30,icon:"❤️"},
  {id:"xp_boost",name:"XP Boost",desc:"Double XP 30 min",cost:80,icon:"⚡"}
];

const DAILY = [
  {id:"lesson",icon:"📚",label:"Complete 1 lesson",need:1},
  {id:"xp",icon:"✨",label:"Earn 30 XP",need:30},
  {id:"perfect",icon:"💎",label:"Get a perfect score",need:1}
];

function fresh() {
  return { user:null, progress:{}, stats:{lessonsDone:0,wordsLearned:0,correct:0,wrong:0,xp:0},
    streak:0, stars:30, xp:0, xpLevel:1, hearts:5, heartsRegen:Date.now(),
    vocab:[], badges:[], dailyActivity:{}, streakFreeze:0,
    daily:{}, weakCategories:{}, wrongWords:[], placed:false };
}
let S = fresh();

// ── Sound ──
let ctx = null;
function initAudio() { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} }
function tone(f,d,type="sine",vol=0.12) { if(!ctx)return; try{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+d);}catch{} }
function sndCorrect() { tone(523,.08);setTimeout(()=>tone(659,.08),80);setTimeout(()=>tone(784,.15),160); }
function sndWrong() { tone(300,.12,"sawtooth");setTimeout(()=>tone(250,.15,"sawtooth"),120); }
function sndLevelUp() { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.12),i*100)); }
function sndClick() { tone(880,.03); }
function sndBadge() { [784,988,1175,1319].forEach((f,i)=>setTimeout(()=>tone(f,.1),i*80)); }

// ── Storage ──
function getUsers() { try{return JSON.parse(localStorage.getItem(K.U))||{};}catch{return{};} }
function saveUsers(u) { localStorage.setItem(K.U,JSON.stringify(u)); }
function getSet() { try{return JSON.parse(localStorage.getItem(K.S))||{dark:false,sound:true,notif:false,shuffle:false,timer:0,pin:""};}catch{return{dark:false,sound:true,notif:false,shuffle:false,timer:0,pin:""};} }
function saveSet(s) { localStorage.setItem(K.S,JSON.stringify(s)); }
function applySet(s) {
  document.documentElement.setAttribute("data-theme",s.dark?"dark":"light");
}
function save() {
  if(!S.user)return;
  const u=getUsers(); u[S.user.name]={name:S.user.name,role:S.user.role,progress:S.progress,stats:S.stats,
    streak:S.streak,stars:S.stars,xp:S.xp,xpLevel:S.xpLevel,hearts:S.hearts,heartsRegen:S.heartsRegen,
    vocab:S.vocab,badges:S.badges,dailyActivity:S.dailyActivity,streakFreeze:S.streakFreeze,
    daily:S.daily,weakCategories:S.weakCategories,wrongWords:S.wrongWords,placed:S.placed};
  saveUsers(u);
}
function dateKey(d=new Date()){return d.toISOString().slice(0,10);}

// ── XP ──
function xpNeed(l){return l*100;}
function addXP(amt){if(!S.user)return;S.xp+=amt;S.stats.xp+=amt;while(S.xp>=xpNeed(S.xpLevel)){S.xp-=xpNeed(S.xpLevel);S.xpLevel++;sndLevelUp();}save();refreshXP();}
function refreshXP(){
  const n=xpNeed(S.xpLevel),p=Math.min(100,(S.xp/n)*100);
  const bar=document.getElementById("xpBarFill"),txt=document.getElementById("xpProgressText"),lv=document.getElementById("levelDisplay"),xp=document.getElementById("xpDisplay");
  if(bar)bar.style.width=p+"%";if(txt)txt.textContent=S.xp+"/"+n;if(lv)lv.textContent=S.xpLevel;if(xp)xp.textContent=S.stats.xp;
}

// ── Hearts ──
function refreshHearts(){const h=document.getElementById("heartsDisplay");if(h)h.textContent=S.hearts;}
function loseHeart(){if(S.hearts<=0)return false;S.hearts--;S.heartsRegen=Date.now();refreshHearts();save();return S.hearts>0;}
function regenHearts(){if(S.hearts>=5||!S.user)return;const e=Date.now()-(S.heartsRegen||Date.now()),a=Math.floor(e/300000);if(a>0){S.hearts=Math.min(5,S.hearts+a);S.heartsRegen=Date.now();save();refreshHearts();}}

// ── Streak ──
function refreshStreak(){const s=document.getElementById("streakDisplay");if(s)s.textContent=S.streak;}
function markDay(){const t=dateKey();if(!S.dailyActivity[t]){S.dailyActivity[t]=true;const y=dateKey(new Date(Date.now()-86400000));S.streak=(S.dailyActivity[y]?S.streak:0)+1;save();refreshStreak();}}
function checkStreak(){const y=dateKey(new Date(Date.now()-86400000));if(!S.dailyActivity[y]&&!S.dailyActivity[dateKey()]){if(S.streakFreeze>0){S.streakFreeze--;save();}else{S.streak=0;save();}}refreshStreak();}

// ── Badges ──
function checkBadges(){
  const owned=S.badges||[],has=id=>owned.some(b=>b.id===id),earn=[];
  if(!has("first_word")&&S.vocab.length>=1)earn.push("first_word");
  if(!has("words_10")&&S.vocab.length>=10)earn.push("words_10");
  if(!has("words_25")&&S.vocab.length>=25)earn.push("words_25");
  if(!has("words_50")&&S.vocab.length>=50)earn.push("words_50");
  if(!has("five_lessons")&&S.stats.lessonsDone>=5)earn.push("five_lessons");
  if(!has("ten_lessons")&&S.stats.lessonsDone>=10)earn.push("ten_lessons");
  if(!has("twenty_lessons")&&S.stats.lessonsDone>=20)earn.push("twenty_lessons");
  if(!has("streak_3")&&S.streak>=3)earn.push("streak_3");
  if(!has("streak_7")&&S.streak>=7)earn.push("streak_7");
  if(!has("streak_30")&&S.streak>=30)earn.push("streak_30");
  if(!has("xp_100")&&S.stats.xp>=100)earn.push("xp_100");
  if(!has("xp_500")&&S.stats.xp>=500)earn.push("xp_500");
  if(!has("xp_1000")&&S.stats.xp>=1000)earn.push("xp_1000");
  if(!has("perfect_3")&&S.stats.lessonsDone>=3&&(S.stats.correct/Math.max(1,S.stats.correct+S.stats.wrong))>=0.95)earn.push("perfect_3");
  const h=new Date().getHours();
  if(!has("night_owl")&&h>=21&&S.stats.lessonsDone>0)earn.push("night_owl");
  if(!has("early_bird")&&h<8&&S.stats.lessonsDone>0)earn.push("early_bird");
  earn.forEach(id=>{const b=BADGES.find(x=>x.id===id);if(b){owned.push({id,at:Date.now()});sndBadge();toast(b.icon+" "+b.name+" unlocked!","ok");}});
  S.badges=owned;save();
}
function renderBadges(){
  const g=document.getElementById("badgeGrid");if(!g)return;
  g.innerHTML=BADGES.map(b=>{const ok=(S.badges||[]).some(x=>x.id===b.id);return`<div class="badge-item ${ok?'unlocked':'locked'}" title="${b.desc}"><span class="badge-icon">${b.icon}</span><span class="badge-lbl">${b.name}</span></div>`;}).join("");
}

// ── Weak Areas ──
function trackWeak(unit,wrong){if(!S.weakCategories)S.weakCategories={};S.weakCategories[unit]=(S.weakCategories[unit]||0)+(wrong?1:0);save();}
function renderWeak(){
  const w=document.getElementById("weaknessList");if(!w)return;
  const wc=S.weakCategories||{},entries=Object.entries(wc).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  if(entries.length===0){w.innerHTML='<div class="no-weak">No weak areas yet!</div>';return;}
  w.innerHTML=entries.map(([u,c])=>{const s=u.replace(/Unit \d+ - /,"");return`<div class="weak-item"><div class="weak-dot"></div><div class="weak-info"><strong>${s}</strong><small>${c} wrong</small></div></div>`;}).join("");
}

// ── Daily ──
function initDaily(){const t=dateKey();if(!S.daily)S.daily={};if(!S.daily[t])S.daily[t]={};DAILY.forEach(g=>{if(S.daily[t][g.id]===undefined)S.daily[t][g.id]=0;});save();}
function trackDaily(id,n=1){const t=dateKey();if(!S.daily)S.daily={};if(!S.daily[t])S.daily[t]={};S.daily[t][id]=(S.daily[t][id]||0)+n;save();}

// ── Toast ──
function toast(msg,type="info"){const t=document.createElement("div");t.className="toast "+type;t.textContent=msg;document.getElementById("toastWrap").appendChild(t);setTimeout(()=>{t.style.opacity="0";t.style.transition="opacity .3s";setTimeout(()=>t.remove(),300);},2200);}

// ── Navigation ──
let currentPage="home";
function showPage(page){
  currentPage=page;
  if(page==="home")renderHome();
  else if(page==="profile")renderProfile();
  else if(page==="shop")renderShop();
  else if(page==="leaderboard")renderLeague();
  else if(page==="settings")renderSettings();
  else if(page==="daily")renderDailyPage();
}

// ═══════════════════════════════════
// HOME
// ═══════════════════════════════════
function renderHome(){
  const greet=["Welcome back!","Hey there!","Good to see you!","Let's go!","Ready?"][Math.floor(Math.random()*5)];
  const done=Object.values(S.progress).filter(p=>p.completed).length;
  const wc=S.weakCategories||{},we=Object.entries(wc).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  const practiceHTML=we.length>0?`<div class="practice-bar" id="practiceBanner"><div><b>Practice Weak Areas</b><br><small style="opacity:.85">${we[0][0].replace(/Unit \d+ - /,"")}</small></div><button class="btn btn-sm btn-blue" id="practiceBtn">Start</button></div>`:"";

  const units=[...new Set(LESSONS.map(l=>l.unit))];
  let mapHTML="";
  units.forEach(unit=>{
    const lessons=LESSONS.filter(l=>l.unit===unit);
    mapHTML+=`<div class="unit-label">${unit}</div>`;
    lessons.forEach(l=>{
      const p=S.progress[l.id],done=p?.completed,score=p?.bestScore||0;
      const li=LESSONS.findIndex(x=>x.id===l.id);
      const prevDone=li===0||S.progress[LESSONS[li-1].id]?.completed;
      const isUnlocked=S.progress[l.id]?.unlocked;
      const locked=!done&&!prevDone&&!isUnlocked;
      const ic=unit.includes("Greetings")?"g":unit.includes("Basics")?"b":unit.includes("People")?"p":unit.includes("Nature")?"o":unit.includes("Time")?"r":"pk";
      mapHTML+=`<div class="lcard ${done?'done':''} ${locked?'locked':''}" data-id="${l.id}"><div class="lc-ic"><div class="lc-dot ${ic}"></div></div><div class="lc-info"><h3>${l.title}</h3><p>${l.exercises.length} exercises</p>${done?'<div class="lc-pg"><div style="width:'+score+'%"></div></div>':''}</div><span class="lc-st ${done?'done':(score>0?'pct':'')}">${done?score+'%':locked?'🔒':'▶'}</span></div>`;
    });
  });

  M.innerHTML=`
    <div class="mascot-row"><div class="mascot-face">🦁</div><div class="mascot-speech"><b>${greet}</b><p class="muted">Choose a lesson below!</p></div></div>
    <div class="xp-row"><span class="xp-label">Lv.<b id="levelDisplay">${S.xpLevel}</b></span><div class="xp-track"><div class="xp-bar" id="xpBarFill" style="width:${Math.min(100,(S.xp/xpNeed(S.xpLevel))*100)}%"></div></div><span class="xp-num" id="xpProgressText">${S.xp}/${xpNeed(S.xpLevel)}</span><button class="hdr-btn" id="dailyBtn"><i class="i-target"></i></button></div>
    ${practiceHTML}
    <div class="map">${mapHTML}</div>
    <div class="home-nav">
      <button class="home-nav-btn" data-page="profile"><i class="i-user"></i><span>Profile</span></button>
      <button class="home-nav-btn" data-page="shop"><i class="i-shop"></i><span>Shop</span></button>
      <button class="home-nav-btn" data-page="leaderboard"><i class="i-trophy"></i><span>League</span></button>
    </div>`;
  refreshXP();refreshHearts();refreshStreak();
  M.querySelectorAll(".lcard:not(.locked)").forEach(el=>{el.addEventListener("click",()=>{sndClick();openLesson(el.dataset.id);});});
  const db=document.getElementById("dailyBtn");if(db)db.addEventListener("click",()=>showPage("daily"));
  const pb=document.getElementById("practiceBtn");
  if(pb)pb.addEventListener("click",()=>{const top=we[0];if(top){const ls=LESSONS.filter(l=>l.unit===top[0]);if(ls.length>0)openLesson(ls[0].id);}});
  M.querySelectorAll(".home-nav-btn").forEach(b=>{b.addEventListener("click",()=>{sndClick();showPage(b.dataset.page);});});
}

// ═══════════════════════════════════
// PLACEMENT TEST
// ═══════════════════════════════════
let placeQs=[],placeIdx=0,placeScore=0,placeSelected=null,placeAnswered=false;

function buildPlacement(){
  const qs=[];LESSONS.forEach(l=>{const mc=l.exercises.filter(e=>e.type==="multiple");if(mc.length>0){const ex=mc[Math.floor(Math.random()*mc.length)];qs.push({...ex,unit:l.unit,lessonTitle:l.title});}});
  for(let i=qs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[qs[i],qs[j]]=[qs[j],qs[i]];}
  return qs.slice(0,15);
}
function startPlacement(){placeQs=buildPlacement();placeIdx=0;placeScore=0;renderPlaceQ();}
function renderPlaceQ(){
  if(placeIdx>=placeQs.length){finishPlacement();return;}
  placeSelected=null;placeAnswered=false;
  const q=placeQs[placeIdx],total=placeQs.length,pct=Math.round((placeIdx/total)*100);
  M.innerHTML=`
    <div class="ex-screen">
      <div class="ex-header"><span class="ex-close" id="exBack">✕</span><span class="ex-prog">Placement ${placeIdx+1}/${total}</span><div class="ex-hp">${"❤️".repeat(S.hearts)+"🖤".repeat(Math.max(0,5-S.hearts))}</div></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
      <div class="ex-body">
        <div class="placement-q">${q.question}</div>
        <div class="opt-grid">${q.options.map((o,i)=>`<button class="opt-btn" data-idx="${i}">${o}</button>`).join("")}</div>
      </div>
      <div class="ex-bottom">
        <div class="fb" id="exFB"></div>
        <button class="btn btn-green btn-block" id="exCheck" style="display:none">Check</button>
      </div>
    </div>`;
  document.getElementById("exBack").addEventListener("click",()=>showPage("home"));
  M.querySelectorAll(".opt-btn").forEach(b=>{b.addEventListener("click",()=>{if(placeAnswered)return;sndClick();placeSelected=parseInt(b.dataset.idx);M.querySelectorAll(".opt-btn").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");document.getElementById("exCheck").style.display="block";});});
  document.getElementById("exCheck").addEventListener("click",checkPlaceQ);
}
function checkPlaceQ(){
  if(placeAnswered||placeSelected===null)return;placeAnswered=true;
  const q=placeQs[placeIdx],correct=placeSelected===q.correct;
  if(correct){placeScore++;sndCorrect();trackWeak(q.unit,false);}else{sndWrong();trackWeak(q.unit,true);}
  M.querySelectorAll(".opt-btn").forEach((b,i)=>{b.classList.add("off");if(i===q.correct)b.classList.add("correct");if(i===placeSelected&&!correct)b.classList.add("wrong");});
  const fb=document.getElementById("exFB");fb.className="fb show "+(correct?"ok":"fail");fb.textContent=correct?"✅ Correct!":"❌ Answer: "+q.options[q.correct];
  document.getElementById("exCheck").style.display="none";
  setTimeout(()=>{placeIdx++;renderPlaceQ();},1200);
}
function finishPlacement(){
  S.placed=true;
  const pct=Math.round((placeScore/placeQs.length)*100);
  let emoji,title,level;
  if(pct>=80){emoji="🏆";title="Excellent!";level="Advanced Start — Unit 4+";}
  else if(pct>=60){emoji="🌟";title="Good Job!";level="Intermediate Start — Unit 3";}
  else if(pct>=40){emoji="💪";title="Nice Try!";level="Beginner+ Start — Unit 2";}
  else{emoji="📚";title="Let's Learn!";level="Beginner Start — Unit 1";}
  const wc=S.weakCategories||{},we=Object.entries(wc).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  let weakHTML=we.length>0?"<ul>"+we.map(([u])=>"<li>⚠️ "+u.replace(/Unit \d+ - /,"")+"</li>").join("")+"</ul>":"<p style='color:var(--g);font-weight:600'>No weak areas!</p>";
  function unlockUpTo(id){const idx=LESSONS.findIndex(l=>l.id===id);if(idx<0)return;for(let i=0;i<=idx;i++){const lid=LESSONS[i].id;S.progress[lid]=S.progress[lid]||{};S.progress[lid].unlocked=true;if(!S.progress[lid].completed)S.progress[lid].completed=false;}}
  if(pct>=80)unlockUpTo("phrases");else if(pct>=60)unlockUpTo("colors");else if(pct>=40)unlockUpTo("numbers");else unlockUpTo("greetings");
  save();
  M.innerHTML=`
    <div class="ex-screen" style="justify-content:center;text-align:center;padding:30px 20px">
      <div style="font-size:3rem;margin-bottom:10px">${emoji}</div>
      <h2>${title}</h2>
      <p class="muted">${placeScore}/${placeQs.length} correct (${pct}%)</p>
      <div style="margin:12px 0;padding:12px;background:var(--bg);border-radius:var(--R);font-weight:700;color:var(--g)">${level}</div>
      <div style="text-align:left;margin:12px 0;font-size:.85rem">${weakHTML}</div>
      <button class="btn btn-green btn-block" id="placeOk">Start Learning</button>
    </div>`;
  document.getElementById("placeOk").addEventListener("click",()=>showPage("home"));
}

// ═══════════════════════════════════
// LESSONS
// ═══════════════════════════════════
let curLesson=null,curIdx=0,exOrder=[],selOpt=null,matchLeft=null,matchRight=null,tapWords=[],timerInt=null,timerSec=0,_correct=0,_total=0;

function openLesson(id){
  curLesson=LESSONS.find(l=>l.id===id);if(!curLesson)return;
  curLesson.exercises.forEach(e=>{delete e._done;delete e._retry;});
  const s=getSet();exOrder=curLesson.exercises.map((_,i)=>i);
  if(s.shuffle)for(let i=exOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[exOrder[i],exOrder[j]]=[exOrder[j],exOrder[i]];}
  curIdx=0;_correct=0;_total=0;renderEx();
}
function closeLesson(){stopTimer();curLesson=null;showPage("home");refreshHearts();checkBadges();renderWeak();}
function stopTimer(){if(timerInt){clearInterval(timerInt);timerInt=null;}}

function renderEx(){
  if(!curLesson||curIdx>=curLesson.exercises.length){finishLesson();return;}
  const idx=exOrder[curIdx],ex=curLesson.exercises[idx];
  selOpt=null;matchLeft=null;matchRight=null;tapWords=[];_total++;
  const total=curLesson.exercises.length;
  M.innerHTML=`
    <div class="ex-screen">
      <div class="ex-header"><span class="ex-close" id="exBack">✕</span><span class="ex-prog">${curIdx+1}/${total}</span><div class="ex-hp">${"❤️".repeat(S.hearts)+"🖤".repeat(Math.max(0,5-S.hearts))}</div><span class="ex-timer" id="exTimer"></span></div>
      <div class="ex-body" id="exBody"></div>
      <div class="ex-bottom">
        <div class="fb" id="exFB"></div>
        <button class="btn btn-green btn-block" id="exCheck" style="display:none">Check</button>
        <button class="btn-flat" id="exSkip">Skip</button>
      </div>
    </div>`;
  document.getElementById("exBack").addEventListener("click",closeLesson);
  document.getElementById("exSkip").addEventListener("click",()=>{stopTimer();curIdx++;renderEx();});
  document.getElementById("exCheck").addEventListener("click",()=>checkEx(ex));
  startTimer();
  const body=document.getElementById("exBody");
  switch(ex.type){
    case"multiple":renderMultiple(ex,body);break;
    case"fillblank":renderFillBlank(ex,body);break;
    case"match":renderMatch(ex,body);break;
    case"tap":renderTap(ex,body);break;
    case"listen":renderListen(ex,body);break;
    default:renderMultiple(ex,body);
  }
}

function renderMultiple(ex,body){
  body.innerHTML=`<div class="placement-q">${ex.question}</div><div class="opt-grid">${ex.options.map((o,i)=>`<button class="opt-btn" data-i="${i}">${o}</button>`).join("")}</div>`;
  body.querySelectorAll(".opt-btn").forEach(b=>{b.addEventListener("click",()=>{sndClick();selOpt=parseInt(b.dataset.i);body.querySelectorAll(".opt-btn").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");document.getElementById("exCheck").style.display="block";document.getElementById("exSkip").style.display="none";});});
}
function renderFillBlank(ex,body){
  const parts=ex.sentence.split("___");
  body.innerHTML=`<div class="placement-q">${parts[0]}<span style="display:inline-block;min-width:80px;border-bottom:3px solid var(--o);margin:0 4px">&nbsp;</span>${parts[1]||''}</div><div class="opt-grid">${ex.options.map((o,i)=>`<button class="opt-btn" data-i="${i}">${o}</button>`).join("")}</div>`;
  body.querySelectorAll(".opt-btn").forEach(b=>{b.addEventListener("click",()=>{sndClick();selOpt=parseInt(b.dataset.i);body.querySelectorAll(".opt-btn").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");const spans=body.querySelectorAll("span[style]");spans.forEach(s=>{if(s.style.borderBottom&&selOpt!==null)s.textContent=ex.options[selOpt];});document.getElementById("exCheck").style.display="block";document.getElementById("exSkip").style.display="none";});});
}
function renderMatch(ex,body){
  const pairs=ex.pairs,left=pairs.map((p,i)=>({text:p[0],idx:i})),right=pairs.map((p,i)=>({text:p[1],idx:i}));
  for(let i=right.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[right[i],right[j]]=[right[j],right[i]];}
  body.innerHTML=`<div class="placement-q">Match the pairs</div><div class="match-cols"><div class="match-col" id="mL">${left.map(i=>`<button class="match-btn" data-i="${i.idx}">${i.text}</button>`).join("")}</div><div class="match-col" id="mR">${right.map(i=>`<button class="match-btn" data-i="${i.idx}">${i.text}</button>`).join("")}</div></div>`;
  const matched=new Set();
  body.querySelectorAll(".match-btn").forEach(b=>{b.addEventListener("click",()=>{sndClick();const idx=parseInt(b.dataset.i),isL=b.parentElement.id==="mL";
    if(isL){body.querySelectorAll("#mL .match-btn").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");matchLeft=idx;}
    else{body.querySelectorAll("#mR .match-btn").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");matchRight=idx;}
    if(matchLeft!==null&&matchRight!==null){
      if(matchLeft===matchRight){const lb=body.querySelector('#mL .match-btn[data-i="'+matchLeft+'"]'),rb=body.querySelector('#mR .match-btn[data-i="'+matchRight+'"]');if(lb){lb.classList.add("correct");lb.classList.remove("sel");}if(rb){rb.classList.add("correct");rb.classList.remove("sel");}matched.add(matchLeft);if(matched.size===pairs.length){selOpt="matched";document.getElementById("exCheck").style.display="block";document.getElementById("exSkip").style.display="none";}}
      else{const lb=body.querySelector('#mL .match-btn[data-i="'+matchLeft+'"]'),rb=body.querySelector('#mR .match-btn[data-i="'+matchRight+'"]');if(lb){lb.classList.add("wrong");setTimeout(()=>lb.classList.remove("wrong","sel"),400);}if(rb){rb.classList.add("wrong");setTimeout(()=>rb.classList.remove("wrong","sel"),400);}}
      matchLeft=null;matchRight=null;setTimeout(()=>body.querySelectorAll(".match-btn").forEach(x=>x.classList.remove("sel")),400);
    }});});
}
function renderTap(ex,body){
  const phraseWords=ex.phrase.split(" "),allWords=[...ex.words];
  for(let i=allWords.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[allWords[i],allWords[j]]=[allWords[j],allWords[i]];}
  body.innerHTML=`<div class="placement-q">Build the phrase</div><div class="tap-target" id="tapTarget"></div><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${allWords.map((w,i)=>`<button class="tap-word" data-w="${w}" data-i="${i}">${w}</button>`).join("")}</div>`;
  tapWords=[];
  body.querySelectorAll(".tap-word").forEach(b=>{b.addEventListener("click",()=>{sndClick();const w=b.dataset.w;tapWords.push(w);b.style.visibility="hidden";
    const target=document.getElementById("tapTarget"),tag=document.createElement("button");
    tag.className="tap-word in-target";tag.textContent=w;tag.dataset.w=w;
    tag.addEventListener("click",()=>{sndClick();tapWords=tapWords.filter((x,i2)=>i2!==tapWords.indexOf(w));tag.remove();b.style.visibility="visible";if(tapWords.length<phraseWords.length){document.getElementById("exCheck").style.display="none";document.getElementById("exSkip").style.display="block";}});
    target.appendChild(tag);if(tapWords.length>=phraseWords.length){document.getElementById("exCheck").style.display="block";document.getElementById("exSkip").style.display="none";}
  });});
}
function renderListen(ex,body){
  body.innerHTML=`<div class="placement-q">${ex.question}</div><button class="listen-btn" id="listenBtn">🔊</button><div class="opt-grid">${ex.display.map((o,i)=>`<button class="opt-btn" data-i="${i}">${o}</button>`).join("")}</div>`;
  document.getElementById("listenBtn").addEventListener("click",()=>{try{const u=new SpeechSynthesisUtterance(ex.audio);u.lang="en";u.rate=0.85;speechSynthesis.cancel();speechSynthesis.speak(u);}catch{}});
  setTimeout(()=>{try{const u=new SpeechSynthesisUtterance(ex.audio);u.lang="en";u.rate=0.85;speechSynthesis.speak(u);}catch{}},300);
  body.querySelectorAll(".opt-btn").forEach(b=>{b.addEventListener("click",()=>{sndClick();selOpt=parseInt(b.dataset.i);body.querySelectorAll(".opt-btn").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");document.getElementById("exCheck").style.display="block";document.getElementById("exSkip").style.display="none";});});
}

function checkEx(ex){
  document.getElementById("exCheck").style.display="none";document.getElementById("exSkip").style.display="none";stopTimer();
  let correct=false;
  switch(ex.type){
    case"multiple":case"listen":correct=selOpt===ex.correct;highlightOpts(M.querySelectorAll(".opt-btn"),selOpt,ex.correct);break;
    case"fillblank":correct=selOpt!==null&&ex.options[selOpt]?.toLowerCase()===ex.answer.toLowerCase();highlightOpts(M.querySelectorAll(".opt-btn"),selOpt,ex.options.indexOf(ex.answer));break;
    case"match":correct=selOpt==="matched";break;
    case"tap":const t=ex.phrase.split(" ");correct=tapWords.length===t.length&&tapWords.every((w,i)=>w.toLowerCase()===t[i].toLowerCase());break;
  }
  const fb=document.getElementById("exFB");
  if(correct){_correct++;sndCorrect();S.stats.correct++;S.stars+=2;
    const word=ex.answer||ex.options?.[ex.correct]||ex.audio||"";
    if(word){const existing=S.vocab.find(v=>v.word===word);if(existing)existing.mastery=Math.min(3,(existing.mastery||0)+1);else S.vocab.push({word,mastery:1,learned:Date.now(),unit:curLesson.unit});S.stats.wordsLearned=S.vocab.length;}
    addXP(10);trackDaily("xp",10);trackWeak(curLesson.unit,false);fb.className="fb show ok";fb.textContent="✅ Correct! +10 XP";
  }else{sndWrong();S.stats.wrong++;trackWeak(curLesson.unit,true);
    if(ex.type==="multiple"||ex.type==="listen"||ex.type==="fillblank"){const ans=ex.answer||(ex.options?ex.options[ex.correct]:"");fb.className="fb show fail";fb.textContent="❌ "+(ans||"Wrong");}
    else if(ex.type==="tap"){fb.className="fb show fail";fb.textContent="❌ "+ex.phrase;}
    else{fb.className="fb show fail";fb.textContent="❌ Try to match all pairs";}
    if(!loseHeart()){closeLesson();toast("No hearts left!","err");return;}
  }
  save();setTimeout(()=>{curIdx++;renderEx();},1300);
}
function highlightOpts(btns,sel,ci){btns.forEach((b,i)=>{b.classList.add("off");if(i===ci)b.classList.add("correct");if(i===sel&&i!==ci)b.classList.add("wrong");});}
function startTimer(){stopTimer();const t=getSet().timer||0;if(t<=0)return;timerSec=t;const el=document.getElementById("exTimer");if(el){el.textContent=timerSec+"s";el.classList.remove("urgent");}timerInt=setInterval(()=>{timerSec--;const el2=document.getElementById("exTimer");if(el2){el2.textContent=timerSec+"s";if(timerSec<=5)el2.classList.add("urgent");}if(timerSec<=0){stopTimer();const fb=document.getElementById("exFB");if(fb){fb.className="fb show fail";fb.textContent="⏰ Time's up!";}if(!loseHeart()){closeLesson();}else{setTimeout(()=>{curIdx++;renderEx();},1000);}}},1000);}

function finishLesson(){
  stopTimer();const total=curLesson.exercises.length,pct=total>0?Math.round((_correct/total)*100):0,xp=_correct*10,perfect=pct>=100;
  S.progress[curLesson.id]={completed:true,bestScore:Math.max(pct,S.progress[curLesson.id]?.bestScore||0),at:Date.now()};
  S.stats.lessonsDone++;S.stars+=perfect?10:5;addXP(perfect?xp+20:xp);
  markDay();trackDaily("lesson",1);if(perfect)trackDaily("perfect",1);
  S.hearts=Math.min(5,S.hearts+1);refreshHearts();save();checkBadges();renderWeak();
  if(_correct===total&&total>0){const owned=S.badges||[];if(!owned.find(b=>b.id==="no_wrong")){S.badges.push({id:"no_wrong",at:Date.now()});sndBadge();}}
  M.innerHTML=`
    <div class="ex-screen" style="justify-content:center;text-align:center;padding:30px 20px">
      <div style="font-size:3rem;margin-bottom:10px">${perfect?'💎':'🎉'}</div>
      <h2>${perfect?"Perfect Score!":"Lesson Complete!"}</h2>
      <p class="muted">You earned ${xp} XP!</p>
      <div class="celeb-tags"><span class="xp-tag">✨ ${xp} XP</span>${perfect?'<span class="badge-tag">💎 Perfect</span>':''}<span class="star-tag">⭐ +${perfect?10:5}</span></div>
      <button class="btn btn-green btn-block" id="lessonOk">Continue</button>
    </div>`;
  document.getElementById("lessonOk").addEventListener("click",()=>showPage("home"));
}

// ═══════════════════════════════════
// OTHER PAGES
// ═══════════════════════════════════
function renderProfile(){
  M.innerHTML=`
    <div class="prof-top"><div class="avatar-circle lg orange">SS</div><h2>${S.user?.name||"Learner"}</h2><small class="muted">${{child:"Student",parent:"Parent",teacher:"Teacher"}[S.user?.role]||""}</small></div>
    <div class="grid3">
      <div class="statbox"><div class="statbox-ic fire"><i class="i-fire"></i></div><b>${S.streak}</b><small>Streak</small></div>
      <div class="statbox"><div class="statbox-ic gold"><i class="i-star"></i></div><b>${S.stars}</b><small>Stars</small></div>
      <div class="statbox"><div class="statbox-ic purple"><i class="i-star"></i></div><b>${S.stats.xp}</b><small>XP</small></div>
      <div class="statbox"><div class="statbox-ic green"><i class="i-book"></i></div><b>${S.stats.lessonsDone}</b><small>Lessons</small></div>
      <div class="statbox"><div class="statbox-ic blue"><i class="i-check"></i></div><b>${S.stats.correct}</b><small>Correct</small></div>
      <div class="statbox"><div class="statbox-ic pink"><i class="i-book"></i></div><b>${S.vocab.length}</b><small>Words</small></div>
    </div>
    <div class="section"><h3>Badges</h3><div class="badge-row" id="badgeGrid"></div></div>
    <div class="section"><h3>Weak Areas</h3><div id="weaknessList"></div></div>
    <button class="btn btn-outline btn-block" id="backHome">← Back</button>`;
  renderBadges();renderWeak();
  document.getElementById("backHome").addEventListener("click",()=>showPage("home"));
}
function renderShop(){
  M.innerHTML=`
    <h2>Shop</h2><p class="muted">Use stars to buy items</p>
    <div class="shop-coins"><b>${S.stars}</b> stars</div>
    <div class="shop-list" id="shopGrid"></div>
    <button class="btn btn-outline btn-block" style="margin-top:12px" id="backHome">← Back</button>`;
  const g=document.getElementById("shopGrid");
  g.innerHTML=SHOP.map(i=>`<div class="shop-item" data-id="${i.id}"><div class="shop-ic ${i.id==="streak_freeze"?"blue":i.id==="hearts_refill"?"red":"purple"}"><i class="i-${i.id==="streak_freeze"?"lock":i.id==="hearts_refill"?"heart":"star"}"></i></div><div class="shop-info"><b>${i.name}</b><small>${i.desc}</small></div><span class="shop-cost">⭐ ${i.cost}</span></div>`).join("");
  g.querySelectorAll(".shop-item").forEach(el=>{el.addEventListener("click",()=>{const item=SHOP.find(i=>i.id===el.dataset.id);if(!item)return;if(S.stars<item.cost){toast("Not enough stars!","err");return;}sndClick();S.stars-=item.cost;
    if(item.id==="streak_freeze"){S.streakFreeze=(S.streakFreeze||0)+1;toast("Streak Freeze active! 🧊","ok");}
    else if(item.id==="hearts_refill"){S.hearts=5;S.heartsRegen=Date.now();refreshHearts();toast("Hearts full! ❤️","ok");}
    else if(item.id==="xp_boost"){toast("XP Boost 30m! ⚡","ok");}
    save();renderShop();});});
  document.getElementById("backHome").addEventListener("click",()=>showPage("home"));
}
function renderLeague(){
  const users=getUsers(),list=Object.values(users).map(u=>({name:u.name,xp:u.stats?.xp||0})).sort((a,b)=>b.xp-a.xp);
  M.innerHTML=`<h2>Leaderboard</h2><p class="muted">Top learners</p><ol class="league">${list.map((r,i)=>`<li><span class="league-rank">#${i+1}</span><span class="league-name">${r.name}${r.name===S.user?.name?' (you)':''}</span><span class="league-xp">${r.xp} XP</span></li>`).join("")}</ol><button class="btn btn-outline btn-block" id="backHome">← Back</button>`;
  document.getElementById("backHome").addEventListener("click",()=>showPage("home"));
}
function renderSettings(){
  const s=getSet();
  M.innerHTML=`
    <h2>Settings</h2>
    <label class="sw-row"><span>Dark Mode</span><input type="checkbox" id="sDark" ${s.dark?'checked':''}/></label>
    <label class="sw-row"><span>Sound</span><input type="checkbox" id="sSound" ${s.sound!==false?'checked':''}/></label>
    <label class="sw-row"><span>Reminder</span><input type="checkbox" id="sNotif" ${s.notif?'checked':''}/></label>
    <label class="sw-row"><span>Shuffle</span><input type="checkbox" id="sShuffle" ${s.shuffle?'checked':''}/></label>
    <label class="sw-row"><span>Timer</span><select id="sTimer"><option value="0" ${s.timer==0?'selected':''}>Off</option><option value="15" ${s.timer==15?'selected':''}>15s</option><option value="30" ${s.timer==30?'selected':''}>30s</option><option value="60" ${s.timer==60?'selected':''}>60s</option></select></label>
    <hr/><button class="btn btn-outline btn-block" id="sReset">Reset Progress</button>
    <button class="btn btn-outline btn-block" id="sExport">Export Data</button>
    <p class="ver">v${VER}</p>
    <button class="btn btn-outline btn-block" id="backHome">← Back</button>`;
  document.getElementById("sDark").addEventListener("change",function(){const s=getSet();s.dark=this.checked;saveSet(s);applySet(s);});
  document.getElementById("sSound").addEventListener("change",function(){const s=getSet();s.sound=this.checked;saveSet(s);});
  document.getElementById("sNotif").addEventListener("change",function(){const s=getSet();s.notif=this.checked;saveSet(s);if(s.notif&&typeof Notification!=="undefined")Notification.requestPermission();});
  document.getElementById("sShuffle").addEventListener("change",function(){const s=getSet();s.shuffle=this.checked;saveSet(s);});
  document.getElementById("sTimer").addEventListener("change",function(){const s=getSet();s.timer=parseInt(this.value);saveSet(s);});
  document.getElementById("sReset").addEventListener("click",()=>{if(confirm("Delete ALL progress?")){S=fresh();save();showPage("home");toast("Reset!","info");}});
  document.getElementById("sExport").addEventListener("click",()=>{const d={v:VER,date:new Date().toISOString(),users:getUsers(),settings:getSet()};const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="SafariStars_backup.json";a.click();URL.revokeObjectURL(url);toast("Data exported! 📤","ok");});
  document.getElementById("backHome").addEventListener("click",()=>showPage("home"));
}
function renderDailyPage(){
  const t=dateKey(),g=(S.daily||{})[t]||{};
  M.innerHTML=`<h2>Daily Goals</h2>${DAILY.map(d=>{const cur=g[d.id]||0,ok=cur>=d.need;return`<div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--bg);border-radius:var(--R);margin-bottom:8px"><span style="font-size:1.5rem">${d.icon}</span><div style="flex:1"><strong style="font-size:.85rem">${d.label}</strong><br><small style="font-size:.7rem;color:var(--t2)">${cur} / ${d.need}</small></div><span style="font-size:1.2rem">${ok?'✅':''}</span></div>`;}).join("")}<button class="btn btn-outline btn-block" id="backHome">← Back</button>`;
  document.getElementById("backHome").addEventListener("click",()=>showPage("home"));
}

// ── Online Word Fetch ──
const FETCH_CATEGORIES=["animals","food","colors","family","body+parts","nature","school","home","travel","weather"];
const FETCH_EMOJIS=["🐶","🍎","🌈","👨‍👩‍👧","🦴","🌿","📚","🏠","✈️","☀️","🐱","🍊","🌺","👩","👁️","🌳","✏️","🛋️","🚗","❄️","🐰","🍋","🌻","👦","👂","🌙","🎒","🍳","🚌","🌧️"];
async function fetchOnlineWords(count=8){
  if(!navigator.onLine)return[];const today=dateKey(),lastFetch=localStorage.getItem("ss_lastOnlineFetch");
  if(lastFetch===today){try{return JSON.parse(localStorage.getItem("ss_onlineWords")||"[]");}catch{return[];}}
  const fetched=[],topics=[...FETCH_CATEGORIES].sort(()=>Math.random()-0.5).slice(0,3);
  for(const topic of topics){if(fetched.length>=count)break;try{const r=await fetch(`https://api.datamuse.com/words?topics=${topic}&md=d&max=${count*2}`);if(!r.ok)continue;const data=await r.json();const valid=data.filter(w=>w.word.length>=3&&w.word.length<=10&&/^[a-z]+$/.test(w.word)&&w.defs&&w.defs.length>0);for(const v of valid){if(fetched.length>=count)break;if(!fetched.find(f=>f.en===v.word)){const def=v.defs[0]?v.defs[0].replace(/^\w+\s*/,""):"";fetched.push({en:v.word.charAt(0).toUpperCase()+v.word.slice(1),sw:def||topic,online:true,icon:FETCH_EMOJIS[Math.floor(Math.random()*FETCH_EMOJIS.length)]});}}}catch{}}
  localStorage.setItem("ss_onlineWords",JSON.stringify(fetched));localStorage.setItem("ss_lastOnlineFetch",today);return fetched;
}
async function autoFetchWords(){if(!S.user)return;const words=await fetchOnlineWords(10);if(words.length>0){const existing=S.vocab.filter(v=>v.online),newWords=words.filter(w=>!existing.find(e=>e.en===w.en));if(newWords.length>0){S.vocab.push(...newWords);save();toast("📥 "+newWords.length+" new words fetched!","info");}}}

// ── Notifications ──
let notifPerm="default";
function requestNotifPermission(){if(typeof Notification==="undefined")return;if(Notification.permission==="granted"){notifPerm="granted";return;}if(Notification.permission!=="denied"){Notification.requestPermission().then(p=>{notifPerm=p;if(p==="granted")scheduleDailyReminder();});}}
function scheduleDailyReminder(){if(notifPerm!=="granted")return;const last=localStorage.getItem("ss_lastNotif"),today=dateKey();if(last===today)return;setTimeout(()=>{try{new Notification("🦁 Safari Stars",{body:"Hey "+(S.user?.name||"there")+"! Time to practice! 📚",icon:"icons/icon-192.svg",tag:"safari-daily"});localStorage.setItem("ss_lastNotif",today);}catch{}},5000);}

// ── Auth ──
function login(name,role){
  const users=getUsers();
  if(users[name]){Object.assign(S,users[name]);S.user={name,role:users[name].role||role};}
  else{S=fresh();S.user={name,role};users[name]={name,role,progress:{},stats:S.stats,streak:0,stars:30,xp:0,xpLevel:1,hearts:5,heartsRegen:Date.now(),vocab:[],badges:[],dailyActivity:{},streakFreeze:0,daily:{},weakCategories:{},wrongWords:[],placed:false};saveUsers(users);}
  localStorage.setItem(K.C,JSON.stringify({name}));
  document.getElementById("authScreen").style.display="none";document.getElementById("appShell").classList.add("active");
  initDaily();checkStreak();regenHearts();autoFetchWords();
  const set=getSet();if(set.notif)requestNotifPermission();setTimeout(()=>{if(set.notif)scheduleDailyReminder();},2000);
  showPage("home");
  if(!S.placed)setTimeout(startPlacement,600);
}
function logout(){save();S=fresh();document.getElementById("authScreen").style.display="";document.getElementById("appShell").classList.remove("active");localStorage.removeItem(K.C);renderSavedUsers();}
function renderSavedUsers(){const g=document.getElementById("savedUsers");if(!g)return;const users=getUsers();g.innerHTML=Object.keys(users).map(n=>'<button>👤 '+n+'</button>').join("");g.querySelectorAll("button").forEach(b=>{b.addEventListener("click",()=>{sndClick();login(b.textContent.replace("👤 ","").trim());});});}

// ── Init ──
function init(){
  initAudio();const s=getSet();applySet(s);
  const old=localStorage.getItem(K.V)||"1.0.0";
  if(old!==VER){const users=getUsers();Object.values(users).forEach(u=>{if(u.weakCategories===undefined)u.weakCategories={};if(u.wrongWords===undefined)u.wrongWords=[];if(u.placed===undefined)u.placed=false;if(u.daily===undefined)u.daily={};});saveUsers(users);localStorage.setItem(K.V,VER);}
  const prevVer=sessionStorage.getItem("ss_ver");if(prevVer&&prevVer!==VER){sessionStorage.removeItem("ss_ver");location.reload();return;}sessionStorage.setItem("ss_ver",VER);
  document.getElementById("loginForm").addEventListener("submit",e=>{e.preventDefault();const n=document.getElementById("loginName").value.trim(),r=document.getElementById("loginRole").value;if(n.length<2)return;login(n,r);});
  document.getElementById("settingsBtn").addEventListener("click",()=>showPage("settings"));
  setInterval(()=>{if(S.user)regenHearts();},60000);
  requestNotifPermission();
  const saved=localStorage.getItem(K.C);if(saved){try{const u=JSON.parse(saved);if(u?.name){login(u.name);return;}}catch{}}
  renderSavedUsers();
}
document.addEventListener("DOMContentLoaded",init);
})();

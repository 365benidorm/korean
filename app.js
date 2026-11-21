'use strict';
/* 길 · Cesta po Koreji — offline kurz korejštiny A1 */
const VERSION = '1.0.0';

// ================= utils =================
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[rnd(a.length)];
const uniq = (a) => [...new Set(a)];
const clean = (t) => t.replace(/[.,!?…]/g, '');
const dayKey = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const DAY = 864e5;

// ================= course build =================
const ITEMS = {};
function addItem(it) { if (!ITEMS[it.id]) ITEMS[it.id] = it; return it.id; }
function parseWords(txt, unit) {
  return uniq(txt.trim().split('\n').filter(Boolean).map((l) => {
    const [ko, rr, cs, e, note] = l.split('|');
    return addItem({ id: 'w:' + ko + '|' + cs, kind: 'w', ko: ko.trim(), rr: rr.trim(), cs: cs.trim(), e: (e || '').trim(), note: (note || '').trim(), unit });
  }));
}
function parseSents(txt, unit) {
  return txt.trim().split('\n').filter(Boolean).map((l, i) => {
    const [ko, rr, cs, g] = l.split('|');
    return addItem({ id: 's:' + unit + ':' + i, kind: 's', ko, rr, cs, unit, toks: ko.split(/\s+/), rtoks: rr.split(/\s+/), gloss: g.split('·') });
  });
}
function parseDialog(d) {
  return d.lines.trim().split('\n').filter(Boolean).map((l) => { const [w, ko, rr, cs] = l.split('|'); return { me: w === '>', ko, rr, cs }; });
}

const UNITS = [];
const U = {};
(function build() {
  HANGUL.forEach((h) => {
    const u = Object.assign({}, h, { kind: 'hangul', line: 'H', words: parseWords(h.words, h.id), sents: [] });
    u.steps = h.finals
      ? [{ id: 'rules', label: 'Pravidla a koncovky', ic: '🧩' }, { id: 'syll', label: 'Skládání slabik', ic: '🧱' }, { id: 'words', label: 'Čtení slov', ic: '👀' }, { id: 'boss', label: 'Výzva', ic: '🏅' }]
      : [{ id: 'letters', label: 'Písmena', ic: '🔤' }, { id: 'syll', label: 'Slabiky', ic: '🧱' }, { id: 'words', label: 'Čtení slov', ic: '👀' }, { id: 'boss', label: 'Výzva', ic: '🏅' }];
    UNITS.push(u);
  });
  const reviewAfter = { s4: 'r1', s9: 'r2', s14: 'r3' };
  ST.forEach((s) => {
    const u = Object.assign({}, s, { kind: 'station', words: parseWords(s.words, s.id), sents: parseSents(s.sents, s.id), dlg: parseDialog(s.dialog) });
    const chunks = Math.ceil(u.words.length / 9);
    const per = Math.ceil(u.words.length / chunks);
    u.chunks = [];
    for (let i = 0; i < chunks; i++) u.chunks.push(u.words.slice(i * per, (i + 1) * per));
    u.steps = u.chunks.map((c, i) => ({ id: 'w' + (i + 1), label: 'Slovíčka ' + (i + 1) + ' z ' + chunks, ic: '🃏', chunk: i }))
      .concat([{ id: 'gram', label: 'Gramatika', ic: '🧠' }, { id: 'dlg', label: 'Scénka', ic: '💬' }, { id: 'boss', label: 'Výzva', ic: '🏅' }]);
    UNITS.push(u);
    if (reviewAfter[s.id]) {
      const r = REVIEWS.find((x) => x.id === reviewAfter[s.id]);
      UNITS.push(Object.assign({}, r, { kind: 'review', emoji: '🔄', topic: 'Velké opakování linky', steps: [{ id: 'boss', label: 'Velké opakování', ic: '🔄' }] }));
    }
  });
  const fin = REVIEWS.find((x) => x.id === 'final');
  UNITS.push(Object.assign({}, fin, { kind: 'final', emoji: '🎓', topic: 'Závěrečná zkouška', steps: [{ id: 'boss', label: 'Závěrečná zkouška', ic: '🎓' }] }));
  UNITS.forEach((u, i) => { u.idx = i; U[u.id] = u; });
  // review pools
  UNITS.forEach((u) => {
    if (u.kind === 'review') { u.words = uniq(u.of.flatMap((id) => U[id].words)); u.sents = u.of.flatMap((id) => U[id].sents); }
    if (u.kind === 'final') { u.words = uniq(UNITS.filter((x) => x.kind === 'station').flatMap((x) => x.words)); u.sents = UNITS.filter((x) => x.kind === 'station').flatMap((x) => x.sents); }
  });
})();
const ALL_WORDS = uniq(UNITS.filter((u) => u.kind === 'hangul' || u.kind === 'station').flatMap((u) => u.words));
const ALL_SENTS = UNITS.filter((u) => u.kind === 'station').flatMap((u) => u.sents);
const MY_LINES = UNITS.filter((u) => u.kind === 'station').flatMap((u) => u.dlg.filter((l) => l.me).map((l) => Object.assign({ unit: u.id }, l)));

// ================= hangul helpers =================
const LJ = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const VJ = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const TJ = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const CI = {}; CONSONANTS.forEach((c) => (CI[c[0]] = { j: c[0], ini: c[1], fin: c[2], hint: c[3], mn: c[4], say: c[5] }));
const VI = {}; VOWELS.forEach((v) => (VI[v[0]] = { j: v[0], rr: v[1], hint: v[2], mn: v[3], say: v[4] }));
const compose = (l, v, t = '') => String.fromCharCode(0xAC00 + (LJ.indexOf(l) * 21 + VJ.indexOf(v)) * 28 + TJ.indexOf(t));
const decompose = (ch) => { const c = ch.charCodeAt(0) - 0xAC00; if (c < 0 || c > 11171) return null; return [LJ[Math.floor(c / 588)], VJ[Math.floor((c % 588) / 28)], TJ[c % 28]]; };
const sylRR = (l, v, t = '') => (CI[l] ? CI[l].ini : '') + (VI[v] ? VI[v].rr : '') + (t ? (CI[t] ? CI[t].fin : '') : '');
function hangulSets(uid) {
  const cons = new Set(), vow = new Set();
  for (const h of HANGUL) { (h.cons || []).forEach((c) => cons.add(c)); (h.vow || []).forEach((v) => vow.add(v)); if (h.id === uid) break; }
  return { cons: [...cons], vow: [...vow] };
}

// ================= state =================
const KEY = 'gil.v1';
const DEF = {
  v: 1, xp: 0, streak: 0, lastDay: null, days: {}, prog: {}, srs: {}, stamps: {}, badges: {}, opened: {},
  stats: { spoke: 0, answers: 0, correct: 0 }, mute: { listen: 0, speak: 0 },
  settings: { script: 'both', audio: true, speak: true, slow: false, voice: '', unlockAll: false, goal: 50, autoplay: true },
};
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  S = Object.assign(JSON.parse(JSON.stringify(DEF)), S);
  S.settings = Object.assign({}, DEF.settings, S.settings);
  S.stats = Object.assign({}, DEF.stats, S.stats);
  S.mute = Object.assign({}, DEF.mute, S.mute);
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* plná paměť */ } }
load();

function addXP(n) {
  if (n <= 0) return;
  const t = dayKey();
  if (S.lastDay !== t) {
    const y = dayKey(new Date(Date.now() - DAY));
    S.streak = S.lastDay === y ? S.streak + 1 : 1;
    S.lastDay = t;
  }
  S.xp += n; S.days[t] = (S.days[t] || 0) + n;
  save(); topbar();
}
function curStreak() { const t = dayKey(), y = dayKey(new Date(Date.now() - DAY)); return S.lastDay === t || S.lastDay === y ? S.streak : 0; }

// SRS (Leitner)
const IV = [0, 1, 2, 4, 8, 16, 32];
function srsSeen(id) { if (!S.srs[id]) { S.srs[id] = { b: 0, d: Date.now() + 10 * 60e3, r: 0, w: 0 }; } }
function srsMark(id, ok) {
  srsSeen(id); const s = S.srs[id];
  if (ok) { s.r++; s.b = Math.min(s.b + 1, 6); s.d = Date.now() + IV[s.b] * DAY - 3 * 3600e3; }
  else { s.w++; s.b = Math.max(1, s.b - 2); s.d = Date.now() + 10 * 60e3; }
}
const dueList = () => Object.keys(S.srs).filter((id) => ITEMS[id] && S.srs[id].d <= Date.now());
const learnedWords = () => Object.keys(S.srs).filter((id) => id.startsWith('w:') && ITEMS[id]).length;

// progress
const stepDone = (u, s) => !!(S.prog[u] && S.prog[u][s]);
const unitDone = (u) => stepDone(u, 'boss');
const unitFrac = (u) => { const un = U[u]; return un.steps.filter((s) => stepDone(u, s.id)).length / un.steps.length; };
function unitOpen(u) {
  const un = U[u];
  if (S.settings.unlockAll || un.idx === 0 || S.opened[u] || unitFrac(u) > 0) return true;
  const prev = UNITS[un.idx - 1];
  return unitDone(prev.id) || unitFrac(prev.id) >= 0.5;
}
function currentUnit() { return UNITS.find((u) => !unitDone(u.id) && unitOpen(u.id)) || UNITS.find((u) => !unitDone(u.id)) || UNITS[UNITS.length - 1]; }
function nextStep(u) { return U[u].steps.find((s) => !stepDone(u, s.id)) || U[u].steps[0]; }
const lineColor = (u) => (LINES[U[u] ? U[u].line : u] || LINES[1]).color;

// ================= audio =================
let VOICES = [];
function loadVoices() { if (!('speechSynthesis' in window)) return; VOICES = speechSynthesis.getVoices().filter((v) => /^ko/i.test(v.lang)); }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
let warnedVoice = false;
function say(text, slow) {
  if (!('speechSynthesis' in window)) { toast('Tento prohlížeč neumí předčítat.'); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[~…]/g, ' '));
    u.lang = 'ko-KR';
    const v = VOICES.find((x) => x.voiceURI === S.settings.voice) || VOICES.find((x) => x.localService) || VOICES[0];
    if (v) u.voice = v;
    else if (!warnedVoice && speechSynthesis.getVoices().length) { warnedVoice = true; toast('Nenašel jsem korejský hlas – návod je v Nastavení ⚙️'); }
    u.rate = slow || S.settings.slow ? 0.6 : 0.9;
    speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}
const listenOK = () => S.settings.audio && Date.now() > S.mute.listen;
const speakOK = () => S.settings.speak && Date.now() > S.mute.speak && !!(navigator.mediaDevices && window.MediaRecorder);
function autoSay(t) { if (S.settings.audio && S.settings.autoplay) setTimeout(() => say(t), 120); }

// ================= ui helpers =================
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
function kt(ko, rr, o = {}) {
  const m = o.force || S.settings.script, sz = o.size || '';
  if (m === 'rr') return `<span class="k rr-only ${sz}">${esc(rr)}</span>`;
  if (m === 'ko') return o.noReveal ? `<span class="k ${sz}"><span class="hg">${esc(ko)}</span></span>`
    : `<span class="k ${sz}" data-act="rv"><span class="hg">${esc(ko)}</span><span class="rr hide">${esc(rr)}</span></span>`;
  return `<span class="k ${sz}"><span class="hg">${esc(ko)}</span><span class="rr">${esc(rr)}</span></span>`;
}
const ktI = (it, o) => kt(it.ko, it.rr, o);
const sayBtn = (t, cls = 'say') => `<button class="${cls}" data-act="say" data-t="${esc(t)}" aria-label="Přehrát">🔊</button>`;
const slowBtn = (t) => `<button class="say" data-act="say" data-slow="1" data-t="${esc(t)}" aria-label="Přehrát pomalu">🐢</button>`;
function tokHTML(it, withGloss) {
  return it.toks.map((t, i) => {
    const inner = kt(t, it.rtoks[i] || '', { noReveal: true });
    return withGloss ? `<span class="tok" data-act="gl" data-g="${esc(it.gloss[i] || '')}">${inner}</span>` : `<span class="tok">${inner}</span>`;
  }).join(' ');
}
function glossTable(it) {
  return `<div class="gloss">${it.toks.map((t, i) => `<span class="g1">${kt(t, it.rtoks[i] || '', { noReveal: true })}</span><span>${esc(it.gloss[i] || '')}</span>`).join('')}</div>`;
}
function scene(u) {
  const seed = [...u.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  let x = 0, d = '', r = seed;
  const nx = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  while (x < 400) { const w = 18 + nx() * 26, hh = 18 + nx() * 46; d += `M${x.toFixed(0)} 70V${(70 - hh).toFixed(0)}h${w.toFixed(0)}V70z`; x += w + 2; }
  const em = [...(u.scene || u.emoji)].join('').match(/\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|️|[\u{1F3FB}-\u{1F3FF}]|\p{Regional_Indicator})*|\p{Regional_Indicator}{2}/gu) || [u.emoji];
  const pos = [[8, 52], [38, 74], [70, 56]];
  return `<div class="scene" style="--c:${lineColor(u.id)}"><svg viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="${lineColor(u.id)}" opacity=".16"/></svg><div class="ground"></div>${em.slice(0, 3).map((e, i) => `<span class="e" style="left:${pos[i][0]}%;font-size:${pos[i][1]}px">${e}</span>`).join('')}</div>`;
}
function stampHTML(u, cls = '') {
  const un = U[u];
  const top = un.kind === 'hangul' ? '한글' : un.kind === 'review' ? '환승' : un.kind === 'final' ? 'A1' : un.code;
  if ([...un.ko].length > 4) cls += ' long';
  return `<div class="stamp ${cls}" style="--c:${lineColor(u)}"><span class="s1">${esc(top)}</span><span class="s2">${esc(un.ko)}</span><span class="s3">${esc(un.kind === 'final' ? 'KOREJŠTINA' : un.name.split(':')[0].slice(0, 18))}</span></div>`;
}
function topbar() {
  $('#t-xp').textContent = S.xp; $('#t-streak').textContent = curStreak();
  document.querySelectorAll('#t-script button').forEach((b) => b.classList.toggle('on', b.dataset.v === S.settings.script));
  const n = dueList().length, b = $('#n-due');
  b.textContent = n; b.classList.toggle('hide', !n);
}

// ================= router =================
let L = null; // aktivní lekce
function route() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  const v = h[0] || 'map';
  document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === (v === 'u' ? 'map' : v)));
  closeLesson();
  if (v === 'l') return openLesson(h[1], h[2]);
  const m = { map: viewMap, u: () => viewUnit(h[1]), srs: viewSRS, dict: viewDict, hangul: viewHangul, me: viewMe }[v] || viewMap;
  m(); topbar(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
const go = (h) => { location.hash = h; };

// ================= views =================
function viewMap() {
  const cu = currentUnit(), ns = nextStep(cu.id);
  const today = S.days[dayKey()] || 0, goal = S.settings.goal;
  let html = `<div class="hero" style="--c:${lineColor(cu.id)}">
    <div class="t">Další zastávka · ${esc(cu.code)}</div>
    <div class="n">${esc(cu.emoji || '')} ${esc(cu.name)}</div>
    <button class="btn" data-act="start" data-u="${cu.id}" data-s="${ns.id}">▶ ${esc(ns.label)}</button>
    <div class="goal" title="Denní cíl"><i style="width:${Math.min(100, (today / goal) * 100)}%"></i></div>
    <div class="t" style="margin-top:6px">Dnes ${today} / ${goal} bodů · naučeno ${learnedWords()} slov</div>
  </div>`;
  let line = null;
  UNITS.forEach((u) => {
    if (u.line !== line) {
      if (line !== null) html += '</div>';
      line = u.line; const Ln = LINES[line];
      const lu = UNITS.filter((x) => x.line === line), dn = lu.filter((x) => unitDone(x.id)).length;
      html += `<div class="linehead" style="--c:${Ln.color}"><span class="chip">${line}</span><div><div class="nm">${esc(Ln.name)} <span class="muted small">${esc(Ln.ko)}</span></div><div class="sb">${esc(Ln.sub)} · ${dn}/${lu.length}</div></div></div><div class="track" style="--c:${Ln.color}">`;
    }
    const open = unitOpen(u.id), done = unitDone(u.id), fr = unitFrac(u.id);
    const cls = ['node', done ? 'done' : '', !open ? 'locked' : '', u.kind === 'review' || u.kind === 'final' ? 'review' : ''].join(' ');
    html += `<button class="${cls}" data-act="unit" data-u="${u.id}">
      <span class="dot">${done ? '✓' : esc(u.kind === 'review' ? '환승' : u.code)}</span>
      ${u.id === cu.id ? '<span class="train" aria-hidden="true">🚇</span>' : ''}
      <span class="lbl"><span class="tx"><span class="ko">${esc(u.ko)}</span> <span class="nm">${esc(u.name)}</span>
      <div class="tp">${!open ? '🔒 ' : ''}${esc(u.topic || (u.kind === 'hangul' ? 'Písmo' : 'Opakování'))}</div>
      ${fr > 0 && !done ? `<div class="bar"><i style="width:${fr * 100}%"></i></div>` : ''}</span>
      <span class="em">${done ? '🏅' : esc(u.emoji || '')}</span></span></button>`;
  });
  html += '</div><p class="muted small" style="text-align:center;margin-top:18px">Benidorm → Soul → domů. Každá zastávka = razítko do pasu.</p>';
  $('#view').innerHTML = html;
}

function viewUnit(id) {
  const u = U[id]; if (!u) return viewMap();
  const prev = UNITS[u.idx - 1], next = UNITS[u.idx + 1];
  let html = `<button class="pill" data-act="nav" data-h="#/">← Mapa</button><div class="spacer"></div>
  <div class="sign" style="--c:${lineColor(id)}">
    <div class="band"><span>${prev ? '← ' + esc(prev.ko) + ' ' + esc(prev.name) : ''}</span><span>${next ? esc(next.ko) + ' ' + esc(next.name) + ' →' : ''}</span></div>
    <div class="mid"><div class="num">${esc(u.kind === 'review' ? '환승' : u.code)}</div><div class="names"><div class="ko">${esc(u.ko)}</div>${u.rr ? `<div class="rr">${esc(u.rr)}</div>` : ''}<div class="cz">${esc(u.name)}</div>${u.topic ? `<div class="muted small">${esc(u.topic)}</div>` : ''}</div></div>
  </div>`;
  if (u.kind === 'hangul' || u.kind === 'station') html += scene(u);
  if (u.intro) html += `<p>${esc(u.intro)}</p>`;
  if (u.kind === 'review') html += `<p>Přestupní stanice: smíšené opakování ${u.words.length} slov a ${u.sents.length} vět z celé linky. Máš 3 srdce.</p>`;
  if (u.kind === 'final') html += `<p>Poslední zastávka. 30 otázek ze všech zastávek a 5 srdcí. Když projdeš, dostaneš razítko A1.</p>`;
  html += `<div class="steps" style="--c:${lineColor(id)}">${u.steps.map((s) => `<button class="step ${stepDone(id, s.id) ? 'done' : ''}" data-act="start" data-u="${id}" data-s="${s.id}"><span class="ic">${stepDone(id, s.id) ? '✓' : s.ic}</span><span class="tx"><b>${esc(s.label)}</b><span class="muted small">${stepHint(u, s)}</span></span><span class="go">›</span></button>`).join('')}</div>`;
  if (unitDone(id)) html += `<div style="text-align:center;margin:14px 0">${stampHTML(id)}</div>`;
  if (u.culture) html += u.culture.map((c) => `<div class="tipc"><b>💡 Tip od místních</b>${esc(c)}</div>`).join('');
  if (u.kind === 'hangul') html += (u.tips || []).map((t) => `<div class="tipc"><b>✍️ ${esc(t.t)}</b>${esc(t.x)}</div>`).join('');
  if (u.kind === 'hangul' || u.kind === 'station') {
    html += `<details class="words"><summary>Slovíčka v této zastávce (${u.words.length})</summary>${u.words.map((w) => wordRow(ITEMS[w])).join('')}</details>`;
  }
  $('#view').innerHTML = html;
}
function stepHint(u, s) {
  if (s.id === 'boss') return u.kind === 'final' ? '30 otázek · 5 srdcí' : u.kind === 'review' ? '20 otázek · 3 srdce' : '12 otázek · 3 srdce · razítko';
  if (s.id === 'gram') return u.grammar.map((g) => g.t.split('=')[0].trim()).join(' · ');
  if (s.id === 'dlg') return 'Poslechni si scénku a zahraj svou roli';
  if (s.chunk != null) return u.chunks[s.chunk].slice(0, 4).map((w) => ITEMS[w].cs.split(/[,/(]/)[0].trim()).join(', ') + '…';
  if (s.id === 'letters') return [...(u.cons || []), ...(u.vow || [])].join(' ');
  if (s.id === 'rules') return '7 koncových zvuků, vázání, nosovky';
  if (s.id === 'syll') return 'Čti a skládej slabiky';
  if (s.id === 'words') return u.words.slice(0, 4).map((w) => ITEMS[w].ko).join(' · ');
  return '';
}
function wordRow(it) {
  const s = S.srs[it.id];
  return `<div class="wl"><span class="em">${esc(it.e)}</span><span class="tx">${ktI(it)}<div class="cs">${esc(it.cs)}${it.note ? ' · <i>' + esc(it.note) + '</i>' : ''}</div></span>${s ? `<span class="box" title="Úroveň zapamatování">${'●'.repeat(Math.min(s.b, 5))}${'○'.repeat(5 - Math.min(s.b, 5))}</span>` : ''}${sayBtn(it.ko)}</div>`;
}

function viewSRS() {
  const due = dueList(), seen = Object.keys(S.srs).filter((id) => ITEMS[id]);
  const weak = seen.filter((id) => S.srs[id].w > 0).sort((a, b) => (S.srs[b].w - S.srs[b].r * 0.3) - (S.srs[a].w - S.srs[a].r * 0.3));
  const boxes = [0, 0, 0, 0, 0, 0, 0]; seen.forEach((id) => boxes[S.srs[id].b]++);
  $('#view').innerHTML = `<h2>Opakování</h2><p class="muted">Slova a věty se vracejí těsně předtím, než bys je zapomněl: po 1, 2, 4, 8 a 16 dnech.</p>
  <div class="card"><div class="row"><div style="font-size:44px">🔁</div><div><b style="font-size:22px">${due.length}</b> čeká na zopakování<div class="muted small">${seen.length} položek v paměti</div></div></div><div class="spacer"></div>
  <button class="btn block" data-act="nav" data-h="#/l/srs/due" ${due.length ? '' : 'disabled'}>${due.length ? 'Zopakovat (' + Math.min(due.length, 15) + ')' : 'Vše zopakováno 🎉'}</button></div>
  <div class="card"><h3>Slabá místa</h3><p class="muted small">Co ti dělá potíže nejčastěji.</p>${weak.slice(0, 5).map((id) => ITEMS[id]).map((it) => `<div class="wl"><span class="em">${esc(it.e || '💬')}</span><span class="tx">${ktI(it)}<div class="cs">${esc(it.cs)}</div></span>${sayBtn(it.ko)}</div>`).join('') || '<p class="muted small">Zatím žádné chyby.</p>'}
  <button class="btn ghost block" data-act="nav" data-h="#/l/srs/weak" ${weak.length >= 3 ? '' : 'disabled'}>Procvičit slabá místa</button></div>
  <div class="card"><h3>Náhodný trénink</h3><p class="muted small">Míchanice ze všeho, co už znáš.</p><button class="btn ghost block" data-act="nav" data-h="#/l/srs/mix" ${seen.length >= 4 ? '' : 'disabled'}>Spustit</button></div>
  <div class="card"><h3>Paměť podle úrovní</h3><div class="row" style="align-items:flex-end;height:80px;gap:6px">${boxes.slice(1).map((n, i) => `<div style="flex:1;text-align:center"><div style="height:${Math.max(4, (n / Math.max(1, ...boxes.slice(1))) * 60)}px;background:var(--c);border-radius:6px 6px 0 0;opacity:${0.4 + i * 0.12}"></div><div class="small muted">${i + 1}</div></div>`).join('')}</div><p class="small muted">1 = nové, 6 = pevně zapamatované</p></div>`;
}

let dictF = 'all', dictQ = '';
function viewDict() {
  const units = UNITS.filter((u) => u.kind === 'station' || u.kind === 'hangul');
  $('#view').innerHTML = `<h2>Slovník</h2><input type="search" id="dq" placeholder="Hledat česky, korejsky nebo v přepisu" value="${esc(dictQ)}">
  <div class="filters"><button class="${dictF === 'all' ? 'on' : ''}" data-act="df" data-f="all">Vše</button><button class="${dictF === 'mine' ? 'on' : ''}" data-act="df" data-f="mine">Moje</button>${units.map((u) => `<button class="${dictF === u.id ? 'on' : ''}" data-act="df" data-f="${u.id}" style="--c:${lineColor(u.id)}">${esc(u.code)} ${esc(u.ko)}</button>`).join('')}</div>
  <div class="card" id="dl"></div>`;
  $('#dq').addEventListener('input', (e) => { dictQ = e.target.value; dictList(); });
  dictList();
}
function dictList() {
  const q = dictQ.trim().toLowerCase();
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let ids = dictF === 'all' ? ALL_WORDS : dictF === 'mine' ? ALL_WORDS.filter((id) => S.srs[id]) : U[dictF].words;
  if (q) ids = ids.filter((id) => { const it = ITEMS[id]; return it.ko.includes(q) || norm(it.cs).includes(norm(q)) || it.rr.toLowerCase().replace(/\s/g, '').includes(q.replace(/\s/g, '')); });
  $('#dl').innerHTML = ids.map((id) => wordRow(ITEMS[id])).join('') || '<p class="muted">Nic nenalezeno.</p>';
}

let pg = { l: 'ㅎ', v: 'ㅏ', t: 'ㄴ' };
function viewHangul() {
  const cons = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ'.split(''), vows = 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ'.split('');
  $('#view').innerHTML = `<h2>Hangul</h2><p class="muted">Klepni na slabiku a uslyšíš ji.</p>
  <div class="card"><h3>Skládačka</h3><div style="text-align:center"><div class="sylblock" id="pgb">${compose(pg.l, pg.v, pg.t)}</div><div style="margin:8px 0;font-weight:800" id="pgr">${sylRR(pg.l, pg.v, pg.t)}</div>${sayBtn(compose(pg.l, pg.v, pg.t), 'say').replace('class="say"', 'class="say" id="pgs" style="margin:0 auto"')}</div><div class="spacer"></div>
  <div class="jrow"><div class="lab">Počáteční souhláska</div>${LJ.split('').map((j) => `<button class="jbtn ${pg.l === j ? 'sel' : ''}" data-act="pg" data-k="l" data-j="${j}">${j}</button>`).join('')}</div>
  <div class="jrow"><div class="lab">Samohláska</div>${VJ.split('').map((j) => `<button class="jbtn ${pg.v === j ? 'sel' : ''}" data-act="pg" data-k="v" data-j="${j}">${j}</button>`).join('')}</div>
  <div class="jrow"><div class="lab">Koncová souhláska</div><button class="jbtn ${pg.t === '' ? 'sel' : ''}" data-act="pg" data-k="t" data-j="">–</button>${'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㅆ'.split('').map((j) => `<button class="jbtn ${pg.t === j ? 'sel' : ''}" data-act="pg" data-k="t" data-j="${j}">${j}</button>`).join('')}</div></div>
  <div class="card chart"><h3>Tabulka slabik</h3><table><tr><th></th>${vows.map((v) => `<th>${v}</th>`).join('')}</tr>${cons.map((c) => `<tr><th>${c}</th>${vows.map((v) => { const s = compose(c, v); return `<td><button data-act="cell" data-t="${s}" data-r="${sylRR(c, v)}">${s}</button></td>`; }).join('')}</tr>`).join('')}</table></div>
  <div class="card"><h3>Souhlásky</h3><div class="jlist">${CONSONANTS.map((c) => `<button data-act="say" data-t="${c[5]}"><b>${c[0]}</b><span>${esc(c[1] || '–')}${c[2] && c[2] !== c[1] ? ' / ' + esc(c[2]) : ''}<br>${esc(c[3])}</span></button>`).join('')}</div></div>
  <div class="card"><h3>Samohlásky</h3><div class="jlist">${VOWELS.map((v) => `<button data-act="say" data-t="${v[4]}"><b>${v[0]}</b><span>${esc(v[1])}<br>${esc(v[2])}</span></button>`).join('')}</div></div>`;
}

const BADGES = [
  ['first', '👣', 'První krok', 'Dokonči první lekci'],
  ['hangul', '한', 'Čtu hangul', 'Projdi celou linku Hangul'],
  ['w100', '💯', '100 slov', 'Nauč se 100 slov'],
  ['w300', '📚', '300 slov', 'Nauč se 300 slov'],
  ['streak3', '🔥', '3 dny v řadě', 'Uč se 3 dny po sobě'],
  ['streak7', '🌋', 'Týden v řadě', 'Uč se 7 dní po sobě'],
  ['perfect', '💎', 'Bez ztráty', 'Projdi výzvu bez ztráty srdce'],
  ['speaker', '🎙️', 'Mluvčí', 'Namluv 20 vět nebo slov'],
  ['line1', '✈️', 'Přiletěl jsem', 'Dokonči linku 1'],
  ['line3', '🎢', 'Soul je můj', 'Dokonči linku 3'],
  ['a1', '🎓', 'A1', 'Projdi závěrečnou zkouškou'],
];
function checkBadges() {
  const has = (k) => S.badges[k];
  const give = (k) => { if (!has(k)) { S.badges[k] = Date.now(); const b = BADGES.find((x) => x[0] === k); toast(`Nový odznak: ${b[1]} ${b[2]}`); } };
  if (Object.keys(S.prog).length) give('first');
  if (HANGUL.every((h) => unitDone(h.id))) give('hangul');
  if (learnedWords() >= 100) give('w100');
  if (learnedWords() >= 300) give('w300');
  if (curStreak() >= 3) give('streak3');
  if (curStreak() >= 7) give('streak7');
  if (S.stats.spoke >= 20) give('speaker');
  if (UNITS.filter((u) => u.line === 1).every((u) => unitDone(u.id))) give('line1');
  if (UNITS.filter((u) => u.line === 3).every((u) => unitDone(u.id))) give('line3');
  if (unitDone('final')) give('a1');
  save();
}
function viewMe() {
  const lvl = Math.floor(Math.sqrt(S.xp / 50)) + 1, cur = (lvl - 1) ** 2 * 50, nxt = lvl ** 2 * 50;
  const acc = S.stats.answers ? Math.round((S.stats.correct / S.stats.answers) * 100) : 0;
  const days = [...Array(14)].map((_, i) => { const k = dayKey(new Date(Date.now() - (13 - i) * DAY)); return [k, S.days[k] || 0]; });
  const mx = Math.max(S.settings.goal, ...days.map((d) => d[1]));
  $('#view').innerHTML = `<h2>Cestovní pas</h2>
  <div class="card"><div class="row"><div style="font-size:44px">🧳</div><div style="flex:1"><b style="font-size:20px">Úroveň ${lvl}</b><div class="muted small">${S.xp} bodů · ${curStreak()} 🔥 dní v řadě · přesnost ${acc} %</div><div class="node" style="padding:0"><div class="bar" style="width:100%"><i style="width:${((S.xp - cur) / (nxt - cur)) * 100}%;background:var(--gold)"></i></div></div></div></div>
  <div class="row" style="align-items:flex-end;height:70px;gap:4px;margin-top:12px">${days.map(([k, v]) => `<div style="flex:1;text-align:center" title="${k}: ${v}"><div style="height:${Math.max(3, (v / mx) * 54)}px;background:${v >= S.settings.goal ? 'var(--gold)' : 'var(--soft)'};border-radius:4px"></div></div>`).join('')}</div><div class="small muted">Posledních 14 dní · zlatá = splněný denní cíl</div></div>
  <div class="card"><h3>Razítka</h3><div class="passport">${UNITS.map((u) => stampHTML(u.id, 'sm ' + (unitDone(u.id) ? '' : 'empty'))).join('')}</div></div>
  <div class="card"><h3>Odznaky</h3><div class="badges">${BADGES.map((b) => `<div class="${S.badges[b[0]] ? '' : 'off'}"><b>${b[1]}</b><strong>${esc(b[2])}</strong><div class="muted">${esc(b[3])}</div></div>`).join('')}</div></div>
  <div class="card"><h3>Statistika</h3><p class="small">Naučená slova: <b>${learnedWords()}</b> z ${ALL_WORDS.length}<br>Hotové zastávky: <b>${UNITS.filter((u) => unitDone(u.id)).length}</b> z ${UNITS.length}<br>Odpovědi: <b>${S.stats.answers}</b> (správně ${S.stats.correct})<br>Namluveno: <b>${S.stats.spoke}</b></p></div>
  <button class="btn ghost block" data-act="settings">⚙️ Nastavení a záloha</button>`;
}

// ================= settings modal =================
function modal(html) { closeModal(); const m = document.createElement('div'); m.id = 'modal'; m.innerHTML = `<div class="sheet">${html}</div>`; m.addEventListener('click', (e) => { if (e.target === m) closeModal(); }); document.body.appendChild(m); }
function closeModal() { const m = $('#modal'); if (m) m.remove(); }
function openSettings() {
  loadVoices();
  const st = S.settings, tg = (k, on) => `<button class="tog ${on ? 'on' : ''}" data-act="tog" data-k="${k}" aria-pressed="${on}"></button>`;
  modal(`<div class="row"><h2 style="flex:1;margin:0">Nastavení</h2><button class="iconbtn" data-act="close">✕</button></div>
  <div class="set"><div class="lab">Písmo</div><div class="seg">${[['ko', 'Jen 한글'], ['both', '한글 + přepis'], ['rr', 'Jen přepis']].map(([v, l]) => `<button class="${st.script === v ? 'on' : ''}" data-act="script" data-v="${v}">${l}</button>`).join('')}</div><p class="small muted">V režimu „Jen 한글" klepni na korejské slovo a ukáže se přepis.</p></div>
  <div class="set switch"><div><div class="lab">Poslech</div><div class="small muted">Předčítání a poslechová cvičení</div></div>${tg('audio', st.audio)}</div>
  <div class="set switch"><div><div class="lab">Automaticky přehrávat</div><div class="small muted">Nové slovo se samo přečte</div></div>${tg('autoplay', st.autoplay)}</div>
  <div class="set switch"><div><div class="lab">Pomalé čtení</div><div class="small muted">Vždy číst pomaleji</div></div>${tg('slow', st.slow)}</div>
  <div class="set switch"><div><div class="lab">Mluvení</div><div class="small muted">Cvičení s nahráváním hlasu</div></div>${tg('speak', st.speak)}</div>
  <div class="set"><div class="lab">Korejský hlas</div>${VOICES.length ? `<select id="voice"><option value="">Automaticky</option>${VOICES.map((v) => `<option value="${esc(v.voiceURI)}" ${st.voice === v.voiceURI ? 'selected' : ''}>${esc(v.name)}${v.localService ? ' · offline' : ''}</option>`).join('')}</select>` : '<p class="small" style="color:var(--bad)">V telefonu zatím není korejský hlas. Postup je níže.</p>'}
  <div class="spacer"></div><button class="btn ghost" data-act="say" data-t="안녕하세요! 만나서 반가워요.">🔊 Vyzkoušet hlas</button></div>
  <div class="set howto"><div class="lab">Korejský hlas offline (Android)</div><ol>
  <li>Nastavení telefonu → <b>Systém → Jazyky a vstup → Výstup převodu textu na řeč</b> (u Samsungu <b>Obecná správa → Jazyk → Převod textu na řeč</b>).</li>
  <li>Jako modul zvol <b>Google</b> (Služby rozpoznávání a syntézy řeči).</li>
  <li>Klepni na ⚙️ u modulu → <b>Instalovat hlasová data</b> → <b>한국어 / korejština</b> → stáhnout.</li>
  <li>Vrať se sem a dej „Vyzkoušet hlas". Cesta v menu se může lišit podle výrobce.</li></ol></div>
  <div class="set"><div class="lab">Denní cíl</div><div class="seg">${[20, 50, 100, 150].map((g) => `<button class="${st.goal === g ? 'on' : ''}" data-act="goal" data-v="${g}">${g} b.</button>`).join('')}</div></div>
  <div class="set switch"><div><div class="lab">Odemknout všechny zastávky</div><div class="small muted">Volný pohyb po mapě</div></div>${tg('unlockAll', st.unlockAll)}</div>
  <div class="set"><div class="lab">Záloha postupu</div><div class="row wrap"><button class="btn ghost" data-act="export">⬇️ Uložit zálohu</button><label class="btn ghost">⬆️ Nahrát zálohu<input type="file" id="imp" accept="application/json" class="hide"></label></div></div>
  <div class="set"><button class="btn ghost" data-act="reset" id="resetb" style="color:var(--bad)">Smazat celý postup</button></div>
  <p class="small muted">길 · Cesta po Koreji ${VERSION} · ${ALL_WORDS.length} slov · ${ALL_SENTS.length} vět · funguje offline</p>`);
  const vs = $('#voice'); if (vs) vs.addEventListener('change', (e) => { S.settings.voice = e.target.value; save(); say('안녕하세요'); });
  $('#imp').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { try { const d = JSON.parse(r.result); if (!d || d.v !== 1) throw 0; localStorage.setItem(KEY, JSON.stringify(d)); load(); closeModal(); route(); toast('Záloha nahrána ✓'); } catch (er) { toast('Soubor není záloha z této aplikace.'); } };
    r.readAsText(f);
  });
}

// ================= global actions =================
let resetArm = 0;
const ACT = {
  say: (el) => say(el.dataset.t, !!el.dataset.slow),
  cell: (el) => { say(el.dataset.t); toast(el.dataset.t + ' = ' + el.dataset.r); },
  rv: (el) => { const r = el.querySelector('.rr'); if (r) r.classList.toggle('hide'); },
  gl: (el) => { if (el.dataset.g) toast(el.textContent.trim().split(/\s+/)[0] + ' = ' + el.dataset.g); },
  nav: (el) => go(el.dataset.h),
  unit: (el) => {
    const id = el.dataset.u;
    if (!unitOpen(id)) {
      modal(`<h2>🔒 ${esc(U[id].name)}</h2><p>Tahle zastávka je ještě zamčená. Doporučuju projít předchozí – ale klidně můžeš skočit dopředu.</p><div class="row"><button class="btn" data-act="force" data-u="${id}">Otevřít i tak</button><button class="btn ghost" data-act="close">Zpět</button></div>`);
      return;
    }
    go('#/u/' + id);
  },
  force: (el) => { S.opened[el.dataset.u] = 1; save(); closeModal(); go('#/u/' + el.dataset.u); },
  start: (el) => { if (!unitOpen(el.dataset.u)) { S.opened[el.dataset.u] = 1; save(); } go(`#/l/${el.dataset.u}/${el.dataset.s}`); },
  script: (el) => { S.settings.script = el.dataset.v; save(); topbar(); if ($('#modal')) openSettings(); if (L) renderEx(); else route(); },
  settings: () => openSettings(),
  close: () => closeModal(),
  tog: (el) => { const k = el.dataset.k; S.settings[k] = !S.settings[k]; save(); openSettings(); if (!$('#lesson')) route(); },
  goal: (el) => { S.settings.goal = +el.dataset.v; save(); openSettings(); },
  df: (el) => { dictF = el.dataset.f; viewDict(); },
  pg: (el) => { pg[el.dataset.k] = el.dataset.j; const s = compose(pg.l, pg.v, pg.t); viewHangul(); say(s); },
  export: () => {
    const b = new Blob([JSON.stringify(S)], { type: 'application/json' }); const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'gil-zaloha-' + dayKey() + '.json'; document.body.appendChild(a); a.click(); a.remove();
  },
  reset: (el) => {
    if (Date.now() - resetArm > 4000) { resetArm = Date.now(); el.textContent = 'Opravdu smazat? Klepni znovu'; return; }
    localStorage.removeItem(KEY); load(); closeModal(); go('#/'); route(); toast('Postup smazán.');
  },
};
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-act]'); if (!a) return;
  const f = ACT[a.dataset.act] || (L && LACT[a.dataset.act]);
  if (f) { e.preventDefault(); f(a, e); }
});

// ================= lesson engine =================
function closeLesson() { const el = $('#lesson'); if (el) el.remove(); const fb = $('.fb'); if (fb) fb.remove(); if (rec.stream) stopRec(true); L = null; }

function poolFor(u) {
  // slova této jednotky + předchozích (na odpovědi navíc)
  const own = U[u] ? U[u].words : [];
  const prevU = U[u] ? UNITS.slice(0, U[u].idx).filter((x) => x.kind === 'station' || x.kind === 'hangul') : [];
  return uniq(own.concat(prevU.flatMap((x) => x.words)));
}
function distract(it, pool, n, by) {
  const bad = (o) => o.id === it.id || o.ko === it.ko || o.cs === it.cs || o.rr === it.rr || (by === 'e' && (!o.e || o.e === it.e));
  const near = shuffle(pool.map((id) => ITEMS[id]).filter((o) => o && o.kind === it.kind && !bad(o)));
  const out = [];
  for (const o of near) { if (out.length >= n) break; if (out.some((x) => x.ko === o.ko || x.cs === o.cs || (by === 'e' && x.e === o.e))) continue; out.push(o); }
  if (out.length < n) for (const id of shuffle(ALL_WORDS)) { const o = ITEMS[id]; if (out.length >= n) break; if (!bad(o) && !out.some((x) => x.ko === o.ko || x.cs === o.cs || (by === 'e' && x.e === o.e))) out.push(o); }
  return out;
}
function mcq(type, it, pool, by) { return { type, item: it, opts: shuffle([it].concat(distract(it, pool, 3, by))) }; }
function sentEx(type, s, pool) {
  const others = shuffle(ALL_SENTS.map((id) => ITEMS[id]).filter((o) => o.id !== s.id && o.cs !== s.cs));
  if (type === 'build' || type === 'listen-build') {
    const own = s.toks.map(clean);
    const extra = uniq(others.flatMap((o) => o.toks.map((t, i) => [clean(t), clean(o.rtoks[i] || '')])).filter(([t]) => t && !own.includes(t)).map((x) => x.join('\u0001'))).slice(0, s.toks.length > 4 ? 3 : 2).map((x) => x.split('\u0001'));
    const tiles = shuffle(s.toks.map((t, i) => ({ ko: clean(t), rr: clean(s.rtoks[i] || '') })).concat(extra.map(([ko, rr]) => ({ ko, rr }))));
    return { type, item: s, tiles, picked: [] };
  }
  if (type === 'gap') {
    const idxs = s.toks.map((_, i) => i).filter((i) => clean(s.toks[i]).length > 0);
    const gi = s.toks.length > 1 ? idxs[idxs.length - 1 - rnd(Math.min(2, idxs.length))] : 0;
    const ans = { ko: clean(s.toks[gi]), rr: clean(s.rtoks[gi] || '') };
    const cand = uniq(others.flatMap((o) => o.toks.map((t, i) => clean(t) + '\u0001' + clean(o.rtoks[i] || ''))).filter((x) => !x.startsWith(ans.ko + '\u0001')));
    const ends = (x) => x.split('\u0001')[0].slice(-1) === ans.ko.slice(-1);
    const sorted = shuffle(cand.filter(ends)).concat(shuffle(cand.filter((x) => !ends(x))));
    const opts = shuffle([ans].concat(sorted.slice(0, 3).map((x) => { const [ko, rr] = x.split('\u0001'); return { ko, rr }; })));
    return { type, item: s, gi, ansObj: ans, opts };
  }
  // sent-meaning
  return { type: 'sent-meaning', item: s, opts: shuffle([s].concat(others.slice(0, 2))) };
}
function wordEx(it, pool, types) {
  const ok = types.filter((t) => (t !== 'listen' || listenOK()) && (t !== 'speak' || speakOK()) && (t !== 'picture' || it.e));
  const t = pick(ok.length ? ok : ['pick-meaning']);
  if (t === 'speak') return { type: 'speak', item: it };
  return mcq(t, it, pool, t === 'picture' ? 'e' : null);
}

function genWords(u, ids) {
  const pool = poolFor(u.id), q = [], items = ids.map((i) => ITEMS[i]);
  for (let g = 0; g < items.length; g += 3) {
    const grp = items.slice(g, g + 3);
    grp.forEach((it) => q.push({ type: 'learn', item: it }));
    grp.forEach((it, i) => q.push(mcq(i % 2 ? 'pick-meaning' : (it.e ? 'picture' : 'pick-meaning'), it, pool, i % 2 ? null : 'e')));
  }
  if (items.length >= 4) q.push({ type: 'pairs', items: shuffle(items).slice(0, 5) });
  shuffle(items).forEach((it) => q.push(wordEx(it, pool, ['pick-ko', 'listen', 'pick-ko', 'pick-meaning'])));
  if (speakOK()) shuffle(items).slice(0, 2).forEach((it) => q.push({ type: 'speak', item: it }));
  const sents = u.sents.map((s) => ITEMS[s]).filter((s) => items.some((it) => s.ko.includes(it.ko.replace(/[?]/g, ''))));
  shuffle(sents).slice(0, 2).forEach((s) => q.push(sentEx('build', s)));
  return q;
}
function genGram(u) {
  const q = [], sents = shuffle(u.sents.map((s) => ITEMS[s]));
  let k = 0;
  u.grammar.forEach((g) => {
    q.push({ type: 'tip', g });
    for (let i = 0; i < 3 && sents.length; i++) {
      const s = sents[k++ % sents.length];
      const t = i === 0 ? 'build' : i === 1 ? 'gap' : (listenOK() && s.toks.length > 1 ? 'listen-build' : 'sent-meaning');
      q.push(sentEx(t, s));
    }
  });
  if (speakOK() && sents.length) q.push({ type: 'speak', item: sents[k % sents.length] });
  return q;
}
function genDialog(u) {
  const q = [{ type: 'dialog-watch', u: u.id, shown: 1 }];
  u.dlg.forEach((l, i) => { if (l.me) q.push({ type: 'roleplay', u: u.id, i, opts: shuffle([l].concat(shuffle(MY_LINES.filter((m) => m.unit !== u.id && m.ko !== l.ko)).slice(0, 2))) }); });
  if (speakOK()) { const mine = u.dlg.filter((l) => l.me); shuffle(mine).slice(0, 2).forEach((l) => q.push({ type: 'speak', item: { id: null, ko: l.ko, rr: l.rr, cs: l.cs } })); }
  return q;
}
function genMixed(words, sents, n, pool) {
  const q = [];
  const ws = shuffle(words.map((i) => ITEMS[i])), ss = shuffle(sents.map((i) => ITEMS[i]));
  const nS = Math.min(ss.length, Math.round(n * 0.35)), nW = n - nS;
  ws.slice(0, nW).forEach((it) => q.push(wordEx(it, pool, ['pick-meaning', 'pick-ko', 'picture', 'listen'])));
  ss.slice(0, nS).forEach((s, i) => q.push(sentEx(['build', 'gap', 'sent-meaning', listenOK() ? 'listen-build' : 'build'][i % 4], s)));
  return shuffle(q);
}
// --- hangul generators
function sylTargets(u, n) {
  const sets = hangulSets(u.id), out = [];
  const newC = u.cons && u.cons.length ? u.cons : null, newV = u.vow && u.vow.length ? u.vow : null;
  const basicV = ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'], basicC = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅈ', 'ㅎ'];
  for (let i = 0; i < n * 3 && out.length < n; i++) {
    let l, v, t = '';
    if (u.finals) { l = pick(basicC.concat(['ㅇ', 'ㅇ'])); v = pick(basicV); t = pick(u.finals); }
    else { l = newC ? pick(newC) : pick(sets.cons); v = newV ? pick(newV) : pick(sets.vow); }
    const s = compose(l, v, t);
    if (!out.some((o) => o.s === s)) out.push({ s, l, v, t, rr: sylRR(l, v, t) || '(němé)' });
  }
  return out;
}
function sylEx(u, type) {
  const [tg] = sylTargets(u, 1), sets = hangulSets(u.id);
  if (type === 'syl-build') {
    const consPool = u.finals ? ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅈ', 'ㅎ', 'ㅇ'] : sets.cons;
    const vowPool = u.finals ? ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'] : sets.vow;
    const cOpts = shuffle(uniq([tg.l].concat(shuffle(consPool).slice(0, 5))));
    const vOpts = shuffle(uniq([tg.v].concat(shuffle(vowPool).slice(0, 5))));
    const tOpts = u.finals ? shuffle(uniq([tg.t].concat(shuffle(u.finals).slice(0, 4)))) : null;
    return { type, tg, cOpts, vOpts, tOpts, sel: { l: cOpts.length === 1 ? tg.l : null, v: null, t: u.finals ? null : '' } };
  }
  // syl-read / syl-listen: distraktory se liší v jednom prvku
  const opts = [tg];
  for (let i = 0; i < 40 && opts.length < 4; i++) {
    let l = tg.l, v = tg.v, t = tg.t; const r = rnd(u.finals ? 3 : 2);
    if (r === 0 && sets.cons.length > 1) l = pick(u.finals ? ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅈ', 'ㅎ', 'ㅇ'] : sets.cons); else if (r === 2) t = pick(u.finals); else v = pick(u.finals ? ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'] : sets.vow);
    const s = compose(l, v, t), rr = sylRR(l, v, t) || '(němé)';
    if (!opts.some((o) => o.s === s || o.rr === rr)) opts.push({ s, l, v, t, rr });
  }
  return { type, tg, opts: shuffle(opts) };
}
function jamoEx(u, type, j) {
  const isC = !!CI[j] && !VI[j];
  const sets = hangulSets(u.id), same = isC ? sets.cons : sets.vow;
  const rrOf = (x) => (CI[x] ? (CI[x].ini || 'němé') + (CI[x].fin && CI[x].fin !== CI[x].ini ? ' / ' + CI[x].fin : '') : VI[x].rr);
  const cand = shuffle(same.filter((x) => x !== j && rrOf(x) !== rrOf(j))).slice(0, 3);
  const more = shuffle((isC ? Object.keys(CI) : Object.keys(VI)).filter((x) => x !== j && !cand.includes(x))).slice(0, 3 - cand.length);
  return { type, j, rrOf, opts: shuffle([j].concat(cand, more)) };
}
function genHangul(u, step) {
  const q = [], pool = uniq(UNITS.filter((x) => x.kind === 'hangul' && x.idx <= u.idx).flatMap((x) => x.words));
  if (step === 'letters') {
    const js = (u.cons || []).concat(u.vow || []);
    js.forEach((j, i) => { q.push({ type: 'jamo-learn', u: u.id, j }); if (i % 2 === 1 || i === js.length - 1) { q.push(jamoEx(u, 'jamo-sound', js[i])); if (i > 0) q.push(jamoEx(u, 'jamo-find', js[i - 1])); } });
    shuffle(js).slice(0, 4).forEach((j, i) => q.push(jamoEx(u, i % 2 ? 'jamo-find' : 'jamo-sound', j)));
  } else if (step === 'rules') {
    u.tips.forEach((t) => q.push({ type: 'tip', g: { t: t.t, x: t.x, ex: '' } }));
    for (let i = 0; i < 6; i++) q.push(sylEx(u, 'syl-read'));
  } else if (step === 'syll') {
    for (let i = 0; i < 5; i++) q.push(sylEx(u, 'syl-read'));
    for (let i = 0; i < 4; i++) q.push(sylEx(u, 'syl-build'));
    if (listenOK()) for (let i = 0; i < 3; i++) q.push(sylEx(u, 'syl-listen'));
  } else if (step === 'words') {
    const items = u.words.map((i) => ITEMS[i]);
    for (let g = 0; g < items.length; g += 3) {
      const grp = items.slice(g, g + 3);
      grp.forEach((it) => q.push({ type: 'learn', item: it, force: 'ko' }));
      shuffle(grp).forEach((it) => q.push(mcq('word-read', it, pool, null)));
    }
    if (items.length >= 4) q.push({ type: 'pairs', items: shuffle(items).slice(0, 5) });
    if (speakOK()) q.push({ type: 'speak', item: pick(items) });
  } else { // boss
    const js = (u.cons || []).concat(u.vow || []);
    for (let i = 0; i < 4 && js.length; i++) q.push(jamoEx(u, i % 2 ? 'jamo-find' : 'jamo-sound', pick(js)));
    for (let i = 0; i < 4; i++) q.push(sylEx(u, i % 2 ? 'syl-build' : 'syl-read'));
    shuffle(u.words).slice(0, 12 - q.length).forEach((id) => q.push(mcq('word-read', ITEMS[id], pool, null)));
  }
  return q;
}

function openLesson(uid, step) {
  let q = [], c = '#0052A4', title = '', hearts = 0, unit = null;
  if (uid === 'srs') {
    const seen = Object.keys(S.srs).filter((id) => ITEMS[id]);
    let ids = step === 'due' ? shuffle(dueList()).slice(0, 15) : step === 'weak' ? seen.filter((id) => S.srs[id].w > 0).sort((a, b) => S.srs[b].w - S.srs[a].w).slice(0, 12) : shuffle(seen).slice(0, 15);
    ids = shuffle(ids);
    const pool = ALL_WORDS;
    ids.forEach((id) => { const it = ITEMS[id]; q.push(it.kind === 's' ? sentEx(pick(['build', 'gap', 'sent-meaning']), it) : wordEx(it, pool, ['pick-meaning', 'pick-ko', 'picture', 'listen'])); });
    title = 'Opakování';
    if (!q.length) { go('#/srs'); return; }
  } else {
    unit = U[uid]; if (!unit) { go('#/'); return; }
    const st = unit.steps.find((s) => s.id === step) || unit.steps[0];
    c = lineColor(uid); title = unit.name + ' · ' + st.label;
    if (unit.kind === 'hangul') q = genHangul(unit, st.id);
    else if (unit.kind === 'review') { q = genMixed(unit.words, unit.sents, 20, unit.words); hearts = 3; }
    else if (unit.kind === 'final') { q = genMixed(unit.words, unit.sents, 30, unit.words); hearts = 5; }
    else if (st.chunk != null) q = genWords(unit, unit.chunks[st.chunk]);
    else if (st.id === 'gram') q = genGram(unit);
    else if (st.id === 'dlg') q = genDialog(unit);
    else q = genMixed(unit.words, unit.sents, 12, poolFor(uid));
    if (st.id === 'boss' && unit.kind === 'hangul') hearts = 3;
    if (st.id === 'boss' && unit.kind === 'station') hearts = 3;
    step = st.id;
  }
  L = { uid, step, q, i: 0, c, title, hearts, maxHearts: hearts, ok: 0, bad: 0, xp: 0, retried: new Set(), start: Date.now() };
  const el = document.createElement('div'); el.id = 'lesson'; el.style.setProperty('--c', c);
  el.innerHTML = `<div class="lt"><button class="iconbtn" data-act="quit" aria-label="Ukončit lekci">✕</button><div class="prog"><i></i></div>${hearts ? '<span class="hearts"></span>' : ''}<div class="seg" id="l-script">${[['ko', '한'], ['both', '한+a'], ['rr', 'a']].map(([v, l]) => `<button data-act="script" data-v="${v}">${l}</button>`).join('')}</div></div><div class="body" id="exb"></div><div class="foot" id="exf"></div>`;
  document.body.appendChild(el);
  renderEx();
}

const graded = (ex) => !['learn', 'tip', 'dialog-watch', 'jamo-learn', 'speak'].includes(ex.type);
function renderEx() {
  if (!L) return;
  const ex = L.q[L.i];
  document.querySelectorAll('#l-script button').forEach((b) => b.classList.toggle('on', b.dataset.v === S.settings.script));
  $('#lesson .prog i').style.width = (L.i / L.q.length) * 100 + '%';
  const hs = $('#lesson .hearts'); if (hs) hs.textContent = '❤️'.repeat(L.hearts) + '🤍'.repeat(L.maxHearts - L.hearts);
  if (!ex) { if (!L.finished) { L.finished = true; finishLesson(); } return; }
  const b = $('#exb'), f = $('#exf');
  b.scrollTop = 0;
  (EX[ex.type] || EX.unknown)(ex, b, f);
}
function footBtn(label, act, dis) { return `<button class="btn block" data-act="${act}" ${dis ? 'disabled' : ''}>${label}</button>`; }

function feedback(ok, html) {
  const ex = L.q[L.i]; ex.done = true;
  if (graded(ex)) {
    S.stats.answers++;
    if (ok) { S.stats.correct++; L.ok++; L.xp += ex.retry ? 5 : 10; } else { L.bad++; }
    const it = ex.item;
    if (it && it.id) srsMark(it.id, ok);
    if (ex.type === 'roleplay' || ex.type === 'pairs') { /* bez SRS */ }
    if (!ok) {
      if (L.hearts) L.hearts--;
      else if (!L.retried.has(L.i)) { L.retried.add(L.i); const copy = regen(ex); if (copy) { copy.retry = true; L.q.push(copy); } }
    }
    save();
  }
  const fb = document.createElement('div'); fb.className = 'fb ' + (ok ? 'ok' : 'bad');
  const heads = ok ? ['Správně!', 'Výborně!', 'Přesně tak!', '잘했어요! Dobrá práce!', 'Paráda!'] : ['Ještě ne.', 'Skoro!', 'Tohle ne.'];
  fb.innerHTML = `<div class="h">${pick(heads)}</div><div class="d">${html || ''}</div>${footBtn('Pokračovat', 'next')}`;
  document.body.appendChild(fb);
  requestAnimationFrame(() => fb.classList.add('show'));
  $('#exf').innerHTML = '';
  if (!ok && L.hearts === 0 && L.maxHearts) { fb.querySelector('[data-act="next"]').dataset.act = 'fail'; }
}
function regen(ex) {
  const pool = L.uid === 'srs' ? ALL_WORDS : poolFor(L.uid);
  if (ex.item && ex.item.kind === 's') return sentEx(ex.type === 'sent-meaning' ? 'sent-meaning' : ex.type, ex.item);
  if (ex.item && ['pick-meaning', 'pick-ko', 'picture', 'listen', 'word-read'].includes(ex.type)) return mcq(ex.type === 'listen' && !listenOK() ? 'pick-meaning' : ex.type, ex.item, pool, ex.type === 'picture' ? 'e' : null);
  if (ex.type.startsWith('syl') && L.uid !== 'srs') return sylEx(U[L.uid], ex.type);
  if (ex.type.startsWith('jamo-') && L.uid !== 'srs') return jamoEx(U[L.uid], ex.type, ex.j);
  if (ex.type === 'roleplay') return Object.assign({}, ex, { done: false, chosen: null, opts: shuffle(ex.opts) });
  return null;
}
function itemDetail(it) {
  if (!it) return '';
  if (it.kind === 's') return `${kt(it.ko, it.rr, { force: 'both' })} ${sayBtn(it.ko)}<div>${esc(it.cs)}</div>${glossTable(it)}`;
  return `<div class="row"><span style="font-size:32px">${esc(it.e || '')}</span><div style="flex:1">${kt(it.ko, it.rr, { force: 'both' })}<div>${esc(it.cs)}</div>${it.note ? `<div class="small muted">${esc(it.note)}</div>` : ''}</div>${sayBtn(it.ko)}</div>`;
}
function finishLesson() {
  const ex0 = L; let html = '';
  $('#lesson .prog i').style.width = '100%';
  const isBoss = L.step === 'boss' && L.uid !== 'srs';
  const perfect = isBoss && L.hearts === L.maxHearts;
  let bonus = 10 + (isBoss ? 30 : 0) + (perfect ? 20 : 0);
  if (L.uid !== 'srs') {
    S.prog[L.uid] = S.prog[L.uid] || {}; const first = !S.prog[L.uid][L.step];
    S.prog[L.uid][L.step] = Date.now();
    if (isBoss && first) S.stamps[L.uid] = Date.now();
    if (perfect) S.badges.perfect = S.badges.perfect || Date.now();
  }
  addXP(L.xp + bonus);
  checkBadges();
  const acc = L.ok + L.bad ? Math.round((L.ok / (L.ok + L.bad)) * 100) : 100;
  const mins = Math.max(1, Math.round((Date.now() - L.start) / 60000));
  const u = U[L.uid];
  let next = null;
  if (u) { const ns = u.steps.find((s) => !stepDone(u.id, s.id)); if (ns) next = ['#/l/' + u.id + '/' + ns.id, '▶ ' + ns.label]; else if (UNITS[u.idx + 1]) next = ['#/u/' + UNITS[u.idx + 1].id, 'Další zastávka: ' + UNITS[u.idx + 1].name]; }
  html = `<div class="done">${isBoss ? stampHTML(L.uid, 'new') : '<div style="font-size:72px">🎉</div>'}
    <div class="big">${isBoss ? (u.kind === 'final' ? 'Máš A1! 축하해요!' : 'Razítko do pasu!') : 'Hotovo!'}</div>
    <div class="muted">${esc(L.title)}</div>
    <div class="kpis"><div><b>+${L.xp + bonus}</b><span>bodů</span></div><div><b>${acc} %</b><span>přesnost</span></div><div><b>${mins}′</b><span>čas</span></div></div>
    ${next ? `<button class="btn block" data-act="goto" data-h="${next[0]}">${esc(next[1])}</button><div class="spacer"></div>` : ''}
    <button class="btn ghost block" data-act="goto" data-h="${u ? '#/u/' + u.id : '#/srs'}">${u ? 'Zpět na zastávku' : 'Zpět na opakování'}</button></div>`;
  $('#exb').innerHTML = html; $('#exf').innerHTML = '';
  if (isBoss) say(u.ko);
  void ex0;
}

const LACT = {
  quit: () => { const u = L.uid; location.replace(u === 'srs' ? '#/srs' : '#/u/' + u); },
  goto: (el) => { const h = el.dataset.h; location.replace(h); },
  next: () => { const fb = $('.fb'); if (fb) fb.remove(); L.i++; renderEx(); },
  fail: () => {
    const fb = $('.fb'); if (fb) fb.remove();
    $('#exb').innerHTML = `<div class="done"><div style="font-size:72px">💔</div><div class="big">Došla srdce</div><p class="muted">Nevadí – tohle je trénink. Zkus to znovu, otázky se zamíchají.</p><button class="btn block" data-act="retry">Zkusit znovu</button><div class="spacer"></div><button class="btn ghost block" data-act="quit">Zpět</button></div>`;
    $('#exf').innerHTML = '';
  },
  retry: () => { const u = L.uid, s = L.step; closeLesson(); openLesson(u, s); },
  cont: () => { L.i++; renderEx(); },
  opt: (el) => { const ex = L.q[L.i]; if (ex.done) return; EXA[ex.type](ex, +el.dataset.i, el); },
  skip: (el) => {
    const k = el.dataset.k;
    if (k === 'listen' || k === 'speak') { S.mute[k] = Date.now() + 3600e3; save(); toast(k === 'listen' ? 'Poslech vypnutý na hodinu 🔇' : 'Mluvení vypnuté na hodinu 🤐'); L.q = L.q.filter((x, i) => i <= L.i || !(k === 'listen' ? ['listen', 'listen-build', 'syl-listen'] : ['speak']).includes(x.type)); }
    stopRec(true); L.i++; renderEx();
  },
  tile: (el) => { const ex = L.q[L.i]; if (ex.done) return; const i = +el.dataset.i; const p = ex.picked.indexOf(i); if (p >= 0) ex.picked.splice(p, 1); else { ex.picked.push(i); if (S.settings.audio) say(ex.tiles[i].ko); } renderEx(); },
  check: () => { const ex = L.q[L.i]; if (!ex.done) EXA[ex.type](ex); },
  jb: (el) => { const ex = L.q[L.i]; if (ex.done) return; ex.sel[el.dataset.k] = el.dataset.j; renderEx(); },
  pair: (el) => EXA.pairs(L.q[L.i], el),
  rec: () => toggleRec(),
  self: (el) => { const ok = el.dataset.v === '1'; S.stats.spoke++; if (ok) L.xp += 5; const it = L.q[L.i].item; if (it && it.id && ok) srsMark(it.id, true); save(); stopRec(true); L.i++; renderEx(); },
  asr: () => runASR(),
  dnext: () => { const ex = L.q[L.i]; const d = U[ex.u].dlg; if (ex.shown < d.length) { ex.shown++; renderEx(); } else { L.i++; renderEx(); } },
  trans: () => { L.showTr = !L.showTr; renderEx(); },
};

// ----- exercise renderers -----
const skipBar = (kinds) => `<div class="skipbar">${kinds.includes('listen') ? '<button data-act="skip" data-k="listen">🔇 Teď nemůžu poslouchat</button>' : ''}${kinds.includes('speak') ? '<button data-act="skip" data-k="speak">🤐 Teď nemůžu mluvit</button>' : ''}<button data-act="skip" data-k="one">Přeskočit</button></div>`;
const optList = (ex, fn, cls = '') => `<div class="opts ${cls}">${ex.opts.map((o, i) => `<button class="opt ${cls === 'two' ? 'pic' : ''} ${ex.done && i === ex.ans ? 'right' : ''} ${ex.done && i === ex.chosen && ex.chosen !== ex.ans ? 'wrong' : ''}" data-act="opt" data-i="${i}" ${ex.done ? 'disabled' : ''}>${fn(o, i)}</button>`).join('')}</div>`;
const EX = {
  unknown(ex, b, f) { b.innerHTML = '<p>?</p>'; f.innerHTML = footBtn('Dál', 'cont'); },
  learn(ex, b, f) {
    const it = ex.item; srsSeen(it.id); save();
    const force = ex.force || null;
    b.innerHTML = `<div class="q">Nové slovo</div><div class="prompt"><div class="big">${esc(it.e)}</div>${kt(it.ko, it.rr, { size: 'xl', force })}<div class="cz">${esc(it.cs)}</div>${it.note ? `<div class="note">💡 ${esc(it.note)}</div>` : ''}<div class="row">${sayBtn(it.ko)}${slowBtn(it.ko)}</div></div>${S.settings.script === 'ko' ? '<p class="small muted" style="text-align:center">Klepni na korejské slovo pro přepis.</p>' : ''}`;
    f.innerHTML = footBtn('Dál', 'cont');
    if (!ex.played) { ex.played = 1; autoSay(it.ko); }
  },
  tip(ex, b, f) {
    const g = ex.g;
    b.innerHTML = `<div class="q">Jak to funguje</div><div class="card tipcard"><h3>🧠 ${esc(g.t)}</h3><p>${esc(g.x)}</p>${(g.ex || '').split('\n').filter(Boolean).map((l) => { const [ko, rr, cs] = l.split('|'); return `<div class="exl"><span class="tx">${kt(ko, rr)}<div class="cs">${esc(cs)}</div></span>${ko.includes('→') ? '' : sayBtn(ko)}</div>`; }).join('')}</div>`;
    f.innerHTML = footBtn('Rozumím', 'cont');
  },
  'pick-meaning'(ex, b, f) {
    const it = ex.item;
    b.innerHTML = `<div class="q">Co to znamená?</div><div class="prompt">${ktI(it, { size: 'xl' })}<div class="row">${sayBtn(it.ko)}</div></div>${optList(ex, (o) => `<span class="em">${esc(o.e)}</span><span>${esc(o.cs)}</span>`)}`;
    f.innerHTML = ''; ex.ans = ex.opts.indexOf(it);
    if (!ex.played) { ex.played = 1; autoSay(it.ko); }
  },
  'word-read'(ex, b, f) {
    const it = ex.item; ex.ans = ex.opts.indexOf(it);
    b.innerHTML = `<div class="q">Přečti a vyber význam</div><div class="prompt"><span class="k xl"><span class="hg">${esc(it.ko)}</span></span>${ex.done ? `<div class="cz">${esc(it.rr)}</div>` : ''}</div>${optList(ex, (o) => `<span class="em">${esc(o.e)}</span><span>${esc(o.cs)}</span>`)}`;
    f.innerHTML = '';
  },
  'pick-ko'(ex, b, f) {
    const it = ex.item; ex.ans = ex.opts.indexOf(it);
    b.innerHTML = `<div class="q">Jak se řekne korejsky?</div><div class="prompt"><div class="big">${esc(it.e)}</div><div class="cz">${esc(it.cs)}</div></div>${optList(ex, (o) => ktI(o, { noReveal: true }))}`;
    f.innerHTML = '';
  },
  picture(ex, b, f) {
    const it = ex.item; ex.ans = ex.opts.indexOf(it);
    b.innerHTML = `<div class="q">Vyber obrázek</div><div class="prompt">${ktI(it, { size: 'lg' })}<div class="row">${sayBtn(it.ko)}</div></div>${optList(ex, (o) => esc(o.e), 'two')}`;
    f.innerHTML = '';
    if (!ex.played) { ex.played = 1; autoSay(it.ko); }
  },
  listen(ex, b, f) {
    const it = ex.item; ex.ans = ex.opts.indexOf(it);
    b.innerHTML = `<div class="q">Poslechni si a vyber význam</div><div class="prompt"><button class="bigsay" data-act="say" data-t="${esc(it.ko)}">🔊</button><div class="row">${slowBtn(it.ko)}</div>${ex.done ? ktI(it, { force: 'both' }) : ''}</div>${optList(ex, (o) => `<span class="em">${esc(o.e)}</span><span>${esc(o.cs)}</span>`)}${ex.done ? '' : skipBar(['listen'])}`;
    f.innerHTML = '';
    if (!ex.played) { ex.played = 1; setTimeout(() => say(it.ko), 200); }
  },
  pairs(ex, b, f) {
    if (!ex.left) { ex.left = shuffle(ex.items.map((_, i) => i)); ex.right = shuffle(ex.items.map((_, i) => i)); ex.gone = []; ex.miss = 0; }
    b.innerHTML = `<div class="q">Spoj dvojice</div><div class="pairs"><div class="opts">${ex.left.map((i) => `<button class="opt ${ex.gone.includes(i) ? 'gone' : ''} ${ex.sl === i ? 'sel' : ''}" data-act="pair" data-side="l" data-i="${i}">${ktI(ex.items[i], { noReveal: true })}</button>`).join('')}</div><div class="opts">${ex.right.map((i) => `<button class="opt ${ex.gone.includes(i) ? 'gone' : ''} ${ex.sr === i ? 'sel' : ''}" data-act="pair" data-side="r" data-i="${i}"><span class="em">${esc(ex.items[i].e)}</span> ${esc(ex.items[i].cs)}</button>`).join('')}</div></div>`;
    f.innerHTML = '';
  },
  build(ex, b, f, listen) {
    const s = ex.item;
    const prompt = listen ? `<button class="bigsay" data-act="say" data-t="${esc(s.ko)}">🔊</button><div class="row">${slowBtn(s.ko)}</div>${L.showTr ? `<div class="cz">${esc(s.cs)}</div>` : ''}` : `<div class="cz">${esc(s.cs)}</div>`;
    b.innerHTML = `<div class="q">${listen ? 'Poskládej, co slyšíš' : 'Přelož do korejštiny'}</div><div class="prompt">${prompt}</div>
      <div class="answer">${ex.picked.map((i) => `<button class="tile" data-act="tile" data-i="${i}">${kt(ex.tiles[i].ko, ex.tiles[i].rr, { noReveal: true })}</button>`).join('')}</div>
      <div class="tiles">${ex.tiles.map((t, i) => `<button class="tile ${ex.picked.includes(i) ? 'used' : ''}" data-act="tile" data-i="${i}">${kt(t.ko, t.rr, { noReveal: true })}</button>`).join('')}</div>
      ${listen && !ex.done ? skipBar(['listen']) + (L.showTr ? '' : '<div class="skipbar"><button data-act="trans">Ukaž překlad</button></div>') : ''}`;
    f.innerHTML = ex.done ? '' : footBtn('Zkontrolovat', 'check', !ex.picked.length);
    if (listen && !ex.played) { ex.played = 1; setTimeout(() => say(s.ko), 200); }
  },
  'listen-build'(ex, b, f) { EX.build(ex, b, f, true); },
  gap(ex, b, f) {
    const s = ex.item;
    const sent = s.toks.map((t, i) => i === ex.gi ? `<span class="gap">${ex.done ? kt(ex.ansObj.ko, ex.ansObj.rr, { noReveal: true }) : '&nbsp;'}</span>` : `<span class="tok">${kt(t, s.rtoks[i] || '', { noReveal: true })}</span>`).join(' ');
    b.innerHTML = `<div class="q">Doplň chybějící slovo</div><div class="prompt"><div class="sent">${sent}</div><div class="cz">${esc(s.cs)}</div></div>${optList(ex, (o) => kt(o.ko, o.rr, { noReveal: true }))}`;
    ex.ans = ex.opts.indexOf(ex.ansObj);
    f.innerHTML = '';
  },
  'sent-meaning'(ex, b, f) {
    const s = ex.item; ex.ans = ex.opts.indexOf(s);
    b.innerHTML = `<div class="q">Co znamená tahle věta?</div><div class="prompt"><div class="sent">${tokHTML(s, true)}</div><div class="row">${sayBtn(s.ko)}${slowBtn(s.ko)}</div><div class="small muted">Klepni na slovo pro nápovědu.</div></div>${optList(ex, (o) => esc(o.cs))}`;
    f.innerHTML = '';
    if (!ex.played) { ex.played = 1; autoSay(s.ko); }
  },
  'dialog-watch'(ex, b, f) {
    const u = U[ex.u], d = u.dlg;
    b.innerHTML = `<div class="q">Scénka: ${esc(u.dialog.face)} ${esc(u.dialog.who)} a ty</div><div class="chat">${d.slice(0, ex.shown).map((l) => bubble(u, l, true)).join('')}</div>`;
    f.innerHTML = footBtn(ex.shown < d.length ? 'Další replika' : 'Teď hraješ ty! ▶', 'dnext');
    const last = d[ex.shown - 1]; if (ex.lastSaid !== ex.shown) { ex.lastSaid = ex.shown; autoSay(last.ko); }
    setTimeout(() => { b.scrollTop = b.scrollHeight; }, 30);
  },
  roleplay(ex, b, f) {
    const u = U[ex.u], d = u.dlg, line = d[ex.i];
    const hist = d.slice(Math.max(0, ex.i - 3), ex.i);
    ex.ans = ex.opts.indexOf(line);
    b.innerHTML = `<div class="q">Co odpovíš?</div><div class="chat">${hist.map((l) => bubble(u, l, false)).join('')}${ex.done ? bubble(u, line, true) : '<div class="bub me typing">…</div>'}</div>${optList(ex, (o) => `<span>${kt(o.ko, o.rr, { noReveal: true })}<div class="small muted">${esc(o.cs)}</div></span>`)}`;
    f.innerHTML = '';
    const prev = d[ex.i - 1]; if (prev && !prev.me && !ex.played) { ex.played = 1; autoSay(prev.ko); }
    setTimeout(() => { b.scrollTop = b.scrollHeight; }, 30);
  },
  speak(ex, b, f) {
    const it = ex.item;
    b.innerHTML = `<div class="q">Řekni nahlas</div><div class="prompt">${it.e ? `<div class="big">${esc(it.e)}</div>` : ''}${kt(it.ko, it.rr, { size: 'lg', force: S.settings.script === 'ko' ? 'ko' : 'both' })}<div class="cz">${esc(it.cs)}</div><div class="row">${sayBtn(it.ko)}${slowBtn(it.ko)}</div></div>
    <div style="text-align:center"><button class="bigsay" id="recb" data-act="rec" style="background:${rec.on ? 'var(--bad)' : 'var(--c)'}">${rec.on ? '⏹' : '🎙️'}</button><div class="small muted" id="recs">${rec.on ? 'Nahrávám… klepni pro stop' : rec.url ? 'Poslechni si sebe a porovnej s předlohou' : 'Poslechni předlohu, pak klepni a řekni to'}</div><div id="asr" class="small"></div></div>
    ${rec.url && !rec.on ? `<div class="row" style="justify-content:center;margin-top:10px"><button class="btn ghost" data-act="say" data-t="${esc(it.ko)}">🔊 Předloha</button><button class="btn ghost" id="pmine">▶ Já</button></div>` : ''}
    ${('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && navigator.onLine ? '<div class="skipbar"><button data-act="asr">🌐 Ověřit rozpoznáním řeči (online)</button></div>' : ''}
    ${skipBar(['speak'])}`;
    f.innerHTML = rec.url && !rec.on ? `<div class="row"><button class="btn ghost" style="flex:1" data-act="self" data-v="0">🔁 Ještě ne</button><button class="btn ok" style="flex:1" data-act="self" data-v="1">👍 Sedí</button></div>` : '';
    const pm = $('#pmine'); if (pm) pm.onclick = () => { const a = new Audio(rec.url); a.play(); };
    if (!ex.played) { ex.played = 1; rec.url = null; autoSay(it.ko); }
  },
  'jamo-learn'(ex, b, f) {
    const j = ex.j, c = CI[j], v = VI[j];
    const info = c ? { rr: c.ini ? (c.fin && c.fin !== c.ini ? `${c.ini} (na konci ${c.fin})` : c.ini) : `němé (na konci ${c.fin})`, hint: c.hint, mn: c.mn, say: c.say } : { rr: v.rr, hint: v.hint, mn: v.mn, say: v.say };
    const u = U[ex.u];
    const w = u.words.map((id) => ITEMS[id]).find((it) => [...it.ko].some((ch) => { const d = decompose(ch); return d && d.includes(j); }));
    b.innerHTML = `<div class="q">Nové písmeno</div><div class="prompt"><div class="jamo">${esc(j)}</div><div class="cz">přepis: ${esc(info.rr)}</div><div class="note">zní jako: <b>${esc(info.hint)}</b></div><div class="note">🧠 ${esc(info.mn)}</div><div class="row"><span class="k lg"><span class="hg">${esc(info.say)}</span></span>${sayBtn(info.say)}</div></div>
    ${w ? `<div class="card"><div class="small muted">Ve slově</div><div class="wl"><span class="em">${esc(w.e)}</span><span class="tx"><span class="k"><span class="hg" style="font-size:22px">${esc(w.ko)}</span><span class="rr">${esc(w.rr)}</span></span><div class="cs">${esc(w.cs)}</div></span>${sayBtn(w.ko)}</div></div>` : ''}`;
    f.innerHTML = footBtn('Dál', 'cont');
    if (!ex.played) { ex.played = 1; autoSay(info.say); }
  },
  'jamo-sound'(ex, b, f) {
    ex.ans = ex.opts.indexOf(ex.j);
    b.innerHTML = `<div class="q">Jak se čte tohle písmeno?</div><div class="prompt"><div class="jamo">${esc(ex.j)}</div></div>${optList(ex, (o) => `<b>${esc(ex.rrOf(o))}</b>`)}`;
    f.innerHTML = '';
  },
  'jamo-find'(ex, b, f) {
    ex.ans = ex.opts.indexOf(ex.j); const sy = CI[ex.j] ? CI[ex.j].say : VI[ex.j].say;
    b.innerHTML = `<div class="q">Najdi písmeno</div><div class="prompt"><div class="cz" style="font-size:30px">${esc(ex.rrOf(ex.j))}</div><div class="row">${sayBtn(sy)}</div></div>${optList(ex, (o) => `<span style="font-size:34px;font-weight:900;width:100%;text-align:center">${esc(o)}</span>`)}`;
    f.innerHTML = '';
  },
  'syl-read'(ex, b, f) {
    ex.ans = ex.opts.indexOf(ex.tg);
    b.innerHTML = `<div class="q">Přečti slabiku</div><div class="prompt"><div class="sylblock">${esc(ex.tg.s)}</div></div>${optList(ex, (o) => `<b>${esc(o.rr)}</b>`)}`;
    f.innerHTML = '';
  },
  'syl-listen'(ex, b, f) {
    ex.ans = ex.opts.indexOf(ex.tg);
    b.innerHTML = `<div class="q">Kterou slabiku slyšíš?</div><div class="prompt"><button class="bigsay" data-act="say" data-t="${esc(ex.tg.s)}">🔊</button></div>${optList(ex, (o) => `<span style="font-size:32px;font-weight:900;width:100%;text-align:center">${esc(o.s)}</span>`)}${ex.done ? '' : skipBar(['listen'])}`;
    f.innerHTML = '';
    if (!ex.played) { ex.played = 1; setTimeout(() => say(ex.tg.s), 200); }
  },
  'syl-build'(ex, b, f) {
    const sl = ex.sel, cur = sl.l && sl.v ? compose(sl.l, sl.v, sl.t || '') : (sl.l || '') + (sl.v || '');
    const row = (lab, k, arr) => `<div class="jrow"><div class="lab">${lab}</div>${arr.map((j) => `<button class="jbtn ${sl[k] === j ? 'sel' : ''}" data-act="jb" data-k="${k}" data-j="${j}">${j}</button>`).join('')}</div>`;
    b.innerHTML = `<div class="q">Slož slabiku</div><div class="prompt"><div class="cz" style="font-size:30px">${esc(ex.tg.rr)}</div><div class="row">${sayBtn(ex.tg.s)}</div></div>
    <div style="text-align:center;margin-bottom:14px"><div class="sylblock">${esc(cur) || '?'}</div></div>
    ${ex.cOpts.length > 1 ? row('Souhláska', 'l', ex.cOpts) : ''}${row('Samohláska', 'v', ex.vOpts)}${ex.tOpts ? row('Koncová', 't', ex.tOpts) : ''}`;
    f.innerHTML = ex.done ? '' : footBtn('Zkontrolovat', 'check', !(sl.l && sl.v && (sl.t !== null)));
  },
};
function bubble(u, l, showTr) {
  return `<div class="bub ${l.me ? 'me' : ''}"><div class="who">${l.me ? 'Ty' : esc(u.dialog.face + ' ' + u.dialog.who)}</div>${kt(l.ko, l.rr)} ${sayBtn(l.ko).replace('class="say"', 'class="say" style="display:inline-grid;width:30px;height:30px;font-size:14px;vertical-align:middle"')}${showTr ? `<div class="tr">${esc(l.cs)}</div>` : ''}</div>`;
}

// ----- answer handlers -----
function mcqAnswer(ex, i, detailFn) {
  ex.chosen = i; const ok = i === ex.ans; ex.done = true;
  renderEx();
  feedback(ok, detailFn(ok));
}
const EXA = {
  'pick-meaning': (ex, i) => mcqAnswer(ex, i, () => itemDetail(ex.item)),
  'word-read': (ex, i) => { say(ex.item.ko); mcqAnswer(ex, i, () => itemDetail(ex.item)); },
  'pick-ko': (ex, i) => { say(ex.item.ko); mcqAnswer(ex, i, (ok) => itemDetail(ex.item) + (!ok && ex.opts[i] ? `<div class="small muted" style="margin-top:8px">Tys vybral: ${kt(ex.opts[i].ko, ex.opts[i].rr, { force: 'both' })} = ${esc(ex.opts[i].cs)}</div>` : '')); },
  picture: (ex, i) => mcqAnswer(ex, i, (ok) => itemDetail(ex.item) + (!ok ? `<div class="small muted" style="margin-top:8px">${esc(ex.opts[i].e)} = ${kt(ex.opts[i].ko, ex.opts[i].rr, { force: 'both' })} (${esc(ex.opts[i].cs)})</div>` : '')),
  listen: (ex, i) => mcqAnswer(ex, i, () => itemDetail(ex.item)),
  'sent-meaning': (ex, i) => mcqAnswer(ex, i, () => itemDetail(ex.item)),
  gap: (ex, i) => { mcqAnswer(ex, i, () => itemDetail(ex.item)); say(ex.item.ko); },
  roleplay: (ex, i) => {
    const line = U[ex.u].dlg[ex.i];
    mcqAnswer(ex, i, (ok) => `${kt(line.ko, line.rr, { force: 'both' })} ${sayBtn(line.ko)}<div>${esc(line.cs)}</div>${!ok ? `<div class="small muted" style="margin-top:8px">„${esc(ex.opts[i].cs)}" se sem nehodí.</div>` : ''}`);
    say(line.ko);
  },
  'jamo-sound': (ex, i) => { const sy = CI[ex.j] ? CI[ex.j].say : VI[ex.j].say; say(sy); mcqAnswer(ex, i, () => `<b style="font-size:28px">${esc(ex.j)}</b> = ${esc(ex.rrOf(ex.j))} · ${esc((CI[ex.j] || VI[ex.j]).hint)}<div class="small muted">🧠 ${esc((CI[ex.j] || VI[ex.j]).mn)}</div>`); },
  'jamo-find': (ex, i) => EXA['jamo-sound'](ex, i),
  'syl-read': (ex, i) => { say(ex.tg.s); mcqAnswer(ex, i, () => sylDetail(ex.tg)); },
  'syl-listen': (ex, i) => mcqAnswer(ex, i, () => sylDetail(ex.tg)),
  'syl-build': (ex) => {
    const sl = ex.sel, s = compose(sl.l, sl.v, sl.t || ''); const ok = s === ex.tg.s; ex.done = true; say(ex.tg.s); renderEx();
    feedback(ok, sylDetail(ex.tg) + (ok ? '' : `<div class="small muted">Tys složil ${esc(s)} = ${esc(sylRR(sl.l, sl.v, sl.t || '') || '(němé)')}</div>`));
  },
  build: (ex) => {
    const s = ex.item, got = ex.picked.map((i) => ex.tiles[i].ko).join(' '), want = s.toks.map(clean).join(' ');
    ex.done = true; renderEx(); say(s.ko);
    feedback(got === want, itemDetail(s));
  },
  'listen-build': (ex) => EXA.build(ex),
  pairs: (ex, el) => {
    if (ex.done) return;
    const i = +el.dataset.i, side = el.dataset.side;
    if (side === 'l') { ex.sl = i; say(ex.items[i].ko); } else ex.sr = i;
    if (ex.sl != null && ex.sr != null) {
      if (ex.sl === ex.sr) { ex.gone.push(ex.sl); }
      else { ex.miss++; toast('Tohle k sobě nepatří'); }
      ex.sl = null; ex.sr = null;
    }
    renderEx();
    if (ex.gone.length === ex.items.length) { ex.done = true; ex.items.forEach((it) => srsMark(it.id, true)); feedback(ex.miss <= 1, ex.miss ? `Chyby: ${ex.miss}` : 'Bez jediné chyby!'); }
  },
};
function sylDetail(tg) {
  const parts = [tg.l, tg.v, tg.t].filter(Boolean).map((j) => `${j} = ${CI[j] && j === tg.t ? CI[j].fin : CI[j] ? (CI[j].ini || 'němé') : VI[j].rr}`).join(' · ');
  return `<div class="row"><div class="sylblock" style="width:76px;height:76px;font-size:44px">${esc(tg.s)}</div><div><b style="font-size:22px">${esc(tg.rr)}</b><div class="small muted">${esc(parts)}</div></div>${sayBtn(tg.s)}</div>`;
}

// ----- recording (offline) + optional online recognition -----
const rec = { on: false, url: null, mr: null, stream: null, t: null };
async function toggleRec() {
  if (rec.on) { stopRec(); return; }
  try {
    rec.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    rec.mr = new MediaRecorder(rec.stream);
    rec.mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.mr.onstop = () => {
      if (rec.stream) rec.stream.getTracks().forEach((t) => t.stop());
      rec.stream = null;
      if (rec.discard) { rec.discard = false; return; }
      rec.url = URL.createObjectURL(new Blob(chunks, { type: rec.mr.mimeType || 'audio/webm' }));
      rec.on = false; renderEx();
      const a = new Audio(rec.url); a.play().catch(() => {});
    };
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    rec.mr.start(); rec.on = true; renderEx();
    const it = L.q[L.i].item; clearTimeout(rec.t);
    rec.t = setTimeout(() => rec.on && stopRec(), Math.min(9000, 2200 + it.ko.length * 280));
  } catch (e) {
    toast('Mikrofon není dostupný – povol ho v prohlížeči, nebo cvičení přeskoč.');
  }
}
function stopRec(discard) {
  clearTimeout(rec.t);
  if (discard) { rec.discard = true; rec.url = null; }
  if (rec.mr && rec.mr.state !== 'inactive') { try { rec.mr.stop(); } catch (e) { /* */ } }
  else if (rec.stream) { rec.stream.getTracks().forEach((t) => t.stop()); rec.stream = null; }
  rec.on = false;
}
function jamoSeq(s) { return [...s.replace(/[^가-힣]/g, '')].flatMap((ch) => decompose(ch) || []).filter(Boolean); }
function similarity(a, b) {
  const x = jamoSeq(a), y = jamoSeq(b); if (!x.length || !y.length) return 0;
  const d = Array.from({ length: x.length + 1 }, (_, i) => [i].concat(Array(y.length).fill(0)));
  for (let j = 1; j <= y.length; j++) d[0][j] = j;
  for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return Math.max(0, 1 - d[x.length][y.length] / Math.max(x.length, y.length));
}
function runASR() {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) return;
  const it = L.q[L.i].item, out = $('#asr');
  try {
    const r = new R(); r.lang = 'ko-KR'; r.maxAlternatives = 3; r.interimResults = false;
    out.textContent = '🎧 Poslouchám…';
    r.onresult = (e) => {
      const alts = [...e.results[0]].map((x) => x.transcript);
      const best = alts.map((t) => [t, similarity(t, it.ko)]).sort((a, b) => b[1] - a[1])[0];
      const p = Math.round(best[1] * 100);
      out.innerHTML = `Slyšel jsem: <b>${esc(best[0])}</b> · shoda ${p} % ${p >= 80 ? '🎉' : p >= 50 ? '👍' : '🔁'}`;
      if (p >= 80) { S.stats.spoke++; save(); }
    };
    r.onerror = (e) => { out.textContent = e.error === 'network' ? 'Rozpoznávání potřebuje internet – nahraj se a porovnej sám.' : 'Nepovedlo se rozpoznat (' + e.error + ').'; };
    r.start();
  } catch (e) { out.textContent = 'Rozpoznávání není dostupné.'; }
}

// ================= start =================
function welcome() {
  if (S.welcomed) return;
  S.welcomed = 1; save();
  modal(`<h2>안녕하세요! 👋</h2><p>Vítej v kurzu <b>길 · Cesta po Koreji</b>. Pojedeš linkami soulského metra od písma až po závěrečnou zkoušku A1. Každá zastávka = nová slovíčka, gramatika, scénka a razítko do pasu.</p>
  <div class="tipc"><b>한 · 한+a · a</b>Přepínač nahoře mění zobrazení: jen hangul, hangul s přepisem, nebo jen přepis. V režimu 한 klepni na slovo a přepis se ukáže.</div>
  <div class="tipc"><b>🔊 Hlas offline</b>Aby appka uměla číst korejsky i v letadle, stáhni si v telefonu korejský hlas. Návod najdeš v ⚙️ Nastavení.</div>
  <div class="tipc"><b>🔓 Spěcháš?</b>Zastávky se odemykají postupně, ale na každou můžeš skočit hned. Nebo si je odemkni všechny najednou.</div>
  <div class="row wrap"><button class="btn" data-act="close">Jdeme na to</button><button class="btn ghost" data-act="unlockall">Odemknout vše</button></div>`);
}
ACT.unlockall = () => { S.settings.unlockAll = true; save(); closeModal(); route(); toast('Všechny zastávky jsou odemčené 🔓'); };
document.addEventListener('visibilitychange', () => { if (document.hidden && 'speechSynthesis' in window) speechSynthesis.cancel(); });
route();
welcome();

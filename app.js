'use strict';
(function () {

/* ============ DATI DAL PIANO (PDF) ============ */
const SLOTS = [
  { id: 'colazione', name: 'Colazione', short: 'Col', icon: '☕️', type: 'colazione' },
  { id: 'sp_mattina', name: 'Spuntino mattina', short: 'Sp.M', icon: '🍎', type: 'spuntino' },
  { id: 'pranzo', name: 'Pranzo', short: 'Pra', icon: '🍝', type: 'main' },
  { id: 'merenda', name: 'Merenda', short: 'Mer', icon: '🍌', type: 'spuntino' },
  { id: 'cena', name: 'Cena', short: 'Cen', icon: '🍽️', type: 'main' },
  { id: 'sp_sera', name: 'Spuntino sera (opzionale)', short: 'Sp.S', icon: '🌙', type: 'spuntino', optional: true }
];

const COLAZ = [
  { id: 'c1', name: 'Opz. 1 – Latte e cereali', items: ['Latte 250 ml', 'Cereali 40-50 g', 'Frutta fresca', 'Frutta secca 10-15 g'] },
  { id: 'c2', name: 'Opz. 2 – Pane e crema alla nocciola', items: ['Pane 80 g', 'Crema alla nocciola 20 g', 'Latte 200-250 ml', 'Un frutto'] },
  { id: 'c3', name: 'Opz. 3 – Pancake', items: ['2-3 pancake (farina, uova, latte)', 'Marmellata o miele', 'Un bicchiere di latte', 'Frutta fresca'], tags: ['Uova'] },
  { id: 'c4', name: 'Opz. 4 – Pane e marmellata', items: ['Pane 80-100 g', 'Marmellata 25-30 g', 'Latte 250 ml', 'Mandorle o noci 15 g'] },
  { id: 'c5', name: 'Opz. 5 – Colazione salata', items: ['Pane 80 g', '2 uova', 'Una piccola porzione di formaggio', 'Un frutto'], salata: true, tags: ['Uova'] },
  { id: 'c6', name: 'Opz. 6 – Toast', items: ['Pane da toast 100 g', 'Prosciutto cotto 50 g', 'Formaggio 30 g', 'Un frutto'], salata: true }
];

const SPUNT = [
  { id: 's1', name: 'Opz. 1', items: ['Banana', 'Mandorle o noci 20 g'] },
  { id: 's2', name: 'Opz. 2', items: ['Panino 60-80 g', 'Prosciutto cotto o crudo 40-50 g'] },
  { id: 's3', name: 'Opz. 3', items: ['Yogurt da bere 200 ml', 'Un frutto', 'Eventualmente qualche biscotto'] },
  { id: 's4', name: 'Opz. 4', items: ['Pane 50-60 g', 'Crema 100% arachidi 15-20 g'] },
  { id: 's5', name: 'Opz. 5', items: ['Frullato con latte 200 ml', 'Una banana', 'Cacao'] },
  { id: 's6', name: 'Opz. 6', items: ['Pane 60 g', 'Mozzarella 60-80 g'], tags: ['Mozzarella'] }
];
const OPT_BY_ID = {};
COLAZ.concat(SPUNT).forEach(o => OPT_BY_ID[o.id] = o);

const CARBS = [
  ['Pasta', '80-100 g (a crudo)'], ['Riso', '80-100 g (a crudo)'], ['Cous cous', '80-100 g (a crudo)'],
  ['Farro', '80-100 g (a crudo)'], ['Pane', '100-120 g'], ['Patate', '250-350 g'], ['Gnocchi', '180-220 g']
];
const PROTS = [
  ['Pollo', '150-180 g', 'Carne bianca'], ['Tacchino', '150-180 g', 'Carne bianca'],
  ['Carne rossa', '150-180 g', 'Carne rossa'], ['Pesce', '180-200 g', 'Pesce'],
  ['Tonno al naturale', '120-150 g sgocciolato', 'Pesce'], ['Uova', '2 uova', 'Uova'],
  ['Mozzarella', '100-125 g', 'Latticini'], ['Ricotta', '100-150 g', 'Latticini'],
  ['Ceci', '150-200 g cotti', 'Legumi'], ['Lenticchie', '150-200 g cotte', 'Legumi'], ['Fagioli', '150-200 g cotti', 'Legumi']
];
const GROUPS = ['Carne bianca', 'Carne rossa', 'Pesce', 'Uova', 'Latticini', 'Legumi'];
const VEG = ['Zucchine', 'Carote', 'Melanzane', 'Fagiolini', 'Pomodori', 'Peperoni', 'Lattuga', 'Zucca'];
const VEG_QTY = '150-200 g a pasto';
const FATS = [['Olio extravergine', '1-2 cucchiai'], ['Frutta secca', '20-30 g'], ['Avocado', '50-80 g'], ['Parmigiano', '20-30 g']];

const COMBOS = [
  { l: 'Pasta al pomodoro + pollo + zucchine', s: 'pranzo', carb: 'Pasta', prot: 'Pollo', veg: ['Zucchine'] },
  { l: 'Pasta al pesto + mozzarella + pomodori', s: 'pranzo', carb: 'Pasta', prot: 'Mozzarella', veg: ['Pomodori'] },
  { l: 'Riso + tonno + zucchine', s: 'pranzo', carb: 'Riso', prot: 'Tonno al naturale', veg: ['Zucchine'] },
  { l: 'Cous cous + ceci + carote', s: 'pranzo', carb: 'Cous cous', prot: 'Ceci', veg: ['Carote'] },
  { l: 'Pasta al ragù + verdure', s: 'pranzo', carb: 'Pasta', prot: 'Carne rossa', veg: [] },
  { l: 'Gnocchi al pomodoro + parmigiano', s: 'pranzo', carb: 'Gnocchi', fat: ['Parmigiano'] },
  { l: 'Riso + salmone + carote', s: 'cena', carb: 'Riso', prot: 'Pesce', veg: ['Carote'] },
  { l: 'Patate + tacchino + fagiolini', s: 'cena', carb: 'Patate', prot: 'Tacchino', veg: ['Fagiolini'] },
  { l: 'Pane + uova + verdure', s: 'cena', carb: 'Pane', prot: 'Uova', veg: [] },
  { l: 'Pasta + ricotta + melanzane', s: 'cena', carb: 'Pasta', prot: 'Ricotta', veg: ['Melanzane'] },
  { l: 'Pesce + patate + zucchine', s: 'cena', carb: 'Patate', prot: 'Pesce', veg: ['Zucchine'] },
  { l: 'Pane + carne + peperoni', s: 'cena', carb: 'Pane', prot: 'Carne rossa', veg: ['Peperoni'] },
  { l: 'Piatto unico: pasta con ragù', s: 'unico', carb: 'Pasta', prot: 'Carne rossa', veg: [] },
  { l: 'Piatto unico: riso con pollo e verdure', s: 'unico', carb: 'Riso', prot: 'Pollo', veg: [] },
  { l: 'Piatto unico: pasta con tonno e zucchine', s: 'unico', carb: 'Pasta', prot: 'Tonno al naturale', veg: ['Zucchine'] },
  { l: 'Piatto unico: cous cous con ceci e verdure', s: 'unico', carb: 'Cous cous', prot: 'Ceci', veg: [] },
  { l: 'Piatto unico: pasta con ricotta e pomodoro', s: 'unico', carb: 'Pasta', prot: 'Ricotta', veg: ['Pomodori'] }
];

const PRE_TRAIN = ['Pane e marmellata', 'Banana e frutta secca', 'Panino con prosciutto cotto', 'Latte e biscotti', 'Frullato di latte e banana'];
const TRAIN_TIPS = ['Non arrivare all\'allenamento a digiuno', 'Merenda prima dell\'attività', 'Pasto completo dopo l\'allenamento', 'Bere regolarmente acqua durante la giornata'];
const TRAIN_WEEK = 2, SALATA_MAX = 2, PIZZA_MAX = 1;

/* Alimenti esclusi dal piano */
const EXCL = [
  ['Philadelphia', /\bphiladelphia\b|\bphila\b/],
  ['Feta', /\bfeta\b/],
  ['Rucola', /\brucola\b|\brughetta\b/],
  ['Valeriana', /\bvaleriana\b|\bsongino\b/],
  ['Funghi', /\bfung(o|hi)\b|\bchampignon\b|\bporcin[oi]\b|\bpleurot\w*|\bprataiol\w*/],
  ['Carciofi', /\bcarciof(o|i)\b/],
  ['Broccoli', /\bbroccol(o|i|etti)\b/],
  ['Rape', /\brap(a|e)\b/],
  ['Cavolfiore', /\bcavolfior(e|i)\b/],
  ['Bietole', /\bbiet(a|e|ola|ole)\b/],
  ['Cicorie', /\bcicori(a|e)\b/],
  ['Spinaci', /\bspinac(io|i)\b/],
  ['Kiwi', /\bkiwi\b/],
  ['Yogurt al cucchiaio', /(yogurt|iogurt).*(cucchiaio|greco|denso)|(cucchiaio|greco).*(yogurt|iogurt)/]
];
const EXCL_LABELS = EXCL.map(e => e[0]);

/* ============ UTILITÀ ============ */
const KEY = 'dieta.pwa.v1';
const DAYN = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad = n => String(n).padStart(2, '0');
const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = k => { const p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const wstart = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const weekKeys = k => { const s = wstart(parse(k)); return Array.from({ length: 7 }, (_, i) => dkey(addDays(s, i))); };
const today = () => dkey(new Date());
const fmtShort = k => parse(k).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
const excluded = txt => { const s = norm(txt); for (const e of EXCL) if (e[1].test(s)) return e[0]; return null; };
const qtyOf = (arr, n) => { const f = arr.find(x => x[0] === n); return f ? f[1] : ''; };

/* ============ STATO ============ */
let db;
try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { db = null; }
if (!db || !db.days) db = { days: {} };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} };
const ui = { tab: 'week', wk: today(), date: today(), sheet: null };

const getDay = k => db.days[k] || null;
const ensureDay = k => db.days[k] || (db.days[k] = { train: false, meals: {} });
const getMeal = (k, s) => (db.days[k] && db.days[k].meals[s]) || null;
const hasSel = s => !!(s && (s.opt || s.carb || s.prot || s.pizza || (s.veg && s.veg.length) || (s.fat && s.fat.length) || (s.free && s.free.length)));

function tagsOf(sel) {
  const t = [];
  if (sel.carb) t.push(sel.carb);
  if (sel.prot) t.push(sel.prot);
  if (sel.opt) { const o = OPT_BY_ID[sel.opt]; if (o && o.tags) t.push.apply(t, o.tags); }
  return t;
}

/* Conteggi della settimana fino a 'date' incluso (escludendo eventualmente un pasto) */
function weekCounts(date, skip) {
  const out = {};
  weekKeys(date).forEach(k => {
    if (k > date) return;
    const d = getDay(k); if (!d) return;
    Object.keys(d.meals).forEach(sid => {
      if (skip && skip.date === k && skip.slot === sid) return;
      const m = d.meals[sid];
      if (!m.sel || !hasSel(m.sel)) return;
      tagsOf(m.sel).forEach(t => out[t] = (out[t] || 0) + 1);
    });
  });
  return out;
}
/* Totali dell'intera settimana per i limiti (salate, pizza, allenamenti) */
function weekTotals(date, skip) {
  const r = { salata: 0, pizza: 0, train: 0 };
  weekKeys(date).forEach(k => {
    const d = getDay(k); if (!d) return;
    if (d.train) r.train++;
    Object.keys(d.meals).forEach(sid => {
      if (skip && skip.date === k && skip.slot === sid) return;
      const s = d.meals[sid].sel; if (!s) return;
      if (s.pizza) r.pizza++;
      if (s.opt && OPT_BY_ID[s.opt] && OPT_BY_ID[s.opt].salata) r.salata++;
    });
  });
  return r;
}
function groupCounts(counts) {
  const g = {}; GROUPS.forEach(n => g[n] = 0);
  PROTS.forEach(p => g[p[2]] += counts[p[0]] || 0);
  return g;
}

/* ============ VISTA SETTIMANA ============ */
function chipsRow(counts) {
  const c = CARBS.map(x => `<span class="chip ${counts[x[0]] ? '' : 'zero'}">${esc(x[0])} <b>${counts[x[0]] || 0}×</b></span>`).join('');
  const g = groupCounts(counts);
  const p = GROUPS.map(n => `<span class="chip ${g[n] ? '' : 'zero'}">${esc(n)} <b>${g[n]}×</b></span>`).join('');
  return `<div class="small muted" style="margin-bottom:6px">Carboidrati</div><div class="chips">${c}</div>
          <div class="small muted" style="margin:10px 0 6px">Proteine</div><div class="chips">${p}</div>`;
}
function advice(counts) {
  const g = groupCounts(counts);
  const total = Object.keys(counts).length;
  if (!total) return '<div class="hint">Nessun pasto registrato finora questa settimana: scegli quello che preferisci.</div>';
  const missP = GROUPS.filter(n => !g[n]);
  const missC = CARBS.map(x => x[0]).filter(n => !counts[n]);
  const heavy = Object.keys(counts).filter(n => counts[n] >= 3);
  let h = '';
  if (heavy.length) h += `Già molto presenti: <b>${esc(heavy.join(', '))}</b>. `;
  if (missP.length) h += `Proteine non ancora viste: <b>${esc(missP.join(', '))}</b>. `;
  else h += 'Hai già coperto tutti i gruppi di proteine. ';
  if (missC.length) h += `Carboidrati non ancora usati: <b>${esc(missC.slice(0, 4).join(', '))}</b>.`;
  return `<div class="hint">${h}</div>`;
}

function renderWeek() {
  const keys = weekKeys(ui.wk), t = today();
  let done = 0, eaten = 0;
  keys.forEach(k => SLOTS.forEach(s => { const m = getMeal(k, s.id); if (m && m.done) { eaten++; if (!s.optional) done++; } }));
  const total = keys.length * SLOTS.filter(s => !s.optional).length;
  const pct = Math.round(done / total * 100);
  const tot = weekTotals(ui.wk);
  const counts = weekCounts(keys[6]);

  let grid = '<div class="wgrid"><div></div>' + SLOTS.map(s => `<div class="hd">${s.short}</div>`).join('');
  keys.forEach((k, i) => {
    const d = getDay(k);
    grid += `<div class="wrow" data-a="goday" data-date="${k}"><div class="dl ${k === t ? 'today' : ''}">${DAYN[i]}<small>${parse(k).getDate()}${d && d.train ? ' 🏋️' : ''}</small></div>`;
    SLOTS.forEach(s => {
      const m = getMeal(k, s.id);
      const cls = (m && m.done) ? 'done' : (m && hasSel(m.sel)) ? 'sel' : '';
      grid += `<div class="wcell"><span class="dot ${s.optional ? 'opt' : ''} ${cls}"></span></div>`;
    });
    grid += '</div><div class="rowline"></div>';
  });
  grid += '</div>';

  const stat = (l, v, cls) => `<div class="stat"><span>${l}</span><span class="badge ${cls || ''}">${v}</span></div>`;
  return `
  <div class="row spread">
    <div><h1 class="large">Settimana</h1><p class="subtitle">${fmtShort(keys[0])} – ${fmtShort(keys[6])}</p></div>
    <div class="weeknav"><button class="iconbtn" data-a="wk" data-n="-1" aria-label="Settimana precedente">‹</button><button class="iconbtn" data-a="wk" data-n="0" aria-label="Questa settimana">●</button><button class="iconbtn" data-a="wk" data-n="1" aria-label="Settimana successiva">›</button></div>
  </div>
  <div class="card">
    <div class="row spread"><span class="bold">Progresso settimanale</span><span class="pct">${pct}%</span></div>
    <div class="progress" style="margin:8px 0 6px"><i style="width:${pct}%"></i></div>
    <div class="small muted">${done}/${total} pasti principali consumati${eaten > done ? ' · + spuntini serali' : ''}</div>
  </div>
  <div class="card">${grid}
    <div class="legend"><span><i class="dot done"></i>Mangiato</span><span><i class="dot sel"></i>Scelto</span><span><i class="dot"></i>Vuoto</span><span><i class="dot opt"></i>Opzionale</span></div>
  </div>
  <h2 class="sec">Riepilogo</h2>
  <div class="card">
    ${stat('🏋️ Allenamenti', tot.train + '/' + TRAIN_WEEK, tot.train > TRAIN_WEEK ? 'warn' : (tot.train === TRAIN_WEEK ? 'ok' : ''))}
    ${stat('Colazioni salate (max ' + SALATA_MAX + ')', tot.salata + '/' + SALATA_MAX, tot.salata > SALATA_MAX ? 'warn' : '')}
    ${stat('🍕 Pizza (1 a settimana)', tot.pizza + '/' + PIZZA_MAX, tot.pizza > PIZZA_MAX ? 'warn' : (tot.pizza ? 'ok' : ''))}
  </div>
  <h2 class="sec">Cosa hai scelto questa settimana</h2>
  <div class="card">${chipsRow(counts)}</div>`;
}

/* ============ VISTA OGGI ============ */
function shortLine(sel) {
  if (!hasSel(sel)) return '';
  if (sel.pizza) return '🍕 Pizza';
  const p = [];
  if (sel.opt) p.push(OPT_BY_ID[sel.opt].items.slice(0, 3).join(' · '));
  if (sel.carb) p.push(sel.carb);
  if (sel.prot) p.push(sel.prot);
  if (sel.veg && sel.veg.length) p.push(sel.veg.join(', '));
  if (sel.fat && sel.fat.length) p.push(sel.fat.join(', '));
  (sel.free || []).forEach(f => p.push(f));
  return esc(p.join(' · '));
}

function renderToday() {
  const k = ui.date, t = today(), keys = weekKeys(k), d = getDay(k) || { meals: {}, train: false };
  const title = k === t ? 'Oggi' : cap(parse(k).toLocaleDateString('it-IT', { weekday: 'long' }));
  const sub = parse(k).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  const req = SLOTS.filter(s => !s.optional);
  const done = req.filter(s => { const m = d.meals[s.id]; return m && m.done; }).length;
  const planned = req.filter(s => { const m = d.meals[s.id]; return m && (m.done || hasSel(m.sel)); }).length;
  const tot = weekTotals(k);

  const strip = '<div class="strip">' + keys.map((x, i) =>
    `<button class="sday ${x === k ? 'on' : ''} ${x === t ? 't' : ''}" data-a="pickday" data-date="${x}">${DAYN[i]}<b>${parse(x).getDate()}</b></button>`).join('') + '</div>';

  const train = `<div class="card">
    <div class="row"><div class="grow"><div class="bold">🏋️ Allenamento</div><div class="small muted">${tot.train}/${TRAIN_WEEK} questa settimana</div></div>
    <button class="switch ${d.train ? 'on' : ''}" data-a="train" data-date="${k}" aria-label="Allenamento"></button></div>
    ${d.train ? `<ul class="tips">${TRAIN_TIPS.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
  </div>`;

  const meals = SLOTS.map(s => {
    const m = d.meals[s.id], line = shortLine(m && m.sel), dn = m && m.done;
    return `<div class="card meal ${dn ? 'isdone' : ''}">
      <div class="mrow" data-a="edit" data-date="${k}" data-slot="${s.id}">
        <div class="ico">${s.icon}</div>
        <div class="grow"><h3>${s.name}</h3><div class="sline ${line ? '' : 'none'}">${line || 'Tocca per pianificare'}</div></div>
        <button class="eat ${dn ? 'on' : ''}" data-a="done" data-date="${k}" data-slot="${s.id}" aria-label="Segna come mangiato">✓</button>
      </div></div>`;
  }).join('');

  const excl = `<details class="card"><summary>⛔ Alimenti esclusi dal piano</summary>
    <div class="chips" style="margin-top:10px">${EXCL_LABELS.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div></details>`;

  return `<h1 class="large">${title}</h1><p class="subtitle">${sub}</p>${strip}
    <div class="small muted" style="margin:0 6px 10px">${planned}/${req.length} pianificati · ${done}/${req.length} mangiati</div>
    ${train}${meals}${excl}`;
}

/* ============ SHEET: PIANIFICA PASTO ============ */
const root = $('sheet-root');

function pk(a, name, qty, on, cnt) {
  const c = cnt == null ? '' : `<span class="cnt ${cnt ? '' : 'z'}">${cnt ? cnt + '×' : 'nuovo'}</span>`;
  return `<button class="pk ${on ? 'on' : ''}" data-a="${a}" data-n="${esc(name)}"><div class="n"><span>${esc(name)}</span>${c}</div><div class="q">${esc(qty)}</div></button>`;
}
const tick = on => on ? '<span class="tick">✓</span>' : '';

function renderSheet() {
  const sh = ui.sheet;
  if (!sh) { root.innerHTML = ''; document.body.classList.remove('noscroll'); return; }
  const slot = SLOTS.find(s => s.id === sh.slot), sel = sh.sel;
  const prev = root.querySelector('.sheet-body');
  const st = prev ? prev.scrollTop : 0, anim = prev ? '' : ' anim';
  const skip = { date: sh.date, slot: sh.slot };
  const counts = weekCounts(sh.date, skip), tot = weekTotals(sh.date, skip);
  const day = getDay(sh.date);
  let b = Object.keys(counts).length ? advice(counts) : '';

  if (slot.type !== 'main') {
    const list = slot.type === 'colazione' ? COLAZ : SPUNT;
    if (day && day.train && slot.id !== 'colazione') {
      b += `<div class="chips" style="margin:12px 0 4px">${PRE_TRAIN.map(x => `<button class="chip" data-a="addpre" data-n="${esc(x)}">🏋️ ${esc(x)}</button>`).join('')}</div>`;
    }
    b += `<h2 class="sec">${slot.type === 'colazione' ? 'Colazione (salata max 2 a settimana)' : 'Spuntini e merende'}</h2>`;
    b += list.map(o => {
      const full = o.salata && tot.salata >= SALATA_MAX;
      return `<button class="optc ${sel.opt === o.id ? 'on' : ''}" data-a="opt" data-id="${o.id}"><div class="t"><span>${esc(o.name)}${o.salata ? ` <span class="chip ${full ? 'hot' : ''}" style="padding:2px 8px;font-size:11px">salata${full ? ' · max raggiunto' : ''}</span>` : ''}</span>${tick(sel.opt === o.id)}</div><div class="l">${o.items.map(esc).join(' · ')}</div></button>`;
    }).join('');
  } else {
    if (slot.id === 'cena') {
      const used = tot.pizza >= PIZZA_MAX && !sel.pizza;
      b += `<h2 class="sec">Pizza</h2><button class="optc ${sel.pizza ? 'on' : ''}" data-a="pizza"><div class="t"><span>🍕 Pizza ${used ? '<span class="chip hot" style="padding:2px 8px;font-size:11px">già usata questa settimana</span>' : '(1 a settimana)'}</span>${tick(sel.pizza)}</div></button>`;
    }
    if (!sel.pizza) {
      const combos = COMBOS.map((c, i) => [c, i]).filter(x => x[0].s === slot.id || x[0].s === 'unico');
      b += `<h2 class="sec">Combinazioni del piano (1 tocco)</h2><div class="chips">${combos.map(x => `<button class="chip" data-a="combo" data-i="${x[1]}">${esc(x[0].l.replace('Piatto unico: ', '★ '))}</button>`).join('')}</div>`;
      b += '<h2 class="sec">Oppure componi</h2><div class="small muted" style="margin:0 6px 6px">Carboidrato</div><div class="pick">' + CARBS.map(c => pk('carb', c[0], c[1], sel.carb === c[0], counts[c[0]] || 0)).join('') + '</div>';
      b += '<div class="small muted" style="margin:14px 6px 6px">Proteina</div><div class="pick">' + PROTS.map(p => pk('prot', p[0], p[1], sel.prot === p[0], counts[p[0]] || 0)).join('') + '</div>';
      b += `<details class="card" style="margin-top:14px"${(sel.veg && sel.veg.length) || (sel.fat && sel.fat.length) ? ' open' : ''}><summary>Verdure e grassi (opzionale)</summary>
        <div class="small muted" style="margin:10px 0 6px">Verdure · ${VEG_QTY}</div><div class="chips">${VEG.map(v => `<button class="chip ${(sel.veg || []).indexOf(v) > -1 ? 'good' : ''}" data-a="veg" data-n="${esc(v)}">${esc(v)}</button>`).join('')}</div>
        <div class="small muted" style="margin:12px 0 6px">Grassi</div><div class="chips">${FATS.map(f => `<button class="chip ${(sel.fat || []).indexOf(f[0]) > -1 ? 'good' : ''}" data-a="fat" data-n="${esc(f[0])}">${esc(f[0])} · ${esc(f[1])}</button>`).join('')}</div></details>`;
      const W = [];
      if (sel.prot && (counts[sel.prot] || 0) >= 2) W.push(`${sel.prot} già scelto ${counts[sel.prot]}× questa settimana.`);
      if (sel.carb && (counts[sel.carb] || 0) >= 3) W.push(`${sel.carb} già scelto ${counts[sel.carb]}× questa settimana.`);
      b += W.map(w => `<div class="wbox">⚠️ ${esc(w)}</div>`).join('');
    }
  }

  /* Aggiunta libera con filtro esclusioni */
  b += `<details class="card" style="margin-top:14px"${(sel.free && sel.free.length) || sh.err ? ' open' : ''}><summary>Aggiunta libera</summary>
    <div class="chips" style="margin-top:10px">${(sel.free || []).map((f, i) => `<span class="chip">${esc(f)}<button class="x" data-a="rmfree" data-i="${i}">✕</button></span>`).join('')}</div>
    ${sh.err ? `<div class="alert">${esc(sh.err)}</div>` : ''}
    <div class="freewrap"><input id="freeIn" placeholder="Es. biscotti, pesto…" value="${esc(sh.draft || '')}" autocomplete="off" autocapitalize="none" enterkeyhint="done"><button data-a="addfree">Aggiungi</button></div>
    <div class="small muted" style="margin-top:6px">Gli alimenti esclusi dal tuo piano vengono bloccati.</div></details>`;

  root.innerHTML = `<div class="sheet-back${anim}" data-a="close"></div>
    <div class="sheet${anim}" role="dialog" aria-label="${esc(slot.name)}">
      <div class="sheet-head"><button data-a="close">Annulla</button><span>${slot.icon} ${esc(slot.name)}</span><button data-a="clear">Svuota</button></div>
      <div class="sheet-body">${b}</div>
      <div class="sheet-foot"><button class="btn primary" data-a="save">Fatto</button></div>
    </div>`;
  root.querySelector('.sheet-body').scrollTop = st;
  document.body.classList.add('noscroll');
}

function commit() {
  const sh = ui.sheet; if (!sh) return;
  const d = ensureDay(sh.date);
  const m = d.meals[sh.slot] || (d.meals[sh.slot] = { sel: {}, done: false });
  m.sel = sh.sel;   /* "Mangiato" resta sempre una scelta manuale */
  if (!hasSel(m.sel) && !m.done) delete d.meals[sh.slot];
  save();
  ui.sheet = null;
  renderSheet(); render();
}

/* ============ RENDER & EVENTI ============ */
const view = $('view');
function render() {
  const y = window.scrollY;
  $('tab-week').classList.toggle('on', ui.tab === 'week');
  $('tab-today').classList.toggle('on', ui.tab === 'today');
  view.innerHTML = ui.tab === 'week' ? renderWeek() : renderToday();
  window.scrollTo(0, y);
}
const toggleIn = (arr, v) => { const i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); return arr; };

const H = {
  tab: ds => { ui.tab = ds.tab; if (ds.tab === 'today') ui.date = ui.date || today(); render(); window.scrollTo(0, 0); },
  wk: ds => { const n = +ds.n; ui.wk = n === 0 ? today() : dkey(addDays(parse(ui.wk), 7 * n)); render(); },
  goday: ds => { ui.date = ds.date; ui.tab = 'today'; render(); window.scrollTo(0, 0); },
  pickday: ds => { ui.date = ds.date; render(); },
  train: ds => { const d = ensureDay(ds.date); d.train = !d.train; save(); render(); },
  done: ds => {
    const d = ensureDay(ds.date);
    const m = d.meals[ds.slot] || (d.meals[ds.slot] = { sel: {}, done: false });
    m.done = !m.done;
    if (!m.done && !hasSel(m.sel)) delete d.meals[ds.slot];
    save(); render();
  },
  edit: ds => {
    const m = getMeal(ds.date, ds.slot);
    ui.sheet = { date: ds.date, slot: ds.slot, sel: JSON.parse(JSON.stringify((m && m.sel) || {})), err: '', draft: '' };
    renderSheet();
  },
  close: () => { ui.sheet = null; renderSheet(); },
  clear: () => { ui.sheet.sel = {}; ui.sheet.err = ''; renderSheet(); },
  save: () => commit(),
  opt: ds => { const s = ui.sheet.sel; s.opt = s.opt === ds.id ? undefined : ds.id; commit(); },
  pizza: () => { const s = ui.sheet.sel; const on = !s.pizza; ui.sheet.sel = on ? { pizza: true, free: s.free || [] } : { free: s.free || [] }; commit(); },
  carb: ds => { const s = ui.sheet.sel; delete s.pizza; s.carb = s.carb === ds.n ? undefined : ds.n; renderSheet(); },
  prot: ds => { const s = ui.sheet.sel; delete s.pizza; s.prot = s.prot === ds.n ? undefined : ds.n; renderSheet(); },
  veg: ds => { const s = ui.sheet.sel; delete s.pizza; s.veg = toggleIn(s.veg || [], ds.n); renderSheet(); },
  fat: ds => { const s = ui.sheet.sel; delete s.pizza; s.fat = toggleIn(s.fat || [], ds.n); renderSheet(); },
  combo: ds => {
    const c = COMBOS[+ds.i], s = ui.sheet.sel;
    ui.sheet.sel = { carb: c.carb, prot: c.prot, veg: (c.veg || []).slice(), fat: (c.fat || []).slice(), free: s.free || [] };
    commit();
  },
  addpre: ds => { const s = ui.sheet.sel; s.free = s.free || []; if (s.free.indexOf(ds.n) < 0) s.free.push(ds.n); renderSheet(); },
  rmfree: ds => { ui.sheet.sel.free.splice(+ds.i, 1); renderSheet(); },
  addfree: () => {
    const inp = $('freeIn'), sh = ui.sheet; if (!inp || !sh) return;
    const txt = inp.value.trim(); if (!txt) return;
    const ex = excluded(txt);
    if (ex) { sh.err = '⛔ "' + txt + '" contiene un alimento escluso dal tuo piano (' + ex + ').'; sh.draft = txt; }
    else { sh.sel.free = sh.sel.free || []; sh.sel.free.push(txt); sh.err = ''; sh.draft = ''; }
    renderSheet();
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (el && H[el.dataset.a]) H[el.dataset.a](el.dataset, el);
});
document.addEventListener('input', e => { if (e.target.id === 'freeIn' && ui.sheet) ui.sheet.draft = e.target.value; });
document.addEventListener('keydown', e => { if (e.target.id === 'freeIn' && e.key === 'Enter') { e.preventDefault(); H.addfree(); } });
document.addEventListener('visibilitychange', () => { if (!document.hidden && !ui.sheet) render(); });

/* Icona schermata Home generata al volo */
(function () {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 180;
    const x = c.getContext('2d');
    x.fillStyle = '#34c759'; x.fillRect(0, 0, 180, 180);
    x.strokeStyle = '#fff'; x.lineWidth = 16; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(52, 92); x.lineTo(80, 120); x.lineTo(130, 62); x.stroke();
    $('touchIcon').href = c.toDataURL('image/png');
  } catch (e) {}
})();

render();
})();

(function () {
  'use strict';

  const P = window.PLAN;
  const KEY = 'ancelin-training-v1';
  const APP_VERSION = '2.0';
  const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const DAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Couleurs : une par séance, une par anneau
  const C = { accent: '#d7ff3f', orange: '#ff7a45', cyan: '#4fd1ff', violet: '#a98bff', yellow: '#ffd23f', pink: '#ff6b9a', track: 'rgba(255,255,255,0.08)' };
  const SESSION_COLORS = { push: C.orange, pull: C.cyan, jambesA: C.accent, haut: C.violet, jambesB: C.yellow };
  const sColor = (id) => SESSION_COLORS[id] || C.accent;

  const view = document.getElementById('view');

  // ------------------------------------------------------------------
  // Icônes (traits 24×24)
  // ------------------------------------------------------------------
  const ICONS = {
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevR: '<path d="M9 5l7 7-7 7"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2 1.5M9.5 2.5h5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    flame: '<path d="M12 21c-3.9 0-7-2.8-7-6.6 0-3.3 2.4-5.3 3.6-7.6.4 1.6 1.4 2.8 2.6 3.3C11 7 12.4 4.6 15 3c-.3 3 1.3 4.6 2.6 6.3 1 1.3 1.4 2.8 1.4 4.6 0 4-3 7.1-7 7.1z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M8.5 10a5 5 0 0 1 7 0"/><path d="M12 10.5l1.2-1.8"/>',
    steps: '<path d="M7.5 14.5c-1.9 0-3-1.8-3-4.3 0-2.9 1.2-5.7 3.2-5.7 1.8 0 2.8 2.4 2.8 5 0 2.8-1 5-3 5z"/><path d="M5.5 17.5l4 .6"/><path d="M16.5 19.5c-1.9 0-3-2.2-3-5 0-2.6 1-5 2.8-5 2 0 3.2 2.8 3.2 5.7 0 2.5-1.1 4.3-3 4.3z"/>',
    heart: '<path d="M12 20s-7.5-4.4-7.5-10.2C4.5 7 6.5 5 9 5c1.4 0 2.4.6 3 1.5C12.6 5.6 13.6 5 15 5c2.5 0 4.5 2 4.5 4.8C19.5 15.6 12 20 12 20z" fill="currentColor" stroke="none"/>',
    clipboard: '<rect x="5.5" y="4.5" width="13" height="16" rx="3"/><path d="M9 4.5V3.8c0-.7.5-1.3 1.2-1.3h3.6c.7 0 1.2.6 1.2 1.3v.7M9 10h6M9 14h4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7"/>',
    history: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4.5v3.5h3.5M12 8v4l2.5 1.5"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
    upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19.5h14"/>',
    trash: '<path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9l1-12.5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/>',
    book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5V5.5M19 18v3H7.5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2.2-6.5L15 17v4M9 11l2-3.5 3.5 1.5 2 3.5M11 7.5l-1.5 5.5"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor" stroke="none"/>',
    utensils: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 0-3.5 2.5-3.5 6v4H17"/>',
  };
  const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const tile = (n, color) => `<span class="ico-tile" style="--c:${color}">${icon(n)}</span>`;

  // ------------------------------------------------------------------
  // Utilitaires
  // ------------------------------------------------------------------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const z = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  const keyToDate = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmt = (n, d = 1) => Number(n).toLocaleString('fr-FR', { maximumFractionDigits: d });
  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
  const fmtDate = (key, opts = { day: 'numeric', month: 'short' }) => keyToDate(key).toLocaleDateString('fr-FR', opts);
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${z(s % 60)}`; };
  const fmtElapsed = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h ? `${h}:${z(m)}:${z(s % 60)}` : `${m}:${z(s % 60)}`;
  };
  const restLabel = (sec) => (sec % 60 ? mmss(sec * 1000) : `${sec / 60} min`);
  const topOfRange = (reps) => { const m = String(reps).match(/(\d+)\s*$/); return m ? +m[1] : null; };
  const clamp01 = (x) => Math.min(1, Math.max(0, x || 0));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const EXERCISES = {};
  Object.values(P.sessions).forEach((s) => s.exercises.forEach((ex) => { if (!EXERCISES[ex.id]) EXERCISES[ex.id] = ex; }));

  function sessionStats(s) {
    const sets = s.exercises.reduce((a, e) => a + e.sets, 0);
    const sec = s.exercises.reduce((a, e) => a + e.sets * (e.rest + 45), 0) + 8 * 60;
    return { sets, exos: s.exercises.length, min: Math.round(sec / 300) * 5 };
  }

  // ------------------------------------------------------------------
  // Stockage (localStorage, sur le téléphone)
  // ------------------------------------------------------------------
  const defaults = () => ({ version: 1, workouts: [], active: null, weights: [], food: {}, steps: {}, settings: { phase: 'masse', phaseStartWeight: null } });
  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        return { ...defaults(), ...d, settings: { ...defaults().settings, ...(d.settings || {}) } };
      }
    } catch (e) { /* stockage indisponible */ }
    return defaults();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { toast("Impossible d'enregistrer sur cet appareil", 'info'); }
  }

  // ------------------------------------------------------------------
  // Données dérivées
  // ------------------------------------------------------------------
  const phase = () => P.nutrition.phases[S.settings.phase] || P.nutrition.phases.masse;
  const weightsSorted = () => [...S.weights].sort((a, b) => a.date.localeCompare(b.date));
  const currentWeight = () => { const w = weightsSorted(); return w.length ? w[w.length - 1].kg : P.athlete.startWeight; };
  const targetWeight = () => (S.settings.phase === 'seche' ? P.athlete.cutTarget : P.athlete.bulkTarget);
  const phaseStart = () => S.settings.phaseStartWeight ?? (S.settings.phase === 'seche' ? P.athlete.bulkTarget : P.athlete.startWeight);

  function avgBetween(fromKey, toKey) {
    const xs = S.weights.filter((w) => w.date > fromKey && w.date <= toKey).map((w) => w.kg);
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  }
  function daysAgoKey(n) { const d = new Date(); d.setDate(d.getDate() - n); return dayKey(d); }
  function weeklyRate() {
    const now = avgBetween(daysAgoKey(7), dayKey());
    const prev = avgBetween(daysAgoKey(14), daysAgoKey(7));
    return { now, prev, rate: now != null && prev != null ? now - prev : null };
  }

  function lastSets(exId) {
    for (let i = S.workouts.length - 1; i >= 0; i--) {
      const w = S.workouts[i];
      if (w.sets[exId] && w.sets[exId].length) return { date: w.date, sets: w.sets[exId] };
    }
    return null;
  }
  const e1rm = (kg, reps) => (kg && reps ? kg * (1 + reps / 30) : 0);

  function foodDay(key = dayKey()) {
    if (!S.food[key]) S.food[key] = { meals: {}, extras: [] };
    return S.food[key];
  }
  function foodTotals(key = dayKey()) {
    const d = S.food[key] || { meals: {}, extras: [] };
    const t = { kcal: 0, p: 0, g: 0, l: 0 };
    phase().meals.forEach((m) => { if (d.meals[m.id]) { t.kcal += m.kcal; t.p += m.p; t.g += m.g; t.l += m.l; } });
    d.extras.forEach((x) => { t.kcal += x.kcal || 0; t.p += x.p || 0; });
    return t;
  }

  const stepsGoal = () => P.steps.goals[S.settings.phase] || P.steps.goals.masse;
  const stepsOn = (key = dayKey()) => S.steps[key] || 0;
  function stepsAvg7() {
    let sum = 0, n = 0;
    for (let i = 0; i < 7; i++) { const v = S.steps[daysAgoKey(i)]; if (v) { sum += v; n++; } }
    return n ? Math.round(sum / n) : null;
  }

  function weekKeys() {
    const d = new Date();
    const offset = (d.getDay() + 6) % 7; // lundi = 0
    d.setDate(d.getDate() - offset);
    return Array.from({ length: 7 }, (_, i) => { const x = new Date(d); x.setDate(d.getDate() + i); return x; });
  }

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  // ------------------------------------------------------------------
  // Composants
  // ------------------------------------------------------------------
  const bar = (value, max, color = C.accent, opts = {}) => {
    const pct = max > 0 ? clamp01(value / max) * 100 : 0;
    const over = opts.overIsBad && value > max * 1.08;
    return `<div class="bar ${opts.thin ? 'thin' : ''} ${over ? 'over' : ''}"><i style="width:${pct.toFixed(1)}%;--c:${color}"></i></div>`;
  };

  // Anneaux concentriques façon montre
  function rings(items, size = 132, stroke = 13, gap = 4) {
    const c = size / 2;
    const parts = items.map((it, i) => {
      const r = c - stroke / 2 - i * (stroke + gap);
      const L = 2 * Math.PI * r;
      const p = clamp01(it.p);
      return `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${it.c}" stroke-opacity=".16" stroke-width="${stroke}"/>
        ${p > 0 ? `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${it.c}" stroke-width="${stroke}" stroke-linecap="round"
          stroke-dasharray="${(p * L).toFixed(2)} ${L.toFixed(2)}" transform="rotate(-90 ${c} ${c})"/>` : ''}`;
    }).join('');
    return `<svg class="rings" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${parts}</svg>`;
  }

  const head = (eyebrow, title, opts = {}) => `
    <header class="page-head">
      <div class="grow">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        <h1 class="title">${title}</h1>
        ${opts.sub ? `<p class="subtitle">${opts.sub}</p>` : ''}
      </div>
      ${opts.right || ''}
    </header>`;

  const sectionHead = (title, right = '') => `<div class="section-head"><h2>${title}</h2>${right ? `<span class="dim">${right}</span>` : ''}</div>`;

  const accordion = (title, body, lead = '') => `
    <details>
      <summary class="li">${lead}<div class="grow t">${title}</div>${icon('chevR', 'acc-chev')}</summary>
      <div class="acc-body">${body}</div>
    </details>`;

  // ------------------------------------------------------------------
  // Vue : Aujourd'hui
  // ------------------------------------------------------------------
  function viewToday() {
    const now = new Date();
    const sid = P.schedule[now.getDay()];
    const today = dayKey();
    const doneToday = S.workouts.some((w) => w.date === today);
    const ph = phase();
    const t = ph.targets;
    const tot = foodTotals();
    const steps = stepsOn();
    const sg = stepsGoal();
    const cw = currentWeight();
    const start = phaseStart();
    const target = targetWeight();
    const phasePct = clamp01((cw - start) / (target - start));
    const { rate } = weeklyRate();
    const weighedToday = S.weights.find((w) => w.date === today);

    // Carte séance
    let hero;
    if (S.active) {
      const s = P.sessions[S.active.sessionId];
      const all = Object.values(S.active.sets).flat();
      const done = all.filter((x) => x.done).length;
      hero = `<section class="card hero" style="--tag:${sColor(S.active.sessionId)}">
        <div class="row between"><span class="tag live">En cours</span><span class="tag">${icon('clock')}<span data-elapsed></span></span></div>
        <h2 class="hero-title">${esc(s.name)}</h2>
        <p class="subtitle">${esc(s.focus)}</p>
        <div class="mt-20">${bar(done, all.length, sColor(S.active.sessionId))}</div>
        <p class="small dim mt-8">${done} / ${all.length} séries validées</p>
        <button class="btn primary block mt-16" data-action="go" data-href="#/seance">${icon('play')}Reprendre la séance</button>
      </section>`;
    } else if (sid) {
      const s = P.sessions[sid];
      const st = sessionStats(s);
      hero = `<section class="card hero" style="--tag:${sColor(sid)}">
        <div class="row between">
          <span class="eyebrow" style="color:${sColor(sid)}">Séance du jour</span>
          ${doneToday ? `<span class="tag accent">${icon('check')}Faite</span>` : ''}
        </div>
        <h2 class="hero-title">${esc(s.name)}</h2>
        <p class="subtitle">${esc(s.focus)}</p>
        <div class="row wrap mt-16" style="gap:6px">
          <span class="tag">${icon('dumbbell')}${st.exos} exos</span>
          <span class="tag">${icon('layers')}${st.sets} séries</span>
          <span class="tag">${icon('clock')}~${st.min} min</span>
        </div>
        <div class="row mt-20" style="gap:10px">
          <button class="btn primary grow" data-action="start" data-id="${sid}">${icon('play')}${doneToday ? 'Refaire' : 'Commencer'}</button>
          <button class="btn secondary square" data-action="go" data-href="#/programme/${sid}" aria-label="Voir la séance">${icon('chevR')}</button>
        </div>
      </section>`;
    } else {
      hero = `<section class="card hero" style="--tag:${C.violet}">
        <div class="row between"><span class="eyebrow" style="color:${C.violet}">Récupération</span>${tile('moon', C.violet)}</div>
        <h2 class="hero-title">Jour de repos</h2>
        <p class="subtitle">Le muscle se construit aujourd'hui : mange bien, dors bien, marche un peu.</p>
        <p class="xs dim mt-20" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700">Entraînement libre</p>
        <div class="row wrap mt-8" style="gap:8px">
          ${Object.entries(P.sessions).map(([id, s]) => `<button class="tag tap" style="border:0;cursor:pointer" data-action="start" data-id="${id}"><span class="dot" style="--tag:${sColor(id)}"></span>${esc(s.name)}</button>`).join('')}
        </div>
      </section>`;
    }

    // Semaine
    const days = weekKeys();
    const doneDays = new Set(S.workouts.map((w) => w.date));
    const planned = DAY_ORDER.filter((d) => P.schedule[d]).length;
    const doneThisWeek = days.filter((d) => doneDays.has(dayKey(d))).length;
    const week = days.map((d) => {
      const k = dayKey(d);
      const sidD = P.schedule[d.getDay()];
      const cls = [doneDays.has(k) ? 'done' : '', k === today ? 'today' : '', sidD ? '' : 'off'].join(' ');
      return `<div class="wd ${cls}" ${sidD ? `style="--tag:${sColor(sidD)}"` : ''}><span>${DAY_SHORT[d.getDay()].charAt(0)}</span><span class="c">${d.getDate()}</span></div>`;
    }).join('');

    const install = isStandalone() ? '' : `
      <div class="card mt-16"><div class="row top">${tile('phone', C.cyan)}
        <div class="grow"><div class="h3">Installe l'appli</div>
        <p class="small muted mt-8"><b>iPhone</b> : Safari → Partager → « Sur l'écran d'accueil ».<br><b>Android</b> : Chrome → ⋮ → « Installer l'application ».</p></div>
      </div></div>`;

    return `
      ${head(esc(cap(now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))), `Salut ${esc(P.athlete.name)}`,
        { right: `<span class="tag accent">${esc(ph.label)}</span>` })}

      ${hero}

      <section class="card tap mt-12" data-action="go" data-href="#/nutrition">
        <div class="rings-card">
          ${rings([{ p: tot.kcal / t.kcal, c: C.orange }, { p: tot.p / t.p, c: C.cyan }, { p: steps / sg, c: C.accent }])}
          <div class="legend">
            <div class="legend-item"><div class="lbl"><span class="dot" style="--tag:${C.orange}"></span>Calories</div>
              <div class="val">${fmt(tot.kcal, 0)}<small> / ${fmt(t.kcal, 0)}</small></div></div>
            <div class="legend-item"><div class="lbl"><span class="dot" style="--tag:${C.cyan}"></span>Protéines</div>
              <div class="val">${fmt(tot.p, 0)}<small> / ${t.p} g</small></div></div>
            <div class="legend-item"><div class="lbl"><span class="dot" style="--tag:${C.accent}"></span>Pas</div>
              <div class="val"><span data-steps-today>${fmt(steps, 0)}</span><small> / ${fmt(sg, 0)}</small></div></div>
          </div>
        </div>
      </section>

      <section class="card mt-12">
        <div class="row between"><div class="h3">Cette semaine</div><span class="small dim">${doneThisWeek} / ${planned} séances</span></div>
        <div class="week">${week}</div>
      </section>

      <div class="grid2 mt-12">
        <section class="card tap" data-action="go" data-href="#/suivi">
          ${tile('scale', C.cyan)}
          <div class="metric mt-12"><div class="v">${fmt(cw)}<small>kg</small></div>
          <div class="l">${rate != null ? `${rate > 0 ? '+' : ''}${fmt(rate, 2)} kg / semaine` : `Objectif ${fmt(target)} kg`}</div></div>
        </section>
        <section class="card tap" data-action="go" data-href="#/pas">
          <div class="row between">${tile('steps', C.accent)}${ped.on ? '<span class="tag live">Live</span>' : ''}</div>
          <div class="metric mt-12"><div class="v" data-steps-today>${fmt(steps, 0)}</div><div class="l">pas · objectif ${fmt(sg, 0)}</div></div>
        </section>
      </div>

      <section class="card mt-12">
        <div class="row between">
          <div><div class="eyebrow">${esc(ph.label)}</div><div class="h3 mt-8 num">${fmt(start)} → ${fmt(target)} kg</div></div>
          <div class="metric sm" style="text-align:right"><div class="v">${Math.round(phasePct * 100)}<small>%</small></div></div>
        </div>
        <div class="mt-12">${bar(phasePct, 1)}</div>
        <form class="inline-form mt-16" data-form="weight">
          <input class="field" type="number" name="kg" inputmode="decimal" step="0.1" min="30" max="200"
            placeholder="${weighedToday ? `Pesé ce matin : ${fmt(weighedToday.kg)} kg` : 'Poids de ce matin (kg)'}" required>
          <button class="btn primary sm" type="submit" aria-label="Enregistrer le poids">${icon('check')}</button>
        </form>
      </section>
      ${install}
    `;
  }

  // ------------------------------------------------------------------
  // Vue : séance en cours
  // ------------------------------------------------------------------
  function lastInfo(ex) {
    const last = lastSets(ex.id);
    if (!last) return { last: null, allTop: false };
    const top = topOfRange(ex.reps);
    const allTop = !!top && last.sets.length >= ex.sets && last.sets.every((s) => (s.reps || 0) >= top);
    return { last, allTop };
  }

  function viewSession() {
    if (!S.active) {
      return `${head('Séance', 'Aucune séance')}
        <div class="card"><div class="empty">${icon('dumbbell')}Lance une séance depuis l'accueil ou le programme.</div>
        <button class="btn primary block" data-action="go" data-href="#/programme">Voir le programme</button></div>`;
    }
    const sid = S.active.sessionId;
    const sess = P.sessions[sid];
    const color = sColor(sid);
    const all = Object.values(S.active.sets).flat();
    const doneCount = all.filter((x) => x.done).length;

    const cards = sess.exercises.map((ex, idx) => {
      const sets = S.active.sets[ex.id] || [];
      const { last, allTop } = lastInfo(ex);
      const allDone = sets.length > 0 && sets.every((s) => s.done);
      const rows = sets.map((s, i) => {
        const ref = last ? (last.sets[i] || last.sets[last.sets.length - 1]) : null;
        const prev = ref ? `${ref.kg != null ? fmt(ref.kg) : '–'} × ${ref.reps}` : '—';
        return `<div class="set-grid set-row ${s.done ? 'done' : ''}">
          <span class="set-n">${i + 1}</span>
          <span class="set-prev">${prev}</span>
          <input class="set-in" type="number" inputmode="decimal" step="0.5" min="0" aria-label="Charge série ${i + 1} (kg)"
            placeholder="${ref && ref.kg != null ? fmt(ref.kg) : '—'}" value="${esc(s.kg)}" data-ex="${ex.id}" data-i="${i}" data-f="kg">
          <input class="set-in" type="number" inputmode="numeric" min="0" aria-label="Répétitions série ${i + 1}"
            placeholder="${ref ? ref.reps : esc(ex.reps)}" value="${esc(s.reps)}" data-ex="${ex.id}" data-i="${i}" data-f="reps">
          <button class="set-check ${s.done ? 'on' : ''}" data-action="toggle-set" data-ex="${ex.id}" data-i="${i}" aria-label="Valider la série ${i + 1}">${icon('check')}</button>
        </div>`;
      }).join('');

      return `<article class="card ex ${allDone ? 'is-done' : ''}" style="--tag:${color}">
        <div class="ex-top">
          <span class="ex-idx">${allDone ? icon('check') : z(idx + 1)}</span>
          <div class="grow">
            <h3 class="ex-name">${esc(ex.name)}</h3>
            <div class="ex-meta">
              <span class="tag">${ex.sets} × ${esc(ex.reps)}</span>
              <span class="tag">${icon('timer')}${restLabel(ex.rest)}</span>
            </div>
          </div>
        </div>
        ${allTop ? `<div class="hint">${icon('trend')}Haut de fourchette atteint partout : monte la charge.</div>` : ''}
        ${!last ? `<p class="ex-note">Première fois : prends une charge qui te laisse 2 reps en réserve.</p>` : ''}
        <div class="sets">
          <div class="set-grid set-head"><span>#</span><span>Précédent</span><span>kg</span><span>Reps</span><span></span></div>
          ${rows}
        </div>
        <div class="ex-actions">
          <button class="link-btn" data-action="add-set" data-ex="${ex.id}">${icon('plus')}Série</button>
          ${sets.length > 1 ? `<button class="link-btn" data-action="remove-set" data-ex="${ex.id}">${icon('minus')}Série</button>` : ''}
        </div>
        <details class="tech"><summary>${icon('info')}Technique</summary><p>${esc(ex.tip)}</p></details>
      </article>`;
    }).join('');

    return `
      ${head(`<span style="color:${color}">Séance en cours</span>`, esc(sess.name), {
        sub: esc(sess.focus),
        right: `<span class="tag">${icon('clock')}<span data-elapsed></span></span>`,
      })}
      <div class="session-bar">
        <div class="row between"><span>Progression</span><span class="num" style="color:var(--text)">${doneCount} / ${all.length} séries</span></div>
        ${bar(doneCount, all.length, color, { thin: true })}
      </div>
      <p class="small dim" style="margin:0 4px 14px">Tape ✓ pour valider. Cases vides = on reprend la dernière fois. Le repos démarre tout seul.</p>
      ${cards}
      <button class="btn primary block mt-20" data-action="finish">${icon('check')}Terminer la séance</button>
      <button class="btn danger block mt-12" data-action="cancel">Abandonner</button>
    `;
  }

  // ------------------------------------------------------------------
  // Vue : programme
  // ------------------------------------------------------------------
  function viewProgram() {
    const todayDow = new Date().getDay();
    const days = weekKeys();
    const rows = days.map((d) => {
      const dow = d.getDay();
      const sid = P.schedule[dow];
      const s = sid ? P.sessions[sid] : null;
      const isToday = dow === todayDow;
      const badge = `<div class="day-badge"><span class="d">${DAY_SHORT[dow]}</span><span class="n">${d.getDate()}</span></div>`;
      if (!s) {
        return `<div class="li off ${isToday ? 'today' : ''}">${badge}<div class="grow"><div class="t">Repos</div><div class="s">Récupération</div></div></div>`;
      }
      const st = sessionStats(s);
      return `<button class="li ${isToday ? 'today' : ''}" data-action="go" data-href="#/programme/${sid}">
        ${badge}
        <div class="grow">
          <div class="t"><span class="dot" style="--tag:${sColor(sid)};margin-right:8px;vertical-align:1px"></span>${esc(s.name)}</div>
          <div class="s">${esc(s.focus)} · ~${st.min} min</div>
        </div>
        ${icon('chevR', 'chev')}
      </button>`;
    }).join('');

    const nSessions = DAY_ORDER.filter((d) => P.schedule[d]).length;
    return `
      ${head(`${nSessions} séances par semaine`, 'Programme', { sub: 'Chaque muscle travaillé 2 fois par semaine.' })}
      <div class="list">${rows}</div>

      ${sectionHead('Ce qui change')}
      <div class="list">
        ${P.changes.map((c) => `<div class="li" style="align-items:flex-start">${tile('check', C.accent)}<p class="grow small muted" style="font-size:14.5px;line-height:1.5">${esc(c)}</p></div>`).join('')}
      </div>

      ${sectionHead('Les règles')}
      <div class="list">
        ${P.principles.map((p, i) => accordion(esc(p.title), `<p>${esc(p.text)}</p>`, `<span class="ex-idx" style="--tag:${C.accent}">${i + 1}</span>`)).join('')}
      </div>
    `;
  }

  function viewSessionDetail(id) {
    const s = P.sessions[id];
    if (!s) return viewProgram();
    const color = sColor(id);
    const st = sessionStats(s);
    const days = DAY_ORDER.filter((d) => P.schedule[d] === id).map((d) => DAY_NAMES[d]).join(' · ');
    const items = s.exercises.map((ex, i) => {
      const { last, allTop } = lastInfo(ex);
      const lastLine = last ? `Dernière fois : ${last.sets.map((x) => `${x.kg != null ? fmt(x.kg) : '–'}×${x.reps}`).join(' · ')}` : '';
      return `<details>
        <summary class="li">
          <span class="ex-idx" style="--tag:${color}">${z(i + 1)}</span>
          <div class="grow">
            <div class="t">${esc(ex.name)}${ex.isNew ? '<span class="badge">Nouveau</span>' : ''}</div>
            <div class="s">${ex.sets} × ${esc(ex.reps)} · repos ${restLabel(ex.rest)}</div>
          </div>
          ${icon('chevR', 'acc-chev')}
        </summary>
        <div class="acc-body">
          <p>${esc(ex.tip)}</p>
          ${lastLine ? `<p class="small mt-8" style="color:var(--text)">${esc(lastLine)}</p>` : ''}
          ${allTop ? `<div class="hint">${icon('trend')}Monte la charge la prochaine fois.</div>` : ''}
        </div>
      </details>`;
    }).join('');

    return `
      <button class="back" data-action="go" data-href="#/programme">${icon('chevL')}Programme</button>
      ${head(`<span style="color:${color}">${esc(days || 'Séance libre')}</span>`, esc(s.name), { sub: esc(s.focus) })}
      <section class="card hero" style="--tag:${color}">
        <div class="grid3">
          <div class="metric sm"><div class="v">${st.exos}</div><div class="l">exercices</div></div>
          <div class="metric sm"><div class="v">${st.sets}</div><div class="l">séries</div></div>
          <div class="metric sm"><div class="v">~${st.min}<small>min</small></div><div class="l">durée</div></div>
        </div>
        <button class="btn primary block mt-20" data-action="start" data-id="${id}">${icon('play')}Commencer cette séance</button>
      </section>
      ${sectionHead('Exercices', 'Touche pour la technique')}
      <div class="list">${items}</div>
    `;
  }

  // ------------------------------------------------------------------
  // Vue : nutrition
  // ------------------------------------------------------------------
  function viewNutrition() {
    const ph = phase();
    const day = S.food[dayKey()] || { meals: {}, extras: [] };
    const tot = foodTotals();
    const t = ph.targets;
    const left = t.kcal - tot.kcal;
    const eaten = ph.meals.filter((m) => day.meals[m.id]).length;

    const macroLine = (label, v, target, color) => `
      <div class="macro-line">
        <div class="row between"><span>${label}</span><span><span class="num">${fmt(v, 0)}</span> / ${target} g</span></div>
        ${bar(v, target, color, { thin: true })}
      </div>`;

    return `
      ${head(esc(ph.label), 'Nutrition', { sub: esc(cap(ph.goal)) })}

      <section class="card pad-lg">
        <div class="rings-card">
          <div class="ring-center">
            ${rings([{ p: tot.kcal / t.kcal, c: C.orange }], 132, 14)}
            <div class="inner"><div><div class="big num" style="font-size:28px">${fmt(Math.abs(left), 0)}</div><div class="cap">${left >= 0 ? 'kcal restantes' : 'kcal en trop'}</div></div></div>
          </div>
          <div class="legend">
            ${macroLine('Protéines', tot.p, t.p, C.cyan)}
            ${macroLine('Glucides', tot.g, t.g, C.yellow)}
            ${macroLine('Lipides', tot.l, t.l, C.pink)}
          </div>
        </div>
        <div class="stat-row">
          <div class="metric sm"><div class="v">${fmt(tot.kcal, 0)}</div><div class="l">mangées</div></div>
          <div class="metric sm"><div class="v">${fmt(t.kcal, 0)}</div><div class="l">objectif kcal</div></div>
          <div class="metric sm"><div class="v">${eaten}/${ph.meals.length}</div><div class="l">repas</div></div>
        </div>
      </section>

      ${sectionHead('Repas', 'Coche quand c’est mangé')}
      ${ph.meals.map((m) => {
        const on = !!day.meals[m.id];
        return `<section class="card meal ${on ? 'eaten' : ''}">
          <div class="meal-top">
            <div class="grow">
              <div class="h3">${esc(m.name)}</div>
              <div class="small dim mt-8 num" style="margin-top:2px">${m.kcal} kcal</div>
            </div>
            <button class="check-circle ${on ? 'on' : ''}" data-action="toggle-meal" data-id="${m.id}" aria-pressed="${on}" aria-label="${esc(m.name)} mangé">${icon('check')}</button>
          </div>
          <ul>${m.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          <div class="macros">
            <span class="macro"><i style="--c:${C.cyan}">P</i>${m.p} g</span>
            <span class="macro"><i style="--c:${C.yellow}">G</i>${m.g} g</span>
            <span class="macro"><i style="--c:${C.pink}">L</i>${m.l} g</span>
          </div>
        </section>`;
      }).join('')}

      ${sectionHead('Ajout libre', 'Resto, extra…')}
      <section class="card">
        <form data-form="extra" class="stack">
          <input class="field" type="text" name="name" placeholder="Ex : kebab, shaker…" required maxlength="60">
          <div class="grid2" style="gap:8px">
            <input class="field" type="number" name="kcal" inputmode="numeric" min="0" placeholder="kcal" required>
            <input class="field" type="number" name="p" inputmode="numeric" min="0" placeholder="Protéines (g)">
          </div>
          <button class="btn secondary block" type="submit">${icon('plus')}Ajouter</button>
        </form>
      </section>
      ${day.extras.length ? `<div class="list mt-12">${day.extras.map((x, i) => `
        <div class="li">${tile('utensils', C.orange)}
          <div class="grow"><div class="t">${esc(x.name)}</div><div class="s">${x.kcal} kcal · ${x.p || 0} g protéines</div></div>
          <button class="icon-btn" data-action="del-extra" data-i="${i}" aria-label="Supprimer">${icon('x')}</button>
        </div>`).join('')}</div>` : ''}

      ${sectionHead('Conseils')}
      <div class="list">
        ${accordion('Les règles de la nutrition', `<ul>${P.nutrition.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`, tile('book', C.accent))}
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Vue : pas
  // ------------------------------------------------------------------
  function stepsChart() {
    const goal = stepsGoal();
    const days = Array.from({ length: 14 }, (_, i) => daysAgoKey(13 - i));
    const vals = days.map((d) => stepsOn(d));
    if (!vals.some((v) => v > 0)) return `<div class="empty">${icon('steps')}Tes 14 derniers jours apparaîtront ici.</div>`;
    const max = Math.max(goal * 1.25, ...vals);
    const W = 320, H = 130, bw = W / days.length;
    const y = (v) => H - (v / max) * (H - 6);
    const bars = days.map((d, i) => {
      const v = vals[i];
      const top = y(v);
      const letter = 'DLMMJVS'[keyToDate(d).getDay()];
      const isToday = i === days.length - 1;
      return `<rect x="${(i * bw + 4).toFixed(1)}" y="${top.toFixed(1)}" width="${(bw - 8).toFixed(1)}" height="${Math.max(0, H - top).toFixed(1)}" rx="5"
          fill="${v >= goal ? C.accent : 'rgba(255,255,255,0.16)'}"/>
        <text x="${(i * bw + bw / 2).toFixed(1)}" y="${H + 16}" fill="${isToday ? '#f5f6f7' : '#6c707a'}" font-size="10" font-weight="600" text-anchor="middle">${letter}</text>`;
    }).join('');
    const gy = y(goal).toFixed(1);
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 22}" role="img" aria-label="Pas des 14 derniers jours">
      <line x1="0" x2="${W}" y1="${gy}" y2="${gy}" stroke="${C.accent}" stroke-dasharray="3 5" stroke-width="1.2" opacity=".55"/>
      ${bars}
    </svg>`;
  }

  function viewSteps() {
    const today = stepsOn();
    const goal = stepsGoal();
    const avg = stepsAvg7();
    const reached = today >= goal;
    return `
      <button class="back" data-action="go" data-href="#/suivi">${icon('chevL')}Suivi</button>
      ${head('Activité', 'Pas', { right: ped.on ? '<span class="tag live">Compteur actif</span>' : '' })}

      <section class="card pad-lg" style="display:flex;flex-direction:column;align-items:center">
        <div class="ring-center">
          ${rings([{ p: today / goal, c: C.accent }], 188, 16)}
          <div class="inner"><div>
            <div class="big num" data-steps-today>${fmt(today, 0)}</div>
            <div class="cap">sur ${fmt(goal, 0)} pas</div>
          </div></div>
        </div>
        <div class="stat-row" style="width:100%">
          <div class="metric sm"><div class="v">${reached ? icon('check') : fmt(goal - today, 0)}</div><div class="l">${reached ? 'objectif atteint' : 'restants'}</div></div>
          <div class="metric sm"><div class="v">${avg != null ? fmt(avg, 0) : '—'}</div><div class="l">moyenne 7 j</div></div>
          <div class="metric sm"><div class="v">${fmt(goal / 1000, 0)}k</div><div class="l">objectif</div></div>
        </div>
      </section>

      ${sectionHead('Apple Santé')}
      <section class="card">
        <div class="row top">${tile('heart', C.pink)}
          <div class="grow"><div class="h3">Importer tes vrais pas</div>
          <p class="small muted mt-8">Lance ton raccourci « Mes pas », reviens ici et colle. Le chiffre remplace le total du jour.</p></div>
        </div>
        <button class="btn primary block mt-16" data-action="paste-steps">${icon('clipboard')}Coller mes pas Apple</button>
        <form class="inline-form mt-12" data-form="steps">
          <input class="field" type="number" name="steps" inputmode="numeric" min="0" max="100000" placeholder="Ou tape le total du jour" required>
          <button class="btn secondary sm" type="submit" aria-label="Enregistrer">${icon('check')}</button>
        </form>
      </section>
      <div class="list mt-12">
        ${accordion('Créer le raccourci « Mes pas »', `<ol>
          <li>Ouvre l'appli <b>Raccourcis</b>, puis touche <b>+</b>.</li>
          <li>Ajoute <b>Rechercher des échantillons de santé</b> : Type = <b>Nombre de pas</b> (ou <b>Steps</b>), Date de début = <b>est aujourd'hui</b>, Grouper par = <b>Jour</b>, Fichier manquant désactivé.</li>
          <li>Ajoute <b>Copier dans le presse-papiers</b>, touche le mot bleu <b>Échantillons de Santé</b> et choisis <b>Valeur</b>.</li>
          <li>Nomme-le <b>Mes pas</b> et ajoute-le à l'écran d'accueil ou en widget.</li>
        </ol>`, tile('sparkle', C.accent))}
      </div>

      ${sectionHead('Compteur en direct')}
      <section class="card ${ped.on ? 'hero' : ''}" ${ped.on ? `style="--tag:${C.accent}"` : ''}>
        ${ped.on ? `
          <div class="row between"><span class="tag live">En cours</span>${tile('walk', C.accent)}</div>
          <div class="big num mt-12" style="font-size:52px;font-weight:800;letter-spacing:-.04em" data-steps-live>${fmt(ped.count, 0)}</div>
          <p class="small muted">pas pendant cette marche, ajoutés au total du jour. Garde l'appli ouverte : l'écran reste allumé.</p>
          <button class="btn danger block mt-16" data-action="ped-stop">${icon('stop')}Arrêter</button>
        ` : `
          <div class="row top">${tile('walk', C.accent)}
            <div class="grow"><div class="h3">Marche ou tapis</div>
            <p class="small muted mt-8">Utilise le capteur du téléphone tant que l'appli est ouverte. Téléphone en main ou dans la poche.</p></div>
          </div>
          <button class="btn secondary block mt-16" data-action="ped-start">${icon('play')}Démarrer le compteur</button>
        `}
      </section>

      ${sectionHead('14 derniers jours')}
      <section class="card">${stepsChart()}</section>

      ${sectionHead('À savoir')}
      <div class="list">
        ${accordion('Combien de pas et pourquoi', `<ul>${P.steps.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`, tile('info', C.cyan))}
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Vue : suivi
  // ------------------------------------------------------------------
  function weightChart() {
    const w = weightsSorted().slice(-90);
    if (w.length < 2) return `<div class="empty">${icon('scale')}Pèse-toi quelques matins pour voir ta courbe.</div>`;
    const target = targetWeight();
    const data = w.map((x) => x.kg);
    // L'objectif n'entre dans l'échelle que s'il est proche : sinon la courbe serait écrasée
    const showTarget = target >= Math.min(...data) - 2.5 && target <= Math.max(...data) + 2.5;
    const vals = showTarget ? data.concat([target]) : data;
    const min = Math.floor(Math.min(...vals) - 0.5), max = Math.ceil(Math.max(...vals) + 0.5);
    const W = 320, H = 150, L = 4, R = 4, T = 10;
    const x = (i) => L + (i / (w.length - 1)) * (W - L - R);
    const y = (v) => T + (1 - (v - min) / (max - min)) * (H - T);
    const pts = w.map((p, i) => [x(i), y(p.kg)]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;
    const ty = y(target).toFixed(1);
    const lastP = pts[pts.length - 1];
    const grid = [0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${W}" y1="${(T + f * (H - T)).toFixed(1)}" y2="${(T + f * (H - T)).toFixed(1)}" stroke="rgba(255,255,255,0.05)"/>`).join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 22}" role="img" aria-label="Courbe de poids">
      <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
      </linearGradient></defs>
      ${grid}
      ${showTarget ? `<line x1="0" x2="${W}" y1="${ty}" y2="${ty}" stroke="${C.accent}" stroke-dasharray="3 5" stroke-width="1.2" opacity=".6"/>
      <text x="${W}" y="${(+ty - 6).toFixed(1)}" fill="${C.accent}" font-size="10.5" font-weight="700" text-anchor="end">Objectif ${fmt(target)} kg</text>` : ''}
      <text x="0" y="${(y(max) + 10).toFixed(1)}" fill="#6c707a" font-size="10.5" font-weight="600">${max} kg</text>
      <text x="0" y="${(y(min) - 4).toFixed(1)}" fill="#6c707a" font-size="10.5" font-weight="600">${min} kg</text>
      <path d="${area}" fill="url(#wg)"/>
      <path d="${line}" fill="none" stroke="${C.accent}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${lastP[0].toFixed(1)}" cy="${lastP[1].toFixed(1)}" r="5" fill="${C.accent}" stroke="#07080a" stroke-width="2.5"/>
      <text x="0" y="${H + 17}" fill="#6c707a" font-size="10.5" font-weight="600">${esc(fmtDate(w[0].date))}</text>
      <text x="${W}" y="${H + 17}" fill="#6c707a" font-size="10.5" font-weight="600" text-anchor="end">${esc(fmtDate(w[w.length - 1].date))}</text>
    </svg>`;
  }

  function viewProgress() {
    const { now: avgNow, rate } = weeklyRate();
    const cw = currentWeight();
    const target = targetWeight();
    const bulk = S.settings.phase === 'masse';

    let hint = '', deltaCls = '';
    if (rate != null) {
      if (bulk) {
        if (rate < 0.15) { hint = 'Ça stagne : ajoute ~200 kcal par jour.'; deltaCls = 'warn'; }
        else if (rate > 0.7) { hint = 'Trop rapide, c’est du gras : enlève ~200 kcal par jour.'; deltaCls = 'warn'; }
        else { hint = 'Bon rythme, continue comme ça.'; deltaCls = 'good'; }
      } else {
        if (rate > -0.3) { hint = 'Ça ne descend pas assez : enlève ~200 kcal ou ajoute 20 min de marche par jour.'; deltaCls = 'warn'; }
        else if (rate < -1) { hint = 'Trop rapide : remets ~150 kcal pour garder le muscle.'; deltaCls = 'warn'; }
        else { hint = 'Bon rythme de sèche.'; deltaCls = 'good'; }
      }
    }

    const best = {};
    S.workouts.forEach((w) => Object.entries(w.sets).forEach(([id, sets]) => sets.forEach((s) => {
      const v = e1rm(s.kg, s.reps);
      if (!best[id] || v > best[id].v) best[id] = { v, kg: s.kg, reps: s.reps, date: w.date };
    })));
    const records = Object.entries(best).filter(([, b]) => b.v > 0).sort((a, b) => b[1].v - a[1].v)
      .map(([id, b]) => `<div class="li">${tile('trophy', C.yellow)}
        <div class="grow"><div class="t">${esc(EXERCISES[id] ? EXERCISES[id].name : id)}</div>
        <div class="s">${fmt(b.kg)} kg × ${b.reps} · ${esc(fmtDate(b.date))}</div></div>
        <div style="text-align:right"><div class="num" style="font-size:18px;font-weight:800">${fmt(b.v, 0)}</div><div class="xs dim">kg 1RM</div></div>
      </div>`).join('');

    const history = S.workouts.slice(-30).reverse().map((w) => {
      const idx = S.workouts.indexOf(w);
      const all = Object.values(w.sets).flat();
      const vol = all.reduce((a, s) => a + (s.kg || 0) * (s.reps || 0), 0);
      const s = P.sessions[w.sessionId];
      return `<div class="li">
        <span class="ex-idx" style="--tag:${sColor(w.sessionId)}">${keyToDate(w.date).getDate()}</span>
        <div class="grow"><div class="t">${esc(s ? s.name : w.sessionId)}</div>
        <div class="s">${esc(cap(fmtDate(w.date, { weekday: 'short', day: 'numeric', month: 'short' })))} · ${all.length} séries · ${fmt(vol / 1000, 1)} t${w.durationMin ? ` · ${w.durationMin} min` : ''}</div></div>
        <button class="icon-btn" data-action="del-workout" data-i="${idx}" aria-label="Supprimer la séance">${icon('trash')}</button>
      </div>`;
    }).join('');

    const steps = stepsOn(), sg = stepsGoal(), sAvg = stepsAvg7();

    return `
      ${head(esc(phase().label), 'Suivi')}

      <section class="card pad-lg">
        <div class="row between top">
          <div><div class="eyebrow">Poids</div>
            <div class="metric mt-8"><div class="v" style="font-size:40px">${fmt(cw)}<small>kg</small></div></div></div>
          ${rate != null ? `<span class="delta ${deltaCls}">${rate > 0 ? '+' : ''}${fmt(rate, 2)} kg / sem</span>` : ''}
        </div>
        <div class="mt-16">${weightChart()}</div>
        <div class="stat-row">
          <div class="metric sm"><div class="v">${avgNow != null ? fmt(avgNow) : '—'}</div><div class="l">moyenne 7 j</div></div>
          <div class="metric sm"><div class="v">${fmt(target)}</div><div class="l">objectif</div></div>
          <div class="metric sm"><div class="v">${fmt(Math.abs(target - cw))}</div><div class="l">kg restants</div></div>
        </div>
        ${hint ? `<div class="hint" style="${deltaCls === 'warn' ? 'background:rgba(255,210,63,.1);color:var(--yellow)' : ''}">${icon(deltaCls === 'warn' ? 'info' : 'trend')}${esc(hint)}</div>` : ''}
        <form class="inline-form mt-16" data-form="weight">
          <input class="field" type="number" name="kg" inputmode="decimal" step="0.1" min="30" max="200" placeholder="Poids de ce matin (kg)" required>
          <button class="btn primary sm" type="submit" aria-label="Enregistrer le poids">${icon('check')}</button>
        </form>
      </section>

      <div class="list mt-12">
        <button class="li" data-action="go" data-href="#/pas">${tile('steps', C.accent)}
          <div class="grow"><div class="t">Pas</div><div class="s">Aujourd'hui ${fmt(steps, 0)} / ${fmt(sg, 0)}${sAvg != null ? ` · moy. 7 j ${fmt(sAvg, 0)}` : ''}</div></div>
          ${icon('chevR', 'chev')}
        </button>
      </div>

      ${sectionHead('Records', '1RM estimé')}
      <div class="list">${records || `<div class="empty">${icon('trophy')}Tes records apparaîtront après ta première séance.</div>`}</div>

      ${sectionHead('Historique', S.workouts.length ? `${S.workouts.length} séance${S.workouts.length > 1 ? 's' : ''}` : '')}
      <div class="list">${history || `<div class="empty">${icon('history')}Aucune séance enregistrée pour l'instant.</div>`}</div>

      ${sectionHead('Réglages')}
      <div class="list">
        <label class="li" for="phase">${tile('target', C.accent)}
          <div class="grow"><div class="t">Phase</div><div class="s">Change les objectifs de calories et de pas</div></div>
          <select id="phase" data-change="phase">
            <option value="masse" ${bulk ? 'selected' : ''}>Masse · ${P.athlete.bulkTarget} kg</option>
            <option value="seche" ${!bulk ? 'selected' : ''}>Sèche · ${P.athlete.cutTarget} kg</option>
          </select>
        </label>
        <button class="li" data-action="export">${tile('download', C.cyan)}<div class="grow"><div class="t">Sauvegarder mes données</div><div class="s">Fichier à garder en lieu sûr</div></div>${icon('chevR', 'chev')}</button>
        <label class="li tap" for="import-file">${tile('upload', C.violet)}<div class="grow"><div class="t">Restaurer une sauvegarde</div><div class="s">Remplace les données actuelles</div></div>${icon('chevR', 'chev')}</label>
        <input id="import-file" type="file" accept="application/json,.json" data-change="import" hidden>
        <button class="li danger" data-action="reset">${tile('trash', '#ff5a5f')}<div class="grow"><div class="t">Tout effacer</div></div></button>
      </div>
      <p class="footer-note">Ancelin Training · v${APP_VERSION} · données stockées sur ce téléphone</p>
    `;
  }

  // ------------------------------------------------------------------
  // Routeur
  // ------------------------------------------------------------------
  function route(keepScroll) {
    const y = window.scrollY;
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    let html, tab = 'today', title = 'Aujourd’hui';
    switch (parts[0]) {
      case 'seance': html = viewSession(); title = 'Séance'; break;
      case 'programme': html = parts[1] ? viewSessionDetail(parts[1]) : viewProgram(); tab = 'programme'; title = 'Programme'; break;
      case 'nutrition': html = viewNutrition(); tab = 'nutrition'; title = 'Nutrition'; break;
      case 'suivi': html = viewProgress(); tab = 'suivi'; title = 'Suivi'; break;
      case 'pas': html = viewSteps(); tab = 'suivi'; title = 'Pas'; break;
      default: html = viewToday();
    }
    view.innerHTML = html;
    document.title = `${title} · Ancelin Training`;
    document.querySelectorAll('.dock a').forEach((a) => {
      const on = a.dataset.tab === tab;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (!keepScroll) {
      view.classList.remove('enter');
      void view.offsetWidth; // relance l'animation d'entrée
      view.classList.add('enter');
    } else {
      view.classList.remove('enter');
    }
    window.scrollTo(0, keepScroll ? y : 0);
    updateElapsed();
    manageWakeLock();
  }
  const rerender = () => route(true);
  window.addEventListener('hashchange', () => route(false));

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const haptic = (ms = 8) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* rien */ } };

  function startSession(id) {
    if (!P.sessions[id]) return;
    if (S.active && S.active.sessionId !== id) {
      if (!confirm('Une autre séance est en cours. L’abandonner et commencer celle-ci ?')) return;
      S.active = null;
    }
    if (!S.active) {
      const sets = {};
      P.sessions[id].exercises.forEach((ex) => {
        sets[ex.id] = Array.from({ length: ex.sets }, () => ({ kg: '', reps: '', done: false }));
      });
      S.active = { sessionId: id, startedAt: Date.now(), sets };
      save();
    }
    if (location.hash === '#/seance') rerender(); else location.hash = '#/seance';
  }

  function toggleSet(exId, i) {
    const set = S.active && S.active.sets[exId] && S.active.sets[exId][i];
    if (!set) return;
    if (set.done) { set.done = false; save(); rerender(); return; }
    const last = lastSets(exId);
    const ref = last ? (last.sets[i] || last.sets[last.sets.length - 1]) : null;
    if (set.kg === '' && ref && ref.kg != null) set.kg = String(ref.kg);
    if (set.reps === '' && ref) set.reps = String(ref.reps);
    if (num(set.reps) == null) { toast('Entre le nombre de reps', 'info'); return; }
    set.done = true;
    haptic(12);
    save();
    const ex = EXERCISES[exId];
    const sess = P.sessions[S.active.sessionId];
    const allDone = sess.exercises.every((e) => (S.active.sets[e.id] || []).every((s) => s.done));
    if (!allDone) startRest(ex.rest);
    else toast('Toutes les séries sont faites, tu peux terminer');
    rerender();
  }

  function finishSession() {
    const a = S.active;
    if (!a) return;
    const sets = {};
    let count = 0;
    Object.entries(a.sets).forEach(([id, arr]) => {
      const done = arr.filter((s) => s.done).map((s) => ({ kg: num(s.kg), reps: num(s.reps) || 0 }));
      if (done.length) { sets[id] = done; count += done.length; }
    });
    if (!count) {
      if (confirm('Aucune série validée. Abandonner la séance ?')) { S.active = null; save(); stopRest(); location.hash = '#/'; }
      return;
    }
    S.workouts.push({
      id: Date.now(), date: dayKey(new Date(a.startedAt)), sessionId: a.sessionId,
      durationMin: Math.round((Date.now() - a.startedAt) / 60000), sets,
    });
    S.active = null;
    save();
    stopRest();
    location.hash = '#/';
    toast(`Séance enregistrée · ${count} séries`);
  }

  function setWeight(kg) {
    const k = num(kg);
    if (k == null || k < 30 || k > 200) { toast('Poids invalide', 'info'); return; }
    const d = dayKey();
    S.weights = S.weights.filter((w) => w.date !== d).concat([{ date: d, kg: k }]);
    save();
    toast(`Poids noté · ${fmt(k)} kg`);
    rerender();
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `training-sauvegarde-${dayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function importData(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || !Array.isArray(d.workouts) || !Array.isArray(d.weights)) throw new Error('format');
        if (!confirm('Remplacer les données actuelles par cette sauvegarde ?')) return;
        S = { ...defaults(), ...d, settings: { ...defaults().settings, ...(d.settings || {}) } };
        save(); toast('Sauvegarde restaurée'); rerender();
      } catch (e) { toast('Fichier de sauvegarde invalide', 'info'); }
    };
    r.readAsText(file);
  }

  const actions = {
    go: (el) => { location.hash = el.dataset.href; },
    start: (el) => startSession(el.dataset.id),
    'toggle-set': (el) => toggleSet(el.dataset.ex, +el.dataset.i),
    'add-set': (el) => { S.active.sets[el.dataset.ex].push({ kg: '', reps: '', done: false }); save(); rerender(); },
    'remove-set': (el) => { const a = S.active.sets[el.dataset.ex]; if (a.length > 1) a.pop(); save(); rerender(); },
    finish: finishSession,
    cancel: () => { if (confirm('Abandonner la séance ? Les séries ne seront pas enregistrées.')) { S.active = null; save(); stopRest(); location.hash = '#/'; } },
    'toggle-meal': (el) => { const d = foodDay(); d.meals[el.dataset.id] = !d.meals[el.dataset.id]; if (d.meals[el.dataset.id]) haptic(); save(); rerender(); },
    'del-extra': (el) => { foodDay().extras.splice(+el.dataset.i, 1); save(); rerender(); },
    'del-workout': (el) => { if (confirm('Supprimer cette séance de l’historique ?')) { S.workouts.splice(+el.dataset.i, 1); save(); rerender(); } },
    'ped-start': startPedometer,
    'ped-stop': stopPedometer,
    'paste-steps': pasteSteps,
    export: exportData,
    reset: () => {
      if (confirm('Effacer TOUTES tes données (séances, poids, repas, pas) ?') && confirm('Sûr ? Impossible de revenir en arrière.')) {
        S = defaults(); save(); stopRest(); location.hash = '#/'; rerender();
      }
    },
  };

  view.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || !view.contains(el)) return;
    unlockAudio();
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el, e); }
  });

  view.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.dataset.f || !S.active) return;
    const set = S.active.sets[el.dataset.ex] && S.active.sets[el.dataset.ex][+el.dataset.i];
    if (!set) return;
    set[el.dataset.f] = el.value;
    save();
  });

  view.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.change === 'phase') {
      S.settings.phase = el.value;
      S.settings.phaseStartWeight = currentWeight();
      save(); toast(`Phase · ${phase().label}`); rerender();
    } else if (el.dataset.change === 'import') {
      importData(el.files && el.files[0]);
      el.value = '';
    }
  });

  view.addEventListener('submit', (e) => {
    const f = e.target;
    e.preventDefault();
    const data = new FormData(f);
    if (f.dataset.form === 'weight') setWeight(data.get('kg'));
    if (f.dataset.form === 'steps') {
      const n = num(data.get('steps'));
      if (n == null || n < 0 || n > 100000) { toast('Nombre de pas invalide', 'info'); return; }
      S.steps[dayKey()] = Math.round(n);
      save(); toast(`Pas notés · ${fmt(n, 0)}`); rerender();
    }
    if (f.dataset.form === 'extra') {
      const kcal = num(data.get('kcal'));
      if (kcal == null) return;
      foodDay().extras.push({ name: String(data.get('name')).trim().slice(0, 60), kcal: Math.round(kcal), p: Math.round(num(data.get('p')) || 0) });
      save(); rerender();
    }
  });

  // ------------------------------------------------------------------
  // Minuteur de repos
  // ------------------------------------------------------------------
  const restEl = document.getElementById('rest');
  const restTime = document.getElementById('rest-time');
  const restLabelEl = document.getElementById('rest-label');
  const restArc = document.getElementById('rest-arc');
  const ARC = 2 * Math.PI * 20;
  let rest = null;
  let audioCtx = null;

  function unlockAudio() {
    try {
      if (!audioCtx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) audioCtx = new AC(); }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { /* pas de son */ }
  }
  function beep() {
    if (!audioCtx) return;
    [0, 0.22].forEach((t, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = i ? 1175 : 880;
      o.connect(g); g.connect(audioCtx.destination);
      const at = audioCtx.currentTime + t;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
      o.start(at); o.stop(at + 0.22);
    });
  }
  function showRest(on) {
    restEl.classList.toggle('hidden', !on);
    document.body.classList.toggle('has-rest', on);
  }
  function startRest(sec) {
    rest = { end: Date.now() + sec * 1000, total: sec * 1000, notified: false };
    restEl.classList.remove('finished');
    restLabelEl.textContent = 'Repos';
    showRest(true);
    tick();
  }
  function stopRest() { rest = null; showRest(false); restEl.classList.remove('finished'); }
  function tick() {
    if (!rest) return;
    const left = rest.end - Date.now();
    if (left > 0) {
      restTime.textContent = mmss(left);
      restArc.style.strokeDashoffset = (ARC * (1 - left / rest.total)).toFixed(2);
    } else if (!rest.notified) {
      rest.notified = true;
      restLabelEl.textContent = 'Repos terminé';
      restTime.textContent = 'À toi';
      restArc.style.strokeDashoffset = ARC.toFixed(2);
      restEl.classList.add('finished');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      beep();
      setTimeout(() => { if (rest && rest.notified) stopRest(); }, 5000);
    }
  }
  restEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rest]');
    if (!b || !rest) return;
    if (b.dataset.rest === 'stop') { stopRest(); return; }
    const delta = +b.dataset.rest * 1000;
    rest.end = Math.max(Date.now() + 1000, rest.end + delta);
    rest.total = Math.max(rest.total + delta, 1000);
    rest.notified = false;
    restEl.classList.remove('finished');
    restLabelEl.textContent = 'Repos';
    tick();
  });

  function updateElapsed() {
    if (!S.active) return;
    const txt = fmtElapsed(Date.now() - S.active.startedAt);
    document.querySelectorAll('[data-elapsed]').forEach((el) => { el.textContent = txt; });
  }
  setInterval(() => { tick(); updateElapsed(); }, 250);

  // ------------------------------------------------------------------
  // Compteur de pas (capteur de mouvement, appli ouverte)
  // ------------------------------------------------------------------
  // Détection de pics sur la norme de l'accélération : on lisse le signal,
  // on suit la gravité avec un filtre lent, et chaque pic net au-dessus de
  // cette base (espacé d'au moins 280 ms) compte pour un pas.
  const ped = { on: false, count: 0, smooth: null, base: null, above: false, last: 0, events: 0 };
  function pedReset() {
    Object.assign(ped, { count: 0, smooth: null, base: null, above: false, last: 0, events: 0 });
  }
  function onMotion(e) {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return;
    ped.events++;
    const m = Math.hypot(a.x, a.y, a.z);
    if (ped.smooth == null) { ped.smooth = m; ped.base = m; return; }
    ped.smooth += (m - ped.smooth) * 0.3;
    ped.base += (ped.smooth - ped.base) * 0.02;
    const d = ped.smooth - ped.base;
    const t = performance.now();
    if (!ped.above && d > 1.0 && t - ped.last > 280) {
      ped.above = true;
      ped.last = t;
      ped.count++;
      const k = dayKey();
      S.steps[k] = (S.steps[k] || 0) + 1;
      if (ped.count % 10 === 0) save();
      document.querySelectorAll('[data-steps-live]').forEach((el) => { el.textContent = fmt(ped.count, 0); });
      document.querySelectorAll('[data-steps-today]').forEach((el) => { el.textContent = fmt(S.steps[k], 0); });
    } else if (ped.above && d < 0.2) {
      ped.above = false;
    }
  }
  async function startPedometer() {
    if (ped.on) return;
    if (typeof DeviceMotionEvent === 'undefined') { toast('Ce téléphone ne donne pas accès au capteur de mouvement', 'info'); return; }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const r = await DeviceMotionEvent.requestPermission();
        if (r !== 'granted') { toast('Autorise « Mouvements et orientation » pour compter les pas', 'info'); return; }
      } catch (e) { toast('Accès au capteur refusé', 'info'); return; }
    }
    pedReset();
    ped.on = true;
    window.addEventListener('devicemotion', onMotion);
    rerender();
    setTimeout(() => {
      if (ped.on && ped.events === 0) { stopPedometer(); toast('Aucun capteur de mouvement détecté sur cet appareil', 'info'); }
    }, 3000);
  }
  function stopPedometer() {
    if (!ped.on) return;
    window.removeEventListener('devicemotion', onMotion);
    ped.on = false;
    save();
    if (ped.count) toast(`${fmt(ped.count, 0)} pas ajoutés`);
    rerender();
  }

  // Lit le nombre de pas copié par le raccourci Apple « Mes pas ».
  // Accepte « 8450 », « 8 450 », « 8450,0 », « 8,450 »…
  function parseSteps(text) {
    const t = String(text || '').replace(/[\s  ]/g, '');
    const m = t.match(/\d+(?:[.,]\d+)*/);
    if (!m) return null;
    let s = m[0];
    if (/^\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, ''); // séparateurs de milliers
    const n = Math.round(parseFloat(s.replace(',', '.')));
    return Number.isFinite(n) && n >= 0 && n <= 100000 ? n : null;
  }
  async function pasteSteps() {
    let text = null;
    try { text = await navigator.clipboard.readText(); } catch (e) { text = null; }
    if (text == null) {
      toast('Colle le nombre dans le champ (appui long puis Coller)', 'info');
      const input = document.querySelector('form[data-form=steps] input');
      if (input) input.focus();
      return;
    }
    const n = parseSteps(text);
    if (n == null) { toast('Lance d’abord le raccourci « Mes pas »', 'info'); return; }
    S.steps[dayKey()] = n;
    haptic();
    save(); toast(`${fmt(n, 0)} pas importés depuis Apple Santé`); rerender();
  }

  // Garder l'écran allumé pendant la séance ou le comptage de pas (si le navigateur le permet)
  let wakeLock = null;
  async function manageWakeLock() {
    const want = document.visibilityState === 'visible' && ((!!S.active && location.hash === '#/seance') || ped.on);
    try {
      if (want && !wakeLock && 'wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      } else if (!want && wakeLock) {
        await wakeLock.release(); wakeLock = null;
      }
    } catch (e) { wakeLock = null; }
  }
  document.addEventListener('visibilitychange', () => { manageWakeLock(); tick(); });

  // ------------------------------------------------------------------
  // Toast
  // ------------------------------------------------------------------
  const toastEl = document.getElementById('toast');
  let toastT;
  function toast(msg, kind = 'ok') {
    toastEl.innerHTML = `${icon(kind === 'ok' ? 'check' : 'info')}<span>${esc(msg)}</span>`;
    toastEl.classList.remove('hidden');
    toastEl.style.animation = 'none'; void toastEl.offsetWidth; toastEl.style.animation = '';
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.add('hidden'), 2600);
  }

  // ------------------------------------------------------------------
  // Démarrage + mode hors-ligne
  // ------------------------------------------------------------------
  route(false);
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();

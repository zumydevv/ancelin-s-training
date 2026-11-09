(function () {
  'use strict';

  const P = window.PLAN;
  const KEY = 'ancelin-training-v1';
  const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const view = document.getElementById('view');
  const titleEl = document.getElementById('title');

  // ------------------------------------------------------------------
  // Utilitaires
  // ------------------------------------------------------------------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const z = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  const fmt = (n, d = 1) => Number(n).toLocaleString('fr-FR', { maximumFractionDigits: d });
  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
  const fmtDate = (key, opts = { day: 'numeric', month: 'short' }) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('fr-FR', opts);
  };
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${z(s % 60)}`; };
  const topOfRange = (reps) => { const m = String(reps).match(/(\d+)\s*$/); return m ? +m[1] : null; };

  const EXERCISES = {};
  Object.values(P.sessions).forEach((s) => s.exercises.forEach((ex) => { if (!EXERCISES[ex.id]) EXERCISES[ex.id] = ex; }));

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
    catch (e) { toast("Impossible d'enregistrer sur cet appareil"); }
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

  function progressBar(value, max, overIsBad = true) {
    const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    return `<div class="progress ${overIsBad && value > max * 1.08 ? 'over' : ''}"><div style="width:${pct}%"></div></div>`;
  }

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  // ------------------------------------------------------------------
  // Vues
  // ------------------------------------------------------------------
  function viewToday() {
    const now = new Date();
    const sid = P.schedule[now.getDay()];
    const today = dayKey();
    const doneToday = S.workouts.filter((w) => w.date === today);
    const ph = phase();
    const tot = foodTotals();
    const cw = currentWeight();
    const start = phaseStart();
    const target = targetWeight();
    const phasePct = Math.round(Math.min(100, Math.max(0, ((cw - start) / (target - start)) * 100)) || 0);

    let session = '';
    if (S.active) {
      const s = P.sessions[S.active.sessionId];
      session = `<div class="card accent">
        <p class="muted small">Séance en cours</p>
        <h3>${esc(s.name)}</h3>
        <p class="muted">${esc(s.focus)}</p>
        <button class="btn block" data-action="go" data-href="#/seance">Reprendre la séance</button>
      </div>`;
    } else if (sid) {
      const s = P.sessions[sid];
      const nSets = s.exercises.reduce((a, e) => a + e.sets, 0);
      session = `<div class="card accent">
        <p class="muted small">Séance du jour</p>
        <h3>${esc(s.name)}${doneToday.length ? '<span class="badge">faite ✓</span>' : ''}</h3>
        <p class="muted">${esc(s.focus)} · ${s.exercises.length} exos · ${nSets} séries · ~${Math.round(nSets * 3 + 10)} min</p>
        <div class="row" style="margin-top:10px">
          <button class="btn grow" data-action="start" data-id="${sid}">${doneToday.length ? 'Refaire' : 'Commencer'}</button>
          <button class="btn ghost" data-action="go" data-href="#/programme/${sid}">Voir</button>
        </div>
      </div>`;
    } else {
      session = `<div class="card">
        <p class="muted small">Aujourd'hui</p>
        <h3>Jour de repos 😴</h3>
        <p class="muted">Mange bien, dors bien, c'est là que le muscle se construit. Tu veux quand même t'entraîner ?</p>
        <div class="row" style="flex-wrap:wrap;margin-top:8px">
          ${Object.entries(P.sessions).map(([id, s]) => `<button class="chip" data-action="start" data-id="${id}">${esc(s.name)}</button>`).join('')}
        </div>
      </div>`;
    }

    const install = isStandalone() ? '' : `<div class="card">
      <h3>📲 Installer l'appli</h3>
      <p class="muted small"><b>iPhone</b> : dans Safari, bouton Partager puis « Sur l'écran d'accueil ».<br>
      <b>Android</b> : dans Chrome, menu ⋮ puis « Installer l'application » (ou « Ajouter à l'écran d'accueil »).</p>
    </div>`;

    return `
      <h2 style="text-transform:capitalize">${esc(now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))}</h2>
      ${session}

      <div class="card tap" data-action="go" data-href="#/nutrition">
        <div class="row between"><h3>Nutrition du jour</h3><span class="muted small">${esc(ph.label)}</span></div>
        <div class="stack">
          <div class="row between small"><span>Calories</span><span><b>${fmt(tot.kcal, 0)}</b> / ${fmt(ph.targets.kcal, 0)} kcal</span></div>
          ${progressBar(tot.kcal, ph.targets.kcal)}
          <div class="row between small"><span>Protéines</span><span><b>${fmt(tot.p, 0)}</b> / ${ph.targets.p} g</span></div>
          ${progressBar(tot.p, ph.targets.p)}
        </div>
      </div>

      <div class="card tap" data-action="go" data-href="#/pas">
        <div class="row between"><h3>👟 Pas du jour</h3><span class="muted small">${ped.on ? '<span style="color:var(--accent)">● compteur actif</span>' : 'objectif ' + fmt(stepsGoal(), 0)}</span></div>
        <div class="stack">
          <div class="row between small"><span>Pas</span><span><b data-steps-today>${fmt(stepsOn(), 0)}</b> / ${fmt(stepsGoal(), 0)}</span></div>
          ${progressBar(stepsOn(), stepsGoal(), false)}
        </div>
      </div>

      <div class="card">
        <div class="row between"><h3>${esc(ph.label)}</h3><span class="muted small">${fmt(start)} → ${fmt(target)} kg</span></div>
        <p class="muted small">Poids actuel : <b style="color:var(--text)">${fmt(cw)} kg</b> · ${phasePct} % du chemin</p>
        ${progressBar(phasePct, 100)}
        <form class="row" data-form="weight" style="margin-top:12px">
          <input type="number" name="kg" inputmode="decimal" step="0.1" min="30" max="200" placeholder="Poids de ce matin (kg)" required>
          <button class="btn sm" type="submit">OK</button>
        </form>
      </div>
      ${install}
    `;
  }

  function exerciseLastLine(ex) {
    const last = lastSets(ex.id);
    if (!last) return '<div class="ex-last">Première fois : trouve une charge qui te laisse 2 reps en réserve.</div>';
    const top = topOfRange(ex.reps);
    const allTop = top && last.sets.length >= ex.sets && last.sets.every((s) => (s.reps || 0) >= top);
    return `<div class="ex-last">Dernière fois (${esc(fmtDate(last.date))}) : <b>${last.sets.map((s) => `${s.kg != null ? fmt(s.kg) : '–'}×${s.reps}`).join(' · ')}</b>
      ${allTop ? '<br><span style="color:var(--accent)">↑ Tu as fait le haut de la fourchette partout : monte la charge !</span>' : ''}</div>`;
  }

  function viewSession() {
    if (!S.active) {
      return `<div class="card"><h3>Aucune séance en cours</h3><p class="muted">Lance une séance depuis l'accueil ou le programme.</p>
        <button class="btn block" data-action="go" data-href="#/programme">Voir le programme</button></div>`;
    }
    const sess = P.sessions[S.active.sessionId];
    const cards = sess.exercises.map((ex) => {
      const sets = S.active.sets[ex.id] || [];
      const last = lastSets(ex.id);
      const allDone = sets.length > 0 && sets.every((s) => s.done);
      const rows = sets.map((s, i) => {
        const ref = last ? (last.sets[i] || last.sets[last.sets.length - 1]) : null;
        return `<div class="set ${s.done ? 'done' : ''}">
          <span class="n">${i + 1}</span>
          <input type="number" inputmode="decimal" step="0.5" min="0" aria-label="Charge série ${i + 1}"
            placeholder="${ref && ref.kg != null ? fmt(ref.kg) : 'kg'}" value="${esc(s.kg)}" data-ex="${ex.id}" data-i="${i}" data-f="kg">
          <input type="number" inputmode="numeric" min="0" aria-label="Répétitions série ${i + 1}"
            placeholder="${ref ? ref.reps : esc(ex.reps)}" value="${esc(s.reps)}" data-ex="${ex.id}" data-i="${i}" data-f="reps">
          <button class="check ${s.done ? 'on' : ''}" data-action="toggle-set" data-ex="${ex.id}" data-i="${i}" aria-label="Valider la série ${i + 1}">✓</button>
        </div>`;
      }).join('');
      return `<div class="card ${allDone ? 'ex-done' : ''}">
        <div class="ex-head"><h3 class="ex-title">${esc(ex.name)}</h3></div>
        <div class="ex-meta">${ex.sets} × ${esc(ex.reps)} reps · repos ${mmss(ex.rest * 1000)}</div>
        ${exerciseLastLine(ex)}
        <details class="tip"><summary>Conseils d'exécution</summary><p>${esc(ex.tip)}</p></details>
        <div class="sets">
          <div class="set-labels"><span>#</span><span>kg</span><span>reps</span><span></span></div>
          ${rows}
        </div>
        <div class="set-actions">
          <button class="chip" data-action="add-set" data-ex="${ex.id}">+ série</button>
          ${sets.length > 1 ? `<button class="chip" data-action="remove-set" data-ex="${ex.id}">− série</button>` : ''}
        </div>
      </div>`;
    }).join('');

    return `
      <div class="row between"><h2>${esc(sess.name)}</h2><span class="muted small" id="elapsed"></span></div>
      <p class="muted" style="margin-top:-6px">${esc(sess.focus)}</p>
      <p class="muted small">Tape sur ✓ pour valider une série : si les cases sont vides, ce que tu as fait la dernière fois est repris. Le minuteur de repos se lance tout seul.</p>
      ${cards}
      <button class="btn block" data-action="finish">Terminer la séance</button>
      <div style="height:10px"></div>
      <button class="btn danger block" data-action="cancel">Abandonner</button>
    `;
  }

  function viewProgram() {
    const today = new Date().getDay();
    const week = DAY_ORDER.map((d) => {
      const sid = P.schedule[d];
      const s = sid ? P.sessions[sid] : null;
      const isToday = d === today;
      if (!s) {
        return `<div class="card"><div class="row between"><span><b>${DAY_NAMES[d]}</b>${isToday ? '<span class="badge">aujourd’hui</span>' : ''}</span><span class="muted">Repos</span></div></div>`;
      }
      return `<div class="card tap ${isToday ? 'accent' : ''}" data-action="go" data-href="#/programme/${sid}">
        <div class="row between"><span><b>${DAY_NAMES[d]}</b>${isToday ? '<span class="badge">aujourd’hui</span>' : ''}</span><span class="muted">›</span></div>
        <h3 style="margin-top:4px">${esc(s.name)}</h3>
        <p class="muted small" style="margin:0">${esc(s.focus)} · ${s.exercises.length} exos</p>
      </div>`;
    }).join('');

    return `
      <h2>Ta semaine</h2>
      ${week}
      <div class="section-title">Ce qui change par rapport à avant</div>
      <div class="card"><ul class="bullets">${P.changes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <div class="section-title">Les règles</div>
      ${P.principles.map((p) => `<div class="card"><h3>${esc(p.title)}</h3><p class="muted" style="margin:0">${esc(p.text)}</p></div>`).join('')}
    `;
  }

  function viewSessionDetail(id) {
    const s = P.sessions[id];
    if (!s) return viewProgram();
    const days = DAY_ORDER.filter((d) => P.schedule[d] === id).map((d) => DAY_NAMES[d]).join(', ');
    return `
      <button class="chip" data-action="go" data-href="#/programme">‹ Programme</button>
      <h2 style="margin-top:12px">${esc(s.name)}</h2>
      <p class="muted" style="margin-top:-6px">${esc(s.focus)}${days ? ` · ${esc(days)}` : ''}</p>
      ${s.exercises.map((ex, i) => `<div class="card">
        <h3>${i + 1}. ${esc(ex.name)}${ex.isNew ? '<span class="badge">nouveau</span>' : ''}</h3>
        <div class="ex-meta">${ex.sets} × ${esc(ex.reps)} reps · repos ${mmss(ex.rest * 1000)}</div>
        ${exerciseLastLine(ex)}
        <details class="tip"><summary>Conseils d'exécution</summary><p>${esc(ex.tip)}</p></details>
      </div>`).join('')}
      <button class="btn block" data-action="start" data-id="${id}">Commencer cette séance</button>
    `;
  }

  function viewNutrition() {
    const ph = phase();
    const day = S.food[dayKey()] || { meals: {}, extras: [] };
    const tot = foodTotals();
    const t = ph.targets;
    return `
      <h2>${esc(ph.label)}</h2>
      <p class="muted" style="margin-top:-6px">${esc(ph.goal)}</p>

      <div class="card">
        <div class="kpis">
          <div class="kpi"><div class="v">${fmt(tot.kcal, 0)}</div><div class="l">/ ${fmt(t.kcal, 0)} kcal</div></div>
          <div class="kpi"><div class="v">${fmt(tot.p, 0)} g</div><div class="l">/ ${t.p} g protéines</div></div>
        </div>
        <div class="stack" style="margin-top:12px">
          ${progressBar(tot.kcal, t.kcal)}
          <p class="muted small" style="margin:0">Objectif du jour : ${t.p} g protéines · ${t.g} g glucides · ${t.l} g lipides</p>
        </div>
      </div>

      <div class="section-title">Repas types (coche quand c'est mangé)</div>
      ${ph.meals.map((m) => `<div class="card"><div class="meal">
        <button class="tick ${day.meals[m.id] ? 'on' : ''}" data-action="toggle-meal" data-id="${m.id}" aria-label="Repas mangé">${day.meals[m.id] ? '✓' : ''}</button>
        <div class="grow">
          <h3>${esc(m.name)}</h3>
          <ul>${m.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          <div class="macros">${m.kcal} kcal · P ${m.p} g · G ${m.g} g · L ${m.l} g</div>
        </div>
      </div></div>`).join('')}

      <div class="section-title">Ajout libre (resto, extra…)</div>
      <div class="card">
        <form data-form="extra" class="stack">
          <input type="text" name="name" placeholder="Ex : kebab, shaker…" required maxlength="60">
          <div class="row">
            <input type="number" name="kcal" inputmode="numeric" min="0" placeholder="kcal" required>
            <input type="number" name="p" inputmode="numeric" min="0" placeholder="protéines (g)">
          </div>
          <button class="btn block" type="submit">Ajouter</button>
        </form>
        ${day.extras.length ? `<ul class="list-plain" style="margin-top:10px">${day.extras.map((x, i) => `<li class="row between">
          <span class="grow">${esc(x.name)}<br><span class="muted small">${x.kcal} kcal · ${x.p || 0} g prot.</span></span>
          <button class="chip" data-action="del-extra" data-i="${i}" aria-label="Supprimer">✕</button></li>`).join('')}</ul>` : ''}
      </div>

      <div class="section-title">Les règles</div>
      <div class="card"><ul class="bullets">${P.nutrition.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    `;
  }

  function stepsChart() {
    const goal = stepsGoal();
    const days = Array.from({ length: 14 }, (_, i) => daysAgoKey(13 - i));
    const vals = days.map((d) => stepsOn(d));
    if (!vals.some((v) => v > 0)) return '<p class="muted small" style="margin:0">Le graphique des 14 derniers jours apparaîtra ici.</p>';
    const max = Math.max(goal * 1.2, ...vals);
    const W = 300, H = 140, bw = W / days.length;
    const y = (v) => H - (v / max) * (H - 10);
    const bars = days.map((d, i) => {
      const v = vals[i];
      const h = H - y(v);
      const [yy, mm, dd] = d.split('-').map(Number);
      const letter = 'DLMMJVS'[new Date(yy, mm - 1, dd).getDay()];
      return `<rect x="${(i * bw + 3).toFixed(1)}" y="${y(v).toFixed(1)}" width="${(bw - 6).toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="3" fill="${v >= goal ? '#c8f04a' : '#5f6878'}"/>
        <text x="${(i * bw + bw / 2).toFixed(1)}" y="${H + 12}" fill="#9aa3b2" font-size="9" text-anchor="middle">${letter}</text>`;
    }).join('');
    const gy = y(goal).toFixed(1);
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 16}" role="img" aria-label="Pas des 14 derniers jours">
      ${bars}
      <line x1="0" x2="${W}" y1="${gy}" y2="${gy}" stroke="#c8f04a" stroke-dasharray="4 4" stroke-width="1" opacity=".7"/>
      <text x="${W - 2}" y="${gy - 4}" fill="#c8f04a" font-size="10" text-anchor="end">objectif ${fmt(goal, 0)}</text>
    </svg>`;
  }

  function viewSteps() {
    const today = stepsOn();
    const goal = stepsGoal();
    const avg = stepsAvg7();
    return `
      <h2>Pas</h2>
      <div class="card">
        <div class="kpis">
          <div class="kpi"><div class="v" data-steps-today>${fmt(today, 0)}</div><div class="l">pas aujourd'hui</div></div>
          <div class="kpi"><div class="v">${fmt(goal, 0)}</div><div class="l">objectif (${esc(phase().label.toLowerCase())})</div></div>
        </div>
        <div style="margin-top:12px">${progressBar(today, goal, false)}</div>
        <p class="muted small" style="margin:8px 0 0">${today >= goal ? 'Objectif atteint 🔥' : `Encore ${fmt(goal - today, 0)} pas`}${avg != null ? ` · moyenne 7 jours : ${fmt(avg, 0)}` : ''}</p>
      </div>

      <div class="card ${ped.on ? 'accent' : ''}">
        <h3>Compteur en direct</h3>
        ${ped.on ? `
          <p class="muted small">Garde l'appli ouverte, l'écran reste allumé. Téléphone en main ou dans la poche.</p>
          <div style="font-size:44px;font-weight:800;letter-spacing:-0.02em" data-steps-live>${fmt(ped.count, 0)}</div>
          <p class="muted small">pas pendant cette marche, ajoutés automatiquement au total du jour</p>
          <button class="btn danger block" data-action="ped-stop">Arrêter</button>
        ` : `
          <p class="muted small">Utilise le capteur de mouvement du téléphone. Pratique pour une marche ou du tapis : lance-le, mets le téléphone dans ta poche, l'écran reste allumé.</p>
          <button class="btn block" data-action="ped-start">▶ Démarrer le compteur</button>
        `}
      </div>

      <div class="card">
        <h3>Total de la journée (Apple Santé)</h3>
        <p class="muted small">Lance ton raccourci « Mes pas » : il copie tes vrais pas Apple. Reviens ici et appuie sur le bouton. Le chiffre remplace le total du jour.</p>
        <button class="btn block" data-action="paste-steps">📋 Coller mes pas Apple</button>
        <details class="tip">
          <summary>Créer le raccourci « Mes pas » (une seule fois)</summary>
          <ol class="small" style="padding-left:18px;margin:8px 0 0">
            <li>Ouvre l'appli <b>Raccourcis</b>, puis touche <b>+</b>.</li>
            <li>Ajoute l'action <b>Rechercher des échantillons de santé</b>. Règle : Type = <b>Nombre de pas</b>, Date de début = <b>Aujourd'hui</b>, Regrouper par = <b>Jour</b>.</li>
            <li>Ajoute l'action <b>Copier dans le presse-papiers</b>.</li>
            <li>Nomme le raccourci <b>Mes pas</b>. Ajoute-le à l'écran d'accueil ou en widget, et autorise l'accès à Santé la première fois.</li>
          </ol>
        </details>
        <p class="muted small" style="margin:12px 0 6px">Ou tape le chiffre à la main (Santé, Google Fit…) :</p>
        <form class="row" data-form="steps">
          <input type="number" name="steps" inputmode="numeric" min="0" max="100000" placeholder="Ex : 8450" required>
          <button class="btn sm" type="submit">OK</button>
        </form>
      </div>

      <div class="section-title">14 derniers jours</div>
      <div class="card">${stepsChart()}</div>

      <div class="section-title">À savoir</div>
      <div class="card"><ul class="bullets">${P.steps.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    `;
  }

  function weightChart() {
    const w = weightsSorted().slice(-90);
    if (w.length < 2) return '<p class="muted small">Note ton poids quelques jours pour voir la courbe.</p>';
    const target = targetWeight();
    const vals = w.map((x) => x.kg).concat([target]);
    const min = Math.floor(Math.min(...vals) - 1), max = Math.ceil(Math.max(...vals) + 1);
    const W = 300, H = 160, pad = 24;
    const x = (i) => pad + (i / (w.length - 1)) * (W - pad - 6);
    const y = (v) => 8 + (1 - (v - min) / (max - min)) * (H - 24);
    const pts = w.map((p, i) => `${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(' ');
    const ty = y(target).toFixed(1);
    return `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Courbe de poids">
      <line x1="${pad}" x2="${W}" y1="${ty}" y2="${ty}" stroke="#c8f04a" stroke-dasharray="4 4" stroke-width="1" opacity=".6"/>
      <text x="${W - 4}" y="${ty - 4}" fill="#c8f04a" font-size="10" text-anchor="end">objectif ${fmt(target)} kg</text>
      <text x="0" y="${y(max) + 4}" fill="#9aa3b2" font-size="10">${max}</text>
      <text x="0" y="${y(min) + 4}" fill="#9aa3b2" font-size="10">${min}</text>
      <polyline points="${pts}" fill="none" stroke="#f1f3f7" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${w.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.kg).toFixed(1)}" r="2.2" fill="#c8f04a"/>`).join('')}
      <text x="${pad}" y="${H + 8}" fill="#9aa3b2" font-size="10">${esc(fmtDate(w[0].date))}</text>
      <text x="${W}" y="${H + 8}" fill="#9aa3b2" font-size="10" text-anchor="end">${esc(fmtDate(w[w.length - 1].date))}</text>
    </svg>`;
  }

  function viewProgress() {
    const today = dayKey();
    const avgNow = avgBetween(daysAgoKey(7), today);
    const avgPrev = avgBetween(daysAgoKey(14), daysAgoKey(7));
    const rate = avgNow != null && avgPrev != null ? avgNow - avgPrev : null;
    const cw = currentWeight();
    const target = targetWeight();

    let rateHint = '';
    if (rate != null) {
      if (S.settings.phase === 'masse') {
        if (rate < 0.15) rateHint = 'Ça stagne : ajoute ~200 kcal par jour.';
        else if (rate > 0.7) rateHint = 'Trop rapide (gras) : enlève ~200 kcal par jour.';
        else rateHint = 'Bon rythme, continue comme ça 👌';
      } else {
        if (rate > -0.3) rateHint = 'Ça ne descend pas assez : enlève ~200 kcal ou ajoute 20 min de marche par jour.';
        else if (rate < -1) rateHint = 'Trop rapide : remets ~150 kcal pour garder le muscle.';
        else rateHint = 'Bon rythme de sèche 👌';
      }
    }

    // Records
    const best = {};
    S.workouts.forEach((w) => Object.entries(w.sets).forEach(([id, sets]) => sets.forEach((s) => {
      const v = e1rm(s.kg, s.reps);
      if (!best[id] || v > best[id].v) best[id] = { v, kg: s.kg, reps: s.reps, date: w.date };
    })));
    const records = Object.entries(best).filter(([, b]) => b.v > 0)
      .map(([id, b]) => `<li class="row between"><span class="grow">${esc(EXERCISES[id] ? EXERCISES[id].name : id)}<br>
        <span class="muted small">${fmt(b.kg)} kg × ${b.reps} · ${esc(fmtDate(b.date))}</span></span>
        <span><b>${fmt(b.v, 0)}</b> <span class="muted small">kg 1RM est.</span></span></li>`).join('');

    const history = S.workouts.slice(-30).reverse().map((w) => {
      const idx = S.workouts.indexOf(w);
      const all = Object.values(w.sets).flat();
      const vol = all.reduce((a, s) => a + (s.kg || 0) * (s.reps || 0), 0);
      const s = P.sessions[w.sessionId];
      return `<li class="row between"><span class="grow"><b>${esc(s ? s.name : w.sessionId)}</b> · ${esc(fmtDate(w.date, { weekday: 'short', day: 'numeric', month: 'short' }))}<br>
        <span class="muted small">${all.length} séries · ${fmt(vol / 1000, 1)} t soulevées${w.durationMin ? ` · ${w.durationMin} min` : ''}</span></span>
        <button class="chip" data-action="del-workout" data-i="${idx}" aria-label="Supprimer">✕</button></li>`;
    }).join('');

    return `
      <h2>Poids</h2>
      <div class="card">
        <div class="kpis">
          <div class="kpi"><div class="v">${fmt(cw)} kg</div><div class="l">dernière pesée</div></div>
          <div class="kpi"><div class="v">${avgNow != null ? fmt(avgNow) + ' kg' : '–'}</div><div class="l">moyenne 7 jours</div></div>
          <div class="kpi"><div class="v">${rate != null ? (rate > 0 ? '+' : '') + fmt(rate, 2) : '–'}</div><div class="l">kg / semaine</div></div>
          <div class="kpi"><div class="v">${fmt(Math.abs(target - cw))} kg</div><div class="l">avant l'objectif (${fmt(target)} kg)</div></div>
        </div>
        ${rateHint ? `<p class="small" style="margin:12px 0 0">${esc(rateHint)}</p>` : ''}
        <div style="margin-top:12px">${weightChart()}</div>
        <form class="row" data-form="weight" style="margin-top:12px">
          <input type="number" name="kg" inputmode="decimal" step="0.1" min="30" max="200" placeholder="Poids de ce matin (kg)" required>
          <button class="btn sm" type="submit">OK</button>
        </form>
      </div>

      <div class="section-title">Pas</div>
      <div class="card tap" data-action="go" data-href="#/pas">
        <div class="row between"><span>Aujourd'hui : <b>${fmt(stepsOn(), 0)}</b> / ${fmt(stepsGoal(), 0)}${stepsAvg7() != null ? `<br><span class="muted small">moyenne 7 jours : ${fmt(stepsAvg7(), 0)}</span>` : ''}</span><span class="muted">›</span></div>
      </div>

      <div class="section-title">Records (1RM estimé)</div>
      <div class="card">${records ? `<ul class="list-plain">${records}</ul>` : '<p class="muted small" style="margin:0">Tes records apparaîtront après ta première séance.</p>'}</div>

      <div class="section-title">Historique des séances</div>
      <div class="card">${history ? `<ul class="list-plain">${history}</ul>` : '<p class="muted small" style="margin:0">Aucune séance enregistrée pour l’instant.</p>'}</div>

      <div class="section-title">Réglages</div>
      <div class="card stack">
        <label class="small muted" for="phase">Phase actuelle</label>
        <select id="phase" data-change="phase">
          <option value="masse" ${S.settings.phase === 'masse' ? 'selected' : ''}>Prise de masse (objectif ${P.athlete.bulkTarget} kg)</option>
          <option value="seche" ${S.settings.phase === 'seche' ? 'selected' : ''}>Sèche (objectif ${P.athlete.cutTarget} kg)</option>
        </select>
        <p class="muted small">Tes données restent sur ce téléphone. Fais une sauvegarde de temps en temps.</p>
        <div class="row">
          <button class="btn ghost sm grow" data-action="export">Sauvegarder</button>
          <label class="btn ghost sm grow" for="import-file">Restaurer</label>
          <input id="import-file" type="file" accept="application/json,.json" data-change="import" hidden>
        </div>
        <button class="btn danger sm block" data-action="reset">Tout effacer</button>
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Routeur
  // ------------------------------------------------------------------
  function route(keepScroll) {
    const y = window.scrollY;
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    let html, tab = 'today', title = 'Training';
    switch (parts[0]) {
      case 'seance': html = viewSession(); title = 'Séance'; break;
      case 'programme':
        html = parts[1] ? viewSessionDetail(parts[1]) : viewProgram(); tab = 'programme'; title = 'Programme'; break;
      case 'nutrition': html = viewNutrition(); tab = 'nutrition'; title = 'Nutrition'; break;
      case 'suivi': html = viewProgress(); tab = 'suivi'; title = 'Suivi'; break;
      case 'pas': html = viewSteps(); tab = 'suivi'; title = 'Pas'; break;
      default: html = viewToday(); title = `Salut ${P.athlete.name} 👋`;
    }
    view.innerHTML = html;
    titleEl.textContent = title;
    document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
    window.scrollTo(0, keepScroll ? y : 0);
    updateElapsed();
    manageWakeLock();
  }
  const rerender = () => route(true);
  window.addEventListener('hashchange', () => route(false));

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
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
    if (num(set.reps) == null) { toast('Entre le nombre de reps'); return; }
    set.done = true;
    save();
    const ex = EXERCISES[exId];
    const sess = P.sessions[S.active.sessionId];
    const allDone = sess.exercises.every((e) => (S.active.sets[e.id] || []).every((s) => s.done));
    if (!allDone) startRest(ex.rest);
    else toast('Toutes les séries sont faites, tu peux terminer 💪');
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
    toast(`Séance enregistrée : ${count} séries 💪`);
  }

  function setWeight(kg) {
    const k = num(kg);
    if (k == null || k < 30 || k > 200) { toast('Poids invalide'); return; }
    const d = dayKey();
    S.weights = S.weights.filter((w) => w.date !== d).concat([{ date: d, kg: k }]);
    save();
    toast(`Poids noté : ${fmt(k)} kg`);
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
      } catch (e) { toast('Fichier de sauvegarde invalide'); }
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
    'toggle-meal': (el) => { const d = foodDay(); d.meals[el.dataset.id] = !d.meals[el.dataset.id]; save(); rerender(); },
    'del-extra': (el) => { foodDay().extras.splice(+el.dataset.i, 1); save(); rerender(); },
    'del-workout': (el) => { if (confirm('Supprimer cette séance de l’historique ?')) { S.workouts.splice(+el.dataset.i, 1); save(); rerender(); } },
    'ped-start': startPedometer,
    'ped-stop': stopPedometer,
    'paste-steps': pasteSteps,
    export: exportData,
    reset: () => {
      if (confirm('Effacer TOUTES tes données (séances, poids, repas) ?') && confirm('Sûr ? Impossible de revenir en arrière.')) {
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
      save(); toast(`Phase : ${phase().label}`); rerender();
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
      if (n == null || n < 0 || n > 100000) { toast('Nombre de pas invalide'); return; }
      S.steps[dayKey()] = Math.round(n);
      save(); toast(`Pas notés : ${fmt(n, 0)}`); rerender();
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
  const restFill = document.getElementById('rest-fill');
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
    [0, 0.25].forEach((t) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination);
      const at = audioCtx.currentTime + t;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.4, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);
      o.start(at); o.stop(at + 0.2);
    });
  }
  function startRest(sec) {
    rest = { end: Date.now() + sec * 1000, total: sec * 1000, notified: false };
    restEl.classList.remove('hidden', 'finished');
    tick();
  }
  function stopRest() { rest = null; restEl.classList.add('hidden'); restEl.classList.remove('finished'); }
  function tick() {
    if (rest) {
      const left = rest.end - Date.now();
      if (left > 0) {
        restTime.textContent = mmss(left);
        restFill.style.width = `${100 - (left / rest.total) * 100}%`;
      } else if (!rest.notified) {
        rest.notified = true;
        restTime.textContent = 'Go ! 💪';
        restFill.style.width = '100%';
        restEl.classList.add('finished');
        if (navigator.vibrate) navigator.vibrate([250, 120, 250]);
        beep();
        setTimeout(() => { if (rest && rest.notified) stopRest(); }, 5000);
      }
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
    tick();
  });

  function updateElapsed() {
    const el = document.getElementById('elapsed');
    if (el && S.active) el.textContent = `⏱ ${Math.floor((Date.now() - S.active.startedAt) / 60000)} min`;
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
    if (typeof DeviceMotionEvent === 'undefined') { toast("Ce téléphone ne donne pas accès au capteur de mouvement"); return; }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const r = await DeviceMotionEvent.requestPermission();
        if (r !== 'granted') { toast('Autorise « Mouvements et orientation » pour compter les pas'); return; }
      } catch (e) { toast('Accès au capteur refusé'); return; }
    }
    pedReset();
    ped.on = true;
    window.addEventListener('devicemotion', onMotion);
    rerender();
    setTimeout(() => {
      if (ped.on && ped.events === 0) { stopPedometer(); toast('Aucun capteur de mouvement détecté sur cet appareil'); }
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
      toast('Colle le nombre dans le champ en dessous (appui long puis Coller)');
      const input = document.querySelector('form[data-form=steps] input');
      if (input) input.focus();
      return;
    }
    const n = parseSteps(text);
    if (n == null) { toast("Pas de nombre de pas dans le presse-papiers : lance d'abord le raccourci « Mes pas »"); return; }
    S.steps[dayKey()] = n;
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
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.add('hidden'), 2500);
  }

  // ------------------------------------------------------------------
  // Démarrage + mode hors-ligne
  // ------------------------------------------------------------------
  route(false);
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();

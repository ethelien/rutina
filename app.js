'use strict';

const APP_VERSION = '1.0.0';
const STORE_KEY = 'rutina.v1';

/* ---------- Estado ---------- */

function freshState() {
  return { version: 1, week: 1, done: [], checks: {}, log: [] };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return freshState();
    const s = JSON.parse(raw);
    return Object.assign(freshState(), s);
  } catch (e) {
    return freshState();
  }
}

let state = loadState();

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    toast('No se pudo guardar en el móvil');
  }
}

/* ---------- Utilidades ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = (n) => String(n).padStart(2, '0');

function nowLocal() {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}
function stamp(date, time) { return `${date}T${time || '00:00'}`; }
function nowStamp() { const n = nowLocal(); return stamp(n.date, n.time); }
function parseStamp(s) { const [d, t] = s.split('T'); const [y, m, dd] = d.split('-').map(Number); const [h, mi] = (t || '00:00').split(':').map(Number); return new Date(y, m - 1, dd, h, mi); }

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fmtDate(s) {
  const d = parseStamp(s);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  const diff = Math.round((today - day) / 86400000);
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diff === 0) return `hoy ${hm}`;
  if (diff === 1) return `ayer ${hm}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${hm}`;
}

const phaseOf = (week) => (week <= 4 ? 0 : week <= 8 ? 1 : 2);
const isDeload = (week) => DELOAD_WEEKS.includes(week);
const sessionById = (id) => SESSIONS.find((s) => s.id === id);

function exercisesOf(session) {
  return session.warmup ? [WARMUP, ...session.exercises] : session.exercises.slice();
}

function nextSession() {
  return SESSIONS.find((s) => !state.done.includes(s.id)) || null;
}

function parseKm(v) {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}
function parseTime(v) {
  const parts = String(v).trim().split(':').map((x) => x.trim());
  if (!parts.length || parts.some((p) => p === '' || !/^\d+$/.test(p))) return null;
  const nums = parts.map(Number);
  let sec;
  if (nums.length === 3) sec = nums[0] * 3600 + nums[1] * 60 + nums[2];
  else if (nums.length === 2) sec = nums[0] * 60 + nums[1];
  else if (nums.length === 1) sec = nums[0] * 60;
  else return null;
  return sec > 0 ? sec : null;
}
function fmtDuration(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
function fmtPace(sec, km) {
  if (!sec || !km) return '–';
  const p = Math.round(sec / km);
  return `${Math.floor(p / 60)}:${pad(p % 60)}`;
}
const fmtKm = (km) => (Math.round(km * 10) / 10).toString().replace('.', ',');

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- Iconos ---------- */

const I = {
  check: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>',
  checkBig: '<svg width="48" height="48" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  next: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  camera: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  upload: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V9M7 14l5-5 5 5M5 4h14"/></svg>',
  run: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v5M6 12l3-4 4 1 3 3 3 1"/></svg>',
  tabRutina: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/></svg>',
  tabControl: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h10M4 12h16M4 18h7"/></svg>',
  tabHist: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  tabAjustes: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
};

/* ---------- Pantalla: Rutina ---------- */

function viewRutina() {
  const next = nextSession();
  const doneCount = state.done.length;
  const phase = phaseOf(state.week) + 1;
  let hero;
  if (next) {
    const s = next;
    const count = s.exercises.length;
    hero = `
      <section class="hero" aria-label="Entreno de hoy">
        <p class="eyebrow">Toca hoy</p>
        <h2>${s.id} · ${esc(s.title)}</h2>
        <p class="sub">${s.warmup ? 'Calentamiento + ' : ''}${count} ejercicios · 30 min</p>
        <a class="btn" href="#/dia/${s.id}">Empezar</a>
      </section>`;
  } else {
    hero = `
      <section class="hero">
        <p class="eyebrow">Rutina terminada</p>
        <h2>Has hecho los 5 días</h2>
        <a class="btn" href="#/completada">Ver resumen</a>
      </section>`;
  }

  const list = SESSIONS.map((s, i) => {
    const done = state.done.includes(s.id);
    const current = next && next.id === s.id;
    const checks = (state.checks[s.id] || []).length;
    const total = exercisesOf(s).length;
    const badge = done ? `<span class="badge ok">${I.check}</span>` : current ? `<span class="badge now">${i + 1}</span>` : `<span class="badge">${i + 1}</span>`;
    const detail = done ? `Día ${i + 1} · Completado` : current ? `Día ${i + 1} · Hoy${checks ? ` · ${checks} de ${total} hechos` : ''}` : `Día ${i + 1} · Pendiente${checks ? ` · ${checks} de ${total} hechos` : ''}`;
    return `<a class="item ${current ? 'current' : ''}" href="#/dia/${s.id}">${badge}<span class="body"><span class="title">${s.id} · ${esc(s.title)}</span><span class="detail" style="display:block">${detail}</span></span></a>`;
  }).join('');

  return `
    <header class="head">
      <p class="eyebrow">Fase ${phase} · Semana ${state.week} de ${PLAN_WEEKS}${isDeload(state.week) ? ' · Descarga' : ''}</p>
      <h1>Tu rutina</h1>
      <div class="progress"><div class="track"><div class="fill" style="width:${(doneCount / 5) * 100}%"></div></div><span>${doneCount} de 5 días</span></div>
    </header>
    ${hero}
    <p class="eyebrow section-title">Esta rutina</p>
    <div class="stack">${list}</div>`;
}

/* ---------- Pantalla: Día ---------- */

function viewDia(id) {
  const s = sessionById(id);
  if (!s) return viewRutina();
  const phase = phaseOf(state.week);
  const exs = exercisesOf(s);
  const checks = state.checks[s.id] || [];
  const done = state.done.includes(s.id);
  const idx = SESSIONS.indexOf(s) + 1;

  const rows = exs.map((ex) => {
    const on = checks.includes(ex.id);
    const steps = ex.steps ? `<ul class="steps">${ex.steps.map((st) => `<li><a href="${st.video}" target="_blank" rel="noopener">${esc(st.text)}</a></li>`).join('')}</ul>` : '';
    const video = ex.video ? `<a class="icon-btn" href="${ex.video}" target="_blank" rel="noopener" aria-label="Ver vídeo de ${esc(ex.name)}">${I.play}</a>` : '';
    return `
      <div class="card" style="padding:10px 12px">
        <div class="row ${on ? 'done' : ''}">
          <button class="check ${on ? 'on' : ''}" data-action="toggle" data-s="${s.id}" data-ex="${ex.id}" aria-pressed="${on}" aria-label="${on ? 'Desmarcar' : 'Marcar'} ${esc(ex.name)}"><span>${on ? I.check : ''}</span></button>
          <div style="flex:1;min-width:0"><p class="title" style="font-weight:600;font-size:15px;${on ? 'color:var(--muted);text-decoration:line-through' : ''}">${esc(ex.name)}</p><p class="muted" style="margin-top:2px;color:var(--text-2)">${esc(ex.dose[phase])}</p></div>
          ${video}
        </div>
        ${steps}
      </div>`;
  }).join('');

  const notes = [];
  if (isDeload(state.week)) notes.push('Semana de descarga: haz un 40 % menos de series.');
  if (s.note) notes.push(s.note);

  document.body.classList.add('has-footer');
  const footer = done
    ? `<div class="footer"><div class="inner"><div class="ok-note">${I.check} Día completado</div><button class="btn ghost" data-action="undo-day" data-s="${s.id}">Desmarcar día</button></div></div>`
    : `<div class="footer"><div class="inner"><button class="btn" data-action="complete-day" data-s="${s.id}">Marcar día como completado</button></div></div>`;

  return `
    <header class="head">
      <a class="back" href="#/rutina">${I.back}Rutina</a>
      <p class="eyebrow">Día ${idx} de 5 · ${s.day} · Semana ${state.week}</p>
      <h1 style="font-size:26px">${s.id} · ${esc(s.title)}</h1>
      <div class="progress"><div class="track"><div class="fill" style="width:${(checks.length / exs.length) * 100}%"></div></div><span>${checks.length} de ${exs.length}</span></div>
    </header>
    ${notes.length ? `<div class="stack" style="margin-top:14px">${notes.map((n) => `<p class="note">${esc(n)}</p>`).join('')}</div>` : ''}
    <div class="stack" style="margin-top:14px">${rows}</div>
    ${footer}`;
}

function toggleCheck(sid, exid) {
  const arr = state.checks[sid] || (state.checks[sid] = []);
  const i = arr.indexOf(exid);
  if (i >= 0) arr.splice(i, 1); else arr.push(exid);
  save();
  render();
}

function completeDay(sid) {
  if (state.done.includes(sid)) return;
  state.done.push(sid);
  state.log.push({ id: uid(), type: 'dia', at: nowStamp(), week: state.week, session: sid, done: (state.checks[sid] || []).slice(), total: exercisesOf(sessionById(sid)).length });
  if (state.done.length === SESSIONS.length) {
    state.log.push({ id: uid(), type: 'rutina', at: nowStamp(), week: state.week });
    save();
    location.hash = '#/completada';
    return;
  }
  save();
  toast('Día completado');
  location.hash = '#/rutina';
}

function undoDay(sid) {
  state.done = state.done.filter((x) => x !== sid);
  for (let i = state.log.length - 1; i >= 0; i--) {
    const e = state.log[i];
    if (e.type === 'dia' && e.session === sid && e.week === state.week) { state.log.splice(i, 1); break; }
  }
  for (let i = state.log.length - 1; i >= 0; i--) {
    const e = state.log[i];
    if (e.type === 'rutina' && e.week === state.week) { state.log.splice(i, 1); break; }
  }
  save();
  render();
}

/* ---------- Pantalla: Rutina completada ---------- */

function viewCompletada() {
  const all = state.done.length === SESSIONS.length;
  if (!all) return viewRutina();
  const last = state.week >= PLAN_WEEKS;
  const nextW = state.week + 1;
  const nextInfo = last
    ? '<p class="sub">Has terminado las 12 semanas del plan.</p>'
    : `<p style="font-weight:600;font-size:16px">Semana ${nextW} · Fase ${phaseOf(nextW) + 1}</p><p class="sub">${isDeload(nextW) ? 'Semana de descarga: un 40 % menos de series.' : phaseOf(nextW) !== phaseOf(state.week) ? 'Empieza una fase nueva: suben las series o el peso.' : 'Mismos ejercicios y series.'}</p>`;
  return `
    <div class="done-hero">
      <div class="big">${I.checkBig}</div>
      <p class="eyebrow" style="margin-top:8px">Semana ${state.week} de ${PLAN_WEEKS}</p>
      <h1>${last ? 'Plan completado' : 'Rutina completada'}</h1>
      <p class="sub" style="max-width:280px">Has hecho los 5 días. Queda guardada en tu historial.</p>
    </div>
    <div class="letters">${SESSIONS.map((s) => `<div>${s.id}</div>`).join('')}</div>
    <div class="card" style="margin-top:20px;display:flex;flex-direction:column;gap:4px"><p class="eyebrow">Siguiente</p>${nextInfo}</div>
    <div class="stack" style="margin-top:24px">
      <button class="btn" data-action="next-week">${last ? 'Volver a empezar el plan' : `Empezar semana ${nextW}`}</button>
      <a class="btn ghost" href="#/historial">Ver historial</a>
    </div>`;
}

function nextWeek() {
  state.week = state.week >= PLAN_WEEKS ? 1 : state.week + 1;
  state.done = [];
  state.checks = {};
  save();
  location.hash = '#/rutina';
}

/* ---------- Pantalla: Historial ---------- */

function entryRow(e) {
  let badge, title, detail, href = '';
  if (e.type === 'dia') {
    const s = sessionById(e.session);
    badge = `<span class="badge ok">${I.check}</span>`;
    title = `${e.session} · ${esc(s ? s.title : '')}`;
    detail = `Semana ${e.week} · ${e.done.length} de ${e.total} ejercicios · ${fmtDate(e.at)}`;
  } else if (e.type === 'rutina') {
    badge = `<span class="badge ok">${I.check}</span>`;
    title = `Rutina semana ${e.week} completada`;
    detail = `5 de 5 días · ${fmtDate(e.at)}`;
  } else if (e.type === 'carrera') {
    badge = `<span class="badge run">${I.run}</span>`;
    title = `Carrera · ${fmtKm(e.km)} km`;
    detail = `${fmtDuration(e.sec)} · ${fmtPace(e.sec, e.km)} /km · ${fmtDate(e.at)}`;
    href = `#/carrera/${e.id}`;
  } else {
    badge = '<span class="badge hx">HX</span>';
    title = 'Entreno Hyrox';
    const names = e.stations.map((id) => (STATIONS.find((x) => x.id === id) || {}).name).filter(Boolean);
    detail = `${names.length ? esc(names.join(', ')) : 'Sin estaciones detectadas'} · ${fmtDate(e.at)}`;
    href = `#/hyrox/${e.id}`;
  }
  const body = `<span class="body"><span class="title" style="display:block">${title}</span><span class="detail" style="display:block">${detail}</span></span>`;
  const main = href ? `<a class="row" style="flex:1;min-width:0;color:inherit;text-decoration:none" href="${href}" aria-label="Editar ${title}">${badge}${body}</a>` : `<div class="row" style="flex:1;min-width:0">${badge}${body}</div>`;
  return `<div class="item">${main}<button class="icon-btn plain" data-action="delete-entry" data-id="${e.id}" aria-label="Borrar ${title}">${I.trash}</button></div>`;
}

function viewHistorial() {
  const doneWeeks = new Set(state.log.filter((e) => e.type === 'rutina').map((e) => e.week));
  const grid = Array.from({ length: PLAN_WEEKS }, (_, i) => {
    const w = i + 1;
    const cls = w === state.week ? 'now' : doneWeeks.has(w) ? 'ok' : '';
    return `<div class="${cls}" aria-label="Semana ${w}${doneWeeks.has(w) ? ' completada' : w === state.week ? ' actual' : ''}">${w}</div>`;
  }).join('');
  const entries = state.log.slice().sort((a, b) => (a.at < b.at ? 1 : -1));
  return `
    <header class="head"><p class="eyebrow">Plan de ${PLAN_WEEKS} semanas</p><h1>Historial</h1></header>
    <div class="card" style="margin-top:18px;display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;justify-content:space-between;font-size:14px"><span style="font-weight:600">Semana ${state.week} de ${PLAN_WEEKS}</span><span class="muted">Fase ${phaseOf(state.week) + 1}</span></div>
      <div class="weeks">${grid}</div>
    </div>
    <div class="btn-row" style="margin-top:18px">
      <a class="btn small" href="#/hyrox">${I.plus}Hyrox (foto)</a>
      <a class="btn small" href="#/carrera">${I.plus}Carrera</a>
    </div>
    <p class="eyebrow section-title">Entrenos completados</p>
    <div class="stack">${entries.length ? entries.map(entryRow).join('') : '<p class="empty">Aún no hay entrenos guardados.</p>'}</div>`;
}

function deleteEntry(id) {
  const e = state.log.find((x) => x.id === id);
  if (!e) return;
  const msg = e.type === 'dia' ? '¿Borrar este día del historial? También se desmarcará en la rutina si es de la semana actual.' : '¿Borrar este registro del historial?';
  if (!confirm(msg)) return;
  state.log = state.log.filter((x) => x.id !== id);
  if (e.type === 'dia' && e.week === state.week) state.done = state.done.filter((x) => x !== e.session);
  save();
  render();
  toast('Borrado');
}

/* ---------- Pantalla: Hyrox (foto) ---------- */

let hx = null; // formulario en curso

function normalize(t) {
  return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function detectStations(text) {
  const t = ' ' + normalize(text).replace(/[^a-z0-9]+/g, ' ') + ' ';
  return STATIONS.filter((st) => st.words.some((w) => t.includes(' ' + normalize(w) + ' '))).map((st) => st.id);
}

function viewHyrox(id) {
  const editing = id ? state.log.find((e) => e.id === id && e.type === 'hyrox') : null;
  if (!hx || hx.id !== (id || null)) {
    const n = nowLocal();
    hx = editing
      ? { id, text: editing.text, date: editing.at.split('T')[0], time: editing.at.split('T')[1], status: 'idle', read: false }
      : { id: null, text: '', date: n.date, time: n.time, status: 'idle', read: false };
  }
  const st = detectStations(hx.text);
  let reader;
  if (hx.status === 'reading') {
    reader = `<div class="drop" aria-busy="true"><div class="spinner" aria-hidden="true"></div><span id="ocr-progress">${esc(hx.progress || 'Leyendo la foto…')}</span><span class="muted">Se hace en el móvil, sin internet</span></div>`;
  } else {
    reader = `<label class="drop">${I.camera}${hx.read ? 'Leer otra foto' : 'Hacer foto o elegir imagen'}<span class="muted">La pizarra de la clase o tu entreno</span><input type="file" accept="image/*" data-action="photo"></label>`;
  }
  document.body.classList.add('has-footer');
  return `
    <header class="head">
      <a class="back" href="#/historial">${I.back}Historial</a>
      <h1 style="font-size:28px">${editing ? 'Editar entreno Hyrox' : 'Añadir entreno Hyrox'}</h1>
    </header>
    <div style="margin-top:18px">${reader}</div>
    ${hx.read ? `<div class="ok-note" style="margin-top:12px">${I.check} Foto leída en el móvil y eliminada</div>` : ''}
    ${hx.error ? `<p class="note" style="margin-top:12px">${esc(hx.error)}</p>` : ''}
    <div class="stack" style="margin-top:18px;gap:14px">
      <label class="field">TEXTO LEÍDO (PUEDES CORREGIRLO)
        <textarea class="input" rows="6" data-field="text" placeholder="Aquí aparece el texto de la foto. También puedes escribirlo.">${esc(hx.text)}</textarea>
      </label>
      <div>
        <p class="eyebrow" style="margin-bottom:8px">Detectado</p>
        <div class="chips" id="chips">${chipsHtml(st)}</div>
      </div>
      <label class="field">FECHA<input class="input" type="date" data-field="date" value="${esc(hx.date)}"></label>
      <label class="field">HORA<input class="input" type="time" data-field="time" value="${esc(hx.time)}"></label>
    </div>
    <div class="footer"><div class="inner"><button class="btn" data-action="save-hyrox" ${hx.status === 'reading' ? 'disabled' : ''}>Guardar en historial</button></div></div>`;
}

function chipsHtml(ids) {
  return ids.length ? ids.map((id) => `<span class="chip">${esc(STATIONS.find((x) => x.id === id).name)}</span>`).join('') : '<span class="muted">Ninguna estación todavía</span>';
}

let tessLoaded = null;
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve();
  if (!tessLoaded) {
    tessLoaded = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'vendor/tesseract/tesseract.min.js';
      s.onload = resolve;
      s.onerror = () => { tessLoaded = null; reject(new Error('No se pudo cargar el lector')); };
      document.head.appendChild(s);
    });
  }
  return tessLoaded;
}

async function readPhoto(file, input) {
  hx.status = 'reading'; hx.error = ''; hx.progress = 'Preparando la foto…';
  render();
  let canvas = null;
  let worker = null;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.filter = 'grayscale(1) contrast(1.35)';
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    if (input) input.value = '';
    file = null;

    hx.progress = 'Cargando el lector…'; render();
    await loadTesseract();
    const base = new URL('vendor/tesseract/', location.href).href;
    worker = await Tesseract.createWorker(['spa', 'eng'], 1, {
      workerPath: base + 'worker.min.js',
      corePath: base + 'core',
      langPath: base + 'lang',
      workerBlobURL: false,
      cacheMethod: 'none',
      gzip: true,
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const p = Math.round((m.progress || 0) * 100);
          hx.progress = `Leyendo la foto… ${p} %`;
          const el = $('#ocr-progress');
          if (el) el.textContent = hx.progress;
        }
      },
    });
    const { data } = await worker.recognize(canvas);
    const text = (data.text || '').replace(/\n{3,}/g, '\n\n').trim();
    hx.text = hx.text ? hx.text + '\n' + text : text;
    hx.read = true;
    if (!text) hx.error = 'No se ha leído texto. Prueba con más luz o más cerca, o escríbelo a mano.';
  } catch (err) {
    hx.error = 'No se pudo leer la foto. Si es la primera vez, abre la app una vez con internet para descargar el lector.';
  } finally {
    if (worker) { try { await worker.terminate(); } catch (e) { /* nada */ } }
    if (canvas) { canvas.width = 0; canvas.height = 0; }
    if (input) input.value = '';
    hx.status = 'idle';
    render();
  }
}

function saveHyrox() {
  if (!hx.text.trim()) { toast('Añade una foto o escribe el entreno'); return; }
  const entry = { type: 'hyrox', at: stamp(hx.date, hx.time), text: hx.text.trim(), stations: detectStations(hx.text) };
  if (hx.id) {
    const e = state.log.find((x) => x.id === hx.id);
    Object.assign(e, entry);
  } else {
    state.log.push(Object.assign({ id: uid() }, entry));
  }
  save();
  hx = null;
  toast('Guardado en el historial');
  location.hash = '#/historial';
}

/* ---------- Pantalla: Carrera ---------- */

let run = null;

function viewCarrera(id) {
  const editing = id ? state.log.find((e) => e.id === id && e.type === 'carrera') : null;
  if (!run || run.id !== (id || null)) {
    const n = nowLocal();
    run = editing
      ? { id, km: fmtKm(editing.km), time: fmtDuration(editing.sec), date: editing.at.split('T')[0], hour: editing.at.split('T')[1] }
      : { id: null, km: '', time: '', date: n.date, hour: n.time };
  }
  document.body.classList.add('has-footer');
  return `
    <header class="head">
      <a class="back" href="#/historial">${I.back}Historial</a>
      <h1 style="font-size:28px">${editing ? 'Editar carrera' : 'Añadir carrera'}</h1>
    </header>
    <div class="stack" style="margin-top:20px;gap:14px">
      <label class="field">DISTANCIA (KM)<input class="input big" inputmode="decimal" placeholder="8,2" data-field="km" value="${esc(run.km)}"></label>
      <label class="field">TIEMPO TOTAL (H:MM:SS O MM:SS)<input class="input big" inputmode="numeric" placeholder="49:12" data-field="time" value="${esc(run.time)}"></label>
      <div class="pace"><span class="sub">Ritmo medio</span><span><strong id="pace">${paceText()}</strong> <span style="font-weight:700">/km</span></span></div>
      <label class="field">FECHA<input class="input" type="date" data-field="date" value="${esc(run.date)}"></label>
      <label class="field">HORA<input class="input" type="time" data-field="hour" value="${esc(run.hour)}"></label>
    </div>
    <div class="footer"><div class="inner"><button class="btn" data-action="save-run">Guardar carrera</button></div></div>`;
}

function paceText() {
  return fmtPace(parseTime(run.time), parseKm(run.km));
}

function saveRun() {
  const km = parseKm(run.km), sec = parseTime(run.time);
  if (!km) { toast('Pon los kilómetros, por ejemplo 8,2'); return; }
  if (!sec) { toast('Pon el tiempo, por ejemplo 49:12'); return; }
  const entry = { type: 'carrera', at: stamp(run.date, run.hour), km, sec };
  if (run.id) Object.assign(state.log.find((x) => x.id === run.id), entry);
  else state.log.push(Object.assign({ id: uid() }, entry));
  save();
  run = null;
  toast('Carrera guardada');
  location.hash = '#/historial';
}

/* ---------- Pantalla: Control ---------- */

let weekOffset = 0;

function weekRange(offset) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // lunes = 0
  const start = new Date(d); start.setDate(d.getDate() - dow + offset * 7);
  const end = new Date(start); end.setDate(start.getDate() + 7);
  return { start, end };
}

function weekStats(offset) {
  const { start, end } = weekRange(offset);
  const inWeek = state.log.filter((e) => { const t = parseStamp(e.at); return t >= start && t < end; });
  const series = {};
  Object.keys(MUSCLES).forEach((k) => (series[k] = 0));
  let dias = 0, hyrox = 0, km = 0, sec = 0, runs = 0;
  inWeek.forEach((e) => {
    if (e.type === 'dia') {
      dias++;
      const s = sessionById(e.session);
      if (!s) return;
      const ph = phaseOf(e.week);
      exercisesOf(s).forEach((ex) => {
        if (!e.done.includes(ex.id)) return;
        ex.muscles.forEach((m) => (series[m] += ex.sets[ph]));
      });
    } else if (e.type === 'hyrox') {
      hyrox++;
      e.stations.forEach((id) => {
        const st = STATIONS.find((x) => x.id === id);
        if (st) st.muscles.forEach((m) => (series[m] += SETS_PER_STATION));
      });
    } else if (e.type === 'carrera') {
      runs++; km += e.km; sec += e.sec;
    }
  });
  return { start, end, dias, hyrox, km, sec, runs, series, empty: inWeek.length === 0 };
}

function viewControl() {
  const w = weekStats(weekOffset);
  const endShown = new Date(w.end); endShown.setDate(endShown.getDate() - 1);
  const label = weekOffset === 0 ? 'Esta semana' : weekOffset === -1 ? 'Semana pasada' : `${w.start.getDate()} ${MONTHS[w.start.getMonth()]} – ${endShown.getDate()} ${MONTHS[endShown.getMonth()]}`;

  const keys = Object.keys(MUSCLES);
  const max = Math.max(...keys.map((k) => Math.max(w.series[k], MUSCLES[k].target * 1.5)));
  const bars = keys.map((k) => {
    const v = w.series[k], t = MUSCLES[k].target;
    const ok = v >= t;
    return `<span>${esc(MUSCLES[k].name)}</span><div class="bar" role="img" aria-label="${esc(MUSCLES[k].name)}: ${v} de ${t} series"><div class="fill ${ok ? 'ok' : ''}" style="width:${(v / max) * 100}%"></div><div class="target" style="left:${(t / max) * 100}%"></div></div><span class="num">${v}<span class="muted">/${t}</span></span>`;
  }).join('');

  const low = keys.filter((k) => w.series[k] < MUSCLES[k].target).sort((a, b) => w.series[a] / MUSCLES[a].target - w.series[b] / MUSCLES[b].target);
  const alerts = w.empty ? '' : low.slice(0, 4).map((k) => `<div class="alert"><p class="title">${esc(MUSCLES[k].name)} · ${w.series[k]} de ${MUSCLES[k].target} series</p><p>${esc(MUSCLES[k].tip)}</p></div>`).join('');

  const runOk = w.km >= RUN_TARGET[0];
  const runCard = `<div class="${runOk ? 'card' : 'alert'}"><p class="title" style="font-weight:600;font-size:15px">Carrera · ${w.runs} ${w.runs === 1 ? 'salida' : 'salidas'} · ${fmtKm(w.km)} km</p><p class="sub" style="margin-top:4px">${w.runs ? `Ritmo medio ${fmtPace(w.sec, w.km)} /km · ` : ''}objetivo semanal ${RUN_TARGET[0]}-${RUN_TARGET[1]} km</p></div>`;

  const hours = (w.sec + w.dias * 30 * 60) / 3600;

  return `
    <header class="head"><h1>Control</h1></header>
    <div class="weeknav">
      <button class="icon-btn plain" data-action="week" data-d="-1" aria-label="Semana anterior">${I.back}</button>
      <span>${label}</span>
      <button class="icon-btn plain" data-action="week" data-d="1" aria-label="Semana siguiente" ${weekOffset >= 0 ? 'disabled' : ''}>${I.next}</button>
    </div>
    <div class="tiles">
      <div class="tile"><strong>${w.dias}/5</strong><span>Días de rutina</span></div>
      <div class="tile"><strong>${w.hyrox}</strong><span>Entrenos Hyrox</span></div>
      <div class="tile"><strong>${fmtKm(w.km)}</strong><span>Km corriendo</span></div>
    </div>
    <div class="card" style="margin-top:18px">
      <p style="font-weight:600;font-size:15px;margin-bottom:12px">Series por grupo muscular</p>
      ${w.empty ? '<p class="sub">No hay entrenos guardados en esta semana.</p>' : `<div class="bars">${bars}</div>
      <div class="legend"><span><i style="background:var(--green-bar)"></i>En objetivo</span><span><i style="background:var(--amber)"></i>Por debajo</span><span><i style="background:var(--text-2);width:2px;border-radius:0"></i>Referencia</span></div>`}
    </div>
    <p class="eyebrow section-title">A vigilar para Hyrox</p>
    <div class="stack">${runCard}${alerts}</div>
    <p class="muted" style="margin-top:14px">Las series de Hyrox se estiman en ${SETS_PER_STATION} por estación detectada. Las referencias semanales son orientativas.</p>
    <p class="sr-only">Tiempo aproximado: ${hours.toFixed(1)} horas</p>`;
}

/* ---------- Pantalla: Ajustes ---------- */

function csvCell(v) {
  const s = String(v ?? '');
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCsv() {
  const head = ['fecha', 'hora', 'tipo', 'semana_plan', 'sesion', 'ejercicios_hechos', 'ejercicios_total', 'km', 'tiempo', 'ritmo_min_km', 'estaciones', 'texto'];
  const rows = state.log.slice().sort((a, b) => a.at.localeCompare(b.at)).map((e) => {
    const [d, t] = e.at.split('T');
    if (e.type === 'dia') {
      const s = sessionById(e.session);
      const names = s ? exercisesOf(s).filter((x) => e.done.includes(x.id)).map((x) => x.name).join(' | ') : '';
      return [d, t, 'Día de rutina', e.week, `${e.session} · ${s ? s.title : ''}`, names, e.total, '', '', '', '', ''];
    }
    if (e.type === 'rutina') return [d, t, 'Rutina completada', e.week, '', '', '', '', '', '', '', ''];
    if (e.type === 'carrera') return [d, t, 'Carrera', '', '', '', '', fmtKm(e.km), fmtDuration(e.sec), fmtPace(e.sec, e.km), '', ''];
    const names = e.stations.map((id) => (STATIONS.find((x) => x.id === id) || {}).name).filter(Boolean).join(' | ');
    return [d, t, 'Hyrox', '', '', '', '', '', '', '', names, e.text];
  });
  const csv = '﻿' + [head, ...rows].map((r) => r.map(csvCell).join(';')).join('\r\n');
  download(`entrenos-${nowLocal().date}.csv`, csv, 'text/csv;charset=utf-8');
  toast('CSV exportado');
}

function exportBackup() {
  download(`rutina-copia-${nowLocal().date}.json`, JSON.stringify(state, null, 2), 'application/json');
  toast('Copia guardada');
}

async function importBackup(file, input) {
  try {
    const data = JSON.parse(await file.text());
    if (!data || !Array.isArray(data.log) || typeof data.week !== 'number') throw new Error('formato');
    if (!confirm('Esto sustituye todos los datos actuales por los de la copia. ¿Continuar?')) return;
    state = Object.assign(freshState(), data);
    save();
    toast('Copia restaurada');
    render();
  } catch (e) {
    toast('Ese archivo no es una copia válida');
  } finally {
    if (input) input.value = '';
  }
}

async function readerStatus() {
  const el = $('#reader-status');
  if (!el || !('caches' in window)) return;
  try {
    const hit = await caches.match('vendor/tesseract/lang/spa.traineddata.gz');
    el.textContent = hit ? 'Listo para usar sin conexión.' : 'Se está descargando. Mantén la app abierta con internet un momento.';
  } catch (e) { /* nada */ }
}

function viewAjustes() {
  const opts = Array.from({ length: PLAN_WEEKS }, (_, i) => `<option value="${i + 1}" ${state.week === i + 1 ? 'selected' : ''}>Semana ${i + 1}${isDeload(i + 1) ? ' (descarga)' : ''}</option>`).join('');
  setTimeout(readerStatus, 0);
  return `
    <header class="head"><h1>Ajustes</h1></header>

    <p class="eyebrow section-title">Exportar</p>
    <div class="card stack" style="gap:12px">
      <p style="font-weight:600;font-size:15px">Historial de entrenos</p>
      <p class="sub">Días de rutina, ejercicios marcados, entrenos Hyrox y carreras, con fecha y hora.</p>
      <button class="btn" data-action="export-csv">${I.download}Exportar .csv</button>
    </div>

    <p class="eyebrow section-title">Copia de seguridad</p>
    <div class="card stack" style="gap:12px">
      <p class="sub">Tus datos solo están en este móvil. Guarda una copia de vez en cuando para no perderlos si cambias de teléfono.</p>
      <div class="btn-row">
        <button class="btn secondary small" data-action="export-backup">${I.download}Guardar copia</button>
        <label class="btn secondary small" style="cursor:pointer">${I.upload}Restaurar<input type="file" accept="application/json,.json" data-action="import-backup" class="sr-only"></label>
      </div>
    </div>

    <p class="eyebrow section-title">Semana del plan</p>
    <div class="card stack" style="gap:12px">
      <label class="field">ESTÁS EN<select class="input" id="week-select">${opts}</select></label>
      <button class="btn secondary small" data-action="set-week">Cambiar semana</button>
      <p class="muted">Al cambiar de semana se reinician los días marcados de la rutina actual. El historial no se toca.</p>
    </div>

    <p class="eyebrow section-title">Lector de fotos</p>
    <div class="card"><p class="sub" id="reader-status">Comprobando…</p></div>

    <p class="eyebrow section-title">Datos</p>
    <div class="card stack" style="gap:12px">
      <button class="btn ghost" data-action="wipe">Borrar todos los datos</button>
    </div>
    <p class="muted" style="margin-top:16px;text-align:center">Versión ${APP_VERSION}</p>`;
}

function setWeek() {
  const v = Number($('#week-select').value);
  if (v === state.week) return;
  if (!confirm(`¿Pasar a la semana ${v}? Se reinician los días marcados de esta rutina.`)) return;
  state.week = v; state.done = []; state.checks = {};
  save(); toast(`Ahora estás en la semana ${v}`); render();
}

function wipe() {
  if (!confirm('¿Borrar todos tus datos? No se puede deshacer.')) return;
  if (!confirm('Última confirmación: se borrará todo el historial.')) return;
  state = freshState(); save(); toast('Datos borrados'); location.hash = '#/rutina';
}

/* ---------- Router ---------- */

const TABS = [
  { hash: '#/rutina', label: 'Rutina', icon: I.tabRutina },
  { hash: '#/control', label: 'Control', icon: I.tabControl },
  { hash: '#/historial', label: 'Historial', icon: I.tabHist },
  { hash: '#/ajustes', label: 'Ajustes', icon: I.tabAjustes },
];

function render() {
  const [, route, param] = (location.hash || '#/rutina').split('/');
  document.body.classList.remove('has-footer');
  let html, tab = null;
  switch (route) {
    case 'dia': html = viewDia(param); break;
    case 'completada': html = viewCompletada(); break;
    case 'historial': html = viewHistorial(); tab = '#/historial'; break;
    case 'hyrox': html = viewHyrox(param || null); break;
    case 'carrera': html = viewCarrera(param || null); break;
    case 'control': html = viewControl(); tab = '#/control'; break;
    case 'ajustes': html = viewAjustes(); tab = '#/ajustes'; break;
    default: html = viewRutina(); tab = '#/rutina';
  }
  if (route !== 'hyrox') hx = null;
  if (route !== 'carrera') run = null;
  $('#app').innerHTML = html;
  document.body.classList.toggle('has-tabs', !!tab);
  $('#tabs').innerHTML = TABS.map((t) => `<a href="${t.hash}" ${t.hash === tab ? 'aria-current="page"' : ''}>${t.icon}${t.label}</a>`).join('');
  const titles = { dia: 'Día de entreno', completada: 'Rutina completada', historial: 'Historial', hyrox: 'Entreno Hyrox', carrera: 'Carrera', control: 'Control', ajustes: 'Ajustes' };
  document.title = (titles[route] || 'Rutina') + ' · Rutina';
}

let lastRoute = '';
window.addEventListener('hashchange', () => {
  const r = location.hash.split('/')[1] || '';
  if (r !== lastRoute) window.scrollTo(0, 0);
  lastRoute = r;
  render();
});

/* ---------- Eventos ---------- */

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const a = el.dataset.action;
  if (a === 'toggle') toggleCheck(el.dataset.s, el.dataset.ex);
  else if (a === 'complete-day') completeDay(el.dataset.s);
  else if (a === 'undo-day') undoDay(el.dataset.s);
  else if (a === 'next-week') nextWeek();
  else if (a === 'delete-entry') deleteEntry(el.dataset.id);
  else if (a === 'save-hyrox') saveHyrox();
  else if (a === 'save-run') saveRun();
  else if (a === 'week') { weekOffset = Math.min(0, weekOffset + Number(el.dataset.d)); render(); }
  else if (a === 'export-csv') exportCsv();
  else if (a === 'export-backup') exportBackup();
  else if (a === 'set-week') setWeek();
  else if (a === 'wipe') wipe();
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.dataset.action === 'photo' && el.files && el.files[0]) readPhoto(el.files[0], el);
  if (el.dataset.action === 'import-backup' && el.files && el.files[0]) importBackup(el.files[0], el);
});

document.addEventListener('input', (ev) => {
  const el = ev.target;
  const f = el.dataset.field;
  if (!f) return;
  if (hx && (f === 'text' || f === 'date' || f === 'time')) {
    hx[f] = el.value;
    if (f === 'text') $('#chips').innerHTML = chipsHtml(detectStations(hx.text));
  } else if (run && (f === 'km' || f === 'time' || f === 'date' || f === 'hour')) {
    run[f] = el.value;
    const p = $('#pace'); if (p) p.textContent = paceText();
  }
});

/* ---------- Inicio ---------- */

render();
lastRoute = (location.hash || '#/rutina').split('/')[1] || '';

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

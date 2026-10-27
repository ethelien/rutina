// Analiza el texto de una pizarra: separa bloques, reconoce ejercicios y estima series.
// Funciona sin conexión. Depende de EXERCISES (ejercicios.js) y MUSCLES (data.js).

function normText(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

// Patrones de búsqueda: de más largo a más corto, para que "pike push up" gane a "push up".
const EX_PATTERNS = EXERCISES
  .flatMap((ex) => ex.words.map((w) => ({ ex, w: normText(w) })))
  .filter((p) => p.w)
  .sort((a, b) => b.w.length - a.w.length)
  .map((p) => ({ ex: p.ex, re: new RegExp('(^| )(' + p.w + 's?)(?= |$)', 'g') }));

function findExercises(line) {
  let s = normText(line);
  const found = [];
  for (const p of EX_PATTERNS) {
    p.re.lastIndex = 0;
    let m;
    let hit = false;
    while ((m = p.re.exec(s))) {
      const start = m.index + m[1].length;
      s = s.slice(0, start) + '#'.repeat(m[2].length) + s.slice(start + m[2].length);
      p.re.lastIndex = start + m[2].length;
      hit = true;
    }
    if (hit && !found.includes(p.ex)) found.push(p.ex);
  }
  return found;
}

// El primer músculo es el principal (1 serie); el resto son secundarios (0,5).
function addSeries(totals, muscles, series) {
  muscles.forEach((m, i) => { if (m in totals) totals[m] += series * (i === 0 ? 1 : 0.5); });
}

function plainLower(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Formato del bloque: rondas, AMRAP, EMOM, For time...
function parseFormat(line) {
  const t = plainLower(line);
  let m;
  const rounds = (n) => ({ series: Math.min(+n, 20), label: `${n} ${+n === 1 ? 'ronda' : 'rondas'}` });
  if ((m = t.match(/\b(\d{1,2})\s*(?:rounds?|rondas?|rds?|rft|vueltas?)\b/))) return rounds(m[1]);
  if ((m = t.match(/\b(?:every|cada)\b[^x\n]*x\s*(\d{1,2})\b/))) return rounds(m[1]);
  if ((m = t.match(/\be\d+mom\b[^x\n]*x\s*(\d{1,2})\b/))) return rounds(m[1]);
  if ((m = t.match(/\bamrap\s*:?\s*(\d{1,3})/))) {
    const min = +m[1];
    return { series: Math.max(1, Math.round(min / MINUTES_PER_SERIES)), label: `AMRAP ${min}'` };
  }
  if ((m = t.match(/\be(\d)?mom\s*:?\s*(\d{1,3})/))) {
    const min = +m[2];
    return { series: Math.max(1, Math.round(min / MINUTES_PER_SERIES)), label: `EMOM ${min}'` };
  }
  if (/\b(?:for time|por tiempo)\b/.test(t)) return { series: null, label: 'For time' };
  return null;
}

// "5x5 back squat", "Back squat 4 x 8": la primera cifra son las series.
function setsOnLine(line) {
  const m = plainLower(line).match(/\b(\d{1,2})\s*[x×]\s*(\d{1,3})\b/);
  return m && +m[1] > 0 ? Math.min(+m[1], 20) : null;
}

function headerOf(line) {
  const n = normText(line).replace(/\b\d+\b/g, ' ').replace(/\b(?:min|mins|minutos?)\b/g, ' ').replace(/\s+/g, ' ').trim();
  if (!n) return null;
  const bare = n.replace(/^(?:[a-e]|parte [a-e]|part [a-e])\s+/, '');
  if (IGNORE_HEADERS.includes(n) || IGNORE_HEADERS.includes(bare)) return { ignore: true };
  const key = BLOCK_HEADERS.includes(n) ? n : BLOCK_HEADERS.includes(bare) ? bare : null;
  if (!key) return null;
  const title = line.trim().replace(/[:\-–—]+$/, '').trim();
  return { ignore: false, key, title: title.charAt(0).toUpperCase() + title.slice(1) };
}

function analyzeWorkout(text, removed) {
  const gone = removed || [];
  const raw = [];
  let cur = null;
  let ignoring = false;
  const open = (title, key) => { cur = { title, key, format: null, items: [] }; raw.push(cur); };

  String(text || '').split(/\r?\n/).forEach((lineRaw) => {
    const line = lineRaw.trim();
    // La zona ignorada (p. ej. «Movimientos») termina en una línea en blanco
    // o en una línea con repeticiones, como «20 wall balls» escrita a mano.
    if (!line) { ignoring = false; return; }
    if (ignoring && /^\d/.test(line)) { ignoring = false; cur = null; }
    const h = headerOf(line);
    if (h) {
      if (h.ignore) { ignoring = true; cur = null; return; }
      ignoring = false;
      open(h.title, h.key);
      return;
    }
    if (ignoring) return;
    const fmt = parseFormat(line);
    const found = findExercises(line);
    if (fmt) {
      if (!cur || cur.format || cur.items.length) open(null, null);
      cur.format = fmt;
    }
    if (found.length) {
      if (!cur) open(null, null);
      const sets = fmt ? null : setsOnLine(line);
      found.forEach((ex) => { if (!cur.items.some((i) => i.ex.id === ex.id)) cur.items.push({ ex, sets }); });
    }
  });

  const totals = {};
  Object.keys(MUSCLES).forEach((k) => (totals[k] = 0));
  let n = 0;
  const blocks = raw.filter((b) => b.items.length).map((b) => {
    n++;
    const light = !!b.key && LIGHT_BLOCKS.includes(b.key);
    const series = light ? 1 : (b.format && b.format.series) || DEFAULT_SERIES;
    const title = b.title || (b.format ? b.format.label : `Bloque ${n}`);
    const ownSets = !b.format && b.items.some((i) => i.sets);
    const label = light ? 'calentamiento → 1 serie'
      : ownSets ? 'series indicadas en la pizarra'
      : `${b.format ? b.format.label : 'sin indicar'} → ${series} ${series === 1 ? 'serie' : 'series'}`;
    const base = normText(title) || `bloque ${n}`;
    const items = b.items.map((i) => {
      const key = `${base}:${i.ex.id}`;
      const s = light ? 1 : i.sets || series;
      const off = gone.includes(key);
      if (!off) addSeries(totals, i.ex.muscles, s);
      return { key, ex: i.ex, series: s, removed: off };
    });
    return { title, label, items };
  });
  return { blocks, totals };
}

function workoutNames(text, removed) {
  const names = [];
  analyzeWorkout(text, removed).blocks.forEach((b) => b.items.forEach((i) => {
    if (!i.removed && !names.includes(i.ex.name)) names.push(i.ex.name);
  }));
  return names;
}

// Datos de la rutina. Para cambiar ejercicios, series o vídeos, edita este archivo.
// "dose" tiene 3 textos: semanas 1-4, 5-8 y 9-12.
// "sets" son las series de cada fase y sirven para el control por grupo muscular.

const YT = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

const MUSCLES = {
  gemelo:     { name: 'Gemelo y tobillo', target: 15, tip: 'Añade elevaciones de gemelo a una pierna o sóleo sentado.' },
  cuadriceps: { name: 'Cuádriceps',       target: 12, tip: 'Sentadilla búlgara o zancadas con mancuernas.' },
  gluteo:     { name: 'Glúteo',           target: 12, tip: 'Hip thrust a una pierna o zancadas.' },
  isquios:    { name: 'Isquios',          target: 8,  tip: 'Peso muerto rumano con mancuernas en el día de pesas.' },
  agarre:     { name: 'Agarre y antebrazo', target: 12, tip: 'Sujeción pesada con mancuernas y pinza de discos.' },
  core:       { name: 'Core',             target: 8,  tip: 'Planchas y sujeción a una mano (suitcase carry).' },
  espalda:    { name: 'Espalda y tirón',  target: 10, tip: 'El sled pull y el remo la exigen: remo con mancuerna en el día de pesas.' },
  hombro:     { name: 'Hombro y empuje',  target: 8,  tip: 'Wall balls y sled push: press con mancuernas y flexiones.' },
};

const WARMUP = {
  id: 'calentamiento',
  name: 'Calentamiento',
  dose: ['6 min', '6 min', '6 min'],
  sets: [0, 0, 0],
  muscles: [],
  steps: [
    { text: 'Comba simulada: 2 min suave', video: YT('imaginary jump rope exercise') },
    { text: 'Rodilla a la pared: 10 por lado', video: YT('knee to wall ankle mobility') },
    { text: 'Balanceos de pierna: 10 por lado', video: YT('leg swings warm up') },
    { text: 'Estiramiento de flexor de cadera: 30 s por lado', video: YT('half kneeling hip flexor stretch') },
    { text: '20 elevaciones de gemelo rápidas + 10 pogos suaves', video: YT('pogo hops runners') },
  ],
};

const SESSIONS = [
  {
    id: 'A', day: 'Lunes', title: 'Saltos reactivos + gemelo', warmup: true,
    note: 'Aterrizaje silencioso. Si haces ruido o te hundes, se acabó la serie.',
    exercises: [
      { id: 'pogo', name: 'Pogo hops', video: YT('pogo hops runners'), dose: ['3×15 · pausa 60 s', '3×20 · pausa 60 s', '3×10 a una pierna · pausa 60 s'], sets: [3, 3, 3], muscles: ['gemelo'] },
      { id: 'vertical', name: 'Salto vertical', video: YT('countermovement jump technique'), dose: ['4×4 · pausa 90 s', '4×5 · pausa 90 s', '4×4 encadenados · pausa 90 s'], sets: [4, 4, 4], muscles: ['cuadriceps', 'gluteo'] },
      { id: 'laterales', name: 'Saltos laterales sobre línea', video: YT('lateral line hops'), dose: ['3×10 · pausa 45 s', '3×10 a una pierna · pausa 45 s', '3×12 a una pierna · pausa 45 s'], sets: [3, 3, 3], muscles: ['gemelo'] },
      { id: 'gemelo1p', name: 'Gemelo a una pierna con mancuerna', video: YT('single leg dumbbell calf raise on step'), dose: ['3×12 sin peso · pausa 60 s', '3×12 con 8-10 kg · pausa 60 s', '3×10 con 14-18 kg · pausa 60 s'], sets: [3, 3, 3], muscles: ['gemelo'] },
      { id: 'tibial', name: 'Elevación de tibial', video: YT('tibialis raise against wall'), dose: ['2×20 · pausa 30 s', '2×25 · pausa 30 s', '2×25 a una pierna · pausa 30 s'], sets: [2, 2, 2], muscles: ['gemelo'] },
    ],
  },
  {
    id: 'C', day: 'Martes', title: 'Agarre y muñecas', warmup: false,
    note: 'En la sujeción: si pasas de 60 s, sube 2 kg por mano.',
    exercises: [
      { id: 'circulos', name: 'Círculos de muñeca a cuatro patas', video: YT('quadruped wrist circles warm up'), dose: ['2 min', '2 min', '2 min'], sets: [0, 0, 0], muscles: [] },
      { id: 'sujecion', name: 'Sujeción con 2 mancuernas', video: YT('dumbbell farmers hold'), dose: ['4× máx · 2×20 kg', '4× máx · 2×22-24 kg', '4× máx · 2×26 kg'], sets: [4, 4, 4], muscles: ['agarre', 'core'] },
      { id: 'pinza', name: 'Pinza de discos', video: YT('plate pinch grip'), dose: ['3×20 s', '3×30 s', '3×40 s'], sets: [3, 3, 3], muscles: ['agarre'] },
      { id: 'curlmuneca', name: 'Curl de muñeca', video: YT('dumbbell wrist curl'), dose: ['2×15 · 6-8 kg', '3×15 · 8-10 kg', '3×12 · 10-12 kg'], sets: [2, 3, 3], muscles: ['agarre'] },
      { id: 'extmuneca', name: 'Extensión de muñeca', video: YT('dumbbell reverse wrist curl'), dose: ['2×15 · 4-6 kg', '3×15 · 6-8 kg', '3×12 · 8-10 kg'], sets: [2, 3, 3], muscles: ['agarre'] },
      { id: 'pronosup', name: 'Prono-supinación', video: YT('dumbbell pronation supination forearm'), dose: ['2×12', '2×12', '3×12'], sets: [2, 2, 3], muscles: ['agarre'] },
      { id: 'rodillo', name: 'Rodillo de muñeca casero', video: YT('homemade wrist roller'), dose: ['2 rondas', '3 rondas', '3 rondas, más peso'], sets: [2, 3, 3], muscles: ['agarre'] },
      { id: 'sentprof', name: 'Sentadilla profunda sostenida', video: YT('deep squat hold'), dose: ['2×45 s', '2×45 s', '2×45 s'], sets: [0, 0, 0], muscles: [] },
    ],
  },
  {
    id: 'D', day: 'Miércoles', title: 'Fuerza de pierna sin saltos', warmup: true,
    note: '',
    exercises: [
      { id: 'soleo', name: 'Sóleo sentado con mancuerna en la rodilla', video: YT('seated dumbbell calf raise single leg'), dose: ['3×15 · 12 kg · pausa 45 s', '3×12 · 20 kg · pausa 45 s', '3×10 · 2 mancuernas (30-40 kg) · pausa 45 s'], sets: [3, 3, 3], muscles: ['gemelo'] },
      { id: 'bulgara', name: 'Sentadilla búlgara', video: YT('dumbbell bulgarian split squat'), dose: ['3×8 por lado · 2×8 kg · pausa 60 s', '3×8 por lado · 2×12 kg · pausa 60 s', '3×6 por lado · 2×16 kg · pausa 60 s'], sets: [3, 3, 3], muscles: ['cuadriceps', 'gluteo'] },
      { id: 'hipthrust', name: 'Hip thrust a una pierna', video: YT('single leg hip thrust bench'), dose: ['3×12 por lado · pausa 45 s', '3×12 con mancuerna · pausa 45 s', '3×10, más peso · pausa 45 s'], sets: [3, 3, 3], muscles: ['gluteo', 'isquios'] },
      { id: 'piecorto', name: 'Pie corto', video: YT('short foot exercise'), dose: ['2×10 de 5 s', '2×10 de 5 s', '2×10 a una pierna'], sets: [0, 0, 0], muscles: [] },
    ],
  },
  {
    id: 'B', day: 'Jueves', title: 'Saltos de zancada', warmup: true,
    note: 'Aterrizaje silencioso. Si haces ruido o te hundes, se acabó la serie.',
    exercises: [
      { id: 'skater', name: 'Skater jumps', video: YT('skater jumps exercise'), dose: ['3×6 por lado · pausa 60 s', '3×8 sin pausa · pausa 60 s', '3×8 más largos · pausa 60 s'], sets: [3, 3, 3], muscles: ['gluteo', 'cuadriceps'] },
      { id: 'zancadasalto', name: 'Zancada con salto', video: YT('jumping lunges proper form'), dose: ['3×6 por lado · pausa 75 s', '3×8 por lado · pausa 75 s', '4×8 por lado · pausa 75 s'], sets: [3, 3, 4], muscles: ['cuadriceps', 'gluteo'] },
      { id: 'longitud', name: 'Salto de longitud', video: YT('standing broad jump technique'), dose: ['3×3 · pausa 90 s', '4×3 · pausa 90 s', '3×3 + salto vertical · pausa 90 s'], sets: [3, 4, 3], muscles: ['gluteo', 'isquios'] },
      { id: 'isogemelo', name: 'Isometría de gemelo, rodilla flexionada', video: YT('bent knee isometric calf raise hold'), dose: ['3×30 s · pausa 45 s', '3×45 s · pausa 45 s', '3×45 s con 10-15 kg · pausa 45 s'], sets: [3, 3, 3], muscles: ['gemelo'] },
    ],
  },
  {
    id: 'E', day: 'Viernes', title: 'Intervalos sin cuerda + agarre', warmup: true,
    note: 'Intervalos: rota comba simulada, skipping y jumping jacks.',
    exercises: [
      { id: 'intervalos', name: 'Intervalos sin cuerda (12 min)', video: YT('imaginary jump rope exercise'), dose: ['8 × 40 s / 20 s', '10 × 45 s / 15 s', '6 × 90 s / 30 s'], sets: [2, 2, 2], muscles: ['gemelo'] },
      { id: 'sujecion2', name: 'Sujeción con 2 mancuernas', video: YT('dumbbell farmers hold'), dose: ['3×45 s', '3×45 s', '3×60 s'], sets: [3, 3, 3], muscles: ['agarre', 'core'] },
      { id: 'toalla', name: 'Escurrir toalla mojada', video: YT('towel wringing grip exercise'), dose: ['3×10 giros por sentido', '3×10 giros por sentido', '3×10 giros por sentido'], sets: [3, 3, 3], muscles: ['agarre'] },
      { id: 'dedos', name: 'Extensión de dedos con goma', video: YT('rubber band finger extension exercise'), dose: ['2×30', '2×30', '2×30'], sets: [2, 2, 2], muscles: ['agarre'] },
    ],
  },
];

// Estaciones de Hyrox: palabras que se buscan en el texto leído de la foto
// y grupos musculares que suman (3 series estimadas por estación).
const STATIONS = [
  { id: 'carrera', name: 'Carrera', words: ['run', 'running', 'correr', 'carrera', 'km run', '1km', '1 km'], muscles: [] },
  { id: 'skierg', name: 'SkiErg', words: ['ski', 'skierg', 'ski erg'], muscles: ['espalda', 'hombro', 'core'] },
  { id: 'sledpush', name: 'Sled push', words: ['sled push', 'push sled', 'empuje', 'push'], muscles: ['cuadriceps', 'gluteo', 'gemelo'] },
  { id: 'sledpull', name: 'Sled pull', words: ['sled pull', 'pull sled', 'arrastre', 'pull'], muscles: ['espalda', 'agarre', 'isquios'] },
  { id: 'burpee', name: 'Burpee broad jump', words: ['burpee', 'burpees', 'bbj', 'broad jump'], muscles: ['cuadriceps', 'hombro', 'core'] },
  { id: 'remo', name: 'Remo', words: ['row', 'rowing', 'rower', 'remo'], muscles: ['espalda', 'isquios'] },
  { id: 'farmers', name: 'Farmers carry', words: ['farmer', 'farmers', 'carry', 'granjero'], muscles: ['agarre', 'core'] },
  { id: 'lunges', name: 'Sandbag lunges', words: ['lunge', 'lunges', 'sandbag', 'zancada', 'zancadas'], muscles: ['cuadriceps', 'gluteo'] },
  { id: 'wallballs', name: 'Wall balls', words: ['wall ball', 'wallball', 'wall balls', 'wallballs'], muscles: ['cuadriceps', 'hombro'] },
];
const SETS_PER_STATION = 3;

const PLAN_WEEKS = 12;
const DELOAD_WEEKS = [4, 8, 12];
const RUN_TARGET = [20, 25];

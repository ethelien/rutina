// Datos de la rutina. Para cambiar ejercicios, series o vídeos, edita este archivo.
// Cada día tiene bloques. Los textos con 3 valores son: semanas 1-4, 5-8 y 9-12.
// "sets" son las series de cada fase y sirven para el control por grupo muscular.

const YT = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

// Grupos musculares del Control. min/max = rango orientativo de series semanales
// (músculo principal cuenta 1 serie, secundario 0,5). Se pueden cambiar en Ajustes.
const MUSCLES = {
  gemelo:     { short: 'Gemelo',     name: 'Gemelo y tobillo',   tier: 'prioridad', min: 15, max: 30, tip: 'Añade elevaciones de gemelo a una pierna o sóleo sentado.' },
  antebrazo:  { short: 'Antebrazo',  name: 'Antebrazo (muñeca)', tier: 'prioridad', min: 10, max: 20, tip: 'Curl de muñeca, extensión y curl martillo con mancuernas.' },
  agarre:     { short: 'Agarre',     name: 'Agarre (sujeción)',  tier: 'prioridad', min: 10, max: 20, tip: 'Sujeción pesada con mancuernas o colgado en barra.' },
  cuadriceps: { short: 'Cuádriceps', name: 'Cuádriceps',         tier: 'base', min: 12, max: 24, tip: 'Sentadilla búlgara o zancadas con mancuernas.' },
  gluteo:     { short: 'Glúteo',     name: 'Glúteo',             tier: 'base', min: 10, max: 20, tip: 'Hip thrust a una pierna o zancadas.' },
  isquios:    { short: 'Isquios',    name: 'Isquios',            tier: 'base', min: 8,  max: 18, tip: 'Peso muerto rumano con mancuernas en el día de pesas.' },
  espalda:    { short: 'Espalda',    name: 'Espalda y tirón',    tier: 'base', min: 10, max: 20, tip: 'El sled pull y el remo la exigen: remo con mancuerna en el día de pesas.' },
  hombro:     { short: 'Hombro',     name: 'Hombro',             tier: 'base', min: 8,  max: 16, tip: 'Press de hombro con mancuernas o pike push ups.' },
  core:       { short: 'Core',       name: 'Core',               tier: 'base', min: 10, max: 20, tip: 'Planchas y sujeción a una mano (suitcase carry).' },
  pecho:      { short: 'Pecho',      name: 'Pecho y tríceps',    tier: 'mantenimiento', min: 6, max: 12, tip: 'Añade flexiones o fondos en el día de pesas.' },
};
const TIERS = [['prioridad', 'Tus prioridades'], ['base', 'Base Hyrox'], ['mantenimiento', 'Mantenimiento']];

const WARMUP = {
  id: 'calentamiento',
  title: 'Calentamiento',
  rounds: ['5 min', '5 min', '5 min'],
  pause: '',
  sets: [0, 0, 0],
  items: [],
  steps: [
    { text: 'Comba simulada: 2 min suave', video: YT('imaginary jump rope exercise') },
    { text: 'Rodilla a la pared: 10 por lado', video: YT('knee to wall ankle mobility') },
    { text: 'Balanceos de pierna: 10 por lado', video: YT('leg swings warm up') },
    { text: 'Estiramiento de flexor de cadera: 30 s por lado', video: YT('half kneeling hip flexor stretch') },
    { text: '20 elevaciones de gemelo rápidas + 10 pogos suaves', video: YT('pogo hops runners') },
  ],
};

const HYROX_NOTE = '¿Hyrox esta tarde? Haz solo los bloques 1 y 2.';

const SESSIONS = [
  {
    id: 'A', day: 'Lunes', title: 'Saltos reactivos', minutes: 20, warmup: true, hyroxNote: true,
    note: 'Aterrizaje silencioso. Si haces ruido o te hundes, se acabó la serie.',
    blocks: [
      { id: 'reactivo', title: 'Reactivo', rounds: ['3 rondas', '4 rondas', '4 rondas'], pause: 'pausa 30 s', sets: [3, 4, 4],
        items: [
          { name: 'Pogo hops', video: YT('pogo hops runners'), dose: ['15 rep', '20 rep', '10 por pierna, a una pierna'], muscles: ['gemelo'] },
          { name: 'Saltos laterales a una pierna', video: YT('single leg lateral line hops'), dose: ['8 por pierna', '10 por pierna', '12 por pierna'], muscles: ['gemelo'] },
        ] },
      { id: 'potencia', title: 'Potencia', rounds: ['4 series', '5 series', '4 series'], pause: 'pausa 45 s', sets: [4, 5, 4],
        items: [
          { name: 'Salto vertical máximo', video: YT('countermovement jump technique'), dose: ['4 rep', '4 rep', '4 encadenados'], muscles: ['cuadriceps', 'gluteo'] },
        ] },
      { id: 'gemelo', title: 'Gemelo y tobillo', rounds: ['2 rondas sin parar', '3 rondas sin parar', '3 rondas sin parar'], pause: '45 s al final', sets: [2, 3, 3],
        items: [
          { name: 'Gemelo a una pierna', video: YT('single leg dumbbell calf raise on step'), dose: ['12 por pierna, sin peso', '12 por pierna, 8-10 kg', '10 por pierna, 14-18 kg'], muscles: ['gemelo'] },
          { name: 'Isometría de sóleo', video: YT('bent knee isometric calf raise hold'), dose: ['30 s por pierna', '40 s por pierna', '45 s por pierna, 10 kg'], muscles: ['gemelo'] },
          { name: 'Elevación de tibial', video: YT('tibialis raise against wall'), dose: ['15 rep', '20 rep', '20 a una pierna'], muscles: ['gemelo'] },
        ] },
    ],
  },
  {
    id: 'C', day: 'Martes', title: 'Antebrazo y agarre', minutes: 20, warmup: false, hyroxNote: false,
    note: 'En la sujeción: si pasas de 60 s, sube 2 kg por mano.',
    blocks: [
      { id: 'sujecion', title: 'Sujeción', rounds: ['3 series', '4 series', '4 series'], pause: 'pausa 45 s', sets: [3, 4, 4],
        items: [
          { name: 'Sujeción con 2 mancuernas', video: YT('dumbbell farmers hold'), dose: ['máx · 2×20 kg', 'máx · 2×22-24 kg', 'máx · 2×26 kg'], muscles: ['agarre', 'core'] },
        ] },
      { id: 'muneca', title: 'Muñeca', rounds: ['3 rondas', '3 rondas', '4 rondas'], pause: '45 s al final', sets: [3, 3, 4],
        items: [
          { name: 'Curl de muñeca', video: YT('dumbbell wrist curl'), dose: ['15 · 6-8 kg', '15 · 8-10 kg', '12 · 10-12 kg'], muscles: ['antebrazo'] },
          { name: 'Extensión de muñeca', video: YT('dumbbell reverse wrist curl'), dose: ['15 · 4-6 kg', '15 · 6-8 kg', '12 · 8-10 kg'], muscles: ['antebrazo'] },
        ] },
      { id: 'antebrazo', title: 'Antebrazo', rounds: ['3 rondas', '3 rondas', '4 rondas'], pause: '45 s al final', sets: [3, 3, 4],
        items: [
          { name: 'Curl martillo', video: YT('dumbbell hammer curl proper form'), dose: ['12 · 10-12 kg', '12 · 12-14 kg', '10 · 14-16 kg'], muscles: ['antebrazo'] },
          { name: 'Prono-supinación', video: YT('dumbbell pronation supination forearm'), dose: ['12', '12', '15'], muscles: ['antebrazo'] },
        ] },
      { id: 'rodillo', title: 'Rodillo', rounds: ['2 rondas', '3 rondas', '3 rondas'], pause: '', sets: [2, 3, 3],
        items: [
          { name: 'Rodillo de muñeca casero', video: YT('homemade wrist roller'), dose: ['subir y bajar', 'subir y bajar', 'más peso'], muscles: ['antebrazo'] },
        ] },
    ],
  },
  {
    id: 'D', day: 'Miércoles', title: 'Tendón y pie', minutes: 20, warmup: true, hyroxNote: true,
    note: '',
    blocks: [
      { id: 'tendon', title: 'Gemelo y sóleo', rounds: ['3 rondas', '3 rondas', '4 rondas'], pause: '45 s al final', sets: [3, 3, 4],
        items: [
          { name: 'Sóleo sentado con mancuerna en la rodilla', video: YT('seated dumbbell calf raise single leg'), dose: ['15 · 12 kg', '12 · 20 kg', '10 · 2 mancuernas (30-40 kg)'], muscles: ['gemelo'] },
          { name: 'Gemelo a una pierna', video: YT('single leg dumbbell calf raise on step'), dose: ['12 por pierna', '12 por pierna, 8-10 kg', '10 por pierna, 14-18 kg'], muscles: ['gemelo'] },
        ] },
      { id: 'cadera', title: 'Cadera', rounds: ['2 rondas', '3 rondas', '3 rondas'], pause: '45 s al final', sets: [2, 3, 3],
        items: [
          { name: 'Hip thrust a una pierna', video: YT('single leg hip thrust bench'), dose: ['12 por pierna', '12 por pierna, con mancuerna', '10 por pierna, más peso'], muscles: ['gluteo', 'isquios'] },
          { name: 'Sentadilla búlgara', video: YT('dumbbell bulgarian split squat'), dose: ['8 por pierna, sin peso', '8 por pierna, 2×8 kg', '8 por pierna, 2×12 kg'], muscles: ['cuadriceps', 'gluteo'] },
        ] },
      { id: 'pie', title: 'Pie', rounds: ['2 series', '2 series', '2 series'], pause: '', sets: [0, 0, 0],
        items: [
          { name: 'Pie corto', video: YT('short foot exercise'), dose: ['10 de 5 s', '10 de 5 s', '10 a una pierna'], muscles: [] },
        ] },
    ],
  },
  {
    id: 'B', day: 'Jueves', title: 'Saltos de zancada', minutes: 20, warmup: true, hyroxNote: true,
    note: 'Aterrizaje silencioso. Si haces ruido o te hundes, se acabó la serie.',
    blocks: [
      { id: 'lateral', title: 'Lateral', rounds: ['3 series', '4 series', '4 series'], pause: 'pausa 30 s', sets: [3, 4, 4],
        items: [
          { name: 'Skater jumps', video: YT('skater jumps exercise'), dose: ['6 por lado', '8 por lado', '8 por lado, más largos'], muscles: ['gluteo', 'cuadriceps'] },
        ] },
      { id: 'zancada', title: 'Zancada', rounds: ['3 series', '3 series', '4 series'], pause: 'pausa 30 s', sets: [3, 3, 4],
        items: [
          { name: 'Zancada con salto', video: YT('jumping lunges proper form'), dose: ['6 por pierna', '8 por pierna', '8 por pierna'], muscles: ['cuadriceps', 'gluteo'] },
        ] },
      { id: 'longitud', title: 'Potencia horizontal', rounds: ['4 series', '4 series', '4 series'], pause: 'pausa 45 s', sets: [4, 4, 4],
        items: [
          { name: 'Salto de longitud', video: YT('standing broad jump technique'), dose: ['3 rep', '3 rep', '3 encadenados'], muscles: ['gluteo', 'isquios'] },
        ] },
      { id: 'isogemelo', title: 'Tendón', rounds: ['3 series', '3 series', '3 series'], pause: 'pausa 30 s', sets: [3, 3, 3],
        items: [
          { name: 'Isometría de gemelo, rodilla flexionada', video: YT('bent knee isometric calf raise hold'), dose: ['30 s por pierna', '45 s por pierna', '45 s por pierna, 10-15 kg'], muscles: ['gemelo'] },
        ] },
    ],
  },
  {
    id: 'E', day: 'Viernes', title: 'Ritmo y agarre', minutes: 20, warmup: true, hyroxNote: true,
    note: 'Intervalos: cambia de ejercicio en cada intervalo.',
    blocks: [
      { id: 'intervalos', title: 'Ritmo sin cuerda', rounds: ['8 × 40 s / 20 s', '10 × 40 s / 20 s', '10 × 45 s / 15 s'], pause: '', sets: [2, 2, 2],
        items: [
          { name: 'Comba simulada', video: YT('imaginary jump rope exercise'), dose: ['rotando', 'rotando', 'rotando, a una pierna'], muscles: ['gemelo'] },
          { name: 'Skipping', video: YT('high knees in place'), dose: ['rotando', 'rotando', 'rotando'], muscles: [] },
          { name: 'Jumping jacks', video: YT('jumping jacks proper form'), dose: ['rotando', 'rotando', 'rotando'], muscles: [] },
        ] },
      { id: 'agarre', title: 'Agarre', rounds: ['3 rondas', '3 rondas', '3 rondas'], pause: '45 s al final', sets: [3, 3, 3],
        items: [
          { name: 'Sujeción con 2 mancuernas', video: YT('dumbbell farmers hold'), dose: ['45 s', '60 s', '60 s, más peso'], muscles: ['agarre', 'core'] },
          { name: 'Escurrir toalla mojada', video: YT('towel wringing grip exercise'), dose: ['10 por sentido', '12 por sentido', '15 por sentido'], muscles: ['agarre', 'antebrazo'] },
          { name: 'Extensión de dedos con goma', video: YT('rubber band finger extension exercise'), dose: ['25', '30', '30, goma más dura'], muscles: ['antebrazo'] },
        ] },
    ],
  },
];

const PLAN_WEEKS = 12;
const DELOAD_WEEKS = [4, 8, 12];
const RUN_TARGET = [20, 25];

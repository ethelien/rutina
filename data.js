// Datos de la rutina. Para cambiar ejercicios, series o vídeos, edita este archivo.
// Cada día tiene bloques. Los textos con 3 valores son: semanas 1-4, 5-8 y 9-12.
// "sets" son las series de cada fase y sirven para el control por grupo muscular.

const YT = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

const MUSCLES = {
  gemelo:     { name: 'Gemelo y tobillo', target: 15, tip: 'Añade elevaciones de gemelo a una pierna o sóleo sentado.' },
  cuadriceps: { name: 'Cuádriceps',       target: 12, tip: 'Sentadilla búlgara o zancadas con mancuernas.' },
  gluteo:     { name: 'Glúteo',           target: 12, tip: 'Hip thrust a una pierna o zancadas.' },
  isquios:    { name: 'Isquios',          target: 8,  tip: 'Peso muerto rumano con mancuernas en el día de pesas.' },
  agarre:     { name: 'Agarre y antebrazo', target: 12, tip: 'Sujeción pesada con mancuernas y curl martillo.' },
  core:       { name: 'Core',             target: 8,  tip: 'Planchas y sujeción a una mano (suitcase carry).' },
  espalda:    { name: 'Espalda y tirón',  target: 10, tip: 'El sled pull y el remo la exigen: remo con mancuerna en el día de pesas.' },
  hombro:     { name: 'Hombro y empuje',  target: 8,  tip: 'Wall balls y sled push: press con mancuernas y flexiones.' },
};

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
          { name: 'Sujeción con 2 mancuernas', video: YT('dumbbell farmers hold'), dose: ['máx · 2×20 kg', 'máx · 2×22-24 kg', 'máx · 2×26 kg'], muscles: ['agarre'] },
        ] },
      { id: 'muneca', title: 'Muñeca', rounds: ['3 rondas', '3 rondas', '4 rondas'], pause: '45 s al final', sets: [3, 3, 4],
        items: [
          { name: 'Curl de muñeca', video: YT('dumbbell wrist curl'), dose: ['15 · 6-8 kg', '15 · 8-10 kg', '12 · 10-12 kg'], muscles: ['agarre'] },
          { name: 'Extensión de muñeca', video: YT('dumbbell reverse wrist curl'), dose: ['15 · 4-6 kg', '15 · 6-8 kg', '12 · 8-10 kg'], muscles: ['agarre'] },
        ] },
      { id: 'antebrazo', title: 'Antebrazo', rounds: ['3 rondas', '3 rondas', '4 rondas'], pause: '45 s al final', sets: [3, 3, 4],
        items: [
          { name: 'Curl martillo', video: YT('dumbbell hammer curl proper form'), dose: ['12 · 10-12 kg', '12 · 12-14 kg', '10 · 14-16 kg'], muscles: ['agarre'] },
          { name: 'Prono-supinación', video: YT('dumbbell pronation supination forearm'), dose: ['12', '12', '15'], muscles: ['agarre'] },
        ] },
      { id: 'rodillo', title: 'Rodillo', rounds: ['2 rondas', '3 rondas', '3 rondas'], pause: '', sets: [2, 3, 3],
        items: [
          { name: 'Rodillo de muñeca casero', video: YT('homemade wrist roller'), dose: ['subir y bajar', 'subir y bajar', 'más peso'], muscles: ['agarre'] },
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
          { name: 'Sujeción con 2 mancuernas', video: YT('dumbbell farmers hold'), dose: ['45 s', '60 s', '60 s, más peso'], muscles: ['agarre'] },
          { name: 'Escurrir toalla mojada', video: YT('towel wringing grip exercise'), dose: ['10 por sentido', '12 por sentido', '15 por sentido'], muscles: ['agarre'] },
          { name: 'Extensión de dedos con goma', video: YT('rubber band finger extension exercise'), dose: ['25', '30', '30, goma más dura'], muscles: ['agarre'] },
        ] },
    ],
  },
];

// Estaciones de Hyrox: palabras que se buscan en el texto leído de la foto
// y grupos musculares que suman (3 series estimadas por estación).
const STATIONS = [
  { id: 'carrera', name: 'Carrera', words: ['run', 'running', 'correr', 'carrera', 'km run'], muscles: [] },
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

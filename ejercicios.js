// Diccionario de ejercicios que la app reconoce en el texto de la pizarra.
// Para añadir uno: copia una línea, pon un id nuevo, el nombre, los grupos musculares
// (claves de MUSCLES en data.js) y las palabras con las que suele aparecer escrito.
// Las palabras se comparan sin mayúsculas ni tildes; el plural con "s" se reconoce solo.
// Si dos palabras coinciden en el mismo texto, gana la más larga ("pike push up" antes que "push up").

const EXERCISES = [
  // Estaciones Hyrox
  { id: 'carrera', name: 'Carrera', muscles: [], words: ['run', 'running', 'correr', 'carrera', 'km run', 'shuttle run'] },
  { id: 'skierg', name: 'SkiErg', muscles: ['espalda', 'hombro', 'core'], words: ['ski', 'skierg', 'ski erg'] },
  { id: 'sledpush', name: 'Sled push', muscles: ['cuadriceps', 'gluteo', 'gemelo'], words: ['sled push', 'push sled', 'empuje de trineo', 'trineo empuje'] },
  { id: 'sledpull', name: 'Sled pull', muscles: ['espalda', 'agarre', 'isquios'], words: ['sled pull', 'pull sled', 'sled drag', 'arrastre de trineo'] },
  { id: 'bbj', name: 'Burpee broad jump', muscles: ['cuadriceps', 'hombro', 'core'], words: ['burpee broad jump', 'bbj', 'burpee broad'] },
  { id: 'remo', name: 'Remo (ergómetro)', muscles: ['espalda', 'isquios'], words: ['row', 'rowing', 'rower', 'remo', 'cal row', 'remoergometro'] },
  { id: 'farmers', name: 'Farmers carry', muscles: ['agarre', 'core'], words: ['farmer', 'farmers', 'farmer carry', 'farmers carry', 'farmer walk', 'farmers walk', 'granjero', 'paseo del granjero'] },
  { id: 'lunges', name: 'Zancadas', muscles: ['cuadriceps', 'gluteo'], words: ['lunge', 'sandbag lunge', 'walking lunge', 'reverse lunge', 'zancada', 'front rack lunge', 'overhead lunge'] },
  { id: 'wallballs', name: 'Wall balls', muscles: ['cuadriceps', 'hombro'], words: ['wall ball', 'wallball', 'wb', 'wall ball shot'] },

  // Pierna
  { id: 'backsquat', name: 'Back squat', muscles: ['cuadriceps', 'gluteo'], words: ['back squat', 'bs', 'sentadilla trasera'] },
  { id: 'frontsquat', name: 'Front squat', muscles: ['cuadriceps', 'core'], words: ['front squat', 'fs', 'sentadilla frontal'] },
  { id: 'ohs', name: 'Overhead squat', muscles: ['cuadriceps', 'hombro', 'core'], words: ['overhead squat', 'ohs'] },
  { id: 'gobletsquat', name: 'Goblet squat', muscles: ['cuadriceps', 'gluteo'], words: ['goblet squat', 'goblet'] },
  { id: 'squat', name: 'Sentadilla', muscles: ['cuadriceps', 'gluteo'], words: ['squat', 'air squat', 'sentadilla', 'box squat', 'jump squat', 'squat jump'] },
  { id: 'splitsquat', name: 'Sentadilla búlgara', muscles: ['cuadriceps', 'gluteo'], words: ['split squat', 'bulgarian', 'bulgarian split squat', 'bulgara', 'sentadilla bulgara'] },
  { id: 'pistol', name: 'Pistol squat', muscles: ['cuadriceps', 'gluteo'], words: ['pistol', 'pistol squat'] },
  { id: 'boxjump', name: 'Box jump', muscles: ['cuadriceps', 'gluteo', 'gemelo'], words: ['box jump', 'box jump over', 'bjo', 'salto al cajon', 'saltos al cajon'] },
  { id: 'stepup', name: 'Step up', muscles: ['cuadriceps', 'gluteo'], words: ['step up', 'box step up', 'step over', 'box step over', 'subida al cajon'] },
  { id: 'broadjump', name: 'Salto de longitud', muscles: ['gluteo', 'isquios'], words: ['broad jump', 'salto de longitud', 'salto horizontal'] },
  { id: 'deadlift', name: 'Peso muerto', muscles: ['isquios', 'gluteo', 'espalda', 'agarre'], words: ['deadlift', 'dl', 'peso muerto', 'sumo deadlift', 'trap bar deadlift'] },
  { id: 'rdl', name: 'Peso muerto rumano', muscles: ['isquios', 'gluteo'], words: ['romanian deadlift', 'rdl', 'peso muerto rumano', 'stiff leg deadlift', 'single leg deadlift'] },
  { id: 'sdhp', name: 'Sumo deadlift high pull', muscles: ['isquios', 'espalda', 'hombro'], words: ['sumo deadlift high pull', 'sdhp', 'high pull'] },
  { id: 'goodmorning', name: 'Good morning', muscles: ['isquios', 'espalda'], words: ['good morning', 'buenos dias'] },
  { id: 'hipthrust', name: 'Hip thrust', muscles: ['gluteo', 'isquios'], words: ['hip thrust', 'glute bridge', 'puente de gluteo'] },
  { id: 'swing', name: 'Kettlebell swing', muscles: ['gluteo', 'isquios', 'agarre'], words: ['swing', 'kb swing', 'kettlebell swing', 'american swing', 'russian swing', 'kbs'] },
  { id: 'calf', name: 'Elevación de gemelo', muscles: ['gemelo'], words: ['calf raise', 'elevacion de gemelo', 'elevaciones de gemelo', 'elevacion de talones'] },
  { id: 'comba', name: 'Comba (dobles / simples)', muscles: ['gemelo'], words: ['double under', 'single under', 'du', 'd u', 's u', 'dobles', 'comba', 'jump rope', 'crossover', 'saltos de comba'] },
  { id: 'bike', name: 'Bici (assault / echo)', muscles: ['cuadriceps'], words: ['bike', 'assault bike', 'echo bike', 'air bike', 'airbike', 'cal bike', 'bici', 'bike erg'] },

  // Olímpicos y empujes con carga
  { id: 'clean', name: 'Clean / cargada', muscles: ['isquios', 'gluteo', 'espalda', 'agarre'], words: ['clean', 'power clean', 'squat clean', 'hang clean', 'hang power clean', 'cargada', 'db clean', 'kb clean'] },
  { id: 'cleanjerk', name: 'Clean and jerk', muscles: ['isquios', 'gluteo', 'espalda', 'hombro'], words: ['clean and jerk', 'clean jerk', 'c j', 'dwalla', 'clean to overhead'] },
  { id: 'snatch', name: 'Snatch / arrancada', muscles: ['espalda', 'hombro', 'isquios', 'agarre'], words: ['snatch', 'power snatch', 'squat snatch', 'arrancada', 'db snatch', 'kb snatch'] },
  { id: 'hangsnatch', name: 'Hang snatch', muscles: ['espalda', 'hombro', 'isquios', 'agarre'], words: ['hang snatch', 'hang power snatch'] },
  { id: 'jerk', name: 'Jerk', muscles: ['hombro', 'cuadriceps'], words: ['jerk', 'push jerk', 'split jerk'] },
  { id: 'thruster', name: 'Thruster', muscles: ['cuadriceps', 'hombro'], words: ['thruster'] },
  { id: 'pushpress', name: 'Push press', muscles: ['hombro', 'cuadriceps'], words: ['push press'] },
  { id: 'shoulderpress', name: 'Shoulder press', muscles: ['hombro'], words: ['shoulder press', 'strict press', 'press militar', 'overhead press', 'ohp', 'press de hombro', 'arnold press', 'military press'] },
  { id: 'bench', name: 'Press banca', muscles: ['hombro'], words: ['bench press', 'bench', 'press banca', 'press de banca', 'floor press'] },
  { id: 'devilpress', name: 'Devil press', muscles: ['hombro', 'isquios', 'core'], words: ['devil press', 'devils press', 'man maker'] },
  { id: 'sandbag', name: 'Sandbag al hombro', muscles: ['isquios', 'gluteo', 'espalda', 'agarre'], words: ['sandbag to shoulder', 'sandbag over shoulder', 'sandbag clean', 'atlas stone', 'med ball clean'] },
  { id: 'slam', name: 'Ball slam', muscles: ['core', 'hombro'], words: ['ball slam', 'slam ball', 'slam'] },

  // Empuje con peso corporal
  { id: 'pushup', name: 'Flexiones', muscles: ['hombro', 'core'], words: ['push up', 'pushup', 'hand release push up', 'hrpu', 'flexion', 'flexiones'] },
  { id: 'pikepushup', name: 'Pike push ups', muscles: ['hombro', 'core'], words: ['pike push up', 'pike pushup', 'flexion en pica'] },
  { id: 'hspu', name: 'Handstand push up', muscles: ['hombro'], words: ['handstand push up', 'hspu', 'strict hspu', 'flexion en pino'] },
  { id: 'hswalk', name: 'Handstand walk', muscles: ['hombro', 'core'], words: ['handstand walk', 'hs walk', 'pino', 'wall walk', 'handstand hold'] },
  { id: 'dip', name: 'Fondos', muscles: ['hombro'], words: ['dip', 'ring dip', 'bar dip', 'fondos'] },
  { id: 'burpee', name: 'Burpees', muscles: ['cuadriceps', 'hombro', 'core'], words: ['burpee', 'bar facing burpee', 'burpee over bar', 'burpee box jump'] },
  { id: 'bearcrawl', name: 'Bear crawl', muscles: ['hombro', 'core'], words: ['bear crawl', 'gateo'] },

  // Tirón
  { id: 'pullup', name: 'Dominadas', muscles: ['espalda', 'agarre'], words: ['pull up', 'pullup', 'chin up', 'chinup', 'dominada', 'dominadas', 'kipping pull up', 'strict pull up'] },
  { id: 'c2b', name: 'Chest to bar', muscles: ['espalda', 'agarre'], words: ['chest to bar', 'c2b', 'ctb'] },
  { id: 'muscleup', name: 'Muscle up', muscles: ['espalda', 'hombro', 'agarre'], words: ['muscle up', 'bar muscle up', 'ring muscle up', 'bmu', 'rmu'] },
  { id: 'ringrow', name: 'Remo en anillas', muscles: ['espalda'], words: ['ring row', 'remo en anillas', 'trx row', 'remo invertido'] },
  { id: 'dbrow', name: 'Remo con peso', muscles: ['espalda', 'agarre'], words: ['bent over row', 'db row', 'dumbbell row', 'kb row', 'pendlay row', 'renegade row', 'remo con mancuerna', 'remo con barra', 'barbell row', 'gorilla row'] },
  { id: 'uprightrow', name: 'Remo al mentón', muscles: ['hombro'], words: ['upright row', 'remo al menton'] },
  { id: 'ropeclimb', name: 'Trepa de cuerda', muscles: ['espalda', 'agarre'], words: ['rope climb', 'trepa', 'legless rope climb'] },
  { id: 'pulldown', name: 'Jalón', muscles: ['espalda'], words: ['lat pulldown', 'pulldown', 'jalon'] },
  { id: 'facepull', name: 'Face pull', muscles: ['hombro', 'espalda'], words: ['face pull'] },
  { id: 'curl', name: 'Curl de bíceps', muscles: ['agarre'], words: ['curl', 'bicep curl', 'biceps curl', 'hammer curl', 'curl martillo', 'curl de biceps'] },

  // Core
  { id: 'ttb', name: 'Toes to bar / rodillas al pecho', muscles: ['core', 'agarre'], words: ['toes to bar', 'ttb', 't2b', 'knees to chest', 'k2c', 'knees to elbow', 'k2e', 'rodillas al pecho', 'hanging knee raise', 'knee raise'] },
  { id: 'situp', name: 'Abdominales', muscles: ['core'], words: ['sit up', 'situp', 'abmat', 'abmat sit up', 'abdominales', 'abdominal', 'abs', 'crunch', 'encogimientos', 'ghd sit up', 'ghd'] },
  { id: 'plank', name: 'Plancha', muscles: ['core'], words: ['plank', 'plancha', 'side plank', 'plancha lateral'] },
  { id: 'hollow', name: 'Hollow', muscles: ['core'], words: ['hollow', 'hollow rock', 'hollow hold', 'superman', 'arch hold'] },
  { id: 'vup', name: 'V ups', muscles: ['core'], words: ['v up', 'vup', 'tuck up', 'jack knife'] },
  { id: 'twist', name: 'Russian twist', muscles: ['core'], words: ['russian twist', 'giro ruso'] },
  { id: 'lsit', name: 'L-sit', muscles: ['core', 'hombro'], words: ['l sit', 'lsit'] },
  { id: 'tgu', name: 'Turkish get up', muscles: ['core', 'hombro'], words: ['turkish get up', 'tgu', 'get up'] },
  { id: 'mountain', name: 'Mountain climbers', muscles: ['core'], words: ['mountain climber', 'escaladores', 'escalador'] },
  { id: 'deadbug', name: 'Dead bug', muscles: ['core'], words: ['dead bug', 'bird dog'] },

  // Agarre y transportes
  { id: 'deadhang', name: 'Colgado en barra', muscles: ['agarre'], words: ['dead hang', 'colgado', 'bar hang', 'hang hold'] },
  { id: 'carry', name: 'Transporte con peso', muscles: ['agarre', 'core'], words: ['carry', 'suitcase carry', 'front rack carry', 'overhead carry', 'kb carry', 'sandbag carry', 'yoke'] },
  { id: 'battlerope', name: 'Battle rope', muscles: ['hombro', 'core'], words: ['battle rope', 'cuerdas de batalla'] },

  // Cardio y otros
  { id: 'jacks', name: 'Jumping jacks', muscles: ['gemelo'], words: ['jumping jack', 'jj'] },
  { id: 'skipping', name: 'Skipping', muscles: [], words: ['skipping', 'high knees', 'rodillas arriba'] },
  { id: 'swim', name: 'Natación', muscles: ['espalda', 'hombro'], words: ['swim', 'natacion', 'nadar'] },
];

// Títulos de bloque habituales en las pizarras.
const BLOCK_HEADERS = ['strength', 'fuerza', 'wod', 'metcon', 'warm up', 'warmup', 'calentamiento', 'skill', 'skills', 'tecnica',
  'accesorios', 'accesorio', 'accessory', 'accessories', 'finisher', 'buy in', 'cash out', 'conditioning', 'acondicionamiento',
  'core', 'hyrox', 'hyrox sim', 'simulacion', 'simulacion hyrox', 'simulation', 'engine', 'gymnastics', 'gimnasticos', 'halterofilia', 'weightlifting', 'mobility', 'movilidad', 'cool down', 'vuelta a la calma',
  'parte a', 'parte b', 'parte c', 'part a', 'part b', 'part c', 'bloque 1', 'bloque 2', 'bloque 3'];

// Títulos tras los que el texto ya no es el entreno (listas de la app del box, resultados...).
const IGNORE_HEADERS = ['movimientos', 'movements', 'notas', 'notes', 'resultados', 'results', 'leaderboard', 'ranking', 'comentarios', 'comments'];

// Bloques que cuentan como una sola serie (no es trabajo real).
const LIGHT_BLOCKS = ['warm up', 'warmup', 'calentamiento', 'mobility', 'movilidad', 'cool down', 'vuelta a la calma'];

const DEFAULT_SERIES = 3;
const MINUTES_PER_SERIES = 4;

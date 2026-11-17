import { DifficultyConfig, DifficultyLevel, VerbItem, VerbPattern } from '../types/game';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    label: 'Cadet',
    subtitle: 'Core 40 verbs · 15s',
    time: 15,
    maxLives: 3,
    points: 100,
    tiers: [1],
  },
  normal: {
    label: 'Voyager',
    subtitle: 'Common 74 verbs · 12s',
    time: 12,
    maxLives: 3,
    points: 150,
    tiers: [1, 2],
  },
  master: {
    label: 'Chrono Lord',
    subtitle: 'All 95 verbs · 7s',
    time: 7,
    maxLives: 2,
    points: 250,
    tiers: [1, 2, 3],
  },
};

export const PATTERN_LABELS: Record<VerbPattern, { title: string; subtitle: string }> = {
  AAA: { title: 'A-A-A Identical', subtitle: 'Same spelling in all 3 forms (cut · cut · cut)' },
  ABB: { title: 'A-B-B Twin Ending', subtitle: 'Past Simple & Participle match (buy · bought · bought)' },
  ABC: { title: 'A-B-C Three Forms', subtitle: 'All three forms differ (sing · sang · sung)' },
  ABA: { title: 'A-B-A Boomerang', subtitle: 'Participle returns to base (come · came · come)' },
  MIXED: { title: 'Unique / Mixed', subtitle: 'Special irregular shifts (beat · beat · beaten)' },
};

export const COMMON_25_BASES = [
  'Be', 'Become', 'Begin', 'Break', 'Bring', 'Buy', 'Catch', 'Choose', 'Come',
  'Do', 'Drink', 'Drive', 'Eat', 'Fall', 'Find', 'Fly', 'Forget', 'Get',
  'Give', 'Go', 'Have', 'Hear', 'Know', 'Make', 'See',
];

export const VERB_DATABASE: VerbItem[] = [
  {
    base: 'Be', past: 'Was / Were', part: 'Been', cat: 'ser / estar',
    acceptedPast: ['was / were', 'was/were', 'was', 'were'], acceptedPart: ['been'],
    distractors: ['Was / Was', 'Beed / Been'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'The astronauts ___ excited when they saw Mars.',
      target: 'past', answer: 'were', accepted: ['were'],
      distractors: ['been', 'was'], clue: 'Plural subject in Past Simple uses were.',
    },
  },
  {
    base: 'Beat', past: 'Beat', part: 'Beaten', cat: 'colpejar / vèncer',
    acceptedPast: ['beat'], acceptedPart: ['beaten'],
    distractors: ['Beated / Beaten', 'Beat / Beat'], difficulty: 3, pattern: 'MIXED',
    sentence: {
      text: 'Our school team has ___ the champions twice this year.',
      target: 'part', answer: 'beaten', accepted: ['beaten'],
      distractors: ['beat', 'beated'], clue: 'After has/have, use the Past Participle beaten.',
    },
  },
  {
    base: 'Become', past: 'Became', part: 'Become', cat: 'esdevenir / fer-se',
    acceptedPast: ['became'], acceptedPart: ['become'],
    distractors: ['Becomed / Become', 'Became / Became'], difficulty: 1, pattern: 'ABA',
    sentence: {
      text: 'Last summer, my older sister ___ a lifeguard.',
      target: 'past', answer: 'became', accepted: ['became'],
      distractors: ['become', 'becomed'], clue: 'Last summer signals Past Simple: became.',
    },
  },
  {
    base: 'Begin', past: 'Began', part: 'Begun', cat: 'començar',
    acceptedPast: ['began'], acceptedPart: ['begun'],
    distractors: ['Beginned / Begun', 'Began / Began'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'The science fair has already ___ in the gym.',
      target: 'part', answer: 'begun', accepted: ['begun'],
      distractors: ['began', 'begin'], clue: 'Has + Past Participle requires begun.',
    },
  },
  {
    base: 'Bend', past: 'Bent', part: 'Bent', cat: 'doblar / vinclar',
    acceptedPast: ['bent'], acceptedPart: ['bent'],
    distractors: ['Bended / Bent', 'Bent / Benden'], difficulty: 3, pattern: 'ABB',
    sentence: {
      text: 'The strong wind ___ the young tree near the gate.',
      target: 'past', answer: 'bent', accepted: ['bent'],
      distractors: ['bended', 'bend'], clue: 'Past Simple of bend changes -d to -t: bent.',
    },
  },
  {
    base: 'Bet', past: 'Bet', part: 'Bet', cat: 'apostar',
    acceptedPast: ['bet'], acceptedPart: ['bet'],
    distractors: ['Betted / Bet', 'Bet / Betten'], difficulty: 3, pattern: 'AAA',
    sentence: {
      text: 'Leo ___ his friend that it would rain before noon.',
      target: 'past', answer: 'bet', accepted: ['bet'],
      distractors: ['betted', 'botten'], clue: 'Bet keeps the exact same form: bet.',
    },
  },
  {
    base: 'Bite', past: 'Bit', part: 'Bitten', cat: 'mossegar',
    acceptedPast: ['bit'], acceptedPart: ['bitten'],
    distractors: ['Bited / Bitten', 'Bit / Bit'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'Have you ever been ___ by a mosquito while camping?',
      target: 'part', answer: 'bitten', accepted: ['bitten'],
      distractors: ['bit', 'bited'], clue: 'Passive / have been requires Past Participle bitten.',
    },
  },
  {
    base: 'Bleed', past: 'Bled', part: 'Bled', cat: 'sagnar',
    acceptedPast: ['bled'], acceptedPart: ['bled'],
    distractors: ['Bleeded / Bled', 'Bled / Bleden'], difficulty: 3, pattern: 'ABB',
    sentence: {
      text: 'My knee ___ a little after I fell off my skateboard.',
      target: 'past', answer: 'bled', accepted: ['bled'],
      distractors: ['bleeded', 'bleed'], clue: 'Past Simple of bleed shortens the vowel to bled.',
    },
  },
  {
    base: 'Blow', past: 'Blew', part: 'Blown', cat: 'bufar',
    acceptedPast: ['blew'], acceptedPart: ['blown'],
    distractors: ['Blowed / Blown', 'Blew / Blew'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'Maya made a wish and ___ out all twelve candles.',
      target: 'past', answer: 'blew', accepted: ['blew'],
      distractors: ['blown', 'blowed'], clue: 'Completed past action uses Past Simple blew.',
    },
  },
  {
    base: 'Break', past: 'Broke', part: 'Broken', cat: 'trencar',
    acceptedPast: ['broke'], acceptedPart: ['broken'],
    distractors: ['Breaked / Broken', 'Broke / Broke'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Oh no, someone has ___ the classroom clock!',
      target: 'part', answer: 'broken', accepted: ['broken'],
      distractors: ['broke', 'breaked'], clue: 'Has + Past Participle takes broken.',
    },
  },
  {
    base: 'Bring', past: 'Brought', part: 'Brought', cat: 'portar',
    acceptedPast: ['brought'], acceptedPart: ['brought'],
    distractors: ['Brang / Brung', 'Brought / Broughten'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Dad ___ fresh strawberries from the market this morning.',
      target: 'past', answer: 'brought', accepted: ['brought'],
      distractors: ['bringed', 'brang'], clue: 'Bring follows the -ought pattern: brought.',
    },
  },
  {
    base: 'Build', past: 'Built', part: 'Built', cat: 'construir',
    acceptedPast: ['built'], acceptedPart: ['built'],
    distractors: ['Builded / Built', 'Built / Builded'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'The students have ___ a solar-powered model car.',
      target: 'part', answer: 'built', accepted: ['built'],
      distractors: ['builded', 'build'], clue: 'Build changes -d to -t: built.',
    },
  },
  {
    base: 'Burn', past: 'Burnt', part: 'Burnt', cat: 'cremar',
    acceptedPast: ['burnt', 'burned'], acceptedPart: ['burnt', 'burned'],
    distractors: ['Burnded / Burnt', 'Burnt / Burnten'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'We forgot the timer and ___ the garlic bread.',
      target: 'past', answer: 'burnt', accepted: ['burnt', 'burned'],
      distractors: ['burnted', 'burn'], clue: 'Past Simple of burn is burnt (or burned).',
    },
  },
  {
    base: 'Buy', past: 'Bought', part: 'Bought', cat: 'comprar',
    acceptedPast: ['bought'], acceptedPart: ['bought'],
    distractors: ['Buyed / Bought', 'Bought / Boughton'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'I ___ a new notebook for English class yesterday.',
      target: 'past', answer: 'bought', accepted: ['bought'],
      distractors: ['buyed', 'brought'], clue: 'Careful: buy -> bought (bring -> brought).',
    },
  },
  {
    base: 'Catch', past: 'Caught', part: 'Caught', cat: 'atrapar / agafar',
    acceptedPast: ['caught'], acceptedPart: ['caught'],
    distractors: ['Catched / Caught', 'Caught / Cought'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Our goalkeeper ___ the ball right before the whistle!',
      target: 'past', answer: 'caught', accepted: ['caught'],
      distractors: ['catched', 'cought'], clue: 'Catch becomes caught with -aught.',
    },
  },
  {
    base: 'Choose', past: 'Chose', part: 'Chosen', cat: 'triar / escollir',
    acceptedPast: ['chose'], acceptedPart: ['chosen'],
    distractors: ['Choosed / Chosen', 'Chose / Chose'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'The class has ___ blue and gold for the team jerseys.',
      target: 'part', answer: 'chosen', accepted: ['chosen'],
      distractors: ['chose', 'choosed'], clue: 'Has + Past Participle uses chosen.',
    },
  },
  {
    base: 'Come', past: 'Came', part: 'Come', cat: 'venir',
    acceptedPast: ['came'], acceptedPart: ['come'],
    distractors: ['Comed / Come', 'Came / Came'], difficulty: 1, pattern: 'ABA',
    sentence: {
      text: 'My cousins ___ to visit Barcelona last weekend.',
      target: 'past', answer: 'came', accepted: ['came'],
      distractors: ['come', 'comed'], clue: 'Last weekend takes Past Simple: came.',
    },
  },
  {
    base: 'Cost', past: 'Cost', part: 'Cost', cat: 'costar',
    acceptedPast: ['cost'], acceptedPart: ['cost'],
    distractors: ['Costed / Cost', 'Cost / Costen'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'The museum tickets ___ ten euros each last Sunday.',
      target: 'past', answer: 'cost', accepted: ['cost'],
      distractors: ['costed', 'costen'], clue: 'Cost stays identical in all three forms.',
    },
  },
  {
    base: 'Cut', past: 'Cut', part: 'Cut', cat: 'tallar',
    acceptedPast: ['cut'], acceptedPart: ['cut'],
    distractors: ['Cutted / Cut', 'Cut / Cutten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'She ___ the cardboard into six equal triangles.',
      target: 'past', answer: 'cut', accepted: ['cut'],
      distractors: ['cutted', 'cutten'], clue: 'Cut never adds -ed: cut / cut / cut.',
    },
  },
  {
    base: 'Dig', past: 'Dug', part: 'Dug', cat: 'cavar',
    acceptedPast: ['dug'], acceptedPart: ['dug'],
    distractors: ['Digged / Dug', 'Dug / Digged'], difficulty: 3, pattern: 'ABB',
    sentence: {
      text: 'Our puppy ___ a huge hole in the garden this afternoon.',
      target: 'past', answer: 'dug', accepted: ['dug'],
      distractors: ['digged', 'dag'], clue: 'Dig changes i to u: dug.',
    },
  },
  {
    base: 'Do', past: 'Did', part: 'Done', cat: 'fer',
    acceptedPast: ['did'], acceptedPart: ['done'],
    distractors: ['Doed / Done', 'Done / Did'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Have you ___ all your math homework yet?',
      target: 'part', answer: 'done', accepted: ['done'],
      distractors: ['did', 'doed'], clue: 'Present Perfect (Have you...) uses done.',
    },
  },
  {
    base: 'Draw', past: 'Drew', part: 'Drawn', cat: 'dibuixar',
    acceptedPast: ['drew'], acceptedPart: ['drawn'],
    distractors: ['Drawed / Drawn', 'Drew / Drew'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'Elena ___ a map of the solar system in her sketchbook.',
      target: 'past', answer: 'drew', accepted: ['drew'],
      distractors: ['drawn', 'drawed'], clue: 'Completed past action takes Past Simple drew.',
    },
  },
  {
    base: 'Dream', past: 'Dreamt', part: 'Dreamt', cat: 'somiar',
    acceptedPast: ['dreamt', 'dreamed'], acceptedPart: ['dreamt', 'dreamed'],
    distractors: ['Drempt / Dreamt', 'Dreamt / Dreamen'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Last night I ___ that I could fly over the Pyrenees.',
      target: 'past', answer: 'dreamt', accepted: ['dreamt', 'dreamed'],
      distractors: ['dreamen', 'dremp'], clue: 'Last night takes Past Simple dreamt (or dreamed).',
    },
  },
  {
    base: 'Drink', past: 'Drank', part: 'Drunk', cat: 'beure',
    acceptedPast: ['drank'], acceptedPart: ['drunk'],
    distractors: ['Drinked / Drunk', 'Drank / Drank'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'After the race, we ___ two bottles of cold water.',
      target: 'past', answer: 'drank', accepted: ['drank'],
      distractors: ['drunk', 'drinked'], clue: 'Past Simple is drank (Participle is drunk).',
    },
  },
  {
    base: 'Drive', past: 'Drove', part: 'Driven', cat: 'conduir',
    acceptedPast: ['drove'], acceptedPart: ['driven'],
    distractors: ['Drived / Driven', 'Drove / Drove'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Uncle Marc has ___ across Spain three times.',
      target: 'part', answer: 'driven', accepted: ['driven'],
      distractors: ['drove', 'drived'], clue: 'Has + Past Participle requires driven.',
    },
  },
  {
    base: 'Eat', past: 'Ate', part: 'Eaten', cat: 'menjar',
    acceptedPast: ['ate'], acceptedPart: ['eaten'],
    distractors: ['Eated / Eaten', 'Ate / Ate'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Who has ___ the last slice of melon?',
      target: 'part', answer: 'eaten', accepted: ['eaten'],
      distractors: ['ate', 'eated'], clue: 'Has + Past Participle uses eaten.',
    },
  },
  {
    base: 'Fall', past: 'Fell', part: 'Fallen', cat: 'caure',
    acceptedPast: ['fell'], acceptedPart: ['fallen'],
    distractors: ['Falled / Fallen', 'Fell / Fell'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Autumn leaves ___ onto the playground overnight.',
      target: 'past', answer: 'fell', accepted: ['fell'],
      distractors: ['fallen', 'falled'], clue: 'Past Simple of fall is fell.',
    },
  },
  {
    base: 'Feed', past: 'Fed', part: 'Fed', cat: 'alimentar',
    acceptedPast: ['fed'], acceptedPart: ['fed'],
    distractors: ['Feeded / Fed', 'Fed / Feeden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'I already ___ the goldfish before leaving for school.',
      target: 'past', answer: 'fed', accepted: ['fed'],
      distractors: ['feeded', 'feeden'], clue: 'Feed shortens ee to e: fed.',
    },
  },
  {
    base: 'Feel', past: 'Felt', part: 'Felt', cat: 'sentir / notar',
    acceptedPast: ['felt'], acceptedPart: ['felt'],
    distractors: ['Feeled / Felt', 'Felt / Felten'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Everyone ___ proud when the rocket launched cleanly.',
      target: 'past', answer: 'felt', accepted: ['felt'],
      distractors: ['feeled', 'fell'], clue: 'Feel becomes felt (do not confuse with fell from fall!).',
    },
  },
  {
    base: 'Fight', past: 'Fought', part: 'Fought', cat: 'lluitar',
    acceptedPast: ['fought'], acceptedPart: ['fought'],
    distractors: ['Fighted / Fought', 'Fought / Foughten'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'The brave knights ___ to protect the castle.',
      target: 'past', answer: 'fought', accepted: ['fought'],
      distractors: ['fighted', 'foughten'], clue: 'Fight follows the -ought pattern: fought.',
    },
  },
  {
    base: 'Find', past: 'Found', part: 'Found', cat: 'trobar',
    acceptedPast: ['found'], acceptedPart: ['found'],
    distractors: ['Finded / Found', 'Found / Founden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Look! I have ___ the missing puzzle piece under the sofa.',
      target: 'part', answer: 'found', accepted: ['found'],
      distractors: ['finded', 'founded'], clue: 'Find -> found (founded means established).',
    },
  },
  {
    base: 'Fly', past: 'Flew', part: 'Flown', cat: 'volar',
    acceptedPast: ['flew'], acceptedPart: ['flown'],
    distractors: ['Flied / Flown', 'Flew / Flew'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Have you ever ___ in an airplane at night?',
      target: 'part', answer: 'flown', accepted: ['flown'],
      distractors: ['flew', 'flied'], clue: 'Have you ever + Past Participle uses flown.',
    },
  },
  {
    base: 'Forbid', past: 'Forbade', part: 'Forbidden', cat: 'prohibir',
    acceptedPast: ['forbade'], acceptedPart: ['forbidden'],
    distractors: ['Forbidded / Forbidden', 'Forbade / Forbade'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'Entering the ancient ruins at night is strictly ___.',
      target: 'part', answer: 'forbidden', accepted: ['forbidden'],
      distractors: ['forbade', 'forbidded'], clue: 'Passive / adjective form takes Past Participle forbidden.',
    },
  },
  {
    base: 'Forget', past: 'Forgot', part: 'Forgotten', cat: 'oblidar',
    acceptedPast: ['forgot'], acceptedPart: ['forgotten'],
    distractors: ['Forgetted / Forgotten', 'Forgot / Forgot'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Oh no, I have ___ my library card at home!',
      target: 'part', answer: 'forgotten', accepted: ['forgotten'],
      distractors: ['forgot', 'forgetted'], clue: 'Have + Past Participle requires forgotten.',
    },
  },
  {
    base: 'Forgive', past: 'Forgave', part: 'Forgiven', cat: 'perdonar',
    acceptedPast: ['forgave'], acceptedPart: ['forgiven'],
    distractors: ['Forgived / Forgiven', 'Forgave / Forgave'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'Nora smiled and ___ her brother for spilling the juice.',
      target: 'past', answer: 'forgave', accepted: ['forgave'],
      distractors: ['forgiven', 'forgived'], clue: 'Like give -> gave, forgive -> forgave.',
    },
  },
  {
    base: 'Freeze', past: 'Froze', part: 'Frozen', cat: 'congelar(-se)',
    acceptedPast: ['froze'], acceptedPart: ['frozen'],
    distractors: ['Freezed / Frozen', 'Froze / Froze'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'The mountain lake has ___ solid overnight.',
      target: 'part', answer: 'frozen', accepted: ['frozen'],
      distractors: ['froze', 'freezed'], clue: 'Has + Past Participle takes frozen.',
    },
  },
  {
    base: 'Get', past: 'Got', part: 'Got', cat: 'aconseguir / obtenir',
    acceptedPast: ['got'], acceptedPart: ['got', 'gotten'],
    distractors: ['Getted / Got', 'Get / Got'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'We ___ ten out of ten on our English quiz!',
      target: 'past', answer: 'got', accepted: ['got'],
      distractors: ['getted', 'gotten'], clue: 'Past Simple of get is got.',
    },
  },
  {
    base: 'Give', past: 'Gave', part: 'Given', cat: 'donar',
    acceptedPast: ['gave'], acceptedPart: ['given'],
    distractors: ['Gived / Given', 'Gave / Gave'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Our teacher ___ us extra time to finish the project.',
      target: 'past', answer: 'gave', accepted: ['gave'],
      distractors: ['given', 'gived'], clue: 'Past Simple is gave (Participle is given).',
    },
  },
  {
    base: 'Go', past: 'Went', part: 'Gone', cat: 'anar',
    acceptedPast: ['went'], acceptedPart: ['gone'],
    distractors: ['Goed / Gone', 'Went / Went'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Where has everyone ___? The room is empty!',
      target: 'part', answer: 'gone', accepted: ['gone'],
      distractors: ['went', 'goed'], clue: 'Has + Past Participle uses gone.',
    },
  },
  {
    base: 'Grow', past: 'Grew', part: 'Grown', cat: 'créixer / conrear',
    acceptedPast: ['grew'], acceptedPart: ['grown'],
    distractors: ['Growed / Grown', 'Grew / Grew'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'Those sunflowers have ___ taller than the fence!',
      target: 'part', answer: 'grown', accepted: ['grown'],
      distractors: ['grew', 'growed'], clue: 'Have + Past Participle requires grown.',
    },
  },
  {
    base: 'Hang', past: 'Hung', part: 'Hung', cat: 'penjar',
    acceptedPast: ['hung'], acceptedPart: ['hung'],
    distractors: ['Hanged / Hung', 'Hung / Hungen'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'We ___ the paper lanterns across the courtyard.',
      target: 'past', answer: 'hung', accepted: ['hung'],
      distractors: ['hang', 'hungen'], clue: 'Past Simple for hanging objects is hung.',
    },
  },
  {
    base: 'Have', past: 'Had', part: 'Had', cat: 'tenir / haver',
    acceptedPast: ['had'], acceptedPart: ['had'],
    distractors: ['Haved / Had', 'Had / Hadden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'We ___ a great time at the science museum on Friday.',
      target: 'past', answer: 'had', accepted: ['had'],
      distractors: ['haved', 'has'], clue: 'On Friday signals Past Simple: had.',
    },
  },
  {
    base: 'Hear', past: 'Heard', part: 'Heard', cat: 'sentir / escoltar',
    acceptedPast: ['heard'], acceptedPart: ['heard'],
    distractors: ['Heared / Heard', 'Heard / Hearden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Did you hear that? I ___ an owl outside!',
      target: 'past', answer: 'heard', accepted: ['heard'],
      distractors: ['heared', 'hear'], clue: 'Hear adds -d (not -ed) and shifts sound to heard.',
    },
  },
  {
    base: 'Hide', past: 'Hid', part: 'Hidden', cat: 'amagar',
    acceptedPast: ['hid'], acceptedPart: ['hidden'],
    distractors: ['Hided / Hidden', 'Hid / Hid'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'The pirate treasure was ___ inside a hollow tree.',
      target: 'part', answer: 'hidden', accepted: ['hidden'],
      distractors: ['hid', 'hided'], clue: 'Was + Past Participle requires hidden.',
    },
  },
  {
    base: 'Hit', past: 'Hit', part: 'Hit', cat: 'colpejar',
    acceptedPast: ['hit'], acceptedPart: ['hit'],
    distractors: ['Hitted / Hit', 'Hit / Hitten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'Clara swung the bat and ___ a home run.',
      target: 'past', answer: 'hit', accepted: ['hit'],
      distractors: ['hitted', 'hitten'], clue: 'Hit never changes: hit / hit / hit.',
    },
  },
  {
    base: 'Hold', past: 'Held', part: 'Held', cat: 'aguantar / sostenir',
    acceptedPast: ['held'], acceptedPart: ['held'],
    distractors: ['Holded / Held', 'Held / Holden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'She ___ the compass carefully while reading the map.',
      target: 'past', answer: 'held', accepted: ['held'],
      distractors: ['holded', 'holden'], clue: 'Hold changes vowel o to e: held.',
    },
  },
  {
    base: 'Hurt', past: 'Hurt', part: 'Hurt', cat: 'fer mal / ferir',
    acceptedPast: ['hurt'], acceptedPart: ['hurt'],
    distractors: ['Hurted / Hurt', 'Hurt / Hurten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'Tom ___ his ankle during basketball practice.',
      target: 'past', answer: 'hurt', accepted: ['hurt'],
      distractors: ['hurted', 'hurten'], clue: 'Hurt keeps the exact same form: hurt.',
    },
  },
  {
    base: 'Keep', past: 'Kept', part: 'Kept', cat: 'guardar / mantenir',
    acceptedPast: ['kept'], acceptedPart: ['kept'],
    distractors: ['Keeped / Kept', 'Kept / Kepten'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Grandma ___ all my childhood drawings in a blue box.',
      target: 'past', answer: 'kept', accepted: ['kept'],
      distractors: ['keeped', 'kepten'], clue: 'Keep shortens ee and adds -t: kept.',
    },
  },
  {
    base: 'Know', past: 'Knew', part: 'Known', cat: 'saber / conèixer',
    acceptedPast: ['knew'], acceptedPart: ['known'],
    distractors: ['Knowed / Known', 'Knew / Knew'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'I have ___ my best friend since first grade.',
      target: 'part', answer: 'known', accepted: ['known'],
      distractors: ['knew', 'knowed'], clue: 'Have + Past Participle uses known.',
    },
  },
  {
    base: 'Lead', past: 'Led', part: 'Led', cat: 'liderar / guiar',
    acceptedPast: ['led'], acceptedPart: ['led'],
    distractors: ['Leaded / Led', 'Led / Leaden'], difficulty: 3, pattern: 'ABB',
    sentence: {
      text: 'The trail guide ___ our group safely back to camp.',
      target: 'past', answer: 'led', accepted: ['led'],
      distractors: ['leaded', 'lead'], clue: 'Past Simple of lead is spelled led.',
    },
  },
  {
    base: 'Learn', past: 'Learnt', part: 'Learnt', cat: 'aprendre',
    acceptedPast: ['learnt', 'learned'], acceptedPart: ['learnt', 'learned'],
    distractors: ['Learnd / Learnt', 'Learnt / Learnen'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Today we ___ how volcanoes erupt in geography.',
      target: 'past', answer: 'learnt', accepted: ['learnt', 'learned'],
      distractors: ['learnd', 'learnen'], clue: 'Past Simple of learn is learnt (or learned).',
    },
  },
  {
    base: 'Leave', past: 'Left', part: 'Left', cat: 'marxar / deixar',
    acceptedPast: ['left'], acceptedPart: ['left'],
    distractors: ['Leaved / Left', 'Left / Leaven'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'The train ___ the station five minutes early.',
      target: 'past', answer: 'left', accepted: ['left'],
      distractors: ['leaved', 'leave'], clue: 'Past Simple of leave is left.',
    },
  },
  {
    base: 'Lend', past: 'Lent', part: 'Lent', cat: 'deixar (prestat)',
    acceptedPast: ['lent'], acceptedPart: ['lent'],
    distractors: ['Lended / Lent', 'Lent / Lenden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Jordi kindly ___ me his spare calculator.',
      target: 'past', answer: 'lent', accepted: ['lent'],
      distractors: ['lended', 'lenden'], clue: 'Lend changes -d to -t: lent.',
    },
  },
  {
    base: 'Let', past: 'Let', part: 'Let', cat: 'permetre / deixar',
    acceptedPast: ['let'], acceptedPart: ['let'],
    distractors: ['Letted / Let', 'Let / Letten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'My parents ___ me stay up late on New Year’s Eve.',
      target: 'past', answer: 'let', accepted: ['let'],
      distractors: ['letted', 'letten'], clue: 'Let stays identical in all three forms.',
    },
  },
  {
    base: 'Lose', past: 'Lost', part: 'Lost', cat: 'perdre',
    acceptedPast: ['lost'], acceptedPart: ['lost'],
    distractors: ['Losed / Lost', 'Lost / Losten'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Wait, I think I have ___ my bus pass!',
      target: 'part', answer: 'lost', accepted: ['lost'],
      distractors: ['losed', 'losten'], clue: 'Lose becomes lost in Past Simple and Participle.',
    },
  },
  {
    base: 'Make', past: 'Made', part: 'Made', cat: 'fer / fabricar',
    acceptedPast: ['made'], acceptedPart: ['made'],
    distractors: ['Maked / Made', 'Made / Maden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'We ___ homemade pizza for dinner on Saturday.',
      target: 'past', answer: 'made', accepted: ['made'],
      distractors: ['maked', 'maden'], clue: 'Past Simple of make is made.',
    },
  },
  {
    base: 'Mean', past: 'Meant', part: 'Meant', cat: 'significar / voler dir',
    acceptedPast: ['meant'], acceptedPart: ['meant'],
    distractors: ['Meaned / Meant', 'Meant / Meanten'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'I did not realize what that Catalan word ___!',
      target: 'past', answer: 'meant', accepted: ['meant'],
      distractors: ['meaned', 'mean'], clue: 'Mean adds -t and shifts pronunciation: meant.',
    },
  },
  {
    base: 'Meet', past: 'Met', part: 'Met', cat: 'trobar-se / conèixer',
    acceptedPast: ['met'], acceptedPart: ['met'],
    distractors: ['Meeted / Met', 'Met / Metten'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Have you ___ the new exchange student from Dublin?',
      target: 'part', answer: 'met', accepted: ['met'],
      distractors: ['meeted', 'meet'], clue: 'Meet shortens ee to e: met.',
    },
  },
  {
    base: 'Pay', past: 'Paid', part: 'Paid', cat: 'pagar',
    acceptedPast: ['paid'], acceptedPart: ['paid'],
    distractors: ['Payed / Paid', 'Paid / Paiden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Sam ___ for the comic books with his allowance.',
      target: 'past', answer: 'paid', accepted: ['paid'],
      distractors: ['payed', 'paiden'], clue: 'Pay becomes paid (not payed).',
    },
  },
  {
    base: 'Put', past: 'Put', part: 'Put', cat: 'posar',
    acceptedPast: ['put'], acceptedPart: ['put'],
    distractors: ['Putted / Put', 'Put / Putten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'Before leaving, she ___ the telescope back in its case.',
      target: 'past', answer: 'put', accepted: ['put'],
      distractors: ['putted', 'putten'], clue: 'Put never changes: put / put / put.',
    },
  },
  {
    base: 'Read', past: 'Read', part: 'Read', cat: 'llegir',
    acceptedPast: ['read'], acceptedPart: ['read'],
    distractors: ['Readed / Read', 'Red / Redden'], difficulty: 1, pattern: 'AAA',
    sentence: {
      text: 'I ___ three chapters of that space adventure last night.',
      target: 'past', answer: 'read', accepted: ['read'],
      distractors: ['red', 'readed'], clue: 'Spelled read like the base form, pronounced like red!',
    },
  },
  {
    base: 'Ride', past: 'Rode', part: 'Ridden', cat: 'muntar (en bici, cavall)',
    acceptedPast: ['rode'], acceptedPart: ['ridden'],
    distractors: ['Rided / Ridden', 'Rode / Rode'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'Marc has never ___ a horse before.',
      target: 'part', answer: 'ridden', accepted: ['ridden'],
      distractors: ['rode', 'rided'], clue: 'Has never + Past Participle uses ridden.',
    },
  },
  {
    base: 'Ring', past: 'Rang', part: 'Rung', cat: 'sonar / trucar',
    acceptedPast: ['rang'], acceptedPart: ['rung'],
    distractors: ['Ringed / Rung', 'Rang / Rang'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'The school bell ___ right as I walked through the door.',
      target: 'past', answer: 'rang', accepted: ['rang'],
      distractors: ['rung', 'ringed'], clue: 'Past Simple is rang (Participle is rung).',
    },
  },
  {
    base: 'Rise', past: 'Rose', part: 'Risen', cat: 'aixecar-se / pujar',
    acceptedPast: ['rose'], acceptedPart: ['risen'],
    distractors: ['Rised / Risen', 'Rose / Rose'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'The sun ___ over the Mediterranean at six o’clock.',
      target: 'past', answer: 'rose', accepted: ['rose'],
      distractors: ['risen', 'rised'], clue: 'Past Simple of rise is rose.',
    },
  },
  {
    base: 'Run', past: 'Ran', part: 'Run', cat: 'córrer',
    acceptedPast: ['ran'], acceptedPart: ['run'],
    distractors: ['Runned / Run', 'Ran / Ran'], difficulty: 1, pattern: 'ABA',
    sentence: {
      text: 'We ___ two laps around the track in PE class.',
      target: 'past', answer: 'ran', accepted: ['ran'],
      distractors: ['runned', 'run'], clue: 'Past Simple is ran; Participle returns to run.',
    },
  },
  {
    base: 'Say', past: 'Said', part: 'Said', cat: 'dir',
    acceptedPast: ['said'], acceptedPart: ['said'],
    distractors: ['Sayed / Said', 'Said / Saiden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'The captain ___ that the launch looked perfect.',
      target: 'past', answer: 'said', accepted: ['said'],
      distractors: ['sayed', 'saiden'], clue: 'Past Simple of say is said.',
    },
  },
  {
    base: 'See', past: 'Saw', part: 'Seen', cat: 'veure',
    acceptedPast: ['saw'], acceptedPart: ['seen'],
    distractors: ['Seed / Seen', 'Saw / Saw'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Have you ___ the comet through the telescope yet?',
      target: 'part', answer: 'seen', accepted: ['seen'],
      distractors: ['saw', 'seed'], clue: 'Have + Past Participle uses seen.',
    },
  },
  {
    base: 'Sell', past: 'Sold', part: 'Sold', cat: 'vendre',
    acceptedPast: ['sold'], acceptedPart: ['sold'],
    distractors: ['Selled / Sold', 'Sold / Solden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Our class ___ all the bookmarks at the charity stall.',
      target: 'past', answer: 'sold', accepted: ['sold'],
      distractors: ['selled', 'solden'], clue: 'Like tell -> told, sell becomes sold.',
    },
  },
  {
    base: 'Send', past: 'Sent', part: 'Sent', cat: 'enviar',
    acceptedPast: ['sent'], acceptedPart: ['sent'],
    distractors: ['Sended / Sent', 'Sent / Senten'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'I ___ a postcard to my pen pal in Edinburgh.',
      target: 'past', answer: 'sent', accepted: ['sent'],
      distractors: ['sended', 'senten'], clue: 'Send changes -d to -t: sent.',
    },
  },
  {
    base: 'Set', past: 'Set', part: 'Set', cat: 'fixar / establir',
    acceptedPast: ['set'], acceptedPart: ['set'],
    distractors: ['Setted / Set', 'Set / Setten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'Yesterday evening I ___ my alarm for seven AM.',
      target: 'past', answer: 'set', accepted: ['set'],
      distractors: ['setted', 'setten'], clue: 'Set stays identical: set / set / set.',
    },
  },
  {
    base: 'Shake', past: 'Shook', part: 'Shaken', cat: 'sacsejar',
    acceptedPast: ['shook'], acceptedPart: ['shaken'],
    distractors: ['Shaked / Shaken', 'Shook / Shook'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'The players ___ hands politely after the final match.',
      target: 'past', answer: 'shook', accepted: ['shook'],
      distractors: ['shaken', 'shaked'], clue: 'Like take -> took, shake -> shook.',
    },
  },
  {
    base: 'Shine', past: 'Shone', part: 'Shone', cat: 'brillar',
    acceptedPast: ['shone'], acceptedPart: ['shone'],
    distractors: ['Shined / Shone', 'Shone / Shonen'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'The full moon ___ brightly across the calm sea.',
      target: 'past', answer: 'shone', accepted: ['shone'],
      distractors: ['shonen', 'shine'], clue: 'Past Simple of shine is shone.',
    },
  },
  {
    base: 'Shoot', past: 'Shot', part: 'Shot', cat: 'disparar',
    acceptedPast: ['shot'], acceptedPart: ['shot'],
    distractors: ['Shooted / Shot', 'Shot / Shotten'], difficulty: 3, pattern: 'ABB',
    sentence: {
      text: 'The photographer ___ fifty photos of the eclipse.',
      target: 'past', answer: 'shot', accepted: ['shot'],
      distractors: ['shooted', 'shotten'], clue: 'Shoot drops an o: shot.',
    },
  },
  {
    base: 'Show', past: 'Showed', part: 'Shown', cat: 'mostrar',
    acceptedPast: ['showed'], acceptedPart: ['shown', 'showed'],
    distractors: ['Shown / Showed', 'Showed / Showed'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'Our teacher has ___ us how to use the star chart.',
      target: 'part', answer: 'shown', accepted: ['shown', 'showed'],
      distractors: ['show', 'showing'], clue: 'Has + Past Participle uses shown.',
    },
  },
  {
    base: 'Shut', past: 'Shut', part: 'Shut', cat: 'tancar',
    acceptedPast: ['shut'], acceptedPart: ['shut'],
    distractors: ['Shutted / Shut', 'Shut / Shutten'], difficulty: 2, pattern: 'AAA',
    sentence: {
      text: 'Please check if you ___ the window before the storm.',
      target: 'past', answer: 'shut', accepted: ['shut'],
      distractors: ['shutted', 'shutten'], clue: 'Shut keeps the same form: shut / shut / shut.',
    },
  },
  {
    base: 'Sing', past: 'Sang', part: 'Sung', cat: 'cantar',
    acceptedPast: ['sang'], acceptedPart: ['sung'],
    distractors: ['Singed / Sung', 'Sang / Sang'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'The whole choir ___ together at the winter concert.',
      target: 'past', answer: 'sang', accepted: ['sang'],
      distractors: ['sung', 'singed'], clue: 'Past Simple is sang (Participle is sung).',
    },
  },
  {
    base: 'Sink', past: 'Sank', part: 'Sunk', cat: 'enfonsar(-se)',
    acceptedPast: ['sank'], acceptedPart: ['sunk'],
    distractors: ['Sinked / Sunk', 'Sank / Sank'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'The heavy anchor ___ straight to the ocean floor.',
      target: 'past', answer: 'sank', accepted: ['sank'],
      distractors: ['sunk', 'sinked'], clue: 'Like sing -> sang, sink -> sank.',
    },
  },
  {
    base: 'Sit', past: 'Sat', part: 'Sat', cat: 'seure',
    acceptedPast: ['sat'], acceptedPart: ['sat'],
    distractors: ['Sitted / Sat', 'Sat / Satten'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'We ___ in the front row at the planetarium.',
      target: 'past', answer: 'sat', accepted: ['sat'],
      distractors: ['sitted', 'satten'], clue: 'Past Simple of sit is sat.',
    },
  },
  {
    base: 'Sleep', past: 'Slept', part: 'Slept', cat: 'dormir',
    acceptedPast: ['slept'], acceptedPart: ['slept'],
    distractors: ['Sleeped / Slept', 'Slept / Slepen'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'After the hike, I ___ for ten solid hours.',
      target: 'past', answer: 'slept', accepted: ['slept'],
      distractors: ['sleeped', 'slepen'], clue: 'Sleep shortens ee and adds -t: slept.',
    },
  },
  {
    base: 'Speak', past: 'Spoke', part: 'Spoken', cat: 'parlar',
    acceptedPast: ['spoke'], acceptedPart: ['spoken'],
    distractors: ['Speaked / Spoken', 'Spoke / Spoke'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'English is ___ in dozens of countries around the world.',
      target: 'part', answer: 'spoken', accepted: ['spoken'],
      distractors: ['spoke', 'speaked'], clue: 'Passive voice (is...) requires Past Participle spoken.',
    },
  },
  {
    base: 'Spend', past: 'Spent', part: 'Spent', cat: 'gastar / passar temps',
    acceptedPast: ['spent'], acceptedPart: ['spent'],
    distractors: ['Spended / Spent', 'Spent / Spenden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'We ___ the afternoon building a cardboard telescope.',
      target: 'past', answer: 'spent', accepted: ['spent'],
      distractors: ['spended', 'spenden'], clue: 'Spend changes -d to -t: spent.',
    },
  },
  {
    base: 'Stand', past: 'Stood', part: 'Stood', cat: 'estar dret',
    acceptedPast: ['stood'], acceptedPart: ['stood'],
    distractors: ['Standed / Stood', 'Stood / Stooden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Everyone ___ up to clap at the end of the play.',
      target: 'past', answer: 'stood', accepted: ['stood'],
      distractors: ['standed', 'stooden'], clue: 'Past Simple of stand is stood.',
    },
  },
  {
    base: 'Steal', past: 'Stole', part: 'Stolen', cat: 'robar',
    acceptedPast: ['stole'], acceptedPart: ['stolen'],
    distractors: ['Stealed / Stolen', 'Stole / Stole'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'In the mystery story, someone has ___ the golden clock.',
      target: 'part', answer: 'stolen', accepted: ['stolen'],
      distractors: ['stole', 'stealed'], clue: 'Has + Past Participle uses stolen.',
    },
  },
  {
    base: 'Swim', past: 'Swam', part: 'Swum', cat: 'nedar',
    acceptedPast: ['swam'], acceptedPart: ['swum'],
    distractors: ['Swimmed / Swum', 'Swam / Swam'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Laura ___ across the pool faster than ever yesterday.',
      target: 'past', answer: 'swam', accepted: ['swam'],
      distractors: ['swum', 'swimmed'], clue: 'Yesterday takes Past Simple swam.',
    },
  },
  {
    base: 'Take', past: 'Took', part: 'Taken', cat: 'agafar / prendre',
    acceptedPast: ['took'], acceptedPart: ['taken'],
    distractors: ['Taked / Taken', 'Took / Took'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Has anyone ___ my green highlighter by mistake?',
      target: 'part', answer: 'taken', accepted: ['taken'],
      distractors: ['took', 'taked'], clue: 'Has + Past Participle takes taken.',
    },
  },
  {
    base: 'Teach', past: 'Taught', part: 'Taught', cat: 'ensenyar',
    acceptedPast: ['taught'], acceptedPart: ['taught'],
    distractors: ['Teached / Taught', 'Taught / Taughten'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Ms. Vidal ___ us how to pronounce tricky verbs.',
      target: 'past', answer: 'taught', accepted: ['taught'],
      distractors: ['teached', 'thought'], clue: 'Teach -> taught (with -aught).',
    },
  },
  {
    base: 'Tear', past: 'Tore', part: 'Torn', cat: 'estripar / trencar',
    acceptedPast: ['tore'], acceptedPart: ['torn'],
    distractors: ['Teared / Torn', 'Tore / Tore'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'Oh no, a page in this old atlas is ___!',
      target: 'part', answer: 'torn', accepted: ['torn'],
      distractors: ['tore', 'teared'], clue: 'Is + Past Participle uses torn.',
    },
  },
  {
    base: 'Tell', past: 'Told', part: 'Told', cat: 'dir / explicar',
    acceptedPast: ['told'], acceptedPart: ['told'],
    distractors: ['Telled / Told', 'Told / Tolden'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Grandpa ___ us an unforgettable story by the campfire.',
      target: 'past', answer: 'told', accepted: ['told'],
      distractors: ['telled', 'tolden'], clue: 'Past Simple of tell is told.',
    },
  },
  {
    base: 'Think', past: 'Thought', part: 'Thought', cat: 'pensar',
    acceptedPast: ['thought'], acceptedPart: ['thought'],
    distractors: ['Thinked / Thought', 'Thunk / Thought'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'I ___ the puzzle was tricky, but we solved it!',
      target: 'past', answer: 'thought', accepted: ['thought'],
      distractors: ['thinked', 'thunk'], clue: 'Think -> thought (with -ought).',
    },
  },
  {
    base: 'Throw', past: 'Threw', part: 'Thrown', cat: 'llançar',
    acceptedPast: ['threw'], acceptedPart: ['thrown'],
    distractors: ['Throwed / Thrown', 'Threw / Threw'], difficulty: 3, pattern: 'ABC',
    sentence: {
      text: 'The pitcher ___ the ball straight into the mitt.',
      target: 'past', answer: 'threw', accepted: ['threw'],
      distractors: ['thrown', 'throwed'], clue: 'Like grow -> grew, throw -> threw.',
    },
  },
  {
    base: 'Understand', past: 'Understood', part: 'Understood', cat: 'entendre',
    acceptedPast: ['understood'], acceptedPart: ['understood'],
    distractors: ['Understanded / Understood', 'Understood / Understooden'], difficulty: 2, pattern: 'ABB',
    sentence: {
      text: 'Once we saw the diagram, everyone ___ the rule.',
      target: 'past', answer: 'understood', accepted: ['understood'],
      distractors: ['understanded', 'understonden'], clue: 'Like stand -> stood, understand -> understood.',
    },
  },
  {
    base: 'Wake', past: 'Woke', part: 'Woken', cat: 'despertar(-se)',
    acceptedPast: ['woke'], acceptedPart: ['woken'],
    distractors: ['Waked / Woken', 'Woke / Woke'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'The thunder ___ us up at five in the morning.',
      target: 'past', answer: 'woke', accepted: ['woke'],
      distractors: ['woken', 'waked'], clue: 'Past Simple of wake is woke.',
    },
  },
  {
    base: 'Wear', past: 'Wore', part: 'Worn', cat: 'portar posat / vestir',
    acceptedPast: ['wore'], acceptedPart: ['worn'],
    distractors: ['Weared / Worn', 'Wore / Wore'], difficulty: 2, pattern: 'ABC',
    sentence: {
      text: 'Each explorer ___ a reflective vest for the night walk.',
      target: 'past', answer: 'wore', accepted: ['wore'],
      distractors: ['worn', 'weared'], clue: 'Past Simple of wear is wore.',
    },
  },
  {
    base: 'Win', past: 'Won', part: 'Won', cat: 'guanyar',
    acceptedPast: ['won'], acceptedPart: ['won'],
    distractors: ['Winned / Won', 'Won / Wonen'], difficulty: 1, pattern: 'ABB',
    sentence: {
      text: 'Our robotics club has ___ first prize!',
      target: 'part', answer: 'won', accepted: ['won'],
      distractors: ['winned', 'wonen'], clue: 'Win -> won in Past Simple and Participle.',
    },
  },
  {
    base: 'Write', past: 'Wrote', part: 'Written', cat: 'escriure',
    acceptedPast: ['wrote'], acceptedPart: ['written'],
    distractors: ['Writed / Written', 'Wrote / Wrote'], difficulty: 1, pattern: 'ABC',
    sentence: {
      text: 'Have you ___ your explorer journal entry yet?',
      target: 'part', answer: 'written', accepted: ['written'],
      distractors: ['wrote', 'writed'], clue: 'Have + Past Participle uses written (double t!).',
    },
  },
];

import type { GameAnswer, GameQuestion, QuestionSource } from '../types'

const verifiedAt = '2026-08-26'
type AnswerSeed = [id: string, text: string, points: number, aliases?: string[]]
type SourceSeed = [label: string, url: string, note: string]

const multiChoice = 'Body sú zverejnené percentá; respondenti mohli vybrať viac možností.'
const singleChoice = 'Body sú zverejnené percentá respondentov pre jednotlivé možnosti.'

function answers(items: AnswerSeed[]): GameAnswer[] {
  return items.map(([id, text, points, aliases = []]) => ({ id, text, points, aliases }))
}

function question(
  id: string,
  prompt: string,
  category: string,
  items: AnswerSeed[],
  sourceSeed: SourceSeed,
  scoringNote = multiChoice,
): GameQuestion {
  const [label, url, note] = sourceSeed
  const source: QuestionSource = { label, url, note, verifiedAt }
  return {
    id,
    prompt,
    category,
    kind: 'survey',
    status: 'surveyed',
    familyFriendly: true,
    scoringNote,
    answers: answers(items),
    source,
  }
}

const genZBreakfast: SourceSeed = [
  'YouGov Profiles – Gen Z breakfast habits 2025',
  'https://yougov.com/en-us/articles/51614-gen-zs-breakfast-habits-how-the-youngest-generation-approaches-the-first-meal-of-the-day',
  'Údaje YouGov Profiles medzi dospelými generácie Z v USA, publikované vo februári 2025.',
]
const breakfastPoll: SourceSeed = [
  'YouGov – American breakfast preferences 2019',
  'https://yougov.com/en-us/articles/25615-how-americans-eggs-coffee-toast-bacon-breakfast',
  'Online prieskum 1 295 dospelých v USA, september 2019; reprezentatívne vážené výsledky.',
]
const mealsPoll: SourceSeed = [
  'YouGov – Meals and Eating 2025',
  'https://d3nkl3psvxxpe9.cloudfront.net/documents/Meals_and_Eating_poll_results.pdf',
  'Reprezentatívny online prieskum 1 106 dospelých občanov USA, január 2025; chyba výberu približne ±4 body.',
]
const cinemaPoll: SourceSeed = [
  'YouGov – Movie Theater Etiquette 2024',
  'https://ygo-assets-websites-editorial-emea.yougov.net/documents/Movie_Theater_Etiquette_poll_results.pdf',
  'Reprezentatívny online prieskum 1 134 dospelých občanov USA, november 2024; chyba výberu približne ±4,2 bodu.',
]
const travelMotivation: SourceSeed = [
  'YouGov – International travel motivations 2021',
  'https://yougov.com/en-us/articles/38931-us-fall-international-travelers-poll',
  'Údaje YouGov Profiles medzi dospelými v USA, publikované v októbri 2021.',
]
const onlineShopping: SourceSeed = [
  'YouGov – Verifying online retailers 2026',
  'https://yougov.com/en-us/articles/53837-how-do-american-consumers-verify-online-retailers-before-purchasing',
  'Reprezentatívny prieskum dospelých v USA o overovaní internetových obchodov, publikovaný v roku 2026.',
]

export const additionalQuestions: GameQuestion[] = [
  question('gen-z-breakfast-foods', 'Čo si mladí dospelí najčastejšie dávajú na raňajky?', 'Jedlo', [
    ['eggs', 'Vajcia', 46],
    ['fruit', 'Ovocie', 33],
    ['toast', 'Hrianku alebo toast', 30, ['toast', 'hrianka']],
    ['pancakes', 'Palacinky alebo lievance', 28, ['palacinky', 'lievance']],
    ['cereal', 'Studené cereálie', 26, ['cereálie', 'musli']],
    ['yogurt', 'Jogurt', 25],
    ['cheese', 'Syr', 21],
    ['waffles', 'Vafle', 21],
  ], genZBreakfast),

  question('egg-preparation', 'Ako si ľudia najčastejšie pripravujú vajcia?', 'Jedlo', [
    ['scrambled', 'Miešané', 36, ['praženica', 'miešané vajcia']],
    ['over-easy', 'Volské oko otočené, so žĺtkom na mäkko', 18, ['over easy', 'otočené volské oko']],
    ['sunny-side', 'Volské oko neotočené', 12, ['volské oko', 'sunny side up']],
    ['over-medium', 'Otočené, so žĺtkom polotuhým', 11, ['over medium']],
    ['hard-boiled', 'Uvarené natvrdo', 6, ['natvrdo', 'varené vajce']],
  ], breakfastPoll, singleChoice),

  question('coffee-preparation', 'Ako ľudia najčastejšie pijú kávu?', 'Jedlo', [
    ['milk-light', 'S mliekom, svetlohnedú', 39, ['s mliekom', 'mliečna káva']],
    ['black', 'Čiernu', 21, ['bez mlieka']],
    ['no-coffee', 'Kávu nepijú', 19, ['nepijú kávu']],
    ['lots-milk', 'S veľkým množstvom mlieka', 11, ['veľa mlieka']],
    ['little-milk', 'S trochou mlieka', 10, ['trochu mlieka']],
  ], breakfastPoll, singleChoice),

  question('favorite-sandwiches', 'Ktoré druhy sendvičov majú ľudia najradšej?', 'Jedlo', [
    ['grilled-cheese', 'Grilovaný syrový sendvič', 79, ['syrový sendvič', 'toast so syrom']],
    ['turkey', 'Morčací sendvič', 75, ['morčacie mäso']],
    ['grilled-chicken', 'Sendvič s grilovaným kuraťom', 75, ['grilované kura', 'kurací sendvič']],
    ['blt', 'BLT – slanina, šalát a paradajka', 69, ['BLT', 'slanina šalát paradajka']],
    ['ham', 'Šunkový sendvič', 69, ['šunka']],
  ], [
    'YouGov – America’s favorite sandwiches 2019',
    'https://yougov.com/en-us/articles/24609-whats-americas-favorite-sandwich',
    'Reprezentatívne vážený online prieskum 1 223 dospelých v USA, júl 2019.',
  ]),

  question('produce-purchase-factors', 'Čo ľudia najviac sledujú pri nákupe ovocia a zeleniny?', 'Nakupovanie', [
    ['freshness', 'Čerstvosť', 78],
    ['price', 'Cenu', 70, ['cena']],
    ['taste', 'Chuť', 64],
    ['origin', 'Krajinu pôvodu', 18, ['pôvod']],
    ['organic', 'Či je produkt bio', 15, ['bio', 'organické']],
    ['environment', 'Vplyv na životné prostredie', 13, ['ekológia', 'environmentálny vplyv']],
  ], [
    'YouGov – Produce shopping 2024',
    'https://yougov.com/en-us/articles/48491-navigating-the-produce-aisle-freshness-reigns-but-will-americans-pay-for-year-round-availability',
    'Reprezentatívny online prieskum 1 126 dospelých v USA, január 2024.',
  ]),

  question('breakfast-activities', 'Čo ľudia robia popri raňajkách?', 'Každodenný život', [
    ['tv', 'Pozerajú televíziu', 47, ['televízia', 'seriál']],
    ['phone', 'Používajú telefón', 34, ['mobil']],
    ['talk', 'Rozprávajú sa s prítomnými', 26, ['rozhovor', 'rozprávajú sa']],
    ['music', 'Počúvajú hudbu alebo podcast', 17, ['hudba', 'podcast']],
    ['read', 'Čítajú', 10, ['kniha', 'noviny']],
    ['work', 'Pracujú alebo študujú', 6, ['práca', 'štúdium']],
    ['call', 'Telefonujú', 5, ['telefonát']],
    ['games', 'Hrajú videohry', 5, ['videohry', 'hry']],
  ], mealsPoll),

  question('lunch-activities', 'Čo ľudia robia popri obede?', 'Každodenný život', [
    ['tv', 'Pozerajú televíziu', 46, ['televízia', 'seriál']],
    ['phone', 'Používajú telefón', 35, ['mobil']],
    ['talk', 'Rozprávajú sa s prítomnými', 33, ['rozhovor', 'rozprávajú sa']],
    ['music', 'Počúvajú hudbu alebo podcast', 18, ['hudba', 'podcast']],
    ['work', 'Pracujú alebo študujú', 11, ['práca', 'štúdium']],
    ['read', 'Čítajú', 10, ['kniha', 'noviny']],
    ['call', 'Telefonujú', 7, ['telefonát']],
    ['games', 'Hrajú videohry', 5, ['videohry', 'hry']],
  ], mealsPoll),

  question('dinner-activities', 'Čo ľudia robia popri večeri?', 'Každodenný život', [
    ['tv', 'Pozerajú televíziu', 63, ['televízia', 'seriál']],
    ['talk', 'Rozprávajú sa s prítomnými', 41, ['rozhovor', 'rozprávajú sa']],
    ['phone', 'Používajú telefón', 28, ['mobil']],
    ['music', 'Počúvajú hudbu alebo podcast', 16, ['hudba', 'podcast']],
    ['read', 'Čítajú', 8, ['kniha', 'noviny']],
    ['call', 'Telefonujú', 6, ['telefonát']],
    ['games', 'Hrajú videohry', 6, ['videohry', 'hry']],
    ['work', 'Pracujú alebo študujú', 4, ['práca', 'štúdium']],
  ], mealsPoll),

  question('dinner-location', 'Kde ľudia najčastejšie večerajú doma?', 'Každodenný život', [
    ['table', 'Pri jedálenskom stole', 51, ['stôl', 'jedáleň']],
    ['couch', 'Na gauči alebo v kresle', 25, ['gauč', 'kreslo']],
    ['counter', 'Pri kuchynskom pulte', 7, ['kuchynský pult', 'barový pult']],
    ['bed', 'V posteli', 7, ['posteľ']],
    ['desk', 'Pri pracovnom stole', 5, ['písací stôl', 'za počítačom']],
    ['other', 'Na inom mieste', 5, ['inde']],
  ], mealsPoll, singleChoice),

  question('meal-prep-dislikes', 'Ktorú časť prípravy domáceho jedla ľudia najviac neznášajú?', 'Každodenný život', [
    ['cleanup', 'Upratovanie po jedle', 21, ['upratovanie', 'umývanie riadu']],
    ['planning', 'Plánovanie jedla', 7, ['vymýšľanie jedla']],
    ['shopping', 'Nakupovanie surovín', 7, ['nákup']],
    ['ingredients', 'Prípravu surovín', 4, ['krájanie', 'chystanie surovín']],
    ['cooking', 'Samotné varenie', 4, ['varenie']],
  ], mealsPoll, singleChoice),

  question('popular-fruits', 'Ktoré ovocie patrí medzi najobľúbenejšie?', 'Jedlo', [
    ['bananas', 'Banány', 85, ['banán']],
    ['strawberries', 'Jahody', 85, ['jahoda']],
    ['watermelon', 'Červený melón', 84, ['melón']],
    ['green-grapes', 'Zelené hrozno', 81, ['hrozno']],
    ['red-grapes', 'Červené hrozno', 81, ['hrozno']],
    ['lemons', 'Citróny', 80, ['citrón']],
    ['pineapples', 'Ananás', 80],
    ['tangerines', 'Mandarínky', 80, ['mandarínka']],
  ], [
    'YouGov Ratings – Popular fruits Q2 2026',
    'https://yougov.com/en-us/ratings/fruits',
    'Rebríček YouGov Ratings za 2. štvrťrok 2026, priebežne vytváraný z miliónov odpovedí v USA.',
  ]),

  question('favorite-season', 'Ktoré ročné obdobie majú ľudia najradšej?', 'Životný štýl', [
    ['spring', 'Jar', 27],
    ['summer', 'Leto', 26],
    ['fall', 'Jeseň', 25],
    ['winter', 'Zima', 8],
  ], [
    'YouGov – Favorite season survey',
    'https://yougov.com/en-us/articles/9092-americans-spring-their-favorite-season',
    'Reprezentatívne vážený prieskum dospelých v USA o obľúbenom ročnom období.',
  ], singleChoice),

  question('cinema-experiences', 'Čo už ľudia zažili pri návšteve kina?', 'Film a seriály', [
    ['drive-in', 'Boli v autokine', 67, ['autokino']],
    ['imax', 'Videli film v 3D alebo IMAX', 67, ['3D', 'IMAX']],
    ['snack', 'Priniesli si vlastné jedlo alebo nápoj', 63, ['vlastné občerstvenie', 'vlastné jedlo']],
    ['alone', 'Išli do kina sami', 43, ['kino osamote', 'sami']],
    ['walked-out', 'Odišli pred koncom filmu', 40, ['odišli z filmu']],
    ['slept', 'Zaspali počas filmu', 39, ['zaspali']],
    ['meal-cinema', 'Boli v kine, kde podávajú celé jedlá', 35, ['jedlo v kine']],
    ['multiple', 'Videli viac filmov v kine za jeden deň', 31, ['viac filmov']],
  ], cinemaPoll),

  question('cinema-bad-behavior-reaction', 'Ako ľudia najčastejšie reagujú na rušivé správanie v kine?', 'Film a seriály', [
    ['employee', 'Požiadajú o pomoc zamestnanca', 43, ['zavolajú personál', 'zamestnanec']],
    ['nothing', 'Neurobia nič', 18, ['ignorujú to']],
    ['quiet-request', 'Potichu človeka požiadajú, aby prestal', 16, ['upozornia ho', 'poprosia ho']],
    ['glare', 'Významne sa naňho pozrú', 7, ['škaredý pohľad', 'otočia sa']],
    ['other', 'Urobia niečo iné', 3, ['iná reakcia']],
    ['loud-request', 'Nahlas ho požiadajú, aby prestal', 2, ['nahlas upozornia']],
  ], cinemaPoll, singleChoice),

  question('cinema-snacks', 'Ktoré občerstvenie si ľudia vyberajú v kine?', 'Film a seriály', [
    ['popcorn', 'Pukance', 74, ['popcorn']],
    ['mms', 'Čokoládové dražé M&M’s', 32, ['M&M', 'čokoládové dražé']],
    ['reeses', 'Arašidové dražé Reese’s Pieces', 23, ['Reese’s', 'arašidové dražé']],
    ['nachos', 'Nachos', 22, ['tortilla čipsy']],
    ['raisins', 'Hrozienka v čokoláde', 21, ['čokoládové hrozienka']],
    ['hot-dog', 'Hotdog', 20, ['párok v rožku']],
    ['pizza', 'Pizza', 20],
    ['liquorice', 'Sladké pelendreky', 19, ['pelendreky', 'Twizzlers']],
  ], cinemaPoll),

  question('games-of-skill', 'Ktoré hry ľudia najčastejšie považujú za hry založené na zručnosti?', 'Hry', [
    ['chess', 'Šach', 82],
    ['checkers', 'Dáma', 77],
    ['scrabble', 'Scrabble', 76],
    ['poker', 'Poker', 54],
    ['connect-four', 'Štyri v rade', 49, ['Connect Four']],
    ['clue', 'Cluedo', 46, ['Clue']],
    ['backgammon', 'Backgammon', 45],
    ['battleship', 'Lode', 45, ['Battleship', 'námorná bitka']],
  ], [
    'YouGov – Games of luck or skill 2020',
    'https://yougov.com/en-us/articles/30330-games-luck-or-skill-poll',
    'Reprezentatívne vážený online prieskum 1 226 dospelých v USA, júl 2020.',
  ]),

  question('gen-z-app-downloads', 'Aké typy aplikácií si mladí dospelí najčastejšie stiahli za posledný rok?', 'Technológie', [
    ['social', 'Sociálne siete', 69, ['sociálna sieť']],
    ['music', 'Hudobné aplikácie', 58, ['hudba']],
    ['gaming', 'Herné aplikácie', 54, ['hry']],
    ['entertainment', 'Zábavné a streamovacie aplikácie', 53, ['streamovanie', 'zábava']],
    ['photo-video', 'Foto a video aplikácie', 43, ['fotky', 'video']],
  ], [
    'YouGov Profiles – App downloads 2025',
    'https://yougov.com/en-us/articles/51942-how-many-apps-do-americans-download',
    'Údaje YouGov Profiles medzi dospelými generácie Z v USA, publikované v marci 2025.',
  ]),

  question('movie-genres-more', 'Ktorých filmových žánrov by ľudia chceli vidieť viac?', 'Film a seriály', [
    ['comedy', 'Komédie', 57, ['komédia']],
    ['crime', 'Kriminálne filmy', 49, ['krimi']],
    ['historical', 'Historické drámy', 48, ['historický film']],
    ['action', 'Akčné filmy', 46, ['akčný film']],
    ['documentary', 'Dokumenty a životopisné filmy', 45, ['dokument', 'životopisný film']],
    ['scifi', 'Vedecko-fantastické filmy', 43, ['sci-fi', 'science fiction']],
  ], [
    'YouGov – Movie genres and reboots 2024',
    'https://yougov.com/en-us/articles/50213-superhero-fatigue-and-reboot-resistance-among-americans',
    'Reprezentatívne vážený online prieskum dospelých občanov USA, publikovaný v roku 2024.',
  ]),

  question('popular-music-genres', 'Ktoré hudobné žánre ľudia najčastejšie počúvajú?', 'Hudba', [
    ['rock', 'Rock', 48],
    ['pop', 'Pop', 40],
    ['country', 'Country', 33],
    ['rnb', 'R&B', 33, ['rhythm and blues']],
    ['hiphop', 'Rap alebo hip-hop', 30, ['rap', 'hip-hop']],
  ], [
    'YouGov Profiles – Popular music genres 2024',
    'https://yougov.com/en-us/articles/49136-rock-is-us-most-popular-music-genre-but-listeners-attend-gigs-less-frequently-than-other-fans',
    'Údaje YouGov Profiles medzi dospelými v USA, publikované v apríli 2024.',
  ]),

  question('live-music-genres', 'Ktoré hudobné žánre ľudia najčastejšie navštevujú naživo?', 'Hudba', [
    ['classic-rock', 'Klasický rock', 26],
    ['pop', 'Pop', 18],
    ['country', 'Country', 17],
    ['hard-rock', 'Hard rock', 15],
    ['rnb', 'R&B', 14, ['rhythm and blues']],
    ['indie', 'Alternatívna alebo indie hudba', 13, ['indie', 'alternatívna hudba']],
  ], [
    'YouGov Profiles – Live music genres 2023',
    'https://yougov.com/en-us/articles/47019-most-popular-live-music-genres-among-concert-goers-in-the-united-states',
    'Údaje YouGov Profiles medzi americkými návštevníkmi koncertov, publikované v auguste 2023.',
  ]),

  question('phone-social-situations', 'V ktorých spoločenských situáciách ľudia používajú telefón?', 'Technológie', [
    ['friend', 'Pri stretnutí s priateľom', 64, ['s kamarátom', 'priateľ']],
    ['group-meal', 'Pri spoločnom jedle', 54, ['pri stole', 'spoločné jedlo']],
    ['date', 'Na rande', 28, ['rande']],
  ], [
    'YouGov – Smartphone habits 2025',
    'https://yougov.com/en-us/articles/53735-for-many-americans-their-smartphone-is-the-last-thing-they-see-at-night-and-the-first-thing-they-see-in-the-morning',
    'Reprezentatívny prieskum dospelých v USA; podiely používajú telefón aspoň raz či dvakrát v danej situácii.',
  ]),

  question('sleep-position', 'V akej polohe ľudia najčastejšie zaspávajú?', 'Každodenný život', [
    ['side', 'Na boku', 59],
    ['stomach', 'Na bruchu', 14],
    ['back', 'Na chrbte', 12],
  ], [
    'YouGov – Sleep habits 2018',
    'https://yougov.com/en-us/articles/22649-sleep-habits-americans-survey-poll',
    'Reprezentatívne vážený prieskum dospelých v USA o spánkových návykoch, publikovaný v roku 2018.',
  ], singleChoice),

  question('better-sleep-steps', 'Čo už ľudia vyskúšali, aby sa lepšie vyspali?', 'Každodenný život', [
    ['bedtime', 'Chodiť spať v rovnakom čase', 37, ['pravidelný čas spánku', 'spánkový režim']],
    ['supplements', 'Výživové doplnky alebo lieky na spánok', 34, ['melatonín', 'doplnky']],
    ['bedding', 'Vymeniť matrac, vankúše alebo posteľnú bielizeň', 33, ['nový matrac', 'nový vankúš']],
  ], [
    'YouGov – Sleep improvement 2024',
    'https://yougov.com/en-us/articles/48919-52-of-americans-say-they-sleep-7-hours-a-night-but-many-want-even-more-time-in-bed',
    'Reprezentatívny online prieskum 1 505 dospelých občanov USA, december 2023.',
  ]),

  question('enjoyable-chores', 'Ktoré domáce práce ľudí najčastejšie bavia?', 'Každodenný život', [
    ['cooking', 'Príprava jedla', 59, ['varenie']],
    ['groceries', 'Nakupovanie potravín', 57, ['nákup']],
    ['tidying', 'Upratovanie vecí na miesto', 47, ['upratovanie']],
    ['closets', 'Organizovanie skríň a zásuviek', 40, ['organizovanie skrine']],
    ['yard', 'Práca v záhrade alebo na dvore', 39, ['záhrada']],
    ['bed', 'Ustlanie postele', 38, ['ustieľanie']],
    ['counters', 'Utieranie kuchynských povrchov', 37, ['utieranie linky']],
    ['vacuum', 'Vysávanie', 34],
  ], [
    'YouGov – Household chores 2026',
    'https://yougov.com/en-us/articles/54180-how-americans-feel-about-household-chores-and-dividing-them',
    'Výsledky dvoch reprezentatívnych prieskumov spolu medzi 2 230 dospelými v USA, uskutočnených v roku 2025.',
  ]),

  question('air-travel-gripes', 'Čo ľuďom najviac prekáža na cestovaní lietadlom?', 'Cestovanie', [
    ['expense', 'Vysoká cena', 22, ['cena letenky', 'drahé letenky']],
    ['security', 'Bezpečnostné kontroly', 16, ['kontrola na letisku']],
    ['legroom', 'Málo miesta na nohy', 11, ['stiesnené sedadlá']],
    ['fear', 'Strach z lietania', 9, ['boja sa lietať']],
    ['seats', 'Nepohodlné sedadlá', 9, ['nepohodlie']],
    ['delays', 'Meškania', 5, ['oneskorenie letu']],
    ['baggage', 'Poplatky za batožinu', 4, ['batožina']],
  ], [
    'YouGov – Air travel gripes',
    'https://yougov.com/en-us/articles/4254-expense-and-security-checks-most-common-airplane-g',
    'Reprezentatívny prieskum dospelých v USA; 85 % respondentov už niekedy cestovalo lietadlom.',
  ], singleChoice),

  question('airplane-pet-peeves', 'Ktoré správanie spolucestujúcich ľuďom v lietadle najviac prekáža?', 'Cestovanie', [
    ['seat-kicking', 'Kopanie do sedadla', 56, ['kope do sedadla']],
    ['smell', 'Nepríjemný telesný zápach', 51, ['zapáchajúci cestujúci']],
    ['children', 'Zle sa správajúce deti', 49, ['neposlušné deti']],
  ], [
    'YouGov – Airplane pet peeves',
    'https://yougov.com/en-us/articles/5957-airplane-pet-peeves',
    'Reprezentatívne vážený prieskum dospelých v USA o najnepríjemnejšom správaní počas letu.',
  ]),

  question('international-travel-motivations', 'Prečo ľudia cestujú do zahraničia?', 'Cestovanie', [
    ['relax', 'Oddýchnuť si', 60, ['relax', 'odpočinok']],
    ['scenery', 'Zmeniť prostredie', 50, ['zmena prostredia']],
    ['return', 'Vrátiť sa na miesto, ktoré sa im páčilo', 49, ['vrátiť sa']],
    ['visit', 'Navštíviť rodinu alebo priateľov', 46, ['rodina', 'priatelia']],
    ['new-place', 'Objaviť nové miesto', 46, ['nové miesto', 'objavovanie']],
    ['wellness', 'Zdravie alebo wellness', 22, ['wellness', 'zdravotný pobyt']],
  ], travelMotivation),

  question('destination-influences', 'Čo najviac ovplyvňuje výber dovolenkovej destinácie?', 'Cestovanie', [
    ['recommendation', 'Odporúčanie rodiny alebo priateľov', 48, ['odporúčanie', 'rodina', 'priatelia']],
    ['deal', 'Výhodná ponuka alebo zľava', 42, ['zľava', 'akcia']],
    ['ease', 'Jednoduchosť cestovania', 38, ['dostupnosť', 'jednoduchá cesta']],
    ['reviews', 'Recenzie cestovateľov', 34, ['recenzie']],
    ['media', 'Miesto videli vo filme, televízii alebo reklame', 26, ['film', 'reklama', 'televízia']],
    ['brochure', 'Cestovateľské brožúry alebo časopisy', 18, ['brožúra', 'časopis']],
    ['agent', 'Odporúčanie cestovnej kancelárie', 13, ['cestovka', 'cestovná kancelária']],
  ], [
    'YouGov Global – Choosing a destination 2022',
    'https://yougov.com/articles/40586-global-factors-deciding-travelers-choice-survey-',
    'Medzinárodný prieskum dospelých v 17 krajinách o faktoroch ovplyvňujúcich výber destinácie.',
  ]),

  question('vacation-booking-priority', 'Čo ľudia pri plánovaní dovolenky rezervujú alebo vyberajú ako prvé?', 'Cestovanie', [
    ['destination', 'Destináciu alebo lokalitu', 51, ['miesto', 'destinácia']],
    ['activities', 'Zážitky a aktivity', 17, ['program', 'aktivity']],
    ['accommodation', 'Ubytovanie', 12, ['hotel', 'apartmán']],
  ], [
    'YouGov and Tripadvisor – Travel experiences 2025',
    'https://yougov.com/en-us/articles/52642-reality-checks-talkshow-hilary-fischer-groban-travel-experiences',
    'Prieskum YouGov pre Tripadvisor medzi 1 000 dospelými cestovateľmi v USA, publikovaný v roku 2025.',
  ], singleChoice),

  question('planned-holiday-types', 'Aký typ dovolenky ľudia najčastejšie plánujú?', 'Cestovanie', [
    ['domestic-city', 'Výlet do mesta vo vlastnej krajine', 34, ['mestský výlet', 'city break']],
    ['domestic-beach', 'Plážovú dovolenku vo vlastnej krajine', 32, ['pláž', 'more doma']],
    ['adventure', 'Dobrodružnú dovolenku', 14, ['dobrodružstvo', 'aktívna dovolenka']],
    ['cruise', 'Plavbu výletnou loďou', 14, ['plavba', 'výletná loď']],
  ], [
    'YouGov Global Travel Profiles – Holiday plans 2024',
    'https://yougov.com/en-us/articles/50753-have-american-travel-habits-shifted-in-2024',
    'Údaje YouGov Global Travel Profiles medzi dospelými v USA, publikované v októbri 2024.',
  ]),

  question('pet-types', 'Aké zvieratá ľudia najčastejšie chovajú ako domáce?', 'Zvieratá', [
    ['dog', 'Psa', 70, ['pes']],
    ['cat', 'Mačku', 50, ['mačka']],
    ['other', 'Iné domáce zviera', 11, ['iné zviera']],
    ['fish', 'Rybičky', 6, ['ryba', 'akvárium']],
    ['bird', 'Vtáka', 4, ['vták', 'papagáj']],
  ], [
    'YouGov – Pets and their owners 2023',
    'https://yougov.com/en-us/articles/45895-pets-morality-americans-attached-dogs-cats-poll',
    'Reprezentatívny prieskum dospelých v USA; percentá sú medzi majiteľmi domácich zvierat a bolo možné uviesť viac zvierat.',
  ]),

  question('reasons-no-dog', 'Prečo ľudia, ktorí nemajú psa, psa nechovajú?', 'Zvieratá', [
    ['responsibility', 'Je to priveľká zodpovednosť', 35, ['zodpovednosť']],
    ['cost', 'Je to drahé', 28, ['náklady', 'cena']],
    ['mess', 'Robí neporiadok', 27, ['neporiadok']],
    ['time', 'Nemajú naňho čas', 26, ['málo času']],
    ['space', 'Nemajú dosť priestoru', 24, ['malý byt', 'priestor']],
  ], [
    'YouGov – Reasons for not owning a dog 2025',
    'https://yougov.com/en-us/articles/51499-most-dog-and-cat-owners-say-their-pets-know-them-well',
    'Reprezentatívny online prieskum dospelých v USA, január 2025; otázka bola položená ľuďom bez psa.',
  ]),

  question('reasons-no-cat', 'Prečo ľudia, ktorí nemajú mačku, mačku nechovajú?', 'Zvieratá', [
    ['interest', 'Mačky ich nezaujímajú', 40, ['nemajú radi mačky', 'nezáujem']],
    ['mess', 'Robí neporiadok', 22, ['neporiadok']],
    ['responsibility', 'Je to priveľká zodpovednosť', 20, ['zodpovednosť']],
    ['other-pets', 'Nehodí sa k ich iným zvieratám', 18, ['iné zvieratá']],
    ['allergy', 'Alergia', 17, ['sú alergickí']],
  ], [
    'YouGov – Reasons for not owning a cat 2025',
    'https://yougov.com/en-us/articles/51499-most-dog-and-cat-owners-say-their-pets-know-them-well',
    'Reprezentatívny online prieskum dospelých v USA, január 2025; otázka bola položená ľuďom bez mačky.',
  ]),

  question('reasons-get-pet', 'Prečo si ľudia zaobstarajú domáce zviera?', 'Zvieratá', [
    ['companionship', 'Pre spoločnosť', 52, ['spoločník', 'nebyť sám']],
    ['home', 'Chcú zvieraťu poskytnúť dobrý domov', 49, ['dobrý domov', 'adopcia']],
    ['wellbeing', 'Pre lepšiu duševnú pohodu', 40, ['pohoda', 'cítiť sa lepšie']],
  ], [
    'YouGov – Why Americans get pets 2019',
    'https://yougov.com/en-us/articles/26905-how-americas-pet-owners-feel-about-their-furry-fri',
    'Reprezentatívne vážený prieskum dospelých majiteľov domácich zvierat v USA, publikovaný v roku 2019.',
  ]),

  question('robot-chores', 'Ktoré práce by ľudia najradšej prenechali domácemu robotovi?', 'Technológie', [
    ['floors', 'Čistenie podláh', 93, ['vysávanie', 'umývanie podlahy']],
    ['dishes', 'Umývanie riadu', 87, ['riad']],
    ['laundry', 'Pranie a skladanie bielizne', 86, ['pranie', 'bielizeň']],
    ['organizing', 'Organizovanie domácnosti', 86, ['upratovanie vecí']],
    ['care', 'Starostlivosť o deti alebo seniorov', 55, ['opatrovanie', 'starostlivosť']],
  ], [
    'YouGov – Household robots 2025',
    'https://yougov.com/en-us/articles/51596-two-in-five-americans-are-interested-in-having-a-household-robot-take-care-of-their-chores',
    'Reprezentatívny online prieskum dospelých v USA, publikovaný vo februári 2025; percentá sú medzi záujemcami o robota.',
  ]),

  question('online-store-verification', 'Ako si ľudia preverujú neznámy internetový obchod?', 'Nakupovanie', [
    ['reviews', 'Čítajú recenzie zákazníkov', 69, ['recenzie']],
    ['payment', 'Kontrolujú bezpečný spôsob platby', 65, ['bezpečná platba']],
    ['contact', 'Hľadajú kontaktné údaje', 47, ['kontakt', 'adresa']],
    ['social', 'Overujú prítomnosť na sociálnych sieťach', 37, ['sociálne siete']],
  ], onlineShopping),

  question('review-sources', 'Kde ľudia najčastejšie hľadajú recenzie na internetový obchod?', 'Nakupovanie', [
    ['marketplace', 'Na internetovom trhovisku', 53, ['marketplace', 'Amazon']],
    ['google', 'Vo vyhľadávači Google', 51, ['Google', 'vyhľadávač']],
    ['seller', 'Na stránke samotného predajcu', 34, ['web obchodu', 'stránka predajcu']],
    ['platform', 'Na nezávislej recenznej stránke', 33, ['recenzný portál', 'Trustpilot']],
  ], onlineShopping),

  question('review-trust-signals', 'Čo spôsobuje, že ľudia viac dôverujú internetovým recenziám?', 'Nakupovanie', [
    ['verified', 'Označenie „overený nákup“', 59, ['overený nákup', 'overený kupujúci']],
    ['mix', 'Zmes pozitívnych aj negatívnych názorov', 55, ['kladné aj záporné']],
    ['stars', 'Celkové hviezdičkové hodnotenie', 55, ['hviezdičky', 'hodnotenie']],
    ['detail', 'Podrobný písomný opis', 52, ['podrobná recenzia']],
    ['recent', 'Nedávny dátum recenzie', 49, ['nová recenzia', 'aktuálnosť']],
  ], onlineShopping),

  question('online-purchase-red-flags', 'Čo ľudí najčastejšie odradí od nákupu v internetovom obchode?', 'Nakupovanie', [
    ['negative', 'Prevažne negatívne recenzie', 67, ['zlé recenzie']],
    ['fake', 'Recenzie pôsobia falošne alebo prehnane', 59, ['falošné recenzie']],
    ['cheap', 'Cena je podozrivo nízka', 56, ['príliš lacné', 'nízka cena']],
    ['none', 'Obchod nemá žiadne recenzie', 54, ['bez recenzií']],
  ], onlineShopping),

  question('eco-actions', 'Čo ľudia robia, aby žili ekologickejšie?', 'Životný štýl', [
    ['recycle', 'Triedia a recyklujú odpad', 55, ['recyklácia', 'triedenie odpadu']],
    ['bags', 'Používajú opakovateľné nákupné tašky', 41, ['látková taška', 'vlastná taška']],
    ['bottles', 'Používajú opakovateľnú fľašu alebo pohár', 38, ['vlastná fľaša', 'termoska']],
    ['bulk', 'Kupujú väčšie alebo viacnásobné balenia', 31, ['veľké balenie']],
    ['local', 'Kupujú miestne potraviny', 29, ['lokálne potraviny']],
    ['supplies', 'Kupujú ekologické čistiace potreby', 28, ['eko čistiace prostriedky']],
    ['upcycle', 'Opravujú alebo prerábajú staré veci', 26, ['oprava', 'upcyklácia']],
    ['refill', 'Dopĺňajú výrobky do opakovateľných obalov', 24, ['bezobalový nákup', 'dopĺňanie']],
  ], [
    'YouGov – Eco-friendly practices 2023',
    'https://yougov.com/en-us/articles/47010-americans-support-plastic-reduction-but-eco-friendly-practices-wane',
    'Reprezentatívny online prieskum 1 222 dospelých občanov USA, august 2023.',
  ]),

  question('online-payment-methods', 'Ako ľudia najčastejšie platia pri nákupe cez internet?', 'Nakupovanie', [
    ['credit', 'Kreditnou kartou', 54, ['kreditka']],
    ['debit', 'Debetnou kartou', 49, ['platobná karta']],
    ['paypal', 'Cez PayPal', 42],
    ['gift', 'Darčekovou alebo predplatenou kartou', 31, ['darčeková karta', 'predplatená karta']],
    ['later', 'Odloženou platbou', 10, ['kúp teraz zaplať neskôr', 'splátky']],
  ], [
    'YouGov Profiles – Payment preferences 2024',
    'https://yougov.com/en-us/articles/48650-cash-remains-king-67-of-americans-still-prefer-traditional-in-store-payment',
    'Údaje YouGov Profiles medzi dospelými v USA, publikované vo februári 2024.',
  ]),

  question('mobile-payment-apps', 'Ktoré mobilné platobné aplikácie ľudia najčastejšie použili?', 'Technológie', [
    ['paypal', 'PayPal', 37],
    ['zelle', 'Zelle', 17],
    ['venmo', 'Venmo', 15],
    ['apple-pay', 'Apple Pay', 14],
    ['google-wallet', 'Google Wallet', 10, ['Google Pay']],
  ], [
    'YouGov Profiles – Mobile payment apps 2024',
    'https://yougov.com/en-us/articles/48650-cash-remains-king-67-of-americans-still-prefer-traditional-in-store-payment',
    'Údaje YouGov Profiles medzi dospelými v USA; použitie platobnej aplikácie za predchádzajúci mesiac.',
  ]),

  question('social-shopping-factors', 'Čo najviac presvedčí mladších ľudí kúpiť si výrobok cez sociálnu sieť?', 'Nakupovanie', [
    ['reviews', 'Recenzie a hodnotenia', 51, ['recenzie']],
    ['discounts', 'Zľavy a špeciálne ponuky', 48, ['zľava', 'akcia']],
    ['unique', 'Jedinečný alebo exkluzívny výrobok', 40, ['unikátny výrobok', 'exkluzivita']],
    ['convenience', 'Pohodlný nákup', 38, ['jednoduchosť', 'pohodlie']],
    ['friends', 'Odporúčanie rodiny alebo priateľov', 36, ['odporúčanie']],
    ['brand', 'Dobré meno značky', 35, ['značka', 'reputácia']],
    ['influencer', 'Odporúčanie influencera', 22, ['influencer']],
  ], [
    'YouGov – Social commerce 2025',
    'https://yougov.com/en-us/articles/51820-what-drives-us-consumers-to-shop-on-social-media',
    'Online prieskum 1 000 dospelých vo veku 18 až 44 rokov v USA, február 2025.',
  ]),

  question('sports-consumption', 'Ako športoví fanúšikovia najčastejšie sledujú šport?', 'Šport', [
    ['live-tv', 'Priamy prenos v televízii', 64, ['živý prenos', 'televízia']],
    ['social', 'Aktuality na sociálnych sieťach', 35, ['sociálne siete']],
    ['tv-highlights', 'Televízne zostrihy', 30, ['zostrihy v TV']],
    ['stream', 'Priamy prenos cez internet', 26, ['online stream', 'stream']],
    ['online-highlights', 'Internetové zostrihy', 21, ['zostrihy online']],
    ['radio', 'Rádio', 21],
    ['newspaper', 'Noviny', 17, ['tlač']],
  ], [
    'YouGov Profiles – Sports consumption 2023',
    'https://yougov.com/en-us/articles/47133-how-do-sports-fans-in-the-us-consume-sports',
    'Údaje YouGov Profiles medzi športovými fanúšikmi v USA, publikované v auguste 2023.',
  ]),

  question('real-sport-factors', 'Čo podľa ľudí najviac rozhoduje o tom, či je aktivita skutočný šport?', 'Šport', [
    ['skill', 'Vyžaduje fyzickú zručnosť', 62, ['fyzická zručnosť']],
    ['exertion', 'Vyžaduje fyzickú námahu', 48, ['námaha', 'kondícia']],
    ['strategy', 'Vyžaduje stratégiu', 46, ['stratégia']],
    ['scoring', 'Má systém bodovania', 46, ['bodovanie', 'skóre']],
    ['history', 'Má dlhú históriu', 24, ['tradícia']],
    ['governing', 'Má oficiálny riadiaci zväz', 23, ['športový zväz', 'federácia']],
    ['fans', 'Má veľkú fanúšikovskú základňu', 17, ['veľa fanúšikov']],
    ['olympics', 'Je zaradená na olympiáde', 13, ['olympijský šport']],
  ], [
    'YouGov – What makes a real sport 2024',
    'https://yougov.com/en-us/articles/48608-bodybuilding-flag-football-and-skateboarding-are-real-sports-according-to-americans',
    'Reprezentatívny online prieskum 2 440 dospelých občanov USA, január 2024.',
  ]),
]

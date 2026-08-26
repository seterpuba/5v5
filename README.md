# 5 na 5

Rodinná tímová hra ovládaná z mobilu s oddelenou prezentáciou pre projektor alebo TV.

Projekt nepoužíva žiadne platené AI API. V aplikácii nie je OpenAI kľúč ani automatické volanie služby, ktorá by mohla vytvoriť poplatky.

## Čo už aplikácia obsahuje

- mobilný moderátorský ovládač,
- samostatnú prezentáciu na celú obrazovku,
- živú synchronizáciu medzi kartami a pripravenú synchronizáciu cez Supabase,
- štyri kolá s násobiteľmi 1×, 1×, 2× a 3×,
- tri chyby, krádež banku a ručnú opravu skóre,
- Rýchlu päťku s časovačom 20/25 sekúnd,
- postupné odhaľovanie odpovedí a bodov,
- históriu posledných krokov a tlačidlo Späť,
- pôvodné videá úvodov kôl a zvukové efekty,
- family-friendly databázu faktických otázok so zdrojmi,
- PWA manifest pre pridanie aplikácie na plochu mobilu,
- konfiguráciu pre bezplatné nasadenie na Netlify.

## Obsahová politika

Do schváleného balíka patria iba otázky, ktoré:

- neobsahujú 18+ obsah, vulgarizmy, dvojzmysly, drogy, hazard ani ponižovanie,
- majú dohľadateľný zdroj a dátum overenia,
- pri meniacom sa údaji obsahujú rok alebo obdobie,
- jasne rozlišujú skutočné výsledky prieskumu od herných bodov.

Faktické otázky používajú transparentné herné body. Aplikácia ich nevydáva za odpovede fiktívnych „100 ľudí“. Názorové otázky môžu dostať označenie prieskum iba po zozbieraní skutočných odpovedí.

## Lokálne spustenie

Vyžaduje Node.js 22 alebo novší.

```bash
npm install
npm run dev
```

Potom otvorte adresu vypísanú v termináli. Bez Supabase funguje aplikácia v demo režime medzi kartami rovnakého prehliadača.

Kontroly pred odoslaním zmien:

```bash
npm run test
npm run build
npm audit
```

## Supabase – synchronizácia mobilu a projektora

1. Vytvorte bezplatný Supabase projekt.
2. V Authentication → Providers povoľte Anonymous sign-ins.
3. V SQL Editore spustite súbor `supabase/migrations/20260826170000_initial.sql`.
4. Skopírujte `.env.example` ako `.env.local` a doplňte Project URL a Publishable key.
5. Otvorte aplikáciu a stránku Nastavenia. Aplikácia vytvorí anonymnú reláciu a zobrazí ID zariadenia.
6. V SQL Editore pridajte toto ID do tabuľky administrátorov podľa komentára na konci migrácie.

Publishable key môže byť vo webovej aplikácii. Nikdy sem nevkladajte Supabase secret/service-role key.

Databáza oddeľuje:

- súkromný stav moderátora so skrytými odpoveďami,
- verejný stav prezentácie, ktorý obsahuje iba už odhalené údaje.

## Netlify

Projekt obsahuje `netlify.toml`. Na Netlify stačí:

1. pripojiť Git repozitár,
2. ponechať automaticky rozpoznané zostavenie,
3. pridať `VITE_SUPABASE_URL` a `VITE_SUPABASE_PUBLISHABLE_KEY`,
4. spustiť deploy.

Nastavenia zostavenia sú:

- command: `npm run build`
- publish directory: `dist`
- Node.js: `22`

Bez vlastnej domény bude aplikácia dostupná na bezplatnej adrese `*.netlify.app`.

## Médiá

Používateľom dodané súbory sú v `public/media/`:

- `1-kolo.mp4` až `5-kolo.mp4`,
- `reveal.mp3`,
- `x.mp3`.

Pred verejným zverejnením musí vlastník projektu overiť, že má právo tieto médiá verejne používať. Aplikácia nekopíruje logo ani názov televíznej relácie.

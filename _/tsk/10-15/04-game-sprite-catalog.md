# Графические спрайты 20 мини-игр — единый шаблон

Это **технический каталог иллюстраций**, а не утверждённые игровые правила. Механики и баланс каждой мини-игры обсуждаются отдельно.

## Единый спрайт каждой игры

**Поставка:** 20 прозрачных PNG-атласов, по одному для каждой игры, например `public/assets/sprites/games/01-rock-paper-scissors.png`. Итоговый размер каждого атласа — **2048×2048 px**.

В пределах холста для всех игр одинаковые зоны:

| Зона | Координаты (x, y) | Размер | Содержимое |
|---|---|---|---|
| A | (0, 0) | 2048×768 | Широкий баннер игры |
| B | (0, 768) | 512×512 | Квадратная иконка игры |
| C | (512, 768) | 512×512 | Ачивка игры |
| D | (1024, 768) | 1024×512 | Основной набор элементов управления / визуальных правил |
| E | (0, 1280) | 2048×768 | Дополнительные игровые объекты и варианты состояний |

У каждого элемента должен быть безопасный внутренний отступ и **чёткая зона обрезки**. Фон зон B–E прозрачный. Баннер A может иметь непрозрачный фон, но не должен заходить в другие зоны. В интерфейсе текст, таймеры, числа и правила должны быть HTML/CSS, а не текстовыми надписями на изображении.

Если генератор не способен выдать точную сетку и прозрачность, **создавать элементы отдельно и программно собирать готовый атлас по координатам**. Приоритет — правильный готовый спрайт, а не способ генерации.

## Универсальный промпт для генерации

Подставить выбранный референс и художественное задание одной игры из каталога ниже:

> Create a production-ready 2048x2048 sprite atlas for one mini-game within the same classroom arcade product, “Human vs Computer”. Visually match [СТИЛЬ РЕФЕРЕНСА] and the established game UI art direction. Game theme and required artwork: [ЗАДАНИЕ ИГРЫ]. Fixed atlas layout: A at x=0 y=0 size 2048x768 — wide game banner scene; B at x=0 y=768 size 512x512 — one square game icon; C at x=512 y=768 size 512x512 — one distinctive achievement medal/badge; D at x=1024 y=768 size 1024x512 — visual rule/action symbols; E at x=0 y=1280 size 2048x768 — separate game sprites and visual state variants. Keep contents fully within their regions with ample transparent padding and clean boundaries. Transparent PNG outside the banner. Consistent scale and lighting, crisp readable silhouettes, no letters, no captions, no UI buttons, no logos, no watermark. If exact atlas packing cannot be preserved, output separate transparent source illustrations suitable for deterministic compositing into this atlas.

## Каталог: 20 отдельных художественных заданий

Ниже указан **уникальный фрагмент для вставки вместо [ЗАДАНИЕ ИГРЫ]**. Для всех игр применяется общий шаблон выше.

### 01 — Камень, ножницы, бумага
**ID:** `01-rock-paper-scissors`
> Rock-paper-scissors duel. Banner: two playful opposing hands against an energetic arcade arena. Icon: unmistakable combined rock/paper/scissors silhouettes. Achievement: triumphant hand emblem with a victory star. Rule symbols: rock, scissors, paper individually, clear and symmetrical. Game pieces: separate hand gesture poses for each side, impact flashes, win/lose effects.

### 02 — Орёл или решка
**ID:** `02-coin-toss`
> Coin flip challenge. Banner: a shiny coin suspended mid-spin between two contenders. Icon: two-sided coin silhouette. Achievement: lucky golden coin medal. Rule symbols: coin showing heads, coin showing tails, spinning arrow. Game pieces: front/back coin faces and several intermediate rotations, small gleams and landing effect.

### 03 — Битва кубиков
**ID:** `03-dice-duel`
> Dice duel. Banner: two dice rolling toward each other across a game table. Icon: distinct six-sided die. Achievement: paired victorious dice trophy. Rule symbols: two opposing colored dice and a roll motion indicator. Game pieces: crisp dice faces from one to six, roll accents and impact sparks.

### 04 — Карточная дуэль
**ID:** `04-card-duel`
> Quick card duel. Banner: two stylized cards confronting each other with a dramatic flip. Icon: a single playing card silhouette. Achievement: crowned card medal. Rule symbols: face-down and face-up cards with comparison arrows. Game pieces: card backs, blank suit-compatible card fronts, suit symbols, flip accents; do not bake ranks into UI.

### 05 — Три стаканчика
**ID:** `05-shell-game`
> Three-cup shell game. Banner: three clean colorful upside-down cups on a table, one mystery ball. Icon: a cup with a small sphere. Achievement: discovered pearl or ball inside a medal. Rule symbols: three cup positions and a reveal gesture. Game pieces: cup, hidden ball, revealed ball, shadow and small shuffle traces.

### 06 — Чёт или нечёт
**ID:** `06-odd-even`
> Odd-even hand guessing duel. Banner: two cartoon hands showing small numbers of fingers toward one another. Icon: paired hand silhouettes with contrasting symbols. Achievement: balanced pair of hands trophy. Rule symbols: hands displaying one to five fingers. Game pieces: separate finger-count hand images with transparent backgrounds, simple sum/comparison visual accents. All numeric labels remain HTML.

### 07 — Больше или меньше
**ID:** `07-higher-lower`
> Higher or lower guessing with cards. Banner: one open card, one mysterious face-down card and opposing directional arrows. Icon: ascending and descending arrows framing a card. Achievement: sharp prediction badge. Rule symbols: up and down arrows. Game pieces: blank card fronts, card backs, ranking/suit motifs and reveal sparkles.

### 08 — Три сундука
**ID:** `08-three-chests`
> Three treasure chests challenge. Banner: row of three appealing mysterious chests on a treasure platform. Icon: closed chest. Achievement: overflowing gold chest medal. Rule symbols: closed, selected and opened chest. Game pieces: closed chest, empty open chest, treasure-filled open chest, shine/selection effects.

### 09 — Угадай цвет
**ID:** `09-guess-color`
> Color choice duel. Banner: luminous colored tokens being selected on an arcade stage. Icon: multicolor disc. Achievement: color-spectrum star medal. Rule symbols: distinct color tokens and reveal effect. Game pieces: neutral token shapes, selected/not-selected state frames and colorful energy accents; actual labels and accessible color names remain UI text.

### 10 — Дверь с ловушкой
**ID:** `10-trap-door`
> Mystery door survival challenge. Banner: three mysterious stylized doors, one concealing a trap. Icon: striking door silhouette. Achievement: survivor shield trophy. Rule symbols: closed door, safe door and trap symbol. Game pieces: several closed doors, opened safe door, opened hazard door, glow and suspense accents.

### 11 — Атака или защита
**ID:** `11-attack-defense`
> Attack-versus-defense duel with friendly, nonviolent fantasy styling. Banner: opposing knightly silhouettes with a shield and stylized sword. Icon: crossed shield and sword. Achievement: balanced duel champion medal. Rule symbols: left attack, right attack, left block, right block. Game pieces: stylized shield, practice sword, direction arrows, guard and impact sparkle effects.

### 12 — Дуэль лучников
**ID:** `12-archer-duel`
> Archery challenge. Banner: two friendly archer silhouettes and a colorful practice target. Icon: bow and target. Achievement: golden target medal. Rule symbols: three aim zones and dodge directions. Game pieces: arrow, practice bow, segmented target, arrows in flight and target impact accents.

### 13 — Крестики-нолики
**ID:** `13-tic-tac-toe`
> Fast tic-tac-toe duel. Banner: dynamic glowing three-by-three board with a stylish X and O. Icon: readable X/O mark. Achievement: victorious three-in-a-row medal. Rule symbols: X, O and a highlighted winning line. Game pieces: empty cell frame, X, O, board lines, highlight and win effects.

### 14 — Мини-морской бой
**ID:** `14-mini-battleship`
> Tiny naval guessing duel. Banner: simplified toy ships facing off over a clean grid ocean. Icon: small ship silhouette. Achievement: fleet commander medal. Rule symbols: water grid, target reticle, hit and miss. Game pieces: small two-cell ship, empty water tile, hit marker, miss marker, splash and ship damage marks.

### 15 — Последняя палочка
**ID:** `15-last-matchstick`
> Last matchstick strategy game. Banner: a neat row of wooden counting sticks between two contenders. Icon: three crossed counting sticks. Achievement: final stick champion medal. Rule symbols: take one, two or three sticks as visual groups. Game pieces: single stick, groups of sticks, selection highlight and winning sparkle; no fire.

### 16 — Кто быстрее?
**ID:** `16-reaction-race`
> Reaction test. Banner: a large illuminated signal with a human hand racing a small robot indicator. Icon: signal light and lightning bolt. Achievement: lightning-fast reflexes medal. Rule symbols: wait, green signal, pressed action. Game pieces: inactive and active signal artwork, press burst, reaction speed trails.

### 17 — Ловец звёзд
**ID:** `17-star-catcher`
> Catch falling stars arcade game. Banner: sparkling stars falling through a clear fantasy arcade playfield. Icon: one catching hand and star. Achievement: star collector trophy. Rule symbols: move/catch and avoid-miss cues. Game pieces: separate small/large star sprites, falling trails, catch sparkle and miss fade.

### 18 — Останови секундомер
**ID:** `18-stopwatch`
> Stop-the-timer precision challenge. Banner: dramatic stopwatch face with a glowing hand reaching to stop it. Icon: stopwatch silhouette. Achievement: perfect timing medal. Rule symbols: start, running timer, stop. Game pieces: stopwatch casing, clock hand, start/stop effects; actual time digits drawn by application.

### 19 — Запомни комбинацию
**ID:** `19-memory-sequence`
> Short visual memory pattern game. Banner: sequence of four glowing symbols briefly visible on a puzzle panel. Icon: brain-shaped light with simple geometric symbols. Achievement: memory master medal. Rule symbols: observe, hide, reproduce. Game pieces: at least six distinct simple symbols, face-down tile, reveal glow and highlight states.

### 20 — Гонка до финиша
**ID:** `20-finish-race`
> Tiny arcade racing duel. Banner: two toy racing cars sprinting side by side toward a finish line. Icon: tiny stylized racing car. Achievement: winner's racing cup medal. Rule symbols: accelerate, turbo boost and finish flag. Game pieces: two separate cars, track tile, finish line, speed trail and boost effect.

## Именование и использование

- Актуальная короткая метка репозитория: `man-vs-pc`; экранное название — `Human vs Computer` / «Человек против Компьютера».
- Имена файлов: `public/assets/sprites/games/<ID>.png`.
- Координаты областей в атласе хранятся централизованно. Не дублировать magic numbers в 20 компонентах.
- В игровой карточке использовать область **B**, в представлении игры — **A**, в достижениях — **C**, во время игры — **D/E**.
- Спрайты иллюстрируют механику; реальная логика победы, анимации и интерактивные поля создаются кодом.
- Референс определяет стиль всех 20 атласов. Ключевое требование: один персонаж/объект в единой графической системе, без разнобоя между играми.

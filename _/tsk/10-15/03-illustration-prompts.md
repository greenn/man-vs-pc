# Иллюстрации для Human vs Computer: перечень и промпты

**Задача:** подготовить графику после утверждения визуального референса. Все изображения должны выглядеть как один продукт. Использовать единую палитру, толщину контуров, освещение, характер деталей и стиль персонажей. Не добавлять в изображения текст, цифры интерфейса, логотипы сторонних компаний и кнопки: названия, счёт, правила, табло и кнопки рисуются HTML/CSS.

В промптах ниже `[СТИЛЬ РЕФЕРЕНСА]` — описание или прикреплённый скриншот окончательно выбранного референса. **До выбора референса не фиксировать финальную графику.** Разрешён черновой прототип с заглушками.

## 1. Глобальные фоны — 7 иллюстраций

Для каждого использовать горизонтальное изображение 16:9 (например, 1920×1080), без элементов управления и текста. Центр и нижние области оставлять относительно спокойными, чтобы поверх читались карточки и счёт.

| Файл | Назначение | Ключевой сюжет промпта |
|---|---|---|
| `backgrounds/home.webp` | Титульный экран | Мир цифрового соревнования, человек и компьютер как равные соперники, свободная зона для названия |
| `backgrounds/roster.webp` | Выбор участников | Площадка с мягкими световыми кругами или абстрактными слотами команд, без нарисованных аватаров |
| `backgrounds/versus.webp` | Сцена VS | Две визуально разделённые стороны и яркий акцент в центре, свободное место для двух персонажей |
| `backgrounds/game-select.webp` | Выбор мини-игры | Аркадная галерея, ненавязчивые графические мотивы разнообразных игр, спокойный фон под 20 карточек |
| `backgrounds/arena.webp` | Игровое поле | Нейтральная игровая арена, мягкая глубина, максимальная контрастность будущих интерактивных элементов |
| `backgrounds/victory.webp` | Победа/ничья | Торжественная сцена с сиянием и частицами, пустой центр под одного победителя и блок наград |
| `backgrounds/hall-of-fame.webp` | Финал/рейтинг | Сцена награждения со световыми акцентами, свободное место под группу круглых аватаров и результаты |

**Общий копируемый промпт для каждого фона:**

> Create a polished 16:9 background illustration for a classroom arcade game titled “Human vs Computer”. Art direction: [СТИЛЬ РЕФЕРЕНСА]. Scene: [КЛЮЧЕВОЙ СЮЖЕТ ИЗ ТАБЛИЦЫ]. Designed as a BACKGROUND layer behind real HTML game UI; strong atmosphere but low visual clutter in the center. Unified lighting and palette across all screens. No readable text, no interface mockup, no buttons, no numbers, no watermark. Full-bleed composition, 1920x1080.

## 2. Главный баннер — 1 иллюстрация

**Файл:** `banners/hero.webp`, широкий формат примерно 21:9 (например, 2100×900). Используется как художественная часть обложки. Название остаётся настоящим текстом интерфейса.

**Промпт:**

> Create a wide 21:9 hero illustration for the game “Human vs Computer”. A friendly but competitive arcade face-off between a distinctive computer robot and a human contender; dynamic composition with clean negative space for an HTML title overlay. Follow [СТИЛЬ РЕФЕРЕНСА] exactly in palette, outlines, lighting and character rendering. No letters, no slogans, no logos, no interface elements, no watermark.

## 3. Спрайт персонажей — 1 атлас из 30 ячеек

**Файл:** `sprites/characters.png`. **30 персонажей, сетка 6×5**; ячейки одинаковые, например 512×512, итоговый холст 3072×2560.

- Ячейка `0` (левый верхний угол) — **робот-компьютер**.
- Ячейки `1–20` — **20 разных девочек**. Ячейки `21–29` — **9 разных мальчиков**. Имен и подписей нет.
- Все фигуры по пояс или крупные портреты, помещаются в квадрат, **прозрачный фон**, без нарисованных круглых рамок.
- Круг человека рисуется CSS **за персонажем**; робот выводится без круга и может слегка выступать за силуэт условного аватара.
- Атлас формируется из проверенных отдельных прозрачных изображений, если генератор плохо соблюдает точную сетку. В итоговой поставке всё равно **один спрайт**.

**Промпт для исходных персонажей / референс-листа:**

> Design one coherent set of exactly 30 distinct, charming, age-neutral arcade character portraits for the same classroom game. Art direction: [СТИЛЬ РЕФЕРЕНСА]. Character 01 is a computer/robot opponent; characters 02–21 are twenty different girls and characters 22–30 are nine different boys with clear silhouettes, balanced visual diversity, consistent head size, lighting and perspective. Each character occupies a separate transparent square cell in a precisely aligned 6-column by 5-row atlas, with no overlap, labels, backgrounds, circles, borders or text. The robot is visually distinctive and allowed a slightly taller silhouette. Deliver transparent PNG; each portrait must be independently crop-friendly.

Подробный промпт и техническая раскладка: [05-character-atlas-prompt.md](05-character-atlas-prompt.md).

## 4. Общие ачивки — 1 атлас

**Файл:** `sprites/achievements-global.png`. Минимум **6 отдельных прозрачных значков** в единой сетке 3×2; без встроенных слов. Названия выводить средствами приложения.

| ID | Ачивка | Образ |
|---|---|---|
| `first-win` | Первая победа | Маленький сияющий кубок / звезда |
| `win-streak` | Серия побед | Три пылающие звезды |
| `lucky-win` | Счастливчик | Счастливый кубик или монета |
| `human-champion` | Чемпион людей | Венок, кубок и эмблема человека |
| `computer-champion` | Чемпион компьютера | Роботизированный трофей |
| `game-master` | Мастер игр | Сочетание нескольких игровых символов |

**Промпт:**

> Create a matching set of six premium arcade achievement badge illustrations for “Human vs Computer”: first victory, winning streak, lucky win, human champion, computer champion, game master. Follow [СТИЛЬ РЕФЕРЕНСА]. Six clearly separated, centered designs in a precise 3x2 uniform atlas, transparent background, equal visual weight, detailed but readable at small sizes, no letters, numbers, labels, circles as UI containers, watermark or background.

Эти шесть достижений — **черновые примеры**, их условия необходимо согласовать позднее.

## 5. Графика мини-игр — 20 атласов

Каждой игре соответствует **один спрайт-атлас**, который объединяет:
1. Баннер игры.
2. Квадратную иконку.
3. Ачивку за игру.
4. Декоративные и игровые объекты.

**Единая геометрия атласов, промпт и индивидуальные задания для всех 20 игр:** [04-game-sprite-catalog.md](04-game-sprite-catalog.md).

Мини-игры, зависящие от случайности или физических жестов, должны иметь анимацию программно; не пытаться закодировать её как один статичный кадр.

## 6. Итоговая композиция победителей

Отдельно генерировать персонализированное изображение не требуется: **фон `hall-of-fame.webp` + круглые аватары из атласа + счёт/ачивки в HTML/CSS**. Так финальная картинка всегда отражает фактических победителей и сохраняет возможность экспорта изображения экрана на следующем этапе.

## 7. Сводный объём графики

| Категория | Количество файлов |
|---|---:|
| Фоновые сцены | 7 |
| Главный баннер | 1 |
| Атлас 30 персонажей | 1 |
| Атлас общих ачивок | 1 |
| Атласы 20 мини-игр | 20 |
| **Итого** | **30 файлов** |

**Важно:** спрайты нужно валидировать после генерации: реальные границы ячеек, прозрачность, отсутствие обрезанных рук/предметов и единая композиция. Предпочтительно получить элементы по отдельности и программно собрать в атлас, если генератор не обеспечивает точный пиксельный раскрой.

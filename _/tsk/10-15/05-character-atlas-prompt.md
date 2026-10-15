# Human vs Computer — промпт спрайта персонажей

**Генерация изображений — отдельным следующим этапом.**

Нужен один согласованный атлас из **30** персонажей: слот **0 — компьютер**, слоты **1–20 — двадцать девочек**, слоты **21–29 — девять мальчиков**. Порядок слева направо, сверху вниз. Сетка 6×5, ячейки одинаковые (ориентир 512×512), итог 3072×2560 PNG с реальной прозрачностью.

## Промпт (EN)

> Create an original, premium character sprite atlas for the classroom arcade game Human vs Computer, inspired by the approved dark futuristic esports dashboard reference. Exactly 30 distinct chest-up character portraits in a perfectly aligned 6-column by 5-row atlas. Cell 0: one charming futuristic computer robot, with a distinctive luminous visor and slightly extended silhouette. Cells 1 through 20: 20 different school-age girl characters. Cells 21 through 29: nine different school-age boy characters. Diverse hairstyles, everyday school-appropriate outfits, neutral and confident expressions. Unified semi-stylized game-illustration technique, consistent perspective, scale, head position, highlights and crisp outlines, subtle purple/cyan rim lighting. Each portrait occupies one 512x512 transparent square with ample internal padding. Transparent background with actual alpha, no checkerboard, no cell borders, no circular frames, no text, names, initials, numbers, logos or watermarks. Do not copy existing branded characters. Deliver 3072x2560 PNG RGBA. If exact cells cannot be guaranteed by generation, create 30 separate transparent portraits and programmatically assemble the atlas.

## Применение

- В интерфейсе участник выбирает один из 29 человеческих аватаров; робот недоступен для назначения людям.
- CSS-круг рисуется под человеческим портретом, робот показывается без круга.
- Запоминать выбранный `avatarId` по стабильному ID участника в `localStorage`.
- Пока атлас не готов, использовать инициалы как заглушку.
- Будущий файл: `public/assets/sprites/characters.png`.

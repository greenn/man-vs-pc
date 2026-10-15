# Чёт или нечёт — спрайт и промпт генерации

**ID:** `06-odd-even`

## Перечень элементов

- **A — баннер:** две руки с показанными пальцами.
- **B — иконка:** пара рук с контрастными символами.
- **C — ачивка:** медаль с симметричными ладонями.
- **D — символы правил:** жесты с 1, 2, 3, 4 и 5 пальцами.
- **E — игровые объекты:** левая/правая кисти с разным числом пальцев и нейтральные эффекты подсчёта.

Единый формат атласа: **2048×2048 PNG**. Зоны: **A** баннер (0,0; 2048×768), **B** иконка (0,768; 512×512), **C** ачивка (512,768; 512×512), **D** визуальные правила (1024,768; 1024×512), **E** объекты игры (0,1280; 2048×768). Вне баннера — прозрачный фон. Без надписей, UI-кнопок и цифрового счёта; они создаются кодом. Если точная сетка не удаётся, генерировать элементы отдельно и собрать их программно в единый атлас.

## Промпт генерации (EN)

> Create one high-quality, pixel-aligned **2048x2048 transparent PNG sprite atlas** for the mini-game **"Чёт или нечёт"** in the classroom arcade project **Human vs Computer**. Match **[APPROVED STYLE REFERENCE]** exactly: same palette, illustration technique, lighting and line weights as the other 19 games. Use this fixed layout without overlapping regions: **A** x=0 y=0 2048x768 wide banner showing две руки с показанными пальцами; **B** x=0 y=768 512x512 square icon showing пара рук с контрастными символами; **C** x=512 y=768 512x512 achievement badge showing медаль с симметричными ладонями; **D** x=1024 y=768 1024x512 instructional symbols showing жесты с 1, 2, 3, 4 и 5 пальцами; **E** x=0 y=1280 2048x768 separate gameplay sprites showing левая/правая кисти с разным числом пальцев и нейтральные эффекты подсчёта. Keep each element centered with safe transparent padding, cuttable edges, consistent scale and coherent silhouettes. Transparent background outside A. No text, letters, numbers, UI controls, logos, watermarks or embedded rules. If exact layout cannot be met, provide individual transparent assets ready for deterministic atlas assembly.

**Файл графики:** `public/assets/sprites/games/06-odd-even.png`.

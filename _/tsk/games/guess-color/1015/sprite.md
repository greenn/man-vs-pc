# Угадай цвет — спрайт и промпт генерации

**ID:** `09-guess-color`

## Перечень элементов

- **A — баннер:** яркие цветные жетоны на аркадном поле.
- **B — иконка:** многоцветный жетон.
- **C — ачивка:** радужная медаль со звездой.
- **D — символы правил:** пять различимых цветных жетонов и знак раскрытия.
- **E — игровые объекты:** нейтральные формы жетонов, выбранное/невыбранное состояние, цветное сияние.

Единый формат атласа: **2048×2048 PNG**. Зоны: **A** баннер (0,0; 2048×768), **B** иконка (0,768; 512×512), **C** ачивка (512,768; 512×512), **D** визуальные правила (1024,768; 1024×512), **E** объекты игры (0,1280; 2048×768). Вне баннера — прозрачный фон. Без надписей, UI-кнопок и цифрового счёта; они создаются кодом. Если точная сетка не удаётся, генерировать элементы отдельно и собрать их программно в единый атлас.

## Промпт генерации (EN)

> Create one high-quality, pixel-aligned **2048x2048 transparent PNG sprite atlas** for the mini-game **"Угадай цвет"** in the classroom arcade project **Human vs Computer**. Match **[APPROVED STYLE REFERENCE]** exactly: same palette, illustration technique, lighting and line weights as the other 19 games. Use this fixed layout without overlapping regions: **A** x=0 y=0 2048x768 wide banner showing яркие цветные жетоны на аркадном поле; **B** x=0 y=768 512x512 square icon showing многоцветный жетон; **C** x=512 y=768 512x512 achievement badge showing радужная медаль со звездой; **D** x=1024 y=768 1024x512 instructional symbols showing пять различимых цветных жетонов и знак раскрытия; **E** x=0 y=1280 2048x768 separate gameplay sprites showing нейтральные формы жетонов, выбранное/невыбранное состояние, цветное сияние. Keep each element centered with safe transparent padding, cuttable edges, consistent scale and coherent silhouettes. Transparent background outside A. No text, letters, numbers, UI controls, logos, watermarks or embedded rules. If exact layout cannot be met, provide individual transparent assets ready for deterministic atlas assembly.

**Файл графики:** `public/assets/sprites/games/09-guess-color.png`.

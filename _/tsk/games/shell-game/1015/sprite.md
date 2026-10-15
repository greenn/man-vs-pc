# Три стаканчика — спрайт и промпт генерации

**ID:** `05-shell-game`

## Перечень элементов

- **A — баннер:** три перевёрнутых стаканчика и шарик на игровом столе.
- **B — иконка:** стаканчик с маленьким шаром.
- **C — ачивка:** медаль с найденным шаром.
- **D — символы правил:** три позиции стаканчиков и указатель выбора.
- **E — игровые объекты:** закрытый/поднятый стакан, шар, тень, следы перемешивания.

Единый формат атласа: **2048×2048 PNG**. Зоны: **A** баннер (0,0; 2048×768), **B** иконка (0,768; 512×512), **C** ачивка (512,768; 512×512), **D** визуальные правила (1024,768; 1024×512), **E** объекты игры (0,1280; 2048×768). Вне баннера — прозрачный фон. Без надписей, UI-кнопок и цифрового счёта; они создаются кодом. Если точная сетка не удаётся, генерировать элементы отдельно и собрать их программно в единый атлас.

## Промпт генерации (EN)

> Create one high-quality, pixel-aligned **2048x2048 transparent PNG sprite atlas** for the mini-game **"Три стаканчика"** in the classroom arcade project **Human vs Computer**. Match **[APPROVED STYLE REFERENCE]** exactly: same palette, illustration technique, lighting and line weights as the other 19 games. Use this fixed layout without overlapping regions: **A** x=0 y=0 2048x768 wide banner showing три перевёрнутых стаканчика и шарик на игровом столе; **B** x=0 y=768 512x512 square icon showing стаканчик с маленьким шаром; **C** x=512 y=768 512x512 achievement badge showing медаль с найденным шаром; **D** x=1024 y=768 1024x512 instructional symbols showing три позиции стаканчиков и указатель выбора; **E** x=0 y=1280 2048x768 separate gameplay sprites showing закрытый/поднятый стакан, шар, тень, следы перемешивания. Keep each element centered with safe transparent padding, cuttable edges, consistent scale and coherent silhouettes. Transparent background outside A. No text, letters, numbers, UI controls, logos, watermarks or embedded rules. If exact layout cannot be met, provide individual transparent assets ready for deterministic atlas assembly.

**Файл графики:** `public/assets/sprites/games/05-shell-game.png`.

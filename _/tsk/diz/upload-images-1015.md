# Добавление PNG-референсов — 15.10.2026

Структурные документы уже сохранены в GitHub:
- `game-select/1015/game-select.struct.md`
- `pers-select/1015/pers-select.struct.md`

**Два изображения** подготовлены отдельно в архиве `man-vs-pc-design-1015.zip` и должны быть перенесены в корень клонированного репозитория без изменения путей:

```text
_/tsk/diz/game-select/1015/game-select.dark-purple.png
_/tsk/diz/pers-select/1015/pers-select.dark-purple.png
```

После распаковки в Cursor/терминале:

```bash
git add _/tsk/diz/game-select/1015/game-select.dark-purple.png _/tsk/diz/pers-select/1015/pers-select.dark-purple.png
git commit -m "assets: add game-select and pers-select design images"
git push origin main
```

Эти PNG — только визуальные референсы. Для структуры экранов использовать `*.struct.md`; реальную информацию об учениках брать из доступной локальной команды, а данные о победах — из состояния приложения. На скриншотах могут быть условные имена/цифры.

Этот документ можно удалить после загрузки PNG.

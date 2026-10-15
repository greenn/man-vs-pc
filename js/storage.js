(() => {
function loadState(preset) {
  const { STORAGE_KEY, createState, parseStored } = globalThis.ManVsPc;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: createState(preset), notice: "" };
    const parsed = parseStored(raw);
    if (!parsed.ok) {
      return {
        state: createState(preset),
        notice: "Сохранённые данные повреждены или устарели. Начата новая сессия, состав взят из пресета."
      };
    }
    return { state: parsed.state, notice: "" };
  } catch {
    return {
      state: createState(preset),
      notice: "Браузер не открыл сохранённые данные. Текущая сессия останется только до закрытия вкладки."
    };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(globalThis.ManVsPc.STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

Object.assign(globalThis.ManVsPc, { loadState, saveState });
})();

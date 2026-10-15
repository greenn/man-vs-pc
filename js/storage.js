import { STORAGE_KEY, createState, parseStored } from "./model.js";

export function loadState(preset) {
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

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

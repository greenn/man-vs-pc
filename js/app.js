(() => {
const {
  GAMES,
  GAME_IDS,
  RPS,
  RPS_LABEL,
  beginRps,
  beginChests,
  fairUnit,
  gameById,
  resolveCoin,
  resolveDice,
  activeParticipants,
  applyRound,
  cancelMatch,
  clearFinishedMatch,
  competitionPhase,
  findParticipant,
  importTeam,
  newCompetition,
  participantStats,
  pendingParticipants,
  pickRandom,
  playedIds,
  resetStatistics,
  setAvatar,
  setDisabled,
  startMatch,
  updateSettings,
  loadState,
  saveState
} = globalThis.ManVsPc;

const app = document.querySelector("#app");
const NAV = [
  ["home", "Главная", "⌂"],
  ["students", "Ученики", "☺"],
  ["games", "Игры", "🎮"],
  ["stats", "Статистика", "▤"],
  ["settings", "Настройки", "⚙"]
];

let state;
let timer = 0;
const view = {
  screen: "home",
  selectedId: null,
  selectedGameId: GAMES[0].id,
  filter: "all",
  query: "",
  notice: "",
  modal: null,
  phase: "choose",
  reveal: null,
  secret: null,
  roundStartedAt: 0
};

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[ch]));
}

function ru(n, one, few, many) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return `${n} ${one}`;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}

function winsGenitive(n) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return `${n} победы`;
  return `${n} побед`;
}

function shortNo(id) {
  const match = String(id).match(/(\d+)$/);
  return match ? match[1].padStart(2, "0") : id;
}

function avatar(person, size = "") {
  if (!person) {
    return `<div class="avatar avatar-robot ${size}"><span class="robot-visor"></span></div>`;
  }
  return `<div class="avatar ${size}" style="--hue:${(person.avatarId * 47) % 360}"><b>${esc(person.initials)}</b></div>`;
}

function persist(notice) {
  if (notice) view.notice = notice;
  if (!saveState(state)) view.notice = "Не удалось записать данные в браузер.";
  render();
}

function go(screen) {
  if (["vs", "games", "intro"].includes(screen)) {
    const person = findParticipant(state, view.selectedId);
    if (!person || person.disabled) {
      view.notice = "Сначала выберите активного ученика.";
      view.screen = "students";
      render();
      return;
    }
  }
  if (screen === "play" && state.match?.status !== "playing") {
    view.screen = "intro";
    render();
    return;
  }
  view.screen = screen;
  if (location.hash !== `#${screen}`) history.replaceState(null, "", `#${screen}`);
  render();
}

function requestScreen(screen) {
  if (state.match?.status === "playing" && screen !== "play") {
    view.modal = { type: "leave", target: screen };
    render();
    return;
  }
  go(screen);
}

function selectedPerson() {
  return findParticipant(state, view.selectedId);
}

function shell(content) {
  const nav = (className) => NAV.map(([id, label, icon]) => `
    <button class="${className} ${view.screen === id ? "is-on" : ""}" data-action="nav" data-screen="${id}">
      ${className === "rail-btn" ? `<span>${icon}</span>` : ""}${esc(label)}
    </button>`).join("");
  return `
    <div class="app">
      <aside class="rail">
        <div class="brand-mark">VS</div>
        ${nav("rail-btn")}
      </aside>
      <header class="topbar">
        <div class="brand">
          <h1>Человек <b>против</b> Компьютера</h1>
          <p>${esc(state.team.teamName)} · классное соревнование</p>
        </div>
        <nav class="nav">${nav("nav-btn")}</nav>
        <div class="cpu-chip">${avatar(null)}<div><strong>Компьютер</strong><small>соперник</small></div></div>
      </header>
      <main class="stage">
        ${view.notice ? `<div class="notice">${esc(view.notice)}</div>` : ""}
        ${content}
      </main>
    </div>
    ${modalHtml()}`;
}

function phaseNote() {
  const phase = competitionPhase(state);
  const pending = pendingParticipants(state);
  if (phase === "no-players") return "Нет активных учеников. Включите хотя бы одного, чтобы начать.";
  if (phase === "final") {
    const side = state.session.winnerLocked === "human" ? "Люди" : "Компьютер";
    return `Соревнование завершено. Победитель зафиксирован: ${side}. Счёт ${state.session.humanWins}:${state.session.computerWins}.`;
  }
  if (phase === "overtime") {
    const side = state.session.winnerLocked === "human" ? "Люди" : "Компьютер";
    return `Цель достигнута, победитель зафиксирован: ${side}. Осталось сыграть: ${ru(pending.length, "ученик", "ученика", "учеников")}.`;
  }
  if (!pending.length && state.session.humanWins + state.session.computerWins > 0) {
    return "Все активные уже сыграли. Можно выбирать повторно, пока одна из сторон не наберёт цель.";
  }
  return `Цель — ${ru(state.settings.sessionGoal, "общая победа", "общие победы", "общих побед")}. Личный матч до ${winsGenitive(state.settings.matchWins)}.`;
}

function scoreHero() {
  return `
    <section class="score-hero">
      <div class="score-side">
        <span>Люди</span>
        <div class="score-num human">${state.session.humanWins}</div>
      </div>
      <div>
        <div class="vs-word">VS</div>
        <div class="goal">до ${state.settings.sessionGoal}</div>
        <div class="banner-note">Ничьи сессии: ${state.session.draws}</div>
      </div>
      <div class="score-side right">
        <span>Компьютер</span>
        <div class="score-num cpu">${state.session.computerWins}</div>
      </div>
    </section>`;
}

function screenHome() {
  const active = activeParticipants(state);
  const disabled = state.team.participants.length - active.length;
  const pending = pendingParticipants(state);
  return `
    <div class="page-head">
      <div>
        <h2>${esc(state.team.teamName)}</h2>
        <p>${phaseNote()}</p>
      </div>
      <div class="stack" style="min-width:220px">
        <button class="btn btn-primary" data-action="nav" data-screen="students">Игра</button>
        <label class="btn btn-ghost" style="text-align:center">Импорт JSON<input id="import-file" hidden type="file" accept="application/json,.json"></label>
      </div>
    </div>
    ${scoreHero()}
    <div class="home-grid">
      <section class="panel">
        <h3>Активные против компьютера</h3>
        <div class="faces">
          ${active.map((person) => `<div class="face-chip">${avatar(person)}<span>${esc(person.initials)}</span></div>`).join("")}
          <div class="face-chip"><div class="vs-word" style="font-size:22px">VS</div></div>
          <div class="face-chip">${avatar(null)}<span>ПК</span></div>
        </div>
        <p class="banner-note">Отключено: ${disabled}. Ещё не играли: ${pending.map((person) => esc(person.initials)).join(", ") || "все активные уже сыграли"}.</p>
      </section>
      <section class="panel">
        <h3>Сейчас в каталоге</h3>
        ${GAMES.map((game) => `<p><strong>${esc(game.title)}</strong><br><span class="banner-note">${esc(game.summary)}</span></p>`).join("")}
        ${competitionPhase(state) === "final" ? `<button class="btn btn-primary btn-block" data-action="nav" data-screen="final">Итог соревнования</button>` : ""}
      </section>
    </div>`;
}

function visibleStudents() {
  const q = view.query.trim().toLowerCase();
  return state.team.participants.filter((person) => {
    if (view.filter === "active" && person.disabled) return false;
    if (view.filter === "disabled" && !person.disabled) return false;
    if (!q) return true;
    return person.initials.toLowerCase().includes(q) || person.fullName.toLowerCase().includes(q);
  });
}

function screenStudents() {
  const played = playedIds(state.session);
  const person = selectedPerson();
  const stats = person ? participantStats(state.session.matches, person.id) : null;
  const cards = visibleStudents().map((item) => `
    <button class="student-card ${item.id === view.selectedId ? "is-on" : ""} ${item.disabled ? "is-off" : ""}" data-action="select" data-id="${esc(item.id)}">
      <div class="card-no">${esc(shortNo(item.id))}</div>
      <i class="card-flag"></i>
      ${avatar(item)}
      <div class="initials">${esc(item.initials)}</div>
      ${item.disabled ? `<small>не играет</small>` : (played.has(item.id) ? "" : `<i class="dot" title="ещё не играл"></i>`)}
    </button>`).join("");
  return `
    <div class="layout">
      <div>
        <div class="page-head">
          <div>
            <h2>Выбор ученика</h2>
            <p>Всего ${ru(state.team.participants.length, "участник", "участника", "участников")}. Нажмите карточку или выберите случайно среди активных.</p>
          </div>
          <span class="count-pill">${state.team.participants.length}</span>
        </div>
        <div class="toolbar">
          <input class="search" data-focus="search" placeholder="Поиск по инициалам" value="${esc(view.query)}">
          ${[["all", "Все"], ["active", "Активные"], ["disabled", "Отключённые"]].map(([id, label]) =>
            `<button class="filter ${view.filter === id ? "is-on" : ""}" data-action="filter" data-filter="${id}">${label}</button>`).join("")}
          <button class="btn" data-action="random-student">Выбрать случайно</button>
        </div>
        <div class="roster">${cards || `<p>Никого не найдено.</p>`}</div>
      </div>
      <aside class="layout-side">
        <section class="side-card">
          <h3>Выбранный ученик</h3>
          ${person ? `
            <div class="identity">${avatar(person, "is-lg")}<div><div class="who">${esc(person.initials)}</div><div>${esc(person.fullName || shortNo(person.id))}</div></div></div>
            <table class="meta">
              <tr><th>Номер</th><td>${esc(shortNo(person.id))}</td></tr>
              <tr><th>Статус</th><td>${person.disabled ? "не играет" : "готов"}</td></tr>
              <tr><th>Матчи</th><td>${stats.matches}</td></tr>
              <tr><th>Победы</th><td>${stats.wins}</td></tr>
              <tr><th>Поражения</th><td>${stats.losses}</td></tr>
              <tr><th>Ничьи</th><td>${stats.draws}</td></tr>
            </table>
            <div class="stack">
              <button class="btn" data-action="avatar">Сменить аватар</button>
              <button class="btn" data-action="toggle">${person.disabled ? "Включить" : "Отключить"}</button>
              <button class="btn btn-primary" data-action="to-vs" ${person.disabled ? "disabled" : ""}>Начать игру</button>
            </div>` : `<p>Выберите ученика в сетке.</p>`}
        </section>
        <section class="side-card">
          <h3>Соперник</h3>
          <div class="vs-mini">${avatar(null)}<div class="vs-word">VS</div><div><strong>Компьютер</strong><div class="banner-note">без круга</div></div></div>
        </section>
        <button class="btn btn-ghost" data-action="nav" data-screen="home">Назад</button>
      </aside>
    </div>`;
}

function screenVs() {
  const person = selectedPerson();
  if (!person) return `<p>Ученик не выбран.</p><button class="btn" data-action="nav" data-screen="students">К ученикам</button>`;
  return `
    <section class="vs-stage">
      <div class="fighter">${avatar(person, "is-xl")}<h2>${esc(person.initials)}</h2><small>${esc(person.fullName || "ученик")}</small></div>
      <div class="vs-word" style="font-size:72px">VS</div>
      <div class="fighter">${avatar(null, "is-xl avatar-robot")}<h2>Компьютер</h2><small>соперник</small></div>
    </section>
    <div class="toolbar" style="justify-content:center">
      <button class="btn" data-action="nav" data-screen="students">Назад</button>
      <button class="btn btn-danger" data-action="refuse">Отказался</button>
      <button class="btn btn-primary" data-action="nav" data-screen="games">Выбрать игру</button>
    </div>`;
}

function screenGames() {
  const person = selectedPerson();
  if (!person || person.disabled) {
    return `<p>Сначала выберите активного ученика.</p><button class="btn btn-primary" data-action="nav" data-screen="students">К ученикам</button>`;
  }
  const game = gameById(view.selectedGameId) || GAMES[0];
  return `
    <div class="layout">
      <div>
        <div class="page-head">
          <div>
            <h2>Выбор игры</h2>
            <p>Доступно ${ru(GAMES.length, "игра", "игры", "игр")}. Одна игра длится до конца личного матча.</p>
          </div>
        </div>
        <div class="game-grid">
          ${GAMES.map((item) => `
            <button class="game-card ${item.id === game.id ? "is-on" : ""}" data-action="select-game" data-game="${item.id}">
              <div class="art ${gameArtClass(item.id)}">${gameArtMarkup(item.id)}</div>
              <h3>${esc(item.title)}</h3>
              <p>${esc(item.summary)}</p>
              <div class="tags">${item.tags.map((tag) => `<span class="pill">${esc(tag)}</span>`).join("")}<span class="pill">Матч до ${state.settings.matchWins}</span></div>
            </button>`).join("")}
        </div>
        <div class="toolbar">
          <button class="btn" data-action="random-game">Выбрать случайно</button>
          <button class="btn" data-action="nav" data-screen="vs">Назад к ученику</button>
        </div>
        ${scoreHero()}
      </div>
      <aside class="layout-side">
        <section class="side-card">
          <h3>Выбранная игра</h3>
          <strong>${esc(game.title)}</strong>
          <p>${esc(game.summary)}</p>
          <table class="meta">
            <tr><th>Тип</th><td>${esc(game.kind)}</td></tr>
            <tr><th>Режим</th><td>до ${winsGenitive(state.settings.matchWins)}</td></tr>
            <tr><th>Статус</th><td>готова</td></tr>
          </table>
        </section>
        <section class="side-card">
          <h3>Противники</h3>
          <div class="vs-mini">${avatar(person)}<div class="vs-word">VS</div>${avatar(null)}</div>
          <p>${esc(person.initials)} против компьютера</p>
        </section>
        <button class="btn btn-primary btn-block" data-action="to-intro">Начать игру</button>
      </aside>
    </div>`;
}

function screenIntro() {
  const person = selectedPerson();
  const game = gameById(view.selectedGameId);
  if (!person || !game) return `<p>Сначала выберите ученика и игру.</p><button class="btn" data-action="nav" data-screen="students">К ученикам</button>`;
  return `
    <div class="page-head"><div><h2>${esc(game.title)}</h2><p>${esc(person.initials)} VS Компьютер · матч до ${winsGenitive(state.settings.matchWins)}</p></div></div>
    <div class="art ${game.id.includes("coin") ? "art-coin" : "art-rps"}">${game.id.includes("coin") ? "<span>🌕</span><span>🪙</span>" : "<span>✊</span><span>✌️</span><span>✋</span>"}</div>
    <section class="panel"><h3>Правила</h3><p class="rules">${esc(game.summary)}</p><p class="rules">${esc(game.behavior)}</p></section>
    <div class="toolbar">
      <button class="btn" data-action="nav" data-screen="games">Назад</button>
      <button class="btn btn-primary" data-action="start-match">Старт</button>
    </div>`;
}

function gameArtClass(id) {
  if (id.includes("coin")) return "art-coin";
  if (id.includes("dice")) return "art-dice";
  if (id.includes("chests")) return "art-chests";
  return "art-rps";
}

function gameArtMarkup(id) {
  if (id.includes("coin")) return "<span>🌕</span><span>🪙</span>";
  if (id.includes("dice") || id.includes("chests")) return "";
  return "<span>✊</span><span>✌️</span><span>✋</span>";
}

function outcomeWord(winner) {
  if (winner === "human") return ["Победа ученика", "human"];
  if (winner === "computer") return ["Победа компьютера", "computer"];
  return ["Ничья", "draw"];
}

function screenPlay() {
  const match = state.match;
  if (!match) return `<p>Матч не идёт.</p><button class="btn" data-action="nav" data-screen="students">К ученикам</button>`;
  const person = findParticipant(state, match.participantId);
  const game = gameById(match.gameId);
  const [word, tone] = view.reveal ? outcomeWord(view.reveal.winner) : ["", ""];
  const moves = match.gameId === "02-coin-toss"
    ? [["heads", "Орёл"], ["tails", "Решка"]]
    : match.gameId === "03-dice-duel"
      ? [["roll", "Бросить"]]
      : match.gameId === "08-three-chests"
        ? []
        : RPS.map((id) => [id, RPS_LABEL[id]]);
  let board = "";
  if (match.gameId === "08-three-chests") {
    const opening = view.phase !== "choose";
    const reveal = view.reveal;
    board = `<div class="choice-row">${[0, 1, 2].map((index) => {
      const open = view.phase === "reveal";
      const src = !open
        ? "assets/sprites/games/08-three-chests/closed.png"
        : (index === reveal.treasure ? "assets/sprites/games/08-three-chests/gold.png" : "assets/sprites/games/08-three-chests/empty.png");
      const marks = [];
      if (open && index === reveal.human) marks.push("ученик");
      if (open && index === reveal.computer) marks.push("компьютер");
      const label = marks.join(" · ") || String(index + 1);
      const gold = open && index === reveal.treasure ? " is-gold" : "";
      if (!opening) {
        return `<button class="choice chest-choice" data-action="move" data-move="${index}"><img src="${src}" alt=""><span>${label}</span></button>`;
      }
      return `<div class="choice chest-choice${gold}"><img class="${view.phase === "spin" ? "is-spin" : ""}" src="${src}" alt=""><span>${view.phase === "spin" ? String(index + 1) : label}</span></div>`;
    }).join("")}</div>`;
  } else if (view.phase === "choose") {
    board = `<div class="choice-row ${moves.length === 2 ? "two" : moves.length === 1 ? "one" : ""}">${moves.map(([id, label]) =>
      `<button class="choice" data-action="move" data-move="${id}">${esc(label)}</button>`).join("")}</div>`;
  } else if (match.gameId === "03-dice-duel" && view.reveal) {
    const spinning = view.phase === "spin";
    const die = (side, value) => {
      const file = spinning
        ? "assets/sprites/games/03-dice-duel/spin.png"
        : `assets/sprites/games/03-dice-duel/face-${side}-${value}.png`;
      return `<div class="die-slot"><img class="die ${spinning ? "is-spin" : ""}" src="${file}" alt="">${spinning ? "" : `<strong>${value}</strong>`}</div>`;
    };
    board = `<div class="reveal-board">${die("human", view.reveal.human)}<div class="vs-word">VS</div>${die("computer", view.reveal.computer)}</div>`;
  } else if (match.gameId === "02-coin-toss") {
    const flip = view.reveal?.flip === "heads" ? "Орёл" : "Решка";
    board = `<div class="reveal-board"><div class="token">Ваш выбор<br>${view.reveal.humanSide === "heads" ? "Орёл" : "Решка"}</div><div class="token ${view.phase === "spin" ? "spin" : ""}">${view.phase === "spin" ? "…" : flip}</div><div class="token">Компьютер<br>${view.reveal.computerSide === "heads" ? "Орёл" : "Решка"}</div></div>`;
  } else if (view.reveal) {
    board = `<div class="reveal-board"><div class="token">${esc(RPS_LABEL[view.reveal.human])}</div><div class="vs-word">VS</div><div class="token">${esc(RPS_LABEL[view.reveal.computer])}</div></div>`;
  }
  const next = match.status === "finished"
    ? `<button class="btn btn-primary" data-action="to-match">К итогу матча</button>`
    : (view.phase === "reveal" ? `<button class="btn btn-primary" data-action="next-round">Следующий раунд</button>` : "");
  return `
    <div class="play-layout">
      <div>
        <div class="page-head"><div><h2>${esc(game?.title || "Игра")}</h2><p>${esc(game?.behavior || "")}</p></div></div>
        <section class="score-hero">
          <div class="score-side"><span>${esc(person?.initials || "Ученик")}</span><div class="score-num human">${match.humanWins}</div></div>
          <div>до ${state.settings.matchWins}<div class="banner-note">Ничьи матча: ${match.draws}</div></div>
          <div class="score-side right"><span>Компьютер</span><div class="score-num cpu">${match.computerWins}</div></div>
        </section>
        ${board}
        ${view.phase === "reveal" ? `<div class="result-word ${tone}">${esc(word)}</div>` : ""}
        <div class="toolbar">
          <button class="btn btn-danger" data-action="ask-stop">Прервать матч</button>
          <button class="btn btn-danger" data-action="ask-refuse">Отказался</button>
          ${next}
        </div>
      </div>
      <aside class="panel">
        <h3>Пара</h3>
        <div class="vs-mini">${avatar(person)}<div class="vs-word">VS</div>${avatar(null)}</div>
        <p class="rules">${esc(game?.summary || "")}</p>
        <p class="banner-note">Общий счёт ${state.session.humanWins}:${state.session.computerWins}, ничьи завершённых матчей: ${state.session.draws}.</p>
      </aside>
    </div>`;
}

function screenMatch() {
  const match = state.match;
  if (!match) return `<p>Нет завершённого матча.</p><button class="btn" data-action="nav" data-screen="students">К ученикам</button>`;
  const person = findParticipant(state, match.participantId);
  const humanWon = match?.winner === "human";
  const phase = competitionPhase(state);
  return `
    <section class="vs-stage">
      <div class="fighter">${avatar(person, "is-xl")}
        <h2>${esc(person?.initials || "Ученик")}</h2>
        <small>${match?.humanWins ?? 0} побед в раундах</small>
      </div>
      <div>
        <div class="vs-word">VS</div>
        <div class="result-word ${humanWon ? "human" : "computer"}">${humanWon ? "Победил ученик" : "Победил компьютер"}</div>
        <p>Ничьих в матче: ${match?.draws ?? 0}</p>
      </div>
      <div class="fighter">${avatar(null, `is-xl avatar-robot ${humanWon ? "" : "is-glow"}`)}
        <h2>Компьютер</h2>
        <small>${match?.computerWins ?? 0} побед в раундах</small>
      </div>
    </section>
    <p style="text-align:center">${phaseNote()}</p>
    <div class="toolbar" style="justify-content:center">
      <button class="btn btn-primary" data-action="next-player">Следующий ученик</button>
      ${phase === "final" ? `<button class="btn" data-action="nav" data-screen="final">Итог соревнования</button>` : ""}
      <button class="btn" data-action="nav" data-screen="stats">Статистика</button>
    </div>`;
}

function screenFinal() {
  const winners = state.team.participants.filter((person) =>
    state.session.matches.some((match) => match.participantId === person.id && match.winner === "human"));
  const side = state.session.winnerLocked === "human" ? "Люди" : "Компьютер";
  return `
    <div class="page-head"><div><h2>Итог соревнования</h2><p>Победитель зафиксирован при достижении цели и дальше не менялся: ${side}.</p></div></div>
    ${scoreHero()}
    <section class="panel">
      <h3>Ученики, выигравшие хотя бы один матч</h3>
      <div class="faces">${winners.map((person) => `<div class="face-chip">${avatar(person, "is-lg")}<span>${esc(person.initials)}</span></div>`).join("") || "<p>Таких матчей не было.</p>"}</div>
    </section>
    <div class="toolbar"><button class="btn" data-action="nav" data-screen="home">На главную</button></div>`;
}

function screenStats() {
  const rows = state.team.participants.map((person) => {
    const session = participantStats(state.session.matches, person.id);
    const life = participantStats(state.lifetime.matches, person.id);
    return `<tr><td>${esc(person.initials)}</td><td>${person.disabled ? "выкл" : "в игре"}</td><td>${session.matches}</td><td>${session.wins}</td><td>${session.losses}</td><td>${session.draws}</td><td>${life.wins}</td><td>${life.draws}</td></tr>`;
  }).join("");
  const history = [...state.lifetime.matches].reverse().slice(0, 30).map((match) => {
    const person = findParticipant(state, match.participantId);
    const game = gameById(match.gameId);
    return `<div class="history-item"><strong>${esc(person?.initials || match.participantId)}</strong><span>${esc(game?.title || match.gameId)}</span><span>${match.winner === "human" ? "ученик" : "компьютер"} ${match.humanWins}:${match.computerWins}</span><span>ничьи ${match.draws}</span></div>`;
  }).join("");
  return `
    <div class="page-head"><div><h2>Статистика</h2><p>Ничья — отдельный исход. Она не входит в победы.</p></div></div>
    <div class="stat-grid">
      <section class="panel"><h3>Люди, сессия</h3><strong>${state.session.humanWins}</strong></section>
      <section class="panel"><h3>Компьютер, сессия</h3><strong>${state.session.computerWins}</strong></section>
      <section class="panel"><h3>Ничьи, сессия / всё время</h3><strong>${state.session.draws} / ${state.lifetime.draws}</strong></section>
      <section class="panel"><h3>Ещё не играли</h3><strong>${pendingParticipants(state).length}</strong></section>
    </div>
    <section class="panel" style="margin-bottom:14px">
      <h3>Ученики</h3>
      <table class="table"><thead><tr><th>Ученик</th><th>Статус</th><th>Матчи</th><th>Победы</th><th>Поражения</th><th>Ничьи</th><th>Победы всего</th><th>Ничьи всего</th></tr></thead><tbody>${rows}</tbody></table>
    </section>
    <section class="panel"><h3>История матчей</h3><div class="history">${history || "<p>Матчей пока нет.</p>"}</div></section>`;
}

function screenSettings() {
  return `
    <div class="page-head"><div><h2>Настройки</h2><p>Пороги можно менять в любой момент. Уже зафиксированный победитель соревнования не сменится.</p></div></div>
    <section class="panel" style="max-width:520px">
      <label class="field">Побед в личном матче<input id="match-wins" type="number" min="1" max="99" value="${state.settings.matchWins}"></label>
      <label class="field">Цель общего соревнования<input id="session-goal" type="number" min="1" max="999" value="${state.settings.sessionGoal}"></label>
      <div class="stack">
        <button class="btn btn-primary" data-action="save-settings">Сохранить</button>
        <button class="btn" data-action="ask-new">Новое соревнование</button>
        <button class="btn btn-danger" data-action="ask-reset">Сбросить статистику</button>
        <label class="btn" style="text-align:center">Импорт полного списка<input id="import-file" hidden type="file" accept="application/json,.json"></label>
      </div>
      <p class="banner-note">Новое соревнование обнуляет текущий счёт и оставляет результаты за всё время. Полный сброс очищает и их. Состав и аватары остаются. Полные имена из файла хранятся только в этом браузере.</p>
    </section>`;
}

function modalHtml() {
  if (!view.modal) return "";
  if (view.modal.type === "avatar") {
    const person = findParticipant(state, view.modal.id);
    const cells = Array.from({ length: 29 }, (_, index) => {
      const id = index + 1;
      return `<button class="avatar-pick ${person?.avatarId === id ? "is-on" : ""}" data-action="pick-avatar" data-avatar="${id}"><span class="avatar" style="--hue:${(id * 47) % 360}"><b>${id}</b></span></button>`;
    }).join("");
    return `<div class="modal"><div class="dialog"><h2>Аватар для ${esc(person?.initials || "")}</h2><p class="banner-note">29 персонажей. Робот закреплён за компьютером. Пока вместо рисунков — цвет и номер.</p><div class="avatar-grid">${cells}</div><div class="toolbar"><button class="btn" data-action="close-modal">Закрыть</button></div></div></div>`;
  }
  const texts = {
    leave: ["Уйти с матча?", "Текущий матч будет прерван. Очки никому не начислятся.", "Прервать", "leave-yes"],
    stop: ["Прервать матч?", "Сыгранные раунды этого матча не попадут в счёт.", "Прервать", "stop-yes"],
    refuse: ["Ученик отказался?", "Матч отменится, ученик будет отключён, победа и ничья не запишутся.", "Отключить", "refuse-yes"],
    reset: ["Сбросить статистику?", "Сессия и результаты за всё время будут удалены. Состав останется.", "Сбросить", "reset-yes"],
    "new": ["Начать новое соревнование?", "Текущий счёт обнулится. История за всё время сохранится.", "Начать заново", "new-yes"]
  };
  const [title, text, ok, action] = texts[view.modal.type];
  return `<div class="modal"><div class="dialog"><h2>${title}</h2><p>${text}</p><div class="toolbar"><button class="btn btn-danger" data-action="${action}">${ok}</button><button class="btn" data-action="close-modal">Остаться</button></div></div></div>`;
}

function render() {
  const screens = {
    home: screenHome,
    students: screenStudents,
    vs: screenVs,
    games: screenGames,
    intro: screenIntro,
    play: screenPlay,
    match: screenMatch,
    final: screenFinal,
    stats: screenStats,
    settings: screenSettings
  };
  const draw = screens[view.screen] || screenHome;
  const focus = document.activeElement?.dataset?.focus;
  const caret = document.activeElement?.selectionStart;
  app.innerHTML = shell(draw());
  const search = focus ? app.querySelector(`[data-focus="${focus}"]`) : null;
  if (search) {
    search.focus();
    if (caret != null) search.setSelectionRange(caret, caret);
  }
  const file = app.querySelector("#import-file");
  if (file) file.addEventListener("change", onImport);
}

function prepareRound() {
  view.phase = "choose";
  view.reveal = null;
  view.roundStartedAt = Date.now();
  if (state.match?.gameId === "01-rock-paper-scissors") view.secret = beginRps(fairUnit);
  else if (state.match?.gameId === "08-three-chests") view.secret = beginChests(fairUnit);
  else view.secret = null;
}

function onMove(move) {
  if (view.phase !== "choose" || state.match?.status !== "playing") return;
  if (state.match.gameId === "01-rock-paper-scissors") {
    const result = view.secret.play(move);
    view.reveal = result;
    view.phase = "reveal";
    applyRound(state, {
      winner: result.winner,
      elapsedMs: Date.now() - view.roundStartedAt,
      detail: { human: result.human, computer: result.computer }
    });
    view.secret = null;
    persist();
    return;
  }
  if (state.match.gameId === "08-three-chests") {
    const result = view.secret.play(move);
    applyRound(state, {
      winner: result.winner,
      elapsedMs: Date.now() - view.roundStartedAt,
      detail: { human: result.human, computer: result.computer, treasure: result.treasure }
    });
    view.reveal = result;
    view.secret = null;
    view.phase = "spin";
    if (!saveState(state)) view.notice = "Не удалось записать данные в браузер.";
    render();
    clearTimeout(timer);
    timer = setTimeout(() => {
      view.phase = "reveal";
      render();
    }, 700);
    return;
  }
  if (state.match.gameId === "03-dice-duel") {
    const result = resolveDice(fairUnit);
    applyRound(state, {
      winner: result.winner,
      elapsedMs: Date.now() - view.roundStartedAt,
      detail: { human: result.human, computer: result.computer }
    });
    view.reveal = result;
    view.phase = "spin";
    if (!saveState(state)) view.notice = "Не удалось записать данные в браузер.";
    render();
    clearTimeout(timer);
    timer = setTimeout(() => {
      view.phase = "reveal";
      render();
    }, 700);
    return;
  }
  const result = resolveCoin(move, fairUnit);
  applyRound(state, {
    winner: result.winner,
    elapsedMs: Date.now() - view.roundStartedAt,
    detail: { humanSide: result.humanSide, computerSide: result.computerSide, flip: result.flip }
  });
  view.reveal = result;
  view.phase = "spin";
  if (!saveState(state)) view.notice = "Не удалось записать данные в браузер.";
  render();
  clearTimeout(timer);
  timer = setTimeout(() => {
    view.phase = "reveal";
    render();
  }, 700);
}

async function onImport(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const result = importTeam(state, data);
    if (!result.ok) {
      view.notice = "В файле нет списка учеников с id и инициалами.";
      render();
      return;
    }
    persist(`Список обновлён: ${result.count}. Полные имена остаются только в этом браузере.`);
  } catch {
    view.notice = "Файл не удалось прочитать как JSON.";
    render();
  }
}

function onClick(event) {
  const node = event.target.closest("[data-action]");
  if (!node) return;
  const action = node.dataset.action;
  if (action === "nav") requestScreen(node.dataset.screen);
  if (action === "filter") { view.filter = node.dataset.filter; render(); }
  if (action === "select") { view.selectedId = node.dataset.id; render(); }
  if (action === "random-student") {
    const person = pickRandom(activeParticipants(state), fairUnit);
    if (!person) view.notice = "Нет активных учеников.";
    else view.selectedId = person.id;
    render();
  }
  if (action === "toggle") {
    const person = selectedPerson();
    if (!person) return;
    const turningOff = !person.disabled;
    setDisabled(state, person.id, turningOff);
    persist(turningOff ? `${person.initials} отключён, очки не менялись.` : `${person.initials} снова в игре.`);
  }
  if (action === "avatar") {
    if (!selectedPerson()) return;
    view.modal = { type: "avatar", id: view.selectedId };
    render();
  }
  if (action === "pick-avatar") {
    setAvatar(state, view.modal.id, Number(node.dataset.avatar));
    view.modal = null;
    persist();
  }
  if (action === "close-modal") { view.modal = null; render(); }
  if (action === "to-vs") go("vs");
  if (action === "select-game") { view.selectedGameId = node.dataset.game; render(); }
  if (action === "random-game") {
    view.selectedGameId = pickRandom(GAMES, fairUnit).id;
    render();
  }
  if (action === "to-intro") go("intro");
  if (action === "start-match") {
    const started = startMatch(state, view.selectedId, view.selectedGameId, { allowedGameIds: GAME_IDS });
    if (!started.ok) {
      view.notice = "Матч не начат.";
      render();
      return;
    }
    prepareRound();
    persist();
    go("play");
  }
  if (action === "move") onMove(node.dataset.move);
  if (action === "next-round") { prepareRound(); render(); }
  if (action === "to-match") go("match");
  if (action === "next-player") {
    clearFinishedMatch(state);
    if (!saveState(state)) view.notice = "Не удалось записать данные в браузер.";
    go(competitionPhase(state) === "final" ? "final" : "students");
  }
  if (action === "save-settings") {
    const result = updateSettings(state, {
      matchWins: Number(document.querySelector("#match-wins").value),
      sessionGoal: Number(document.querySelector("#session-goal").value)
    });
    view.modal = null;
    if (result.matchFinished) {
      persist("Порог матча уже достигнут, матч завершён.");
      go("match");
      return;
    }
    persist("Настройки сохранены.");
  }
  if (action === "refuse") {
    setDisabled(state, view.selectedId, true);
    persist("Ученик отключён. Очки не начислялись.");
    go("students");
  }
  if (action === "ask-stop") { view.modal = { type: "stop" }; render(); }
  if (action === "ask-refuse") { view.modal = { type: "refuse" }; render(); }
  if (action === "ask-reset") { view.modal = { type: "reset" }; render(); }
  if (action === "ask-new") { view.modal = { type: "new" }; render(); }
  if (action === "leave-yes") {
    const target = view.modal?.target || "students";
    clearTimeout(timer);
    cancelMatch(state);
    view.modal = null;
    if (!saveState(state)) view.notice = "Не удалось записать данные в браузер.";
    else view.notice = "Матч прерван без очков.";
    go(target);
  }
  if (action === "stop-yes") {
    clearTimeout(timer);
    cancelMatch(state);
    view.modal = null;
    persist("Матч прерван без очков.");
    go("students");
  }
  if (action === "refuse-yes") {
    clearTimeout(timer);
    const person = findParticipant(state, state.match?.participantId);
    cancelMatch(state, { disable: true });
    view.modal = null;
    persist(person ? `${person.initials} отключён. Очки не начислялись.` : "Ученик отключён.");
    go("students");
  }
  if (action === "reset-yes") {
    resetStatistics(state);
    view.modal = null;
    persist("Статистика сброшена.");
  }
  if (action === "new-yes") {
    newCompetition(state);
    view.modal = null;
    persist("Новое соревнование. Прошлые итоги сохранены во «всё время».");
  }
}

document.addEventListener("click", onClick);

function boot() {
  const preset = globalThis.TEAM_PRESET;
  if (!preset) {
    app.innerHTML = `<main class="stage"><h2>Не найден список класса</h2><p>Рядом со страницей должен лежать файл assets/data/team-6.js.</p></main>`;
    return;
  }
  const loaded = loadState(preset);
  state = loaded.state;
  view.notice = loaded.notice;
  if (state.match?.participantId) view.selectedId = state.match.participantId;
  if (state.match?.gameId && gameById(state.match.gameId)) view.selectedGameId = state.match.gameId;
  const hash = location.hash.replace("#", "");
  const allowed = ["home", "students", "vs", "games", "intro", "play", "match", "final", "stats", "settings"];
  if (state.match?.status === "playing") {
    prepareRound();
    view.screen = "play";
  } else if (allowed.includes(hash)) view.screen = hash;
  if (!saveState(state) && !view.notice) view.notice = "Браузер не сохраняет данные. Счёт пропадёт после закрытия вкладки.";
  render();
}

boot();
})();

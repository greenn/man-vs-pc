(() => {
const GAMES = [
  {
    id: "01-rock-paper-scissors",
    title: "Камень, ножницы, бумага",
    summary: "Камень побеждает ножницы, ножницы побеждают бумагу, бумага побеждает камень. Одинаковые знаки — ничья.",
    kind: "Выбор",
    tags: ["Выбор", "Быстрая игра"],
    behavior: "Компьютер выбирает знак случайно и заранее, до вашего хода."
  },
  {
    id: "02-coin-toss",
    title: "Орёл или решка",
    summary: "Вы называете сторону монеты. Компьютер берёт другую. Побеждает та сторона, которая выпала.",
    kind: "Случайность",
    tags: ["Случайность", "Быстрая игра"],
    behavior: "Сторона компьютера противоположна вашей. Бросок монеты случайный, от анимации не зависит."
  },
  {
    id: "03-dice-duel",
    title: "Битва кубиков",
    summary: "Оба бросают по одному кубику. Побеждает большее значение. Одинаковые значения — ничья.",
    kind: "Случайность",
    tags: ["Случайность", "Быстрая игра"],
    behavior: "Кубик компьютера бросается отдельно и честно. Вращение только показывает уже выпавшие значения."
  },
  {
    id: "08-three-chests",
    title: "Три сундука",
    summary: "Золото спрятано в одном из трёх сундуков. Компьютер выбирает сундук заранее. Побеждает тот, кто единственный нашёл золото.",
    kind: "Выбор",
    tags: ["Выбор", "Быстрая игра"],
    behavior: "Компьютер выбирает сундук до вашего нажатия и не видит ваш выбор. Одинаковый успех или общий промах — ничья."
  }
];

const GAME_IDS = GAMES.map((game) => game.id);

function gameById(id) {
  return GAMES.find((game) => game.id === id) || null;
}

const RPS = ["rock", "paper", "scissors"];

const RPS_LABEL = {
  rock: "Камень",
  paper: "Бумага",
  scissors: "Ножницы"
};

function judgeRps(human, computer) {
  if (human === computer) return "draw";
  const humanWins = (human === "rock" && computer === "scissors")
    || (human === "scissors" && computer === "paper")
    || (human === "paper" && computer === "rock");
  return humanWins ? "human" : "computer";
}

function computerRps(rng = Math.random) {
  return RPS[Math.min(2, Math.floor(rng() * 3))];
}

function beginRps(rng = Math.random) {
  const computer = computerRps(rng);
  return {
    computer,
    play(human) {
      if (!RPS.includes(human)) throw new Error("move");
      return { human, computer, winner: judgeRps(human, computer) };
    }
  };
}

function resolveCoin(humanSide, rng = Math.random) {
  if (humanSide !== "heads" && humanSide !== "tails") throw new Error("side");
  const computerSide = humanSide === "heads" ? "tails" : "heads";
  const flip = rng() < 0.5 ? "heads" : "tails";
  return {
    humanSide,
    computerSide,
    flip,
    winner: flip === humanSide ? "human" : "computer"
  };
}

function rollDie(rng) {
  return 1 + Math.min(5, Math.floor(rng() * 6));
}

function resolveDice(rng = Math.random) {
  const human = rollDie(rng);
  const computer = rollDie(rng);
  return {
    human,
    computer,
    winner: human === computer ? "draw" : (human > computer ? "human" : "computer")
  };
}

function pickChest(rng) {
  return Math.min(2, Math.floor(rng() * 3));
}

function beginChests(rng = Math.random) {
  const treasure = pickChest(rng);
  const computer = pickChest(rng);
  return {
    treasure,
    computer,
    play(human) {
      const choice = Number(human);
      if (choice !== 0 && choice !== 1 && choice !== 2) throw new Error("chest");
      const humanHit = choice === treasure;
      const computerHit = computer === treasure;
      let winner = "draw";
      if (humanHit && !computerHit) winner = "human";
      else if (computerHit && !humanHit) winner = "computer";
      return { human: choice, computer, treasure, winner };
    }
  };
}

function fairUnit() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

Object.assign(globalThis.ManVsPc = globalThis.ManVsPc || {}, {
  GAMES,
  GAME_IDS,
  gameById,
  RPS,
  RPS_LABEL,
  judgeRps,
  computerRps,
  beginRps,
  resolveCoin,
  resolveDice,
  beginChests,
  fairUnit
});
})();

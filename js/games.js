export const GAMES = [
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
  }
];

export const GAME_IDS = GAMES.map((game) => game.id);

export function gameById(id) {
  return GAMES.find((game) => game.id === id) || null;
}

export const RPS = ["rock", "paper", "scissors"];

export const RPS_LABEL = {
  rock: "Камень",
  paper: "Бумага",
  scissors: "Ножницы"
};

export function judgeRps(human, computer) {
  if (human === computer) return "draw";
  const humanWins = (human === "rock" && computer === "scissors")
    || (human === "scissors" && computer === "paper")
    || (human === "paper" && computer === "rock");
  return humanWins ? "human" : "computer";
}

export function computerRps(rng = Math.random) {
  return RPS[Math.min(2, Math.floor(rng() * 3))];
}

export function beginRps(rng = Math.random) {
  const computer = computerRps(rng);
  return {
    computer,
    play(human) {
      if (!RPS.includes(human)) throw new Error("move");
      return { human, computer, winner: judgeRps(human, computer) };
    }
  };
}

export function resolveCoin(humanSide, rng = Math.random) {
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

export function fairUnit() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

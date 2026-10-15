import assert from "node:assert/strict";
import test from "node:test";
import {
  applyRound,
  cancelMatch,
  competitionPhase,
  createState,
  importTeam,
  newCompetition,
  parseStored,
  resetStatistics,
  startMatch,
  updateSettings
} from "../js/model.js";
import { beginRps, judgeRps, resolveCoin } from "../js/games.js";

function team(ids, disabled = []) {
  return {
    teamId: "6",
    teamName: "6 класс",
    participants: ids.map((id) => ({
      id,
      initials: id,
      avatarId: null,
      disabled: disabled.includes(id)
    }))
  };
}

function play(state, winner) {
  return applyRound(state, { winner, elapsedMs: 10, detail: { winner } });
}

test("ничья не закрывает матч и не даёт очко общему счёту", () => {
  const state = createState(team(["a", "b"]));
  state.settings.matchWins = 2;
  startMatch(state, "a", "01-rock-paper-scissors", { allowedGameIds: ["01-rock-paper-scissors"] });
  play(state, "human");
  const drawn = play(state, "draw");
  assert.equal(drawn.matchFinished, false);
  assert.equal(state.match.draws, 1);
  assert.equal(state.session.humanWins, 0);
  assert.equal(state.session.draws, 0);
  const done = play(state, "human");
  assert.equal(done.winner, "human");
  assert.equal(state.session.humanWins, 1);
  assert.equal(state.session.draws, 1);
  assert.equal(state.lifetime.draws, 1);
  assert.equal(state.match.rounds.filter((round) => round.winner === "draw").length, 1);
});

test("две победы раундов дают одно очко, победа компьютера тоже одно", () => {
  const state = createState(team(["a"]));
  startMatch(state, "a", "02-coin-toss");
  play(state, "computer");
  const done = play(state, "computer");
  assert.equal(done.winner, "computer");
  assert.equal(state.session.computerWins, 1);
  assert.equal(state.session.humanWins, 0);
  assert.equal(state.lifetime.matches.length, 1);
});

test("повтор участника разрешён", () => {
  const state = createState(team(["a", "b"]));
  state.settings.matchWins = 1;
  startMatch(state, "a", "02-coin-toss");
  play(state, "human");
  const again = startMatch(state, "a", "02-coin-toss");
  assert.equal(again.ok, true);
  play(state, "human");
  assert.equal(state.session.matches.filter((match) => match.participantId === "a").length, 2);
});

test("отказ отключает ученика и не пишет победу или ничью", () => {
  const state = createState(team(["a", "b"]));
  startMatch(state, "a", "01-rock-paper-scissors");
  play(state, "draw");
  play(state, "human");
  cancelMatch(state, { disable: true });
  assert.equal(state.match, null);
  assert.equal(state.session.matches.length, 0);
  assert.equal(state.session.humanWins, 0);
  assert.equal(state.session.draws, 0);
  assert.equal(state.team.participants.find((person) => person.id === "a").disabled, true);
  assert.equal(startMatch(state, "a", "02-coin-toss").error, "disabled");
});

test("цель фиксирует сторону, финал ждёт остальных активных", () => {
  const state = createState(team(["a", "b", "c"]));
  state.settings.matchWins = 1;
  state.settings.sessionGoal = 2;
  startMatch(state, "a", "g");
  play(state, "human");
  assert.equal(competitionPhase(state), "ongoing");
  startMatch(state, "b", "g");
  play(state, "human");
  assert.equal(state.session.winnerLocked, "human");
  assert.equal(competitionPhase(state), "overtime");
  startMatch(state, "c", "g");
  play(state, "computer");
  assert.equal(state.session.winnerLocked, "human");
  assert.equal(state.session.computerWins, 1);
  assert.equal(state.session.humanWins, 2);
  assert.equal(competitionPhase(state), "final");
});

test("если все сыграли раньше цели, соревнование продолжается", () => {
  const state = createState(team(["a"]));
  state.settings.matchWins = 1;
  state.settings.sessionGoal = 3;
  startMatch(state, "a", "g");
  play(state, "human");
  assert.equal(competitionPhase(state), "ongoing");
  assert.equal(state.session.winnerLocked, null);
});

test("отключение последнего несыгравшего после фиксации открывает финал", () => {
  const state = createState(team(["a", "b"]));
  state.settings.matchWins = 1;
  state.settings.sessionGoal = 1;
  startMatch(state, "a", "g");
  play(state, "computer");
  assert.equal(competitionPhase(state), "overtime");
  cancelMatch(state, { participantId: "b", disable: true });
  state.team.participants.find((person) => person.id === "b").disabled = true;
  assert.equal(competitionPhase(state), "final");
});

test("новое соревнование сохраняет историю за всё время", () => {
  const state = createState(team(["a"]));
  state.settings.matchWins = 1;
  startMatch(state, "a", "g");
  play(state, "human");
  newCompetition(state);
  assert.equal(state.session.humanWins, 0);
  assert.equal(state.session.matches.length, 0);
  assert.equal(state.lifetime.humanWins, 1);
  resetStatistics(state);
  assert.equal(state.lifetime.humanWins, 0);
});

test("снижение цели фиксирует лидера и не меняет уже зафиксированного", () => {
  const state = createState(team(["a"]));
  state.session.humanWins = 3;
  state.session.computerWins = 1;
  updateSettings(state, { matchWins: 2, sessionGoal: 3 });
  assert.equal(state.session.winnerLocked, "human");
  state.session.computerWins = 9;
  updateSettings(state, { matchWins: 2, sessionGoal: 3 });
  assert.equal(state.session.winnerLocked, "human");
});

test("импорт сохраняет аватар по id и принимает локальное имя", () => {
  const state = createState(team(["6-01"]));
  state.team.participants[0].avatarId = 21;
  const result = importTeam(state, {
    teamName: "6 класс",
    participants: [{ id: "6-01", initials: "АВ", fullName: "Анна Пример", avatarId: null, disabled: false }]
  });
  assert.equal(result.ok, true);
  assert.equal(state.team.participants[0].avatarId, 21);
  assert.equal(state.team.participants[0].fullName, "Анна Пример");
});

test("повреждённые и чужие данные отклоняются", () => {
  assert.equal(parseStored("{").ok, false);
  assert.equal(parseStored(JSON.stringify({ schemaVersion: 0, team: { participants: [] } })).ok, false);
  const fresh = createState(team(["a"]));
  const parsed = parseStored(JSON.stringify(fresh));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.state.team.participants[0].id, "a");
});

test("камень-ножницы-бумага: компьютер зафиксирован до хода человека", () => {
  const round = beginRps(() => 0);
  assert.equal(round.computer, "rock");
  assert.equal(round.play("paper").winner, "human");
  assert.equal(round.play("rock").winner, "draw");
  assert.equal(round.play("scissors").winner, "computer");
  assert.equal(judgeRps("scissors", "paper"), "human");
});

test("монета: компьютер на противоположной стороне, ничьи нет", () => {
  const heads = resolveCoin("heads", () => 0);
  assert.equal(heads.computerSide, "tails");
  assert.equal(heads.flip, "heads");
  assert.equal(heads.winner, "human");
  const tails = resolveCoin("heads", () => 0.9);
  assert.equal(tails.flip, "tails");
  assert.equal(tails.winner, "computer");
});

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "man-vs-pc";

export function emptySession() {
  return {
    humanWins: 0,
    computerWins: 0,
    draws: 0,
    winnerLocked: null,
    matches: []
  };
}

export function emptyLifetime() {
  return {
    humanWins: 0,
    computerWins: 0,
    draws: 0,
    matches: []
  };
}

function asBool(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function normalizeParticipant(raw) {
  if (!raw || typeof raw.id !== "string" || !raw.id.trim()) return null;
  const initials = String(raw.initials || "").trim();
  if (!initials) return null;
  let avatarId = null;
  if (raw.avatarId != null && raw.avatarId !== "") {
    const n = Number(raw.avatarId);
    if (Number.isInteger(n) && n >= 1 && n <= 29) avatarId = n;
  }
  const nameSource = typeof raw.fullName === "string" ? raw.fullName : raw.name;
  const fullName = typeof nameSource === "string" ? nameSource.trim() : "";
  return {
    id: raw.id.trim(),
    initials,
    fullName,
    avatarId,
    disabled: asBool(raw.disabled)
  };
}

export function assignAvatars(participants) {
  const used = new Set(
    participants.map((p) => p.avatarId).filter((id) => id != null)
  );
  let next = 1;
  for (const person of participants) {
    if (person.avatarId != null) continue;
    while (used.has(next) && next <= 29) next += 1;
    person.avatarId = next <= 29 ? next : ((participants.indexOf(person) % 29) + 1);
    used.add(person.avatarId);
    if (next <= 29) next += 1;
  }
  return participants;
}

export function createState(teamInput) {
  const source = Array.isArray(teamInput?.participants) ? teamInput.participants : [];
  const participants = [];
  const seen = new Set();
  for (const raw of source) {
    const person = normalizeParticipant(raw);
    if (!person || seen.has(person.id)) continue;
    seen.add(person.id);
    participants.push(person);
  }
  assignAvatars(participants);
  return {
    schemaVersion: SCHEMA_VERSION,
    team: {
      teamId: String(teamInput?.teamId || "6"),
      teamName: String(teamInput?.teamName || "6 класс"),
      participants
    },
    settings: { matchWins: 2, sessionGoal: 10 },
    session: emptySession(),
    lifetime: emptyLifetime(),
    match: null
  };
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isInteger(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function activeParticipants(state) {
  return state.team.participants.filter((person) => !person.disabled);
}

export function playedIds(session) {
  return new Set(session.matches.map((match) => match.participantId));
}

export function pendingParticipants(state) {
  const played = playedIds(state.session);
  return activeParticipants(state).filter((person) => !played.has(person.id));
}

export function competitionPhase(state) {
  if (!activeParticipants(state).length) return "no-players";
  const waiting = pendingParticipants(state).length > 0;
  if (state.session.winnerLocked && !waiting) return "final";
  if (state.session.winnerLocked && waiting) return "overtime";
  return "ongoing";
}

export function maybeLock(session, goal) {
  if (session.winnerLocked) return session.winnerLocked;
  const humanReached = session.humanWins >= goal;
  const computerReached = session.computerWins >= goal;
  if (humanReached && !computerReached) session.winnerLocked = "human";
  else if (computerReached && !humanReached) session.winnerLocked = "computer";
  else if (humanReached && computerReached && session.humanWins !== session.computerWins) {
    session.winnerLocked = session.humanWins > session.computerWins ? "human" : "computer";
  }
  return session.winnerLocked;
}

export function findParticipant(state, id) {
  return state.team.participants.find((person) => person.id === id) || null;
}

export function setDisabled(state, id, disabled) {
  const person = findParticipant(state, id);
  if (!person) return { ok: false, error: "missing" };
  person.disabled = Boolean(disabled);
  return { ok: true };
}

export function setAvatar(state, id, avatarId) {
  const person = findParticipant(state, id);
  const n = Number(avatarId);
  if (!person || !Number.isInteger(n) || n < 1 || n > 29) return { ok: false, error: "avatar" };
  person.avatarId = n;
  return { ok: true };
}

export function importTeam(state, data) {
  const list = Array.isArray(data) ? data : data?.participants;
  if (!Array.isArray(list)) return { ok: false, error: "format" };
  const previous = new Map(state.team.participants.map((person) => [person.id, person]));
  const participants = [];
  const seen = new Set();
  for (const raw of list) {
    const person = normalizeParticipant(raw);
    if (!person || seen.has(person.id)) continue;
    seen.add(person.id);
    if (person.avatarId == null && previous.get(person.id)?.avatarId) {
      person.avatarId = previous.get(person.id).avatarId;
    }
    if (!person.fullName && previous.get(person.id)?.fullName) {
      person.fullName = previous.get(person.id).fullName;
    }
    participants.push(person);
  }
  if (!participants.length) return { ok: false, error: "empty" };
  assignAvatars(participants);
  state.team = {
    teamId: String(data?.teamId || state.team.teamId || "6"),
    teamName: String(data?.teamName || state.team.teamName || "Команда"),
    participants
  };
  if (state.match?.status === "playing" && !findParticipant(state, state.match.participantId)) {
    state.match = null;
  }
  if (state.match?.status === "playing" && findParticipant(state, state.match.participantId)?.disabled) {
    state.match = null;
  }
  return { ok: true, count: participants.length };
}

export function pickRandom(items, rng = Math.random) {
  if (!items.length) return null;
  const index = Math.min(items.length - 1, Math.floor(rng() * items.length));
  return items[index];
}

export function startMatch(state, participantId, gameId, options = {}) {
  if (state.match?.status === "playing") return { ok: false, error: "busy" };
  const person = findParticipant(state, participantId);
  if (!person) return { ok: false, error: "missing" };
  if (person.disabled) return { ok: false, error: "disabled" };
  if (options.allowedGameIds && !options.allowedGameIds.includes(gameId)) {
    return { ok: false, error: "game" };
  }
  state.match = {
    id: `m-${options.now || Date.now()}`,
    participantId,
    gameId,
    humanWins: 0,
    computerWins: 0,
    draws: 0,
    rounds: [],
    status: "playing",
    winner: null
  };
  return { ok: true };
}

function decideWinner(match, need) {
  const humanDone = match.humanWins >= need;
  const computerDone = match.computerWins >= need;
  if (humanDone && !computerDone) return "human";
  if (computerDone && !humanDone) return "computer";
  if (humanDone && computerDone && match.humanWins !== match.computerWins) {
    return match.humanWins > match.computerWins ? "human" : "computer";
  }
  return null;
}

function recordMatch(state, now) {
  const match = state.match;
  const winner = decideWinner(match, state.settings.matchWins);
  if (!winner) return { ok: true, matchFinished: false };

  const record = {
    id: match.id,
    at: now,
    participantId: match.participantId,
    gameId: match.gameId,
    winner,
    humanWins: match.humanWins,
    computerWins: match.computerWins,
    draws: match.draws,
    rounds: match.rounds.map((round) => ({ ...round }))
  };
  state.session.matches.push(record);
  state.lifetime.matches.push(record);
  state.session.draws += match.draws;
  state.lifetime.draws += match.draws;
  if (winner === "human") {
    state.session.humanWins += 1;
    state.lifetime.humanWins += 1;
  } else {
    state.session.computerWins += 1;
    state.lifetime.computerWins += 1;
  }
  match.status = "finished";
  match.winner = winner;
  maybeLock(state.session, state.settings.sessionGoal);
  return { ok: true, matchFinished: true, winner };
}

export function applyRound(state, result, now = Date.now()) {
  const match = state.match;
  if (!match || match.status !== "playing") return { ok: false, error: "no-match" };
  if (!result || !["human", "computer", "draw"].includes(result.winner)) {
    return { ok: false, error: "winner" };
  }
  match.rounds.push({
    winner: result.winner,
    gameId: match.gameId,
    elapsedMs: Number.isFinite(result.elapsedMs) ? result.elapsedMs : null,
    detail: result.detail ?? null,
    at: now
  });
  if (result.winner === "draw") {
    match.draws += 1;
    return { ok: true, matchFinished: false };
  }
  if (result.winner === "human") match.humanWins += 1;
  else match.computerWins += 1;
  if (decideWinner(match, state.settings.matchWins)) return recordMatch(state, now);
  return { ok: true, matchFinished: false };
}

export function cancelMatch(state, options = {}) {
  const id = state.match?.status === "playing" ? state.match.participantId : options.participantId;
  if (state.match?.status === "playing") state.match = null;
  if (options.disable && id) setDisabled(state, id, true);
  return { ok: true };
}

export function clearFinishedMatch(state) {
  if (state.match?.status === "finished") state.match = null;
}

export function updateSettings(state, patch, now = Date.now()) {
  state.settings.matchWins = clampInt(patch.matchWins, 1, 99, state.settings.matchWins);
  state.settings.sessionGoal = clampInt(patch.sessionGoal, 1, 999, state.settings.sessionGoal);
  maybeLock(state.session, state.settings.sessionGoal);
  if (state.match?.status === "playing") {
    const match = state.match;
    if (decideWinner(match, state.settings.matchWins)) return recordMatch(state, now);
  }
  return { ok: true, matchFinished: false };
}

export function newCompetition(state) {
  state.session = emptySession();
  state.match = null;
}

export function resetStatistics(state) {
  newCompetition(state);
  state.lifetime = emptyLifetime();
}

export function participantStats(matches, id) {
  const own = matches.filter((match) => match.participantId === id);
  return {
    matches: own.length,
    wins: own.filter((match) => match.winner === "human").length,
    losses: own.filter((match) => match.winner === "computer").length,
    draws: own.reduce((sum, match) => sum + match.draws, 0)
  };
}

export function hydrate(data) {
  const state = createState(data.team || {});
  state.settings.matchWins = clampInt(data.settings?.matchWins, 1, 99, 2);
  state.settings.sessionGoal = clampInt(data.settings?.sessionGoal, 1, 999, 10);
  const session = data.session || {};
  state.session = {
    humanWins: clampInt(session.humanWins, 0, 9999, 0),
    computerWins: clampInt(session.computerWins, 0, 9999, 0),
    draws: clampInt(session.draws, 0, 9999, 0),
    winnerLocked: session.winnerLocked === "human" || session.winnerLocked === "computer"
      ? session.winnerLocked
      : null,
    matches: Array.isArray(session.matches) ? session.matches : []
  };
  const lifetime = data.lifetime || {};
  state.lifetime = {
    humanWins: clampInt(lifetime.humanWins, 0, 99999, 0),
    computerWins: clampInt(lifetime.computerWins, 0, 99999, 0),
    draws: clampInt(lifetime.draws, 0, 99999, 0),
    matches: Array.isArray(lifetime.matches) ? lifetime.matches : []
  };
  const match = data.match;
  if (match && match.status === "playing" && findParticipant(state, match.participantId) && !findParticipant(state, match.participantId).disabled) {
    state.match = {
      id: String(match.id || `m-${Date.now()}`),
      participantId: match.participantId,
      gameId: String(match.gameId || ""),
      humanWins: clampInt(match.humanWins, 0, 99, 0),
      computerWins: clampInt(match.computerWins, 0, 99, 0),
      draws: clampInt(match.draws, 0, 99, 0),
      rounds: Array.isArray(match.rounds) ? match.rounds : [],
      status: "playing",
      winner: null
    };
  } else if (match && match.status === "finished") {
    state.match = {
      id: String(match.id || ""),
      participantId: match.participantId,
      gameId: String(match.gameId || ""),
      humanWins: clampInt(match.humanWins, 0, 99, 0),
      computerWins: clampInt(match.computerWins, 0, 99, 0),
      draws: clampInt(match.draws, 0, 99, 0),
      rounds: Array.isArray(match.rounds) ? match.rounds : [],
      status: "finished",
      winner: match.winner === "computer" ? "computer" : "human"
    };
  }
  maybeLock(state.session, state.settings.sessionGoal);
  return state;
}

export function parseStored(raw) {
  try {
    const data = JSON.parse(raw);
    if (!data || data.schemaVersion !== SCHEMA_VERSION || !Array.isArray(data.team?.participants)) {
      return { ok: false, reason: "version" };
    }
    return { ok: true, state: hydrate(data) };
  } catch {
    return { ok: false, reason: "corrupt" };
  }
}

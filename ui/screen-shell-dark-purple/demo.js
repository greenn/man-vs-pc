const people = [
  ["01", "АВ", false], ["02", "АМ", false], ["03", "БД", false], ["04", "БС", true],
  ["05", "ВЯ", false], ["06", "КС", false], ["07", "КО", false], ["08", "КВ", false],
  ["09", "НА", false], ["10", "ПА", false], ["11", "ПИ", false], ["12", "РА", false],
  ["13", "РО", false], ["14", "СА", false], ["15", "ТД", false], ["16", "ФА", false],
  ["17", "ФИ", false], ["18", "ФД", false], ["19", "ЦМ", false], ["20", "ЦА", false],
  ["21", "ЦД", false]
];
const off = new Set(["06", "07", "09", "16"]);

document.querySelector("#roster").innerHTML = people.map(([no, initials, selected]) => `
  <button class="student-card ${selected ? "is-on" : ""} ${off.has(no) ? "is-off" : ""}">
    <div class="card-no">${no}</div><i class="card-flag"></i>
    <div class="avatar" style="--hue:${(Number(no) * 47) % 360}"><b>${initials}</b></div>
    <div class="initials">${initials}</div>
    ${off.has(no) ? "<small>не играет</small>" : ""}
  </button>`).join("");

document.querySelector("#home-faces").innerHTML = people.filter(([no]) => !off.has(no)).map(([, initials, ,]) => `
  <div class="face-chip"><div class="avatar" style="--hue:${initials.charCodeAt(0) % 360}"><b>${initials}</b></div><span>${initials}</span></div>`).join("")
  + `<div class="face-chip"><div class="vs-word" style="font-size:22px">VS</div></div><div class="face-chip"><div class="avatar avatar-robot"><span class="robot-visor"></span></div><span>ПК</span></div>`;

function show(screen) {
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== screen;
  });
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.classList.toggle("is-on", button.dataset.screen === screen);
  });
}

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("[data-screen]");
  if (!button) return;
  show(button.dataset.screen);
});

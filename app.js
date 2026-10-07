const setupView = document.getElementById("setupView");
const playoffView = document.getElementById("playoffView");
const resultsView = document.getElementById("resultsView");

const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const againBtn = document.getElementById("againBtn");

const taskCount = document.getElementById("taskCount");
const taskA = document.getElementById("taskA");
const taskB = document.getElementById("taskB");
const taskAText = document.getElementById("taskAText");
const taskBText = document.getElementById("taskBText");

const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const podium = document.getElementById("podium");
const rankingList = document.getElementById("rankingList");

let tasks = [];
let comparisons = [];
let currentComparison = 0;

function addTask(value = "") {
  const row = document.createElement("div");
  row.className = "task-row";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "e.g. Finish the Behçet abstract";
  input.value = value;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "×";
  deleteBtn.title = "Delete task";

  deleteBtn.addEventListener("click", () => {
    row.remove();
    updateTaskCount();
  });

  input.addEventListener("input", updateTaskCount);

  row.append(input, deleteBtn);
  taskList.appendChild(row);
  updateTaskCount();
  input.focus();
}

function updateTaskCount() {
  const inputs = [...taskList.querySelectorAll("input")];
  const count = inputs.filter(input => input.value.trim()).length;
  taskCount.textContent = `${count} task${count === 1 ? "" : "s"}`;
  startBtn.disabled = count < 2;
}

function getTasksFromForm() {
  return [...taskList.querySelectorAll("input")]
    .map(input => input.value.trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: index,
      name,
      wins: 0
    }));
}

function createComparisons() {
  const pairs = [];

  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      pairs.push([i, j]);
    }
  }

  return pairs;
}

function startPlayoff() {
  tasks = getTasksFromForm();
  comparisons = createComparisons();
  currentComparison = 0;

  setupView.classList.add("hidden");
  resultsView.classList.add("hidden");
  playoffView.classList.remove("hidden");

  showComparison();
}

function showComparison() {
  if (currentComparison >= comparisons.length) {
    showResults();
    return;
  }

  const [aIndex, bIndex] = comparisons[currentComparison];
  const a = tasks[aIndex];
  const b = tasks[bIndex];

  taskAText.textContent = a.name;
  taskBText.textContent = b.name;

  progressText.textContent =
    `${currentComparison + 1} / ${comparisons.length}`;

  const percentage =
    (currentComparison / comparisons.length) * 100;

  progressBar.style.width = `${percentage}%`;
}

function chooseWinner(index) {
  tasks[index].wins++;
  currentComparison++;
  showComparison();
}

function showResults() {
  playoffView.classList.add("hidden");
  resultsView.classList.remove("hidden");

  const ranking = [...tasks].sort((a, b) => b.wins - a.wins);

  renderPodium(ranking);
  renderRanking(ranking);
}

function renderPodium(ranking) {
  podium.innerHTML = "";

  const places = [
    { index: 1, label: "🥈", className: "" },
    { index: 0, label: "🥇", className: "first" },
    { index: 2, label: "🥉", className: "" }
  ];

  places.forEach(place => {
    const task = ranking[place.index];
    if (!task) return;

    const item = document.createElement("div");
    item.className = `podium-place ${place.className}`;

    item.innerHTML = `
      <div class="podium-box">
        <div class="podium-rank">${place.label}</div>
        <div class="podium-name"></div>
        <div class="podium-wins">${task.wins} win${task.wins === 1 ? "" : "s"}</div>
      </div>
    `;

    item.querySelector(".podium-name").textContent = task.name;
    podium.appendChild(item);
  });
}

function renderRanking(ranking) {
  rankingList.innerHTML = "";

  ranking.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "rank-row";

    const number = document.createElement("div");
    number.className = "rank-number";
    number.textContent = `#${index + 1}`;

    const name = document.createElement("div");
    name.className = "rank-name";
    name.textContent = task.name;

    const score = document.createElement("div");
    score.className = "rank-score";
    score.textContent = `${task.wins} win${task.wins === 1 ? "" : "s"}`;

    row.append(number, name, score);
    rankingList.appendChild(row);
  });
}

function resetApp() {
  taskList.innerHTML = "";
  tasks = [];
  comparisons = [];
  currentComparison = 0;

  playoffView.classList.add("hidden");
  resultsView.classList.add("hidden");
  setupView.classList.remove("hidden");

  addTask();
  addTask();
}

addTaskBtn.addEventListener("click", () => addTask());
startBtn.addEventListener("click", startPlayoff);
taskA.addEventListener("click", () => {
  const [aIndex] = comparisons[currentComparison];
  chooseWinner(aIndex);
});
taskB.addEventListener("click", () => {
  const [, bIndex] = comparisons[currentComparison];
  chooseWinner(bIndex);
});
againBtn.addEventListener("click", resetApp);
resetBtn.addEventListener("click", resetApp);

addTask();
addTask();

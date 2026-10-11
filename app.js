"use strict";

const STORAGE_KEY = "jazz-practice-progress-v1";

const tasks = [
  {
    id: "ride-cymbal",
    title: "Make the ride cymbal breathe",
    durationMinutes: 8,
    objective: "Trade a straight rock subdivision for a relaxed, triplet-based swing pulse.",
    steps: [
      "Set a comfortable pulse around 80 BPM and count quarter notes out loud.",
      "Play the jazz ride pattern: ding, ding-da-ding. Keep beats two and four clear.",
      "Repeat for two minutes, then soften the skipped note without changing the tempo."
    ],
    completionCue: "An even quarter-note pulse underneath the pattern—not a hard, dotted rhythm."
  },
  {
    id: "hi-hat",
    title: "Anchor two and four",
    durationMinutes: 7,
    objective: "Give the groove a dependable backbeat reference without playing a rock backbeat.",
    steps: [
      "Keep the ride pattern going slowly with your right hand.",
      "Close the hi-hat with your foot on beats two and four only.",
      "Record thirty seconds and check that the hi-hat lands with the ride, not after it."
    ],
    completionCue: "A light, crisp chick on two and four while the ride pattern stays relaxed."
  },
  {
    id: "comping",
    title: "Add conversational comping",
    durationMinutes: 10,
    objective: "Introduce simple snare responses while the ride and hi-hat keep the time stable.",
    steps: [
      "Play four bars using only ride cymbal and hi-hat.",
      "In the next four bars, add one soft snare note on the & of beat two.",
      "Alternate those phrases, then move the snare note to the & of beat four."
    ],
    completionCue: "The snare feels like a comment inside the groove; the cymbal pulse never flinches."
  }
];

const taskIds = new Set(tasks.map((task) => task.id));
let completedIds = loadProgress();
let activeTaskId = tasks[0].id;

const elements = {
  taskList: document.querySelector("#task-list"),
  detailNumber: document.querySelector("#detail-number"),
  detailDuration: document.querySelector("#detail-duration"),
  detailTitle: document.querySelector("#detail-title"),
  detailObjective: document.querySelector("#detail-objective"),
  detailSteps: document.querySelector("#detail-steps"),
  detailCue: document.querySelector("#detail-cue"),
  completeButton: document.querySelector("#complete-button"),
  completeButtonIcon: document.querySelector("#complete-button .button-icon"),
  completeButtonLabel: document.querySelector("#complete-button-label"),
  completionMessage: document.querySelector("#completion-message"),
  completedCount: document.querySelector("#completed-count"),
  progressFill: document.querySelector("#progress-fill"),
  progressTrack: document.querySelector(".progress-track"),
  progressWord: document.querySelector("#progress-word"),
  progressCaption: document.querySelector("#progress-caption")
};

function loadProgress() {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return new Set();

    const parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return new Set();

    return new Set(parsedValue.filter((id) => taskIds.has(id)));
  } catch {
    return new Set();
  }
}

function saveProgress() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]));
  } catch {
    // The current session remains fully usable when storage is blocked.
  }
}

function renderTaskList() {
  elements.taskList.replaceChildren();

  tasks.forEach((task, index) => {
    const isComplete = completedIds.has(task.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `task-card${isComplete ? " is-complete" : ""}`;
    button.dataset.taskId = task.id;
    button.setAttribute("aria-current", String(task.id === activeTaskId));
    button.setAttribute("aria-label", `${task.title}, ${task.durationMinutes} minutes${isComplete ? ", complete" : ""}`);

    button.innerHTML = `
      <span class="task-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <span class="task-copy">
        <strong>${task.title}</strong>
        <span>${isComplete ? "Practice complete" : "Ready to practice"}</span>
      </span>
      <span class="task-time">${task.durationMinutes} min</span>
      <span class="task-status" aria-hidden="true">${isComplete ? "✓" : ""}</span>
    `;

    elements.taskList.append(button);
  });
}

function renderTaskDetail() {
  const taskIndex = tasks.findIndex((task) => task.id === activeTaskId);
  if (taskIndex < 0) {
    activeTaskId = tasks[0].id;
    renderTaskDetail();
    return;
  }

  const task = tasks[taskIndex];
  const isComplete = completedIds.has(task.id);

  elements.detailNumber.textContent = String(taskIndex + 1).padStart(2, "0");
  elements.detailDuration.textContent = `${task.durationMinutes} min`;
  elements.detailTitle.textContent = task.title;
  elements.detailObjective.textContent = task.objective;
  elements.detailCue.textContent = task.completionCue;
  elements.detailSteps.replaceChildren();

  task.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    elements.detailSteps.append(item);
  });

  elements.completeButton.setAttribute("aria-pressed", String(isComplete));
  elements.completeButtonIcon.textContent = isComplete ? "↺" : "✓";
  elements.completeButtonLabel.textContent = isComplete ? "Mark as not done" : "Mark practice complete";
  elements.completionMessage.textContent = isComplete ? "Done. You can change this status at any time." : "Not done yet.";
}

function renderProgress() {
  const count = completedIds.size;
  const percent = Math.round((count / tasks.length) * 100);

  elements.completedCount.textContent = String(count);
  elements.progressFill.style.width = `${percent}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(count));
  elements.progressTrack.setAttribute("aria-valuetext", `${count} of ${tasks.length} practices complete`);

  if (count === tasks.length) {
    elements.progressWord.textContent = "Complete";
    elements.progressCaption.textContent = "Session complete. Revisit any task while the feel settles in.";
  } else if (count > 0) {
    elements.progressWord.textContent = "In motion";
    elements.progressCaption.textContent = `${tasks.length - count} ${tasks.length - count === 1 ? "practice" : "practices"} left in this session.`;
  } else {
    elements.progressWord.textContent = "Ready";
    elements.progressCaption.textContent = "Start with the ride cymbal and let the quarter note breathe.";
  }
}

function render() {
  renderTaskList();
  renderTaskDetail();
  renderProgress();
}

elements.taskList.addEventListener("click", (event) => {
  const taskButton = event.target.closest("[data-task-id]");
  if (!taskButton || !elements.taskList.contains(taskButton)) return;

  const requestedTask = tasks.find((task) => task.id === taskButton.dataset.taskId);
  if (!requestedTask) return;

  const shouldRestoreFocus = event.detail === 0;
  activeTaskId = requestedTask.id;
  render();

  if (shouldRestoreFocus) {
    elements.taskList.querySelector(`[data-task-id="${requestedTask.id}"]`)?.focus();
  }

  if (window.matchMedia("(max-width: 820px)").matches) {
    document.querySelector("#task-detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

elements.completeButton.addEventListener("click", () => {
  if (!taskIds.has(activeTaskId)) return;

  if (completedIds.has(activeTaskId)) {
    completedIds.delete(activeTaskId);
  } else {
    completedIds.add(activeTaskId);
  }
  saveProgress();
  render();
});

render();

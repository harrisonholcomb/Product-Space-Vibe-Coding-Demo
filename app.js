"use strict";

(() => {
const { tasks, loadProgress, renderProgress } = window.SecondLine;
const completedIds = loadProgress();
const taskList = document.querySelector("#task-list");

tasks.forEach((task, index) => {
  const isComplete = completedIds.has(task.id);
  const link = document.createElement("a");
  link.className = `task-card${isComplete ? " is-complete" : ""}`;
  link.href = task.path;
  link.setAttribute(
    "aria-label",
    `${task.title}, ${task.durationMinutes} minutes${isComplete ? ", complete" : ""}`
  );

  link.innerHTML = `
    <span class="task-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
    <span class="task-copy">
      <strong>${task.title}</strong>
      <span>${isComplete ? "Practice complete" : "Ready to practice"}</span>
    </span>
    <span class="task-time">${task.durationMinutes} min</span>
    <span class="task-status" aria-hidden="true">${isComplete ? "✓" : ""}</span>
  `;

  taskList.append(link);
});

renderProgress(completedIds);
})();

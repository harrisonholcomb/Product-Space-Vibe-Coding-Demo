"use strict";

(() => {
const { tasks, loadProgress, saveProgress, renderProgress } = window.SecondLine;
const taskId = document.body.dataset.taskId;
const taskIndex = tasks.findIndex((task) => task.id === taskId);
const task = tasks[taskIndex];
const completedIds = loadProgress();

if (!task) {
  window.location.replace("../index.html");
} else {
  const elements = {
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
    previousLink: document.querySelector("#previous-task"),
    nextLink: document.querySelector("#next-task")
  };

  document.title = `${task.title} — Second Line`;
  elements.detailNumber.textContent = String(taskIndex + 1).padStart(2, "0");
  elements.detailDuration.textContent = `${task.durationMinutes} min`;
  elements.detailTitle.textContent = task.title;
  elements.detailObjective.textContent = task.objective;
  elements.detailCue.textContent = task.completionCue;

  task.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    elements.detailSteps.append(item);
  });

  const previousTask = tasks[taskIndex - 1];
  const nextTask = tasks[taskIndex + 1];

  if (previousTask) {
    elements.previousLink.href = previousTask.path.split("/").pop();
    elements.previousLink.textContent = `← ${previousTask.title}`;
  } else {
    elements.previousLink.remove();
  }

  if (nextTask) {
    elements.nextLink.href = nextTask.path.split("/").pop();
    elements.nextLink.textContent = `${nextTask.title} →`;
  } else {
    elements.nextLink.href = "../index.html";
    elements.nextLink.textContent = "Back to practice set →";
  }

  function renderStatus() {
    const isComplete = completedIds.has(task.id);
    elements.completeButton.setAttribute("aria-pressed", String(isComplete));
    elements.completeButtonIcon.textContent = isComplete ? "↺" : "✓";
    elements.completeButtonLabel.textContent = isComplete ? "Mark as not done" : "Mark practice complete";
    elements.completionMessage.textContent = isComplete
      ? "Done. You can change this status at any time."
      : "Not done yet.";
    renderProgress(completedIds);
  }

  elements.completeButton.addEventListener("click", () => {
    if (completedIds.has(task.id)) {
      completedIds.delete(task.id);
    } else {
      completedIds.add(task.id);
    }

    saveProgress(completedIds);
    renderStatus();
  });

  renderStatus();
}
})();

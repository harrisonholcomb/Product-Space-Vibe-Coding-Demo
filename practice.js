"use strict";

(() => {
const STORAGE_KEY = "jazz-practice-progress-v1";

const tasks = [
  {
    id: "ride-cymbal",
    path: "tasks/ride-cymbal.html",
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
    path: "tasks/hi-hat.html",
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
    path: "tasks/comping.html",
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

function saveProgress(completedIds) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]));
  } catch {
    // The current session remains usable if browser storage is unavailable.
  }
}

function renderProgress(completedIds) {
  const count = completedIds.size;
  const percent = Math.round((count / tasks.length) * 100);
  const countElement = document.querySelector("#completed-count");
  const fillElement = document.querySelector("#progress-fill");
  const trackElement = document.querySelector(".progress-track");
  const wordElement = document.querySelector("#progress-word");
  const captionElement = document.querySelector("#progress-caption");

  countElement.textContent = String(count);
  fillElement.style.width = `${percent}%`;
  trackElement.setAttribute("aria-valuenow", String(count));
  trackElement.setAttribute("aria-valuetext", `${count} of ${tasks.length} practices complete`);

  if (count === tasks.length) {
    wordElement.textContent = "Complete";
    captionElement.textContent = "Session complete. Revisit any task while the feel settles in.";
  } else if (count > 0) {
    wordElement.textContent = "In motion";
    captionElement.textContent = `${tasks.length - count} ${tasks.length - count === 1 ? "practice" : "practices"} left in this session.`;
  } else {
    wordElement.textContent = "Ready";
    captionElement.textContent = "Start with the ride cymbal and let the quarter note breathe.";
  }
}

window.SecondLine = { tasks, loadProgress, saveProgress, renderProgress };
})();

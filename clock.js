/* ---------------- ELEMENTS ---------------- */
const widget = document.getElementById("widget");
const previewWidget = document.getElementById("previewWidget");

const timeDisplay = document.getElementById("clock");
const previewTimeDisplay = document.getElementById("previewClock");

const dateDisplay = document.getElementById("date");
const previewDateDisplay = document.getElementById("previewDate");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const appearanceToggle = document.getElementById("appearanceToggle");
const appearanceOptions = document.getElementById("appearanceOptions");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const sizeBtn = document.getElementById("sizeBtn");
const sizeOptions = document.getElementById("sizeOptions");

const copyBtn = document.getElementById("copyLinkBtn");
const copyMessage = document.getElementById("copyMessage");

/* ---------------- URL PARAMS ---------------- */
const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

if (isEmbed) {
  document.documentElement.classList.add("embed-mode");
}

/* ---------------- STATE ---------------- */
let state = {
  theme: params.get("theme") || localStorage.getItem("clockTheme") || "beige",
  font: params.get("font") || localStorage.getItem("clockFont") || "default",
  appearance:
    params.get("appearance") ||
    localStorage.getItem("clockAppearance") ||
    "system",
  format: params.get("format") || localStorage.getItem("clockFormat") || "24hr",
  seconds:
    params.get("seconds") || localStorage.getItem("clockSeconds") || "show",
};

/* ---------------- HELPERS ---------------- */
function updateBothWidgets(callback) {
  [widget, previewWidget].forEach((el) => {
    if (el) callback(el);
  });
}

function setBothText(mainEl, previewEl, value) {
  [mainEl, previewEl].forEach((el) => {
    if (el) el.textContent = value;
  });
}

function saveState() {
  localStorage.setItem("clockTheme", state.theme);
  localStorage.setItem("clockFont", state.font);
  localStorage.setItem("clockAppearance", state.appearance);
  localStorage.setItem("clockFormat", state.format);
  localStorage.setItem("clockSeconds", state.seconds);
}

/* ---------------- TIME ---------------- */
function updateTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  let period = "";

  if (state.format === "12hr") {
    period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }

  let timeString =
    state.format === "12hr"
      ? `${hours}:${minutes}`
      : `${String(hours).padStart(2, "0")}:${minutes}`;

  if (state.seconds === "show") {
    timeString += `:${seconds}`;
  }

  if (state.format === "12hr") {
    timeString += ` ${period}`;
  }

  const dateString = now
    .toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toLowerCase();

  setBothText(timeDisplay, previewTimeDisplay, timeString);
  setBothText(dateDisplay, previewDateDisplay, dateString);
}

/* ---------------- THEME ---------------- */
function setTheme(theme) {
  state.theme = theme || "beige";

  updateBothWidgets((el) => {
    el.classList.remove("beige", "pink", "blue", "green", "black", "white");
    el.classList.add(state.theme);
  });

  saveState();
}

/* ---------------- FONT ---------------- */
function setFont(font) {
  state.font = font || "default";

  updateBothWidgets((el) => {
    el.classList.remove("font-default", "font-serif", "font-mono");
    el.classList.add(`font-${state.font}`);

    if (state.font === "serif") {
      el.style.fontFamily = "Georgia, serif";
    } else if (state.font === "mono") {
      el.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
    } else {
      el.style.fontFamily =
        "'Satoshi', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    }
  });

  saveState();
}

/* ---------------- APPEARANCE / BG ---------------- */
function setAppearance(appearance) {
  state.appearance = appearance || "system";

  document.body.classList.remove(
    "appearance-light",
    "appearance-dark",
    "appearance-system"
  );

  document.body.classList.add(`appearance-${state.appearance}`);

  saveState();
}

/* ---------------- EMBED LINK ---------------- */
function buildEmbedURL() {
  const base = window.location.origin + window.location.pathname;

  return `${base}?theme=${state.theme}&font=${state.font}&appearance=${state.appearance}&format=${state.format}&seconds=${state.seconds}&embed=true`;
}

/* ---------------- COPY LINK ---------------- */
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(buildEmbedURL());

    if (!copyMessage) return;

    copyMessage.classList.remove("hidden");
    copyMessage.classList.add("show");

    setTimeout(() => {
      copyMessage.classList.add("hidden");
      copyMessage.classList.remove("show");
    }, 2000);
  });
}

/* ---------------- SIZE / TIME SETTINGS ---------------- */
if (sizeBtn && sizeOptions) {
  sizeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    sizeOptions.classList.toggle("hidden");
    themeOptions?.classList.add("hidden");
    appearanceOptions?.classList.add("hidden");
    fontOptions?.classList.add("hidden");
  });
}

document.querySelectorAll(".size-option").forEach((option) => {
  option.addEventListener("click", () => {
    if (option.dataset.format) {
      state.format = option.dataset.format;
    }

    if (option.dataset.seconds) {
      state.seconds = option.dataset.seconds;
    }

    saveState();
    updateTime();

    sizeOptions?.classList.add("hidden");
  });
});

/* ---------------- POPUPS ---------------- */
themeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  themeOptions?.classList.toggle("hidden");
  sizeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

appearanceToggle?.addEventListener("click", (e) => {
  e.stopPropagation();

  appearanceOptions?.classList.toggle("hidden");
  sizeOptions?.classList.add("hidden");
  themeOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

fontBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  fontOptions?.classList.toggle("hidden");
  sizeOptions?.classList.add("hidden");
  themeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
});

/* ---------------- OPTIONS ---------------- */
document.querySelectorAll(".theme-circle").forEach((el) => {
  el.addEventListener("click", () => {
    setTheme(el.dataset.theme);
    themeOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".appearance-option").forEach((el) => {
  el.addEventListener("click", () => {
    setAppearance(el.dataset.appearance);
    appearanceOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".font-option").forEach((el) => {
  el.addEventListener("click", () => {
    setFont(el.dataset.font);
    fontOptions?.classList.add("hidden");
  });
});

/* ---------------- OUTSIDE CLICK ---------------- */
document.addEventListener("click", (e) => {
  if (!themeBtn?.contains(e.target) && !themeOptions?.contains(e.target)) {
    themeOptions?.classList.add("hidden");
  }

  if (
    !appearanceToggle?.contains(e.target) &&
    !appearanceOptions?.contains(e.target)
  ) {
    appearanceOptions?.classList.add("hidden");
  }

  if (!fontBtn?.contains(e.target) && !fontOptions?.contains(e.target)) {
    fontOptions?.classList.add("hidden");
  }

  if (!sizeBtn?.contains(e.target) && !sizeOptions?.contains(e.target)) {
    sizeOptions?.classList.add("hidden");
  }
});

/* ---------------- INIT ---------------- */
saveState();
setTheme(state.theme);
setFont(state.font);
setAppearance(state.appearance);
updateTime();
setInterval(updateTime, 1000);

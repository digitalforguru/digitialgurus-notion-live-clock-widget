/* ---------------- ELEMENTS ---------------- */
const widget = document.getElementById("widget");
const timeDisplay = document.getElementById("clock");
const dateDisplay = document.getElementById("date");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const copyBtn = document.getElementById("copyLinkBtn");
let timeFormat = localStorage.getItem("timeFormat") || "24hr";

/* ---------------- URL PARAMS ---------------- */
const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

/* ---------------- STATE ---------------- */
let state = {
  theme: params.get("theme") || "beige",
  font: params.get("font") || "default",
  format: params.get("format") || "24hr",
  seconds: params.get("seconds") || "show"
};

/* hide builder in embed */
if (isEmbed) {
  const builder = document.querySelector(".builder-ui");
  if (builder) builder.remove();

  document.documentElement.classList.add("embed-mode");
  document.body.classList.add("embed-mode");
}

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

  timeDisplay.textContent = timeString;
}

const sizeBtn = document.getElementById("sizeBtn");
const sizeOptions = document.getElementById("sizeOptions");

if (sizeBtn && sizeOptions) {

  sizeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sizeOptions.classList.toggle("hidden");
  });

  document.querySelectorAll(".size-option").forEach(option => {

    option.addEventListener("click", () => {

      if (option.dataset.format) {
        state.format = option.dataset.format;
      }

      if (option.dataset.seconds) {
        state.seconds = option.dataset.seconds;
      }

      sizeOptions.classList.add("hidden");
      updateTime();

    });

  });

}

/* ---------------- THEME ---------------- */
function setTheme(theme) {
  state.theme = theme;

  widget.classList.remove("beige", "pink", "blue", "green", "black", "white");
  widget.classList.add(theme);
}

/* ---------------- FONT ---------------- */
function setFont(font) {
  state.font = font;

  widget.classList.remove("font-default", "font-serif", "font-mono");
  widget.classList.add(`font-${font}`);
}

/* ---------------- EMBED LINK ---------------- */
function buildEmbedURL() {
  const base = window.location.origin + window.location.pathname;

  return `${base}?theme=${state.theme}&font=${state.font}&format=${state.format}&seconds=${state.seconds}&embed=true`;
}

/* ---------------- COPY LINK ---------------- */
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(buildEmbedURL());

    const msg = document.getElementById("copyMessage");
    if (!msg) return;

    msg.classList.remove("hidden");
    msg.classList.add("show");

    setTimeout(() => {
      msg.classList.add("hidden");
      msg.classList.remove("show");
    }, 2000);
  });
}

/* ---------------- POPUPS ---------------- */
themeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle("hidden");
});

fontBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  fontOptions.classList.toggle("hidden");
});

/* ---------------- OPTIONS ---------------- */
document.querySelectorAll(".theme-circle").forEach(el => {
  el.addEventListener("click", () => {
    setTheme(el.dataset.theme);
    themeOptions.classList.add("hidden");
  });
});

document.querySelectorAll(".font-option").forEach(el => {
  el.addEventListener("click", () => {
    setFont(el.dataset.font);
    fontOptions.classList.add("hidden");
  });
});

/* ---------------- OUTSIDE CLICK ---------------- */
document.addEventListener("click", (e) => {
  if (!themeBtn?.contains(e.target) && !themeOptions?.contains(e.target)) {
    themeOptions?.classList.add("hidden");
  }

  if (!fontBtn?.contains(e.target) && !fontOptions?.contains(e.target)) {
    fontOptions?.classList.add("hidden");
  }

  // ✨ ADD THIS
  if (!sizeBtn?.contains(e.target) && !sizeOptions?.contains(e.target)) {
    sizeOptions?.classList.add("hidden");
  }
});

setInterval(updateTime, 1000);

updateTime();
setTheme(state.theme);
setFont(state.font);

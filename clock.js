/* ---------------- ELEMENTS ---------------- */
const widget = document.getElementById("widget");
const timeDisplay = document.getElementById("time");
const dateDisplay = document.getElementById("date");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const copyBtn = document.getElementById("copyLinkBtn");

/* ---------------- URL PARAMS ---------------- */
const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

/* ---------------- STATE ---------------- */
let state = {
  theme: params.get("theme") || "beige",
  font: params.get("font") || "default",
  date: params.get("date") || new Date().toISOString().split("T")[0]
};

/* hide builder in embed */
if (isEmbed) {
  const builder = document.querySelector(".builder-ui");
  if (builder) builder.style.display = "none";
}

/* ---------------- CLOCK ---------------- */
function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  if (timeDisplay) {
    timeDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  if (dateDisplay) {
    dateDisplay.textContent = now.toDateString();
  }
}

setInterval(updateClock, 1000);
updateClock();

/* ---------------- THEME ---------------- */
function setTheme(theme) {
  state.theme = theme;

  widget.classList.remove("beige", "pink", "blue", "green");
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

  const today = new Date().toISOString().split("T")[0];

  return `${base}?theme=${state.theme}&font=${state.font}&date=${today}&embed=true`;
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
});

/* ---------------- INIT ---------------- */
setTheme(state.theme);
setFont(state.font);

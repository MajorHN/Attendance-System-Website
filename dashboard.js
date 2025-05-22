// dashboard.js
function updateDateTime() {
  const dateEl = document.getElementById("current-date");
  const timeEl = document.getElementById("current-time");

  if (!dateEl || !timeEl) return; // Avoid errors if elements aren't loaded

  const now = new Date();

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString(undefined, dateOptions);

  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  timeEl.textContent = now.toLocaleTimeString(undefined, timeOptions);
}

document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
    
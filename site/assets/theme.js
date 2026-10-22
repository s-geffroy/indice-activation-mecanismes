// Theme clair / sombre, applique avant le premier rendu (script classique,
// charge sans defer dans <head>) : pas de flash. Meme cle que ligne de crete
// et l'Atlas doctrinal, `ldc-theme`, par convention.
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("ldc-theme");
    root.dataset.theme = saved === "light" || saved === "dark"
      ? saved
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch (e) {
    root.dataset.theme = "dark";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var sync = function () {
      var light = root.dataset.theme === "light";
      btn.textContent = light ? "◑" : "◐";
      btn.setAttribute("aria-label", light ? "Passer au thème sombre" : "Passer au thème clair");
    };
    btn.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem("ldc-theme", root.dataset.theme); } catch (e) { /* theme non memorise */ }
      sync();
    });
    sync();
  });
})();

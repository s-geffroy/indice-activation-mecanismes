// Petits outils DOM partages par le questionnaire (app.js) et la page de
// notation des experts (experts.js). Aucun innerHTML : tout passe par
// createElement et textContent.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

// Barre de progression ou de score : largeur posee par le CSSOM, autorise
// par la CSP (style-src 'self' interdit les attributs style, pas le CSSOM).
export function barFill(ratio) {
  const fill = h("span");
  fill.style.width = `${Math.round(ratio * 100)}%`; // CSSOM : autorise par la CSP
  return fill;
}

// Telechargement d'un fichier genere dans le navigateur ; rien ne part sur le
// reseau.
export function download(name, type, content) {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = h("a", { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

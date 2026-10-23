// Page de confidentialite (site/confidentialite/) : complete la notice avec la
// configuration de la collecte, et permet de consulter ou d'effacer ses
// reponses avec son code de participation. Le reseau passe par collect.js.
import { COLLECT } from "../data/collect.js?v=2.2";
import { deleteMine, fetchMine, retentionEnd } from "./collect.js?v=2.2";
import { download, h } from "./dom.js?v=2.2";

const frDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

function fillNotice() {
  const values = {
    controller: COLLECT.controller,
    contact: COLLECT.contact,
    host: COLLECT.host,
    logsRetention: COLLECT.logsRetention,
    endDate: frDate(COLLECT.endDate),
    retentionEnd: frDate(retentionEnd(COLLECT)),
  };
  for (const el of document.querySelectorAll("[data-fill]")) el.textContent = values[el.dataset.fill] || "—";
  document.getElementById("no-collect").hidden = true;
  document.getElementById("notice").hidden = false;
}

// Le code de la derniere transmission, s'il est encore dans ce navigateur.
function storedCode() {
  try {
    return JSON.parse(window.localStorage.getItem("iam-v2.2-session"))?.transmission?.code || "";
  } catch {
    return "";
  }
}

function rightsForm() {
  const status = h("p", { class: "nav-status", role: "status", "aria-live": "polite" });
  const code = h("input", { id: "code", type: "text", class: "text-input", autocomplete: "off", spellcheck: "false", maxlength: "64" });
  code.value = storedCode();
  const result = h("div", {});
  const read = () => {
    const c = code.value.trim();
    if (c.length < 16) {
      status.textContent = "Saisissez votre code de participation.";
      return null;
    }
    return c;
  };
  const consult = async () => {
    const c = read();
    if (!c) return;
    status.textContent = "Recherche…";
    const res = await fetchMine(COLLECT, c);
    result.replaceChildren();
    if (!res.ok) {
      status.textContent = res.error;
      return;
    }
    status.textContent = "";
    const p = res.data.passation;
    result.replaceChildren(
      h("p", {}, `Passation reçue le ${frDate(res.data.receivedOn)} : forme ${p.form === "court" ? "courte" : "complète"}, ${Object.keys(p.responses).length} réponses, durée ${p.durationMinutes} min.`),
      h("button", {
        class: "btn", type: "button",
        onclick: () => download("iam-mes-donnees.json", "application/json", JSON.stringify(res.data, null, 2) + "\n"),
      }, "Télécharger mes données (JSON)"),
    );
  };
  const erase = async () => {
    const c = read();
    if (!c) return;
    if (!window.confirm("Effacer définitivement vos réponses de l’étude ? Cette action retire votre consentement et ne peut pas être annulée.")) return;
    status.textContent = "Effacement…";
    const res = await deleteMine(COLLECT, c);
    result.replaceChildren();
    status.textContent = res.ok ? "Vos réponses ont été effacées de l’étude." : res.error;
  };
  return h("div", {},
    h("p", { class: "field" }, h("label", { for: "code" }, "Code de participation"), code),
    h("div", { class: "actions" },
      h("button", { class: "btn primary", type: "button", onclick: consult }, "Consulter mes réponses"),
      h("button", { class: "btn", type: "button", onclick: erase }, "Effacer mes réponses"),
    ),
    status,
    result,
  );
}

if (COLLECT) {
  fillNotice();
  document.getElementById("rights").append(rightsForm());
}

// Page de notation des experts (site/experts/). Toute decision (validation,
// ecarts, sauvegarde, export) est deleguee a experts-core.js ; ce fichier ne
// fait qu'afficher. Les imports portent ?v=<version>, comme app.js.
import { QUESTIONNAIRE as Q } from "../data/questionnaire.js?v=2.2";
import {
  DEVIATION, attachFeedback, buildExpertExport, clearExpertSession, createExpertSession, deviations,
  doneCount, isItemDone, isSessionComplete, isValidExpertCode, loadExpertSession, ratedItems, saveExpertSession,
  setComment, setRating,
} from "./experts-core.js?v=2.2";
import { barFill, download, h } from "./dom.js?v=2.2";

const app = document.getElementById("app");
const storage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

let session = storage ? loadExpertSession(storage, Q) : null;
const persist = () => storage && saveExpertSession(storage, session);
const itemById = (id) => Q.items.find((i) => i.id === id);

function show(...nodes) {
  app.replaceChildren(...nodes);
  const heading = app.querySelector("h1, h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
  window.scrollTo(0, 0);
}

function cryptoRandom() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

function exportNotes() {
  download(
    `iam-v${Q.version}-experts-tour${session.round}-${session.expert}.json`,
    "application/json",
    JSON.stringify(buildExpertExport(Q, session), null, 2) + "\n",
  );
}

// --- Accueil ---------------------------------------------------------------

function renderWelcome() {
  const status = h("p", { class: "nav-status", role: "status", "aria-live": "polite" });
  const code = h("input", { id: "code", type: "text", maxlength: "12", autocomplete: "off", spellcheck: "false", class: "text-input" });
  const round = h("select", { id: "round", class: "text-input" },
    h("option", { value: "1" }, "Tour 1 — notation indépendante"),
    h("option", { value: "2" }, "Tour 2 — révision avec le retour du groupe"),
  );
  let feedback = null;
  const file = h("input", {
    id: "feedback", type: "file", accept: "application/json,.json",
    onchange: async () => {
      feedback = null;
      try {
        feedback = JSON.parse(await file.files[0].text());
        status.textContent = "Retour du groupe chargé.";
      } catch {
        status.textContent = "Ce fichier n’est pas un retour valide.";
      }
    },
  });
  const fileRow = h("p", { class: "field", hidden: true }, h("label", { for: "feedback" }, "Fichier de retour du tour 1 (fourni par la coordination)"), file);
  round.addEventListener("change", () => { fileRow.hidden = round.value !== "2"; });

  const start = () => {
    const expert = code.value.trim();
    if (!isValidExpertCode(expert)) {
      status.textContent = "Saisissez le code anonyme qui vous a été attribué (lettres, chiffres, tiret ; 12 caractères au plus).";
      return;
    }
    const s = createExpertSession(Q, { expert, round: Number(round.value) }, cryptoRandom);
    if (s.round === 2 && !attachFeedback(Q, s, feedback)) {
      status.textContent = "Le tour 2 nécessite le fichier de retour du tour 1, pour cette version du questionnaire.";
      return;
    }
    session = s;
    persist();
    goTo(0);
  };

  const resumable = session && Object.keys(session.ratings).length > 0;
  show(
    h("section", { class: "card welcome", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `IAM V${Q.version} — notation experte`),
      h("h1", { id: "t" }, "Noter l’efficacité de chaque option"),
      h("p", {}, `Vous allez noter ${ratedItems(Q).length} situations professionnelles. Pour chacune, attribuez à chacune des quatre actions une note d’efficacité de 0 (très inefficace) à 100 (très efficace). Plusieurs actions peuvent recevoir des notes proches ; elles ne sont pas classées entre elles.`),
      h("p", {}, h("strong", {}, "Critère d’efficacité, identique pour tous les experts : "),
        "une action est efficace si elle atteint l’objectif indiqué dans la situation, préserve la coopération avec les personnes concernées à moyen terme et respecte les règles de l’organisation ainsi que le droit."),
      h("p", {}, "Jugez à partir des seules informations données. Si une situation vous paraît ambiguë, notez-la quand même et dites pourquoi dans le commentaire : c’est une information précieuse."),
      h("ul", { class: "facts" },
        h("li", {}, h("strong", {}, "2 h à 2 h 30"), " environ, en plusieurs fois si besoin"),
        h("li", {}, h("strong", {}, "Sauvegarde automatique"), " dans ce navigateur"),
        h("li", {}, h("strong", {}, "Un fichier à remettre"), " à la fin"),
      ),
      h("p", { class: "privacy" }, "Utilisez uniquement le code anonyme qui vous a été attribué, jamais votre nom. Vos notes restent dans ce navigateur jusqu’à l’export."),
      storage ? null : h("p", { class: "warn", role: "status" },
        "La sauvegarde locale est indisponible dans ce navigateur : vos notes seront perdues si vous rechargez la page."),
      resumable
        ? h("div", { class: "actions" },
            h("button", { class: "btn primary", type: "button", onclick: () => goTo(session.cursor) },
              `Reprendre (code ${session.expert}, tour ${session.round})`),
            resetButton(),
          )
        : [
            h("p", { class: "field" }, h("label", { for: "code" }, "Code expert"), code),
            h("p", { class: "field" }, h("label", { for: "round" }, "Tour"), round),
            fileRow,
            h("div", { class: "actions" }, h("button", { class: "btn primary", type: "button", onclick: start }, "Commencer")),
            status,
          ],
    ),
  );
}

function resetButton() {
  return h("button", {
    class: "btn ghost", type: "button",
    onclick: () => {
      if (!window.confirm("Effacer toutes vos notes de ce navigateur ? Exportez-les d’abord si vous voulez les garder.")) return;
      if (storage) clearExpertSession(storage);
      session = null;
      renderWelcome();
    },
  }, "Effacer mes notes / Recommencer");
}

// --- Navigation -----------------------------------------------------------

function goTo(index) {
  session.cursor = Math.max(0, Math.min(index, session.order.length));
  if (session.cursor === session.order.length) {
    if (isSessionComplete(session) && !session.completedAt) session.completedAt = new Date().toISOString();
    persist();
    return renderEnd();
  }
  persist();
  renderItem(itemById(session.order[session.cursor]));
}

function progress() {
  const done = doneCount(session);
  const total = session.order.length;
  return h("div", { class: "progress" },
    h("p", { class: "progress-label" }, `Situation ${session.cursor + 1} sur ${total}`, h("span", {}, ` · ${done} terminée${done > 1 ? "s" : ""} · tour ${session.round} · ${session.expert}`)),
    h("div", { class: "progress-bar", role: "progressbar", "aria-label": "Progression", "aria-valuemin": 0, "aria-valuemax": total, "aria-valuenow": done }, barFill(done / total)),
  );
}

// --- Item -----------------------------------------------------------------

function renderItem(item) {
  const status = h("p", { class: "nav-status", role: "status", "aria-live": "polite" });
  const fb = session.round === 2 ? session.feedback.items[item.id] : null;
  const commentHint = h("p", { class: "hint" });
  const comment = h("textarea", {
    id: "comment", class: "text-input", rows: "3", maxlength: "2000",
    oninput: () => { setComment(session, item.id, comment.value); changed(); },
  });
  comment.value = session.comments[item.id] || "";

  const rows = session.presentation[item.id].map((optId, i) => {
    const opt = item.options.find((o) => o.id === optId);
    const inputId = `k-${item.id}-${optId}`;
    const current = session.ratings[item.id]?.[optId];
    const number = h("input", { id: inputId, type: "number", min: "0", max: "100", step: "1", inputmode: "numeric", class: "k-number text-input" });
    const range = h("input", { type: "range", min: "0", max: "100", step: "1", "aria-hidden": "true", tabindex: "-1", class: "k-range" });
    if (Number.isInteger(current)) {
      number.value = String(current);
      range.value = String(current);
    }
    const apply = (raw) => {
      const v = Number(raw);
      if (raw === "" || !Number.isInteger(v) || v < 0 || v > 100) return;
      setRating(session, item.id, optId, v);
      number.value = String(v);
      range.value = String(v);
      changed();
    };
    number.addEventListener("input", () => apply(number.value));
    range.addEventListener("input", () => apply(range.value));
    return h("li", { class: "opt" },
      h("p", { class: "opt-text" }, h("span", { class: "opt-num", "aria-hidden": "true" }, `${i + 1}.`), " ", opt.text),
      h("div", { class: "k-row" },
        h("label", { for: inputId }, "Efficacité (0-100)"), number, range,
        fb ? h("span", { class: "muted k-group" }, `groupe : médiane ${fb[optId].median}, de ${fb[optId].q1} à ${fb[optId].q3}`) : null,
      ),
    );
  });

  function changed() {
    session.completedAt = null;
    persist();
    sync();
  }

  function sync() {
    const dev = deviations(session, item.id);
    commentHint.textContent = dev.length
      ? `Votre note s’écarte de plus de ${DEVIATION} points de la médiane du groupe sur ${dev.length} option${dev.length > 1 ? "s" : ""} : justifiez cet écart ci-dessous.`
      : "Commentaire facultatif : ambiguïté, information manquante, option mal formulée…";
    status.textContent = isItemDone(session, item.id) ? "" : "Notez les quatre actions (et justifiez les écarts au tour 2) pour continuer.";
  }

  const next = () => {
    if (!isItemDone(session, item.id)) {
      sync();
      status.textContent = "Notez les quatre actions (et justifiez les écarts au tour 2) pour continuer.";
      return;
    }
    goTo(session.cursor + 1);
  };

  show(
    progress(),
    h("section", { class: "card", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, item.module === "INT" ? "Situation combinée" : "Situation"),
      h("h1", { id: "t", class: "sr-only" }, `Situation ${session.cursor + 1}`),
      h("div", { class: "scenario" }, item.text.map((p) => h("p", {}, p))),
      h("ol", { class: "opts" }, rows),
      h("p", { class: "field" }, h("label", { for: "comment" }, "Commentaire"), comment),
      commentHint,
    ),
    h("nav", { class: "nav", "aria-label": "Navigation" },
      h("button", { class: "btn", type: "button", onclick: () => (session.cursor === 0 ? renderWelcome() : goTo(session.cursor - 1)) }, "Précédent"),
      h("button", { class: "btn primary", type: "button", onclick: next }, session.cursor === session.order.length - 1 ? "Terminer" : "Suivant"),
    ),
    status,
    h("div", { class: "actions" },
      h("button", { class: "btn ghost", type: "button", onclick: exportNotes }, "Exporter mes notes (fichier partiel)"),
    ),
  );
  sync();
}

// --- Fin ------------------------------------------------------------------

function renderEnd() {
  const done = doneCount(session);
  const total = session.order.length;
  const firstTodo = session.order.findIndex((id) => !isItemDone(session, id));
  show(
    h("section", { class: "card", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `IAM V${Q.version} — tour ${session.round} · ${session.expert}`),
      h("h1", { id: "t" }, done === total ? "Notation terminée" : "Notation incomplète"),
      done === total
        ? h("p", {}, "Merci. Exportez le fichier ci-dessous et remettez-le à la coordination de l’étude, par le canal convenu.")
        : h("p", { class: "warn" }, `${total - done} situation${total - done > 1 ? "s restent" : " reste"} à terminer. Vous pouvez exporter un fichier partiel, mais seul un fichier complet sera pris en compte.`),
      h("div", { class: "actions" },
        h("button", { class: "btn primary", type: "button", onclick: exportNotes }, "Exporter mes notes (JSON)"),
        firstTodo >= 0 ? h("button", { class: "btn", type: "button", onclick: () => goTo(firstTodo) }, "Aller à la première situation à terminer") : null,
        h("button", { class: "btn", type: "button", onclick: () => goTo(total - 1) }, "Revoir mes notes"),
      ),
      h("p", { class: "privacy" }, "Le fichier contient votre code anonyme, vos notes et vos commentaires ; rien d’autre."),
    ),
    h("div", { class: "reset" }, resetButton()),
  );
}

renderWelcome();

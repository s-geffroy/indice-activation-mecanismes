// Interface du questionnaire IAM V2.2. Toute decision (score, validation,
// sauvegarde, export) est deleguee a core.js ; ce fichier ne fait qu'afficher.
// Les imports portent ?v=<version> : sans ce suffixe, un navigateur garde en
// cache les modules de la version precedente apres une mise a jour du site.
import { QUESTIONNAIRE as Q } from "../data/questionnaire.js?v=2.2";
import { EXPERT_KEY } from "../data/expert_key.js?v=2.2";
import {
  CONFIG, LABELS, MODULE_ORDER,
  answeredCount, buildCSV, buildExport, buildSteps, clearState, computeScores, createSession,
  isAnswered, isComplete, itemById, loadState, resultsText, saveState, setActValue, setChoice,
} from "./core.js?v=2.2";
import { barFill, download, h } from "./dom.js?v=2.2";
import { COLLECT } from "../data/collect.js?v=2.2";
import { buildSubmission, collectOpen, consentRecord, retentionEnd, submitPassation } from "./collect.js?v=2.2";

const FORM_LABELS = { court: "forme courte", complet: "forme complète" };

const MODULE_TITLES = {
  CAP: "Situations",
  INT: "Situations combinées",
  ACT: "Vos comportements récents",
};

const ITEM_HINT = {
  CAP: "Choisissez l’action la PLUS efficace et l’action la MOINS efficace.",
  INT: "Choisissez l’action la PLUS efficace et l’action la MOINS efficace.",
  ACT: "Sur les six derniers mois, lorsque la situation s’est présentée.",
};

const app = document.getElementById("app");
const storage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

let state = storage ? loadState(storage, Q) : null;
let steps = state ? buildSteps(state) : [];

const persist = () => storage && saveState(storage, state);

// --- Petits outils DOM ----------------------------------------------------

// Le Markdown des consignes ne contient que du **gras** : on le traduit en
// <strong> sans jamais passer par innerHTML.
function inline(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? h("strong", {}, part) : part));
}

function show(...nodes) {
  app.replaceChildren(...nodes);
  const heading = app.querySelector("h1, h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
  window.scrollTo(0, 0);
}

const fmt = (x) => (x === null ? "—" : String(Math.round(x)));

// --- Accueil ---------------------------------------------------------------

// Le texte d'accueil reprend specs/IAM_V2_2/ACCROCHE_IAM_V2_2.md ; les
// effectifs et les durees viennent des donnees, jamais d'un chiffre en dur.
function formCard(form, title, details) {
  return h("li", { class: "form-card" },
    h("h2", {}, title),
    h("ul", { class: "facts" },
      h("li", {}, h("strong", {}, `${Q.forms[form].length} questions`)),
      h("li", {}, h("strong", {}, form === "court" ? `${Q.estimatedMinutes.court} minutes environ` : `${Q.estimatedMinutes.complet} minutes environ`)),
      details.map((d) => h("li", {}, d)),
    ),
    h("button", { class: `btn${form === "court" ? " primary" : ""}`, type: "button", onclick: () => begin(form) },
      form === "court" ? "Commencer la forme courte" : "Commencer la forme complète"),
  );
}

function renderWelcome() {
  const resumable = state && Object.keys(state.responses).length > 0;
  show(
    h("section", { class: "card welcome", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `IAM V${Q.version} — ${Q.title}`),
      h("h1", { id: "t" }, "Comment jugez-vous les situations de travail où plusieurs choix se défendent ?"),
      h("p", {}, "Ce questionnaire vous place face à des situations professionnelles où plusieurs actions peuvent sembler raisonnables, mais où chacune a des effets différents sur la confiance, l’influence, les soutiens, l’information, la réputation ou le choix du moment."),
      h("p", {}, "Il porte sur deux choses distinctes : votre jugement sur ces situations, et la fréquence de certains de vos comportements au travail, telle que vous la déclarez. Ce n’est ni un test de personnalité ni une évaluation de votre valeur professionnelle."),
      h("p", { class: "muted" }, "Instrument expérimental, en cours de validation : les résultats sont descriptifs, non étalonnés, et ne sont pas des percentiles."),
      h("p", { class: "privacy" }, "Vos réponses restent dans ce navigateur sauf si vous les exportez."),
      storage ? null : h("p", { class: "warn", role: "status" },
        "La sauvegarde locale est indisponible dans ce navigateur : vos réponses seront perdues si vous rechargez la page."),
      resumable
        ? h("div", { class: "actions" },
            h("button", { class: "btn primary", type: "button", onclick: () => goTo(state.cursor) },
              `Reprendre la ${FORM_LABELS[state.form]} là où je m’étais arrêté·e`),
            resetButton("Effacer mes réponses / Recommencer"),
          )
        : h("ul", { class: "form-cards" },
            formCard("court", "Forme courte", ["Résultats globaux", "Pour une première passation"]),
            formCard("complet", "Forme complète", ["Résultats par mécanisme", "Reprise possible en plusieurs fois"]),
          ),
    ),
  );
}

// Collecte ouverte : le consentement est demande AVANT la passation, et la
// personne peut toujours repondre sans rien transmettre.
function begin(form) {
  if (collectOpen(COLLECT)) renderConsent(form);
  else start(form, null);
}

function renderConsent(form) {
  const status = h("p", { class: "nav-status", role: "status", "aria-live": "polite" });
  const adult = h("input", { id: "adult", type: "checkbox" });
  const agree = h("input", { id: "agree", type: "checkbox" });
  const accept = () => {
    if (!adult.checked || !agree.checked) {
      status.textContent = "Cochez les deux cases pour participer à l’étude, ou choisissez de répondre sans rien transmettre.";
      return;
    }
    start(form, consentRecord(COLLECT));
  };
  show(
    h("section", { class: "card", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `IAM V${Q.version} — étude de validation`),
      h("h1", { id: "t" }, "Participer à l’étude ?"),
      h("p", {}, "Ce questionnaire est en cours de validation scientifique. Vous pouvez, si vous le souhaitez, transmettre vos réponses à l’étude : elles serviront uniquement à vérifier la qualité du questionnaire."),
      h("ul", {},
        h("li", {}, "Aucun nom, aucune adresse électronique, aucune adresse IP n’est enregistrée avec vos réponses."),
        h("li", {}, "Rien n’est envoyé pendant que vous répondez : à la fin, c’est vous qui cliquez sur « Transmettre »."),
        h("li", {}, `Vos réponses sont conservées jusqu’au ${frDate(retentionEnd(COLLECT))}, puis supprimées.`),
        h("li", {}, "Un code de participation vous est remis : il vous permet de consulter ou d’effacer vos réponses à tout moment, ce qui retire votre consentement."),
        h("li", {}, "Participer est facultatif ; refuser ne change rien à votre accès au questionnaire."),
      ),
      h("p", {}, h("a", { href: "confidentialite/" }, "Lire la notice d’information complète"), " (responsable du traitement, base légale, vos droits)."),
      h("p", { class: "check" }, adult, h("label", { for: "adult" }, " J’ai 18 ans ou plus.")),
      h("p", { class: "check" }, agree, h("label", { for: "agree" }, " J’ai lu la notice et j’accepte que mes réponses soient transmises à l’étude si je clique sur « Transmettre » à la fin.")),
      h("div", { class: "actions" },
        h("button", { class: "btn primary", type: "button", onclick: accept }, "Participer à l’étude"),
        h("button", { class: "btn", type: "button", onclick: () => start(form, { declined: true }) }, "Répondre sans rien transmettre"),
      ),
      status,
    ),
  );
}

const frDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

function start(form, consent) {
  state = createSession(Q, CONFIG, cryptoRandom, new Date(), form);
  if (consent) state.consent = consent;
  steps = buildSteps(state);
  persist();
  goTo(0);
}

// Tirage de l'ordre de presentation : crypto plutot que Math.random, sans
// enjeu de securite, mais sans biais connu non plus.
function cryptoRandom() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

function resetButton(label = "Effacer mes réponses / Recommencer") {
  return h("button", {
    class: "btn ghost", type: "button",
    onclick: () => {
      if (!window.confirm("Effacer toutes vos réponses et recommencer depuis le début ?")) return;
      if (storage) clearState(storage);
      state = null;
      steps = [];
      renderWelcome();
    },
  }, label);
}

// --- Navigation -----------------------------------------------------------

function goTo(index) {
  state.cursor = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[state.cursor];
  if (step.type === "results") {
    if (!isComplete(Q, state)) {
      // Garde-fou : on ne montre pas de resultats sur une passation partielle.
      const first = steps.findIndex((s) => s.type === "item" && !isAnswered(itemById(Q, s.id), state.responses[s.id]));
      return goTo(first);
    }
    if (!state.completedAt) state.completedAt = new Date().toISOString();
  }
  persist();
  if (step.type === "intro") renderIntro(step.module);
  else if (step.type === "item") renderItem(itemById(Q, step.id));
  else renderResults();
}

function itemPosition(id) {
  return MODULE_ORDER.flatMap((m) => state.questionOrder[m]).indexOf(id) + 1;
}

const total = () => Q.forms[state.form].length;

function progress(label) {
  const done = answeredCount(Q, state);
  return h("div", { class: "progress" },
    h("p", { class: "progress-label" }, label, h("span", {}, ` · ${done} réponse${done > 1 ? "s" : ""} sur ${total()}`)),
    h("div", {
      class: "progress-bar", role: "progressbar", "aria-label": "Progression",
      "aria-valuemin": 0, "aria-valuemax": total(), "aria-valuenow": done,
    }, barFill(done / total())),
  );
}

function navBar({ canNext, nextLabel = "Suivant", hint = "" }) {
  const status = h("p", { class: "nav-status", role: "status", "aria-live": "polite" }, canNext ? "" : hint);
  const next = h("button", {
    class: "btn primary", type: "button", "aria-disabled": canNext ? "false" : "true",
    onclick: () => {
      if (next.getAttribute("aria-disabled") === "true") {
        status.textContent = hint;
        return;
      }
      goTo(state.cursor + 1);
    },
  }, nextLabel);
  const prev = h("button", { class: "btn", type: "button", onclick: () => (state.cursor === 0 ? renderWelcome() : goTo(state.cursor - 1)) }, "Précédent");
  const nav = h("nav", { class: "nav", "aria-label": "Navigation du questionnaire" }, prev, next);
  return {
    el: h("div", {}, nav, status, h("div", { class: "reset" }, resetButton())),
    setReady(ok) {
      next.setAttribute("aria-disabled", ok ? "false" : "true");
      status.textContent = ok ? "" : hint;
    },
  };
}

// --- Consignes de module --------------------------------------------------

function renderIntro(module) {
  const n = MODULE_ORDER.indexOf(module) + 1;
  const mod = Q.modules[module];
  const nav = navBar({ canNext: true, nextLabel: "Commencer cette partie" });
  show(
    progress(`Partie ${n} sur ${MODULE_ORDER.length}`),
    h("section", { class: "card", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `Partie ${n} sur ${MODULE_ORDER.length}`),
      h("h1", { id: "t" }, MODULE_TITLES[module]),
      mod.consigne.map((p) => h("p", {}, inline(p))),
      mod.scale.length
        ? h("ul", { class: "scale-legend" }, mod.scale.map((s) => h("li", {}, h("strong", {}, String(s.value)), ` — ${s.label}`)))
        : null,
    ),
    nav.el,
  );
}

// --- Items ----------------------------------------------------------------

function renderItem(item) {
  const pos = itemPosition(item.id);
  const n = MODULE_ORDER.indexOf(item.module) + 1;
  const hint = item.module === "ACT"
    ? "Choisissez une réponse pour continuer."
    : "Choisissez une action PLUS efficace et une action MOINS efficace (différentes) pour continuer.";
  const nav = navBar({ canNext: isAnswered(item, state.responses[item.id]), hint, nextLabel: pos === total() ? "Voir mes résultats" : "Suivant" });
  // Le code de mecanisme (M1-M12) n'est jamais affiche pendant la passation.
  const body = item.module === "ACT" ? actBody(item, nav) : choiceBody(item, nav);
  show(
    progress(`Question ${pos} sur ${total()}`),
    h("section", { class: "card", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `Partie ${n} — ${MODULE_TITLES[item.module]}`),
      h("h1", { id: "t", class: "sr-only" }, `Question ${pos}`),
      h("div", { class: "scenario", id: "scenario" }, item.text.map((p) => h("p", {}, p))),
      h("p", { class: "hint" }, ITEM_HINT[item.module]),
      body,
    ),
    nav.el,
  );
}

function responsesChanged() {
  state.completedAt = null; // une reponse modifiee rouvre la passation
  persist();
}

function choiceBody(item, nav) {
  const order = state.presentation[item.id];
  const rows = order.map((optId, i) => {
    const opt = item.options.find((o) => o.id === optId);
    const textId = `opt-${item.id}-${optId}`;
    const radio = (which) => h("input", {
      type: "radio", name: which, value: optId, "aria-describedby": textId,
      onchange: () => {
        setChoice(state, item.id, which, optId);
        responsesChanged();
        sync();
      },
    });
    const best = radio("best");
    const worst = radio("worst");
    const bestNote = h("span", { class: "pick-note" });
    const worstNote = h("span", { class: "pick-note" });
    const row = h("li", { class: "opt" },
      h("p", { class: "opt-text", id: textId }, h("span", { class: "opt-num", "aria-hidden": "true" }, `${i + 1}.`), " ", opt.text),
      h("div", { class: "opt-picks" },
        h("label", { class: "pick pick-best" }, best, h("span", {}, "Plus efficace"), bestNote),
        h("label", { class: "pick pick-worst" }, worst, h("span", {}, "Moins efficace"), worstNote),
      ),
    );
    return { optId, row, best, worst, bestNote, worstNote };
  });

  // L'option deja retenue d'un cote est desactivee de l'autre, avec un texte
  // qui le dit : la couleur n'est jamais le seul signal.
  function sync() {
    const r = state.responses[item.id] || {};
    for (const o of rows) {
      o.best.checked = r.best === o.optId;
      o.worst.checked = r.worst === o.optId;
      o.best.disabled = r.worst === o.optId;
      o.worst.disabled = r.best === o.optId;
      o.bestNote.textContent = o.best.disabled ? " (déjà choisie comme moins efficace)" : "";
      o.worstNote.textContent = o.worst.disabled ? " (déjà choisie comme plus efficace)" : "";
      o.row.dataset.pick = r.best === o.optId ? "best" : r.worst === o.optId ? "worst" : "";
    }
    nav.setReady(isAnswered(item, r));
  }
  sync();
  return h("ol", { class: "opts", "aria-labelledby": "scenario" }, rows.map((o) => o.row));
}

function actBody(item, nav) {
  const current = state.responses[item.id]?.value;
  return h("fieldset", { class: "act" },
    h("legend", { class: "sr-only" }, "Fréquence"),
    Q.modules.ACT.scale.map((s) =>
      h("label", { class: "act-choice" },
        h("input", {
          type: "radio", name: "act", value: String(s.value), checked: current === s.value,
          onchange: () => {
            setActValue(state, item.id, s.value);
            responsesChanged();
            nav.setReady(true);
          },
        }),
        h("span", { class: "act-value" }, String(s.value)),
        h("span", {}, s.label),
      ),
    ),
  );
}

// --- Resultats ------------------------------------------------------------

function scoreRow(label, value, note = "") {
  return h("tr", {},
    h("th", { scope: "row" }, label),
    h("td", { class: "num" }, value === null ? h("span", {}, "manquant", note && h("span", { class: "muted" }, ` ${note}`)) : `${fmt(value)} / 100`),
    h("td", { class: "bar-cell", "aria-hidden": "true" }, value === null ? "" : h("div", { class: "bar" }, barFill(value / 100))),
  );
}

function scoreTable(caption, rows) {
  return h("div", { class: "table-wrap" },
    h("table", { class: "scores" },
      h("caption", {}, caption),
      h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Mécanisme"), h("th", { scope: "col" }, "Score"), h("th", { scope: "col" }, h("span", { class: "sr-only" }, "Barre")))),
      h("tbody", {}, rows),
    ),
  );
}

function notScored(label) {
  return h("p", { class: "not-scored" }, h("strong", {}, label));
}

function renderResults() {
  const scores = computeScores(Q, state, EXPERT_KEY);
  const mechs = Object.entries(Q.mechanisms);
  const base = `iam-v${Q.version}-${state.form}-reponses`;
  const exportJSON = () => download(`${base}.json`, "application/json", JSON.stringify(buildExport(Q, state, EXPERT_KEY), null, 2) + "\n");
  const exportCSV = () => download(`${base}.csv`, "text/csv", buildCSV(Q, state));
  const copyStatus = h("p", { class: "nav-status", role: "status", "aria-live": "polite" });

  show(
    h("section", { class: "card", "aria-labelledby": "t" },
      h("p", { class: "eyebrow" }, `IAM V${Q.version} — résultats, ${FORM_LABELS[state.form]}`),
      h("h1", { id: "t" }, "Vos résultats"),
      h("p", { class: "warn" },
        h("strong", {}, "Instrument expérimental pré-validation. "),
        "Les scores ci-dessous sont descriptifs et non étalonnés : ce ne sont pas des percentiles, ils ne vous comparent à personne. Les trois parties sont présentées séparément et ne sont jamais additionnées."),

      h("h2", {}, LABELS.ACT),
      h("p", {}, "Moyenne de vos réponses disponibles (Jamais = 0, Rarement = 25, Parfois = 50, Souvent = 75, Presque toujours = 100). Certaines lignes décrivent un comportement à éviter : leur échelle est retournée. Une réponse « Situation non rencontrée » est traitée comme manquante, jamais comme 0."),
      h("p", { class: "big" },
        "ACT global : ",
        h("strong", {}, scores.ACT.global === null ? LABELS.ACT_TOO_FEW : `${fmt(scores.ACT.global)} / 100`),
        h("span", { class: "muted" }, ` (${scores.ACT.available} réponse${scores.ACT.available > 1 ? "s" : ""} disponible${scores.ACT.available > 1 ? "s" : ""} sur ${scores.ACT.total}, ${scores.ACT.minimum} au minimum)`),
      ),
      scores.ACT.byMechanism
        ? [
            scoreTable("Activation déclarée par mécanisme", mechs.map(([m, name]) => scoreRow(`${m} — ${name}`, scores.ACT.byMechanism[m], "(pas assez de situations)"))),
            h("p", { class: "muted" }, "M11 décrit ce que vous déclarez faire ; il ne mesure pas votre résistance réelle à la pression."),
          ]
        : h("p", { class: "muted" }, "La forme courte ne compte qu’une ligne par mécanisme : elle ne donne pas de résultat par mécanisme."),

      h("h2", {}, "Jugement sur les situations (CAP)"),
      scores.CAP
        ? [
            h("p", { class: "big" }, "CAP global : ", h("strong", {}, `${fmt(scores.CAP.global)} / 100`), h("span", { class: "muted" }, ` — ${LABELS.EXPERIMENTAL}`)),
            scores.CAP.byMechanism
              ? scoreTable(`CAP par mécanisme — ${LABELS.EXPERIMENTAL}`, mechs.map(([m, name]) => scoreRow(`${m} — ${name}`, scores.CAP.byMechanism[m])))
              : null,
          ]
        : notScored(LABELS.CAP_NONE),

      h("h2", {}, "Jugement sur les situations combinées (INT)"),
      scores.INT
        ? h("p", { class: "big" }, "INT : ", h("strong", {}, `${fmt(scores.INT.global)} / 100`), h("span", { class: "muted" }, ` — ${LABELS.EXPERIMENTAL}`))
        : notScored(LABELS.INT_NONE),
      scores.CAP && scores.INT ? null : h("p", { class: "muted" },
        "Ces parties ne peuvent pas être notées tant qu’une clé de correction n’a pas été établie et validée par des experts. Vos réponses sont conservées dans l’export pour l’être plus tard."),

      transmitSection(),

      h("h2", {}, "Exporter"),
      h("p", { class: "privacy" }, "Vos réponses restent dans ce navigateur sauf si vous les exportez."),
      h("div", { class: "actions" },
        h("button", { class: "btn primary", type: "button", onclick: exportJSON }, "Exporter en JSON"),
        h("button", { class: "btn", type: "button", onclick: exportCSV }, "Exporter en CSV"),
        h("button", {
          class: "btn", type: "button",
          onclick: async () => {
            copyStatus.textContent = (await copy(resultsText(Q, state, scores))) ? "Résultats copiés dans le presse-papiers." : "Copie impossible dans ce navigateur.";
          },
        }, "Copier les résultats"),
      ),
      copyStatus,
    ),
    h("nav", { class: "nav", "aria-label": "Navigation du questionnaire" },
      h("button", { class: "btn", type: "button", onclick: () => goTo(state.cursor - 1) }, "Revoir mes réponses"),
    ),
    h("div", { class: "reset" }, resetButton()),
  );
}

// Transmission a l'etude : seulement si la personne a consenti au depart, et
// seulement sur son clic. Le code de participation est garde dans ce
// navigateur et affiche, pour exercer ses droits.
function transmitSection() {
  if (!state.consent?.accepted || !COLLECT) return null;
  const section = h("div", {});
  const render = () => {
    const status = h("p", { class: "nav-status", role: "status", "aria-live": "polite" });
    const sent = state.transmission;
    section.replaceChildren(
      h("h2", {}, "Transmettre à l’étude"),
      sent
        ? [
            h("p", {}, "Vos réponses ont été transmises. Merci."),
            h("p", { class: "code-box" }, "Votre code de participation : ", h("strong", {}, sent.code)),
            h("p", {}, "Notez-le : sans lui, vos réponses ne peuvent pas être retrouvées, car aucune donnée ne vous identifie. Il permet de les consulter ou de les effacer sur la ",
              h("a", { href: "confidentialite/" }, "page de confidentialité"), "."),
          ]
        : !collectOpen(COLLECT)
          ? h("p", { class: "muted" }, "La collecte est close : vos réponses ne peuvent plus être transmises.")
          : [
              h("p", {}, "Vous avez accepté de participer à l’étude. Rien n’a encore été envoyé."),
              h("div", { class: "actions" },
                h("button", {
                  class: "btn primary", type: "button",
                  onclick: async (ev) => {
                    // currentTarget est remis a null apres l'evenement : on
                    // garde le bouton pour le reactiver en cas d'echec.
                    const btn = ev.currentTarget;
                    btn.disabled = true;
                    status.textContent = "Transmission en cours…";
                    const res = await submitPassation(COLLECT, buildSubmission(Q, state));
                    if (res.ok) {
                      state.transmission = { code: res.data.code, at: new Date().toISOString() };
                      persist();
                      render();
                    } else {
                      btn.disabled = false;
                      status.textContent = res.error;
                    }
                  },
                }, "Transmettre mes réponses"),
              ),
              status,
            ],
    );
  };
  render();
  return section;
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Repli pour les contextes sans API presse-papiers.
    const ta = h("textarea", { class: "sr-only", readonly: true });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

// Point d'entree direct, comme l'Atlas : …/#test demarre la forme complete et
// …/#court la forme courte, sans passer par l'accueil -- sauf si une
// passation est en cours, qu'on propose alors de reprendre plutot que de
// l'ecraser.
const DIRECT = { "#test": "complet", "#court": "court" };
if (DIRECT[window.location.hash] && !(state && Object.keys(state.responses).length)) begin(DIRECT[window.location.hash]);
else renderWelcome();

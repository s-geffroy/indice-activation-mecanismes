#!/usr/bin/env node
// Convertit le Markdown du questionnaire en module ES consomme par le site.
//
//   node tools/build-questionnaire.mjs            ecrit site/data/questionnaire.js
//   node tools/build-questionnaire.mjs --check    echoue si le fichier n'est plus a jour
//
// Le texte des items n'est jamais recopie a la main : on le relit depuis la
// source, pour qu'une correction du questionnaire ne diverge pas du site.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE = join(root, "specs/koh-lanta_IAM/QUESTIONNAIRE_IAM_V2_1.md");
export const TARGET = join(root, "site/data/questionnaire.js");

// Identite publiee de l'instrument. La version suit celle du questionnaire
// source (V2.1) ; le nom remplace son nom de travail (« Indice d'Activation
// des Mecanismes »). C'est ici, et non dans les specs, qu'ils sont fixes.
export const IDENTITY = {
  version: "2.1",
  title: "Indice d’Activation et de Maîtrise des mécanismes",
  source: "QUESTIONNAIRE_IAM_V2_1.md",
};

export function parseQuestionnaire(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/, ""));
  const q = { instrument: "IAM", version: "2.1", title: "", subtitle: "", mechanisms: {}, modules: {}, items: [] };
  let module = null;
  let section = null; // "dimensions" | "consigne" | "item" | "scoring"
  let item = null;

  const flushItem = () => {
    if (!item) return;
    item.text = joinParagraphs(item.text);
    q.items.push(item);
    item = null;
  };

  for (const line of lines) {
    let m;
    if ((m = line.match(/^# IAM V(\S+)$/))) { q.version = m[1]; continue; }
    if ((m = line.match(/^## (Indice .+)$/)) && !q.title) {
      [q.title, q.subtitle] = m[1].split(/\s+—\s+/);
      section = null;
      continue;
    }
    if (line === "## Dimensions") { section = "dimensions"; continue; }
    if ((m = line.match(/^# Module (CAP|ACT|INT)\b/))) {
      flushItem();
      module = m[1];
      q.modules[module] = { consigne: [], scale: [] };
      section = null;
      continue;
    }
    if (line.startsWith("# Note de scoring")) { flushItem(); module = null; section = "scoring"; continue; }
    if (line === "## Consigne") { section = "consigne"; continue; }
    if ((m = line.match(/^### (Q\d+)(?: — (M\d+))?$/))) {
      flushItem();
      item = { id: m[1], module, mechanism: m[2] || null, text: [], options: [] };
      section = "item";
      continue;
    }
    if (line === "---") continue;

    if (section === "dimensions" && (m = line.match(/^\| (M\d+) \| (.+) \|$/))) {
      q.mechanisms[m[1]] = m[2];
    } else if (section === "consigne") {
      if ((m = line.match(/^([0-4X]) — (.+)$/))) {
        q.modules[module].scale.push({ value: m[1] === "X" ? "X" : Number(m[1]), label: m[2] });
      } else {
        q.modules[module].consigne.push(line);
      }
    } else if (section === "item") {
      if ((m = line.match(/^([A-D])\. (.+)$/))) item.options.push({ id: m[1], text: m[2] });
      else item.text.push(line);
    }
  }
  flushItem();
  for (const mod of Object.values(q.modules)) mod.consigne = joinParagraphs(mod.consigne);
  return { ...q, ...IDENTITY };
}

// Lignes -> paragraphes (une ligne vide separe deux paragraphes ; les listes
// "1. ..." restent une ligne chacune).
function joinParagraphs(lines) {
  const out = [];
  let cur = [];
  const push = () => { if (cur.length) out.push(cur.join(" ")); cur = []; };
  for (const l of lines) {
    if (l === "") push();
    else if (/^\d+\. /.test(l)) { push(); out.push(l); }
    else cur.push(l.trim());
  }
  push();
  return out;
}

export function render(q) {
  return (
    "// GENERE par tools/build-questionnaire.mjs depuis\n" +
    "// QUESTIONNAIRE_IAM_V2_1.md (voir specs/) -- ne pas editer a la main.\n" +
    `export const QUESTIONNAIRE = ${JSON.stringify(q, null, 2)};\n`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = render(parseQuestionnaire(readFileSync(SOURCE, "utf8")));
  if (process.argv.includes("--check")) {
    if (readFileSync(TARGET, "utf8") !== out) {
      console.error("site/data/questionnaire.js n'est plus a jour : relancer tools/build-questionnaire.mjs");
      process.exit(1);
    }
    console.log("site/data/questionnaire.js a jour");
  } else {
    writeFileSync(TARGET, out);
    console.log(`ecrit ${TARGET}`);
  }
}

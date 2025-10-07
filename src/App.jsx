import React, { useEffect, useMemo, useState } from "react";


// FCD Diagnostic Orientation Aid – Interactive Checklist
const ITEMS = [
  { id: 1,
    label: "Besteht eine Diskrepanz zwischen dem Ausmaß der berichteten Symptome und der Alltagsfunktion?",
    onlyFull: false,
    instruction:
      "Subjektiv berichtete ausgeprägte kognitive Schwierigkeiten und/oder niedrige standardisierte kognitive Testergebnisse stehen im Gegensatz zu Beispielen wie: - Fähigkeit, eine kognitiv anspruchsvolle Arbeit ohne Schwierigkeiten auszuüben, - im Gespräch beobachtete kommunikative Fähigkeiten oder - die Fähigkeit, Tätigkeiten wie Lesen, Finanzverwaltung und Autofahren ohne Probleme auszuführen.",
  },
  { id: 2,
    label: "Kann der Patient konkrete Beispiele für Gedächtnisbeschwerden nennen?",
    onlyFull: false,
    instruction:
      "Während des Gesprächs nennt der Patient spezifische Beispiele für Gedächtnisausfälle mit detaillierten, über die erfragten Informationen hinausgehenden Angaben. Im Gegensatz zu Patienten mit Neurodegeneration können Patienten mit Funktioneller Kognitiver Störung oft längere Zeit ununterbrochen berichten.",
  },
  { id: 3,
    label: "Sind die kognitiven Symptome ablenkbar und/oder fluktuierend (z. B. variabel in unterschiedlichen Situationen)?",
    onlyFull: true,
    instruction:
      "Schwierigkeiten treten nur in bestimmten Situationen auf … (Abgrenzung zu Delir/Lewy-Body-Demenz).",
  },
  { id: 4,
    label: "Kann der Patient die Liste der verordneten Medikamente nennen und/oder frühere Kontakte mit anderen Ärzten (Diagnosen/Untersuchungen) erinnern?",
    onlyFull: true,
    instruction:
      "Wiedergabe früherer Arztkontakte/Diagnosen. Medikamentenliste samt Indikationen aus dem Gedächtnis → Inkongruenz zu berichteten Symptomen.",
  },
  { id: 5,
    label: "Gibt es eine Vorgeschichte einer nicht-kognitiven funktionellen neurologischen Störung und/oder funktioneller somatischer Störungen (Schmerzen, Fatigue, Dissoziation …)?",
    onlyFull: false,
    instruction:
      "Vorhandensein anderer funktioneller Symptome/Diagnosen kann ein hilfreicher (nicht notwendiger) Hinweis sein.",
  },
  { id: 6,
    label: "Ist der Patient sich der kognitiven Veränderungen stärker bewusst als andere (z. B. Selbstüberweisung und/oder alleinige Vorstellung)?",
    onlyFull: false,
    instruction:
      "Fremdanamnese: Besorgnis des Patienten größer als die der Angehörigen; alleinige Vorstellung/Selbstüberweisung.",
  },
  { id: 7,
    label: "Ist die kognitive Leistung normal oder inkonsistent (z. B. schlechter beim unmittelbaren als verzögerten Erinnern, besser rückwärts als vorwärts, ungefähre Antworten)?",
    onlyFull: true,
    instruction:
      "Intra-/intramodale Inkonsistenz ist wichtiger als „normal“. Besser bei automatischem Abruf; geringe Persistenz/vage Antworten können sich durch Ermutigung verbessern.",
  },
  { id: 8,
    label: "Sind die Gedächtnissymptome im Verlauf stabil oder gebessert?",
    onlyFull: false,
    instruction:
      "Abrupter Beginn + Stabilität/Langzeit ohne Progression bzw. Besserung; Vorsicht bei VCI/SHT (Komorbiditäten!).",
  },
  { id: 9,
    label: "Kann der Patient den Symptombeginn präzise datieren (abrupter Beginn)?",
    onlyFull: false,
    instruction:
      "Exakte Datierung, teils im Kontext von Migräne/Dissoziation/leichtem SHT.",
  },
  { id: 10,
    label: "Gibt es einen offensichtlichen psychologischen Stressor?",
    onlyFull: false,
    instruction:
      "Stressoren können prädisponierend, auslösend oder aufrechterhaltend sein; nie isoliert interpretieren.",
  },
  { id: 11,
    label: "Kann der Patient zusammengesetzte/mehrteilige Fragen beantworten?",
    onlyFull: true,
    instruction:
      "Teile beantworten wurde bei FCD häufiger berichtet; bei MCI auch möglich, aber oft nicht inkongruent.",
  },
];

function InstructionText({ text }) {
  if (!text) return null;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const isList = lines.some((l) => /^[-•]/.test(l));
  if (isList) {
    return (
      <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed text-slate-700">
        {lines.map((l, i) => (
          <li key={i}>{l.replace(/^[-•]\s*/, "")}</li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">
      {text}
    </p>
  );
}

// -1 = nicht gesetzt, 0 = Nein/nicht getestet, 1 = Ja
const initialSelections = Object.fromEntries(ITEMS.map((i) => [i.id, -1]));
const STORAGE_KEY = "fcd-checklist-v1";

function App() {
  const [isFull, setIsFull] = useState(false); // false = Kurzversion
  const [selections, setSelections] = useState(initialSelections);
  const [activeInfoId, setActiveInfoId] = useState(null);

  // Pop-up (Impressum & Datenschutz)
const [showLegal, setShowLegal] = useState(false);

// ESC schließt das Pop-up
useEffect(() => {
  if (!showLegal) return;
  const onKey = (e) => { if (e.key === "Escape") setShowLegal(false); };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [showLegal]);

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.selections) setSelections(saved.selections);
        if (typeof saved?.isFull === "boolean") setIsFull(saved.isFull);
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ selections, isFull }));
    } catch {}
  }, [selections, isFull]);

  const visibleItems = useMemo(
    () => ITEMS.filter((it) => (isFull ? true : !it.onlyFull)),
    [isFull]
  );

  const totalScore = useMemo(
    () =>
      Object.entries(selections)
        .filter(([id]) => visibleItems.some((v) => v.id === Number(id)))
        .reduce((sum, [, val]) => sum + (val === 1 ? 1 : 0), 0),
    [selections, visibleItems]
  );

  const answeredCount = useMemo(
    () =>
      Object.entries(selections)
        .filter(([id, val]) => visibleItems.some((v) => v.id === Number(id)) && val !== -1)
        .length,
    [selections, visibleItems]
  );

  const maxScore = visibleItems.length;
  const progressPct = maxScore ? Math.round((answeredCount / maxScore) * 100) : 0;

  // Cutoff/probability visualization helpers
  const cutoff = isFull ? 6 : 4;
  const cutoffPct = maxScore ? Math.round((cutoff / maxScore) * 100) : 0;
  const probText = totalScore >= cutoff
    ? "Oberhalb des Cut-offs: hohe Spezifität (~97%) und positiver Vorhersagewert ~91% für funktionelle kognitive Störung (Pilotdaten)."
    : "Unterhalb des Cut-offs: Funktionelle kognitive Störung wenig wahrscheinlich; bitte klinische Beurteilung und Verlauf beachten.";

  const handleSet = (id, val) => {
    setSelections((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    const ok = window.confirm("Alle Antworten zurücksetzen?");
    if (!ok) return;
    setSelections(initialSelections);
    setActiveInfoId(null);
  };

  const activeItem = useMemo(
    () => (activeInfoId ? ITEMS.find((i) => i.id === activeInfoId) ?? null : null),
    [activeInfoId]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Funktionelle kognitive Störungen – Diagnostische Orientierungshilfe
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-slate-600">Kurzversion</span>
              <button
                role="switch"
                aria-checked={isFull}
                onClick={() => setIsFull((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ring-1 ring-inset ${
                  isFull ? "bg-blue-600 ring-blue-600" : "bg-slate-200 ring-slate-300"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                title="Kurz-/Vollversion umschalten"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    isFull ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600">Vollversion</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {/* Score pill */}
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
                {totalScore} / {maxScore} Punkte
              </span>
            </div>
            {/* Probability visualization */}
            <div className="mt-2 w-full max-w-md">
              <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 transition-all ${totalScore >= cutoff ? "bg-emerald-600" : "bg-slate-400"}`}
                  style={{ width: `${Math.max(0, Math.min(100, Math.round((totalScore / maxScore) * 100)))}%` }}
                  aria-label={`Score-Balken ${totalScore} von ${maxScore}`}
                />
                <div className="absolute top-0 bottom-0" style={{ left: `${cutoffPct}%` }}>
                  <div
                    className="h-full w-0.5 bg-slate-600/60"
                    title={`Cut-off ${cutoff}`}
                    aria-label={`Cut-off ${cutoff}`}
                    role="img"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">{probText}</p>
            </div>
          </div>

        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <section className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 col-span-full">
            {visibleItems.map((it, idx) => {
              const val = selections[it.id];
              const isYes = val === 1;
              const isNo = val === 0;
              const isActive = activeInfoId === it.id;

              return (
                <React.Fragment key={it.id}>
                  {/* Item card (left, spans 2 columns on md+) */}
                  <div
                    className={`md:col-span-2 rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ring-1 ${
                      isActive
                        ? "border-blue-300 ring-blue-200 bg-white"
                        : "border-slate-200 ring-black/5 bg-white/95"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span className="mt-1 text-sm font-semibold text-slate-400 flex-none">
                            {idx + 1}.
                          </span>
                          <p className="text-base sm:text-lg font-medium leading-snug flex-1 min-w-0">
                            {it.label}
                            {!isFull && it.onlyFull && (
                              <span className="ml-2 text-xs font-normal text-slate-500 align-middle">
                                (nur Vollversion)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {it.instruction && (
                        <button
                          onClick={() => setActiveInfoId((cur) => (cur === it.id ? null : it.id))}
                          className={`rounded-xl border px-3 py-1.5 text-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isActive
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                          aria-pressed={isActive}
                          title="Instruktion anzeigen"
                        >
                          Instruktion
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSet(it.id, 0)}
                        className={`rounded-xl px-3 py-2 text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                          isNo
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        Nein/nicht getestet
                      </button>
                      <button
                        onClick={() => handleSet(it.id, 1)}
                        className={`rounded-xl px-3 py-2 text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                          isYes
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        Ja
                      </button>
                    </div>
                    {/* Inline instruction on small screens */}
                    {it.instruction && isActive && (
                      <div className="mt-3 md:hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Instruktion</p>
                        <InstructionText text={it.instruction} />
                      </div>
                    )}
                  </div>

                  {/* Desktop instruction panel placed next to this item only when active */}
                  {it.instruction && isActive && (
                    <div className="hidden md:block md:col-span-1">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
                        <h2 className="text-base font-semibold mb-2">Instruktionen</h2>
                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                          Item {ITEMS.findIndex(i => i.id === it.id) + 1}
                        </p>
                        <p className="text-sm font-medium text-slate-900 mb-2">
                          {it.label}
                        </p>
                        <InstructionText text={it.instruction} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Controls below list */}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={handleReset}
                className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Zurücksetzen
              </button>
              <div className="text-sm text-slate-600">
                <span className="inline-block mr-3">Legende:</span>
                <span className="inline-flex items-center mr-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 mr-1.5"></span>
                  Ja = 1 Punkt
                </span>
                <span className="inline-flex items-center">
                  <span className="h-2 w-2 rounded-full bg-slate-400 mr-1.5"></span>
                  Nein/nicht getestet = 0 Punkte
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4 text-xs text-slate-600 sm:text-[13px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          </div>

          {/* Hinweise */}
          <div className="leading-relaxed">
            <p>
              Diese Checkliste basiert auf Cabreira&nbsp;et&nbsp;al., <em>BMJ Neurology Open</em> (2025).{" "}
              <a
                href="https://doi.org/10.1136/bmjno-2024-000918"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-slate-400 hover:decoration-slate-600"
              >
                https://doi.org/10.1136/bmjno-2024-000918
              </a>
            </p>
            <p className="mt-1">
              WebApp entwickelt von J.&nbsp;Jungilligens (Klinik für Neurologie, Knappschaft Kliniken
              Universitätsklinikum Bochum), J.&nbsp;Beckers (Klinik für Neurologie, Knappschaft Kliniken
              Universitätsklinikum Bochum) und S.&nbsp;Popkirov (Klinik für Neurologie, Universitätsklinikum Essen).
            </p>
            <p className="mt-1">
              <strong>Datenschutz:</strong> Diese WebApp speichert, verarbeitet oder überträgt keinerlei personenbezogene Daten. 
              Alle Eingaben verbleiben ausschließlich im Browser der Nutzerinnen und Nutzer und werden nicht an Server oder Dritte übermittelt.
            </p>
            <p className="mt-1">
              <strong>Haftungsausschluss:</strong> Diese WebApp richtet sich ausschließlich an Angehörige der Gesundheitsberufe und dient als ergänzende Orientierungshilfe. 
              Sie ersetzt <em>keine</em> ärztliche Anamnese, Untersuchung, Diagnostik oder Therapieentscheidung. 
              Die hier dargestellten Cut-offs und Wahrscheinlichkeiten beruhen auf Pilotdaten (Cabreira&nbsp;et&nbsp;al., 2025) und bedürfen prospektiver Validierung; 
              eine Gewähr für Vollständigkeit, Richtigkeit und Aktualität wird nicht übernommen. 
              Die Verantwortung für die Beurteilung des Einzelfalls liegt bei der behandelnden Ärztin/dem behandelnden Arzt. 
              Eine Haftung der Autorinnen/Autoren und Betreiber für Schäden, die aus der Nutzung oder dem Vertrauen auf die bereitgestellten Informationen entstehen, ist – außer bei Vorsatz und grober Fahrlässigkeit – ausgeschlossen.
            </p>
            <p className="mt-1">
              <button
                type="button"
                onClick={() => setShowLegal(true)}
                className="underline decoration-slate-400 hover:decoration-slate-600"
              >
                Impressum 
              </button>
              
            </p>
          </div>
        </div>
      </footer>
      {showLegal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowLegal(false)}
      aria-hidden="true"
    />
    {/* Dialog */}
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
      className="relative max-w-2xl w-full rounded-2xl bg-white shadow-xl ring-1 ring-black/10"
    >
      <div className="flex items-start justify-between px-4 py-3 border-b border-slate-200">
        <h3 id="legal-title" className="text-base font-semibold">
          Impressum 
        </h3>
        <button
          type="button"
          onClick={() => setShowLegal(false)}
          className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
          aria-label="Pop-up schließen"
        >
          ✕
        </button>
      </div>

            <div className="px-4 py-4 space-y-4 text-sm leading-relaxed text-slate-700">
              <section>
                <h4 className="font-semibold text-slate-900 mb-1">Impressum</h4>
                <p>
                  Verantwortlich: Dr. J. Jungilligens<br/>
                  Klinik für Neurologie, Knappschaft Kliniken Universitätsklinikum Bochum<br/>
                  In der Schornau 23–25, 44892 Bochum
                </p>
                <p className="mt-2 text-slate-600">
                  Hinweis: Diese WebApp ist <strong>kein offizielles Projekt</strong> der Klinik.
                </p>
              </section>

            </div>

            <div className="px-4 py-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLegal(false)}
                className="rounded-lg border px-3 py-1.5 text-sm bg-white hover:bg-slate-50 border-slate-300"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

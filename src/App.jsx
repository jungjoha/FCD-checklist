import React, { useMemo, useState } from "react";

// FCD Diagnostic Orientation Aid – Interactive Checklist
const ITEMS = [
  {
    id: 1,
    label:
      "Besteht eine Diskrepanz zwischen dem Ausmaß der berichteten Symptome und der Alltagsfunktion?",
    onlyFull: false,
    instruction:
      "Subjektiv berichtete ausgeprägte kognitive Schwierigkeiten und/oder niedrige standardisierte kognitive Testergebnisse stehen im Gegensatz zu Beispielen wie: Fähigkeit, eine kognitiv anspruchsvolle Arbeit ohne Schwierigkeiten auszuüben, im Gespräch beobachtete kommunikative Fähigkeiten oder die Fähigkeit, Tätigkeiten wie Lesen, Finanzverwaltung und Autofahren ohne Probleme auszuführen.",
  },
  {
    id: 2,
    label:
      "Kann der Patient konkrete Beispiele für Gedächtnisbeschwerden nennen?",
    onlyFull: false,
    instruction:
      "Während des Gesprächs nennt der Patient spezifische Beispiele für Gedächtnisausfälle mit detaillierten, über die erfragten Informationen hinausgehenden Angaben. Im Gegensatz zu Patienten mit Neurodegeneration können Patienten mit FCD oft längere Zeit ununterbrochen berichten.",
  },
  {
    id: 3,
    label:
      "Sind die kognitiven Symptome ablenkbar und/oder fluktuierend (z. B. variabel in unterschiedlichen Situationen)?",
    onlyFull: true,
    instruction:
      "Schwierigkeiten treten nur in bestimmten Situationen auf: z. B. gute Aufmerksamkeit im Interview, aber unverhältnismäßige Beeinträchtigung bei Tests oder wenn die Aufmerksamkeit auf die Symptome gelenkt wird. Dies unterscheidet sich von einfacher zeitlicher Fluktuation (z. B. Delir, Lewy-Body-Demenz).",
  },
  {
    id: 4,
    label:
      "Kann der Patient die Liste der verordneten Medikamente nennen und/oder frühere Kontakte mit anderen Ärzten (Diagnosen/Untersuchungen) erinnern?",
    onlyFull: true,
    instruction:
      "Fähigkeit, frühere Arztkontakte samt Diagnosen/Untersuchungen wiederzugeben. Ebenso die Fähigkeit, eine Medikamentenliste samt Indikationen aus dem Gedächtnis zu nennen – Hinweis auf gutes Gedächtnis und Inkongruenz zu berichteten Symptomen.",
  },
  {
    id: 5,
    label:
      "Gibt es eine Vorgeschichte einer nicht-kognitiven funktionellen neurologischen Störung und/oder funktioneller somatischer Störungen (Schmerzen, Fatigue, Dissoziation …)?",
    onlyFull: false,
    instruction:
      "Vorhandensein anderer funktioneller Symptome oder Diagnosen kann ein hilfreicher (nicht notwendiger) Hinweis auf FCD sein.",
  },
  {
    id: 6,
    label:
      "Ist der Patient sich der kognitiven Veränderungen stärker bewusst als andere (z. B. Selbstüberweisung und/oder alleinige Vorstellung)?",
    onlyFull: false,
    instruction:
      "Fremdanamnese zeigt oft, dass die Besorgnis des Patienten größer ist als die der Begleitperson/Angehörigen. Unterstützend: alleinige Vorstellung oder Selbstüberweisung.",
  },
  {
    id: 7,
    label:
      "Ist die kognitive Leistung normal oder zeigt sie ein inkonsistentes Muster (z. B. schlechter beim unmittelbaren als beim verzögerten Erinnern, besseres Rückwärts- als Vorwärts-Nachsprechen von Ziffern, ungefähre Antworten)?",
    onlyFull: true,
    instruction:
      "Wichtiger als normale Leistung ist Inkonsistenz – v. a. innerhalb derselben Domäne. Bessere Leistung bei automatischem als bei explizitem Abruf. Manche zeigen geringe Persistenz oder vage Antworten, die sich durch Ermutigung verbessern. Mitfaktoren (Bewusstseinsfluktuation, psychiatrischer Zustand, Kopfschmerz) berücksichtigen.",
  },
  {
    id: 8,
    label: "Sind die Gedächtnissymptome im Verlauf stabil oder gebessert?",
    onlyFull: false,
    instruction:
      "Abrupter Beginn und dann Stabilität oder lange Symptomgeschichte ohne Progression/mit Besserung. Vorsicht bei vaskulärer kognitiver Beeinträchtigung oder nach SHT – dort kann Stabilität/Besserung durch Komorbiditätsmanagement erklärbar sein.",
  },
  {
    id: 9,
    label: "Kann der Patient den Symptombeginn präzise datieren (abrupter Beginn)?",
    onlyFull: false,
    instruction:
      "Manche können den Beginn genau beschreiben, teils im Zusammenhang mit Ereignissen wie Migräneattacke, Dissoziationsepisode oder leichtem Schädeltrauma.",
  },
  {
    id: 10,
    label: "Gibt es einen offensichtlichen psychologischen Stressor?",
    onlyFull: false,
    instruction:
      "Psychologische Stressoren können prädisponierende, auslösende oder aufrechterhaltende Faktoren sein. Bei manchen ist die Pathophysiologie mit Depression/Angst und belastenden Lebensereignissen verknüpft. Nie isoliert interpretieren, da auch bei Neurodegeneration möglich.",
  },
  {
    id: 11,
    label: "Kann der Patient zusammengesetzte/mehrteilige Fragen beantworten?",
    onlyFull: true,
    instruction:
      "Adressieren von Teilen einer zusammengesetzten Frage wurde bei FCD häufiger berichtet als bei Neurodegeneration. MCI-Patienten können dies oft ebenfalls (v. a. bei hoher Bildung); bei FCD jedoch inkongruent zu schwerer Symptomschilderung.",
  },
];

// -1 = nicht gesetzt, 0 = Nein/nicht getestet, 1 = Ja
const initialSelections = Object.fromEntries(ITEMS.map((i) => [i.id, -1]));

function App() {
  const [isFull, setIsFull] = useState(false); // false = Kurzversion
  const [selections, setSelections] = useState(initialSelections);
  const [activeInfoId, setActiveInfoId] = useState(null);

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

  const maxScore = visibleItems.length;

  const handleSet = (id, val) => {
    setSelections((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setSelections(initialSelections);
    setActiveInfoId(null);
  };

  const activeInstruction = useMemo(() => {
    if (activeInfoId == null) return null;
    const it = ITEMS.find((i) => i.id === activeInfoId);
    return it?.instruction ?? null;
  }, [activeInfoId]);

  return (
    <div className="min-h-screen font-sans antialiased bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Funktionelle kognitive Störungen – Diagnostische Orientierungshilfe
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Kurzcheck & Vollversion mit Instruktionen
            </p>
          </div>

          <div className="flex items-center gap-3">
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
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <section className="md:col-span-2">
          <div className="space-y-4">
            {visibleItems.map((it, idx) => {
              const val = selections[it.id];
              const isYes = val === 1;
              const isNo = val === 0;
              return (
                <div
                  key={it.id}
                  className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm hover:shadow-md transition-shadow ring-1 ring-black/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 flex-wrap">
                        <span className="mt-1 text-sm font-semibold text-slate-400">
                          {idx + 1}.
                        </span>
                        <p className="text-base sm:text-lg font-medium leading-snug text-slate-900">
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
                        onClick={() =>
                          setActiveInfoId((cur) => (cur === it.id ? null : it.id))
                        }
                        className={`rounded-xl border px-3 py-1.5 text-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          activeInfoId === it.id
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                        aria-pressed={activeInfoId === it.id}
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
                      Nein / nicht getestet
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
                </div>
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

        {/* Instruction panel */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-base font-semibold mb-2 text-slate-900">
              Instruktions-Kasten
            </h2>
            {activeInstruction ? (
              <p className="text-sm leading-relaxed text-slate-700">
                {activeInstruction}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Klicken Sie bei einem Item auf{" "}
                <span className="font-medium">„Instruktion“</span>, um die
                Bewertungsanleitung hier anzuzeigen.
              </p>
            )}
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Version:{" "}
            {isFull
              ? "Vollversion (alle 11 Items)"
              : `Kurzversion (${ITEMS.filter((i) => !i.onlyFull).length} Items)`}
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-slate-500">Gesamtpunktzahl</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
              {totalScore} / {maxScore}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
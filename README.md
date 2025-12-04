# FCD – Diagnostische Orientierungshilfe  
Interaktive WebApp zur Unterstützung der klinischen Einschätzung funktioneller kognitiver Störungen (FCD)

[Live-Version auf Vercel](https://fks-checkliste.vercel.app)

---

## 📌 Projektbeschreibung

Diese WebApp implementiert die diagnostische FCD-Checkliste basierend auf:

**Cabreira et al., _BMJ Neurology Open_ (2025)**  
https://doi.org/10.1136/bmjno-2024-000918

Die Checkliste dient als **ergänzende klinische Orientierungshilfe** zur Unterscheidung funktioneller kognitiver Störungen von anderen neurokognitiven Erkrankungen.  
Die WebApp zeigt dynamisch:

- Kurz- und Vollversion der Checkliste  
- Punktevergabe pro Item  
- Live-Gesamtscore  
- Instruktionsfeld per Item  
- Probability-Indicator basierend auf publizierten Cut-offs  
- Speicherung im Browser (LocalStorage)  
- Keine Datenübertragung an Server oder Dritte  

---

## 🚀 Technologien

| Technologie | Verwendung |
|------------|------------|
| **React (Vite)** | Frontend-Framework |
| **Tailwind CSS v4** | Styling |
| **LocalStorage** | Lokale Zwischenspeicherung |
| **Vercel** | Deployment |
| **GitHub** | Versionskontrolle / CI |

---

## 🧭 Features

### ✔️ Interaktive Checkliste  
- 11-Item Vollversion bzw. 7-Item Kurzversion  
- Umschaltung per Toggle  

### ✔️ Dynamische Bewertung  
- „Ja“ → 1 Punkt  
- „Nein / nicht getestet“ → 0 Punkte  
- Live-Gesamtscore & maximal mögliche Punkte  

### ✔️ Probability-Indicator  
Basierend auf publizierten Cut-offs:  
- **Vollversion:** Score ≥ 6 → hohe Spezifität (~97%)  
- **Kurzversion:** Score ≥ 4 → hohe Spezifität (~97%)  

### ✔️ Datenschutzfreundlich  
- Speichert **ausschließlich lokal** im Browser  
- **Keine personenbezogenen Daten**, kein Tracking  

---

## 📦 Lokale Entwicklung

### 1. Repository klonen
```bash
git clone https://github.com/jungjoha/FCD-checklist.git
cd FCD-checklist
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Dev-Server starten
```bash
npm run dev
```

Läuft typischerweise unter:  
👉 http://localhost:5173/

---

## 🧹 Deployment auf Vercel

Deployment erfolgt **automatisch**, sobald Änderungen in den GitHub Branch `main` gepusht werden.

Ablauf:
```bash
git add .
git commit -m "Beschreibung"
git push
```

---

## 🔒 Datenschutz

Diese WebApp speichert **keine personenbezogenen Daten**.  
Alle Eingaben verbleiben ausschließlich im Browser und werden **nicht übertragen**.

---

## ⚖️ Haftungsausschluss

Diese WebApp richtet sich an **Angehörige der Gesundheitsberufe**.  
Sie ersetzt **keine** klinische Untersuchung oder Diagnostik.  
Die dargestellten Cut-offs basieren auf Pilotdaten (Cabreira et al., 2025).  
Eine Haftung der Autor:innen ist – außer bei Vorsatz oder grober Fahrlässigkeit – ausgeschlossen.

---

## 👥 Autor:innen

- **J. Jungilligens** (Klinik für Neurologie, Knappschaft Kliniken Universitätsklinikum Bochum)  
- **J. Beckers** (Klinik für Neurologie, Knappschaft Kliniken Universitätsklinikum Bochum)  
- **S. Popkirov** (Klinik für Neurologie, Universitätsklinikum Essen)  

---

## 📄 Zitieren

Wenn Sie die Checkliste wissenschaftlich verwenden, zitieren Sie bitte:

Cabreira V, Alty J, Antic S, et al.  
*Development of a diagnostic checklist to identify functional cognitive disorder versus other neurocognitive disorders.*  
BMJ Neurology Open. 2025.

---

## 🛠️ Lizenz

Der Code dieses Projekts ist **Open Source** und wird unter der Lizenz  
**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**  
bereitgestellt.

Dies bedeutet:

- ✔️ **Namensnennung erforderlich**  
- ❌ **Keine kommerzielle Nutzung erlaubt**  
- ✔️ Bearbeitungen, Remixe und Weitergaben sind erlaubt,  
  **solange sie nicht kommerziell sind** und die ursprünglichen Autor:innen genannt werden.

Vollständiger Lizenztext:  
https://creativecommons.org/licenses/by-nc/4.0/legalcode

**Empfohlene Zitierweise:**

J. Jungilligens, J. Beckers & S. Popkirov (2025).  
*FCD – Diagnostische Orientierungshilfe (WebApp).*  
GitHub Repository: https://github.com/jungjoha/FCD-checklist
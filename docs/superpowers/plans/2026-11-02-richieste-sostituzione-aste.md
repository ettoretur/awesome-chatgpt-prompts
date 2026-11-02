# Procedura HTML richiesta sostituzione aste — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produrre un unico file `dist/richiesta-sostituzione.html` autonomo che guida il cliente nella richiesta di sostituzione delle aste a gas e prepara l'invio via email.

**Architecture:** Sorgenti JS classici (CommonJS-compatibili) in `richiesta-sostituzione/src/`, testabili con `node:test`. Uno script di build li inlinea in un template HTML producendo un solo file senza dipendenze. Nessun backend.

**Tech Stack:** HTML/CSS/JS vanilla; Node (`node:test`, nessuna dipendenza npm); Playwright già installato (`require('playwright')`) per gli e2e.

**Spec:** `docs/superpowers/specs/2026-11-02-richieste-sostituzione-aste-design.md`

## Global Constraints

- Lingua: solo italiano; tutti i testi UI in un unico oggetto `TESTI` in `src/testi.js`.
- Un solo file di output, nessuna risorsa esterna (niente `<script src>`, `<link href>`, font o immagini remote).
- Destinatario: `info@italianaferramenta.it`. Oggetto: `Richiesta sostituzione aste [RS-AAAAMMGG-XXXX] — [modello], [forza] N`.
- Garanzia: `garanziaMesi` = 24 (SEGNAPOSTO), dalla data del documento; ultimo giorno incluso.
- Valori di prodotto non verificati marcati `TODO-SEGNAPOSTO` in `src/catalogo.js`.
- `mailto:` ≤ 1800 caratteri; spazi codificati `%20`, mai `+`.
- `sessionStorage`: ogni accesso in try/catch; la procedura funziona senza.
- Responsive da 360 px, nessuno scroll orizzontale, tastiera completa, errori in `aria-live`, contrasto AA, tema chiaro/scuro.
- Nessun dato lascia il browser prima che il cliente invii l'email.
- Fuori garanzia non blocca l'invio: marca la richiesta "DA VALUTARE".

## Review Focus

1. Caratteri speciali (`&`, `#`, `%`, `+`, accenti, a capo) nel corpo email: devono arrivare intatti (Task 4).
2. Descrizione guasto lunghissima (5000 caratteri): `mailto:` troncato entro il limite, testo completo in "Copia testo" (Task 4).
3. Acquisto il 29 febbraio e date non valide (`30/02`, `02/11/2024`, vuota): esito corretto, mai eccezione (Task 2).
4. Quantità 0, negativa, decimale, vuota; email malformata (Task 3).
5. `sessionStorage` bloccato (modalità privata, `file://`) e doppio clic su "Invia email" (Task 3, 5).

---

## File Structure

```
richiesta-sostituzione/
  package.json              scripts: test, test:e2e, build, check:release
  build.js                  inlinea src/* in dist/richiesta-sostituzione.html
  check-release.js          esce con 1 se dist contiene TODO-SEGNAPOSTO
  src/
    catalogo.js             CATALOGO (dati prodotto, segnaposto)
    testi.js                TESTI (copy italiano)
    logica.js               garanzia, validazione, codice, bozza
    email.js                riepilogo, oggetto, corpo, mailto
    app.js                  wizard UI
    index.template.html     markup + CSS + marcatori <!--INLINE:file-->
  tests/
    fixtures.js             CATALOGO_TEST indipendente dai segnaposto
    unit/*.test.js
    e2e/*.test.js
  dist/                     output di build (committato)
```

Ogni file sorgente espone le sue funzioni con `if (typeof module !== 'undefined') module.exports = {...}` e su `globalThis` nel browser.

### Task 1: Scaffold, catalogo e build

**Files:**
- Create: `richiesta-sostituzione/package.json`, `build.js`, `check-release.js`, `src/catalogo.js`, `src/testi.js`, `src/index.template.html` (guscio minimo), `tests/fixtures.js`, `tests/unit/build.test.js`
- Test: `tests/unit/build.test.js`

**Interfaces:**
- Produces: `CATALOGO` = `{ garanziaMesi:number, destinatario:string, documenti:string[], modelli:{[nome]:{dimensioni:string[], versioni:string[], aperture:string[], forzeAmmesseN:{[dimensione]:number[]}}}, schemiForatura:{chiave,etichetta,descrizione,modelli:string[]}[], motivi:{chiave,etichetta}[] }`. `CATALOGO_TEST` (in `fixtures.js`) ha stessa forma: Kraby dimensioni `['300','400']`, forze `{'300':[40,60],'400':[60,80]}`, aperture `['destra','sinistra']`, versioni `['standard']`; schema `S1` per Kraby e Elys, schema `S2` solo per Compact; destinatario reale; `garanziaMesi: 24`.
- Produces: `node build.js` → `dist/richiesta-sostituzione.html`; `TESTI` oggetto stringhe.

- [ ] **Step 1: Write failing tests in `build.test.js`:** `build produce un solo file`, `il file non contiene script src né link href né http(s):// in attributi src/href`, `ogni marcatore INLINE è sostituito`, `check-release fallisce se compare TODO-SEGNAPOSTO` (esegue `check-release.js` su un file temporaneo con il marcatore e atteso exit code 1; su file pulito atteso 0).
- [ ] **Step 2:** Run `node --test tests/unit/build.test.js`. Expected: FAIL (file mancanti).
- [ ] **Step 3: Implement** `build.js` (sostituisce `<!--INLINE:nome.js-->` con `<script>…</script>` del file in `src/`, scrive in `dist/`), `check-release.js <file>`, `catalogo.js` (modelli Kraby/Elys/Compact, motivi dalla spec §8, schemi e forze con `TODO-SEGNAPOSTO` nei campi `descrizione`), `testi.js`, `fixtures.js`, `package.json`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: scaffold, catalogo e build a file unico`.

### Task 2: Calcolo garanzia

**Files:** Create `src/logica.js` (prima parte), `tests/unit/garanzia.test.js`

**Interfaces:**
- Produces: `valutaGaranzia(docDataISO: string, oggiISO: string, mesi: number): { stato: 'in_garanzia'|'fuori_garanzia'|'data_non_valida', scadenzaISO: string|null }`. Date in formato `AAAA-MM-GG`.

- [ ] **Step 1: Write failing tests** (mesi=24, oggi `2026-11-02` salvo diversa indicazione):
  - `2024-11-02` → `in_garanzia`, scadenza `2026-11-02` (ultimo giorno incluso)
  - `2024-11-01` → `fuori_garanzia`, scadenza `2026-11-01`
  - `2024-02-29` con oggi `2026-02-28` → `in_garanzia`, scadenza `2026-02-28`; con oggi `2026-03-01` → `fuori_garanzia`
  - `2026-11-03` (futura), `2026-02-30`, `02/11/2024`, `''`, `undefined` → `data_non_valida`, scadenza `null`
- [ ] **Step 2:** Run `node --test tests/unit/garanzia.test.js`. Expected: FAIL (`valutaGaranzia is not a function`).
- [ ] **Step 3: Implement** `valutaGaranzia`: parsing rigoroso con regex e verifica che il giorno esista; somma dei mesi limitando il giorno all'ultimo del mese di arrivo; confronto tra stringhe ISO. Nessuna dipendenza dal fuso orario (niente `Date` locale).
- [ ] **Step 4:** Run test. Expected: PASS.
- [ ] **Step 5: Commit** `feat: calcolo garanzia`.

### Task 3: Validazione, codice pratica e bozza

**Files:** Modify `src/logica.js`; Create `tests/unit/validazione.test.js`, `tests/unit/bozza.test.js`

**Interfaces:**
- Consumes: `valutaGaranzia`, `CATALOGO_TEST`.
- Produces:
  - `validaRichiesta(dati: Dati, catalogo, oggiISO: string): { errori: {[campo:string]: string}, avvisi: string[], garanzia: ReturnType<valutaGaranzia> }`
  - `Dati` = `{ clienteNome, clienteEmail, clienteTelefono, indirizzo, docTipo, docNumero, docData, modello, apertura, dimensione, versione, quantita, schemaForatura, forzaN, motivo, motivoNote, allegatiConfermati:boolean, privacy:boolean }`
  - `generaCodice(oggi: Date, rand: () => number): string`
  - `salvaBozza(dati, storage): boolean`, `caricaBozza(storage): Dati|null` (chiave `rs-bozza-v1`; mai eccezioni)

- [ ] **Step 1: Write failing tests** (dati validi di base: Kraby, dimensione `300`, forza `60`, schema `S1`, quantità `2`, doc `2025-06-01`, oggi `2026-11-02`):
  - dati validi → `errori` uguale a `{}`
  - forza `50` su Kraby `300` → `errori.forzaN` presente
  - quantità `0`, `-1`, `1.5`, `''` → `errori.quantita`
  - email `a@b` e `''` → `errori.clienteEmail`; nome vuoto → `errori.clienteNome`
  - `allegatiConfermati:false` → `errori.allegatiConfermati`; `privacy:false` → `errori.privacy`
  - `docData` futura → `errori.docData`
  - schema `S2` con Kraby → nessun errore ma `avvisi` contiene una stringa con "schema"
  - `docData` `2023-01-01` → nessun errore, `avvisi` contiene una stringa con "fuori garanzia"
  - `generaCodice(new Date(2026,10,2), () => 0)` → `RS-20261102-AAAA`; con rand costante `0.5` → corrisponde a `/^RS-20261102-[A-Z0-9]{4}$/` (alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`)
  - `salvaBozza` con storage che lancia in `setItem` → `false`; `caricaBozza` con JSON corrotto → `null`; salva+carica con storage finto → dati identici
- [ ] **Step 2:** Run `node --test tests/unit`. Expected: FAIL.
- [ ] **Step 3: Implement** le quattro funzioni in `logica.js`. Messaggi di errore da `TESTI`. Quantità: intero ≥ 1.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: validazione, codice pratica e bozza`.

### Task 4: Riepilogo ed email

**Files:** Create `src/email.js`, `tests/unit/email.test.js`

**Interfaces:**
- Consumes: `Dati`, `valutaGaranzia`, `CATALOGO_TEST`.
- Produces: `costruisciEmail(dati: Dati, garanzia, codice: string, catalogo): { oggetto: string, corpoCompleto: string, corpoMailto: string, mailto: string }`.

- [ ] **Step 1: Write failing tests** (dati come Task 3, nome `Marco Rossi`, codice `RS-20261102-AB12`):
  - `oggetto` = `Richiesta sostituzione aste [RS-20261102-AB12] — Kraby, 60 N`; fuori garanzia → termina con ` — DA VALUTARE`
  - `mailto` inizia con `mailto:info@italianaferramenta.it?subject=`; `new URL(mailto).searchParams.get('body')` contiene `Marco Rossi`, la forza, lo schema, il motivo, e la riga che elenca gli allegati da inserire
  - `motivoNote` = `Perde gas & si chiude # 100% più "lenta"\nseconda riga + terza` → `searchParams.get('body')` contiene la stringa invariata; `mailto` non contiene `+` dopo il carattere `?`
  - `motivoNote` = `'x'.repeat(5000)` → `mailto.length <= 1800`, `corpoMailto` contiene `…`, `corpoCompleto` contiene tutte le 5000 `x`
- [ ] **Step 2:** Run `node --test tests/unit/email.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** `costruisciEmail`. Codifica con `encodeURIComponent`. Il troncamento riduce solo `motivoNote` nel corpo mailto, nell'ordine in cui compare, fino a rispettare il limite; i dati essenziali non vengono mai tagliati.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: riepilogo e mailto`.

### Task 5: Wizard UI

**Files:** Create `src/app.js`; Modify `src/index.template.html` (markup, CSS, marcatori), `build.js` se serve; Test: `tests/e2e/wizard.test.js`

**Interfaces:**
- Consumes: `CATALOGO`, `TESTI`, `validaRichiesta`, `generaCodice`, `salvaBozza`, `caricaBozza`, `costruisciEmail`.
- Produces (contratto DOM per gli e2e): sezioni `section[data-step="1".."5"]`, un solo passo visibile; campi con `name` uguale alla chiave di `Dati`; pulsanti `[data-action="avanti|indietro|invia|copia|stampa"]`; messaggi errore `[data-errore="<campo>"]` dentro regione `aria-live="polite"`; badge garanzia `#esito-garanzia`; `iniziaApp(root: HTMLElement, catalogo, opzioni?: { oggi?: string, storage?: Storage|null }): void`.

- [ ] **Step 1: Write failing e2e** (`node --test tests/e2e`, Playwright chromium su `file://…/dist/richiesta-sostituzione.html`, data corrente fissata con `page.clock` o parametro `oggi`):
  - percorso felice 1→5 con dati validi; al passo 5 sono visibili codice `RS-`, riepilogo e i tre pulsanti di uscita
  - "Avanti" con passo 1 vuoto non avanza e mostra `[data-errore="docNumero"]`
  - data fuori garanzia: `#esito-garanzia` contiene "fuori garanzia" e "Avanti" funziona
  - forza non ammessa (`50` su Kraby 300): "Avanti" bloccato al passo 3
  - dopo il reload al passo 3 i dati del passo 1 sono ancora presenti; con `storage:null` (e con `sessionStorage` che lancia) la procedura funziona e non perde i dati durante la sessione
  - nessuno scroll orizzontale a viewport 360×740 (`document.documentElement.scrollWidth <= 360`)
- [ ] **Step 2:** Run `node build.js && node --test tests/e2e/wizard.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** `iniziaApp`: render dei passi dal `CATALOGO` (select dipendenti modello→dimensione/versione/apertura/forze, card schemi di foratura con illustrazione SVG inline schematica, guida "dove trovo la forza"), validazione per passo con focus sul primo errore, stato in memoria + `salvaBozza` a ogni cambio, indicatore di avanzamento. CSS con variabili, tema chiaro/scuro via `prefers-color-scheme`, `:focus-visible` evidente.
- [ ] **Step 4:** Run build + test. Expected: PASS.
- [ ] **Step 5: Commit** `feat: wizard UI`.

### Task 6: Invio, copia, stampa

**Files:** Modify `src/app.js`, `src/index.template.html`; Test: `tests/e2e/invio.test.js`

**Interfaces:**
- Consumes: `costruisciEmail` (Task 4), DOM del Task 5.
- Produces: pulsante invia assegna `window.location.href = mailto`; "Copia testo" scrive `corpoCompleto` nella clipboard con fallback `document.execCommand('copy')` e messaggio di esito; "Stampa" chiama `window.print()`; `@media print` nasconde navigazione e pulsanti.

- [ ] **Step 1: Write failing e2e:**
  - intercettando la navigazione verso `mailto:`, il click su Invia produce un URL con l'oggetto atteso; un doppio clic rapido produce una sola navigazione
  - Invia senza spunta allegati o privacy: nessuna navigazione, errori `allegatiConfermati`/`privacy` visibili
  - "Copia testo" con permessi clipboard concessi: il testo copiato contiene il codice pratica e il motivo completo; messaggio "Testo copiato" in regione `aria-live`
  - con `page.emulateMedia({ media: 'print' })` i `[data-action]` non sono visibili e il riepilogo sì
- [ ] **Step 2:** Run test. Expected: FAIL.
- [ ] **Step 3: Implement** i tre handler, con blocco del doppio invio (flag per ~2 s) e riepilogo esteso con intestazione aziendale per la stampa.
- [ ] **Step 4:** Run `npm run build && npm run test:e2e`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: invio email, copia testo e stampa`.

### Task 7: Accessibilità, rilascio e documentazione

**Files:** Create `richiesta-sostituzione/README.md`, `tests/e2e/a11y.test.js`; Modify `package.json`

**Interfaces:** Consumes il DOM del Task 5.

- [ ] **Step 1: Write failing e2e:** ogni `input/select/textarea` ha una label associata; navigando solo con Tab/Invio/Spazio si completa tutto il percorso felice; al blocco di un passo il focus va al primo campo in errore; esiste un unico `h1`; `lang="it"` su `<html>`; con `colorScheme: 'dark'` il testo del corpo ha contrasto ≥ 4.5:1 (calcolo luminanza relativa dai colori calcolati).
- [ ] **Step 2:** Run test. Expected: FAIL sulle voci non ancora soddisfatte.
- [ ] **Step 3: Fix** i difetti emersi; scrivere `README.md` in italiano: come pubblicare il file, come modificare `catalogo.js` e rigenerare con `npm run build`, elenco dei segnaposto da sostituire, comando `npm run check:release` da eseguire prima della pubblicazione (fallisce finché restano `TODO-SEGNAPOSTO`), limiti del `mailto:` (spec §4).
- [ ] **Step 4:** Run `npm test && npm run test:e2e`. Expected: tutto PASS. `npm run check:release` è atteso **fallire** finché i segnaposto non sono sostituiti: riportarlo come tale.
- [ ] **Step 5: Commit** `feat: accessibilità, README e controllo di rilascio`.

---

## Self-Review

- **Copertura spec:** §5 passi → T5; §6 pre-controllo → T2-T3; §7 email → T4; §4 limiti `mailto` → T4/T6; §8 catalogo e anti-segnaposto → T1/T7; §9 privacy (nessun dato esce, consenso) → T3/T6; §10 accessibilità/mobile → T5/T7; §11 test → T2-T7; §12 fuori ambito rispettato (nessun backend, upload, admin).
- **Tipi:** `Dati`, `valutaGaranzia`, `costruisciEmail`, `iniziaApp` usati con le stesse firme nei task consumatori.
- **Dato mancante:** il lancio richiede la sostituzione dei `TODO-SEGNAPOSTO` con i valori reali (spec §15). Non è un task di codice: dipende da Italiana Ferramenta.

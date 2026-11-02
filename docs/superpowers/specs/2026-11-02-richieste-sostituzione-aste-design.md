# Procedura HTML richiesta sostituzione aste a gas — Design (v2)

Data: 2026-11-02 · Stato: v2 per revisione · Lingua: solo italiano

Revisione: la v1 prevedeva backend PHP, DB, stato richieste e vista admin.
Su richiesta del cliente è sostituita da **un solo file HTML autonomo, senza
backend** (§2).

## 1. Obiettivo

Guidare il cliente finale di Italiana Ferramenta (prodotto "Gas lid stays",
`shop.italianaferramenta.it`, product_id=42) nella richiesta di sostituzione di
aste a gas difettose, raccogliendo:

1. documento di acquisto,
2. schema di foratura utilizzato,
3. forza (N) stampata sull'asta,
4. motivo del malfunzionamento.

Al termine la procedura produce un **riepilogo completo** e prepara l'invio a
info@italianaferramenta.it. Il personale riceve richieste già ordinate e
pre-controllate.

## 2. Decisioni e conseguenze

| Tema | Decisione | Conseguenza |
|---|---|---|
| Formato | Un file `richiesta-sostituzione.html` autonomo (HTML+CSS+JS inline, nessuna libreria esterna) | Si pubblica copiando un file su qualsiasi hosting o pagina del sito |
| Backend | Nessuno | **Cadono**: stato richieste, vista admin, CSV, DB, login |
| Invio | Email precompilata (`mailto:`) + riepilogo stampabile/PDF + pulsante "Copia testo" | Il cliente invia dal proprio client email |
| Allegati | Non caricati dalla pagina | Il cliente allega documento e foto nell'email; la procedura lo ricorda e lo verifica con una spunta |
| Schemi di foratura | Standard, con valori segnaposto (§8) | Da validare |
| Garanzia | Calcolata dalla data d'acquisto | Parametro unico (§8) |
| Lingua | Solo italiano; testi raccolti in un unico oggetto JS | Predisposto per altre lingue |

## 3. Assunzioni da validare

- **A1 — Garanzia:** 24 mesi dalla data del documento, valore segnaposto.
- **A2 — Forze e schemi di foratura:** valori segnaposto; i dati reali sono
  solo nelle immagini della pagina prodotto, non lette.
- **A3 — Staffe:** per Compact e Kraby le staffe non sono incluse (avvertenza
  sulla pagina); la sostituzione riguarda le sole aste.
- **A4 — Codice pratica:** senza server non esiste un codice univoco. Si usa un
  riferimento generato dal browser (`RS-AAAAMMGG-XXXX`, XXXX casuale), utile
  solo come etichetta nell'oggetto dell'email.

## 4. Limiti noti dell'invio via `mailto:`

- Non può allegare file.
- La lunghezza dell'URL è limitata (circa 2000 caratteri su alcuni client): il
  corpo dell'email contiene solo i dati essenziali, in forma compatta.
- Richiede un client email configurato: per chi usa solo webmail serve il
  fallback.
- Nessuna conferma di ricezione automatica: la risposta avviene via email da
  parte vostra.

Fallback sempre presenti: **"Copia testo"** (da incollare in qualsiasi
webmail) e **"Stampa / Salva PDF"** del riepilogo.

## 5. Flusso cliente (wizard, 5 passi)

1. **Acquisto** — tipo documento (fattura/scontrino/conferma ordine), numero,
   data. Esito garanzia mostrato subito.
2. **Prodotto** — modello (Kraby/Elys/Compact), senso di apertura, dimensione,
   versione, quantità.
3. **Montaggio** — schema di foratura (card con illustrazione) e forza letta
   sull'asta. Guida inline "dove trovo la forza sull'asta".
4. **Guasto** — motivo (elenco), descrizione, checklist di controllo prima di
   richiedere (staffe montate correttamente, schema rispettato, asta non
   piegata o forata).
5. **Riepilogo e invio** — dati ricontrollati, dati del cliente (nome, email,
   telefono, indirizzo di spedizione), consenso privacy, promemoria allegati
   con spunta obbligatoria ("allegherò documento e foto"), pulsanti: Invia
   email, Copia testo, Stampa/PDF.

Navigazione avanti/indietro senza perdere i dati. Bozza salvata in
`sessionStorage` per sopravvivere a un ricaricamento (tutte le letture e
scritture in try/catch: la procedura funziona anche senza storage).

## 6. Pre-controllo (tutto lato browser)

| Controllo | Esito |
|---|---|
| Garanzia: data documento + N mesi ≥ oggi | in garanzia / fuori garanzia |
| Data futura o non valida | bloccante |
| Forza non ammessa per modello/dimensione | bloccante |
| Schema di foratura incompatibile con il modello | avviso |
| Campi obbligatori mancanti | bloccante, con messaggio per campo |
| Spunta allegati non confermata | bloccante all'invio |

Fuori garanzia **non blocca**: la richiesta è marcata "da valutare" nel
riepilogo e nell'oggetto dell'email.

## 7. Riepilogo e contenuto dell'email

Oggetto: `Richiesta sostituzione aste [RS-AAAAMMGG-XXXX] — [modello], [forza] N`

Corpo (compatto): cliente e recapiti, documento (tipo, numero, data), esito
garanzia, prodotto (modello, apertura, dimensione, versione, quantità), schema
di foratura, forza, motivo e descrizione, elenco allegati da inserire. La
versione stampabile ha lo stesso contenuto con impaginazione estesa e
intestazione aziendale.

## 8. Dati di prodotto (oggetto `CATALOGO` in testa al file)

Tutti **SEGNAPOSTO DA CORREGGERE** prima del rilascio:

- `garanziaMesi`: `24`.
- `modelli`: Kraby, Elys, Compact con dimensioni e versioni.
- `forzeAmmesseN` per modello/dimensione (es. `[20, 40, 60, 80, 100, 120,
  150]`). Non letti dalla pagina.
- `schemiForatura`: chiave, etichetta, illustrazione SVG inline, modelli
  compatibili. L'elenco reale va fornito da Italiana Ferramenta.
- `motivi`: non mantiene la forza / perdita di gas; si chiude da solo o non
  tiene aperta l'anta; rumorosità o attrito; cedimento di staffa o attacco;
  danno da trasporto; altro.
- `destinatario`: `info@italianaferramenta.it`.

I segnaposto sono marcati `TODO-SEGNAPOSTO`; un controllo nel test impedisce di
rilasciare con valori ancora marcati.

## 9. Privacy

Nessun dato lascia il browser finché il cliente non invia l'email: nessun
server, nessun tracciamento, nessun servizio esterno. Informativa breve e
consenso esplicito al passo 5, con rimando alla Privacy Policy del sito. Il
testo definitivo va validato dal vostro consulente privacy.

## 10. Accessibilità, mobile, stile

- Responsive da 360 px, nessuno scroll orizzontale.
- Navigazione completa da tastiera, label associate, errori annunciati
  (`aria-live`), contrasto AA.
- Stile coerente con il sito (logo e colori da concordare; il sito non è
  stato analizzato visivamente), tema chiaro/scuro.
- Nessuna dipendenza esterna: font di sistema, illustrazioni SVG inline.

## 11. Test

- **Logica (unit):** garanzia (giorno esatto, anno bisestile, data futura),
  coerenza forza/modello, costruzione di oggetto e corpo email entro il
  limite di lunghezza, assenza di `TODO-SEGNAPOSTO`.
- **Browser (Playwright):** percorso completo felice, blocchi sui campi
  mancanti, caso fuori garanzia, caso forza non ammessa, bozza dopo reload,
  funzionamento senza storage, viewport 360 px, stampa.

## 12. Fuori ambito

Stato richieste, vista admin, esportazione CSV, upload di file, conferme
automatiche, integrazione OpenCart, account cliente, multilingua attiva.
Restano possibili in una v3 con backend (la v1 di questa spec è nella cronologia
git).

## 13. Rischi

| Rischio | Mitigazione |
|---|---|
| Dati di prodotto errati | Oggetto `CATALOGO` unico, test anti-segnaposto, revisione prima del lancio |
| `mailto:` non funziona o tronca il corpo | Corpo compatto, "Copia testo", PDF |
| Richieste senza allegati | Spunta obbligatoria e promemoria nel riepilogo |
| Garanzia diversa da 24 mesi | Parametro unico |

## 14. Domande aperte

1. Elenco reale degli schemi di foratura, con immagini.
2. Forze ammesse per modello/dimensione/versione.
3. Durata e decorrenza della garanzia.
4. Logo e colori da usare (o li ricavo dal sito).
5. Spese di spedizione della sostituzione: a carico vostro sempre o solo in garanzia?

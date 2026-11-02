# Richiesta di sostituzione aste a gas

Procedura in **un solo file HTML** (`dist/richiesta-sostituzione.html`): guida il cliente in 5 passi,
controlla la garanzia e la coerenza dei dati, poi prepara un'email già compilata per il servizio assistenza.
Nessun server, nessun database, nessuna libreria esterna.

## Come provarla
Apri `dist/richiesta-sostituzione.html` con un browser. Non serve altro.

## Come pubblicarla
Copia `dist/richiesta-sostituzione.html` sul vostro hosting (o in una pagina del sito) e collegala dal menu
Assistenza. Prima di pubblicare esegui `npm run check:release`: **fallisce finché nel catalogo restano valori segnaposto**.

## Dati di prodotto da sostituire
Tutto è in `src/catalogo.js`; i valori da correggere sono marcati `TODO-SEGNAPOSTO`:

- durata della garanzia (`garanziaMesi`, ora 24 mesi dalla data del documento);
- forze ammesse per modello e dimensione (`forzeAmmesseN`);
- dimensioni e versioni di Kraby, Elys e Compact;
- schemi di foratura reali (etichetta e descrizione; le illustrazioni in `src/app.js`, `_SCHEMI_SVG`, sono indicative).

Dopo ogni modifica: `npm run build` rigenera il file in `dist/`.
I testi sono in `src/testi.js`; i colori sono variabili CSS in `src/index.template.html` (`:root`).

## Test
```bash
npm test            # logica (unit)
npm run test:e2e    # browser: build + Playwright
```

## Limiti dell'invio via email
- La pagina **non può allegare file**: il cliente aggiunge documento e foto nella sua email (la procedura lo ricorda e richiede una spunta).
- Il link `mailto:` ha un limite di lunghezza (1800 caratteri): descrizioni lunghe vengono accorciate nel link, ma "Copia testo" copia sempre il testo completo.
- Serve un programma di posta configurato; in alternativa "Copia testo" e incolla nella webmail.
- Non c'è conferma automatica né stato della richiesta: rispondete voi via email. Il codice `RS-AAAAMMGG-XXXX` è solo un'etichetta generata nel browser.

## Privacy
Nessun dato lascia il browser finché il cliente non invia l'email. Una bozza resta in `sessionStorage` solo per la durata della scheda.
Il testo di consenso e l'informativa vanno validati dal vostro consulente privacy.

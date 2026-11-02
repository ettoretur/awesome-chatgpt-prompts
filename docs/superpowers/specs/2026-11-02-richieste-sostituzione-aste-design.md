# Dashboard richieste di sostituzione aste a gas — Design

Data: 2026-11-02 · Stato: bozza per revisione · Lingua al lancio: solo italiano

## 1. Obiettivo

Permettere al cliente finale di Italiana Ferramenta (prodotto "Gas lid stays",
`shop.italianaferramenta.it`, product_id=42) di richiedere la sostituzione di
aste a gas difettose, fornendo:

1. documento di acquisto,
2. schema di foratura utilizzato,
3. forza (N) stampata sull'asta,
4. motivo del malfunzionamento.

Il personale interno gestisce le richieste da una vista admin. Il cliente
segue lo stato della propria richiesta. Il sistema è una pagina autonoma
collegabile dal sito: nessuna modifica a OpenCart.

## 2. Decisioni confermate

| Tema | Decisione |
|---|---|
| Approccio | A: pagina autonoma + backend leggero con DB |
| Hosting | Infrastruttura Italiana Ferramenta (non servizio gestito) |
| Funzioni cliente | Nuova richiesta, stato richieste, guida alla compilazione, pre-controllo automatico |
| Funzioni interne | Vista admin con coda, filtri, cambio stato, export CSV |
| Identificazione cliente | Codice pratica + email, senza account |
| Schemi di foratura | Usare quelli standard (vedi §9, da validare) |
| Regola business | Garanzia calcolata dalla data d'acquisto |
| Lingua | Solo italiano; testi in file separato per aggiungere EN/FR/DE |

## 3. Assunzioni da validare in revisione

- **A1 — Stack:** PHP 8.x + MySQL (o SQLite se non disponibile). Motivo: lo
  shop è OpenCart, quindi l'hosting supporta quasi certamente PHP/MySQL.
  *Non verificato.*
- **A2 — Garanzia:** 24 mesi dalla data del documento d'acquisto, valore
  segnaposto. *Da confermare;* è configurabile (§9).
- **A3 — Forze ammesse e schemi di foratura:** valori segnaposto. I valori
  reali sono solo nelle immagini della pagina prodotto, che non sono state
  lette. Vedi §9.
- **A4 — Staffe:** per Compact e Kraby le staffe non sono incluse
  (avvertenza presente sulla pagina). La sostituzione copre le sole aste, salvo
  diversa indicazione.

## 4. Architettura

```
Browser (HTML/CSS/JS, responsive, IT)
   │  fetch JSON / multipart
   ▼
API PHP  ──►  DB (richieste, storico_stati, allegati, utenti_admin)
   │
   ├──►  Storage allegati (fuori dalla webroot)
   └──►  Email (SMTP): conferma cliente + notifica interna
```

Unità e confini:

- `public/` — pagina cliente (wizard + ricerca stato) e pagina admin.
- `api/` — endpoint JSON; nessuna logica di business nel frontend oltre alla
  validazione di comodo.
- `domain/` — regole pure e testabili: calcolo garanzia, coerenza forza/modello,
  macchina a stati.
- `config/catalogo.php` — modelli, forze, schemi di foratura, motivi, durata
  garanzia. Unica fonte dei dati di prodotto.
- `storage/` — allegati, non accessibili direttamente via URL.

## 5. Modello dati

**richieste**

| Campo | Tipo / note |
|---|---|
| id, codice_pratica | `RS-AAAA-NNNNN`, univoco |
| cliente_nome, cliente_email, cliente_telefono | obbligatori nome+email |
| indirizzo_spedizione | per la spedizione dell'asta sostitutiva |
| doc_tipo | fattura / scontrino / conferma ordine |
| doc_numero, doc_data | data usata per la garanzia |
| modello | Kraby / Elys / Compact |
| apertura, dimensione, versione, quantita | come nel configuratore dello shop |
| schema_foratura | chiave da `catalogo.php` |
| forza_n | intero, validato su modello/dimensione |
| motivo | chiave da `catalogo.php` |
| motivo_note | testo libero |
| esito_garanzia | in_garanzia / fuori_garanzia / da_verificare |
| anomalie | JSON: elenco avvisi del pre-controllo |
| stato | vedi §7 |
| creata_il, aggiornata_il | timestamp |

**allegati** — richiesta_id, tipo (documento/foto), nome originale, percorso,
mime, dimensione.

**storico_stati** — richiesta_id, stato, nota, visibile_cliente, autore, data.

**utenti_admin** — email, hash password (`password_hash`), ruolo.

## 6. Vista cliente

### 6.1 Nuova richiesta (wizard, 5 passi)

1. **Acquisto** — tipo documento, numero, data, upload (PDF/JPG/PNG).
2. **Prodotto** — modello, senso di apertura, dimensione, versione, quantità.
3. **Montaggio** — schema di foratura (card con immagine) e forza letta
   sull'asta. Accanto: guida "dove trovo la forza stampata sull'asta".
4. **Guasto** — motivo (elenco), descrizione, foto (opzionali ma consigliate).
5. **Riepilogo e invio** — controllo dei dati, consenso privacy, invio.
   Al termine: codice pratica a schermo e per email.

Lo stato del wizard è mantenuto nel browser (sessionStorage con fallback in
memoria); il server riceve la richiesta solo all'invio finale.

### 6.2 Pre-controllo (calcolato dal server, anteprima lato client)

| Controllo | Esito |
|---|---|
| Garanzia: `doc_data` + N mesi ≥ oggi | in_garanzia / fuori_garanzia |
| Data nel futuro o precedente al lancio del prodotto | bloccante |
| Forza non ammessa per modello/dimensione | bloccante |
| Schema di foratura incompatibile con il modello | avviso |
| Documento mancante o illeggibile | bloccante all'invio |
| Quantità richiesta > quantità acquistata (se indicata) | avviso |

Una richiesta fuori garanzia **non** viene bloccata: arriva in coda come
"da valutare" con l'avviso visibile all'operatore.

### 6.3 Stato richiesta

Form codice pratica + email. Mostra riepilogo, timeline degli stati con le sole
note marcate `visibile_cliente`, e consente di rispondere a una richiesta di
integrazione allegando file.

## 7. Macchina a stati

```
ricevuta → in_verifica → integrazione_richiesta ⇄ in_verifica
in_verifica → approvata → spedita → chiusa
in_verifica → rifiutata → chiusa
```

Ogni transizione è registrata in `storico_stati`. Solo l'admin può cambiare
stato; ogni cambio può inviare email al cliente (scelta dell'operatore).
Transizioni non previste vengono rifiutate dal dominio.

## 8. Vista admin

- Login con email + password; sessione con cookie `HttpOnly`, `Secure`,
  `SameSite=Lax`; protezione CSRF sulle azioni di scrittura.
- **Coda:** filtri per stato, modello, motivo, esito garanzia, intervallo date;
  ricerca per codice pratica o email.
- **Dettaglio:** dati cliente, allegati (download autenticato), esito
  pre-controllo, storico, cambio stato con nota e flag di visibilità.
- **Statistiche:** conteggi per motivo e per modello/forza, per individuare
  difetti ricorrenti.
- **Export CSV** della selezione corrente.

## 9. Configurazione dei dati di prodotto (`config/catalogo.php`)

Tutti i valori seguenti sono **SEGNAPOSTO DA CORREGGERE** prima del rilascio:

- `garanzia_mesi`: `24`, decorrenza dalla data del documento d'acquisto.
- `modelli`: Kraby, Elys, Compact, ciascuno con dimensioni e versioni.
- `forze_ammesse_n`: elenco per modello/dimensione (es. `[20, 40, 60, 80, 100,
  120, 150]`). *Segnaposto: non letti dalla pagina.*
- `schemi_foratura`: schemi standard con chiave, etichetta, immagine e modelli
  compatibili. *Segnaposto: l'elenco reale va fornito da Italiana Ferramenta.*
- `motivi`: non mantiene la forza / perdita di gas; si chiude da solo o non
  tiene aperta l'anta; rumorosità o attrito; cedimento di staffa o
  attacco; danno da trasporto; altro.

Un test automatico fallisce se in produzione compare un valore marcato
`TODO-SEGNAPOSTO`.

## 10. Sicurezza e privacy

- Query solo preparate (PDO); output sempre escapato.
- Upload: whitelist di mime reali (non solo estensione), limite 8 MB per file,
  max 6 file per richiesta, rinomina con nome casuale, storage fuori webroot,
  nessuna esecuzione.
- Rate limit e honeypot sul modulo; CSRF sulle azioni admin.
- Ricerca stato: stesso messaggio per codice inesistente ed email errata, per
  non rivelare quali pratiche esistono.
- GDPR: informativa e consenso espliciti nel passo 5; i dati personali
  restano solo sul vostro hosting; periodo di conservazione da definire
  (default proposto: 24 mesi dalla chiusura). Va verificato con il vostro
  consulente privacy.

## 11. Gestione errori

- Validazione duplicata client/server; messaggi in italiano, per campo.
- Errori server: risposta JSON con codice e messaggio generico; dettaglio solo
  nei log.
- Invio email fallito: la richiesta resta salvata, l'evento è loggato e
  riprovato; l'operatore vede il flag "email non inviata".

## 12. Test

- **Unit (dominio):** garanzia (limiti: giorno esatto, anno bisestile, data
  futura), coerenza forza/modello, transizioni valide e non valide.
- **API:** creazione richiesta, validazioni, upload (file non ammessi),
  ricerca stato con dati errati, permessi admin.
- **End-to-end:** richiesta → notifica → cambio stato in admin → il cliente
  vede la timeline.
- **Accessibilità e mobile:** navigazione da tastiera del wizard, contrasto,
  uso a 360 px di larghezza.

## 13. Fuori ambito (YAGNI)

Account cliente e login cliente, integrazione con ordini OpenCart, pagamenti o
resi a pagamento, tracking del corriere, multilingua (predisposto ma non
attivo), app mobile.

## 14. Rischi

| Rischio | Mitigazione |
|---|---|
| Dati di prodotto (forze, schemi) errati | Config separata, test anti-segnaposto, revisione prima del lancio |
| Garanzia diversa da 24 mesi | Parametro unico in config |
| Abuso del modulo (spam, upload malevoli) | Rate limit, honeypot, whitelist mime, storage non eseguibile |
| Hosting senza PHP/MySQL recente | Verificare versioni prima del piano; fallback SQLite |

## 15. Domande aperte

1. Versioni di PHP e database disponibili sul vostro hosting (conferma A1).
2. Elenco reale degli schemi di foratura, con immagini.
3. Forze ammesse per modello/dimensione/versione.
4. Durata e decorrenza della garanzia (conferma A2).
5. Politica di conservazione dei dati personali.
6. Spese di spedizione della sostituzione: a carico vostro, sempre o solo in garanzia?

---
name: file-automation
description: Riordina cartelle disordinate. Rinomina file in blocco, li smista nelle destinazioni giuste, converte formati ed elabora centinaia di file come se fossero uno solo. Usare per pulizia di directory, rinomina batch, conversioni e organizzazione di documenti.
---

# File Automation

Flusso: **Files → Process → Organized**

## Quando usarla
- Cartelle con file senza criterio (download, scansioni, export).
- Rinomina con pattern (data, numerazione, slug).
- Conversione di formati (immagini, PDF, CSV/XLSX, testo).
- Smistamento per tipo, data o contenuto.

## Procedura
1. **Ispezionare** la cartella: elenco file, estensioni, dimensioni, duplicati, nomi problematici.
2. **Definire le regole** (schema di nome, struttura cartelle di destinazione, mappa estensione → cartella) e farle approvare se ambigue.
3. **Dry run**: stampare la lista "prima → dopo" senza toccare nulla.
4. **Eseguire** con script (bash o Python) su un campione, poi sull'intero insieme.
5. **Verificare**: conteggio file in ingresso = uscita, nessuna sovrascrittura, nessun file perso.
6. **Riportare** un riepilogo: spostati, rinominati, convertiti, saltati, errori.

## Regole
- Mai cancellare o sovrascrivere senza conferma; preferire copia o spostamento con log.
- Gestire collisioni di nome con suffisso numerico, non con sovrascrittura.
- Conservare un file di log/mappa (`rename-map.csv`) per poter annullare l'operazione.
- Lavorare sulla copia se l'utente non ha un backup.

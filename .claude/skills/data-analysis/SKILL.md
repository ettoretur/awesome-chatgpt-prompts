---
name: data-analysis
description: Trasforma fogli di calcolo disordinati in qualcosa di utile. Pulisce dati incoerenti, esegue l'analisi e costruisce un report chiaro, senza pivot table manuali. Usare con file Excel/CSV, dataset sporchi, richieste di KPI, trend, confronti o grafici.
---

# Data Analysis

Flusso: **Raw Data → Clean + Analyze → Report**

## Quando usarla
- File XLSX/CSV con formati misti, duplicati, valori mancanti.
- Richieste di sintesi, trend, confronti, segmentazioni, outlier.
- Report con tabelle e grafici.

## Procedura
1. **Profilare** i dati: righe, colonne, tipi, valori nulli, duplicati, range, valori anomali.
2. **Pulire**: normalizzare date, numeri, valute, maiuscole/minuscole, categorie; gestire nulli e duplicati con regola esplicita. Registrare ogni trasformazione.
3. **Analizzare**: statistiche descrittive, aggregazioni per dimensione, trend temporali, confronti, correlazioni. Dichiarare la domanda a cui si risponde.
4. **Visualizzare** solo ciò che comunica (barre per confronti, linee per serie temporali).
5. **Report**: conclusione in apertura, evidenze con numeri, limiti dei dati, prossimi passi.
6. **Verificare**: ricalcolare i totali chiave e controllare che i numeri del report coincidano con i dati puliti.

## Regole
- Non modificare il file originale: produrre un output separato.
- Distinguere fatti dai dati, ipotesi dalle interpretazioni; segnalare campioni piccoli o dati incompleti.
- Mai inventare o imputare valori in silenzio.
- Usare Python (pandas) o le formule del foglio in modo riproducibile.

---
name: scelta-etf-geopolitica
description: Prepara per Ettore un report PDF con gli ETF UCITS su cui investire la liquidità in arrivo da obbligazioni in scadenza, in base alla situazione geopolitica e alle prospettive dei mercati. Usalo ogni volta che Ettore parla di un rimborso o di una scadenza obbligazionaria, di "dove reinvestire", di "su quali ETF puntare", di liquidità da investire o di scenari geopolitici applicati al portafoglio, anche se non nomina questa skill.
---

# Scelta ETF in base alla geopolitica

## Scopo

Proporre a Ettore su quali ETF UCITS investire la liquidità di un rimborso obbligazionario, in base agli scenari geopolitici e alle prospettive dei mercati, in un report PDF.

## Quando usarlo

- Circa 2 mesi prima di una scadenza obbligazionaria che porta liquidità da reinvestire. Il lavoro parte da un'esigenza di Ettore, non da un calendario fisso.
- Quando Ettore chiede dove mettere nuova liquidità o come cambiare il portafoglio alla luce di un evento geopolitico.
- Non usarlo per: operazioni su singole azioni, strumenti diversi dagli ETF, consigli fiscali o legali, o per eseguire ordini. Questa skill propone, non compra mai.

## Input

| Cosa | Dove si trova | Stato |
|---|---|---|
| Scadenze obbligazionarie (ISIN, data, importo, valuta) | File di Ettore, da allegare in conversazione | Non ancora disponibile. Se non è allegato, chiederlo prima di iniziare. |
| Composizione attuale del portafoglio (ETF, pesi) | Da chiedere a Ettore | Non fornita. Riferimento: circa 25% azionario, 75% obbligazionario, quasi tutto Europa. |
| Vincoli fissi | Questa skill (vedi Decisioni) | Fissi |
| Fonti dei dati e regole di verifica | Le preferenze di Ettore in Claude: Protocollo Fonti e Protocollo Fonti Geopolitiche | Già disponibili |
| Broker | Banca Generali | Fisso |

Orizzonte di investimento: 10-15 anni.

Prima di iniziare, dichiarare in una riga come si è interpretata la richiesta (importo, data del rimborso, ipotesi adottate).

## Passaggi

1. Leggere il file delle scadenze. Annotare importo totale del rimborso, data e valuta. Se manca qualcosa, chiederlo.
2. Guardare il portafoglio attuale. Calcolare la quota azionaria e obbligazionaria e quanto pesano Europa e USA.
3. Fare la lettura geopolitica. Cercare in rete gli eventi in corso, usando le fonti del Protocollo Fonti Geopolitiche (atti ufficiali, agenzie come Reuters e AP, centri di ricerca). Distinguere sempre fatti, dichiarazioni e interpretazioni. Costruire da 2 a 4 scenari, ognuno con una probabilità (la somma fa 100%), un numero o un fatto che segnala che quello scenario sta avvenendo e una condizione che lo smentirebbe. Indicare a parte il rischio estremo e improbabile, senza dargli una percentuale.
4. Tradurre ogni scenario in una scelta di fondo: quanto azionario, quanto obbligazionario, quali aree (Europa, USA).
5. Cercare gli ETF candidati che rispettano tutti i filtri della sezione Decisioni. Per ogni scelta proporre anche una riserva, cioè un ETF simile da usare se il primo non è acquistabile.
6. Verificare i dati di ogni ETF (TER, patrimonio gestito, prezzo) sulle fonti del Protocollo Fonti. Il dato che pesa sulla scelta va confermato da una seconda fonte. Scrivere accanto a ogni numero la fonte e la data. Se il dato non si trova, scrivere "N/D" e non stimarlo.
7. Decidere importi e tempi: tutto subito oppure a più tranche. Se a tranche, proporre quante e a che distanza.
8. Controllare che gli importi sommino al rimborso e che nessun ETF violi un filtro (vedi Definizione di finito).
9. Scrivere il report PDF. Nome del file: `scelta_etf_AAAA-MM-GG.pdf` (nome ipotizzato, da confermare). Usare lo stile e la struttura delle preferenze di Ettore.
10. Consegnare il report e dire chiaramente cosa Ettore deve fare a mano: controllare su Banca Generali che ogni ETF sia acquistabile.

Struttura del report: sintesi in 1-2 frasi in apertura, poi analisi con i dati, poi l'azione proposta, poi confidenza, orizzonte e cosa farebbe rivedere la scelta. Per ogni ETF devono comparire: ISIN, TER, patrimonio gestito (AUM), scenario di riferimento e il segnale che farebbe rivedere la scelta. Il tono è diretto, tra esperti, frasi brevi, senza premesse di cortesia.

## Decisioni

**Filtri obbligatori su ogni ETF**
- Se l'ETF non è UCITS, scartarlo.
- Se distribuisce i proventi invece di accumularli, scartarlo.
- Se il TER supera 0,5%, scartarlo.
- Se il patrimonio gestito è sotto 500 milioni (in euro o in dollari), scartarlo.
- Se investe in mercati emergenti, scartarlo.
- Se è un fondo monetario, scartarlo.
- Se è obbligazionario corporate, scartarlo.

**Scelta tra ETF che passano i filtri**
- Se due ETF fanno lo stesso lavoro, scegliere quello con più patrimonio gestito, solo ad accumulazione, e a parità quello con il TER più basso.

**Quota azionaria e obbligazionaria**
- La liquidità nuova non serve per forza a riportare il portafoglio a 25/75: si inclina secondo lo scenario più probabile. Di quanto inclinare lo decide l'analista, motivando con gli scenari. Non c'è un limite fissato (ipotesi da confermare: segnalare nel report quando la scelta si discosta molto da 25/75).

**Aree geografiche**
- Se lo scenario lo giustifica, si può investire in Europa e USA. Mai mercati emergenti.

**Scenario avverso**
- Se lo scenario dominante è negativo, la liquidità va in obbligazionario a basso rischio e scadenza corta: solo titoli di Stato (area euro e anche USA), scadenza da 3 a 5 anni. Mai corporate, mai monetario, mai lasciare la liquidità ferma.
- Non è stato indicato un rating minimo per i titoli di Stato. Segnalare nel report se un'esposizione sembra rischiosa.

**Tempi**
- Se lo scenario è chiaro, può andare bene investire tutto subito. Se è incerto, proporre le tranche. Numero e distanza delle tranche li propone l'analista, la decisione è di Ettore.

**Dati**
- Se due fonti danno valori diversi oltre la soglia del Protocollo Fonti, mostrare entrambi i valori e spiegare la differenza. Non fare la media.
- Se un dato non è verificabile, scrivere "N/D".

**Limiti**
- Non sono stati fissati tetti per singolo ETF o per area. Se la proposta mette quasi tutto su un solo ETF o su una sola area, segnalarlo nel report come rischio di concentrazione.

## Definizione di finito

Il lavoro è finito quando tutte queste cose sono vere (controlli proposti, da confermare con Ettore):

- Il report PDF esiste ed è in italiano, con sintesi in apertura.
- Ogni ETF ha ISIN, TER, patrimonio gestito, scenario di riferimento e segnale di revisione.
- Ogni numero ha fonte e data. I dati che pesano sulla scelta hanno due fonti.
- Nessun ETF viola un filtro: UCITS, accumulazione, TER fino a 0,5%, almeno 500 milioni, niente emergenti, niente monetari, niente corporate.
- Gli importi sommano al rimborso atteso.
- Gli scenari hanno probabilità che sommano a 100%, un segnale che li conferma e una condizione che li smentisce.
- Ogni ETF ha una riserva, ed è scritto che Ettore deve verificare l'acquistabilità su Banca Generali.
- È dichiarato cosa è stato assunto e cosa non si è riusciti a verificare.
- Nessun file di Ettore è stato eliminato e nessun ordine è stato eseguito.

Una versione sbagliata è un report con un ETF dei mercati emergenti. Prima di consegnare, rileggere la lista alla ricerca proprio di questo.

## Casi limite

- **ETF non acquistabile dal broker.** È già successo. Non posso verificarlo sulla piattaforma di Banca Generali. Proporre sempre una riserva per ogni ETF e dire a Ettore di controllare per ISIN prima di eseguire. Se ha allegato un elenco ETF del broker, usarlo come filtro.
- **File delle scadenze mancante o incompleto.** Non stimare gli importi. Chiedere il file. Se il lavoro è senza supervisione, produrre il report con i campi vuoti marcati "N/D" e dirlo in apertura.
- **Rimborso che cambia data o importo.** Rifare solo i passaggi 1, 7 e 8 e dire cosa è cambiato.
- **Nessun ETF passa tutti i filtri per una scelta.** Non allentare i filtri da soli. Mostrare il migliore che li viola, dire quale filtro viola e lasciare decidere a Ettore.
- **Scenari che si contraddicono o fatti poco chiari.** Dichiarare la confidenza bassa e preferire tranche e obbligazionario corto di Stato.
- **ETF obbligazionario in dollari.** Segnalare il rischio di cambio e se l'ETF è coperto (ipotesi da confermare con Ettore: non è stata discussa).
- **Tendenza a confermare la tesi di Ettore.** Se la richiesta contiene già una tesi ("sono sicuro che..."), sfidarla nel report con almeno 3 cose che la smentirebbero.

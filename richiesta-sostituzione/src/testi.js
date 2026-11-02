// Tutti i testi in italiano. Per altre lingue basta duplicare questo oggetto.
const TESTI = {
  titolo: 'Richiesta di sostituzione aste a gas',
  sottotitolo: 'Compila i passi: preparerai un\'email già pronta per il nostro servizio assistenza.',
  passi: ['Acquisto', 'Prodotto', 'Montaggio', 'Guasto', 'Riepilogo'],
  avanti: 'Avanti', indietro: 'Indietro',
  errori: {
    obbligatorio: 'Campo obbligatorio.',
    email: 'Inserisci un indirizzo email valido.',
    dataNonValida: 'Inserisci una data valida, non futura.',
    quantita: 'Inserisci un numero intero maggiore di zero.',
    forza: 'Questa forza non è prevista per il modello e la dimensione scelti: ricontrolla il valore stampato sull\'asta.',
    allegati: 'Conferma che allegherai documento e foto.',
    privacy: 'Serve il consenso al trattamento dei dati.'
  },
  avvisi: {
    schema: 'Lo schema di foratura scelto non è abituale per questo modello: lo verificheremo.',
    forzaNonLeggibile: 'Forza non leggibile: la verificheremo sul pezzo.',
    fuoriGaranzia: 'La data d\'acquisto è fuori garanzia: la richiesta sarà valutata caso per caso.'
  },
  garanzia: { in: 'In garanzia fino al', fuori: 'Fuori garanzia: scaduta il', nonValida: 'Data non valida' },
  guidaForza: 'La forza è stampata sul corpo dell\'asta, in Newton (N), vicino al marchio. Se non la leggi, scrivi "non leggibile" nel campo.',
  promemoriaAllegati: 'Allega all\'email: documento d\'acquisto (foto o PDF) e foto dell\'asta e del montaggio.',
  invioAvviato: 'Si apre il tuo programma di posta. Se non succede nulla, usa "Copia testo" e incollalo nella tua email.',
  invioTroncato: 'La descrizione è lunga e nel link è stata accorciata: per inviarla intera usa "Copia testo" e incollala nella tua email.',
  copiato: 'Testo copiato negli appunti.',
  copiaFallita: 'Copia non riuscita: seleziona il testo e copialo a mano.'
};
if (typeof module !== 'undefined') module.exports = { TESTI };

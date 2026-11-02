// Dati di prodotto. Tutto ciò che è marcato TODO-SEGNAPOSTO va sostituito con i valori reali.
const CATALOGO = {
  garanziaMesi: 24, // TODO-SEGNAPOSTO: durata reale della garanzia
  destinatario: 'info@italianaferramenta.it',
  documenti: ['Fattura', 'Scontrino', 'Conferma d\'ordine'],
  modelli: {
    Kraby: {
      _nota: 'TODO-SEGNAPOSTO: dimensioni e forze reali',
      aperture: ['Destra', 'Sinistra'],
      dimensioni: ['280', '350', '450'],
      versioni: ['Standard'],
      forzeAmmesseN: { '280': [20, 40, 60, 80], '350': [40, 60, 80, 100], '450': [60, 80, 100, 120, 150] }
    },
    Elys: {
      _nota: 'TODO-SEGNAPOSTO: dimensioni e forze reali',
      aperture: ['Destra', 'Sinistra'],
      dimensioni: ['280', '350', '450'],
      versioni: ['Standard', 'Soft close'],
      forzeAmmesseN: { '280': [20, 40, 60, 80], '350': [40, 60, 80, 100], '450': [60, 80, 100, 120, 150] }
    },
    Compact: {
      _nota: 'TODO-SEGNAPOSTO: dimensioni e forze reali',
      aperture: ['Destra', 'Sinistra'],
      dimensioni: ['200', '260'],
      versioni: ['Standard'],
      forzeAmmesseN: { '200': [20, 40, 60], '260': [40, 60, 80] }
    }
  },
  schemiForatura: [
    { chiave: 'S1', etichetta: 'Schema standard A', descrizione: 'TODO-SEGNAPOSTO: quote reali dello schema', modelli: ['Kraby', 'Elys'] },
    { chiave: 'S2', etichetta: 'Schema standard B', descrizione: 'TODO-SEGNAPOSTO: quote reali dello schema', modelli: ['Compact'] },
    { chiave: 'S3', etichetta: 'Schema standard C', descrizione: 'TODO-SEGNAPOSTO: quote reali dello schema', modelli: ['Kraby', 'Elys', 'Compact'] }
  ],
  motivi: [
    { chiave: 'non_tiene', etichetta: 'Non mantiene la forza / perdita di gas' },
    { chiave: 'si_chiude', etichetta: 'Si chiude da solo o non tiene aperta l\'anta' },
    { chiave: 'rumore', etichetta: 'Rumorosità o attrito' },
    { chiave: 'cedimento', etichetta: 'Cedimento di staffa o attacco' },
    { chiave: 'trasporto', etichetta: 'Danno da trasporto' },
    { chiave: 'altro', etichetta: 'Altro' }
  ]
};
if (typeof module !== 'undefined') module.exports = { CATALOGO };

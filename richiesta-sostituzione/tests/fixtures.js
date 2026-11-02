const CATALOGO_TEST = {
  garanziaMesi: 24,
  destinatario: 'info@italianaferramenta.it',
  documenti: ['Fattura', 'Scontrino', 'Conferma d\'ordine'],
  modelli: {
    Kraby: { aperture: ['destra', 'sinistra'], dimensioni: ['300', '400'], versioni: ['standard'], forzeAmmesseN: { '300': [40, 60], '400': [60, 80] } },
    Elys: { aperture: ['destra', 'sinistra'], dimensioni: ['300', '400'], versioni: ['standard'], forzeAmmesseN: { '300': [40, 60], '400': [60, 80] } },
    Compact: { aperture: ['destra', 'sinistra'], dimensioni: ['200'], versioni: ['standard'], forzeAmmesseN: { '200': [20, 40] } }
  },
  schemiForatura: [
    { chiave: 'S1', etichetta: 'Schema 1', descrizione: 'x', modelli: ['Kraby', 'Elys'] },
    { chiave: 'S2', etichetta: 'Schema 2', descrizione: 'x', modelli: ['Compact'] }
  ],
  motivi: [{ chiave: 'non_tiene', etichetta: 'Non mantiene la forza' }, { chiave: 'altro', etichetta: 'Altro' }]
};
module.exports = { CATALOGO_TEST };

// Costruzione di oggetto, corpo e link mailto. Nessun accesso al DOM.
const _LIMITE_MAILTO = 1800;
const _nf = typeof normalizzaForza !== 'undefined' ? normalizzaForza : require('./logica.js').normalizzaForza;
const _fd = typeof formatoData !== 'undefined' ? formatoData : require('./logica.js').formatoData;

function costruisciEmail(dati, garanzia, codice, catalogo) {
  const motivo = (catalogo.motivi.find((m) => m.chiave === dati.motivo) || {}).etichetta || dati.motivo;
  const schema = (catalogo.schemiForatura.find((s) => s.chiave === dati.schemaForatura) || {}).etichetta || dati.schemaForatura;
  const fuori = garanzia.stato === 'fuori_garanzia';
  const esito = garanzia.stato === 'in_garanzia' ? `in garanzia fino al ${_fd(garanzia.scadenzaISO)}`
    : fuori ? `FUORI GARANZIA, scaduta il ${_fd(garanzia.scadenzaISO)} (da valutare)` : 'data non valida';
  const forza = _nf(dati.forzaN);
  const forzaLeggibile = forza !== 'non leggibile';
  const oggetto = `Richiesta sostituzione aste [${codice}] — ${dati.modello}, ${forzaLeggibile ? forza + ' N' : 'forza non leggibile'}` + (fuori ? ' — DA VALUTARE' : '');

  const corpo = (note) => [
    `Richiesta di sostituzione ${codice}`, '',
    `Cliente: ${dati.clienteNome}`, `Email: ${dati.clienteEmail}`, `Telefono: ${dati.clienteTelefono || '-'}`,
    `Spedizione: ${dati.indirizzo}`, '',
    `Documento: ${dati.docTipo} n. ${dati.docNumero} del ${_fd(dati.docData)}`, `Garanzia: ${esito}`, '',
    `Prodotto: ${dati.modello}, apertura ${dati.apertura}, dimensione ${dati.dimensione}, versione ${dati.versione}, quantità ${dati.quantita}`,
    `Schema di foratura: ${schema}`, `Forza stampata sull'asta: ${forzaLeggibile ? forza + ' N' : 'non leggibile'}`, '',
    `Motivo: ${motivo}`, `Note: ${note || '-'}`, '',
    'Allegati da inserire: documento d\'acquisto e foto dell\'asta e del montaggio.'
  ].join('\n');

  const crea = (note) => {
    const c = corpo(note);
    return { c, url: `mailto:${catalogo.destinatario}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(c)}` };
  };
  let nota = String(dati.motivoNote || '');
  if (nota.toWellFormed) nota = nota.toWellFormed(); // niente surrogati isolati: encodeURIComponent lancerebbe URIError
  const corpoCompleto = corpo(nota);
  let r = crea(nota);
  let troncata = false;
  if (r.url.length > _LIMITE_MAILTO) {
    troncata = true;
    const punti = Array.from(nota); // per punti di codice: non spezza le coppie di surrogati (emoji)
    let lo = 0, hi = punti.length; // ricerca del troncamento più lungo che entra nel limite
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (crea(punti.slice(0, mid).join('') + '…').url.length <= _LIMITE_MAILTO) lo = mid; else hi = mid - 1;
    }
    r = crea(punti.slice(0, lo).join('') + '…');
  }
  return { oggetto, corpoCompleto, corpoMailto: r.c, mailto: r.url, troncata };
}

if (typeof module !== 'undefined') module.exports = { costruisciEmail };

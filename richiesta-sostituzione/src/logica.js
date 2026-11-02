// Logica pura: garanzia, validazione, codice pratica, bozza. Nessun accesso al DOM.
const _T = typeof TESTI !== 'undefined' ? TESTI : require('./testi.js').TESTI;

const _dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m = 1..12
const _pad = (n, l = 2) => String(n).padStart(l, '0');

function _parseISO(s) {
  const r = typeof s === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!r) return null;
  const [y, m, d] = [Number(r[1]), Number(r[2]), Number(r[3])];
  if (m < 1 || m > 12 || d < 1 || d > _dim(y, m)) return null;
  return { y, m, d };
}

// Garanzia: data documento + `mesi`, ultimo giorno incluso. Se il giorno non esiste
// nel mese di arrivo (es. 29 febbraio) si usa l'ultimo giorno di quel mese.
function valutaGaranzia(docDataISO, oggiISO, mesi) {
  const p = _parseISO(docDataISO);
  if (!p || !_parseISO(oggiISO) || docDataISO > oggiISO) return { stato: 'data_non_valida', scadenzaISO: null };
  const tot = p.y * 12 + (p.m - 1) + mesi;
  const ny = Math.floor(tot / 12), nm = (tot % 12) + 1;
  const nd = Math.min(p.d, _dim(ny, nm));
  const scadenzaISO = `${_pad(ny, 4)}-${_pad(nm)}-${_pad(nd)}`;
  return { stato: oggiISO <= scadenzaISO ? 'in_garanzia' : 'fuori_garanzia', scadenzaISO };
}

const _vuoto = (v) => v === undefined || v === null || String(v).trim() === '';

function validaRichiesta(dati, catalogo, oggiISO) {
  const errori = {}, avvisi = [];
  const E = _T.errori;
  for (const c of ['clienteNome', 'indirizzo', 'docTipo', 'docNumero', 'modello', 'apertura', 'dimensione', 'versione', 'schemaForatura', 'motivo']) {
    if (_vuoto(dati[c])) errori[c] = E.obbligatorio;
  }
  if (_vuoto(dati.clienteEmail)) errori.clienteEmail = E.obbligatorio;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(dati.clienteEmail).trim())) errori.clienteEmail = E.email;

  const garanzia = valutaGaranzia(dati.docData, oggiISO, catalogo.garanziaMesi);
  if (garanzia.stato === 'data_non_valida') errori.docData = _vuoto(dati.docData) ? E.obbligatorio : E.dataNonValida;
  else if (garanzia.stato === 'fuori_garanzia') avvisi.push(_T.avvisi.fuoriGaranzia);

  if (!/^\d+$/.test(String(dati.quantita).trim()) || Number(dati.quantita) < 1) errori.quantita = E.quantita;

  const modello = catalogo.modelli[dati.modello];
  const forza = String(dati.forzaN).trim();
  if (_vuoto(dati.forzaN)) errori.forzaN = E.obbligatorio;
  else if (modello) {
    const ammesse = modello.forzeAmmesseN[dati.dimensione] || [];
    if (!/^\d+$/.test(forza) || !ammesse.includes(Number(forza))) errori.forzaN = E.forza;
  }
  const schema = catalogo.schemiForatura.find((s) => s.chiave === dati.schemaForatura);
  if (schema && dati.modello && !schema.modelli.includes(dati.modello)) avvisi.push(_T.avvisi.schema);

  if (!dati.allegatiConfermati) errori.allegatiConfermati = E.allegati;
  if (!dati.privacy) errori.privacy = E.privacy;
  return { errori, avvisi, garanzia };
}

function generaCodice(oggi, rand) {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffisso = '';
  for (let i = 0; i < 4; i++) suffisso += alfabeto[Math.min(31, Math.floor(rand() * 32))];
  return `RS-${oggi.getFullYear()}${_pad(oggi.getMonth() + 1)}${_pad(oggi.getDate())}-${suffisso}`;
}

const _CHIAVE_BOZZA = 'rs-bozza-v1';
function salvaBozza(dati, storage) {
  try { if (!storage) return false; storage.setItem(_CHIAVE_BOZZA, JSON.stringify(dati)); return true; } catch (e) { return false; }
}
function caricaBozza(storage) {
  try {
    if (!storage) return null;
    const v = JSON.parse(storage.getItem(_CHIAVE_BOZZA));
    return v && typeof v === 'object' ? v : null;
  } catch (e) { return null; }
}

if (typeof module !== 'undefined') module.exports = { valutaGaranzia, validaRichiesta, generaCodice, salvaBozza, caricaBozza };

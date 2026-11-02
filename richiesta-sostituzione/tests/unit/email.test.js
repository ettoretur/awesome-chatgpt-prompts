const test = require('node:test');
const assert = require('node:assert');
const { costruisciEmail } = require('../../src/email.js');
const { valutaGaranzia } = require('../../src/logica.js');
const { CATALOGO_TEST: C } = require('../fixtures.js');

const base = (o = {}) => ({
  clienteNome: 'Marco Rossi', clienteEmail: 'marco@example.it', clienteTelefono: '333 1234567', indirizzo: 'Via Roma 1, Pordenone',
  docTipo: 'Fattura', docNumero: '123', docData: '2025-06-01',
  modello: 'Kraby', apertura: 'destra', dimensione: '300', versione: 'standard', quantita: '2',
  schemaForatura: 'S1', forzaN: '60', motivo: 'non_tiene', motivoNote: '',
  allegatiConfermati: true, privacy: true, ...o
});
const CODICE = 'RS-20261102-AB12';
const mail = (o, oggi = '2026-11-02') => { const d = base(o); return costruisciEmail(d, valutaGaranzia(d.docData, oggi, 24), CODICE, C); };
const body = (m) => new URL(m.mailto).searchParams.get('body');

test('oggetto', () => {
  assert.strictEqual(mail().oggetto, 'Richiesta sostituzione aste [RS-20261102-AB12] — Kraby, 60 N');
  assert.ok(mail({ docData: '2023-01-01' }).oggetto.endsWith(' — DA VALUTARE'));
});
test('mailto con destinatario e dati essenziali', () => {
  const m = mail();
  assert.ok(m.mailto.startsWith('mailto:info@italianaferramenta.it?subject='));
  const b = body(m);
  for (const s of ['Marco Rossi', '60 N', 'Schema 1', 'Non mantiene la forza', 'Allegati da inserire']) assert.ok(b.includes(s), s);
});
test('date in formato gg/mm/aaaa', () => {
  const b = body(mail());
  assert.ok(b.includes('del 01/06/2025'), b);
  assert.ok(b.includes('in garanzia fino al 01/06/2027'), b);
  assert.ok(body(mail({ docData: '2023-01-01' })).includes('scaduta il 01/01/2025'));
});
test('caratteri speciali arrivano intatti', () => {
  const nota = 'Perde gas & si chiude # 100% più "lenta"\nseconda riga + terza';
  const m = mail({ motivoNote: nota });
  assert.ok(body(m).includes(nota));
  assert.ok(!m.mailto.slice(m.mailto.indexOf('?')).includes('+'));
});
test('descrizione lunghissima: mailto troncato, testo completo intatto', () => {
  const m = mail({ motivoNote: 'x'.repeat(5000) });
  assert.ok(m.mailto.length <= 1800, String(m.mailto.length));
  assert.ok(m.corpoMailto.includes('…'));
  assert.ok(m.corpoCompleto.includes('x'.repeat(5000)));
  assert.ok(body(m).includes('Marco Rossi') && body(m).includes('Allegati da inserire'));
});

test('C1: emoji in descrizione lunga, nessuna eccezione e mailto valido', () => {
  for (const nota of ['😀'.repeat(300), 'Pessimo 👎 '.repeat(200)]) {
    const m = mail({ motivoNote: nota });
    assert.ok(m.mailto.length <= 1800, String(m.mailto.length));
    assert.doesNotThrow(() => decodeURIComponent(m.mailto));
    assert.ok(m.corpoCompleto.includes(nota));
  }
});
test('I3: troncamento segnalato', () => {
  assert.strictEqual(mail({ motivoNote: 'x'.repeat(5000) }).troncata, true);
  assert.strictEqual(mail().troncata, false);
});
test('I2: forza digitata come 60N o non leggibile', () => {
  assert.strictEqual(mail({ forzaN: '60N' }).oggetto, 'Richiesta sostituzione aste [RS-20261102-AB12] — Kraby, 60 N');
  assert.ok(mail({ forzaN: 'Non leggibile' }).oggetto.includes('Kraby, forza non leggibile'));
  assert.ok(body(mail({ forzaN: 'non leggibile' })).includes("Forza stampata sull'asta: non leggibile"));
});

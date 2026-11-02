const test = require('node:test');
const assert = require('node:assert');
const { validaRichiesta, generaCodice } = require('../../src/logica.js');
const { CATALOGO_TEST: C } = require('../fixtures.js');

const OGGI = '2026-11-02';
const base = (o = {}) => ({
  clienteNome: 'Marco Rossi', clienteEmail: 'marco@example.it', clienteTelefono: '', indirizzo: 'Via Roma 1, Pordenone',
  docTipo: 'Fattura', docNumero: '123', docData: '2025-06-01',
  modello: 'Kraby', apertura: 'destra', dimensione: '300', versione: 'standard', quantita: '2',
  schemaForatura: 'S1', forzaN: '60', motivo: 'non_tiene', motivoNote: '',
  allegatiConfermati: true, privacy: true, ...o
});
const val = (o) => validaRichiesta(base(o), C, OGGI);

test('dati validi: nessun errore', () => assert.deepStrictEqual(val().errori, {}));
test('forza non ammessa', () => assert.ok(val({ forzaN: '50' }).errori.forzaN));
test('forza non numerica o vuota', () => {
  assert.ok(val({ forzaN: '' }).errori.forzaN);
  assert.ok(val({ forzaN: 'abc' }).errori.forzaN);
});
test('quantità non valide', () => {
  for (const q of ['0', '-1', '1.5', '', 'x']) assert.ok(val({ quantita: q }).errori.quantita, q);
});
test('email e nome', () => {
  assert.ok(val({ clienteEmail: 'a@b' }).errori.clienteEmail);
  assert.ok(val({ clienteEmail: '' }).errori.clienteEmail);
  assert.ok(val({ clienteNome: '  ' }).errori.clienteNome);
});
test('allegati e privacy obbligatori', () => {
  assert.ok(val({ allegatiConfermati: false }).errori.allegatiConfermati);
  assert.ok(val({ privacy: false }).errori.privacy);
});
test('data documento futura o vuota', () => {
  assert.ok(val({ docData: '2026-11-03' }).errori.docData);
  assert.ok(val({ docData: '' }).errori.docData);
});
test('schema non abituale: solo avviso', () => {
  const r = val({ schemaForatura: 'S2' });
  assert.deepStrictEqual(r.errori, {});
  assert.ok(r.avvisi.some((a) => a.includes('schema')));
});
test('fuori garanzia: avviso, nessun errore', () => {
  const r = val({ docData: '2023-01-01' });
  assert.deepStrictEqual(r.errori, {});
  assert.ok(r.avvisi.some((a) => a.includes('fuori garanzia')));
  assert.strictEqual(r.garanzia.stato, 'fuori_garanzia');
});
test('codice pratica', () => {
  assert.strictEqual(generaCodice(new Date(2026, 10, 2), () => 0), 'RS-20261102-AAAA');
  assert.match(generaCodice(new Date(2026, 10, 2), () => 0.5), /^RS-20261102-[A-Z0-9]{4}$/);
});

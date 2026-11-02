const test = require('node:test');
const assert = require('node:assert');
const { valutaGaranzia } = require('../../src/logica.js');

const OGGI = '2026-11-02';
const v = (doc, oggi = OGGI) => valutaGaranzia(doc, oggi, 24);

test('ultimo giorno di garanzia incluso', () => {
  assert.deepStrictEqual(v('2024-11-02'), { stato: 'in_garanzia', scadenzaISO: '2026-11-02' });
});
test('il giorno dopo la scadenza è fuori garanzia', () => {
  assert.deepStrictEqual(v('2024-11-01'), { stato: 'fuori_garanzia', scadenzaISO: '2026-11-01' });
});
test('acquisto il 29 febbraio: scadenza al 28 febbraio', () => {
  assert.deepStrictEqual(v('2024-02-29', '2026-02-28'), { stato: 'in_garanzia', scadenzaISO: '2026-02-28' });
  assert.strictEqual(v('2024-02-29', '2026-03-01').stato, 'fuori_garanzia');
});
test('date non valide o future', () => {
  for (const d of ['2026-11-03', '2026-02-30', '02/11/2024', '', undefined, null, '2024-13-01']) {
    assert.deepStrictEqual(v(d), { stato: 'data_non_valida', scadenzaISO: null }, String(d));
  }
});

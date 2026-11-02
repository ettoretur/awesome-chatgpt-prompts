const test = require('node:test');
const assert = require('node:assert');
const { salvaBozza, caricaBozza } = require('../../src/logica.js');

const finto = () => { const m = {}; return { setItem: (k, v) => { m[k] = v; }, getItem: (k) => (k in m ? m[k] : null) }; };

test('salva e carica restituisce gli stessi dati', () => {
  const s = finto();
  assert.strictEqual(salvaBozza({ clienteNome: 'Marco', privacy: true }, s), true);
  assert.deepStrictEqual(caricaBozza(s), { clienteNome: 'Marco', privacy: true });
});
test('storage che lancia: false / null, mai eccezioni', () => {
  const rotto = { setItem() { throw new Error('bloccato'); }, getItem() { throw new Error('bloccato'); } };
  assert.strictEqual(salvaBozza({ a: 1 }, rotto), false);
  assert.strictEqual(caricaBozza(rotto), null);
  assert.strictEqual(salvaBozza({ a: 1 }, null), false);
  assert.strictEqual(caricaBozza(null), null);
});
test('JSON corrotto: null', () => {
  const s = finto(); s.setItem('rs-bozza-v1', '{non json');
  assert.strictEqual(caricaBozza(s), null);
});

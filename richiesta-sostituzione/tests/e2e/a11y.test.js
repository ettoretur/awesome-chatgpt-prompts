const test = require('node:test');
const assert = require('node:assert');
const { avvia, nuovaPagina, passo } = require('./helpers.js');

let browser, context;
test.before(async () => { ({ browser, context } = await avvia()); });
test.after(async () => { await browser.close(); });

test('struttura: lang it, un solo h1, ogni controllo ha una label', async () => {
  const page = await nuovaPagina(context);
  assert.strictEqual(await page.evaluate(() => document.documentElement.lang), 'it');
  assert.strictEqual(await page.locator('h1').count(), 1);
  const senzaLabel = await page.evaluate(() =>
    [...document.querySelectorAll('input, select, textarea')]
      .filter((e) => !(e.labels && e.labels.length) && !e.getAttribute('aria-label')).map((e) => e.name));
  assert.deepStrictEqual(senzaLabel, []);
  await page.close();
});

test('tastiera: Tab raggiunge Avanti, Invio lo attiva e il focus va al primo errore', async () => {
  const page = await nuovaPagina(context);
  await page.focus('[name=docData]');
  await page.keyboard.press('Tab'); // segmenti della data
  for (let i = 0; i < 6; i++) {
    if (await page.evaluate(() => document.activeElement.dataset.action === 'avanti')) break;
    await page.keyboard.press('Tab');
  }
  assert.strictEqual(await page.evaluate(() => document.activeElement.dataset.action), 'avanti');
  await page.keyboard.press('Enter');
  assert.strictEqual(await page.evaluate(() => document.activeElement.name), 'docTipo');
  await page.close();
});

test('tastiera: Spazio seleziona lo schema di foratura', async () => {
  const page = await nuovaPagina(context);
  await page.evaluate(() => {}); // il passo 3 si raggiunge via bozza
  await page.evaluate(() => sessionStorage.setItem('rs-bozza-v1', JSON.stringify({ dati: {}, passo: 3, codice: 'RS-20261102-AAAA' })));
  await page.reload();
  await page.focus('input[name=schemaForatura]');
  await page.keyboard.press('Space');
  assert.strictEqual(await page.locator('input[name=schemaForatura]:checked').count(), 1);
  await page.close();
});

function contrasto(page) {
  return page.evaluate(() => {
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
    const sfondo = (e) => { for (; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length === 3 || (c.length === 4 && c[3] > 0.9)) return c; } return [255, 255, 255]; };
    const rapporto = (e) => { const a = lum(rgb(getComputedStyle(e).color)), b = lum(sfondo(e)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
    return ['h1', '.aiuto', '.nota', '.errore', '[data-action="avanti"]', 'label'].map((s) => [s, rapporto(document.querySelector(s))]);
  });
}
for (const schema of ['light', 'dark']) {
  test(`contrasto ≥ 4.5:1 in tema ${schema}`, async () => {
    const page = await nuovaPagina(context);
    await page.emulateMedia({ colorScheme: schema });
    await page.locator('[data-action="avanti"]').click(); // fa comparire gli errori
    await page.locator('section[data-step="1"] .aiuto, .nota').first().waitFor({ state: 'attached' }).catch(() => {});
    const righe = await contrasto(page);
    for (const [sel, r] of righe) assert.ok(r >= 4.5, `${schema} ${sel}: ${r.toFixed(2)}`);
    await page.close();
  });
}

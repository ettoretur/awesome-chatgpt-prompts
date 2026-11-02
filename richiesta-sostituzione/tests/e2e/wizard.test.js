const test = require('node:test');
const assert = require('node:assert');
const { avvia, nuovaPagina, passo, avanti, passo1, passo2, passo3, percorsoCompleto } = require('./helpers.js');

let browser, context;
test.before(async () => { ({ browser, context } = await avvia()); });
test.after(async () => { await browser.close(); });

test('percorso felice 1→5', async () => {
  const page = await nuovaPagina(context);
  await percorsoCompleto(page);
  assert.ok(await passo(page, 5).isVisible());
  const testo = await page.locator('#riepilogo').innerText();
  assert.match(testo, /RS-20261102-[A-Z0-9]{4}/);
  assert.match(testo, /Marco Rossi/);
  for (const a of ['invia', 'copia', 'stampa']) assert.ok(await page.locator(`[data-action="${a}"]`).isVisible(), a);
  await page.close();
});

test('passo 1 vuoto: non avanza e mostra errore', async () => {
  const page = await nuovaPagina(context);
  await avanti(page);
  assert.ok(await passo(page, 1).isVisible());
  assert.ok(await page.locator('[data-errore="docNumero"]').isVisible());
  assert.strictEqual(await page.evaluate(() => document.activeElement.name), 'docTipo');
  await page.close();
});

test('fuori garanzia: avviso e si può proseguire', async () => {
  const page = await nuovaPagina(context);
  await page.selectOption('[name=docTipo]', 'Scontrino');
  await page.fill('[name=docNumero]', '9');
  await page.fill('[name=docData]', '2023-01-01');
  assert.match((await page.locator('#esito-garanzia').innerText()).toLowerCase(), /fuori garanzia/);
  await avanti(page);
  assert.ok(await passo(page, 2).isVisible());
  await page.close();
});

test('in garanzia: il badge mostra la scadenza', async () => {
  const page = await nuovaPagina(context);
  await page.fill('[name=docData]', '2025-06-01');
  assert.match(await page.locator('#esito-garanzia').innerText(), /In garanzia.*01\/06\/2027/);
  await page.close();
});

test('forza non ammessa blocca il passo 3', async () => {
  const page = await nuovaPagina(context);
  await passo1(page); await passo2(page); await passo3(page, '50');
  assert.ok(await passo(page, 3).isVisible());
  assert.ok(await page.locator('[data-errore="forzaN"]').isVisible());
  await page.close();
});

test('dopo il reload i dati e il passo sono ripristinati', async () => {
  const page = await nuovaPagina(context);
  await passo1(page); await passo2(page);
  await page.reload();
  assert.ok(await passo(page, 3).isVisible());
  await page.locator('[data-action="indietro"]:visible').click();
  await page.locator('[data-action="indietro"]:visible').click();
  assert.strictEqual(await page.inputValue('[name=docNumero]'), '123/A');
  await page.close();
});

test('storage bloccato: la procedura funziona lo stesso', async () => {
  const page = await nuovaPagina(context, { storageBloccato: true });
  await percorsoCompleto(page);
  assert.ok(await passo(page, 5).isVisible());
  await page.locator('[data-action="indietro"]:visible').click();
  await page.locator('[data-action="indietro"]:visible').click();
  await page.locator('[data-action="indietro"]:visible').click();
  await page.locator('[data-action="indietro"]:visible').click();
  assert.strictEqual(await page.inputValue('[name=docNumero]'), '123/A');
  await page.close();
});

test('nessuno scroll orizzontale a 360px', async () => {
  const { browser: b, context: c } = await avvia({ viewport: { width: 360, height: 740 } });
  const page = await nuovaPagina(c);
  for (const n of [1, 2]) {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 360), `passo ${n}`);
    if (n === 1) await passo1(page);
  }
  await b.close();
});

const test = require('node:test');
const assert = require('node:assert');
const { avvia, nuovaPagina, passo1, passo2, passo3, passo4, passo5, percorsoCompleto } = require('./helpers.js');

let browser, context;
test.before(async () => { ({ browser, context } = await avvia()); });
test.after(async () => { await browser.close(); });

async function pagina() {
  const page = await context.newPage();
  page.setDefaultTimeout(3000);
  await page.clock.setFixedTime(new Date('2026-11-02T10:00:00'));
  await page.addInitScript(() => {
    window.__chiamate = [];
    window.__rsApriMail = (u) => window.__chiamate.push(u);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (t) => { window.__copiato = t; } }, configurable: true });
  });
  await page.goto(require('./helpers.js').URL);
  return page;
}

test('Invia email: una sola chiamata anche con doppio clic', async () => {
  const page = await pagina();
  await percorsoCompleto(page);
  await page.locator('[data-action="invia"]').dblclick();
  const chiamate = await page.evaluate(() => window.__chiamate);
  assert.strictEqual(chiamate.length, 1);
  const subject = new URL(chiamate[0]).searchParams.get('subject');
  assert.match(subject, /^Richiesta sostituzione aste \[RS-20261102-[A-Z0-9]{4}\] — Kraby, 60 N$/);
  await page.close();
});

test('senza spunta allegati e privacy non invia', async () => {
  const page = await pagina();
  await passo1(page); await passo2(page); await passo3(page); await passo4(page);
  await page.fill('[name=clienteNome]', 'Marco Rossi');
  await page.fill('[name=clienteEmail]', 'marco@example.it');
  await page.fill('[name=indirizzo]', 'Via Roma 1');
  await page.locator('[data-action="invia"]').click();
  assert.strictEqual((await page.evaluate(() => window.__chiamate)).length, 0);
  assert.ok(await page.locator('[data-errore="allegatiConfermati"]').isVisible());
  assert.ok(await page.locator('[data-errore="privacy"]').isVisible());
  await page.close();
});

test('Copia testo: testo completo negli appunti e messaggio', async () => {
  const page = await pagina();
  const lunga = 'y'.repeat(3000);
  await percorsoCompleto(page, { note: lunga });
  await page.locator('[data-action="copia"]').click();
  const copiato = await page.evaluate(() => window.__copiato);
  assert.match(copiato, /RS-20261102-[A-Z0-9]{4}/);
  assert.ok(copiato.includes(lunga));
  assert.match(await page.locator('#stato-azione').innerText(), /Testo copiato/);
  await page.close();
});

test('stampa: pulsanti nascosti, riepilogo visibile', async () => {
  const page = await pagina();
  await percorsoCompleto(page);
  await page.emulateMedia({ media: 'print' });
  for (const a of ['invia', 'copia', 'stampa', 'indietro']) assert.ok(!(await page.locator(`[data-action="${a}"]`).isVisible()), a);
  assert.ok(await page.locator('#riepilogo').isVisible());
  await page.close();
});

test('I1: Copia testo non aggira i controlli', async () => {
  const page = await pagina();
  await passo1(page); await passo2(page); await passo3(page); await passo4(page);
  await page.locator('[data-action="copia"]').click();
  assert.strictEqual(await page.evaluate(() => window.__copiato), undefined);
  assert.ok(await page.locator('[data-errore="clienteNome"]').isVisible());
  assert.ok(await page.locator('[data-errore="privacy"]').isVisible());
  await page.close();
});
test('C1+I3: descrizione lunga con emoji si invia e avvisa dell\'accorciamento', async () => {
  const page = await pagina();
  await percorsoCompleto(page, { note: 'Pessimo 👎 '.repeat(200) });
  await page.locator('[data-action="invia"]').click();
  assert.strictEqual((await page.evaluate(() => window.__chiamate)).length, 1);
  assert.match(await page.locator('#stato-azione').innerText(), /accorciata/);
  await page.close();
});

const path = require('node:path');
const { chromium } = require('playwright');

const URL = 'file://' + path.join(__dirname, '..', '..', 'dist', 'richiesta-sostituzione.html');

async function avvia(opzioni = {}) {
  const browser = await chromium.launch();
  const context = await browser.newContext(opzioni);
  return { browser, context };
}
async function nuovaPagina(context, { storageBloccato = false } = {}) {
  const page = await context.newPage();
  page.setDefaultTimeout(3000);
  await page.clock.setFixedTime(new Date('2026-11-02T10:00:00'));
  if (storageBloccato) {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('bloccato'); } });
    });
  }
  await page.goto(URL);
  return page;
}
const passo = (page, n) => page.locator(`section[data-step="${n}"]`);
const avanti = (page) => page.locator('[data-action="avanti"]:visible').click();

async function passo1(page, docData = '2025-06-01') {
  await page.selectOption('[name=docTipo]', 'Fattura');
  await page.fill('[name=docNumero]', '123/A');
  await page.fill('[name=docData]', docData);
  await avanti(page);
}
async function passo2(page) {
  await page.selectOption('[name=modello]', 'Kraby');
  await page.selectOption('[name=apertura]', 'Destra');
  await page.selectOption('[name=dimensione]', '350');
  await page.selectOption('[name=versione]', 'Standard');
  await page.fill('[name=quantita]', '2');
  await avanti(page);
}
async function passo3(page, forza = '60') {
  await page.check('input[name=schemaForatura][value=S1]');
  await page.fill('[name=forzaN]', forza);
  await avanti(page);
}
async function passo4(page, note = 'Perde gas dopo due mesi') {
  await page.selectOption('[name=motivo]', 'non_tiene');
  await page.fill('[name=motivoNote]', note);
  await avanti(page);
}
async function passo5(page) {
  await page.fill('[name=clienteNome]', 'Marco Rossi');
  await page.fill('[name=clienteEmail]', 'marco@example.it');
  await page.fill('[name=clienteTelefono]', '333 1234567');
  await page.fill('[name=indirizzo]', 'Via Roma 1, 33170 Pordenone');
  await page.check('[name=allegatiConfermati]');
  await page.check('[name=privacy]');
}
async function percorsoCompleto(page, opz = {}) {
  await passo1(page, opz.docData); await passo2(page); await passo3(page, opz.forza); await passo4(page, opz.note); await passo5(page);
}

module.exports = { URL, avvia, nuovaPagina, passo, avanti, passo1, passo2, passo3, passo4, passo5, percorsoCompleto };

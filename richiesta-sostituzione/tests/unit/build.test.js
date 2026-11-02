const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..', '..');
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rs-')), 'out.html');

test('build produce un solo file', () => {
  execFileSync('node', [path.join(root, 'build.js'), out]);
  assert.ok(fs.existsSync(out));
  assert.ok(fs.statSync(out).size > 100);
});

test('il file non contiene risorse esterne', () => {
  const html = fs.readFileSync(out, 'utf8');
  assert.ok(!/<script[^>]+src=/i.test(html));
  assert.ok(!/<link[^>]+href=/i.test(html));
  assert.ok(!/(src|href)=["']https?:\/\//i.test(html));
});

test('ogni marcatore INLINE è sostituito', () => {
  assert.ok(!fs.readFileSync(out, 'utf8').includes('<!--INLINE:'));
});

test('check-release fallisce se compare TODO-SEGNAPOSTO', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-'));
  const bad = path.join(dir, 'bad.html');
  const good = path.join(dir, 'good.html');
  fs.writeFileSync(bad, '<p>TODO-SEGNAPOSTO</p>');
  fs.writeFileSync(good, '<p>ok</p>');
  const run = (f) => spawnSync('node', [path.join(root, 'check-release.js'), f]).status;
  assert.strictEqual(run(bad), 1);
  assert.strictEqual(run(good), 0);
});

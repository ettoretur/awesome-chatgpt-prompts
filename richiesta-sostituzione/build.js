// Inlinea src/* in un unico file HTML autonomo.
const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, 'src');
const out = process.argv[2] || path.join(__dirname, 'dist', 'richiesta-sostituzione.html');

const template = fs.readFileSync(path.join(src, 'index.template.html'), 'utf8');
const html = template.replace(/<!--INLINE:([\w.-]+)-->/g, (_, nome) => {
  const code = fs.readFileSync(path.join(src, nome), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script>\n${code}\n</script>`;
});

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Scritto ${out} (${html.length} byte)`);

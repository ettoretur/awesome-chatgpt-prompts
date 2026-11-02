// Esce con 1 se il file contiene ancora valori segnaposto.
const fs = require('node:fs');
const file = process.argv[2];
const n = (fs.readFileSync(file, 'utf8').match(/TODO-SEGNAPOSTO/g) || []).length;
if (n > 0) {
  console.error(`Rilascio bloccato: ${n} valori TODO-SEGNAPOSTO in ${file}. Sostituirli in src/catalogo.js.`);
  process.exit(1);
}
console.log('Nessun segnaposto: pronto per il rilascio.');

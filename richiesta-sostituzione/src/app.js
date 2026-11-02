// Interfaccia a passi. Dipende da: CATALOGO, TESTI, logica.js, email.js (globali nel file unico).
const _CAMPI_PASSO = {
  1: ['docTipo', 'docNumero', 'docData'],
  2: ['modello', 'apertura', 'dimensione', 'versione', 'quantita'],
  3: ['schemaForatura', 'forzaN'],
  4: ['motivo'],
  5: ['clienteNome', 'clienteEmail', 'indirizzo', 'allegatiConfermati', 'privacy']
};
const _SCHEMI_SVG = { S1: [[22, 18], [22, 62]], S2: [[18, 22], [18, 52]], S3: [[16, 14], [16, 40], [44, 40]] };

function _esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function _opzioni(valori, segnaposto) {
  return `<option value="">${_esc(segnaposto)}</option>` + valori.map((v) => `<option value="${_esc(v)}">${_esc(v)}</option>`).join('');
}
function _storageSicuro() { try { return window.sessionStorage; } catch (e) { return null; } }
function _oggiISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function _svgSchema(chiave) {
  const fori = (_SCHEMI_SVG[chiave] || _SCHEMI_SVG.S1).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('');
  return `<svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true" focusable="false"><rect x="4" y="4" width="72" height="72" rx="4" class="pannello"/>${fori}</svg>`;
}

function _campo(nome, etichetta, controllo, aiuto) {
  return `<div class="campo"><label for="f-${nome}">${_esc(etichetta)}</label>${controllo}${aiuto ? `<p class="aiuto">${aiuto}</p>` : ''}<p class="errore" data-errore="${nome}" aria-live="polite"></p></div>`;
}

function _markup(catalogo, T) {
  const nomiModelli = Object.keys(catalogo.modelli);
  const schemi = catalogo.schemiForatura.map((s) => `<label class="scheda"><input type="radio" name="schemaForatura" value="${_esc(s.chiave)}">${_svgSchema(s.chiave)}<span><strong>${_esc(s.etichetta)}</strong><small>${_esc(s.descrizione)}</small></span></label>`).join('');
  const motivi = '<option value="">Scegli il motivo…</option>' + catalogo.motivi.map((m) => `<option value="${_esc(m.chiave)}">${_esc(m.etichetta)}</option>`).join('');
  return `
<header><p class="marchio">Italiana Ferramenta</p><h1>${_esc(T.titolo)}</h1><p>${_esc(T.sottotitolo)}</p></header>
<ol class="progresso" aria-label="Avanzamento">${T.passi.map((p, i) => `<li data-prog="${i + 1}"><span>${i + 1}</span> ${_esc(p)}</li>`).join('')}</ol>
<form novalidate onsubmit="return false">
<section data-step="1" aria-labelledby="t1"><h2 id="t1" tabindex="-1">1. Documento d'acquisto</h2>
${_campo('docTipo', 'Tipo di documento', `<select id="f-docTipo" name="docTipo">${_opzioni(catalogo.documenti, 'Scegli…')}</select>`)}
${_campo('docNumero', 'Numero del documento', '<input id="f-docNumero" name="docNumero" type="text" autocomplete="off">')}
${_campo('docData', 'Data del documento', `<input id="f-docData" name="docData" type="date" max="${_oggiISO()}">`)}
<p id="esito-garanzia" class="badge" aria-live="polite"></p></section>
<section data-step="2" aria-labelledby="t2" hidden><h2 id="t2" tabindex="-1">2. Prodotto</h2>
${_campo('modello', 'Modello', `<select id="f-modello" name="modello">${_opzioni(nomiModelli, 'Scegli il modello…')}</select>`)}
${_campo('apertura', 'Senso di apertura', '<select id="f-apertura" name="apertura"><option value="">Scegli prima il modello</option></select>')}
${_campo('dimensione', 'Dimensione', '<select id="f-dimensione" name="dimensione"><option value="">Scegli prima il modello</option></select>')}
${_campo('versione', 'Versione', '<select id="f-versione" name="versione"><option value="">Scegli prima il modello</option></select>')}
${_campo('quantita', 'Quantità da sostituire', '<input id="f-quantita" name="quantita" type="number" min="1" step="1" inputmode="numeric">')}
<p class="nota">Per Compact e Kraby le staffe non sono incluse: la sostituzione riguarda le sole aste.</p></section>
<section data-step="3" aria-labelledby="t3" hidden><h2 id="t3" tabindex="-1">3. Montaggio</h2>
<fieldset><legend>Schema di foratura utilizzato</legend><div class="schede">${schemi}</div><p class="aiuto">Illustrazioni indicative.</p><p class="errore" data-errore="schemaForatura" aria-live="polite"></p></fieldset>
${_campo('forzaN', 'Forza stampata sull\'asta (N)', '<input id="f-forzaN" name="forzaN" type="text" inputmode="numeric" autocomplete="off">', `<details><summary>Dove trovo la forza?</summary>${_esc(T.guidaForza)}</details>`)}</section>
<section data-step="4" aria-labelledby="t4" hidden><h2 id="t4" tabindex="-1">4. Il guasto</h2>
${_campo('motivo', 'Motivo del malfunzionamento', `<select id="f-motivo" name="motivo">${motivi}</select>`)}
${_campo('motivoNote', 'Descrizione (facoltativa)', '<textarea id="f-motivoNote" name="motivoNote" rows="4"></textarea>')}
<ul class="checklist"><li>Le staffe sono montate come da schema di foratura.</li><li>L'asta non è piegata, forata o verniciata.</li><li>Il peso dell'anta corrisponde alla forza indicata.</li></ul></section>
<section data-step="5" aria-labelledby="t5" hidden><h2 id="t5" tabindex="-1">5. Riepilogo e invio</h2>
${_campo('clienteNome', 'Nome e cognome', '<input id="f-clienteNome" name="clienteNome" type="text" autocomplete="name">')}
${_campo('clienteEmail', 'Email', '<input id="f-clienteEmail" name="clienteEmail" type="email" autocomplete="email">')}
${_campo('clienteTelefono', 'Telefono (facoltativo)', '<input id="f-clienteTelefono" name="clienteTelefono" type="tel" autocomplete="tel">')}
${_campo('indirizzo', 'Indirizzo di spedizione', '<input id="f-indirizzo" name="indirizzo" type="text" autocomplete="street-address">')}
<ul id="avvisi" class="avvisi"></ul>
<pre id="riepilogo" tabindex="0" aria-label="Riepilogo della richiesta"></pre>
<p class="nota">${_esc(T.promemoriaAllegati)}</p>
<div class="spunta"><label><input type="checkbox" name="allegatiConfermati"> Allegherò documento d'acquisto e foto.</label><p class="errore" data-errore="allegatiConfermati" aria-live="polite"></p></div>
<div class="spunta"><label><input type="checkbox" name="privacy"> Acconsento al trattamento dei dati per gestire la richiesta (vedi Privacy Policy del sito).</label><p class="errore" data-errore="privacy" aria-live="polite"></p></div>
</section>
<nav class="azioni" aria-label="Navigazione">
<button type="button" class="secondario" data-action="indietro">${_esc(T.indietro)}</button>
<button type="button" class="primario" data-action="avanti">${_esc(T.avanti)}</button>
<span data-gruppo="uscita"><button type="button" class="primario" data-action="invia">Invia email</button> <button type="button" class="secondario" data-action="copia">Copia testo</button> <button type="button" class="secondario" data-action="stampa">Stampa / Salva PDF</button></span>
</nav>
<p id="stato-azione" class="nota" role="status" aria-live="polite"></p>
</form>`;
}

function iniziaApp(root, catalogo, opzioni) {
  opzioni = opzioni || {};
  const T = TESTI;
  const storage = opzioni.storage !== undefined ? opzioni.storage : _storageSicuro();
  root.innerHTML = _markup(catalogo, T);
  const form = root.querySelector('form');
  const bozza = caricaBozza(storage);
  let dati = (bozza && bozza.dati) || {};
  let passo = (bozza && bozza.passo >= 1 && bozza.passo <= 5) ? bozza.passo : 1;
  const codice = (bozza && bozza.codice) || generaCodice(new Date(), Math.random);
  const oggi = () => opzioni.oggi || _oggiISO();

  const q = (sel) => form.querySelector(sel);
  const el = (nome) => form.elements[nome];

  function leggiForm() {
    const d = {};
    form.querySelectorAll('[name]').forEach((e) => {
      if (e.type === 'checkbox') d[e.name] = e.checked;
      else if (e.type === 'radio') { if (e.checked) d[e.name] = e.value; else if (!(e.name in d)) d[e.name] = ''; }
      else d[e.name] = e.value;
    });
    return d;
  }
  function popolaDipendenti(modello) {
    const m = catalogo.modelli[modello];
    const imposta = (nome, valori, vuoto) => { el(nome).innerHTML = _opzioni(m ? valori : [], m ? 'Scegli…' : vuoto); };
    imposta('apertura', m && m.aperture, 'Scegli prima il modello');
    imposta('dimensione', m && m.dimensioni, 'Scegli prima il modello');
    imposta('versione', m && m.versioni, 'Scegli prima il modello');
  }
  function scriviForm(d) {
    if (d.modello) { el('modello').value = d.modello; popolaDipendenti(d.modello); }
    form.querySelectorAll('[name]').forEach((e) => {
      if (!(e.name in d)) return;
      if (e.type === 'checkbox') e.checked = !!d[e.name];
      else if (e.type === 'radio') e.checked = e.value === d[e.name];
      else if (e.name !== 'modello') e.value = d[e.name];
    });
  }

  function aggiornaBadge() {
    const g = valutaGaranzia(dati.docData, oggi(), catalogo.garanziaMesi);
    const b = q('#esito-garanzia');
    b.className = 'badge' + (g.stato === 'in_garanzia' ? ' ok' : g.stato === 'fuori_garanzia' ? ' attenzione' : '');
    b.textContent = g.stato === 'in_garanzia' ? `${T.garanzia.in} ${formatoData(g.scadenzaISO)}`
      : g.stato === 'fuori_garanzia' ? `${T.garanzia.fuori} ${formatoData(g.scadenzaISO)}` : '';
  }
  function aggiornaRiepilogo() {
    const r = validaRichiesta(dati, catalogo, oggi());
    q('#riepilogo').textContent = costruisciEmail(dati, r.garanzia, codice, catalogo).corpoCompleto;
    q('#avvisi').innerHTML = r.avvisi.map((a) => `<li>${_esc(a)}</li>`).join('');
  }
  function mostraPasso() {
    form.querySelectorAll('section[data-step]').forEach((s) => { s.hidden = Number(s.dataset.step) !== passo; });
    root.querySelectorAll('[data-prog]').forEach((li) => {
      const n = Number(li.dataset.prog);
      li.classList.toggle('fatto', n < passo);
      if (n === passo) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    q('[data-action="indietro"]').hidden = passo === 1;
    q('[data-action="avanti"]').hidden = passo === 5;
    q('[data-gruppo="uscita"]').hidden = passo !== 5;
    if (passo === 5) aggiornaRiepilogo();
  }
  function mostraErrori(errori, campi) {
    form.querySelectorAll('[data-errore]').forEach((p) => { p.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
    let primo = null;
    for (const c of campi) {
      if (!errori[c]) continue;
      form.querySelector(`[data-errore="${c}"]`).textContent = errori[c];
      const campo = form.querySelector(`[name="${c}"]`);
      if (campo) { campo.setAttribute('aria-invalid', 'true'); if (!primo) primo = campo; }
    }
    if (primo) primo.focus();
    return !primo;
  }
  function vaiA(n, focusTitolo) {
    passo = n; mostraPasso(); salva();
    if (focusTitolo) { const h = q(`section[data-step="${n}"] h2`); h.focus(); h.scrollIntoView(); }
  }
  function salva() { salvaBozza({ dati, passo, codice }, storage); }

  function suCambio(e) {
    dati = leggiForm();
    if (e.target.name === 'modello') { popolaDipendenti(dati.modello); dati = leggiForm(); }
    aggiornaBadge();
    if (passo === 5) aggiornaRiepilogo();
    salva();
  }
  form.addEventListener('input', suCambio);
  form.addEventListener('change', suCambio);

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const azione = b.dataset.action;
    if (azione === 'indietro' && passo > 1) vaiA(passo - 1, true);
    if (azione === 'avanti') {
      dati = leggiForm();
      const r = validaRichiesta(dati, catalogo, oggi());
      if (mostraErrori(r.errori, _CAMPI_PASSO[passo])) vaiA(passo + 1, true);
    }
    if (azione === 'invia') invia();
    if (azione === 'copia') copia();
    if (azione === 'stampa') window.print();
  });

  const stato = (msg) => { q('#stato-azione').textContent = msg; };
  let inviando = false;
  // Controlli comuni a invio e copia: se qualcosa manca porta al primo passo con errori.
  function verificaTutto() {
    dati = leggiForm();
    const r = validaRichiesta(dati, catalogo, oggi());
    const primoPasso = [1, 2, 3, 4, 5].find((n) => _CAMPI_PASSO[n].some((c) => r.errori[c]));
    if (primoPasso) {
      if (primoPasso !== passo) vaiA(primoPasso, false);
      mostraErrori(r.errori, _CAMPI_PASSO[primoPasso]);
      return null;
    }
    return r;
  }
  function invia() {
    if (inviando) return;
    const r = verificaTutto();
    if (!r) return;
    inviando = true;
    setTimeout(() => { inviando = false; }, 2000);
    const apri = opzioni.apriMail || (typeof window.__rsApriMail === 'function' ? window.__rsApriMail : (u) => { window.location.href = u; });
    const email = costruisciEmail(dati, r.garanzia, codice, catalogo);
    apri(email.mailto);
    stato(email.troncata ? T.invioTroncato : T.invioAvviato);
  }
  async function copia() {
    const r = verificaTutto();
    if (!r) return;
    const testo = costruisciEmail(dati, r.garanzia, codice, catalogo).corpoCompleto;
    try {
      await navigator.clipboard.writeText(testo);
      stato(T.copiato);
    } catch (e) {
      try {
        const t = document.createElement('textarea');
        t.value = testo; document.body.appendChild(t); t.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(t);
        stato(ok ? T.copiato : T.copiaFallita);
      } catch (e2) { stato(T.copiaFallita); }
    }
  }

  // stato iniziale
  scriviForm(dati);
  dati = leggiForm();
  aggiornaBadge();
  mostraPasso();
  return { codice, ottieni: () => dati, errori: mostraErrori, passo: () => passo };
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
  iniziaApp(document.getElementById('app'), CATALOGO);
}

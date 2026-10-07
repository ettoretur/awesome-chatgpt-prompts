---
name: automation-master
description: Master skill che scompone task ripetitivi multi-step e li esegue in automatico. Usare quando l'utente descrive un'attività manuale ricorrente, vuole automatizzare un workflow, o chiede di "fare sempre la stessa cosa" in modo sistematico. Coordina le altre skill di automazione (browser, file, data, research, content, social, design).
---

# Automation Master

Flusso: **Task → Automate → Done**

## Quando usarla
- L'utente ripete a mano la stessa sequenza di passaggi.
- Un task ha più step dipendenti e va eseguito in modo affidabile.
- Serve decidere quale skill specialistica usare per ciascuno step.

## Procedura
1. **Chiarire il task**: input, output atteso, frequenza, criterio di "fatto". Fare domande solo se manca un'informazione bloccante.
2. **Scomporre** in step atomici e ordinati. Per ognuno indicare: input, azione, output, possibile fallimento.
3. **Instradare** ogni step alla skill adatta:
   - Web / form / scraping → `browser-automation`
   - Cartelle, rinomina, conversioni → `file-automation`
   - Fogli e dati tabellari → `data-analysis`
   - Ricerca fonti e sintesi → `research-agent`
   - Testi pubblicabili → `content-writer`
   - Adattamento per piattaforma → `social-media`
   - Brief e specifiche grafiche → `design-automation`
4. **Eseguire** gli step in sequenza, verificando l'output di ciascuno prima di passare al successivo.
5. **Rendere ripetibile**: se il task ricorre, salvare la procedura come script o checklist riutilizzabile.
6. **Riportare**: cosa è stato fatto, cosa è fallito, cosa resta manuale.

## Regole
- Azioni distruttive o irreversibili (cancellazioni, invii, pubblicazioni): chiedere conferma prima.
- Provare su un campione piccolo prima di processare tutto.
- Loggare ogni step così il risultato è verificabile.

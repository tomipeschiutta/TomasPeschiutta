/** Punto de entrada. */

import { initI18n, setLang, getLang } from './i18n.js';
import { initTheme, initNav, initReveal, initTyped, initCounters, initLangSwitch, initYear } from './ui.js';
import { initContent } from './content.js';
import { initProjects } from './projects.js';
import { initForm } from './form.js';

async function boot() {
    initTheme();
    initYear();

    try {
        await initI18n();
    } catch (err) {
        console.error('[i18n]', err);   // el HTML ya trae el texto en español como respaldo
    }

    const revealObserver = initReveal();

    initNav();
    initTyped();
    initCounters();
    initLangSwitch(setLang, getLang);
    initForm();

    const results = await Promise.allSettled([initContent(revealObserver), initProjects(revealObserver)]);
    results.filter((r) => r.status === 'rejected').forEach((r) => console.error('[data]', r.reason));
}

boot();

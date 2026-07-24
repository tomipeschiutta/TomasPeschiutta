/**
 * Traducciones.
 *
 * En el HTML:
 *   data-i18n="hero.greeting"                  -> reemplaza el texto del elemento
 *   data-i18n-attr="placeholder:contact.fName" -> traduce un atributo (varios con |)
 *
 * En los JSON de datos (projects.json / site.json) los campos traducibles se
 * escriben como { "es": "...", "en": "..." } y se resuelven con pick().
 */

const SUPPORTED = ['es', 'en'];
const DEFAULT_LANG = 'es';
const STORAGE_KEY = 'tp-lang';

const dictionaries = {};
const listeners = new Set();
let current = DEFAULT_LANG;

/** Idioma inicial: el guardado, si no el del navegador, si no español. */
function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || DEFAULT_LANG).slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG;
}

async function loadDictionary(lang) {
    if (dictionaries[lang]) return dictionaries[lang];
    const res = await fetch(`./languages/${lang}.json`);
    if (!res.ok) throw new Error(`No se pudo cargar el idioma "${lang}"`);
    dictionaries[lang] = await res.json();
    return dictionaries[lang];
}

/** Resuelve "contact.errRequired" contra el diccionario activo. */
export function t(path, fallback = '') {
    const value = path
        .split('.')
        .reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), dictionaries[current]);
    return value ?? fallback;
}

/** Resuelve un campo bilingüe de los JSON de datos. Acepta string, objeto o array. */
export function pick(field) {
    if (field == null) return '';
    if (typeof field === 'string' || Array.isArray(field)) return field;
    return field[current] ?? field[DEFAULT_LANG] ?? Object.values(field)[0] ?? '';
}

export function getLang() {
    return current;
}

export function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
        const value = t(el.dataset.i18n);
        if (typeof value === 'string' && value) el.textContent = value;
    });

    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        el.dataset.i18nAttr.split('|').forEach((pair) => {
            const [attr, key] = pair.split(':').map((s) => s.trim());
            const value = t(key);
            if (attr && typeof value === 'string' && value) el.setAttribute(attr, value);
        });
    });

    document.documentElement.lang = current;
    document.title = t('meta.title', document.title);
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description', ''));
}

/** Cambia el idioma y avisa a todo lo que se renderiza desde JS. */
export async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    await loadDictionary(lang);
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    listeners.forEach((fn) => fn(lang));
}

export function onLangChange(fn) {
    listeners.add(fn);
}

export async function initI18n() {
    current = detectLang();
    await loadDictionary(current);
    applyTranslations();
    return current;
}

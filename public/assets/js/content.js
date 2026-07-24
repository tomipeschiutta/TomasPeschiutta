/** Render de Stack y Formación a partir de data/site.json. */

import { pick, t, onLangChange } from './i18n.js';

let data = null;

const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
};

function renderStack() {
    const grid = document.getElementById('stack-grid');
    if (!grid || !data?.stack) return;

    grid.replaceChildren(
        ...data.stack.map((group) => {
            const card = el('article', 'stack-card reveal');
            card.append(el('h3', 'stack-card__title', pick(group.title)));

            const chips = el('ul', 'chips');
            chips.append(...group.items.map((item) => el('li', 'chip', item)));
            card.append(chips);
            return card;
        })
    );
}

function renderTimeline() {
    const list = document.getElementById('timeline');
    if (!list || !data?.timeline) return;

    const entries = data.timeline.filter((entry) => !entry.draft);

    list.replaceChildren(
        ...entries.map((entry) => {
            const item = el('li', 'tl-item reveal');
            const card = el('div', 'tl-card');

            if (entry.logo) {
                const logo = el('img', 'tl-card__logo');
                logo.src = entry.logo;
                logo.alt = entry.org || '';
                logo.loading = 'lazy';
                card.append(logo);
            }

            const body = el('div');
            body.append(el('span', 'tl-card__tag', t(entry.type === 'work' ? 'education.work' : 'education.study')));
            body.append(el('p', 'tl-card__period', pick(entry.period)));
            body.append(el('h3', 'tl-card__title', pick(entry.title)));
            if (entry.org) body.append(el('p', 'tl-card__org', entry.org));
            const desc = pick(entry.desc);
            if (desc) body.append(el('p', 'tl-card__desc', desc));

            card.append(body);
            item.append(card);
            return item;
        })
    );
}

function renderAll(revealObserver) {
    renderStack();
    renderTimeline();
    document.querySelectorAll('#stack-grid .reveal, #timeline .reveal').forEach((node) => {
        if (revealObserver?.observe) revealObserver.observe(node);
        else node.classList.add('is-visible');
    });
}

export async function initContent(revealObserver) {
    const res = await fetch('./data/site.json');
    if (!res.ok) throw new Error('No se pudo cargar data/site.json');
    data = await res.json();

    renderAll(revealObserver);
    onLangChange(() => renderAll(revealObserver));
}

/** Render de proyectos desde data/projects.json + modal de detalle reutilizable. */

import { pick, t, onLangChange } from './i18n.js';

const TAG_ORDER = ['web', 'mobile', 'backend', 'data', 'desktop'];

let projects = [];
let activeFilter = 'all';
let revealObserver = null;

/* Estado del modal */
let currentProject = null;
let slideIndex = 0;
let lastFocused = null;

const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
};

const icon = (id) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${id}`);
    svg.append(use);
    return svg;
};

/* ---------------- Tarjetas ---------------- */

function buildCard(project) {
    const card = el('button', 'project-card reveal');
    card.type = 'button';
    card.dataset.id = project.id;
    card.dataset.tags = (project.tags || []).join(' ');

    const media = el('div', 'project-card__media');
    const img = el('img');
    img.src = project.cover;
    img.alt = pick(project.title);
    img.loading = 'lazy';
    img.decoding = 'async';
    media.append(img);
    if (project.year) media.append(el('span', 'project-card__badge', project.year));

    const body = el('div', 'project-card__body');
    body.append(el('p', 'project-card__context', pick(project.context)));
    body.append(el('h3', 'project-card__title', pick(project.title)));
    body.append(el('p', 'project-card__summary', pick(project.summary)));

    const chips = el('ul', 'chips');
    chips.append(...(project.stack || []).slice(0, 4).map((tech) => el('li', 'chip', tech)));
    body.append(chips);

    const foot = el('div', 'project-card__foot');
    const cta = el('span', 'project-card__cta');
    cta.append(document.createTextNode(t('projects.view', 'Ver detalles')), icon('i-arrow-right'));
    foot.append(cta);
    foot.append(el('span', 'project-card__count', `${project.gallery?.length || 0} ${t('projects.screens', '')}`));
    body.append(foot);

    card.append(media, body);
    card.addEventListener('click', () => openModal(project.id));
    return card;
}

function applyFilter() {
    const grid = document.getElementById('projects-grid');
    const empty = document.getElementById('projects-empty');
    let shown = 0;

    grid.querySelectorAll('.project-card').forEach((card) => {
        const match = activeFilter === 'all' || card.dataset.tags.split(' ').includes(activeFilter);
        card.classList.toggle('is-hidden', !match);
        if (match) shown += 1;
    });

    empty.hidden = shown > 0;
}

function renderFilters() {
    const bar = document.getElementById('filters');
    if (!bar) return;

    const used = new Set(projects.flatMap((p) => p.tags || []));
    const tags = ['all', ...TAG_ORDER.filter((tag) => used.has(tag))];

    bar.replaceChildren(
        ...tags.map((tag) => {
            const btn = el('button', 'filter', t(`projects.filters.${tag}`, tag));
            btn.type = 'button';
            btn.dataset.filter = tag;
            btn.classList.toggle('is-active', tag === activeFilter);
            btn.setAttribute('aria-pressed', String(tag === activeFilter));
            btn.addEventListener('click', () => {
                activeFilter = tag;
                bar.querySelectorAll('.filter').forEach((other) => {
                    const on = other.dataset.filter === tag;
                    other.classList.toggle('is-active', on);
                    other.setAttribute('aria-pressed', String(on));
                });
                applyFilter();
            });
            return btn;
        })
    );
}

function renderProjects(animate = true) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.replaceChildren(...projects.map(buildCard));

    grid.querySelectorAll('.reveal').forEach((node) => {
        if (animate && revealObserver?.observe) revealObserver.observe(node);
        else node.classList.add('is-visible');
    });

    renderFilters();
    applyFilter();
}

/* ---------------- Modal ---------------- */

function showSlide(index) {
    const gallery = document.getElementById('gallery');
    const dots = document.getElementById('gallery-dots');
    const slides = [...gallery.children];
    if (!slides.length) return;

    slideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === slideIndex));
    [...dots.children].forEach((dot, i) => {
        dot.classList.toggle('is-active', i === slideIndex);
        dot.setAttribute('aria-selected', String(i === slideIndex));
    });

    const shot = currentProject.gallery[slideIndex];
    document.getElementById('modal-caption').textContent =
        `${pick(shot.title)} — ${pick(shot.desc)}`;
}

function renderGallery(project) {
    const gallery = document.getElementById('gallery');
    const dots = document.getElementById('gallery-dots');
    const shots = project.gallery || [];
    const multiple = shots.length > 1;

    gallery.replaceChildren(
        ...shots.map((shot, i) => {
            const img = el('img', 'gallery__item');
            img.src = shot.src;
            img.alt = pick(shot.title);
            img.loading = i === 0 ? 'eager' : 'lazy';
            img.decoding = 'async';
            return img;
        })
    );

    dots.replaceChildren(
        ...shots.map((shot, i) => {
            const dot = el('button', 'gallery__dot');
            dot.type = 'button';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', pick(shot.title));
            dot.addEventListener('click', () => showSlide(i));
            return dot;
        })
    );

    dots.hidden = !multiple;
    document.getElementById('gallery-prev').hidden = !multiple;
    document.getElementById('gallery-next').hidden = !multiple;
}

function fillModal(project) {
    document.getElementById('modal-eyebrow').textContent = pick(project.context);
    document.getElementById('modal-title').textContent = pick(project.title);
    document.getElementById('modal-summary').textContent = pick(project.summary);

    const highlights = document.getElementById('modal-highlights');
    highlights.replaceChildren(...(pick(project.highlights) || []).map((line) => el('li', null, line)));

    const stack = document.getElementById('modal-stack');
    stack.replaceChildren(...(project.stack || []).map((tech) => el('li', 'chip', tech)));

    const links = document.getElementById('modal-links');
    links.replaceChildren(
        ...(project.links || []).map((link) => {
            const a = el('a', link.type === 'demo' ? 'btn btn--primary' : 'btn btn--ghost');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.append(icon(link.type === 'repo' ? 'i-github' : 'i-external'), document.createTextNode(pick(link.label)));
            return a;
        })
    );

    renderGallery(project);
    showSlide(0);
}

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const panel = document.querySelector('#project-modal .modal__panel');
    const focusables = [...panel.querySelectorAll('a[href], button:not([hidden]), [tabindex]:not([tabindex="-1"])')]
        .filter((node) => node.offsetParent !== null);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function onModalKeydown(e) {
    if (e.key === 'Escape') return closeModal();
    if (e.key === 'ArrowLeft') return showSlide(slideIndex - 1);
    if (e.key === 'ArrowRight') return showSlide(slideIndex + 1);
    trapFocus(e);
}

export function openModal(id) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    currentProject = project;
    lastFocused = document.activeElement;

    fillModal(project);

    const modal = document.getElementById('project-modal');
    modal.hidden = false;
    document.body.classList.add('is-locked');
    document.addEventListener('keydown', onModalKeydown);
    modal.querySelector('.modal__close').focus();
}

export function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    document.removeEventListener('keydown', onModalKeydown);
    currentProject = null;
    lastFocused?.focus();
}

function initModalControls() {
    const modal = document.getElementById('project-modal');
    modal.querySelectorAll('[data-close]').forEach((node) => node.addEventListener('click', closeModal));
    document.getElementById('gallery-prev').addEventListener('click', () => showSlide(slideIndex - 1));
    document.getElementById('gallery-next').addEventListener('click', () => showSlide(slideIndex + 1));
}

/* ---------------- Init ---------------- */

export async function initProjects(observer) {
    revealObserver = observer;

    const res = await fetch('./data/projects.json');
    if (!res.ok) throw new Error('No se pudo cargar data/projects.json');
    const data = await res.json();

    projects = (data.projects || []).filter((p) => !p.draft);

    renderProjects(true);
    initModalControls();

    onLangChange(() => {
        renderProjects(false);
        if (currentProject) fillModal(currentProject);
    });
}

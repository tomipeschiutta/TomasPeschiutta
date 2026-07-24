/** Interacciones generales: tema, menú, scroll, animaciones. */

import { t, onLangChange } from './i18n.js';

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema claro / oscuro ---------- */
export function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const meta = document.querySelector('meta[name="theme-color"]');

    const paint = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('tp-theme', theme);
        meta?.setAttribute('content', theme === 'dark' ? '#0a0e14' : '#ffffff');
    };

    // El tema arranca en oscuro (lo fija el script inline del <head>).
    toggle?.addEventListener('click', () => {
        paint(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
}

/* ---------- Header, menú móvil y scrollspy ---------- */
export function initNav() {
    const header = document.getElementById('site-header');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const links = [...document.querySelectorAll('.nav__link')];
    const goTop = document.getElementById('go-top');

    const closeMenu = () => {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', t('a11y.menu', 'Abrir menú'));
        document.body.classList.remove('is-locked');
    };

    burger?.addEventListener('click', () => {
        const open = burger.getAttribute('aria-expanded') === 'true';
        if (open) return closeMenu();
        nav.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', t('a11y.menuClose', 'Cerrar menú'));
    });

    nav?.addEventListener('click', (e) => {
        if (e.target.closest('.nav__link')) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav?.classList.contains('is-open')) closeMenu();
    });

    // Cierra el menú si se pasa a desktop con el panel abierto.
    matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
        if (e.matches) closeMenu();
    });

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            header?.classList.toggle('is-scrolled', y > 8);
            goTop?.classList.toggle('is-visible', y > 500);
            ticking = false;
        });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    goTop?.addEventListener('click', () => {
        scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    // Sección activa en el menú.
    const sections = [...document.querySelectorAll('main section[id]')];
    const setActive = (id) => {
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: [0, .25, .5, 1] }
    );
    sections.forEach((section) => observer.observe(section));
}

/* ---------- Animación de entrada ---------- */
export function initReveal() {
    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        return { observe: () => {} };
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry, i) => {
                if (!entry.isIntersecting) return;
                setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
                obs.unobserve(entry.target);
            });
        },
        { threshold: .12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return observer;
}

/* ---------- Texto rotativo del hero ---------- */
export function initTyped() {
    const target = document.getElementById('typed');
    if (!target) return;

    let timer;
    let roles = [];

    const start = () => {
        clearTimeout(timer);
        roles = t('hero.roles', []);
        if (!Array.isArray(roles) || !roles.length) return;

        if (prefersReducedMotion) {
            target.textContent = roles[0];
            return;
        }

        let index = 0;
        let chars = 0;
        let deleting = false;

        const tick = () => {
            const word = roles[index];
            chars += deleting ? -1 : 1;
            target.textContent = word.slice(0, chars);

            let delay = deleting ? 35 : 65;
            if (!deleting && chars === word.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && chars === 0) {
                deleting = false;
                index = (index + 1) % roles.length;
                delay = 350;
            }
            timer = setTimeout(tick, delay);
        };

        tick();
    };

    start();
    onLangChange(start);
}

/* ---------- Números del hero ---------- */
export function initCounters() {
    const items = [...document.querySelectorAll('[data-count]')];
    if (!items.length) return;

    if (prefersReducedMotion) {
        items.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || '')));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const end = Number(el.dataset.count) || 0;
                const duration = 900;
                const started = performance.now();

                const suffix = el.dataset.suffix || '';
                const step = (now) => {
                    const progress = Math.min((now - started) / duration, 1);
                    el.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3))) + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                obs.unobserve(el);
            });
        },
        { threshold: .6 }
    );

    items.forEach((el) => {
        el.textContent = '0';
        observer.observe(el);
    });
}

/* ---------- Selector de idioma ---------- */
export function initLangSwitch(setLang, getLang) {
    const buttons = [...document.querySelectorAll('.lang-switch__btn')];

    const sync = () => {
        buttons.forEach((btn) => {
            const active = btn.dataset.lang === getLang();
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', String(active));
        });
    };

    buttons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
    onLangChange(sync);
    sync();
}

export function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

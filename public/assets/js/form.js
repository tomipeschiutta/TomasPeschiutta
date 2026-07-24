/**
 * Formulario de contacto.
 *
 * Por defecto abre el cliente de correo con el mensaje ya armado (funciona
 * siempre, sin backend). Si querés recibir los mensajes por email sin que se
 * abra el cliente del visitante, creá un formulario gratuito en
 * https://formspree.io o https://web3forms.com y pegá la URL en ENDPOINT.
 */

const ENDPOINT = '';                             // ej: 'https://formspree.io/f/xxxxxxx'
const MAILTO = 'tomipeschiutta@gmail.com';

import { t } from './i18n.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(field, message) {
    const wrapper = field.closest('.field');
    const slot = wrapper.querySelector('.field__error');
    wrapper.classList.toggle('has-error', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (slot) slot.textContent = message || '';
}

function validateField(field) {
    const value = field.value.trim();

    if (!value) {
        setError(field, t('contact.errRequired', 'Este campo es obligatorio.'));
        return false;
    }
    if (field.type === 'email' && !EMAIL_RE.test(value)) {
        setError(field, t('contact.errEmail', 'Ingresá un email válido.'));
        return false;
    }
    if (field.tagName === 'TEXTAREA' && value.length < 10) {
        setError(field, t('contact.errShort', 'Contame un poco más.'));
        return false;
    }

    setError(field, '');
    return true;
}

function openMailClient({ name, email, subject, message }) {
    const body = `${message}\n\n—\n${name}\n${email}`;
    location.href = `mailto:${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submit = document.getElementById('submit-btn');
    const submitLabel = submit.querySelector('span');
    const fields = [...form.querySelectorAll('input, textarea')];

    // Trampa anti-spam: los bots la completan, las personas no la ven.
    const honeypot = document.createElement('input');
    Object.assign(honeypot, { type: 'text', name: 'website', tabIndex: -1, autocomplete: 'off' });
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0';
    form.prepend(honeypot);

    fields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.field').classList.contains('has-error')) validateField(field);
        });
    });

    const setStatus = (message, kind = '') => {
        status.textContent = message;
        status.className = `form-status${kind ? ` is-${kind}` : ''}`;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus('');

        if (honeypot.value) return;                       // bot

        const valid = fields.map(validateField).every(Boolean);
        if (!valid) {
            form.querySelector('.has-error input, .has-error textarea')?.focus();
            return;
        }

        const payload = Object.fromEntries(
            fields.map((field) => [field.name, field.value.trim()])
        );

        if (!ENDPOINT) {
            openMailClient(payload);
            setStatus(t('contact.mailFallback', ''), 'ok');
            form.reset();
            return;
        }

        submit.disabled = true;
        const original = submitLabel.textContent;
        submitLabel.textContent = t('contact.sending', 'Enviando…');

        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(res.statusText);

            form.reset();
            fields.forEach((field) => setError(field, ''));
            setStatus(t('contact.sent', ''), 'ok');
        } catch {
            setStatus(t('contact.error', ''), 'error');
        } finally {
            submit.disabled = false;
            submitLabel.textContent = original;
        }
    });
}

/*
    js/script.js
    - Comportamento do site: menu responsivo, validação de formulários e animações simples
    - Arquivo modular: funções pequenas e reutilizáveis
*/
(function () {
        'use strict';

    // menu toggle + active link handling
    const showMenu = (toggLedId, navId) => {
        const toggle = document.getElementById(toggLedId);
        const nav = document.getElementById(navId);
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('show');
            });
        }
    };

    showMenu('nav-toggle', 'nav-menu');

    const navLink = document.querySelectorAll('.nav_link');

    function linkActive() {
        navLink.forEach((item) => item.classList.remove('active'));
        this.classList.add('active');
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.classList.remove('show');
    }

    navLink.forEach((item) => item.addEventListener('click', linkActive));

    // --- Form validation: per-field live validation + submit handler ---
    function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

    const debounce = (fn, wait = 180) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    };

    function emailLooksValid(value) { return /^\S+@\S+\.\S+$/.test(value); }

    function showError(field, message) {
        let el = field.nextElementSibling;
        if (!el || !el.classList || !el.classList.contains('form-error')) {
            el = document.createElement('span');
            el.className = 'form-error';
            field.insertAdjacentElement('afterend', el);
        }
        el.textContent = message || '';
        if (message) {
            field.classList.add('invalid');
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.classList.remove('invalid');
            field.removeAttribute('aria-invalid');
        }
    }

    function validateField(field) {
        if (!field) return true;
        const val = (field.value || '').trim();
        if (field.hasAttribute('required') && !val) {
            showError(field, 'Por favor, preencha este campo.');
            return false;
        }
        if (field.type === 'email' && val && !emailLooksValid(val)) {
            showError(field, 'Informe um email válido.');
            return false;
        }
        if (field.type === 'tel' && val) {
            const phonePattern = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
            if (!phonePattern.test(val)) {
                showError(field, 'Informe um telefone válido (ex: (99) 99999-9999).');
                return false;
            }
        }
        if (field.hasAttribute('minlength')) {
            const min = Number(field.getAttribute('minlength'));
            if (val.length && val.length < min) { showError(field, `Mínimo ${min} caracteres.`); return false; }
        }
        if (field.hasAttribute('maxlength')) {
            const max = Number(field.getAttribute('maxlength'));
            if (val.length && val.length > max) { showError(field, `Máximo ${max} caracteres.`); return false; }
        }
        if (field.checkValidity && !field.checkValidity()) {
            showError(field, field.validationMessage || 'Valor inválido.');
            return false;
        }
        showError(field, '');
        return true;
    }

    function attachFormValidation(root = document) {
        const forms = qsa('form', root);
        forms.forEach((form) => {
            const fields = qsa('input, textarea, select', form).filter(f => f.type !== 'hidden');
            fields.forEach((field) => {
                const liveValidate = debounce(() => validateField(field), 180);
                field.addEventListener('input', () => liveValidate());
                field.addEventListener('blur', () => validateField(field));
            });
            form.addEventListener('submit', (e) => {
                let firstInvalid = null;
                let ok = true;
                fields.forEach((f) => { if (!validateField(f)) { ok = false; if (!firstInvalid) firstInvalid = f; } });
                if (!ok) { e.preventDefault(); firstInvalid && firstInvalid.focus(); }
                else { e.preventDefault(); alert('Mensagem enviada com sucesso!'); form.reset(); }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => attachFormValidation(document));
    window.attachFormValidation = attachFormValidation;
})();

    /* Typewriter effect for the home title name */
    /* --------------------------
       Typewriter effect
       - Digita a frase principal e opcionalmente destaca o nome
       - Implementado como sequência async para permitir encadear linhas
       -------------------------- */
    (function () {
        function typeWriter(el, speed = 110, name = null) {
            return new Promise((resolve) => {
                if (!el) return resolve();
                const text = (el.textContent || '').trim();
                el.textContent = '';
                let i = 0;
                const timer = setInterval(() => {
                    el.textContent += text.charAt(i) || '';
                    i += 1;
                    if (i >= text.length) {
                        clearInterval(timer);
                        if (name) {
                            const replaced = el.textContent.replace(name, `<span class="home_title-color">${name}</span>`);
                            el.innerHTML = replaced;
                        }
                        resolve();
                    }
                }, speed);
            });
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const mainEl = document.getElementById('typewriter-text');
            const subEl = document.getElementById('typewriter-subtext');
            if (mainEl) await typeWriter(mainEl, 110, 'Patrícia');
            if (subEl) {
                await new Promise(r => setTimeout(r, 200));
                await typeWriter(subEl, 90, null);
            }
        });
    })();


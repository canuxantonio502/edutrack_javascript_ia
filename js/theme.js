/**
 * Módulo de tema claro / oscuro.
 *
 * - Se carga en el <head> para aplicar el tema antes de pintar la página
 *   (evita el destello de tema incorrecto al recargar).
 * - Si el usuario nunca eligió, se respeta la preferencia del sistema.
 * - La elección se guarda en localStorage y se comparte entre páginas.
 * - Emite el evento "edutrack:themechange" para que otros módulos
 *   (por ejemplo el gráfico) se actualicen.
 */
const Theme = (() => {
    const STORAGE_KEY = 'edutrack_theme';
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const getSaved = () => localStorage.getItem(STORAGE_KEY);
    const getCurrent = () => root.dataset.theme;

    const apply = (theme) => {
        root.dataset.theme = theme;
        updateToggles(theme);
        document.dispatchEvent(new CustomEvent('edutrack:themechange', { detail: { theme } }));
    };

    /** Actualiza texto y accesibilidad de todos los botones de cambio de tema. */
    const updateToggles = (theme) => {
        const next = theme === 'dark' ? 'claro' : 'oscuro';
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            btn.setAttribute('aria-label', `Cambiar a tema ${next}`);
            btn.setAttribute('title', `Cambiar a tema ${next}`);
            const label = btn.querySelector('.theme-toggle-label');
            if (label) label.textContent = `Tema ${next}`;
        });
    };

    const toggle = () => {
        const theme = getCurrent() === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, theme);
        apply(theme);
    };

    const init = () => {
        root.dataset.theme = getSaved() || (systemDark.matches ? 'dark' : 'light');

        // Si el usuario no ha elegido, seguir los cambios del sistema en vivo
        systemDark.addEventListener('change', (e) => {
            if (!getSaved()) apply(e.matches ? 'dark' : 'light');
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', toggle));
            updateToggles(getCurrent());
        });
    };

    return { init, getCurrent, toggle };
})();

Theme.init();

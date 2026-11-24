/**
 * Módulo para gestionar el Sidebar interactivo (menú hamburguesa en móvil).
 */
const SidebarModule = (() => {

    const init = ({ toggleId, closeId, sidebarId, overlayId }) => {
        const toggleBtn = document.getElementById(toggleId);
        const closeBtn = document.getElementById(closeId);
        const sidebar = document.getElementById(sidebarId);
        const overlay = document.getElementById(overlayId);

        if (!toggleBtn || !sidebar || !overlay) {
            console.warn('SidebarModule: No se encontraron todos los elementos requeridos.');
            return;
        }

        const setOpen = (isOpen) => {
            sidebar.classList.toggle('is-open', isOpen);
            overlay.classList.toggle('is-active', isOpen);
            toggleBtn.classList.toggle('is-active', isOpen); // Animación a "X"
        };

        toggleBtn.addEventListener('click', () => setOpen(!sidebar.classList.contains('is-open')));
        overlay.addEventListener('click', () => setOpen(false));
        if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('is-open')) setOpen(false);
        });
    };

    /** Enlaces marcados con data-coming-soon muestran un aviso en lugar de navegar. */
    const bindComingSoonLinks = () => {
        document.querySelectorAll('[data-coming-soon]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`La sección de ${link.dataset.comingSoon} se encuentra en desarrollo.`);
            });
        });
    };

    return { init, bindComingSoonLinks };
})();

document.addEventListener('DOMContentLoaded', () => {
    SidebarModule.init({
        toggleId: 'menu-toggle',
        closeId: 'close-sidebar',
        sidebarId: 'sidebar',
        overlayId: 'sidebar-overlay'
    });
    SidebarModule.bindComingSoonLinks();
});

/**
 * Lógica de la landing page (index.html): modal de registro e inicio de sesión.
 */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('register-modal');
    const btnClose = document.getElementById('close-modal');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-btn');

    if (!modal || !btnClose || !registerForm) return;

    const openModal = (e) => {
        if (e) e.preventDefault();
        modal.classList.add('is-active');
        document.getElementById('reg-name').focus();
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
        registerForm.reset();
    };

    // Cualquier elemento con data-open-register abre el modal
    document.querySelectorAll('[data-open-register]').forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Clic fuera del recuadro
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) closeModal();
    });

    // Registro: guarda la cuenta, inicia sesión y redirige al panel
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();

        Session.register({ name, email });
        alert(`¡Excelente decisión, ${name}! Registro exitoso. Redirigiendo a tu espacio de trabajo...`);
        window.location.href = 'dashboard.html';
    });

    // Inicio de sesión: usa la cuenta guardada o invita a registrarse
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const account = Session.login();
            if (account) {
                alert(`¡Bienvenido de vuelta, ${account.name}!`);
                window.location.href = 'dashboard.html';
            } else {
                alert('No tienes ninguna cuenta registrada. Por favor, regístrate.');
                openModal();
            }
        });
    }
});

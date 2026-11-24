/**
 * Vista del panel del estudiante (dashboard.html).
 * Las métricas y el historial son datos de demostración escritos en el HTML.
 */
document.addEventListener('DOMContentLoaded', () => {
    const user = Session.requireUser();
    if (!user) return;
    Session.setupPrivateLayout(user);

    // Saludo con el primer nombre del usuario
    const greeting = document.querySelector('.greeting');
    if (greeting) greeting.textContent = `¡Hola, ${user.name.split(' ')[0]}! 👋`;
});

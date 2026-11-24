/**
 * Módulo de sesión simulada con localStorage.
 *
 * - La "cuenta" (nombre y email) se guarda al registrarse y se conserva.
 * - La "sesión" indica si el usuario está dentro; cerrar sesión solo la termina.
 *
 * No es autenticación real: no hay contraseña ni servidor. Sirve para
 * demostrar el flujo registro → panel → cierre de sesión.
 */
const Session = (() => {
    const ACCOUNT_KEY = 'edutrack_user';
    const SESSION_KEY = 'edutrack_session';

    const getAccount = () => {
        const stored = localStorage.getItem(ACCOUNT_KEY);
        return stored ? JSON.parse(stored) : null;
    };

    const register = (account) => {
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
        localStorage.setItem(SESSION_KEY, 'active');
    };

    /** Inicia sesión con la cuenta guardada. Devuelve la cuenta o null si no existe. */
    const login = () => {
        const account = getAccount();
        if (account) localStorage.setItem(SESSION_KEY, 'active');
        return account;
    };

    const logout = () => localStorage.removeItem(SESSION_KEY);

    const getCurrentUser = () => (localStorage.getItem(SESSION_KEY) ? getAccount() : null);

    /** Protege una vista privada: redirige al inicio si no hay sesión activa. */
    const requireUser = () => {
        const user = getCurrentUser();
        if (!user) {
            alert('Acceso denegado. Por favor inicia sesión o regístrate.');
            window.location.href = 'index.html';
        }
        return user;
    };

    /** Iniciales para el avatar: "Ana López" → "AL", "Ana" → "A". */
    const getInitials = (name) => name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join('');

    /** Muestra nombre e iniciales del usuario en el sidebar y conecta el botón "Salir". */
    const setupPrivateLayout = (user) => {
        document.querySelectorAll('.user-name').forEach(el => { el.textContent = user.name; });
        document.querySelectorAll('.user-avatar').forEach(el => { el.textContent = getInitials(user.name) || 'U'; });

        document.querySelectorAll('.btn-logout').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    logout();
                    window.location.href = 'index.html';
                }
            });
        });
    };

    return { getAccount, register, login, logout, getCurrentUser, requireUser, setupPrivateLayout };
})();

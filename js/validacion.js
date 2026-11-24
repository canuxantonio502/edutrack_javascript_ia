/**
 * Módulo de validación del dataset de estudiantes.
 * Cada registro se valida de forma independiente: los válidos se usan
 * y los inválidos se reportan en consola sin bloquear la aplicación.
 */
const PLANES_PERMITIDOS = ['básico', 'estándar', 'premium'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valida un registro y devuelve la lista de errores encontrados.
 * @param {object} estudiante
 * @returns {string[]} Errores (vacío si el registro es válido).
 */
function validarEstudiante(estudiante) {
    const errores = [];

    if (!Number.isInteger(estudiante.id) || estudiante.id <= 0) {
        errores.push(`'id' inválido (${estudiante.id}).`);
    }
    if (typeof estudiante.nombre !== 'string' || estudiante.nombre.trim() === '') {
        errores.push(`'nombre' está vacío o no es texto.`);
    }
    if (!EMAIL_REGEX.test(estudiante.email)) {
        errores.push(`'email' con formato incorrecto (${estudiante.email}).`);
    }
    if (typeof estudiante.progreso !== 'number' || estudiante.progreso < 0 || estudiante.progreso > 100) {
        errores.push(`'progreso' fuera de rango (${estudiante.progreso}).`);
    }
    if (!FECHA_REGEX.test(estudiante.fechaInscripcion) || isNaN(Date.parse(estudiante.fechaInscripcion))) {
        errores.push(`'fechaInscripcion' inválida (${estudiante.fechaInscripcion}).`);
    }
    if (!PLANES_PERMITIDOS.includes(estudiante.plan)) {
        errores.push(`'plan' no reconocido (${estudiante.plan}).`);
    }
    if (isNaN(Number(estudiante.montoUSD))) {
        errores.push(`'montoUSD' no es numérico (${estudiante.montoUSD}).`);
    }
    if (typeof estudiante.activo !== 'boolean') {
        errores.push(`'activo' no es un booleano.`);
    }

    return errores;
}

/**
 * Descarga el JSON de estudiantes y separa los registros válidos de los inválidos.
 * @param {string} jsonUrl Ruta del archivo JSON.
 * @returns {Promise<{isValid: boolean, data: object[], errors: string[]}>}
 */
async function validarDatosEstudiantes(jsonUrl) {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const registros = await response.json();

        const data = [];
        const errors = [];

        registros.forEach((estudiante, index) => {
            const erroresRegistro = validarEstudiante(estudiante);
            if (erroresRegistro.length === 0) {
                data.push(estudiante);
            } else {
                const fila = `Fila ${index + 1} (ID: ${estudiante.id})`;
                erroresRegistro.forEach(error => errors.push(`${fila} - ${error}`));
            }
        });

        if (errors.length > 0) {
            console.warn(`Se descartaron registros inválidos del JSON:`, errors);
        }

        return { isValid: errors.length === 0, data, errors };
    } catch (error) {
        console.error('Error al obtener o procesar el JSON:', error);
        return { isValid: false, data: [], errors: [error.message] };
    }
}

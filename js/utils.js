/**
 * Utilidades compartidas entre las distintas vistas.
 */

/**
 * Escapa caracteres especiales de HTML para insertar texto de forma segura
 * dentro de Template Literals que se asignan a innerHTML.
 * @param {*} value
 * @returns {string}
 */
function escapeHTML(value) {
    const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, char => replacements[char]);
}

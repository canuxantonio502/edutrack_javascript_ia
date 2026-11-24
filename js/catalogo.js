/**
 * Vista del catálogo de cursos (catalogo.html):
 * renderizado dinámico con búsqueda y filtro por categoría.
 */

// Base de datos simulada de cursos
const COURSES = [
    { id: 1, title: 'JavaScript Avanzado', category: 'Frontend', price: 'Q 250.00', img: 'assets/img/courses/javascript.svg', desc: 'Domina asincronismo, closures y manipulación del DOM en profundidad.' },
    { id: 2, title: 'React desde Cero', category: 'Frontend', price: 'Q 300.00', img: 'assets/img/courses/react.svg', desc: 'Crea interfaces interactivas modernas utilizando Hooks y Context API.' },
    { id: 3, title: 'Node.js Backend', category: 'Backend', price: 'Q 350.00', img: 'assets/img/courses/nodejs.svg', desc: 'Construye APIs REST escalables, seguras y eficientes con Express.' },
    { id: 4, title: 'Python Fundamental', category: 'Data', price: 'Q 280.00', img: 'assets/img/courses/python.svg', desc: 'Iníciate en la programación orientada a la ciencia de datos y automatización.' },
    { id: 5, title: 'Bases de Datos SQL', category: 'Backend', price: 'Q 200.00', img: 'assets/img/courses/sql.svg', desc: 'Diseña, consulta y optimiza bases de datos relacionales corporativas.' },
    { id: 6, title: 'Arquitectura CSS', category: 'Frontend', price: 'Q 150.00', img: 'assets/img/courses/css.svg', desc: 'Domina Flexbox, CSS Grid y el diseño de interfaces altamente responsivas.' }
];

const catalogLayoutTemplate = () => `
    <div class="catalog-header-container">
        <div>
            <h2 class="greeting">Catálogo de Cursos</h2>
            <p class="greeting-subtitle">Explora y matricúlate en nuestras nuevas rutas de aprendizaje.</p>
        </div>
        <div class="catalog-controls">
            <input type="text" id="catalog-search" class="catalog-search" placeholder="Buscar curso..." aria-label="Buscar curso">
            <select id="catalog-filter" class="catalog-filter" aria-label="Filtrar por categoría">
                <option value="all">Todas las Categorías</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Data">Data & Analytics</option>
            </select>
        </div>
    </div>
    <div class="catalog-grid" id="catalog-grid"></div>
`;

const courseCardTemplate = (course) => `
    <article class="catalog-card">
        <img src="${course.img}" alt="Portada del curso ${escapeHTML(course.title)}" class="catalog-image" width="400" height="200" loading="lazy">
        <div class="catalog-content">
            <span class="catalog-category">${escapeHTML(course.category)}</span>
            <h3 class="catalog-title">${escapeHTML(course.title)}</h3>
            <p class="catalog-desc">${escapeHTML(course.desc)}</p>
            <div class="catalog-footer">
                <span class="catalog-price">${escapeHTML(course.price)}</span>
                <button class="btn-enroll" data-course-id="${course.id}">Inscribirse</button>
            </div>
        </div>
    </article>
`;

document.addEventListener('DOMContentLoaded', () => {
    const user = Session.requireUser();
    if (!user) return;
    Session.setupPrivateLayout(user);

    const app = document.getElementById('catalog-app');
    app.innerHTML = catalogLayoutTemplate();

    const grid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('catalog-search');
    const filterSelect = document.getElementById('catalog-filter');

    const renderCatalog = (list) => {
        grid.innerHTML = list.length
            ? list.map(courseCardTemplate).join('')
            : `<p class="catalog-empty">No se encontraron cursos con los filtros actuales.</p>`;
    };

    const applyFilters = () => {
        const term = searchInput.value.trim().toLowerCase();
        const category = filterSelect.value;
        renderCatalog(COURSES.filter(c =>
            (category === 'all' || c.category === category) &&
            (c.title.toLowerCase().includes(term) || c.desc.toLowerCase().includes(term))
        ));
    };

    // Delegación de eventos para los botones "Inscribirse"
    grid.addEventListener('click', (e) => {
        const button = e.target.closest('[data-course-id]');
        if (!button) return;
        const course = COURSES.find(c => c.id === Number(button.dataset.courseId));
        alert(`¡Inscripción solicitada para ${course.title}! (Simulación: no se envía ningún correo.)`);
    });

    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);
    renderCatalog(COURSES);
});

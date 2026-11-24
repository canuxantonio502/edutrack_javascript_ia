/**
 * Vista de gestión de estudiantes (estudiantes.html):
 * CRUD con localStorage, filtros combinados y gráfico con Chart.js.
 */

// =========================================
// 1. ESTADO
// =========================================
const STUDENTS_KEY = 'edutrack_students';
const DATASET_URL = 'JSON/ejemplo.json';

let students = [];
let chartInstance = null;
let currentEditId = null;

// =========================================
// 2. REFERENCIAS AL DOM
// =========================================
const dom = {
    grid: document.getElementById('students-grid'),
    search: document.getElementById('filter-search'),
    city: document.getElementById('filter-city'),
    plan: document.getElementById('filter-plan'),
    modal: document.getElementById('student-modal'),
    modalTitle: document.getElementById('modal-title'),
    form: document.getElementById('student-form'),
    fields: {
        nombre: document.getElementById('form-name'),
        email: document.getElementById('form-email'),
        ciudad: document.getElementById('form-city'),
        curso: document.getElementById('form-course'),
        progreso: document.getElementById('form-progress'),
        plan: document.getElementById('form-plan')
    }
};

// =========================================
// 3. INICIALIZACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    const user = Session.requireUser();
    if (!user) return;
    Session.setupPrivateLayout(user);

    await loadData();
    populateCityFilter();
    renderStudents(students);
    initChart();
    setupEventListeners();
});

// =========================================
// 4. PERSISTENCIA
// =========================================
async function loadData() {
    const stored = localStorage.getItem(STUDENTS_KEY);
    if (stored) {
        students = JSON.parse(stored);
        return;
    }
    // Primera visita: se carga el dataset de ejemplo validado
    const result = await validarDatosEstudiantes(DATASET_URL);
    students = result.data;
    saveData();
}

function saveData() {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

// =========================================
// 5. RENDERIZADO
// =========================================
function studentCardTemplate(student) {
    const plan = escapeHTML(student.plan);
    return `
        <article class="student-card">
            <div class="card-header">
                <div>
                    <h3 class="student-name">${escapeHTML(student.nombre)}</h3>
                    <span class="student-email">${escapeHTML(student.email)}</span>
                </div>
                <span class="badge badge-${plan.toLowerCase()}">${plan}</span>
            </div>

            <div class="student-detail">
                <strong>📍 Ciudad:</strong> ${escapeHTML(student.ciudad)}
            </div>
            <div class="student-detail">
                <strong>📚 Curso:</strong> ${escapeHTML(student.curso)}
            </div>

            <div class="progress-container">
                <div class="progress-label">
                    <span>Avance</span>
                    <strong>${student.progreso}%</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${student.progreso}%"></div>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn-action btn-edit" data-action="edit" data-id="${student.id}">Editar</button>
                <button class="btn-action btn-delete" data-action="delete" data-id="${student.id}">Eliminar</button>
            </div>
        </article>
    `;
}

function renderStudents(list) {
    dom.grid.innerHTML = list.length
        ? list.map(studentCardTemplate).join('')
        : `<p class="empty-message">No se encontraron estudiantes que coincidan con los filtros.</p>`;
}

// =========================================
// 6. FILTROS
// =========================================
function populateCityFilter() {
    const selected = dom.city.value;
    const cities = [...new Set(students.map(s => s.ciudad))].sort();
    dom.city.innerHTML = `<option value="all">Todas las ciudades</option>` +
        cities.map(city => `<option value="${escapeHTML(city)}">${escapeHTML(city)}</option>`).join('');
    // Conserva la ciudad elegida si sigue existiendo
    if (cities.includes(selected)) dom.city.value = selected;
}

function getFilteredStudents() {
    const term = dom.search.value.trim().toLowerCase();
    const city = dom.city.value;
    const plan = dom.plan.value;

    return students.filter(s =>
        (s.nombre.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)) &&
        (city === 'all' || s.ciudad === city) &&
        (plan === 'all' || s.plan.toLowerCase() === plan)
    );
}

function applyFilters() {
    const filtered = getFilteredStudents();
    renderStudents(filtered);
    updateChart(filtered);
}

// =========================================
// 7. MODAL Y CRUD
// =========================================
function openModal(id = null) {
    currentEditId = id;
    dom.form.reset();

    if (id !== null) {
        const student = students.find(s => s.id === id);
        dom.modalTitle.textContent = 'Editar Estudiante';
        Object.entries(dom.fields).forEach(([key, input]) => { input.value = student[key]; });
    } else {
        dom.modalTitle.textContent = 'Agregar Estudiante';
    }
    dom.modal.classList.add('active');
    dom.fields.nombre.focus();
}

function closeModal() {
    dom.modal.classList.remove('active');
    dom.form.reset();
    currentEditId = null;
}

function readForm() {
    return {
        nombre: dom.fields.nombre.value.trim(),
        email: dom.fields.email.value.trim(),
        ciudad: dom.fields.ciudad.value.trim(),
        curso: dom.fields.curso.value.trim(),
        progreso: parseInt(dom.fields.progreso.value, 10),
        plan: dom.fields.plan.value
    };
}

function refreshView() {
    saveData();
    populateCityFilter();
    applyFilters();
}

function handleFormSubmit(e) {
    e.preventDefault(); // HTML5 ya valida formato de email y rango de progreso
    const data = readForm();

    if (currentEditId !== null) {
        const index = students.findIndex(s => s.id === currentEditId);
        students[index] = { ...students[index], ...data };
    } else {
        students.push({ id: Date.now(), ...data });
    }

    refreshView();
    closeModal();
}

function deleteStudent(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) return;
    students = students.filter(s => s.id !== id);
    refreshView();
}

/** Delegación de eventos: un solo listener para los botones de todas las tarjetas. */
function handleGridClick(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const id = Number(button.dataset.id);
    if (button.dataset.action === 'edit') openModal(id);
    if (button.dataset.action === 'delete') deleteStudent(id);
}

function setupEventListeners() {
    dom.search.addEventListener('input', applyFilters);
    dom.city.addEventListener('change', applyFilters);
    dom.plan.addEventListener('change', applyFilters);
    dom.grid.addEventListener('click', handleGridClick);

    document.getElementById('btn-add-student').addEventListener('click', () => openModal());
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    dom.modal.addEventListener('click', (e) => { if (e.target === dom.modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dom.modal.classList.contains('active')) closeModal();
    });
    dom.form.addEventListener('submit', handleFormSubmit);
}

// =========================================
// 8. GRÁFICO (Chart.js)
// =========================================
function getChartData(list) {
    const cityCounts = list.reduce((acc, s) => {
        acc[s.ciudad] = (acc[s.ciudad] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(cityCounts),
        datasets: [{
            label: 'Total de Estudiantes',
            data: Object.values(cityCounts),
            backgroundColor: '#10B981', // --accent-green
            borderRadius: 4
        }]
    };
}

/** Colores de texto y cuadrícula del gráfico según el tema activo. */
function getChartColors() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    return {
        text: isDark ? '#CBD5E1' : '#334155',
        muted: isDark ? '#94A3B8' : '#64748B',
        grid: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.08)'
    };
}

function applyChartTheme() {
    const { text, muted, grid } = getChartColors();
    const { options } = chartInstance;
    options.plugins.title.color = text;
    ['x', 'y'].forEach(axis => {
        options.scales[axis].ticks.color = muted;
        options.scales[axis].grid.color = grid;
    });
}

function initChart() {
    const ctx = document.getElementById('cityChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: getChartData(students),
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Distribución de Estudiantes por Ciudad', font: { size: 16 } }
            },
            scales: {
                x: { ticks: {}, grid: {} },
                y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: {} }
            }
        }
    });
    applyChartTheme();
    chartInstance.update();

    // Repintar el gráfico cuando cambie el tema (evento emitido por theme.js)
    document.addEventListener('edutrack:themechange', () => {
        applyChartTheme();
        chartInstance.update();
    });
}

function updateChart(list) {
    if (!chartInstance) return;
    const { labels, datasets } = getChartData(list);
    chartInstance.data.labels = labels;
    chartInstance.data.datasets = datasets;
    chartInstance.update();
}

# EduTrack - Dashboard de Gestión de Estudiantes 🇬🇹🚀

> Plataforma web de práctica orientada al ecosistema EdTech en Guatemala para gestionar, filtrar y visualizar el progreso de los estudiantes.

Es un proyecto **frontend estático** hecho con HTML, CSS y JavaScript puro, sin frameworks. Los datos se guardan en el navegador con `localStorage`. No hay backend.

> [!NOTE]
> **Proyecto desarrollado con asistencia de IA.** Se construyó con la ayuda de **Gemini** y **Claude** como asistentes de programación. Más detalles en [Desarrollo asistido por IA](#-desarrollo-asistido-por-ia).

## 🛠️ Stack Tecnológico

* **HTML5:** estructura semántica (`header`, `nav`, `main`, `article`, `aside`).
* **CSS3 puro:** Custom Properties, Flexbox, CSS Grid y media queries. Sin Bootstrap ni Tailwind.
* **JavaScript (Vanilla, ES6+):** manipulación del DOM, Template Literals, `fetch`, `async/await`, módulos con el patrón IIFE y delegación de eventos.
* **Chart.js v4 (CDN):** gráfico de barras de estudiantes por ciudad.
* **Web Storage API:** `localStorage` para la cuenta, la sesión y los registros de estudiantes.

## ✨ Características

1. **Landing page** con registro e inicio de sesión mediante un modal.
2. **Sesión simulada:** las vistas privadas (Dashboard, Catálogo y Estudiantes) redirigen al inicio si no hay sesión. Cerrar sesión termina la sesión, pero la cuenta registrada se conserva.
3. **CRUD de estudiantes:** permite crear, editar y eliminar registros desde un modal.
4. **Filtros combinados en tiempo real:** por nombre o correo, por ciudad (lista generada desde los datos) y por plan de suscripción.
5. **Gráfico reactivo:** se actualiza con los filtros activos.
6. **Validación del dataset:** al cargar `JSON/ejemplo.json` se valida cada registro (id, email, progreso, fecha, plan, monto y estado). Los registros inválidos se descartan y se informan en la consola.
7. **Catálogo de cursos** con búsqueda y filtro por categoría.
8. **Diseño responsivo** con menú lateral tipo hamburguesa en móvil.
9. **Identidad visual propia:** logo y favicon de EduTrack, más portadas de cursos, ilustración del panel, iconos y avatares en SVG con la paleta del proyecto, sin depender de servicios externos. En las vistas privadas, el avatar muestra las iniciales del usuario.

## 📂 Estructura del Proyecto

```text
/
├── assets/
│   ├── icons/                 # Iconos SVG (beneficios y botón de chat)
│   └── img/
│       ├── avatars/           # Avatares con iniciales de los testimonios
│       ├── courses/           # Portadas ilustradas de los 6 cursos
│       ├── hero-dashboard.svg # Ilustración del panel en la landing
│       ├── logo-edutrack.png  # Logo oficial (PNG transparente, 256 px)
│       └── favicon-64.png     # Favicon generado a partir del logo
│
├── css/
│   ├── style.css              # Estilos de la vista de estudiantes (tarjetas, modal, gráfico)
│   ├── dashboard_styles.css   # Layout del panel privado (sidebar, cards, tabla)
│   ├── catalogo.css           # Estilos específicos del catálogo
│   └── landing_styles.css     # Estilos de la landing page
│
├── js/
│   ├── utils.js               # Utilidades compartidas (escapeHTML)
│   ├── session.js             # Cuenta, sesión, protección de vistas y cierre de sesión
│   ├── sidebar.js             # Menú lateral responsivo y enlaces "en desarrollo"
│   ├── validacion.js          # Carga y validación del dataset JSON
│   ├── landing.js             # Modal de registro e inicio de sesión (index.html)
│   ├── dashboard.js           # Saludo personalizado del panel (dashboard.html)
│   ├── catalogo.js            # Render y filtros del catálogo (catalogo.html)
│   └── estudiantes.js         # CRUD, filtros y gráfico (estudiantes.html)
│
├── JSON/
│   └── ejemplo.json           # Dataset inicial de 35 estudiantes ficticios
│
├── index.html                 # Landing page
├── dashboard.html             # Panel del estudiante (métricas e historial)
├── catalogo.html              # Catálogo de cursos
└── estudiantes.html           # Gestión de estudiantes (CRUD + gráfico)
```

Cada página carga solo los scripts que necesita. El orden es: primero las utilidades compartidas (`utils.js`, `session.js`, `sidebar.js`) y después el script propio de la vista.

## 🚀 Instalación y uso local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/canuxantonio502/edutrack_javascript_ia.git
   ```

2. Abre la carpeta en tu editor (por ejemplo, VS Code).

3. Sirve el proyecto con un servidor local, por ejemplo con la extensión **Live Server**, y abre `index.html`.

> [!IMPORTANT]
> Si abres `index.html` con doble clic (`file://`), el navegador bloquea el `fetch` de `JSON/ejemplo.json` y la vista de Estudiantes aparecerá vacía. Usa siempre un servidor local.

**Flujo de prueba:** Regístrate → Dashboard → Estudiantes (CRUD y filtros) → Catálogo → Salir.
Para reiniciar los datos, borra las claves `edutrack_*` del `localStorage` desde las herramientas de desarrollo del navegador.

## ⚠️ Limitaciones conocidas

* **No hay autenticación real:** no se usan contraseñas ni servidor. La sesión solo sirve para demostrar el flujo.
* **Persistencia local:** los datos solo existen en el navegador donde se crearon.
* **Datos de demostración:** las cifras de la landing, los testimonios, las métricas y el historial del Dashboard son ficticios y están escritos en el HTML.
* **Secciones pendientes:** "Mis Rutas" está en desarrollo. Las inscripciones del catálogo y el botón de WhatsApp son simulaciones.

## 🤖 Desarrollo asistido por IA

Este proyecto se realizó con la asistencia de **Gemini** y **Claude** como herramientas de apoyo para:

* Generar la estructura inicial de las vistas, los estilos y la lógica del CRUD.
* Crear el dataset de ejemplo y las reglas de validación.
* Revisar el código, corregir errores (validación de planes, sesión y menú móvil) y reorganizar los scripts en módulos por responsabilidad.
* Redactar esta documentación.

El autor revisó, probó e integró los cambios. Las decisiones de diseño y el alcance del proyecto son suyos.

## :feather: Autor

* **Antonio Canux** - *Único colaborador* - [canuxantonio502](https://github.com/canuxantonio502)

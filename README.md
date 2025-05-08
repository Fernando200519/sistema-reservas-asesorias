# Sistema de Reservas de Asesorías
Un sistema para gestionar horarios y reservas de asesorías de manera eficiente.

## Descripción
Este proyecto es una aplicación web diseñada para que los profesores puedan gestionar sus horarios de asesorías y los estudiantes puedan reservarlas. Incluye funcionalidades como la creación de horarios, confirmación de reservas y visualización de horarios disponibles.

## Características
- Creación de horarios personalizados por los profesores.
- Confirmación de horarios creados.
- Visualización de horarios disponibles, reservados y concluidos.
- Filtro de horarios por estado.
- Uso de un calendario interactivo para seleccionar fechas.

## Tecnologías utilizadas
- **HTML5**: Estructura de las vistas.
- **CSS3**: Estilos y diseño responsivo.
- **JavaScript (ES6+)**: Lógica de la aplicación.
- **Flatpickr**: Calendario interactivo.
- **LocalStorage**: Almacenamiento temporal de datos.

## Estructura del proyecto
src/
├── main/
│   ├── components/       # Componentes reutilizables (header, datePicker, etc.)
│   ├── css/              # Archivos de estilos CSS
│   ├── views/            # Vistas HTML organizadas por funcionalidad
│   │   ├── profesores/   # Vistas relacionadas con los profesores
│   ├── global.js         # Funciones globales
        index.html        # Vista principal de la página de inicio
│   ├── index.js          # Lógica principal de la página de inicio
│   ├── main.js           # Archivo principal del proyecto

## Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/sistema-reservas-asesorias.git
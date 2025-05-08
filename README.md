# Sistema de Reservaciones del Centro de Autoacceso

Este sistema de reservaciones permite a los asesores del Centro de Autoacceso crear horarios de asesorías, los cuales pueden ser visualizados por los alumnos para agendar sesiones. La aplicación está en desarrollo y actualmente se enfoca en la funcionalidad de creación y visualización de horarios.

## Tecnologías utilizadas

- **Electron**: Para crear la aplicación de escritorio.
- **JavaScript/HTML/CSS**: Para la interfaz gráfica.
- **Base de datos Oracle**: Para almacenar horarios, usuarios y reservaciones.

## Funcionalidad actual

### Creación de horarios (asesor)

- El asesor puede acceder a su interfaz personal.
- Puede seleccionar los días y horas en los que ofrecerá asesorías.
- Estos horarios se guardan en la base de datos y quedan disponibles para los alumnos.

### Visualización de horarios (alumno)

- El alumno inicia sesión con su matrícula.
- Puede ver los horarios disponibles creados por los asesores.
- Por ahora, **la funcionalidad de reservar no está habilitada**; solo se visualiza la disponibilidad.

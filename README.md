# Sistema de Reservaciones del Centro de Autoacceso

Este sistema permite gestionar las reservaciones de asesorías en el Centro de Autoacceso de idiomas. Los asesores pueden crear horarios disponibles, y los alumnos pueden reservar espacios según los temas que necesiten, de acuerdo con su nivel de inglés (Inglés 1 o Inglés 2).  
La aplicación es de escritorio y ha sido desarrollada para ejecutarse en las computadoras de los asesores y en el equipo central del Centro de Autoacceso utilizado para el registro de alumnos.

## Tecnologías utilizadas

- **Electron**: Framework para desarrollar aplicaciones de escritorio con tecnologías web.
- **JavaScript, HTML, CSS**: Para la interfaz gráfica y lógica de la aplicación.
- **Base de datos Oracle**: Para almacenar usuarios, horarios, temas y reservaciones.
- **Flatpickr**: Plugin para seleccionar fechas en la interfaz.

## Funcionalidad principal

### Para asesores

- Iniciar sesión con su usuario y contraseña.
- Crear horarios disponibles seleccionando días y horas.
- Ver todas sus asesorías programadas.
- Filtrar asesorías por estado (disponible, reservada, concluida).
- Imprimir asesorías reservadas por fecha.

### Para alumnos

- Iniciar sesión con su matrícula y contraseña.
- Ver horarios disponibles para asesorías.
- Reservar un horario según el tema que necesite (el primer alumno define el tema del horario).
- Cancelar una reservación con al menos 24 horas de anticipación.
- Recibir notificaciones por correo en caso de cancelar una reservación por parte del asesor.

### Funciones adicionales

- Restricción para reservar o cancelar con menos de 24 horas de anticipación.
- Deshabilitación automática de temas según el calendario del Centro de Autoacceso.(En proceso)
- Muestra del nivel de inglés en la interfaz, según el tema reservado (Inglés 1 o Inglés 2).
- Sistema multiusuario con perfiles separados para asesores y alumnos.

## Usuarios de prueba

Para probar el sistema localmente, puede iniciar sesión con los siguientes usuarios:

### Asesor de prueba

- **Usuario:** `jvergara`  
- **Contraseña:** `academico_Th`

### Alumno de prueba

- **Usuario:** `S12047569`  
- **Contraseña:** `pasesorias`
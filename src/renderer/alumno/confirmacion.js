document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a los <span> del HTML
  const spanTema = document.querySelector('.cuadro-datos-izquierda p:nth-child(1) span');
  const spanFecha = document.querySelector('.cuadro-datos-izquierda p:nth-child(2) span');
  const spanHora = document.querySelector('.cuadro-datos-izquierda p:nth-child(3) span');
  const spanAsesor = document.querySelector('.cuadro-datos-izquierda p:nth-child(4) span');
  const spanAlumno = document.querySelector('.cuadro-datos-izquierda p:nth-child(5) span');

  // Leer datos del localStorage
  const tema = localStorage.getItem('temaSeleccionado');
  const fecha = localStorage.getItem('fechaSeleccionada');
  const hora = localStorage.getItem('horaSeleccionada');
  const asesor = localStorage.getItem('nombreAsesor');
  const alumno = localStorage.getItem('nombreAlumno');

  // Insertar los datos en el HTML
  if (tema) spanTema.textContent = tema;
  if (fecha) spanFecha.textContent = fecha;
  if (hora) spanHora.textContent = hora;
  if (asesor) spanAsesor.textContent = asesor;
  if (alumno) spanAlumno.textContent = alumno;
});

// Botón para modificar tema
document.getElementById('btn-modificar-tema').addEventListener('click', () => {
  window.history.back(); // Regresa a la pantalla de selección de temas
});

document.getElementById('btn-volver').addEventListener('click', () => {
    window.location.href = `alumno.html`; // Esto regresa a la pantalla anterior (la de horarios)
});


// Botón para confirmar la reservación
document.getElementById('btn-confirmar').addEventListener('click', async () => {
  const tema = localStorage.getItem('temaSeleccionado');
  const fecha = localStorage.getItem('fechaSeleccionada');
  const hora = localStorage.getItem('horaSeleccionada');
  const asesor = localStorage.getItem('nombreAsesor');
  const alumno = localStorage.getItem('nombreAlumno');

  // Validar que todos los datos estén presentes
  if (!tema || !fecha || !hora || !asesor || !alumno) {
    alert('Faltan datos para enviar la reservación.');
    return;
  }

  // Construir objeto para enviar
  const datosReservacion = {
    alumno: alumno,
    tema: tema,
    fecha: fecha,
    hora: hora,
    asesor: asesor
  };

  console.log('Datos de la reservación:', datosReservacion);

  try {
    const response = await fetch('http://localhost:3000/api/reservaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosReservacion)
    });

    if (!response.ok) {
      throw new Error('Error al guardar la reservación.');
    }

    const resultado = await response.json();
    console.log('Reservación guardada:', resultado);

    alert('Reservación confirmada con éxito.');
    localStorage.clear(); // O limpia solo lo necesario
    window.location.href = 'reserva_exitosa.html'; // Página de éxito si quieres
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al confirmar la reservación.');
  }
});

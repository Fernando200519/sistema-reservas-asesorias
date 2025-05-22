document.addEventListener('DOMContentLoaded', () => {
  const spanTema = document.querySelector('.cuadro-datos-izquierda p:nth-child(1) span');
  const spanFecha = document.querySelector('.cuadro-datos-izquierda p:nth-child(2) span');
  const spanHora = document.querySelector('.cuadro-datos-izquierda p:nth-child(3) span');
  const spanAsesor = document.querySelector('.cuadro-datos-izquierda p:nth-child(4) span');
  const spanAlumno = document.querySelector('.cuadro-datos-izquierda p:nth-child(5) span');

  function limpiarTextoTema(temaCompleto) {
    return temaCompleto.replace(/^Tema \d+:\s*/, '');
  }

  const temaRaw = localStorage.getItem('temaSeleccionado');
  const fecha = localStorage.getItem('fechaSeleccionada');
  const hora = localStorage.getItem('horaSeleccionada');
  const asesor = localStorage.getItem('nombreAsesor');
  const alumno = localStorage.getItem('nombreAlumno');

  const tema = temaRaw ? limpiarTextoTema(temaRaw) : '';

  if (tema) spanTema.textContent = tema;
  if (fecha) spanFecha.textContent = fecha;
  if (hora) spanHora.textContent = hora;
  if (asesor) spanAsesor.textContent = asesor;
  if (alumno) spanAlumno.textContent = alumno;
});

// Botón volver
document.getElementById('btn-volver').addEventListener('click', () => {
  window.history.back();
});

// Botón confirmar reservación
document.getElementById('btn-confirmar').addEventListener('click', async () => {
  const idAsesoria = localStorage.getItem("idAsesoria");
  const tema = localStorage.getItem("temaSeleccionado");
  const fecha = localStorage.getItem("fechaSeleccionada");
  const hora = localStorage.getItem("horaSeleccionada");
  const matricula = localStorage.getItem("matricula");

  const datos = {
    id_asesoria: idAsesoria,
    tema: tema,
    fecha: fecha,
    hora: hora,
    matricula: matricula
  };

  try {
    const response = await fetch('http://localhost:3000/api/reservaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error('Error en la reservación');
    }

    mostrarModal(); // Éxito

  } catch (error) {
    console.error('Error al confirmar la reservación:', error);
    alert('Ocurrió un error al confirmar la reservación. Intenta nuevamente.');
  }
});

function cerrarModal() {
  window.location.href = "alumno.html";
}

function mostrarModal() {
  document.getElementById('overlay').classList.remove('oculto');
  document.getElementById('modal-reservacion-confirmada').classList.remove('oculto');
}
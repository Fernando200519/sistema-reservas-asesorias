import { reservarAsesoria } from "../../database/queries.js";

document.addEventListener('DOMContentLoaded', () => {
  const spanTema = document.querySelector('.cuadro-datos-izquierda p:nth-child(1) span');
  const spanFecha = document.querySelector('.cuadro-datos-izquierda p:nth-child(2) span');
  const spanHora = document.querySelector('.cuadro-datos-izquierda p:nth-child(3) span');
  const spanAsesor = document.querySelector('.cuadro-datos-izquierda p:nth-child(4) span');
  const spanAlumno = document.querySelector('.cuadro-datos-izquierda p:nth-child(5) span');

  const tema = localStorage.getItem('temaSeleccionado');
  const fecha = localStorage.getItem('fechaSeleccionada');
  const hora = localStorage.getItem('horaSeleccionada');
  const asesor = localStorage.getItem('nombreAsesor');
  const alumno = localStorage.getItem('nombreAlumno');

  if (tema) spanTema.textContent = tema;
  if (fecha) spanFecha.textContent = fecha;
  if (hora) spanHora.textContent = hora;
  if (asesor) spanAsesor.textContent = asesor;
  if (alumno) spanAlumno.textContent = alumno;
});

document.getElementById('btn-modificar-tema').addEventListener('click', () => {
  window.history.back(); // Regresar a elegir tema
});

document.getElementById('btn-volver').addEventListener('click', () => {
  window.history.back();
});

document.getElementById('btn-confirmar').addEventListener('click', async () => {
  const idAsesoria = localStorage.getItem('idAsesoria');
  const tema = localStorage.getItem('temaSeleccionado');
  const fecha = localStorage.getItem('fechaSeleccionada');
  const hora = localStorage.getItem('horaSeleccionada');
  const matricula = localStorage.getItem('matricula');

  const datos = {
    id_asesoria: idAsesoria,
    tema: tema,
    fecha: fecha,
    hora: hora,
    matricula: matricula
  };

  try {
    const response = await reservarAsesoria(idAsesoria, tema, matricula);
    
    console.log('Respuesta de la API:', response);
    if (response.ok) {
      throw new Error('Error al confirmar la reservación');
    } 

    mostrarModal(); // Éxito

  } catch (error) {
    console.error('Error al confirmar reservación:', error);
    alert('Ocurrió un error al confirmar la reservación en confirmacion.js Intentálo de nuevo.');
  }
});

window.cerrarModal = function() {
  window.location.href = "alumno.html";
}

window.mostrarModal =  function() {
  document.getElementById('overlay').classList.remove('oculto');
  document.getElementById('modal-reservacion-confirmada').classList.remove('oculto');
}
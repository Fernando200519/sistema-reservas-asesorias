import { leerHorarios, eliminarHorario } from "../../../../../database/queries.js";

const horariosLista = document.getElementById('horarios-lista');
let horarios = await leerHorarios({"tipo": "asesor", "asesor": "JORGE"});

let idxAEliminar = null; // <-- NUEVO: para guardar el índice a eliminar

function renderHorarios() {
  horariosLista.innerHTML = '';
  const gridElement = document.querySelector('.grid');

  // Filtra dentro de la función con base en el array actualizado
  const horariosFiltrados = horarios.filter(horario => horario.estado !== "concluida");

  console.log("PEDRO Y FERNANDO: " + horarios);

  if (horariosFiltrados.length === 0) {
    horariosLista.innerHTML = `
      <div class="profesores-empty-state-card">
        <img src="../../../../../../assets/clock.png" alt="Ícono de reloj" class="empty-icon">
        <h2 class="empty-title">No hay horarios disponibles</h2>
        <p class="empty-desc">Por favor, vuelva a la sección anterior para crear un nuevo horario.</p>
      </div>
    `;

    // Cambiar display de .grid a block si no hay horarios
    if (gridElement) {
      gridElement.style.display = 'block';
      gridElement.style.padding = '30px 0px';
    }

    return;
  }

  // Si sí hay horarios, asegúrate de que .grid tenga display: grid
  if (gridElement) {
    gridElement.style.display = 'grid';
  }

  horarios.forEach((horario, idx) => {
    const estado = horario.estado || 'disponible'; // Obtiene el estado
    if (estado !== 'concluida') {
    const hora = horario.hora || horario;
    const fecha = horario.fecha ? formatearFecha(horario.fecha) : 'Sin fecha';
    
    horariosLista.innerHTML += `
      <div class="card ${estado}">
        <div class="card-info">
            <span class="hora">${hora}</span>
            <span class="fecha">${fecha}</span>
            <span class="estado">${estado}</span>
        </div>
        <button data-idx="${idx}" class="eliminar-btn btn" title="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path fill="#e53935" d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h5v2H2V6h5zm2-2v2h6V4H9zm-5 4v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8H4zm4 2h2v10H8V10zm4 0h2v10h-2V10z"/>
          </svg>
        </button>
      </div>
    `;
    }
  });

  function formatearFecha(fechaStr) {
    if (!fechaStr) return '';

    const partes = fechaStr.split('-');

    // Formato YYYY-MM-DD
    if (partes.length === 3 && partes[0].length === 4) {
      const [anio, mes, dia] = partes;
      const fecha = new Date(anio, mes - 1, dia); // ← local sin UTC

      const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return fecha.toLocaleDateString('es-MX', opciones)
        .replace(/^\w/, c => c.toUpperCase());
    }

    // Otro formato
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return fechaStr;

    return fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase());
  }
  
  // MODIFICADO: ahora solo muestra el modal y guarda el índice
  document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.onclick = (e) => {
      idxAEliminar = e.currentTarget.getAttribute('data-idx');
      document.getElementById('modal-eliminar').style.display = 'flex';
    };
  });
}

renderHorarios();

// --- MODAL LOGIC ---
document.getElementById('btn-cancelar').onclick = function() {
  document.getElementById('modal-eliminar').style.display = 'none';
  idxAEliminar = null;
};

document.getElementById('btn-confirmar').onclick = async function() {
  if (idxAEliminar !== null) {
    console.log(`Eliminando horario con ID: ${horarios[idxAEliminar].id_evento}`);
    const response = eliminarHorario(horarios[idxAEliminar].id_evento);
    horarios = await leerHorarios({"tipo": "asesor", "asesor": "JORGE"});
    renderHorarios();
  }
  document.getElementById('modal-eliminar').style.display = 'none';
  idxAEliminar = null;
};
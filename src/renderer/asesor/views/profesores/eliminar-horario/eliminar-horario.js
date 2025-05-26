const horariosLista = document.getElementById('horarios-lista');
let horarios = JSON.parse(localStorage.getItem('horariosIndex')) || [];

let idxAEliminar = null; // <-- NUEVO: para guardar el índice a eliminar

function renderHorarios() {
  horariosLista.innerHTML = '';
  const gridElement = document.querySelector('.grid');

  if (horarios.length === 0) {
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
    const estado = horario.estado || 'disponible';
    const hora = horario.hora || horario;
    horariosLista.innerHTML += `
      <div class="card ${estado}">
        <div class="card-info">
            <span class="hora">${hora}</span>
            <span class="estado">${estado}</span>
        </div>
        <button data-idx="${idx}" class="eliminar-btn btn" title="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path fill="#e53935" d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h5v2H2V6h5zm2-2v2h6V4H9zm-5 4v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8H4zm4 2h2v10H8V10zm4 0h2v10h-2V10z"/>
        </svg>
        </button>
    </div>
    `;
  });

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

document.getElementById('btn-confirmar').onclick = function() {
  if (idxAEliminar !== null) {
    horarios.splice(idxAEliminar, 1);
    localStorage.setItem('horariosIndex', JSON.stringify(horarios));
    renderHorarios();
  }
  document.getElementById('modal-eliminar').style.display = 'none';
  idxAEliminar = null;
};
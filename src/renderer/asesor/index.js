document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar Flatpickr
  const datePickerEl = document.getElementById('datePicker');
  if (datePickerEl) {
    const { initDatePicker } = await import('./components/datePicker.js');
    const datePickerInstance = await initDatePicker("#datePicker", true);

    console.log("Flatpickr inicializado correctamente");
  } else {
    console.error("El elemento datePicker no fue encontrado en el DOM.");
  }

  // Cargar horarios desde localStorage
  const horariosGrid = document.querySelector('.grid');
  const horarios = JSON.parse(localStorage.getItem('horariosIndex')) || [];

  // Función para mostrar el estado vacío
  function mostrarEstadoVacio() {
    horariosGrid.innerHTML = `
      <div class="profesores-empty-state">
        <img src="../../../../assets/clock.png" alt="Ícono de reloj" class="empty-icon">
        <h2>No hay horarios disponibles</h2>
        <p>Por favor, crea un nuevo horario para comenzar.</p>
      </div>
    `;
  }

  // Limpiar la cuadrícula antes de renderizar
  horariosGrid.innerHTML = '';

  if (horarios.length > 0) {
    horarios.forEach(horario => {
  const estado = horario.estado || 'disponible';
  const hora = horario.hora || horario;
  const card = document.createElement('div');
  card.classList.add('card', estado);
card.innerHTML = `
  <div class="card-content">
    <div class="hora-estado">
      <span class="hora">${hora}</span>
      <span class="estado">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
    </div>
    <div class="info-extra">
      <span class="alumno">Alumno: <em>Por asignar</em></span>
      <span class="asesor">Asesor: <em>Por asignar</em></span>
      <span class="tema">Tema: <em>Por asignar</em></span>
    </div>
  </div>
`;
  horariosGrid.appendChild(card);
});
  } else {
    mostrarEstadoVacio(); // Usar la función para mostrar el estado vacío
  }

  // Manejar el botón "Eliminar horario"
  const eliminarHorarioButton = document.getElementById('eliminarHorario');
  if (eliminarHorarioButton) {
    eliminarHorarioButton.addEventListener('click', () => {
      window.location.href = 'views/profesores/eliminar-horario/eliminar-horario.html';
    });
  }

  // Configurar el filtro de estado
  const filtroSelect = document.getElementById('filtroEstado');
  if (filtroSelect) {
    filtroSelect.addEventListener('change', function () {
      const filtro = this.value;
      const tarjetas = document.querySelectorAll('.card');

      tarjetas.forEach(tarjeta => {
        tarjeta.style.display = 'flex';
      });

      if (filtro !== 'todas') {
        tarjetas.forEach(tarjeta => {
          if (!tarjeta.classList.contains(filtro)) {
            tarjeta.style.display = 'none';
          }
        });
      }
    });
  }

  // Manejar el botón "Nuevo horario"
  const nuevoHorarioButton = document.getElementById('nuevoHorario');
  if (nuevoHorarioButton) {
    nuevoHorarioButton.addEventListener('click', () => {
      window.location.href = './views/profesores/nuevo-horario/nuevo-horario.html';
    });
  } else {
    console.error('El botón "Nuevo horario" no fue encontrado en el DOM.');
  }

  // Manejar el botón "Reiniciar horarios"
  const resetButton = document.getElementById('resetHorarios');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      localStorage.removeItem('horariosIndex'); // Eliminar los horarios guardados
      mostrarEstadoVacio(); // Usar la función para mostrar el estado vacío
      alert('Horarios reiniciados.');
    });
  } else {
    console.error('El botón "Reiniciar horarios" no fue encontrado en el DOM.');
  }



    // Mostrar/ocultar botón imprimir según filtro
  const btnImprimir = document.getElementById('btnImprimir');
  if (btnImprimir && filtroSelect) {
    function mostrarBotonImprimir() {
      btnImprimir.style.display = filtroSelect.value === 'reservada' ? 'inline-flex' : 'none';
    }
    filtroSelect.addEventListener('change', mostrarBotonImprimir);
    mostrarBotonImprimir(); // Inicializa al cargar
  }
});
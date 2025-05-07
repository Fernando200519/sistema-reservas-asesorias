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

  if (horarios.length > 0) {
    horarios.forEach(hora => {
      const card = document.createElement('div');
      card.classList.add('card', 'disponible');
      card.innerHTML = `
        <div class="card-content">
          <p>${hora}</p>
        </div>
      `;
      horariosGrid.appendChild(card);
    });
  } else {
    horariosGrid.innerHTML = '<p>No hay horarios disponibles.</p>';
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
});
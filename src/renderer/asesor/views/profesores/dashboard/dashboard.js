import { loadScheduleForDate } from '../../../global.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Configurar el botón "Nuevo horario"
  const nuevoHorarioButton = document.getElementById('nuevoHorario');
  if (nuevoHorarioButton) {
    console.log("Botón 'Nuevo horario' encontrado");
    nuevoHorarioButton.addEventListener('click', () => {
      console.log("Botón 'Nuevo horario' clickeado");
      window.location.href = '../nuevo-horario/nuevo-horario.html';
    });
  } else {
    console.error("Botón 'Nuevo horario' no encontrado");
  }

  // Inicializar Flatpickr y cargar horarios
  const datePickerEl = document.getElementById('datePicker');
  if (datePickerEl) {
    const { initDatePicker } = await import('../../../components/datePicker.js');
    const datePickerInstance = await initDatePicker("#datePicker", true);

    if (datePickerInstance) {
      console.log("Flatpickr inicializado correctamente");
      // Cargar horarios para la fecha inicial
      loadScheduleForDate(datePickerInstance.selectedDates[0] || new Date());
    } else {
      console.error("Flatpickr no se inicializó correctamente");
    }
  } else {
    console.warn("El elemento datePicker no fue encontrado en el DOM");
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
});
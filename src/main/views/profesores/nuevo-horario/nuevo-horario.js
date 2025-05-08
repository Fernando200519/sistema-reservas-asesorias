import { initDatePicker } from '../../../components/datePicker.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar el calendario
  const datePickerEl = document.getElementById('datePicker');
  if (datePickerEl) {
    try {
      await initDatePicker('#datePicker', true); // Activa el calendario y selecciona la fecha de hoy
      console.log('DatePicker inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el DatePicker:', error);
    }
  } else {
    document.body.innerHTML += `
    <div style="color:red; padding:1rem;">
      Error: No se pudo cargar el calendario. Por favor, recarga la página.
    </div>
  `;
  }

  // Lógica para la selección de horas
  const hourItems = document.querySelectorAll('.hour-selector li');

  // Lógica para el botón "Regresar"
  const regresarButton = document.getElementById('regresar');
  if (regresarButton) {
    regresarButton.addEventListener('click', () => {
      window.location.href = '../../../index.html'; // Cambia la ruta si es necesario
    });
  }
  const continuarButton = document.getElementById('continuar');

  const selectedHours = []; // Array para almacenar las horas seleccionadas

  // Permitir seleccionar múltiples horas
  hourItems.forEach(item => {
    item.addEventListener('click', () => {
      const hour = item.textContent;

      // Alternar selección
      if (item.classList.contains('selected')) {
        // Si ya está seleccionada, quítala
        item.classList.remove('selected');
        const index = selectedHours.indexOf(hour);
        if (index > -1) {
          selectedHours.splice(index, 1); // Eliminar del array
        }
      } else {
        // Si no está seleccionada, agrégala
        item.classList.add('selected');
        selectedHours.push(hour);
      }

      console.log("Horas seleccionadas:", selectedHours); // Para depuración
    });
  });

  // Acción del botón "Continuar"
  continuarButton.addEventListener('click', () => {
    if (selectedHours.length > 0) {
      const datePickerEl = document.getElementById('datePicker');
      const fechaSeleccionada = datePickerEl.textContent; // O usa el valor seleccionado del DatePicker

      // Guardar los datos en el almacenamiento local
      localStorage.setItem('fechaSeleccionada', fechaSeleccionada);
      localStorage.setItem('horariosSeleccionados', JSON.stringify(selectedHours));

      // Redirigir a la vista de confirmación
      window.location.href = '../confirmacion/confirmacion-horarios.html';
    } else {
      alert('Por favor, selecciona al menos una hora antes de continuar.');
    }
  });
});
const loadFlatpickr = async () => {
  await import('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js');
  window.flatpickr = flatpickr;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  document.head.appendChild(link);
};

// Función para navegación entre días hábiles
function getBusinessDate(currentDate, direction) {
  const step = direction === 'prev' ? -1 : 1;
  let newDate = new Date(currentDate);
  let daysSkipped = 0;

  do {
    newDate.setDate(newDate.getDate() + step);
    daysSkipped++;

    if (daysSkipped > 10) {
      console.error("Prevención de bucle infinito");
      return currentDate;
    }
  } while (newDate.getDay() === 0 || newDate.getDay() === 6); // Saltar fines de semana

  return newDate;
}

export async function initDatePicker(selector = "#datePicker", enableNavigation = true) {
  await loadFlatpickr();

  const datePickerEl = document.querySelector(selector);
  if (!datePickerEl) {
    console.error(`No se encontró el elemento con el selector: ${selector}`);
    return;
  }

  const fpInstance = window.flatpickr(selector, {
    dateFormat: "l, j F Y",
    defaultDate: new Date(),
    locale: {
      firstDayOfWeek: 1,
      months: {
        shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
      },
      weekdays: {
        shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
      }
    },
    disable: [
      function(date) {
        return (date.getDay() === 0 || date.getDay() === 6); // Deshabilitar fines de semana
      }
    ],
    onChange: function(selectedDates, dateStr, instance) {
      updateDateButtonText(dateStr);
      if (typeof loadScheduleForDate === 'function') {
        loadScheduleForDate(selectedDates[0]);
      }
    }
  });

  if (fpInstance) {
    updateDateButtonText(fpInstance.formatDate(new Date(), fpInstance.config.dateFormat));
  } else {
    updateDateButtonText("Seleccionar fecha");
  }

  // Agregar funcionalidad a las flechas de navegación
  if (enableNavigation) {
    const arrowButtons = document.querySelectorAll('.arrow');
    const prevButton = arrowButtons[0]; // Botón de flecha izquierda
    const nextButton = arrowButtons[1]; // Botón de flecha derecha

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        const currentDate = fpInstance.selectedDates[0] || new Date();
        const newDate = getBusinessDate(currentDate, 'prev');
        fpInstance.setDate(newDate, true); // Cambiar la fecha en Flatpickr
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const currentDate = fpInstance.selectedDates[0] || new Date();
        const newDate = getBusinessDate(currentDate, 'next');
        fpInstance.setDate(newDate, true); // Cambiar la fecha en Flatpickr
      });
    }
  }

  return fpInstance;
}

// Actualizar el texto del botón de fecha
function updateDateButtonText(dateStr) {
  const datePickerButton = document.querySelector('.date-picker');
  if (datePickerButton) {
    datePickerButton.textContent = dateStr;
  }
}
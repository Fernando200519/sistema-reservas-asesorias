// Carga Flatpickr como módulo global
const loadFlatpickr = async () => {
  // Método compatible con Electron
  await import('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js');
  window.flatpickr = flatpickr; // Hacerlo disponible globalmente
  
  // Carga CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  document.head.appendChild(link);
};

export async function initDatePicker() {
  await loadFlatpickr();
  
  return window.flatpickr("#datePicker", {
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
    }
  });
}
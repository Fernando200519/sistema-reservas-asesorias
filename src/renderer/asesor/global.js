// Variable global para la instancia de Flatpickr
let datePickerInstance;

// Función para cargar horarios según la fecha
export async function loadScheduleForDate(date) {
  try {
    const grid = document.querySelector('.grid');
    if (!grid) return;

    // Mostrar estado de carga
    grid.innerHTML = '<div class="loading">Cargando horarios...</div>';

    // Simulamos un retraso de red (opcional)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Datos de ejemplo que varían según el día
    const day = date.getDay(); // 0 (domingo) a 6 (sábado)
    const isWeekend = day === 0 || day === 6;

    const horarios = [
      { hora: "8:00 - 8:30", estado: "concluida" },
      { hora: "8:30 - 9:00", estado: "concluida" },
      { hora: "9:00 - 9:30", estado: "concluida" },
      { hora: "9:30 - 10:00", estado: isWeekend ? "concluida" : "reservada" },
      { hora: "10:00 - 10:30", estado: "disponible" },
      { hora: "10:30 - 11:00", estado: "disponible" },
      { hora: "11:00 - 11:30", estado: "disponible" },
      { hora: "11:30 - 12:00", estado: "disponible" },
      { hora: "12:00 - 12:30", estado: "reservada" },
      { hora: "12:30 - 13:00", estado: isWeekend ? "concluida" : "disponible" }
    ];

    // Renderizar tarjetas
    grid.innerHTML = horarios.map(h => `
      <div class="card ${h.estado}">
        <div class="card-content">
          <p>${h.hora}</p>
          <p>Estado: 
            <span class="dot ${h.estado === 'disponible' ? 'green' : 
                             h.estado === 'reservada' ? 'red' : 'gray'}"></span> 
            ${h.estado.charAt(0).toUpperCase() + h.estado.slice(1)}
          </p>
        </div>
      </div>
    `).join('');

    // Reaplicar el filtro si hay uno seleccionado
    const filtroSelect = document.getElementById('filtroEstado');
    if (filtroSelect && filtroSelect.value !== 'todas') {
      const filtro = filtroSelect.value;
      const tarjetas = document.querySelectorAll('.card');

      tarjetas.forEach(tarjeta => {
        const mostrar = tarjeta.classList.contains(filtro);
        tarjeta.style.display = mostrar ? 'flex' : 'none';
      });
    }

  } catch (error) {
    console.error("Error al cargar horarios:", error);
    document.querySelector('.grid').innerHTML = `
      <div style="color:red; padding:1rem;">
        Error al cargar los horarios. Intenta nuevamente.
      </div>
    `;
  }
}

// Inicialización global
export async function initializeApp() {
  try {
    console.log("Iniciando aplicación...");

    // Inicializar Flatpickr con navegación automática
    const datePickerEl = document.getElementById('datePicker');
    if (datePickerEl) {
      const { initDatePicker } = await import('./components/datePicker.js');
      datePickerInstance = await initDatePicker("#datePicker", true);
      console.log("Flatpickr inicializado con navegación inteligente");
    }
  } catch (error) {
    console.error("Error durante la inicialización:", error);
    document.body.innerHTML += `
      <div style="color:red;padding:1rem;">
        Error al cargar la aplicación: ${error.message}
      </div>
    `;
  }
}
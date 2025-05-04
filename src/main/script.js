export async function initializeApp() {
    try {
      console.log("Iniciando aplicación...");
      
      // 1. Inicializar Flatpickr
      const datePickerEl = document.getElementById('datePicker');
      if (datePickerEl) {
        const { initDatePicker } = await import('./datePicker.js');
        await initDatePicker();
        console.log("Flatpickr inicializado");
      }
  
      // 2. Cargar y mostrar tarjetas
      const grid = document.querySelector('.grid');
      if (!grid) throw new Error("No se encontró el elemento .grid");
      
      const horarios = [
        { hora: "8:00 - 8:30", estado: "concluida" },
        { hora: "8:30 - 9:00", estado: "concluida" },
        { hora: "9:00 - 9:30", estado: "reservada" },
        { hora: "9:30 - 10:00", estado: "reservada" },
        { hora: "10:00 - 10:30", estado: "disponible" },
        { hora: "10:30 - 11:00", estado: "disponible" }
      ];
  
      grid.innerHTML = horarios.map(h => `
        <div class="card ${h.estado}">
          <p>${h.hora}</p>
          <p>Estado: 
            <span class="dot ${h.estado === 'disponible' ? 'green' : 
                             h.estado === 'reservada' ? 'red' : 'gray'}"></span> 
            ${h.estado.charAt(0).toUpperCase() + h.estado.slice(1)}
          </p>
        </div>
      `).join('');
  
      console.log("Tarjetas renderizadas:", document.querySelectorAll('.card').length);
      
      // 3. Configurar el filtro
      const filtroSelect = document.getElementById('filtroEstado');
      if (filtroSelect) {
        filtroSelect.addEventListener('change', function() {
          const filtro = this.value;
          const tarjetas = document.querySelectorAll('.card');
          
          tarjetas.forEach(tarjeta => {
            const mostrar = filtro === 'todas' || tarjeta.classList.contains(filtro);
            tarjeta.style.display = mostrar ? 'block' : 'none';
          });
        });
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
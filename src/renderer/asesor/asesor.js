document.addEventListener('DOMContentLoaded', async () => {
  const horariosGrid = document.querySelector('.grid');
  const horarios = JSON.parse(localStorage.getItem('horariosIndex')) || [];

  const { initDatePicker } = await import('./components/datePicker.js');
  const datePickerEl = document.getElementById('datePicker');

  if (datePickerEl) {
    const datePickerInstance = await initDatePicker("#datePicker", true);

    console.log("Flatpickr inicializado correctamente");

    // Configurar cambio de fecha
    if (datePickerInstance) {
      datePickerInstance.config.onChange.push((selectedDates) => {
        const fechaSeleccionada = selectedDates[0]?.toISOString().split('T')[0];
        mostrarHorariosPorFecha(fechaSeleccionada);
      });
    }
  } else {
    console.error("El elemento datePicker no fue encontrado en el DOM.");
  }

  function mostrarEstadoVacio() {
    horariosGrid.innerHTML = `
      <div class="profesores-empty-state">
        <img src="../../../assets/clock.png" alt="Ícono de reloj" class="empty-icon">
        <h2>No hay horarios disponibles</h2>
        <p>Por favor, crea un nuevo horario para comenzar.</p>
      </div>
    `;
  }

  function mostrarHorariosPorFecha(fecha) {
    horariosGrid.innerHTML = '';
    const horariosFiltrados = horarios.filter(h => h.fecha === fecha);

    if (horariosFiltrados.length === 0) {
      mostrarEstadoVacio();
      return;
    }

    horariosFiltrados.forEach(horario => {
      const estado = horario.estado || 'disponible';
      const card = document.createElement('div');
      card.classList.add('card', estado);

      card.innerHTML = `
        <div class="card-content">
          <div class="hora-estado">
            <span class="hora">${horario.hora}</span>
            <span class="estado">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
            <span class="fecha">${horario.fecha}</span>
          </div>
          <div class="info-extra">
            <span class="tema">Tema: <em>${horario.tema || 'Por asignar'}</em></span>
          </div>
        </div>
      `;

      horariosGrid.appendChild(card);
    });
  }

  // Mostrar horarios del día actual
  const hoy = new Date().toISOString().split('T')[0];
  mostrarHorariosPorFecha(hoy);

  // Botón Eliminar horario
  const eliminarHorarioButton = document.getElementById('eliminarHorario');
  if (eliminarHorarioButton) {
    eliminarHorarioButton.addEventListener('click', () => {
      window.location.href = 'views/profesores/eliminar-horario/eliminar-horario.html';
    });
  }

  // Filtro por estado
  const filtroSelect = document.getElementById('filtroEstado');
  if (filtroSelect) {
    filtroSelect.addEventListener('change', function () {
      const filtro = this.value;
      const tarjetas = document.querySelectorAll('.card');

      tarjetas.forEach(tarjeta => {
        tarjeta.style.display = filtro === 'todas' || tarjeta.classList.contains(filtro)
          ? 'flex' : 'none';
      });

      mostrarBotonImprimir();
    });
  }

  // Botón Nuevo horario
  const nuevoHorarioButton = document.getElementById('nuevoHorario');
  if (nuevoHorarioButton) {
    nuevoHorarioButton.addEventListener('click', () => {
      window.location.href = './views/profesores/nuevo-horario/nuevo-horario.html';
    });
  } else {
    console.error('El botón "Nuevo horario" no fue encontrado en el DOM.');
  }

  // Botón Reiniciar horarios
  const resetButton = document.getElementById('resetHorarios');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      localStorage.removeItem('horariosIndex');
      mostrarEstadoVacio();
    });
  } else {
    console.error('El botón "Reiniciar horarios" no fue encontrado en el DOM.');
  }

  // Botón Imprimir
  const btnImprimir = document.getElementById('btnImprimir');
  if (btnImprimir && filtroSelect) {
    function mostrarBotonImprimir() {
      btnImprimir.style.display = filtroSelect.value === 'reservada' ? 'inline-flex' : 'none';
    }
    filtroSelect.addEventListener('change', mostrarBotonImprimir);
    mostrarBotonImprimir(); // Inicializa al cargar
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const datePicker = document.getElementById("datePicker");
    const arrowButtons = document.querySelectorAll(".calendar-controls-group .arrow");
    const filtroEstado = document.getElementById("filtroEstado");
    const btnImprimir = document.getElementById("btnImprimir");

    // Crear ícono de "tacha" para limpiar filtro
    const clearButton = document.createElement("button");
    clearButton.innerHTML = "×";
    clearButton.setAttribute("title", "Quitar filtro de fecha");
    clearButton.style.display = "none";
    clearButton.style.marginLeft = "10px";
    clearButton.style.fontSize = "20px";
    clearButton.style.cursor = "pointer";
    clearButton.style.background = "transparent";
    clearButton.style.border = "none";
    clearButton.style.color = "red";

    // Insertar la tacha junto al datePicker
    datePicker.parentNode.insertBefore(clearButton, datePicker.nextSibling);

    // Ocultar flechas inicialmente
    arrowButtons.forEach(btn => btn.style.display = "none");

    // Iniciar flatpickr sobre un input oculto
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "text";
    hiddenInput.style.display = "none";
    document.body.appendChild(hiddenInput);

    const flatpickrInstance = flatpickr("#datepicker", {
        locale: "es",
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: [date => date.getDay() === 0 || date.getDay() === 6], // Deshabilitar fines de semana
        onChange: function(selectedDates) {
            fechaActual = selectedDates[0];
            actualizarFecha(fechaActual);
        }
    });

    // Cuando se hace clic en el div visual, se abre el calendario
    datePicker.addEventListener("click", function () {
        hiddenInput._flatpickr.open();
    });

    // Quitar el filtro de fecha
    clearButton.addEventListener("click", function () {
        hiddenInput._flatpickr.clear();
        datePicker.textContent = "Selecciona una fecha para filtrar";
        arrowButtons.forEach(btn => btn.style.display = "none");
        clearButton.style.display = "none";
    });

    // Mostrar botón de imprimir si se elige "reservada"
    filtroEstado.addEventListener("change", function () {
        if (filtroEstado.value === "reservada") {
            btnImprimir.style.display = "inline-block";
        } else {
            btnImprimir.style.display = "none";
        }
    });
});
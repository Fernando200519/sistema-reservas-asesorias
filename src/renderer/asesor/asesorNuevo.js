document.addEventListener('DOMContentLoaded', function () {
  const fechaTexto = document.getElementById("fechaTexto");
  const salirFiltro = document.getElementById("salirFiltro");
  const datePickerBtn = document.getElementById("datePicker");

  let flatpickrActivo = false;

  // Activar flatpickr SOLO cuando se da clic al botón
  const picker = flatpickr(datePickerBtn, {
    locale: "es",
    dateFormat: "Y-m-d",
    allowInput: true,
    clickOpens: false, // <-- importante para que no se abra automáticamente
    onChange: function(selectedDates) {
      if (selectedDates.length > 0) {
        const fecha = selectedDates[0];
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones);
        fechaTexto.textContent = capitalizarPrimeraLetra(fechaFormateada);
        salirFiltro.style.display = "inline";
      }
    }
  });

  // Abrir flatpickr solo si se da clic al botón
  datePickerBtn.addEventListener("click", function () {
    picker.open();
  });

  // Función para capitalizar
  function capitalizarPrimeraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Función para salir del filtro de fecha
  salirFiltro.addEventListener("click", function (e) {
    e.stopPropagation(); // evitar que al dar clic se abra el calendario
    picker.clear(); // borra la selección
    fechaTexto.textContent = "";
    salirFiltro.style.display = "none";
  });

  // Mostrar u ocultar icono de impresora según estado
  const filtroEstado = document.getElementById("filtroEstado");
  const imagenImpresora = document.getElementById("imagenImpresora");

  function actualizarVisibilidadImpresora() {
    const valor = filtroEstado.value;
    imagenImpresora.style.display = valor === "reservada" ? "inline" : "none";
  }

  filtroEstado.addEventListener("change", actualizarVisibilidadImpresora);
  actualizarVisibilidadImpresora();
});



document.addEventListener('DOMContentLoaded', async () => {
  // -- Funciones auxiliares --
  const capitalizarEstado = (estado) => {
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  const mostrarEstadoVacio = () => {
    const horariosGrid = document.querySelector('.grid');
    horariosGrid.style.display = 'flex';
    horariosGrid.style.justifyContent = 'center';
    horariosGrid.style.alignItems = 'center';
    horariosGrid.innerHTML = `
      <div class="mensaje-horarios-vacios">
        <img src="../../../assets/clock.png" alt="Ícono de reloj" class="reloj-icono">
        <h2>No hay horarios disponibles</h2>
        <p>Por favor, crea un nuevo horario para comenzar.</p>
      </div>
    `;
  };

  // -- Función principal --
  const mostrarHorarios = () => {
    const horariosGrid = document.querySelector('.grid');
    const horarios = JSON.parse(localStorage.getItem('horariosIndex')) || [];

    horariosGrid.innerHTML = ''; // Limpiar cuadrícula

    if (horarios.length === 0) {
      mostrarEstadoVacio();
      return;
    }

    horarios.forEach(horario => {
      const estado = horario.estado || 'disponible';
      const hora = horario.hora || '';
      const fecha = horario.fecha || '';
      
      const card = document.createElement('div');
      card.classList.add('card', estado);

      card.innerHTML = `
        <div class="card-content">
          <div class="hora-estado">
            <span class="hora">${hora}</span>
            <span class="estado">${capitalizarEstado(estado)}</span>
          </div>
          <div class="info-extra">
            <span class="fecha">${fecha}</span>
            <span class="tema">Tema: <em>Por asignar</em></span>
          </div>
        </div>
      `;

      horariosGrid.appendChild(card);
    });
  };

  // -- Ejecución inicial --
  mostrarHorarios();
});
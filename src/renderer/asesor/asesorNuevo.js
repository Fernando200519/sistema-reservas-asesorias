document.addEventListener('DOMContentLoaded', async () => {
  // ──────────────── Elementos del DOM ────────────────
  const fechaTexto = document.getElementById("fechaTexto");
  const salirFiltro = document.getElementById("salirFiltro");
  const datePickerBtn = document.getElementById("datePicker");
  const filtroEstado = document.getElementById("filtroEstado");
  const imagenImpresora = document.getElementById("imagenImpresora");
  const horariosGrid = document.querySelector('.grid');

  // ──────────────── Variables ────────────────
  let fechaSeleccionada = null;

  // ──────────────── Funciones utilitarias ────────────────

  function formatearFechaParaComparacion(fecha) {
    return fecha.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  function capitalizarPrimeraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function capitalizarEstado(estado) {
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  function formatearFecha(fechaStr) {
    if (!fechaStr) return '';

    const partes = fechaStr.split('-');

    // Formato YYYY-MM-DD
    if (partes.length === 3 && partes[0].length === 4) {
      const [anio, mes, dia] = partes;
      const fecha = new Date(anio, mes - 1, dia); // ← local sin UTC

      const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return fecha.toLocaleDateString('es-MX', opciones)
        .replace(/^\w/, c => c.toUpperCase());
    }

    // Otro formato
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return fechaStr;

    return fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase());
  }

  function mostrarEstadoVacio() {
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
  }

  function mostrarHorarios() {
    const todosHorarios = JSON.parse(localStorage.getItem('horariosIndex')) || [];
    const estadoActual = filtroEstado.value;

    const horariosFiltrados = todosHorarios.filter(horario => {
      const coincideFecha = !fechaSeleccionada || horario.fecha === fechaSeleccionada;
      const coincideEstado = estadoActual === "todas" || horario.estado === estadoActual;
      return coincideFecha && coincideEstado;
    });

    horariosGrid.style.display = 'grid';
    horariosGrid.style.justifyContent = 'none';
    horariosGrid.style.alignItems = 'none';
    horariosGrid.innerHTML = '';

    if (horariosFiltrados.length === 0) {
      mostrarEstadoVacio();
      return;
    }

    horariosFiltrados.forEach(horario => {
      const estado = horario.estado || 'disponible';
      const hora = horario.hora;
      const fecha = formatearFecha(horario.fecha);
      const tema = horario.tema || '';

      const card = document.createElement('div');
      card.classList.add('card', estado);

      card.innerHTML = `
        <div class="card-content">
          <div class="hora-estado">
            <span class="hora">${hora}</span>
            <span class="estado">${capitalizarEstado(estado)}</span>
          </div>
          <div class="info-extra">
            <span class="tema">Tema: <em>${tema || 'Por asignar'}</em></span>
            <span class="fecha">${fecha}</span>
          </div>
        </div>
      `;

      horariosGrid.appendChild(card);
    });
  }

  // ──────────────── Configurar Flatpickr ────────────────

  const picker = flatpickr(datePickerBtn, {
    locale: "es",
    dateFormat: "Y-m-d",
    allowInput: true,
    clickOpens: false,
    disable: [date => date.getDay() === 0 || date.getDay() === 6],
    onChange: function(selectedDates) {
      if (selectedDates.length > 0) {
        const fecha = selectedDates[0];
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones);

        fechaTexto.textContent = capitalizarPrimeraLetra(fechaFormateada);
        salirFiltro.style.display = "inline";

        fechaSeleccionada = formatearFechaParaComparacion(fecha);
        mostrarHorarios();
      }
    }
  });

  // ──────────────── Eventos ────────────────

  datePickerBtn.addEventListener("click", () => picker.open());

  salirFiltro.addEventListener("click", (e) => {
    e.stopPropagation();
    picker.clear();
    fechaTexto.textContent = "";
    salirFiltro.style.display = "none";
    fechaSeleccionada = null;
    mostrarHorarios();
  });

  filtroEstado.addEventListener("change", mostrarHorarios);

  

  // ──────────────── Inicialización ────────────────
  mostrarHorarios();

  // Manejar el botón "Eliminar horario"
  const eliminarHorarioButton = document.getElementById('eliminarHorario');
  if (eliminarHorarioButton) {
    eliminarHorarioButton.addEventListener('click', () => {
      window.location.href = 'views/profesores/eliminar-horario/eliminar-horario.html';
    });
  }

  // Manejar el botón "Nuevo horario"
  const nuevoHorarioButton = document.getElementById('nuevoHorario');
  if (nuevoHorarioButton) {
    nuevoHorarioButton.addEventListener('click', () => {
      window.location.href = './views/profesores/nuevo-horario/nuevo-horario.html';
    });
  }
});
const { ipcRenderer } = require('electron');

import { leerHorarios } from '../../database/queries.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ──────────────── Elementos del DOM ────────────────
  const fechaTexto = document.getElementById("fechaTexto");
  const salirFiltro = document.getElementById("salirFiltro");
  const datePickerBtn = document.getElementById("datePicker");
  const filtroEstado = document.getElementById("filtroEstado");
  const imagenImpresora = document.getElementById("imagenImpresora");
  const horariosGrid = document.querySelector('.grid');
  const botonSalir = document.getElementById("botonSalir");

  // Elementos de la Modal
  const modalDetallesHorario = document.getElementById("modalDetallesHorario");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalFecha = document.getElementById("modalFecha");
  const modalHora = document.getElementById("modalHora");
  const modalTema = document.getElementById("modalTema");
  const modalEstado = document.getElementById("modalEstado");
  const modalAlumnosLista = document.getElementById("modalAlumnosLista");

  // Elementos del NUEVO Modal de Confirmación de Salida
  const modalConfirmarSalida = document.getElementById("modalConfirmarSalida");
  const btnConfirmarSalida = document.getElementById("btnConfirmarSalida");
  const btnCancelarSalida = document.getElementById("btnCancelarSalida");

  imagenImpresora.addEventListener('click', () => {
    imprimirReservaciones(fechaSeleccionada);
  });

  // --- Lógica para el botón de Salir y Modal de Confirmación ---
  if (botonSalir) {
    botonSalir.addEventListener('click', (event) => {
      event.preventDefault(); // Previene la navegación inmediata
      if (modalConfirmarSalida) {
        modalConfirmarSalida.classList.add('visible');
      }
    });
  }

  function cerrarModalConfirmarSalida() {
    if (modalConfirmarSalida) {
      modalConfirmarSalida.classList.remove('visible');
    }
  }

  if (btnCancelarSalida) {
    btnCancelarSalida.addEventListener('click', cerrarModalConfirmarSalida);
  }

  if (btnConfirmarSalida) {
    btnConfirmarSalida.addEventListener('click', () => {
      // Redirigir a login.html
      window.location.href = botonSalir.href; // Usa el href del botón de salir original
    });
  }

  // Opcional: Cerrar modal de confirmación al hacer clic en el overlay
  if (modalConfirmarSalida) {
    modalConfirmarSalida.addEventListener('click', (event) => {
      if (event.target === modalConfirmarSalida) {
        cerrarModalConfirmarSalida();
      }
    });
  }


  // ──────────────── Variables ────────────────
  let fechaSeleccionada = null;
  

  // ──────────────── Funciones utilitarias ────────────────

  function formatearFechaParaComparacion(fecha) {
    const d = fecha.getDate().toString().padStart(2, '0');
    const m = (fecha.getMonth() + 1).toString().padStart(2, '0'); // los meses son 0-11
    const y = fecha.getFullYear();
    return `${m}-${d}-${y}`;
  }

  function capitalizarPrimeraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function capitalizarEstado(estado) {
    console.log("[capitalizarEstado] Recibido estado:", estado);
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

  async function mostrarHorarios() {
    console.log("[mostrarHorarios] Iniciando...");
    const todosHorarios = await leerHorarios({"tipo": "asesor", "asesor": "JORGE"});
    
    console.log("[mostrarHorarios] Horarios obtenidos:", todosHorarios);
    if (!filtroEstado) {
        console.error("[mostrarHorarios] ERROR: filtroEstado es null. Asegúrate que el elemento con ID 'filtroEstado' existe.");
        return;
    }
    const estadoActual = filtroEstado.value;
    console.log("[mostrarHorarios] Estado actual del filtro:", estadoActual);

    const horariosFiltrados = todosHorarios.filter(horario => {
      const coincideFecha = !fechaSeleccionada || horario.fecha === fechaSeleccionada;

      let coincideEstado;

      if (estadoActual === "todas") {
        coincideEstado = horario.estado !== "concluida"; // excluir concluidas
      } else {
        coincideEstado = horario.estado === estadoActual;
      }

      return coincideFecha && coincideEstado;
    });

    console.log("[mostrarHorarios] Horarios filtrados:", horariosFiltrados);

    // Restaurar estilos de grid por defecto antes de verificar si está vacío
    horariosGrid.style.display = 'grid'; 
    horariosGrid.style.justifyContent = ''; 
    horariosGrid.style.alignItems = '';   
    horariosGrid.innerHTML = '';

    if (horariosFiltrados.length === 0) {
      console.log("[mostrarHorarios] No hay horarios filtrados, mostrando estado vacío.");
      mostrarEstadoVacio(); 
      return;
    }

    horariosFiltrados.forEach(horario => {
      const estado = horario.estado || 'disponible';
      const hora = horario.hora;
      const fecha = formatearFecha(horario.fecha); // Asegúrate que formatearFecha esté definida
      const tema = horario.tema || '';

      // console.log(`[mostrarHorarios] Procesando horario: Fecha=${horario.fecha}, Hora=${hora}, Estado=${estado}`);

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

      // Añadir event listener para abrir modal si es reservada, concluida o disponible
      if (estado === 'reservada' || estado === 'concluida' || estado === 'disponible') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            abrirModalDetalles(horario);
        });
      } else {
        console.log(`[mostrarHorarios] No se añade listener a tarjeta (estado no es reservada/concluida): Hora=${hora}, Estado=${estado}`);
      }

      horariosGrid.appendChild(card);
    });
    console.log("[mostrarHorarios] Finalizado.");
  }

    // Nueva función para abrir y poblar la modal
  function abrirModalDetalles(horario) {
    modalFecha.textContent = formatearFecha(horario.fecha);
    modalHora.textContent = horario.hora;
    modalTema.textContent = horario.tema || 'No asignado';
    modalEstado.textContent = capitalizarEstado(horario.estado);

    modalAlumnosLista.innerHTML = ''; 

    if (horario.alumnos) {
      console.log("[abrirModalDetalles] Alumnos:", horario.alumnos);
      const alumnos = horario.alumnos.split(',');
      alumnos.forEach(alumno => {
        const li = document.createElement('li');
        li.textContent = alumno; 
        modalAlumnosLista.appendChild(li);
      });
    } else {
      console.log("[abrirModalDetalles] No hay alumnos registrados.");
      const li = document.createElement('li');
      li.textContent = 'No hay alumnos registrados para esta asesoría.';
      modalAlumnosLista.appendChild(li);
    }

    modalDetallesHorario.classList.add('visible');
  }

  // Función para cerrar la modal
  function cerrarModalDetalles() {
    modalDetallesHorario.classList.remove('visible');
  }

  // ──────────────── Configurar Flatpickr ────────────────

  const picker = flatpickr(datePickerBtn, {
    locale: "es",
    minDate: "today",
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
        fechaTexto.style.marginLeft = "10px";
        salirFiltro.style.display = "inline";

        fechaSeleccionada = formatearFechaParaComparacion(fecha);
        console.log("[picker.onChange] Fecha seleccionada:", fechaSeleccionada);
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
    fechaTexto.style.marginLeft = "0px";
    salirFiltro.style.display = "none";
    fechaSeleccionada = null;
    mostrarHorarios();
  });

  filtroEstado.addEventListener("change", mostrarHorarios);
  
  modalCloseBtn.addEventListener('click', cerrarModalDetalles);

  // Opcional: Cerrar la modal al hacer clic en el overlay (fondo oscuro)
  modalDetallesHorario.addEventListener('click', (event) => {
    if (event.target === modalDetallesHorario) {
      cerrarModalDetalles();
    }
  });

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

// ------------------------- vista previa impresion --------------------------
  function generarVistaImpresion(fecha, horarios) {
    const filtradas = horarios.filter(r => r.fecha === fecha && r.estado === 'reservada');

    if (filtradas.length === 0) {
      return `<h2>No hay reservaciones para el día ${fecha}</h2>`;
    }

    let tablaHTML = `
      <h2>Reservaciones para el día ${fecha}</h2>
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>Horario</th>
            <th>Alumno(s)</th>
            <th>Tema</th>
          </tr>
        </thead>
        <tbody>
    `;

    filtradas.forEach(r => {
      const alumnos = r.alumnos ? r.alumnos.split(',').join(', ') : 'No registrados';
      tablaHTML += `
        <tr>
          <td>${r.hora}</td>
          <td>${alumnos}</td>
          <td>${r.tema || 'Sin tema asignado'}</td>
        </tr>
      `;
    });

    tablaHTML += `
        </tbody>
      </table>
    `;

    return tablaHTML;
  }

// ---------------------Función Imprimir ------------------------------------------------------
async function imprimirReservaciones(fechaSeleccionada) {
  if (!fechaSeleccionada) {
    alert("Primero selecciona una fecha.");
    return;
  }

  const todosHorarios = await leerHorarios({ tipo: 'asesor', asesor: 'JORGE' });
  const contenido = generarVistaImpresion(fechaSeleccionada, todosHorarios);

  const ventanaImpresion = window.open('', '_blank');
  ventanaImpresion.document.write(`
    <html>
      <head>
        <title>Imprimir Reservaciones</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        ${contenido}
      </body>
    </html>
  `);

  ventanaImpresion.document.close();
  ventanaImpresion.focus();

  setTimeout(() => {
    ventanaImpresion.print();
    ventanaImpresion.close();
  }, 500);
}

document.getElementById('boton-recargar').addEventListener('click', async () => {
  location.reload();
});
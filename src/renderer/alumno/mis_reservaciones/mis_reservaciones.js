import { obtenerMisReservaciones, cancelarReservacion as cancelarReservacionAsesoria} from "../../../database/queries.js";

// Mostrar el nivel de inglés en la interfaz 
const nivel = localStorage.getItem("nivelIngles");
const contenedorNivel = document.querySelector('.container-2-nivel');
if (contenedorNivel && nivel) {
    contenedorNivel.textContent = nivel;
}

// Función defensiva para obtener JSON del localStorage
function obtenerJSONSeguro(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (e) {
        console.error(`Error al parsear "${clave}":`, e);
        return [];
    }
}

function limpiarTextoTema(temaCompleto) {
    if (!temaCompleto || typeof temaCompleto !== 'string') return 'Tema no asignado';
    return temaCompleto.replace(/^Tema \d+:\s*/, '');
}

// Botón para regresar a la página principal
document.getElementById("button-reservar").addEventListener("click", function () {
    window.location.href = "../alumno.html";
});

function mostrarModal(id) {
    document.getElementById('overlay').classList.remove('oculto');
    document.getElementById(id).classList.remove('oculto');
}

function cerrarModal(id) {
    document.getElementById('overlay').classList.add('oculto');
    document.getElementById(id).classList.add('oculto');
}

function volverALista() {
    cerrarModal('modal-detalles');
    cerrarModal('modal-confirmacion');
}

function mantenerReservacion() {
    cerrarModal('modal-confirmacion');
    mostrarModal('modal-detalles');
}

async function cargarReservaciones() {
    const contenedor = document.querySelector('.container-3');
    const reservaciones = await obtenerMisReservaciones(localStorage.getItem("matricula"));

    contenedor.innerHTML = '';

    if (reservaciones.length === 0) {
        contenedor.style.display = 'flex';
        contenedor.style.justifyContent = 'center';
        contenedor.style.alignItems = 'center';
        contenedor.innerHTML = `
            <div class="container-3-vacio">
                <img src="../../../../assets/calendario.png">
                <p>Parece que no tienes asesorías reservadas todavía.</p>
            </div>
        `;
        return;
    }

    console.log("[cargarReservaciones] Reservaciones obtenidas:", reservaciones);
    console.log(typeof reservaciones);


    reservaciones.forEach(res => {
        const card = document.createElement('div');
        card.className = 'container-3-horario-card';

        card.innerHTML = `
            <div class="container-3-horario-info">
                <h3 class="informacion-hora">${res.hora}</h3>
                <div class="container-3-datos">
                    <div class="container-3-datos-izquierda">
                        <h3 class="tema">Tema: <span>${limpiarTextoTema(res.tema)}</span></h3>
                        <h3 class="nombre-asesor">Asesor: <span>${res.asesor}</span></h3>
                    </div>
                    <p class="fecha">Fecha: ${formatearFecha(res.fecha)}</p>
                </div>
            </div>
        `;

        if (esCancelable(res.fecha, res.hora)) { card.addEventListener('click', () => mostrarDetallesDinamico(res)) };
        contenedor.appendChild(card);
    });
}

function esCancelable(reservacion_fecha, reservacion_hora) {
    const [dia, mes, anio] = reservacion_fecha.split("-");
    const fechaISO = `${anio}-${mes}-${dia}T${reservacion_hora}:00`; // formato ISO local

    const fechaEvento = new Date(fechaISO);

    const ahora = new Date();

    const diferenciaMs = fechaEvento - ahora;
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    const puedeCancelar = diferenciaHoras >= 24;

    console.log(`¿Puede cancelar? ${puedeCancelar}`);
    return puedeCancelar;
}

function formatearFecha(fechaStr) {
  // Dividir la fecha en día, mes y año
  const partes = fechaStr.split('-');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0 a 11
  const año = parseInt(partes[2], 10);
  
  // Crear objeto Date
  const fecha = new Date(año, mes, dia);
  
  // Verificar si la fecha es válida
  if (isNaN(fecha.getTime())) {
    return "Fecha inválida";
  }
  
  // Nombres de los días y meses
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  // Obtener día de la semana, día del mes, mes y año
  const nombreDia = diasSemana[fecha.getDay()];
  const diaMes = fecha.getDate();
  const nombreMes = meses[fecha.getMonth()];
  const añoFormateado = fecha.getFullYear();
  
  // Formatear la cadena final
  return `${nombreDia}, ${diaMes} de ${nombreMes} de ${añoFormateado}`;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarReservaciones();
});

function mostrarDetallesDinamico(reservacion) {
    const modal = document.getElementById('modal-detalles');
    const nombreAlumno = localStorage.getItem("nombreAlumno") || "Alumno";

    modal.innerHTML = `
        <div class="container-titulo-detalles-reservación">
            <h1>Reservación</h1>
            <button class="btn-cerrar">×</button>
        </div>

        <div class="container-detalles-reservación-información">
            <p>Tema : <span class="cdri-informacion">${limpiarTextoTema(reservacion.tema)}</span></p>
            <p>Fecha: <span class="cdri-informacion">${formatearFecha(reservacion.fecha)}</span></p>
            <p>Hora : <span class="cdri-informacion">${reservacion.hora}</span></p>

            <div class="container-detalles-reservación-información-personas">
                <p>${reservacion.asesor}</p>
                <span>Asesor</span>
                <p>${nombreAlumno}</p>
                <span>Alumno</span>
            </div>
        </div>

        <div class="container-detalles-reservación-información-acciones">
            <button class="cdria-btn-cancelar btn-cancelar-res" data-id="${reservacion.id}">Cancelar reservación</button>
        </div>
    `;

    modal.querySelector('.btn-cerrar').addEventListener('click', volverALista);
    modal.querySelector('.btn-cancelar-res').addEventListener('click', () => mostrarConfirmacion(reservacion.id_reservacion));

    mostrarModal('modal-detalles');
}

function mostrarConfirmacion(idReservacion) {
    const modal = document.getElementById('modal-confirmacion');

    modal.innerHTML = `
        <img src="../../../../assets/advertencia.png" alt="Advertencia" id="advertencia">
        <h1 class="titulo-cancelar">Cancelar reservación</h1>
        <p class="texto-cancelar">¿Estás seguro de que deseas cancelar la reservación de asesoría? Esta acción no se puede deshacer.</p>

        <div class="botones-cancelar">
            <button class="btn-cancelar-no">No, mantener</button>
            <button class="btn-confirmar-si">Sí, cancelar</button>
        </div>
    `;

    modal.querySelector('.btn-cancelar-no').addEventListener('click', mantenerReservacion);
    modal.querySelector('.btn-confirmar-si').addEventListener('click', () => cancelarReservacion(idReservacion));

    mostrarModal('modal-confirmacion');
}

async function cancelarReservacion(idReservacion) {
    const response = await cancelarReservacionAsesoria(idReservacion);

    cerrarModal('modal-confirmacion');
    cerrarModal('modal-detalles');
    cargarReservaciones(); // recargar la lista en pantalla
}

function ordenarAsesoriasPorHora(asesorias) {
    return asesorias.sort((a, b) => {
        const horaInicioA = a.hora.split(' - ')[0].trim();
        const horaInicioB = b.hora.split(' - ')[0].trim();
        const dateA = new Date(`1970-01-01T${horaInicioA}:00`);
        const dateB = new Date(`1970-01-01T${horaInicioB}:00`);
        return dateA - dateB;
    });
}
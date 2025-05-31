// Mostrar el nivel de inglés en la interfaz 
const nivel = localStorage.getItem("nivelIngles");
const contenedorNivel = document.querySelector('.container-2-nivel');
if (contenedorNivel && nivel) {
    contenedorNivel.textContent = nivel;
}

function limpiarTextoTema(temaCompleto) {
  if (!temaCompleto || typeof temaCompleto !== 'string') return 'Tema no asignado';
  return temaCompleto.replace(/^Tema \d+:\s*/, '');
}

// Botón para regresar a la página principal
document.getElementById("button-reservar").addEventListener("click", function() {
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

function cargarReservaciones() {
    const contenedor = document.querySelector('.container-3');
    const reservaciones = JSON.parse(localStorage.getItem("misReservaciones")) || [];

    console.log("Reservaciones cargadas:", reservaciones); // <-- Aquí

    contenedor.innerHTML = '';

    if (reservaciones.length === 0) {
        document.querySelector('.container-3').style.display = 'flex';
        document.querySelector('.container-3').style.justifyContent = 'center';
        document.querySelector('.container-3').style.alignItems = 'center';
        contenedor.innerHTML = `
            <div class="container-3-vacio">
                <img src="../../../../assets/calendario.png">
                <p>Parece que no tienes asesorías reservadas todavía.</p>
            </div>
        `;
        return;
    }

    reservaciones.forEach(res => {
        const card = document.createElement('div');
        card.className = 'container-3-horario-card';
        card.onclick = () => mostrarDetallesDinamico(res);

        card.innerHTML = `
            <div class="container-3-horario-info">
                <h3 class="informacion-hora">${res.hora}</h3>
                <div class="container-3-datos">
                    <div class="container-3-datos-izquierda">
                        <h3 class="tema">Tema: <span>${limpiarTextoTema(res.tema)}</span></h3>
                        <h3 class="nombre-asesor">Asesor: <span>${res.asesor}</span></h3>
                    </div>
                    <p class="fecha">Fecha: ${res.fecha}</p>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarReservaciones();
});

function mostrarDetallesDinamico(reservacion) {
    const modal = document.getElementById('modal-detalles');
    modal.innerHTML = `
        <div class="container-titulo-detalles-reservación">
            <h1>Reservación</h1>
            <button onclick="volverALista()">×</button>
        </div>

        <div class="container-detalles-reservación-información">
            <p>Tema : <span class="cdri-informacion"> ${limpiarTextoTema(reservacion.tema)}</span></p>
            <p>Fecha: <span class="cdri-informacion">${reservacion.fecha}</span></p>
            <p>Hora : <span class="cdri-informacion">${reservacion.hora}</span></p>

            <div class="container-detalles-reservación-información-personas">
                <p>${reservacion.asesor}</p>
                <span>Asesor</span>
                <p>José Fernando Enríquez Maldonado</p>
                <span>Alumno</span>
            </div>
        </div>

        <div class="container-detalles-reservación-información-acciones">
            <button class="cdria-btn-cancelar" onclick="mostrarConfirmacion(${reservacion.id})">Cancelar reservación</button>
        </div>
    `;
    mostrarModal('modal-detalles');
}


function mostrarConfirmacion(idReservacion) {
    const modal = document.getElementById('modal-confirmacion');
    modal.innerHTML = `
        <img src="../../../../assets/advertencia.png" alt="Advertencia" id="advertencia">
        <h1 class="titulo-cancelar">Cancelar reservación</h1>
        <p class="texto-cancelar">¿Estás seguro de que deseas cancelar la reservación de asesoría? Esta acción no se puede deshacer.</p>

        <div class="botones-cancelar">
            <button class="btn-cancelar" onclick="mantenerReservacion()">No, mantener</button>
            <button class="btn-confirmar" onclick="cancelarReservacion(${idReservacion})">Sí, cancelar</button>
        </div>
    `;
    mostrarModal('modal-confirmacion');
}

function cancelarReservacion(idReservacion) {
    const temaSeleccionado = localStorage.getItem("temaSeleccionado");
    let reservaciones = JSON.parse(localStorage.getItem("misReservaciones")) || [];
    let asesoriasDisponibles = JSON.parse(localStorage.getItem("asesoriasDisponibles")) || [];

    // Buscar la asesoría cancelada
    const asesoriaCancelada = reservaciones.find(r => String(r.id) === String(idReservacion));

    // Quitarla de misReservaciones
    reservaciones = reservaciones.filter(r => String(r.id) !== String(idReservacion));
    localStorage.setItem("misReservaciones", JSON.stringify(reservaciones));

    // Volver a agregarla a las asesorías disponibles
    if (asesoriaCancelada) {
        if (!(/^Tema [1-9]|10:/.test(asesoriaCancelada.tema))) {
            asesoriaCancelada.tema = null;
        }

        // Asegurar formato correcto de fecha
        const fecha = parsearFechaPersonalizada(asesoriaCancelada.fecha);
        asesoriaCancelada.fecha = formatearFechaLocal(fecha);

        // Verificar si ya está en asesorías disponibles
        const yaExiste = asesoriasDisponibles.some(a => String(a.id) === String(asesoriaCancelada.id));
        if (!yaExiste) {
            asesoriasDisponibles.push(asesoriaCancelada);
        }

        // Ordenar y guardar
        const asesoriasOrdenadas = ordenarAsesoriasPorHora(asesoriasDisponibles);
        localStorage.setItem("asesoriasDisponibles", JSON.stringify(asesoriasOrdenadas));
    }

    // Cerrar modales y actualizar la lista
    cerrarModal('modal-confirmacion');
    cerrarModal('modal-detalles');
    cargarReservaciones(); // recargar la lista en pantalla
}

function ordenarAsesoriasPorHora(asesorias) {
    return asesorias.sort((a, b) => {
        const horaInicioA = a.hora.split(' - ')[0].trim();  // "9:00"
        const horaInicioB = b.hora.split(' - ')[0].trim();  // "10:30"
        const dateA = new Date(`1970-01-01T${horaInicioA}:00`);
        const dateB = new Date(`1970-01-01T${horaInicioB}:00`);
        return dateA - dateB;
    });
}

function formatearFechaLocal(fecha) {
    if (!(fecha instanceof Date) || isNaN(fecha)) return "Fecha inválida";
    
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`; // → "2025-05-30"
}

function parsearFechaPersonalizada(fechaStr) {
    const partes = fechaStr.split(', ')[1].split(' de ');
    const dia = parseInt(partes[0], 10);
    const mes = ["enero", "febrero", "marzo", "abril", "mayo", "junio", 
                 "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
                .indexOf(partes[1].toLowerCase());
    const año = parseInt(partes[2], 10);
    return new Date(año, mes, dia);
}
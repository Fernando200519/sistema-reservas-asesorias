// Mostrar el nivel de inglés en la interfaz 
const nivel = localStorage.getItem("nivelIngles");
const contenedorNivel = document.querySelector('.container-2-nivel');
if (contenedorNivel && nivel) {
    contenedorNivel.textContent = nivel;
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

    contenedor.innerHTML = '';

    if (reservaciones.length === 0) {
        contenedor.innerHTML = '<p>No hay asesorías disponibles por ahora.</p>';
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
                        <h3 class="tema">Tema: <span>${res.tema}</span></h3>
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
            <p>Tema : <span class="cdri-informacion"> ${reservacion.tema}</span></p>
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
    let reservaciones = JSON.parse(localStorage.getItem("misReservaciones")) || [];
    let asesoriasDisponibles = JSON.parse(localStorage.getItem("asesoriasDisponibles")) || [];

    // Buscar la asesoría cancelada
    const asesoriaCancelada = reservaciones.find(r => String(r.id) === String(idReservacion));

    // Quitarla de misReservaciones
    reservaciones = reservaciones.filter(r => String(r.id) !== String(idReservacion));
    localStorage.setItem("misReservaciones", JSON.stringify(reservaciones));

    // Volver a agregarla a las asesorías disponibles
    if (asesoriaCancelada) {
        asesoriasDisponibles.push(asesoriaCancelada);
        localStorage.setItem("asesoriasDisponibles", JSON.stringify(asesoriasDisponibles));
    }

    // Cerrar modales y actualizar la lista
    cerrarModal('modal-confirmacion');
    cerrarModal('modal-detalles');
    cargarReservaciones(); // recargar la lista en pantalla
}

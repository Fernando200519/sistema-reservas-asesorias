document.addEventListener("DOMContentLoaded", () => {
    const fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
    let asesoriasLocales = JSON.parse(localStorage.getItem("asesoriasDisponibles"));

    if (!asesoriasLocales) {
        fetch("EjemploDatos.json")
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("asesoriasDisponibles", JSON.stringify(data));
                mostrarReservaciones(data, fechaSeleccionada);
            })
            .catch(error => console.error("Error cargando datos:", error));
    } else {
        mostrarReservaciones(asesoriasLocales, fechaSeleccionada);
    }
});

// Mostrar el nivel de ingles en la interfaz 
const nivel = localStorage.getItem("nivelIngles");
const contenedorNivel = document.querySelector('.container-1-nivel');
if (contenedorNivel && nivel) {
    contenedorNivel.textContent = nivel;
}

document.getElementById("button-mis-reservaciones").addEventListener("click", function() {
    // Redirigir a la página anterior
    window.location.href = 'mis_reservaciones/mis_reservaciones.html';
});

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


// Mostrar las reservaciones de la fecha seleccionada
function mostrarReservaciones(data) {
    console.log("Contenido de data:", data);
    const contenedor = document.querySelector('.container-3');
    contenedor.innerHTML = ''; // Limpiar contenido anterior
    contenedor.style.display = 'grid';
    contenedor.style.justifyContent = '';
    contenedor.style.alignItems = '';

    const fechaSeleccionada = localStorage.getItem("fechaSeleccionada");

    const fecha = parsearFechaPersonalizada(fechaSeleccionada);
    const fechaFormateada = formatearFechaLocal(fecha);

    console.log("Fecha formateada:" + fechaFormateada);
    console.log("Todas las fechas en las reservas:", data.map(reserva => reserva.fecha));
    const asesoriasFiltradas = data.filter(reserva => reserva.fecha === fechaFormateada);

    if (asesoriasFiltradas.length === 0) {
        contenedor.style.display = 'flex';
        contenedor.style.justifyContent = 'center';
        contenedor.style.alignItems = 'center';
        contenedor.innerHTML = `
            <div class="container-3-vacio">
                <img src="../../../assets/calendario.png">
                <p>No hay asesorías disponibles para esta fecha.</p>
            </div>
        `;
        return;
    }

    const asesoriasOrdenadas = ordenarAsesoriasPorHora(asesoriasFiltradas);

    asesoriasOrdenadas.forEach(reserva => {
        const card = document.createElement('div');
        card.classList.add('container-3-horario-card');
        card.innerHTML = `
            <div class="container-3-horario-info">
                <h3 class="informacion-hora">${reserva.hora}</h3>
                <div class="container-3-datos">
                    <div class="container-3-datos-izquierda">
                        <h3 class="container-3-tema">${reserva.tema || 'Tema a elección'}</h3>
                        <p class="nombre-asesor">Asesor: <span>${reserva.asesor}</span></p>
                        <div class="cupos-container">
                            <div class="circulo"></div>
                            <div class="cupos-disponibles">Cupos disponibles: <span>${reserva.cupos}</span></div>
                        </div>
                    </div>
                    <div class="container-3-datos-derecha">
                        <button class="container-3-btn-reservar" data-id="${reserva.id}">✓ Reservar asesoría</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    document.querySelectorAll('.container-3-btn-reservar').forEach(button => {
        button.addEventListener('click', () => {
            const idAsesoria = button.getAttribute('data-id');
            reservarAsesoria(idAsesoria); // llamada a función para reservar
        });
    });
}


// Redirigir a la página de selección de tema o confirmación
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('container-3-btn-reservar')) {
        const idReserva = e.target.dataset.id;
        const card = e.target.closest('.container-3-horario-card');
        const tema = card.querySelector('.container-3-tema').textContent.trim();
        const hora = card.querySelector('.informacion-hora').textContent.trim();
        const asesor = card.querySelector('.nombre-asesor span').textContent.trim();
        const fecha = localStorage.getItem("fechaSeleccionada");

        // Guardar todos los datos en localStorage
        localStorage.setItem('idAsesoria', idReserva);
        localStorage.setItem('temaSeleccionado', tema);
        localStorage.setItem('horaSeleccionada', hora);
        localStorage.setItem('nombreAsesor', asesor);
        localStorage.setItem('fechaSeleccionada', fecha);

        if (tema === 'Tema a elección') {
            window.location.href = `temas.html?id=${idReserva}`;
        } else {
            window.location.href = `confirma_tema.html?id=${idReserva}`;
        }
    }
});

document.getElementById('button-salir').addEventListener('click', () => {
    const modal = document.getElementById('modal-salir');
    modal.innerHTML = `
        <p class="texto-cancelar">¿Estás seguro de que deseas salir del sistema de reservaciones?</p>

        <div class="botones-cancelar">
            <button class="btn-cancelar" id="button-negar">No</button>
            <button class="btn-confirmar" id="button-aceptar">Sí</button>
        </div>
    `;
    
    mostrarModal('modal-salir');

    document.getElementById("button-aceptar").addEventListener("click", function(){
        window.location.href = "../login/login.html";
    });

    document.getElementById("button-negar").addEventListener("click", function(){
        cerrarModal('modal-salir');
    });
});

function mostrarModal(id) {
    document.getElementById('overlay').classList.remove('oculto');
    document.getElementById(id).classList.remove('oculto');
}

function cerrarModal(id) {
    document.getElementById('overlay').classList.add('oculto');
    document.getElementById(id).classList.add('oculto');
}

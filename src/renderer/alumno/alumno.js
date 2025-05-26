// Mostrar el nivel de inglés en la interfaz 
const nivel = localStorage.getItem("nivelIngles");
const contenedorNivel = document.querySelector('.container-1-nivel');
if (contenedorNivel && nivel) {
    contenedorNivel.textContent = nivel;
}

// Botón "Mis reservaciones"
document.getElementById("button-mis-reservaciones").addEventListener("click", function() {
    window.location.href = 'mis_reservaciones/mis_reservaciones.html';
});

// Obtener fecha seleccionada y matrícula del alumno
const fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
const matricula = localStorage.getItem("matricula");

// Si ya hay asesorías guardadas, mostrarlas directamente
let asesoriasLocales = JSON.parse(localStorage.getItem("asesoriasDisponibles"));
if (asesoriasLocales !== null) {
    mostrarReservaciones(asesoriasLocales);
} else {
    // Solicitar asesorías al backend según fecha y nivel
    obtenerAsesoriasDisponibles();
}

async function obtenerAsesoriasDisponibles() {
    try {
        const response = await fetch('http://localhost:3000/api/asesorias_disponibles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha: fechaSeleccionada
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const asesorias = data.asesorias;
            localStorage.setItem("asesoriasDisponibles", JSON.stringify(asesorias));
            mostrarReservaciones(asesorias);
        } else {
            mostrarReservaciones([]);
        }
    } catch (error) {
        console.error('Error cargando datos desde el backend:', error);
        mostrarReservaciones([]);
    }
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



function mostrarReservaciones(data) {
    const contenedor = document.querySelector('.container-3');
    contenedor.innerHTML = '';

    if (data.length === 0) {
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

    const asesoriasOrdenadas = ordenarAsesoriasPorHora(data);

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
            reservarAsesoria(idAsesoria);
        });
    });
}

function reservarAsesoria(idReserva) {
    const card = document.querySelector(`.container-3-btn-reservar[data-id="${idReserva}"]`).closest('.container-3-horario-card');
    const tema = card.querySelector('.container-3-tema').textContent.trim();
    const hora = card.querySelector('.informacion-hora').textContent.trim();
    const asesor = card.querySelector('.nombre-asesor span').textContent.trim();

    localStorage.setItem('idAsesoria', idReserva);
    localStorage.setItem('temaSeleccionado', tema);
    localStorage.setItem('horaSeleccionada', hora);
    localStorage.setItem('nombreAsesor', asesor);

    if (tema === 'Tema a elección') {
        window.location.href = `temas.html?id=${idReserva}`;
    } else {
        window.location.href = `confirma_tema.html?id=${idReserva}`;
    }
}
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

// Leer desde archivo local JSON
let asesoriasLocales = JSON.parse(localStorage.getItem("asesoriasDisponibles"));

if (asesoriasLocales !== null) {
    mostrarReservaciones(asesoriasLocales);
} else {
    fetch('EjemploDatos.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("asesoriasDisponibles", JSON.stringify(data));
        mostrarReservaciones(data);
      })
      .catch(error => console.error('Error cargando datos:', error));
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


// Mostrar las reservaciones de la fecha seleccionada
function mostrarReservaciones(data) {
    const contenedor = document.querySelector('.container-3');
    contenedor.innerHTML = ''; // Limpiar contenido anterior

    if (data.length === 0) {
        document.querySelector('.container-3').style.display = 'flex';
        document.querySelector('.container-3').style.justifyContent = 'center';
        document.querySelector('.container-3').style.alignItems = 'center';
        contenedor.innerHTML = `
            <div class="container-3-vacio">
                <img src="../../../assets/calendario.png">
                <p>No hay asesorías disponibles para esta fecha.</p>
            </div>
        `;
        return;
    }

    // Ordenar por hora antes de mostrar
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



/*
function obtenerReservaciones(fechaSeleccionada) {
    // Aquí simulas el fetch o se lo dejas al backend
    fetch(`/api/reservaciones?fecha=${fechaSeleccionada}`)
        .then(response => response.json())
        .then(data => mostrarReservaciones(data))
        .catch(error => console.error('Error al obtener reservaciones:', error));
}
*/

/*
function reservarAsesoria(idAsesoria) {

    // Suponiendo que tienes el id del alumno y su nombre en localStorage
    // Puedes obtener el id del alumno y su nombre desde localStorage o desde donde lo tengas
    const alumnoId = localStorage.getItem("alumnoId");
    const alumnoNombre = localStorage.getItem("alumnoNombre");

    // Puedes pasar más datos si tu backend lo requiere (como id del alumno, nombre, etc.)
    fetch('/api/reservar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idAsesoria: idAsesoria, alumnoId: alumnoId, alumnoNombre: alumnoNombre })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al reservar');
        return response.json();
    })
    .then(data => {
        alert('Reservación realizada correctamente');
        // Puedes volver a obtener los horarios si quieres actualizar los cupos
        // obtenerReservaciones(fechaActualSeleccionada);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('No se pudo reservar. Intenta de nuevo.');
    });
}
*/
// Función para poner la fecha actual en formato largo en español
function ponerFechaHoy() {
    const hoy = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = hoy.toLocaleDateString('es-MX', opciones);
    const capitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    document.getElementById("fecha-seleccionada").textContent = capitalizada;
}

ponerFechaHoy(); // Llamar al cargar la página

flatpickr("#datepicker", {
    locale: "es",
    minDate: "today",
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr, instance) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = selectedDates[0].toLocaleDateString('es-MX', opciones);

        // Capitaliza la primera letra
        const fechaFinal = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

        document.getElementById("fecha-seleccionada").textContent = fechaFinal;
        obtenerReservaciones(dateStr); // Se llama al backend con la fecha en formato YYYY-MM-DD
    }
});




function mostrarReservaciones(data) {
    const contenedor = document.querySelector('.container-3');
    contenedor.innerHTML = ''; // Limpiar contenido anterior

    data.forEach(reserva => {
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
}


/*
function obtenerReservaciones(fechaSeleccionada) {
    // Aquí simulas el fetch o se lo dejas al backend
    fetch(`/api/reservaciones?fecha=${fechaSeleccionada}`)
        .then(response => response.json())
        .then(data => mostrarReservaciones(data))
        .catch(error => console.error('Error al obtener reservaciones:', error));
}
*/
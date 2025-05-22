let fechaActual = new Date(); // Fecha global que se puede modificar
const hoy = new Date(); // Fecha fija para comparar (sin hora)
hoy.setHours(0, 0, 0, 0);

const flatpickrInstance = flatpickr("#datepicker", {
    locale: "es",
    minDate: "today",
    dateFormat: "Y-m-d",
    disable: [
        date => date.getDay() === 0 || date.getDay() === 6
    ],
    onChange: function(selectedDates, dateStr, instance) {
        fechaActual = selectedDates[0];
        actualizarFecha(fechaActual);
    }
});

function actualizarBotonAnterior() {
    const btnAnterior = document.getElementById("dia-anterior");
    const fechaSinHora = new Date(fechaActual);
    fechaSinHora.setHours(0, 0, 0, 0);

    const esIgualAHoy = fechaSinHora.getTime() === hoy.getTime();
    btnAnterior.disabled = esIgualAHoy;
    btnAnterior.classList.toggle("desactivado", esIgualAHoy);
}

function actualizarFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones);
    const capitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    localStorage.setItem("fechaSeleccionada", capitalizada);

    document.getElementById("fecha-seleccionada").textContent = capitalizada;
    flatpickrInstance.setDate(fecha);
    obtenerReservaciones(formatearFechaLocal(fecha));
    actualizarBotonAnterior();
}

// Función para formatear la fecha a YYYY-MM-DD
function formatearFechaLocal(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

document.getElementById("dia-anterior").addEventListener("click", () => {
    const btnAnterior = document.getElementById("dia-anterior");
    if (btnAnterior.disabled) return;

    let nuevaFecha = new Date(fechaActual);

    while (true) {
        nuevaFecha.setDate(nuevaFecha.getDate() - 1);

        // Eliminar hora para comparación exacta
        const nuevaFechaSinHora = new Date(nuevaFecha);
        nuevaFechaSinHora.setHours(0, 0, 0, 0);

        // Si la fecha es antes de hoy, salir sin cambiar nada
        if (nuevaFechaSinHora.getTime() < hoy.getTime()) return;

        // Si no es sábado ni domingo, usarla
        const dia = nuevaFecha.getDay();
        if (dia !== 0 && dia !== 6) break;
    }

    fechaActual = nuevaFecha;
    actualizarFecha(fechaActual);
});

document.getElementById("dia-siguiente").addEventListener("click", () => {
    let nuevaFecha = new Date(fechaActual);

    do {
        nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    } while (nuevaFecha.getDay() === 0 || nuevaFecha.getDay() === 6);

    fechaActual = nuevaFecha;
    actualizarFecha(fechaActual);
});


// Mostrar la fecha actual al cargar
actualizarFecha(fechaActual);
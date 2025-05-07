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
    }
});
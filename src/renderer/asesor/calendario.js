document.addEventListener('DOMContentLoaded', function() {
    // Variables de estado
    let fechaActual = new Date();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Inicialización de Flatpickr
    const flatpickrInstance = flatpickr("#datepicker", {
        locale: "es",
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: [date => date.getDay() === 0 || date.getDay() === 6], // Deshabilitar fines de semana
        onChange: function(selectedDates) {
            fechaActual = selectedDates[0];
            actualizarFecha(fechaActual);
        }
    });
    
    // Función para actualizar la visualización
    function actualizarFecha(fecha) {
        const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones);
        const capitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
        document.getElementById("fecha-seleccionada").textContent = capitalizada;

        // Guardar en dos lugares:
        localStorage.setItem("fechaSeleccionada", capitalizada);
        console.log("Fecha guardada en localStorage:", capitalizada);
        localStorage.setItem("fechaFormatoISO", formatearFechaLocal(fecha)); // Para uso interno

        actualizarBotonAnterior();
    }
    
    // Función para actualizar el botón anterior
    function actualizarBotonAnterior() {
        const btnAnterior = document.getElementById("dia-anterior");
        const fechaSinHora = new Date(fechaActual);
        fechaSinHora.setHours(0, 0, 0, 0);
        
        btnAnterior.disabled = fechaSinHora.getTime() <= hoy.getTime();
    }
    
    // Navegación entre fechas
    function obtenerDiaAnteriorValido(fecha) {
        let nuevaFecha = new Date(fecha);
        do {
            nuevaFecha.setDate(nuevaFecha.getDate() - 1);
        } while (nuevaFecha.getDay() === 0 || nuevaFecha.getDay() === 6);
        
        return nuevaFecha;
    }
    
    function obtenerDiaSiguienteValido(fecha) {
        let nuevaFecha = new Date(fecha);
        do {
            nuevaFecha.setDate(nuevaFecha.getDate() + 1);
        } while (nuevaFecha.getDay() === 0 || nuevaFecha.getDay() === 6);
        
        return nuevaFecha;
    }
    
    // Event Listeners
    document.getElementById("dia-anterior").addEventListener("click", function() {
        if (this.disabled) return;
        
        fechaActual = obtenerDiaAnteriorValido(fechaActual);
        flatpickrInstance.setDate(fechaActual);
        actualizarFecha(fechaActual);
    });
    
    document.getElementById("dia-siguiente").addEventListener("click", function() {
        fechaActual = obtenerDiaSiguienteValido(fechaActual);
        flatpickrInstance.setDate(fechaActual);
        actualizarFecha(fechaActual);
    });
    
    // Inicialización
    actualizarFecha(fechaActual);
});



// Función para formatear la fecha a YYYY-MM-DD
function formatearFechaLocal(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}
console.log("nuevo-horario.js está ejecutándose");

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const hourItems = document.querySelectorAll('.hour-selector li');
    const continuarButton = document.getElementById('continuar'); // Corregido selector
    const selectedHours = [];
    
    // Obtener fecha del calendario (del código anterior)
    let fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
    console.log("Fecha seleccionada:", fechaSeleccionada);

    // Función para actualizar cuando cambia la fecha
    function actualizarFechaSeleccionada() {
        fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
        console.log("Fecha actualizada:", fechaSeleccionada);
    }

    // Escuchar cambios en localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === "fechaSeleccionada") {
            actualizarFechaSeleccionada();
        }
    });

    // Verificar fecha al cargar
    if (!fechaSeleccionada) {
        const fechaDefault = new Date();
        const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        fechaSeleccionada = fechaDefault.toLocaleDateString('es-MX', opciones);
        localStorage.setItem("fechaSeleccionada", fechaSeleccionada);
    }

    // Manejo de selección de horas
    hourItems.forEach(item => {
        item.addEventListener('click', () => {
            const hour = item.textContent.trim(); // Mejor usar trim() para eliminar espacios
            
            // Alternar selección
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                const index = selectedHours.indexOf(hour);
                if (index > -1) {
                    selectedHours.splice(index, 1);
                }
            } else {
                item.classList.add('selected');
                selectedHours.push(hour);
            }

            // Actualizar estado del botón
            if(continuarButton) {
                continuarButton.disabled = selectedHours.length === 0;
            }
            
            // Guardar en localStorage
            guardarSeleccion();
        });
    });

    // Función para guardar toda la selección
    function guardarSeleccion() {
        const seleccionCompleta = {
            fecha: fechaSeleccionada,
            horarios: selectedHours,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('reservaData', JSON.stringify(seleccionCompleta));
        console.log('Datos guardados:', seleccionCompleta);
    }

    // Evento para el botón Continuar
    if(continuarButton) {
        continuarButton.addEventListener('click', function() {
            guardarSeleccion();
            // Redirigir a la página de confirmación
            window.location.href = '../confirmacion/confirmacion-horarios.html';
        });
    }

    // Verificar datos guardados al cargar
    const datosGuardados = localStorage.getItem('reservaData');
    if(datosGuardados) {
        console.log('Datos recuperados:', JSON.parse(datosGuardados));
    }
});
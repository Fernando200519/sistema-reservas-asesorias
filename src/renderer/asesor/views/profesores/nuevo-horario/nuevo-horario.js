document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const hourItems = document.querySelectorAll('.hour-selector li');
    const continuarButton = document.getElementById('continuar'); // Corregido selector
    const selectedHours = [];

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
      const fechaData = JSON.parse(localStorage.getItem('fechaSeleccionada'));

      if (!fechaData || !fechaData.iso || !fechaData.bonito) {
        console.warn('No hay fecha seleccionada válida en el localStorage.');
        return;
      }

      const seleccionCompleta = {
        fecha: fechaData.iso,
        fecha_bonita: fechaData.bonito,
        horarios: selectedHours,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('reservaData', JSON.stringify(seleccionCompleta));
      console.log('Datos guardados:', seleccionCompleta);
    }

    function formatearFechaBonita(fecha) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-MX', opciones)
                    .replace(/^\w/, c => c.toUpperCase());
    }



    // Manejar el botón "Eliminar horario"
    const botonRegresar = document.getElementById('regresar');
    if (botonRegresar) {
        botonRegresar.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Evento para el botón Continuar
    const botonContinuar = document.getElementById('continuar');
    if (botonContinuar) {
        botonContinuar.addEventListener('click', () => {
            window.location.href = '../confirmacion/confirmacion-horarios.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const fechaSpan = document.getElementById("fecha-seleccionada");
  const btnAnterior = document.getElementById("dia-anterior");
  const btnSiguiente = document.getElementById("dia-siguiente");
  const datepickerDiv = document.getElementById("datepicker");

  let fechaActual = new Date();

  function formatearFecha(fecha) {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-MX', opciones)
                .replace(/^\w/, c => c.toUpperCase());
  }

  function esFinDeSemana(fecha) {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
  }

  function actualizarFechaMostrada() {
    fechaSpan.textContent = formatearFecha(fechaActual);
    picker.setDate(fechaActual, false); // actualiza flatpickr sin disparar evento

    // Guardar la fecha seleccionada en localStorage (formato ISO y bonito)
    const fechaBonita = formatearFecha(fechaActual);
    localStorage.setItem('fechaSeleccionada', JSON.stringify({
        iso: fechaActual.toISOString().split('T')[0],
        bonito: fechaBonita
    }));
  }

  function avanzarDiaValido(direccion) {
    do {
      fechaActual.setDate(fechaActual.getDate() + direccion);
    } while (esFinDeSemana(fechaActual));
    actualizarFechaMostrada();
  }

  // Flatpickr: calendario popup
  const picker = flatpickr(datepickerDiv, {
    locale: "es",
    dateFormat: "Y-m-d",
    defaultDate: fechaActual,
    disable: [
      date => esFinDeSemana(date)
    ],
    onChange: (selectedDates) => {
      if (selectedDates.length > 0) {
        fechaActual = selectedDates[0];
        actualizarFechaMostrada();
      }
    },
    clickOpens: false // Lo abriremos manualmente
  });

  // Click en la fecha → abrir calendario
  datepickerDiv.addEventListener("click", () => picker.open());

  // Navegación con flechas (saltando fines de semana)
  btnAnterior.addEventListener("click", () => avanzarDiaValido(-1));
  btnSiguiente.addEventListener("click", () => avanzarDiaValido(1));

  // Mostrar fecha actual al cargar
  actualizarFechaMostrada();
});
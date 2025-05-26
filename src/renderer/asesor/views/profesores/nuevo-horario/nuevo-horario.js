document.addEventListener('DOMContentLoaded', () => {
    // === BLOQUE 1: Selección de horas ===
    let hourItems = document.querySelectorAll('.hour-selector li');
    console.log('[INIT] Total hourItems:', hourItems.length);

    const continuarButton = document.getElementById('continuar');
    const selectedHours = [];

    if (continuarButton) {
        continuarButton.classList.add('btn-inactivo');
    }

    hourItems.forEach(item => {
        item.addEventListener('click', () => {
            const hour = item.textContent.trim();

            if (item.classList.contains('bloqueado')) return;

            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                const index = selectedHours.indexOf(hour);
                if (index > -1) selectedHours.splice(index, 1);
            } else {
                item.classList.add('selected');
                selectedHours.push(hour);
            }

            actualizarEstadoBoton();
            guardarSeleccion();
        });
    });

    function guardarSeleccion() {
        const fechaData = JSON.parse(localStorage.getItem('fechaSeleccionada'));
        if (!fechaData) return;

        const seleccionCompleta = {
            fecha: fechaData.iso,
            fecha_bonita: fechaData.bonito,
            horarios: selectedHours,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('reservaData', JSON.stringify(seleccionCompleta));
        console.log('Datos guardados:', seleccionCompleta);
    }

    function actualizarEstadoBoton() {
        if (continuarButton) {
            if (selectedHours.length > 0) {
                continuarButton.classList.remove('btn-inactivo');
            } else {
                continuarButton.classList.add('btn-inactivo');
            }
        }
    }

    const botonRegresar = document.getElementById('regresar');
    if (botonRegresar) {
        botonRegresar.addEventListener('click', () => window.history.back());
    }

    const botonContinuar = document.getElementById('continuar');
    if (botonContinuar) {
        botonContinuar.addEventListener('click', () => {
            window.location.href = '../confirmacion/confirmacion-horarios.html';
        });
    }

    // === BLOQUE 2: Manejo de fecha ===
    const fechaSpan = document.getElementById("fecha-seleccionada");
    const btnAnterior = document.getElementById("dia-anterior");
    const btnSiguiente = document.getElementById("dia-siguiente");
    const datepickerDiv = document.getElementById("datepicker");

    let fechaActual = new Date();

    function formatearFecha(fecha) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-MX', opciones).replace(/^\w/, c => c.toUpperCase());
    }

    function esFinDeSemana(fecha) {
        const dia = fecha.getDay();
        return dia === 0 || dia === 6;
    }

    function actualizarFechaMostrada() {
        const fechaBonita = formatearFecha(fechaActual);
        const fechaISO = fechaActual.toISOString().split('T')[0];

        fechaSpan.textContent = fechaBonita;
        picker.setDate(fechaActual, false);

        localStorage.setItem('fechaSeleccionada', JSON.stringify({
            iso: fechaISO,
            bonito: fechaBonita
        }));

        bloquearHorariosOcupados(fechaISO);
    }

    function avanzarDiaValido(direccion) {
        do {
            fechaActual.setDate(fechaActual.getDate() + direccion);
        } while (esFinDeSemana(fechaActual));
        actualizarFechaMostrada();
    }

    const picker = flatpickr(datepickerDiv, {
        locale: "es",
        dateFormat: "Y-m-d",
        defaultDate: fechaActual,
        disable: [date => esFinDeSemana(date)],
        onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
                fechaActual = selectedDates[0];
                actualizarFechaMostrada();
            }
        },
        clickOpens: false
    });

    datepickerDiv.addEventListener("click", () => picker.open());
    btnAnterior.addEventListener("click", () => avanzarDiaValido(-1));
    btnSiguiente.addEventListener("click", () => avanzarDiaValido(1));

    actualizarFechaMostrada();

    // === FUNCIÓN GLOBAL DE BLOQUEO, AHORA LOCAL ===
    function bloquearHorariosOcupados(fechaISO) {
        const reservas = JSON.parse(localStorage.getItem('horariosIndex')) || [];

        const reservasDeLaFecha = reservas.filter(r => r.fecha === fechaISO);

        const horariosOcupados = reservasDeLaFecha.map(r => r.hora);
        console.log('Horarios ocupados para la fecha', fechaISO, ':', horariosOcupados);

        hourItems.forEach(item => {
            const hora = item.textContent.trim();

            if (horariosOcupados.includes(hora)) {
                item.classList.add('bloqueado');
                item.classList.remove('selected');
                item.style.pointerEvents = 'none';
                item.style.opacity = '0.4';
            } else {
                item.classList.remove('bloqueado');
                item.style.pointerEvents = 'auto';
                item.style.opacity = '1';
            }
        });
    }
});
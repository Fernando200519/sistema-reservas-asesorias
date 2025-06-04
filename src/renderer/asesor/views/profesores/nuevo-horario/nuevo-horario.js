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

        const asesorActual = "JORGE" // POR QUE ASESOR ES UNA LLAVE FORANEA Y ASI SE TIENE QUEDAR(CREO)
        
        const seleccionCompleta = {
            fecha: fechaData.iso,
            fecha_bonita: fechaData.bonito,
            horarios: selectedHours,
            asesor: asesorActual,
        };

        localStorage.setItem('reservaData', JSON.stringify(seleccionCompleta));
        console.log('Datos guardados:', seleccionCompleta);
    }

    function formatearFechaYYYYMMDD(fecha) {
        const d = new Date(fecha); // esto ya es en UTC si viene de toISOString()
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
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
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Para comparación solo por fecha


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
        const yyyy = fechaActual.getFullYear();
        const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dd = String(fechaActual.getDate()).padStart(2, '0');
        const fechaISO = `${yyyy}-${mm}-${dd}`;

        fechaSpan.textContent = fechaBonita;
        picker.setDate(fechaActual, false);

        localStorage.setItem('fechaSeleccionada', JSON.stringify({
            iso: fechaISO,
            bonito: fechaBonita
        }));
        bloquearHorariosOcupados(fechaISO);
    }

    function avanzarDiaValido(direccion) {
        let nuevaFecha = new Date(fechaActual);

        do {
            nuevaFecha.setDate(nuevaFecha.getDate() + direccion);

            // Asegurar que la comparación sea solo por fecha (sin horas)
            const nuevaFechaSinHora = new Date(nuevaFecha);
            nuevaFechaSinHora.setHours(0, 0, 0, 0);

            // Si es un retroceso y la nueva fecha es menor que hoy, salir sin actualizar
            if (direccion === -1 && nuevaFechaSinHora.getTime() < hoy.getTime()) {
                return;
            }

        } while (esFinDeSemana(nuevaFecha));

        fechaActual = nuevaFecha;
        actualizarFechaMostrada();
    }


    const picker = flatpickr(datepickerDiv, {
        locale: "es",
        minDate: "today",
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

        const todayISO = new Date().toISOString().split('T')[0]; // YYYY-MM-DD de hoy
        const esHoy = fechaISO === todayISO;

        const ahora = new Date();

        document.querySelectorAll('.hour-selector li').forEach(item => {
            const horaTexto = item.textContent.trim(); // Ej. "08:00 - 08:30"
            const horaInicio = horaTexto.split(' - ')[0]; // Solo "08:00"

            const [horas, minutos] = horaInicio.split(':').map(Number);
            const horaCompleta = new Date(fechaISO + 'T' + horaInicio + ':00');

            const ocupada = horariosOcupados.includes(horaTexto);

            const pasada = esHoy && horaCompleta < ahora;

            if (ocupada || pasada) {
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
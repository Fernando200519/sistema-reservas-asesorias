import { cargarHorarios } from '../../../../../database/queries.js';

document.addEventListener('DOMContentLoaded', () => {
    const horariosGrid = document.getElementById('horariosGrid');
    const btnRegresar = document.getElementById('regresar');
    const btnConfirmar = document.getElementById('confirmar');
    const fechaElement = document.getElementById('fecha-confirmacion');

    const reservaData = JSON.parse(localStorage.getItem('reservaData'));

    if (reservaData) {
        // Mostrar fecha
        fechaElement.textContent = reservaData.fecha_bonita;

        // Mostrar horarios seleccionados
        if (reservaData.horarios && reservaData.horarios.length > 0) {
            reservaData.horarios.forEach(horario => {
                const card = document.createElement('div');
                card.classList.add('card', 'disponible');
                card.innerHTML = `
                    <div class="card-content">
                      <p>${horario}</p>
                    </div>
                `;
                horariosGrid.appendChild(card);
            });
        } else {
            horariosGrid.innerHTML = '<p>No hay horarios seleccionados</p>';
        }
    } else {
        alert('No se encontraron datos de reserva. Serás redirigido a la página anterior.');
        window.location.href = 'nuevo-horario.html';
        return;
    }

    btnRegresar.addEventListener('click', () => {
        window.history.back();
    });

    btnConfirmar.addEventListener('click', async () => {
        console.log('[DEBUG] Reserva a confirmar:', reservaData);

        const { fecha, horarios, asesor } = reservaData;

        function formatearFecha(fechaParam) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(fechaParam)) {
                const [anio, mes, dia] = fechaParam.split('-');
                return `${dia}-${mes}-${anio}`;
            }   
        }

        const horasSoloInicio = horarios.map(hora => hora.split(' - ')[0]);
        const fechaCorrecta = formatearFecha(fecha);

        console.log('[DEBUG] Enviando a API:', {horarios: horasSoloInicio, fechaCorrecta, asesor});

        try {
            const respuesta = await cargarHorarios(horasSoloInicio, fechaCorrecta, asesor);
            console.log('[DEBUG] Respuesta API:', respuesta);

            if (respuesta && respuesta.items) {
                const horariosConEstado = horasSoloInicio.map(hora => ({
                    fecha: fecha,
                    hora: hora,
                    estado: '',
                }));

                localStorage.setItem('horariosSeleccionados', JSON.stringify(horariosConEstado));
                localStorage.removeItem('reservaData');

                window.location.href = '../exito/exito-horarios.html';
            } else {
                alert('Error al guardar los horarios en la base de datos. Intenta nuevamente.');
            }

        } catch (error) {
            console.error('[ERROR] en confirmación:', error);
            alert('Ocurrió un error al confirmar los horarios. Intenta nuevamente.');
        }
    });


});
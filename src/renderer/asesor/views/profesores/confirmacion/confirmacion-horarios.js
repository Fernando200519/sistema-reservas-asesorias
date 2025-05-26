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

    btnConfirmar.addEventListener('click', () => {
        console.log('Reserva confirmada:', reservaData);

        // Guardar solo los horarios seleccionados para exito-horarios.js
        localStorage.setItem('horariosSeleccionados', JSON.stringify(reservaData));

        localStorage.removeItem('reservaData');
        window.location.href = '../exito/exito-horarios.html';
    });
});
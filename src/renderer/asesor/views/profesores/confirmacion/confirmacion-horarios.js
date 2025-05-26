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
        // No hay datos, redirigir
        alert('No se encontraron datos de reserva. Serás redirigido a la página anterior.');
        window.location.href = 'nuevo-horario.html';
        return;
    }

    // Evento para botón Regresar
    btnRegresar.addEventListener('click', () => {
        window.history.back();
    });

    // Evento para botón Confirmar
    btnConfirmar.addEventListener('click', () => {
        console.log('Reserva confirmada:', reservaData);

        alert('Reserva confirmada con éxito!');
        localStorage.removeItem('reservaData'); // Limpiar almacenamiento
        window.location.href = 'exito.html'; // Cambia a tu página de éxito
    });
});
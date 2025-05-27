document.addEventListener('DOMContentLoaded', () => {
    const botonOk = document.getElementById('ok');

    if (botonOk) {
        botonOk.addEventListener('click', () => {
            const horariosConfirmados = JSON.parse(localStorage.getItem('horariosSeleccionados')) || [];

            if (horariosConfirmados.length > 0) {
                const horariosExistentes = JSON.parse(localStorage.getItem('horariosIndex')) || [];
                
                // Añadir estado "disponible" a cada horario nuevo si no lo tiene
                const horariosConEstado = horariosConfirmados.map(horario => ({
                    ...horario,
                    estado: horario.estado || "disponible" // Si no tiene estado, se asigna "disponible"
                }));

                const nuevosHorarios = [...horariosExistentes, ...horariosConEstado];
                localStorage.setItem('horariosIndex', JSON.stringify(nuevosHorarios));
                console.log('Horarios confirmados y guardados:', nuevosHorarios);
                
                localStorage.removeItem('horariosSeleccionados');
            }

            window.location.href = '../../../asesorNuevo.html';
        });
    }
});
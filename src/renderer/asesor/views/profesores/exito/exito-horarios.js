// exito-horario.js
document.addEventListener('DOMContentLoaded', () => {
    const botonOk = document.getElementById('ok');

    if (botonOk) {
        botonOk.addEventListener('click', () => {
            const horariosConfirmados = JSON.parse(localStorage.getItem('horariosSeleccionados')) || [];

            if (horariosConfirmados.length > 0) {
                const horariosExistentes = JSON.parse(localStorage.getItem('horariosIndex')) || [];

                const horariosConEstado = horariosConfirmados.map(horario => ({
                    ...horario,
                    estado: horario.estado || "disponible"
                }));

                const nuevosHorarios = [...horariosExistentes, ...horariosConEstado];
                localStorage.setItem('horariosIndex', JSON.stringify(nuevosHorarios));
                localStorage.removeItem('horariosSeleccionados');

                window.location.href = '../../../asesorNuevo.html';
            } else {
                window.location.href = '../../../asesorNuevo.html';
            }
        });
    }
});
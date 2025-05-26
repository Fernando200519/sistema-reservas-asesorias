document.addEventListener('DOMContentLoaded', () => {
    const botonOk = document.getElementById('ok');

    if (botonOk) {
        botonOk.addEventListener('click', () => {
            const horariosConfirmados = JSON.parse(localStorage.getItem('horariosSeleccionados')) || [];

            if (horariosConfirmados.length > 0) {
                const horariosExistentes = JSON.parse(localStorage.getItem('horariosIndex')) || [];
                const nuevosHorarios = [...horariosExistentes, ...horariosConfirmados];
                localStorage.setItem('horariosIndex', JSON.stringify(nuevosHorarios));

                localStorage.removeItem('horariosSeleccionados');
            }

            window.location.href = '../../../asesorNuevo.html';
        });
    }
});
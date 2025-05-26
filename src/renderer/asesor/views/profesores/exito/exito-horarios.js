document.addEventListener('DOMContentLoaded', () => {
    const okButton = document.getElementById('ok');

    // Obtener los horarios confirmados del almacenamiento local
    const horariosConfirmados = JSON.parse(localStorage.getItem('horariosSeleccionados')) || [];

    okButton.addEventListener('click', () => {
        const horariosExistentes = JSON.parse(localStorage.getItem('horariosIndex')) || [];
        const nuevosHorarios = [...horariosExistentes, ...horariosConfirmados];
        localStorage.setItem('horariosIndex', JSON.stringify(nuevosHorarios));

        localStorage.removeItem('horariosSeleccionados');
        window.location.href = '../../../asesorNuevo.html';
    });
});
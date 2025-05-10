document.getElementById('btn-volver').addEventListener('click', () => {
    window.location.href = `alumno.html`; // Esto regresa a la pantalla anterior (la de horarios)
});

document.getElementById('btn-modificar-tema').addEventListener('click', () => {
    window.history.back(); // Esto regresa a la pantalla anterior (la de horarios)
});
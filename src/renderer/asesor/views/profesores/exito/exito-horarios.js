document.addEventListener('DOMContentLoaded', () => {
    const okButton = document.getElementById('ok');
  
    // Obtener los horarios confirmados del almacenamiento local
    const horariosConfirmados = JSON.parse(localStorage.getItem('horariosSeleccionados')) || [];
  
    // Manejar el botón "Ok"
    okButton.addEventListener('click', () => {
      // Guardar los horarios confirmados en localStorage (simulación de persistencia)
      const horariosExistentes = JSON.parse(localStorage.getItem('horariosIndex')) || [];
      const nuevosHorarios = [...horariosExistentes, ...horariosConfirmados];
      localStorage.setItem('horariosIndex', JSON.stringify(nuevosHorarios));
  
      // Redirigir a index.html
      window.location.href = '../../../index.html';
    });
  });
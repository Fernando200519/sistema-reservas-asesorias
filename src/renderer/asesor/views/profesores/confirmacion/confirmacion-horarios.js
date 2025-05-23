document.addEventListener('DOMContentLoaded', () => {
    // Obtener la fecha y las horas seleccionadas del almacenamiento local
    const fechaSeleccionada = localStorage.getItem('fechaSeleccionada');
    const horariosSeleccionados = JSON.parse(localStorage.getItem('horariosSeleccionados')) || [];
  
    // Mostrar la fecha seleccionada
    const fechaSeleccionadaEl = document.getElementById('fechaSeleccionada');
    if (fechaSeleccionada) {
      fechaSeleccionadaEl.textContent = fechaSeleccionada;
    } else {
      fechaSeleccionadaEl.textContent = 'No se seleccionó una fecha';
    }
  
    // Renderizar las tarjetas de horarios seleccionados
    const horariosGrid = document.getElementById('horariosGrid');
    if (horariosSeleccionados.length > 0) {
      horariosSeleccionados.forEach(hora => {
        const card = document.createElement('div');
        card.classList.add('card', 'disponible');
        card.innerHTML = `
          <div class="card-content">
            <p>${hora}</p>
          </div>
        `;
        horariosGrid.appendChild(card);
      });
    } else {
      horariosGrid.innerHTML = '<p>No se seleccionaron horarios.</p>';
    }
  
    // Manejar el botón "Regresar"
    const regresarButton = document.getElementById('regresar');
    if (regresarButton) {
      regresarButton.addEventListener('click', () => {
        window.location.href = '../nuevo-horario/nuevo-horario.html';
      });
    } else {
      console.error('El botón "Regresar" no fue encontrado en el DOM.');
    }
  
    // Manejar el botón "Confirmar"
    const confirmarButton = document.getElementById('confirmar'); // Definir el botón "Confirmar"
    if (confirmarButton) {
      confirmarButton.addEventListener('click', () => {
        window.location.href = '../exito/exito-horarios.html';
      });
    } else {
      console.error('El botón "Confirmar" no fue encontrado en el DOM.');
    }
  });
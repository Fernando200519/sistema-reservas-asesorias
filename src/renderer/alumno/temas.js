const temaCards = document.querySelectorAll('.tema-card');
const botonActivar1 = document.getElementById('boton-activar-1');
const botonActivar2 = document.getElementById('boton-activar-2');

temaCards.forEach(tema => {
  tema.addEventListener('click', function() {
    const temaSeleccionado = this.textContent; // Usando el texto del botón

    // Lógica para activar los botones basados en el tema seleccionado
    botonActivar1.style.backgroundColor = '#E53E3E'; // Rojo

    botonActivar2.style.backgroundColor = '#003366'; // Azul
  });
});
const temaCards = document.querySelectorAll('.tema-card');
const boton1 = document.getElementById('boton-activar-1');
const boton2 = document.getElementById('boton-activar-2');

let temaSeleccionado = null;

temaCards.forEach(card => {
  card.addEventListener('click', function () {
    if (temaSeleccionado === this) {
      this.classList.remove('tema-seleccionado');
      temaSeleccionado = null;
      resetearBotones();
    } else {
      temaCards.forEach(c => c.classList.remove('tema-seleccionado'));

      // Seleccionar nuevo tema
      this.classList.add('tema-seleccionado');
      temaSeleccionado = this;

      activarBotones();
    }
  });
});

function activarBotones() {
  boton2.classList.remove('boton-inactivo');
  boton2.classList.add('boton-activo');
  boton2.disabled = false;
}

function resetearBotones() {
  boton2.classList.remove('boton-activo');
  boton2.classList.add('boton-inactivo');
  boton2.disabled = true;
}


// Boton para regresar a la pantalla de horarios
document.getElementById('boton-activar-1').addEventListener('click', () => {
    window.history.back(); // Esto regresa a la pantalla anterior (la de horarios)
});


document.getElementById('boton-activar-2').addEventListener('click', () => {
    window.location.href = `confirmacion.html`; // Redirigir a confirmación directamente
});
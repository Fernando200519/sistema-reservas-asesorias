document.addEventListener('DOMContentLoaded', async () => {
  const nivel = localStorage.getItem('nivelIngles') || 'Inglés 1';
  const contenedorTemas = document.querySelector('.container-temas');
  const encabezadoNivel = document.querySelector('.ingles-temas h2');
  const boton2 = document.getElementById('boton-activar-2');

  let temaSeleccionado = null;

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

  try {
    const response = await fetch('temasPorNivel.json');
    const temasPorNivel = await response.json();

    const temas = temasPorNivel[nivel] || [];

    encabezadoNivel.textContent = `${nivel} - Temas`;
    contenedorTemas.innerHTML = '';
    resetearBotones();

    temas.forEach((tema, index) => {
      const boton = document.createElement('button');
      boton.className = 'tema-card';
      boton.innerHTML = `<h1>${index + 1}</h1><h3>${tema}</h3>`;

      boton.addEventListener('click', () => {
        const yaSeleccionado = boton.classList.contains('tema-seleccionado');

        // Quitar selección a todos primero
        document.querySelectorAll('.tema-card').forEach(c => c.classList.remove('tema-seleccionado'));

        if (yaSeleccionado) {
          // Si ya estaba seleccionado, deseleccionamos
          temaSeleccionado = null;
          localStorage.removeItem('temaSeleccionado');
          resetearBotones();
        } else {
          // Seleccionar nuevo
          boton.classList.add('tema-seleccionado');
          temaSeleccionado = tema;
          localStorage.setItem('temaSeleccionado', tema);
          activarBotones();
        }
      });

      contenedorTemas.appendChild(boton);
    });
  } catch (error) {
    console.error('Error al cargar los temas:', error);
  }

  // Botón "Regresar"
  document.getElementById('boton-activar-1').addEventListener('click', () => {
    window.history.back();
  });

  // Botón "Confirmar"
  document.getElementById('boton-activar-2').addEventListener('click', () => {
    if (temaSeleccionado) {
      window.location.href = `confirmacion.html`;
    }
  });
});
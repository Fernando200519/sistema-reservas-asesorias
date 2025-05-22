document.addEventListener('DOMContentLoaded', async () => {
  const nivel = localStorage.getItem('nivelIngles') || 'Inglés 1';
  const contenedorTemas = document.querySelector('.container-temas');
  const encabezadoNivel = document.querySelector('.ingles-temas h2');
  const botonConfirmar = document.getElementById('boton-activar-2');

  let temaSeleccionado = null;

  function activarBotonConfirmar() {
    botonConfirmar.classList.remove('boton-inactivo');
    botonConfirmar.classList.add('boton-activo');
    botonConfirmar.disabled = false;
  }

  function desactivarBotonConfirmar() {
    botonConfirmar.classList.remove('boton-activo');
    botonConfirmar.classList.add('boton-inactivo');
    botonConfirmar.disabled = true;
  }

  try {
    const response = await fetch('temasPorNivel.json');
    const temasPorNivel = await response.json();

    const temas = temasPorNivel[nivel] || [];

    encabezadoNivel.textContent = `${nivel} - Temas`;
    contenedorTemas.innerHTML = '';
    desactivarBotonConfirmar();

    temas.forEach((tema, index) => {
      const boton = document.createElement('button');
      boton.className = 'tema-card';
      boton.innerHTML = `<h1>${index + 1}</h1><h3>${tema}</h3>`;

      boton.addEventListener('click', () => {
        const yaSeleccionado = boton.classList.contains('tema-seleccionado');

        // Deseleccionar todos
        document.querySelectorAll('.tema-card').forEach(c => c.classList.remove('tema-seleccionado'));

        if (yaSeleccionado) {
          temaSeleccionado = null;
          localStorage.removeItem('temaSeleccionado');
          desactivarBotonConfirmar();
        } else {
          boton.classList.add('tema-seleccionado');
          temaSeleccionado = tema;
          localStorage.setItem('temaSeleccionado', tema);
          activarBotonConfirmar();
        }
      });

      contenedorTemas.appendChild(boton);
    });
  } catch (error) {
    console.error('Error al cargar los temas:', error);
    alert('No se pudieron cargar los temas. Intenta recargar la página.');
  }

  // Botón "Regresar"
  document.getElementById('boton-activar-1').addEventListener('click', () => {
    window.history.back();
  });

  // Botón "Confirmar"
  botonConfirmar.addEventListener('click', () => {
    if (temaSeleccionado) {
      window.location.href = 'confirmacion.html';
    }
  });
});
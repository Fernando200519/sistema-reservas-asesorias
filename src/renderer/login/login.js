const passwordInput = document.getElementById('contraseña');
const togglePassword = document.getElementById('toggle-password');
const form = document.querySelector('.login-form');
const mensajeError = document.getElementById('mensaje-error');

// Funcion para mostrar/ocultar la contraseña
togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.src = isPassword ? '../../../assets/mostrar.png' : '../../../assets/esconder.png';
});


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = passwordInput.value.trim();

  // Validar el formulario al enviar
  if (usuario === '' || contraseña === '') {
    mensajeError.textContent = 'Por favor, llena todos los campos.';
    mensajeError.style.display = 'block';
    return;
  }


  try {
    // Cargar el archivo JSON como si fuera una "API"
    const response = await fetch('DatosPrueba.json'); // ruta relativa a tu HTML
    const usuarios = await response.json();

    const user = usuarios.find(u => u.matricula === usuario && u.contraseña === contraseña);

    if (user) {
      if (user.tipoUsuario === 'alumno') {
        localStorage.setItem('nivelIngles', user.nivel); // Guardar el nivel de inglés en localStorage
        localStorage.setItem('nombreAlumno', user.nombre); // Guardar el nombre del alumno en localStorage
        localStorage.setItem('matricula', user.matricula); // Guardar el usuario en localStorage
        window.location.href = '../alumno/alumno.html';
      } else if (user.tipoUsuario === 'asesor') {
        localStorage.setItem('nombreAsesor', user.nombre);
        localStorage.setItem('marticula', user.matricula);
        window.location.href = '../asesor/asesorNuevo.html';
      }
    } else {
      mensajeError.textContent = 'Usuario o contraseña incorrectos.';
      mensajeError.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
    mensajeError.textContent = 'Error al cargar los datos.';
    mensajeError.style.display = 'block';
  }


  /*
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contraseña })
    });

    const result = await response.json();

    if (result.exito) {
      // Guardar el nivel y otros datos del alumno en el localStorage
      if (result.tipoUsuario === 'alumno') {
        localStorage.setItem("nivelIngles", result.nivel);
        localStorage.setItem("nombreAlumno", result.nombre);
        window.location.href = '../alumno/alumno.html';
      } else if (result.tipoUsuario === 'asesor') {
        window.location.href = '../alumno/asesor.html';
      } else {
        mensajeError.textContent = 'Tipo de usuario desconocido.';
        mensajeError.style.display = 'block';
      }
    } else {
      mensajeError.textContent = 'Usuario o contraseña incorrectos.';
      mensajeError.style.display = 'block';
    }
  } catch (error) {
    mensajeError.textContent = 'Error al conectar con el servidor.';
    mensajeError.style.display = 'block';
    console.error(error);
  }
  */

});




const passwordInput = document.getElementById('contraseña');
const togglePassword = document.getElementById('toggle-password');
const form = document.querySelector('.login-form');
const mensajeError = document.getElementById('mensaje-error');

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.src = isPassword ? '../../../assets/mostrar.png' : '../../../assets/esconder.png';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = passwordInput.value.trim();

  // Validación básica
  if (usuario === '' || contraseña === '') {
    mensajeError.textContent = 'Por favor, llena todos los campos.';
    mensajeError.style.display = 'block';
    return;
  }

  try {
    // Enviar solicitud al backend real
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        matricula: usuario,
        contrasena: contraseña
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const user = data.alumno;

      if (user.tipo_usuario === 'alumno') {
        localStorage.setItem('nivelIngles', user.nivel_ingles); // Pedro modificalo si el nombre de la variable es diferente
        localStorage.setItem('nombreAlumno', user.nombre); // Pedro modificalo si el nombre de la variable es diferente
        localStorage.setItem('matricula', usuario); // Pedro modificalo si el nombre de la variable es diferente
        window.location.href = '../alumno/alumno.html';
      } else if (user.tipo_usuario === 'asesor') {
        window.location.href = '../alumno/asesor.html';
      } else {
        mensajeError.textContent = 'Tipo de usuario desconocido.';
        mensajeError.style.display = 'block';
      }
    } else {
      mensajeError.textContent = data.error || 'Usuario o contraseña incorrectos.';
      mensajeError.style.display = 'block';
    }

  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    mensajeError.textContent = 'No se pudo conectar con el servidor.';
    mensajeError.style.display = 'block';
  }
});